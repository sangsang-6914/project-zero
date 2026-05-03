"use client";

import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import type { Content } from "@/types";

interface Props {
  content: Content;
}

export default function ContentViewer({ content }: Props) {
  if (content.type === "video") {
    const videoId = extractYoutubeId(content.youtube_url ?? "");
    return (
      <div className="px-7 py-6">
        {videoId ? (
          <div className="relative w-full aspect-video rounded-[8px] overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={content.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        ) : (
          <p className="text-[14px] text-[#9B9890]">영상을 불러올 수 없습니다.</p>
        )}
      </div>
    );
  }

  if (content.type === "article") {
    let html = "";
    try {
      html = content.body
        ? generateHTML(content.body as Parameters<typeof generateHTML>[0], [StarterKit])
        : content.summary ?? "";
    } catch {
      html = content.summary ?? "";
    }

    return (
      <div
        className="px-7 py-6 prose prose-sm max-w-none text-[14px] text-[#1A1A1A] leading-[1.7]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return null;
}

function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}
