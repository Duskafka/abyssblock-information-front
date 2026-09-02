import type { ReactNode } from "react";

interface PageHeadingProps {
    /** 페이지 제목. 각 라우트에 정확히 하나만 있어야 한다. */
    children: ReactNode;
    /** 제목 아래 한 줄 설명 */
    description?: ReactNode;
    /** 우측에 붙는 버튼/링크 */
    actions?: ReactNode;
    className?: string;
}

/**
 * 페이지 제목 블록.
 *
 * 이전에는 페이지 제목 스타일이 일곱 가지로 갈려 있었고
 * (text-2xl font-black text-amber-400 / text-lg font-bold text-slate-200 / ...)
 * 공유되는 곳이 하나도 없었다. 게다가 /, /board, /relics, /mypage 네 페이지는
 * <h1> 없이 <h2>부터 시작해 문서 개요가 끊겨 있었다.
 */
export default function PageHeading({
    children,
    description,
    actions,
    className = "",
}: PageHeadingProps) {
    return (
        <div
            className={`flex flex-col gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-end sm:justify-between ${className}`}
        >
            <div className="space-y-1.5">
                <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-amber-400 sm:text-3xl">
                    {children}
                </h1>
                {description && (
                    <p className="text-sm leading-relaxed text-slate-400">
                        {description}
                    </p>
                )}
            </div>
            {actions && <div className="shrink-0">{actions}</div>}
        </div>
    );
}
