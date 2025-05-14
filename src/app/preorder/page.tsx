'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { parsePhoneNumberFromString } from "libphonenumber-js";
import styles from './Preorder.module.scss';

export default function OrderPage() {
  // Состояния для полей формы
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [contactError, setContactError] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Проверка валидности контактных данных
  const validateContact = (value: string): boolean => {
    // Очищаем предыдущую ошибку
    setContactError(null);
    
    // Если поле пустое, не показываем ошибку
    if (!value.trim()) {
      return false;
    }
    
    // Проверка на Email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(value)) {
      return true;
    }
    
    // Проверка на телефон
    const phone = parsePhoneNumberFromString(value, "RU");
    if (phone?.isValid()) {
      return true;
    }
    
    // Проверка на имя пользователя Telegram
    const telegramRegex = /^@?[a-zA-Z]+[a-zA-Z0-9_]{4,31}$/;
    if (telegramRegex.test(value)) {
      return true;
    }
    
    // Если не соответствует ни одному формату
    setContactError('Укажите корректный email, телефон или @username телеграма');
    return false;
  };

  // Обработчик изменения контактных данных
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setContact(newValue);
    validateContact(newValue);
  };

  // Проверка валидности формы
  useEffect(() => {
    const isContactValid = validateContact(contact);
    setIsFormValid(
      name.trim() !== '' && 
      isContactValid && 
      message.trim() !== ''
    );
  }, [name, contact, message]);

  // Обработка отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) return;
    
    // Здесь будет логика отправки данных на сервер
    console.log('Отправка формы:', { name, contact, message });
    
    // Показываем сообщение об успешной отправке
    setIsSubmitted(true);
    
    // Сбрасываем форму после отправки
    setName('');
    setContact('');
    setContactError(null);
    setMessage('');
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Предзаказ</h1>
          
          <div className={styles.content}>
            <div className={styles.infoSection}>
              <h2 className={styles.subtitle}>Вам сюда, если Вам нужен:</h2>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <span className={styles.bold}>Большой заказ</span> — 
                    с удовольствием приготовим на ваш праздник много вкуснейших маффинов,
                    чтобы хватило каждому гостю — и даже немного больше!
                </li>
                <li className={styles.listItem}>
                  <span className={styles.bold}>Эксклюзивные ингредиенты</span> — мечтаете об уникальных вкусах? Добавим эксклюзивные добавки и создадим
                  необычные сочетания — такие, каких не найти в обычном меню.
                </li>
                <li className={styles.listItem}>
                  <span className={styles.bold}>Индивидуальное оформление</span> — Мы разработаем дизайн, который идеально подойдёт
                    под тематику вашего события или подчеркнёт стиль компании.
                </li>
              </ul>

              
              <p className={styles.text}>Просто заполните форму справа, расскажите о своих желаниях —
                и уже в течение рабочего дня наш менеджер свяжется с вами,
                чтобы обсудить все детали и сроки доставки.
              </p>
              <p className={styles.text}>
                Мы здесь, чтобы воплотить любые кулинарные фантазии!
              </p>
            </div>
            
            <div className={styles.formSection}>
              
              {isSubmitted ? (
                <div className={styles.successMessage}>
                  <p>Спасибо за вашу заявку!</p>
                  <p>Мы свяжемся с вами в ближайшее время.</p>
                  <button 
                    className={styles.button} 
                    onClick={() => setIsSubmitted(false)}
                  >
                    Оставить еще заявку
                  </button>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit}>
                  <div className={styles.formGroup}>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={styles.input}
                      placeholder="Ваше имя"
                      required
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <input
                      id="contact"
                      type="text"
                      value={contact}
                      onChange={handleContactChange}
                      className={`${styles.input} ${contactError ? styles.inputError : ''}`}
                      placeholder="Почта, телефон или телеграм"
                      required
                    />
                    {contactError && <p className={styles.errorMessage}>{contactError}</p>}
                  </div>
                  
                  <div className={styles.formGroup}>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={styles.textarea}
                      placeholder="Опишите ваш заказ, укажите особые пожелания и сроки"
                      rows={5}
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className={`${styles.button} ${!isFormValid ? styles.buttonDisabled : ''}`}
                    disabled={!isFormValid}
                  >
                    Оставить заявку
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 