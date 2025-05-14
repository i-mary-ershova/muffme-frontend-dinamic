'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import styles from './Register.module.scss';
import { api } from '@/utils/api';
import { setAuthToken, setUserProfile, setUserId, isAuthenticated } from '@/utils/auth';
import Header from '@/components/Header';

export default function RegisterPage() {
  const router = useRouter();
  
  // Состояния формы
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  
  // Состояния для верификации
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  
  // Состояния для UI/UX
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Устанавливаем флаг клиентского рендеринга
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Перенаправляем на профиль, если пользователь уже авторизован
  useEffect(() => {
    if (isClient && isAuthenticated()) {
      router.push('/profile');
    }
  }, [router, isClient]);

  // Обработчики изменения полей формы
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleBirthDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBirthDate(e.target.value);
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setPhoneNumber(input);

    const digitsOnly = input.replace(/\D/g, "");
    const phone = parsePhoneNumberFromString(digitsOnly, "RU");

    if (phone?.isValid()) {
      setError(null);
      setFormattedPhone(phone.number);
    } else {
      setFormattedPhone("");
    }
  };

  const handleCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setVerificationCode(value);
  };

  // Запрос на отправку кода подтверждения
  const handleRequestCode = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!formattedPhone || formattedPhone.length !== 12) {
      setError("Введите полный номер телефона");
      setLoading(false);
      return;
    }

    if (!name.trim()) {
      setError("Введите ваше имя");
      setLoading(false);
      return;
    }

    if (!birthDate) {
      setError("Введите дату рождения");
      setLoading(false);
      return;
    }

    try {
      const data = await api.requestCode(formattedPhone);
      console.log("Код отправлен:", data);

      setSuccess(true);
      setCodeSent(true);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Проверка кода подтверждения и регистрация пользователя
  const handleVerifyCode = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Сначала верифицируем код
      const verifyData = await api.verifyCode(formattedPhone, verificationCode);
      
      // Затем регистрируем пользователя
      const userData = {
        name: name,
        phoneNumber: formattedPhone,
        birthDate: birthDate
      };
      
      const registerData = await api.registerUser(userData);
      console.log("Регистрация успешна:", registerData);
      
      // Сохраняем токен и данные пользователя
      if (registerData.access_token && registerData.user && registerData.user.id) {
        setAuthToken(registerData.access_token);
        setUserProfile(registerData.user);
        setUserId(registerData.user.id);
        
        setSuccess(true);
        setCodeVerified(true);
        
        // Инициируем событие для синхронизации между компонентами
        window.dispatchEvent(new Event('auth-state-changed'));
        
        // Перенаправляем на профиль после успешной регистрации
        setTimeout(() => {
          router.push('/profile');
        }, 2000);
      } else {
        throw new Error("Неполные данные получены от сервера");
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Функция для форматирования номера телефона
  const formatPhoneDisplay = (phone: string): string => {
    const part1 = phone.slice(2, 5);
    const part2 = phone.slice(5, 8);
    const part3 = phone.slice(8, 10);
    const part4 = phone.slice(10, 12);
    return `+7 (${part1}) ${part2} ${part3} ${part4}`;
  };

  // Обработчик отправки формы
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (codeSent) {
      if (verificationCode && !loading) {
        handleVerifyCode();
      }
    } else {
      handleRequestCode();
    }
  };

  return (
    <>
        <div className={styles.container}>
          <h1 className={styles.title}>Регистрация</h1>
          
          <div className={styles.formWrapper}>
            <form onSubmit={handleSubmit} className={styles.form}>
              {!codeSent ? (
                // Первый шаг - ввод личных данных
                <>
                  <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>Имя</label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={handleNameChange}
                      className={styles.input}
                      placeholder="Ваше имя"
                      required
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="birthDate" className={styles.label}>Дата рождения</label>
                    <input
                      id="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={handleBirthDateChange}
                      className={styles.input}
                      required
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.label}>Номер телефона</label>
                    <input
                      id="phone"
                      type="text"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      className={styles.input}
                      placeholder="+7 (___) ___ __ __"
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className={styles.button}
                    disabled={!name || !birthDate || !formattedPhone || loading}
                  >
                    {loading ? "Отправка..." : "Получить код"}
                  </button>
                </>
              ) : (
                // Второй шаг - верификация кода
                <>
                  <p className={styles.verifyText}>
                    На номер {formatPhoneDisplay(formattedPhone)} отправлен код подтверждения
                  </p>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="code" className={styles.label}>Код подтверждения</label>
                    <input
                      id="code"
                      type="text"
                      value={verificationCode}
                      onChange={handleCodeChange}
                      className={styles.input}
                      placeholder="Введите 4 цифры"
                      maxLength={4}
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className={styles.button}
                    disabled={!verificationCode || loading}
                  >
                    {loading ? "Проверка..." : "Зарегистрироваться"}
                  </button>
                  
                  <p className={styles.resetPhone} onClick={() => setCodeSent(false)}>
                    Изменить номер телефона
                  </p>
                </>
              )}
              
              {error && <p className={styles.error}>{error}</p>}
              {success && codeVerified && <p className={styles.success}>Регистрация успешна! Переход в личный кабинет...</p>}
            </form>
            
            <div className={styles.loginLink}>
              <p>Уже есть аккаунт?</p>
              <button onClick={() => router.push('/')} className={styles.linkButton}>
                Войти
              </button>
            </div>
          </div>
        </div>
    </>
  );
} 