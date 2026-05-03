import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { kakaoPayApprove } from "@/lib/kakao/payments";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pgToken = searchParams.get("pg_token");
  const orderId = searchParams.get("orderId");
  const contentId = searchParams.get("contentId");
  const userId = searchParams.get("userId");

  if (!pgToken || !orderId || !contentId || !userId) {
    return NextResponse.redirect(
      new URL(`/contents/${contentId ?? ""}?error=missing_params`, request.url)
    );
  }

  const cookieStore = await cookies();
  const tid = cookieStore.get(`tid_${orderId}`)?.value;

  if (!tid) {
    return NextResponse.redirect(
      new URL(`/contents/${contentId}?error=session_expired`, request.url)
    );
  }

  try {
    const approveResult = await kakaoPayApprove(tid, orderId, userId, pgToken);

    const supabase = await createClient();
    const { error } = await supabase.from("purchases").insert({
      user_id: userId,
      content_id: contentId,
      amount: approveResult.amount?.total ?? 0,
      payment_key: tid,
      order_id: orderId,
      status: "done",
    });

    if (error) {
      console.error("purchase insert error:", error);
    }

    // tid 쿠키 삭제
    cookieStore.delete(`tid_${orderId}`);

    return NextResponse.redirect(
      new URL(`/contents/${contentId}/view`, request.url)
    );
  } catch (err) {
    console.error(err);
    return NextResponse.redirect(
      new URL(`/contents/${contentId}?error=approve_failed`, request.url)
    );
  }
}
