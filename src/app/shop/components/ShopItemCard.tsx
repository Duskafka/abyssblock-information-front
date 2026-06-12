'use client';

import { getShopItemConfig } from '@/app/constants/shop';

interface ShopItemCardProps {
    dbItem: any;
    userId: string | undefined;
    onDelete: (id: number) => void;
}

export default function ShopItemCard({ dbItem, userId, onDelete }: ShopItemCardProps) {
    const itemConfig = getShopItemConfig(dbItem.item_id);
    const isSeller = userId && userId === dbItem.seller_id;

    if (!itemConfig) return null;

    return (
        <div className="bg-[#161d2a] border border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition relative group shadow-lg">
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex gap-1 items-center">
                        <span className="text-[9px] font-extrabold font-mono text-amber-400 bg-amber-400/5 border border-amber-400/20 px-2 py-0.5 rounded uppercase">
                            {itemConfig.category}
                        </span>
                        {dbItem.item_level > 0 && (
                            <span className="text-[9px] font-extrabold font-mono text-cyan-400 bg-cyan-400/5 border border-cyan-400/20 px-2 py-0.5 rounded">
                                Lv.{dbItem.item_level}
                            </span>
                        )}
                    </div>
                    {isSeller && (
                        <button
                            onClick={() => onDelete(dbItem.id)}
                            className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded hover:bg-rose-500/20 transition"
                        >
                            회수
                        </button>
                    )}
                </div>

                <div className="flex flex-col items-center py-1">
                    <img
                        src={itemConfig.imageSrc}
                        alt=""
                        className="w-14 h-14 object-contain [image-rendering:pixelated] drop-shadow-[0_4px_12px_rgba(251,191,36,0.15)]"
                    />
                    <h3 className="font-extrabold text-white text-base mt-3 tracking-tight text-center">
                        {itemConfig.koreanName}
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
}