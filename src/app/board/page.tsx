'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import CreateBuildModal from './components/CreateBuildModal';
import BuildPostCard from './components/BuildPostCard';

import { RELICS_DATA } from '@/app/constants/relics';

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BoardPage() {
    const [user, setUser] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
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

            const formattedPosts = rawPosts.map(post => {
                const compassRank = profileMap.get(post.user_id) || 'NULL';
                return {
                    ...post,
                    compass_rank: compassRank,
                    m1: relicMap.get(post.main_relic_1) ? {
                        korean_name: relicMap.get(post.main_relic_1)!.koreanName,
                        image_url: relicMap.get(post.main_relic_1)!.imageUrl
                    } : null,
                    m2: relicMap.get(post.main_relic_2) ? {
                        korean_name: relicMap.get(post.main_relic_2)!.koreanName,
                        image_url: relicMap.get(post.main_relic_2)!.imageUrl
                    } : null,
                    m3: relicMap.get(post.main_relic_3) ? {
                        korean_name: relicMap.get(post.main_relic_3)!.koreanName,
                        image_url: relicMap.get(post.main_relic_3)!.imageUrl
                    } : null,
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
        <div className="min-h-screen bg-[#0f141c] text-slate-100 font-sans">
            <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-200">💬 빌드 공유 게시판</h2>
                        <p className="text-xs text-slate-400 mt-1">유저들이 연구해낸 최적의 유물 시너지를 확인해 보세요.</p>
                    </div>
                    <button
                        onClick={() => {
                            if (!user) return alert('로그인 후 이용할 수 있습니다.');
                            setIsModalOpen(true);
                        }}
                        className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg cursor-pointer"
                    >
                        <span>📝</span> 빌드 공유하기
                    </button>
                </div>

                <div className="flex gap-2 bg-[#161d2a] p-1.5 rounded-xl border border-slate-800 w-fit">
                    {['전체', '기사', '마법사수', '사냥꾼'].map((tab) => (
                        <button
                            key={tab}
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
                    <div className="text-center py-20 text-slate-500 bg-[#161d2a] rounded-2xl border border-slate-800">공략 대장을 불러오는 중...</div>
                ) : filteredPosts.length === 0 ? (
                    <div className="text-center py-20 text-slate-500 bg-[#161d2a] rounded-2xl border border-slate-800 border-dashed">
                        {activeFilterTab === '전체' ? '아직 등록된 유물 빌드가 없습니다.' : `⚔️ [${activeFilterTab}] 직업군에 등록된 유물 빌드가 없습니다.`}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredPosts.map(post => (
                            <BuildPostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </main>

            {isModalOpen && (
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