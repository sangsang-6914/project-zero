import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Content } from "@/types";
import AdminContentActions from "./AdminContentActions";

export default async function AdminContentsPage() {
  const supabase = await createClient();
  const { data: contents } = await supabase
    .from("contents")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-bold text-[#1A1A1A]">콘텐츠 관리</h1>
        <Link
          href="/admin/contents/new"
          className="bg-[#1A1A1A] text-white rounded-[6px] px-4 py-2 text-[13px] font-medium"
        >
          + 새 콘텐츠
        </Link>
      </div>

      <div className="bg-white border border-[#E8E5DE] rounded-[10px] overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[#E8E5DE] bg-[#FAFAF8]">
              <th className="text-left px-4 py-3 text-[#9B9890] font-medium">제목</th>
              <th className="text-left px-4 py-3 text-[#9B9890] font-medium">타입</th>
              <th className="text-left px-4 py-3 text-[#9B9890] font-medium">가격</th>
              <th className="text-left px-4 py-3 text-[#9B9890] font-medium">상태</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(contents as Content[])?.map((c) => (
              <tr key={c.id} className="border-b border-[#E8E5DE] last:border-0">
                <td className="px-4 py-3 text-[#1A1A1A] max-w-[280px] truncate">
                  {c.title}
                </td>
                <td className="px-4 py-3 text-[#6B6860]">
                  {c.type === "article" ? "글" : "영상"}
                </td>
                <td className="px-4 py-3 text-[#6B6860]">
                  {c.price === 0 ? "무료" : `${c.price.toLocaleString()}원`}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="text-[11px] rounded-[3px] px-2 py-0.5 font-medium"
                    style={{
                      backgroundColor: c.is_published ? "#E8F4ED" : "#F2F0EB",
                      color: c.is_published ? "#2D6B4A" : "#9B9890",
                    }}
                  >
                    {c.is_published ? "발행" : "임시저장"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <AdminContentActions contentId={c.id} isPublished={c.is_published} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
