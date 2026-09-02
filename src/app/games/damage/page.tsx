'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import PageShell from '@/components/ui/PageShell';
import PageHeading from '@/components/ui/PageHeading';
import PixelImage from '@/components/ui/PixelImage';
import {
    ABYSSAL_ECHO,
    ACCESSORY_ENHANCE_TABLE,
    BASE_RELIC_UPGRADE,
    ACCESSORY_MAX_ENHANCE_LEVEL,
    ACCESSORY_SLOT_COUNT,
    ARTIFACT_SLOT_COUNT,
    ARTIFACT_STACK_META,
    ATTACK_ENCHANTS,
    ATTACK_ENCHANT_MAX_LEVEL,
    DAMAGE_RELICS,
    STRENGTH_DAMAGE_PER_LEVEL,
    SUB_ENCHANT_MAX_LEVEL,
    SUB_ENCHANT_TABLE,
    SUB_ENCHANT_TARGETS,
    WEAPON_PRESETS
} from '@/app/constants/damageCalc';
import { DAMAGE_BOOST_ARTIFACTS, SHARED_SUB_UPGRADE_TABLE } from '@/app/constants/artifactUpgrade';
import { RELICS_DATA } from '@/app/constants/relics';

// 💍 장신구 4슬롯 표기 (수치에는 영향 없고 이미지·이름만 쓰는 껍데기)
const ACCESSORY_SLOTS = [
    { key: 'ring', name: '심연의 반지', imageSrc: '/accessories/abyss_ring_warrior.png' },
    { key: 'necklace', name: '심연의 목걸이', imageSrc: '/accessories/abyss_necklace_warrior.png' },
    { key: 'belt', name: '심연의 벨트', imageSrc: '/accessories/abyss_belt_warrior.png' },
    { key: 'bracelet', name: '심연 브레이슬릿', imageSrc: '/accessories/abyss_bracelet_warrior.png' }
];

// 📜 유물 id → 이름·이미지 조회 맵 (relics.ts를 출처로 재사용)
const RELIC_INFO = new Map(RELICS_DATA.map((relic) => [relic.id, relic]));

const CARD = 'bg-abyss-800 border border-slate-800 rounded-2xl p-5 shadow-md';
const INNER = 'bg-abyss-900 border border-slate-800 rounded-xl';

interface SelectOption {
    id: string;
    label: string;
    imageSrc?: string;
}

