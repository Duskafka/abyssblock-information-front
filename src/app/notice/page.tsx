import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

export default function NoticeListPage() {
    const postsDirectory = path.join(process.cwd(), 'src/content/notice');

    let posts: any[] = [];

    // 파일 읽기 실패 방어 로직 포함
    if (fs.existsSync(postsDirectory)) {
        const filenames = fs.readdirSync(postsDirectory);
        posts = filenames
            .filter(filename => filename.endsWith('.md'))
            .map((filename) => {
                const slug = filename.replace('.md', '');
                const filePath = path.join(postsDirectory, filename);
                const fileContents = fs.readFileSync(filePath, 'utf8');
                const { data } = matter(fileContents);

                return {
                    slug,
                    title: data.title || '제목 없음',
                    date: data.date || '',
                    description: data.description || '',
                };
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return (
        // 💡 [배경 튜닝] min-h-screen과 기존 전체 테마 배경색인 bg-[#0f141c]를 명확하게 주입합니다.
        <div className="min-h-screen bg-[#0f141c] text-slate-200 select-none">
            <main className="max-w-4xl mx-auto py-12 px-6 md:px-8 animate-fade-in">

                {/* 📢 상단 헤더 타이틀 영역 (시세 현황판 타이틀 스타일 계승) */}
                <div className="flex items-center gap-3 mb-10 border-b border-slate-800/60 pb-5">
                    <span className="text-2xl">📢</span>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">
                        공지사항 <span className="text-amber-400 font-medium text-xs md:text-sm ml-2">Abyssblock Patch & News</span>
                    </h1>
                </div>

                {/* 게시글 리스트 래퍼 */}
                {posts.length === 0 ? (
                    <div className="text-center py-20 bg-[#161d2a]/50 rounded-2xl border border-slate-800/80 text-slate-500 text-sm backdrop-blur">
                        등록된 공지사항이 아직 없습니다.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <Link
                                href={`/notice/${post.slug}`}
                                key={post.slug}
                                // 💡 [카드 디자인 리뉴얼] 배경색 밀도와 그라데이션, 호버링 효과 극대화
                                className="group block p-6 bg-[#161d2a]/70 hover:bg-[#1c2637]/90 rounded-2xl border border-slate-800/80 hover:border-amber-500/40 transition-all duration-300 shadow-lg hover:shadow-amber-500/5 translate-y-0 hover:-translate-y-0.5"
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="space-y-2">
                                        {/* 제목: 호버 시 노란색으로 부드럽게 강조 */}
                                        <h2 className="text-lg md:text-xl font-bold text-slate-100 group-hover:text-amber-400 transition-colors duration-200">
                                            {post.title}
                                        </h2>
                                        {/* 설명글 */}
                                        <p className="text-sm text-slate-400 leading-relaxed max-w-2xl line-clamp-2">
                                            {post.description}
                                        </p>
                                    </div>

                                    {/* 📅 날짜 배지 */}
                                    {post.date && (
                                        <span className="shrink-0 text-[11px] md:text-xs font-mono px-2.5 py-1 bg-slate-950/60 text-slate-400 border border-slate-800/60 rounded-lg">
                                            {post.date}
                                        </span>
                                    )}
                                </div>

                                {/* 하단 화살표 힌트 */}
                                <div className="mt-4 flex justify-end items-center gap-1 text-[11px] font-semibold text-slate-500 group-hover:text-amber-500/80 transition-colors">
                                    <span>자세히 보기</span>
                                    <span className="transform group-hover:translate-x-0.5 transition-transform">→</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}