const KAKAO_PAY_API = "https://open-api.kakaopay.com/online/v1/payment";
const CID = process.env.KAKAO_PAY_CID ?? "TC0ONETIME";
const SECRET_KEY = process.env.KAKAO_PAY_SECRET_KEY!;

export interface ReadyParams {
  orderId: string;
  userId: string;
  itemName: string;
  quantity: number;
  totalAmount: number;
  approvalUrl: string;
  cancelUrl: string;
  failUrl: string;
}

export interface ReadyResponse {
  tid: string;
  next_redirect_pc_url: string;
  next_redirect_mobile_url: string;
  next_redirect_app_url: string;
}

export async function kakaoPayReady(params: ReadyParams): Promise<ReadyResponse> {
  const res = await fetch(`${KAKAO_PAY_API}/ready`, {
    method: "POST",
    headers: {
      Authorization: `SECRET_KEY ${SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cid: CID,
      partner_order_id: params.orderId,
      partner_user_id: params.userId,
      item_name: params.itemName,
      quantity: params.quantity,
      total_amount: params.totalAmount,
      tax_free_amount: 0,
      approval_url: params.approvalUrl,
      cancel_url: params.cancelUrl,
      fail_url: params.failUrl,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`KakaoPay ready failed: ${err}`);
  }
  return res.json();
}

export async function kakaoPayApprove(tid: string, orderId: string, userId: string, pgToken: string) {
  const res = await fetch(`${KAKAO_PAY_API}/approve`, {
    method: "POST",
    headers: {
      Authorization: `SECRET_KEY ${SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cid: CID,
      tid,
      partner_order_id: orderId,
      partner_user_id: userId,
      pg_token: pgToken,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`KakaoPay approve failed: ${err}`);
  }
  return res.json();
}
