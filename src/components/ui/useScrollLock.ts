"use client";

import { useEffect } from "react";

/**
 * 열려 있는 동안 뒤 페이지 스크롤을 잠근다. (모달 · 모바일 내비 패널)
 *
 * <body>에만 걸어야 한다. <html>에 함께 걸면 이 레이아웃(html이 h-full,
 * body가 min-h-full)에서는 스크롤된 상태로 잠글 때 화면이 문서 맨 위로
 * 튀면서 sticky 헤더가 위로 밀려 올라간다. body의 overflow는 뷰포트로
 * 전파되므로 body만으로 충분하다.
 *
 * 모달 위에 또 다른 잠금이 겹칠 수 있으므로 참조 수를 세어, 마지막 잠금이
 * 풀릴 때만 원래 값으로 되돌린다.
 */
let lockCount = 0;
let previousOverflow = "";

export default function useScrollLock(active: boolean) {
    useEffect(() => {
        if (!active) return;

        const { body } = document;

        if (lockCount === 0) {
            previousOverflow = body.style.overflow;
            body.style.overflow = "hidden";
        }
        lockCount += 1;

        return () => {
            lockCount -= 1;
            if (lockCount === 0) {
                body.style.overflow = previousOverflow;
            }
        };
    }, [active]);
}
