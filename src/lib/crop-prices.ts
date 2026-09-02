import type { CropPriceRow, CropPriceSlot } from "@/lib/db-types";

/** 기본 조회 개수. 20분 단위이므로 6개 = 2시간. */
export const DEFAULT_PRICE_LIMIT = 6;

/** 시세 조회에 쓰는 컬럼 목록. 서버·클라이언트가 같은 모양을 받아야 한다. */
export const CROP_PRICE_COLUMNS =
    "id, price_time, wheat, beetroot, potato, carrot, pumpkin, melon, registered_by";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * DB 행을 20분 간격 격자로 채운다.
 *
 * 비어 있는 시간대도 자리를 만들어야 그래프 x축 간격이 일정해진다.
 * 이 계산은 반드시 클라이언트에서 해야 한다 — 라벨이 보는 사람의 로컬 시간
 * 기준이라, 서버(대개 UTC)에서 만들면 한국 사용자에게 9시간 어긋난 시각이 찍힌다.
 */
export function buildPriceGrid(
    rows: CropPriceRow[],
    limit: number,
): CropPriceSlot[] {
    const sortedRaw = [...rows].sort((a, b) =>
        a.price_time.localeCompare(b.price_time),
    );
    const grid: CropPriceSlot[] = [];
    const now = new Date();

    const roundedMinutes = Math.floor(now.getMinutes() / 20) * 20;
    const baseTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours(),
        roundedMinutes,
        0,
        0,
    );

    for (let i = limit - 1; i >= 0; i--) {
        const gridTime = new Date(baseTime.getTime() - i * 20 * 60 * 1000);
        const gridTimestamp = gridTime.setSeconds(0, 0);

        const matched = sortedRaw.find((d) => {
            if (!d.price_time) return false;
            const dTime = new Date(d.price_time.replace(" ", "T"));
            dTime.setSeconds(0, 0);
            return dTime.getTime() === gridTimestamp;
        });

        const displayLabel = `${pad(gridTime.getHours())}:${pad(gridTime.getMinutes())}`;

        if (matched) {
            grid.push({ ...matched, display_time: displayLabel });
        } else {
            grid.push({
                price_time: `${gridTime.getFullYear()}-${pad(gridTime.getMonth() + 1)}-${pad(gridTime.getDate())} ${displayLabel}:00`,
                display_time: displayLabel,
                wheat: null,
                beetroot: null,
                potato: null,
                carrot: null,
                pumpkin: null,
                melon: null,
                registered_by: null,
            });
        }
    }

    return grid;
}
