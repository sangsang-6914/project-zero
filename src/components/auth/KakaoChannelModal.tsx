"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { X } from "lucide-react";

interface Props {
  userId: string;
  onClose: () => void;
}

export default function KakaoChannelModal({ userId, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleAgree(agreed: boolean) {
    setLoading(true);
    await supabase
      .from("profiles")
      .update({ kakao_channel_agreed: agreed })
      .eq("id", userId);
    setLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => handleAgree(false)}
      />
      <div className="relative bg-white rounded-xl p-6 w-[320px] mx-4 shadow-lg">
        <button
          onClick={() => handleAgree(false)}
          className="absolute top-4 right-4 text-[#9B9890]"
        >
          <X size={18} />
        </button>
        <h2 className="text-[15px] font-bold text-[#1A1A1A] mb-2">
          카카오 채널 추가 안내
        </h2>
        <p className="text-[13px] text-[#6B6860] leading-relaxed mb-5">
          마케터의서재 카카오 채널을 추가하시면 신규 콘텐츠 알림을 받으실 수
          있습니다.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => handleAgree(false)}
            disabled={loading}
            className="flex-1 border border-[#E8E5DE] text-[#6B6860] rounded-[6px] py-2.5 text-[13px]"
          >
            괜찮아요
          </button>
          <button
            onClick={() => handleAgree(true)}
            disabled={loading}
            className="flex-1 bg-[#FEE500] text-[#1A1A1A] font-bold rounded-[6px] py-2.5 text-[13px]"
          >
            채널 추가
          </button>
        </div>
      </div>
    </div>
  );
}
