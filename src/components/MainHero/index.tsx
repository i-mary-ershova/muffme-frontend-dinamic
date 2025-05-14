'use client';

import Image from 'next/image';
import styles from './MainHero.module.scss';
import { ReactNode } from 'react';

interface MainHeroProps {
  children: ReactNode;
}

export const MainHero = ({ children }: MainHeroProps) => {
  return (
    <div className={styles.pageBackground}>
      <section className={styles.hero}>
        <div className={styles.topSection}>
          <div className={styles.leftContent}>
            <Image
              src="/images/main/muffme_main.svg"
              alt="MuffMe Logo"
              width={700}
              height={280}
              className={styles.logo}
              priority
            />
            <h1 className={styles.slogan}>
              первая маффинная в России
            </h1>
          </div>
          <Image
            src="/images/main/main.png"
            //src="/images/main/tower.png"
            alt="Main Illustration"
            width={400}
            height={400}
            className={styles.mainImage}
            priority
          />
        </div>
        
        {children}
      </section>
    </div>
  );
};

export default MainHero; 