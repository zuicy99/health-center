# Firebase 연동

- FB 계정에 프로젝트 생성
- https://firebase.google.com/?hl=ko
- console 화면으로 이동
- 프로젝트 추가
  : health-center
  : GA 설정 하지 않는다.
- 완료 후 설정 확인하기
  : 프로젝트 개요 > 프로젝트 설정 > 웹 앱 선택 > 웹 앱에 Firebase 추가
  : '보건소 위치 서비스' > 앱 등록

## 1. Firebase 데이터베이스 사용 신청

: Firestore Database 항목 선택
: Cloud Firestore 서비스 신청
: asia-northeast3 (Seoul)
: 테스트 모드에서 시작
: 완료

## 2. Firebase Config 파일 만들기

- 설정 정보 확인하기
  : 프로젝트 개요 > 프로젝트 설정
  : SDK 설정 및 구성 정보 확인
- FB npm/yarn 설치
  : npm install firebase
  : yarn add firebase
  : package.json 확인

- 설정 정보 보관하기
  : .env 파일이 변경되면 다시 서버를 실행해야 적용이 됩니다.
  : .env 파일에서 보관

```txt
NEXT_PUBLIC_NCP_CLIENT_ID=
NEXT_PUBLIC_API_KEY=
NEXT_PUBLIC_AUTH_DOMAIN=
NEXT_PUBLIC_PROJECT_ID=
NEXT_PUBLIC_STORAGE_BUCKET=
NEXT_PUBLIC_MESSAGING_SENDER_ID=
NEXT_PUBLIC_APP_ID=
```

## 3. Firebase Config 코드 하기

- /src/fb 폴더 생성
- /src/fb/fbconfig.ts 파일생성
- FB 사이트에서 샘플 코드 복사

```ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};
// 초기화
const app = initializeApp(firebaseConfig);
// FB 데이터 베이스 사용을 위한 변수저장
const appFireStore = getFirestore(app);
// 외부에서 활용
export { app, appFireStore };
```

## 4. Firebase Hook 만들기

- API : https://firebase.google.com/docs/firestore/manage-data/add-data?hl=ko
- 코드 재활용을 위해서 만듦
- /src/hooks/useFirebase.ts
  : FB Collection 관리 : 폴더이름
  : Collection 을 미리 안만들어도 됨.
  : FB 연동시 성공/실패 관리
  : js 파일

  ```js
  // FB Collection 관리 : 폴더이름
  // Collection 을 미리 안만들어도 됨.
  // FB 연동시 성공/실패 관리
  import { appFireStore, timeStamp } from '@/fb/fbconfig';
  import { addDoc, collection } from 'firebase/firestore';
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
    // const [rerponse, dispatch] = useReducer(리듀서함수, 초기값);
    const [rerponse, dispatch] = useReducer(storeReducer, initState);

    // FB 에 Collection 만들라고 요청
    // colRef 는 FB 가 만들어준 Collection 의 참조 변수
    // collection(저장소참조, collectin 이름 - 폴더이름)
    const colRef = collection(appFireStore, transaction);

    // collection 없으면 자동으로 생성
    // Document (문서파일) 를 저장한다.
    const addDocument = async doc => {
      dispatch({ type: 'isPending' });
      try {
        // 문서저장시 timeStamp 를 추가한다.
        const createdTime = timeStamp.fromDate(new Date());
        // FB 의 API 문서 중에 문서 추가 기능을 입력
        const docRef = await addDoc(colRef, { ...doc, createdTime });
        console.log(docRef);
        // const action = { type: 'addDoc', payload: docRef }
        dispatch({ type: 'addDoc', payload: docRef });
      } catch (error) {
        dispatch({ type: 'error', payload: error.message });
      }
    };

    // Document (문서파일) 를 삭제한다.
    const deleteDocument = () => {};

    return { rerponse, addDocument, deleteDocument };
  };
  ```

  : ts 로 변환

  ```ts
  // FB Collection 관리 : 폴더이름
  // Collection 을 미리 안만들어도 됨.
  // FB 연동시 성공/실패 관리
  import { appFireStore, timeStamp } from '@/fb/fbconfig';
  import {
    addDoc,
    collection,
    DocumentReference,
    FirestoreError,
  } from 'firebase/firestore';
  import { useReducer, Reducer } from 'react';

  // 상태 interface 만들기
  interface State {
    document: DocumentReference | null;
    isPending: boolean | false;
    error: string | null;
    success: boolean;
  }
  // 액션 type 만들기
  type Action =
    | { type: 'isPending' }
    | { type: 'addDoc'; payload: DocumentReference }
    | { type: 'error'; payload: string };

  // State 인터페이스 활용하기
  const initState: State = {
    document: null,
    isPending: false,
    error: null,
    success: false,
  };

  const storeReducer: Reducer<State, Action> = (state, action) => {
    switch (action.type) {
      case 'isPending':
        return {
          ...state,
          isPending: true,
          document: null,
          success: false,
          error: null,
        };
      case 'addDoc':
        return {
          ...state,
          isPending: false,
          document: action.payload,
          success: true,
          error: null,
        };
      case 'error':
        return {
          ...state,
          isPending: false,
          document: null,
          success: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };

  // transaction 은 collection 이름이다.
  export const useFirebase = (transaction: string) => {
    const [rerponse, dispatch] = useReducer(storeReducer, initState);
    const colRef = collection(appFireStore, transaction);
    // 내용 등록 함수
    const addDocument = async (doc: any) => {
      dispatch({ type: 'isPending' });
      try {
        const createdTime = timeStamp.fromDate(new Date());

        const docRef = await addDoc(colRef, { ...doc, createdTime });
        console.log(docRef);
        dispatch({ type: 'addDoc', payload: docRef });
      } catch (error) {
        dispatch({ type: 'error', payload: (error as FirestoreError).message });
      }
    };

    // Document (문서파일) 를 삭제한다.
    const deleteDocument = (id: string) => {};

    return { rerponse, addDocument, deleteDocument };
  };
  ```

- FB 에 등록하기 테스트
  : /src/app/feedback/pages.tsx

