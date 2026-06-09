import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header"; // 💡 아까 만든 공통 헤더를 불러옵니다.
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "🌾 GOLD CROP",
  description: "심연 원정대 유물 시너지 및 시세 현황판",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html
          lang="ko" // 한국어 서비스이므로 ko로 변경해두면 좋습니다.
          className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
      <body className="min-h-full flex flex-col bg-[#0f141c]">
      {/* 💡 여기에 Header를 넣어주면
          메인 페이지(/), 게시판 페이지(/board) 등 어떤 페이지를 가도
          항상 상단에 헤더가 고정되어 렌더링됩니다!
        */}
      <Header />

      {/* 실제 각각의 페이지 컴포넌트들(page.tsx)이 들어가는 자리 */}
      <div className="flex-1">
        {children}
      </div>
      </body>
      </html>
  );
}