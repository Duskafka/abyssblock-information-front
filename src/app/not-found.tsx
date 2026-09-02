import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-md flex-col items-center gap-4 px-6 py-24 text-center">
      <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-400">
        404
      </span>
      <h1 className="text-2xl font-black tracking-tight text-slate-100 sm:text-3xl">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="text-sm leading-relaxed text-slate-400">
        주소가 바뀌었거나 삭제된 문서일 수 있습니다.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-bold text-slate-900 shadow transition hover:bg-amber-300 focus-ring"
      >
        시세 현황판으로 돌아가기
      </Link>
    </section>
  );
}
