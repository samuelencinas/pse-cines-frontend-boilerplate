import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import type { Role } from '../types/auth.types';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: Role[];
}

// LAB 6: Usabilidad — guard de rutas: si el usuario no está autenticado lo
// mandamos a /login conservando la ruta de origen para volver tras login.
// Si está autenticado pero no tiene rol suficiente, mostramos /forbidden
// en vez de un 404 en blanco para que la UX sea explicativa.
export const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (roles && roles.length > 0 && !hasRole(...roles)) {
    return <Navigate to="/forbidden" replace />;
  }
  return <>{children}</>;
};
