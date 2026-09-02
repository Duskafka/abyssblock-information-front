"use client";

import {
    useCallback,
    useEffect,
    useId,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import useScrollLock from "./useScrollLock";

const SIZE = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-3xl",
    xl: "max-w-4xl",
} as const;

interface ModalProps {
    open: boolean;
    onClose: () => void;
    /** 스크린리더가 이 다이얼로그를 무엇이라 읽을지. 헤더에도 그대로 쓰인다. */
    title: ReactNode;
    children: ReactNode;
    size?: keyof typeof SIZE;
    /** 제목 줄 없이 본문만 그리고 싶을 때 (title은 aria-label로만 쓰인다) */
    hideHeader?: boolean;
    /** 패널에 덧붙일 클래스 */
    className?: string;
}

const FOCUSABLE =
    'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * 공용 모달.
 *
 * 이전에는 다섯 개 모달이 각자 인라인으로 구현돼 있었고
 * (헤더 로그인 / 모드 가이드 / 빌드 작성 / 아이템 등록 / 계정 탈퇴)
 * 배경 불투명도가 black/60·/70·/75·/80으로 제각각이었다.
 * 그리고 전부 포털도, 포커스 트랩도, body 스크롤 잠금도, role="dialog"도 없었다.
 * Escape는 헤더의 모바일 패널에만 있었고 로그인 모달조차 없었다.
 */
export default function Modal({
    open,
    onClose,
    title,
    children,
    size = "md",
    hideHeader = false,
    className = "",
}: ModalProps) {
    const titleId = useId();
    const panelRef = useRef<HTMLDivElement>(null);
    // 포털은 클라이언트에서만 붙일 수 있다.
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
                return;
            }
            if (event.key !== "Tab" || !panelRef.current) return;

            // 포커스가 모달 밖으로 새지 않게 가둔다.
            const items = Array.from(
                panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
            ).filter((el) => el.offsetParent !== null);
            if (items.length === 0) return;

            const first = items[0];
            const last = items[items.length - 1];
            const active = document.activeElement;

            if (event.shiftKey && active === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && active === last) {
                event.preventDefault();
                first.focus();
            }
        },
        [onClose],
    );

    // 모달 뒤의 페이지가 같이 스크롤되던 문제를 막는다.
    useScrollLock(open);

    // mounted가 의존성에 있어야 한다. 부모가 {isOpen && <Modal open />}로 조건부
    // 렌더하면 첫 렌더에서는 mounted가 false라 포털이 아직 없어 panelRef가 비어 있고,
    // mounted가 true로 바뀌는 리렌더에서 open은 그대로라 이 이펙트가 다시 돌지 않는다.
    // 그래서 포커스가 모달 안으로 들어가지 않고 body에 남아 있었다.
    useEffect(() => {
        if (!open || !mounted) return;

        document.addEventListener("keydown", handleKeyDown);

        // 열리면 패널 안쪽으로 포커스를 옮긴다.
        const firstFocusable =
            panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
        (firstFocusable ?? panelRef.current)?.focus();

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, mounted, handleKeyDown]);

    if (!open || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* 배경. 클릭하면 닫히지만, 키보드 사용자는 Escape를 쓰므로
          여기에는 포커스를 주지 않는다(aria-hidden). */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                tabIndex={-1}
                className={`relative z-10 w-full ${SIZE[size]} rounded-2xl border border-slate-800 bg-abyss-800 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto custom-scrollbar ${className}`}
            >
                {hideHeader ? (
                    <span id={titleId} className="sr-only">
                        {title}
                    </span>
                ) : (
                    <div className="flex items-center justify-between gap-4 border-b border-slate-800 px-6 py-4">
                        <h2
                            id={titleId}
                            className="flex items-center gap-2 text-base font-bold text-slate-100"
                        >
                            {title}
                        </h2>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="닫기"
                            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-800/60 hover:text-slate-200 focus-ring"
                        >
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                )}

                <div className="p-6">{children}</div>
            </div>
        </div>,
        document.body,
    );
}
