# 마케터 1인 지식 커머스 플랫폼 — Claude Code 프롬프트

## 프로젝트 개요

- **서비스명**: 마케터의서재
- **성격**: 현직 마케터인 내가 직접 운영하는 1인 지식 커머스 웹사이트
- **수익 모델**: 글·영상·PDF 콘텐츠 건별 유료 판매
- **타겟**: 마케팅 취준생, 주니어 마케터, 타 직군 종사자
- **운영자**: 관리자(나 혼자) — 콘텐츠 업로드·관리 백오피스와 사용자 프론트를 모두 직접 개발


---

## 디자인 시스템

### 폰트

- **Noto Sans KR** (Google Fonts) 단일 패밀리 사용
- weight: 400 (본문) / 500 (버튼, 태그, 강조) / 600 (무료 배지) / 700 (가격, 제목)

---

### 컬러 시스템

#### (1) 배경색

| 토큰 | Hex | 용도 |
|---|---|---|
| `bg-page` | `#FAFAF8` | 페이지 전체 배경 |
| `bg-section` | `#F2F0EB` | 섹션 배경, 푸터, 리스트 썸네일 |
| `bg-muted` | `#EFEDE8` | 썸네일 placeholder, 인풋 비활성 |
| `bg-white` | `#FFFFFF` | GNB, 히어로, 카드 배경 |

#### (2) 텍스트색

| 토큰 | Hex | 용도 |
|---|---|---|
| `text-primary` | `#1A1A1A` | 제목, 본문 주요 텍스트 |
| `text-secondary` | `#6B6860` | 서브 텍스트, 아웃라인 버튼 |
| `text-meta` | `#9B9890` | 날짜, 메타, placeholder, GNB 메뉴 |

#### (3) 보더색

| 토큰 | Hex | 용도 |
|---|---|---|
| `border-default` | `#E8E5DE` | 카드, 인풋, 구분선 기본 |
| `border-strong` | `#D8D5CE` | 프레임 외곽, 강조 보더 |

#### (4) 포인트 컬러 — Primary

| 토큰 | Hex | 용도 |
|---|---|---|
| `primary` | `#C4622D` | CTA 버튼, 유료 가격, 플레이 버튼, eyebrow, 이탤릭 강조, 퍼포먼스 태그 |
| `primary-light` | `#FAF0E8` | 퍼포먼스 태그 배경 |

#### (5) 포인트 컬러 — Secondary

| 토큰 | Hex | 용도 |
|---|---|---|
| `secondary` | `#2D6B4A` | 더보기 링크, 무료 배지 텍스트, IT서비스·AI마케팅 태그 |
| `secondary-light` | `#E8F4ED` | 무료 배지 배경, 초록 태그 배경 |

**Tailwind 커스텀 컬러 설정 (`tailwind.config.ts`):**
```ts
theme: {
  extend: {
    colors: {
      primary:   { DEFAULT: '#C4622D', light: '#FAF0E8' },
      secondary: { DEFAULT: '#2D6B4A', light: '#E8F4ED' },
      bg: {
        page:    '#FAFAF8',
        section: '#F2F0EB',
        muted:   '#EFEDE8',
      },
      text: {
        primary:   '#1A1A1A',
        secondary: '#6B6860',
        meta:      '#9B9890',
      },
      border: {
        default: '#E8E5DE',
        strong:  '#D8D5CE',
      },
    },
    fontFamily: {
      sans: ['Noto Sans KR', 'sans-serif'],
    },
  },
}
```

---

### 간격 시스템 (Spacing)

| px | 용도 |
|---|---|
| 4px | 태그 내부 padding, 아이콘 간격 |
| 8px | 버튼 gap, 배지 간격 |
| 12~14px | 카드 내부 padding, 리스트 gap |
| 20px | 섹션 내부 padding (좌우) |
| 28px | GNB padding, 섹션 좌우 여백 |
| 48~56px | Hero 상하 padding |

---

### Border Radius

| px | 용도 |
|---|---|
| 3px | 태그, 배지, 무료 배지 |
| 6px | 버튼, 인풋 |
| 8~10px | 카드, 리스트 썸네일 |
| 12px | 전체 프레임, 모달 |

---

### 컴포넌트 규칙

#### 버튼

| 종류 | 스펙 |
|---|---|
| Primary (CTA) | `bg #C4622D` · `text #fff` · `radius 6px` · `padding 10px 22px` · `font-weight 500` |
| Secondary (아웃라인) | `bg transparent` · `border #E8E5DE` · `text #6B6860` · `radius 6px` |
| Filled Black | `bg #1A1A1A` · `text #fff` · `radius 6px` — "시작하기", "등록하기" 등 |
| 카카오 로그인 / 카카오페이 결제 | `bg #FEE500` · `text #1A1A1A` · 카카오 공식 브랜드 가이드 준수 |

