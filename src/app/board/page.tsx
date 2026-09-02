'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import CreateBuildModal from './components/CreateBuildModal';
import BuildPostCard from './components/BuildPostCard';

import { RELICS_DATA } from '@/app/constants/relics';
import PageShell from '@/components/ui/PageShell';
import PageHeading from '@/components/ui/PageHeading';
import { useToast } from '@/components/ui/Toast';
import { getBrowserSupabase } from '@/lib/supabase';
import type { PostRow, PostWithRelics, RelicBadge } from '@/lib/db-types';
import type { User } from '@supabase/supabase-js';

const supabase = getBrowserSupabase();

export default function BoardPage() {
    const toast = useToast();
    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<PostWithRelics[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeFilterTab, setActiveFilterTab] = useState<string>('전체');

    const fetchBoardData = async () => {
        try {
            setLoading(true);

            const relicMap = new Map(RELICS_DATA.map(r => [r.id, r]));

            const { data: rawPosts } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (!rawPosts) {
                setPosts([]);
                return;
            }

            const { data: profileData } = await supabase.from('profiles').select('id, compass_rank');
            const profileMap = new Map(profileData?.map(p => [p.id, p.compass_rank]) || []);

            const toBadge = (relicId: string | null): RelicBadge | null => {
                const relic = relicId ? relicMap.get(relicId) : undefined;
                return relic ? { korean_name: relic.koreanName, image_url: relic.imageUrl } : null;
            };

            const formattedPosts: PostWithRelics[] = (rawPosts as PostRow[]).map(post => {
                const compassRank = (profileMap.get(post.user_id) as string | null) || 'NULL';
                return {
                    ...post,
                    compass_rank: compassRank,
                    m1: toBadge(post.main_relic_1),
                    m2: toBadge(post.main_relic_2),
                    m3: toBadge(post.main_relic_3),
                };
            });

            setPosts(formattedPosts);
        } catch (err) {
            console.error("데이터 로드 중 장애 발생:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        fetchBoardData();
        return () => subscription.unsubscribe();
    }, []);

    const filteredPosts = posts.filter(post => {
        if (activeFilterTab === '전체') return true;
        return post.job === activeFilterTab;
    });

    return (
        <div>
            <PageShell className="space-y-6">
                <PageHeading
                    description="유저들이 연구해낸 최적의 유물 시너지를 확인해 보세요."
                    actions={
                        <button
                            type="button"
                            onClick={() => {
                                if (!user) return toast.error('로그인 후 이용할 수 있습니다.');
                                setIsModalOpen(true);
                            }}
                            className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg cursor-pointer focus-ring"
                        >
                            <span>📝</span> 빌드 공유하기
                        </button>
                    }
                >
                    💬 빌드 공유 게시판
                </PageHeading>

                <div className="flex flex-wrap gap-2 bg-abyss-800 p-1.5 rounded-xl border border-slate-800 w-full sm:w-fit">
                    {['전체', '기사', '마법사수', '사냥꾼'].map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            aria-pressed={activeFilterTab === tab}
                            onClick={() => setActiveFilterTab(tab)}
                            className={`px-4 py-2 rounded-lg font-bold text-xs transition cursor-pointer ${
                                activeFilterTab === tab ? 'bg-amber-400 text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-20 text-slate-500 bg-abyss-800 rounded-2xl border border-slate-800">공략 대장을 불러오는 중...</div>
                ) : filteredPosts.length === 0 ? (
                    <div className="text-center py-20 text-slate-500 bg-abyss-800 rounded-2xl border border-slate-800 border-dashed">
                        {activeFilterTab === '전체' ? '아직 등록된 유물 빌드가 없습니다.' : `⚔️ [${activeFilterTab}] 직업군에 등록된 유물 빌드가 없습니다.`}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredPosts.map(post => (
                            <BuildPostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </PageShell>

            {isModalOpen && user && (
                <CreateBuildModal
                    user={user}
                    supabase={supabase}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        fetchBoardData();
                    }}
                />
            )}
        </div>
    );
}