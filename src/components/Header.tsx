'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// 🧭 중앙 관리형 나침반 유틸 함수 임포트
import { getCompassSrc } from '@/app/constants/compass';

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Header() {
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);

    // 💡 팝업(모달) 상태 관리
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

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
        supabase.auth.getSession().then(({ data: { session } }) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) fetchUserProfile(currentUser.id);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                fetchUserProfile(currentUser.id);
            } else {
                setProfile(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return alert('이메일과 비밀번호를 모두 입력해 주세요.');

        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        setLoading(false);
        if (error) {
            alert('로그인 실패: 이메일 또는 비밀번호를 확인해 주세요.\n(' + error.message + ')');
        } else {
            setIsModalOpen(false); // 성공 시 팝업 닫기
            setEmail('');
            setPassword('');
        }
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) alert('로그아웃 실패: ' + error.message);
        else window.location.reload();
    };

    const displayName = profile?.minecraft_username || user?.email?.split('@')[0];

    // 💡 변경된 부분: 제공해주신 getCompassSrc 함수를 사용하여 유연하게 이미지 주소 매핑
    const compassSrc = getCompassSrc(profile?.compass_rank);

    return (
        <>
            <header className="border-b border-slate-800 bg-[#161d2a]/90 px-4 md:px-6 py-4 sticky top-0 z-40 backdrop-blur">
                {/* 🛠️ max-w 키우고 flex-nowrap 및 gap 조정으로 절대 안 쪼개지게 방어 */}
                <div className="max-w-5xl mx-auto flex flex-nowrap justify-between items-center gap-4 select-none">

                    {/* 🛠️ 로고 영역: whitespace-nowrap 추가 및 최대 너비 제한으로 텍스트 보호 */}
                    <Link href="/" className="flex items-center gap-2 text-lg md:text-xl font-bold text-amber-400 tracking-wider group shrink-0 whitespace-nowrap">
                        <img
                            src="/icon.png"
                            alt="서버 아이콘"
                            className="w-6 h-6 object-contain [image-rendering:pixelated] transition-transform group-hover:scale-105"
                        />
                        <span className="flex flex-col md:flex-row md:items-center leading-none">
                            <span>Abyssblock</span>
                            <span className="md:ml-1.5 text-slate-200">Info</span>
                        </span>
                    </Link>

                    {/* 🛠️ 메뉴 및 로그인 영역 전체 컨테이너: flex-nowrap과 gap-3~4로 다이어트 */}
                    <div className="flex flex-nowrap items-center gap-3 md:gap-4 text-xs md:text-sm shrink-0">
                        <nav className="flex gap-4 md:gap-5 items-center shrink-0 whitespace-nowrap">
                            <Link href="/" className={`transition ${pathname === '/' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}>
                                📈 시세 현황판
                            </Link>
                            {/* 💡 [추가] 유저들이 직관적으로 누를 수 있도록 이용 가이드 슬롯 매립 */}
                            <Link href="/guide" className={`transition ${pathname === '/guide' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}>
                                📖 이용 가이드
                            </Link>
                            <Link href="/relics" className={`transition ${pathname === '/relics' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}>
                                📜 유물 도감
                            </Link>
                            <Link href="/board" className={`transition ${pathname === '/board' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}>
                                💬 빌드 공유 게시판
                            </Link>
                        </nav>

                        <div className="h-4 w-[1px] bg-slate-800 shrink-0" />

                        {/* 로그인 / 프로필 영역 */}
                        {user ? (
                            <div className="flex flex-nowrap items-center gap-2 md:gap-3 shrink-0">
                                <Link
                                    href="/mypage"
                                    className={`text-[11px] md:text-xs px-2 md:px-2.5 py-1 rounded-lg border transition shrink-0 whitespace-nowrap ${
                                        pathname === '/mypage'
                                            ? 'bg-amber-400/10 text-amber-400 border-amber-400/30 font-bold'
                                            : 'text-slate-300 border-slate-800 hover:border-slate-700 bg-slate-800/40 hover:bg-slate-800'
                                    }`}
                                >
                                    마이페이지
                                </Link>

                                <div className="flex flex-nowrap items-center gap-1.5 md:gap-2 bg-slate-900/60 border border-slate-800 px-2 md:px-2.5 py-1 rounded-xl shrink-0 whitespace-nowrap">
                                    <img
                                        src={compassSrc}
                                        alt={`${profile?.compass_rank || 'BRONZE'} 랭크`}
                                        className="w-3.5 h-3.5 md:w-4 h-4 object-contain"
                                        title={`등급: ${profile?.compass_rank || 'BRONZE'}`}
                                    />
                                    <span className="text-slate-400 text-[11px] md:text-xs font-medium">
                                        <span className="text-slate-200 font-semibold">{displayName}</span>님
                                    </span>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="text-[10px] md:text-[11px] text-slate-500 hover:text-slate-300 border border-slate-800 hover:border-slate-700 px-2 md:px-2.5 py-1 rounded-lg transition shrink-0 whitespace-nowrap"
                                >
                                    로그아웃
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-amber-400/10 hover:bg-amber-400 text-amber-400 hover:text-slate-900 border border-amber-400/20 px-2.5 md:px-3 py-1.5 rounded-xl font-bold text-[11px] md:text-xs transition shrink-0 whitespace-nowrap"
                            >
                                로그인
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* 💡 로그인 팝업 (모달) 레이어 정의 */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full max-w-sm p-6 bg-[#161d2a] border border-slate-800 rounded-2xl shadow-2xl z-10 text-slate-200">
                        <div className="mb-5 text-center">
                            <h3 className="text-lg font-bold text-amber-400 tracking-wide">로그인</h3>
                            <p className="text-xs text-slate-400 mt-1">인게임에서 생성한 계정 정보를 입력해 주세요.</p>
                        </div>
                        <form onSubmit={handleEmailLogin} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1">이메일</label>
                                <input
                                    type="email"
                                    placeholder="your-email@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-400 transition"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1">비밀번호</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-400 transition"
                                    required
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-1/2 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 py-2 rounded-xl font-medium text-xs transition"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-1/2 bg-amber-400 text-slate-900 hover:bg-amber-300 py-2 rounded-xl font-bold text-xs transition disabled:opacity-50"
                                >
                                    {loading ? '로그인 중..' : '로그인'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}