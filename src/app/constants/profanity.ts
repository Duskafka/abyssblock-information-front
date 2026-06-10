// 🚫 제한된 표현 및 비속어 리스트 (중앙 관리)
export const KOREAN_BADWORDS: string[] = [
    "개새끼", "새끼", "시발", "씨발", "존나", "좆", "병신", "지랄", "정신병자",
    "쓰레기", "미친놈", "미친년", "노가다", "ㅅㅂ", "ㅂㅅ", "ㅈㄴ", "ㄲㅈ", "꺼져",
    "아가리", "닥쳐", "새키", "씌발", "썅", "틀딱", "맘충", "한남", "김치녀"
];

/**
 * 텍스트에 비속어가 포함되어 있는지 검사하는 함수
 * @param text 검사할 문자열 (제목 또는 내용)
 */
export function checkProfanity(text: string): boolean {
    if (!text) return false;
    // 공백 및 특수문자를 모두 제거하고 검사 (예: "시 바 리" -> "시발" 우회 차단)
    const cleanedText = text.replace(/[\s~`!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
    return KOREAN_BADWORDS.some(badword => cleanedText.includes(badword));
}