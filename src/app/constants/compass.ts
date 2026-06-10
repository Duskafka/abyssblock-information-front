// 🧭 등급별 나침반 이미지 매핑 객체 (중앙 관리)
export const COMPASS_IMAGES: Record<string, string> = {
    'WOODEN': '/compass/wooden_compass.png',
    'NULL': '/compass/wooden_compass.png',
    'STONE': '/compass/stone_compass.png',
    'IRON': '/compass/iron_compass.png',
    'NETHERITE': '/compass/netherite_compass.png', // 추가된 이미지 매핑
    'OBSIDIAN': '/compass/obsidian_compass.png',   // 추가된 이미지 매핑
    'GOLDEN': '/compass/golden_compass.png',
    'EMERALD': '/compass/emerald_compass.png',
    'DIAMOND': '/compass/diamond_compass.png',
};

/**
 * 등급에 맞는 나침반 이미지 경로를 안전하게 반환하는 함수
 * @param rank 등급 문자열 (예: 'STONE', 'DIAMOND')
 */
export function getCompassSrc(rank: string | null | undefined): string {
    const currentRank = rank?.toUpperCase() || 'NULL';
    return COMPASS_IMAGES[currentRank] || COMPASS_IMAGES['NULL'];
}