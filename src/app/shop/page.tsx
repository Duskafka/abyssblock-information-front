'use client';

import { useEffect, useState, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { AVAILABLE_SHOP_ITEMS, getShopItemConfig, ShopItemConfig } from '@/app/constants/shop';

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ShopPage() {
    const router = useRouter();

    // 데이터 관련 상태
    const [user, setUser] = useState<any>(null);
    const [shopItems, setShopItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // 필터링 상태
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState<string>('');

    // 등록 모달 및 커스텀 셀렉트 관련 상태
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSelectOpen, setIsSelectOpen] = useState(false); // 🔽 커스텀 드롭다운 열림 상태
    const [selectedItemId, setSelectedItemId] = useState(AVAILABLE_SHOP_ITEMS[0].id);
    const [price, setPrice] = useState<number>(10);
    const [quantity, setQuantity] = useState<number>(1);
    const [itemLevel, setItemLevel] = useState<number>(0);
    const [description, setDescription] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadData();

        // 드롭다운 바깥 클릭 시 닫히는 로직
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsSelectOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 🔄 카테고리별 슬라이더 최솟값 동기화 헬퍼 함수
    const syncDefaultLevel = (itemId: string) => {
        const config = getShopItemConfig(itemId);
        if (config?.category === 'ARTIFACT') setItemLevel(4);
        else if (config?.category === 'WEAPON') setItemLevel(7);
        else setItemLevel(0);
    };

    // 🔄 1. 장터 매물 및 유저 세션 정보 로드
    async function loadData() {
        try {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);

            const { data, error } = await supabase
                .from('shop_items')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setShopItems(data || []);
        } catch (err) {
            console.error(err);
            alert('장터 매물을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }

    // ➕ 2. 아이템 판매 등록 처리
    const handleRegisterItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert('로그인이 필요한 기능입니다.');
            return;
        }

        const currentConfig = getShopItemConfig(selectedItemId);
        let validatedLevel = Number(itemLevel);

        if (currentConfig?.category === 'ARTIFACT') {
            if (validatedLevel < 4 || validatedLevel > 10) {
                alert('아티팩트 수치는 4부터 10까지만 등록 가능합니다.');
                return;
            }
        } else if (currentConfig?.category === 'WEAPON') {
            if (validatedLevel < 7 || validatedLevel > 12) {
                alert('무기 배율 수치는 7부터 12까지만 등록 가능합니다.');
                return;
            }
        } else if (currentConfig?.category === 'ARMOR') {
            if (validatedLevel < 0 || validatedLevel > 12) {
                alert('갑옷 강화 수치는 0부터 12까지만 등록 가능합니다.');
                return;
            }
        } else {
            validatedLevel = 0;
        }

        try {
            setIsSubmitting(true);

            const { data: profile } = await supabase
                .from('profiles')
                .select('minecraft_username')
                .eq('id', user.id)
                .single();

            const emailBackupName = user?.email ? user.email.split('@')[0] : '알 수 없는 대원';
            const sellerName = profile?.minecraft_username || emailBackupName;

            const { error } = await supabase.from('shop_items').insert({
                item_id: selectedItemId,
                seller_id: user.id,
                seller_name: sellerName,
                price: Number(price),
                quantity: Number(quantity),
                item_level: validatedLevel,
                description: description
            });

            if (error) throw error;

            alert('장터에 매물이 성공적으로 등록되었습니다! 💎');
            setIsModalOpen(false);

            setPrice(10);
            setQuantity(1);
            setDescription('');
            loadData();
        } catch (err: any) {
            console.error(err);
            alert(`등록 실패: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 🗑️ 3. 본인 매물 회수(삭제) 처리
    const handleDeleteItem = async (id: number) => {
        if (!window.confirm('정말로 이 매물을 회수하시겠습니까?')) return;

        try {
            const { error } = await supabase.from('shop_items').delete().eq('id', id);
            if (error) throw error;
            alert('매물이 정상적으로 회수되었습니다.');
            loadData();
        } catch (err) {
            console.error(err);
            alert('매물 회수에 실패했습니다.');
        }
    };

    // 🔍 4. 카테고리 탭 및 검색어 필터링 필터 로직
    const filteredItems = shopItems.filter((dbItem) => {
        const config = getShopItemConfig(dbItem.item_id);
        if (!config) return false;

        const matchesCategory = selectedCategory === 'ALL' || config.category === selectedCategory;
        const matchesSearch = config.koreanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dbItem.seller_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (dbItem.description && dbItem.description.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesCategory && matchesSearch;
    });

    const currentSelectedConfig = getShopItemConfig(selectedItemId);

    return (
        <div className="min-h-screen bg-[#0f141c] text-slate-100 font-sans">
            <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">

                {/* 📢 상단 헤더 영역 */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2 tracking-tight">
                            🛒 어비스 연동 장터
                        </h1>
                        <p className="text-xs text-slate-400 mt-1">대원들이 등록한 인게임 아이템 매물을 확인하고 거래하세요.</p>
                    </div>
                    {user ? (
                        <button
                            onClick={() => {
                                syncDefaultLevel(selectedItemId);
                                setIsModalOpen(true);
                            }}
                            className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-xs px-5 py-3 rounded-xl transition shadow-lg shadow-amber-400/5 tracking-wide"
                        >
                            📦 내 아이템 판매하기
                        </button>
                    ) : (
                        <span className="text-xs text-slate-500 bg-slate-900/50 border border-slate-800/80 px-4 py-2 rounded-xl">
                            로그인 후 아이템을 판매할 수 있습니다.
                        </span>
                    )}
                </div>

                {/* 🔍 검색 및 카테고리 필터 컨트롤바 */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#161d2a] border border-slate-800 p-4 rounded-2xl shadow-xl">
                    <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                        {['ALL', 'ARMOR', 'ARTIFACT', 'ITEM', 'WEAPON'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`text-xs px-3.5 py-2 rounded-xl font-bold transition tracking-wide ${
                                    selectedCategory === cat
                                        ? 'bg-amber-400 text-slate-900'
                                        : 'bg-[#0f141c] text-slate-400 border border-slate-800 hover:text-white'
                                }`}
                            >
                                {cat === 'ALL' ? '전체보기' : cat}
                            </button>
                        ))}
                    </div>
                    <input
                        type="text"
                        placeholder="아이템 이름, 설명, 판매자 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full md:w-64 bg-[#0f141c] border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 transition"
                    />
                </div>

                {/* 🛍️ 매물 그리드 영역 */}
                {loading ? (
                    <div className="text-center py-20 text-slate-500 text-sm">장터 매물 동기화 중...</div>
                ) : filteredItems.length === 0 ? (
                    <div className="text-center py-20 text-slate-500 text-sm border border-dashed border-slate-800 rounded-2xl">
                        현재 등록된 장터 매물이 없습니다.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredItems.map((dbItem) => {
                            const itemConfig = getShopItemConfig(dbItem.item_id);
                            const isSeller = user && user.id === dbItem.seller_id;

                            return (
                                <div key={dbItem.id} className="bg-[#161d2a] border border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition relative group shadow-lg">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <div className="flex gap-1 items-center">
                                                <span className="text-[9px] font-extrabold font-mono text-amber-400 bg-amber-400/5 border border-amber-400/20 px-2 py-0.5 rounded uppercase">
                                                    {itemConfig?.category}
                                                </span>
                                                {dbItem.item_level > 0 && (
                                                    <span className="text-[9px] font-extrabold font-mono text-cyan-400 bg-cyan-400/5 border border-cyan-400/20 px-2 py-0.5 rounded">
                                                        Lv.{dbItem.item_level}
                                                    </span>
                                                )}
                                            </div>
                                            {isSeller && (
                                                <button
                                                    onClick={() => handleDeleteItem(dbItem.id)}
                                                    className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded hover:bg-rose-500/20 transition"
                                                >
                                                    회수
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex flex-col items-center py-1">
                                            <img
                                                src={itemConfig?.imageSrc}
                                                alt=""
                                                className="w-14 h-14 object-contain [image-rendering:pixelated] drop-shadow-[0_4px_12px_rgba(251,191,36,0.15)]"
                                            />
                                            <h3 className="font-extrabold text-white text-base mt-3 tracking-tight text-center">
                                                {itemConfig?.koreanName}
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                판매자: <span className="text-slate-300 font-medium">{dbItem.seller_name}</span>
                                            </p>
                                        </div>

                                        {dbItem.description && (
                                            <div className="bg-[#0f141c]/60 border border-slate-800/60 p-2.5 rounded-xl text-[11px] text-slate-400 leading-relaxed whitespace-pre-wrap font-medium">
                                                {dbItem.description}
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t border-slate-800/60 pt-4 mt-4 flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase">Price</span>
                                            <span className="text-sm font-black text-amber-400 font-mono">
                                                {dbItem.price.toLocaleString()} <span className="text-xs font-normal text-slate-400">E</span>
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase">Stock</span>
                                            <span className="text-xs font-bold text-slate-200 font-mono">
                                                {dbItem.quantity}개
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* 팝업 모달: 아이템 등록 창 */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                        <div className="bg-[#161d2a] border border-slate-800 max-w-md w-full rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
                            <div>
                                <h2 className="text-lg font-extrabold text-white">💰 내 물건 판매 등록</h2>
                                <p className="text-xs text-slate-400 mt-0.5">서버 인게임 보관함에 보유 중인 매물만 올려주세요.</p>
                            </div>

                            <form onSubmit={handleRegisterItem} className="space-y-4">

                                {/* ⭕ 완전 커스텀화된 품목 선택 드롭다운 박스 */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400">판매 물품 종류</label>
                                    <div className="relative" ref={dropdownRef}>
                                        {/* 셀렉트 트리거 버튼 */}
                                        <button
                                            type="button"
                                            onClick={() => setIsSelectOpen(!isSelectOpen)}
                                            className="w-full flex justify-between items-center bg-[#0f141c] p-3 border border-slate-800 rounded-xl text-left focus:outline-none focus:border-amber-400/60 transition"
                                        >
                                            <div className="flex gap-3 items-center">
                                                <div className="w-8 h-8 bg-[#161d2a] border border-slate-800 rounded-lg flex items-center justify-center shrink-0">
                                                    <img src={currentSelectedConfig?.imageSrc} className="w-6 h-6 object-contain [image-rendering:pixelated]" alt="" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-200">
                                                    [{currentSelectedConfig?.category}] {currentSelectedConfig?.koreanName}
                                                </span>
                                            </div>
                                            <svg className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isSelectOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {/* 둥글둥글한 드롭다운 리스트 및 커스텀 스크롤바 디자인 */}
                                        {isSelectOpen && (
                                            <div className="absolute left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-[#131924] border border-slate-800 rounded-2xl shadow-2xl z-50 p-1.5
                                                scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent
                                                [&::-webkit-scrollbar]:w-2
                                                [&::-webkit-scrollbar-track]:bg-transparent
                                                [&::-webkit-scrollbar-thumb]:bg-slate-800
                                                [&::-webkit-scrollbar-thumb]:rounded-full
                                                hover:[&::-webkit-scrollbar-thumb]:bg-slate-700"
                                            >
                                                {AVAILABLE_SHOP_ITEMS.map((item) => (
                                                    <button
                                                        key={item.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedItemId(item.id);
                                                            syncDefaultLevel(item.id);
                                                            setIsSelectOpen(false);
                                                        }}
                                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition ${
                                                            selectedItemId === item.id
                                                                ? 'bg-amber-400 text-slate-900'
                                                                : 'text-slate-300 hover:bg-[#1c2637] hover:text-white'
                                                        }`}
                                                    >
                                                        {/* 아이템 글자 앞 미니 아이콘 배치 */}
                                                        <img
                                                            src={item.imageSrc}
                                                            className="w-5 h-5 object-contain [image-rendering:pixelated] shrink-0"
                                                            alt=""
                                                        />
                                                        <span>
                                                            [{item.category}] {item.koreanName}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 아티팩트 슬라이더 (MAX 10) */}
                                {currentSelectedConfig?.category === 'ARTIFACT' && (
                                    <div className="space-y-2 bg-[#0f141c]/40 border border-slate-800/80 p-3.5 rounded-xl">
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-xs font-bold text-cyan-400">아티팩트 주요 수치 제어</label>
                                            <span className="text-xs font-black text-cyan-400 font-mono bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">
                                                Lv.{itemLevel}
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="4"
                                            max="10"
                                            step="1"
                                            value={itemLevel < 4 || itemLevel > 10 ? 4 : itemLevel}
                                            onChange={(e) => setItemLevel(parseInt(e.target.value))}
                                            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
                                        />
                                        <div className="flex justify-between text-[10px] text-slate-600 font-mono font-bold px-0.5">
                                            <span>MIN 4</span>
                                            <span>MAX 10</span>
                                        </div>
                                    </div>
                                )}

                                {/* 무기 슬라이더 (MAX 12) */}
                                {currentSelectedConfig?.category === 'WEAPON' && (
                                    <div className="space-y-2 bg-[#0f141c]/40 border border-slate-800/80 p-3.5 rounded-xl">
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-xs font-bold text-rose-400">무기 배율 제어</label>
                                            <span className="text-xs font-black text-rose-400 font-mono bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                                                Lv.{itemLevel}
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="7"
                                            max="12"
                                            step="1"
                                            value={itemLevel < 7 || itemLevel > 12 ? 7 : itemLevel}
                                            onChange={(e) => setItemLevel(parseInt(e.target.value))}
                                            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400 focus:outline-none"
                                        />
                                        <div className="flex justify-between text-[10px] text-slate-600 font-mono font-bold px-0.5">
                                            <span>MIN 7</span>
                                            <span>MAX 12</span>
                                        </div>
                                    </div>
                                )}

                                {/* 갑옷 슬라이더 (MAX 12) */}
                                {currentSelectedConfig?.category === 'ARMOR' && (
                                    <div className="space-y-2 bg-[#0f141c]/40 border border-slate-800/80 p-3.5 rounded-xl">
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-xs font-bold text-amber-400">갑옷 강화 수치 제어</label>
                                            <span className="text-xs font-black text-amber-400 font-mono bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                                                Lv.{itemLevel}
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="12"
                                            step="1"
                                            value={itemLevel > 12 ? 0 : itemLevel}
                                            onChange={(e) => setItemLevel(parseInt(e.target.value))}
                                            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
                                        />
                                        <div className="flex justify-between text-[10px] text-slate-600 font-mono font-bold px-0.5">
                                            <span>MIN 0</span>
                                            <span>MAX 12</span>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400">상세 옵션 및 설명 기입 (부옵션 문자열)</label>
                                    <textarea
                                        placeholder="예시) 보호 IV / 내구도 III 세팅완료"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={2}
                                        className="w-full bg-[#0f141c] border border-slate-800 rounded-xl px-4 py-3 text-xs font-medium text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400">판매 수량 (개수)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-full bg-[#0f141c] border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-200 focus:outline-none focus:border-amber-400 font-mono"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400">단당/묶음당 판매 가격 (에메랄드 단위)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={price}
                                        onChange={(e) => setPrice(Math.max(0, parseInt(e.target.value) || 0))}
                                        className="w-full bg-[#0f141c] border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-amber-400 focus:outline-none focus:border-amber-400 font-mono"
                                        required
                                    />
                                </div>

                                <div className="flex gap-2.5 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-3.5 rounded-xl transition"
                                    >
                                        취소
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-2/3 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-xs py-3.5 rounded-xl transition disabled:opacity-50"
                                    >
                                        {isSubmitting ? '장터 조율 중...' : '매물 등록 완료'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}