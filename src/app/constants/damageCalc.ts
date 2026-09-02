// ==========================================
// ⚔️ 데미지 계산 시뮬레이터(/games/damage) 전용 데이터
//
// 서버 피해량 계산 공식 중 "공격 측"만 다룬다.
// 대상 방어력·피해 감소는 /games/calculator(데미지 감산 시뮬레이터)의 몫이다.
//
// 유물 이름·이미지는 constants/relics.ts, 무기 이미지는 constants/shop.ts에서
// 가져다 쓰고 이 파일에는 계산에 필요한 수치만 둔다.
// ==========================================

// ==========================================
// 🗡️ 무기 프리셋
// baseAttack은 마인크래프트 바닐라 기준 추정치다. UI에서 직접 덮어쓸 수 있다.
// ==========================================
export type WeaponId =
    | 'netherite_sword' | 'bow' | 'crossbow'
    | 'echo_sword' | 'echo_bow' | 'echo_crossbow';
export type AttackEnchantId = 'sharpness' | 'power' | 'piercing';

export interface WeaponPreset {
    id: WeaponId;
    koreanName: string;
    imageSrc: string;
    baseAttack: number;      // ⚠️ 바닐라 추정치 (검 8 / 활 만충 10 / 쇠뇌 9)
    enchantId: AttackEnchantId;
    isEcho: boolean;         // 메아리 무기만 '심연의 울림' 인챈트를 붙일 수 있다
}

export const WEAPON_PRESETS: WeaponPreset[] = [
    {
        id: 'netherite_sword',
        koreanName: '네더라이트 검',
        imageSrc: '/shop/weapon/netherite_sword.png',
        baseAttack: 8,
        enchantId: 'sharpness',
        isEcho: false
    },
    {
        id: 'bow',
        koreanName: '활',
        imageSrc: '/shop/weapon/bow.png',
        baseAttack: 10,
        enchantId: 'power',
        isEcho: false
    },
    {
        id: 'crossbow',
        koreanName: '쇠뇌',
        imageSrc: '/shop/weapon/crossbow.png',
        baseAttack: 9,
        enchantId: 'piercing',
        isEcho: false
    },
    // 💡 메아리 무기의 기본 공격력은 대응하는 일반 무기와 동일하다(운영자 확인 완료).
    //    차이점은 '심연의 울림' 인챈트를 붙일 수 있다는 것뿐이다.
    {
        id: 'echo_sword',
        koreanName: '메아리 검',
        imageSrc: '/shop/weapon/echo_sword.png',
        baseAttack: 8,
        enchantId: 'sharpness',
        isEcho: true
    },
    {
        id: 'echo_bow',
        koreanName: '메아리 활',
        imageSrc: '/shop/weapon/echo_bow.png',
        baseAttack: 10,
        enchantId: 'power',
        isEcho: true
    },
    {
        id: 'echo_crossbow',
        koreanName: '메아리 쇠뇌',
        imageSrc: '/shop/weapon/echo_crossbow.png',
        baseAttack: 9,
        enchantId: 'piercing',
        isEcho: true
    }
];

// ==========================================
// 🌊 심연의 울림 — 메아리 무기 전용 인챈트
// 0강 ~ 10강, 1강마다 모든 데미지 +10% (최대 +100%)
// ==========================================
export const ABYSSAL_ECHO = {
    koreanName: '심연의 울림',
    maxLevel: 10,
    damagePerLevel: 10
};

// ==========================================
// 📿 기본 유물 강화
// 0강 ~ 25강, 1강마다 모든 데미지 +3% (최대 +75%)
// ==========================================
export const BASE_RELIC_UPGRADE = {
    koreanName: '기본 유물 강화',
    maxLevel: 25,
    damagePerLevel: 3
};

// ==========================================
// 🔷 무기별 공격 인챈트 (Lv.1 ~ Lv.12)
//
// 💡 날카로움만 고정 피해 가산형(flat)이고, 힘·정밀은 % 증가형이다.
//    운영자 확인 지점: 날카로움 Lv11 = +6, 힘 Lv11 = 150% / Lv12 = 162.5%,
//    정밀 Lv1~5 = 16.7/25/33.3/41.7/50 / Lv12 = 108.3%
// ==========================================
export interface AttackEnchant {
    id: AttackEnchantId;
    koreanName: string;
    weaponId: WeaponId;
    scaling: 'percent' | 'flat';
    unit: string;
    values: number[];        // 길이 12 (index 0 = Lv.1)
}

