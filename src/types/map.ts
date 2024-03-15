import { Coordinates } from './info';

// 네이버 지도 맵에 대한 타입
export type NaverMap = naver.maps.Map;
// 네이버 마커에 이미지 를 데이터 타입
export type ImageIcon = {
  url: string;
  size: naver.maps.Size;
  origin: naver.maps.Point;
  scaledSize: naver.maps.Size;
};

// 네이버 마커를 위한 데이터 타입
export type Marker = {
  map: NaverMap;
  coordinates: Coordinates;
  icon: ImageIcon;
  // 사용작 클릭한 경우 처리
  onClick: () => void;
};
