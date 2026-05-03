"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Props {
  contentId: string;
  isPublished: boolean;
}

export default function AdminContentActions({ contentId, isPublished }: Props) {
  const router = useRouter();
  const supabase = createClient();

  async function togglePublish() {
    await supabase
      .from("contents")
      .update({ is_published: !isPublished })
      .eq("id", contentId);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await supabase.from("contents").delete().eq("id", contentId);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/contents/${contentId}/edit`}
        className="text-[12px] text-[#6B6860] border border-[#E8E5DE] rounded-[4px] px-2.5 py-1"
      >
        수정
      </Link>
      <button
        onClick={togglePublish}
        className="text-[12px] text-[#2D6B4A] border border-[#E8E5DE] rounded-[4px] px-2.5 py-1"
      >
        {isPublished ? "내리기" : "발행"}
      </button>
      <button
        onClick={handleDelete}
        className="text-[12px] text-[#B91C1C] border border-[#E8E5DE] rounded-[4px] px-2.5 py-1"
      >
        삭제
      </button>
    </div>
  );
}