```tsx
'use client';
import { useState, useEffect } from 'react';
import HeaderComponent from '@/components/common/HeaderComponent';
import { useFirebase } from '@/hooks/useFirebase';
import styles from '@/styles/header.module.scss';
import Link from 'next/link';
import { PiSealCheck } from 'react-icons/pi';
import { SlLayers } from 'react-icons/sl';
const Feedback = (): JSX.Element => {
  // FB Hook 가져오기
  // feedback Collection 만들기
  const { rerponse, addDocument } = useFirebase('feedback');
  // 등록하기 기능
  type FeedBack = {
    id: number;
    message: string;
    email: string;
    nickName: string;
  };

  const [message, setMessage] = useState<string>('');
  const [nickName, setNickName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const addFeedback = () => {
    const feedback: FeedBack = {
      id: Date.now(),
      message: message,
      nickName: nickName,
      email: email,
    };

    addDocument(feedback);
  };

  // Reduce 의 State 를 참조해서 결과를 처리한다.
  useEffect(() => {
    if (rerponse.success) {
      setMessage('');
      setEmail('');
      setNickName('');
    }
  }, [rerponse.success]);

  return (
    <>
      <HeaderComponent
        rightElements={[
          <Link key="feedback" href="/feedback" className={styles.box}>
            <PiSealCheck />
          </Link>,
          <Link key="about" href="/about" className={styles.box}>
            <SlLayers />
          </Link>,
        ]}
      />
      <main>
        <section className="text-gray-600 body-font">
          <div className="container px-5 py-24 mx-auto">
            <div className="text-center mb-20">
              <h1 className="sm:text-3xl text-2xl font-medium text-center title-font text-gray-900 mb-4">
                대한 민국 보건소 위치 지도 서비스 피드백
              </h1>
              <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto">
                본 서비스에 대한 피드백을 남겨주세요.
              </p>
            </div>

            <section className="text-gray-600 body-font overflow-hidden">
              <div className="container px-5 mx-auto">
                <div className="py-8 flex flex-wrap md:flex-nowrap">
                  <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                    <span className="font-semibold title-font text-gray-700">
                      Feedback Input
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <section className="text-gray-600 body-font relative">
                      <div className="container px-5 mx-auto">
                        <div className="lg:w-1/2 md:w-2/3 mx-auto">
                          <div className="flex flex-wrap -m-2">
                            <div className="p-2 w-1/2">
                              <div className="relative">
                                <label
                                  htmlFor="nickname"
                                  className="leading-7 text-sm text-gray-600"
                                >
                                  NickName
                                </label>
                                <input
                                  type="text"
                                  id="nickname"
                                  name="nickname"
                                  value={nickName}
                                  onChange={e => {
                                    setNickName(e.target.value);
                                  }}
                                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                />
                              </div>
                            </div>
                            <div className="p-2 w-1/2">
                              <div className="relative">
                                <label
                                  htmlFor="email"
                                  className="leading-7 text-sm text-gray-600"
                                >
                                  Email
                                </label>
                                <input
                                  type="email"
                                  id="email"
                                  name="email"
                                  value={email}
                                  onChange={e => {
                                    setEmail(e.target.value);
                                  }}
                                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                />
                              </div>
                            </div>
                            <div className="p-2 w-full">
                              <div className="relative">
                                <label
                                  htmlFor="message"
                                  className="leading-7 text-sm text-gray-600"
                                >
                                  Message
                                </label>
                                <textarea
                                  id="message"
                                  name="message"
                                  value={message}
                                  onChange={e => {
                                    setMessage(e.target.value);
                                  }}
                                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                                ></textarea>
                              </div>
                            </div>
                            <div className="p-2 w-full">
                              <button
                                onClick={() => {
                                  // fb 등록 테스트
                                  addFeedback();
                                }}
                                className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </section>
            <section className="text-gray-600 body-font overflow-hidden">
              <div className="container px-5 py-24 mx-auto">
                <div className="-my-8 divide-y-2 divide-gray-100">
                  <div className="py-8 flex flex-wrap md:flex-nowrap">
                    <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                      <span className="font-semibold title-font text-gray-700">
                        CATEGORY
                      </span>
                      <span className="mt-1 text-gray-500 text-sm">
                        12 Jun 2019
                      </span>
                    </div>
                    <div className="md:flex-grow">
                      <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
                        Bitters hashtag waistcoat fashion axe chia unicorn
                      </h2>
                      <p className="leading-relaxed">
                        Glossier echo park pug, church-key sartorial biodiesel
                        vexillologist pop-up snackwave ramps cornhole. Marfa 3
                        wolf moon party messenger bag selfies, poke vaporware
                        kombucha lumbersexual pork belly polaroid hoodie
                        portland craft beer.
                      </p>
                      <a className="text-indigo-500 inline-flex items-center mt-4">
                        Delete
                      </a>
                    </div>
                  </div>
                  <div className="py-8 flex flex-wrap md:flex-nowrap">
                    <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                      <span className="font-semibold title-font text-gray-700">
                        CATEGORY
                      </span>
                      <span className="mt-1 text-gray-500 text-sm">
                        12 Jun 2019
                      </span>
                    </div>
                    <div className="md:flex-grow">
                      <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
                        Meditation bushwick direct trade taxidermy shaman
                      </h2>
                      <p className="leading-relaxed">
                        Glossier echo park pug, church-key sartorial biodiesel
                        vexillologist pop-up snackwave ramps cornhole. Marfa 3
                        wolf moon party messenger bag selfies, poke vaporware
                        kombucha lumbersexual pork belly polaroid hoodie
                        portland craft beer.
                      </p>
                      <a className="text-indigo-500 inline-flex items-center mt-4">
                        Delete
                      </a>
                    </div>
                  </div>
                  <div className="py-8 flex flex-wrap md:flex-nowrap">
                    <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                      <span className="font-semibold title-font text-gray-700">
                        CATEGORY
                      </span>
                      <span className="text-sm text-gray-500">12 Jun 2019</span>
                    </div>
                    <div className="md:flex-grow">
                      <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
                        Woke master cleanse drinking vinegar salvia
                      </h2>
                      <p className="leading-relaxed">
                        Glossier echo park pug, church-key sartorial biodiesel
                        vexillologist pop-up snackwave ramps cornhole. Marfa 3
                        wolf moon party messenger bag selfies, poke vaporware
                        kombucha lumbersexual pork belly polaroid hoodie
                        portland craft beer.
                      </p>
                      <a className="text-indigo-500 inline-flex items-center mt-4">
                        Delete
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
    </>
  );
};

export default Feedback;
```

- FB 에 내용 불러오기
  : /src/hooks/useCollection.js
  : https://firebase.google.com/docs/firestore/query-data/listen?hl=ko

```js
// collectin 에 데이터들을 가져와서 출력
import { useState, useEffect } from 'react';
import { appFireStore } from '../fb/fbconfig';
import { onSnapshot } from 'firebase/firestore';
// useCollection("feedback")
// useCollection("user")
export const useColletion = transaction => {
  // collectin 의 내용을 state 에 보관
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  // collection 이 변경된 경우 실행하도록 설정
  useEffect(() => {
    // 참조 = collection(FB프로젝트, collection 폴더명 )
    const unsubscribe = onSnapshot(
      collection(appFireStore, transaction),
      snapshot => {
        let result = [];
        console.log(snapshot);
        console.log(snapshot.docs);
        snapshot.docs.forEach(doc => {
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
```

: /src/hooks/useCollection.ts

