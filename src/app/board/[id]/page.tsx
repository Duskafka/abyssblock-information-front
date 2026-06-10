'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// 🧭 작성하신 중앙 관리 파일에서 나침반 이미지 경로 반환 함수를 import 합니다.
import { getCompassSrc } from '@/app/constants/compass';

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const markdownComponents = {
    h1: ({ ...props }) => <h1 className="text-2xl font-bold text-amber-400 mt-6 mb-3 border-b border-slate-800 pb-2" {...props} />,
    h2: ({ ...props }) => <h2 className="text-xl font-bold text-amber-400 mt-5 mb-2.5" {...props} />,
    h3: ({ ...props }) => <h3 className="text-lg font-bold text-amber-500 mt-4 mb-2" {...props} />,
    p: ({ ...props }) => <p className="my-3 leading-relaxed text-slate-300 text-[15px]" {...props} />,
    strong: ({ ...props }) => <strong className="font-extrabold text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded" {...props} />,
    em: ({ ...props }) => <em className="italic text-slate-400" {...props} />,
    ul: ({ ...props }) => <ul className="list-disc pl-6 my-3 space-y-1.5 text-slate-300 text-[15px]" {...props} />,
    ol: ({ ...props }) => <ol className="list-decimal pl-6 my-3 space-y-1.5 text-slate-300 text-[15px]" {...props} />,
    li: ({ ...props }) => <li className="marker:text-amber-400 text-slate-300" {...props} />,
    code: ({ ...props }) => <code className="bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded font-mono text-xs" {...props} />,
    blockquote: ({ ...props }) => <blockquote className="border-l-4 border-slate-600 pl-4 italic text-slate-400 my-3 bg-slate-900/30 py-1 rounded-r" {...props} />,
};