#### 카드 & 리스트

| 컴포넌트 | 스펙 |
|---|---|
| 카드 (글) | `bg #fff` · `border #E8E5DE` · `radius 10px` · 썸네일 height 76px · 비율 16:9 |
| 리스트 아이템 (영상) | 썸네일 `84×56px` · `radius 8px` · `bg #F2F0EB` · 재생 버튼 `border 1.5px #C4622D` |

#### 태그 & 배지

| 종류 | 스펙 |
|---|---|
| 태그 — 퍼포먼스 | `bg #FAF0E8` · `text #C4622D` · `font 10px / 500` · `radius 3px` |
| 태그 — IT서비스 · AI마케팅 | `bg #E8F4ED` · `text #2D6B4A` · `font 10px / 500` · `radius 3px` |
| 무료 배지 | `bg #E8F4ED` · `text #2D6B4A` · `font 10px / 600` · `radius 3px` · `padding 2px 7px` |
| 유료 가격 표시 | `text #C4622D` · `font-weight 700` · `font-size 11~12px` |

#### 커뮤니티 상태 태그

| 상태 | 배경 | 텍스트 |
|---|---|---|
| 답변완료 | `#E8F4ED` | `#2D6B4A` |
| 검토중 | `#FEF9C3` | `#92700A` |
| 답변불가 | `#FEE2E2` | `#B91C1C` |

#### 레이아웃 컴포넌트

| 컴포넌트 | 스펙 |
|---|---|
| GNB | `height 52px` · `bg #fff` · `border-bottom #E8E5DE` |
| 상단 액센트 바 | `height 3px` · `gradient #C4622D → #2D6B4A` (GNB 최상단) |
| 인풋 (기본) | `border #E8E5DE` · `radius 6px` · `padding 8px 10px` · `focus: border #1A1A1A` |
| 모달 | `radius 12px` · `bg #fff` · 외부 dimmed `rgba(0,0,0,0.4)` |
| Paywall 블러 | 상위 30% 노출 · 하위 70% `blur(4px)` · 결제 박스 오버레이 |

---

### 아이콘 & 미디어

| 항목 | 스펙 |
|---|---|
| 아이콘 라이브러리 | `lucide-react` (우선) 또는 `heroicons` |
| 아이콘 사이즈 | 16px (인라인) / 20px (버튼) / 24px (강조) |
| 썸네일 비율 | 16:9 고정 · jpg / png / webp |
| 썸네일 fallback | `bg #EFEDE8` placeholder |
| 영상 임베드 | 유튜브 일부공개 iframe · 비율 16:9 유지 |
| 플레이 버튼 (영상 썸네일) | 원형 `22px` · `border 1.5px #C4622D` · 내부 삼각 `#C4622D` |

---

## 기술 스택

