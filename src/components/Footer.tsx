import Link from "next/link";
import { SHELL_WIDTH } from "@/components/ui/PageShell";

/**
 * 전역 푸터.
 *
 * 이전에는 <footer> 요소가 사이트에 하나도 없었고, 저작권 문구가
 * 공지 상세 페이지 안쪽에 <div>로만 박혀 있었다.
 */
export default function Footer() {
    return (
        <footer className="border-t border-slate-800 bg-abyss-800/40">
            <div
                className={`${SHELL_WIDTH.wide} mx-auto flex flex-col gap-3 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6`}
            >
                <span>Abyssblock Info Operations</span>
                <nav className="flex items-center gap-4" aria-label="푸터">
                    <Link
                        href="/notice"
                        className="transition hover:text-amber-400 focus-ring"
                    >
                        공지사항
                    </Link>
                    <Link
                        href="/board"
                        className="transition hover:text-amber-400 focus-ring"
                    >
                        빌드 게시판
                    </Link>
                    <Link
                        href="/relics"
                        className="transition hover:text-amber-400 focus-ring"
                    >
                        유물 도감
                    </Link>
                </nav>
                <span>© 2026 Abyssblock. All rights reserved.</span>
            </div>
        </footer>
    );
}
