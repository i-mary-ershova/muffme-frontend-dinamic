'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import styles from './Profile.module.scss';
import ProtectedRoute from '@/components/ProtectedRoute';
import { api } from '@/utils/api';
import { getUserProfile, removeAuthToken, getUserId, isAuthenticated } from '@/utils/auth';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Тестовые данные истории заказов (заменить на реальные данные из API позже)
  const ordersHistory = [
    { id: 1234, date: '15.02.2025', amount: 850, status: 'Получен', items: 3 },
    { id: 1456, date: '10.04.2025', amount: 1200, status: 'Получен', items: 2 },
    { id: 1789, date: '23.05.2025', amount: 950, status: 'Готовится', items: 4 },
  ];

  const formatPhoneDisplay = (phone: string): string => {
    const part1 = phone.slice(2, 5);
    const part2 = phone.slice(5, 8);
    const part3 = phone.slice(8, 10);
    const part4 = phone.slice(10, 12);
    return `+7 (${part1}) ${part2} ${part3} ${part4}`;
};

  // Функция для получения профиля пользователя
  const fetchUserProfile = async () => {
    setLoading(true);
    setError(null);

    // Проверяем авторизацию перед запросом
    if (!isAuthenticated()) {
      setError('Вы не авторизованы. Пожалуйста, войдите в систему.');
      setLoading(false);
      setTimeout(() => {
        router.replace('/');
      }, 1000);
      return;
    }

    try {
      // Получаем ID пользователя
      const userId = getUserId();
      if (!userId) {
        setError('Не удалось определить ID пользователя. Пожалуйста, войдите снова.');
        removeAuthToken();
        router.replace('/');
        return;
      }

      // Сначала пробуем получить из локального хранилища
      const cachedProfile = getUserProfile();
      if (cachedProfile) {
        setUserProfile(cachedProfile);
        setLoading(false);
      }

      // Делаем запрос на получение актуального профиля по ID
      const user = await api.getProfile(userId);
      setUserProfile(user);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Не удалось загрузить профиль. Пожалуйста, войдите снова.');
      // Если произошла ошибка авторизации, удаляем токен
      if ((err as Error).message.includes('401')) {
        removeAuthToken();
        router.replace('/');
      }
    } finally {
      setLoading(false);
    }
  };

  // Загрузка данных профиля при монтировании компонента
  useEffect(() => {
    fetchUserProfile();

    // Обработчик события изменения авторизации
    const handleAuthChange = () => {
      if (!isAuthenticated()) {
        router.replace('/');
      } else {
        fetchUserProfile();
      }
    };

    // Слушаем кастомное событие изменения авторизации
    window.addEventListener('auth-state-changed', handleAuthChange);

    // Слушаем стандартное событие изменения localStorage
    window.addEventListener('storage', (event) => {
      if (event.key === 'auth_token' || event.key === 'user_id') {
        handleAuthChange();
      }
    });

    // Очистка обработчиков при размонтировании
    return () => {
      window.removeEventListener('auth-state-changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [router]);

  const handleLogout = () => {
    removeAuthToken();
    
    // Инициируем событие для синхронизации между компонентами
    window.dispatchEvent(new Event('auth-state-changed'));
    
    router.replace('/');
  };

  // Рендерим защищенную страницу профиля
  return (
    <ProtectedRoute>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Личный кабинет</h1>
          
          {loading ? (
            <div className={styles.loading}>Загрузка профиля...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : (
            <div className={styles.content}>
              <div className={styles.profileSection}>
                <h2 className={styles.subtitle}>Ваш профиль</h2>
                <div className={styles.profileData}>
                  <p><strong>Имя:</strong> {userProfile?.name || 'Не указано'}</p>
                  <p><strong>Телефон:</strong> {formatPhoneDisplay(userProfile?.phoneNumber)}</p>
                </div>
                
                <div className={styles.bonusInfo}>
                  <h3>Ваши бонусы</h3>
                  <div className={styles.bonusAmount}>
                    {userProfile?.bonusInfo?.currentAmount || 0} баллов
                  </div>
                </div>
                
                <button onClick={handleLogout} className={styles.logoutButton}>
                  Выйти
                </button>
              </div>
              
              <div className={styles.ordersSection}>
                <h2 className={styles.subtitle}>История заказов</h2>
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
                          <div className={styles.orderItems}>{order.items} товара</div>
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
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
} 