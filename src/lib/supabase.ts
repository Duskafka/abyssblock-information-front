import { createBrowserClient, createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase 클라이언트 생성 지점.
 *
 * 이전에는 7개 파일이 각자 `createBrowserClient(process.env...!, ...!)`를
 * 모듈 최상단에서 호출했다. URL·키 참조가 14곳으로 흩어져 있었고 전부
 * non-null 단언(`!`)이라, 환경변수가 비면 런타임에서야 알 수 없는 형태로
 * 터졌다. 여기 한 곳에서만 읽고 한 번만 검증한다.
 */
function readEnv() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
        throw new Error(
            "Supabase 환경변수가 없습니다. .env.local에 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정해 주세요.",
        );
    }

    return { url, anonKey };
}

let browserClient: SupabaseClient | null = null;

/**
 * 브라우저용 클라이언트. 탭 하나에 하나만 두어야 인증 상태 구독이 중복되지 않으므로
 * 모듈 수준에서 재사용한다.
 */
export function getBrowserSupabase(): SupabaseClient {
    if (!browserClient) {
        const { url, anonKey } = readEnv();
        browserClient = createBrowserClient(url, anonKey);
    }
    return browserClient;
}

/**
 * 서버 컴포넌트용 읽기 전용 클라이언트.
 *
 * 서버 컴포넌트에서는 쿠키를 쓸 수 없으므로 setAll은 의도적으로 비워 둔다.
 * (쓰기가 필요해지면 그때 proxy.ts에서 세션을 갱신하는 구성을 추가한다.)
 * 인자로 쿠키를 받는 이유는 이 모듈이 `next/headers`에 의존하지 않게 해서
 * 클라이언트 번들에 서버 전용 코드가 딸려 들어가지 않도록 하기 위해서다.
 */
export function createServerSupabase(cookieStore: {
    getAll: () => { name: string; value: string }[];
}): SupabaseClient {
    const { url, anonKey } = readEnv();

    return createServerClient(url, anonKey, {
        cookies: {
            getAll: () => cookieStore.getAll(),
            setAll: () => {
                // 서버 컴포넌트에서는 응답 쿠키를 쓸 수 없다. 읽기 전용으로만 쓴다.
            },
        },
    });
}
