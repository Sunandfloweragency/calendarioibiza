import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

const DataPersistence: React.FC = () => {
  const location = useLocation();
  const { 
    events, djs, clubs, promoters, 
    loading
  } = useData();
  const previousLocationRef = useRef<string>('');

  // Verificar datos cuando cambia la ubicación
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Solo verificar si realmente cambiamos de página
    if (previousLocationRef.current !== currentPath) {
      if (process.env.NODE_ENV === 'development' && previousLocationRef.current) {
        console.log('🧭 DataPersistence - Navegación:', {
          to: currentPath,
          events: events.length,
          djs: djs.length,
          clubs: clubs.length,
          promoters: promoters.length
        });
      }

      previousLocationRef.current = currentPath;
    }
  }, [location.pathname, events.length, djs.length, clubs.length, promoters.length, loading]);

  // Este componente no renderiza nada visualmente
  return null;
};

export default DataPersistence; 