import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_KR } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/components/ui/Toast";
import { ConfirmProvider } from "@/components/ui/ConfirmDialog";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 한국어 서비스인데 Geist에는 한글 글리프가 없어 본문이 OS 폰트로 떨어지고 있었다.
// 한글 서브셋은 100여 개 청크로 쪼개져 있어 전부 preload하면 낭비라 preload는 끈다.
// (subsets 옵션은 "무엇을 preload할지"를 고르는 값이라 여기서는 지정하지 않는다.)
const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-kr",
  preload: false,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Abyssblock Information",
    // 각 페이지가 title을 지정하면 "유물 도감 · Abyssblock Info"처럼 붙는다.
    template: "%s · Abyssblock Info",
  },
  description: "어비스블록 정보 서비스",
  openGraph: {
    type: "website",
    siteName: "Abyssblock Information",
    locale: "ko_KR",
    title: "Abyssblock Information",
    description: "어비스블록 정보 서비스",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansKr.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-abyss-900 text-slate-100">
        {/* 키보드 사용자가 헤더 내비를 매번 통과하지 않고 본문으로 건너뛸 수 있게 한다. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-amber-400 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-slate-900"
        >
          본문 바로가기
        </a>

        <ToastProvider>
          <ConfirmProvider>
            <Header />

            {/* 각 페이지(page.tsx)가 들어가는 자리.
            이전에는 여기가 그냥 <div>였고 페이지마다 <main>과 min-h-screen을
            따로 선언해서, sticky 헤더 높이만큼 모든 페이지가 항상 넘쳤다. */}
            <main id="main-content" className="flex-1">
              {children}
            </main>

            <Footer />
          </ConfirmProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
