import Image from 'next/image';
import Link from 'next/link';
import styles from './ChoiceCard.module.scss';

interface CardData {
  imageSrc: string;
  label: string;
  href?: string;
  alt: string;
}

interface ChoiceCardProps {
  compact?: boolean; // Новый пропс для компактного отображения
}

const cardData: CardData[] = [
  {
    imageSrc: '/images/main/construct.png',
    label: 'Собрать маффин',
    alt: ''
  },
  {
    imageSrc: '/images/main/author2.png',
    label: 'Авторские рецепты',
    alt: "",
    href: '/author-muffins'
  }
];

export const ChoiceCard: React.FC<ChoiceCardProps> = ({ compact = false }) => {
  return (
    <>
      {cardData.map((card, index) => {
        const CardContent = (
          <div className={`${styles.card} ${compact ? styles.compactCard : ''}`}>
            <Image
              src={card.imageSrc}
              alt={card.alt}
              fill
              style={{ objectFit: 'contain', padding: compact ? '5px' : '10px' }}
              priority
            />
          </div>
        );

        return (
          <div key={index} className={`${styles.cardContainer} ${compact ? styles.compactContainer : ''}`}>
            {card.href ? (
              <Link href={card.href} style={{ textDecoration: 'none' }}>
                {CardContent}
              </Link>
            ) : (
              CardContent
            )}
            <div className={`${styles.label} ${compact ? styles.compactLabel : ''}`}>
              <span>{card.label}</span>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ChoiceCard; 