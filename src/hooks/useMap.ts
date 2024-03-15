import { Coordinates } from '@/types/info';
import { NaverMap } from '@/types/map';
import { useCallback } from 'react';
import useSWR, { mutate } from 'swr';

export const INITIAL_CENTER: Coordinates = [37.3595704, 127.105399];
export const INITIAL_ZOOM = 10;
export const INITIAL_MINZOOM = 9;
// 지도의 값을 보관하고 캐쉬할 SWR 객체 만들기
export const Map_KEY = '/map';
// 함수 실행후 {함수, 값} 리턴
export const useMap = () => {
  // SWR 에 보관하고 있는 좌표정보
  const { data: map } = useSWR(Map_KEY);

  // 지도에 필요한 값 초기화 함수
  const initializeMap = useCallback((map?: NaverMap) => {
    if (map) {
      mutate(Map_KEY, map);
    }
  }, []);

  // 네이버 API morph 활용 (초기화)
  const resetMapOption = useCallback(() => {
    // morph(coord, zoom, transitionOptions)
    map?.morph(new naver.maps.LatLng(...INITIAL_CENTER), INITIAL_ZOOM);
  }, [map]);

  // 좌표 정보 얻어오기
  const getMapOption = useCallback(() => {
    // 네이버 API 좌표의 위치를 읽는다.
    const mapCenter = map.getCenter();
    const center: Coordinates = [mapCenter.lat(), mapCenter.lng()];
    const zoom = map?.getZoom();
    return { center, zoom };
  }, [map]);

  return { initializeMap, resetMapOption, getMapOption };
};
