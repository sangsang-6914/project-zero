"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { CommunityRequest } from "@/types";

const STATUS_LABELS: Record<string, string> = {
  pending: "검토중",
  answered: "답변완료",
  rejected: "답변불가",
};

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  pending: { bg: "#FEF9C3", color: "#92700A" },
  answered: { bg: "#E8F4ED", color: "#2D6B4A" },
  rejected: { bg: "#FEE2E2", color: "#B91C1C" },
};

interface Props {
  requests: CommunityRequest[];
}

export default function AdminCommunityList({ requests }: Props) {
  const [selected, setSelected] = useState<CommunityRequest | null>(null);
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState<"answered" | "rejected">("answered");
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  function openReply(r: CommunityRequest) {
    setSelected(r);
    setReply(r.admin_reply ?? "");
    setStatus(r.status === "rejected" ? "rejected" : "answered");
  }

  async function submitReply() {
    if (!selected) return;
    setSaving(true);
    await supabase
      .from("community_requests")
      .update({ admin_reply: reply, status, updated_at: new Date().toISOString() })
      .eq("id", selected.id);
    setSaving(false);
    setSelected(null);
    router.refresh();
  }

  return (
    <div>
      <div className="bg-white border border-[#E8E5DE] rounded-[10px] overflow-hidden">
        {requests.map((r) => {
          const s = STATUS_STYLE[r.status];
          return (
            <div key={r.id} className="px-5 py-4 border-b border-[#E8E5DE] last:border-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[11px] font-medium rounded-[3px] px-2 py-0.5"
                      style={{ backgroundColor: s.bg, color: s.color }}
                    >
                      {STATUS_LABELS[r.status]}
                    </span>
                    <span className="text-[12px] text-[#9B9890]">
                      {r.profiles?.nickname ?? "익명"} ·{" "}
                      {new Date(r.created_at).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  <p className="text-[14px] text-[#1A1A1A] font-medium">
                    {r.body.length > 80 ? r.body.slice(0, 80) + "..." : r.body}
                  </p>
                  {r.admin_reply && (
                    <p className="text-[13px] text-[#6B6860] mt-1 pl-3 border-l-2 border-[#E8E5DE]">
                      {r.admin_reply}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => openReply(r)}
                  className="shrink-0 border border-[#E8E5DE] text-[#6B6860] rounded-[6px] px-3 py-1.5 text-[12px]"
                >
                  답변
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 답변 모달 */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-[12px] w-[480px] mx-4 p-6 shadow-lg">
            <h2 className="text-[16px] font-bold mb-3">답변 작성</h2>
            <p className="text-[13px] text-[#6B6860] mb-4 bg-[#F2F0EB] rounded-[6px] p-3">
              {selected.body}
            </p>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={4}
              placeholder="답변을 입력하세요"
              className="w-full border border-[#E8E5DE] rounded-[6px] px-3 py-2 text-[14px] resize-none focus:outline-none focus:border-[#1A1A1A] mb-3"
            />
            <div className="flex gap-2 mb-4">
              {(["answered", "rejected"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className="px-3 py-1.5 rounded-[6px] text-[12px] border"
                  style={{
                    backgroundColor: status === s ? "#1A1A1A" : "white",
                    color: status === s ? "white" : "#6B6860",
                    borderColor: status === s ? "#1A1A1A" : "#E8E5DE",
                  }}
                >
                  {s === "answered" ? "답변완료" : "답변불가"}
                </button>
              ))}
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setSelected(null)}
                className="border border-[#E8E5DE] text-[#6B6860] rounded-[6px] px-4 py-2 text-[13px]"
              >
                취소
              </button>
              <button
                onClick={submitReply}
                disabled={saving}
                className="bg-[#1A1A1A] text-white rounded-[6px] px-4 py-2 text-[13px] disabled:opacity-60"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
