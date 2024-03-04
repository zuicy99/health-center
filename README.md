# 기본 페이지 구성

- `yarn dev`

## 1. 각 파일 정리

### 1.1. http://localhost:3000/

#### /src/app/layout.tsx

```tsx
import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: '전국 보건소 위치 안내',
  description: '전국 보건소 위치 안내 서비스 앱',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
```

- global.css

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
html {
}
body {
}
```

#### /src/app/page.tsx

```tsx
export default function Home() {
  return (
    <>
      <main>테스트</main>
    </>
  );
}
```

## HederComponent.tsx 진행

- header 역할인 경우 각 page 에 배치되는 컴포넌트
- src/components/common 폴더
- src/components/common/HeaderComponent.tsx 생성
