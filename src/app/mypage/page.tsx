'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';

// 🧭 중앙 관리형 나침반 유틸 함수 및 등급 매핑 임포트
import { getCompassSrc } from '@/app/constants/compass';

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function MyPage() {
    const [user, setUser] = useState<any>(null);
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // 🚨 회원 탈퇴 처리를 위한 상태 관리
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    // 👤 Supabase profiles 테이블에서 인게임 마인크래프트 정보 조회
    // ❌ [수정] select('*')을 해도 DB에 email이 없으므로 안전하게 마인크래프트 정보만 가져옵니다.
    const fetchUserProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            setProfileData(data);
        } catch (err: any) {
            console.error('프로필 로드 실패:', err.message);
        } finally {
            setLoading(false);
        }
    };

    // 🔐 유저인증 세션 체크 및 관찰자 등록
    useEffect(() => {
        async function checkUser() {
            const { data: { session } } = await supabase.auth.getSession();
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                await fetchUserProfile(currentUser.id);
            } else {
                setLoading(false);
            }
        }
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                fetchUserProfile(currentUser.id);
            } else {
                setProfileData(null);
                setLoading(false);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) alert('로그아웃 에러: ' + error.message);
        else alert('로그아웃 되었습니다.');
    };

    // 🪓 Edge Function을 호출하여 회원 탈퇴를 처리하는 함수
    const handleWithdraw = async () => {
        if (confirmText !== '회원탈퇴 승인') {
            alert("'회원탈퇴 승인'을 정확히 입력해 주세요.");
            return;
        }

        try {
            setIsWithdrawing(true);

            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                alert('인증 세션이 만료되었습니다. 다시 로그인 후 시도해 주세요.');
                return;
            }

            const response = await fetch('https://aylpfrxixjatlgjxxnin.supabase.co/functions/v1/withdraw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || '탈퇴 처리 중 서버 에러가 발생했습니다.');
            }

            await supabase.auth.signOut();

            alert(result.message || '회원 탈퇴가 안전하게 완료되었습니다. 이용해 주셔서 감사합니다.');
            setIsDeleteModalOpen(false);
            window.location.href = '/';

        } catch (err: any) {
            console.error('탈퇴 연동 에러:', err);
            alert('회원 탈퇴에 실패했습니다: ' + err.message);
        } finally {
            setIsWithdrawing(false);
        }
    };

    const getPremiumStatus = () => {
        if (!profileData || !profileData.premium_until) {
            return { isPaid: false, dDayText: '라이선스 없음', badgeColor: 'bg-slate-800 text-slate-400' };
        }

        const expireDate = new Date(profileData.premium_until);
        const now = new Date();
        const diffTime = expireDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) {
            return { isPaid: false, dDayText: '기간 만료됨', badgeColor: 'bg-red-500/10 text-red-400 border border-red-500/20' };
        }

        let badgeColor = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
        if (diffDays <= 3) {
            badgeColor = 'bg-rose-500 text-white animate-pulse';
        } else if (diffDays <= 7) {
            badgeColor = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
        }

        const formattedDate = expireDate.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        return {
            isPaid: true,
            dDayText: `+${diffDays}일 남음`,
            expireDateText: formattedDate,
            badgeColor
        };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f141c] text-slate-100 flex items-center justify-center font-sans">
                <div className="text-center space-y-3">
                    <div className="text-4xl animate-bounce">👤</div>
                    <p className="text-sm text-slate-400 font-medium">인게임 프로필 데이터를 동기화하고 있습니다...</p>
                </div>
            </div>
        );
    }

    const compassSrc = getCompassSrc(profileData?.compass_rank);
    const premium = getPremiumStatus();

    return (
        <div className="min-h-screen bg-[#0f141c] text-slate-100 font-sans">
            <main className="max-w-xl mx-auto px-6 py-10">
                {user ? (
                    <div className="bg-[#161d2a] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">

                        {/* 섹션 헤더 */}
                        <div className="border-b border-slate-800 pb-4">
                            <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                                <span>👑</span> 내 인게임 프로필 카드
                            </h2>
                            <p className="text-xs text-slate-400 mt-1">클라이언트 모드와 데이터베이스가 정상적으로 실시간 동기화 중입니다.</p>
                        </div>

                        {profileData ? (
                            <div className="space-y-5">
                                {/* 🧭 프로필 아바타 영역 */}
                                <div className="flex items-center gap-4 bg-[#0f141c] p-4 rounded-xl border border-slate-800">
                                    <div className="w-14 h-14 bg-amber-400/5 border border-amber-400/20 rounded-2xl flex items-center justify-center p-2.5 shrink-0 shadow-inner">
                                        <img src={compassSrc} alt="" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-xs text-amber-400/80 font-semibold uppercase tracking-wider block">
                                            Minecraft Account ({profileData.compass_rank || 'BRONZE'} RANK)
                                        </span>
                                        <span className="text-xl font-black text-slate-100 tracking-wide">{profileData.minecraft_username}</span>
                                    </div>
                                </div>

                                {/* 라이선스 상태 바 */}
                                <div className="bg-[#0f141c] p-4 rounded-xl border border-slate-800 flex justify-between items-center shadow-inner">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">자동거래 프리미엄 라이선스</span>
                                            {premium.isPaid && <span className="text-[10px] bg-amber-400/10 text-amber-400 border border-amber-400/20 px-1.5 py-0.5 rounded-md font-bold">VIP</span>}
                                        </div>
                                        {premium.isPaid ? (
                                            <p className="text-[11px] text-slate-500">
                                                만료 기한: <span className="font-mono text-slate-300 font-medium">{premium.expireDateText}</span>
                                            </p>
                                        ) : (
                                            <p className="text-[11px] text-slate-500">현재 등록된 라이선스 제어권이 없습니다.</p>
                                        )}
                                    </div>
                                    <div className="shrink-0">
                                        <span className={`text-xs font-black px-3 py-1.5 rounded-xl ${premium.badgeColor}`}>
                                            {premium.dDayText}
                                        </span>
                                    </div>
                                </div>

                                {/* 세부 정보 필드 리스트 */}
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">모장 고유 UUID (Mojang UUID)</span>
                                        <div className="w-full bg-[#0f141c] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-400 font-mono select-all overflow-x-auto whitespace-nowrap scrollbar-none">
                                            {profileData.mojang_uuid}
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">현황판 로그인 계정 (Email)</span>
                                        {/* 💡 [수정 완료] profileData.email 대신 안전한 인증 세션인 user.email 정보를 매핑합니다. */}
                                        <div className="w-full bg-[#0f141c] border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-300">
                                            ✉️ {user?.email || '이메일 정보 없음'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6 text-sm text-red-400 bg-red-900/10 border border-red-500/20 rounded-xl">
                                ⚠️ 프로필 디테일을 매핑할 수 없습니다.<br />
                                <span className="text-xs text-slate-500 block mt-1">인게임 클라이언트 모드에서 가입 과정을 완전히 완료하셨는지 재확인이 필요합니다.</span>
                            </div>
                        )}

                        {/* 🚨 위험 구역 (Danger Zone) */}
                        <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-xl flex justify-between items-center transition-all">
                            <div className="space-y-0.5">
                                <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider">위험 구역 (Danger Zone)</h4>
                                <p className="text-[11px] text-slate-400 leading-relaxed">
                                    계정을 탈퇴하면 동기화된 모든 인게임 정보 및 <br/>
                                    공유하신 빌드 피드가 영구적으로 완전히 삭제됩니다.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 shadow-sm"
                            >
                                회원 탈퇴
                            </button>
                        </div>

                        {/* 하단 제어 액션 */}
                        <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                            <Link href="/" className="text-xs text-slate-400 hover:text-slate-200 transition-colors">
                                ← 메인 현황판으로 가기
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-2 rounded-xl transition-all"
                            >
                                이 브라우저에서 로그아웃
                            </button>
                        </div>

                    </div>
                ) : (
                    /* 비로그인 접근 시 경고 카드 */
                    <div className="bg-[#161d2a] border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
                        <div className="text-4xl">🔒</div>
                        <h3 className="text-lg font-bold text-amber-400">비공개 프로필 영역</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            마이페이지는 로그인이 필요한 서비스입니다.<br />
                            메인 화면에서 로그인을 진행해 주세요.
                        </p>
                        <div className="pt-2">
                            <Link href="/" className="inline-block bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-400/5">
                                로그인하러 가기
                            </Link>
                        </div>
                    </div>
                )}
            </main>

            {/* ─── 회원 탈퇴 2차 검증 모달 시스템 ─── */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#161d2a] w-full max-w-md rounded-2xl border border-slate-800 p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                        <div className="text-center space-y-2">
                            <span className="text-3xl">⚠️</span>
                            <h3 className="text-sm font-bold text-red-400">정말로 계정을 파기하시겠습니까?</h3>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                                탈퇴 시 마인크래프트 계정 연동 정보가 전면 삭제되며,<br />
                                데이터베이스 정책(CASCADE)에 따라 작성했던 모든 게시글이 동시 파기됩니다.<br />
                                <span className="text-red-400 font-semibold">이 작업은 취소할 수 없습니다.</span>
                            </p>
                        </div>

                        <div className="space-y-1.5 bg-[#0f141c] p-3 rounded-xl border border-slate-800">
                            <label className="text-[10px] text-slate-500 block font-medium text-center uppercase tracking-wider">
                                승인을 위해 아래에 <span className="text-red-400 font-bold">"회원탈퇴 승인"</span>을 입력해 주세요.
                            </label>
                            <input
                                type="text"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                placeholder="회원탈퇴 승인"
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-center text-slate-200 focus:outline-none focus:border-red-500 font-bold transition"
                            />
                        </div>

                        <div className="flex gap-2 pt-1 text-xs font-bold">
                            <button
                                type="button"
                                disabled={isWithdrawing}
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setConfirmText('');
                                }}
                                className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl transition disabled:opacity-50"
                            >
                                취소하기
                            </button>
                            <button
                                type="button"
                                onClick={handleWithdraw}
                                disabled={confirmText !== '회원탈퇴 승인' || isWithdrawing}
                                className="w-1/2 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl transition disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                            >
                                {isWithdrawing ? '파기 진행 중...' : '확인 및 탈퇴'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}