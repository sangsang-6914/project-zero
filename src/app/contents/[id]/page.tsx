import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Content } from "@/types";
import KakaoPayButton from "@/components/payment/KakaoPayButton";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("contents")
    .select("title, summary")
    .eq("id", id)
    .single();
  return {
    title: data?.title ? `${data.title} — 마케터의서재` : "마케터의서재",
    description: data?.summary ?? undefined,
  };
}

export default async function ContentDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  // view_count +1 (서버에서)
  await supabase.rpc("increment_view_count", { content_id: id }).maybeSingle();

  const { data: content } = await supabase
    .from("contents")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (!content) notFound();

  const c = content as Content;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 구매 여부 확인
  let hasPurchased = c.price === 0;
  if (!hasPurchased && user) {
    const { data: purchase } = await supabase
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("content_id", id)
      .single();
    hasPurchased = !!purchase;
  }

  // 구매 완료 시 열람 페이지로 redirect
  if (hasPurchased) {
    redirect(`/contents/${id}/view`);
  }

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

        {/* 미리보기 본문 */}
        <div className="relative px-7 pt-6">
          <div className="text-[14px] text-[#1A1A1A] leading-[1.7]">
            {c.summary ?? "이 콘텐츠의 미리보기를 확인하세요."}
          </div>

          {/* 블러 영역 */}
          <div
            style={{
              filter: "blur(4px)",
              pointerEvents: "none",
              userSelect: "none",
              maxHeight: "120px",
              overflow: "hidden",
              marginTop: "16px",
            }}
          >
            <p className="text-[14px] text-[#1A1A1A] leading-[1.7]">
              이 글에는 실무에서 바로 적용할 수 있는 심층 내용이 담겨 있습니다.
              마케팅 전략, 실행 방법론, 데이터 분석 인사이트를 상세하게 다루고
              있으며 현직 마케터의 경험에서 나온 실질적인 조언을 포함합니다.
              결제 후 전체 내용을 확인하세요.
            </p>
          </div>

          {/* 그라디언트 페이드 */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "80px",
              background: "linear-gradient(to bottom, transparent, #ffffff)",
            }}
          />
        </div>

        {/* 결제 박스 */}
        <div className="mx-7 mt-6 mb-8 bg-[#F2F0EB] border border-[#E8E5DE] rounded-[12px] p-6 text-center">
          <p className="text-[24px] font-bold text-[#1A1A1A]">
            {c.price.toLocaleString()}원
          </p>
          <p className="text-[13px] text-[#6B6860] mt-2 leading-relaxed">
            이 글의 전체 내용을 확인하세요
            <br />
            결제 후 즉시 열람 가능
          </p>
          <div className="mt-4">
            <KakaoPayButton contentId={c.id} price={c.price} title={c.title} userId={user?.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
