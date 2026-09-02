import type { Metadata } from "next";
import { cookies } from "next/headers";
import DashboardClient from "@/app/components/DashboardClient";
import { CROP_PRICE_COLUMNS, DEFAULT_PRICE_LIMIT } from "@/lib/crop-prices";
import { createServerSupabase } from "@/lib/supabase";
import type { CropPriceRow } from "@/lib/db-types";

export const metadata: Metadata = {
    title: "시세 현황판",
    description:
        "20분 단위로 제보되는 어비스블록 황금 작물 시세를 실시간으로 집계합니다.",
};

// 시세는 20분마다 갱신되고 첫 화면이 항상 최신이어야 하므로 요청마다 다시 그린다.
export const dynamic = "force-dynamic";

/**
 * 시세 현황판.
 *
 * 이전에는 페이지 전체가 'use client'라 첫 페인트가 빈 화면이었고
 * (데이터가 useEffect에서 들어왔다) 페이지별 metadata도 붙일 수 없었다.
 * 이제 첫 조회는 여기 서버에서 하고, 기간 토글·새로고침만 클라이언트가 맡는다.
 */
export default async function DashboardPage() {
    const supabase = createServerSupabase(await cookies());

    const { data } = await supabase
        .from("golden_crop_prices")
        .select(CROP_PRICE_COLUMNS)
        .order("price_time", { ascending: false })
        .limit(DEFAULT_PRICE_LIMIT);

    return (
        <DashboardClient
            initialRows={(data ?? []) as CropPriceRow[]}
            initialLimit={DEFAULT_PRICE_LIMIT}
        />
    );
}
