import { createClient } from "@/lib/supabase/server";
import type { CommunityRequest } from "@/types";
import CommunityForm from "./CommunityForm";

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  pending: { bg: "#FEF9C3", color: "#92700A", label: "검토중" },
  answered: { bg: "#E8F4ED", color: "#2D6B4A", label: "답변완료" },
  rejected: { bg: "#FEE2E2", color: "#B91C1C", label: "답변불가" },
};

export const revalidate = 0;

export default async function CommunityPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: requests } = await supabase
    .from("community_requests")
    .select("*, profiles(nickname)")
    .order("created_at", { ascending: false });

  return (
    <div className="bg-white">
      <div className="w-full lg:max-w-[800px] mx-auto">
        {/* 헤더 */}
        <div className="px-7 pt-6 pb-4">
          <h2 className="text-[18px] font-bold text-[#1A1A1A]">
            궁금한 점을 남겨주세요
          </h2>
          <p className="text-[13px] text-[#6B6860] mt-1">
            마케팅에 대한 질문, 원하는 콘텐츠 요청 모두 환영합니다
          </p>
        </div>

        {/* 질문 입력 */}
        <div className="mx-7 mb-6">
          <CommunityForm userId={user?.id ?? null} />
        </div>

        {/* 질문 목록 */}
        <div className="px-7 pb-12">
          {!requests || requests.length === 0 ? (
            <p className="text-[14px] text-[#9B9890] py-8 text-center">
              아직 질문이 없습니다. 첫 번째로 질문해보세요!
            </p>
          ) : (
            (requests as CommunityRequest[]).map((r) => {
              const s = STATUS_STYLE[r.status];
              return (
                <div
                  key={r.id}
                  className="py-3.5 border-b border-[#E8E5DE] last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[11px] font-medium rounded-[3px] px-2 py-0.5 shrink-0"
                      style={{ backgroundColor: s.bg, color: s.color }}
                    >
                      {s.label}
                    </span>
                    <p className="text-[14px] font-semibold text-[#1A1A1A] truncate">
                      {r.body.length > 60 ? r.body.slice(0, 60) + "..." : r.body}
                    </p>
                  </div>
                  <p className="text-[12px] text-[#9B9890] mt-1">
                    {r.profiles?.nickname ?? "익명"} ·{" "}
                    {new Date(r.created_at).toLocaleDateString("ko-KR")}
                  </p>
                  {r.admin_reply && (
                    <p className="text-[13px] text-[#6B6860] mt-2 pl-3 border-l-2 border-[#2D6B4A]">
                      {r.admin_reply}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
