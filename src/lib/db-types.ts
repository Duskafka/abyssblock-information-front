/**
 * Supabase 테이블 행 타입.
 *
 * 이전에는 `timeline`, `user`, `profile`, `dbItem`, `post` 같은 핵심 모델이
 * 전부 `: any`였다. `tsconfig`는 `strict: true`인데 정작 데이터가 드나드는
 * 경계에는 타입이 없어서, 컬럼명을 잘못 써도 빌드가 통과했다.
 *
 * 스키마를 그대로 옮겨 적은 것이므로 DB에서 컬럼을 바꾸면 여기도 함께 고쳐야 한다.
 */

/** 20분 단위 황금 작물 시세 스냅샷 */
export interface CropPriceRow {
    id: number;
    /** "YYYY-MM-DD HH:mm:ss" 형식의 시세 기준 시각 */
    price_time: string;
    wheat: number | null;
    beetroot: number | null;
    potato: number | null;
    carrot: number | null;
    pumpkin: number | null;
    melon: number | null;
    /** 시세를 등록한 대원의 마인크래프트 닉네임. 빈 슬롯이면 null */
    registered_by: string | null;
}

/**
 * 화면에 그리는 20분 격자 한 칸.
 *
 * DB 행이 없는 시간대도 자리를 비워 두어야 그래프의 x축 간격이 일정하므로,
 * 조회 결과를 그대로 쓰지 않고 이 형태로 채워서 넘긴다.
 */
export interface CropPriceSlot extends Omit<CropPriceRow, "id"> {
    id?: number;
    /** "HH:mm" — 보는 사람의 로컬 시간 기준 라벨 */
    display_time: string;
}

/** 대원 프로필 */
export interface ProfileRow {
    id: string;
    minecraft_username: string | null;
    /** 나침반 등급 (BRONZE · SILVER · ECHO …). 미연동 계정은 null */
    compass_rank: string | null;
    /** 마인크래프트 계정 UUID */
    mojang_uuid: string | null;
    /** 시세 제보 누적 횟수. 72회마다 보상 수령 가능 */
    crop_share_count: number;
    /** 프리미엄 구독 만료 시각. 미구독이면 null */
    premium_until: string | null;
}

/** 빌드 공유 게시판 글 */
export interface PostRow {
    /** uuid. golden_crop_prices·shop_items의 bigint와 달리 문자열이다. */
    id: string;
    user_id: string;
    author_name: string | null;
    title: string;
    content: string;
    /** 기사 · 마법사수 · 사냥꾼 */
    job: string | null;
    main_relic_1: string | null;
    main_relic_2: string | null;
    main_relic_3: string | null;
    side_relics: string[] | null;
    created_at: string;
    updated_at: string | null;
}

/** 목록 카드가 쓰는, 유물 정보가 붙은 게시글 */
export interface PostWithRelics extends PostRow {
    compass_rank: string;
    m1: RelicBadge | null;
    m2: RelicBadge | null;
    m3: RelicBadge | null;
}

/** 카드에 뱃지로 붙는 유물 최소 정보 */
export interface RelicBadge {
    korean_name: string;
    image_url: string;
}

/** 장터 매물 */
export interface ShopItemRow {
    id: number;
    /** constants/shop.ts의 아이템 고유 문자열 ID */
    item_id: string;
    seller_id: string;
    seller_name: string;
    price: number;
    quantity: number;
    /** 강화 수치. 강화 개념이 없는 아이템은 0 */
    item_level: number;
    description: string | null;
    created_at: string;
}
