import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "데미지 감산 시뮬레이터",
  description: "유물·갑옷·장신구 조합에 따른 피해 감소량을 계산합니다.",
  openGraph: {
    title: "데미지 감산 시뮬레이터",
    description: "유물·갑옷·장신구 조합에 따른 피해 감소량을 계산합니다.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
