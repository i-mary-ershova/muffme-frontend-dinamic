'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../utils/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = '/' 
}: ProtectedRouteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Проверяем аутентификацию на клиентской стороне
    const checkAuth = () => {
      const auth = isAuthenticated();
      
      if (!auth) {
        // Если пользователь не авторизован, перенаправляем на указанный маршрут
        router.replace(redirectTo);
        setAuthorized(false);
      } else {
        // Если авторизован, устанавливаем authorized = true
        setAuthorized(true);
      }
      
      setLoading(false);
    };

    checkAuth();

    // Добавляем обработчик для событий изменения состояния авторизации
    const handleAuthChange = () => {
      checkAuth();
    };

    // Слушаем кастомное событие изменения авторизации
    window.addEventListener('auth-state-changed', handleAuthChange);

    // Слушаем изменения в localStorage
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
  }, [router, redirectTo]);

  // Показываем индикатор загрузки, пока проверяем авторизацию
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Загрузка...
      </div>
    );
  }

  // Если авторизован, отображаем содержимое
  return authorized ? <>{children}</> : null;
} 