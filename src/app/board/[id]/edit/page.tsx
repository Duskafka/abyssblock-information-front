'use client';

import { useEffect, useState, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { z } from 'zod';

// 🧭 비속어 필터링 및 유물 데이터/타입 import
import { checkProfanity } from '@/app/constants/profanity';
import { RELICS_DATA, Relic } from '@/app/constants/relics';

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
    relics: Relic[];
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
        <div className="relative w-full text-left font-sans" ref={dropdownRef}>
            <label className="text-[11px] text-slate-400 block mb-1 font-semibold pl-1">{label}</label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-[#0f141c] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-300 focus:outline-none focus:border-amber-400 flex items-center justify-between transition-all cursor-pointer select-none"
            >
                {selectedRelic ? (
                    <div className="flex items-center gap-2">
                        <img src={selectedRelic.imageUrl} alt="" className="w-4 h-4 object-contain" />
                        <span className="text-slate-200 font-bold text-xs">{selectedRelic.koreanName}</span>
                    </div>
                ) : (
                    <span className="text-slate-500 font-medium text-xs">-- {label} 선택 --</span>
                )}
                <svg
                    className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-amber-400' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute left-0 right-0 mt-2 bg-[#111622] border border-slate-800 rounded-xl shadow-2xl z-50 max-h-56 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
                    <button
                        type="button"
                        onClick={() => { onChange(''); setIsOpen(false); }}
                        className="w-full px-3 py-2 text-left text-slate-500 hover:bg-[#161d2a] hover:text-slate-300 font-bold rounded-lg text-xs transition"
                    >
                        -- 지정 안 함 --
                    </button>
                    {relics.map(r => (
                        <button
                            key={r.id}
                            type="button"
                            onClick={() => { onChange(r.id); setIsOpen(false); }}
                            className={`w-full px-3 py-2 text-left rounded-lg flex items-center gap-2.5 transition-all text-xs font-bold ${
                                selectedValue === r.id
                                    ? 'bg-amber-400 text-slate-900 font-extrabold shadow-md'
                                    : 'text-slate-400 hover:bg-[#161d2a] hover:text-white'
                            }`}
                        >
                            <img src={r.imageUrl} alt="" className="w-4 h-4 object-contain shrink-0" />
                            <span>{r.koreanName}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const postId = params.id as string;

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // 폼 수정 상태 관리
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedJob, setSelectedJob] = useState('기사');
    const [main1, setMain1] = useState('');
    const [main2, setMain2] = useState('');
    const [main3, setMain3] = useState('');
    const [selectedSides, setSelectedSides] = useState<string[]>([]);

    const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

    const jobs = ['기사', '마법사수', '사냥꾼'];
    const selectedJobIndex = jobs.indexOf(selectedJob);

    // 초기 데이터 패치 및 작성자 권한 검증
    useEffect(() => {
        async function loadPost() {
            try {
                setLoading(true);

                // 1. 현재 로그인 유저 확인
                const { data: { session } } = await supabase.auth.getSession();
                const currentUser = session?.user ?? null;
                setUser(currentUser);

                if (!currentUser) {
                    alert('로그인이 필요한 서비스입니다.');
                    router.push('/board');
                    return;
                }

                // 2. 기존 게시글 정보 가져오기
                const { data: postData, error } = await supabase
                    .from('posts')
                    .select('*')
                    .eq('id', postId)
                    .single();

                if (error || !postData) throw new Error('게시글을 찾을 수 없습니다.');

                // 🔒 본인 글 검증 가드링
                if (postData.user_id !== currentUser.id) {
                    alert('본인이 작성한 글만 수정할 수 있습니다.');
                    router.push(`/board/${postId}`);
                    return;
                }

                // 3. 기존 데이터 상태값에 설정
                setTitle(postData.title);
                setContent(postData.content);
                setMain1(postData.main_relic_1 || '');
                setMain2(postData.main_relic_2 || '');
                setMain3(postData.main_relic_3 || '');
                setSelectedSides(postData.side_relics || []);

                // 게시글 직업이 있으면 해당 직업 적용, 없으면 첫 코어 유물의 직업 추론
                if (postData.job) {
                    setSelectedJob(postData.job);
                } else if (postData.main_relic_1) {
                    const firstRelic = RELICS_DATA.find(r => r.id === postData.main_relic_1);
                    if (firstRelic && firstRelic.job && !firstRelic.job.includes('common')) {
                        if (firstRelic.job.includes('기사')) setSelectedJob('기사');
                        else if (firstRelic.job.includes('마법사수')) setSelectedJob('마법사수');
                        else if (firstRelic.job.includes('사냥꾼')) setSelectedJob('사냥꾼');
                    }
                }

            } catch (err) {
                console.error(err);
                alert('데이터를 로드하는 중 오류가 발생했습니다.');
                router.push('/board');
            } finally {
                setLoading(false);
            }
        }
        loadPost();
    }, [postId, router]);

    const handleSideToggle = (relicId: string) => {
        if (selectedSides.includes(relicId)) {
            setSelectedSides(selectedSides.filter(id => id !== relicId));
        } else {
            setSelectedSides([...selectedSides, relicId]);
        }
    };

    // 데이터 업데이트 요청 핸들러
    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const validationResult = postSchema.safeParse({ title, content });
        if (!validationResult.success) {
            alert(validationResult.error.message);
            return;
        }

        if (checkProfanity(title) || checkProfanity(content)) {
            alert('제목이나 내용에 제한된 표현(비속어)이 포함되어 있습니다. 올바른 유물 공략 문화를 만들어주세요!');
            return;
        }

        try {
            const currentTimeStr = new Date().toUTCString();

            const { error } = await supabase
                .from('posts')
                .update({
                    title,
                    content,
                    job: selectedJob,
                    main_relic_1: main1 || null,
                    main_relic_2: main2 || null,
                    main_relic_3: main3 || null,
                    side_relics: selectedSides,
                    updated_at: currentTimeStr
                })
                .eq('id', postId);

            if (error) throw error;

            alert('공략 빌드가 성공적으로 수정되었습니다! ✏️');
            router.push(`/board/${postId}`);
        } catch (err: any) {
            alert(`수정 중 오류 발생: ${err.message}`);
        }
    };

    // RELICS_DATA 기반 직업 및 등급별 유물 필터링
    const filteredRelicsByJob = RELICS_DATA.filter(r => {
        if (!r.job || r.job.toLowerCase().trim() === 'none') return false;
        const cleanJob = r.job.replace(/\s+/g, '');
        return cleanJob.includes('common') || cleanJob.includes(selectedJob);
    });

    const bossRelics = filteredRelicsByJob.filter(r => r.grade === 'boss');
    const shopRelicsPool = filteredRelicsByJob.filter(r => r.grade === 'shop');
    const sideRelicsPool = filteredRelicsByJob.filter(r => r.grade === 'side');

    // 코어 유물 중복 선택 제거 필터
    const bossRelicsForMain1 = bossRelics.filter(r => r.id !== main2 && r.id !== main3);
    const bossRelicsForMain2 = bossRelics.filter(r => r.id !== main1 && r.id !== main3);
    const bossRelicsForMain3 = bossRelics.filter(r => r.id !== main1 && r.id !== main2);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f141c] flex items-center justify-center text-slate-400 text-sm">
                기존 공략 데이터를 불러오는 중...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f141c] text-slate-100 font-sans pb-12">
            <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">

                {/* 헤더 네비게이션 */}
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                            <span>🛠️</span> 빌드 공략 수정하기
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">핵심 유물 배치를 바꾸거나 설명 마크다운을 보완할 수 있습니다.</p>
                    </div>
                    <Link href={`/board/${postId}`} className="text-xs text-slate-400 hover:text-slate-200 transition">
                        ✕ 수정 취소
                    </Link>
                </div>

                {/* 수정 폼 스튜디오 */}
                <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                        {/* 왼쪽 유물 변경 사이드 바 */}
                        <div className="md:col-span-5 space-y-4 border-r border-slate-800/60 pr-1 md:pr-4">

                            {/* 직업 선택 슬라이더 */}
                            <div className="space-y-1.5">
                                <label className="text-amber-400 font-bold block text-[11px]">🎯 빌드 대상 직업군</label>
                                <div className="relative flex bg-[#0f141c] p-1 rounded-xl border border-slate-800 h-9 overflow-hidden select-none">
                                    <div
                                        className="absolute top-1 bottom-1 bg-amber-400 rounded-lg transition-all duration-300 ease-out shadow-md"
                                        style={{
                                            width: 'calc(33.3333% - 4px)',
                                            left: `calc(${selectedJobIndex * 33.3333}% + ${2 + selectedJobIndex * 0.5}px)`
                                        }}
                                    />
                                    {jobs.map(job => {
                                        const isSelected = selectedJob === job;
                                        return (
                                            <button
                                                key={job}
                                                type="button"
                                                onClick={() => setSelectedJob(job)}
                                                className={`relative flex-1 text-center font-bold text-[11px] transition-colors duration-200 z-10 focus:outline-none cursor-pointer ${
                                                    isSelected ? 'text-slate-950 font-extrabold' : 'text-slate-400 hover:text-slate-200'
                                                }`}
                                            >
                                                {job}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 핵심 코어 유물 (BOSS) */}
                            <div className="space-y-3 bg-[#0f141c]/40 p-3 rounded-xl border border-slate-800">
                                <span className="font-bold text-amber-400 block text-[11px]">👑 핵심 코어 유물 (BOSS)</span>
                                <div className="space-y-2.5">
                                    <CustomRelicSelect label="첫 번째 코어 유물" relics={bossRelicsForMain1} selectedValue={main1} onChange={setMain1} />
                                    <CustomRelicSelect label="두 번째 코어 유물" relics={bossRelicsForMain2} selectedValue={main2} onChange={setMain2} />
                                    <CustomRelicSelect label="세 번째 코어 유물" relics={bossRelicsForMain3} selectedValue={main3} onChange={setMain3} />
                                </div>
                            </div>

                            {/* 추천 상점 유물 (SHOP) */}
                            <div className="space-y-1.5">
                                <span className="font-bold text-emerald-400 flex items-center gap-1 text-[11px]">🛒 추천 상점 유물 (SHOP)</span>
                                <div className="bg-[#0f141c] border border-slate-800 rounded-xl p-2 h-36 overflow-y-auto space-y-0.5 divide-y divide-slate-800/40 custom-scrollbar">
                                    {shopRelicsPool.map(r => {
                                        const isChecked = selectedSides.includes(r.id);
                                        return (
                                            <label key={r.id} className={`flex items-center justify-between cursor-pointer p-1.5 rounded-lg transition-all text-[11px] ${isChecked ? 'bg-emerald-500/5 border border-emerald-500/20' : 'hover:bg-slate-800/30 border border-transparent'}`}>
                                                <div className="flex items-center gap-2">
                                                    <img src={r.imageUrl} alt="" className="w-4 h-4 object-contain" />
                                                    <span className="text-slate-200 font-bold">{r.koreanName} <span className="text-[9px] text-slate-500 font-normal">({r.job})</span></span>
                                                </div>
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => handleSideToggle(r.id)}
                                                        className="appearance-none w-4 h-4 rounded-md border border-slate-700 bg-slate-900 checked:bg-emerald-500 checked:border-emerald-500 transition-all cursor-pointer focus:outline-none"
                                                    />
                                                    {isChecked && (
                                                        <svg className="absolute w-2.5 h-2.5 text-slate-950 pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-extrabold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 추천 사이드 유물 (SIDE) */}
                            <div className="space-y-1.5">
                                <span className="font-bold text-blue-400 flex items-center gap-1 text-[11px]">🔗 추천 사이드 유물 (SIDE)</span>
                                <div className="bg-[#0f141c] border border-slate-800 rounded-xl p-2 h-36 overflow-y-auto space-y-0.5 divide-y divide-slate-800/40 custom-scrollbar">
                                    {sideRelicsPool.map(r => {
                                        const isChecked = selectedSides.includes(r.id);
                                        return (
                                            <label key={r.id} className={`flex items-center justify-between cursor-pointer p-1.5 rounded-lg transition-all text-[11px] ${isChecked ? 'bg-blue-500/5 border border-blue-500/20' : 'hover:bg-slate-800/30 border border-transparent'}`}>
                                                <div className="flex items-center gap-2">
                                                    <img src={r.imageUrl} alt="" className="w-4 h-4 object-contain" />
                                                    <span className="text-slate-200 font-bold">{r.koreanName} <span className="text-[9px] text-slate-500 font-normal">({r.job})</span></span>
                                                </div>
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => handleSideToggle(r.id)}
                                                        className="appearance-none w-4 h-4 rounded-md border border-slate-700 bg-slate-900 checked:bg-blue-500 checked:border-blue-500 transition-all cursor-pointer focus:outline-none"
                                                    />
                                                    {isChecked && (
                                                        <svg className="absolute w-2.5 h-2.5 text-slate-950 pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-extrabold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* 오른쪽 타이틀 및 마크다운 편집기 바 */}
                        <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                            <div className="space-y-3 flex-1 flex flex-col">
                                <div>
                                    <label className="text-slate-400 block mb-1 font-bold pl-1">공략 게시글 제목</label>
                                    <input
                                        type="text" required value={title} onChange={e => setTitle(e.target.value)}
                                        className="w-full bg-[#0f141c] border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-amber-400 text-xs font-bold"
                                    />
                                </div>

                                <div className="flex-1 flex flex-col min-h-[360px]">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <div className="flex bg-[#0f141c] p-1 rounded-xl border border-slate-800 gap-1">
                                            <button
                                                type="button" onClick={() => setActiveTab('write')}
                                                className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition cursor-pointer ${activeTab === 'write' ? 'bg-amber-400 text-slate-900' : 'text-slate-400 hover:text-slate-200'}`}
                                            >
                                                ✏️ 에디터 수정
                                            </button>
                                            <button
                                                type="button" onClick={() => setActiveTab('preview')}
                                                className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition cursor-pointer ${activeTab === 'preview' ? 'bg-amber-400 text-slate-900' : 'text-slate-400 hover:text-slate-200'}`}
                                            >
                                                👁️ 실시간 미리보기
                                            </button>
                                        </div>
                                    </div>

                                    {activeTab === 'write' ? (
                                        <textarea
                                            required value={content} onChange={e => setContent(e.target.value)}
                                            className="w-full flex-1 bg-[#0f141c] border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:border-amber-400 text-xs resize-none leading-relaxed font-mono custom-scrollbar"
                                        />
                                    ) : (
                                        <div className="w-full flex-1 bg-[#0f141c] border border-slate-800 rounded-xl px-4 py-3.5 overflow-y-auto text-xs leading-relaxed text-slate-300 custom-scrollbar">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                                {content}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 제출 버튼 하단 영역 */}
                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800/80">
                                <Link href={`/board/${postId}`} className="w-24 text-center bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-xl transition flex items-center justify-center cursor-pointer">
                                    취소
                                </Link>
                                <button type="submit" className="w-56 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold py-2.5 rounded-xl transition shadow-lg text-xs tracking-wider cursor-pointer">
                                    수정 완료하고 저장 🚀
                                </button>
                            </div>
                        </div>

                    </div>
                </form>
            </main>
        </div>
    );
}