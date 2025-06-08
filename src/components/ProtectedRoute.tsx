import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './common/LoadingSpinner';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-black">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-brand-gray mt-4">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && currentUser.role !== 'admin') {
    console.log('Usuario no admin intentando acceder a ruta de admin, redirigiendo a dashboard de usuario');
    return <Navigate to="/user/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute; 