```ts
// collectin 에 데이터들을 가져와서 출력
import { useState, useEffect } from 'react';
import { appFireStore } from '../fb/fbconfig';
import {
  onSnapshot,
  collection,
  FirestoreError,
  QuerySnapshot,
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
    // 참조 = collection(FB프로젝트, collection 폴더명 )
    const unsubscribe = onSnapshot(
      collection(appFireStore, transaction),
      (snapshot: QuerySnapshot) => {
        let result: Document[] = [];
        console.log(snapshot);
        console.log(snapshot.docs);
        snapshot.docs.forEach(doc => {
          // doc.data() 는 FB API 입니다. 내용을 리턴한다.
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
```

- FeedBack 페이지에 내용 출력하가
  : /src/app/feedback/page.tsx

```tsx
'use client';
import { useState, useEffect } from 'react';
import HeaderComponent from '@/components/common/HeaderComponent';
import { useFirebase } from '@/hooks/useFirebase';
import styles from '@/styles/header.module.scss';
import Link from 'next/link';
import { PiSealCheck } from 'react-icons/pi';
import { SlLayers } from 'react-icons/sl';
import { useColletion } from '@/hooks/useCollection';
import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';

// 등록하기 기능
type FeedBack = {
  id: number;
  message: string;
  email: string;
  nickName: string;
};

const Feedback = (): JSX.Element => {
  // FB Hook 가져오기
  const { documents, error } = useColletion('feedback');
  // feedback Collection 만들기
  const { rerponse, addDocument } = useFirebase('feedback');
  // 입력창 관련 state
  const [message, setMessage] = useState<string>('');
  const [nickName, setNickName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  // 피드백 목록 관련 state
  const [feedbackList, setFeedBackList] = useState<FeedBack[]>([]);

  // 목록 내용 등록
  const addFeedback = () => {
    const feedback: FeedBack = {
      id: Date.now(),
      message: message,
      nickName: nickName,
      email: email,
    };
    addDocument(feedback);

    // 실시간 등록된 목록 업데이트 하기
    // onSnapShot
    setFeedBackList([...feedbackList, feedback]);
  };

  // Reduce 의 State 를 참조해서 결과를 처리한다.
  useEffect(() => {
    if (rerponse.success) {
      setMessage('');
      setEmail('');
      setNickName('');
    }
  }, [rerponse.success]);

  return (
    <>
      <HeaderComponent
        rightElements={[
          <Link key="feedback" href="/feedback" className={styles.box}>
            <PiSealCheck />
          </Link>,
          <Link key="about" href="/about" className={styles.box}>
            <SlLayers />
          </Link>,
        ]}
      />
      <main>
        <section className="text-gray-600 body-font">
          <div className="container px-5 py-24 mx-auto">
            <div className="text-center mb-20">
              <h1 className="sm:text-3xl text-2xl font-medium text-center title-font text-gray-900 mb-4">
                대한 민국 보건소 위치 지도 서비스 피드백
              </h1>
              <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto">
                본 서비스에 대한 피드백을 남겨주세요.
              </p>
            </div>

            {/* <div>
              <h1>실시간 데이터 보기</h1>
              {documents && <strong>OKOK</strong>}
              {documents?.map(item => {
                return (
                  <div key={item.id}>
                    <strong>{item.id}</strong>
                    <strong>{item.message}</strong>
                    <strong>{item.nickName}</strong>
                    <strong>{item.email}</strong>
                  </div>
                );
              })}
            </div> */}

            <section className="text-gray-600 body-font overflow-hidden">
              <div className="container px-5 mx-auto">
                <div className="py-8 flex flex-wrap md:flex-nowrap">
                  <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                    <span className="font-semibold title-font text-gray-700">
                      Feedback Input
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <section className="text-gray-600 body-font relative">
                      <div className="container px-5 mx-auto">
                        <div className="lg:w-1/2 md:w-2/3 mx-auto">
                          <div className="flex flex-wrap -m-2">
                            <div className="p-2 w-1/2">
                              <div className="relative">
                                <label
                                  htmlFor="nickname"
                                  className="leading-7 text-sm text-gray-600"
                                >
                                  NickName
                                </label>
                                <input
                                  type="text"
                                  id="nickname"
                                  name="nickname"
                                  value={nickName}
                                  onChange={e => {
                                    setNickName(e.target.value);
                                  }}
                                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                />
                              </div>
                            </div>
                            <div className="p-2 w-1/2">
                              <div className="relative">
                                <label
                                  htmlFor="email"
                                  className="leading-7 text-sm text-gray-600"
                                >
                                  Email
                                </label>
                                <input
                                  type="email"
                                  id="email"
                                  name="email"
                                  value={email}
                                  onChange={e => {
                                    setEmail(e.target.value);
                                  }}
                                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                />
                              </div>
                            </div>
                            <div className="p-2 w-full">
                              <div className="relative">
                                <label
                                  htmlFor="message"
                                  className="leading-7 text-sm text-gray-600"
                                >
                                  Message
                                </label>
                                <textarea
                                  id="message"
                                  name="message"
                                  value={message}
                                  onChange={e => {
                                    setMessage(e.target.value);
                                  }}
                                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                                ></textarea>
                              </div>
                            </div>
                            <div className="p-2 w-full">
                              <button
                                onClick={() => {
                                  // fb 등록 테스트
                                  addFeedback();
                                }}
                                className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </section>
            <section className="text-gray-600 body-font overflow-hidden">
              <div className="container px-5 py-24 mx-auto">
                <div className="-my-8 divide-y-2 divide-gray-100">
                  {/* =============== 등록된 목록 출력 영역 */}
                  {documents?.map(item => {
                    const date = item.createdTime.toDate(); // 가정: createdTime이 Firebase Timestamp 객체
                    const dateString = date.toDateString(); // 또는 다른 포매팅 방법 사용
                    return (
                      <div
                        key={item.id}
                        className="py-8 flex flex-wrap md:flex-nowrap"
                      >
                        <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                          <span className="font-semibold title-font text-gray-700">
                            CATEGORY ({item.email})
                          </span>
                          <span className="mt-1 text-gray-500 text-sm">
                            {dateString}
                          </span>
                        </div>
                        <div className="md:flex-grow">
                          <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
                            {item.nickName}
                          </h2>
                          <p className="leading-relaxed">{item.message}</p>
                          <a className="text-indigo-500 inline-flex items-center mt-4">
                            Delete
                          </a>
                        </div>
                      </div>
                    );
                  })}

                  {/* ============= 등록된 목록 출력 영역 */}
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
    </>
  );
};

export default Feedback;
```

- FB 쿼리
  : DB 명령어 처럼 조회, 정렬, 검색 등..
  : 최신 등록순으로 정렬
  : /src/hooks/useCollection.ts

```ts
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
```

- FB 삭제
  : /src/hooks/useFirebase.ts

