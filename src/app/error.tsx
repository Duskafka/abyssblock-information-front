"use client";

import { useEffect } from "react";

/**
 * 라우트 에러 바운더리.
 *
 * 이전에는 error.tsx가 없어 렌더 중 예외가 나면 Next 기본 화면이 떴다.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto flex max-w-md flex-col items-center gap-4 px-6 py-24 text-center">
      <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-rose-400">
        Error
      </span>
      <h1 className="text-2xl font-black tracking-tight text-slate-100 sm:text-3xl">
        문제가 발생했습니다
      </h1>
      <p className="text-sm leading-relaxed text-slate-400">
        일시적인 오류일 수 있습니다. 다시 시도해 주세요.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-bold text-slate-900 shadow transition hover:bg-amber-300 focus-ring"
      >
        다시 시도
      </button>
    </section>
  );
}
