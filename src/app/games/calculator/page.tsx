'use client';

import { useState, useEffect, useRef } from 'react';

// ====================================================
// 🔱 [상수 선언] 아티펙트 및 장비 데이터 구조 내재화
// ====================================================
interface ArtifactConfig {
    id: string;
    koreanName: string;
    imageSrc: string;
    category: 'ARTIFACT';
    mainOption: {
        name: string;
        renderDescription: (v: number) => string;
        values: number[];
    };
}

const UPGRADE_TARGET_ARTIFACTS: ArtifactConfig[] = [
    {
        id: 'blazing_shield',
        koreanName: '타오르는의 방패',
        imageSrc: '/shop/artifact/blazing_shield.png',
        category: 'ARTIFACT',
        mainOption: {
            name: '화염 장벽',
            renderDescription: (v) => `30 이상의 받는 데미지 물리 ${v} 감소`,
            values: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30]
        }
    },
    {
        id: 'kings_insignia',
        koreanName: '국왕의 휘장',
        imageSrc: '/shop/artifact/kings_insignia.png',
        category: 'ARTIFACT',
        mainOption: {
            name: '왕가의 가호',
            renderDescription: (v) => `받는 마법 피해 ${v}% 감소`,
            values: [1, 3, 5, 7, 9, 11, 13, 15, 22, 30]
        }
    },
    {
        id: 'oasis_essence',
        koreanName: '오아시스의 정수',
        imageSrc: '/shop/artifact/oasis_essence.png',
        category: 'ARTIFACT',
        mainOption: {
            name: '수호의 물결',
            renderDescription: (v) => `받는 화염 피해 ${v} 감소`,
            values: [4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 16.0, 22.0, 30.0]
        }
    }
];

// 📦 방어구 고정 메타데이터 및 마인크래프트 바닐라 네더라이트 최대 스펙 정의
const FIXED_ARMOR_DATA = {
    helmet: { name: '네더라이트 헬멧', image: '/shop/armor/netherite_helmet.png', maxDefense: 3, maxToughness: 3 },
    chestplate: { name: '네더라이트 체스트플레이트', image: '/shop/armor/netherite_chestplate.png', maxDefense: 8, maxToughness: 3 },
    leggings: { name: '네더라이트 레깅스', image: '/shop/armor/netherite_leggings.png', maxDefense: 6, maxToughness: 3 },
    boots: { name: '네더라이트 부츠', image: '/shop/armor/netherite_boots.png', maxDefense: 3, maxToughness: 3 },
};

// 💍 기사의 심연 액세서리 고정 메타데이터 (image_fd0b6b.png 구조 완벽 반영)
const FIXED_ACCESSORY_DATA = {
    ring: { name: '심연의 반지 (전사)', imageSrc: '/accessories/abyss_ring_warrior.png' },
    necklace: { name: '심연의 목걸이 (전사)', imageSrc: '/accessories/abyss_necklace_warrior.png' },
    belt: { name: '심연의 벨트 (전사)', imageSrc: '/accessories/abyss_belt_warrior.png' },
    bracelet: { name: '심연 브레이슬릿 (전사)', imageSrc: '/accessories/abyss_bracelet_warrior.png' },
};

// 📊 계산기 맞춤형 옵션 재조립
const shieldData = UPGRADE_TARGET_ARTIFACTS.find(item => item.id === 'blazing_shield');
const insigniaData = UPGRADE_TARGET_ARTIFACTS.find(item => item.id === 'kings_insignia');
const oasisData = UPGRADE_TARGET_ARTIFACTS.find(item => item.id === 'oasis_essence');

const ARTIFACT_OPTIONS = [
    { id: 'none', koreanName: '없음', imageSrc: '/shop/item/none.png', type: 'none', values: [0] },
    {
        id: 'blazing_shield',
        koreanName: shieldData?.koreanName || '타오르는의 방패',
        imageSrc: shieldData?.imageSrc || '/shop/artifact/blazing_shield.png',
        type: 'flat_conditional',
        values: shieldData?.mainOption.values || [3, 6, 9, 12, 15, 18, 21, 24, 27, 30]
    },
    {
        id: 'kings_insignia',
        koreanName: insigniaData?.koreanName || '국왕의 휘장',
        imageSrc: insigniaData?.imageSrc || '/shop/artifact/kings_insignia.png',
        type: 'percentage',
        values: insigniaData?.mainOption.values || [1, 3, 5, 7, 9, 11, 13, 15, 22, 30]
    },
    {
        id: 'oasis_essence',
        koreanName: oasisData?.koreanName || '오아시스의 정수',
        imageSrc: oasisData?.imageSrc || '/shop/artifact/oasis_essence.png',
        type: 'flat',
        values: oasisData?.mainOption.values || [4, 5, 6, 7, 8, 9, 10, 16, 22, 30]
    }
];

