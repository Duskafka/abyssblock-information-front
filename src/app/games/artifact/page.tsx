'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
    UPGRADE_TARGET_ARTIFACTS,
    SHARED_SUB_UPGRADE_TABLE,
    SHARED_CURSE_UPGRADE_TABLE,
    ARTIFACT_OPTION_META,
    ARTIFACT_UPGRADE_CHANCE,
    ArtifactConfig
} from '../../constants/artifactUpgrade';

export default function ArtifactUpgradeGame() {
    // 💡 아티펙트 슬라이드바(드롭다운) 정렬 순서 정의
    const SORT_ORDER = [
        'oasis_essence',           // 1. 오아시스
        'soul_skein',               // 2. 실타래
        'blazing_shield',           // 3. 화염방패
        'traitor_golden_tooth',     // 4. 금니
        'kings_insignia',          // 5. 국왕의휘장
        'relic_resonance_bell',     // 6. 유물종
        'liberated_spirit'          // 7. 원혼
    ];

    // 지정된 순서 스펙대로 원본 상수를 재정렬한 리스트 생성
    const sortedArtifacts = [...UPGRADE_TARGET_ARTIFACTS].sort((a, b) => {
        return SORT_ORDER.indexOf(a.id) - SORT_ORDER.indexOf(b.id);
    });

    // 1. 아티펙트 선택 상태 관리 (기본 시작 대상도 정렬 첫 번째인 '오아시스의 정수'로 세팅)
    const [selectedArtifact, setSelectedArtifact] = useState<ArtifactConfig>(sortedArtifacts[0]);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 2. 현재 선택된 아티펙트의 각 인챈트별 개별 레벨 상태 관리
    const [mainLevel, setMainLevel] = useState<number>(4);
    const [subLevel, setSubLevel] = useState<number>(3);
    const [curseLevel, setCurseLevel] = useState<number>(3);

    // 3. 글로벌 제단 강화 메커니즘 상태 관리
    const [successChance, setSuccessChance] = useState<number>(ARTIFACT_UPGRADE_CHANCE.START_CHANCE);
    const [attemptsLeft, setAttemptsLeft] = useState<number>(ARTIFACT_UPGRADE_CHANCE.MAX_ATTEMPTS);
    const [gameHistory, setGameHistory] = useState<string[]>([]);
    const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'fail' | 'neutral' }>({
        text: '강화할 인챈트 옵션의 [강화] 버튼을 클릭해 주세요.',
        type: 'neutral'
    });

    // 외부 클릭 시 커스텀 드롭다운 닫기 모듈
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 🔄 아티펙트 리셋 함수
    const resetAltar = (targetArtifact: ArtifactConfig = selectedArtifact) => {
        setMainLevel(4);
        setSubLevel(3);
        setCurseLevel(3);
        setSuccessChance(ARTIFACT_UPGRADE_CHANCE.START_CHANCE);
        setAttemptsLeft(ARTIFACT_UPGRADE_CHANCE.MAX_ATTEMPTS);
        setGameHistory([]);
        setStatusMessage({
            text: `[${targetArtifact.koreanName}] 제단이 정화되었습니다. 인챈트를 시작하세요.`,
            type: 'neutral'
        });
    };

    // 🎨 아티펙트 셀렉터 변경 핸들러
    const handleArtifactSelect = (artifact: ArtifactConfig) => {
        setSelectedArtifact(artifact);
        resetAltar(artifact);
        setIsDropdownOpen(false);
    };

    // 🎲 인챈트 개별 강화 실행 엔진
    const handleUpgradeOption = (type: 'main' | 'sub' | 'curse') => {
        if (attemptsLeft <= 0) return;

        const roll = Math.random() * 100;
        const isSuccess = roll <= successChance;

        const nextAttempts = attemptsLeft - 1;
        let nextChance = successChance;
        let logMessage = '';
        let optionName = '';
        let afterDesc = '';

        if (isSuccess) {
            // 🟢 성공: 확률 20% 하락 (최하 0%)
            nextChance = Math.max(0, successChance - ARTIFACT_UPGRADE_CHANCE.SUCCESS_DEBUFF);

            if (type === 'main') {
                const nextLevel = Math.min(ARTIFACT_OPTION_META.main.maxLevel, mainLevel + 1);
                const nextVal = selectedArtifact.mainOption.values[nextLevel];
                afterDesc = selectedArtifact.mainOption.renderDescription(nextVal);
                optionName = ARTIFACT_OPTION_META.main.name;
                setMainLevel(nextLevel);
            } else if (type === 'sub') {
                const nextLevel = Math.min(ARTIFACT_OPTION_META.sub.maxLevel, subLevel + 1);
                afterDesc = ARTIFACT_OPTION_META.sub.renderDescription(SHARED_SUB_UPGRADE_TABLE[nextLevel]);
                optionName = ARTIFACT_OPTION_META.sub.name;
                setSubLevel(nextLevel);
            } else {
                const nextLevel = Math.min(ARTIFACT_OPTION_META.curse.maxLevel, curseLevel + 1);
                afterDesc = ARTIFACT_OPTION_META.curse.renderDescription(SHARED_CURSE_UPGRADE_TABLE[nextLevel]);
                optionName = ARTIFACT_OPTION_META.curse.name;
                setCurseLevel(nextLevel);
            }

            logMessage = `[성공] ${optionName} 인챈트 성공! → "${afterDesc}" (확률: ${successChance}% → ${nextChance}%)`;
            setStatusMessage({ text: `✨ ${optionName} 강화 성공!`, type: 'success' });

        } else {
            // 🔴 실패: 확률 20% 보정 상승 (최대 100%)
            nextChance = Math.min(100, successChance + ARTIFACT_UPGRADE_CHANCE.FAIL_BUFF);

            if (type === 'main') {
                optionName = ARTIFACT_OPTION_META.main.name;
                // 💡 [기획 수정] 실패 시 레벨 1단계 하락 (단, 최소 0강 방어)
                const nextLevel = Math.max(0, mainLevel - 1);
                const nextVal = selectedArtifact.mainOption.values[nextLevel];
                afterDesc = selectedArtifact.mainOption.renderDescription(nextVal);

                setMainLevel(nextLevel);
            } else if (type === 'sub') {
                optionName = ARTIFACT_OPTION_META.sub.name;
                // 💡 [기획 수정] 실패 시 레벨 1단계 하락 (단, 규격상 최소 수치인 1강 미만으로 안 떨어지게 방어)
                const nextLevel = Math.max(1, subLevel - 1);
                afterDesc = ARTIFACT_OPTION_META.sub.renderDescription(SHARED_SUB_UPGRADE_TABLE[nextLevel]);

                setSubLevel(nextLevel);
            } else {
                optionName = ARTIFACT_OPTION_META.curse.name;
                // 💡 [기획 수정] 실패 시 레벨 1단계 하락 (단, 규격상 최소 수치인 1강 미만으로 안 떨어지게 방어)
                const nextLevel = Math.max(1, curseLevel - 1);
                afterDesc = ARTIFACT_OPTION_META.curse.renderDescription(SHARED_CURSE_UPGRADE_TABLE[nextLevel]);

                setCurseLevel(nextLevel);
            }

            logMessage = `[실패] ${optionName} 인챈트 실패... 수치 하락 📉 → "${afterDesc}" (확률 보정: ${successChance}% → ${nextChance}%)`;
            setStatusMessage({ text: `💥 ${optionName} 강화 실패! 수치가 하락하고 확률이 보정됩니다.`, type: 'fail' });
        }

        setSuccessChance(nextChance);
        setAttemptsLeft(nextAttempts);
        setGameHistory(prev => [logMessage, ...prev]);

        if (nextAttempts === 0) {
            setStatusMessage({ text: '🔒 모든 강화 횟수(15회)를 소진하여 아티펙트의 마력이 고정되었습니다.', type: 'neutral' });
        }
    };

    // 헬퍼 파서
    const getOptionRenderData = (type: 'main' | 'sub' | 'curse') => {
        if (type === 'main') {
            const currentVal = selectedArtifact.mainOption.values[mainLevel];
            const isMax = mainLevel >= ARTIFACT_OPTION_META.main.maxLevel;
            const nextVal = selectedArtifact.mainOption.values[Math.min(ARTIFACT_OPTION_META.main.maxLevel, mainLevel + 1)];
            return {
                meta: ARTIFACT_OPTION_META.main,
                currentLevel: mainLevel,
                maxLevel: ARTIFACT_OPTION_META.main.maxLevel,
                description: selectedArtifact.mainOption.renderDescription(currentVal),
                nextDescription: isMax ? 'MAX (유지)' : selectedArtifact.mainOption.renderDescription(nextVal),
                isMax
            };
        } else if (type === 'sub') {
            const currentVal = SHARED_SUB_UPGRADE_TABLE[subLevel];
            const isMax = subLevel >= ARTIFACT_OPTION_META.sub.maxLevel;
            const nextVal = SHARED_SUB_UPGRADE_TABLE[Math.min(ARTIFACT_OPTION_META.sub.maxLevel, subLevel + 1)];
            return {
                meta: ARTIFACT_OPTION_META.sub,
                currentLevel: subLevel,
                maxLevel: ARTIFACT_OPTION_META.sub.maxLevel,
                description: ARTIFACT_OPTION_META.sub.renderDescription(currentVal),
                nextDescription: isMax ? 'MAX (유지)' : ARTIFACT_OPTION_META.sub.renderDescription(nextVal),
                isMax
            };
        } else {
            const currentVal = SHARED_CURSE_UPGRADE_TABLE[curseLevel];
            const isMax = curseLevel >= ARTIFACT_OPTION_META.curse.maxLevel;
            const nextVal = SHARED_CURSE_UPGRADE_TABLE[Math.min(ARTIFACT_OPTION_META.curse.maxLevel, curseLevel + 1)];
            return {
                meta: ARTIFACT_OPTION_META.curse,
                currentLevel: curseLevel,
                maxLevel: ARTIFACT_OPTION_META.curse.maxLevel,
                description: ARTIFACT_OPTION_META.curse.renderDescription(currentVal),
                nextDescription: isMax ? 'MAX (유지)' : ARTIFACT_OPTION_META.curse.renderDescription(nextVal),
                isMax
            };
        }
    };

    const mainData = getOptionRenderData('main');
    const subData = getOptionRenderData('sub');
    const curseData = getOptionRenderData('curse');

    return (
        <div className="min-h-screen bg-[#0f141c] text-slate-100 font-sans">
            <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">

                {/* 상단 헤더 및 커스텀 드롭다운 바 영역 */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-[#161d2a] border border-slate-800 rounded-2xl p-5 shadow-xl">
                    <div>
                        <h1 className="text-lg font-black text-amber-400 flex items-center gap-2">
                            심연의 고대 유물 제단
                        </h1>
                        <p className="text-xs text-slate-400 mt-0.5">원하는 옵션을 조율하고 강화하는 인챈트 미니게임</p>
                    </div>

                    {/* 커스텀 셀렉트 드롭다운 컴포넌트 */}
                    <div className="flex items-center gap-3 relative" ref={dropdownRef}>
                        <label className="text-xs text-slate-400 font-medium whitespace-nowrap">대상 유물:</label>

                        <div className="relative w-48">
                            {/* 드롭다운 트리거 버튼 */}
                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full bg-[#0f141c] border border-slate-700 hover:border-amber-400 text-xs text-slate-200 rounded-xl px-3 py-2 flex items-center justify-between gap-2 transition focus:outline-none font-semibold text-left shadow-inner"
                            >
                                <div className="flex items-center gap-2 truncate">
                                    <img
                                        src={selectedArtifact.imageSrc}
                                        alt=""
                                        className="w-4 h-4 object-contain pixelated inline-block"
                                        onError={(e) => { (e.target as HTMLImageElement).src = '🔮'; }}
                                    />
                                    <span className="truncate">{selectedArtifact.koreanName}</span>
                                </div>
                                <svg
                                    className={`w-3 h-3 text-slate-400 transition-transform duration-200 flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* 커스텀 정렬 리스트 순서대로 아이템 출력 */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-full bg-[#161d2a] border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden py-1 max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-1 duration-150">
                                    {sortedArtifacts.map((artifact) => {
                                        const isSelected = artifact.id === selectedArtifact.id;
                                        return (
                                            <button
                                                key={artifact.id}
                                                type="button"
                                                onClick={() => handleArtifactSelect(artifact)}
                                                className={`w-full text-left px-3 py-2.5 text-xs flex items-center gap-2 transition font-medium ${
                                                    isSelected
                                                        ? 'bg-amber-400/10 text-amber-400 font-bold'
                                                        : 'text-slate-300 hover:bg-[#0f141c] hover:text-slate-100'
                                                }`}
                                            >
                                                <img
                                                    src={artifact.imageSrc}
                                                    alt=""
                                                    className="w-4 h-4 object-contain pixelated"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = '🔮'; }}
                                                />
                                                <span className="flex-1 truncate">{artifact.koreanName}</span>
                                                {isSelected && (
                                                    <span className="text-amber-400 text-[10px]">●</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {/* 왼쪽 파트 */}
                    <div className="md:col-span-3 space-y-4">
                        <div className="bg-[#161d2a] border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col items-center">

                            <div className="w-20 h-20 bg-[#0f141c] border border-slate-800 rounded-2xl flex items-center justify-center p-4 mt-2 mb-3 shadow-inner">
                                <img
                                    src={selectedArtifact.imageSrc}
                                    alt={selectedArtifact.koreanName}
                                    className="w-full h-full object-contain pixelated"
                                    onError={(e) => { (e.target as HTMLImageElement).src = '🔮'; }}
                                />
                            </div>

                            <h2 className="text-base font-black text-slate-200 tracking-wide mb-5">
                                {selectedArtifact.koreanName}
                            </h2>

                            {/* 🧩 개별 인챈트 카드 리스트 */}
                            <div className="w-full space-y-3">
                                {[
                                    { type: 'main' as const, data: mainData },
                                    { type: 'sub' as const, data: subData },
                                    { type: 'curse' as const, data: curseData }
                                ].map(({ type, data }) => (
                                    <div
                                        key={type}
                                        className="bg-[#0f141c] p-4 rounded-xl border border-slate-800 shadow-inner flex items-center justify-between gap-4 group hover:border-slate-700/80 transition"
                                    >
                                        <div className="space-y-1 min-w-0 flex-1">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                                                <span>{data.meta.icon}</span>
                                                <span>{data.meta.name}</span>
                                                <span className={`font-mono text-[11px] px-1.5 py-0.5 rounded ${data.meta.colorClass} bg-slate-900 border border-slate-800`}>
                                                    +{data.currentLevel}강 / {data.maxLevel}강
                                                </span>
                                            </div>

                                            <div className="text-xs text-slate-300 font-medium pt-1">
                                                {data.description}
                                            </div>

                                            <div className="text-[10px] text-slate-500 font-mono">
                                                다음 시도 ➡️ <span className="text-slate-400">{data.nextDescription}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleUpgradeOption(type)}
                                            disabled={attemptsLeft === 0}
                                            className="bg-slate-800 hover:bg-amber-400 hover:text-slate-950 disabled:opacity-10 text-slate-200 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-700/50 transition shadow-md whitespace-nowrap"
                                        >
                                            🔨 강화 시도
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 제단 상태 스택 */}
                        <div className="bg-[#161d2a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                            <div className="grid grid-cols-2 gap-3 text-center">
                                <div className="bg-[#0f141c] border border-slate-800 p-3 rounded-xl">
                                    <span className="text-[11px] text-slate-400 block mb-0.5">다음 시도 성공 확률</span>
                                    <span className={`text-xl font-black font-mono ${successChance >= 70 ? 'text-emerald-400' : successChance <= 30 ? 'text-rose-400' : 'text-amber-400'}`}>
                                        {successChance}%
                                    </span>
                                </div>

                                <div className="bg-[#0f141c] border border-slate-800 p-3 rounded-xl">
                                    <span className="text-[11px] text-slate-400 block mb-0.5">남은 총 제단 횟수</span>
                                    <span className="text-xl font-black font-mono text-slate-200">
                                        {attemptsLeft} <span className="text-xs text-slate-500 font-normal">/ {ARTIFACT_UPGRADE_CHANCE.MAX_ATTEMPTS}</span>
                                    </span>
                                </div>
                            </div>

                            <div className={`p-3 rounded-xl text-xs text-center font-medium border ${
                                statusMessage.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                    statusMessage.type === 'fail' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                                        'bg-slate-900 border-slate-800 text-slate-400'
                            }`}>
                                {statusMessage.text}
                            </div>

                            <button
                                onClick={() => resetAltar()}
                                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-3 rounded-xl transition border border-slate-700/30"
                            >
                                🔁 제단 흔적 초기화 (4강 / 3강 / 3강 리셋)
                            </button>
                        </div>
                    </div>

                    {/* 오른쪽 파트 */}
                    <div className="md:col-span-2 bg-[#161d2a] border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col h-[540px]">
                        <div className="border-b border-slate-800 pb-2.5 mb-3">
                            <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                                <span>📜</span> 인챈트 제단 주문 흔적 로그
                            </h3>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2 text-[11px] font-mono pr-1 scrollbar-none">
                            {gameHistory.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-slate-500 text-center py-10">
                                    상단의 인챈트 슬롯 [강화 시도] 버튼을 눌러 스크롤을 새겨보세요.
                                </div>
                            ) : (
                                gameHistory.map((log, idx) => {
                                    const isLogSuccess = log.includes('[성공]');
                                    return (
                                        <div
                                            key={idx}
                                            className={`p-2.5 rounded-lg border leading-relaxed bg-[#0f141c] ${
                                                isLogSuccess ? 'border-emerald-500/20 text-emerald-400/90' : 'border-rose-500/20 text-rose-400/90'
                                            }`}
                                        >
                                            {log}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}