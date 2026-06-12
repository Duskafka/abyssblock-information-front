'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
// 💡 제공해주신 경로의 중앙 집중식 샵 컨피그 유틸 함수 사용
import { getShopItemConfig } from '@/app/constants/shop';

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useMyPageData() {
    const [user, setUser] = useState<any>(null);
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // 📂 내가 작성한 콘텐츠 데이터 상태
    const [myPosts, setMyPosts] = useState<any[]>([]);
    const [myItems, setMyItems] = useState<any[]>([]);
    const [contentLoading, setContentLoading] = useState(false);

    // 👤 Supabase profiles 테이블에서 인게임 마인크래프트 정보 조회
    const fetchUserProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            setProfileData(data);
        } catch (err: any) {
            console.error('프로필 로드 실패:', err.message);
        } finally {
            setLoading(false);
        }
    };

    // 📝 내가 작성한 빌드 글과 아이템 판매 글 로드 함수
    const fetchMyContents = async (userId: string) => {
        setContentLoading(true);
        try {
            // 1. 빌드 공유글 가져오기 (스키마: user_id 컬럼 사용)
            const { data: postsData } = await supabase
                .from('posts')
                .select('id, title, created_at, job')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            setMyPosts(postsData || []);

            // 2. 장터 아이템 판매글 가져오기 (★ 스키마 반영: seller_id, item_id 컬럼 사용)
            const { data: itemsData, error: itemsError } = await supabase
                .from('shop_items')
                .select('id, item_id, price, created_at, quantity')
                .eq('seller_id', userId)
                .order('created_at', { ascending: false });

            if (itemsError) throw itemsError;
            setMyItems(itemsData || []);
        } catch (err) {
            console.error('콘텐츠 동기화 실패:', err);
        } finally {
            setContentLoading(false);
        }
    };

    // 🔐 유저인증 세션 체크 및 관찰자 등록
    useEffect(() => {
        async function checkUser() {
            const { data: { session } } = await supabase.auth.getSession();
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                await fetchUserProfile(currentUser.id);
                await fetchMyContents(currentUser.id);
            } else {
                setLoading(false);
            }
        }
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                fetchUserProfile(currentUser.id);
                fetchMyContents(currentUser.id);
            } else {
                setProfileData(null);
                setMyPosts([]);
                setMyItems([]);
                setLoading(false);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // 💡 shop.ts 파일 설정을 기반으로 영문 ID를 한글명으로 가공해주는 헬퍼
    const translateItemId = (englishId: string): string => {
        const itemConfig = getShopItemConfig(englishId);
        return itemConfig ? itemConfig.koreanName : englishId;
    };

    return {
        user,
        profileData,
        loading,
        myPosts,
        myItems,
        contentLoading,
        translateItemId, // 메인 UI 컴포넌트로 전달
        supabase,
    };
}