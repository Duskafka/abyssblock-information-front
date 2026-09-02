import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "마이페이지",
  description: "인게임 프로필과 내가 올린 글·매물을 한곳에서 관리합니다.",
  openGraph: {
    title: "마이페이지",
    description: "인게임 프로필과 내가 올린 글·매물을 한곳에서 관리합니다.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
