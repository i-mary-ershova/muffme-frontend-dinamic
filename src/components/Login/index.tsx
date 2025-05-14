import React, { useRef, useEffect, useState } from "react";
import styles from "./Login.module.scss";
import { useRouter } from "next/navigation";

interface LoginProps {
  onClose: () => void;
  phoneNumber: string;
  formattedPhone: string;
  error: string | null;
  verificationCode: string;
  loading: boolean;
  success: boolean;
  codeSent: boolean;
  codeVerified: boolean;
  checkAuth: () => boolean;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRequestCode: () => void;
  onVerifyCode: () => void;
  onResetCodeSent: () => void;
  formatPhoneDisplay: (phone: string) => string;
}

const Login: React.FC<LoginProps> = ({
  onClose,
  phoneNumber,
  formattedPhone,
  error,
  verificationCode,
  loading,
  success,
  codeSent,
  codeVerified,
  checkAuth,
  onPhoneChange,
  onCodeChange,
  onRequestCode,
  onVerifyCode,
  onResetCodeSent,
  formatPhoneDisplay
}) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Set client-side indicator when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Если пользователь авторизован, перенаправляем на страницу профиля и закрываем окно
  useEffect(() => {
    if (isClient && checkAuth()) {
      router.push('/profile');
      onClose();
      return;
    }
  }, [checkAuth, router, onClose, isClient]);

  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Обработчик нажатия клавиши Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Предотвращаем перезагрузку страницы
      
      // Если уже отправлен код, вызываем проверку кода
      if (codeSent) {
        if (verificationCode && !loading) {
          onVerifyCode();
        }
      } 
      // Иначе запрашиваем код
      else {
        if (formattedPhone && !loading) {
          onRequestCode();
        }
      }
    }
  };

  // Устанавливаем фокус на соответствующее поле ввода при рендере
  useEffect(() => {
    if (codeSent) {
      codeInputRef.current?.focus();
    } else {
      phoneInputRef.current?.focus();
    }
  }, [codeSent]);

  return (
    <div className={styles.container} onClick={handleContainerClick}>
      <div className={styles.innerContainer} onClick={handleContainerClick}>
        <div className={styles.box} ref={boxRef}>
          {/*<button className={styles.closeButton} onClick={onClose}>×</button>*/}
          <h1 className={styles.title}>Вход</h1>

          {/* Ввод номера телефона */}
          {!codeSent && 
          <input
            type="text"
            placeholder="Номер телефона"
            value={phoneNumber}
            onChange={onPhoneChange}
            onKeyDown={handleKeyDown}
            className={styles.input}
            ref={phoneInputRef}
          />
          } 

          {/* Поле ввода кода показываем только если код отправлен */}
          {codeSent && 
          <input
              type="text"
              placeholder="Введите код"
              value={verificationCode}
              onChange={onCodeChange}
              onKeyDown={handleKeyDown}
              className={styles.input}
              ref={codeInputRef}
            />
          }

          {/* Кнопка "Получить код" */}
          {!codeSent && (
            <button 
              className={styles.button} 
              disabled={!formattedPhone || loading} 
              onClick={onRequestCode}
            >
              {loading ? "Отправка..." : "Получить код"}
            </button>
          )}

          {/* Кнопка "Войти", доступна только если код отправлен */}
          {codeSent && (
            <button 
              className={styles.button} 
              disabled={!verificationCode || loading} 
              onClick={onVerifyCode}
            >
              {loading ? "Проверка..." : "Войти"}
            </button>
          )}

          {error && <p className={styles.error}>{error}</p>}
          {success && codeSent && !verificationCode &&  <p className={styles.text}>Код отправлен на {formatPhoneDisplay(formattedPhone)}</p>}
          {success && codeSent && !verificationCode &&  <p className={styles.link} onClick={onResetCodeSent}>Неверный номер телефона?</p>}
          {success && codeVerified && <p className={styles.text}>Переход в личный кабинет...</p>}

          {!codeSent && <p className={styles.text}>У меня еще нет аккаунта</p>}
          {!codeSent && <a href="/register" className={styles.link}>Зарегистрироваться</a>}
        </div>
      </div>
    </div>
  );
};

export default Login;
