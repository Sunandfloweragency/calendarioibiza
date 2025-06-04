import React from 'react';
import { useData } from '../contexts/DataContext';
import { 
  ExclamationTriangleIcon, 
  WifiIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const ConnectionStatus: React.FC = () => {
  const { connectionStatus, loading } = useData();
  
  // No mostrar nada durante la carga o si la conexión está bien
  if (loading || connectionStatus === 'supabase') {
    return null;
  }

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'cms-only':
        return {
          icon: WifiIcon,
          title: 'Modo Offline',
          message: 'Funcionando con datos locales',
          bgColor: 'bg-amber-500/90',
          borderColor: 'border-amber-400',
          iconColor: 'text-amber-100'
        };
      case 'error':
        return {
          icon: ExclamationTriangleIcon,
          title: 'Error de Conexión',
          message: 'Algunos datos no están disponibles',
          bgColor: 'bg-red-500/90',
          borderColor: 'border-red-400',
          iconColor: 'text-red-100'
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  const { icon: Icon, title, message, bgColor, borderColor, iconColor } = config;

  return (
    <div className={`fixed top-4 right-4 z-50 ${bgColor} backdrop-blur-sm rounded-lg border ${borderColor} p-3 shadow-lg max-w-sm`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white">{title}</h4>
          <p className="text-xs text-white/90 mt-1">{message}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="text-white/70 hover:text-white transition-colors"
          title="Reintentar conexión"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
      
      {connectionStatus === 'error' && (
        <button
          onClick={() => window.location.reload()}
          className="mt-2 w-full text-xs bg-white/20 hover:bg-white/30 text-white rounded px-2 py-1 transition-colors"
        >
          Reintentar
        </button>
      )}
    </div>
  );
};

export default ConnectionStatus; 