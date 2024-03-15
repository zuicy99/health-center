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