export const ATTACK_ENCHANTS: AttackEnchant[] = [
    {
        id: 'sharpness',
        koreanName: '날카로움',
        weaponId: 'netherite_sword',
        scaling: 'flat',
        unit: ' DMG',
        // 바닐라 날카로움과 동일: 0.5 × Lv + 0.5
        values: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5]
    },
    {
        id: 'power',
        koreanName: '힘',
        weaponId: 'bow',
        scaling: 'percent',
        unit: '%',
        // 화살 피해 % 증가: 25 + 12.5 × (Lv - 1)
        values: [25, 37.5, 50, 62.5, 75, 87.5, 100, 112.5, 125, 137.5, 150, 162.5]
    },
    {
        id: 'piercing',
        koreanName: '정밀',
        weaponId: 'crossbow',
        scaling: 'percent',
        unit: '%',
        // 8.333 × (Lv + 1), 소수점 첫째 자리 반올림
        values: [16.7, 25, 33.3, 41.7, 50, 58.3, 66.7, 75, 83.3, 91.7, 100, 108.3]
    }
];

export const ATTACK_ENCHANT_MAX_LEVEL = 12;

// ==========================================
// 💥 부옵(강타 계열) 무기 피해량 증가 %
//
// 분쇄 강타 / 부패 강타 / 점액 강타 / 신성 / 교화 / 격추 / 도살은
// 적용 대상 유형만 다르고 레벨별 수치가 전부 같으므로 하나로 묶었다.
// 계산식 3단계(피해량 % 증가)에 합산된다.
// ==========================================
export const SUB_ENCHANT_TABLE = [2.5, 5, 7.5, 10]; // index 0 = Lv.1
export const SUB_ENCHANT_MAX_LEVEL = 4;
export const SUB_ENCHANT_TARGETS = '분쇄 강타(스켈레톤) · 부패 강타(좀비) · 점액 강타(슬라임) · 신성(위더) · 교화(주민/습격대) · 격추(공중) · 도살(짐승)';

// ==========================================
// 💍 장신구 (아티펙트와는 별개인 독립 장비군, 4슬롯)
//
// 💡 날카로움 강화 / 힘 강화 / 정밀 강화는 강화 레벨별 배율이 전부 같아서
//    주옵 종류를 고르게 하지 않고 하나로 통일했다. 어떤 무기를 들든
//    장신구는 그 무기의 주옵 인챈트를 증폭한다고 본다.
//
// 4개 슬롯의 강화율을 합산한 뒤 인챈트 수치에 한 번만 곱한다.
// (예: 정밀 50% × (1 + 4.90) = 295%)
// ==========================================
export const ACCESSORY_ENHANCE_TABLE = [0, 5, 15, 30, 50, 75, 105, 140]; // index = 강화 레벨 0~7
export const ACCESSORY_MAX_ENHANCE_LEVEL = 7;
export const ACCESSORY_SLOT_COUNT = 4;

// ==========================================
// 🔶 아티펙트
// 던전에는 최대 3개까지 들고 들어갈 수 있다.
// ==========================================
export const ARTIFACT_SLOT_COUNT = 3;

// 주옵이 중첩되는 아티펙트만 여기에 둔다.
// 영혼의 실타래는 전투 1분 경과마다 중첩되고 최대 5분까지 쌓인다.
export const ARTIFACT_STACK_META: Record<string, { max: number; label: string }> = {
    soul_skein: { max: 5, label: '전투 경과 (분)' }
};

// ==========================================
// 💪 힘 포션 효과
// 단계당 피해량은 바닐라 자바 기준 +3 추정치이므로 UI에서 수정 가능하게 둔다.
// ==========================================
export const STRENGTH_DAMAGE_PER_LEVEL = 3; // ⚠️ 바닐라 추정치

