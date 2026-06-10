'use client';

import Link from 'next/link';

export default function GuidePage() {
    const steps = [
        {
            num: '01',
            title: '인게임 나침반 계정 연동',
            desc: '마인크래프트 서버에 접속한 후, 모드가 제공하는 명령어(/회원가입 "이메일" "비밀번호", /프로필갱신 "이메일" "비밀번호")로 가입 절차를 진행합니다. 이 과정에서 유저의 Mojang UUID와 이메일 계정이 매핑됩니다.',
            icon: '🧭',
            badge: '인게임 필수'
        },
        {
            num: '02',
            title: '웹사이트 로그인',
            desc: '서버에서 등록한 이메일과 비밀번호를 사용해 본 웹사이트 상단에서 로그인을 진행합니다. 성공 시 우측 상단에 내 닉네임이 표시됩니다.',
            icon: '🔒',
            badge: '웹사이트'
        },
        {
            num: '03',
            title: '마이페이지에서 라이선스 확인',
            desc: '로그인 후 [마이페이지]에 진입하여 내 프리미엄 구독 라이선스가 정상적으로 활성화되어 있는지, 남은 기간(+며칠 남음)은 얼마인지 확인합니다.',
            icon: '👑',
            badge: '라이선스 체크'
        },
        {
            num: '04',
            title: '자동 거래 매크로 가동',
            desc: '모든 연동이 끝났다면 인게임에서 상점NPC를 열어 매크로를 실행합니다. "라이선스 유효성을 검사하고 있습니다..." 로그와 함께 자동으로 시세 동기화 및 주화 교환이 시작됩니다.',
            icon: '⚡',
            badge: '가동 시작'
        }
    ];

    const qnas = [
        {
            q: '"자동 거래 및 주화 교환은 프리미엄 구독 전용 기능입니다"라고 떠요.',
            a: '해당 오류는 무료 이용자이거나 구독 기간이 만료되었을 때 발생합니다. 마이페이지에서 구독 기간을 다시 확인해 주시거나 디스코드를 통해 라이선스를 갱신해 주세요.'
        },
        {
            q: '"아침이 밝았습니다" 멘트 이후 매크로 요청이 안 가요.',
            a: '중간에 인증 실패 등으로 인해 내부 락(Lock)이 잠겨있을 수 있습니다. 마인크래프트를 재시작한 후 상인을 다시 우클릭하여 열어주시면 안전장치가 초기화되어 정상 작동합니다.'
        },
        {
            q: '현황판 로그인이 안 됩니다.',
            a: '웹사이트에서 직접 회원가입을 하실 수 없습니다. 반드시 인게임 클라이언트 모드 내에서 먼저 나침반 정보 연동 및 가입 절차를 밟으셔야 계정이 데이터베이스에 생성됩니다.'
        },
        {
            q: '서버에 시세가 제대로 전달되지 않아요.',
            a: '회원가입 및 프로필 갱신이 이루어지지 않으면 제대로 공유가 되지 않을 수 있습니다. 지속적으로 문제가 발생한다면 문의해주세요.'
        },
        {
            q: '모드를 설치하지 않으면 사이트를 이용할 수 없나요?',
            a: '모드를 설치하지 않아도 게시글 확인 및 시세 확인 기능은 사용할 수 있습니다. 하지만 서버에 긍정적인 영향을 미치기 위한 행동에 동참해주시면 감사하겠습니다.'
        },
        {
            q: '계정을 타인과 공유해도 되나요?',
            a: '계정 공유가 적발되었을 시 통보 없이 그 계정의 사용이 중지될 수 있습니다. 지양해주세요.'
        }
    ];

    return (
        <div className="min-h-screen bg-[#0f141c] text-slate-100 font-sans">
            <main className="max-w-3xl mx-auto px-6 py-12 space-y-12">

                {/* 상단 타이틀 */}
                <div className="text-center space-y-3 border-b border-slate-800 pb-8">
                    <span className="text-xs bg-amber-400/10 text-amber-400 border border-amber-400/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                        User Guide
                    </span>
                    <h1 className="text-3xl font-black tracking-tight text-slate-100 sm:text-4xl">
                        모드 이용 안내
                    </h1>
                    <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
                        Abyssblock Info 현황판 서비스와 인게임 클라이언트 매크로 모드를 <br />
                        실시간으로 연동하고 올바르게 사용하는 방법을 설명합니다.
                    </p>
                </div>

                {/* 💾 [추가] 모드 & 자바 다운로드 카드 섹션 */}
                {/* 💾 모드 & 자바 다운로드 카드 섹션 */}
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a
                        href="https://drive.google.com/file/d/1AJnPGrspzWn7rh0AGKeuQ4KMlNoZe9_n/view?usp=drive_link"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/30 rounded-2xl p-5 flex items-center justify-between group hover:border-amber-400 transition shadow-lg shadow-amber-500/5"
                    >
                        <div className="space-y-1">
                            <span className="text-[10px] bg-amber-400 text-slate-900 px-2 py-0.5 rounded-md font-black uppercase tracking-wider">DOWNLOAD</span>
                            <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-400 transition-colors">최신 모드 다운로드</h3>
                            <p className="text-xs text-slate-400">구글 드라이브를 통한 안전한 클라이언트 수령</p>
                        </div>
                        <span className="text-2xl group-hover:translate-x-1 transition-transform filter drop-shadow">💾</span>
                    </a>

                    {/* 👇 이 부분의 텍스트와 배지를 모드 스펙에 맞게 전면 수정했습니다! */}
                    <a
                        href="https://www.oracle.com/java/technologies/downloads/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#161d2a] border border-slate-800 rounded-2xl p-5 flex items-center justify-between group hover:border-slate-700 transition shadow-lg"
                    >
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">SPECIFICATION</span>
                                <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-1.5 py-0.5 rounded-md font-medium">v1.21.4 Fabric</span>
                            </div>
                            <h3 className="text-base font-bold text-slate-200 group-hover:text-slate-100 transition-colors">구동 환경 및 Java 설치</h3>
                            <p className="text-xs text-slate-400">마인크래프트 1.21.4 패브릭 전용 모드 및 필수 런타임</p>
                        </div>
                        <span className="text-2xl group-hover:translate-x-1 transition-transform">☕</span>
                    </a>
                </section>

                {/* 핵심 프로세스 가이드 단계 */}
                <section className="space-y-6">
                    <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                        <span>🚀</span> 연동 가이드
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                        {steps.map((step, idx) => (
                            <div
                                key={idx}
                                className="bg-[#161d2a] border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-start shadow-xl relative overflow-hidden group hover:border-slate-700 transition"
                            >
                                {/* 배경 대형 숫자 */}
                                <span className="absolute right-4 bottom-[-10px] text-7xl font-black text-slate-800/10 select-none group-hover:text-slate-800/20 transition-colors">
                                    {step.num}
                                </span>

                                {/* 아이콘 섹션 */}
                                <div className="w-12 h-12 bg-[#0f141c] border border-slate-800 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-inner">
                                    {step.icon}
                                </div>

                                {/* 본문 섹션 */}
                                <div className="space-y-1.5 relative z-10 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-xs font-bold text-amber-400 font-mono">STEP {step.num}</span>
                                        <h3 className="text-base font-bold text-slate-200">{step.title}</h3>
                                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-medium border border-slate-700/50">
                                            {step.badge}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 자주 묻는 질문 (FAQ / Troubleshooting) */}
                <section className="space-y-4">
                    <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                        <span>❓</span> 자주 묻는 질문
                    </h2>

                    <div className="bg-[#161d2a] border border-slate-800 rounded-2xl p-6 shadow-2xl divide-y divide-slate-800">
                        {qnas.map((qna, idx) => (
                            <div key={idx} className={`space-y-2 ${idx === 0 ? 'pb-5' : idx === qnas.length - 1 ? 'pt-5' : 'py-5'}`}>
                                <div className="flex items-start gap-2">
                                    <span className="text-xs font-bold bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20 shrink-0 mt-0.5">Q</span>
                                    <h4 className="text-sm font-bold text-slate-200">{qna.q}</h4>
                                </div>
                                <div className="flex items-start gap-2 pl-1">
                                    <span className="text-xs font-bold bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 shrink-0 mt-0.5">A</span>
                                    <p className="text-xs text-slate-400 leading-relaxed">{qna.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 푸터 제어 버턴 */}
                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Link href="/" className="text-xs text-slate-400 hover:text-slate-200 transition-colors">
                        ← 메인 현황판으로 돌아가기
                    </Link>
                    <Link
                        href="/mypage"
                        className="w-full sm:w-auto text-center bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-lg shadow-amber-400/5"
                    >
                        내 구독 기간 확인하러 가기 →
                    </Link>
                </div>

            </main>
        </div>
    );
}