import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const contentId = searchParams.get("contentId");
  return NextResponse.redirect(
    new URL(`/contents/${contentId ?? ""}?error=payment_failed`, request.url)
  );
}
