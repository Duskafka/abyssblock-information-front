"use client";

import {
    createContext,
    useCallback,
    useContext,
    useRef,
    useState,
    type ReactNode,
} from "react";
import Modal from "./Modal";

interface ConfirmOptions {
    title: string;
    description?: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    /** 삭제·탈퇴처럼 되돌릴 수 없는 동작이면 true */
    destructive?: boolean;
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

/**
 * window.confirm() 대체.
 *
 * 파괴적 동작(게시글 삭제, 매물 회수)이 네이티브 confirm에 의존하고 있었다.
 * Modal 위에 올려 두면 포커스 트랩·Escape·스크롤 잠금을 그대로 물려받는다.
 */
export function ConfirmProvider({ children }: { children: ReactNode }) {
    const [options, setOptions] = useState<ConfirmOptions | null>(null);
    const resolver = useRef<((value: boolean) => void) | null>(null);

    const confirm = useCallback<ConfirmFn>((opts) => {
        setOptions(opts);
        return new Promise<boolean>((resolve) => {
            resolver.current = resolve;
        });
    }, []);

    const settle = useCallback((result: boolean) => {
        resolver.current?.(result);
        resolver.current = null;
        setOptions(null);
    }, []);

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}
            <Modal
                open={options !== null}
                onClose={() => settle(false)}
                title={options?.title ?? ""}
                size="md"
            >
                <div className="space-y-5">
                    {options?.description && (
                        <div className="text-sm leading-relaxed text-slate-400">
                            {options.description}
                        </div>
                    )}
                    <div className="flex gap-2 text-xs font-bold">
                        <button
                            type="button"
                            onClick={() => settle(false)}
                            className="w-1/2 rounded-xl bg-slate-800 py-2.5 text-slate-300 transition hover:bg-slate-700 focus-ring"
                        >
                            {options?.cancelLabel ?? "취소"}
                        </button>
                        <button
                            type="button"
                            onClick={() => settle(true)}
                            className={`w-1/2 rounded-xl py-2.5 transition focus-ring ${
                                options?.destructive
                                    ? "bg-rose-500 text-white hover:bg-rose-400"
                                    : "bg-amber-400 text-slate-900 hover:bg-amber-300"
                            }`}
                        >
                            {options?.confirmLabel ?? "확인"}
                        </button>
                    </div>
                </div>
            </Modal>
        </ConfirmContext.Provider>
    );
}

export function useConfirm(): ConfirmFn {
    const ctx = useContext(ConfirmContext);
    if (!ctx) {
        throw new Error(
            "useConfirm은 ConfirmProvider 안에서만 쓸 수 있습니다.",
        );
    }
    return ctx;
}
