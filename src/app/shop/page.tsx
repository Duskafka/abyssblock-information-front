'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { getShopItemConfig } from '@/app/constants/shop';

// 📂 커스텀 분리한 하위 컴포넌트들 Import
import ShopFilterBar from './components/ShopFilterBar';
import ShopItemCard from './components/ShopItemCard';
import RegisterItemModal from './components/RegisterItemModal';

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ShopPage() {
    const [user, setUser] = useState<any>(null);
    const [shopItems, setShopItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // 필터링 및 정렬 상태 관리
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('LATEST');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

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

    // 데이터 등록 제출 파이프라인
    const handleRegisterItemSubmit = async (payload: any) => {
        const { selectedItemId, price, quantity, itemLevel, description } = payload;
        const currentConfig = getShopItemConfig(selectedItemId);
        let validatedLevel = Number(itemLevel);

        // 벨리데이션 체크
        if (currentConfig?.category === 'ARTIFACT' && (validatedLevel < 4 || validatedLevel > 10)) return alert('아티팩트 범위 이상');
        if (currentConfig?.category === 'WEAPON' && (validatedLevel < 7 || validatedLevel > 12)) return alert('무기 배율 범위 이상');
        if (currentConfig?.category === 'ARMOR' && (validatedLevel < 0 || validatedLevel > 12)) return alert('갑옷 수치 범위 이상');

        try {
            setIsSubmitting(true);
            const { data: profile } = await supabase.from('profiles').select('minecraft_username').eq('id', user.id).single();
            const sellerName = profile?.minecraft_username || (user?.email ? user.email.split('@')[0] : '알 수 없는 대원');

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
            loadData();
        } catch (err: any) {
            alert(`등록 실패: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteItem = async (id: number) => {
        if (!window.confirm('정말로 이 매물을 회수하시겠습니까?')) return;
        try {
            const { error } = await supabase.from('shop_items').delete().eq('id', id);
            if (error) throw error;
            alert('매물이 정상적으로 회수되었습니다.');
            loadData();
        } catch (err) {
            alert('매물 회수에 실패했습니다.');
        }
    };

    // 실시간 필터 및 소팅 체인 연동
    // 🔍 page.tsx 내부의 filteredItems 정의부 찾아서 이 부분으로 교체해 주세요!
    const filteredItems = shopItems
        .filter((dbItem) => {
            const config = getShopItemConfig(dbItem.item_id);
            if (!config) return false;
            const matchesCategory = selectedCategory === 'ALL' || config.category === selectedCategory;
            const matchesSearch = config.koreanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                dbItem.seller_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (dbItem.description && dbItem.description.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        })
        .sort((a, b) => {
            if (sortBy === 'PRICE_ASC') return a.price - b.price;
            if (sortBy === 'PRICE_DESC') return b.price - a.price;

            // ⚔️ 주 옵션 높은순 정렬 (레벨이 같으면 가격이 낮은 매물 우선)
            if (sortBy === 'LEVEL_DESC') {
                if (b.item_level === a.item_level) return a.price - b.price;
                return b.item_level - a.item_level;
            }

            // 🛡️ 주 옵션 낮은순 정렬 (레벨이 같으면 가격이 낮은 매물 우선)
            if (sortBy === 'LEVEL_ASC') {
                if (a.item_level === b.item_level) return a.price - b.price;
                return a.item_level - b.item_level;
            }

            // 기본값: 최신 등록순
            return b.id - a.id;
        });

    return (
        <div className="min-h-screen bg-[#0f141c] text-slate-100 font-sans">
            <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">

                {/* 📢 상단 헤더 */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2 tracking-tight">🛒 어비스 연동 장터</h1>
                        <p className="text-xs text-slate-400 mt-1">대원들이 등록한 인게임 아이템 매물을 확인하고 거래하세요.</p>
                    </div>
                    {user ? (
                        <button onClick={() => setIsModalOpen(true)} className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-xs px-5 py-3 rounded-xl transition shadow-lg tracking-wide">📦 내 아이템 판매하기</button>
                    ) : (
                        <span className="text-xs text-slate-500 bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-xl">로그인 후 이용 가능합니다.</span>
                    )}
                </div>

                {/* 🔍 검색 / 정렬 컨트롤바 컴포넌트 */}
                <ShopFilterBar
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                />

                {/* 🛍️ 아이템 리스트 그리드 */}
                {loading ? (
                    <div className="text-center py-20 text-slate-500 text-sm">장터 매물 동기화 중...</div>
                ) : filteredItems.length === 0 ? (
                    <div className="text-center py-20 text-slate-500 text-sm border border-dashed border-slate-800 rounded-2xl">등록된 매물이 없습니다.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredItems.map((dbItem) => (
                            <ShopItemCard
                                key={dbItem.id}
                                dbItem={dbItem}
                                userId={user?.id}
                                onDelete={handleDeleteItem}
                            />
                        ))}
                    </div>
                )}

                {/* 팝업 모달 컴포넌트 */}
                {isModalOpen && (
                    <RegisterItemModal
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={handleRegisterItemSubmit}
                        isSubmitting={isSubmitting}
                    />
                )}
            </main>
        </div>
    );
}