```ts
// FB Collection 관리 : 폴더이름
// Collection 을 미리 안만들어도 됨.
// FB 연동시 성공/실패 관리
import { appFireStore, timeStamp } from '@/fb/fbconfig';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  FirestoreError,
} from 'firebase/firestore';
import { useReducer, Reducer } from 'react';

// 상태 interface 만들기
interface State {
  document: DocumentReference | null;
  isPending: boolean | false;
  error: string | null;
  success: boolean;
}
// 액션 type 만들기
type Action =
  | { type: 'isPending' }
  | { type: 'addDoc'; payload: DocumentReference }
  | { type: 'error'; payload: string }
  | { type: 'deleteDoc' };

// State 인터페이스 활용하기
const initState: State = {
  document: null,
  isPending: false,
  error: null,
  success: false,
};

const storeReducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'isPending':
      return {
        ...state,
        isPending: true,
        document: null,
        success: false,
        error: null,
      };
    case 'addDoc':
      return {
        ...state,
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case 'error':
      return {
        ...state,
        isPending: false,
        document: null,
        success: false,
        error: action.payload,
      };
    case 'deleteDoc':
      return {
        ...state,
        isPending: false,
        document: null,
        success: true,
        error: null,
      };
    default:
      return state;
  }
};

// transaction 은 collection 이름이다.
export const useFirebase = (transaction: string) => {
  const [rerponse, dispatch] = useReducer(storeReducer, initState);
  const colRef = collection(appFireStore, transaction);
  // 내용 등록 함수
  const addDocument = async (doc: any) => {
    // console.log('문서추가 : ', doc);
    dispatch({ type: 'isPending' });
    try {
      const createdTime = timeStamp.fromDate(new Date());
      const docRef = await addDoc(colRef, { ...doc, createdTime });
      // console.log(docRef);
      dispatch({ type: 'addDoc', payload: docRef });
    } catch (error) {
      dispatch({ type: 'error', payload: (error as FirestoreError).message });
    }
  };

  // Document (문서파일) 를 삭제한다.
  const deleteDocument = async (id: string) => {
    dispatch({ type: 'isPending' });
    try {
      // 어떤 FB Document 인가를 알려주는 메서드
      // FB 에서 아이디를 보내면 찾아주는 메서드 doc()
      const docRef = await deleteDoc(doc(colRef, id));
      dispatch({ type: 'deleteDoc' });
    } catch (error) {
      dispatch({ type: 'error', payload: (error as FirestoreError).message });
    }
  };

  return { rerponse, addDocument, deleteDocument };
};
```

: /src/app/feedback/page.tsx

```tsx
'use client';
import { useState, useEffect } from 'react';
import HeaderComponent from '@/components/common/HeaderComponent';
import { useFirebase } from '@/hooks/useFirebase';
import styles from '@/styles/header.module.scss';
import Link from 'next/link';
import { PiSealCheck } from 'react-icons/pi';
import { SlLayers } from 'react-icons/sl';
import { useColletion } from '@/hooks/useCollection';
import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';

// 등록하기 기능
type FeedBack = {
  id: number;
  message: string;
  email: string;
  nickName: string;
};

const Feedback = (): JSX.Element => {
  // FB Hook 가져오기
  const { documents, error } = useColletion('feedback');
  // feedback Collection 만들기
  const { rerponse, addDocument, deleteDocument } = useFirebase('feedback');
  // 입력창 관련 state
  const [message, setMessage] = useState<string>('');
  const [nickName, setNickName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  // 피드백 목록 관련 state
  const [feedbackList, setFeedBackList] = useState<FeedBack[]>([]);

  // 목록 내용 등록
  const addFeedback = () => {
    const feedback: FeedBack = {
      id: Date.now(),
      message: message,
      nickName: nickName,
      email: email,
    };
    addDocument(feedback);

    // 실시간 등록된 목록 업데이트 하기
    // onSnapShot
    setFeedBackList([...feedbackList, feedback]);
  };

  // 문서 삭제하기
  const deleteFeedback = (_id: string) => {
    deleteDocument(_id);
  };

  // Reduce 의 State 를 참조해서 결과를 처리한다.
  useEffect(() => {
    if (rerponse.success) {
      setMessage('');
      setEmail('');
      setNickName('');
    }
  }, [rerponse.success]);

  return (
    <>
      <HeaderComponent
        rightElements={[
          <Link key="feedback" href="/feedback" className={styles.box}>
            <PiSealCheck />
          </Link>,
          <Link key="about" href="/about" className={styles.box}>
            <SlLayers />
          </Link>,
        ]}
      />
      <main>
        <section className="text-gray-600 body-font">
          <div className="container px-5 py-24 mx-auto">
            <div className="text-center mb-20">
              <h1 className="sm:text-3xl text-2xl font-medium text-center title-font text-gray-900 mb-4">
                대한 민국 보건소 위치 지도 서비스 피드백
              </h1>
              <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto">
                본 서비스에 대한 피드백을 남겨주세요.
              </p>
            </div>

            {/* <div>
              <h1>실시간 데이터 보기</h1>
              {documents && <strong>OKOK</strong>}
              {documents?.map(item => {
                return (
                  <div key={item.id}>
                    <strong>{item.id}</strong>
                    <strong>{item.message}</strong>
                    <strong>{item.nickName}</strong>
                    <strong>{item.email}</strong>
                  </div>
                );
              })}
            </div> */}

            <section className="text-gray-600 body-font overflow-hidden">
              <div className="container px-5 mx-auto">
                <div className="py-8 flex flex-wrap md:flex-nowrap">
                  <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                    <span className="font-semibold title-font text-gray-700">
                      Feedback Input
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <section className="text-gray-600 body-font relative">
                      <div className="container px-5 mx-auto">
                        <div className="lg:w-1/2 md:w-2/3 mx-auto">
                          <div className="flex flex-wrap -m-2">
                            <div className="p-2 w-1/2">
                              <div className="relative">
                                <label
                                  htmlFor="nickname"
                                  className="leading-7 text-sm text-gray-600"
                                >
                                  NickName
                                </label>
                                <input
                                  type="text"
                                  id="nickname"
                                  name="nickname"
                                  value={nickName}
                                  onChange={e => {
                                    setNickName(e.target.value);
                                  }}
                                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                />
                              </div>
                            </div>
                            <div className="p-2 w-1/2">
                              <div className="relative">
                                <label
                                  htmlFor="email"
                                  className="leading-7 text-sm text-gray-600"
                                >
                                  Email
                                </label>
                                <input
                                  type="email"
                                  id="email"
                                  name="email"
                                  value={email}
                                  onChange={e => {
                                    setEmail(e.target.value);
                                  }}
                                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                />
                              </div>
                            </div>
                            <div className="p-2 w-full">
                              <div className="relative">
                                <label
                                  htmlFor="message"
                                  className="leading-7 text-sm text-gray-600"
                                >
                                  Message
                                </label>
                                <textarea
                                  id="message"
                                  name="message"
                                  value={message}
                                  onChange={e => {
                                    setMessage(e.target.value);
                                  }}
                                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                                ></textarea>
                              </div>
                            </div>
                            <div className="p-2 w-full">
                              <button
                                onClick={() => {
                                  // fb 등록 테스트
                                  addFeedback();
                                }}
                                className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </section>
            <section className="text-gray-600 body-font overflow-hidden">
              <div className="container px-5 py-24 mx-auto">
                <div className="-my-8 divide-y-2 divide-gray-100">
                  {/* =============== 등록된 목록 출력 영역 */}
                  {documents?.map(item => {
                    const date = item.createdTime.toDate(); // 가정: createdTime이 Firebase Timestamp 객체
                    const dateString = date.toDateString(); // 또는 다른 포매팅 방법 사용
                    return (
                      <div
                        key={item.id}
                        className="py-8 flex flex-wrap md:flex-nowrap"
                      >
                        <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                          <span className="font-semibold title-font text-gray-700">
                            CATEGORY ({item.email})
                          </span>
                          <span className="mt-1 text-gray-500 text-sm">
                            {dateString}
                          </span>
                        </div>
                        <div className="md:flex-grow">
                          <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
                            {item.nickName}
                          </h2>
                          <p className="leading-relaxed">{item.message}</p>
                          <button
                            onClick={() => {
                              deleteFeedback(item.id);
                            }}
                            className="text-indigo-500 inline-flex items-center mt-4"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* ============= 등록된 목록 출력 영역 */}
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
    </>
  );
};

export default Feedback;
```