| 영역 | 선택 |
|---|---|
| 프레임워크 | Next.js 14+ (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS |
| 백엔드 / DB / Auth | Supabase (PostgreSQL + Supabase Auth + RLS) |
| 스토리지 | Supabase Storage (이미지, PDF) |
| 에디터 | Tiptap v2 |
| 결제 | 카카오페이 단독 (단건 결제) |
| 배포 | Vercel |
| 소셜 로그인 | Supabase Auth — Kakao OAuth, Google OAuth |

---

## 디렉토리 구조 (권장)

```
/
├── app/
│   ├── (public)/               # 비로그인 접근 가능
│   │   ├── page.tsx            # 서비스 소개 (랜딩)
│   │   ├── contents/
│   │   │   ├── page.tsx        # 콘텐츠 목록
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx    # 콘텐츠 상세 (미리보기 + 결제 유도)
│   │   ├── community/
│   │   │   └── page.tsx        # 커뮤니티 Q&A
│   │   └── auth/
│   │       └── callback/       # OAuth 콜백
├── app/
│   ├── (protected)/            # 로그인 필요
│   │   ├── my/
│   │   │   └── page.tsx        # 구매 내역 / 내 콘텐츠
│   │   └── contents/[id]/
│   │       └── view/page.tsx   # 구매 완료 후 콘텐츠 열람
├── app/
│   ├── admin/                  # 관리자 전용 (미들웨어로 role 체크)
│   │   ├── layout.tsx
│   │   ├── page.tsx            # 대시보드
│   │   ├── contents/
│   │   │   ├── page.tsx        # 콘텐츠 목록 관리
│   │   │   ├── new/page.tsx    # 콘텐츠 작성
│   │   │   └── [id]/edit/      # 콘텐츠 수정
│   │   └── community/
│   │       └── page.tsx        # Q&A 답변 관리
├── components/
│   ├── layout/
│   │   ├── GNB.tsx
│   │   └── Footer.tsx
│   ├── content/
│   │   ├── ContentCard.tsx
│   │   ├── ContentViewer.tsx
│   │   ├── CommentSection.tsx  # 댓글 + 대댓글
│   │   └── LikeButton.tsx
│   ├── editor/
│   │   └── TiptapEditor.tsx
│   └── payment/
│       └── KakaoPayButton.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # 클라이언트용
│   │   └── server.ts           # 서버 컴포넌트용
│   └── kakao/
│       └── payments.ts
└── middleware.ts               # 인증 + 관리자 role 체크
```

---

## Supabase DB 스키마

아래 테이블을 순서대로 생성한다. RLS는 각 테이블에 반드시 활성화한다.

### profiles
```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  nickname text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin')),
  kakao_channel_agreed boolean default false,
  created_at timestamptz default now()
);
-- RLS: 본인만 수정 가능, 읽기는 authenticated
```

### contents
```sql
create table contents (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('article', 'video')),
  title text not null,
  summary text,                     -- 미리보기용 요약
  body jsonb,                       -- Tiptap JSON (article)
  youtube_url text,                 -- 유튜브 공개 URL (video)
  thumbnail_url text,               -- Supabase Storage URL
  pdf_url text,                     -- 첨부 PDF Storage URL
  pdf_filename text,
  price integer not null default 0,         -- 원(KRW), 0 = 무료
  tags text[] default '{}',                 -- 예: '{퍼포먼스,AI마케팅}'
  read_time_minutes integer,                -- 글: 예상 읽기 시간(분)
  video_duration_minutes integer,           -- 영상: 재생 시간(분)
  pdf_page_count integer,                   -- PDF: 페이지 수
  is_published boolean default false,
  like_count integer default 0,
  view_count integer default 0,             -- 조회수 (결제 무관, 상세 진입 시 +1)
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
-- RLS: 읽기는 is_published=true만 public, 쓰기는 admin만
```

### purchases
```sql
create table purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  content_id uuid references contents(id) on delete cascade,
  amount integer not null,
  payment_key text unique,           -- 카카오페이 tid (거래 고유번호)
  order_id text unique,
  status text default 'done' check (status in ('done', 'canceled', 'refunded')),
  purchased_at timestamptz default now(),
  unique(user_id, content_id)
);
-- RLS: 본인 구매 내역만 조회 가능
```

### likes
```sql
create table likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  content_id uuid references contents(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, content_id)
);
```

### comments
```sql
create table comments (
  id uuid primary key default gen_random_uuid(),
  content_id uuid references contents(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  parent_id uuid references comments(id) on delete cascade, -- null이면 최상위
  body text not null,
  is_deleted boolean default false,
  created_at timestamptz default now()
);
-- 대댓글은 parent_id가 있는 1단계만 허용 (parent_id의 parent_id는 null이어야 함)
-- RLS: 읽기 public, 쓰기 authenticated
```

### community_requests
```sql
create table community_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  -- title 없음: 와이어프레임 기준 단일 textarea 입력, body만 사용
  body text not null,
  status text default 'pending' check (status in ('pending', 'answered', 'rejected')),
  admin_reply text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
-- RLS: 읽기 authenticated (본인 것 + 전체 목록), 쓰기 본인만
```

---

## 기능별 구현 명세

### 1. 인증 (Supabase Auth)

- **카카오 OAuth**: Supabase Dashboard에서 Kakao provider 설정. 로그인 성공 후 `profiles` 테이블에 upsert.
- **카카오채널 연동**: 회원가입 완료 직후 모달로 카카오 채널 추가 동의 여부를 물어보고 `kakao_channel_agreed` 저장.
- **Google OAuth**: Supabase Dashboard에서 Google provider 설정.
- **미들웨어**: `middleware.ts`에서 `/admin/*` 경로는 `profiles.role === 'admin'`인 경우만 통과. 아니면 `/`로 redirect.
- **보호 라우트**: `/my/*`, `/contents/[id]/view/*`는 로그인 필요. 미로그인 시 로그인 페이지로 redirect.

### 2. GNB (반응형)

| 구간 | 범위 | GNB 형태 |
|---|---|---|
| MW | 0 ~ 767px | 햄버거 메뉴 (슬라이드 드로어 또는 풀다운) |
| 태블릿 | 768 ~ 1023px | 햄버거 메뉴 |
| PC | 1024px ~ | 가로 네비게이션 |

메뉴 구성:
- **서비스소개** → `/`
- **글보기** → `/contents?type=article`
- **영상보기** → `/contents?type=video`
- **커뮤니티** → `/community`
- 우측 버튼 (비로그인): "카카오 로그인" (outline) + "시작하기" (filled black) 두 버튼
- 우측 버튼 (로그인 후): "로그인됨" 단일 버튼 (filled black) → 클릭 시 내 정보/로그아웃 드롭다운

### 3. 서비스 소개 페이지 (`/`)

**히어로 섹션:**
- 상단 소형 뱃지: "AI 시대 마케터를 위한 실전 인사이트"
- 메인 헤드라인: "검색해도 나오지 않는 마케팅의 진짜 답"
- 서브카피: "퍼포먼스·콘텐츠·IT서비스 홍보 — 실무에서 바로 쓰는 글과 영상"
- CTA 버튼 2개: "콘텐츠 보기" (filled black, primary) + "서비스 소개" (outline, secondary)

**최신 글 섹션:**
- 섹션 타이틀 "최신 글" + 우측 "더보기 →" 링크 (`/contents?type=article`)
- `is_published=true`, `type='article'` 기준 `published_at DESC` 최신 3개
- 카드형 레이아웃 (썸네일 + 태그 뱃지 + 제목 + 가격)

**인기 영상 섹션:**
- 섹션 타이틀 "인기 영상" + 우측 "더보기 →" 링크 (`/contents?type=video`)
- `is_published=true`, `type='video'` 기준 `view_count DESC` 상위 3개 (결제 여부 무관)
- 카드형 레이아웃 (썸네일에 ▶ 영상 아이콘 오버레이 + 태그 뱃지 + 제목 + 가격)

**공통:**
- 정적 페이지 (SSG), SEO 메타 태그 필수
- 푸터: "© 2025 마케터의서재" (좌) / "이용약관·개인정보처리방침" (우)
- 페이지 하단 스크롤 유도 아이콘 (↓) 표시

### 4. 콘텐츠 목록 페이지 (`/contents`)

URL 쿼리: `/contents?type=article|video` (없으면 전체)

**카테고리 태그 필터 (상단 pill 형태):**
`전체` · `퍼포먼스` · `콘텐츠` · `IT서비스` · `AI마케팅` · `영상` · `자료`
- 선택된 태그는 filled black, 나머지는 outline
- 태그 클릭 시 URL 쿼리(`?tag=퍼포먼스`) 업데이트, 목록 필터링

**콘텐츠 목록 (리스트형, 카드형 아님):**
각 항목 구성 (가로 레이아웃):
- 좌측: 썸네일 (정사각형, 영상이면 ▶ 아이콘 오버레이, PDF이면 "PDF" 텍스트 표시)
- 중앙: 태그 뱃지(들) + 제목 (bold) + 메타정보 한 줄
  - 글: `2025.04.20 · 글 · 5분 읽기`
  - 영상: `2025.04.18 · 18분`
  - PDF: `2025.04.15 · PDF 3페이지`
- 우측: 가격 (bold, `990원`)
- 항목 사이 구분선 (border-bottom)

정렬 기준: `published_at DESC` (기본), 선택 태그로 `tags` 배열 필터링

### 5. 콘텐츠 상세 페이지 (`/contents/[id]`)

상세 진입 시 `view_count +1` (로그인 여부 무관, 서버에서 처리).

**헤더 영역 (미구매·구매 공통):**
- 타입+카테고리 뱃지: `■ 글 · 퍼포먼스`
- 제목 (h1)
- 메타: `2025.04.20 · 5분 읽기 · 마케터의서재`

**미구매 상태:**
- 본문 도입부 2~3문단 노출 후 나머지 블러 처리
- 블러 아래 결제 유도 박스 (배경색 구분):
  - 가격 크게 표시 (예: `990원`)
  - 안내 문구: "이 글의 전체 내용을 확인하세요 / 결제 후 즉시 열람 가능"
  - 버튼: "카카오페이로 결제" (`bg #FEE500` · `text #1A1A1A` · 전체 너비 · 카카오 공식 가이드 준수)
  - 카카오페이 JavaScript SDK 호출

**구매 완료 상태** (`/contents/[id]/view`):
- 글: Tiptap JSON 전체 렌더링
- 영상: 유튜브 iframe embed (`youtube_url`에서 video ID 추출)
- PDF: "PDF 다운로드" 버튼 → Supabase Storage signed URL (60분 만료)
- 좋아요 버튼 (토글, optimistic update)
- 댓글 / 대댓글 섹션

### 6. 댓글 시스템

- 최상위 댓글: `parent_id = null`
- 대댓글: `parent_id = 댓글 id` (1단계만, 대대댓글 없음)
- 본인 댓글 삭제 가능 (soft delete: `is_deleted = true`, "삭제된 댓글입니다" 표시)
- 관리자는 모든 댓글 삭제 가능
- 실시간 반영: Supabase Realtime 구독 or 낙관적 업데이트

### 7. 결제 (카카오페이)

**사용 API**: 카카오페이 단건 결제 REST API (서버 사이드)

**플로우:**
1. 사용자가 "카카오페이로 결제" 클릭
2. 서버(`/api/payment/ready`) → 카카오페이 `/v1/payment/ready` 호출
   - 응답으로 `tid` (거래 고유번호) + `next_redirect_pc_url` / `next_redirect_mobile_url` 수신
   - `tid`를 세션 또는 DB 임시 저장
3. 프론트에서 `next_redirect_*_url`로 리다이렉트 → 카카오페이 결제 화면
4. 결제 완료 → 카카오페이가 설정한 `approval_url`로 리다이렉트 (`pg_token` 쿼리 포함)
5. 서버(`/api/payment/approve`) → 카카오페이 `/v1/payment/approve` 호출
   - `tid` + `pg_token` 으로 최종 승인 요청
6. 승인 성공 시 `purchases` 테이블에 insert (`payment_key = tid`)
7. 콘텐츠 열람 페이지로 redirect

**Route Handler 구성:**
- `POST /api/payment/ready` — 카카오페이 결제 준비 요청, `tid` + redirect URL 반환
- `GET /api/payment/approve` — 결제 승인 처리, `purchases` insert 후 열람 페이지로 redirect
- `GET /api/payment/cancel` — 사용자가 결제 취소 시 처리
- `GET /api/payment/fail` — 결제 실패 시 처리

**환경 변수 추가:**
```env
KAKAO_PAY_SECRET_KEY=        # 카카오페이 Admin 키 (서버 전용, 절대 클라이언트 노출 금지)
KAKAO_PAY_CID=TC0ONETIME     # 단건 결제 CID (테스트: TC0ONETIME / 운영: 별도 발급)
```

무료 콘텐츠(price=0)는 결제 없이 바로 `purchases` insert 후 열람 가능.

### 8. 콘텐츠 업로드 (관리자)

**글 작성:**
- Tiptap v2 에디터 (Bold, Italic, Heading, BulletList, Image, Link 플러그인)
- 썸네일 이미지: Supabase Storage `thumbnails/` 버킷에 업로드 후 URL 저장
- 가격 설정 입력 필드
- 임시저장 / 발행 구분 (`is_published` 토글)

**영상 등록:**
- 유튜브 URL 입력 → video ID 파싱하여 미리보기 embed
- 썸네일 업로드 동일

**PDF 첨부:**
- Supabase Storage `attachments/` 버킷에 업로드
- `pdf_url`, `pdf_filename` 저장

### 9. 커뮤니티 Q&A (`/community`)

**페이지 헤더:**
- 타이틀: "궁금한 점을 남겨주세요"
- 서브: "마케팅에 대한 질문, 원하는 콘텐츠 요청 모두 환영합니다"

**질문 작성 박스 (상단 고정):**
- textarea 단일 입력 (`placeholder`: "어떤 마케팅 주제가 궁금하신가요? 자유롭게 남겨주세요.")
- 좌측 하단: "로그인 후 작성 가능" 안내 텍스트
- 우측 하단: "등록하기" 버튼 (filled black)
- 비로그인 상태에서 등록하기 클릭 시 → 로그인 유도

**질문 목록 (작성 박스 아래):**
각 항목 구성:
- 상태 태그 (인라인): `답변완료` (green outline) / `검토중` (yellow outline) / `답변불가` (red outline)
- 질문 내용 (bold)
- 하단: 작성자 닉네임 · 날짜 (`홍길동 · 2025.04.19`)
- 항목 사이 구분선

`community_requests` 테이블의 `body` 필드를 질문 내용으로 사용 (제목 필드 없음).
`title` 컬럼은 `body` 앞 30자 자동 생성하거나 제거 — 와이어프레임 기준 단일 텍스트 입력이므로 `title` 컬럼 불필요, 스키마에서 제거.

**관리자:**
- `/admin/community`에서 질문 목록 관리
- 답변 작성 → `admin_reply` 저장 + `status` 변경

### 10. 반응형 레이아웃

**mobile-first** 기준으로 작성한다. Tailwind 커스텀 breakpoint를 `tailwind.config.ts`에 아래와 같이 정의한다.

```ts
// tailwind.config.ts
theme: {
  screens: {
    md: '768px',   // 태블릿 이상
    lg: '1024px',  // PC 이상
  }
}
```

| 구간 | 범위 | 그리드 | 최대 너비 | GNB |
|---|---|---|---|---|
| MW | 0 ~ 767px | 1단 | 100% | 햄버거 |
| 태블릿 | 768 ~ 1023px | 2단 | 100% | 햄버거 |
| PC | 1024px ~ | 3단 | 1200px (중앙 정렬) | 가로 네비게이션 |

**콘텐츠 그리드 적용 예시 (Tailwind):**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* ContentCard */}
</div>
```

**PC 최대 너비 래퍼:**
```tsx
<div className="w-full lg:max-w-[1200px] mx-auto px-4">
  {/* page content */}
