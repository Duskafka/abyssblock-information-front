import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "유물 도감",
  description: "어비스블록의 모든 유물 상세 스펙과 인게임 메커니즘을 한눈에 확인하세요.",
  openGraph: {
    title: "유물 도감",
    description: "어비스블록의 모든 유물 상세 스펙과 인게임 메커니즘을 한눈에 확인하세요.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
