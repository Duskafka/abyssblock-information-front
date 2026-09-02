import Image, { type ImageProps } from "next/image";

/**
 * 게임 아이콘용 이미지.
 *
 * 이전에는 사이트 전체가 원시 이미지 태그 34개였고 width/height가 하나도 없어
 * 아이콘마다 레이아웃 시프트(CLS)가 났고 레이지 로딩도 없었다.
 *
 * 다만 에셋이 전부 픽셀 아트라 최적화 파이프라인의 리샘플링을 거치면
 * 도트가 뭉개진다. 그래서 unoptimized로 원본을 그대로 받고,
 * next/image에서는 width/height(=CLS 제거)와 레이지 로딩만 취한다.
 * 실제 표시 크기는 각 사용처의 CSS(w-*, h-*, object-contain)가 정한다.
 */
export default function PixelImage(props: ImageProps) {
    return <Image {...props} unoptimized />;
}