// 장신구 보호 강화 계수 테이블 (기본 1~7 유지)
const getProtectionEnhanceBuff = (level: number): number => {
    const table: Record<number, number> = { 1: 0.03, 2: 0.05, 3: 0.09, 4: 0.15, 5: 0.23, 6: 0.33, 7: 0.45 };
    return table[level] || 0;
};

export default function DamageCalculatorPage() {
    // ----------------------------------------------------
    // [상태 관리] 기본 입력 및 장비 스탯
    // ----------------------------------------------------
    const [rawDamage, setRawDamage] = useState<number>(100);

    const [selectedArtifactId, setSelectedArtifactId] = useState<string>('none');
    const [artifactLevel, setArtifactLevel] = useState<number>(1);
    const [isArtifactDropdownOpen, setIsArtifactDropdownOpen] = useState<boolean>(false);
    const artifactDropdownRef = useRef<HTMLDivElement>(null);

    const [armor, setArmor] = useState({
        helmet: { defense: 3, toughness: 3, protection: 1, subOp: 1 },
        chestplate: { defense: 8, toughness: 3, protection: 1, subOp: 1 },
        leggings: { defense: 6, toughness: 3, protection: 1, subOp: 1 },
        boots: { defense: 3, toughness: 3, protection: 1, subOp: 1 },
    });

    const [accessories, setAccessories] = useState({ ring: 1, necklace: 1, belt: 1, bracelet: 1 });

    const [results, setResults] = useState({
        artifactDamage: 100, armorDamage: 100, protectionDamage: 100, finalDamage: 100,
        totalDefense: 20, totalToughness: 12, totalProtectionEnhance: 0, appliedArtifactValue: 0
    });

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (artifactDropdownRef.current && !artifactDropdownRef.current.contains(event.target as Node)) {
                setIsArtifactDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ----------------------------------------------------
    // [계산 엔진] 실시간 수식 연산 프로세스
    // ----------------------------------------------------
    useEffect(() => {
        const totalDefense = armor.helmet.defense + armor.chestplate.defense + armor.leggings.defense + armor.boots.defense;
        const totalToughness = armor.helmet.toughness + armor.chestplate.toughness + armor.leggings.toughness + armor.boots.toughness;

        const totalProtectionEnhance =
            getProtectionEnhanceBuff(accessories.ring) +
            getProtectionEnhanceBuff(accessories.necklace) +
            getProtectionEnhanceBuff(accessories.belt) +
            getProtectionEnhanceBuff(accessories.bracelet);

        let artifactDamage = rawDamage;
        const currentArt = ARTIFACT_OPTIONS.find(a => a.id === selectedArtifactId) || ARTIFACT_OPTIONS[0];

        const targetIndex = selectedArtifactId === 'none' ? 0 : Math.max(0, artifactLevel - 1);
        const safeIndex = Math.min(targetIndex, currentArt.values.length - 1);
        const artifactValue = currentArt.values[safeIndex] || 0;

        if (currentArt.type === 'flat') {
            artifactDamage = Math.max(0, rawDamage - artifactValue);
        } else if (currentArt.type === 'flat_conditional') {
            if (rawDamage >= 30) {
                artifactDamage = Math.max(0, rawDamage - artifactValue);
            }
        } else if (currentArt.type === 'percentage') {
            artifactDamage = rawDamage * (1 - (artifactValue / 100));
        }

        const minTerm = Math.min(20, Math.max(totalToughness / 5, totalDefense - artifactDamage / (2 + totalToughness / 4)));
        const armorDamage = artifactDamage * (1 - minTerm / 25);

        const mHelmet = armor.helmet.protection * 0.02 * (1 + totalProtectionEnhance);
        const mChest = armor.chestplate.protection * 0.02 * (1 + totalProtectionEnhance);
        const mLeg = armor.leggings.protection * 0.02 * (1 + totalProtectionEnhance);
        const mBoots = armor.boots.protection * 0.02 * (1 + totalProtectionEnhance);

        const protectionMultiplier = (1 - mHelmet) * (1 - mChest) * (1 - mLeg) * (1 - mBoots);
        const protectionDamage = armorDamage * protectionMultiplier;

        const subOpMultiplier =
            (1 - armor.helmet.subOp * 0.02) * (1 - armor.chestplate.subOp * 0.02) * (1 - armor.leggings.subOp * 0.02) * (1 - armor.boots.subOp * 0.02);

        const finalDamage = protectionDamage * subOpMultiplier;

        setResults({
            artifactDamage, armorDamage, protectionDamage, finalDamage,
            totalDefense, totalToughness, totalProtectionEnhance,
            appliedArtifactValue: artifactValue
        });
    }, [rawDamage, selectedArtifactId, artifactLevel, armor, accessories]);

    const handleArmorStatChange = (part: keyof typeof armor, key: 'defense' | 'toughness' | 'protection' | 'subOp', val: number) => {
        setArmor(prev => ({ ...prev, [part]: { ...prev[part], [key]: val } }));
    };

    const currentArtifact = ARTIFACT_OPTIONS.find(item => item.id === selectedArtifactId) || ARTIFACT_OPTIONS[0];

    return (
        <div className="min-h-screen bg-[#0f141c] text-slate-100 font-sans py-10 px-4 md:px-6 select-none">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* 상단 레이아웃 배너 */}
                <div className="bg-[#161d2a] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-xl font-black text-amber-400 flex items-center gap-2">
                            <span>🛡️</span> 데미지 감산 시뮬레이터
                        </h1>
                        <p className="text-xs text-slate-400 mt-1">기사 전용 장신구 자산 및 인챈트 레벨 실시간 최적화 시뮬레이터</p>
                    </div>
                    <div className="text-[11px] font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-500">
                        Abyssblock Core Engine v3.0
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-2 space-y-5">

                        {/* 데미지 입력 및 아티펙트 조건 설정 영역 */}
                        <div className="bg-[#161d2a] border border-slate-800 rounded-2xl p-5 shadow-md space-y-4 z-30 relative">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1.5">들어오는 기본 피해량 (원 데미지)</label>
                                    <input
                                        type="number"
                                        value={rawDamage}
                                        onChange={(e) => setRawDamage(Number(e.target.value))}
                                        className="w-full bg-[#0f141c] border border-slate-700 focus:border-amber-400 focus:outline-none rounded-xl px-4 py-2.5 text-sm font-mono text-amber-400 font-bold"
                                    />
                                </div>

                                <div className="relative" ref={artifactDropdownRef}>
                                    <label className="block text-xs font-bold text-slate-400 mb-1.5">적용 아티펙트 효과 고르기</label>
                                    <button
                                        onClick={() => setIsArtifactDropdownOpen(!isArtifactDropdownOpen)}
                                        className="w-full bg-[#0f141c] border border-slate-700 hover:border-slate-600 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs text-slate-200 font-semibold focus:outline-none"
                                    >
                                        <div className="flex items-center gap-2">
                                            {currentArtifact.id !== 'none' && (
                                                <img src={currentArtifact.imageSrc} alt="" className="w-5 h-5 object-contain [image-rendering:pixelated]" />
                                            )}
                                            <span>{currentArtifact.koreanName}</span>
                                        </div>
                                        <svg className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isArtifactDropdownOpen ? 'rotate-180 text-amber-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {isArtifactDropdownOpen && (
                                        <div className="absolute left-0 mt-2 w-full bg-[#161d2a] border border-slate-700 rounded-xl shadow-2xl overflow-hidden p-1 z-50">
                                            {ARTIFACT_OPTIONS.map((item) => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => {
                                                        setSelectedArtifactId(item.id);
                                                        setArtifactLevel(1);
                                                        setIsArtifactDropdownOpen(false);
                                                    }}
                                                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium text-left transition ${
                                                        selectedArtifactId === item.id ? 'bg-amber-400/10 text-amber-400 font-bold' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                                                    }`}
                                                >
                                                    {item.id !== 'none' && (
                                                        <img src={item.imageSrc} alt="" className="w-5 h-5 object-contain [image-rendering:pixelated]" />
                                                    )}
                                                    <span>{item.koreanName}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 아티펙트 강화 등급 슬라이더 제어 바 */}
                            {selectedArtifactId !== 'none' && (
                                <div className="bg-[#0f141c] border border-slate-800 p-3.5 rounded-xl space-y-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-400 font-semibold flex items-center gap-1">
                                            🔶 아티펙트 주옵션 강화 레벨 (1 ~ 10강)
                                        </span>
                                        <span className="text-amber-400 font-mono font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                                            +{artifactLevel} 강
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={artifactLevel}
                                            onChange={(e) => setArtifactLevel(Number(e.target.value))}
                                            className="w-full accent-amber-400 bg-slate-800 h-1 rounded cursor-pointer"
                                        />
                                        <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">MAX +10</span>
                                    </div>
                                    <div className="text-[11px] text-slate-400">
                                        💡 주옵션 감소 수치: <span className="text-emerald-400 font-bold font-mono">{results.appliedArtifactValue}{currentArtifact.type === 'percentage' ? '%' : ' DMG'}</span> 감산 효과 적용 중
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 📦 방어구 스탯 입력 리스트 카드 */}
                        <div className="bg-[#161d2a] border border-slate-800 rounded-2xl p-5 shadow-md space-y-4">
                            <h3 className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">📦 방어구 부위별 스탯 매칭 (보호·부옵 1~12 레벨 세팅)</h3>

                            <div className="space-y-4">
                                {(Object.keys(armor) as Array<keyof typeof armor>).map((part) => {
                                    const info = FIXED_ARMOR_DATA[part];
                                    const currentProtectionRate = armor[part].protection * 2 * (1 + results.totalProtectionEnhance);
                                    const currentSubOpRate = armor[part].subOp * 2;

                                    return (
                                        <div key={part} className="bg-[#0f141c] border border-slate-800/60 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-start md:items-center">

                                            <div className="w-full md:w-1/5 shrink-0">
                                                <div className="w-full bg-[#161d2a]/50 border border-slate-800/80 px-3 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-300 select-none">
                                                    <img src={info.image} alt="" className="w-5 h-5 object-contain [image-rendering:pixelated]" />
                                                    <span className="truncate">{info.name}</span>
                                                </div>
                                            </div>

                                            <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-[10px] font-bold font-mono">
                                                        <span className="text-slate-500">방어력 (바닐라)</span>
                                                        <span className="text-amber-400">{armor[part].defense} / {info.maxDefense}</span>
                                                    </div>
                                                    <input
                                                        type="range" min="0" max={info.maxDefense} value={armor[part].defense}
                                                        onChange={(e) => handleArmorStatChange(part, 'defense', Number(e.target.value))}
                                                        className="w-full accent-amber-400 bg-slate-800 h-1 rounded cursor-pointer"
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-[10px] font-bold font-mono">
                                                        <span className="text-slate-500">방어강도</span>
                                                        <span className="text-blue-400">{armor[part].toughness} / {info.maxToughness}</span>
                                                    </div>
                                                    <input
                                                        type="range" min="0" max={info.maxToughness} value={armor[part].toughness}
                                                        onChange={(e) => handleArmorStatChange(part, 'toughness', Number(e.target.value))}
                                                        className="w-full accent-blue-400 bg-slate-800 h-1 rounded cursor-pointer"
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-[10px] font-bold font-mono">
                                                        <span className="text-purple-500">보호 (1~12)</span>
                                                        <span className="text-purple-400">Lv.{armor[part].protection} (-{currentProtectionRate.toFixed(1)}%)</span>
                                                    </div>
                                                    <input
                                                        type="range" min="1" max="12" value={armor[part].protection}
                                                        onChange={(e) => handleArmorStatChange(part, 'protection', Number(e.target.value))}
                                                        className="w-full accent-purple-400 bg-slate-800 h-1 rounded cursor-pointer"
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-[10px] font-bold font-mono">
                                                        <span className="text-emerald-500/80">부옵 (1~12)</span>
                                                        <span className="text-emerald-400">Lv.{armor[part].subOp} (-{currentSubOpRate}%)</span>
                                                    </div>
                                                    <input
                                                        type="range" min="1" max="12" value={armor[part].subOp}
                                                        onChange={(e) => handleArmorStatChange(part, 'subOp', Number(e.target.value))}
                                                        className="w-full accent-emerald-400 bg-slate-800 h-1 rounded cursor-pointer"
                                                    />
                                                </div>

                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 💍 장신구 강화 등급 슬라이더 세팅 블록 (FIXED_ACCESSORY_DATA 에셋 연동 완비) */}
                        <div className="bg-[#161d2a] border border-slate-800 rounded-2xl p-5 shadow-md space-y-3">
                            <h3 className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">심연 장신구 보호 강화 레벨 설정</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                {(Object.keys(accessories) as Array<keyof typeof accessories>).map((acc) => {
                                    const meta = FIXED_ACCESSORY_DATA[acc];
                                    return (
                                        <div key={acc} className="bg-[#0f141c] border border-slate-800 p-3.5 rounded-xl space-y-2">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                                                    <img src={meta.imageSrc} alt="" className="w-5 h-5 object-contain [image-rendering:pixelated]" />
                                                    <span>{meta.name}</span>
                                                </div>
                                                <span className="text-emerald-400 font-mono font-black bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20 text-[11px]">
                                                    +{accessories[acc]} 강
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="range" min="1" max="7" value={accessories[acc]}
                                                    onChange={(e) => setAccessories(prev => ({ ...prev, [acc]: Number(e.target.value) }))}
                                                    className="w-full accent-emerald-400 bg-slate-800 h-1 rounded cursor-pointer"
                                                />
                                                <span className="text-[10px] text-slate-500 font-mono">MAX 7</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>

                    {/* 📊 우측 고정 스코어 연산 로그 패널 */}
                    <div className="space-y-4">
                        <div className="bg-gradient-to-b from-amber-400/10 to-transparent border border-amber-400/20 rounded-2xl p-6 shadow-2xl flex flex-col justify-between items-center text-center h-48 relative overflow-hidden">
                            <span className="text-xs font-bold text-amber-400/80 tracking-wide mt-1">최종 피해 감산 결과</span>
                            <div className="text-5xl font-black font-mono text-amber-400 my-auto drop-shadow-[0_4px_12px_rgba(251,191,36,0.3)]">
                                {results.finalDamage.toFixed(3)}
                            </div>
                            <span className="text-[10px] text-slate-500 font-medium">기사의 고유 장신구 이미지 에셋 매핑이 완료되었습니다.</span>
                        </div>

                        <div className="bg-[#161d2a] border border-slate-800 rounded-2xl p-5 shadow-md space-y-4">
                            <h3 className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">📋 연산 단계별 시뮬레이션 수치</h3>

                            <div className="space-y-2.5 font-mono text-xs">
                                <div className="flex justify-between p-2.5 bg-[#0f141c] rounded-xl border border-slate-800">
                                    <span className="text-slate-400">01. 원본 설정 데미지</span>
                                    <span className="text-slate-200 font-bold">{rawDamage} DMG</span>
                                </div>
                                <div className="flex justify-between p-2.5 bg-[#0f141c] rounded-xl border border-slate-800">
                                    <span className="text-slate-400">02. 아티펙트 적용 후</span>
                                    <span className="text-amber-400 font-bold">{results.artifactDamage.toFixed(1)} DMG</span>
                                </div>
                                <div className="flex justify-between p-2.5 bg-[#0f141c] rounded-xl border border-slate-800">
                                    <span className="text-slate-400">03. 방어구 공식 감산 후</span>
                                    <span className="text-slate-200 font-bold">{results.armorDamage.toFixed(3)} DMG</span>
                                </div>
                                <div className="flex justify-between p-2.5 bg-[#0f141c] rounded-xl border border-slate-800">
                                    <span className="text-slate-400">04. 보호+보호강화 시너지</span>
                                    <span className="text-slate-200 font-bold">{results.protectionDamage.toFixed(3)} DMG</span>
                                </div>
                                <div className="flex justify-between p-2.5 bg-amber-400/5 rounded-xl border border-amber-400/10">
                                    <span className="text-amber-400/80 font-bold">05. 부옵션 최종 피해량</span>
                                    <span className="text-amber-400 font-bold">{results.finalDamage.toFixed(3)} DMG</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#161d2a] border border-slate-800 rounded-2xl p-4 shadow-sm grid grid-cols-3 gap-2 text-center text-xs font-mono">
                            <div className="bg-[#0f141c] p-2.5 rounded-xl border border-slate-800">
                                <span className="block text-[10px] text-slate-500 mb-0.5">방어력 합</span>
                                <span className="text-slate-200 font-bold">{results.totalDefense}</span>
                            </div>
                            <div className="bg-[#0f141c] p-2.5 rounded-xl border border-slate-800">
                                <span className="block text-[10px] text-slate-500 mb-0.5">방어강도 합</span>
                                <span className="text-slate-200 font-bold">{results.totalToughness}</span>
                            </div>
                            <div className="bg-[#0f141c] p-2.5 rounded-xl border border-slate-800">
                                <span className="block text-[10px] text-slate-500 mb-0.5">보호강화 버프</span>
                                <span className="text-emerald-400 font-bold">{(results.totalProtectionEnhance * 100).toFixed(0)}%</span>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}