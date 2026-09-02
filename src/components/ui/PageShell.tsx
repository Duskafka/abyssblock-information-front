import type { ReactNode } from "react";

/**
 * 페이지 콘텐츠 컬럼의 표준 폭.
 *
 * 이전에는 max-w-xl / 3xl / 4xl / 5xl / 6xl 다섯 종류가 규칙 없이 쓰였고
 * 좌우 패딩도 px-4, px-6, px-4 md:px-6, px-6 md:px-8 네 갈래였다.
 * 그래서 탭을 옮길 때마다 콘텐츠 폭이 튀었다.
 *
 * Header도 이 상수(SHELL_WIDTH.wide)를 그대로 쓴다. 헤더가 자기만의
 * max-w-6xl을 들고 있어서 대부분 라우트에서 로고와 본문이 어긋나 있었다.
 */
export const SHELL_WIDTH = {
    /** 읽기 전용 문서 — 공지 본문, 시뮬레이터 */
    narrow: "max-w-3xl",
    /** 목록 · 폼 · 상세 */
    default: "max-w-4xl",
    /** 대시보드 · 카드 그리드 (헤더도 이 폭을 쓴다) */
    wide: "max-w-6xl",
} as const;

export type ShellWidth = keyof typeof SHELL_WIDTH;

interface PageShellProps {
    width?: ShellWidth;
    /** 섹션 간 세로 간격. 대부분 space-y-6, 대시보드만 space-y-10을 쓴다. */
    className?: string;
    children: ReactNode;
}

/**
 * 페이지 콘텐츠 래퍼.
 *
 * 배경색과 최소 높이는 layout.tsx의 <body>/<main>이 이미 책임진다.
 * 이전에는 페이지마다 `min-h-screen bg-abyss-900 text-slate-100 font-sans`를
 * 다시 선언해서, sticky 헤더 높이만큼 모든 페이지가 항상 넘쳐 스크롤이 생겼다.
 */
export default function PageShell({
    width = "default",
    className = "",
    children,
}: PageShellProps) {
    return (
        <div
            className={`${SHELL_WIDTH[width]} mx-auto px-4 sm:px-6 py-10 ${className}`}
        >
            {children}
        </div>
    );
}
