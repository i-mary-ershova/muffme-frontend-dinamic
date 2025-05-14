import Image from 'next/image';
import styles from './Marquee.module.scss';

export const Marquee = () => {
  // Create an array of 10 elements to repeat the image
  const repeatedImages = Array(10).fill(null);

  return (
    <div className={styles.marqueeContainer}>
      <div className={styles.marqueeTrack}>
        {/* First set of images */}
        <div className={styles.marqueeContent}>
          {repeatedImages.map((_, index) => (
            <Image
              key={`first-${index}`}
              src="/images/main/marquee.svg"
              alt="Marquee"
              width={200}
              height={40}
              className={styles.marqueeImage}
            />
          ))}
        </div>
        {/* Duplicate set of images for seamless loop */}
        <div className={styles.marqueeContent}>
          {repeatedImages.map((_, index) => (
            <Image
              key={`second-${index}`}
              src="/images/main/marquee.svg"
              alt="Marquee"
              width={200}
              height={40}
              className={styles.marqueeImage}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;