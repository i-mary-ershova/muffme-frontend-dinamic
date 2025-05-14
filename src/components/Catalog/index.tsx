'use client';

import styles from './Catalog.module.scss';
import ProductCard from '../ProductCard';
import { useEffect, useState } from 'react';
import { api } from '@/utils/api'; // Импортируем API-клиент

// Интерфейс для типизации данных продукта, соответствующий структуре с бэкенда
interface Product {
  id: number;
  name: string;        // Изменено с title на name (соответствует схеме Prisma)
  pictureURL: string;  // Изменено с imageSrc на pictureURL (соответствует схеме Prisma)
  price: number;
  description?: string;
  ingredients?: string[];
}

// Интерфейс для пропсов компонента
interface CatalogProps {
  products?: Product[];
  loading?: boolean;
}

export const Catalog = ({ products: initialProducts, loading: initialLoading }: CatalogProps) => {
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(initialProducts || []);
  const [loading, setLoading] = useState(initialLoading || !initialProducts?.length);

  useEffect(() => {
    // Если продукты не переданы через пропсы, загружаем их через API
    if (!initialProducts || initialProducts.length === 0) {
      fetchProducts();
    }
  }, [initialProducts]);

  // Обновляем стейт, когда пропсы меняются
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setCatalogProducts(initialProducts);
      setLoading(false);
    }
  }, [initialProducts]);

  // Функция для преобразования пути к изображению в полный URL для API медиа
  const getImageUrl = (imagePath: string | null | undefined): string => {
    if (!imagePath) return '/images/placeholder.png';
    
    // Базовый URL API
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    // Если путь уже содержит полный URL, используем его напрямую
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Если путь начинается с '/images/', считаем его статическим
    if (imagePath.startsWith('/images/')) {
      return imagePath;
    }

    const cleanPath = imagePath.replace(/\//g, '%2F');
    
    // Формируем URL для эндпоинта /media/picture/
    return `${apiBaseUrl}/media/picture/${cleanPath}`;
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Получаем продукты с API
      const data = await api.get('/products', false);
      setCatalogProducts(data);
    } catch (error) {
      console.error('Ошибка при загрузке продуктов:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h1 className={styles.title}>Авторские маффины</h1>
        {loading ? (
          <div>
            <div className={styles.grid}>
              {[...Array(8)].map((_, index) => (
                <ProductCard
                  key={`placeholder-${index}`}
                  id={0}
                  imageSrc="/images/placeholder.png"
                  title="Загрузка..."
                  price={0}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.grid}>
            {catalogProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                imageSrc={getImageUrl(product.pictureURL)}
                title={product.name || 'Без названия'}
                price={product.price}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// Пустые дефолтные пропсы (загрузка будет происходить через API)
Catalog.defaultProps = {
  products: [],
  loading: false
};

export default Catalog; 

