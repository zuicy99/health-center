# 네이버 개발자 등록 및 지도 API 활용

- [서비스가입](https://www.ncloud.com)
- [콘솔](https://console.ncloud.com/naver-service/application)
- [맵가이드](https://guide.ncloud-docs.com/docs/ko/maps-web-sdk)
- 서비스 신청 과정 : AI-NAVER API > Application > Application 등록
- Application 이름 : health-center > Maps > Web Dynamic Map 선택
- (필수) Web Dynamic Map 선택 시 Web 서비스 URL을 입력해야 합니다.
- Web 서비스 URL(최대 10개) (추후에 vercle 배포 후 주소를 기재필요)
  : http://localhost:3000 (추가버튼 실행)
- 보안키를 env 파일에 보관할 예정 (ohaspqtp18)

## 기본 폴더 구성

- 아래 구성은 화면에 배치되는 요소
- /src/components/map 폴더생성
- /src/components/map/MapSection.tsx 파일 생성

```tsx
import React from 'react';

const MapSection = () => {
  return <div>MapSection</div>;
};

export default MapSection;
```

## 지도 배치

- /src/app/page.tsx

```tsx
'use client';
import HeaderComponent from '@/components/common/HeaderComponent';
import Link from 'next/link';
import styles from '@/styles/header.module.scss';
import { SlActionRedo, SlLayers } from 'react-icons/sl';
import { PiSealCheck } from 'react-icons/pi';
import MapSection from '@/components/map/MapSection';

export default function Home() {
  return (
    <>
      <HeaderComponent
        rightElements={[
          <button
            key="share"
            className={styles.box}
            onClick={() => {
              alert('지도공유');
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

- src/styles/globals.css

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  outline-style: none;
}
ul,
li {
  list-style: none;
}
a {
  color: #000;
  text-decoration: none;
}
/* 지도 가 전체 화면을 차지하기 위한 처리 */
html {
  width: 100%;
  height: 100%;
}
body {
  width: 100%;
  height: 100%;
}
```

```tsx
import React from 'react';
import Map from './Map';

const MapSection = () => {
  return (
    <>
      <Map />
    </>
  );
};

export default MapSection;
```

## 실제 Map 배치 컴포넌트 (실제기능은 여기서 처리)

- /src/components/map/Map.tsx 파일 생성

```tsx
import React from 'react';

const Map = () => {
  return <div>Map</div>;
};

export default Map;
```

## 지도 API 활용하기

- [문서](https://navermaps.github.io/maps.js.ncp/docs/tutorial-2-Getting-Started.html)
- /src/components/map/Map.tsx
- 이전에는 외부(네이버, 구글, 카카오) 자바스크립트 활용시 html 직접 작성
- Next.js 에는 외부 자바 스크립트를 불러들여서 활용이 가능한 방안 제시
- next/script 패키지의 Script 를 활용한다.

```tsx
import Script from 'next/script';
import React from 'react';

const Map = () => {
  const initializeMap = (): void => {
    console.log('로딩완료');
  };
  return (
    <>
      {/* Next.js 에서 외부 자바스크립트 참조시 next/script */}
      <Script
        strategy="afterInteractive"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=비밀번호`}
        onLoad={initializeMap}
      />
    </>
  );
};

export default Map;
```

### 1. TS 를 위한 모듈 설치하기

```txt
npm i -D @types/navermaps
yarn add @types/navermaps --dev
```

- src/componenets/map/Map.tsx

```tsx
'use client';
import Script from 'next/script';
import React, { useRef } from 'react';

const MAP_KEY = '키값';

const Map = () => {
  // jsx 요소인 id = "map" 을 찾아서 보관
  // TS 를 활용하기 위한 naver Type 정의
  // 관례상 일반적으로  types 폴더를 만들고 Type 파일들을 배치
  const mapRef = useRef<naver.maps.Map | null>(null);

  const initializeMap = (): void => {
    console.log('로딩완료시 최초로 보여줄 위치, 위도/경도');
    //https://navermaps.github.io/maps.js.ncp/docs/tutorial-3-Using-TypeScript.html
    const mapOptions = {
      center: new naver.maps.LatLng(37.3595704, 127.105399),
      zoom: 10,
    };
    const mapObject = new naver.maps.Map('map', mapOptions);
    mapRef.current = mapObject;
  };
  return (
    <>
      {/* Next.js 에서 외부 자바스크립트 참조시 next/script */}
      {/* https://nextjs.org/docs/app/building-your-application/optimizing/scripts */}
      <Script
        strategy="afterInteractive"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${MAP_KEY}`}
        onLoad={initializeMap}
      />
      {/* 지도가 출력될 div : 전체 화면 활용 */}
      <div id="map" style={{ width: '100%', height: '100%' }}></div>
    </>
  );
};

export default Map;
```

### 2. 위도, 경도를 위한 타입 정의

- src/types 폴더
- src/types/info.ts

```ts
// 위도를 표현하는 타입
type Lat = number;
// 경도를 표현하는 타입
type Lng = number;
// 위도와 경도를 묶어준 타입
export type Coordinates = [Lat, Lng];
```

### 3. 네이버 지도 타입 정의

- src/types/map.ts

```ts
// 네이버 지도 맵에 대한 타입
export type NaverMap = naver.maps.Map;
```

### 4. 네이버 지도 생성시 옵션 살펴보기

- https://navermaps.github.io/maps.js.ncp/docs/naver.maps.html#.MapOptions

```tsx
'use client';
import Script from 'next/script';
import React, { useRef } from 'react';

const MAP_KEY = '키값';

const Map = () => {
  // jsx 요소인 id = "map" 을 찾아서 보관
  // TS 를 활용하기 위한 naver Type 정의
  // 관례상 일반적으로  types 폴더를 만들고 Type 파일들을 배치
  const mapRef = useRef<naver.maps.Map | null>(null);

  const initializeMap = (): void => {
    // console.log('로딩완료시 최초로 보여줄 위치, 위도/경도');
    //https://navermaps.github.io/maps.js.ncp/docs/tutorial-3-Using-TypeScript.html
    const mapOptions = {
      center: new naver.maps.LatLng(37.3595704, 127.105399),
      zoom: 10,
      minZoom: 9,
      scaleControl: false,
      mapDataControl: false,
      logoControlOptions: {
        position: naver.maps.Position.BOTTOM_LEFT,
      },
    };
    const mapObject = new naver.maps.Map('map', mapOptions);
    mapRef.current = mapObject;
  };
  return (
    <>
      {/* Next.js 에서 외부 자바스크립트 참조시 next/script */}
      {/* https://nextjs.org/docs/app/building-your-application/optimizing/scripts */}
      <Script
        strategy="afterInteractive"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${MAP_KEY}`}
        onLoad={initializeMap}
      />
      {/* 지도가 출력될 div : 전체 화면 활용 */}
      <div id="map" style={{ width: '100%', height: '100%' }}></div>
    </>
  );
};

