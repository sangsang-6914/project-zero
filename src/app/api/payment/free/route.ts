import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { contentId } = await request.json();

  const { data: content } = await supabase
    .from("contents")
    .select("price")
    .eq("id", contentId)
    .single();

  if (!content || content.price !== 0) {
    return NextResponse.json({ error: "Not free content" }, { status: 400 });
  }

  await supabase.from("purchases").upsert(
    { user_id: user.id, content_id: contentId, amount: 0, status: "done" },
    { onConflict: "user_id,content_id" }
  );

  return NextResponse.json({ ok: true });
}
