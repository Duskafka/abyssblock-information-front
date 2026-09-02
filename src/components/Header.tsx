'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SHELL_WIDTH } from '@/components/ui/PageShell';
import Modal from '@/components/ui/Modal';
import useScrollLock from '@/components/ui/useScrollLock';

// 🧭 중앙 관리형 나침반 유틸 함수 임포트
import { getCompassSrc } from '@/app/constants/compass';
import PixelImage from '@/components/ui/PixelImage';
import { useToast } from '@/components/ui/Toast';
import { getBrowserSupabase } from '@/lib/supabase';
import type { ProfileRow } from '@/lib/db-types';
import type { User } from '@supabase/supabase-js';

const supabase = getBrowserSupabase();

// 📱 모바일 패널에서 반복 사용하는 행 스타일 (활성/비활성)
const mobileRowBase = 'flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition';
const mobileSubBase = 'flex items-center justify-between gap-2 pl-7 pr-3 py-2 rounded-lg text-xs font-medium transition';
const mobileRowActive = 'bg-amber-400/10 text-amber-400 font-bold';
const mobileRowIdle = 'text-slate-300 hover:bg-slate-800/60 hover:text-white';

export default function Header() {
    const toast = useToast();
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Pick<ProfileRow, 'compass_rank' | 'minecraft_username'> | null>(null);

    // 💡 팝업(모달) 상태 관리
    const [isModalOpen, setIsModalOpen] = useState(false);
    // label htmlFor <-> input id 연결용 (이전에는 짝이 없어 라벨이 읽히지 않았다)
    const loginEmailId = useId();
    const loginPasswordId = useId();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // 💡 데스크톱 드롭다운(호버/클릭) 상태
    const [isCommunityDropdownOpen, setIsCommunityDropdownOpen] = useState(false);
    const [isGameDropdownOpen, setIsGameDropdownOpen] = useState(false); // 🕹️ 미니게임 드롭다운 상태 추가

    // 📱 좁은 화면용 햄버거 패널 상태
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // 📱 모바일 아코디언은 데스크톱 드롭다운과 상태를 따로 갖는다.
    //    예전에는 하나를 공유해서, 데스크톱에서 드롭다운을 열어둔 채 창을 줄이면
    //    모바일 아코디언이 미리 펼쳐진 상태로 나타났다.
    const [isMobileGameOpen, setIsMobileGameOpen] = useState(false);
    const [isMobileCommunityOpen, setIsMobileCommunityOpen] = useState(false);

    // 📏 패널 최대 높이를 헤더의 실제 높이에서 계산하기 위한 참조.
    //    예전에는 calc(100vh-5rem)과 calc(100vh-7rem) 두 추정치가 서로 달랐다.
    const headerRef = useRef<HTMLElement>(null);

    // 📢 커뮤니티 카테고리 활성화 판별 로직들
    const isNoticeActive = pathname.startsWith('/notice');
    const isBoardActive = pathname.startsWith('/board');
    const isShopActive = pathname.startsWith('/shop');
    const isCommunityActive = isNoticeActive || isBoardActive || isShopActive;

    // 🕹️ 미니게임 및 도구 카테고리 활성화 판별 로직
    const isArtifactGameActive = pathname.startsWith('/games/artifact');
    const isCalculatorGameActive = pathname.startsWith('/games/calculator'); // 🛡️ 데미지 계산기 판별 추가
    const isDamageGameActive = pathname.startsWith('/games/damage'); // ⚔️ 데미지 계산 시뮬레이터 판별 추가
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

    // 🔄 라우트가 바뀌면 열려 있던 패널/아코디언을 모두 닫는다.
    //    Link 이동은 Header를 언마운트하지 않으므로 직접 정리해야 한다 (뒤로가기까지 커버).
    //    pathname은 본문에서 읽지 않고 "라우트가 바뀌었다"는 트리거로만 쓴다. 지우면 마운트 시 1회만 돈다.
    // biome-ignore lint/correctness/useExhaustiveDependencies: 의도된 트리거 의존성
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsGameDropdownOpen(false);
        setIsCommunityDropdownOpen(false);
        setIsMobileGameOpen(false);
        setIsMobileCommunityOpen(false);
    }, [pathname]);

    // 📏 헤더의 실제 높이를 --header-h로 노출한다. 패널은 이 값 하나만 보고
    //    자기 최대 높이를 정하므로 헤더 높이가 바뀌어도 추정치가 어긋나지 않는다.
    useEffect(() => {
        const el = headerRef.current;
        if (!el) return;

        const update = () => el.style.setProperty('--header-h', `${el.offsetHeight}px`);
        update();

        const observer = new ResizeObserver(update);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // 🖥️ 데스크톱 폭으로 넓어지면 모바일 패널을 닫는다.
    //    패널이 lg:hidden으로 사라지기만 하면 body 스크롤 잠금이 그대로 남는다.
    useEffect(() => {
        const desktop = window.matchMedia('(min-width: 1024px)');
        const handleChange = (event: MediaQueryListEvent) => {
            if (event.matches) setIsMobileMenuOpen(false);
        };
        desktop.addEventListener('change', handleChange);
        return () => desktop.removeEventListener('change', handleChange);
    }, []);

    // 📜 패널이 열려 있는 동안 뒤 페이지 스크롤 잠금
    useScrollLock(isMobileMenuOpen);

    // ⌨️ Escape 키로 모바일 패널 닫기
    useEffect(() => {
        if (!isMobileMenuOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsMobileMenuOpen(false);
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isMobileMenuOpen]);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return toast.error('이메일과 비밀번호를 모두 입력해 주세요.');

        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        setLoading(false);
        if (error) {
            toast.error('로그인 실패: 이메일 또는 비밀번호를 확인해 주세요.\n(' + error.message + ')');
        } else {
            setIsModalOpen(false);
            setEmail('');
            setPassword('');
        }
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) toast.error('로그아웃 실패: ' + error.message);
        else window.location.reload();
    };

    // 모바일 패널에서 열릴 때는 패널을 먼저 접고 모달을 띄운다.
    const openLoginModal = () => {
        setIsMobileMenuOpen(false);
        setIsModalOpen(true);
    };

    const displayName = profile?.minecraft_username || user?.email?.split('@')[0];
    const compassSrc = getCompassSrc(profile?.compass_rank);
    const rankLabel = profile?.compass_rank || 'BRONZE';

    return (
        <>
            <header
                ref={headerRef}
                className="relative border-b border-slate-800 bg-abyss-800/90 px-4 sm:px-6 py-3 md:py-4 sticky top-0 z-40 backdrop-blur"
            >
                <div className={`${SHELL_WIDTH.wide} mx-auto select-none`}>
                    <div className="flex items-center justify-between gap-3">

                        {/* 로고 영역 */}
                        <Link href="/" className="flex items-center gap-2 text-lg md:text-xl font-bold text-amber-400 tracking-wider group shrink-0 whitespace-nowrap">
                            <PixelImage
                                src="/icon.png"
                                alt="서버 아이콘"
                                className="w-6 h-6 object-contain pixelated transition-transform group-hover:scale-105" width={24} height={24} />
                            <span className="flex flex-col md:flex-row md:items-center leading-none">
                                <span>Abyssblock</span>
                                <span className="md:ml-1.5 text-slate-200">Info</span>
                            </span>
                        </Link>

                        {/* 🖥️ 데스크톱(lg 이상) 메뉴 및 로그인 영역 — 그 아래로는 햄버거 패널이 대신한다.
                            전체 행이 약 840px를 요구하므로 md(768px)가 아니라 lg(1024px)에서 전환한다. */}
                        <div className="hidden lg:flex flex-nowrap items-center gap-3 xl:gap-4 text-sm shrink-0">
                            <nav className="flex gap-5 xl:gap-6 items-center shrink-0 whitespace-nowrap">
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
                                        type="button"
                                        aria-haspopup="true"
                                        aria-expanded={isGameDropdownOpen}
                                        onClick={() => setIsGameDropdownOpen((prev) => !prev)}
                                        className={`flex items-center gap-1 transition focus-ring ${
                                            isGameActive ? 'text-amber-400 font-bold' : 'text-slate-400 group-hover:text-slate-200'
                                        }`}
                                    >
                                        <span>🕹️ 미니게임</span>
                                        <svg className={`w-3 h-3 transition-transform duration-200 ${isGameDropdownOpen ? 'rotate-180 text-amber-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* 🎁 미니게임 서브메뉴 박스 */}
                                    <div className={`absolute left-0 mt-2 w-60 bg-abyss-800 border border-slate-800 rounded-xl shadow-2xl p-1.5 transition-all duration-200 origin-top z-50 ${
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
                                            <span className="flex items-center gap-1.5">🔮 아티펙트 강화 시뮬레이터</span>
                                            <span className="text-2xs bg-amber-400/20 text-amber-400 px-1 py-0.5 rounded font-bold">HOT</span>
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

                                        {/* ⚔️ 공격 측 피해량을 계산하는 세 번째 슬롯 */}
                                        <Link
                                            href="/games/damage"
                                            onClick={() => setIsGameDropdownOpen(false)}
                                            className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                                                isDamageGameActive ? 'bg-amber-400/10 text-amber-400 font-bold' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                                            }`}
                                        >
                                            <span className="flex items-center gap-1.5">⚔️ 데미지 계산 시뮬레이터</span>
                                            <span className="text-2xs bg-emerald-400/20 text-emerald-400 px-1 py-0.5 rounded font-bold">NEW</span>
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
                                        type="button"
                                        aria-haspopup="true"
                                        aria-expanded={isCommunityDropdownOpen}
                                        onClick={() => setIsCommunityDropdownOpen((prev) => !prev)}
                                        className={`flex items-center gap-1 transition focus-ring ${
                                            isCommunityActive ? 'text-amber-400 font-bold' : 'text-slate-400 group-hover:text-slate-200'
                                        }`}
                                    >
                                        <span>💬 커뮤니티</span>
                                        <svg className={`w-3 h-3 transition-transform duration-200 ${isCommunityDropdownOpen ? 'rotate-180 text-amber-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* 드롭다운 서브메뉴 박스 */}
                                    <div className={`absolute left-0 mt-2 w-44 bg-abyss-800 border border-slate-800 rounded-xl shadow-2xl p-1.5 transition-all duration-200 origin-top z-50 ${
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
                                <div className="flex flex-nowrap items-center gap-2 xl:gap-3 shrink-0">
                                    <Link
                                        href="/mypage"
                                        className={`text-xs px-2.5 py-1 rounded-lg border transition shrink-0 whitespace-nowrap ${
                                            pathname === '/mypage'
                                                ? 'bg-amber-400/10 text-amber-400 border-amber-400/30 font-bold'
                                                : 'text-slate-300 border-slate-800 hover:border-slate-700 bg-slate-800/40 hover:bg-slate-800'
                                        }`}
                                    >
                                        마이페이지
                                    </Link>

                                    <div className="flex flex-nowrap items-center gap-2 bg-slate-900/60 border border-slate-800 px-2.5 py-1 rounded-xl shrink-0 whitespace-nowrap">
                                        <PixelImage
                                            src={compassSrc}
                                            alt={`${rankLabel} 랭크`}
                                            className="w-4 h-4 object-contain shrink-0"
                                            title={`등급: ${rankLabel}`} width={16} height={16} />
                                        <span className="text-slate-400 text-xs font-medium">
                                            {/* 긴 마인크래프트 닉네임이 헤더를 다시 밀어내지 않도록 잘라낸다 */}
                                            <span className="text-slate-200 font-semibold inline-block max-w-[7rem] truncate align-bottom">{displayName}</span>님
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="text-2xs text-slate-500 hover:text-slate-300 border border-slate-800 hover:border-slate-700 px-2.5 py-1 rounded-lg transition shrink-0 whitespace-nowrap"
                                    >
                                        로그아웃
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={openLoginModal}
                                    className="bg-amber-400/10 hover:bg-amber-400 text-amber-400 hover:text-slate-900 border border-amber-400/20 px-3 py-1.5 rounded-xl font-bold text-xs transition shrink-0 whitespace-nowrap"
                                >
                                    로그인
                                </button>
                            )}
                        </div>

                        {/* 📱 좁은 화면(lg 미만) 상단 클러스터: 로그인 상태 + 햄버거 */}
                        <div className="flex lg:hidden items-center gap-2 shrink-0">
                            {user ? (
                                <PixelImage
                                    src={compassSrc}
                                    alt={`${rankLabel} 랭크`}
                                    className="w-5 h-5 object-contain shrink-0"
                                    title={`등급: ${rankLabel}`} width={20} height={20} />
                            ) : (
                                <button
                                    type="button"
                                    onClick={openLoginModal}
                                    className="bg-amber-400/10 hover:bg-amber-400 text-amber-400 hover:text-slate-900 border border-amber-400/20 px-2.5 py-1.5 rounded-xl font-bold text-2xs transition shrink-0 whitespace-nowrap"
                                >
                                    로그인
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                                aria-label={isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
                                aria-expanded={isMobileMenuOpen}
                                aria-controls="mobile-nav"
                                className="p-2 -mr-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition focus-ring"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 📱 패널 뒤를 덮는 배경. 클릭하면 닫힌다.
                    키보드 사용자는 Escape를 쓰므로 여기엔 포커스를 주지 않는다.
                    헤더가 backdrop-blur를 갖고 있어 fixed 자식의 기준 박스가 헤더가 되므로
                    viewport 전체를 덮으려면 absolute + 100dvh를 쓴다. */}
                {isMobileMenuOpen && (
                    <div
                        className="lg:hidden absolute inset-x-0 top-full h-[100dvh] bg-black/40"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-hidden="true"
                    />
                )}

                {/* 📱 햄버거로 펼쳐지는 모바일 네비게이션 패널.
                    sticky 바 안에 있으면 펼칠 때 바 자체가 커지므로 top-full 오버레이로 띄운다.
                    높이 애니메이션은 매직넘버 max-h 대신 grid-template-rows로 처리해
                    콘텐츠가 짧든 길든 튀지 않는다. */}
                <div
                    id="mobile-nav"
                    inert={!isMobileMenuOpen}
                    className={`lg:hidden absolute inset-x-0 top-full grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                        isMobileMenuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                >
                    <div className="overflow-hidden min-h-0">
                        <div className="bg-abyss-800 border-b border-slate-800 shadow-2xl px-4 sm:px-6 pt-3 pb-3 max-h-[calc(100dvh-var(--header-h,4rem))] overflow-y-auto custom-scrollbar">
                            <div className={`${SHELL_WIDTH.wide} mx-auto`}>
                            <Link
                                href="/"
                                className={`${mobileRowBase} ${pathname === '/' ? mobileRowActive : mobileRowIdle}`}
                            >
                                📈 시세 현황판
                            </Link>

                            <Link
                                href="/relics"
                                className={`${mobileRowBase} ${pathname === '/relics' ? mobileRowActive : mobileRowIdle}`}
                            >
                                📜 유물 도감
                            </Link>

                            {/* 🕹️ 미니게임 아코디언 */}
                            <button
                                type="button"
                                aria-expanded={isMobileGameOpen}
                                onClick={() => setIsMobileGameOpen((prev) => !prev)}
                                className={`w-full ${mobileRowBase} ${isGameActive ? mobileRowActive : mobileRowIdle}`}
                            >
                                <span>🕹️ 미니게임</span>
                                <svg className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${isMobileGameOpen ? 'rotate-180 text-amber-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* 예전에는 max-h-40 매직넘버라 항목이 늘면 잘렸다. */}
                            <div
                                inert={!isMobileGameOpen}
                                className={`grid transition-[grid-template-rows] duration-200 ease-out ${isMobileGameOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                            >
                                <div className="overflow-hidden min-h-0">
                                <Link
                                    href="/games/artifact"
                                    className={`${mobileSubBase} ${isArtifactGameActive ? mobileRowActive : mobileRowIdle}`}
                                >
                                    <span>🔮 아티펙트 강화 시뮬레이터</span>
                                    <span className="text-2xs bg-amber-400/20 text-amber-400 px-1 py-0.5 rounded font-bold shrink-0">HOT</span>
                                </Link>
                                <Link
                                    href="/games/calculator"
                                    className={`${mobileSubBase} ${isCalculatorGameActive ? mobileRowActive : mobileRowIdle}`}
                                >
                                    🛡️ 데미지 감산 시뮬레이터
                                </Link>
                                <Link
                                    href="/games/damage"
                                    className={`${mobileSubBase} ${isDamageGameActive ? mobileRowActive : mobileRowIdle}`}
                                >
                                    <span>⚔️ 데미지 계산 시뮬레이터</span>
                                    <span className="text-2xs bg-emerald-400/20 text-emerald-400 px-1 py-0.5 rounded font-bold shrink-0">NEW</span>
                                </Link>
                                </div>
                            </div>

                            {/* 💬 커뮤니티 아코디언 */}
                            <button
                                type="button"
                                aria-expanded={isMobileCommunityOpen}
                                onClick={() => setIsMobileCommunityOpen((prev) => !prev)}
                                className={`w-full ${mobileRowBase} ${isCommunityActive ? mobileRowActive : mobileRowIdle}`}
                            >
                                <span>💬 커뮤니티</span>
                                <svg className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${isMobileCommunityOpen ? 'rotate-180 text-amber-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <div
                                inert={!isMobileCommunityOpen}
                                className={`grid transition-[grid-template-rows] duration-200 ease-out ${isMobileCommunityOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                            >
                                <div className="overflow-hidden min-h-0">
                                <Link
                                    href="/notice"
                                    className={`${mobileSubBase} ${isNoticeActive ? mobileRowActive : mobileRowIdle}`}
                                >
                                    <span>📢 공지사항</span>
                                    <span className="flex h-1.5 w-1.5 relative shrink-0">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                                    </span>
                                </Link>
                                <Link
                                    href="/board"
                                    className={`${mobileSubBase} ${isBoardActive ? mobileRowActive : mobileRowIdle}`}
                                >
                                    🛡️ 빌드 공유 게시판
                                </Link>
                                <Link
                                    href="/shop"
                                    className={`${mobileSubBase} ${isShopActive ? mobileRowActive : mobileRowIdle}`}
                                >
                                    🛒 어비스 연동 장터
                                </Link>
                                </div>
                            </div>

                            {/* 👤 인증 영역 */}
                            <div className="mt-2 pt-3 border-t border-slate-800">
                                {user ? (
                                    <>
                                        <div className="flex items-center gap-2 px-3 pb-2 min-w-0">
                                            <PixelImage
                                                src={compassSrc}
                                                alt={`${rankLabel} 랭크`}
                                                className="w-4 h-4 object-contain shrink-0"
                                                title={`등급: ${rankLabel}`} width={16} height={16} />
                                            <span className="text-slate-400 text-xs font-medium truncate">
                                                <span className="text-slate-200 font-semibold">{displayName}</span>님
                                            </span>
                                        </div>

                                        <div className="flex gap-2">
                                            <Link
                                                href="/mypage"
                                                className={`flex-1 text-center text-xs px-3 py-2 rounded-lg border transition ${
                                                    pathname === '/mypage'
                                                        ? 'bg-amber-400/10 text-amber-400 border-amber-400/30 font-bold'
                                                        : 'text-slate-300 border-slate-800 hover:border-slate-700 bg-slate-800/40 hover:bg-slate-800'
                                                }`}
                                            >
                                                마이페이지
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                className="flex-1 text-center text-xs text-slate-500 hover:text-slate-300 border border-slate-800 hover:border-slate-700 px-3 py-2 rounded-lg transition"
                                            >
                                                로그아웃
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={openLoginModal}
                                        className="w-full bg-amber-400/10 hover:bg-amber-400 text-amber-400 hover:text-slate-900 border border-amber-400/20 px-3 py-2 rounded-xl font-bold text-xs transition"
                                    >
                                        로그인
                                    </button>
                                )}
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* 로그인 팝업 (모달) 레이어 */}
            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="🔑 로그인"
                size="sm"
            >
                <p className="text-sm text-slate-400 mb-5">인게임에서 생성한 계정 정보를 입력해 주세요.</p>
                <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div>
                        <label htmlFor={loginEmailId} className="block text-sm font-semibold text-slate-400 mb-1">이메일</label>
                        <input
                            id={loginEmailId}
                            type="email"
                            placeholder="your-email@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus-ring focus:border-amber-400 transition"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor={loginPasswordId} className="block text-sm font-semibold text-slate-400 mb-1">비밀번호</label>
                        <input
                            id={loginPasswordId}
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus-ring focus:border-amber-400 transition"
                            required
                        />
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="w-1/2 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 py-2 rounded-xl font-medium text-xs transition focus-ring"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-1/2 bg-amber-400 text-slate-900 hover:bg-amber-300 py-2 rounded-xl font-bold text-xs transition disabled:opacity-50 focus-ring"
                        >
                            {loading ? '로그인 중..' : '로그인'}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
