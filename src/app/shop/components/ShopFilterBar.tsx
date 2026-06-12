'use client';

import { useState, useRef, useEffect } from 'react';

interface ShopFilterBarProps {
    selectedCategory: string;
    setSelectedCategory: (cat: string) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    sortBy: string;
    setSortBy: (sort: string) => void;
}

// 맵핑용 객체 (⌛ '오래된 등록순' 추가)
const SORT_OPTIONS: Record<string, string> = {
    LATEST: '최신 등록순',
    OLDEST: '오래된 등록순',
    PRICE_ASC: '낮은 가격순 ↓',
    PRICE_DESC: '높은 가격순 ↑',
    LEVEL_DESC: '주 옵션 높은순 ↑',
    LEVEL_ASC: '주 옵션 낮은순 ↓',
};

export default function ShopFilterBar({
                                          selectedCategory,
                                          setSelectedCategory,
                                          searchQuery,
                                          setSearchQuery,
                                          sortBy,
                                          setSortBy,
                                      }: ShopFilterBarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 드롭다운 바깥 영역 클릭 시 닫히도록 설정
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#161d2a] border border-slate-800 p-4 rounded-2xl shadow-xl">
            {/* 카테고리 필터 버튼 탭 */}
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

            {/* 검색창 및 정렬 드롭다운 컨테이너 */}
            <div className="flex gap-2.5 w-full md:w-auto items-center">
                <input
                    type="text"
                    placeholder="아이템 이름, 설명, 판매자 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-60 bg-[#0f141c] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 transition"
                />

                {/* ✨ 100% 커스텀 드롭다운 바 (글자가 길어졌으므로 min-w를 150px로 소폭 상향) */}
                <div className="relative shrink-0" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="bg-[#0f141c] border border-slate-800 text-slate-300 font-bold text-xs rounded-xl pl-4 pr-10 py-2.5 min-w-[150px] text-left focus:outline-none focus:border-amber-400 flex items-center justify-between transition cursor-pointer"
                    >
                        <span>{SORT_OPTIONS[sortBy]}</span>
                        <svg
                            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 absolute right-3.5 ${isOpen ? 'rotate-180 text-amber-400' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* 🌊 부드러운 웹앱 감성의 다크 모드 옵션 레이어 */}
                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-[150px] bg-[#111622] border border-slate-800 rounded-xl shadow-2xl z-50 p-1.5 animate-fade-in">
                            {Object.entries(SORT_OPTIONS).map(([value, label]) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => {
                                        setSortBy(value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                                        sortBy === value
                                            ? 'bg-amber-400 text-slate-900 font-extrabold shadow-md'
                                            : 'text-slate-400 hover:bg-[#161d2a] hover:text-white'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}