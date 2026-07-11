'use client';

import { useState } from 'react';

interface ModGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ModGuideModal({ isOpen, onClose }: ModGuideModalProps) {
    const [copiedText, setCopiedText] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedText(id);
        setTimeout(() => setCopiedText(null), 2000);
    };

    const commands = [
        {
            id: 'register',
            syntax: '/회원가입 "이메일" "비밀번호"',
            title: '🔐 계정 생성',
            description: '모드 전용 웹사이트에 회원가입하기 위한 필수 명령어입니다.',
            tip: '반드시 실제 사용 가능한 이메일을 입력해 주세요. 추후 비밀번호를 분실했을 때 계정을 찾기 위해 꼭 필요합니다.'
        },
        {
            id: 'profile',
            syntax: '/프로필갱신 "이메일" "비밀번호"',
            title: '🔄 프로필 동기화',
            description: '모드 사이트에 본인의 인게임 최신 정보를 업데이트하는 명령어입니다.',
            tip: '인게임에서 나침반 등급이 높아졌거나, 마인크래프트 닉네임을 변경하셨을 때 실행해 주셔야 정상적으로 반영됩니다.'
        },
        {
            id: 'npc_crop',
            syntax: '/주민등록 작물',
            title: '🌾 황금 작물 주민 등록',
            description: '황금 작물 교환 주민의 고유 ID(UUID)를 모드에 저장하는 명령어입니다.',
            tip: '명령어 입력 후, 등록할 황금 작물 주민을 [우클릭]하면 인터랙션과 동시에 자동으로 UUID가 저장됩니다.'
        },
        {
            id: 'npc_coin',
            syntax: '/주민등록 주화',
            title: '🪙 에메랄드 주민 등록',
            description: '에메랄드 교환 주민의 고유 ID(UUID)를 모드에 저장하는 명령어입니다.',
            tip: '명령어 입력 후, 등록할 에메랄드 교환 주민을 [우클릭]하면 인터랙션과 동시에 자동으로 UUID가 저장됩니다.'
        },
        {
            id: 'exchange_crop',
            syntax: '/작물교환',
            title: '📦 인벤토리 작물 교환',
            description: '내 인벤토리에 보유 중인 황금 작물들을 주민과 자동으로 대량 교환하는 제어 명령어입니다.',
            tip: '실행 전 교환할 작물들이 인벤토리에 정상적으로 들어있는지 확인해 주세요.'
        },
        {
            id: 'exchange_coin',
            syntax: '/코인교환',
            title: '💎 에메랄드 자동 교환',
            description: '변경된 에메랄드 교환을 프로그램이 알아서 자동으로 실행해 주는 편리한 제어 명령어입니다. (기존 /coin 명령어 통합)',
            tip: '동작 전 에메랄드 상태를 확인 후 입력해 주세요.'
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn select-none">
            <div className="bg-[#161d2a] border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col">

                {/* 모달 헤더 */}
                <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-[#1c2637]">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">🌀</span>
                        <h3 className="text-base font-black text-slate-100">Abyssblock 모드 토탈 가이드</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-100 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-xs font-mono transition"
                    >
                        ESC ✕
                    </button>
                </div>

                {/* 모달 바디 */}
                <div className="p-6 space-y-6 overflow-y-auto">

                    {/* 1. 최신 모드 다운로드 섹션 */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <span>📦</span> 최신 모드 다운로드
                        </h4>
                        <div className="bg-[#0f141c] border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <span className="text-xs font-bold text-slate-200 block">Abyssblock 전용 파일 (gold-crop-obf.jar)</span>
                                <p className="text-[11px] text-slate-500 font-mono mt-0.5">v1.5.0 / 실행용 전용 모드 파일</p>
                            </div>
                            <a
                                href="/mod/gold-crop-obf.jar"
                                download="gold-crop-obf.jar"
                                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow transition whitespace-nowrap self-stretch sm:self-auto text-center"
                            >
                                모드 파일 다운로드 💾
                            </a>
                        </div>
                        <div className="text-[10px] bg-red-500/5 text-slate-400 border border-red-500/10 p-2.5 rounded-lg leading-relaxed">
                            <span className="text-red-400 font-bold">⚠️ 알림:</span> 파일이 `.jar` 확장자이므로 크롬 등 브라우저에서 '안전하지 않은 파일' 경고가 발생할 수 있습니다. 수동으로 암호화 처리된 안전한 파일이오니 안심하고 <span className="text-emerald-400 font-bold">'유지'</span> 또는 <span className="text-emerald-400 font-bold">'계속 다운로드'</span>를 눌러 구동해 주세요.
                        </div>
                    </div>

                    {/* 2. 명령어 정보 안내 리스트 */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <span>💻</span> 필수 인게임 연동 명령어 (클릭 시 자동 복사)
                        </h4>

                        <div className="grid grid-cols-1 gap-4">
                            {commands.map((cmd) => (
                                <div key={cmd.id} className="bg-[#0f141c] border border-slate-800 p-4 rounded-xl space-y-2 relative group">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-amber-400/90 tracking-wide">{cmd.title}</span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleCopy(cmd.syntax, cmd.id); }}
                                            className="text-[9px] bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 font-mono px-2 py-0.5 rounded transition"
                                        >
                                            {copiedText === cmd.id ? '복사완료! ✓' : 'COPY'}
                                        </button>
                                    </div>

                                    <div
                                        onClick={() => handleCopy(cmd.syntax, cmd.id)}
                                        className="w-full bg-slate-950/70 border border-slate-800 font-mono px-3 py-2 text-xs text-emerald-400 font-bold cursor-pointer hover:border-amber-400/30 transition flex justify-between items-center rounded-lg"
                                    >
                                        <span>{cmd.syntax}</span>
                                    </div>

                                    <p className="text-xs text-slate-300 leading-relaxed pl-0.5">{cmd.description}</p>

                                    <div className="text-[11px] bg-amber-400/5 text-slate-400 border border-amber-400/10 p-2.5 rounded-lg leading-relaxed">
                                        <span className="text-amber-400 font-bold">💡 참고:</span> {cmd.tip}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. 구독권 가격 정보 및 대리 후원 혜택 */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <span>🎫</span> 프리미엄 기능 구독권 안내
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-[#0f141c] border border-slate-800 p-4 rounded-xl flex flex-col justify-center">
                                <span className="text-[10px] text-slate-500 font-bold mb-1">인게임 기본 결제</span>
                                <div className="text-base font-black text-slate-200 font-mono">
                                    1일 ➔ <span className="text-amber-400">1 에주</span> <span className="text-xs font-normal text-slate-400">(에메랄드 주괴)</span>
                                </div>
                            </div>
                            <div className="bg-[#0f141c] border border-amber-400/10 p-4 rounded-xl relative overflow-hidden flex flex-col justify-center">
                                <div className="absolute top-0 right-0 bg-red-500/20 text-red-400 text-[8px] font-black px-2 py-0.5 rounded-bl">강력 추천!</div>
                                <span className="text-[10px] text-amber-400/80 font-bold mb-1">대리 후원 특가</span>
                                <div className="text-base font-black text-emerald-400 font-mono">
                                    10,000원 ➔ <span className="text-emerald-400 font-black">120일 제공</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. 구매 및 신청 연동 채널 */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <span>📬</span> 구독 신청 및 문의 방법
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="p-3.5 bg-[#0f141c] border border-slate-800 rounded-xl space-y-1">
                                <span className="font-bold text-slate-200 block">💬 디스코드 개인 메시지(DM)</span>
                                <p className="text-[11px] text-slate-400 leading-relaxed">
                                    디스코드 내 서버 멤버 리스트에서 확인하신 후 저에게 직접 DM을 발송해 주시면 확인 후 즉시 처리해 드립니다.
                                </p>
                            </div>
                            <div className="p-3.5 bg-[#0f141c] border border-slate-800 rounded-xl space-y-1">
                                <span className="font-bold text-slate-200 block">🎮 인게임 귓속말 연동</span>
                                <p className="text-[11px] text-slate-400 leading-relaxed">
                                    마인크래프트 서버 접속 후 <span className="text-amber-400 font-mono font-bold">Mx_Nothing</span> 닉네임으로 귓말을 주시면 신속하게 도와드리겠습니다.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* 모달 푸터 */}
                <div className="p-4 bg-[#121822] border-t border-slate-800 text-center">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-6 py-2 rounded-xl border border-slate-700 transition"
                    >
                        닫기
                    </button>
                </div>

            </div>
        </div>
    );
}