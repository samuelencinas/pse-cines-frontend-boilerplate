import axios from 'axios';

// Cliente API genérico (instancia de Axios predefinida)
export const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
});

// Inicialización del token JWT
const TOKEN_KEY = 'auth_token';

// Almacenamiento del token JWT
export const tokenStorage = {
  get(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  set(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
  },
};

// Interceptor para añadir el token como cabecera a cada petición
api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

// Si el backend responde 401, vaciamos el token para que la app vuelva al login.
// (Logout forzado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      tokenStorage.clear();
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  }
);