export default function PostDetailPage() {
    const router = useRouter();
    const params = useParams();
    const postId = params.id as string;

    const [user, setUser] = useState<any>(null);
    const [post, setPost] = useState<any>(null);
    const [relics, setRelics] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                // 1. 유저 세션 로드
                const { data: { session } } = await supabase.auth.getSession();
                setUser(session?.user ?? null);

                // 2. 유물 정보 로드 및 Map 구성
                const { data: relicData } = await supabase.from('relics').select('*');
                const relicList = relicData || [];
                setRelics(relicList);
                const relicMap = new Map(relicList.map(r => [r.id, r]));

                // 3. 게시글 정보 단독 로드 (조인 에러 영구 차단)
                const { data: postData, error } = await supabase
                    .from('posts')
                    .select('*')
                    .eq('id', postId)
                    .single();

                if (error) throw error;
                if (!postData) return;

                // 4. 작성자의 프로필 정보(나침반 등급) 개별 조회
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('compass_rank')
                    .eq('id', postData.user_id)
                    .single();

                // 💡 폴백 기본값을 시스템 설계에 맞춰 'NULL'로 연동합니다.
                const authorRank = profileData?.compass_rank || 'NULL';

                // 5. 메모리 상에서 데이터 가공 후 상태 주입
                const formattedPost = {
                    ...postData,
                    compass_rank: authorRank,
                    m1: relicMap.get(postData.main_relic_1) ? { korean_name: relicMap.get(postData.main_relic_1).korean_name, image_url: relicMap.get(postData.main_relic_1).image_url } : null,
                    m2: relicMap.get(postData.main_relic_2) ? { korean_name: relicMap.get(postData.main_relic_2).korean_name, image_url: relicMap.get(postData.main_relic_2).image_url } : null,
                    m3: relicMap.get(postData.main_relic_3) ? { korean_name: relicMap.get(postData.main_relic_3).korean_name, image_url: relicMap.get(postData.main_relic_3).image_url } : null,
                };

                setPost(formattedPost);
            } catch (err) {
                console.error(err);
                alert('게시글을 불러올 수 없거나 삭제된 게시글입니다.');
                router.push('/board');
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [postId, router]);

    const handleDeletePost = async () => {
        if (!window.confirm('정말로 이 공략 게시글을 삭제하시겠습니까? ⚠️\n삭제된 데이터는 복구할 수 없습니다.')) {
            return;
        }

        try {
            setIsDeleting(true);

            const { error } = await supabase
                .from('posts')
                .delete()
                .eq('id', postId);

            if (error) throw error;

            alert('공략 게시글이 안전하게 삭제되었습니다. 🗑️');
            router.push('/board');
            router.refresh();
        } catch (err: any) {
            alert(`삭제 실패: ${err.message}`);
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f141c] text-slate-100 flex items-center justify-center">
                <p className="text-sm text-slate-400">공략 본문을 불러오는 중...</p>
            </div>
        );
    }

    if (!post) return null;

    const isAuthor = user && user.id === post.user_id;

    // 🧭 중앙 함수를 활용해 등급별 나침반 이미지 소스를 동적으로 매핑합니다.
    const currentRank = post.compass_rank || 'NULL';
    const compassSrc = getCompassSrc(currentRank);

    return (
        <div className="min-h-screen bg-[#0f141c] text-slate-100 font-sans">
            <main className="max-w-5xl mx-auto px-6 py-10 space-y-6">

                {/* 상단 서브 네비게이션바 */}
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-200">💎 상세 빌드 공략</h2>
                        <p className="text-xs text-slate-400 mt-1">대원님이 등록하신 상세 조합 셋업과 메커니즘을 확인하세요.</p>
                    </div>
                    <Link
                        href="/board"
                        className="text-xs text-amber-400 bg-amber-400/5 border border-amber-400/20 px-4 py-2 rounded-xl hover:bg-amber-400/10 transition font-bold tracking-wide"
                    >
                        ← 공략 목록으로 가기
                    </Link>
                </div>

                {/* 메인 카드 박스 */}
                <div className="bg-[#161d2a] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">

                    {/* 타이틀 영역 */}
                    <div className="border-b border-slate-800/80 pb-5 flex justify-between items-start gap-4">
                        <div className="space-y-3">
                            <h2 className="text-2xl font-extrabold text-slate-100 leading-snug">{post.title}</h2>

                            <div className="text-xs text-slate-400 flex flex-wrap items-center gap-y-2">
                                <span>작성자:</span>

                                {/* 🧭 등급 나침반 배지 */}
                                <div className="flex items-center gap-1 bg-[#0f141c] px-2 py-0.5 rounded-md border border-slate-800 mx-1.5 shrink-0" title={`작성자 등급: ${currentRank}`}>
                                    <img
                                        src={compassSrc}
                                        alt={currentRank}
                                        className="w-3.5 h-3.5 object-contain"
                                    />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{currentRank}</span>
                                </div>

                                <span className="text-slate-200 font-semibold">{post.author_name}</span>
                                <span className="mx-2.5 text-slate-700">|</span>
                                <span>🕒 등록일: <span className="text-slate-300">{new Date(post.created_at).toLocaleString()}</span></span>

                                {post.updated_at && (
                                    <>
                                        <span className="mx-2.5 text-slate-700">|</span>
                                        <span className="text-amber-400/90 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shadow-sm">
                                            ✏️ 수정됨: {new Date(post.updated_at).toLocaleString()}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* 본인 글일 때만 우측 상단에 수정 및 삭제 버튼 묶음 배치 */}
                        {isAuthor && (
                            <div className="flex items-center gap-2 shrink-0">
                                <Link
                                    href={`/board/${post.id}/edit`}
                                    className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-xs px-4 py-2.5 rounded-xl transition shadow-md tracking-wide"
                                >
                                    📝 수정
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleDeletePost}
                                    disabled={isDeleting}
                                    className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-md disabled:opacity-50"
                                >
                                    {isDeleting ? '지우는 중...' : '🗑️ 삭제'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 빌드 조합 요약 레이아웃 */}
                    <div className="bg-[#0f141c]/60 p-5 rounded-xl border border-slate-800/80 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-xs font-bold text-amber-400 w-16 shrink-0">👑 핵심 유물:</span>
                            <div className="flex flex-wrap gap-2">
                                {[post.m1, post.m2, post.m3].map((relic, idx) => relic ? (
                                    <div key={idx} className="flex items-center gap-2 bg-[#161d2a] border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-medium shadow-sm" title={relic.korean_name}>
                                        <img src={relic.image_url} alt="" className="w-4 h-4 object-contain" />
                                        <span className="text-slate-200">{relic.korean_name}</span>
                                    </div>
                                ) : null)}
                            </div>
                        </div>

                        {post.side_relics && post.side_relics.length > 0 && (
                            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800/40">
                                <span className="text-xs font-bold text-slate-400 w-16 shrink-0">🔗 사이드:</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {post.side_relics.map((sideId: string) => {
                                        const relicInfo = relics.find(r => r.id === sideId);
                                        if (!relicInfo) return null;
                                        return (
                                            <div key={sideId} className="flex items-center gap-1.5 bg-[#1a2332] border border-slate-800/60 rounded-lg px-2.5 py-1 text-[11px]" title={relicInfo.korean_name}>
                                                <img src={relicInfo.image_url} alt="" className="w-3.5 h-3.5 object-contain" />
                                                <span className="text-slate-400">{relicInfo.korean_name}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 📝 마크다운 공략 본문 상세 영역 */}
                    <div className="bg-[#0f141c] p-6 md:p-8 rounded-xl border border-slate-800 min-h-[350px] shadow-inner">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                            {post.content}
                        </ReactMarkdown>
                    </div>

                </div>
            </main>
        </div>
    );
}