import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function MyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: purchases } = await supabase
    .from("purchases")
    .select("*, contents(id, title, type, thumbnail_url, price, tags)")
    .eq("user_id", user.id)
    .eq("status", "done")
    .order("purchased_at", { ascending: false });

  return (
    <div className="w-full lg:max-w-[800px] mx-auto px-7 py-8">
      <h1 className="text-[22px] font-bold text-[#1A1A1A] mb-6">구매 내역</h1>

      {!purchases || purchases.length === 0 ? (
        <div className="py-16 text-center text-[14px] text-[#9B9890]">
          구매한 콘텐츠가 없습니다.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {purchases.map((p) => {
            const c = p.contents as {
              id: string;
              title: string;
              type: string;
              price: number;
              tags: string[];
            } | null;
            if (!c) return null;
            return (
              <Link
                key={p.id}
                href={`/contents/${c.id}/view`}
                className="flex items-center justify-between p-4 border border-[#E8E5DE] rounded-[10px] hover:bg-[#FAFAF8] transition-colors"
              >
                <div>
                  <p className="text-[14px] font-semibold text-[#1A1A1A]">
                    {c.title}
                  </p>
                  <p className="text-[12px] text-[#9B9890] mt-0.5">
                    {new Date(p.purchased_at).toLocaleDateString("ko-KR")} ·{" "}
                    {c.price === 0 ? "무료" : `${c.price.toLocaleString()}원`}
                  </p>
                </div>
                <span className="text-[13px] text-[#2D6B4A]">열람 →</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
