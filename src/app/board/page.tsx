'use client';

import { useEffect, useState, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { z } from 'zod';

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const markdownComponents = {
    h1: ({ ...props }) => <h1 className="text-xl font-bold text-amber-400 mt-4 mb-2 border-b border-slate-800 pb-1" {...props} />,
    h2: ({ ...props }) => <h2 className="text-lg font-bold text-amber-400 mt-3 mb-1.5" {...props} />,
    h3: ({ ...props }) => <h3 className="text-base font-bold text-amber-500 mt-2 mb-1" {...props} />,
    p: ({ ...props }) => <p className="my-1.5 leading-relaxed text-slate-300" {...props} />,
    strong: ({ ...props }) => <strong className="font-extrabold text-amber-300 bg-amber-500/10 px-1 rounded" {...props} />,
    em: ({ ...props }) => <em className="italic text-slate-400" {...props} />,
    ul: ({ ...props }) => <ul className="list-disc pl-5 my-2 space-y-1 text-slate-300" {...props} />,
    ol: ({ ...props }) => <ol className="list-decimal pl-5 my-2 space-y-1 text-slate-300" {...props} />,
    li: ({ ...props }) => <li className="marker:text-amber-400 text-slate-300" {...props} />,
    code: ({ ...props }) => <code className="bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded font-mono text-[11px]" {...props} />,
    blockquote: ({ ...props }) => <blockquote className="border-l-4 border-slate-600 pl-3 italic text-slate-400 my-2" {...props} />,
};

// 폼 데이터 검증을 위한 Zod 스키마
const postSchema = z.object({
    title: z.string()
        .min(2, { message: "제목은 최소 2글자 이상이어야 합니다." })
        .max(50, { message: "제목은 50자를 초과할 수 없습니다." }),
    content: z.string()
        .min(5, { message: "공략 내용은 최소 5글자 이상 작성해주세요." }),
});

function CustomRelicSelect({
                               label,
                               relics,
                               selectedValue,
                               onChange
                           }: {
    label: string;
    relics: any[];
    selectedValue: string;
    onChange: (id: string) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedRelic = relics.find(r => r.id === selectedValue);

    return (
        <div className="relative w-full text-left" ref={dropdownRef}>
            <label className="text-[11px] text-slate-400 block mb-1">{label}</label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-[#0f141c] border border-slate-700 rounded-xl px-3 py-2.5 text-slate-300 focus:outline-none focus:border-amber-400 flex items-center justify-between transition text-xs"
            >
                {selectedRelic ? (
                    <div className="flex items-center gap-2">
                        <img src={selectedRelic.image_url} alt="" className="w-4 h-4 object-contain" />
                        <span className="text-slate-200">{selectedRelic.korean_name}</span>
                    </div>
                ) : (
                    <span className="text-slate-500">-- {label} 선택 --</span>
                )}
                <span className="text-slate-500 text-[10px]">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
                <div className="absolute left-0 right-0 mt-1 bg-[#1a2332] border border-slate-700 rounded-xl shadow-2xl z-50 max-h-56 overflow-y-auto divide-y divide-slate-800/60">
                    <button
                        type="button"
                        onClick={() => { onChange(''); setIsOpen(false); }}
                        className="w-full px-3 py-2.5 text-left text-slate-500 hover:bg-slate-800/50 text-xs"
                    >
                        -- 지정 안 함 --
                    </button>
                    {relics.map(r => (
                        <button
                            key={r.id}
                            type="button"
                            onClick={() => { onChange(r.id); setIsOpen(false); }}
                            className={`w-full px-3 py-2.5 text-left hover:bg-slate-800 flex items-center gap-2 transition text-xs ${selectedValue === r.id ? 'bg-amber-500/10 text-amber-400' : 'text-slate-300'}`}
                        >
                            <img src={r.id ? relics.find(relic => relic.id === r.id).image_url : ''} alt="" className="w-4 h-4 object-contain" />
                            <span>{r.korean_name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function BoardPage() {
    const [user, setUser] = useState<any>(null);
    const [relics, setRelics] = useState<any[]>([]);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);

    // 폼 상태 관리
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedJob, setSelectedJob] = useState('기사');
    const [main1, setMain1] = useState('');
    const [main2, setMain2] = useState('');
    const [main3, setMain3] = useState('');
    const [selectedSides, setSelectedSides] = useState<string[]>([]);

    const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

    useEffect(() => {
        setMain1('');
        setMain2('');
        setMain3('');
        setSelectedSides([]);
    }, [selectedJob]);

    const fetchBoardData = async () => {
        try {
            setLoading(true);
            const { data: relicData } = await supabase.from('relics').select('*').order('korean_name');
            setRelics(relicData || []);

            const { data: postData } = await supabase
                .from('posts')
                .select(`
          *,
          m1:relics!posts_main_relic_1_fkey(korean_name, image_url),
          m2:relics!posts_main_relic_2_fkey(korean_name, image_url),
          m3:relics!posts_main_relic_3_fkey(korean_name, image_url)
        `)
                .order('created_at', { ascending: false });

            setPosts(postData || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });
        fetchBoardData();
    }, []);

    const handleSideToggle = (relicId: string) => {
        if (selectedSides.includes(relicId)) {
            setSelectedSides(selectedSides.filter(id => id !== relicId));
        } else {
            setSelectedSides([...selectedSides, relicId]);
        }
    };

    // 🌟 엣지 펑션 없이 프론트 단에서 밸리데이션 + 비속어 컷 한 뒤 직접 집어넣는 로직
    const handlePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return alert('로그인이 필요합니다.');

        // 1. Zod 글자 수 / 형식 검증
        const validationResult = postSchema.safeParse({ title, content });
        if (!validationResult.success) {
            alert(validationResult.error.message);
            return;
        }

        // 2. 비속어 필터링 검증
        if (checkProfanity(title) || checkProfanity(content)) {
            alert('제목이나 내용에 제한된 표현(비속어)이 포함되어 있습니다. 올바른 유물 공략 문화를 만들어주세요!');
            return;
        }

        try {
            const displayName = user.user_metadata?.display_name || user.email?.split('@')[0];

            // 3. 모든 관문을 통과했으므로 웹 Supabase DB로 직접 인서트 (RLS가 유저 세션 알아서 대조 검증함)
            const { error } = await supabase.from('posts').insert([
                {
                    user_id: user.id,
                    author_name: displayName,
                    title,
                    content,
                    main_relic_1: main1 || null,
                    main_relic_2: main2 || null,
                    main_relic_3: main3 || null,
                    side_relics: selectedSides
                }
            ]);

            if (error) throw error;

            alert('추천 빌드가 성공적으로 공유되었습니다! 🚀');
            setTitle(''); setContent(''); setMain1(''); setMain2(''); setMain3(''); setSelectedSides([]);
            setIsModalOpen(false);
            fetchBoardData();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const filteredRelicsByJob = relics.filter(r => {
        if (!r.job) return false;
        const cleanJob = r.job.replace(/\s+/g, '');
        return cleanJob.includes('common') || cleanJob.includes(selectedJob);
    });

    const bossRelics = filteredRelicsByJob.filter(r => r.grade === 'boss');
    const shopRelicsPool = filteredRelicsByJob.filter(r => r.grade === 'shop');
    const sideRelicsPool = filteredRelicsByJob.filter(r => r.grade === 'side');

    return (
        <div className="min-h-screen bg-[#0f141c] text-slate-100 font-sans">
            <header className="border-b border-slate-800 bg-[#161d2a]/90 px-6 py-4 sticky top-0 z-40 backdrop-blur">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <Link href="/" className="text-xl font-bold text-amber-400 tracking-wider">🌾 GOLD CROP</Link>
                    <nav className="flex gap-6 text-sm">
                        <Link href="/" className="text-slate-400 hover:text-slate-200 transition">📈 시세 현황판</Link>
                        <Link href="/board" className="text-amber-400 font-bold">💬 빌드 공유 게시판</Link>
                    </nav>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-200">🌟 유저 추천 빌드 피드</h2>
                        <p className="text-xs text-slate-400 mt-1">심연 원정대원들이 연구해낸 최적의 유물 시너지를 확인해 보세요.</p>
                    </div>
                    <button
                        onClick={() => {
                            if(!user) return alert('로그인 후 이용할 수 있습니다.');
                            setIsModalOpen(true);
                        }}
                        className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg"
                    >
                        <span>📝</span> 빌드 공유하기
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-slate-500 bg-[#161d2a] rounded-2xl border border-slate-800">공략 대장을 불러오는 중...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 text-slate-500 bg-[#161d2a] rounded-2xl border border-slate-800 border-dashed">아직 등록된 유물 빌드가 없습니다.</div>
                ) : (
                    <div className="space-y-4">
                        {posts.map(post => (
                            <div key={post.id} className="bg-[#161d2a] border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition">
                                <div>
                                    <h3 className="text-base font-bold text-slate-200">{post.title}</h3>
                                    <p className="text-xs text-slate-400 mt-1">👤 {post.author_name} &nbsp;|&nbsp; 🕒 {new Date(post.created_at).toLocaleDateString()}</p>
                                </div>

                                <div className="bg-[#0f141c] p-5 rounded-xl border border-slate-800 text-xs leading-relaxed text-slate-300">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                        {post.content}
                                    </ReactMarkdown>
                                </div>

                                <div className="space-y-2.5 pt-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-[11px] font-bold text-amber-400 w-16">👑 핵심:</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {[post.m1, post.m2, post.m3].map((relic, idx) => relic ? (
                                                <div key={idx} className="flex items-center gap-1.5 bg-[#0f141c] border border-slate-700 rounded-lg px-2.5 py-1 text-[11px]" title={relic.korean_name}>
                                                    <img src={relic.image_url} alt="" className="w-4 h-4 object-contain" />
                                                    <span className="text-slate-300 font-medium">{relic.korean_name}</span>
                                                </div>
                                            ) : null)}
                                        </div>
                                    </div>

                                    {post.side_relics && post.side_relics.length > 0 && (
                                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/40">
                                            <span className="text-[11px] font-bold text-slate-400 w-16">🔗 사이드:</span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {post.side_relics.map((sideId: string) => {
                                                    const relicInfo = relics.find(r => r.id === sideId);
                                                    if (!relicInfo) return null;
                                                    return (
                                                        <div key={sideId} className="flex items-center gap-1 bg-[#1a2332] border border-slate-800 rounded-md px-2 py-0.5 text-[10px]" title={relicInfo.korean_name}>
                                                            <img src={relicInfo.image_url} alt="" className="w-3.5 h-3.5 object-contain" />
                                                            <span className="text-slate-400">{relicInfo.korean_name}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
                    <div className="bg-[#161d2a] w-full max-w-4xl rounded-2xl border border-slate-800 p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[95vh]">

                        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2"><span>📝</span> 새 빌드 공략 작성 스튜디오</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200 text-lg font-bold p-1">✕</button>
                        </div>

                        <form onSubmit={handlePostSubmit} className="space-y-4 text-xs">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                                <div className="md:col-span-5 space-y-4 border-r border-slate-800/60 pr-1 md:pr-4">
                                    <div className="space-y-1.5">
                                        <label className="text-amber-400 font-bold block text-[11px]">🎯 빌드 대상 직업군</label>
                                        <div className="flex gap-3 bg-[#0f141c] px-3 py-2 rounded-xl border border-slate-700 justify-between">
                                            {['기사', '마법사수', '사냥꾼'].map(job => (
                                                <label key={job} className="flex items-center gap-1.5 cursor-pointer text-slate-300 font-medium">
                                                    <input
                                                        type="radio" name="jobFilter" value={job} checked={selectedJob === job}
                                                        onChange={(e) => setSelectedJob(e.target.value)}
                                                        className="text-amber-400 focus:ring-0 bg-slate-900 border-slate-700 w-3.5 h-3.5 cursor-pointer"
                                                    />
                                                    <span>{job}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2 bg-[#0f141c]/40 p-3 rounded-xl border border-slate-800">
                                        <span className="font-semibold text-amber-400 block text-[11px]">👑 핵심 코어 유물 (BOSS)</span>
                                        <div className="space-y-1.5">
                                            <CustomRelicSelect label="첫 번째 코어 유물" relics={bossRelics} selectedValue={main1} onChange={setMain1} />
                                            <CustomRelicSelect label="두 번째 코어 유물" relics={bossRelics} selectedValue={main2} onChange={setMain2} />
                                            <CustomRelicSelect label="세 번째 코어 유물" relics={bossRelics} selectedValue={main3} onChange={setMain3} />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <span className="font-semibold text-emerald-400 flex items-center gap-1 text-[11px]">🛒 추천 상점 유물 (SHOP)</span>
                                        <div className="bg-[#0f141c] border border-slate-700 rounded-xl p-2 h-36 overflow-y-auto space-y-0.5 divide-y divide-slate-800/40">
                                            {shopRelicsPool.map(r => {
                                                const isChecked = selectedSides.includes(r.id);
                                                return (
                                                    <label key={r.id} className={`flex items-center justify-between cursor-pointer p-1.5 rounded-lg transition text-[11px] ${isChecked ? 'bg-emerald-500/5 border border-emerald-500/20' : 'hover:bg-slate-800/30 border border-transparent'}`}>
                                                        <div className="flex items-center gap-2">
                                                            <img src={r.image_url} alt="" className="w-4 h-4 object-contain" />
                                                            <span className="text-slate-200 font-medium">{r.korean_name} <span className="text-[9px] text-slate-500 font-normal">({r.job})</span></span>
                                                        </div>
                                                        <input type="checkbox" checked={isChecked} onChange={() => handleSideToggle(r.id)} className="rounded border-slate-700 text-emerald-500 focus:ring-0 bg-slate-900 w-3.5 h-3.5 cursor-pointer" />
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <span className="font-semibold text-blue-400 flex items-center gap-1 text-[11px]">🔗 추천 사이드 유물 (SIDE)</span>
                                        <div className="bg-[#0f141c] border border-slate-700 rounded-xl p-2 h-36 overflow-y-auto space-y-0.5 divide-y divide-slate-800/40">
                                            {sideRelicsPool.map(r => {
                                                const isChecked = selectedSides.includes(r.id);
                                                return (
                                                    <label key={r.id} className={`flex items-center justify-between cursor-pointer p-1.5 rounded-lg transition text-[11px] ${isChecked ? 'bg-blue-500/5 border border-blue-500/20' : 'hover:bg-slate-800/30 border border-transparent'}`}>
                                                        <div className="flex items-center gap-2">
                                                            <img src={r.image_url} alt="" className="w-4 h-4 object-contain" />
                                                            <span className="text-slate-200 font-medium">{r.korean_name} <span className="text-[9px] text-slate-500 font-normal">({r.job})</span></span>
                                                        </div>
                                                        <input type="checkbox" checked={isChecked} onChange={() => handleSideToggle(r.id)} className="rounded border-slate-700 text-blue-500 focus:ring-0 bg-slate-900 w-3.5 h-3.5 cursor-pointer" />
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                                    <div className="space-y-3 flex-1 flex flex-col">
                                        <div>
                                            <label className="text-slate-400 block mb-1 font-medium">공략 게시글 제목</label>
                                            <input
                                                type="text" required value={title} onChange={e => setTitle(e.target.value)}
                                                className="w-full bg-[#0f141c] border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-amber-400 text-xs font-semibold"
                                                placeholder="예: 7단 던전 날먹하는 크리티컬 궁수 빌드"
                                            />
                                        </div>

                                        <div className="flex-1 flex flex-col min-h-[340px]">
                                            <div className="flex justify-between items-center mb-1">
                                                <div className="flex bg-[#0f141c] p-1 rounded-xl border border-slate-800 gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveTab('write')}
                                                        className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition ${activeTab === 'write' ? 'bg-amber-400 text-slate-900' : 'text-slate-400 hover:text-slate-200'}`}
                                                    >
                                                        ✏️ 에디터 작성
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveTab('preview')}
                                                        className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition ${activeTab === 'preview' ? 'bg-amber-400 text-slate-900' : 'text-slate-400 hover:text-slate-200'}`}
                                                    >
                                                        👁️ 실시간 미리보기
                                                    </button>
                                                </div>
                                                <span className="text-[10px] text-slate-500"># 대제목 / **굵게** / - 리스트</span>
                                            </div>

                                            {activeTab === 'write' ? (
                                                <textarea
                                                    required value={content} onChange={e => setContent(e.target.value)}
                                                    className="w-full flex-1 bg-[#0f141c] border border-slate-700 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:border-amber-400 text-xs resize-none leading-relaxed font-mono"
                                                    placeholder="마크다운 문법으로 공략을 작성해보세요!&#10;&#10;### 💡 빌드 핵심 메커니즘&#10;1. **크리티컬 확률** 극대화&#10;2. 상점에서 구입한 유물과 시너지 연계&#10;&#10;- 주의: 보스 광폭화 패턴 전에 스킬 아껴두기!"
                                                />
                                            ) : (
                                                <div className="w-full flex-1 bg-[#0f141c] border border-slate-700 rounded-xl px-4 py-3.5 overflow-y-auto text-xs leading-relaxed text-slate-300">
                                                    {content.trim() === '' ? (
                                                        <span className="text-slate-600 block text-center py-24">작성된 내용이 없어 미리볼 수 없습니다.</span>
                                                    ) : (
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                                            {content}
                                                        </ReactMarkdown>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-800/80">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="w-24 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-xl transition">취소</button>
                                        <button type="submit" className="w-56 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold py-2.5 rounded-xl transition shadow-lg text-xs tracking-wider">빌드 공략 등록 완료 🚀</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// ==========================================
// 🛠️ 내장형 한국어 비속어 사정 및 우회 감지 필터 시스템
// ==========================================
const KOREAN_BADWORDS = [
    "개새끼", "새끼", "시발", "씨발", "존나", "좆", "병신", "지랄", "정신병자",
    "쓰레기", "미친놈", "미친년", "노가다", "ㅅㅂ", "ㅂㅅ", "ㅈㄴ", "ㄲㅈ", "꺼져",
    "아가리", "닥쳐", "새키", "씌발", "썅", "틀딱", "맘충", "한남", "김치녀"
];

function checkProfanity(text: string): boolean {
    if (!text) return false;
    // 공백 및 특수문자를 제거하여 의도적인 띄어쓰기 욕설 방어 (예: 시   발 -> 시발)
    const cleanedText = text.replace(/[\s~`!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
    return KOREAN_BADWORDS.some(badword => cleanedText.includes(badword));
}