import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

const DataPersistence: React.FC = () => {
  const location = useLocation();
  const { 
    events, djs, clubs, promoters, 
    loading, connectionStatus, 
    refreshAllData 
  } = useData();
  const previousLocationRef = useRef<string>('');
  const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Función para verificar la integridad de los datos
  const checkDataIntegrity = () => {
    const totalItems = events.length + djs.length + clubs.length + promoters.length;
    
    // Si no hay datos y no estamos cargando, intentar recuperar
    if (!loading && totalItems === 0 && connectionStatus !== 'loading') {
      console.log('🔧 DataPersistence - Detectada pérdida de datos, intentando recuperar...');
      refreshAllData();
    }
  };

  // Verificar datos cuando cambia la ubicación
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Solo verificar si realmente cambiamos de página
    if (previousLocationRef.current !== currentPath) {
      console.log('🧭 DataPersistence - Navegación detectada:', {
        from: previousLocationRef.current || 'inicial',
        to: currentPath,
        dataState: {
          events: events.length,
          djs: djs.length,
          clubs: clubs.length,
          promoters: promoters.length,
          loading,
          connectionStatus
        }
      });

      // Verificar integridad después de un pequeño delay
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
      
      checkTimeoutRef.current = setTimeout(() => {
        checkDataIntegrity();
      }, 500);

      previousLocationRef.current = currentPath;
    }
  }, [location.pathname, events.length, djs.length, clubs.length, promoters.length, loading, connectionStatus, refreshAllData]);

  // Verificación periódica de integridad (menos frecuente)
  useEffect(() => {
    const interval = setInterval(() => {
      checkDataIntegrity();
    }, 30000); // Cada 30 segundos

    return () => clearInterval(interval);
  }, [events.length, djs.length, clubs.length, promoters.length, loading, connectionStatus, refreshAllData]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
    };
  }, []);

  // Este componente no renderiza nada visualmente
  return null;
};

export default DataPersistence; 