// ==========================================
// 📜 피해 증가 유물
//
// relics.ts의 RELICS_DATA를 전수 확인해 "공격 피해량"에 직접 영향을 주는 것만 추렸다.
// 반사 피해(카타나·깨지지 않는 거울 등)와 흡수 체력처럼 수치가 유동적인 유물은 제외했다.
//
// effect 'flat'    → 계산식 2단계(피해량 추가)에 가산
// effect 'percent' → 계산식 3단계(피해량 % 증가)에 합산
// maxStacks가 있으면 중첩 수량만큼 곱해서 합산한다.
// ==========================================
export interface DamageRelic {
    id: string;              // RELICS_DATA의 id와 동일
    effect: 'percent' | 'flat';
    value: number;
    condition: string;       // 배지로 노출할 적용 조건. '상시'면 조건 없음
    maxStacks?: number;
}

export const DAMAGE_RELICS: DamageRelic[] = [
    // ---------- 상시 적용 ----------
    { id: 'shattered_glass', effect: 'percent', value: 50, condition: '상시' },
    { id: 'soul_crystal', effect: 'flat', value: 10, condition: '상시' },

    // ---------- 대상 조건 ----------
    { id: 'thorn_crown', effect: 'percent', value: 50, condition: '보스 한정' },
    { id: 'sharp_horn', effect: 'percent', value: 100, condition: '적마다 최초 피해 1회' },
    { id: 'whip', effect: 'percent', value: 25, condition: '나약함 단계당', maxStacks: 4 },

    // ---------- 자신 상태 조건 ----------
    { id: 'thorned_heart', effect: 'percent', value: 50, condition: '체력 절반 이하' },
    { id: 'someones_last_will', effect: 'percent', value: 20, condition: '리스폰 기회 0' },
    { id: 'zombified_piglin_tooth', effect: 'flat', value: 15, condition: '방패 쿨다운 중 · 근접' },

    // ---------- 속성 공격 ----------
    { id: 'candlestick', effect: 'percent', value: 50, condition: '화염 공격' },
    { id: 'burning_skull', effect: 'percent', value: 50, condition: '화염 공격 직후 5초' },
    { id: 'icicle', effect: 'percent', value: 50, condition: '빙결 공격' },
    { id: 'ice_tear', effect: 'percent', value: 30, condition: '빙결 공격 직후 5초' },
    { id: 'lightning_bulb', effect: 'percent', value: 50, condition: '번개 피해' },
    { id: 'oxidized_heart', effect: 'percent', value: 50, condition: '번개 피해 직후 5초' },
    { id: 'gunpowder_bundle', effect: 'percent', value: 50, condition: '폭발 피해' },
    { id: 'volcanic_ash', effect: 'percent', value: 50, condition: '폭발 피해 직후 5초' },

    // ---------- 화살 ----------
    { id: 'instant_health_quiver', effect: 'percent', value: 30, condition: '화살 피해' },
    { id: 'obsidian_arrowhead', effect: 'percent', value: 50, condition: '화살 머리 적중' },
    { id: 'boomerang', effect: 'percent', value: 200, condition: '부메랑 적중 후 5초 내 화살' },

    // ---------- 근접 ----------
    { id: 'hoglin_canine', effect: 'flat', value: 50, condition: '강하게 밀친 직후 5초 · 근접' },
    { id: 'large_nail', effect: 'flat', value: 50, condition: '반사 적중 후 다음 공격' },
    { id: 'dartboard', effect: 'percent', value: 150, condition: '투척 유물 머리 적중 후 다음 피해' },

    // ---------- 소환수 ----------
    { id: 'spiked_collar', effect: 'percent', value: 50, condition: '소환수가 입히는 피해' },
    { id: 'tasty_bone', effect: 'percent', value: 20, condition: '늑대 1마리당', maxStacks: 5 },
    { id: 'shield_repair_kit', effect: 'percent', value: 20, condition: '늑대 1마리당', maxStacks: 5 },
    { id: 'honeybee_scepter', effect: 'percent', value: 5, condition: '벌 1마리당', maxStacks: 8 },
    { id: 'totem_of_iron_golem', effect: 'percent', value: 100, condition: '철 골렘 16블록 내' },

    // ---------- 주사위(무작위 눈금) ----------
    { id: 'd20', effect: 'flat', value: 1, condition: '눈금 1칸당 · 근접/화살', maxStacks: 20 },
    { id: 'skull_dice', effect: 'percent', value: 10, condition: '눈금 1칸당 · 보스 한정', maxStacks: 6 }
];
