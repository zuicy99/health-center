// FB Collection 관리 : 폴더이름
// Collection 을 미리 안만들어도 됨.
// FB 연동시 성공/실패 관리
import { appFireStore } from '@/fb/fbconfig';
import { collection } from 'firebase/firestore';
import { useReducer } from 'react';
// 리듀서에 보관한 초기값
const initState = {
  // 저장할 문서
  document: null,
  // 네트웍에 연결시도
  isPending: false,
  // 네트웍에 에러발생
  error: null,
  // 결과의 성공/회신 유무
  success: false,
};

// 리듀서함수는 리듀서에 보관한 state 를 변경하는 함수
// 매개변수가 2개입니다.
// 리듀서 함수는 switch 구문 사용합니다.
// state 보관용 자료
// action 은 state 에 담을 내용(데이터)
// action 은 type 속성과, payload 속성이 있습니다.
const storeReducer = (state, action) => {
  switch (action.type) {
    case 'isPending':
      // 네트워크로 FB 에 연결중이면...
      return { isPending: true, document: null, success: false, error: null };
    case 'addDoc':
      // 새로은 글을 등록한다면...
      return {
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case 'error':
      // 오류가 발생하였다면
      return {
        isPending: false,
        document: null,
        success: false,
        error: action.payload,
      };
    default:
      // 최소 아마 작업을 하지 않더라도 리듀서 함수는 state 즉, 원본이라도 리턴해야해요.
      return state;
  }
};

// 매개변수 transaction 은 Collectin (자료를 보관할 폴더라고 생각)
// 사용예: useFirebase("feeback")
// 사용예: useFirebase("freeboard")
export const useFirebase = transaction => {
  // useReducer 는 dispathc 함수를 실행후 결과값 변경 및 보관
  //   const [rerponse, dispatch] = useReducer(리듀서함수, 초기값);
  const [rerponse, dispatch] = useReducer(storeReducer, initState);

  // FB 에 Collection 만들라고 요청
  // colRef 는 FB 가 만들어준 Collection 의 참조 변수
  // collection(저장소참조, collectin 이름 - 폴더이름)
  const colRef = collection(appFireStore, transaction);

  // collection 없으면 자동으로 생성
  // Document (문서파일) 를 저장한다.
  const addDocument = () => {
    dispatch({ type: 'isPending' });
    // FB 의 API 문서 중에 문서 추가 기능을 입력
    // await addDoc(collection(db, "cities"), {
    //     name: "Tokyo",
    //     country: "Japan"
    //   });
  };

  // Document (문서파일) 를 삭제한다.
  const deleteDocument = () => {};

  return { rerponse, addDocument, deleteDocument };
};
