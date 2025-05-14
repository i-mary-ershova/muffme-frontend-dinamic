import Image from 'next/image';
import { useState } from 'react';
import styles from './CartItem.module.scss';

interface CartItemProps {
  id: number;
  title: string;
  price: number;
  quantity: number;
  imageSrc: string;
  onRemove: (id: number) => void;
  onQuantityChange: (id: number, quantity: number) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  id,
  title,
  price,
  quantity,
  imageSrc,
  onRemove,
  onQuantityChange
}) => {
  const handleIncrease = () => {
    onQuantityChange(id, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(id, quantity - 1);
    } else {
      onRemove(id);
    }
  };

  const handleRemove = () => {
    onRemove(id);
  };

  return (
    <div className={styles.cartItem}>
      <div className={styles.imageContainer}>
        <Image
          src={imageSrc}
          alt={title}
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
      
      <div className={styles.details}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.price}>{price}₽</span>
      </div>
      
      <div className={styles.controls}>
        <div className={styles.quantityControl}>
          <button className={styles.controlButton} onClick={handleDecrease}>-</button>
          <span className={styles.quantity}>{quantity}</span>
          <button className={styles.controlButton} onClick={handleIncrease}>+</button>
        </div>
        
        <div className={styles.itemTotal}>
          <span>{price * quantity}₽</span>
        </div>
        
        <button className={styles.removeButton} onClick={handleRemove}>
          Удалить
        </button>
      </div>
    </div>
  );
};

export default CartItem; 