- FB 수정 (1단계 - UI 작업)
  : /src/app/feedback/page.tsx

```tsx
<div className="md:flex-grow">
  {/* <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
                            {item.nickName}
                          </h2> */}
  {/* 수정 또는 읽기 상태 */}
  <div className="flex justify-between items-center">
    <textarea
      id="message"
      name="message"
      value={message}
      onChange={e => {
        // setMessage(e.target.value);
      }}
      className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
    ></textarea>
    <button
      onClick={() => {
        // deleteFeedback(item.id);
      }}
      className="ml-4 text-indigo-500 inline-flex items-center mt-4"
    >
      Save
    </button>
    <button
      onClick={() => {
        // deleteFeedback(item.id);
      }}
      className="ml-4 text-indigo-500 inline-flex items-center mt-4"
    >
      Cancel
    </button>
  </div>

  <div className="flex justify-between items-center">
    <p className="leading-relaxed">{item.message}</p>
    <button
      onClick={() => {
        // deleteFeedback(item.id);
      }}
      className="text-indigo-500 inline-flex items-center mt-4"
    >
      Edit
    </button>
  </div>

  <button
    onClick={() => {
      deleteFeedback(item.id);
    }}
    className="text-indigo-500 inline-flex items-center mt-4"
  >
    Delete
  </button>
</div>
```

- FB 수정 (2단계 - 상태정보를 추가 후 UI 변경 )

```tsx
// 등록하기 기능
type FeedBack = {
  id: number;
  message: string;
  email: string;
  nickName: string;
};
// 기본 FeedBack 데이터 활용 및 edit 추가
type FeeBackWidthEdit = {
  edit: boolean; // 편집/읽기
  [key: string]: any;
};
...
 // 피드백 목록 관련 state
  const [feedbackList, setFeedBackList] = useState<FeeBackWidthEdit[]>([]);
...

  // 수정 모드를 위한 처리
  // 편집 변경 목록 업데이트
  useEffect(() => {
    const list: FeeBackWidthEdit[] = [];
    documents?.forEach(item => {
      // 추가적인 속성을 추가(edit)
      const tempFeedback: FeeBackWidthEdit = { ...item, edit: false };
      list.push(tempFeedback);
    });
    setFeedBackList(list);
  }, [documents]);
```

- FB 수정 (3단계 - feedbackList 로 변경 )

