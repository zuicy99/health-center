# 지도 정보 공유하기

- 사용자가 보건소 클릭
  : 시각적으로 아이콘 교체
  : 클릭된 좌표를 보관(복사) : SWR

## 클릭정보 처리하기

- 1. 커스텀 훅
     : /src/hooks/useCurrentInfo.ts

```ts
import { Info } from '@/types/info';
import { useCallback } from 'react';
import { mutate } from 'swr';
// SWR 보관용 구분키
export const CURRENT_INFO_KEY = '/health-info';

export const useCurrentInfo = () => {
  // 현재 좌표정보를 SWR 에 저장하기
  const setCurrentInfo = useCallback((info: Info) => {
    // SWR 업데이트
    mutate(CURRENT_INFO_KEY, info);
  }, []);

  // 저장된 좌표정를 SWR 에 지우기
  const clearCurrentInfo = useCallback(() => {
    // SWR 초기화
    mutate(CURRENT_INFO_KEY, null);
  }, []);

  return { setCurrentInfo, clearCurrentInfo };
};
```

- 2. onClick 에서 좌표저장
     : src/components/home/Marker.tsx

```tsx
'use client';
import { Marker } from '@/types/map';
import React, { useEffect } from 'react';

const Marker = ({ map, coordinates, icon, onClick }: Marker) => {
  // 컴포넌트 배치시 기본 출력 처리
  useEffect(() => {
    // https://navermaps.github.io/maps.js.ncp/docs/tutorial-2-Marker.html
    let marker: naver.maps.Marker | null = null;
    if (map) {
      // 마커를 출력한다.
      marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(...coordinates),
        map: map,
        icon: icon,
      });
    }
    // 컴포넌트가 제거될때 실행할 cleanup 함수
    return () => {
      marker?.setMap(null);
    };

    // 지도 객체가 변화가 일어나면 처리하라
    // Dependency Array (의존성배열)
  }, [map]);

  // 네이버 마커 아이콘은 네이버가 랜더링합니다
  return null;
};

export default Marker;
```

- 3. onClick 처리
     : src/components/home/Marker.tsx

```tsx
'use client';
import { Marker } from '@/types/map';
import React, { useEffect } from 'react';

const Marker = ({ map, coordinates, icon, onClick }: Marker) => {
  // 컴포넌트 배치시 기본 출력 처리
  useEffect(() => {
    // https://navermaps.github.io/maps.js.ncp/docs/tutorial-2-Marker.html
    let marker: naver.maps.Marker | null = null;
    if (map) {
      // 마커를 출력한다.
      marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(...coordinates),
        map: map,
        icon: icon,
      });
    }
    // 컴포넌트가 제거될때 실행할 cleanup 함수
    return () => {
      marker?.setMap(null);
    };

    // 지도 객체가 변화가 일어나면 처리하라
    // Dependency Array (의존성배열)
  }, [map]);

  // 네이버 마커 아이콘은 네이버가 랜더링합니다
  return null;
};

export default Marker;
```

- 4. type 추가
     : src/types/map.ts

```ts
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
```

- 5. 네이버 API 이벤트 리스너 등록(문서)
     : src/components/home/Marker.tsx (아이콘 바꾸기)

```tsx
'use client';
import { Marker } from '@/types/map';
import React, { useEffect } from 'react';

const Marker = ({ map, coordinates, icon, onClick }: Marker) => {
  // 컴포넌트 배치시 기본 출력 처리
  useEffect(() => {
    // https://navermaps.github.io/maps.js.ncp/docs/tutorial-2-Marker.html
    let marker: naver.maps.Marker | null = null;
    if (map) {
      // 마커를 출력한다.
      marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(...coordinates),
        map: map,
        icon: icon,
      });
    }

    // 클릭 처리
    if (onClick) {
      // 네이버 API 이벤트 처리하는 방식을 사용(문서참조)
      naver.maps.Event.addListener(marker, 'click', onClick);
    }

    // 컴포넌트가 제거될때 실행할 cleanup 함수
    return () => {
      marker?.setMap(null);
    };

    // 지도 객체가 변화가 일어나면 처리하라
    // Dependency Array (의존성배열)
  }, [map]);

  // 네이버 마커 아이콘은 네이버가 랜더링합니다
  return null;
};

export default Marker;
```

- 6. 초기에 평범한 마커 이미지 출력(함수를 통해서 다르게 출력)

     : src/components/home/Marker.tsx (아이콘 바꾸기)

```tsx
'use client';
import { CITY_KEY } from '@/hooks/useInfo';
import { Map_KEY } from '@/hooks/useMap';
import { Info } from '@/types/info';
import { ImageIcon, NaverMap } from '@/types/map';
import React from 'react';
import useSWR from 'swr';
import Marker from './Marker';
import { useCurrentInfo } from '@/hooks/useCurrentInfo';

const Markers = () => {
  // 좌표를 저장 및 삭제
  const { setCurrentInfo } = useCurrentInfo();

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
      scaledSize: new naver.maps.Size(30, 30),
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
    </>
  );
};

export default Markers;
```

- 7. 현재 사용자가 마커를 클릭해서 정보를 저장한 경우 출력 처리/삭제처리
     : src/components/home/Markers.tsx

```tsx
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
```

- 8. 지도 영역을 클릭하면 아이콘 전체 비활성
     : - /src/components/map/MapSection.tsx

```tsx
import React from 'react';
import Map from './Map';
import { useMap } from '@/hooks/useMap';
import { NaverMap } from '@/types/map';
import Markers from '../home/Markers';
import { useCurrentInfo } from '@/hooks/useCurrentInfo';

const MapSection = () => {
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
      <Map onLoad={onLoadMap} />
      <Markers />
    </>
  );
};

export default MapSection;
```

