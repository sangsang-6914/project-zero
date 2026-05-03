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

function metaText(content: Content) {
  const date = new Date(content.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  if (content.type === "article") {
    const parts = [date, "글"];
    if (content.read_time_minutes) parts.push(`${content.read_time_minutes}분 읽기`);
    return parts.join(" · ");
  }
  if (content.type === "video") {
    const parts = [date];
    if (content.video_duration_minutes) parts.push(`${content.video_duration_minutes}분`);
    return parts.join(" · ");
  }
  return date;
}

export default function ContentListItem({ content }: Props) {
  return (
    <Link
      href={`/contents/${content.id}`}
      className="flex items-center gap-3.5 py-4 border-b border-[#E8E5DE] hover:bg-[#FAFAF8] transition-colors"
    >
      {/* 썸네일 */}
      <div className="relative w-[84px] h-[56px] shrink-0 rounded-[8px] overflow-hidden bg-[#F2F0EB]">
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
            <div className="w-[22px] h-[22px] rounded-full border-[1.5px] border-[#C4622D] flex items-center justify-center bg-white/80">
              <Play size={9} className="text-[#C4622D] ml-px" fill="#C4622D" />
            </div>
          </div>
        )}
        {content.pdf_url && content.type === "article" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[9px] font-bold text-[#C4622D]">PDF</span>
          </div>
        )}
      </div>

      {/* 텍스트 */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap gap-1 mb-1">
          {content.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
        <p className="text-[14px] font-semibold text-[#1A1A1A] leading-[1.5] truncate">
          {content.title}
        </p>
        <p className="text-[12px] text-[#9B9890] mt-0.5">{metaText(content)}</p>
      </div>

      {/* 가격 */}
      <div className="shrink-0 text-right">
        {content.price === 0 ? (
          <span
            className="text-[10px] font-semibold rounded-[3px] px-[7px] py-[2px]"
            style={{ backgroundColor: "#E8F4ED", color: "#2D6B4A" }}
          >
            무료
          </span>
        ) : (
          <span className="text-[12px] font-bold text-[#1A1A1A]">
            {content.price.toLocaleString()}원
          </span>
        )}
      </div>
    </Link>
  );
}
