import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { kakaoPayReady } from "@/lib/kakao/payments";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { contentId, price, title } = await request.json();

  if (!contentId || price == null || !title) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  const orderId = uuidv4();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  try {
    const result = await kakaoPayReady({
      orderId,
      userId: user.id,
      itemName: title,
      quantity: 1,
      totalAmount: price,
      approvalUrl: `${baseUrl}/api/payment/approve?orderId=${orderId}&contentId=${contentId}&userId=${user.id}`,
      cancelUrl: `${baseUrl}/api/payment/cancel?contentId=${contentId}`,
      failUrl: `${baseUrl}/api/payment/fail?contentId=${contentId}`,
    });

    // tid를 임시 저장 (order_id -> tid 매핑용 — purchases 테이블 pending row 또는 in-memory cookie)
    // 간단하게 쿠키에 저장
    const response = NextResponse.json({
      redirectUrl: result.next_redirect_pc_url,
      mobileRedirectUrl: result.next_redirect_mobile_url,
    });
    response.cookies.set(`tid_${orderId}`, result.tid, {
      httpOnly: true,
      maxAge: 600,
      path: "/",
    });
    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Payment ready failed" }, { status: 500 });
  }
}
