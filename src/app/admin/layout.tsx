import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  return (
    <div className="flex min-h-screen">
      {/* 사이드바 */}
      <aside className="w-48 shrink-0 bg-[#1A1A1A] text-white flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <span className="text-[14px] font-bold">관리자</span>
        </div>
        <nav className="flex flex-col gap-1 px-3 py-4">
          <Link
            href="/admin"
            className="px-3 py-2 rounded-[6px] text-[13px] text-white/70 hover:text-white hover:bg-white/10"
          >
            대시보드
          </Link>
          <Link
            href="/admin/contents"
            className="px-3 py-2 rounded-[6px] text-[13px] text-white/70 hover:text-white hover:bg-white/10"
          >
            콘텐츠 관리
          </Link>
          <Link
            href="/admin/community"
            className="px-3 py-2 rounded-[6px] text-[13px] text-white/70 hover:text-white hover:bg-white/10"
          >
            커뮤니티 관리
          </Link>
        </nav>
      </aside>
      <main className="flex-1 bg-[#FAFAF8] p-8">{children}</main>
    </div>
  );
}
