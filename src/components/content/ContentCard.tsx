"use client";

import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import type { Content } from "@/types";

interface Props {
  content: Content;
}

function TagBadge({ tag }: { tag: string }) {
  const isGreen = ["IT서비스", "AI마케팅"].includes(tag);
  return (
    <span
      className="text-[10px] font-medium rounded-[3px] px-[6px] py-[2px]"
      style={{
        backgroundColor: isGreen ? "#E8F4ED" : "#FAF0E8",
        color: isGreen ? "#2D6B4A" : "#C4622D",
      }}
    >
      {tag}
    </span>
  );
}

export default function ContentCard({ content }: Props) {
  return (
    <Link
      href={`/contents/${content.id}`}
      className="block bg-white border border-[#E8E5DE] rounded-[10px] overflow-hidden cursor-pointer transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
    >
      {/* 썸네일 */}
      <div className="relative w-full aspect-video bg-[#F2F0EB]">
        {content.thumbnail_url ? (
          <Image
            src={content.thumbnail_url}
            alt={content.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#EFEDE8]" />
        )}
        {content.type === "video" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[44px] h-[44px] rounded-full border-2 border-[#C4622D] flex items-center justify-center bg-white/80">
              <Play size={16} className="text-[#C4622D] ml-0.5" fill="#C4622D" />
            </div>
          </div>
        )}
      </div>

      {/* 본문 */}
      <div className="p-3">
        <div className="flex flex-wrap gap-1 mb-1.5">
          {content.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
        <p className="text-[14px] font-semibold text-[#1A1A1A] leading-[1.5] line-clamp-2">
          {content.title}
        </p>
        <div className="mt-2">
          {content.price === 0 ? (
            <span
              className="text-[10px] font-semibold rounded-[3px] px-[7px] py-[2px]"
              style={{ backgroundColor: "#E8F4ED", color: "#2D6B4A" }}
            >
              무료
            </span>
          ) : (
            <span className="text-[12px] font-bold text-[#C4622D]">
              {content.price.toLocaleString()}원
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
