'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Header() {
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // 현재 로그인된 유저 세션 가져오기
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        // 로그인/로그아웃 등 상태 변화 실시간 감지
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
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
        else window.location.reload(); // 세션 클리어를 위해 새로고침
    };

    const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0];

    return (
        <header className="border-b border-slate-800 bg-[#161d2a]/90 px-6 py-4 sticky top-0 z-40 backdrop-blur">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold text-amber-400 tracking-wider">🌾 GOLD CROP</Link>

                <div className="flex items-center gap-6 text-sm">
                    <nav className="flex gap-6">
                        <Link
                            href="/"
                            className={`transition ${pathname === '/' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            📈 시세 현황판
                        </Link>
                        <Link
                            href="/board"
                            className={`transition ${pathname === '/board' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            💬 빌드 공유 게시판
                        </Link>
                    </nav>

                    <div className="h-4 w-[1px] bg-slate-800" /> {/* 분리선 */}

                    {/* 로그인 / 프로필 영역 */}
                    {user ? (
                        <div className="flex items-center gap-3">
                            {/* 💡 마이페이지로 이동하는 링크 버튼 추가 (현재 페이지가 마이페이지면 주황색 하이라이트) */}
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

                            <span className="text-slate-400 text-xs font-medium">
                                👤 <span className="text-slate-200 font-semibold">{displayName}</span>님
                            </span>

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