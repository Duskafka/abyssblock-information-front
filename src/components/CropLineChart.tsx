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

    // 📈 [알고리즘 대수술]: 실선 구간과 점선 구간의 데이터를 완벽하게 격리
    const chartData = timeline.map((slot) => {
        const result: any = {
            name: slot.display_time,
        };
        Object.keys(cropConfigs).forEach((cropName) => {
            const cropKey = cropConfigs[cropName].key;
            result[cropName] = slot[cropKey];       // 실선용 데이터
            result[`${cropName}_dash`] = null;     // 점선용 데이터 초기화
        });
        return result;
    });

    // 각 작물별 타임라인을 추적하여 "끊어진 공백 구간"에만 점선 브릿지 좌표 주입
    Object.keys(cropConfigs).forEach((cropName) => {
        const cropKey = cropConfigs[cropName].key;
        let lastValidIdx = -1;

        for (let i = 0; i < timeline.length; i++) {
            const currentVal = timeline[i][cropKey];
            if (currentVal !== null && currentVal !== undefined) {
                // 직전 실선 끝점과 현재 실선 시작점 사이에 공백(null)이 존재할 때만 작동
                if (lastValidIdx !== -1 && i - lastValidIdx > 1) {
                    const startVal = timeline[lastValidIdx][cropKey];
                    const endVal = currentVal;
                    const gapSize = i - lastValidIdx;

                    // 오직 이 공백 구간 내에서만 점선이 곡선 형태로 이어지도록 선형 보간 좌표 계산
                    for (let j = lastValidIdx; j <= i; j++) {
                        const t = (j - lastValidIdx) / gapSize;
                        chartData[j][`${cropName}_dash`] = startVal + (endVal - startVal) * t;
                    }
                }
                lastValidIdx = i;
            }
        }
    });

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

                        {/* 툴팁 중복 표기 방지 안전장치 */}
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f293d', borderColor: '#334155', borderRadius: '8px', color: '#f1f5f9' }}
                            itemStyle={{ fontSize: '12px' }}
                            itemSorter={(item) => cropConfigs[item.name || '']?.order || 99}
                            formatter={(value, name) => {
                                // 데이터 가공용 가상 키(_dash)가 툴팁 팝업에 노출되는 것을 완전 차단
                                if (String(name).endsWith('_dash')) return null;
                                return [value, name];
                            }}
                        />

                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }} />

                        {/* 1️⃣ 하부 레이어: 오직 실선이 단절된 공백 위에만 주입되는 '곡선 점선 다리' */}
                        {Object.keys(cropConfigs).map(name => (
                            visibleCrops[name] && (
                                <Line
                                    key={`${name}_dash`}
                                    type="monotone" // 👈 둘 다 예쁜 곡선 형태로 매칭 완료!
                                    dataKey={`${name}_dash`} // 👈 분리된 점선 전용 데이터 키 사용
                                    stroke={cropConfigs[name].color}
                                    strokeWidth={1.5}
                                    strokeDasharray="4 4"
                                    dot={false}
                                    activeDot={false}
                                    legendType="none"
                                    connectNulls={false} // 👈 중요: 계산된 공백 마디만 독자적으로 그려야 하므로 false로 제어
                                    tooltipType="none"
                                />
                            )
                        ))}

                        {/* 2️⃣ 상부 레이어: 데이터가 살아있는 구간만 책임지는 '두꺼운 곡선 실선' */}
                        {Object.keys(cropConfigs).map(name => (
                            visibleCrops[name] && (
                                <Line
                                    key={name}
                                    type="monotone" // 원래 원하셨던 부드러운 곡선 유지
                                    dataKey={name}
                                    stroke={cropConfigs[name].color}
                                    strokeWidth={name === '황금 밀' || name === '황금 수박' ? 3.5 : 3}
                                    activeDot={name === '황금 밀' ? { r: 6 } : true}
                                    connectNulls={false} // 데이터가 없으면 선이 완전히 단절됨
                                />
                            )
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}