```tsx
'use client';
import { useState, useEffect } from 'react';
import HeaderComponent from '@/components/common/HeaderComponent';
import { useFirebase } from '@/hooks/useFirebase';
import styles from '@/styles/header.module.scss';
import Link from 'next/link';
import { PiSealCheck } from 'react-icons/pi';
import { SlLayers } from 'react-icons/sl';
import { useColletion } from '@/hooks/useCollection';
import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';

// 등록하기 기능
type FeedBack = {
  id: number;
  message: string;
  email: string;
  nickName: string;
};
// 기본 FeedBack 데이터 활용 및 edit 추가
type FeeBackWidthEdit = {
  edit: boolean; // 편집/읽기
  [key: string]: any;
};

const Feedback = (): JSX.Element => {
  // FB Hook 가져오기
  const { documents, error } = useColletion('feedback');
  // feedback Collection 만들기
  const { rerponse, addDocument, deleteDocument } = useFirebase('feedback');
  // 입력창 관련 state
  const [message, setMessage] = useState<string>('');
  const [nickName, setNickName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  // 피드백 목록 관련 state
  const [feedbackList, setFeedBackList] = useState<FeeBackWidthEdit[]>([]);

  // 목록 내용 등록
  const addFeedback = () => {
    const feedback: FeedBack = {
      id: Date.now(),
      message: message,
      nickName: nickName,
      email: email,
    };
    addDocument(feedback);

    // 실시간 등록된 목록 업데이트 하기
    // onSnapShot
    // setFeedBackList([...feedbackList, feedback]);
  };

  // 문서 삭제하기
  const deleteFeedback = (_id: string) => {
    deleteDocument(_id);
  };

  // Reduce 의 State 를 참조해서 결과를 처리한다.
  useEffect(() => {
    if (rerponse.success) {
      setMessage('');
      setEmail('');
      setNickName('');
    }
  }, [rerponse.success]);

  // 수정 모드를 위한 처리
  // 편집 변경 목록 업데이트
  useEffect(() => {
    const list: FeeBackWidthEdit[] = [];
    documents?.forEach(item => {
      // 추가적인 속성을 추가(edit)
      const tempFeedback: FeeBackWidthEdit = { ...item, edit: false };
      list.push(tempFeedback);
    });
    setFeedBackList(list);
  }, [documents]);

  const editChangeMode = (_id: string, _isEdit: boolean) => {
    const arr: FeeBackWidthEdit[] = feedbackList.map(item => {
      if (item.id === _id) {
        return { ...item, edit: _isEdit };
      } else {
        // 한개만 수정되도록 state 관리
        return { ...item, edit: false };
      }
    });
    setFeedBackList(arr);
  };

  return (
    <>
      <HeaderComponent
        rightElements={[
          <Link key="feedback" href="/feedback" className={styles.box}>
            <PiSealCheck />
          </Link>,
          <Link key="about" href="/about" className={styles.box}>
            <SlLayers />
          </Link>,
        ]}
      />
      <main>
        <section className="text-gray-600 body-font">
          <div className="container px-5 py-24 mx-auto">
            <div className="text-center mb-20">
              <h1 className="sm:text-3xl text-2xl font-medium text-center title-font text-gray-900 mb-4">
                대한 민국 보건소 위치 지도 서비스 피드백
              </h1>
              <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto">
                본 서비스에 대한 피드백을 남겨주세요.
              </p>
            </div>

            {/* <div>
              <h1>실시간 데이터 보기</h1>
              {documents && <strong>OKOK</strong>}
              {documents?.map(item => {
                return (
                  <div key={item.id}>
                    <strong>{item.id}</strong>
                    <strong>{item.message}</strong>
                    <strong>{item.nickName}</strong>
                    <strong>{item.email}</strong>
                  </div>
                );
              })}
            </div> */}

            <section className="text-gray-600 body-font overflow-hidden">
              <div className="container px-5 mx-auto">
                <div className="py-8 flex flex-wrap md:flex-nowrap">
                  <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                    <span className="font-semibold title-font text-gray-700">
                      Feedback Input
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <section className="text-gray-600 body-font relative">
                      <div className="container px-5 mx-auto">
                        <div className="lg:w-1/2 md:w-2/3 mx-auto">
                          <div className="flex flex-wrap -m-2">
                            <div className="p-2 w-1/2">
                              <div className="relative">
                                <label
                                  htmlFor="nickname"
                                  className="leading-7 text-sm text-gray-600"
                                >
                                  NickName
                                </label>
                                <input
                                  type="text"
                                  id="nickname"
                                  name="nickname"
                                  value={nickName}
                                  onChange={e => {
                                    setNickName(e.target.value);
                                  }}
                                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                />
                              </div>
                            </div>
                            <div className="p-2 w-1/2">
                              <div className="relative">
                                <label
                                  htmlFor="email"
                                  className="leading-7 text-sm text-gray-600"
                                >
                                  Email
                                </label>
                                <input
                                  type="email"
                                  id="email"
                                  name="email"
                                  value={email}
                                  onChange={e => {
                                    setEmail(e.target.value);
                                  }}
                                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                />
                              </div>
                            </div>
                            <div className="p-2 w-full">
                              <div className="relative">
                                <label
                                  htmlFor="message"
                                  className="leading-7 text-sm text-gray-600"
                                >
                                  Message
                                </label>
                                <textarea
                                  id="message"
                                  name="message"
                                  value={message}
                                  onChange={e => {
                                    setMessage(e.target.value);
                                  }}
                                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                                ></textarea>
                              </div>
                            </div>
                            <div className="p-2 w-full">
                              <button
                                onClick={() => {
                                  // fb 등록 테스트
                                  addFeedback();
                                }}
                                className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </section>
            <section className="text-gray-600 body-font overflow-hidden">
              <div className="container px-5 py-24 mx-auto">
                <div className="-my-8 divide-y-2 divide-gray-100">
                  {/* =============== 등록된 목록 출력 영역 */}
                  {feedbackList?.map(item => {
                    const date = item.createdTime.toDate(); // 가정: createdTime이 Firebase Timestamp 객체
                    const dateString = date.toDateString(); // 또는 다른 포매팅 방법 사용
                    return (
                      <div
                        key={item.id}
                        className="py-8 flex flex-wrap md:flex-nowrap"
                      >
                        <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                          <span className="font-semibold title-font text-gray-700">
                            {item.nickName} ({item.email})
                          </span>
                          <span className="mt-1 text-gray-500 text-sm">
                            {dateString}
                          </span>
                        </div>
                        <div className="md:flex-grow">
                          {/* <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
                            {item.nickName}
                          </h2> */}

                          {/* 수정 또는 읽기 상태 */}
                          {item.edit ? (
                            <div className="flex justify-between items-center">
                              <textarea
                                id="message"
                                name="message"
                                value={message}
                                onChange={e => {
                                  // setMessage(e.target.value);
                                }}
                                className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                              ></textarea>
                              <button
                                onClick={() => {
                                  // deleteFeedback(item.id);
                                }}
                                className="ml-4 text-indigo-500 inline-flex items-center mt-4"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  // 수정모드 취소
                                  editChangeMode(item.id, false);
                                }}
                                className="ml-4 text-indigo-500 inline-flex items-center mt-4"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-between items-center">
                              <p className="leading-relaxed">{item.message}</p>
                              <button
                                onClick={() => {
                                  // 수정모드 실행
                                  editChangeMode(item.id, true);
                                }}
                                className="text-indigo-500 inline-flex items-center mt-4"
                              >
                                Edit
                              </button>
                            </div>
                          )}

                          <button
                            onClick={() => {
                              deleteFeedback(item.id);
                            }}
                            className="text-indigo-500 inline-flex items-center mt-4"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* ============= 등록된 목록 출력 영역 */}
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
    </>
  );
};

export default Feedback;
```

- FB 수정 (4단계 - 내용수정 state 추가 및 적용 )

```tsx
// 내용 수정 관련
const [editMessage, setEditMessage] = useState<string>('');

const editChangeMode = (_id: string, _isEdit: boolean) => {
  const arr: FeeBackWidthEdit[] = feedbackList.map(item => {
    if (item.id === _id) {
      // 기존 message 출력 처리
      setEditMessage(item.message);
      return { ...item, edit: _isEdit };
    } else {
      // 한개만 수정되도록 state 관리
      return { ...item, edit: false };
    }
  });
  setFeedBackList(arr);
};
...
<textarea
  id="editmessage"
  name="editmessage"
  value={editMessage}
  onChange={e => {
    setEditMessage(e.target.value);
  }}
  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
></textarea>
```

- FB 수정 (5단계 - 내용수정 저장 )
  : /src/hooks/useFirebase.ts

