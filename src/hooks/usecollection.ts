// collectin 에 데이터들을 가져와서 출력
import { useState, useEffect } from 'react';
import { appFireStore } from '../fb/fbconfig';
import {
  onSnapshot,
  collection,
  FirestoreError,
  QuerySnapshot,
  query,
  Query,
  orderBy,
} from 'firebase/firestore';

// FB 문서들을 모아 놓은 배열의 인터페이스
interface Document {
  id: string;
  [key: string]: any;
}

// useCollection("feedback")
// useCollection("user")
export const useColletion = (transaction: string) => {
  // collectin 의 내용을 state 에 보관
  const [documents, setDocuments] = useState<Document[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // collection 이 변경된 경우 실행하도록 설정
  useEffect(() => {
    // FB 쿼리 만들기
    // 추후 필요시 쿼리인덱스 생성도 필요.
    // 아래는 등록된 글 중 최신 목록 순서로 정렬 후 출력
    // query(컬렉션참조, 원하는 명령어 쿼리)
    // orderBy(기준이되는 필드, 오름차순/내림차순 )
    const q: Query = query(
      collection(appFireStore, transaction),
      orderBy('createdTime', 'desc'),
    );

    // 참조 = collection(FB프로젝트, collection 폴더명 )
    const unsubscribe = onSnapshot(
      // 실시간으로 목록을 불러온다.
      // collection(appFireStore, transaction),
      q,

      (snapshot: QuerySnapshot) => {
        let result: Document[] = [];
        // console.log(snapshot);
        // console.log(snapshot.docs);
        snapshot.docs.forEach(doc => {
          // doc.data() 는 FB API 입니다. 내용을 리턴한다.
          // console.log(doc.data());
          result.push({ ...doc.data(), id: doc.id });
        });
        // 전체 FB 문서를 보관합니다.
        setDocuments(result);
        setError(null);
      },
      error => {
        setError(error.message);
      },
    );
    // 클린업 함수
    return unsubscribe;
  }, [transaction]);

  return { documents, error };
};
