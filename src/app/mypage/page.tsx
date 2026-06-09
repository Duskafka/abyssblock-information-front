'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function MyPage() {
    const [user, setUser] = useState<any>(null);
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // 👤 Supabase profiles 테이블에서 인게임 마인크래프트 정보 조회
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

    // ⏳ 로딩 중 UI
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

    return (
        <div className="min-h-screen bg-[#0f141c] text-slate-100 font-sans">

            {/* 💡 1. NAVIGATION BAR 헤더 영역이 layout.tsx로 이동했으므로 이곳에서는 완전히 삭제되었습니다. */}

            {/* ─── 2. MAIN CONTENTS ─── */}
            <main className="max-w-xl mx-auto px-6 py-10"> {/* 여백을 py-16에서 py-10으로 조절했습니다 */}
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
                                {/* 프로필 아바타 영역 */}
                                <div className="flex items-center gap-4 bg-[#0f141c] p-4 rounded-xl border border-slate-800">
                                    <div className="w-14 h-14 bg-amber-400/10 border border-amber-400/30 rounded-2xl flex items-center justify-center text-3xl">
                                        🎮
                                    </div>
                                    <div>
                                        <span className="text-xs text-amber-400/80 font-semibold uppercase tracking-wider block">Minecraft Active Account</span>
                                        <span className="text-xl font-black text-slate-100 tracking-wide">{profileData.minecraft_username}</span>
                                    </div>
                                </div>

                                {/* 세부 정보 필드 리스트 */}
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">인게임 나침반 등급 (Compass Rank)</span>
                                        <div className="w-full bg-[#0f141c] border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-amber-400 font-extrabold flex items-center justify-between">
                                            <span>💎 {profileData.compass_rank || 'NONE'} RANK</span>
                                            <span className="text-[10px] text-slate-500 font-normal">게임 내 자동 부여</span>
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">모장 고유 UUID (Mojang UUID)</span>
                                        <div className="w-full bg-[#0f141c] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-400 font-mono select-all overflow-x-auto whitespace-nowrap scrollbar-none">
                                            {profileData.mojang_uuid}
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">현황판 로그인 계정 (Email)</span>
                                        <div className="w-full bg-[#0f141c] border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-300">
                                            ✉️ {profileData.email}
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

                        {/* 하단 제어 액션 */}
                        <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                            <Link href="/" className="text-xs text-slate-400 hover:text-slate-200 transition-colors">
                                ← 메인 현황판으로 가기
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold px-4 py-2 rounded-xl transition-all"
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

        </div>
    );
}