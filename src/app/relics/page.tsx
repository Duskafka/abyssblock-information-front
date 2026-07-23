'use client';

import { useState } from 'react';
import Link from 'next/link';
// RELICS_DATA 및 Relic 인터페이스가 선언된 경로에 맞춰 import 경로를 확인해주세요.
import { RELICS_DATA, Relic } from '@/app/constants/relics';

// 💡 쉼표(,)로 구분된 중복 직업 문자열 분해 및 공통 이모지(🪙) 반영
const getJobEmojis = (jobString: string) => {
    if (!jobString || jobString.toLowerCase().trim() === 'common') return '🪙 전체 공통';

    const jobArray = jobString.split(',').map(job => job.trim());

    const convertedJobs = jobArray.map(job => {
        if (job.includes('마법')) return `🔮 ${job}`;
        if (job.includes('기사')) return `🛡️ ${job}`;
        if (job.includes('사냥꾼') || job.includes('사수')) return `🏹 ${job}`;
        return `⚔️ ${job}`;
    });

    return convertedJobs.join(', ');
};

export default function RelicsArchivePage() {
    // 💡 Supabase 로딩 대신 static 파일 데이터(RELICS_DATA) 적용
    // job이 'none'인 유물은 클라이언트 필터링하여 초기화합니다.
    const [relics] = useState<Relic[]>(() =>
        RELICS_DATA.filter(relic => relic.job && relic.job.toLowerCase().trim() !== 'none')
    );

    // 검색 및 필터 상태
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGrade, setSelectedGrade] = useState<string>('all');
    const [selectedJob, setSelectedJob] = useState<string>('all');

    // 다중 필터링 로직 (Relic 타입 속성에 맞춰 camelCase 적용)
    const filteredRelics = relics.filter(relic => {
        const matchesSearch =
            relic.koreanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            relic.englishName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesGrade = selectedGrade === 'all' || relic.grade === selectedGrade;

        let matchesJob = true;
        if (selectedJob !== 'all') {
            const relicJob = relic.job ? relic.job.toLowerCase() : 'common';
            matchesJob = relicJob.includes('common') || relicJob.includes(selectedJob.toLowerCase());
        }

        return matchesSearch && matchesGrade && matchesJob;
    });

    return (
        <div className="min-h-screen bg-[#0f141c] text-slate-100 font-sans pb-20">
            <main className="max-w-5xl mx-auto px-6 py-10 space-y-6">

                {/* 상단 타이틀 바 */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-end border-b border-slate-800 pb-6 gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-amber-400 flex items-center gap-2 tracking-wide">
                            📖 유물 도감
                        </h2>
                        <p className="text-xs text-slate-400 mt-1.5">
                            현재 등록된 <span className="text-slate-200 font-bold">{relics.length}개</span>의 유물 상세 스펙과 인게임 메커니즘을 한눈에 살펴보세요.
                        </p>
                    </div>
                    <Link
                        href="/board"
                        className="text-xs text-slate-400 hover:text-amber-400 bg-slate-800/40 border border-slate-800 px-4 py-2.5 rounded-xl transition font-medium text-center shrink-0"
                    >
                        ← 빌드 공략 게시판으로 가기
                    </Link>
                </div>

                {/* 🛠️ 콘솔 필터 컨트롤러 */}
                <div className="bg-[#161d2a] border border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-4 space-y-1">
                            <label className="text-[11px] text-slate-400 font-bold block">🔍 유물 검색 (한글/영문)</label>
                            <input
                                type="text"
                                placeholder="유물명 또는 English Name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#0f141c] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400 transition"
                            />
                        </div>
                        <div className="md:col-span-4 space-y-1">
                            <label className="text-[11px] text-slate-400 font-bold block">👑 등급 분류</label>
                            <div className="flex bg-[#0f141c] p-1 rounded-xl border border-slate-700/80 text-[11px] font-bold">
                                {[
                                    { id: 'all', name: '전체' },
                                    { id: 'boss', name: '코어' },
                                    { id: 'shop', name: '상점' },
                                    { id: 'side', name: '사이드' }
                                ].map(g => (
                                    <button
                                        key={g.id} type="button" onClick={() => setSelectedGrade(g.id)}
                                        className={`flex-1 py-1.5 rounded-lg transition ${selectedGrade === g.id ? 'bg-amber-400 text-slate-900' : 'text-slate-400 hover:text-slate-200'}`}
                                    >
                                        {g.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="md:col-span-4 space-y-1">
                            <label className="text-[11px] text-slate-400 font-bold block">🎯 직업 제한 필터</label>
                            <div className="flex bg-[#0f141c] p-1 rounded-xl border border-slate-700/80 text-[11px] font-bold">
                                {[
                                    { id: 'all', name: '전체' },
                                    { id: '기사', name: '🛡️ 기사' },
                                    { id: '마법사수', name: '🔮 마법사수' },
                                    { id: '사냥꾼', name: '🏹 사냥꾼' }
                                ].map(j => (
                                    <button
                                        key={j.id} type="button" onClick={() => setSelectedJob(j.id)}
                                        className={`flex-1 py-1.5 rounded-lg transition ${selectedJob === j.id ? 'bg-amber-400 text-slate-900' : 'text-slate-400 hover:text-slate-200'}`}
                                    >
                                        {j.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="text-[11px] text-slate-500 pt-1 flex justify-between items-center">
                        <span>💡 공통(`common`) 유물은 언제나 필터 결과에 유지됩니다.</span>
                        <span className="font-mono text-slate-400">결과: <span className="text-amber-400 font-bold">{filteredRelics.length}</span> / {relics.length}개</span>
                    </div>
                </div>

                {/* 📋 가로 배치 리스트(Row List) 컨테이너 */}
                <div className="space-y-2.5">
                    {filteredRelics.map(relic => (
                        <div
                            key={relic.id}
                            className="bg-[#161d2a] border border-slate-800/80 hover:border-slate-700 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-200 hover:bg-[#1a2332]/50 shadow-md group"
                        >
                            {/* 1. 왼쪽 덩어리: 유물 아이콘 + 이름 스펙 */}
                            <div className="flex items-center gap-4 min-w-[280px] max-w-[320px] shrink-0">
                                <div className="w-14 h-14 flex items-center justify-center bg-[#0f141c] rounded-xl border border-slate-700/60 p-2.5 shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                                    <img src={relic.imageUrl} alt={relic.koreanName} className="w-full h-full object-contain" />
                                </div>
                                <div className="space-y-0.5 truncate">
                                    <h4 className="text-sm font-extrabold text-slate-200 truncate">
                                        {relic.koreanName}
                                    </h4>
                                    <p className="text-[11px] font-mono text-slate-500 uppercase tracking-tight truncate">
                                        {relic.englishName}
                                    </p>
                                    <span className="inline-block text-[10px] text-amber-400/90 font-semibold bg-amber-400/5 px-2 py-0.5 border border-amber-400/10 rounded-md">
                                        {getJobEmojis(relic.job)}
                                    </span>
                                </div>
                            </div>

                            {/* 2. 중간 덩어리: 가로 상세 설명 */}
                            <div className="flex-1 w-full bg-[#0f141c]/40 rounded-xl p-3 border border-slate-800/60 min-h-[56px] flex items-center">
                                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                                    {relic.description ? relic.description : <span className="text-slate-600 italic">등록된 상세 설명 텍스트가 존재하지 않습니다.</span>}
                                </p>
                            </div>

                            {/* 3. 오른쪽 끝: 등급 분류 배지 */}
                            <div className="shrink-0 min-w-[80px] text-right flex md:block items-center justify-between w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/60">
                                <span className="text-[10px] text-slate-500 md:hidden block font-bold">등급</span>
                                <span className={`text-[10px] uppercase font-mono font-bold tracking-widest px-3 py-1 rounded-lg border inline-block text-center min-w-[75px] ${
                                    relic.grade === 'boss' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                        relic.grade === 'shop' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                            'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                }`}>
                                    {relic.grade}
                                </span>
                            </div>

                        </div>
                    ))}
                </div>

                {/* 결과 검색 전무할 때의 안내 */}
                {filteredRelics.length === 0 && (
                    <div className="bg-[#161d2a] border border-slate-800 rounded-2xl p-16 text-center text-slate-400 text-xs shadow-md">
                        🔍 검색 조건과 일치하는 유물이 도감에 없습니다.
                    </div>
                )}

            </main>
        </div>
    );
}