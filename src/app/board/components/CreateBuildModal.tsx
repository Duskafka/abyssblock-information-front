'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { z } from 'zod';
import { checkProfanity } from '@/app/constants/profanity';

const postSchema = z.object({
    title: z.string()
        .min(2, { message: "제목은 최소 2글자 이상이어야 합니다." })
        .max(50, { message: "제목은 50자를 초과할 수 없습니다." }),
    content: z.string()
        .min(5, { message: "공략 내용은 최소 5글자 이상 작성해주세요." }),
});

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

function CustomRelicSelect({ label, relics, selectedValue, onChange }: {
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
        <div className="relative w-full text-left font-sans" ref={dropdownRef}>
            <label className="text-[11px] text-slate-400 block mb-1 font-semibold pl-1">{label}</label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-[#0f141c] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-300 focus:outline-none focus:border-amber-400 flex items-center justify-between transition-all cursor-pointer select-none"
            >
                {selectedRelic ? (
                    <div className="flex items-center gap-2">
                        <img src={selectedRelic.image_url} alt="" className="w-4 h-4 object-contain" />
                        <span className="text-slate-200 font-bold text-xs">{selectedRelic.korean_name}</span>
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

            {/* 1️⃣ 드롭다운 박스 스크롤바 커스텀 적용 */}
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
                            <img src={r.image_url} alt="" className="w-4 h-4 object-contain shrink-0" />
                            <span>{r.korean_name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

interface CreateBuildModalProps {
    user: any;
    relics: any[];
    supabase: any;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateBuildModal({ user, relics, supabase, onClose, onSuccess }: CreateBuildModalProps) {
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

    useEffect(() => {
        setMain1('');
        setMain2('');
        setMain3('');
        setSelectedSides([]);
    }, [selectedJob]);

    const handleSideToggle = (relicId: string) => {
        if (selectedSides.includes(relicId)) {
            setSelectedSides(selectedSides.filter(id => id !== relicId));
        } else {
            setSelectedSides([...selectedSides, relicId]);
        }
    };

    const handlePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return alert('로그인이 필요합니다.');

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
            const { data: currentProfile } = await supabase.from('profiles').select('minecraft_username').eq('id', user.id).single();
            const displayName = currentProfile?.minecraft_username || user.user_metadata?.display_name || user.email?.split('@')[0];

            const { error } = await supabase.from('posts').insert([
                {
                    user_id: user.id,
                    author_name: displayName,
                    title,
                    content,
                    job: selectedJob,
                    main_relic_1: main1 || null,
                    main_relic_2: main2 || null,
                    main_relic_3: main3 || null,
                    side_relics: selectedSides
                }
            ]);

            if (error) throw error;

            alert('추천 빌드가 성공적으로 공유되었습니다! 🚀');
            onSuccess();
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
        /* 2️⃣ 창 크기가 작아질 때 작동하는 모달 전체 컨테이너 스크롤바 커스텀 적용 */
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-[#161d2a] w-full max-w-4xl rounded-2xl border border-slate-800 p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[95vh] custom-scrollbar">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2"><span>📝</span> 새 빌드 작성</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-200 text-lg font-bold p-1 cursor-pointer transition-colors">✕</button>
                </div>

                <form onSubmit={handlePostSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-5 space-y-4 border-r border-slate-800/60 pr-1 md:pr-4">

                            {/* 🎯 라디오 버튼을 부드러운 슬라이더 바로 변경 완료 */}
                            <div className="space-y-1.5">
                                <label className="text-amber-400 font-bold block text-[11px]">🎯 빌드 대상 직업군</label>
                                <div className="relative flex bg-[#0f141c] p-1 rounded-xl border border-slate-800 h-9 overflow-hidden select-none">
                                    {/* 미끄러지는 배경 슬라이드 바 블록 */}
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

                            <div className="space-y-3 bg-[#0f141c]/40 p-3 rounded-xl border border-slate-800">
                                <span className="font-bold text-amber-400 block text-[11px]">👑 핵심 코어 유물 (BOSS)</span>
                                <div className="space-y-2.5">
                                    <CustomRelicSelect label="첫 번째 코어 유물" relics={bossRelics} selectedValue={main1} onChange={setMain1} />
                                    <CustomRelicSelect label="두 번째 코어 유물" relics={bossRelics} selectedValue={main2} onChange={setMain2} />
                                    <CustomRelicSelect label="세 번째 코어 유물" relics={bossRelics} selectedValue={main3} onChange={setMain3} />
                                </div>
                            </div>

                            {/* 3️⃣ 상점 유물 스크롤 풀 + 에메랄드 커스텀 체크박스 조합 */}
                            <div className="space-y-1.5">
                                <span className="font-bold text-emerald-400 flex items-center gap-1 text-[11px]">🛒 추천 상점 유물 (SHOP)</span>
                                <div className="bg-[#0f141c] border border-slate-800 rounded-xl p-2 h-36 overflow-y-auto space-y-0.5 divide-y divide-slate-800/40 custom-scrollbar">
                                    {shopRelicsPool.map(r => {
                                        const isChecked = selectedSides.includes(r.id);
                                        return (
                                            <label key={r.id} className={`flex items-center justify-between cursor-pointer p-1.5 rounded-lg transition-all text-[11px] ${isChecked ? 'bg-emerald-500/5 border border-emerald-500/20' : 'hover:bg-slate-800/30 border border-transparent'}`}>
                                                <div className="flex items-center gap-2">
                                                    <img src={r.image_url} alt="" className="w-4 h-4 object-contain" />
                                                    <span className="text-slate-200 font-bold">{r.korean_name} <span className="text-[9px] text-slate-500 font-normal">({r.job})</span></span>
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

                            {/* 4️⃣ 사이드 유물 스크롤 풀 + 블루 커스텀 체크박스 조합 */}
                            <div className="space-y-1.5">
                                <span className="font-bold text-blue-400 flex items-center gap-1 text-[11px]">🔗 추천 사이드 유물 (SIDE)</span>
                                <div className="bg-[#0f141c] border border-slate-800 rounded-xl p-2 h-36 overflow-y-auto space-y-0.5 divide-y divide-slate-800/40 custom-scrollbar">
                                    {sideRelicsPool.map(r => {
                                        const isChecked = selectedSides.includes(r.id);
                                        return (
                                            <label key={r.id} className={`flex items-center justify-between cursor-pointer p-1.5 rounded-lg transition-all text-[11px] ${isChecked ? 'bg-blue-500/5 border border-blue-500/20' : 'hover:bg-slate-800/30 border border-transparent'}`}>
                                                <div className="flex items-center gap-2">
                                                    <img src={r.image_url} alt="" className="w-4 h-4 object-contain" />
                                                    <span className="text-slate-200 font-bold">{r.korean_name} <span className="text-[9px] text-slate-500 font-normal">({r.job})</span></span>
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

                        <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                            <div className="space-y-3 flex-1 flex flex-col">
                                <div>
                                    <label className="text-slate-400 block mb-1 font-bold pl-1">공략 게시글 제목</label>
                                    <input
                                        type="text" required value={title} onChange={e => setTitle(e.target.value)}
                                        className="w-full bg-[#0f141c] border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-amber-400 text-xs font-bold"
                                        placeholder="예: 소환수 사냥꾼 빌드"
                                    />
                                </div>

                                <div className="flex-1 flex flex-col min-h-[340px]">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <div className="flex bg-[#0f141c] p-1 rounded-xl border border-slate-800 gap-1">
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('write')}
                                                className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition cursor-pointer ${activeTab === 'write' ? 'bg-amber-400 text-slate-900' : 'text-slate-400 hover:text-slate-200'}`}
                                            >
                                                ✏️ 에디터 작성
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('preview')}
                                                className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition cursor-pointer ${activeTab === 'preview' ? 'bg-amber-400 text-slate-900' : 'text-slate-400 hover:text-slate-200'}`}
                                            >
                                                👁️ 실시간 미리보기
                                            </button>
                                        </div>
                                        <span className="text-[10px] text-slate-500 font-medium"># 대제목 / **굵게** / - 리스트</span>
                                    </div>

                                    {/* 5️⃣ 텍스트 에디터 및 마크다운 미리보기 컴포넌트 스크롤바 커스텀 적용 */}
                                    {activeTab === 'write' ? (
                                        <textarea
                                            required value={content} onChange={e => setContent(e.target.value)}
                                            className="w-full flex-1 bg-[#0f141c] border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:border-amber-400 text-xs resize-none leading-relaxed font-mono custom-scrollbar"
                                            placeholder="마크다운 문법으로 공략을 작성해보세요!&#10;&#10;### 💡 빌드 핵심 메커니즘&#10;1. **크리티컬 확률** 극대화&#10;2. 상점에서 구입한 유물과 시너지 연계&#10;&#10;- 주의: 보스 광폭화 패턴 전에 스킬 아껴두기!"
                                        />
                                    ) : (
                                        <div className="w-full flex-1 bg-[#0f141c] border border-slate-800 rounded-xl px-4 py-3.5 overflow-y-auto text-xs leading-relaxed text-slate-300 custom-scrollbar">
                                            {content.trim() === '' ? (
                                                <span className="text-slate-600 block text-center py-24 font-medium">작성된 내용이 없어 미리볼 수 없습니다.</span>
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
                                <button type="button" onClick={onClose} className="w-24 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-xl transition cursor-pointer">취소</button>
                                <button type="submit" className="w-56 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold py-2.5 rounded-xl transition shadow-lg text-xs tracking-wider cursor-pointer">빌드 공략 등록 완료 🚀</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}