import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#F2F0EB] border-t border-[#E8E5DE]">
      <div className="w-full lg:max-w-[1200px] mx-auto px-7 py-5 flex items-center justify-between">
        <span className="text-[12px] text-[#9B9890]">© 2025 마케터의서재</span>
        <div className="flex items-center justify-center">
          <button className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E8E5DE] text-[#9B9890]">
            <ChevronDown size={16} />
          </button>
        </div>
        <div className="flex gap-2 text-[12px] text-[#9B9890]">
          <Link href="/terms">이용약관</Link>
          <span>·</span>
          <Link href="/privacy">개인정보처리방침</Link>
        </div>
      </div>
    </footer>
  );
}