```ts
// FB Collection 관리 : 폴더이름
// Collection 을 미리 안만들어도 됨.
// FB 연동시 성공/실패 관리
import { appFireStore, timeStamp } from '@/fb/fbconfig';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  FirestoreError,
  updateDoc,
} from 'firebase/firestore';
import { useReducer, Reducer } from 'react';

// 상태 interface 만들기
interface State {
  document: DocumentReference | null;
  isPending: boolean | false;
  error: string | null;
  success: boolean;
}
// 액션 type 만들기
type Action =
  | { type: 'isPending' }
  | { type: 'addDoc'; payload: DocumentReference }
  | { type: 'error'; payload: string }
  | { type: 'deleteDoc' }
  | { type: 'editDoc' };

// State 인터페이스 활용하기
const initState: State = {
  document: null,
  isPending: false,
  error: null,
  success: false,
};

const storeReducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'isPending':
      return {
        ...state,
        isPending: true,
        document: null,
        success: false,
        error: null,
      };
    case 'addDoc':
      return {
        ...state,
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case 'error':
      return {
        ...state,
        isPending: false,
        document: null,
        success: false,
        error: action.payload,
      };
    case 'deleteDoc':
      return {
        ...state,
        isPending: false,
        document: null,
        success: true,
        error: null,
      };
    case 'editDoc':
      return {
        ...state,
        isPending: false,
        document: null,
        success: true,
        error: null,
      };
    default:
      return state;
  }
};

// transaction 은 collection 이름이다.
export const useFirebase = (transaction: string) => {
  const [rerponse, dispatch] = useReducer(storeReducer, initState);
  const colRef = collection(appFireStore, transaction);
  // 내용 등록 함수
  const addDocument = async (doc: any) => {
    // console.log('문서추가 : ', doc);
    dispatch({ type: 'isPending' });
    try {
      const createdTime = timeStamp.fromDate(new Date());
      const docRef = await addDoc(colRef, { ...doc, createdTime });
      // console.log(docRef);
      dispatch({ type: 'addDoc', payload: docRef });
    } catch (error) {
      dispatch({ type: 'error', payload: (error as FirestoreError).message });
    }
  };

  // Document (문서파일) 를 삭제한다.
  const deleteDocument = async (id: string) => {
    dispatch({ type: 'isPending' });
    try {
      // 어떤 FB Document 인가를 알려주는 메서드
      // FB 에서 아이디를 보내면 찾아주는 메서드 doc()
      const docRef = await deleteDoc(doc(colRef, id));
      dispatch({ type: 'deleteDoc' });
    } catch (error) {
      dispatch({ type: 'error', payload: (error as FirestoreError).message });
    }
  };

  // Document 업데이트
  const editDocument = async (id: string, data: any) => {
    dispatch({ type: 'isPending' });
    try {
      // FB 문서를 참조
      // 수정을 하기 위해서는 collection 참조 및 , 문서 id 를 전달
      const docRef = doc(appFireStore, transaction, id);
      // 이후 업데이트
      await updateDoc(docRef, data);
      dispatch({ type: 'editDoc' });
    } catch (error) {
      dispatch({ type: 'error', payload: (error as FirestoreError).message });
    }
  };

  return { rerponse, addDocument, deleteDocument, editDocument };
};
```

: /src/app/feedback/page.tsx

```tsx
// 새로운 내용으로 업데이트 하기
const editSave = (_id: string) => {
  // id 를 이용한 업데이트
  // 화면용 state 인 edit 속성은 불필요하므로 원본에서 찾아요
  const editData = documents?.find(item => item.id === _id);
  const updateData = { ...editData, message: editMessage };
  editDocument(_id, updateData);
};
```

- 전체코드
  : /src/app/feedback/page.tsx

```tsx
'use client';
import { useState, useEffect } from 'react';
import HeaderComponent from '@/components/common/HeaderComponent';
import { useFirebase } from '@/hooks/useFirebase';
import styles from '@/styles/header.module.scss';
import Link from 'next/link';
import { PiSealCheck } from 'react-icons/pi';
import { SlLayers } from 'react-icons/sl';
import { useColletion } from '@/hooks/useCollection';
import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';

// 등록하기 기능
type FeedBack = {
  id: number;
  message: string;
  email: string;
  nickName: string;
};
// 기본 FeedBack 데이터 활용 및 edit 추가
type FeeBackWidthEdit = {
  edit: boolean; // 편집/읽기
  [key: string]: any;
};

const Feedback = (): JSX.Element => {
  // FB Hook 가져오기
  const { documents, error } = useColletion('feedback');
  // feedback Collection 만들기
  const { rerponse, addDocument, deleteDocument, editDocument } =
    useFirebase('feedback');
  // 입력창 관련 state
  const [message, setMessage] = useState<string>('');
  const [nickName, setNickName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  // 피드백 목록 관련 state
  const [feedbackList, setFeedBackList] = useState<FeeBackWidthEdit[]>([]);

  // 목록 내용 등록
  const addFeedback = () => {
    const feedback: FeedBack = {
      id: Date.now(),
      message: message,
      nickName: nickName,
      email: email,
    };
    addDocument(feedback);

    // 실시간 등록된 목록 업데이트 하기
    // onSnapShot
    // setFeedBackList([...feedbackList, feedback]);
  };

  // 문서 삭제하기
  const deleteFeedback = (_id: string) => {
    deleteDocument(_id);
  };

  // Reduce 의 State 를 참조해서 결과를 처리한다.
  useEffect(() => {
    if (rerponse.success) {
      setMessage('');
      setEmail('');
      setNickName('');
    }
  }, [rerponse.success]);

  // 수정 모드를 위한 처리
  // 편집 변경 목록 업데이트
  useEffect(() => {
    const list: FeeBackWidthEdit[] = [];
    documents?.forEach(item => {
      // 추가적인 속성을 추가(edit)
      const tempFeedback: FeeBackWidthEdit = { ...item, edit: false };
      list.push(tempFeedback);
    });
    setFeedBackList(list);
  }, [documents]);

  // 내용 수정 관련
  const [editMessage, setEditMessage] = useState<string>('');

  const editChangeMode = (_id: string, _isEdit: boolean) => {
    const arr: FeeBackWidthEdit[] = feedbackList.map(item => {
      if (item.id === _id) {
        // 기존 message 출력 처리
        setEditMessage(item.message);
        return { ...item, edit: _isEdit };
      } else {
        // 한개만 수정되도록 state 관리
        return { ...item, edit: false };
      }
    });
    setFeedBackList(arr);
  };

  // 새로운 내용으로 업데이트 하기
  const editSave = (_id: string) => {
    // id 를 이용한 업데이트
    // 화면용 state 인 edit 속성은 불필요하므로 원본에서 찾아요
    const editData = documents?.find(item => item.id === _id);
    const updateData = { ...editData, message: editMessage };
    editDocument(_id, updateData);
  };

  return (
    <>
      <HeaderComponent
        rightElements={[
          <Link key="feedback" href="/feedback" className={styles.box}>
            <PiSealCheck />
          </Link>,
          <Link key="about" href="/about" className={styles.box}>
            <SlLayers />
          </Link>,
        ]}
      />
      <main>
        <section className="text-gray-600 body-font">
          <div className="container px-5 py-24 mx-auto">
            <div className="text-center mb-20">
              <h1 className="sm:text-3xl text-2xl font-medium text-center title-font text-gray-900 mb-4">
                대한 민국 보건소 위치 지도 서비스 피드백
              </h1>
              <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto">
                본 서비스에 대한 피드백을 남겨주세요.
              </p>
            </div>

            {/* <div>
              <h1>실시간 데이터 보기</h1>
              {documents && <strong>OKOK</strong>}
              {documents?.map(item => {
                return (
                  <div key={item.id}>
                    <strong>{item.id}</strong>
                    <strong>{item.message}</strong>
                    <strong>{item.nickName}</strong>
                    <strong>{item.email}</strong>
                  </div>
                );
              })}
            </div> */}

            <section className="text-gray-600 body-font overflow-hidden">
              <div className="container px-5 mx-auto">
                <div className="py-8 flex flex-wrap md:flex-nowrap">
                  <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                    <span className="font-semibold title-font text-gray-700">
                      Feedback Input
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <section className="text-gray-600 body-font relative">
                      <div className="container px-5 mx-auto">
                        <div className="lg:w-1/2 md:w-2/3 mx-auto">
                          <div className="flex flex-wrap -m-2">
                            <div className="p-2 w-1/2">
                              <div className="relative">
                                <label
                                  htmlFor="nickname"
                                  className="leading-7 text-sm text-gray-600"
                                >
                                  NickName
                                </label>
                                <input
                                  type="text"
                                  id="nickname"
                                  name="nickname"
                                  value={nickName}
                                  onChange={e => {
                                    setNickName(e.target.value);
                                  }}
                                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                />
                              </div>
                            </div>
                            <div className="p-2 w-1/2">
                              <div className="relative">
                                <label
                                  htmlFor="email"
                                  className="leading-7 text-sm text-gray-600"
                                >
                                  Email
                                </label>
                                <input
                                  type="email"
                                  id="email"
                                  name="email"
                                  value={email}
                                  onChange={e => {
                                    setEmail(e.target.value);
                                  }}
                                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                />
                              </div>
                            </div>
                            <div className="p-2 w-full">
                              <div className="relative">
                                <label
                                  htmlFor="message"
                                  className="leading-7 text-sm text-gray-600"
                                >
                                  Message
                                </label>
                                <textarea
                                  id="message"
                                  name="message"
                                  value={message}
                                  onChange={e => {
                                    setMessage(e.target.value);
                                  }}
                                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                                ></textarea>
                              </div>
                            </div>
                            <div className="p-2 w-full">
                              <button
                                onClick={() => {
                                  // fb 등록 테스트
                                  addFeedback();
                                }}
                                className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </section>
            <section className="text-gray-600 body-font overflow-hidden">
              <div className="container px-5 py-24 mx-auto">
                <div className="-my-8 divide-y-2 divide-gray-100">
                  {/* =============== 등록된 목록 출력 영역 */}
                  {feedbackList?.map(item => {
                    const date = item.createdTime.toDate(); // 가정: createdTime이 Firebase Timestamp 객체
                    const dateString = date.toDateString(); // 또는 다른 포매팅 방법 사용
                    return (
                      <div
                        key={item.id}
                        className="py-8 flex flex-wrap md:flex-nowrap"
                      >
                        <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                          <span className="font-semibold title-font text-gray-700">
                            {item.nickName} ({item.email})
                          </span>
                          <span className="mt-1 text-gray-500 text-sm">
                            {dateString}
                          </span>
                        </div>
                        <div className="md:flex-grow">
                          {/* <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
                            {item.nickName}
                          </h2> */}

                          {/* 수정 또는 읽기 상태 */}
                          {item.edit ? (
                            <div className="flex justify-between items-center">
                              <textarea
                                id="editmessage"
                                name="editmessage"
                                value={editMessage}
                                onChange={e => {
                                  setEditMessage(e.target.value);
                                }}
                                className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                              ></textarea>
                              <button
                                onClick={() => {
                                  // 새로운 내용으로 저장
                                  editSave(item.id);
                                }}
                                className="ml-4 text-indigo-500 inline-flex items-center mt-4"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  // 수정모드 취소
                                  editChangeMode(item.id, false);
                                }}
                                className="ml-4 text-indigo-500 inline-flex items-center mt-4"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-between items-center">
                              <p className="leading-relaxed">{item.message}</p>
                              <button
                                onClick={() => {
                                  // 수정모드 실행
                                  editChangeMode(item.id, true);
                                }}
                                className="text-indigo-500 inline-flex items-center mt-4"
                              >
                                Edit
                              </button>
                            </div>
                          )}

                          <button
                            onClick={() => {
                              deleteFeedback(item.id);
                            }}
                            className="text-indigo-500 inline-flex items-center mt-4"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* ============= 등록된 목록 출력 영역 */}
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
    </>
  );
};

export default Feedback;
```

