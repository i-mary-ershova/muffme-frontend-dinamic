'use client';

import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* 1️⃣ Логотип */}
        <div className={styles.logoContainer}>
          <Link href="/">
            <Image
              src="/icons/logo.svg"
              alt="Логотип muffme"
              width={400}
              height={100}
              style={{ objectFit: 'contain' }}
            />
          </Link>
        </div>

        {/* 2️⃣ Навигация + Соцсети */}
        <div className={styles.navWrapper}>
          <div className={styles.leftNavContainer}>
            <nav>
              <ul>
                <li><Link href="/about">О нас</Link></li>
                <li><Link href="/preorder">Предзаказ</Link></li>
                <li><Link href="/profile">Личный кабинет</Link></li>
                <li><Link href="https://yandex.ru/maps/-/CHbCRR6t" target="_blank" rel="noopener noreferrer">
                  Тюмень, ул. Ямская, 87 
                  <Image src="/icons/address.svg" alt="" width={25} height={25} />
                </Link></li>    
              </ul>
            </nav>
            
          </div>

          {/* 3️⃣ Навигация + Адрес */}
          <div className={styles.rightNavContainer}>
            <nav>
              <ul>
                <li><Link href="mailto:muffme.mail@gmail.com" target="_blank" rel="noopener noreferrer">
                  muffme.mail@gmail.com
                </Link></li>
                <li><Link href="tel:+79123456789" target="_blank" rel="noopener noreferrer">
                  +7 (912) 345-67-89
                </Link></li>
                <div className={styles.socialIcons}>
              <a href="https://t.me/muffme_tmn" target="_blank" rel="noopener noreferrer">
                <Image src="/socials/telegram.svg" alt="Telegram" width={30} height={30} />
              </a>
              {/* <a href="https://www.instagram.com/muffme_tmn?igsh=b2E0OHpsaWU0dHIx" target="_blank" rel="noopener noreferrer">
                <Image src="/socials/insta.svg" alt="Instagram" width={30} height={30} />
              </a>*/}
              <a href="https://vk.com/muffme_tmn" target="_blank" rel="noopener noreferrer">
                <Image src="/socials/VK.svg" alt="VK" width={30} height={30} />
              </a>
              {/* <Image src="/socials/tiktok.svg" alt="TikTok" width={30} height={30} /> */}
            </div>
              </ul>
            </nav>         
          </div>
        </div>
      </div>

      {/* Копирайт */}
      <div className={styles.copyright}>
        <p>© muffme, 2025</p>
        <p>
        <Link href="/privacy">Политика конфиденциальности</Link>
        </p>
      </div>
    </footer>
  );
}
