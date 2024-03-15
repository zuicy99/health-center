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
