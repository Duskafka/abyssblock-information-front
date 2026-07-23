// app/page.tsx
import ItemShopGenerator from '@/components/ItemShopGenerator';

export default function Home() {
    return (
        // 배경색과 패딩은 원하시는 대로 커스텀하세요!
        <main className="min-h-screen bg-slate-950 py-12 px-4 flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl">
                {/* 상단 타이틀 구역 (선택사항) */}
                <div className="text-center mb-8 space-y-2">
                    <h1 className="text-2xl font-black text-slate-100 tracking-tight">
                        Abyssblock 매니저 툴킷
                    </h1>
                    <p className="text-xs text-slate-400">
                        인게임 데이터 관리 및 디스코드 홍보 전용 유틸리티 세트입니다.
                    </p>
                </div>

                {/* ⚔️ 디스코드 상점 빌더 컴포넌트 장착 */}
                <ItemShopGenerator />
            </div>
        </main>
    );
}