'use client';

import Link from 'next/link';
import { getCompassSrc } from '@/app/constants/compass';

interface BuildPostCardProps {
    post: any;
    relics: any[];
}

export default function BuildPostCard({ post, relics }: BuildPostCardProps) {
    const currentRank = post.compass_rank || 'NULL';
    const compassSrc = getCompassSrc(currentRank);

    return (
        <Link
            href={`/board/${post.id}`}
            className="block bg-[#161d2a] border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition cursor-pointer select-none"
        >
            <div className="flex justify-between items-start gap-4">
                <div>
                    <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                        <span>📁</span>
                        {post.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1.5 font-medium flex-wrap">
                        <span className="bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            {post.job || '일반'}
                        </span>
                        <span className="text-slate-600 font-normal">|</span>
                        <span>작성자:</span>

                        <div className="flex items-center gap-1 bg-[#0f141c] px-2 py-0.5 rounded-md border border-slate-800/80 shrink-0" title={`작성자 등급: ${currentRank}`}>
                            <img src={compassSrc} alt={currentRank} className="w-3.5 h-3.5 object-contain" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{currentRank}</span>
                        </div>

                        <span className="text-slate-200 font-semibold">{post.author_name}</span>
                        <span className="text-slate-600 font-normal">&nbsp;|&nbsp;</span>
                        <span className="text-slate-500 text-[11px]">🕒 {new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
                <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-lg shrink-0">
                    자세히 보기 →
                </span>
            </div>

            <div className="space-y-2.5 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-amber-400 w-16">👑 핵심:</span>
                    <div className="flex flex-wrap gap-1.5">
                        {[post.m1, post.m2, post.m3].map((relic, idx) => relic ? (
                            <div key={idx} className="flex items-center gap-1.5 bg-[#0f141c] border border-slate-700 rounded-lg px-2.5 py-1 text-[11px]" title={relic.korean_name}>
                                <img src={relic.image_url} alt="" className="w-4 h-4 object-contain" />
                                <span className="text-slate-300 font-medium">{relic.korean_name}</span>
                            </div>
                        ) : null)}
                    </div>
                </div>

                {post.side_relics && post.side_relics.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/40">
                        <span className="text-[11px] font-bold text-slate-400 w-16">🔗 사이드:</span>
                        <div className="flex flex-wrap gap-1.5">
                            {post.side_relics.map((sideId: string) => {
                                const relicInfo = relics.find(r => r.id === sideId);
                                if (!relicInfo) return null;
                                return (
                                    <div key={sideId} className="flex items-center gap-1 bg-[#1a2332] border border-slate-800 rounded-md px-2 py-0.5 text-[10px]" title={relicInfo.korean_name}>
                                        <img src={relicInfo.image_url} alt="" className="w-3.5 h-3.5 object-contain" />
                                        <span className="text-slate-400">{relicInfo.korean_name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </Link>
    );
}