export interface ArtifactConfig {
    id: string;
    koreanName: string;
    imageSrc: string;
    category: 'ARTIFACT';
    // 📝 주 옵션(Main)은 아티펙트 고유의 설명과 레벨별 고유 수치 배열을 가집니다. (0강 ~ 10강 총 11개)
    mainOption: {
        name: string;
        renderDescription: (v: number) => string;
        values: number[]; // [0강수치, 1강수치, ..., 10강수치] 총 11개 원소
    };
}

// ==========================================
// 🔱 상점 데이터 기반 아티펙트 리스트 (Main 옵션 개별 분리)
// ==========================================
export const UPGRADE_TARGET_ARTIFACTS: ArtifactConfig[] = [
    {
        id: 'blazing_shield',
        koreanName: '타오르는의 방패',
        imageSrc: '/shop/artifact/blazing_shield.png',
        category: 'ARTIFACT',
        mainOption: {
            name: '화염 장벽',
            renderDescription: (v) => `30 이상의 받는 데미지 물리 ${v} 감소`,
            // 🔥 화염의 방패 고유 주옵션 수치 (예시: 0강 15% 시작, 강당 3%씩)
            values: [1, 3, 5, 7, 10, 13, 16, 20, 25, 30]
        }
    },
    {
        id: 'kings_insignia',
        koreanName: '국왕의 휘장',
        imageSrc: '/shop/artifact/kings_insignia.png',
        category: 'ARTIFACT',
        mainOption: {
            name: '지배자의 가호',
            renderDescription: (v) => `받는 마법 피해 ${v}% 감소`,
            // 👑 국왕의 휘장 고유 주옵션 수치 (예시: 0강 8% 시작, 강당 2%씩)
            values: [1, 3, 5, 7, 10, 13, 16, 20, 25, 30]
        }
    },
    {
        id: 'liberated_spirit',
        koreanName: '해방된 영혼',
        imageSrc: '/shop/artifact/liberated_spirit.png',
        category: 'ARTIFACT',
        mainOption: {
            name: '망령의 복수',
            renderDescription: (v) => `보스에게 입히는 모든 공격 피해량 ${v}% 증가`,
            // 👻 해방된 영혼 고유 주옵션 수치 (예시: 0강 10% 시작, 강당 2.5%씩)
            values: [1, 3, 7, 11, 16, 23, 32, 44, 60, 80]
        }
    },
    {
        id: 'oasis_essence',
        koreanName: '오아시스의 정수',
        imageSrc: '/shop/artifact/oasis_essence.png',
        category: 'ARTIFACT',
        mainOption: {
            name: '수호의 물결',
            renderDescription: (v) => `적에게 받는 30 이상의 화염 피해 감 ${v} 감소`,
            values: [1.0, 2.0, 3.0, 4.0, 6.0, 8.0, 12.0, 16.0, 22.0, 30.0]
        }
    },
    {
        id: 'relic_resonance_bell',
        koreanName: '유물 공명의 종',
        imageSrc: '/shop/artifact/relic_resonance_bell.png',
        category: 'ARTIFACT',
        mainOption: {
            name: '과거의 영광',
            renderDescription: (v) => `적에게 입히는 모든 피해 ${v}% 증가`,
            values: [1, 3, 6, 9, 13, 17, 21, 27, 33, 40]
        }
    },
    {
        id: 'soul_skein',
        koreanName: '영혼의 실타래',
        imageSrc: '/shop/artifact/soul_skein.png',
        category: 'ARTIFACT',
        mainOption: {
            name: '영혼 포획',
            renderDescription: (v) => `전투 1분 경과마다 모든 공격 피해량 ${v}% 증가. 최대 5분`,
            values: [2.0, 2.4, 2.8, 3.2, 3.8, 4.4, 5.2, 6, 7, 8]
        }
    },
    {
        id: 'traitor_golden_tooth',
        koreanName: '배신자의 금니',
        imageSrc: '/shop/artifact/traitor_golden_tooth.png',
        category: 'ARTIFACT',
        mainOption: {
            name: '끝없는 욕망',
            renderDescription: (v) => `6층 미만의 전리품 상자 추가 드롭 확률 ${v}% 증가`,
            values: [1, 2, 3, 4, 5, 7, 8, 10, 12, 15]
        }
    },
];

// ==========================================
// 📊 모든 아티펙트가 공통으로 공유하는 Sub 및 Curse 스펙 테이블
// ==========================================
// 💡 최대치(레벨)가 4강이므로 0강 ~ 4강까지만 정의합니다.
export const SHARED_SUB_UPGRADE_TABLE: Record<number, number> = {
    1: 10.0,
    2: 26.0,
    3: 45.0,
    4: 70.0,
    5: 100.0
};

export const SHARED_CURSE_UPGRADE_TABLE: Record<number, number> = {
    1: 1.0,
    2: 3.0,
    3: 7.0,
    4: 12.0,
    5: 20.0,
};

// ==========================================
// ⚙️ 개별 인챈트 옵션 공통 메타데이터 (고정 텍스트 반영)
// ==========================================
export const ARTIFACT_OPTION_META = {
    main: {
        name: '주 옵션',
        unit: '%',
        icon: '🔶',
        colorClass: 'text-amber-400',
        maxLevel: 10,
    },
    sub: {
        name: '부 옵션',
        unit: '%',
        icon: '🔷',
        colorClass: 'text-emerald-400',
        maxLevel: 4, // 💡 부옵션 최대 레벨 제한 추가
        renderDescription: (v: number) => `강타 인첸트 ${v}% 강화`,
    },
    curse: {
        name: '공허의 저주',
        unit: '%',
        icon: '💀',
        colorClass: 'text-rose-400',
        maxLevel: 4, // 💡 저주옵션 최대 레벨 제한 추가
        renderDescription: (v: number) => `루비 획득량 ${v}% 감소`,
    },
};

// 시스템 공통 기본 확률 상수는 유지
export const ARTIFACT_UPGRADE_CHANCE = {
    START_CHANCE: 50,
    SUCCESS_DEBUFF: 20,
    FAIL_BUFF: 20,
    MAX_ATTEMPTS: 15,
};