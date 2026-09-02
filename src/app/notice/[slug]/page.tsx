import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Markdown from '@/components/Markdown';
import { notFound } from 'next/navigation';
import PageShell from '@/components/ui/PageShell';

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

interface Props {
    params: Promise<{ slug: string }>;
}

// 공지마다 제목이 달라지도록 frontmatter에서 읽어 온다.
// 이전에는 모든 라우트가 루트 레이아웃의 제목 하나를 공유했다.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const filePath = path.join(process.cwd(), 'src/content/notice', `${slug}.md`);
    if (!fs.existsSync(filePath)) return { title: '공지사항' };

    const { data } = matter(fs.readFileSync(filePath, 'utf8'));
    const title = data.title ?? '공지사항';
    const description = data.description ?? 'Abyssblock Information 공지사항';
    return {
        title,
        description,
        openGraph: { title, description },
    };
}

export default async function NoticeDetailPage({ params }: Props) {
    const { slug } = await params;
    const filePath = path.join(process.cwd(), 'src/content/notice', `${slug}.md`);

    // 없는 slug는 인라인 메시지 + HTTP 200이라 검색엔진이 실재하는 문서로 색인했다.
    if (!fs.existsSync(filePath)) {
        notFound();
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    // matter를 통해 frontmatter(메타데이터)와 실제 본문(content)을 분리
    const { data, content } = matter(fileContents);

    return (
        <div className="text-slate-200">
            <PageShell width="narrow" className="animate-fade-in">

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
                        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-2xs font-bold uppercase tracking-wider">
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
                    <Markdown size="article">{content}</Markdown>
                </div>

            </PageShell>
        </div>
    );
}