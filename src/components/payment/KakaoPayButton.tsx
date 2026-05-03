"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  contentId: string;
  price: number;
  title: string;
  userId: string | undefined;
}

export default function KakaoPayButton({ contentId, price, title, userId }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handlePay() {
    if (!userId) {
      router.push("/?login=required");
      return;
    }

    // 무료 콘텐츠
    if (price === 0) {
      const res = await fetch("/api/payment/free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentId }),
      });
      if (res.ok) {
        router.push(`/contents/${contentId}/view`);
      }
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/payment/ready", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentId, price, title }),
      });
      const data = await res.json();
      if (data.redirectUrl) {
        const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
        window.location.href = isMobile ? data.mobileRedirectUrl : data.redirectUrl;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="w-full rounded-[6px] py-3.5 text-[14px] font-bold disabled:opacity-60"
      style={{ backgroundColor: "#FEE500", color: "#1A1A1A" }}
    >
      {loading ? "처리 중..." : "카카오페이로 결제"}
    </button>
  );
}
