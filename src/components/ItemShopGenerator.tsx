'use client';

import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';

interface ShopItem {
    id: number;
    type: 'armor' | 'artifact';
    name: string;
    rarity: '일반' | '희귀' | '영웅' | '전설';
    stats: string; // 방어력, 효과 등
    enchantments: string; // 마법부여 / 옵션
    price: string;
}

export default function ItemShopGenerator() {
    const [items, setItems] = useState<ShopItem[]>([
        {
            id: 1,
            type: 'armor',
            name: '심연의 풀플레이트',
            rarity: '전설',
            stats: '방어력 +150 | 최대 체력 +300',
            enchantments: '가시 III, 보호 IV, 체력 회복 II',
            price: '50',
        },
        {
            id: 2,
            type: 'artifact',
            name: '대마법사의 증표',
            rarity: '영웅',
            stats: '재사용 대기시간 -15% | 주문력 +45',
            enchantments: '마나 재생 I, 이동속도 증가 I',
            price: '25',
        },
    ]);

    // 입력 폼 상태 관리
    const [type, setType] = useState<'armor' | 'artifact'>('armor');
    const [name, setName] = useState('');
    const [rarity, setRarity] = useState<'일반' | '희귀' | '영웅' | '전설'>('일반');
    const [stats, setStats] = useState('');
    const [enchants, setEnchants] = useState('');
    const [price, setPrice] = useState('');

    const captureRef = useRef<HTMLDivElement>(null);

    // 등급별 텍스트 & 테두리 색상 매핑
    const rarityColors = {
        일반: { text: 'text-slate-400', border: 'border-slate-700', bg: 'bg-slate-500/5' },
        희귀: { text: 'text-blue-400', border: 'border-blue-500/40', bg: 'bg-blue-500/5' },
        영웅: { text: 'text-purple-400', border: 'border-purple-500/40', bg: 'bg-purple-500/5' },
        전설: { text: 'text-amber-400', border: 'border-amber-500/50', bg: 'bg-amber-500/5' },
    };

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !price) return;

        setItems([
            ...items,
            {
                id: Date.now(),
                type,
                name,
                rarity,
                stats,
                enchantments: enchants,
                price,
            },
        ]);

        // 폼 초기화
        setName('');
        setStats('');
        setEnchants('');
        setPrice('');
    };

    const handleRemoveItem = (id: number) => {
        setItems(items.filter((item) => item.id !== id));
    };

    // 이미지 저장 실행 함수
    const handleDownloadImage = async () => {
        if (!captureRef.current) return;
        try {
            // 디스코드 배경색(#2f3136 혹은 #36393f)과 자연스럽게 어우러지도록 세팅
            const dataUrl = await toPng(captureRef.current, {
                cacheBust: true,
                quality: 1,
                style: {
                    borderRadius: '0px', // 저장할 땐 깔끔하게 스퀘어로 처리 가능
                }
            });

            const link = document.createElement('a');
            link.download = `Abyss_Shop_${new Date().toISOString().slice(2,10)}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error('이미지 생성 실패:', error);
        }
    };

    return (
        <div className="p-6 bg-[#161d2a] rounded-2xl border border-slate-800 space-y-6 max-w-3xl mx-auto text-sm">
            <div className="flex justify-between items-center">
                <h3 className="text-base font-black text-slate-100 flex items-center gap-2">
                    ⚔️ 디스코드 판매용 아이템 보드 빌더
                </h3>
                <p className="text-xs text-slate-400">아이템을 추가하고 아래의 이미지를 다운로드하세요.</p>
            </div>

            {/* 🛠️ 아이템 등록 양식 */}
            <form onSubmit={handleAddItem} className="bg-[#0f141c] p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                        <label className="text-[11px] text-slate-400 font-bold block mb-1">분류</label>
                        <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-200">
                            <option value="armor">🛡️ 갑옷 (Armor)</option>
                            <option value="artifact">🔮 아티팩트 (Artifact)</option>
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label className="text-[11px] text-slate-400 font-bold block mb-1">아이템 명칭</label>
                        <input type="text" placeholder="예: 무쇠 갑옷, 영혼의 장신구" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400" />
                    </div>
                    <div>
                        <label className="text-[11px] text-slate-400 font-bold block mb-1">아이템 등급</label>
                        <select value={rarity} onChange={(e) => setRarity(e.target.value as any)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-200">
                            <option value="일반">일반 (Common)</option>
                            <option value="희귀">희귀 (Rare)</option>
                            <option value="영웅">영웅 (Epic)</option>
                            <option value="전설">전설 (Legendary)</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                        <label className="text-[11px] text-slate-400 font-bold block mb-1">기본 능력치 스탯</label>
                        <input type="text" placeholder="예: 방어력 +50, 공격력 +10%" value={stats} onChange={(e) => setStats(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400" />
                    </div>
                    <div>
                        <label className="text-[11px] text-slate-400 font-bold block mb-1">마법부여 / 추가 옵션</label>
                        <input type="text" placeholder="예: 날카로움 V, 내구성 III" value={enchants} onChange={(e) => setEnchants(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400" />
                    </div>
                </div>

                <div className="flex gap-2 items-end justify-between pt-1">
                    <div className="w-1/3">
                        <label className="text-[11px] text-slate-400 font-bold block mb-1">판매 가격 (에메랄드)</label>
                        <input type="text" placeholder="가격 입력" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400 font-mono" />
                    </div>
                    <button type="submit" className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs px-6 py-2.5 rounded-lg transition shadow">
                        목록에 추가 ➕
                    </button>
                </div>
            </form>

            {/* 📸 실제 디스코드 규격으로 캡처될 영역 (Width 고정형 설계) */}
            <div className="overflow-x-auto bg-slate-950 p-2 rounded-xl border border-slate-900">
                <div
                    ref={captureRef}
                    className="w-[600px] bg-[#2f3136] p-6 text-slate-200 font-sans space-y-5"
                    style={{ fontFamily: 'sans-serif' }}
                >
                    {/* 상단 헤더 */}
                    <div className="border-b border-[#40444b] pb-4 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-black text-[#ffffff] tracking-wide">🏪 ABYSSBLOCK 개인 상점</h2>
                            <p className="text-xs text-[#b9bbbe] mt-0.5">선착순 판매 중! 구매는 디스코드 DM 또는 인게임 귓속말 주세요.</p>
                        </div>
                        <div className="text-right">
              <span className="text-[10px] bg-[#202225] border border-[#40444b] text-[#96989d] font-mono px-2 py-1 rounded">
                공식 시세 반영 완료
              </span>
                        </div>
                    </div>

                    {/* 아이템 그리드 리스트 */}
                    <div className="space-y-3">
                        {items.length === 0 ? (
                            <div className="text-center py-10 text-[#72767d] bg-[#202225] rounded-xl border border-dashed border-[#40444b]">
                                등록된 판매 아이템이 없습니다. 상단에서 추가해 주세요!
                            </div>
                        ) : (
                            items.map((item) => {
                                const design = rarityColors[item.rarity];
                                return (
                                    <div
                                        key={item.id}
                                        className={`relative p-3.5 rounded-xl border ${design.border} ${design.bg} flex justify-between items-center group`}
                                    >
                                        <div className="space-y-1 pr-4 w-3/4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs">{item.type === 'armor' ? '🛡️' : '🔮'}</span>
                                                <span className={`font-black text-base ${design.text}`}>{item.name}</span>
                                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#202225] text-[#b9bbbe]">
                          {item.rarity}
                        </span>
                                            </div>

                                            {item.stats && (
                                                <p className="text-xs text-[#dcddde] font-medium pl-0.5">
                                                    <span className="text-[#96989d] mr-1">스탯:</span> {item.stats}
                                                </p>
                                            )}
                                            {item.enchantments && (
                                                <p className="text-xs text-[#b9bbbe] pl-0.5">
                                                    <span className="text-[#72767d] mr-1">옵션:</span> <span className="text-emerald-400/90 font-medium">{item.enchantments}</span>
                                                </p>
                                            )}
                                        </div>

                                        {/* 가격 레이아웃 & 수정 모드용 웹 삭제 버튼(캡처할 땐 안 보임) */}
                                        <div className="text-right flex flex-col items-end justify-center shrink-0 w-1/4">
                                            <span className="text-[10px] text-[#96989d] block font-bold">판매가</span>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <span className="text-lg font-black text-amber-400 font-mono">{item.price}</span>
                                                <span className="text-xs text-slate-300 font-bold">에메랄드</span>
                                            </div>

                                            {/* 웹 화면에서만 지울 수 있게 제공 (캡처 시 안 나오게 하고 싶으면 아래 버튼에 data-html2canvas-ignore 등을 쓰나, html-to-image는 DOM을 다 구우므로 웹 제어 영역과 캡처 영역을 완벽히 분리해 두는 게 좋습니다.) */}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* 하단 푸터 안내 */}
                    <div className="bg-[#202225] p-3 rounded-lg text-center border border-[#40444b]">
                        <p className="text-[11px] text-[#b9bbbe]">
                            💡 <span className="text-amber-400 font-bold">아이템 구매 희망자</span>는 본 게시글에 이모지를 달거나 판매자에게 연락바랍니다.
                        </p>
                    </div>
                </div>
            </div>

            {/* 이미지 추출 및 리스트 관리 제어부 */}
            <div className="flex gap-2">
                <button
                    onClick={() => setItems([])}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 px-4 py-3 rounded-xl font-bold text-xs transition"
                >
                    전체 초기화
                </button>
                <button
                    onClick={handleDownloadImage}
                    disabled={items.length === 0}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-black text-xs py-3 rounded-xl shadow transition flex items-center justify-center gap-1.5"
                >
                    <span>💾</span> 디스코드 업로드용 상점 이미지 다운로드 (.PNG)
                </button>
            </div>
        </div>
    );
}