</div>
```

---

## UI 레이아웃 상세 명세

### 1. 타이포그래피 스케일

| 역할 | size | weight | color | line-height |
|---|---|---|---|---|
| 페이지 메인 제목 (Hero h1) | 32px | 700 | `#1A1A1A` | 1.3 |
| 섹션 제목 (h2) | 18px | 700 | `#1A1A1A` | 1.4 |
| 콘텐츠 제목 (카드·리스트) | 14px | 600 | `#1A1A1A` | 1.5 |
| 본문 텍스트 | 14px | 400 | `#1A1A1A` | 1.7 |
| 서브 텍스트 | 13px | 400 | `#6B6860` | 1.5 |
| 메타·날짜·캡션 | 12px | 400 | `#9B9890` | 1.4 |
| 태그·배지 | 10px | 500 | (태그별 상이) | 1 |
| 유료 가격 (카드) | 12px | 700 | `#C4622D` | 1 |
| Eyebrow (Hero 상단 뱃지) | 12px | 500 | `#C4622D` | 1 |
| Hero 서브카피 | 15px | 400 | `#6B6860` | 1.6 |

---

### 2. GNB 세부 레이아웃

```
┌─────────────────────────────────────────────────────┐
│ height 3px  gradient #C4622D → #2D6B4A (액센트 바)  │  ← GNB 최상단
├─────────────────────────────────────────────────────┤
│ height 52px  bg #fff  border-bottom #E8E5DE          │
│ px 28px                                              │
│ [마케터의서재 (logo, font-weight 700, 15px)]          │
│                  [서비스소개] [글보기] [영상보기] [커뮤니티]  [카카오로그인] [시작하기] │
└─────────────────────────────────────────────────────┘
```

