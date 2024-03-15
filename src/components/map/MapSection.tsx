import React from 'react';
import Map from './Map';
import { INITIAL_CENTER, INITIAL_ZOOM, useMap } from '@/hooks/useMap';
import { NaverMap } from '@/types/map';
import Markers from '../home/Markers';
import { useCurrentInfo } from '@/hooks/useCurrentInfo';
import { useSearchParams } from 'next/navigation';
import { Coordinates } from '@/types/info';

const MapSection = () => {
  // 지도 화면이 랜더일 되면 URL 의 Params 를 읽는다.
  // localhost:3000/?zoom=13&lat=36.1332863&lng=128.3343228
  const searchParams = useSearchParams();
  // console.log(searchParams);
  const zoom = searchParams.get('zoom');
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  // console.log(zoom, lat, lng);
  // 초기 중심점 설정
  const initialZoom = zoom ? Number(zoom) : INITIAL_ZOOM;
  const initialCenter: Coordinates =
    lat && lng ? [Number(lat), Number(lng)] : INITIAL_CENTER;

  //  보관하고 있던 SWR 좌표값을 삭제한다.
  const { clearCurrentInfo } = useCurrentInfo();

  // 커스텀 훅으로 Naver Map 초기화시도
  const { initializeMap } = useMap();
  const onLoadMap = (map?: NaverMap) => {
    initializeMap(map);
    // 네이버 API 문서 참조
    naver.maps.Event.addListener(map, 'click', clearCurrentInfo);
  };
  return (
    <>
      <Map
        onLoad={onLoadMap}
        initialCenter={initialCenter}
        initialZoom={initialZoom}
      />
      <Markers />
    </>
  );
};

export default MapSection;
