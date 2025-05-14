import Image from 'next/image';
import styles from './ProductCard.module.scss';
import AddToCartButton from '../AddToCartButton';

interface ProductCardProps {
  imageSrc: string;
  title: string;
  price: number;
  id?: number;
  onAddToCart?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  imageSrc,
  title,
  price,
  id = 0,
  onAddToCart
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={imageSrc}
          alt={title}
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.bottomContainer}>
        <span className={styles.price}>{price}₽</span>
        <AddToCartButton 
          productId={id} 
          className={styles.button}
        />
      </div>
    </div>
  );
};

export default ProductCard; 