'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DashboardPage() {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [limit, setLimit] = useState<number>(6);

  // 🔐 오직 이메일 로그인 팝업만 관리하는 상태 (헤더와 별개로 작동 가능)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // 📡 데이터 가져오는 함수 (시세 타임라인)
  const fetchTimelineData = async (currentLimit: number = limit) => {
    try {
      setLoading(true);
      const res = await fetch(`https://aylpfrxixjatlgjxxnin.supabase.co/functions/v1/get-crop-timeline?limit=${currentLimit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        }
      });

      if (!res.ok) {
        throw new Error(`서버가 응답하지 않습니다. (Status: ${res.status})`);
      }

      const json = await res.json();

      if (json.success) {
        setTimeline(json.timeline);
        setErrorMsg(null);
      } else {
        setErrorMsg(json.error || '타임라인 로드 실패');
      }
    } catch (err: any) {
      setErrorMsg('API 통신 에러: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimelineData(limit);
  }, [limit]);

  // 🔐 Supabase 인증 리스너 (로그인 모달이 성공했을 때의 로직 처리용)
  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    }
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 🔑 클라이언트 인증 기반 이메일 로그인 핸들러
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      alert('성공적으로 로그인되었습니다.');
      setIsModalOpen(false);
      setEmail('');
      setPassword('');
      window.location.reload(); // 헤더 상태 동기화를 위해 가볍게 새로고침
    } catch (err: any) {
      alert('서버 에러 메시지: ' + err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const formatKstTime = (timeframeStr: string) => {
    try {
      const date = new Date(timeframeStr);
      date.setHours(date.getHours() + 3);

      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (e) {
      return timeframeStr;
    }
  };

  const currentActive = [...timeline].reverse().find((t) => t.status === 'REGISTERED');

  const chartData = timeline.map(slot => {
    const displayTime = formatKstTime(slot.timeframe);
    if (slot.status === 'REGISTERED') {
      return {
        name: displayTime,
        '황금 밀': slot.prices?.wheat,
        '황금 비트': slot.prices?.beetroot,
        '황금 감자': slot.prices?.potato,
        '황금 당근': slot.prices?.carrot,
        '황금 호박': slot.prices?.pumpkin,
        '황금 수박': slot.prices?.melon,
      };
    }
    return { name: displayTime };
  });

  const getRankings = () => {
    const counts: { [key: string]: number } = {};
    timeline.forEach(slot => {
      if (slot.status === 'REGISTERED' && slot.registered_by) {
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

        {/* 💡 1. NAVIGATION BAR 헤더 영역이 layout.tsx로 이동했으므로 이곳에서는 완전히 지워졌습니다. */}

        {/* ─── 2. MAIN CONTENTS ─── */}
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
                { label: '🌾 황금 밀', value: currentActive?.prices?.wheat },
                { label: '🍎 황금 비트', value: currentActive?.prices?.beetroot },
                { label: '🥔 황금 감자', value: currentActive?.prices?.potato },
                { label: '🥕 황금 당근', value: currentActive?.prices?.carrot },
                { label: '🎃 황금 호박', value: currentActive?.prices?.pumpkin },
                { label: '🍉 황금 수박', value: currentActive?.prices?.melon }
              ].map((item, i) => (
                  <div key={i} className="bg-[#161d2a] p-4 rounded-xl border border-slate-800 text-center shadow-md">
                    <span className="text-xs text-slate-400 block mb-1">{item.label}</span>
                    <span className="text-2xl font-black text-amber-400">{item.value ?? '-'} <span className="text-xs text-slate-500 font-normal">EM</span></span>
                  </div>
              ))}
            </div>
          </section>

          {/* SECTION B: 시세 변동 추이 그래프 */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <span>📈</span> 시세 변동 그래프 ({getTimeLabel(limit)} 조회 중)
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

            <div className="bg-[#161d2a] border border-slate-800 rounded-xl p-6 shadow-2xl">
              {loading ? (
                  <div className="text-center py-24 text-slate-500 text-sm">
                    Edge Function에서 {getTimeLabel(limit)} 시세 데이터를 동기화 중입니다...
                  </div>
              ) : (
                  <div className="w-full h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 'auto']} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f293d', borderColor: '#334155', borderRadius: '8px', color: '#f1f5f9' }}
                            itemStyle={{ fontSize: '12px' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }} />

                        <Line type="monotone" dataKey="황금 밀" stroke="#fbbf24" strokeWidth={3} activeDot={{ r: 6 }} connectNulls />
                        <Line type="monotone" dataKey="황금 비트" stroke="#ef4444" strokeWidth={2.5} connectNulls />
                        <Line type="monotone" dataKey="황금 감자" stroke="#a16207" strokeWidth={2.5} connectNulls />
                        <Line type="monotone" dataKey="황금 당근" stroke="#f97316" strokeWidth={2.5} connectNulls />
                        <Line type="monotone" dataKey="황금 호박" stroke="#ea580c" strokeWidth={2.5} connectNulls />
                        <Line type="monotone" dataKey="황금 수박" stroke="#22c55e" strokeWidth={3} connectNulls />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
              )}
            </div>
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
                    선택한 시간({getTimeLabel(limit)}) 내에 제보된 단가 기록이 없습니다. 먼저 제보를 진행해 보세요!
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

        {/* ─── 🚪 3. 로그인 전용 모달 (인게임 전용 이메일 로그인 창 유지) ─── */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
              <div className="bg-[#161d2a] border border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-5 relative">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 text-lg">✕</button>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-amber-400">현황판 로그인</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">클라이언트에서 발급 및 등록 완료한<br />이메일 계정 정보를 입력하세요.</p>
                </div>
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">이메일 주소</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" className="w-full bg-[#0f141c] border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-400" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">비밀번호</label>
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호 입력" className="w-full bg-[#0f141c] border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-400" />
                  </div>
                  <button type="submit" disabled={authLoading} className="w-full bg-amber-400 hover:bg-amber-500 disabled:bg-slate-700 text-slate-900 font-bold py-2.5 rounded-xl text-sm mt-2">{authLoading ? '로그인 처리 중...' : '로그인'}</button>
                </form>
                <p className="text-[11px] text-slate-500 text-center bg-slate-900/40 py-2 rounded-lg border border-slate-800/60">📌 아직 계정이 없다면 먼저 클라이언트 프로그램에서 나침반 정보 연동 및 가입절차를 진행하셔야 합니다.</p>
              </div>
            </div>
        )}

      </div>
  );
}