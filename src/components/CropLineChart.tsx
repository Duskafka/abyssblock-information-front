'use client';

import { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface CropLineChartProps {
    timeline: any[];
}

// ⚙️ 색상, 순서, 다국어 네임 매핑 테이블
const cropConfigs: { [key: string]: { color: string; order: number; key: string } } = {
    '황금 밀': { color: '#fbbf24', order: 1, key: 'wheat' },
    '황금 비트': { color: '#ef4444', order: 2, key: 'beetroot' },
    '황금 당근': { color: '#f97316', order: 3, key: 'carrot' },
    '황금 감자': { color: '#a16207', order: 4, key: 'potato' },
    '황금 수박': { color: '#22c55e', order: 5, key: 'melon' },
    '황금 호박': { color: '#ea580c', order: 6, key: 'pumpkin' }
};

export default function CropLineChart({ timeline }: CropLineChartProps) {
    const [visibleCrops, setVisibleCrops] = useState<{ [key: string]: boolean }>({
        '황금 밀': true,
        '황금 비트': true,
        '황금 당근': true,
        '황금 감자': true,
        '황금 수박': true,
        '황금 호박': true,
    });

    const handleToggleCrop = (cropName: string) => {
        setVisibleCrops(prev => ({ ...prev, [cropName]: !prev[cropName] }));
    };

    // 📈 순수 데이터만 깔끔하게 매핑
    const chartData = timeline.map((slot) => ({
        name: slot.display_time,
        '황금 밀': slot.wheat,
        '황금 비트': slot.beetroot,
        '황금 당근': slot.carrot,
        '황금 감자': slot.potato,
        '황금 수박': slot.melon,
        '황금 호박': slot.pumpkin,
    }));

    return (
        <div className="bg-[#161d2a] border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
            {/* 작물 필터링 체크박스 바 */}
            <div className="flex flex-wrap gap-3 p-3 bg-[#111722] rounded-xl border border-slate-800/80">
                {Object.keys(cropConfigs).map((cropName) => (
                    <label
                        key={cropName}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer select-none transition-all ${
                            visibleCrops[cropName]
                                ? 'bg-slate-800/60 text-slate-200 border-slate-700'
                                : 'bg-transparent text-slate-500 border-slate-900 line-through opacity-50'
                        }`}
                    >
                        <input
                            type="checkbox"
                            checked={visibleCrops[cropName]}
                            onChange={() => handleToggleCrop(cropName)}
                            className="accent-amber-400 w-3.5 h-3.5 cursor-pointer rounded"
                        />
                        <span
                            className="w-2 h-2 rounded-full inline-block"
                            style={{ backgroundColor: cropConfigs[cropName].color }}
                        />
                        {cropName}
                    </label>
                ))}
            </div>

            {/* Recharts 메인 컨테이너 */}
            <div className="w-full h-[350px] pt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 'auto']} />

                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f293d', borderColor: '#334155', borderRadius: '8px', color: '#f1f5f9' }}
                            itemStyle={{ fontSize: '12px' }}
                            itemSorter={(item) => cropConfigs[item.name || '']?.order || 99}
                        />

                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }} />

                        {/* 1️⃣ 하부 레이어: 데이터가 끊겨도 점선으로 무조건 이어주는 백본 선 */}
                        {Object.keys(cropConfigs).map(name => (
                            visibleCrops[name] && (
                                <Line
                                    key={`${name}_dash`}
                                    type="linear"
                                    dataKey={name}
                                    stroke={cropConfigs[name].color}
                                    strokeWidth={1.5}
                                    strokeDasharray="4 4"
                                    dot={false}
                                    activeDot={false}
                                    legendType="none" // 하단 범례 중복 차단
                                    connectNulls={true}
                                    tooltipType="none" // 👈 [핵심 수정] 마우스를 올려도 이 점선 데이터는 툴팁 팝업에 계산되지 않도록 제외시킵니다!
                                />
                            )
                        ))}

                        {/* 2️⃣ 상부 레이어: 데이터가 있는 구간만 정직하게 덮어씌우는 두꺼운 실선 */}
                        {Object.keys(cropConfigs).map(name => (
                            visibleCrops[name] && (
                                <Line
                                    key={name}
                                    type="linear"
                                    dataKey={name}
                                    stroke={cropConfigs[name].color}
                                    strokeWidth={name === '황금 밀' || name === '황금 수박' ? 3.5 : 3}
                                    activeDot={name === '황금 밀' ? { r: 6 } : true}
                                    connectNulls={false} // 이 선만 툴팁에 깔끔하게 노출됩니다.
                                />
                            )
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}