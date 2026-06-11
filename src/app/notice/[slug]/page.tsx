import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

// 🎨 기존 빌드 게시판의 디자인 시스템을 그대로 계승한 공지사항 컴포넌트 매핑
const noticeMarkdownComponents = {
    h1: ({ ...props }) => <h1 className="text-2xl font-bold text-amber-400 mt-8 mb-4 border-b border-slate-800 pb-2 tracking-tight" {...props} />,
    h2: ({ ...props }) => <h2 className="text-xl font-bold text-amber-400 mt-6 mb-3 tracking-tight" {...props} />,
    h3: ({ ...props }) => <h3 className="text-lg font-bold text-amber-500 mt-5 mb-2 tracking-tight" {...props} />,
    p: ({ ...props }) => <p className="my-4 leading-relaxed text-slate-300 text-[15px] md:text-base" {...props} />,
    // 약관에서 중요 문구를 주황색 상자로 예쁘게 강조하는 스타일
    strong: ({ ...props }) => <strong className="font-extrabold text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/10 shadow-sm" {...props} />,
    em: ({ ...props }) => <em className="italic text-slate-400" {...props} />,
    ul: ({ ...props }) => <ul className="list-disc pl-6 my-4 space-y-2 text-slate-300 text-[15px] md:text-base" {...props} />,
    ol: ({ ...props }) => <ol className="list-decimal pl-6 my-4 space-y-2 text-slate-300 text-[15px] md:text-base" {...props} />,
    li: ({ ...props }) => <li className="marker:text-amber-400 text-slate-300" {...props} />,
    code: ({ ...props }) => <code className="bg-slate-950 text-amber-300 px-1.5 py-0.5 rounded font-mono text-xs border border-slate-800" {...props} />,
    // 인용구 텍스트 (약관 요약박스용 고도화)
    blockquote: ({ ...props }) => (
        <blockquote className="border-l-4 border-amber-500 pl-4 italic text-slate-300 my-5 bg-amber-500/5 py-3 px-4 rounded-r-xl border-y border-r border-slate-800/40" {...props} />
    ),
};

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function NoticeDetailPage({ params }: Props) {
    const { slug } = await params;
    const filePath = path.join(process.cwd(), 'src/content/notice', `${slug}.md`);

    if (!fs.existsSync(filePath)) {
        return (
            <div className="min-h-screen bg-[#0f141c] flex items-center justify-center text-slate-400">
                존재하지 않는 공지사항입니다.
            </div>
        );
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    // matter를 통해 frontmatter(메타데이터)와 실제 본문(content)을 분리
    const { data, content } = matter(fileContents);

    return (
        <div className="min-h-screen bg-[#0f141c] text-slate-200">
            <main className="max-w-3xl mx-auto py-12 px-6 animate-fade-in">

                {/* 뒤로가기 버튼 */}
                <Link
                    href="/notice"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-amber-400 transition mb-6 group"
                >
                    <span className="transform group-hover:-translate-x-0.5 transition-transform">←</span>
                    <span>목록으로 돌아가기</span>
                </Link>

                {/* 공지 상단 헤더 */}
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

                {/* 📝 옛날 빌드 게시판 방식으로 컴포넌트 맵핑 매립 */}
                <div className="py-6 border-b border-slate-800/60">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={noticeMarkdownComponents}
                    >
                        {content}
                    </ReactMarkdown>
                </div>

                {/* 하단 꼬리말 */}
                <div className="mt-6 flex justify-between items-center text-xs text-slate-500">
                    <span>Abyssblock Info Operations</span>
                    <span>© 2026 Abyssblock. All rights reserved.</span>
                </div>

            </main>
        </div>
    );
}