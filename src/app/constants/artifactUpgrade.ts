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
        koreanName: '화염의 방패',
        imageSrc: '/shop/artifact/blazing_shield.png',
        category: 'ARTIFACT',
        mainOption: {
            name: '화염 장벽',
            renderDescription: (v) => `30 이상의 받는 데미지 ${v} 감소`,
            // 🔥 화염의 방패 고유 주옵션 수치 (예시: 0강 15% 시작, 강당 3%씩)
            values: [15.0, 18.0, 21.0, 24.0, 27.0, 30.0, 33.0, 36.0, 39.0, 42.0, 45.0]
        }
    },
    {
        id: 'kings_insignia',
        koreanName: '국왕의 휘장',
        imageSrc: '/shop/artifact/kings_insignia.png',
        category: 'ARTIFACT',
        mainOption: {
            name: '왕가의 가호',
            renderDescription: (v) => `받는 바법 피해 ${v}% 감소`,
            // 👑 국왕의 휘장 고유 주옵션 수치 (예시: 0강 8% 시작, 강당 2%씩)
            values: [8.0, 10.0, 12.0, 14.0, 16.0, 18.0, 20.0, 22.0, 24.0, 26.0, 28.0]
        }
    },
    {
        id: 'liberated_spirit',
        koreanName: '해방된 영혼',
        imageSrc: '/shop/artifact/liberated_spirit.png',
        category: 'ARTIFACT',
        mainOption: {
            name: '원혼의 복수',
            renderDescription: (v) => `보스 몬스터에게 주는 피해량 ${v}% 증가`,
            // 👻 해방된 영혼 고유 주옵션 수치 (예시: 0강 10% 시작, 강당 2.5%씩)
            values: [10.0, 12.5, 15.0, 17.5, 20.0, 22.5, 25.0, 27.5, 30.0, 32.5, 80.0]
        }
    },
    {
        id: 'oasis_essence',
        koreanName: '오아시스의 정수',
        imageSrc: '/shop/artifact/oasis_essence.png',
        category: 'ARTIFACT',
        mainOption: {
            name: '마나의 오아시스',
            renderDescription: (v) => `받는 화염 피해 ${v} 감소`,
            values: [5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 30.0]
        }
    },
    {
        id: 'relic_resonance_bell',
        koreanName: '유물 공명의 종',
        imageSrc: '/shop/artifact/relic_resonance_bell.png',
        category: 'ARTIFACT',
        mainOption: {
            name: '공명 주파수',
            renderDescription: (v) => `모든 데미지 ${v}% 증가`,
            values: [2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 40.0]
        }
    },
    {
        id: 'soul_skein',
        koreanName: '영혼의 실타래',
        imageSrc: '/shop/artifact/soul_skein.png',
        category: 'ARTIFACT',
        mainOption: {
            name: '시간의 실타래',
            renderDescription: (v) => `1분마다 데미지 ${v}% 증가. 최대 5분`,
            values: [4.0, 4.8, 5.6, 6.4, 7.2, 8.0, 8.8, 9.6, 10.4, 11.2, 12.0]
        }
    },
    {
        id: 'traitor_golden_tooth',
        koreanName: '배신자의 금니',
        imageSrc: '/shop/artifact/traitor_golden_tooth.png',
        category: 'ARTIFACT',
        mainOption: {
            name: '황금 거래 법칙',
            renderDescription: (v) => `던전 보상 상자 추가 드롭 확률 ${v}% 증가`,
            values: [3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 10.0]
        }
    },
];

// ==========================================
// 📊 모든 아티펙트가 공통으로 공유하는 Sub 및 Curse 스펙 테이블
// ==========================================
// 💡 최대치(레벨)가 4강이므로 0강 ~ 4강까지만 정의합니다.
export const SHARED_SUB_UPGRADE_TABLE: Record<number, number> = {
    1: 1.0,
    2: 2.0,
    3: 3.0,
    4: 4.0, // 최대 레벨 4강, 최대 수치 4%
};

export const SHARED_CURSE_UPGRADE_TABLE: Record<number, number> = {
    1: 1.0,
    2: 2.0,
    3: 3.0,
    4: 4.0, // 최대 레벨 4강, 최대 수치 4%
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