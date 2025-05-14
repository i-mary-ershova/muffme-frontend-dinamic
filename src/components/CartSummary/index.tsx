import { useState } from 'react';
import styles from './CartSummary.module.scss';

interface CartSummaryProps {
  subtotal: number;
  deliveryPrice: number;
  onCheckout: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  deliveryPrice,
  onCheckout
}) => {
  const [isPromoExpanded, setIsPromoExpanded] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  
  const total = subtotal + deliveryPrice;
  
  const handlePromoToggle = () => {
    setIsPromoExpanded(!isPromoExpanded);
  };
  
  const handleApplyPromo = () => {
    // Заглушка для логики применения промокода
    console.log('Применен промокод:', promoCode);
    // Здесь можно добавить логику для расчета скидки
  };

  return (
    <div className={styles.cartSummary}>
      <h2 className={styles.title}>Итого</h2>
      
      <div className={styles.summaryRow}>
        <span>Сумма заказа:</span>
        <span>{subtotal}₽</span>
      </div>
      
      {/* <div className={styles.summaryRow}>
        <span>Доставка:</span>
        <span>{deliveryPrice}₽</span>
      </div> */}
      
      <div className={styles.promoSection}>
        <button 
          className={styles.promoToggle}
          onClick={handlePromoToggle}
        >
          {isPromoExpanded ? 'Скрыть промокод' : 'У меня есть промокод'}
        </button>
        
        {isPromoExpanded && (
          <div className={styles.promoInput}>
            <input
              type="text"
              placeholder="Введите промокод"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button 
              className={styles.applyButton}
              onClick={handleApplyPromo}
              disabled={!promoCode}
            >
              Применить
            </button>
          </div>
        )}
      </div>
      
      <div className={styles.totalRow}>
        <span>Итого к оплате:</span>
        <span className={styles.totalAmount}>{total}₽</span>
      </div>
      
      <button 
        className={styles.checkoutButton}
        onClick={onCheckout}
        disabled={subtotal === 0}
      >
        Оформить заказ
      </button>
    </div>
  );
};

export default CartSummary; 