import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ContentCard from "@/components/content/ContentCard";
import type { Content } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "마케터의서재 — 검색해도 나오지 않는 마케팅의 진짜 답",
};

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: articles }, { data: videos }] = await Promise.all([
    supabase
      .from("contents")
      .select("*")
      .eq("is_published", true)
      .eq("type", "article")
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("contents")
      .select("*")
      .eq("is_published", true)
      .eq("type", "video")
      .order("view_count", { ascending: false })
      .limit(3),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-white border-b border-[#E8E5DE] px-7 py-12 md:py-16 text-center">
        <div className="w-full lg:max-w-[1200px] mx-auto">
          <span className="inline-flex items-center border border-[#E8E5DE] rounded-full px-3 py-1 text-[12px] font-medium text-[#C4622D] mb-4">
            AI 시대 마케터를 위한 실전 인사이트
          </span>
          <h1 className="text-[28px] md:text-[32px] font-bold text-[#1A1A1A] leading-[1.3] mb-3">
            검색해도 나오지 않는
            <br />
            마케팅의 진짜 답
          </h1>
          <p className="text-[15px] text-[#6B6860] leading-[1.6] mb-7">
            퍼포먼스·콘텐츠·IT서비스 홍보 — 실무에서 바로 쓰는 글과 영상
          </p>
          <div className="flex items-center justify-center gap-2">
            <Link
              href="/contents"
              className="bg-[#1A1A1A] text-white rounded-[6px] px-5 py-2.5 text-[14px] font-medium"
            >
              콘텐츠 보기
            </Link>
            <Link
              href="/#about"
              className="border border-[#E8E5DE] text-[#6B6860] rounded-[6px] px-5 py-2.5 text-[14px]"
            >
              서비스 소개
            </Link>
          </div>
        </div>
      </section>

      {/* 최신 글 */}
      <section className="bg-white border-b border-[#E8E5DE] px-7 py-8">
        <div className="w-full lg:max-w-[1200px] mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px] font-bold text-[#1A1A1A]">최신 글</h2>
            <Link href="/contents?type=article" className="text-[13px] text-[#2D6B4A]">
              더보기 →
            </Link>
          </div>
          {articles && articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(articles as Content[]).map((c) => (
                <ContentCard key={c.id} content={c} />
              ))}
            </div>
          ) : (
            <p className="text-[14px] text-[#9B9890] py-8 text-center">
              아직 등록된 글이 없습니다.
            </p>
          )}
        </div>
      </section>

      {/* 인기 영상 */}
      <section className="bg-white px-7 py-8">
        <div className="w-full lg:max-w-[1200px] mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px] font-bold text-[#1A1A1A]">인기 영상</h2>
            <Link href="/contents?type=video" className="text-[13px] text-[#2D6B4A]">
              더보기 →
            </Link>
          </div>
          {videos && videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(videos as Content[]).map((c) => (
                <ContentCard key={c.id} content={c} />
              ))}
            </div>
          ) : (
            <p className="text-[14px] text-[#9B9890] py-8 text-center">
              아직 등록된 영상이 없습니다.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
