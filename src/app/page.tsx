'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import CropLineChart from '@/components/CropLineChart'; // 컴포넌트 경로에 맞게 수정하세요.

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DashboardPage() {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [limit, setLimit] = useState<number>(6); // 6개 = 2시간, 12개 = 4시간 ...

  const pad = (n: number) => String(n).padStart(2, '0');

  // 📡 데이터베이스 직접 조회 후 실시간 정격 그리드 생성
  const fetchTimelineData = async (currentLimit: number = limit) => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const { data, error } = await supabase
          .from('golden_crop_prices')
          .select('id, price_time, wheat, beetroot, potato, carrot, pumpkin, melon, registered_by')
          .order('price_time', { ascending: false })
          .limit(currentLimit);

      if (error) throw error;

      const sortedRaw = data ? [...data].sort((a, b) => a.price_time.localeCompare(b.price_time)) : [];

      const filledGrid: any[] = [];
      const now = new Date();

      const currentMinutes = now.getMinutes();
      const roundedMinutes = Math.floor(currentMinutes / 20) * 20;
      const baseTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), roundedMinutes, 0, 0);

      for (let i = currentLimit - 1; i >= 0; i--) {
        const gridTime = new Date(baseTime.getTime() - i * 20 * 60 * 1000);
        const gridTimestamp = gridTime.setSeconds(0, 0);

        const matched = sortedRaw.find(d => {
          if (!d.price_time) return false;
          const dTime = new Date(d.price_time.replace(' ', 'T'));
          dTime.setSeconds(0, 0);
          return dTime.getTime() === gridTimestamp;
        });

        const displayLabel = `${pad(gridTime.getHours())}:${pad(gridTime.getMinutes())}`;
        const fallbackRawKey = `${gridTime.getFullYear()}-${pad(gridTime.getMonth() + 1)}-${pad(gridTime.getDate())} ${displayLabel}:00`;

        if (matched) {
          filledGrid.push({ ...matched, display_time: displayLabel });
        } else {
          filledGrid.push({
            price_time: fallbackRawKey,
            display_time: displayLabel,
            wheat: null, beetroot: null, potato: null, carrot: null, pumpkin: null, melon: null,
            registered_by: null
          });
        }
      }

      setTimeline(filledGrid);
    } catch (err: any) {
      setErrorMsg('데이터베이스 통신 에러: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimelineData(limit);
  }, [limit]);

  // 상단 단가 요약 카드를 위한 가장 최신 제보 데이터 역추적
  const currentActive = [...timeline].reverse().find(slot => slot.registered_by !== null);

  // 🏆 제보왕 실시간 랭킹 집계 로직 (타이포 버그 클리닝 완료)
  const getRankings = () => {
    const counts: { [key: string]: number } = {};
    timeline.forEach(slot => {
      if (slot.registered_by) {
        counts[slot.registered_by] = (counts[slot.registered_by] || 0) + 1;
      }
    });
    return Object.keys(counts)
        .map(username => ({ username, count: counts[username] }))
        .sort((a, b) => b.count - a.count);
  };

  const rankings = getRankings();

  const getTimeLabel = (currentLimit: number) => {
    if (currentLimit === 6) return '2시간';
    if (currentLimit === 12) return '4시간';
    if (currentLimit === 24) return '8시간';
    if (currentLimit === 36) return '12시간';
    if (currentLimit === 72) return '24시간';
    return `${currentLimit}개`;
  };

  return (
      <div className="min-h-screen bg-[#0f141c] text-slate-100 font-sans relative">
        <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">

          {/* 시세 새로고침 보조 버튼 바 */}
          <div className="flex justify-end">
            <button
                onClick={() => fetchTimelineData(limit)}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl border border-slate-700/60 transition-colors shadow-md flex items-center gap-1.5"
            >
              <span>🔄</span> 시세 새로고침
            </button>
          </div>

          {/* SECTION A: 현재 적용 중인 시세 요약 단가 카드 */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span>💡</span> 현재 적용 중인 시세 {currentActive && <span className="text-xs text-emerald-400 lowercase">({currentActive.registered_by})</span>}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {[
                { label: '🌾 황금 밀', value: currentActive?.wheat },
                { label: '🍎 황금 비트', value: currentActive?.beetroot },
                { label: '🥕 황금 당근', value: currentActive?.carrot },
                { label: '🥔 황금 감자', value: currentActive?.potato },
                { label: '🍉 황금 수박', value: currentActive?.melon },
                { label: '🎃 황금 호박', value: currentActive?.pumpkin }
              ].map((item, i) => (
                  <div key={i} className="bg-[#161d2a] p-4 rounded-xl border border-slate-800 text-center shadow-md">
                    <span className="text-xs text-slate-400 block mb-1">{item.label}</span>
                    <span className="text-2xl font-black text-amber-400">{item.value ?? '-'} <span className="text-xs text-slate-500 font-normal">EM</span></span>
                  </div>
              ))}
            </div>
          </section>

          {/* SECTION B: 시세 변동 추이 그래프 (분리된 컴포넌트 호출) */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <span>📈</span> 시세 변동 그래프 ({getTimeLabel(limit)} 실시간 그리드)
              </h2>

              <div className="flex bg-[#161d2a] p-1 rounded-xl border border-slate-800 self-start sm:self-auto shadow-inner">
                {[6, 12, 24, 36, 72].map((timeLimit) => (
                    <button
                        key={timeLimit}
                        onClick={() => setLimit(timeLimit)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                            limit === timeLimit
                                ? 'bg-amber-400 text-slate-900 font-bold shadow'
                                : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                      {timeLimit === 6 ? '2H' : timeLimit === 12 ? '4H' : timeLimit === 24 ? '8H' : timeLimit === 36 ? '12H' : '24H'}
                    </button>
                ))}
              </div>
            </div>

            {errorMsg && (
                <div className="p-4 bg-red-900/20 border border-red-500/40 rounded-xl text-sm text-red-400">
                  {errorMsg}
                </div>
            )}

            {loading ? (
                <div className="bg-[#161d2a] border border-slate-800 rounded-xl p-6 shadow-2xl min-h-[460px] flex items-center justify-center text-slate-500 text-sm">
                  데이터베이스에서 시세 데이터를 동기화 중입니다...
                </div>
            ) : (
                <CropLineChart timeline={timeline} />
            )}
          </section>

          {/* SECTION C: 제보왕 실시간 랭킹 보드 */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span>🏆</span> 제보 랭킹 명예의 전당 ({getTimeLabel(limit)} 누적)
            </h2>

            <div className="bg-[#161d2a] border border-slate-800 rounded-xl p-6 shadow-2xl">
              {loading ? (
                  <div className="text-center py-6 text-slate-500 text-sm">
                    랭킹 데이터를 집계하고 있습니다...
                  </div>
              ) : rankings.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    선택한 시간({getTimeLabel(limit)}) 내에 제보된 단가 기록이 없습니다.
                  </div>
              ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {rankings.map((rank, index) => {
                      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '👤';
                      const borderClass = index === 0 ? 'border-amber-500/40 bg-amber-500/5' : 'border-slate-800 bg-[#1f293d]/30';

                      return (
                          <div
                              key={index}
                              className={`flex items-center justify-between p-4 rounded-xl border ${borderClass} shadow-md transition-transform hover:scale-[1.02]`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{medal}</span>
                              <div>
                                <span className="text-xs font-semibold text-slate-400 block">RANK 0{index + 1}</span>
                                <span className="font-bold text-slate-200">{rank.username}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-slate-500 block">횟수</span>
                              <span className="text-sm font-black text-emerald-400">{rank.count}회 등록</span>
                            </div>
                          </div>
                      );
                    })}
                  </div>
              )}
            </div>
          </section>
        </main>
      </div>
  );
}