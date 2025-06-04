import { useMemo, useRef, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Event, DJ, Club, Promoter } from '../types/supabase';

/**
 * Hook personalizado que proporciona datos estables para evitar renders innecesarios
 * Solo actualiza las referencias cuando realmente cambian los datos
 */
export const useStableData = () => {
  const contextData = useData();
  
  // Referencias para mantener estabilidad
  const eventsRef = useRef<Event[]>([]);
  const djsRef = useRef<DJ[]>([]);
  const clubsRef = useRef<Club[]>([]);
  const promotersRef = useRef<Promoter[]>([]);
  const loadingRef = useRef<boolean>(true);
  const errorRef = useRef<string | null>(null);

  // Funciones para comparar arrays de manera profunda (por ID y fechas de actualización)
  const arraysEqual = <T extends { id: string; updatedAt?: string }>(a: T[], b: T[]): boolean => {
    if (a.length !== b.length) return false;
    
    for (let i = 0; i < a.length; i++) {
      if (a[i].id !== b[i].id || a[i].updatedAt !== b[i].updatedAt) {
        return false;
      }
    }
    return true;
  };

  // Actualizar referencias solo cuando hay cambios reales
  useEffect(() => {
    if (!arraysEqual(contextData.events, eventsRef.current)) {
      console.log('🔄 useStableData - Actualizando events:', contextData.events.length);
      eventsRef.current = [...contextData.events];
    }
  }, [contextData.events]);

  useEffect(() => {
    if (!arraysEqual(contextData.djs, djsRef.current)) {
      console.log('🔄 useStableData - Actualizando DJs:', contextData.djs.length);
      djsRef.current = [...contextData.djs];
    }
  }, [contextData.djs]);

  useEffect(() => {
    if (!arraysEqual(contextData.clubs, clubsRef.current)) {
      console.log('🔄 useStableData - Actualizando clubs:', contextData.clubs.length);
      clubsRef.current = [...contextData.clubs];
    }
  }, [contextData.clubs]);

  useEffect(() => {
    if (!arraysEqual(contextData.promoters, promotersRef.current)) {
      console.log('🔄 useStableData - Actualizando promoters:', contextData.promoters.length);
      promotersRef.current = [...contextData.promoters];
    }
  }, [contextData.promoters]);

  useEffect(() => {
    if (contextData.loading !== loadingRef.current) {
      console.log('🔄 useStableData - Actualizando loading:', contextData.loading);
      loadingRef.current = contextData.loading;
    }
  }, [contextData.loading]);

  useEffect(() => {
    if (contextData.error !== errorRef.current) {
      console.log('🔄 useStableData - Actualizando error:', contextData.error);
      errorRef.current = contextData.error;
    }
  }, [contextData.error]);

  // Datos estables memoizados
  const stableData = useMemo(() => ({
    // Arrays de datos (estables)
    events: eventsRef.current,
    djs: djsRef.current,
    clubs: clubsRef.current,
    promoters: promotersRef.current,
    
    // Estado (estable)
    loading: loadingRef.current,
    isLoading: loadingRef.current, // Alias para compatibilidad
    error: errorRef.current,
    connectionStatus: contextData.connectionStatus,
    lastDataUpdate: contextData.lastDataUpdate,
    
    // Funciones de búsqueda (siempre frescas del context)
    getEventById: contextData.getEventById,
    getDJById: contextData.getDJById,
    getClubById: contextData.getClubById,
    getPromoterById: contextData.getPromoterById,
    
    getEventBySlug: contextData.getEventBySlug,
    getDJBySlug: contextData.getDJBySlug,
    getClubBySlug: contextData.getClubBySlug,
    getPromoterBySlug: contextData.getPromoterBySlug,
    
    // Funciones de datos procesados
    getIbizaEvents: contextData.getIbizaEvents,
    getUpcomingEvents: contextData.getUpcomingEvents,
    getFeaturedEvents: contextData.getFeaturedEvents,
    
    // Funciones CRUD (siempre frescas del context)
    addEvent: contextData.addEvent,
    updateEvent: contextData.updateEvent,
    deleteEvent: contextData.deleteEvent,
    approveEvent: contextData.approveEvent,
    rejectEvent: contextData.rejectEvent,
    
    addDJ: contextData.addDJ,
    updateDJ: contextData.updateDJ,
    deleteDJ: contextData.deleteDJ,
    approveDJ: contextData.approveDJ,
    rejectDJ: contextData.rejectDJ,
    
    addClub: contextData.addClub,
    updateClub: contextData.updateClub,
    deleteClub: contextData.deleteClub,
    approveClub: contextData.approveClub,
    rejectClub: contextData.rejectClub,
    
    addPromoter: contextData.addPromoter,
    updatePromoter: contextData.updatePromoter,
    deletePromoter: contextData.deletePromoter,
    approvePromoter: contextData.approvePromoter,
    rejectPromoter: contextData.rejectPromoter,
    
    // Funciones de administración
    getPendingEvents: contextData.getPendingEvents,
    getPendingDJs: contextData.getPendingDJs,
    getPendingClubs: contextData.getPendingClubs,
    getPendingPromoters: contextData.getPendingPromoters,
    
    // Funciones de utilidad
    refreshAllData: contextData.refreshAllData,
    syncWithSupabase: contextData.syncWithSupabase
  }), [
    eventsRef.current.length,
    djsRef.current.length,
    clubsRef.current.length,
    promotersRef.current.length,
    loadingRef.current,
    errorRef.current,
    contextData.connectionStatus,
    contextData.lastDataUpdate,
    // Las funciones del context ya están memoizadas, no necesitan ser dependencies
  ]);

  return stableData;
};

/**
 * Hook específico para páginas que solo necesitan datos de lectura
 * Optimizado para evitar re-renders innecesarios
 */
export const useReadOnlyData = () => {
  const { events, djs, clubs, promoters, loading, error, connectionStatus } = useStableData();
  
  return useMemo(() => ({
    events,
    djs,
    clubs,
    promoters,
    loading,
    isLoading: loading,
    error,
    connectionStatus,
    
    // Solo funciones de lectura
    getEventById: (id: string) => events.find(e => e.id === id),
    getDJById: (id: string) => djs.find(d => d.id === id),
    getClubById: (id: string) => clubs.find(c => c.id === id),
    getPromoterById: (id: string) => promoters.find(p => p.id === id),
    
    getEventBySlug: (slug: string) => events.find(e => e.slug === slug),
    getDJBySlug: (slug: string) => djs.find(d => d.slug === slug),
    getClubBySlug: (slug: string) => clubs.find(c => c.slug === slug),
    getPromoterBySlug: (slug: string) => promoters.find(p => p.slug === slug),
    
    // Datos procesados
    approvedEvents: events.filter(e => e.status === 'approved'),
    upcomingEvents: events
      .filter(e => e.status === 'approved' && new Date(e.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    approvedDJs: djs.filter(d => d.status === 'approved'),
    approvedClubs: clubs.filter(c => c.status === 'approved'),
    approvedPromoters: promoters.filter(p => p.status === 'approved')
  }), [events, djs, clubs, promoters, loading, error, connectionStatus]);
}; 