export default Map;
```

### 5. Props 및 Type 을 이용한 초기값 설정

```tsx
'use client';
import Script from 'next/script';
import React, { useRef } from 'react';

const MAP_KEY = '키값';
const INITIAL_CENTER = [37.3595704, 127.105399];
const INITIAL_ZOOM = 10;
const INITIAL_MINZOOM = 9;

const Map = () => {
  // jsx 요소인 id = "map" 을 찾아서 보관
  // TS 를 활용하기 위한 naver Type 정의
  // 관례상 일반적으로  types 폴더를 만들고 Type 파일들을 배치
  const mapRef = useRef<naver.maps.Map | null>(null);

  const initializeMap = (): void => {
    // console.log('로딩완료시 최초로 보여줄 위치, 위도/경도');
    //https://navermaps.github.io/maps.js.ncp/docs/tutorial-3-Using-TypeScript.html
    const mapOptions = {
      center: new naver.maps.LatLng(37.3595704, 127.105399),
      zoom: 10,
      minZoom: 9,
      scaleControl: false,
      mapDataControl: false,
      logoControlOptions: {
        position: naver.maps.Position.BOTTOM_LEFT,
      },
    };
    const mapObject = new naver.maps.Map('map', mapOptions);
    mapRef.current = mapObject;
  };
  return (
    <>
      {/* Next.js 에서 외부 자바스크립트 참조시 next/script */}
      {/* https://nextjs.org/docs/app/building-your-application/optimizing/scripts */}
      <Script
        strategy="afterInteractive"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${MAP_KEY}`}
        onLoad={initializeMap}
      />
      {/* 지도가 출력될 div : 전체 화면 활용 */}
      <div id="map" style={{ width: '100%', height: '100%' }}></div>
    </>
  );
};

export default Map;
```

### 6. 동일한 기능 및 동일한 값을 재활용하기 위한 처리 커스텀 훅 생성

- src/hooks 폴더 생성
- src/hooks/useMap.ts

```ts
import { Coordinates } from '@/types/info';
export const INITIAL_CENTER: Coordinates = [37.3595704, 127.105399];
export const INITIAL_ZOOM = 10;
export const INITIAL_MINZOOM = 9;
```

### 7. 커스텀 훅 적용하기

- components/map/Map.tsx

```tsx
'use client';
import { INITIAL_CENTER, INITIAL_MINZOOM, INITIAL_ZOOM } from '@/hooks/useMap';
import { Coordinates } from '@/types/info';
import { NaverMap } from '@/types/map';
import Script from 'next/script';
import React, { useRef } from 'react';

const MAP_KEY = '키값';
// 컴포넌트에 전달할 수 있는 Props Type 정의
type Props = {
  mapId?: string; // 배치될 HTML 의 ID
  initialCenter?: Coordinates; // 초기 [위도, 경도]
  initialZoom?: number; // 초기 지도 확대 값
  onLoad?: (map: NaverMap) => void; // 지도로딩 완료시 처리
};

const Map = ({
  mapId = 'map',
  initialCenter = INITIAL_CENTER,
  initialZoom = INITIAL_ZOOM,
  onLoad,
}: Props) => {
  // jsx 요소인 id = "map" 을 찾아서 보관
  // TS 를 활용하기 위한 naver Type 정의
  // 관례상 일반적으로  types 폴더를 만들고 Type 파일들을 배치
  const mapRef = useRef<naver.maps.Map | null>(null);

  const initializeMap = (): void => {
    // console.log('로딩완료시 최초로 보여줄 위치, 위도/경도');
    //https://navermaps.github.io/maps.js.ncp/docs/tutorial-3-Using-TypeScript.html
    const mapOptions = {
      center: new window.naver.maps.LatLng(...initialCenter),
      zoom: initialZoom,
      minZoom: INITIAL_MINZOOM,
      scaleControl: false,
      mapDataControl: false,
      logoControlOptions: {
        position: naver.maps.Position.BOTTOM_LEFT,
      },
    };
    const mapObject = new naver.maps.Map(mapId, mapOptions);
    mapRef.current = mapObject;

    // 만약 Props 로 Onload 기능을 전달한 경우 지도에 대한 부가처리
    if (onLoad) {
      onLoad(mapObject);
    }
  };
  return (
    <>
      {/* Next.js 에서 외부 자바스크립트 참조시 next/script */}
      {/* https://nextjs.org/docs/app/building-your-application/optimizing/scripts */}
      <Script
        strategy="afterInteractive"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${MAP_KEY}`}
        onReady={initializeMap}
      />
      {/* 지도가 출력될 div : 전체 화면 활용 */}
      <div id="map" style={{ width: '100%', height: '100%' }}></div>
    </>
  );
};

