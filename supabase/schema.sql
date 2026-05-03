-- ============================================================
-- 마케터의서재 DB 스키마
-- Supabase SQL Editor에서 순서대로 실행
-- ============================================================

-- RPC: view_count 증가 (로그인 무관)
create or replace function increment_view_count(content_id uuid)
returns void as $$
  update contents set view_count = view_count + 1 where id = content_id;
$$ language sql security definer;

-- RPC: like_count 증가
create or replace function increment_like_count(content_id uuid)
returns void as $$
  update contents set like_count = like_count + 1 where id = content_id;
$$ language sql security definer;

-- RPC: like_count 감소
create or replace function decrement_like_count(content_id uuid)
returns void as $$
  update contents set like_count = greatest(0, like_count - 1) where id = content_id;
$$ language sql security definer;

-- profiles
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  nickname text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin')),
  kakao_channel_agreed boolean default false,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "본인 읽기" on profiles for select using (auth.uid() = id);
create policy "본인 수정" on profiles for update using (auth.uid() = id);
create policy "본인 insert" on profiles for insert with check (auth.uid() = id);

-- auth.users 신규 가입 시 profiles 자동 생성
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, nickname, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- contents
create table contents (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('article', 'video')),
  title text not null,
  summary text,
  body jsonb,
  youtube_url text,
  thumbnail_url text,
  pdf_url text,
  pdf_filename text,
  price integer not null default 0,
  tags text[] default '{}',
  read_time_minutes integer,
  video_duration_minutes integer,
  pdf_page_count integer,
  is_published boolean default false,
  like_count integer default 0,
  view_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table contents enable row level security;
create policy "공개 콘텐츠 읽기" on contents for select using (is_published = true);
create policy "관리자 전체 읽기" on contents for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "관리자 쓰기" on contents for insert with check (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "관리자 수정" on contents for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "관리자 삭제" on contents for delete using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- purchases
create table purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  content_id uuid references contents(id) on delete cascade,
  amount integer not null,
  payment_key text unique,
  order_id text unique,
  status text default 'done' check (status in ('done', 'canceled', 'refunded')),
  purchased_at timestamptz default now(),
  unique(user_id, content_id)
);
alter table purchases enable row level security;
create policy "본인 구매 내역 읽기" on purchases for select using (auth.uid() = user_id);
create policy "서버 insert" on purchases for insert with check (auth.uid() = user_id);

-- likes
create table likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  content_id uuid references contents(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, content_id)
);
alter table likes enable row level security;
create policy "읽기 public" on likes for select using (true);
create policy "본인 insert" on likes for insert with check (auth.uid() = user_id);
create policy "본인 delete" on likes for delete using (auth.uid() = user_id);

-- comments
create table comments (
  id uuid primary key default gen_random_uuid(),
  content_id uuid references contents(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  parent_id uuid references comments(id) on delete cascade,
  body text not null,
  is_deleted boolean default false,
  created_at timestamptz default now()
);
alter table comments enable row level security;
create policy "읽기 public" on comments for select using (true);
create policy "authenticated 쓰기" on comments for insert with check (auth.uid() = user_id);
create policy "본인 수정" on comments for update using (auth.uid() = user_id);
create policy "관리자 삭제" on comments for delete using (
  auth.uid() = user_id or
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- community_requests
create table community_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  body text not null,
  status text default 'pending' check (status in ('pending', 'answered', 'rejected')),
  admin_reply text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table community_requests enable row level security;
create policy "authenticated 읽기" on community_requests for select using (auth.role() = 'authenticated');
create policy "본인 insert" on community_requests for insert with check (auth.uid() = user_id);
create policy "관리자 수정" on community_requests for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
