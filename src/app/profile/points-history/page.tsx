'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from '../Profile.module.scss';

export default function PointsHistoryPage() {
  const router = useRouter();
  
  // Тестовые данные истории начислений
  const pointsHistory = [
    { id: 1, date: '15.05.2023', amount: 50, description: 'Заказ #1234' },
    { id: 2, date: '20.06.2023', amount: 100, description: 'Бонус на день рождения' },
    { id: 3, date: '10.07.2023', amount: 75, description: 'Заказ #1456' },
    { id: 4, date: '05.08.2023', amount: 125, description: 'Промо-акция' },
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
          <h1 className={styles.name}>История начислений</h1>
        </div>
        
        <div className={styles.historyList}>
          {pointsHistory.length > 0 ? (
            pointsHistory.map(item => (
              <div key={item.id} className={styles.historyItem}>
                <div className={styles.historyDate}>{item.date}</div>
                <div className={styles.historyDescription}>{item.description}</div>
                <div className={styles.historyAmount}>+{item.amount} баллов</div>
              </div>
            ))
          ) : (
            <div className={styles.emptyHistory}>
              У вас пока нет начислений баллов
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 