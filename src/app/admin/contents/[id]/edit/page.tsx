import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ContentForm from "@/components/content/ContentForm";
import type { Content } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditContentPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("contents").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <div>
      <h1 className="text-[22px] font-bold text-[#1A1A1A] mb-6">콘텐츠 수정</h1>
      <ContentForm initial={data as Content} contentId={id} />
    </div>
  );
}
