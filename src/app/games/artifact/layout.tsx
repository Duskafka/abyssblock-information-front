import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "아티펙트 강화 시뮬레이터",
  description: "유물 강화 확률과 기대 시도 횟수를 미리 계산해 보세요.",
  openGraph: {
    title: "아티펙트 강화 시뮬레이터",
    description: "유물 강화 확률과 기대 시도 횟수를 미리 계산해 보세요.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
