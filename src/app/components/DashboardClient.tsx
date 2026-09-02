"use client";

import { useEffect, useRef, useState } from "react";
import dynamicImport from "next/dynamic";

// recharts는 컨테이너 크기를 재서 그리므로 서버에서는 그릴 것이 없다.
// (SSR하면 width/height가 -1이라 경고만 남기고 빈 svg가 나간다.)
// 시세 카드와 랭킹은 서버에서 그대로 렌더되고, 그래프만 하이드레이션 후 붙는다.
const CropLineChart = dynamicImport(
    () => import("@/components/CropLineChart"),
    {
        ssr: false,
        loading: () => (
            <div className="bg-abyss-800 border border-slate-800 rounded-xl p-6 shadow-2xl min-h-[460px] flex items-center justify-center text-slate-500 text-sm">
                그래프를 준비하는 중입니다...
            </div>
        ),
    },
);
import ModGuideModal from "@/components/ModGuideModal"; // 💡 가이드 모달 컴포넌트 임포트
import PageShell from "@/components/ui/PageShell";
import PageHeading from "@/components/ui/PageHeading";
import PixelImage from "@/components/ui/PixelImage";
import { getBrowserSupabase } from "@/lib/supabase";
import type { CropPriceRow, CropPriceSlot } from "@/lib/db-types";
import { CROP_PRICE_COLUMNS, buildPriceGrid } from "@/lib/crop-prices";

interface DashboardClientProps {
    /** 서버 컴포넌트가 미리 조회해 넘긴 첫 화면 데이터 */
    initialRows: CropPriceRow[];
    /** 서버가 조회할 때 쓴 개수 */
    initialLimit: number;
}

/**
 * 시세 현황판의 인터랙티브 부분.
 *
 * 이전에는 페이지 전체가 'use client'였고 데이터도 useEffect에서 받아와서,
 * 첫 페인트가 항상 빈 화면이었고 페이지별 metadata도 붙일 수 없었다.
 * 이제 첫 데이터는 서버에서 받아 props로 들어오고, 기간 토글·새로고침만
 * 여기서 다시 조회한다.
 */