## 지도 공유하기

- /src/hooks/useMap.ts
- https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Map.html#morph__anchor
- morph(coord, zoom, transitionOptions)
  : 지정한 좌표와 줌 레벨을 사용하는 새로운 위치로 지도를 이동합니다. 이때, 이동 거리가 가깝다면 부드럽게 이동합니다.

```ts
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
```

- src/app/page.tsx
  : 1. router 에 네이버 API 를 활용해서 출력하기
  : next/navigation 사용 필수

```tsx
'use client';
import HeaderComponent from '@/components/common/HeaderComponent';
import Link from 'next/link';
import styles from '@/styles/header.module.scss';
import { SlActionRedo, SlLayers } from 'react-icons/sl';
import { PiSealCheck } from 'react-icons/pi';
import MapSection from '@/components/map/MapSection';
import { useEffect } from 'react';
import { getInfoList } from '@/apis/api';
import { Info } from '@/types/info';
import { useInfo } from '@/hooks/useInfo';
import { useMap } from '@/hooks/useMap';
import { useRouter } from 'next/navigation';

export default function Home() {
  // 라우터 활용
  const router = useRouter();
  // 지도 관련 Hooks
  const { getMapOption } = useMap();
  // 현재 지도 좌표, zoom 정보 얻어오기
  const copyAndSaveInfo = () => {
    const mapOptions = getMapOption();
    // console.log(mapOptions);
    const query = `/?zoom=${mapOptions.zoom}&lat=${mapOptions.center[0]}&lng=${mapOptions.center[1]}`;
    // console.log(query);
    // 패스 이동을 표현
    router.push(query);
  };

  // SWR 에 정의한 Hook 호출하기
  const { initializeInfo } = useInfo();

  // 페이지 준비가 되면 데이터 호출
  useEffect(() => {
    // 마커를 위한 데이터 호출
    const fetchInfoList = async () => {
      try {
        const res: Info[] = await getInfoList();
        // SWR 에 초기값 보관하기
        initializeInfo(res);
        // console.log(res);
        // res.map(info => console.log(info.coordinates));
      } catch (error) {
        console.log('에러가 발생습니다.', error);
      }
    };

    fetchInfoList();
  }, []);

  return (
    <>
      <HeaderComponent
        rightElements={[
          <button
            key="share"
            className={styles.box}
            onClick={() => {
              // alert('지도공유');
              // 현재 네이버의 좌표와 확대 비율을 보관해서 전달하도록 준비
              copyAndSaveInfo();
            }}
          >
            <SlActionRedo />
          </button>,
          <Link key="feedback" href="/feedback" className={styles.box}>
            <PiSealCheck />
          </Link>,
          <Link key="about" href="/about" className={styles.box}>
            <SlLayers />
          </Link>,
        ]}
      />
      <main style={{ width: '100%', height: '100%' }}>
        <MapSection />
      </main>
    </>
  );
}
```

- 클립보드에 주소 복사하기 라이브러리 설치
  : https://www.npmjs.com/package/copy-to-clipboard
  : ` yarn add copy-to-clipboard`

```tsx
'use client';
import HeaderComponent from '@/components/common/HeaderComponent';
import Link from 'next/link';
import styles from '@/styles/header.module.scss';
import { SlActionRedo, SlLayers } from 'react-icons/sl';
import { PiSealCheck } from 'react-icons/pi';
import MapSection from '@/components/map/MapSection';
import { useCallback, useEffect } from 'react';
import { getInfoList } from '@/apis/api';
import { Info } from '@/types/info';
import { useInfo } from '@/hooks/useInfo';
import { useMap } from '@/hooks/useMap';
import { useRouter } from 'next/navigation';
import copy from 'copy-to-clipboard';

export default function Home() {
  // 라우터 활용
  const router = useRouter();
  // 지도 관련 Hooks
  const { getMapOption } = useMap();
  // 현재 지도 좌표, zoom 정보 얻어오기
  const copyAndSaveInfo = useCallback(() => {
    const mapOptions = getMapOption();
    // console.log(mapOptions);
    const query = `/?zoom=${mapOptions.zoom}&lat=${mapOptions.center[0]}&lng=${mapOptions.center[1]}`;
    // console.log(query);
    // 패스 이동을 표현
    router.push(query);

    //  query 를 클립보드에 복사해서 보관
    copy(query);
  }, [router, getMapOption]);

  // SWR 에 정의한 Hook 호출하기
  const { initializeInfo } = useInfo();

  // 페이지 준비가 되면 데이터 호출
  useEffect(() => {
    // 마커를 위한 데이터 호출
    const fetchInfoList = async () => {
      try {
        const res: Info[] = await getInfoList();
        // SWR 에 초기값 보관하기
        initializeInfo(res);
        // console.log(res);
        // res.map(info => console.log(info.coordinates));
      } catch (error) {
        console.log('에러가 발생습니다.', error);
      }
    };

    fetchInfoList();
  }, []);

  return (
    <>
      <HeaderComponent
        rightElements={[
          <button
            key="share"
            className={styles.box}
            onClick={() => {
              // alert('지도공유');
              // 현재 네이버의 좌표와 확대 비율을 보관해서 전달하도록 준비
              copyAndSaveInfo();
            }}
          >
            <SlActionRedo />
          </button>,
          <Link key="feedback" href="/feedback" className={styles.box}>
            <PiSealCheck />
          </Link>,
          <Link key="about" href="/about" className={styles.box}>
            <SlLayers />
          </Link>,
        ]}
      />
      <main style={{ width: '100%', height: '100%' }}>
        <MapSection />
      </main>
    </>
  );
}
```

## 공유 받은 주소로 최초 위치 및 zoom 설정하기

- /src/components/map/MapSection.tsx

```tsx
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
```
