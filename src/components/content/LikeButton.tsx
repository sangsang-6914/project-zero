"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  contentId: string;
  userId: string;
  initialCount: number;
  initialLiked: boolean;
}

export default function LikeButton({ contentId, userId, initialCount, initialLiked }: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const supabase = createClient();

  async function toggle() {
    if (liked) {
      setLiked(false);
      setCount((n) => n - 1);
      await supabase
        .from("likes")
        .delete()
        .eq("user_id", userId)
        .eq("content_id", contentId);
      await supabase.rpc("decrement_like_count", { content_id: contentId }).maybeSingle();
    } else {
      setLiked(true);
      setCount((n) => n + 1);
      await supabase.from("likes").insert({ user_id: userId, content_id: contentId });
      await supabase.rpc("increment_like_count", { content_id: contentId }).maybeSingle();
    }
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 px-4 py-2 rounded-[6px] border transition-colors text-[13px]"
      style={{
        borderColor: liked ? "#C4622D" : "#E8E5DE",
        color: liked ? "#C4622D" : "#6B6860",
        backgroundColor: liked ? "#FAF0E8" : "transparent",
      }}
    >
      <Heart size={15} fill={liked ? "#C4622D" : "none"} />
      {count}
    </button>
  );
}