export default function DashboardClient({
    initialRows,
    initialLimit,
}: DashboardClientProps) {
    const supabase = getBrowserSupabase();

    const [timeline, setTimeline] = useState<CropPriceSlot[]>(() =>
        buildPriceGrid(initialRows, initialLimit),
    );
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [limit, setLimit] = useState<number>(initialLimit); // 6개 = 2시간, 12개 = 4시간 ...

    // 모드 가이드 오픈 토글 상태만 유지
    const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

    // 첫 렌더는 서버가 넘겨준 데이터를 그대로 쓴다. 같은 조회를 한 번 더 하지 않는다.
    const hasServerData = useRef(true);

    // 📡 기간을 바꾸거나 새로고침을 누를 때만 다시 조회한다.
    const fetchTimelineData = async (currentLimit: number = limit) => {
        try {
            setLoading(true);
            setErrorMsg(null);

            const { data, error } = await supabase
                .from("golden_crop_prices")
                .select(CROP_PRICE_COLUMNS)
                .order("price_time", { ascending: false })
                .limit(currentLimit);

            if (error) throw error;

            setTimeline(
                buildPriceGrid((data ?? []) as CropPriceRow[], currentLimit),
            );
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setErrorMsg("데이터베이스 통신 에러: " + message);
        } finally {
            setLoading(false);
        }
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: limit 변경만 트리거로 쓴다
    useEffect(() => {
        if (hasServerData.current) {
            hasServerData.current = false;
            return;
        }
        fetchTimelineData(limit);
    }, [limit]);

    const currentActive = [...timeline]
        .reverse()
        .find((slot) => slot.registered_by !== null);

    const getRankings = () => {
        const counts: { [key: string]: number } = {};
        timeline.forEach((slot) => {
            if (slot.registered_by) {
                counts[slot.registered_by] =
                    (counts[slot.registered_by] || 0) + 1;
            }
        });
        return Object.keys(counts)
            .map((username) => ({ username, count: counts[username] }))
            .sort((a, b) => b.count - a.count);
    };

    const rankings = getRankings();

    const getTimeLabel = (currentLimit: number) => {
        if (currentLimit === 6) return "2시간";
        if (currentLimit === 12) return "4시간";
        if (currentLimit === 24) return "8시간";
        if (currentLimit === 36) return "12시간";
        if (currentLimit === 72) return "24시간";
        return `${currentLimit}개`;
    };

    return (
        <div className="relative">
            <PageShell width="wide" className="space-y-10">
                <PageHeading description="20분 단위로 제보되는 황금 작물 시세를 실시간으로 집계합니다.">
                    📈 시세 현황판
                </PageHeading>

                {/* SECTION A: 현재 적용 중인 시세 요약 단가 카드 */}
                <section className="space-y-4">
                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <span>💡</span> 현재 적용 중인 시세{" "}
                        {currentActive && (
                            <span className="text-xs text-emerald-400 lowercase">
                                ({currentActive.registered_by})
                            </span>
                        )}
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        {[
                            {
                                label: "황금 밀",
                                value: currentActive?.wheat,
                                icon: "/crop/golden_wheat.png",
                            },
                            {
                                label: "황금 비트",
                                value: currentActive?.beetroot,
                                icon: "/crop/golden_beetroot.png",
                            },
                            {
                                label: "황금 당근",
                                value: currentActive?.carrot,
                                icon: "/crop/golden_carrot.png",
                            },
                            {
                                label: "황금 감자",
                                value: currentActive?.potato,
                                icon: "/crop/golden_potato.png",
                            },
                            {
                                label: "황금 수박",
                                value: currentActive?.melon,
                                icon: "/crop/golden_watermelon.png",
                            },
                            {
                                label: "황금 호박",
                                value: currentActive?.pumpkin,
                                icon: "/crop/golden_pumpkin.png",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="bg-abyss-800 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center shadow-md"
                            >
                                <div className="w-7 h-7 mb-1 flex items-center justify-center">
                                    <PixelImage
                                        src={item.icon}
                                        alt={item.label}
                                        className="w-full h-full object-contain"
                                        width={32}
                                        height={32}
                                    />
                                </div>
                                <span className="text-xs text-slate-400 block mb-1">
                                    {item.label}
                                </span>

                                <div className="flex items-center justify-center gap-1.5 mt-0.5">
                                    <span className="text-2xl font-black text-amber-400 leading-none">
                                        {item.value ?? "-"}
                                    </span>
                                    {item.value !== null &&
                                        item.value !== undefined && (
                                            <PixelImage
                                                src="/icon/emerald.png"
                                                alt="Emerald"
                                                className="w-4 h-4 object-contain shrink-0"
                                                width={16}
                                                height={16}
                                            />
                                        )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* SECTION: 모드 명령어 및 구독권 안내 바로가기 배너 */}
                <section>
                    <button
                        type="button"
                        onClick={() => setIsGuideOpen(true)}
                        className="w-full bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-400/20 hover:border-amber-400/40 rounded-2xl p-5 shadow-xl cursor-pointer transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group text-left focus-ring"
                    >
                        <span className="block">
                            <span className="text-base font-black text-amber-400 flex items-center gap-2 group-hover:text-amber-300 transition">
                                <span>🌀</span> Abyssblock 모드 프로그램 가이드
                                & 구독 안내
                            </span>
                            <span className="block text-sm text-slate-400 mt-1">
                                인게임 연동을 위한 필수 명령어들과 자동화
                                프리미엄 구독권 요금을 확인해 보세요.
                            </span>
                        </span>
                        <span className="bg-amber-400 group-hover:bg-amber-300 text-slate-900 font-bold text-xs px-4 py-2.5 rounded-xl shadow transition whitespace-nowrap self-stretch sm:self-auto text-center">
                            사용법 및 구독 안내 보기 ➔
                        </span>
                    </button>
                </section>

                {/* SECTION B: 시세 변동 추이 그래프 */}
                <section className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <span>📈</span> 시세 변동 그래프 (
                            {getTimeLabel(limit)} 실시간 그리드)
                        </h2>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                            <div className="flex bg-abyss-800 p-1 rounded-xl border border-slate-800 shadow-inner">
                                {[6, 12, 24, 36, 72].map((timeLimit) => (
                                    <button
                                        key={timeLimit}
                                        type="button"
                                        aria-pressed={limit === timeLimit}
                                        onClick={() => setLimit(timeLimit)}
                                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                                            limit === timeLimit
                                                ? "bg-amber-400 text-slate-900 font-bold shadow"
                                                : "text-slate-400 hover:text-slate-200"
                                        }`}
                                    >
                                        {timeLimit === 6
                                            ? "2H"
                                            : timeLimit === 12
                                              ? "4H"
                                              : timeLimit === 24
                                                ? "8H"
                                                : timeLimit === 36
                                                  ? "12H"
                                                  : "24H"}
                                    </button>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() => fetchTimelineData(limit)}
                                title="시세 새로고침"
                                className="p-2.5 bg-abyss-800 hover:bg-slate-800 border border-slate-800 rounded-xl transition shadow-md group flex items-center justify-center shrink-0"
                            >
                                <PixelImage
                                    src="/icon/refresh.png"
                                    alt="새로고침"
                                    className="w-4 h-4 object-contain opacity-70 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-300 ease-out"
                                    width={16}
                                    height={16}
                                />
                            </button>
                        </div>
                    </div>

                    {errorMsg && (
                        <div className="p-4 bg-rose-900/20 border border-rose-500/40 rounded-xl text-sm text-rose-400">
                            {errorMsg}
                        </div>
                    )}

                    {loading ? (
                        <div className="bg-abyss-800 border border-slate-800 rounded-xl p-6 shadow-2xl min-h-[460px] flex items-center justify-center text-slate-500 text-sm">
                            데이터베이스에서 시세 데이터를 동기화 중입니다...
                        </div>
                    ) : (
                        <CropLineChart timeline={timeline} />
                    )}
                </section>

                {/* SECTION C: 제보왕 실시간 랭킹 보드 */}
                <section className="space-y-4">
                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <span>🏆</span> 제보 랭킹 명예의 전당 (
                        {getTimeLabel(limit)} 누적)
                    </h2>

                    <div className="bg-abyss-800 border border-slate-800 rounded-xl p-6 shadow-2xl">
                        {loading ? (
                            <div className="text-center py-6 text-slate-500 text-sm">
                                랭킹 데이터를 집계하고 있습니다...
                            </div>
                        ) : rankings.length === 0 ? (
                            <div className="text-center py-8 text-slate-500 text-sm">
                                선택한 시간({getTimeLabel(limit)}) 내에 제보된
                                단가 기록이 없습니다.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {rankings.map((rank, index) => {
                                    const medal =
                                        index === 0
                                            ? "🥇"
                                            : index === 1
                                              ? "🥈"
                                              : index === 2
                                                ? "🥉"
                                                : "👤";
                                    const borderClass =
                                        index === 0
                                            ? "border-amber-500/40 bg-amber-500/5"
                                            : "border-slate-800 bg-abyss-700/30";

                                    return (
                                        <div
                                            key={index}
                                            className={`flex items-center justify-between p-4 rounded-xl border ${borderClass} shadow-md transition-transform hover:scale-[1.02]`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">
                                                    {medal}
                                                </span>
                                                <div>
                                                    <span className="text-xs font-semibold text-slate-400 block">
                                                        RANK 0{index + 1}
                                                    </span>
                                                    <span className="font-bold text-slate-200">
                                                        {rank.username}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs text-slate-500 block">
                                                    횟수
                                                </span>
                                                <span className="text-sm font-black text-emerald-400">
                                                    {rank.count}회 등록
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>
            </PageShell>

            {/* 💡 전역 팝업 모달 관리 컴포넌트 호출 */}
            <ModGuideModal
                isOpen={isGuideOpen}
                onClose={() => setIsGuideOpen(false)}
            />
        </div>
    );
}
