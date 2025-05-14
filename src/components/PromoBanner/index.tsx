import Image from 'next/image';
import styles from './PromoBanner.module.scss';

// This is a server component
async function getPromoData() {
  // In a real app, this would fetch from an API or database
  // For now, we'll return static data
  return {
    imageSrc: '/images/main/promo.png',
    alt: 'Promotional Banner'
  };
}

export default async function PromoBanner() {
  const promoData = await getPromoData();

  return (
    <div className={styles.bannerContainer}>
      <div className={styles.banner}>
        <Image
          src={promoData.imageSrc}
          alt={promoData.alt}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
    </div>
  );
} 