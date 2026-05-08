import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AuthApi } from '../api/auth.api';
import { tokenStorage } from '../api/client';
import type { AuthUser, Role } from '../types/auth.types';

// Context de autenticación que provee el estado del usuario y funciones para login, registro y logout.
interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  hasRole: (...roles: Role[]) => boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Decodifica el payload de un JWT sin verificar firma — sólo para extraer
// el rol y el email para la UI. La validación real ocurre en el backend.
function decodeJwt(token: string): AuthUser | null {
  try {
    const payload = token.split('.')[1];
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    if (typeof json.sub !== 'number' || typeof json.email !== 'string' || typeof json.role !== 'string') {
      return null;
    }
    return { id: json.sub, email: json.email, role: json.role as Role };
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = tokenStorage.get();
    return token ? decodeJwt(token) : null;
  });

  // Si el interceptor detecta 401, nos avisa para limpiar el estado.
  useEffect(() => {
    const onLogout = () => setUser(null);
    window.addEventListener('auth:logout', onLogout);
    return () => window.removeEventListener('auth:logout', onLogout);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await AuthApi.login(email, password);
    if (!res.success || !res.token) {
      throw new Error(res.error || 'Error al iniciar sesión');
    }
    tokenStorage.set(res.token);
    setUser(decodeJwt(res.token));
  };

  const register = async (email: string, password: string) => {
    const res = await AuthApi.register(email, password);
    if (!res.success) {
      throw new Error(res.error || 'Error al registrar el usuario');
    }
    // Tras registrar, hacemos login automáticamente para mejor UX.
    await login(email, password);
  };

  // "Logout" entre comillas (solo borra el token, no lo invalida, lo que os conté en clase...)
  const logout = () => {
    tokenStorage.clear();
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      hasRole: (...roles: Role[]) => user !== null && roles.includes(user.role),
      login,
      register,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el Context
export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
