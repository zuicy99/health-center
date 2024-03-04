import Link from 'next/link';
import React from 'react';
import styles from '@/styles/header.module.scss';
import Image from 'next/image';
// React.ReactNode :  React 에서 만든 HTML 요소
// 여러개의 children 요소들을 받을 것이므로 배열로 받음
interface Props {
  rightElements?: React.ReactNode[];
}
const HeaderComponent: React.FC<Props> = ({ rightElements }): JSX.Element => {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.flexitem}>
          <Link href="/" className={styles.box}>
            <Image
              src={'/next.svg'}
              width={110}
              height={20}
              alt="보건소 안내 서비스"
              quality={75}
              priority
            />
          </Link>
        </div>

        {rightElements && (
          <div className={styles.flexitem}>{rightElements}</div>
        )}
      </header>
    </>
  );
};

export default HeaderComponent;
