import HeaderComponent from '@/components/common/HeaderComponent';
import styles from '@/styles/header.module.scss';
import Link from 'next/link';
import { PiSealCheck } from 'react-icons/pi';
import { SlLayers } from 'react-icons/sl';
const About = (): JSX.Element => {
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
      <main>서비스 소개입니다</main>
    </>
  );
};

export default About;