- **로고**: 좌측 고정, `font-weight 700`, `font-size 15px`, `color #1A1A1A`
- **메뉴**: 중앙 정렬, `font-size 14px`, `color #9B9890`, 메뉴 간 간격 `24px`
- **활성 메뉴**: `color #1A1A1A`, `font-weight 600` (언더라인 없음)
- **우측 버튼 영역**: gap `8px`
  - 비로그인: "카카오 로그인" (outline, `border #E8E5DE`, `text #6B6860`) + "시작하기" (`bg #1A1A1A`, `text #fff`)
  - 로그인 후: "로그인됨" (`bg #1A1A1A`, `text #fff`) 단일 버튼 → 클릭 시 드롭다운 (내 구매내역 / 로그아웃)
- **MW·태블릿 (<1024px)**: 로고 좌측, 햄버거 아이콘(`20px`) 우측. 메뉴·버튼 숨김
- **햄버거 열림**: 전체 너비 드로어, 메뉴 세로 나열, 배경 `#fff`

---

### 3. 페이지별 섹션 구조

#### 랜딩 페이지 (`/`)

```
[GNB]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Hero 섹션]
  bg: #ffffff
  padding: 48px 28px 56px
  텍스트 중앙 정렬
  ┌ Eyebrow 뱃지 (border #E8E5DE, radius 999px, px 12px py 4px)
  │  "AI 시대 마케터를 위한 실전 인사이트"
  ├ h1: "검색해도 나오지 않는
마케팅의 진짜 답"
  ├ 서브카피: "퍼포먼스·콘텐츠·IT서비스 홍보 — 실무에서 바로 쓰는 글과 영상"
  └ CTA 버튼 2개 (row, gap 8px, 중앙 정렬)
      "콘텐츠 보기" (bg #1A1A1A) + "서비스 소개" (outline)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[최신 글 섹션]
  bg: #ffffff
  padding: 32px 28px
  border-top: 1px solid #E8E5DE
  헤더 row: "최신 글" (h2 좌측) + "더보기 →" (우측, color #2D6B4A, 13px)
  카드 그리드: grid-cols-1 md:grid-cols-2 lg:grid-cols-3, gap 16px
  mt: 16px
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[인기 영상 섹션]
  bg: #ffffff
  padding: 32px 28px
  border-top: 1px solid #E8E5DE
  헤더 row: "인기 영상" (h2 좌측) + "더보기 →" (우측, color #2D6B4A, 13px)
  카드 그리드: grid-cols-1 md:grid-cols-2 lg:grid-cols-3, gap 16px
  mt: 16px
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[푸터]
  bg: #F2F0EB
  padding: 20px 28px
  border-top: 1px solid #E8E5DE
  row 양끝 정렬:
    좌: "© 2025 마케터의서재" (12px, #9B9890)
    중앙: ↓ 스크롤 유도 아이콘 (20px, #9B9890, border 1px #E8E5DE, circle)
    우: "이용약관 · 개인정보처리방침" (12px, #9B9890)
```

