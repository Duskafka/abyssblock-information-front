'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 💡 compass_rank 값에 따라 이미지 경로를 매핑해주는 객체
const COMPASS_IMAGES: Record<string, string> = {
    'WOODEN': '/compass/wooden_compass.png',
    'BRONZE': '/compass/wooden_compass.png', // 기본 브론즈를 나무나 별도 이미지로 매핑
    'STONE': '/compass/stone_compass.png',
    'IRON': '/compass/iron_compass.png',
    'GOLDEN': '/compass/golden_compass.png',
    'EMERALD': '/compass/emerald_compass.png',
    'DIAMOND': '/compass/diamond_compass.png',
};

export default function Header() {
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null); // 💡 프로필 상태 추가

    // 💡 유저 유효성 검사 후 profiles 테이블에서 랭크 가져오는 함수
    const fetchUserProfile = async (userId: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('compass_rank, minecraft_username')
            .eq('id', userId)
            .single();

        if (!error && data) {
            setProfile(data);
        }
    };

    useEffect(() => {
        // 현재 로그인된 유저 세션 가져오기
        supabase.auth.getSession().then(({ data: { session } }) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) fetchUserProfile(currentUser.id);
        });

        // 로그인/로그아웃 등 상태 변화 실시간 감지
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                fetchUserProfile(currentUser.id);
            } else {
                setProfile(null); // 로그아웃 시 프로필 초기화
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
            },
        });
        if (error) alert('로그인 실패: ' + error.message);
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) alert('로그아웃 실패: ' + error.message);
        else window.location.reload();
    };

    // 💡 마인크래프트 유저네임이 있으면 우선 노출, 없으면 구글 닉네임 노출
    const displayName = profile?.minecraft_username || user?.user_metadata?.display_name || user?.email?.split('@')[0];

    // 💡 현재 등급에 맞는 나침반 이미지 주소 매핑 (없으면 나무 나침반을 기본값으로)
    const compassSrc = COMPASS_IMAGES[profile?.compass_rank] || '/compass/wooden_compass.png';

    return (
        <header className="border-b border-slate-800 bg-[#161d2a]/90 px-6 py-4 sticky top-0 z-40 backdrop-blur">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold text-amber-400 tracking-wider">🌾 GOLD CROP</Link>

                <div className="flex items-center gap-6 text-sm">
                    <nav className="flex gap-6 items-center">
                        <Link
                            href="/"
                            className={`transition ${pathname === '/' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            📈 시세 현황판
                        </Link>
                        <Link
                            href="/relics"
                            className={`transition ${pathname === '/relics' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            📖 유물 도감
                        </Link>
                        <Link
                            href="/board"
                            className={`transition ${pathname === '/board' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            💬 빌드 공유 게시판
                        </Link>
                    </nav>

                    <div className="h-4 w-[1px] bg-slate-800" />

                    {/* 로그인 / 프로필 영역 */}
                    {user ? (
                        <div className="flex items-center gap-3">
                            <Link
                                href="/mypage"
                                className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                                    pathname === '/mypage'
                                        ? 'bg-amber-400/10 text-amber-400 border-amber-400/30 font-bold'
                                        : 'text-slate-300 border-slate-800 hover:border-slate-700 bg-slate-800/40 hover:bg-slate-800'
                                }`}
                            >
                                마이페이지
                            </Link>

                            {/* 🧭 나침반 이미지와 닉네임 영역 */}
                            <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-2.5 py-1 rounded-xl">
                                <img
                                    src={compassSrc}
                                    alt={`${profile?.compass_rank || 'BRONZE'} 랭크`}
                                    className="w-4 h-4 object-contain"
                                    title={`등급: ${profile?.compass_rank || 'BRONZE'}`}
                                />
                                <span className="text-slate-400 text-xs font-medium">
                                    👤 <span className="text-slate-200 font-semibold">{displayName}</span>님
                                </span>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="text-[11px] text-slate-500 hover:text-slate-300 border border-slate-800 hover:border-slate-700 px-2.5 py-1 rounded-lg transition"
                            >
                                로그아웃
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleLogin}
                            className="bg-amber-400/10 hover:bg-amber-400 text-amber-400 hover:text-slate-900 border border-amber-400/20 px-3 py-1.5 rounded-xl font-bold text-xs transition"
                        >
                            로그인
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}