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

    // 💡 드롭다운 수동 제어용 상태 관리
    const [isCommunityDropdownOpen, setIsCommunityDropdownOpen] = useState(false);
    const [isGameDropdownOpen, setIsGameDropdownOpen] = useState(false); // 🕹️ 미니게임 드롭다운 상태 추가

    // 📢 커뮤니티 카테고리 활성화 판별 로직들
    const isNoticeActive = pathname.startsWith('/notice');
    const isBoardActive = pathname.startsWith('/board');
    const isShopActive = pathname.startsWith('/shop');
    const isCommunityActive = isNoticeActive || isBoardActive || isShopActive;

    // 🕹️ 미니게임 및 도구 카테고리 활성화 판별 로직
    const isArtifactGameActive = pathname.startsWith('/games/artifact');
    const isCalculatorGameActive = pathname.startsWith('/games/calculator'); // 🛡️ 데미지 계산기 판별 추가
    const isGameActive = pathname.startsWith('/games');

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
            setIsModalOpen(false);
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
    const compassSrc = getCompassSrc(profile?.compass_rank);

    return (
        <>
            <header className="border-b border-slate-800 bg-[#161d2a]/90 px-4 md:px-6 py-4 sticky top-0 z-40 backdrop-blur">
                <div className="max-w-6xl mx-auto flex flex-nowrap justify-between items-center gap-4 select-none">

                    {/* 로고 영역 */}
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

                    {/* 메뉴 및 로그인 영역 전체 컨테이너 */}
                    <div className="flex flex-nowrap items-center gap-3 md:gap-4 text-xs md:text-sm shrink-0">
                        <nav className="flex gap-3.5 md:gap-6 items-center shrink-0 whitespace-nowrap">
                            <Link href="/" className={`transition ${pathname === '/' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}>
                                📈 시세 현황판
                            </Link>
                            <Link href="/relics" className={`transition ${pathname === '/relics' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}>
                                📜 유물 도감
                            </Link>

                            {/* 🕹️ 미니게임 & 인게임 시뮬레이터 드롭다운 메뉴 */}
                            <div
                                className="relative group py-2"
                                onMouseEnter={() => setIsGameDropdownOpen(true)}
                                onMouseLeave={() => setIsGameDropdownOpen(false)}
                            >
                                <button
                                    className={`flex items-center gap-1 transition focus:outline-none ${
                                        isGameActive ? 'text-amber-400 font-bold' : 'text-slate-400 group-hover:text-slate-200'
                                    }`}
                                >
                                    <span>🕹️ 미니게임</span>
                                    <svg className={`w-3 h-3 transition-transform duration-200 ${isGameDropdownOpen ? 'rotate-180 text-amber-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* 🎁 미니게임 서브메뉴 박스 */}
                                <div className={`absolute left-0 mt-2 w-52 bg-[#161d2a] border border-slate-800 rounded-xl shadow-2xl p-1.5 transition-all duration-200 origin-top z-50 ${
                                    isGameDropdownOpen
                                        ? 'opacity-100 scale-100 visible translate-y-0'
                                        : 'opacity-0 scale-95 invisible -translate-y-2 pointer-events-none'
                                }`}>
                                    <Link
                                        href="/games/artifact"
                                        onClick={() => setIsGameDropdownOpen(false)}
                                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                                            isArtifactGameActive ? 'bg-amber-400/10 text-amber-400 font-bold' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                                        }`}
                                    >
                                        <span className="flex items-center gap-1.5">🔮 유물 인챈트 제단</span>
                                        <span className="text-[9px] bg-amber-400/20 text-amber-400 px-1 py-0.5 rounded font-bold">HOT</span>
                                    </Link>

                                    {/* 🛡️ 새로 제작 완료된 데미지 시뮬레이터 추가 슬롯 */}
                                    <Link
                                        href="/games/calculator"
                                        onClick={() => setIsGameDropdownOpen(false)}
                                        className={`flex items-center px-3 py-2 rounded-lg text-xs font-medium transition ${
                                            isCalculatorGameActive ? 'bg-amber-400/10 text-amber-400 font-bold' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                                        }`}
                                    >
                                        🛡️ 데미지 감산 시뮬레이터
                                    </Link>
                                </div>
                            </div>

                            {/* 커뮤니티 드롭다운 메뉴 슬롯 */}
                            <div
                                className="relative group py-2"
                                onMouseEnter={() => setIsCommunityDropdownOpen(true)}
                                onMouseLeave={() => setIsCommunityDropdownOpen(false)}
                            >
                                <button
                                    className={`flex items-center gap-1 transition focus:outline-none ${
                                        isCommunityActive ? 'text-amber-400 font-bold' : 'text-slate-400 group-hover:text-slate-200'
                                    }`}
                                >
                                    <span>💬 커뮤니티</span>
                                    <svg className={`w-3 h-3 transition-transform duration-200 ${isCommunityDropdownOpen ? 'rotate-180 text-amber-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* 드롭다운 서브메뉴 박스 */}
                                <div className={`absolute left-0 mt-2 w-44 bg-[#161d2a] border border-slate-800 rounded-xl shadow-2xl p-1.5 transition-all duration-200 origin-top z-50 ${
                                    isCommunityDropdownOpen
                                        ? 'opacity-100 scale-100 visible translate-y-0'
                                        : 'opacity-0 scale-95 invisible -translate-y-2 pointer-events-none'
                                }`}>
                                    <Link
                                        href="/notice"
                                        onClick={() => setIsCommunityDropdownOpen(false)}
                                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                                            isNoticeActive ? 'bg-amber-400/10 text-amber-400 font-bold' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                                        }`}
                                    >
                                        <span className="flex items-center gap-1.5">📢 공지사항</span>
                                        <span className="flex h-1.5 w-1.5 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                                        </span>
                                    </Link>

                                    <Link
                                        href="/board"
                                        onClick={() => setIsCommunityDropdownOpen(false)}
                                        className={`flex items-center px-3 py-2 rounded-lg text-xs font-medium transition ${
                                            isBoardActive ? 'bg-amber-400/10 text-amber-400 font-bold' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                                        }`}
                                    >
                                        🛡️ 빌드 공유 게시판
                                    </Link>

                                    <Link
                                        href="/shop"
                                        onClick={() => setIsCommunityDropdownOpen(false)}
                                        className={`flex items-center px-3 py-2 rounded-lg text-xs font-medium transition ${
                                            isShopActive ? 'bg-amber-400/10 text-amber-400 font-bold' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                                        }`}
                                    >
                                        🛒 어비스 연동 장터
                                    </Link>
                                </div>
                            </div>
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

            {/* 로그인 팝업 (모달) 레이어 */}
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