// 프로젝트에 공용 Select가 없어서, 이 페이지에서 4번 넘게 반복되는 드롭다운만 여기서 한 번 정의한다.
function SelectField({
    label,
    value,
    options,
    onChange
}: {
    label: string;
    value: string;
    options: SelectOption[];
    onChange: (id: string) => void;
}) {
    const labelId = useId();
    const [open, setOpen] = useState(false);
    const boxRef = useRef<HTMLDivElement>(null);
    const current = options.find((option) => option.id === value) ?? options[0];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={boxRef}>
            <span id={labelId} className="block text-xs font-bold text-slate-400 mb-1.5">{label}</span>
            <button
                type="button"
                aria-labelledby={labelId}
                aria-expanded={open}
                onClick={() => setOpen(!open)}
                className="w-full bg-abyss-900 border border-slate-700 hover:border-slate-600 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs text-slate-200 font-semibold focus-ring"
            >
                <div className="flex items-center gap-2 truncate">
                    {current?.imageSrc && (
                        <PixelImage src={current.imageSrc} alt="" className="w-5 h-5 object-contain pixelated" width={20} height={20} />
                    )}
                    <span className="truncate">{current?.label}</span>
                </div>
                <svg
                    aria-hidden="true"
                    className={`w-3.5 h-3.5 text-slate-500 transition-transform flex-shrink-0 ${open ? 'rotate-180 text-amber-400' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <div className="absolute left-0 mt-2 w-full bg-abyss-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden p-1 z-50 max-h-60 overflow-y-auto custom-scrollbar animate-fade-in">
                    {options.map((option) => (
                        <button
                            type="button"
                            key={option.id}
                            onClick={() => {
                                onChange(option.id);
                                setOpen(false);
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium text-left transition ${
                                option.id === value
                                    ? 'bg-amber-400/10 text-amber-400 font-bold'
                                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                            }`}
                        >
                            {option.imageSrc && (
                                <PixelImage src={option.imageSrc} alt="" className="w-5 h-5 object-contain pixelated" width={20} height={20} />
                            )}
                            <span className="truncate">{option.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// 🎚️ 좌측 라벨 + 우측 배지 + 슬라이더 한 줄
function LevelSlider({
    label,
    badge,
    min,
    max,
    value,
    accent,
    onChange
}: {
    label: string;
    badge: string;
    min: number;
    max: number;
    value: number;
    accent: string;
    onChange: (next: number) => void;
}) {
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-center text-2xs font-bold font-mono">
                <span className="text-slate-400">{label}</span>
                <span className={accent}>{badge}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full accent-amber-400 bg-slate-800 h-1 rounded cursor-pointer"
            />
        </div>
    );
}

export default function DamageBoostCalculatorPage() {
    const baseAttackId = useId();
    const strengthLevelId = useId();
    const strengthPerLevelId = useId();
    const relicSearchId = useId();

    // 1단계 — 무기 및 주옵 인챈트
    const [weaponId, setWeaponId] = useState<string>('netherite_sword');
    const [baseAttack, setBaseAttack] = useState<number>(8);
    const [enchantLevel, setEnchantLevel] = useState<number>(12);
    const [echoLevel, setEchoLevel] = useState<number>(0);

    // 장신구 4슬롯 — 주옵 종류(날카로움/힘/정밀 강화)는 배율이 같아 강화 레벨만 받는다
    const [accessoryLevels, setAccessoryLevels] = useState<number[]>(() => ACCESSORY_SLOTS.map(() => 0));

    // 2단계 — 힘 효과
    const [strengthLevel, setStrengthLevel] = useState<number>(0);
    const [strengthPerLevel, setStrengthPerLevel] = useState<number>(STRENGTH_DAMAGE_PER_LEVEL);

    // 3단계 — 부옵, 아티펙트, 유물
    const [subEnchantLevel, setSubEnchantLevel] = useState<number>(0);
    const [artifactSubLevel, setArtifactSubLevel] = useState<number>(0);
    const [baseRelicLevel, setBaseRelicLevel] = useState<number>(0);
    // 🔶 아티펙트는 던전에 최대 3개까지 들고 갈 수 있다
    const [artifactSlots, setArtifactSlots] = useState(
        Array.from({ length: ARTIFACT_SLOT_COUNT }, () => ({ id: 'none', level: 1, stacks: 1 }))
    );
    const [relicStacks, setRelicStacks] = useState<Record<string, number>>({});
    const [relicSearch, setRelicSearch] = useState<string>('');

    const weapon = WEAPON_PRESETS.find((item) => item.id === weaponId) ?? WEAPON_PRESETS[0];
    const enchant = ATTACK_ENCHANTS.find((item) => item.id === weapon.enchantId) ?? ATTACK_ENCHANTS[0];
    const isEchoWeapon = weapon.isEcho;

    // 🗡️ 무기를 바꾸면 기본 공격력 프리셋도 함께 바꾼다 (이후 수동 입력으로 덮어쓸 수 있다)
    const handleWeaponChange = (nextId: string) => {
        const nextWeapon = WEAPON_PRESETS.find((item) => item.id === nextId);
        if (!nextWeapon) return;
        setWeaponId(nextId);
        setBaseAttack(nextWeapon.baseAttack);
    };

    const handleAccessoryLevelChange = (index: number, level: number) => {
        setAccessoryLevels((prev) => prev.map((value, i) => (i === index ? level : value)));
    };

    const handleArtifactChange = (index: number, patch: Partial<{ id: string; level: number; stacks: number }>) => {
        setArtifactSlots((prev) => prev.map((slot, i) => (i === index ? { ...slot, ...patch } : slot)));
    };

    // ----------------------------------------------------
    // [계산 엔진] 서버 피해량 공식의 공격 측 3단계를 순서대로 적용한다
    // ----------------------------------------------------
    const result = useMemo(() => {
        // 1단계 — 공격자의 공격력
        // 장신구 4개의 강화율은 합산한 뒤 인챈트 위력에 한 번만 곱한다.
        const enhanceSum = accessoryLevels.reduce((sum, level) => sum + (ACCESSORY_ENHANCE_TABLE[level] ?? 0), 0);

        const rawEnchantValue = enchant.values[enchantLevel - 1] ?? 0;
        const enchantPower = rawEnchantValue * (1 + enhanceSum / 100);
        const afterEnchant = enchant.scaling === 'percent'
            ? baseAttack * (1 + enchantPower / 100)
            : baseAttack + enchantPower;

        // 2단계 — 피해량 추가 (합산)
        let flatRelicSum = 0;
        let percentRelicSum = 0;
        for (const relic of DAMAGE_RELICS) {
            const stacks = relicStacks[relic.id] ?? 0;
            if (stacks <= 0) continue;
            if (relic.effect === 'flat') {
                flatRelicSum += relic.value * stacks;
            } else {
                percentRelicSum += relic.value * stacks;
            }
        }
        const strengthBonus = strengthLevel * strengthPerLevel;
        const afterFlat = afterEnchant + strengthBonus + flatRelicSum;

        // 3단계 — 피해량 % 증가 (합연산 후 1회 곱)
        // 아티펙트 부옵 '강타 인첸트 X% 강화'는 부옵 수치를 곱으로 증폭한다.
        const subEnhanceRate = SHARED_SUB_UPGRADE_TABLE[artifactSubLevel] ?? 0;
        const subBoost = subEnchantLevel > 0
            ? (SUB_ENCHANT_TABLE[subEnchantLevel - 1] ?? 0) * (1 + subEnhanceRate / 100)
            : 0;
        // 아티펙트 3슬롯의 주옵 증가율을 모두 더한다.
        // 영혼의 실타래처럼 중첩되는 주옵은 중첩 수만큼 곱해서 더한다.
        const artifactBoost = artifactSlots.reduce((sum, slot) => {
            const config = DAMAGE_BOOST_ARTIFACTS.find((item) => item.id === slot.id);
            if (!config) return sum;
            const value = config.mainOption.values[slot.level - 1] ?? 0;
            const stacks = ARTIFACT_STACK_META[slot.id] ? slot.stacks : 1;
            return sum + value * stacks;
        }, 0);

        // 기본 유물 강화와 심연의 울림은 "모든 데미지"를 올리므로 3단계 합연산에 넣는다.
        // 심연의 울림은 메아리 무기에만 붙으므로 일반 무기면 0으로 친다.
        const baseRelicBoost = baseRelicLevel * BASE_RELIC_UPGRADE.damagePerLevel;
        const echoBoost = isEchoWeapon ? echoLevel * ABYSSAL_ECHO.damagePerLevel : 0;

        const totalBoost = subBoost + percentRelicSum + artifactBoost + baseRelicBoost + echoBoost;
        const finalDamage = afterFlat * (1 + totalBoost / 100);

        return {
            enhanceSum,
            rawEnchantValue,
            enchantPower,
            afterEnchant,
            strengthBonus,
            flatRelicSum,
            afterFlat,
            subBoost,
            percentRelicSum,
            artifactBoost,
            baseRelicBoost,
            echoBoost,
            totalBoost,
            finalDamage
        };
    }, [
        accessoryLevels, artifactSlots, artifactSubLevel, baseAttack, baseRelicLevel,
        echoLevel, enchant, enchantLevel, isEchoWeapon, relicStacks,
        strengthLevel, strengthPerLevel, subEnchantLevel
    ]);

    // 📜 검색어로 걸러낸 유물 목록 (이름이 relics.ts에 없는 항목은 버린다)
    const visibleRelics = useMemo(() => {
        const keyword = relicSearch.trim();
        return DAMAGE_RELICS.filter((relic) => {
            const info = RELIC_INFO.get(relic.id);
            if (!info) return false;
            if (!keyword) return true;
            return info.koreanName.includes(keyword) || relic.condition.includes(keyword);
        });
    }, [relicSearch]);

    const activeRelicCount = Object.values(relicStacks).filter((count) => count > 0).length;

    return (
        <PageShell width="wide" className="space-y-6">
            <PageHeading description="무기·인챈트·장신구 강화·유물·아티펙트를 조합해 최종 공격 피해량을 계산합니다. 대상 방어력은 데미지 감산 시뮬레이터에서 다룹니다.">
                ⚔️ 데미지 계산 시뮬레이터
            </PageHeading>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ================= 좌측 입력 ================= */}
                <div className="lg:col-span-2 space-y-5">

                    {/* 🗡️ 무기 */}
                    <div className={`${CARD} space-y-4 relative z-30`}>
                        <h3 className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">🗡️ 무기 선택</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <SelectField
                                label="무기"
                                value={weaponId}
                                onChange={handleWeaponChange}
                                options={WEAPON_PRESETS.map((item) => ({
                                    id: item.id,
                                    label: item.koreanName,
                                    imageSrc: item.imageSrc
                                }))}
                            />
                            <div>
                                <label htmlFor={baseAttackId} className="block text-xs font-bold text-slate-400 mb-1.5">
                                    기본 공격력 <span className="text-2xs text-slate-500 font-normal">(바닐라 추정치 · 수정 가능)</span>
                                </label>
                                <input
                                    id={baseAttackId}
                                    type="number"
                                    min={0}
                                    step={0.5}
                                    value={baseAttack}
                                    onChange={(e) => setBaseAttack(Number(e.target.value))}
                                    className="w-full bg-abyss-900 border border-slate-700 focus:border-amber-400 focus-ring rounded-xl px-4 py-2.5 text-sm font-mono text-amber-400 font-bold"
                                />
                            </div>
                        </div>
                        <p className="text-2xs text-slate-500">
                            💡 차징·치명타는 계산에서 제외합니다. 항상 100% 차징 · 비치명타 기준입니다.
                        </p>
                    </div>

                    {/* 🔷 인챈트 */}
                    <div className={`${CARD} space-y-4`}>
                        <h3 className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">
                            🔷 인챈트 — {weapon.koreanName}는 <span className="text-amber-400">{enchant.koreanName}</span> 인챈트를 씁니다
                        </h3>

                        <div className={`${INNER} p-4 space-y-3`}>
                            <LevelSlider
                                label={`주옵 · ${enchant.koreanName} (1 ~ ${ATTACK_ENCHANT_MAX_LEVEL})`}
                                badge={`Lv.${enchantLevel} (+${result.rawEnchantValue}${enchant.unit})`}
                                min={1}
                                max={ATTACK_ENCHANT_MAX_LEVEL}
                                value={enchantLevel}
                                accent="text-amber-400"
                                onChange={setEnchantLevel}
                            />
                            <div className="text-2xs text-slate-400 font-mono">
                                장신구 강화 <span className="text-emerald-400 font-bold">+{result.enhanceSum}%</span> 적용 후 위력{' '}
                                <span className="text-amber-400 font-bold">
                                    {result.enchantPower.toFixed(1)}{enchant.unit}
                                </span>
                                {enchant.scaling === 'flat' && <span className="text-slate-500"> · 공격력에 그대로 더해짐</span>}
                            </div>
                        </div>

                        {isEchoWeapon ? (
                            <div className={`${INNER} p-4 space-y-2`}>
                                <LevelSlider
                                    label={`${ABYSSAL_ECHO.koreanName} (0 ~ ${ABYSSAL_ECHO.maxLevel}) · 메아리 무기 전용`}
                                    badge={`+${echoLevel}강 (+${result.echoBoost}%)`}
                                    min={0}
                                    max={ABYSSAL_ECHO.maxLevel}
                                    value={echoLevel}
                                    accent="text-sky-400"
                                    onChange={setEchoLevel}
                                />
                                <p className="text-2xs text-slate-500">
                                    1강마다 모든 데미지 +{ABYSSAL_ECHO.damagePerLevel}%. 피해량 % 증가에 합산됩니다.
                                </p>
                            </div>
                        ) : (
                            <p className="text-2xs text-slate-500">
                                🌊 {ABYSSAL_ECHO.koreanName} 인챈트는 메아리 무기에만 붙습니다. 무기를 메아리 계열로 바꾸면 나타납니다.
                            </p>
                        )}

                        <div className={`${INNER} p-4 space-y-3`}>
                            <LevelSlider
                                label={`부옵 · 강타 계열 (0 = 없음 ~ ${SUB_ENCHANT_MAX_LEVEL})`}
                                badge={subEnchantLevel === 0 ? '없음' : `Lv.${subEnchantLevel} (+${SUB_ENCHANT_TABLE[subEnchantLevel - 1]}%)`}
                                min={0}
                                max={SUB_ENCHANT_MAX_LEVEL}
                                value={subEnchantLevel}
                                accent="text-emerald-400"
                                onChange={setSubEnchantLevel}
                            />
                            <LevelSlider
                                label="아티펙트 부옵 · 강타 인첸트 강화 (0 = 없음 ~ 4)"
                                badge={artifactSubLevel === 0 ? '없음' : `+${artifactSubLevel}강 (${SHARED_SUB_UPGRADE_TABLE[artifactSubLevel]}% 증폭)`}
                                min={0}
                                max={4}
                                value={artifactSubLevel}
                                accent="text-emerald-400"
                                onChange={setArtifactSubLevel}
                            />
                            <p className="text-2xs text-slate-500 leading-relaxed">
                                💡 {SUB_ENCHANT_TARGETS} 는 대상 유형만 다르고 레벨별 수치가 같아 하나로 묶었습니다.
                                최종 기여도는 <span className="text-emerald-400 font-mono font-bold">+{result.subBoost.toFixed(2)}%</span> 입니다.
                            </p>
                        </div>
                    </div>

                    {/* 💍 장신구 4슬롯 */}
                    <div className={`${CARD} space-y-3`}>
                        <h3 className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">
                            💍 장신구 {ACCESSORY_SLOT_COUNT}슬롯 — 주옵 강화율은 합산 후 인챈트에 한 번 곱해집니다
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                            {ACCESSORY_SLOTS.map((slot, index) => (
                                <div key={slot.key} className={`${INNER} p-3.5 space-y-3`}>
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                                        <PixelImage src={slot.imageSrc} alt="" className="w-5 h-5 object-contain pixelated" width={20} height={20} />
                                        <span>{slot.name}</span>
                                    </div>
                                    <LevelSlider
                                        label={`${enchant.koreanName} 강화 (0 ~ ${ACCESSORY_MAX_ENHANCE_LEVEL})`}
                                        badge={`+${accessoryLevels[index]}강 (${ACCESSORY_ENHANCE_TABLE[accessoryLevels[index]]}%)`}
                                        min={0}
                                        max={ACCESSORY_MAX_ENHANCE_LEVEL}
                                        value={accessoryLevels[index]}
                                        accent="text-emerald-400"
                                        onChange={(next) => handleAccessoryLevelChange(index, next)}
                                    />
                                </div>
                            ))}
                        </div>
                        <p className="text-2xs text-slate-500">
                            💡 날카로움 강화 · 힘 강화 · 정밀 강화는 강화 레벨별 배율이 같아 주옵 종류를 따로 고르지 않습니다.
                            들고 있는 무기의 <span className="text-amber-400">{enchant.koreanName}</span> 인챈트를 증폭합니다.
                        </p>
                    </div>

                    {/* 💪 추가 피해 */}
                    <div className={`${CARD} space-y-4 relative z-10`}>
                        <h3 className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">💪 추가 피해량 (계산식 2단계)</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor={strengthLevelId} className="block text-xs font-bold text-slate-400 mb-1.5">힘 효과 단계</label>
                                <input
                                    id={strengthLevelId}
                                    type="number"
                                    min={0}
                                    value={strengthLevel}
                                    onChange={(e) => setStrengthLevel(Number(e.target.value))}
                                    className="w-full bg-abyss-900 border border-slate-700 focus:border-amber-400 focus-ring rounded-xl px-4 py-2.5 text-sm font-mono text-amber-400 font-bold"
                                />
                            </div>
                            <div>
                                <label htmlFor={strengthPerLevelId} className="block text-xs font-bold text-slate-400 mb-1.5">
                                    단계당 피해량 <span className="text-2xs text-slate-500 font-normal">(바닐라 추정치)</span>
                                </label>
                                <input
                                    id={strengthPerLevelId}
                                    type="number"
                                    min={0}
                                    step={0.5}
                                    value={strengthPerLevel}
                                    onChange={(e) => setStrengthPerLevel(Number(e.target.value))}
                                    className="w-full bg-abyss-900 border border-slate-700 focus:border-amber-400 focus-ring rounded-xl px-4 py-2.5 text-sm font-mono text-amber-400 font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 📿 기본 유물 강화 */}
                    <div className={`${CARD} space-y-3`}>
                        <h3 className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">
                            📿 {BASE_RELIC_UPGRADE.koreanName} (계산식 3단계)
                        </h3>
                        <div className={`${INNER} p-4 space-y-2`}>
                            <LevelSlider
                                label={`강화 레벨 (0 ~ ${BASE_RELIC_UPGRADE.maxLevel})`}
                                badge={`+${baseRelicLevel}강 (+${result.baseRelicBoost}%)`}
                                min={0}
                                max={BASE_RELIC_UPGRADE.maxLevel}
                                value={baseRelicLevel}
                                accent="text-purple-400"
                                onChange={setBaseRelicLevel}
                            />
                            <p className="text-2xs text-slate-500">
                                1강마다 모든 데미지 +{BASE_RELIC_UPGRADE.damagePerLevel}%.
                                만강({BASE_RELIC_UPGRADE.maxLevel}강) 기준 +{BASE_RELIC_UPGRADE.maxLevel * BASE_RELIC_UPGRADE.damagePerLevel}%입니다.
                            </p>
                        </div>
                    </div>

                    {/* 🔶 아티펙트 3슬롯 */}
                    <div className={`${CARD} space-y-4 relative z-10`}>
                        <h3 className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">
                            🔶 아티펙트 {ARTIFACT_SLOT_COUNT}슬롯 — 던전에 최대 {ARTIFACT_SLOT_COUNT}개까지 들고 갈 수 있습니다 (계산식 3단계)
                        </h3>
                        <div className="space-y-4">
                            {artifactSlots.map((slot, index) => {
                                const config = DAMAGE_BOOST_ARTIFACTS.find((item) => item.id === slot.id);
                                const stackMeta = ARTIFACT_STACK_META[slot.id];
                                const unitValue = config ? (config.mainOption.values[slot.level - 1] ?? 0) : 0;
                                // 같은 아티펙트를 두 슬롯에 겹쳐 넣는 건 불가능하므로 이미 고른 건 목록에서 뺀다
                                const takenIds = artifactSlots
                                    .filter((other, i) => i !== index && other.id !== 'none')
                                    .map((other) => other.id);
                                return (
                                    <div key={`artifact-slot-${index + 1}`} className={`${INNER} p-4 space-y-3`}>
                                        <SelectField
                                            label={`슬롯 ${index + 1}`}
                                            value={slot.id}
                                            onChange={(id) => handleArtifactChange(index, { id, level: 1, stacks: 1 })}
                                            options={[
                                                { id: 'none', label: '없음' },
                                                ...DAMAGE_BOOST_ARTIFACTS
                                                    .filter((item) => !takenIds.includes(item.id))
                                                    .map((item) => ({
                                                        id: item.id,
                                                        label: item.koreanName,
                                                        imageSrc: item.imageSrc
                                                    }))
                                            ]}
                                        />
                                        {config && (
                                            <>
                                                <LevelSlider
                                                    label={`${config.mainOption.name} 강화 (1 ~ ${config.mainOption.values.length})`}
                                                    badge={`+${slot.level}강 (+${unitValue}%${stackMeta ? ' / 중첩당' : ''})`}
                                                    min={1}
                                                    max={config.mainOption.values.length}
                                                    value={slot.level}
                                                    accent="text-amber-400"
                                                    onChange={(next) => handleArtifactChange(index, { level: next })}
                                                />
                                                {stackMeta && (
                                                    <LevelSlider
                                                        label={`${stackMeta.label} (1 ~ ${stackMeta.max})`}
                                                        badge={`${slot.stacks}중첩 (+${(unitValue * slot.stacks).toFixed(1)}%)`}
                                                        min={1}
                                                        max={stackMeta.max}
                                                        value={slot.stacks}
                                                        accent="text-emerald-400"
                                                        onChange={(next) => handleArtifactChange(index, { stacks: next })}
                                                    />
                                                )}
                                                <p className="text-2xs text-slate-400">
                                                    {config.mainOption.renderDescription(unitValue)}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 📜 유물 */}
                    <div className={`${CARD} space-y-3`}>
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2 gap-3">
                            <h3 className="text-xs font-bold text-slate-300">📜 피해 증가 유물</h3>
                            <span className="text-2xs font-mono text-emerald-400">{activeRelicCount}개 적용 중</span>
                        </div>
                        <label htmlFor={relicSearchId} className="sr-only">유물 검색</label>
                        <input
                            id={relicSearchId}
                            type="text"
                            value={relicSearch}
                            onChange={(e) => setRelicSearch(e.target.value)}
                            placeholder="유물 이름이나 조건으로 검색"
                            className="w-full bg-abyss-900 border border-slate-700 focus:border-amber-400 focus-ring rounded-xl px-4 py-2.5 text-xs text-slate-200"
                        />
                        <div className="max-h-96 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                            {visibleRelics.length === 0 ? (
                                <p className="text-2xs text-slate-500 text-center py-8">검색 결과가 없습니다.</p>
                            ) : (
                                visibleRelics.map((relic) => {
                                    const info = RELIC_INFO.get(relic.id);
                                    if (!info) return null;
                                    const stacks = relicStacks[relic.id] ?? 0;
                                    const maxStacks = relic.maxStacks ?? 1;
                                    const isOn = stacks > 0;
                                    return (
                                        <div
                                            key={relic.id}
                                            className={`${INNER} p-3 flex items-center gap-3 transition ${isOn ? 'border-emerald-500/30' : ''}`}
                                        >
                                            <PixelImage src={info.imageUrl} alt="" className="w-6 h-6 object-contain pixelated flex-shrink-0" width={24} height={24} />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className="text-xs font-bold text-slate-200 truncate">{info.koreanName}</span>
                                                    <span className={`text-2xs font-mono font-bold ${relic.effect === 'flat' ? 'text-sky-400' : 'text-amber-400'}`}>
                                                        {relic.effect === 'flat' ? `+${relic.value} DMG` : `+${relic.value}%`}
                                                    </span>
                                                </div>
                                                <span className="text-2xs text-slate-500">{relic.condition}</span>
                                            </div>

                                            {maxStacks > 1 ? (
                                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                                    <button
                                                        type="button"
                                                        aria-label={`${info.koreanName} 중첩 감소`}
                                                        onClick={() => setRelicStacks((prev) => ({ ...prev, [relic.id]: Math.max(0, stacks - 1) }))}
                                                        className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-bold focus-ring"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="w-10 text-center text-2xs font-mono text-slate-300">{stacks} / {maxStacks}</span>
                                                    <button
                                                        type="button"
                                                        aria-label={`${info.koreanName} 중첩 증가`}
                                                        onClick={() => setRelicStacks((prev) => ({ ...prev, [relic.id]: Math.min(maxStacks, stacks + 1) }))}
                                                        className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-bold focus-ring"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    aria-pressed={isOn}
                                                    onClick={() => setRelicStacks((prev) => ({ ...prev, [relic.id]: isOn ? 0 : 1 }))}
                                                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-2xs font-bold border transition focus-ring ${
                                                        isOn
                                                            ? 'bg-emerald-400/10 border-emerald-400/30 text-emerald-400'
                                                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                                                    }`}
                                                >
                                                    {isOn ? '적용 중' : '적용'}
                                                </button>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* ================= 우측 결과 ================= */}
                <div className="space-y-4">
                    <div className="bg-gradient-to-b from-amber-400/10 to-transparent border border-amber-400/20 rounded-2xl p-6 shadow-2xl flex flex-col justify-between items-center text-center h-48 relative overflow-hidden">
                        <span className="text-xs font-bold text-amber-400/80 tracking-wide mt-1">최종 공격 피해량</span>
                        <div className="text-5xl font-black font-mono text-amber-400 my-auto drop-shadow-[0_4px_12px_rgba(251,191,36,0.3)]">
                            {result.finalDamage.toFixed(1)}
                        </div>
                        <span className="text-2xs text-slate-500 font-medium">대상 방어력·피해 감소는 반영되지 않은 값입니다.</span>
                    </div>

                    <div className={`${CARD} space-y-4`}>
                        <h3 className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">📋 연산 단계별 수치</h3>
                        <div className="space-y-2.5 font-mono text-xs">
                            <div className={`${INNER} flex justify-between p-2.5`}>
                                <span className="text-slate-400">01. 기본 공격력</span>
                                <span className="text-slate-200 font-bold">{baseAttack} DMG</span>
                            </div>
                            <div className={`${INNER} flex justify-between p-2.5`}>
                                <span className="text-slate-400">02. 인챈트 적용 후</span>
                                <span className="text-amber-400 font-bold">{result.afterEnchant.toFixed(2)} DMG</span>
                            </div>
                            <div className={`${INNER} flex justify-between p-2.5`}>
                                <span className="text-slate-400">03. 피해량 추가 후</span>
                                <span className="text-sky-400 font-bold">{result.afterFlat.toFixed(2)} DMG</span>
                            </div>
                            <div className={`${INNER} flex justify-between p-2.5`}>
                                <span className="text-slate-400">04. 피해량 % 증가 합계</span>
                                <span className="text-emerald-400 font-bold">+{result.totalBoost.toFixed(2)}%</span>
                            </div>
                            <div className="flex justify-between p-2.5 bg-amber-400/5 rounded-xl border border-amber-400/10">
                                <span className="text-amber-400/80 font-bold">05. 최종 피해량</span>
                                <span className="text-amber-400 font-bold">{result.finalDamage.toFixed(2)} DMG</span>
                            </div>
                        </div>
                    </div>

                    <div className={`${CARD} grid grid-cols-3 gap-2 text-center text-xs font-mono`}>
                        <div className={`${INNER} p-2.5`}>
                            <span className="block text-2xs text-slate-500 mb-0.5">장신구 강화</span>
                            <span className="text-emerald-400 font-bold">+{result.enhanceSum}%</span>
                        </div>
                        <div className={`${INNER} p-2.5`}>
                            <span className="block text-2xs text-slate-500 mb-0.5">유물 % 합계</span>
                            <span className="text-amber-400 font-bold">+{result.percentRelicSum}%</span>
                        </div>
                        <div className={`${INNER} p-2.5`}>
                            <span className="block text-2xs text-slate-500 mb-0.5">아티펙트 %</span>
                            <span className="text-amber-400 font-bold">+{result.artifactBoost}%</span>
                        </div>
                        <div className={`${INNER} p-2.5`}>
                            <span className="block text-2xs text-slate-500 mb-0.5">기본 유물</span>
                            <span className="text-purple-400 font-bold">+{result.baseRelicBoost}%</span>
                        </div>
                        <div className={`${INNER} p-2.5`}>
                            <span className="block text-2xs text-slate-500 mb-0.5">심연의 울림</span>
                            <span className="text-sky-400 font-bold">+{result.echoBoost}%</span>
                        </div>
                        <div className={`${INNER} p-2.5`}>
                            <span className="block text-2xs text-slate-500 mb-0.5">부옵</span>
                            <span className="text-emerald-400 font-bold">+{result.subBoost.toFixed(1)}%</span>
                        </div>
                    </div>

                    <div className={`${CARD} space-y-2 text-2xs text-slate-500 leading-relaxed`}>
                        <p className="text-xs font-bold text-slate-300">🧮 적용 순서</p>
                        <p>1️⃣ 공격력 = 기본 공격력에 인챈트 위력을 적용. 장신구 강화율은 합산 후 인챈트에 한 번만 곱합니다.</p>
                        <p>2️⃣ 피해량 추가 = 힘 효과와 고정 수치 유물을 더합니다.</p>
                        <p>3️⃣ 피해량 % 증가 = 부옵 · 유물 · 아티펙트 · 기본 유물 강화 · 심연의 울림 증가율을 모두 더한 뒤 한 번에 곱합니다.</p>
                    </div>
                </div>
            </div>
        </PageShell>
    );
}
