'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AddToCartButton.module.scss';

interface AddToCartButtonProps {
  productId: number;
  className?: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ productId, className }) => {
  const router = useRouter();
  const [showNotification, setShowNotification] = useState(false);
  const [quantity, setQuantity] = useState(0);

  // При монтировании компонента проверяем, есть ли уже этот товар в корзине
  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cartItems.find((item: any) => item.id === productId);
    if (existingItem) {
      setQuantity(existingItem.quantity);
    }
  }, [productId]);

  const handleAddToCart = () => {
    // Получаем текущую корзину
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = cartItems.findIndex((item: any) => item.id === productId);
    
    let newQuantity = 1;
    
    if (existingItemIndex >= 0) {
      newQuantity = cartItems[existingItemIndex].quantity + 1;
      cartItems[existingItemIndex].quantity = newQuantity;
    } else {
      cartItems.push({
        id: productId,
        quantity: newQuantity,
        addedAt: new Date().toISOString()
      });
    }
    
    // Обновляем корзину
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // Обновляем счетчик
    setQuantity(newQuantity);
    
    // Показываем уведомление
    setShowNotification(true);
    
    // Скрываем уведомление через 5 секунд
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  const handleGoToCart = () => {
    router.push('/cart');
  };

  // Увеличение количества товара
  const handleIncrease = () => {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = cartItems.findIndex((item: any) => item.id === productId);
    
    if (existingItemIndex >= 0) {
      const newQuantity = cartItems[existingItemIndex].quantity + 1;
      cartItems[existingItemIndex].quantity = newQuantity;
      localStorage.setItem('cart', JSON.stringify(cartItems));
      setQuantity(newQuantity);
    }
  };

  // Уменьшение количества товара
  const handleDecrease = () => {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = cartItems.findIndex((item: any) => item.id === productId);
    
    if (existingItemIndex >= 0) {
      const newQuantity = cartItems[existingItemIndex].quantity - 1;
      
      if (newQuantity <= 0) {
        // Удаляем товар из корзины
        cartItems.splice(existingItemIndex, 1);
        setQuantity(0);
      } else {
        cartItems[existingItemIndex].quantity = newQuantity;
        setQuantity(newQuantity);
      }
      
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  };

  return (
    <div className={styles.buttonContainer}>
      {quantity === 0 ? (
        <button 
          className={`${styles.button} ${className || ''}`}
          onClick={handleAddToCart}
        >
          В корзину
        </button>
      ) : (
        <div className={styles.quantityControl}>
          <button className={styles.controlButton} onClick={handleDecrease}>-</button>
          <span className={styles.quantity}>{quantity}</span>
          <button className={styles.controlButton} onClick={handleIncrease}>+</button>
        </div>
      )}
      
      {showNotification && (
        <div className={styles.notification}>
          <p>Товар добавлен в корзину!</p>
          <button 
            className={styles.goToCartButton}
            onClick={handleGoToCart}
          >
            Перейти в корзину
          </button>
        </div>
      )}
    </div>
  );
};

export default AddToCartButton; 