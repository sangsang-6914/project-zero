"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Props {
  userId: string | null;
}

export default function CommunityForm({ userId }: Props) {
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit() {
    if (!userId) {
      alert("로그인 후 작성하실 수 있습니다.");
      return;
    }
    if (!body.trim()) return;

    setSubmitting(true);
    await supabase.from("community_requests").insert({
      user_id: userId,
      body: body.trim(),
    });
    setBody("");
    setSubmitting(false);
    router.refresh();
  }

  return (
    <div className="border border-[#E8E5DE] rounded-[12px] overflow-hidden">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="어떤 마케팅 주제가 궁금하신가요? 자유롭게 남겨주세요."
        className="w-full px-4 pt-4 pb-2 min-h-[88px] text-[14px] text-[#1A1A1A] resize-none focus:outline-none placeholder:text-[#9B9890]"
      />
      <div className="border-t border-[#E8E5DE] px-4 py-2.5 flex items-center justify-between">
        <span className="text-[12px] text-[#9B9890]">
          {userId ? "" : "로그인 후 작성 가능"}
        </span>
        <button
          onClick={handleSubmit}
          disabled={submitting || !body.trim()}
          className="bg-[#1A1A1A] text-white rounded-[6px] px-4 py-1.5 text-[13px] disabled:opacity-40"
        >
          등록하기
        </button>
      </div>
    </div>
  );
}
