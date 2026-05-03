import type { Metadata } from "next";
import "./globals.css";
import GNB from "@/components/layout/GNB";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "마케터의서재 — 검색해도 나오지 않는 마케팅의 진짜 답",
  description:
    "퍼포먼스·콘텐츠·IT서비스 홍보 — 실무에서 바로 쓰는 글과 영상",
  openGraph: {
    title: "마케터의서재",
    description:
      "퍼포먼스·콘텐츠·IT서비스 홍보 — 실무에서 바로 쓰는 글과 영상",
    siteName: "마케터의서재",
    locale: "ko_KR",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let nickname: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("nickname")
      .eq("id", user.id)
      .single();
    nickname = profile?.nickname ?? null;
  }

  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#FAFAF8]">
        <GNB user={user} nickname={nickname} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
