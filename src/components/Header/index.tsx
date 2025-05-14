'use client';

import { useState, useEffect, useRef } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useRouter, usePathname } from 'next/navigation';

import styles from './Header.module.scss';
import Login from "../Login";
import { api } from "../../utils/api";
import { isAuthenticated, setAuthToken, setUserProfile, setUserId, removeAuthToken } from "../../utils/auth";

export default function Header() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    
    // Add state for client-side rendering detection
    const [isClient, setIsClient] = useState(false);
    
    // Перенесенные состояния из компонента Login
    const [phoneNumber, setPhoneNumber] = useState("");
    const [formattedPhone, setFormattedPhone] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [verificationCode, setVerificationCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [codeSent, setCodeSent] = useState(false);
    const [codeVerified, setCodeVerified] = useState(false);
    
    // Mark when component is mounted on client
    useEffect(() => {
        setIsClient(true);
    }, []);
    
    // Проверяем авторизацию при загрузке и при изменении пути
    useEffect(() => {
        const checkAuth = () => {
            const authenticated = isAuthenticated();
            console.log('Проверка авторизации:', authenticated); // Отладочный вывод
            setCodeVerified(authenticated);
        };

        // Only check auth on client side
        if (isClient) {
            // Проверяем при монтировании компонента
            checkAuth();

            // Также создаем обработчик события storage для синхронизации между вкладками
            const handleStorageChange = (event: StorageEvent) => {
                if (event.key === 'auth_token' || event.key === 'user_id') {
                    checkAuth();
                }
            };

            // Обработчик для слушателя события auth-state-changed
            const handleAuthStateChanged = () => {
                checkAuth();
            };

            // Добавляем слушатели событий
            window.addEventListener('storage', handleStorageChange);
            window.addEventListener('auth-state-changed', handleAuthStateChanged);

            // Очищаем слушатели при размонтировании
            return () => {
                window.removeEventListener('storage', handleStorageChange);
                window.removeEventListener('auth-state-changed', handleAuthStateChanged);
            };
        }
    }, [pathname, isClient]); // Перепроверяем при изменении пути и когда компонент становится клиентским

    // Закрываем мобильное меню при изменении маршрута
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Обработчик для закрытия мобильного меню при клике вне его
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && 
                !(event.target as Element).closest(`.${styles.burgerButton}`)) {
                setIsMobileMenuOpen(false);
            }
        };

        if (isMobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobileMenuOpen, styles.burgerButton]);

    // Сбрасываем верификацию кода при закрытии виджета, если пользователь уже авторизован
    useEffect(() => {
        if (!isLoginOpen && codeVerified) {
            // Сбрасываем только те состояния, которые должны быть сброшены
            // при успешной авторизации
            setVerificationCode("");
            setError(null);
            setSuccess(false);
        }
    }, [isLoginOpen, codeVerified]);

    // Функция для проверки авторизации
    const checkAuth = () => {
        // Only check auth on client
        if (typeof window === 'undefined') {
            return false;
        }
        return isAuthenticated();
    };

    const toggleLogin = (e?: React.MouseEvent) => {
        // Предотвращаем всплытие события, чтобы избежать немедленного закрытия
        // виджета при клике на кнопку
        if (e) {
            e.stopPropagation();
        }
        
        // Проверяем статус авторизации. Если пользователь уже авторизован,
        // перенаправляем его в личный кабинет вместо открытия окна авторизации
        if (checkAuth()) {
            router.push('/profile');
            return;
        }
        
        setIsLoginOpen(prev => !prev);
        // Закрываем мобильное меню, если оно открыто
        if (isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prev => !prev);
    };

    // Обработчики для управления состоянием логина
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/\D/g, '').slice(0, 4);
        setVerificationCode(value);
    };

    const handleRequestCode = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        if (!formattedPhone || formattedPhone.length !== 12) {
            setError("Введите полный номер телефона");
            setLoading(false);
            return;
        }

        console.log("Отправляем номер:", formattedPhone);

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

    const handleVerifyCode = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const data = await api.verifyCode(formattedPhone, verificationCode);
            console.log("Верификация успешна:", data);

            // Сохраняем токен и данные пользователя
            if (data.access_token && data.user && data.user.id) {
                setAuthToken(data.access_token);
                setUserProfile(data.user);
                setUserId(data.user.id); // Явно сохраняем ID пользователя
                
                setSuccess(true);
                setCodeVerified(true);
                
                // Инициируем событие для синхронизации между компонентами
                window.dispatchEvent(new Event('auth-state-changed'));
                
                // Закрываем виджет после успешной авторизации через некоторое время
                setTimeout(() => {
                    setIsLoginOpen(false);
                    router.push('/profile');
                }, 2000);
            } else {
                throw new Error("Неполные данные получены от сервера");
            }
        } catch (error) {
            setError((error as Error).message);
            setCodeVerified(false);
        } finally {
            setLoading(false);
        }
    };

    // Выход из системы
    const handleLogout = () => {
        console.log('Выход из системы');
        // Удаляем данные авторизации из localStorage
        removeAuthToken();
        
        // Сбрасываем локальное состояние
        setCodeVerified(false);
        setVerificationCode('');
        setCodeSent(false);
        setSuccess(false);
        setError(null);
        
        // Инициируем событие для синхронизации между компонентами
        window.dispatchEvent(new Event('auth-state-changed'));
        
        // Закрываем мобильное меню, если оно открыто
        if (isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }
        
        // Перенаправляем на главную страницу после выхода
        router.push('/');
    };

    // Функция форматирования телефона для отображения
    const formatPhoneDisplay = (phone: string): string => {
        const part1 = phone.slice(2, 5);
        const part2 = phone.slice(5, 8);
        const part3 = phone.slice(8, 10);
        const part4 = phone.slice(10, 12);
        return `+7 (${part1}) ${part2} ${part3} ${part4}`;
    };

    return (
        <>
            <header className={styles.header}>
                <div className={styles.container}>
                    <Link href="/" className={styles.logo_img}>
                        <Image src="/icons/logo.svg" alt="logo" fill
                            style={{ objectFit: 'contain' }} />
                    </Link>
                    
                    {/* Бургер иконка для мобильной версии */}
                    <button 
                        className={`${styles.burgerButton} ${isMobileMenuOpen ? styles.active : ''}`} 
                        onClick={toggleMobileMenu}
                        aria-label="Меню"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                
                    {/* Навигация - будет скрыта в мобильной версии */}
                    <nav className={`${styles.navigation} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`} ref={mobileMenuRef}>
                        <div className={styles.navigationLinks}>
                            <Link href="/about">О нас</Link>
                            <Link href="/preorder">Как сделать предзаказ</Link>
                            {/* Добавляем текстовые ссылки для мобильного меню */}
                            {isClient && checkAuth() ? (
                                <>
                                    <Link href="/profile" className={`${styles.mobileLink}`}>Личный кабинет</Link>
                                    {/* <button 
                                        onClick={handleLogout} 
                                        className={`${styles.mobileLink} ${styles.mobileButton}`}
                                    >
                                        Выйти
                                    </button> */}
                                </>
                            ) : (
                                <button 
                                    onClick={toggleLogin} 
                                    className={`${styles.mobileLink} ${styles.mobileButton}`}
                                >
                                    Личный кабинет
                                </button>
                            )}
                            <Link href="/cart" className={`${styles.mobileLink}`}>Корзина</Link>
                        </div>
                        
                        <div className={styles.icons}>
                            {isClient && checkAuth() ? (
                                <div className={styles.userMenu}>
                                    <Link href="/profile" className={styles.loginButton}>
                                        <Image 
                                            src="/icons/LK.svg" 
                                            alt="Личный кабинет" 
                                            width={30} 
                                            height={30} 
                                            className={styles.iconsIcons} 
                                        />
                                    </Link>
                                   
                                </div>
                            ) : (
                                <button 
                                    className={styles.loginButton} 
                                    onClick={toggleLogin}
                                >
                                    <Image 
                                        src="/icons/LK.svg" 
                                        alt="Личный кабинет" 
                                        width={30} 
                                        height={30} 
                                        className={styles.iconsIcons} 
                                    />
                                </button>
                            )}
                            
                            <Link href="/cart">
                                <Image src="/icons/cart.svg" alt="Корзина" width={30} height={30} className={styles.iconsIcons} />
                            </Link>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Передаем все состояния и обработчики в компонент Login */}
            {isLoginOpen && (
                <Login 
                    onClose={toggleLogin} 
                    phoneNumber={phoneNumber}
                    formattedPhone={formattedPhone}
                    error={error}
                    verificationCode={verificationCode}
                    loading={loading}
                    success={success}
                    codeSent={codeSent}
                    codeVerified={codeVerified}
                    checkAuth={checkAuth}
                    onPhoneChange={handlePhoneChange}
                    onCodeChange={handleCodeChange}
                    onRequestCode={handleRequestCode}
                    onVerifyCode={handleVerifyCode}
                    onResetCodeSent={() => setCodeSent(false)}
                    formatPhoneDisplay={formatPhoneDisplay}
                />
            )}
        </>
    );
}