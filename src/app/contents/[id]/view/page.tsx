import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Content } from "@/types";
import ContentViewer from "@/components/content/ContentViewer";
import LikeButton from "@/components/content/LikeButton";
import CommentSection from "@/components/content/CommentSection";
import { Download } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ContentViewPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/contents/${id}`);
  }

  const { data: content } = await supabase
    .from("contents")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (!content) notFound();
  const c = content as Content;

  // 구매 확인 (무료는 패스)
  if (c.price > 0) {
    const { data: purchase } = await supabase
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("content_id", id)
      .single();

    if (!purchase) {
      redirect(`/contents/${id}`);
    }
  }

  // 좋아요 여부
  const { data: likeRow } = await supabase
    .from("likes")
    .select("id")
    .eq("user_id", user.id)
    .eq("content_id", id)
    .single();

  // PDF signed URL (60분)
  let pdfSignedUrl: string | null = null;
  if (c.pdf_url) {
    const storagePath = c.pdf_url.replace(/.*\/storage\/v1\/object\/public\/[^/]+\//, "");
    const { data } = await supabase.storage
      .from("attachments")
      .createSignedUrl(storagePath, 3600);
    pdfSignedUrl = data?.signedUrl ?? null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("id", user.id)
    .single();

  const metaParts = [
    new Date(c.created_at).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
  ];
  if (c.read_time_minutes) metaParts.push(`${c.read_time_minutes}분 읽기`);
  metaParts.push("마케터의서재");

  return (
    <div className="bg-white">
      <div className="w-full lg:max-w-[800px] mx-auto">
        {/* 헤더 */}
        <div className="px-7 pt-6 pb-0">
          <p className="text-[12px] text-[#9B9890] mb-2">
            {c.type === "article" ? "글" : "영상"}{" "}
            {c.tags.length > 0 && `· ${c.tags[0]}`}
          </p>
          <h1 className="text-[24px] font-bold text-[#1A1A1A] leading-[1.35]">
            {c.title}
          </h1>
          <p className="text-[12px] text-[#9B9890] mt-2">
            {metaParts.join(" · ")}
          </p>
        </div>

        {/* 콘텐츠 */}
        <ContentViewer content={c} />

        {/* PDF 다운로드 */}
        {pdfSignedUrl && (
          <div className="px-7 pb-4">
            <a
              href={pdfSignedUrl}
              download={c.pdf_filename ?? "download.pdf"}
              className="inline-flex items-center gap-2 border border-[#E8E5DE] text-[#6B6860] rounded-[6px] px-4 py-2.5 text-[13px]"
            >
              <Download size={14} />
              {c.pdf_filename ?? "PDF 다운로드"}
            </a>
          </div>
        )}

        {/* 좋아요 */}
        <div className="px-7 pb-4">
          <LikeButton
            contentId={c.id}
            userId={user.id}
            initialCount={c.like_count}
            initialLiked={!!likeRow}
          />
        </div>

        {/* 댓글 */}
        <CommentSection
          contentId={c.id}
          userId={user.id}
          currentNickname={profile?.nickname ?? null}
        />
      </div>
    </div>
  );
}
