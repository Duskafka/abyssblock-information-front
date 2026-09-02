import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * 공용 마크다운 렌더러.
 *
 * 이전에는 같은 11개짜리 컴포넌트 맵이 네 파일에 복사돼 있었고
 * (board 상세 / board 수정 / 빌드 작성 모달 / 공지 상세),
 * 값이 조금씩 갈려서 code 배경이 board는 slate-800, notice는 slate-950이었다.
 *
 * @tailwindcss/typography가 dependency에 있는데 등록만 안 돼 있었다.
 * 플러그인을 켜고 prose로 옮기면서 네 벌을 한 벌로 합친다.
 */
const THEME = [
    "prose prose-invert max-w-none",
    "prose-headings:text-amber-400 prose-headings:font-bold prose-headings:tracking-tight",
    "prose-h1:border-b prose-h1:border-slate-800 prose-h1:pb-2",
    "prose-h3:text-amber-500",
    "prose-p:text-slate-300",
    "prose-strong:text-amber-300 prose-strong:font-extrabold",
    "prose-em:text-slate-400",
    "prose-li:text-slate-300 marker:text-amber-400",
    // 기본 prose는 인라인 코드에 백틱(`)을 ::before/::after로 붙인다. 끈다.
    "prose-code:text-amber-300 prose-code:bg-slate-800 prose-code:rounded prose-code:px-1.5",
    "prose-code:py-0.5 prose-code:font-normal",
    "prose-code:before:content-none prose-code:after:content-none",
    "prose-blockquote:border-l-4 prose-blockquote:border-amber-500",
    "prose-blockquote:text-slate-300 prose-blockquote:not-italic",
    "prose-a:text-amber-400 prose-a:underline-offset-2",
    "prose-hr:border-slate-800",
].join(" ");

const SIZE = {
    /** 작성/수정 화면의 실시간 미리보기처럼 좁은 칸 */
    compact: "prose-sm",
    /** 게시글 본문 */
    default: "prose-sm sm:prose-base",
    /** 공지처럼 읽기가 주인 문서 */
    article: "prose-base",
} as const;

interface MarkdownProps {
    children: string;
    size?: keyof typeof SIZE;
    className?: string;
}

export default function Markdown({
    children,
    size = "default",
    className = "",
}: MarkdownProps) {
    return (
        <div className={`${THEME} ${SIZE[size]} ${className}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {children}
            </ReactMarkdown>
        </div>
    );
}
