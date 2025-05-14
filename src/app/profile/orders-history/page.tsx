'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from '../Profile.module.scss';

export default function OrdersHistoryPage() {
  const router = useRouter();
  
  // Тестовые данные истории заказов
  const ordersHistory = [
    { id: 1234, date: '15.05.2023', amount: 850, status: 'Доставлен', items: 3 },
    { id: 1456, date: '10.07.2023', amount: 1200, status: 'Доставлен', items: 5 },
    { id: 1789, date: '23.08.2023', amount: 950, status: 'В пути', items: 4 },
  ];
  
  const handleBack = () => {
    router.back();
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <button className={styles.backButton} onClick={handleBack}>
            ← Назад
          </button>
          <h1 className={styles.name}>История заказов</h1>
        </div>
        
        <div className={styles.historyList}>
          {ordersHistory.length > 0 ? (
            ordersHistory.map(order => (
              <div key={order.id} className={styles.historyItem}>
                <div className={styles.orderHeader}>
                  <div className={styles.historyDate}>{order.date}</div>
                  <div className={styles.orderStatus}>{order.status}</div>
                </div>
                <div className={styles.orderDetails}>
                  <div className={styles.historyDescription}>Заказ #{order.id}</div>
                  <div className={styles.orderItems}>{order.items} товаров</div>
                  <div className={styles.historyAmount}>{order.amount} ₽</div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyHistory}>
              У вас пока нет заказов
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 