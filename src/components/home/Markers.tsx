'use client';
import { CITY_KEY } from '@/hooks/useInfo';
import { Map_KEY } from '@/hooks/useMap';
import { Info } from '@/types/info';
import { ImageIcon, NaverMap } from '@/types/map';
import React from 'react';
import useSWR from 'swr';
import Marker from './Marker';

const Markers = () => {
  // 보관하고 있는 SWR 을 활용
  // useSWR 에 TS 적용시 useSWR<타입>
  const { data: map } = useSWR<NaverMap>(Map_KEY);
  const { data: infos } = useSWR<Info[]>(CITY_KEY);
  // 예외 처리
  if (!map || !infos) {
    return null;
  }

  // 기본 아이콘 객체
  const iconImg: ImageIcon = {
    url: '/icon.png',
    size: new naver.maps.Size(64, 64),
    origin: new naver.maps.Point(0, 0),
    scaledSize: new naver.maps.Size(30, 30),
  };
  return (
    <>
      {infos.map((item, index) => {
        return (
          <Marker
            map={map}
            coordinates={item.coordinates}
            icon={iconImg}
            key={index}
          />
        );
      })}
    </>
  );
};

export default Markers;
