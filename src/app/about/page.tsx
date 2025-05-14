import React from 'react';
import Image from 'next/image';
import styles from './About.module.scss';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'О нас | Muffme',
  description: 'Muffme — моно-кондитерская-конструктор, где вы сами создаёте свои идеальные маффины.',
};

// This page will be statically generated at build time
export default function About() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroGradient}></div>
        <div className={styles.heroContent}>
          <div className={styles.logoContainer}>
            <Image 
              src="/images/about/logo_about.png" 
              alt="Muffme Logo" 
              width={400} 
              height={120} 
              className={styles.logoAbout}
            />
          </div>
          <h1 className={styles.heroTitle}>You are your own artist</h1>
        </div>
        <Image 
          src="/images/about/1.png" 
          alt="Hero background" 
          fill 
          priority
          className={styles.heroImage}
        />
      </section>

      <div className={styles.container}>
        <section className={styles.aboutSection}>
          <div className={styles.imageContainer}>
            <Image 
              src="/images/about/2.png" 
              alt="About us" 
              width={500} 
              height={400} 
              className={styles.sectionImage}
            />
          </div>
          <div className={styles.textContainer}>
            <div className={styles.pinkBox}>
              <h2 className={styles.sectionTitle}>Кто мы?</h2>
              <p className={styles.sectionText}>
                Muffme — моно-кондитерская-конструктор, где вы сами создаёте свои идеальные маффины. 
                Выбирайте ингредиенты, сочетайте вкусы, декорируйте —
                и наслаждайтесь результатом.
                Соберите свой идеальный маффин —
                и приходите за новым!
              </p>
            </div>
          </div>
        </section>

        <section className={styles.imageRow}>
          <div className={styles.imageItem}>
            <Image src="/images/about/3.png" alt="Muffins" width={400} height={300} />
          </div>
          <div className={styles.imageItem}>
            <Image src="/images/about/4.png" alt="Muffins" width={400} height={300} />
          </div>
          <div className={styles.imageItem}>
            <Image src="/images/about/5.png" alt="Muffins" width={400} height={300} />
          </div>
        </section>

        <section className={styles.aboutSection + ' ' + styles.reverseSection}>
          <div className={styles.textContainer}>
            <div className={styles.pinkBox + ' ' + styles.leftRounded}>
              <h2 className={styles.sectionTitle}>Наша история</h2>
              <p className={styles.sectionText}>
                Мы — стартап, рожденный
                на студенческом курсе по коммуникациям. Идея нашего заведения возникла прямо на первом семинаре — и с тех пор превратилась в то, что вы видите сегодня!
              </p>
            </div>
          </div>
          <div className={styles.imageContainer}>
            <Image 
              src="/images/about/6.png" 
              alt="Our history" 
              width={500} 
              height={400} 
              className={styles.sectionImage}
            />
          </div>
        </section>

        <section className={styles.imageRow}>
          <div className={styles.imageItem}>
            <Image src="/images/about/7.png" alt="Muffins" width={400} height={300} />
          </div>
          <div className={styles.imageItem}>
            <Image src="/images/about/8.png" alt="Muffins" width={400} height={300} />
          </div>
          <div className={styles.imageItem}>
            <Image src="/images/about/9.png" alt="Muffins" width={400} height={300} />
          </div>
        </section>

        <section className={styles.imageRow}>
          <div className={styles.imageItem}>
            <Image src="/images/about/10.png" alt="Muffins" width={400} height={300} />
          </div>
          <div className={styles.imageItem}>
            <Image src="/images/about/11.png" alt="Muffins" width={400} height={300} />
          </div>
          <div className={styles.imageItem}>
            <Image src="/images/about/12.png" alt="Muffins" width={400} height={300} />
          </div>
        </section>
      </div>

      <section className={styles.missionSection}>
        <div className={styles.missionGradient}></div>
        <div className={styles.missionContent}>
          <div className={styles.missionBox}>
            <h2 className={styles.sectionTitle}>Наша миссия</h2>
            <p className={styles.sectionText}>
              Мы открываем мир творчества,
              где каждый может стать собственным 
              художником. Мы вдохновляем на созидание, 
              дарим простор для воображения, чтобы мечты 
              обретали форму, а замыслы — жизнь.
            </p>
          </div>
        </div>
        <Image 
          src="/images/about/13.png" 
          alt="Our mission" 
          fill
          className={styles.missionImage}
        />
      </section>
    </main>
  );
} 