#### 콘텐츠 목록 페이지 (`/contents`)

```
[GNB]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[카테고리 필터 바]
  bg: #ffffff
  padding: 12px 28px
  border-bottom: 1px solid #E8E5DE
  pill 가로 나열, gap 8px, 스크롤 가능 (MW)
  pill 스펙:
    기본: bg #ffffff, border #E8E5DE, text #6B6860, radius 999px, px 14px py 6px, 13px
    선택: bg #1A1A1A, border #1A1A1A, text #ffffff
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[콘텐츠 리스트]
  bg: #ffffff
  padding: 0 28px
  각 아이템 border-bottom: 1px solid #E8E5DE
  아이템 padding: 16px 0
```

#### 콘텐츠 상세 페이지 (`/contents/[id]`)

```
[GNB]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[콘텐츠 헤더]
  bg: #ffffff
  padding: 24px 28px 0
  ┌ 타입+카테고리 (row, gap 6px): "■ 글 · 퍼포먼스" (12px, #9B9890)
  ├ h1 제목 (24px, 700, #1A1A1A)
  └ 메타: "2025.04.20 · 5분 읽기 · 마케터의서재" (12px, #9B9890)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[본문 (공개 영역)]
  bg: #ffffff
  padding: 24px 28px
  본문 텍스트 14px / 1.7
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Paywall 블러 영역]
  상위 30% 노출, 하위 70% CSS filter: blur(4px), pointer-events: none
  블러 영역 위에 결제 박스 오버레이 (position sticky bottom, 또는 블러 바로 아래 배치)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[결제 박스]
  bg: #F2F0EB
  border: 1px solid #E8E5DE
  border-radius: 12px
  padding: 24px 20px
  margin: 0 28px 32px
  텍스트 중앙 정렬
  ┌ 가격: "990원" (24px, 700, #1A1A1A)
  ├ 안내 문구 2줄: "이 글의 전체 내용을 확인하세요" + "결제 후 즉시 열람 가능" (13px, #6B6860)
  ├ mt 16px
  └ "카카오페이로 결제" 버튼 (bg #FEE500, text #1A1A1A, 700, 전체 너비, radius 6px, py 13px)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### 커뮤니티 페이지 (`/community`)

```
[GNB]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[페이지 헤더]
  bg: #ffffff
  padding: 24px 28px 16px
  h2: "궁금한 점을 남겨주세요" (18px, 700)
  서브: "마케팅에 대한 질문, 원하는 콘텐츠 요청 모두 환영합니다" (13px, #6B6860)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[질문 입력 박스]
  bg: #ffffff
  border: 1px solid #E8E5DE
  border-radius: 12px
  margin: 0 28px 24px
  padding: 0 (내부 요소로 제어)
  ┌ textarea
  │   padding: 16px
  │   min-height: 88px
  │   border: none (박스 자체가 border)
  │   placeholder color: #9B9890
  │   font-size: 14px
  ├ 구분선: border-top 1px solid #E8E5DE
  └ 하단 바 (padding 10px 16px, row 양끝)
      좌: "로그인 후 작성 가능" (12px, #9B9890)
      우: "등록하기" 버튼 (bg #1A1A1A, text #fff, radius 6px, px 16px py 7px, 13px)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[질문 목록]
  bg: #ffffff
  padding: 0 28px
  각 아이템:
    padding: 14px 0
    border-bottom: 1px solid #E8E5DE
    ┌ row (gap 8px): 상태 태그 + 질문 제목 (14px, 600, #1A1A1A) — 한 줄
    └ 메타: "홍길동 · 2025.04.19" (12px, #9B9890), mt 4px
```

---

### 4. 콘텐츠 카드 컴포넌트 상세 구조 (랜딩·글 섹션)

```
┌─────────────────────────────────┐  border #E8E5DE, radius 10px, bg #fff
│  [썸네일 영역]                   │  height 160px (PC) / auto 16:9
│  bg #F2F0EB (fallback #EFEDE8)  │  border-radius 10px 10px 0 0
│  영상이면 ▶ 아이콘 중앙 오버레이  │
├─────────────────────────────────┤
│ padding: 12px                   │
│ [태그 뱃지들] (row, gap 4px)    │  ← 썸네일 바로 아래
│ [제목] (14px, 600, mt 6px)      │
│ [가격] (12px, 700, #C4622D,     │  ← 카드 하단, mt 8px
│         무료면 무료 배지)        │
└─────────────────────────────────┘
```

- 태그는 썸네일 **아래** 카드 내부에 위치 (오버레이 아님)
- 가격은 카드 **하단 좌측**
- 카드 전체에 `cursor: pointer`, hover 시 `box-shadow: 0 2px 8px rgba(0,0,0,0.08)`

---

### 5. 콘텐츠 리스트 아이템 상세 구조 (콘텐츠 목록 페이지)

```
┌────────────────────────────────────────────────────────────┐
│ display: flex, align-items: center, gap: 14px, py: 16px    │
│                                                            │
│ [썸네일]          [텍스트 영역 flex-1]        [가격]       │
│  84×56px          ┌ [태그 뱃지들] row gap 4px  990원      │
│  radius 8px       ├ [제목] 14px / 600          12px / 700  │
│  bg #F2F0EB       └ [메타] 12px / #9B9890      #1A1A1A    │
│  (영상: ▶ 오버레이)  "2025.04.20 · 글 · 5분 읽기"          │
└────────────────────────────────────────────────────────────┘
```

- 태그는 제목 **위** (제목과 gap 4px)
- 가격은 우측 끝 고정 (`ml-auto` 또는 flex justify-between)
- 리스트 아이템 hover: 배경 `#FAFAF8`

---

### 6. 결제 박스 Paywall 상세

```tsx
// 구현 참고 구조
<div className="relative">
  {/* 공개 본문 */}
  <div className="content-preview">...</div>

  {/* 블러 처리 영역 */}
  <div
    className="content-blurred"
    style={{
      filter: 'blur(4px)',
      pointerEvents: 'none',
      userSelect: 'none',
      maxHeight: '120px',
      overflow: 'hidden',
    }}
  >
    {/* 본문 하단 70% */}
  </div>

  {/* 그라디언트 페이드 (블러 위에 자연스러운 전환) */}
  <div style={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '80px',
    background: 'linear-gradient(to bottom, transparent, #ffffff)',
  }} />
</div>

{/* 결제 박스 — 블러 영역 바로 아래 */}
<div className="paywall-box">...</div>
```

---

### 7. 커뮤니티 상태 태그 스펙

| 상태 | 텍스트 | bg | color | border | radius | padding |
|---|---|---|---|---|---|---|
| 답변완료 | `답변완료` | `#E8F4ED` | `#2D6B4A` | none | 3px | 2px 7px |
| 검토중 | `검토중` | `#FEF9C3` | `#92700A` | none | 3px | 2px 7px |
| 답변불가 | `답변불가` | `#FEE2E2` | `#B91C1C` | none | 3px | 2px 7px |

font-size: 11px / font-weight: 500

---

## 환경 변수 (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

KAKAO_PAY_SECRET_KEY=       # 카카오페이 Admin 키 (서버 전용)
KAKAO_PAY_CID=TC0ONETIME    # 테스트: TC0ONETIME / 운영: 별도 발급

NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## 구현 순서 (권장)

1. **프로젝트 초기 세팅** — Next.js + TypeScript + Tailwind 설치, Supabase 클라이언트 설정, 미들웨어 작성
2. **DB 스키마 생성** — 위 SQL 순서대로 실행, RLS 정책 적용
3. **인증** — 카카오·Google OAuth 연동, 카카오채널 동의 모달
4. **GNB + 레이아웃** — 반응형 공통 레이아웃
5. **콘텐츠 목록 + 상세** — 공개 페이지 (미구매 상태)
6. **결제** — 카카오페이 REST API 연동, `/api/payment/ready` · `/api/payment/approve`
7. **콘텐츠 열람** — 구매 확인 후 전체 콘텐츠 노출, 좋아요, 댓글
8. **관리자 백오피스** — Tiptap 에디터, 파일 업로드, 발행 관리
9. **커뮤니티** — Q&A 작성 + 관리자 답변
10. **SEO + 마무리** — 메타 태그, OG 이미지, Vercel 배포

---

## 주의사항 / 제약

- 대댓글은 **1단계까지만** 허용. `parent_id`가 있는 댓글에는 답글 버튼을 노출하지 않는다.
- 유튜브 영상은 **iframe embed**로만 노출. 다운로드 기능 없음.
- PDF는 **Supabase Storage signed URL** (만료 시간 설정)로 제공해 직접 링크 노출 방지.
- 결제 승인은 반드시 **서버(Route Handler)에서** 카카오페이 `/v1/payment/approve` API를 호출. 클라이언트 단 결과만 믿지 않는다.
- `KAKAO_PAY_SECRET_KEY`는 서버 전용 환경 변수. `NEXT_PUBLIC_` 접두사 절대 사용 금지.
- `tid`는 결제 준비~승인 사이 서버 세션 또는 Supabase 임시 테이블에 보관. 클라이언트에 노출하지 않는다.
- 관리자 role 체크는 **미들웨어 + 서버 컴포넌트** 양쪽에서 이중 검증.
- 이미지·PDF 업로드 시 **파일 크기 제한** (이미지 5MB, PDF 50MB)을 클라이언트에서 먼저 체크.
