'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import CropLineChart from '@/components/CropLineChart';

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DashboardPage() {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [limit, setLimit] = useState<number>(6); // 6개 = 2시간, 12개 = 4시간 ...

  // 모드 가이드 및 복사 상태 추가
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const pad = (n: number) => String(n).padStart(2, '0');

  // 명령어 클립보드 복사 기능
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const commands = [
    {
      id: 'register',
      syntax: '/회원가입 "이메일" "비밀번호"',
      title: '🔐 계정 생성',
      description: '모드 전용 웹사이트에 회원가입하기 위한 필수 명령어입니다.',
      tip: '반드시 실제 사용 가능한 이메일을 입력해 주세요. 추후 비밀번호를 분실했을 때 계정을 찾기 위해 꼭 필요합니다.'
    },
    {
      id: 'profile',
      syntax: '/프로필갱신 "이메일" "비밀번호"',
      title: '🔄 프로필 동기화',
      description: '모드 사이트에 본인의 인게임 최신 정보를 업데이트하는 명령어입니다.',
      tip: '인게임에서 나침반 등급이 높아졌거나, 마인크래프트 닉네임을 변경하셨을 때 실행해 주셔야 정상적으로 반영됩니다.'
    },
    {
      id: 'coin',
      syntax: '/coin',
      title: '🪙 에메랄드 자동 교환',
      description: '인게임 내에서 변경된 에메랄드 교환을 프로그램이 알아서 자동으로 실행해 주는 편리한 제어 명령어입니다.',
      tip: '동작 전 에메랄드 상태를 확인 후 입력해 주세요.'
    }
  ];

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

  const currentActive = [...timeline].reverse().find(slot => slot.registered_by !== null);

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

          {/* SECTION A: 현재 적용 중인 시세 요약 단가 카드 */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span>💡</span> 현재 적용 중인 시세 {currentActive && <span className="text-xs text-emerald-400 lowercase">({currentActive.registered_by})</span>}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {[
                { label: '황금 밀', value: currentActive?.wheat, icon: '/crop/golden_wheat.png' },
                { label: '황금 비트', value: currentActive?.beetroot, icon: '/crop/golden_beetroot.png' },
                { label: '황금 당근', value: currentActive?.carrot, icon: '/crop/golden_carrot.png' },
                { label: '황금 감자', value: currentActive?.potato, icon: '/crop/golden_potato.png' },
                { label: '황금 수박', value: currentActive?.melon, icon: '/crop/golden_watermelon.png' },
                { label: '황금 호박', value: currentActive?.pumpkin, icon: '/crop/golden_pumpkin.png' }
              ].map((item, i) => (
                  <div key={i} className="bg-[#161d2a] p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center shadow-md">
                    <div className="w-7 h-7 mb-1 flex items-center justify-center">
                      <img src={item.icon} alt={item.label} className="w-full h-full object-contain" />
                    </div>
                    <span className="text-xs text-slate-400 block mb-1">{item.label}</span>

                    <div className="flex items-center justify-center gap-1.5 mt-0.5">
                      <span className="text-2xl font-black text-amber-400 leading-none">
                        {item.value ?? '-'}
                      </span>
                      {item.value !== null && item.value !== undefined && (
                          <img
                              src="/icon/emerald.png"
                              alt="Emerald"
                              className="w-4 h-4 object-contain shrink-0"
                          />
                      )}
                    </div>
                  </div>
              ))}
            </div>
          </section>

          {/* SECTION: 모드 명령어 및 구독권 안내 바로가기 배너 */}
          <section>
            <div
                onClick={() => setIsGuideOpen(true)}
                className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-400/20 hover:border-amber-400/40 rounded-2xl p-5 shadow-xl cursor-pointer transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group select-none"
            >
              <div>
                <h3 className="text-base font-black text-amber-400 flex items-center gap-2 group-hover:text-amber-300 transition">
                  <span>🌀</span> Abyssblock 모드 프로그램 가이드 & 구독 안내
                </h3>
                <p className="text-xs text-slate-400 mt-1">인게임 연동을 위한 필수 명령어들과 자동화 프리미엄 구독권 요금을 확인해 보세요.</p>
              </div>
              <button className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs px-4 py-2.5 rounded-xl shadow transition whitespace-nowrap self-stretch sm:self-auto text-center">
                사용법 및 구독 안내 보기 ➔
              </button>
            </div>
          </section>

          {/* SECTION B: 시세 변동 추이 그래프 */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <span>📈</span> 시세 변동 그래프 ({getTimeLabel(limit)} 실시간 그리드)
              </h2>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <div className="flex bg-[#161d2a] p-1 rounded-xl border border-slate-800 shadow-inner">
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

                <button
                    onClick={() => fetchTimelineData(limit)}
                    title="시세 새로고침"
                    className="p-2.5 bg-[#161d2a] hover:bg-slate-800 border border-slate-800 rounded-xl transition shadow-md group flex items-center justify-center shrink-0"
                >
                  <img
                      src="/icon/refresh.png"
                      alt="새로고침"
                      className="w-4 h-4 object-contain opacity-70 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-300 ease-out"
                  />
                </button>
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

        {/* MODAL: 모드 사용 가이드 팝업 창 */}
        {isGuideOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
              <div className="bg-[#161d2a] border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col">

                {/* 모달 헤더 */}
                <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-[#1c2637]">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🌀</span>
                    <h3 className="text-base font-black text-slate-100">Abyssblock 모드 토탈 가이드</h3>
                  </div>
                  <button
                      onClick={() => setIsGuideOpen(false)}
                      className="p-1.5 text-slate-400 hover:text-slate-100 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-xs font-mono transition"
                  >
                    ESC ✕
                  </button>
                </div>

                {/* 모달 바디 */}
                <div className="p-6 space-y-6 overflow-y-auto">

                  {/* 🌟 1. 최신 모드 다운로드 섹션 (상단 배치) */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span>📦</span> 최신 모드 다운로드
                    </h4>
                    <div className="bg-[#0f141c] border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">Abyssblock 전용 파일 (gold-crop-obf.jar)</span>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">v1.4.1 / 실행용 전용 모드 파일</p>
                      </div>
                      <a
                          href="/mod/gold-crop-obf.jar"
                          download="gold-crop-obf.jar"
                          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow transition whitespace-nowrap self-stretch sm:self-auto text-center"
                      >
                        모드 파일 다운로드 💾
                      </a>
                    </div>
                    <div className="text-[10px] bg-red-500/5 text-slate-400 border border-red-500/10 p-2.5 rounded-lg leading-relaxed">
                      <span className="text-red-400 font-bold">⚠️ 알림:</span> 파일이 `.jar` 확장자이므로 크롬 등 브라우저에서 '안전하지 않은 파일' 경고가 발생할 수 있습니다. 수동으로 암호화 처리된 안전한 파일이오니 안심하고 <span className="text-emerald-400 font-bold">'유지'</span> 또는 <span className="text-emerald-400 font-bold">'계속 다운로드'</span>를 눌러 구동해 주세요.
                    </div>
                  </div>

                  {/* 2. 명령어 정보 안내 리스트 */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span>💻</span> 필수 인게임 연동 명령어 (클릭 시 자동 복사)
                    </h4>

                    <div className="grid grid-cols-1 gap-4">
                      {commands.map((cmd) => (
                          <div key={cmd.id} className="bg-[#0f141c] border border-slate-800 p-4 rounded-xl space-y-2 relative group">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-amber-400/90 tracking-wide">{cmd.title}</span>
                              <button
                                  onClick={(e) => { e.stopPropagation(); handleCopy(cmd.syntax, cmd.id); }}
                                  className="text-[9px] bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 font-mono px-2 py-0.5 rounded transition"
                              >
                                {copiedText === cmd.id ? '복사완료! ✓' : 'COPY'}
                              </button>
                            </div>

                            <div
                                onClick={() => handleCopy(cmd.syntax, cmd.id)}
                                className="w-full bg-slate-950/70 border border-slate-800 font-mono px-3 py-2 text-xs text-emerald-400 font-bold cursor-pointer hover:border-amber-400/30 transition flex justify-between items-center rounded-lg"
                            >
                              <span>{cmd.syntax}</span>
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed pl-0.5">{cmd.description}</p>

                            <div className="text-[11px] bg-amber-400/5 text-slate-400 border border-amber-400/10 p-2.5 rounded-lg leading-relaxed">
                              <span className="text-amber-400 font-bold">💡 참고:</span> {cmd.tip}
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. 구독권 가격 정보 및 대리 후원 혜택 */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span>🎫</span> 프리미엄 기능 구독권 안내
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-[#0f141c] border border-slate-800 p-4 rounded-xl flex flex-col justify-center">
                        <span className="text-[10px] text-slate-500 font-bold mb-1">인게임 기본 결제</span>
                        <div className="text-base font-black text-slate-200 font-mono">
                          1일 ➔ <span className="text-amber-400">1 에주</span> <span className="text-xs font-normal text-slate-400">(에메랄드 주화)</span>
                        </div>
                      </div>
                      <div className="bg-[#0f141c] border border-amber-400/10 p-4 rounded-xl relative overflow-hidden flex flex-col justify-center">
                        <div className="absolute top-0 right-0 bg-red-500/20 text-red-400 text-[8px] font-black px-2 py-0.5 rounded-bl">강력 추천!</div>
                        <span className="text-[10px] text-amber-400/80 font-bold mb-1">대리 후원 특가</span>
                        <div className="text-base font-black text-emerald-400 font-mono">
                          10,000원 ➔ <span className="text-emerald-400 font-black">120일 제공</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4. 구매 및 신청 연동 채널 */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span>📬</span> 구독 신청 및 문의 방법
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 bg-[#0f141c] border border-slate-800 rounded-xl space-y-1">
                        <span className="font-bold text-slate-200 block">💬 디스코드 개인 메시지(DM)</span>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          디스코드 내 서버 멤버 리스트에서 확인하신 후 저에게 직접 DM을 발송해 주시면 확인 후 즉시 처리해 드립니다.
                        </p>
                      </div>
                      <div className="p-3.5 bg-[#0f141c] border border-slate-800 rounded-xl space-y-1">
                        <span className="font-bold text-slate-200 block">🎮 인게임 귓속말 연동</span>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          마인크래프트 서버 접속 후 <span className="text-amber-400 font-mono font-bold">Mx_Nothing</span> 닉네임으로 귓말을 주시면 신속하게 도와드리겠습니다.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* 모달 푸터 */}
                <div className="p-4 bg-[#121822] border-t border-slate-800 text-center">
                  <button
                      onClick={() => setIsGuideOpen(false)}
                      className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-6 py-2 rounded-xl border border-slate-700 transition"
                  >
                    닫기
                  </button>
                </div>

              </div>
            </div>
        )}
      </div>
  );
}