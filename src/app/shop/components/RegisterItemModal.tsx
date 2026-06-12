'use client';

import { useState, useRef, useEffect } from 'react';
import { AVAILABLE_SHOP_ITEMS, getShopItemConfig } from '@/app/constants/shop';

interface RegisterItemModalProps {
    onClose: () => void;
    onSubmit: (payload: {
        itemId: string;
        price: number;
        quantity: number;
        itemLevel: number;
        description: string;
    }) => Promise<void>;
    isSubmitting: boolean;
}

export default function RegisterItemModal({ onClose, onSubmit, isSubmitting }: RegisterItemModalProps) {
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(AVAILABLE_SHOP_ITEMS[0].id);
    const [price, setPrice] = useState<number>(10);
    const [quantity, setQuantity] = useState<number>(1);
    const [itemLevel, setItemLevel] = useState<number>(0);
    const [description, setDescription] = useState<string>('');

    const dropdownRef = useRef<HTMLDivElement>(null);

    // 외부 클릭 시 드롭다운 닫기 로직
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsSelectOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const syncDefaultLevel = (itemId: string) => {
        const config = getShopItemConfig(itemId);
        if (config?.category === 'ARTIFACT') setItemLevel(4);
        else if (config?.category === 'WEAPON') setItemLevel(7);
        else setItemLevel(0);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ selectedItemId, price, quantity, itemLevel, description } as any);
    };

    const currentSelectedConfig = getShopItemConfig(selectedItemId);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-[#161d2a] border border-slate-800/80 max-w-md w-full rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
                <div>
                    <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                        💰 내 물건 판매 등록
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">서버 인게임 보관함에 보유 중인 매물만 올려주세요.</p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">

                    {/* ✨ 부드러운 웹앱 스타일 커스텀 셀렉터 바 */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400">판매 물품 종류</label>
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setIsSelectOpen(!isSelectOpen)}
                                className="w-full flex justify-between items-center bg-[#0f141c] p-3 border border-slate-800 rounded-xl text-left focus:outline-none focus:border-amber-400/60 transition-all duration-200"
                            >
                                <div className="flex gap-3 items-center">
                                    <div className="w-8 h-8 bg-[#161d2a] border border-slate-800/80 rounded-lg flex items-center justify-center shrink-0">
                                        <img
                                            src={currentSelectedConfig?.imageSrc}
                                            className="w-6 h-6 object-contain [image-rendering:pixelated]"
                                            alt=""
                                        />
                                    </div>
                                    <span className="text-xs font-bold text-slate-200">
                                        [{currentSelectedConfig?.category}] {currentSelectedConfig?.koreanName}
                                    </span>
                                </div>
                                <svg
                                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isSelectOpen ? 'rotate-180 text-amber-400' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* 드롭다운 옵션 레이어 리브랜딩 */}
                            {isSelectOpen && (
                                <div className="absolute left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-[#111622] border border-slate-800 rounded-xl shadow-2xl z-50 p-1.5
                                    scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent
                                    [&::-webkit-scrollbar]:w-2
                                    [&::-webkit-scrollbar-track]:bg-transparent
                                    [&::-webkit-scrollbar-thumb]:bg-slate-800/80
                                    [&::-webkit-scrollbar-thumb]:rounded-full
                                    hover:[&::-webkit-scrollbar-thumb]:bg-slate-700/80"
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
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold text-left transition-all ${
                                                selectedItemId === item.id
                                                    ? 'bg-amber-400 text-slate-900 font-extrabold shadow-md'
                                                    : 'text-slate-300 hover:bg-[#1a2332] hover:text-white'
                                            }`}
                                        >
                                            <img
                                                src={item.imageSrc}
                                                className="w-5 h-5 object-contain [image-rendering:pixelated] shrink-0"
                                                alt=""
                                            />
                                            <span>[{item.category}] {item.koreanName}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 아티팩트 수치 제어 슬라이더 */}
                    {currentSelectedConfig?.category === 'ARTIFACT' && (
                        <div className="space-y-2 bg-[#0f141c]/40 border border-slate-800/60 p-3.5 rounded-xl">
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs font-bold text-cyan-400">아티팩트 주요 수치 제어</label>
                                <span className="text-xs font-black text-cyan-400 font-mono bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">Lv.{itemLevel}</span>
                            </div>
                            <input type="range" min="4" max="10" step="1" value={itemLevel < 4 || itemLevel > 10 ? 4 : itemLevel} onChange={(e) => setItemLevel(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none" />
                        </div>
                    )}

                    {/* 무기 배율 제어 슬라이더 */}
                    {currentSelectedConfig?.category === 'WEAPON' && (
                        <div className="space-y-2 bg-[#0f141c]/40 border border-slate-800/60 p-3.5 rounded-xl">
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs font-bold text-rose-400">무기 배율 제어</label>
                                <span className="text-xs font-black text-rose-400 font-mono bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">Lv.{itemLevel}</span>
                            </div>
                            <input type="range" min="7" max="12" step="1" value={itemLevel < 7 || itemLevel > 12 ? 7 : itemLevel} onChange={(e) => setItemLevel(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400 focus:outline-none" />
                        </div>
                    )}

                    {/* 갑옷 강화 제어 슬라이더 */}
                    {currentSelectedConfig?.category === 'ARMOR' && (
                        <div className="space-y-2 bg-[#0f141c]/40 border border-slate-800/60 p-3.5 rounded-xl">
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs font-bold text-amber-400">갑옷 강화 수치 제어</label>
                                <span className="text-xs font-black text-amber-400 font-mono bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">Lv.{itemLevel}</span>
                            </div>
                            <input type="range" min="0" max="12" step="1" value={itemLevel > 12 ? 0 : itemLevel} onChange={(e) => setItemLevel(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none" />
                        </div>
                    )}

                    {/* 입력 폼 영역 */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400">상세 옵션 및 설명 기입</label>
                        <textarea placeholder="예시) 보호 IV / 내구도 III 세팅완료" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full bg-[#0f141c] border border-slate-800 rounded-xl px-4 py-3 text-xs font-medium text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 resize-none leading-relaxed transition" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400">판매 수량 (개수)</label>
                        <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-full bg-[#0f141c] border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-200 focus:outline-none focus:border-amber-400 font-mono transition" required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400">단당/묶음당 판매 가격 (에메랄드 단위)</label>
                        <input type="number" min="0" value={price} onChange={(e) => setPrice(Math.max(0, parseInt(e.target.value) || 0))} className="w-full bg-[#0f141c] border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-amber-400 focus:outline-none focus:border-amber-400 font-mono transition" required />
                    </div>

                    {/* 조작 버튼 */}
                    <div className="flex gap-2.5 pt-2">
                        <button type="button" onClick={onClose} className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-3.5 rounded-xl transition">취소</button>
                        <button type="submit" disabled={isSubmitting} className="w-2/3 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-xs py-3.5 rounded-xl transition disabled:opacity-50">
                            {isSubmitting ? '장터 조율 중...' : '매물 등록 완료'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}