'use client';
import { CITY_KEY } from '@/hooks/useInfo';
import { Map_KEY } from '@/hooks/useMap';
import { Info } from '@/types/info';
import { ImageIcon, NaverMap } from '@/types/map';
import React from 'react';
import useSWR from 'swr';
import Marker from './Marker';
import { CURRENT_INFO_KEY, useCurrentInfo } from '@/hooks/useCurrentInfo';

const Markers = () => {
  // 좌표를 저장 및 삭제
  const { setCurrentInfo, clearCurrentInfo } = useCurrentInfo();
  // SWR 에 보관된 정보를 추출
  const { data: currentInfo } = useSWR<Info>(CURRENT_INFO_KEY);

  // 보관하고 있는 SWR 을 활용
  // useSWR 에 TS 적용시 useSWR<타입>
  const { data: map } = useSWR<NaverMap>(Map_KEY);
  const { data: infos } = useSWR<Info[]>(CITY_KEY);
  // 예외 처리
  if (!map || !infos) {
    return null;
  }

  // 클릭에 따라 true, false 인 경우 다른 ImageIcon 생성해서 리턴
  const changeMarkerIcon = (isSelected: boolean): ImageIcon => {
    return {
      url: isSelected ? '/icon-active.png' : '/icon.png',
      size: new naver.maps.Size(64, 64),
      origin: new naver.maps.Point(0, 0),
      scaledSize: new naver.maps.Size(54, 54),
    };
  };

  // 기본 아이콘 객체
  // const iconImg: ImageIcon = {
  //   url: '/icon.png',
  //   size: new naver.maps.Size(64, 64),
  //   origin: new naver.maps.Point(0, 0),
  //   scaledSize: new naver.maps.Size(30, 30),
  // };
  return (
    <>
      {infos.map((item, index) => {
        return (
          <Marker
            map={map}
            coordinates={item.coordinates}
            icon={changeMarkerIcon(false)}
            key={index}
            onClick={() => {
              setCurrentInfo(item);
            }}
          />
        );
      })}
      {/* 만약 SWR 에 보관된 좌표가 있는 경우 */}
      {currentInfo && (
        <Marker
          map={map}
          coordinates={currentInfo.coordinates}
          icon={changeMarkerIcon(true)}
          key={9999999999}
          onClick={() => {
            // 보관된 좌표를 지워라
            clearCurrentInfo();
          }}
        />
      )}
    </>
  );
};

export default Markers;