export default Map;
```

### 8. 페이지 이동간 지도 재출력

- yarn build 후 yarn start 시 정상
  : 조건 ( onReady = { initializeMap } )
- 지도 서비스 개발중에 환경셋팅
  : 하지만 반드시 기억을 해야합니다.
- next.config.mjs

```mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 디버그 모드 셋팅 활성화
  reactStrictMode: true,
};

export default nextConfig;
```

### 9. 지도 출력후 진행 내용 작성

- src/components/map/MapSection.tsx

```ts
import React from 'react';
import Map from './Map';

const MapSection = () => {
  return (
    <>
      <Map
        onLoad={() => {
          console.log('지도 출력 후 처리할일');
        }}
      />
    </>
  );
};

export default MapSection;

```

### 10. 페이지 이동시 지도 미출력시 성능 해결

- useEffect 의 cleanup 함수로 처리

```tsx
'use client';
import { INITIAL_CENTER, INITIAL_MINZOOM, INITIAL_ZOOM } from '@/hooks/useMap';
import { Coordinates } from '@/types/info';
import { NaverMap } from '@/types/map';
import Script from 'next/script';
import React, { useEffect, useRef } from 'react';

const MAP_KEY = '키값';
// 컴포넌트에 전달할 수 있는 Props Type 정의
type Props = {
  mapId?: string; // 배치될 HTML 의 ID
  initialCenter?: Coordinates; // 초기 [위도, 경도]
  initialZoom?: number; // 초기 지도 확대 값
  onLoad?: (map: NaverMap) => void; // 지도로딩 완료시 처리
};

