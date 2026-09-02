'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Markdown from '@/components/Markdown';

// 🧭 비속어, 나침반 및 로컬 유물 데이터 import
import { getCompassSrc } from '@/app/constants/compass';
import { RELICS_DATA } from '@/app/constants/relics';
import PageShell from '@/components/ui/PageShell';
import PixelImage from '@/components/ui/PixelImage';
import { useToast } from '@/components/ui/Toast';
import { useConfirm } from '@/components/ui/ConfirmDialog';
import { getBrowserSupabase } from '@/lib/supabase';
import type { PostWithRelics } from '@/lib/db-types';
import type { User } from '@supabase/supabase-js';

const supabase = getBrowserSupabase();


export default function PostDetailPage() {
    const toast = useToast();
    const confirmAction = useConfirm();
    const router = useRouter();
    const params = useParams();
    const postId = params.id as string;

    const [user, setUser] = useState<User | null>(null);
    const [post, setPost] = useState<PostWithRelics | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                // 1. 유저 세션 로드
                const { data: { session } } = await supabase.auth.getSession();
                setUser(session?.user ?? null);

                // 2. RELICS_DATA 기반 Map 구성 (DB 파싱 제거)
                const relicMap = new Map(RELICS_DATA.map(r => [r.id, r]));

                // 3. 게시글 정보 단독 로드
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

                const authorRank = profileData?.compass_rank || 'NULL';

                // 5. 로컬 유물 데이터 매핑
                const formattedPost: PostWithRelics = {
                    ...postData,
                    compass_rank: authorRank,
                    m1: relicMap.get(postData.main_relic_1) ? { korean_name: relicMap.get(postData.main_relic_1)!.koreanName, image_url: relicMap.get(postData.main_relic_1)!.imageUrl } : null,
                    m2: relicMap.get(postData.main_relic_2) ? { korean_name: relicMap.get(postData.main_relic_2)!.koreanName, image_url: relicMap.get(postData.main_relic_2)!.imageUrl } : null,
                    m3: relicMap.get(postData.main_relic_3) ? { korean_name: relicMap.get(postData.main_relic_3)!.koreanName, image_url: relicMap.get(postData.main_relic_3)!.imageUrl } : null,
                };

                setPost(formattedPost);
            } catch (err) {
                console.error(err);
                toast.error('게시글을 불러올 수 없거나 삭제된 게시글입니다.');
                router.push('/board');
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [postId, router]);

    const handleDeletePost = async () => {
        const approved = await confirmAction({
            title: '⚠️ 공략 게시글을 삭제할까요?',
            description: '삭제된 데이터는 복구할 수 없습니다.',
            confirmLabel: '삭제하기',
            destructive: true,
        });
        if (!approved) return;

        try {
            setIsDeleting(true);

            const { error } = await supabase
                .from('posts')
                .delete()
                .eq('id', postId);

            if (error) throw error;

            toast.success('공략 게시글이 안전하게 삭제되었습니다. 🗑️');
            router.push('/board');
            router.refresh();
        } catch (err) {
            toast.error(`삭제 실패: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <PageShell className="space-y-6">
                <p className="text-sm text-slate-400" role="status" aria-live="polite">
                    공략 본문을 불러오는 중...
                </p>
            </PageShell>
        );
    }

    // 이전에는 return null이라 없는 글이 완전한 백지 화면으로 떴다.
    if (!post) notFound();

    const isAuthor = user && user.id === post.user_id;

    // 🧭 등급별 나침반 이미지 소스를 동적으로 매핑합니다.
    const currentRank = post.compass_rank || 'NULL';
    const compassSrc = getCompassSrc(currentRank);

    return (
        <div>
            <PageShell className="space-y-6">

                {/* 상단 서브 네비게이션바 */}
                <div className="flex flex-col gap-3 border-b border-slate-800 pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-200">💎 상세 빌드 공략</h2>
                        <p className="text-sm text-slate-400 mt-1">대원님이 등록하신 상세 조합 셋업과 메커니즘을 확인하세요.</p>
                    </div>
                    <Link
                        href="/board"
                        className="self-start shrink-0 text-xs text-amber-400 bg-amber-400/5 border border-amber-400/20 px-4 py-2 rounded-xl hover:bg-amber-400/10 transition font-bold tracking-wide"
                    >
                        ← 공략 목록으로 가기
                    </Link>
                </div>

                {/* 메인 카드 박스 */}
                <div className="bg-abyss-800 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">

                    {/* 타이틀 영역 */}
                    <div className="border-b border-slate-800/80 pb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 space-y-3">
                            <h1 className="text-2xl font-extrabold text-slate-100 leading-snug">{post.title}</h1>

                            <div className="text-xs text-slate-400 flex flex-wrap items-center gap-y-2">
                                <span>작성자:</span>

                                {/* 🧭 등급 나침반 배지 */}
                                <div className="flex items-center gap-1 bg-abyss-900 px-2 py-0.5 rounded-md border border-slate-800 mx-1.5 shrink-0" title={`작성자 등급: ${currentRank}`}>
                                    <PixelImage
                                        src={compassSrc}
                                        alt={currentRank}
                                        className="w-3.5 h-3.5 object-contain" width={14} height={14} />
                                    <span className="text-2xs font-bold text-slate-400 uppercase tracking-tight">{currentRank}</span>
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

                        {/* 작성자 본인 제어 버튼 */}
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
                                    className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-md disabled:opacity-50 cursor-pointer"
                                >
                                    {isDeleting ? '지우는 중...' : '🗑️ 삭제'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 빌드 조합 요약 레이아웃 */}
                    <div className="bg-abyss-900/60 p-5 rounded-xl border border-slate-800/80 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-xs font-bold text-amber-400 w-16 shrink-0">👑 핵심 유물:</span>
                            <div className="flex flex-wrap gap-2">
                                {[post.m1, post.m2, post.m3].map((relic, idx) => relic ? (
                                    <div key={idx} className="flex items-center gap-2 bg-abyss-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-medium shadow-sm" title={relic.korean_name}>
                                        <PixelImage src={relic.image_url} alt="" className="w-4 h-4 object-contain" width={16} height={16} />
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
                                        const relicInfo = RELICS_DATA.find(r => r.id === sideId);
                                        if (!relicInfo) return null;
                                        return (
                                            <div key={sideId} className="flex items-center gap-1.5 bg-abyss-700 border border-slate-800/60 rounded-lg px-2.5 py-1 text-2xs" title={relicInfo.koreanName}>
                                                <PixelImage src={relicInfo.imageUrl} alt="" className="w-3.5 h-3.5 object-contain" width={14} height={14} />
                                                <span className="text-slate-400">{relicInfo.koreanName}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 📝 마크다운 공략 본문 상세 영역 */}
                    <div className="bg-abyss-900 p-6 md:p-8 rounded-xl border border-slate-800 min-h-[350px] shadow-inner">
                        <Markdown>{post.content}</Markdown>
                    </div>

                </div>
            </PageShell>
        </div>
    );
}