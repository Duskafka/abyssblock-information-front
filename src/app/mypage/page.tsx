'use client';

import { useState } from 'react';
import Link from 'next/link';

// 🧭 중앙 관리형 나침반 유틸 함수 및 등급 매핑 임포트
import { getCompassSrc } from '@/app/constants/compass';
// ⚙️ 올바른 대소문자 경로(UseMyPageData) 매핑 및 훅 가져오기
import { useMyPageData } from './components/UseMyPageData';

export default function MyPage() {
    // 💡 훅에서 번역용 함수(translateItemId)까지 함께 인계받습니다.
    const {
        user,
        profileData,
        loading,
        myPosts,
        myItems,
        contentLoading,
        translateItemId,
        supabase
    } = useMyPageData();

    // 🚨 회원 탈퇴 처리를 위한 상태 관리
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) alert('로그아웃 에러: ' + error.message);
        else alert('로그아웃 되었습니다.');
    };

    // 🪓 회원 탈퇴 함수
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
            alert(result.message || '회원 탈퇴가 완료되었습니다.');
            setIsDeleteModalOpen(false);
            window.location.href = '/';
        } catch (err: any) {
            alert('회원 탈퇴 실패: ' + err.message);
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

        return {
            isPaid: true,
            dDayText: `+${diffDays}일 남음`,
            expireDateText: expireDate.toLocaleDateString('ko-KR', {
                year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
            }),
            badgeColor
        };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f141c] text-slate-100 flex items-center justify-center">
                <div className="text-center space-y-2">
                    <p className="text-sm text-slate-400">인게임 프로필 데이터를 동기화하고 있습니다...</p>
                </div>
            </div>
        );
    }

    const compassSrc = getCompassSrc(profileData?.compass_rank);
    const premium = getPremiumStatus();

    return (
        <div className="min-h-screen bg-[#0f141c] text-slate-100 font-sans">
            <main className="max-w-xl mx-auto px-6 py-10 space-y-6">
                {user ? (
                    <>
                        {/* 🌟 기존 나침반 프로필 카드 영역 */}
                        <div className="bg-[#161d2a] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
                            <div className="border-b border-slate-800 pb-4">
                                <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                                    <span>👑</span> 내 인게임 프로필 카드
                                </h2>
                                <p className="text-xs text-slate-400 mt-1">클라이언트 모드와 데이터베이스가 정상적으로 실시간 동기화 중입니다.</p>
                            </div>

                            {profileData ? (
                                <div className="space-y-5">
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

                                    {/* 💳 프리미엄 라이선스 영역: abyss_pass.png 인게임 스타일 레이아웃 결합 */}
                                    <div className="bg-[#0f141c] p-4 rounded-xl border border-slate-800 flex justify-between items-center shadow-inner relative overflow-hidden group">
                                        <div className="flex items-center gap-3">
                                            {/* 🎟️ 어비스 패스 아이콘 홀더 */}
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center p-1.5 border shrink-0 transition-colors ${
                                                premium.isPaid
                                                    ? 'bg-amber-400/5 border-amber-500/30'
                                                    : 'bg-slate-900 border-slate-800 opacity-40'
                                            }`}>
                                                <img
                                                    src={premium.isPaid ? "/pass/emoji_abyss_vip_pass.png" : "/pass/emoji_abyss_pass.png"}
                                                    alt="Abyss Pass"
                                                    className="w-full h-full object-contain pixelated"
                                                    onError={(e) => {
                                                        // Fallback 처리: 하위 경로 에셋 에러 발생 시 최상위 abyss_pass.png 대응
                                                        (e.target as HTMLImageElement).src = '/pass/abyss_pass.png';
                                                    }}
                                                />
                                            </div>

                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-slate-300 tracking-wide">
                                                        {premium.isPaid ? '자동거래 프리미엄 라이선스 활성화' : '자동거래 프리미엄 라이선스'}
                                                    </span>
                                                </div>
                                                {premium.isPaid ? (
                                                    <p className="text-[11px] text-slate-400">
                                                        만료일: <span className="font-mono text-amber-400/90 font-medium">{premium.expireDateText}</span>
                                                    </p>
                                                ) : (
                                                    <p className="text-[11px] text-slate-500">현재 등록된 라이선스 제어권이 없습니다.</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="shrink-0 z-10">
                                            <span className={`text-xs font-black px-3 py-1.5 rounded-xl ${premium.badgeColor}`}>
                                                {premium.dDayText}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">모장 고유 UUID (Mojang UUID)</span>
                                            <div className="w-full bg-[#0f141c] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-400 font-mono select-all overflow-x-auto whitespace-nowrap scrollbar-none">
                                                {profileData.mojang_uuid}
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">현황판 로그인 계정 (Email)</span>
                                            <div className="w-full bg-[#0f141c] border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-300">
                                                ✉️ {user?.email || '이메일 정보 없음'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6 text-sm text-red-400 bg-red-900/10 border border-red-500/20 rounded-xl">
                                    ⚠️ 프로필 디테일을 매핑할 수 없습니다.
                                </div>
                            )}

                            <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-xl flex justify-between items-center">
                                <div className="space-y-0.5">
                                    <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider">위험 구역 (Danger Zone)</h4>
                                    <p className="text-[11px] text-slate-400 leading-relaxed">
                                        계정을 탈퇴하면 모든 인게임 정보 및 공유 피드가 영구 삭제됩니다.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0"
                                >
                                    회원 탈퇴
                                </button>
                            </div>

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

                        {/* 📂 하단 내 활동 내역 요약 피드 레이아웃 */}
                        <div className="bg-[#161d2a] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
                            <div className="border-b border-slate-800 pb-3">
                                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                                    <span>📂</span> 내 활동 내역 요약
                                </h3>
                                <p className="text-[11px] text-slate-400 mt-0.5">내가 현황판과 장터에 등록한 게시글 목록입니다.</p>
                            </div>

                            {contentLoading ? (
                                <p className="text-xs text-slate-500 text-center py-6">콘텐츠 내역을 불러오는 중입니다...</p>
                            ) : (
                                <div className="space-y-5 text-xs">

                                    {/* 1. 내가 공유한 빌드 공유글 목록 */}
                                    <div className="space-y-2">
                                        <span className="font-bold text-amber-400 block text-[11px]">📝 공유한 빌드 공략 ({myPosts.length})</span>
                                        {myPosts.length === 0 ? (
                                            <p className="text-slate-500 py-3 bg-[#0f141c] text-center border border-slate-800 rounded-xl text-[11px]">공유한 빌드가 없습니다.</p>
                                        ) : (
                                            <div className="bg-[#0f141c] border border-slate-800 rounded-xl divide-y divide-slate-800/50 max-h-40 overflow-y-auto">
                                                {myPosts.map(post => (
                                                    <Link key={post.id} href={`/board/${post.id}`} className="flex justify-between items-center p-3 hover:bg-[#161d2a] transition group">
                                                        <div className="truncate pr-4 flex items-center gap-1.5">
                                                            <span className="px-1.5 py-0.5 bg-amber-400/10 text-amber-400 border border-amber-400/20 rounded text-[9px] font-bold shrink-0">{post.job}</span>
                                                            <span className="text-slate-300 group-hover:text-amber-400 font-medium transition-colors truncate">{post.title}</span>
                                                        </div>
                                                        <span className="text-[10px] text-slate-500 font-mono shrink-0">{new Date(post.created_at).toLocaleDateString()}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* 2. 내가 등록한 아이템 판매글 목록 */}
                                    <div className="space-y-2">
                                        <span className="font-bold text-emerald-400 block text-[11px]">🛒 장터 판매 물품 ({myItems.length})</span>
                                        {myItems.length === 0 ? (
                                            <p className="text-slate-500 py-3 bg-[#0f141c] text-center border border-slate-800 rounded-xl text-[11px]">등록된 판매 물품이 없습니다.</p>
                                        ) : (
                                            <div className="bg-[#0f141c] border border-slate-800 rounded-xl divide-y divide-slate-800/50 max-h-40 overflow-y-auto">
                                                {myItems.map(item => (
                                                    <Link key={item.id} href={`/shop`} className="flex justify-between items-center p-3 hover:bg-[#161d2a] transition group">
                                                        <div className="flex items-center gap-2 truncate pr-4">
                                                            <span className="text-slate-300 group-hover:text-emerald-400 font-medium transition-colors truncate">
                                                                {translateItemId(item.item_id)}
                                                            </span>
                                                            <span className="text-slate-500 text-[10px]">({item.quantity}개)</span>
                                                        </div>
                                                        <div className="flex items-center gap-3 shrink-0">
                                                            <span className="text-emerald-400 font-bold font-mono text-[11px]">{Number(item.price).toLocaleString()} E</span>
                                                            <span className="text-[10px] text-slate-500 font-mono">{new Date(item.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="bg-[#161d2a] border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
                        <div className="text-4xl">🔒</div>
                        <h3 className="text-lg font-bold text-amber-400">비공개 프로필 영역</h3>
                        <p className="text-sm text-slate-400">마이페이지는 로그인이 필요한 서비스입니다.</p>
                        <div className="pt-2">
                            <Link href="/" className="inline-block bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-xs px-5 py-2.5 rounded-xl transition-all">
                                로그인하러 가기
                            </Link>
                        </div>
                    </div>
                )}
            </main>

            {/* 회원 탈퇴 모달 */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#161d2a] w-full max-w-md rounded-2xl border border-slate-800 p-6 space-y-4 shadow-2xl">
                        <div className="text-center space-y-2">
                            <span className="text-3xl">⚠️</span>
                            <h3 className="text-sm font-bold text-red-400">정말로 계정을 파기하시겠습니까?</h3>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                                탈퇴 시 마인크래프트 계정 연동 정보가 전면 삭제됩니다.
                            </p>
                        </div>
                        <div className="space-y-1.5 bg-[#0f141c] p-3 rounded-xl border border-slate-800">
                            <input
                                type="text" value={confirmText} onChange={(e) => setConfirmText(e.target.value)}
                                placeholder="회원탈퇴 승인"
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-center text-slate-200 font-bold focus:outline-none"
                            />
                        </div>
                        <div className="flex gap-2 text-xs font-bold">
                            <button
                                type="button" disabled={isWithdrawing}
                                onClick={() => { setIsDeleteModalOpen(false); setConfirmText(''); }}
                                className="w-1/2 bg-slate-800 text-slate-300 py-2.5 rounded-xl"
                            >
                                취소하기
                            </button>
                            <button
                                type="button" onClick={handleWithdraw}
                                disabled={confirmText !== '회원탈퇴 승인' || isWithdrawing}
                                className="w-1/2 bg-red-500 text-white py-2.5 rounded-xl disabled:opacity-20"
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