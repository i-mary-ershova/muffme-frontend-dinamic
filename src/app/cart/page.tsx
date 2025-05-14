// src/app/cart/CartPage.tsx
'use client';

import { useState, useEffect } from 'react';
import styles from './Cartpage.module.scss';
import ChoiceCard from '@/components/ChoiceCard';
import CartItem from '@/components/CartItem';
import CartSummary from '@/components/CartSummary';

interface CartItem {
  id: number;
  quantity: number;
  addedAt: string;
}

interface CartItemWithDetails extends CartItem {
  title: string;
  price: number;
  imageSrc: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItemWithDetails[]>([]);
  const [isEmpty, setIsEmpty] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const deliveryPrice = 0; // Фиксированная стоимость доставки

  // Функция загрузки данных корзины
  const loadCart = () => {
    // Получаем товары из localStorage
    const storedCart = localStorage.getItem('cart');
    if (!storedCart) {
      setIsEmpty(true);
      setCartItems([]);
      setSubtotal(0);
      return;
    }
    
    const parsedCart: CartItem[] = JSON.parse(storedCart);
    
    if (parsedCart.length === 0) {
      setIsEmpty(true);
      setCartItems([]);
      setSubtotal(0);
      return;
    }
    
    // Для демонстрации, обычно эти данные должны быть загружены с сервера
    // путем запроса деталей для каждого товара в корзине
    const cartWithDetails: CartItemWithDetails[] = parsedCart.map(item => {
      // В реальном приложении здесь был бы запрос к API
      // Для демонстрации используем жестко заданные данные
      return {
        ...item,
        title: `Маффин №${item.id}`, // Заглушка для названия
        price: 299, // Заглушка для цены
        imageSrc: `/images/author/${Math.min(item.id, 8)}.png` // Заглушка для изображения
      };
    });
    
    setCartItems(cartWithDetails);
    setIsEmpty(cartWithDetails.length === 0);
    
    // Рассчитываем общую стоимость
    const total = cartWithDetails.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(total);
  };

  // Загрузка корзины при монтировании компонента
  useEffect(() => {
    loadCart();
    
    // Устанавливаем интервал для периодической проверки изменений в localStorage
    // Это поможет синхронизировать данные, если пользователь изменил корзину в другой вкладке
    // или через кнопки счетчика на странице продуктов
    const intervalId = setInterval(loadCart, 1000);
    
    // Очистка интервала при размонтировании компонента
    return () => clearInterval(intervalId);
  }, []);

  const handleRemoveItem = (id: number) => {
    // Удаляем товар из состояния
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    setIsEmpty(updatedItems.length === 0);
    
    // Обновляем localStorage
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    
    // Пересчитываем общую стоимость
    const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(total);
  };

  const handleQuantityChange = (id: number, newQuantity: number) => {
    // Обновляем количество товара
    const updatedItems = cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedItems);
    
    // Обновляем localStorage
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    
    // Пересчитываем общую стоимость
    const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(total);
  };

  const handleCheckout = () => {
    // Заглушка для оформления заказа
    console.log('Оформление заказа');
    alert('Заказ успешно оформлен!');
    
    // Очищаем корзину
    setCartItems([]);
    setIsEmpty(true);
    setSubtotal(0);
    localStorage.removeItem('cart');
  };

  return (
    <div className={styles.cartContainer}>
      <div className={styles.container}>
        <h1 className={styles.emptyMessage}>
          {isEmpty ? "Тут так пусто... Может возьмешь маффин?" : "Ваша корзина"}
        </h1>
        
        {isEmpty ? (
          // Когда корзина пуста, показываем ChoiceCard в центре
          <div className={styles.cardsContainer}>
            <ChoiceCard />
          </div>
        ) : (
          // Когда в корзине есть товары, показываем двухколоночный макет
          <div className={styles.cartContentContainer}>
            {/* Левая колонка: товары */}
            <div className={styles.cartItemsContainer}>
              {cartItems.map(item => (
                <CartItem
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  price={item.price}
                  quantity={item.quantity}
                  imageSrc={item.imageSrc}
                  onRemove={handleRemoveItem}
                  onQuantityChange={handleQuantityChange}
                />
              ))}
            </div>
            
            {/* Правая колонка: компактные карточки выбора + итоговый блок */}
            <div className={styles.rightColumn}>
              <div className={styles.choiceCardsWrapper}>
                <ChoiceCard compact={true} />
              </div>
              
              <div className={styles.cartSummaryContainer}>
                <CartSummary
                  subtotal={subtotal}
                  deliveryPrice={deliveryPrice}
                  onCheckout={handleCheckout}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}