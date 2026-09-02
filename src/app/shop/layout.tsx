import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "어비스 연동 장터",
  description: "대원들이 등록한 인게임 아이템 매물을 확인하고 거래하세요.",
  openGraph: {
    title: "어비스 연동 장터",
    description: "대원들이 등록한 인게임 아이템 매물을 확인하고 거래하세요.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
