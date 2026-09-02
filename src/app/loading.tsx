/**
 * 라우트 전환 중 표시되는 기본 스켈레톤.
 *
 * 이전에는 loading.tsx가 하나도 없어 라우트 레벨 Suspense 폴백이 없었고,
 * 각 페이지가 문자열 로딩 문구를 직접 렌더하면서 높이를 예약하지 않아
 * 콘텐츠가 들어오는 순간 레이아웃이 튀었다.
 */
export default function Loading() {
  return (
    <div
      className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">불러오는 중입니다.</span>
      <div className="h-10 w-56 animate-pulse rounded-xl bg-abyss-800" />
      <div className="h-4 w-80 max-w-full animate-pulse rounded bg-abyss-800" />
      <div className="grid gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl border border-slate-800 bg-abyss-800"
          />
        ))}
      </div>
    </div>
  );
}