: /src/hooks/useFirebase.ts

```ts
// FB Collection 관리 : 폴더이름
// Collection 을 미리 안만들어도 됨.
// FB 연동시 성공/실패 관리
import { appFireStore, timeStamp } from '@/fb/fbconfig';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  FirestoreError,
  updateDoc,
} from 'firebase/firestore';
import { useReducer, Reducer } from 'react';

// 상태 interface 만들기
interface State {
  document: DocumentReference | null;
  isPending: boolean | false;
  error: string | null;
  success: boolean;
}
// 액션 type 만들기
type Action =
  | { type: 'isPending' }
  | { type: 'addDoc'; payload: DocumentReference }
  | { type: 'error'; payload: string }
  | { type: 'deleteDoc' }
  | { type: 'editDoc' };

// State 인터페이스 활용하기
const initState: State = {
  document: null,
  isPending: false,
  error: null,
  success: false,
};

const storeReducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'isPending':
      return {
        ...state,
        isPending: true,
        document: null,
        success: false,
        error: null,
      };
    case 'addDoc':
      return {
        ...state,
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case 'error':
      return {
        ...state,
        isPending: false,
        document: null,
        success: false,
        error: action.payload,
      };
    case 'deleteDoc':
      return {
        ...state,
        isPending: false,
        document: null,
        success: true,
        error: null,
      };
    case 'editDoc':
      return {
        ...state,
        isPending: false,
        document: null,
        success: true,
        error: null,
      };
    default:
      return state;
  }
};

// transaction 은 collection 이름이다.
export const useFirebase = (transaction: string) => {
  const [rerponse, dispatch] = useReducer(storeReducer, initState);
  const colRef = collection(appFireStore, transaction);
  // 내용 등록 함수
  const addDocument = async (doc: any) => {
    // console.log('문서추가 : ', doc);
    dispatch({ type: 'isPending' });
    try {
      const createdTime = timeStamp.fromDate(new Date());
      const docRef = await addDoc(colRef, { ...doc, createdTime });
      // console.log(docRef);
      dispatch({ type: 'addDoc', payload: docRef });
    } catch (error) {
      dispatch({ type: 'error', payload: (error as FirestoreError).message });
    }
  };

  // Document (문서파일) 를 삭제한다.
  const deleteDocument = async (id: string) => {
    dispatch({ type: 'isPending' });
    try {
      // 어떤 FB Document 인가를 알려주는 메서드
      // FB 에서 아이디를 보내면 찾아주는 메서드 doc()
      const docRef = await deleteDoc(doc(colRef, id));
      dispatch({ type: 'deleteDoc' });
    } catch (error) {
      dispatch({ type: 'error', payload: (error as FirestoreError).message });
    }
  };

  // Document 업데이트
  const editDocument = async (id: string, data: any) => {
    dispatch({ type: 'isPending' });
    try {
      // FB 문서를 참조
      // 수정을 하기 위해서는 collection 참조 및 , 문서 id 를 전달
      const docRef = doc(appFireStore, transaction, id);
      // 이후 업데이트
      await updateDoc(docRef, data);
      dispatch({ type: 'editDoc' });
    } catch (error) {
      dispatch({ type: 'error', payload: (error as FirestoreError).message });
    }
  };

  return { rerponse, addDocument, deleteDocument, editDocument };
};
```

: /src/hooks/useCollection.ts

```ts
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
```
