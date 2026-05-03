import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: totalContents },
    { count: publishedContents },
    { count: totalPurchases },
    { count: pendingRequests },
  ] = await Promise.all([
    supabase.from("contents").select("*", { count: "exact", head: true }),
    supabase
      .from("contents")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    supabase
      .from("purchases")
      .select("*", { count: "exact", head: true })
      .eq("status", "done"),
    supabase
      .from("community_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  const stats = [
    { label: "전체 콘텐츠", value: totalContents ?? 0 },
    { label: "발행 콘텐츠", value: publishedContents ?? 0 },
    { label: "총 구매", value: totalPurchases ?? 0 },
    { label: "미답변 Q&A", value: pendingRequests ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-[22px] font-bold text-[#1A1A1A] mb-6">대시보드</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-[#E8E5DE] rounded-[10px] p-5"
          >
            <p className="text-[12px] text-[#9B9890]">{s.label}</p>
            <p className="text-[28px] font-bold text-[#1A1A1A] mt-1">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <Link
          href="/admin/contents/new"
          className="bg-[#1A1A1A] text-white rounded-[6px] px-5 py-2.5 text-[14px] font-medium"
        >
          + 새 콘텐츠 작성
        </Link>
        <Link
          href="/admin/community"
          className="border border-[#E8E5DE] text-[#6B6860] rounded-[6px] px-5 py-2.5 text-[14px]"
        >
          Q&A 답변하기
        </Link>
      </div>
    </div>
  );
}