const Map = ({
  mapId = 'map',
  initialCenter = INITIAL_CENTER,
  initialZoom = INITIAL_ZOOM,
  onLoad,
}: Props) => {
  // jsx 요소인 id = "map" 을 찾아서 보관
  // TS 를 활용하기 위한 naver Type 정의
  // 관례상 일반적으로  types 폴더를 만들고 Type 파일들을 배치
  const mapRef = useRef<naver.maps.Map | null>(null);

  const initializeMap = (): void => {
    // console.log('로딩완료시 최초로 보여줄 위치, 위도/경도');
    //https://navermaps.github.io/maps.js.ncp/docs/tutorial-3-Using-TypeScript.html
    const mapOptions = {
      center: new window.naver.maps.LatLng(...initialCenter),
      zoom: initialZoom,
      minZoom: INITIAL_MINZOOM,
      scaleControl: false,
      mapDataControl: false,
      logoControlOptions: {
        position: naver.maps.Position.BOTTOM_LEFT,
      },
    };
    const mapObject = new naver.maps.Map(mapId, mapOptions);
    mapRef.current = mapObject;

    // 만약 Props 로 Onload 기능을 전달한 경우 지도에 대한 부가처리
    if (onLoad) {
      onLoad(mapObject);
    }
  };

  // useEffect 를 이용한 리소스 제거
  useEffect(() => {
    // cleanup 함수
    // 컴포넌트가 삭제될때
    return () => {
      // 지도제거하기
      mapRef.current?.destroy();
    };
  }, []);

  return (
    <>
      {/* Next.js 에서 외부 자바스크립트 참조시 next/script */}
      {/* https://nextjs.org/docs/app/building-your-application/optimizing/scripts */}
      <Script
        strategy="afterInteractive"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${MAP_KEY}`}
        onReady={initializeMap}
      />
      {/* 지도가 출력될 div : 전체 화면 활용 */}
      <div id="map" style={{ width: '100%', height: '100%' }}></div>
    </>
  );
};

export default Map;
```

### 11. 위치 표시를 위한 json 파일

- public/info.json 으로 저장
  : 공공 API 에서 추출
  : 웹크롤링(html 을 분석해서 해당 내용을 추출)
  : 참고 - python 으로 진행하고 (requests, BeautifulSoup )
- 외부 API 연동
  : SWR 을 활용합니다.(fetch, axios, React-Query 관련)
  : https://swr.vercel.app/ko
- SWR 특징
  : stale-while-revalidate
  : 자동으로 재호출
  : 중복된 호출 방지
  : 로컬에서 데이터 비교
  : 화면 갱신없이 데이터를 재 호출해서 페이징, 무한스크롤등
  : Vercle 즉 Next.js 에서 생성 (js, ts 에 최적화)
  : 활용도 수월함 마치 React-Query 처럼

### 12. api 함수 만들기

- src/apis 폴더생성
- src/apis/api.ts 파일생성

```ts
import { Coordinates } from '@/types/info';

// info.json 파일 호출
export const getInfoList = async (): Promise<Coordinates[]> => {
  // Next.js 에는 내부적 fetch 작성되어있음.
  const res = await fetch('/info.json');
  if (res.status !== 200) {
    throw new Error('데이터를 가져오는데 실패했어요.');
  } else {
    return res.json();
  }
};
```

- src/app/page.tsx 호출
  : 호출 후 담겨질 데이터의 타입정의

- json 형식과 맞도록 타입 추가

```ts
// 위도를 표현하는 타입
type Lat = number;
// 경도를 표현하는 타입
type Lng = number;
// 위도와 경도를 묶어준 타입
export type Coordinates = [Lat, Lng];
// json 에서 온 데이터를 위한 타입정의
// json 에 있는 이름과 타입으로 명시를 함
export type Info = {
  coordinates: Coordinates;
  //   건강증진센터구분?: string;
  //   운영시작시각?: string;
};
```

- json 형식과 맞도록 api 리터도 변경

```ts
import { Coordinates, Info } from '@/types/info';

// info.json 파일 호출
export const getInfoList = async (): Promise<Info[]> => {
  // Next.js 에는 내부적 fetch 작성되어있음.
  const res = await fetch('/info.json');
  if (res.status !== 200) {
    throw new Error('데이터를 가져오는데 실패했어요.');
  } else {
    return res.json();
  }
};
```

- /src/app/page.tsx 에 최종 호출 및 타입 적용

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

export default function Home() {
  // 페이지 준비가 되면 데이터 호출
  useEffect(() => {
    // 마커를 위한 데이터 호출
    const fetchInfoList = async () => {
      try {
        const res: Info[] = await getInfoList();
        console.log(res);
        res.map(info => console.log(info.coordinates));
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
              alert('지도공유');
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

### 13. SWR 적용하기

- 설치하기
  `yarn add swr`
  : 데이터를 가져오고, 캐쉬하고 데이터 동기화 용도
- 커스텀 훅 만들기
  : /src/hooks/useInfo.ts

```ts
import { Info } from '@/types/info';
import { useCallback } from 'react';
import { mutate } from 'swr';

// SWR 여러개 중 구분 용도의 키명
export const CITY_KEY = '/infos';

// Hook 실행시 값 {함수, 값} 을 리턴
export const useInfo = () => {
  // 1. SWR 객체를 초기화한다.
  const initializeInfo = useCallback((infos: Info[]) => {
    // 2. SWR 값 중 CITY_KEY 를 이용해서 res 를 보관한다.
    mutate(CITY_KEY, infos);
  }, []);

  return { initializeInfo };
};
```

### 14. SWR 적용한 Hook 사용하기

- /src/app/page.tsx

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

export default function Home() {
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
              alert('지도공유');
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

### 15. 기본 Marker 출력하기

- src/hooks/useMap.ts

```ts
import { Coordinates } from '@/types/info';
import { NaverMap } from '@/types/map';
import { useCallback } from 'react';
import { mutate } from 'swr';

export const INITIAL_CENTER: Coordinates = [37.3595704, 127.105399];
export const INITIAL_ZOOM = 10;
export const INITIAL_MINZOOM = 9;
// 지도의 값을 보관하고 캐쉬할 SWR 객체 만들기
export const Map_KEY = '/map';
// 함수 실행후 {함수, 값} 리턴
export const useMap = () => {
  // 지도에 필요한 값 초기화 함수
  const initializeMap = useCallback((map?: NaverMap) => {
    if (map) {
      mutate(Map_KEY, map);
    }
  }, []);

  return { initializeMap };
};
```

- src/components/map/MapSection.tsx

```tsx
import React from 'react';
import Map from './Map';
import { useMap } from '@/hooks/useMap';
import { NaverMap } from '@/types/map';

const MapSection = () => {
  // 커스텀 훅으로 Naver Map 초기화시도
  const { initializeMap } = useMap();
  const onLoadMap = (map?: NaverMap) => {
    initializeMap(map);
  };
  return (
    <>
      <Map onLoad={onLoadMap} />
    </>
  );
};

export default MapSection;
```

### 16. Marker 컴포넌트

- /src/components/home 폴더생성
- /src/components/home/Marker.tsx 파일생성
- 마커를 위한 타입 추가

```ts
import { Coordinates } from './info';

// 네이버 지도 맵에 대한 타입
export type NaverMap = naver.maps.Map;
// 추가부분 : 네이버 마커를 위한 데이터 타입
export type Marker = {
  map: NaverMap;
  coordinates: Coordinates;
};
```

```tsx
'use client';
import { Marker } from '@/types/map';
import React, { useEffect } from 'react';

const Marker = ({ map, coordinates }: Marker) => {
  // 컴포넌트 배치시 기본 출력 처리
  useEffect(() => {
    // https://navermaps.github.io/maps.js.ncp/docs/tutorial-2-Marker.html
    let marker: naver.maps.Marker | null = null;
    if (map) {
      // 마커를 출력한다.
      marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(...coordinates),
        map: map,
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

### 17. Markers 컴포넌트

- /src/components/home/Markers.tsx 파일생성

```tsx
'use client';
import { CITY_KEY } from '@/hooks/useInfo';
import { Map_KEY } from '@/hooks/useMap';
import { Info } from '@/types/info';
import { NaverMap } from '@/types/map';
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

  return (
    <>
      {infos.map((item, index) => {
        return <Marker map={map} coordinates={item.coordinates} key={index} />;
      })}
    </>
  );
};

export default Markers;
```

### 18. 기본 Maker 출력

- src/components/map/MapSection.tsx

```tsx
import React from 'react';
import Map from './Map';
import { useMap } from '@/hooks/useMap';
import { NaverMap } from '@/types/map';
import Markers from '../home/Markers';

const MapSection = () => {
  // 커스텀 훅으로 Naver Map 초기화시도
  const { initializeMap } = useMap();
  const onLoadMap = (map?: NaverMap) => {
    initializeMap(map);
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

### 19. 마커 아이콘 변경하기

- https://navermaps.github.io/maps.js.ncp/docs/tutorial-2-Marker.html
- /src/types/map.ts
  : 아이콘에 관련 타입 정의

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
};
```

- src/components/map/MapSection.tsx

```tsx
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
    scaledSize: new naver.maps.Size(64, 64),
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
```

- /src/components/map/Marker.tsx

```tsx
'use client';
import { Marker } from '@/types/map';
import React, { useEffect } from 'react';

const Marker = ({ map, coordinates, icon }: Marker) => {
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

### 20. 오픈 API 키 숨기기

- / 에 파일자체가 .env 생성

```env
NEXT_PUBLIC_NCP_CLIENT_ID=
```

- .gitignore 파일에 내용추가
- src/components/map/Map.tsx

```tsx
// 환경변수 사용 (vercel 에 배포시 반드시 기재)
const MAP_KEY = process.env.NEXT_PUBLIC_NCP_CLIENT_ID;
```
