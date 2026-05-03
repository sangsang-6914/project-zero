"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Comment } from "@/types";

interface Props {
  contentId: string;
  userId: string | null;
  currentNickname: string | null;
}

export default function CommentSection({ contentId, userId, currentNickname }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newBody, setNewBody] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState("");
  const supabase = createClient();

  useEffect(() => {
    loadComments();
  }, [contentId]);

  async function loadComments() {
    const { data } = await supabase
      .from("comments")
      .select("*, profiles(nickname, avatar_url)")
      .eq("content_id", contentId)
      .order("created_at", { ascending: true });
    setComments((data as Comment[]) ?? []);
  }

  async function submitComment(body: string, parentId: string | null) {
    if (!body.trim() || !userId) return;
    await supabase.from("comments").insert({
      content_id: contentId,
      user_id: userId,
      parent_id: parentId,
      body: body.trim(),
    });
    setNewBody("");
    setReplyBody("");
    setReplyTo(null);
    await loadComments();
  }

  async function deleteComment(commentId: string) {
    await supabase
      .from("comments")
      .update({ is_deleted: true })
      .eq("id", commentId);
    await loadComments();
  }

  const topLevel = comments.filter((c) => !c.parent_id);
  const getReplies = (parentId: string) =>
    comments.filter((c) => c.parent_id === parentId);

  return (
    <div className="mt-8 px-7 pb-12">
      <h3 className="text-[16px] font-bold text-[#1A1A1A] mb-4">댓글</h3>

      {/* 댓글 입력 */}
      {userId ? (
        <div className="flex gap-2 mb-6">
          <textarea
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            placeholder="댓글을 입력하세요"
            className="flex-1 border border-[#E8E5DE] rounded-[6px] px-3 py-2 text-[14px] resize-none focus:outline-none focus:border-[#1A1A1A]"
            rows={2}
          />
          <button
            onClick={() => submitComment(newBody, null)}
            className="bg-[#1A1A1A] text-white rounded-[6px] px-4 py-2 text-[13px] self-end"
          >
            등록
          </button>
        </div>
      ) : (
        <p className="text-[13px] text-[#9B9890] mb-6">
          로그인 후 댓글을 작성할 수 있습니다.
        </p>
      )}

      {/* 댓글 목록 */}
      <div className="flex flex-col gap-4">
        {topLevel.map((comment) => (
          <div key={comment.id}>
            <CommentItem
              comment={comment}
              userId={userId}
              onDelete={deleteComment}
              onReply={() => setReplyTo(comment.id)}
              isReplying={replyTo === comment.id}
            />

            {/* 대댓글 */}
            <div className="ml-8 mt-2 flex flex-col gap-2">
              {getReplies(comment.id).map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  userId={userId}
                  onDelete={deleteComment}
                  isReply
                />
              ))}

              {replyTo === comment.id && userId && (
                <div className="flex gap-2 mt-2">
                  <textarea
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    placeholder="답글을 입력하세요"
                    className="flex-1 border border-[#E8E5DE] rounded-[6px] px-3 py-2 text-[13px] resize-none focus:outline-none focus:border-[#1A1A1A]"
                    rows={2}
                  />
                  <div className="flex flex-col gap-1 self-end">
                    <button
                      onClick={() => submitComment(replyBody, comment.id)}
                      className="bg-[#1A1A1A] text-white rounded-[6px] px-3 py-1.5 text-[12px]"
                    >
                      등록
                    </button>
                    <button
                      onClick={() => setReplyTo(null)}
                      className="border border-[#E8E5DE] text-[#6B6860] rounded-[6px] px-3 py-1.5 text-[12px]"
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  userId,
  onDelete,
  onReply,
  isReplying,
  isReply,
}: {
  comment: Comment;
  userId: string | null;
  onDelete: (id: string) => void;
  onReply?: () => void;
  isReplying?: boolean;
  isReply?: boolean;
}) {
  if (comment.is_deleted) {
    return (
      <p className="text-[13px] text-[#9B9890] py-2">삭제된 댓글입니다.</p>
    );
  }

  const nickname = comment.profiles?.nickname ?? "익명";
  const date = new Date(comment.created_at).toLocaleDateString("ko-KR");

  return (
    <div className="py-2 border-b border-[#E8E5DE] last:border-0">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[13px] font-medium text-[#1A1A1A]">{nickname}</span>
        <span className="text-[12px] text-[#9B9890]">{date}</span>
      </div>
      <p className="text-[14px] text-[#1A1A1A] leading-[1.6]">{comment.body}</p>
      <div className="flex gap-3 mt-1.5">
        {!isReply && onReply && (
          <button
            onClick={onReply}
            className="text-[12px] text-[#9B9890]"
          >
            {isReplying ? "취소" : "답글"}
          </button>
        )}
        {userId === comment.user_id && (
          <button
            onClick={() => onDelete(comment.id)}
            className="text-[12px] text-[#9B9890]"
          >
            삭제
          </button>
        )}
      </div>
    </div>
  );
}
