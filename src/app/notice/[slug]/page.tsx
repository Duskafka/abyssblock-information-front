import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import Link from 'next/link';

export async function generateStaticParams() {
    const directory = path.join(process.cwd(), 'src/content/notice');
    if (!fs.existsSync(directory)) return [];

    const files = fs.readdirSync(directory);
    return files
        .filter(filename => filename.endsWith('.md'))
        .map((filename) => ({
            slug: filename.replace('.md', ''),
        }));
}

// 💡 Next.js 최신 규격에 맞춰 params를 Promise 타입으로 정의합니다.
interface Props {
    params: Promise<{ slug: string }>;
}

export default async function NoticeDetailPage({ params }: Props) {
    // 💡 [핵심 버그 수정]: params는 비동기로 처리해야 undefined가 발생하지 않습니다.
    const { slug } = await params;

    const filePath = path.join(process.cwd(), 'src/content/notice', `${slug}.md`);

    // 파일이 없을 경우를 대비한 방어 로직
    if (!fs.existsSync(filePath)) {
        return (
            <div className="min-h-screen bg-[#0f141c] flex items-center justify-center text-slate-400">
                존재하지 않는 공지사항입니다.
            </div>
        );
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();

    return (
        // 💡 [디자인 리뉴얼] 기존 대시보드와 어울리는 다크 테마 적용
        <div className="min-h-screen bg-[#0f141c] text-slate-200">
            <main className="max-w-3xl mx-auto py-12 px-6 animate-fade-in">

                {/* ⬅️ 뒤로가기 버튼 */}
                <Link
                    href="/notice"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-amber-400 transition mb-6 group"
                >
                    <span className="transform group-hover:-translate-x-0.5 transition-transform">←</span>
                    <span>목록으로 돌아가기</span>
                </Link>

                {/* 📢 게시글 헤더 영역 */}
                <div className="space-y-3 pb-6 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                            Notice
                        </span>
                        {data.date && (
                            <span className="text-xs font-mono text-slate-500">{data.date}</span>
                        )}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                        {data.title}
                    </h1>
                </div>

                {/* 📝 마크다운 본문 영역 (Tailwind Typography 스타일 가공) */}
                {/* prose-invert를 주어 다크모드 텍스트가 깨지지 않고 자연스럽게 나오도록 처리했습니다 */}
                <div className="py-8 border-b border-slate-800/60">
                    <div
                        className="prose prose-invert max-w-none text-slate-300
                            prose-headings:text-white prose-headings:font-bold
                            prose-strong:text-amber-400 prose-strong:font-bold
                            prose-links:text-amber-400 hover:prose-links:underline
                            prose-ul:list-disc prose-ol:list-decimal
                            prose-code:text-amber-300 prose-code:bg-slate-950 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                            leading-relaxed md:leading-loose text-sm md:text-base"
                        dangerouslySetInnerHTML={{ __html: contentHtml }}
                    />
                </div>

                {/* 🤝 하단 꼬리말 */}
                <div className="mt-6 flex justify-between items-center text-xs text-slate-500">
                    <span>Abyssblock Info Operations</span>
                    <span>© 2026 Abyssblock. All rights reserved.</span>
                </div>

            </main>
        </div>
    );
}