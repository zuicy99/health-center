import type { Metadata } from 'next';
import '@/styles/globals.css';
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
      <head>
        <meta
          name="naver-site-verification"
          content="e7cea65ca91c59924fc778a08e7d55d6413d53f5"
        />
        <link
          rel="canonical"
          href="https://health-center-zuicy-99.vercel.app"
        ></link>

        <meta
          name="google-site-verification"
          content="Q2bHOLs6jaFYy4NK_gCCdUCjf270wQ8zYE_nerDd7lw"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
