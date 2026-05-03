"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ContentListItem from "@/components/content/ContentListItem";
import type { Content } from "@/types";

const CATEGORY_TAGS = ["전체", "퍼포먼스", "콘텐츠", "IT서비스", "AI마케팅", "영상", "자료"];

export default function ContentsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const typeFilter = searchParams.get("type");
  const tagFilter = searchParams.get("tag") ?? "전체";

  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      setLoading(true);
      let query = supabase
        .from("contents")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (typeFilter) query = query.eq("type", typeFilter);
      if (tagFilter && tagFilter !== "전체") query = query.contains("tags", [tagFilter]);

      const { data } = await query;
      setContents((data as Content[]) ?? []);
      setLoading(false);
    }
    load();
  }, [typeFilter, tagFilter]);

  function selectTag(tag: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (tag === "전체") {
      params.delete("tag");
    } else {
      params.set("tag", tag);
    }
    router.push(`/contents?${params.toString()}`);
  }

  return (
    <div>
      {/* 카테고리 필터 */}
      <div className="bg-white border-b border-[#E8E5DE] px-7 py-3">
        <div className="w-full lg:max-w-[1200px] mx-auto">
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {CATEGORY_TAGS.map((tag) => {
              const active = tag === tagFilter || (tag === "전체" && !searchParams.get("tag"));
              return (
                <button
                  key={tag}
                  onClick={() => selectTag(tag)}
                  className="shrink-0 rounded-full px-3.5 py-1.5 text-[13px] border transition-colors"
                  style={{
                    backgroundColor: active ? "#1A1A1A" : "#ffffff",
                    borderColor: active ? "#1A1A1A" : "#E8E5DE",
                    color: active ? "#ffffff" : "#6B6860",
                  }}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 리스트 */}
      <div className="bg-white px-7">
        <div className="w-full lg:max-w-[1200px] mx-auto">
          {loading ? (
            <div className="py-16 text-center text-[14px] text-[#9B9890]">
              불러오는 중...
            </div>
          ) : contents.length === 0 ? (
            <div className="py-16 text-center text-[14px] text-[#9B9890]">
              콘텐츠가 없습니다.
            </div>
          ) : (
            contents.map((c) => <ContentListItem key={c.id} content={c} />)
          )}
        </div>
      </div>
    </div>
  );
}
