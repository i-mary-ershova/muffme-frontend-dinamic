import Image from 'next/image';
import styles from './DessertSection.module.scss';
import ChoiceCard from '../ChoiceCard';

export const DessertSection = () => {
  return (
    <div className={styles.pageBackground}>
      <section className={styles.section}>
        <Image
          src="/images/main/cherry.svg"
          alt=""
          width={300}
          height={300}
          className={styles.decorationCherry}
        />
        <Image
          src="/images/main/stars.svg"
          alt=""
          width={300}
          height={300}
          className={styles.decorationStars}
        />
        
        <div className={styles.content}>
          <h2 className={styles.title}>Собери свой десерт!</h2>
          <div className={styles.cardsContainer}>
            <ChoiceCard />
          </div>
        </div>
      </section>
    </div>
  );
};

export default DessertSection; 