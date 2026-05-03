export interface Content {
  id: string;
  type: "article" | "video";
  title: string;
  summary: string | null;
  body: Record<string, unknown> | null;
  youtube_url: string | null;
  thumbnail_url: string | null;
  pdf_url: string | null;
  pdf_filename: string | null;
  price: number;
  tags: string[];
  read_time_minutes: number | null;
  video_duration_minutes: number | null;
  pdf_page_count: number | null;
  is_published: boolean;
  like_count: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string | null;
  nickname: string | null;
  avatar_url: string | null;
  role: "user" | "admin";
  kakao_channel_agreed: boolean;
  created_at: string;
}

export interface Comment {
  id: string;
  content_id: string;
  user_id: string;
  parent_id: string | null;
  body: string;
  is_deleted: boolean;
  created_at: string;
  profiles?: { nickname: string | null; avatar_url: string | null };
}

export interface CommunityRequest {
  id: string;
  user_id: string | null;
  body: string;
  status: "pending" | "answered" | "rejected";
  admin_reply: string | null;
  created_at: string;
  updated_at: string;
  profiles?: { nickname: string | null };
}
