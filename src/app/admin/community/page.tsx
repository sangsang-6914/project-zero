import { createClient } from "@/lib/supabase/server";
import AdminCommunityList from "./AdminCommunityList";
import type { CommunityRequest } from "@/types";

export default async function AdminCommunityPage() {
  const supabase = await createClient();
  const { data: requests } = await supabase
    .from("community_requests")
    .select("*, profiles(nickname)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-[22px] font-bold text-[#1A1A1A] mb-6">커뮤니티 Q&A 관리</h1>
      <AdminCommunityList requests={(requests as CommunityRequest[]) ?? []} />
    </div>
  );
}
