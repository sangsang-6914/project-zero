"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  user: { id: string; email?: string } | null;
  nickname?: string | null;
}

const navLinks = [
  { label: "서비스소개", href: "/" },
  { label: "글보기", href: "/contents?type=article" },
  { label: "영상보기", href: "/contents?type=video" },
  { label: "커뮤니티", href: "/community" },
];

export default function GNB({ user, nickname }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const supabase = createClient();

  async function handleKakaoLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      },
    });
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      },
    });
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.refresh();
    setDropdownOpen(false);
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("?")[0]);
  };

  return (
    <>
      {/* 상단 액센트 바 */}
      <div
        className="h-[3px] w-full"
        style={{ background: "linear-gradient(to right, #C4622D, #2D6B4A)" }}
      />

      {/* GNB */}
      <nav className="h-[52px] bg-white border-b border-[#E8E5DE] sticky top-0 z-40">
        <div className="w-full lg:max-w-[1200px] mx-auto px-7 h-full flex items-center justify-between">
          {/* 로고 */}
          <Link
            href="/"
            className="font-bold text-[15px] text-[#1A1A1A] shrink-0"
          >
            마케터의서재
          </Link>

          {/* PC 메뉴 */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[14px] ${
                  isActive(link.href)
                    ? "text-[#1A1A1A] font-semibold"
                    : "text-[#9B9890]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* PC 우측 버튼 */}
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 bg-[#1A1A1A] text-white rounded-[6px] px-4 py-2 text-[13px] font-medium"
                >
                  {nickname ?? "나의 서재"}
                  <ChevronDown size={14} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-[#E8E5DE] rounded-[8px] w-36 shadow-md overflow-hidden">
                    <Link
                      href="/my"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-[13px] text-[#1A1A1A] hover:bg-[#FAFAF8]"
                    >
                      구매 내역
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-[13px] text-[#6B6860] hover:bg-[#FAFAF8]"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={handleKakaoLogin}
                  className="border border-[#E8E5DE] text-[#6B6860] rounded-[6px] px-4 py-2 text-[13px]"
                >
                  카카오 로그인
                </button>
                <button
                  onClick={handleGoogleLogin}
                  className="bg-[#1A1A1A] text-white rounded-[6px] px-4 py-2 text-[13px] font-medium"
                >
                  시작하기
                </button>
              </>
            )}
          </div>

          {/* 모바일 햄버거 */}
          <button
            className="lg:hidden text-[#1A1A1A]"
            onClick={() => setDrawerOpen(!drawerOpen)}
          >
            {drawerOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* 모바일 드로어 */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[55px] bg-white border-b border-[#E8E5DE] z-30 shadow-sm">
          <div className="flex flex-col px-7 py-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setDrawerOpen(false)}
                className={`text-[14px] ${
                  isActive(link.href)
                    ? "text-[#1A1A1A] font-semibold"
                    : "text-[#9B9890]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-[#E8E5DE] pt-4 flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    href="/my"
                    onClick={() => setDrawerOpen(false)}
                    className="text-[14px] text-[#1A1A1A]"
                  >
                    구매 내역
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-[14px] text-[#6B6860]"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleKakaoLogin}
                    className="border border-[#E8E5DE] text-[#6B6860] rounded-[6px] px-4 py-2 text-[13px] text-left"
                  >
                    카카오 로그인
                  </button>
                  <button
                    onClick={handleGoogleLogin}
                    className="bg-[#1A1A1A] text-white rounded-[6px] px-4 py-2 text-[13px] text-left font-medium"
                  >
                    시작하기
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
