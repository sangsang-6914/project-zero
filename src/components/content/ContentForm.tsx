"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import TiptapEditor from "@/components/editor/TiptapEditor";
import type { Content } from "@/types";

const ALL_TAGS = ["퍼포먼스", "콘텐츠", "IT서비스", "AI마케팅", "영상", "자료"];

interface Props {
  initial?: Partial<Content>;
  contentId?: string;
}

export default function ContentForm({ initial, contentId }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!contentId;

  const [type, setType] = useState<"article" | "video">(initial?.type ?? "article");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [body, setBody] = useState<Record<string, unknown> | null>(initial?.body ?? null);
  const [youtubeUrl, setYoutubeUrl] = useState(initial?.youtube_url ?? "");
  const [price, setPrice] = useState(String(initial?.price ?? "0"));
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [readTime, setReadTime] = useState(String(initial?.read_time_minutes ?? ""));
  const [videoDuration, setVideoDuration] = useState(String(initial?.video_duration_minutes ?? ""));
  const [isPublished, setIsPublished] = useState(initial?.is_published ?? false);
  const [thumbnailUrl, setThumbnailUrl] = useState(initial?.thumbnail_url ?? "");
  const [saving, setSaving] = useState(false);

  const thumbRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File, bucket: string) {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return { url: urlData.publicUrl, path: data.path, name: file.name };
  }

  async function handleSave(publish: boolean) {
    if (!title.trim()) return alert("제목을 입력하세요");
    setSaving(true);

    try {
      let finalThumbnailUrl = thumbnailUrl;
      let pdfUrl: string | null = null;
      let pdfFilename: string | null = null;

      // 썸네일 업로드
      if (thumbRef.current?.files?.[0]) {
        const file = thumbRef.current.files[0];
        if (file.size > 5 * 1024 * 1024) return alert("이미지는 5MB 이하만 가능합니다.");
        const result = await uploadFile(file, "thumbnails");
        finalThumbnailUrl = result.url;
      }

      // PDF 업로드
      if (pdfRef.current?.files?.[0]) {
        const file = pdfRef.current.files[0];
        if (file.size > 50 * 1024 * 1024) return alert("PDF는 50MB 이하만 가능합니다.");
        const result = await uploadFile(file, "attachments");
        pdfUrl = result.url;
        pdfFilename = result.name;
      }

      const payload = {
        type,
        title,
        summary: summary || null,
        body: type === "article" ? body : null,
        youtube_url: type === "video" ? youtubeUrl || null : null,
        thumbnail_url: finalThumbnailUrl || null,
        pdf_url: pdfUrl,
        pdf_filename: pdfFilename,
        price: parseInt(price) || 0,
        tags,
        read_time_minutes: type === "article" && readTime ? parseInt(readTime) : null,
        video_duration_minutes: type === "video" && videoDuration ? parseInt(videoDuration) : null,
        is_published: publish,
        updated_at: new Date().toISOString(),
      };

      if (isEdit) {
        await supabase.from("contents").update(payload).eq("id", contentId);
      } else {
        await supabase.from("contents").insert(payload);
      }

      router.push("/admin/contents");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  function toggleTag(tag: string) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  return (
    <div className="max-w-[720px] space-y-5">
      {/* 타입 */}
      <div className="flex gap-2">
        {(["article", "video"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className="px-4 py-2 rounded-[6px] text-[13px] border"
            style={{
              backgroundColor: type === t ? "#1A1A1A" : "white",
              color: type === t ? "white" : "#6B6860",
              borderColor: type === t ? "#1A1A1A" : "#E8E5DE",
            }}
          >
            {t === "article" ? "글" : "영상"}
          </button>
        ))}
      </div>

      {/* 제목 */}
      <div>
        <label className="block text-[13px] text-[#6B6860] mb-1">제목 *</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-[#E8E5DE] rounded-[6px] px-3 py-2 text-[14px] focus:outline-none focus:border-[#1A1A1A]"
        />
      </div>

      {/* 요약 */}
      <div>
        <label className="block text-[13px] text-[#6B6860] mb-1">
          요약 (미리보기용)
        </label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={3}
          className="w-full border border-[#E8E5DE] rounded-[6px] px-3 py-2 text-[14px] resize-none focus:outline-none focus:border-[#1A1A1A]"
        />
      </div>

      {/* 타입별 필드 */}
      {type === "article" ? (
        <div>
          <label className="block text-[13px] text-[#6B6860] mb-1">본문</label>
          <TiptapEditor value={body} onChange={setBody} />
        </div>
      ) : (
        <div>
          <label className="block text-[13px] text-[#6B6860] mb-1">
            유튜브 URL
          </label>
          <input
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full border border-[#E8E5DE] rounded-[6px] px-3 py-2 text-[14px] focus:outline-none focus:border-[#1A1A1A]"
          />
        </div>
      )}

      {/* 썸네일 */}
      <div>
        <label className="block text-[13px] text-[#6B6860] mb-1">
          썸네일 이미지 (5MB 이하)
        </label>
        <input type="file" accept="image/*" ref={thumbRef} />
        {thumbnailUrl && (
          <p className="text-[12px] text-[#9B9890] mt-1">현재: {thumbnailUrl}</p>
        )}
      </div>

      {/* PDF */}
      <div>
        <label className="block text-[13px] text-[#6B6860] mb-1">
          PDF 첨부 (50MB 이하)
        </label>
        <input type="file" accept=".pdf" ref={pdfRef} />
      </div>

      {/* 태그 */}
      <div>
        <label className="block text-[13px] text-[#6B6860] mb-2">태그</label>
        <div className="flex flex-wrap gap-2">
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className="text-[12px] rounded-[3px] px-3 py-1 border"
              style={{
                backgroundColor: tags.includes(tag) ? "#1A1A1A" : "white",
                color: tags.includes(tag) ? "white" : "#6B6860",
                borderColor: tags.includes(tag) ? "#1A1A1A" : "#E8E5DE",
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 가격 */}
      <div>
        <label className="block text-[13px] text-[#6B6860] mb-1">
          가격 (0 = 무료)
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min={0}
          className="w-40 border border-[#E8E5DE] rounded-[6px] px-3 py-2 text-[14px] focus:outline-none focus:border-[#1A1A1A]"
        />
        <span className="ml-2 text-[13px] text-[#9B9890]">원</span>
      </div>

      {/* 읽기/재생 시간 */}
      {type === "article" ? (
        <div>
          <label className="block text-[13px] text-[#6B6860] mb-1">
            예상 읽기 시간 (분)
          </label>
          <input
            type="number"
            value={readTime}
            onChange={(e) => setReadTime(e.target.value)}
            min={1}
            className="w-24 border border-[#E8E5DE] rounded-[6px] px-3 py-2 text-[14px] focus:outline-none focus:border-[#1A1A1A]"
          />
        </div>
      ) : (
        <div>
          <label className="block text-[13px] text-[#6B6860] mb-1">
            재생 시간 (분)
          </label>
          <input
            type="number"
            value={videoDuration}
            onChange={(e) => setVideoDuration(e.target.value)}
            min={1}
            className="w-24 border border-[#E8E5DE] rounded-[6px] px-3 py-2 text-[14px] focus:outline-none focus:border-[#1A1A1A]"
          />
        </div>
      )}

      {/* 저장 버튼 */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => handleSave(false)}
          disabled={saving}
          className="border border-[#E8E5DE] text-[#6B6860] rounded-[6px] px-5 py-2.5 text-[14px] disabled:opacity-60"
        >
          임시저장
        </button>
        <button
          onClick={() => handleSave(true)}
          disabled={saving}
          className="bg-[#C4622D] text-white rounded-[6px] px-5 py-2.5 text-[14px] font-medium disabled:opacity-60"
        >
          발행하기
        </button>
      </div>
    </div>
  );
}
