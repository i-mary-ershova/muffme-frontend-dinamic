// Утилиты для работы с аутентификацией через Bearer-токен

// Ключи для хранения в localStorage
const AUTH_TOKEN_KEY = 'auth_token';
const USER_PROFILE_KEY = 'user_profile';
const USER_ID_KEY = 'user_id';

// Helper function to safely check if we're on the client
const isClient = (): boolean => {
  return typeof window !== 'undefined';
};

// Получить токен из localStorage
export const getAuthToken = (): string | null => {
  if (!isClient()) {
    return null;
  }
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

// Сохранить токен в localStorage
export const setAuthToken = (token: string): void => {
  if (!isClient()) {
    return;
  }
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

// Удалить токен из localStorage (выход)
export const removeAuthToken = (): void => {
  if (!isClient()) {
    return;
  }
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_PROFILE_KEY);
  localStorage.removeItem(USER_ID_KEY);
};

// Сохранить ID пользователя
export const setUserId = (id: number | string): void => {
  if (!isClient()) {
    return;
  }
  localStorage.setItem(USER_ID_KEY, id.toString());
};

// Получить ID пользователя
export const getUserId = (): string | null => {
  if (!isClient()) {
    return null;
  }
  return localStorage.getItem(USER_ID_KEY);
};

// Сохранить профиль пользователя
export const setUserProfile = (profile: any): void => {
  if (!isClient()) {
    return;
  }
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  // Если в профиле есть ID, сохраняем его отдельно для быстрого доступа
  if (profile && profile.id) {
    setUserId(profile.id);
  }
};

// Получить профиль пользователя
export const getUserProfile = (): any | null => {
  if (!isClient()) {
    return null;
  }
  const profile = localStorage.getItem(USER_PROFILE_KEY);
  return profile ? JSON.parse(profile) : null;
};

// Проверка, авторизован ли пользователь
export const isAuthenticated = (): boolean => {
  if (!isClient()) {
    return false;
  }
  return !!getAuthToken() && !!getUserId();
};

// Получение заголовков авторизации для запросов
export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return token 
    ? { 'Authorization': `Bearer ${token}` }
    : {};
}; 