import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "데미지 계산 시뮬레이터",
    description: "무기·인챈트·장신구 강화·유물·아티펙트 조합에 따른 최종 공격 피해량을 계산합니다.",
    openGraph: {
        title: "데미지 계산 시뮬레이터",
        description: "무기·인챈트·장신구 강화·유물·아티펙트 조합에 따른 최종 공격 피해량을 계산합니다.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
