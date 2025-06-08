import React from 'react';
import { useData } from '../../contexts/DataContext';

const ConnectionStatus: React.FC = () => {
  const { connectionStatus } = useData();

  if (connectionStatus === 'supabase' || connectionStatus === 'loading') {
    return null; // No mostrar nada cuando todo está funcionando bien
  }

  if (connectionStatus === 'localStorage') {
    return (
      <div className="fixed top-20 right-4 z-50 max-w-sm">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 shadow-lg animate-fade-in">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-800 font-medium">Modo offline</p>
              <p className="text-xs text-amber-700 mt-1">
                Funcionando con datos locales
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (connectionStatus === 'error') {
    return (
      <div className="fixed top-20 right-4 z-50 max-w-sm">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 shadow-lg animate-fade-in">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800 font-medium">Error de conexión</p>
              <p className="text-xs text-red-700 mt-1">
                Algunos datos pueden no estar disponibles
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ConnectionStatus; 