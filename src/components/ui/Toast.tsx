"use client";

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";

type ToastTone = "success" | "error" | "info";

interface Toast {
    id: number;
    tone: ToastTone;
    message: string;
}

interface ToastApi {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const TONE: Record<ToastTone, string> = {
    success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    error: "border-rose-500/40 bg-rose-500/10 text-rose-300",
    info: "border-slate-700 bg-abyss-800 text-slate-200",
};

const ICON: Record<ToastTone, string> = {
    success: "✅",
    error: "⚠️",
    info: "💡",
};

/**
 * 토스트 알림.
 *
 * 이전에는 모든 검증·에러 피드백이 window.alert() 38곳에 의존했다.
 * 네이티브 다이얼로그는 다크 테마를 깨고 모바일에서 흐름을 끊는다.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const nextId = useRef(0);

    const push = useCallback((tone: ToastTone, message: string) => {
        const id = nextId.current++;
        setToasts((prev) => [...prev, { id, tone, message }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const api = useMemo<ToastApi>(
        () => ({
            success: (m) => push("success", m),
            error: (m) => push("error", m),
            info: (m) => push("info", m),
        }),
        [push],
    );

    return (
        <ToastContext.Provider value={api}>
            {children}
            {/* 스크린리더가 새 알림을 읽도록 라이브 리전으로 둔다. */}
            <div
                role="status"
                aria-live="polite"
                className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2"
            >
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`pointer-events-auto flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium shadow-2xl backdrop-blur animate-fade-in ${TONE[t.tone]}`}
                    >
                        <span aria-hidden="true">{ICON[t.tone]}</span>
                        <span className="flex-1 leading-relaxed whitespace-pre-line">
                            {t.message}
                        </span>
                        <button
                            type="button"
                            onClick={() =>
                                setToasts((prev) =>
                                    prev.filter((x) => x.id !== t.id),
                                )
                            }
                            aria-label="알림 닫기"
                            className="shrink-0 rounded p-0.5 opacity-60 transition hover:opacity-100 focus-ring"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast(): ToastApi {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error("useToast는 ToastProvider 안에서만 쓸 수 있습니다.");
    }
    return ctx;
}
