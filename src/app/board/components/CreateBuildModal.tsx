'use client';

import { useState, useEffect, useRef, useId } from 'react';
import { z } from 'zod';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { checkProfanity } from '@/app/constants/profanity';
import Modal from '@/components/ui/Modal';

// 💡 작성해주신 relics.ts 경로에서 유물 상수 데이터 및 타입 가져오기
import { RELICS_DATA, Relic } from '@/app/constants/relics';
import Markdown from '@/components/Markdown';
import PixelImage from '@/components/ui/PixelImage';
import { useToast } from '@/components/ui/Toast';

const postSchema = z.object({
    title: z.string()
        .min(2, { message: "제목은 최소 2글자 이상이어야 합니다." })
        .max(50, { message: "제목은 50자를 초과할 수 없습니다." }),
    content: z.string()
        .min(5, { message: "공략 내용은 최소 5글자 이상 작성해주세요." }),
});


function CustomRelicSelect({ label, relics, selectedValue, onChange }: {
    label: string;
    relics: Relic[];
    selectedValue: string;
    onChange: (id: string) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const labelId = useId();
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
            <span id={labelId} className="text-xs text-slate-400 block mb-1 font-semibold pl-1">{label}</span>
            <button
                type="button"
                aria-labelledby={labelId}
                aria-expanded={isOpen}
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-abyss-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-300 focus-ring focus:border-amber-400 flex items-center justify-between transition-all cursor-pointer select-none"
            >
                {selectedRelic ? (
                    <div className="flex items-center gap-2">
                        <PixelImage src={selectedRelic.imageUrl} alt="" className="w-4 h-4 object-contain" width={16} height={16} />
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

            {/* 드롭다운 박스 */}
            {isOpen && (
                <div className="absolute left-0 right-0 mt-2 bg-abyss-950 border border-slate-800 rounded-xl shadow-2xl z-50 max-h-56 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
                    <button
                        type="button"
                        onClick={() => { onChange(''); setIsOpen(false); }}
                        className="w-full px-3 py-2 text-left text-slate-500 hover:bg-abyss-800 hover:text-slate-300 font-bold rounded-lg text-xs transition"
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
                                    : 'text-slate-400 hover:bg-abyss-800 hover:text-white'
                            }`}
                        >
                            <PixelImage src={r.imageUrl} alt="" className="w-4 h-4 object-contain shrink-0" width={16} height={16} />
                            <span>{r.koreanName}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

interface CreateBuildModalProps {
    user: User;
    supabase: SupabaseClient;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateBuildModal({ user, supabase, onClose, onSuccess }: CreateBuildModalProps) {
    const toast = useToast();
    const jobGroupId = useId();
    const titleId = useId();
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
        if (!user) return toast.error('로그인이 필요합니다.');

        const validationResult = postSchema.safeParse({ title, content });
        if (!validationResult.success) {
            toast.error(validationResult.error.message);
            return;
        }

        if (checkProfanity(title) || checkProfanity(content)) {
            toast.error('제목이나 내용에 제한된 표현(비속어)이 포함되어 있습니다. 올바른 유물 공략 문화를 만들어주세요!');
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

            toast.success('추천 빌드가 성공적으로 공유되었습니다! 🚀');
            onSuccess();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : String(err));
        }
    };

    // 💡 RELICS_DATA 기반으로 직업별 유물 필터링 ('none' 직업 제외 및 common / 직업별 포함)
    const filteredRelicsByJob = RELICS_DATA.filter(r => {
        if (!r.job || r.job.toLowerCase().trim() === 'none') return false;
        const cleanJob = r.job.replace(/\s+/g, '');
        return cleanJob.includes('common') || cleanJob.includes(selectedJob);
    });

    const bossRelics = filteredRelicsByJob.filter(r => r.grade === 'boss');
    const shopRelicsPool = filteredRelicsByJob.filter(r => r.grade === 'shop');
    const sideRelicsPool = filteredRelicsByJob.filter(r => r.grade === 'side');

    // 핵심 코어 유물 중복 선택 방지 필터링
    const bossRelicsForMain1 = bossRelics.filter(r => r.id !== main2 && r.id !== main3);
    const bossRelicsForMain2 = bossRelics.filter(r => r.id !== main1 && r.id !== main3);
    const bossRelicsForMain3 = bossRelics.filter(r => r.id !== main1 && r.id !== main2);

    return (
        <Modal open onClose={onClose} title={<><span>📝</span> 새 빌드 작성</>} size="xl">
                <form onSubmit={handlePostSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-5 space-y-4 border-r border-slate-800/60 pr-1 md:pr-4">

                            {/* 직업 선택 슬라이더 */}
                            <div className="space-y-1.5">
                                <span id={jobGroupId} className="text-amber-400 font-bold block text-xs">🎯 빌드 대상 직업군</span>
                                <div role="group" aria-labelledby={jobGroupId} className="relative flex bg-abyss-900 p-1 rounded-xl border border-slate-800 h-9 overflow-hidden select-none">
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
                                                className={`relative flex-1 text-center font-bold text-2xs transition-colors duration-200 z-10 focus-ring cursor-pointer ${
                                                    isSelected ? 'text-slate-950 font-extrabold' : 'text-slate-400 hover:text-slate-200'
                                                }`}
                                            >
                                                {job}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 코어 유물 (BOSS) */}
                            <div className="space-y-3 bg-abyss-900/40 p-3 rounded-xl border border-slate-800">
                                <span className="font-bold text-amber-400 block text-2xs">👑 핵심 코어 유물 (BOSS)</span>
                                <div className="space-y-2.5">
                                    <CustomRelicSelect label="첫 번째 코어 유물" relics={bossRelicsForMain1} selectedValue={main1} onChange={setMain1} />
                                    <CustomRelicSelect label="두 번째 코어 유물" relics={bossRelicsForMain2} selectedValue={main2} onChange={setMain2} />
                                    <CustomRelicSelect label="세 번째 코어 유물" relics={bossRelicsForMain3} selectedValue={main3} onChange={setMain3} />
                                </div>
                            </div>

                            {/* 추천 상점 유물 (SHOP) */}
                            <div className="space-y-1.5">
                                <span className="font-bold text-emerald-400 flex items-center gap-1 text-2xs">🛒 추천 상점 유물 (SHOP)</span>
                                <div className="bg-abyss-900 border border-slate-800 rounded-xl p-2 h-36 overflow-y-auto space-y-0.5 divide-y divide-slate-800/40 custom-scrollbar">
                                    {shopRelicsPool.map(r => {
                                        const isChecked = selectedSides.includes(r.id);
                                        return (
                                            <label key={r.id} className={`flex items-center justify-between cursor-pointer p-1.5 rounded-lg transition-all text-2xs ${isChecked ? 'bg-emerald-500/5 border border-emerald-500/20' : 'hover:bg-slate-800/30 border border-transparent'}`}>
                                                <div className="flex items-center gap-2">
                                                    <PixelImage src={r.imageUrl} alt="" className="w-4 h-4 object-contain" width={16} height={16} />
                                                    <span className="text-slate-200 font-bold">{r.koreanName} <span className="text-2xs text-slate-500 font-normal">({r.job})</span></span>
                                                </div>
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => handleSideToggle(r.id)}
                                                        className="appearance-none w-4 h-4 rounded-md border border-slate-700 bg-slate-900 checked:bg-emerald-500 checked:border-emerald-500 transition-all cursor-pointer focus-ring"
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
                                <span className="font-bold text-blue-400 flex items-center gap-1 text-2xs">🔗 추천 사이드 유물 (SIDE)</span>
                                <div className="bg-abyss-900 border border-slate-800 rounded-xl p-2 h-36 overflow-y-auto space-y-0.5 divide-y divide-slate-800/40 custom-scrollbar">
                                    {sideRelicsPool.map(r => {
                                        const isChecked = selectedSides.includes(r.id);
                                        return (
                                            <label key={r.id} className={`flex items-center justify-between cursor-pointer p-1.5 rounded-lg transition-all text-2xs ${isChecked ? 'bg-blue-500/5 border border-blue-500/20' : 'hover:bg-slate-800/30 border border-transparent'}`}>
                                                <div className="flex items-center gap-2">
                                                    <PixelImage src={r.imageUrl} alt="" className="w-4 h-4 object-contain" width={16} height={16} />
                                                    <span className="text-slate-200 font-bold">{r.koreanName} <span className="text-2xs text-slate-500 font-normal">({r.job})</span></span>
                                                </div>
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => handleSideToggle(r.id)}
                                                        className="appearance-none w-4 h-4 rounded-md border border-slate-700 bg-slate-900 checked:bg-blue-500 checked:border-blue-500 transition-all cursor-pointer focus-ring"
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
                                    <label htmlFor={titleId} className="text-slate-400 block mb-1 font-bold pl-1">공략 게시글 제목</label>
                                    <input
                                        id={titleId}
                                        type="text" required value={title} onChange={e => setTitle(e.target.value)}
                                        className="w-full bg-abyss-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus-ring focus:border-amber-400 text-xs font-bold"
                                        placeholder="예: 소환수 사냥꾼 빌드"
                                    />
                                </div>

                                <div className="flex-1 flex flex-col min-h-[340px]">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <div className="flex bg-abyss-900 p-1 rounded-xl border border-slate-800 gap-1">
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('write')}
                                                className={`px-3 py-1.5 rounded-lg font-bold text-2xs transition cursor-pointer ${activeTab === 'write' ? 'bg-amber-400 text-slate-900' : 'text-slate-400 hover:text-slate-200'}`}
                                            >
                                                ✏️ 에디터 작성
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('preview')}
                                                className={`px-3 py-1.5 rounded-lg font-bold text-2xs transition cursor-pointer ${activeTab === 'preview' ? 'bg-amber-400 text-slate-900' : 'text-slate-400 hover:text-slate-200'}`}
                                            >
                                                👁️ 실시간 미리보기
                                            </button>
                                        </div>
                                        <span className="text-2xs text-slate-500 font-medium"># 대제목 / **굵게** / - 리스트</span>
                                    </div>

                                    {activeTab === 'write' ? (
                                        <textarea
                                            required value={content} onChange={e => setContent(e.target.value)}
                                            className="w-full flex-1 bg-abyss-900 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 focus-ring focus:border-amber-400 text-xs resize-none leading-relaxed font-mono custom-scrollbar"
                                            placeholder="마크다운 문법으로 공략을 작성해보세요!&#10;&#10;### 💡 빌드 핵심 메커니즘&#10;1. **크리티컬 확률** 극대화&#10;2. 상점에서 구입한 유물과 시너지 연계&#10;&#10;- 주의: 보스 광폭화 패턴 전에 스킬 아껴두기!"
                                        />
                                    ) : (
                                        <div className="w-full flex-1 bg-abyss-900 border border-slate-800 rounded-xl px-4 py-3.5 overflow-y-auto text-xs leading-relaxed text-slate-300 custom-scrollbar">
                                            {content.trim() === '' ? (
                                                <span className="text-slate-600 block text-center py-24 font-medium">작성된 내용이 없어 미리볼 수 없습니다.</span>
                                            ) : (
                                                <Markdown size="compact">{content}</Markdown>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800/80">
                                <button type="button" onClick={onClose} className="w-24 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-xl transition cursor-pointer focus-ring">취소</button>
                                <button type="submit" className="w-56 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold py-2.5 rounded-xl transition shadow-lg text-xs tracking-wider cursor-pointer">빌드 공략 등록 완료 🚀</button>
                            </div>
                        </div>
                    </div>
                </form>
        </Modal>
    );
}