import Catalog from '@/components/Catalog';
import { Metadata } from 'next';

// Добавляем метаданные для страницы
export const metadata: Metadata = {
  title: 'Авторские маффины | Muffme',
  description: 'Выбирайте из нашей коллекции авторских маффинов - уникальные вкусы, созданные шеф-кондитерами',
};

// Включаем ISR - данные будут обновляться раз в час или по требованию
export const revalidate = 3600; // 1 час в секундах

// Функция для получения данных продуктов с сервера
async function getProducts() {
  try {
    // Используем относительный URL, так как запрос идет на стороне сервера
    const apiBaseUrl = process.env.API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiBaseUrl}/products`, {
      next: { revalidate }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    // В случае ошибки возвращаем пустой массив или демо-данные
    return [];
  }
}

// Страница маффинов с ISR
export default async function AuthorMuffinsPage() {
  // Получаем данные на сервере
  const products = await getProducts();
  
  // Передаем данные как проп компоненту Catalog
  // Теперь Catalog - это клиентский компонент
  return <Catalog products={products} />;
} 