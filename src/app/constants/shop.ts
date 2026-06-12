export interface ShopItemConfig {
    id: string;          // DB(shop_items.item_id)에 들어갈 고유 문자열 ID
    koreanName: string;  // 화면에 유저들에게 보여줄 한글 아이템 이름
    imageSrc: string;    // public 폴더 기준 이미지 경로
    category: 'ARMOR' | 'ARTIFACT' | 'ITEM' | 'WEAPON'; // 필터링 및 탭 구성을 위한 카테고리
}

export const AVAILABLE_SHOP_ITEMS: ShopItemConfig[] = [
    // ==========================================
    // 🛡️ ARMOR (방어구 카테고리)
    // ==========================================
    {
        id: 'netherite_boots',
        koreanName: '네더라이트 부츠',
        imageSrc: '/shop/armor/netherite_boots.png',
        category: 'ARMOR',
    },
    {
        id: 'netherite_chestplate',
        koreanName: '네더라이트 체스트플레이트',
        imageSrc: '/shop/armor/netherite_chestplate.png',
        category: 'ARMOR',
    },
    {
        id: 'netherite_helmet',
        koreanName: '네더라이트 헬멧',
        imageSrc: '/shop/armor/netherite_helmet.png',
        category: 'ARMOR',
    },
    {
        id: 'netherite_leggings',
        koreanName: '네더라이트 레깅스',
        imageSrc: '/shop/armor/netherite_leggings.png',
        category: 'ARMOR',
    },

    // ==========================================
    // 🔱 ARTIFACT (아티팩트 카테고리)
    // ==========================================
    {
        id: 'blazing_shield',
        koreanName: '화염의 방패',
        imageSrc: '/shop/artifact/blazing_shield.png',
        category: 'ARTIFACT',
    },
    {
        id: 'kings_insignia',
        koreanName: '국왕의 휘장',
        imageSrc: '/shop/artifact/kings_insignia.png',
        category: 'ARTIFACT',
    },
    {
        id: 'liberated_spirit',
        koreanName: '해방된 영혼',
        imageSrc: '/shop/artifact/liberated_spirit.png',
        category: 'ARTIFACT',
    },
    {
        id: 'oasis_essence',
        koreanName: '오아시스의 정수',
        imageSrc: '/shop/artifact/oasis_essence.png',
        category: 'ARTIFACT',
    },
    {
        id: 'relic_resonance_bell',
        koreanName: '유물 공명의 종',
        imageSrc: '/shop/artifact/relic_resonance_bell.png',
        category: 'ARTIFACT',
    },
    {
        id: 'soul_skein',
        koreanName: '영혼의 실타래',
        imageSrc: '/shop/artifact/soul_skein.png',
        category: 'ARTIFACT',
    },
    {
        id: 'traitor_golden_tooth',
        koreanName: '배신자의 금니',
        imageSrc: '/shop/artifact/traitor_golden_tooth.png',
        category: 'ARTIFACT',
    },

    // ==========================================
    // 📦 ITEM (일반 아이템 및 재료 카테고리)
    // ==========================================
    {
        id: 'ender_chest',
        koreanName: '엔더 상자',
        imageSrc: '/shop/item/ender_chest.png',
        category: 'ITEM',
    },
    {
        id: 'hanger',
        koreanName: '치장',
        imageSrc: '/shop/item/hanger.png',
        category: 'ITEM',
    },
    {
        id: 'magnetite',
        koreanName: '자철석',
        imageSrc: '/shop/item/magnetite.png',
        category: 'ITEM',
    },
    {
        id: 'oblivion_coffer',
        koreanName: '망각의 함 (비귀속)',
        imageSrc: '/shop/item/oblivion_coffer.png',
        category: 'ITEM',
    },
    {
        id: 'sealing_rune',
        koreanName: '증폭 방지의 룬',
        imageSrc: '/shop/item/sealing_rune.png',
        category: 'ITEM',
    },
    {
        id: 'shulker_box',
        koreanName: '셜커 상자',
        imageSrc: '/shop/item/shulker_box.png',
        category: 'ITEM',
    },
    {
        id: 'shulker_shell',
        koreanName: '셜커 껍데기',
        imageSrc: '/shop/item/shulker_shell.png',
        category: 'ITEM',
    },

    // ==========================================
    // ⚔️ WEAPON (무기 카테고리)
    // ==========================================
    {
        id: 'bow',
        koreanName: '활',
        imageSrc: '/shop/weapon/bow.png',
        category: 'WEAPON',
    },
    {
        id: 'crossbow',
        koreanName: '쇠뇌',
        imageSrc: '/shop/weapon/crossbow.png',
        category: 'WEAPON',
    },
    {
        id: 'netherite_sword',
        koreanName: '네더라이트 검',
        imageSrc: '/shop/weapon/netherite_sword.png',
        category: 'WEAPON',
    },
];

/**
 * 💡 헬퍼 함수 1: 아이템 ID(예: 'blazing_shield')를 주면 해당 아이템의 전체 설정 객체를 반환합니다.
 */
export function getShopItemConfig(id: string): ShopItemConfig | undefined {
    return AVAILABLE_SHOP_ITEMS.find((item) => item.id === id);
}

/**
 * 💡 헬퍼 함수 2: 특정 카테고리('ARMOR', 'WEAPON' 등)의 아이템들만 필터링해서 가져옵니다.
 * 장터 상단에 카테고리 탭메뉴를 구현할 때 매우 유용합니다.
 */
export function getShopItemsByCategory(category: ShopItemConfig['category']): ShopItemConfig[] {
    return AVAILABLE_SHOP_ITEMS.filter((item) => item.category === category);
}