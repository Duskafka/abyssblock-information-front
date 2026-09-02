import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "빌드 공유 게시판",
  description: "유저들이 연구해낸 최적의 유물 시너지 빌드를 확인하고 공유하세요.",
  openGraph: {
    title: "빌드 공유 게시판",
    description: "유저들이 연구해낸 최적의 유물 시너지 빌드를 확인하고 공유하세요.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
