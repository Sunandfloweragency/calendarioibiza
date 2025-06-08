import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Event, DJ, Club, Promoter, User } from '../types/supabase';
import { EventData, DJData, ClubData, PromoterData, UserData } from '../types';
import { supabaseService } from '../services/supabaseService';
import { dataInitializer } from '../services/dataInitializer';

// Interface del contexto
interface UnifiedDataContextType {
  events: Event[];
  djs: DJ[];
  clubs: Club[];
  promoters: Promoter[];
  users: User[];
  loading: boolean;
  isLoading: boolean;
  error: string | null;
  connectionStatus: 'SUPABASE' | 'LOADING';
  
  // Funciones básicas
  getEventById: (id: string) => Event | undefined;
  getDJById: (id: string) => DJ | undefined;
  getClubById: (id: string) => Club | undefined;
  getPromoterById: (id: string) => Promoter | undefined;
  
  getEventBySlug: (slug: string) => Event | undefined;
  getDJBySlug: (slug: string) => DJ | undefined;
  getClubBySlug: (slug: string) => Club | undefined;
  getPromoterBySlug: (slug: string) => Promoter | undefined;
  
  // Funciones para el dashboard de usuario
  getEventsByUserId: (userId: string) => Event[];
  getDJsByUserId: (userId: string) => DJ[];
  getClubsByUserId: (userId: string) => Club[];
  getPromotersByUserId: (userId: string) => Promoter[];
  
  // Funciones CRUD
  addEvent: (eventData: Omit<EventData, 'id' | 'slug' | 'status' | 'submittedBy' | 'createdAt' | 'updatedAt'>) => Promise<Event>;
  updateEvent: (eventData: Partial<EventData> & { id: string }) => Promise<Event>;
  deleteEvent: (id: string) => Promise<void>;
  approveEvent: (id: string) => Promise<Event>;
  rejectEvent: (id: string) => Promise<Event>;
  
  addDJ: (djData: Omit<DJData, 'id' | 'slug' | 'status' | 'submittedBy' | 'createdAt' | 'updatedAt'>) => Promise<DJ>;
  updateDJ: (djData: Partial<DJData> & { id: string }) => Promise<DJ>;
  deleteDJ: (id: string) => Promise<void>;
  approveDJ: (id: string) => Promise<DJ>;
  rejectDJ: (id: string) => Promise<DJ>;
  
  addClub: (clubData: Omit<ClubData, 'id' | 'slug' | 'status' | 'submittedBy' | 'createdAt' | 'updatedAt'>) => Promise<Club>;
  updateClub: (clubData: Partial<ClubData> & { id: string }) => Promise<Club>;
  deleteClub: (id: string) => Promise<void>;
  approveClub: (id: string) => Promise<Club>;
  rejectClub: (id: string) => Promise<Club>;
  
  addPromoter: (promoterData: Omit<PromoterData, 'id' | 'slug' | 'status' | 'submittedBy' | 'createdAt' | 'updatedAt'>) => Promise<Promoter>;
  updatePromoter: (promoterData: Partial<PromoterData> & { id: string }) => Promise<Promoter>;
  deletePromoter: (id: string) => Promise<void>;
  approvePromoter: (id: string) => Promise<Promoter>;
  rejectPromoter: (id: string) => Promise<Promoter>;
  
  // Función para sincronización
  syncData: () => Promise<void>;
  
  // Función para recargar datos manualmente
  refreshData: () => Promise<void>;
  
  // Obtener estadísticas
  getStats: () => {
    totalEvents: number;
    totalDJs: number;
    totalClubs: number;
    totalPromoters: number;
    totalUsers: number;
    dataSource: 'SUPABASE' | 'LOADING';
    lastSync: Date | null;
    isLoading: boolean;
  };
}

const UnifiedDataContext = createContext<UnifiedDataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(UnifiedDataContext);
  if (context === undefined) {
    throw new Error('useData debe ser usado dentro de un UnifiedDataProvider');
  }
  return context;
};

interface UnifiedDataProviderProps {
  children: ReactNode;
}

export const UnifiedDataProvider: React.FC<UnifiedDataProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [djs, setDJs] = useState<DJ[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [promoters, setPromoters] = useState<Promoter[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para controlar la fuente de datos
  const [dataSource, setDataSource] = useState<'SUPABASE' | 'LOADING'>('LOADING');
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Verificar si hay datos en Supabase
  const checkSupabaseData = React.useCallback(async () => {
    try {
      const events = await supabaseService.getEvents();
      console.log('🔍 Verificando datos en Supabase:', events.length > 0);
      return events.length > 0;
    } catch (error) {
      console.error('Error checking Supabase data:', error);
      return false;
    }
  }, []);

  // Solo cargar datos desde Supabase
  const loadFromSupabase = React.useCallback(async () => {
    console.log('📊 Cargando datos desde Supabase...');
        setLoading(true);
    setError(null);

    try {
      const [
        supabaseEvents,
        supabaseDJs,
        supabaseClubs,
        supabasePromoters,
        supabaseUsers
      ] = await Promise.all([
        supabaseService.getEvents(),
        supabaseService.getDJs(),
        supabaseService.getClubs(),
        supabaseService.getPromoters(),
        supabaseService.getUsers()
        ]);

      const allData = {
        events: supabaseEvents || [],
        djs: supabaseDJs || [],
        clubs: supabaseClubs || [],
        promoters: supabasePromoters || [],
        users: supabaseUsers || []
      };

      console.log('✅ Datos cargados desde Supabase:', allData);

      // Actualizar estados
      setEvents(allData.events);
      setDJs(allData.djs);
      setClubs(allData.clubs);
      setPromoters(allData.promoters);
      setUsers(allData.users);
      setLastSync(new Date());
      setDataSource('SUPABASE');

      return allData;
    } catch (error) {
      console.error('Error loading from Supabase:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      throw error;
      } finally {
        setLoading(false);
      }
  }, []);

  // Cargar datos automáticamente cuando se inicia
  const loadData = React.useCallback(async () => {
    try {
      console.log('🎯 FORZANDO uso de Supabase como única fuente de datos');
      
      // Inicializar datos de ejemplo si no hay datos en Supabase
      await dataInitializer.initializeData();
      
      // Cargar todos los datos desde Supabase
      await loadFromSupabase();
      
      console.log('✅ Datos cargados exitosamente desde Supabase:', {
        eventos: events.length,
        djs: djs.length,
        clubs: clubs.length,
        promotores: promoters.length
      });
    } catch (error) {
      console.error('Error loading data:', error);
      setError(error instanceof Error ? error.message : 'Error cargando datos');
    }
  }, [loadFromSupabase, events.length, djs.length, clubs.length, promoters.length]);

  // Cargar datos al inicializar y cada 5 minutos para mantener sincronizados
  useEffect(() => {
    loadData();
    
    // Configurar recarga periódica cada 5 minutos
    const intervalId = setInterval(() => {
      console.log('🔄 Actualizando datos desde Supabase...');
      loadData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [loadData]);

  // Funciones de búsqueda
  const getEventById = React.useCallback((id: string) => events.find(e => e.id === id), [events]);
  const getDJById = React.useCallback((id: string) => djs.find(d => d.id === id), [djs]);
  const getClubById = React.useCallback((id: string) => clubs.find(c => c.id === id), [clubs]);
  const getPromoterById = React.useCallback((id: string) => promoters.find(p => p.id === id), [promoters]);

  const getEventBySlug = React.useCallback((slug: string) => events.find(e => e.slug === slug), [events]);
  const getDJBySlug = React.useCallback((slug: string) => djs.find(d => d.slug === slug), [djs]);
  const getClubBySlug = React.useCallback((slug: string) => clubs.find(c => c.slug === slug), [clubs]);
  const getPromoterBySlug = React.useCallback((slug: string) => promoters.find(p => p.slug === slug), [promoters]);

  // Funciones para el dashboard de usuario
  const getEventsByUserId = React.useCallback((userId: string) => 
    events.filter(e => e.submittedBy === userId), [events]);
  const getDJsByUserId = React.useCallback((userId: string) => 
    djs.filter(d => d.submittedBy === userId), [djs]);
  const getClubsByUserId = React.useCallback((userId: string) => 
    clubs.filter(c => c.submittedBy === userId), [clubs]);
  const getPromotersByUserId = React.useCallback((userId: string) => 
    promoters.filter(p => p.submittedBy === userId), [promoters]);

  // Funciones CRUD que usan el servicio apropiado
  const addEvent = async (eventData: Omit<EventData, 'id' | 'slug' | 'status' | 'submittedBy' | 'createdAt' | 'updatedAt'>): Promise<Event> => {
    setLoading(true);
    try {
      const newEvent = await supabaseService.addEvent(eventData as any);
      setEvents(prev => [...prev, newEvent]);
      setLastSync(new Date());
      return newEvent;
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (eventData: Partial<EventData> & { id: string }): Promise<Event> => {
    setLoading(true);
    try {
      const updatedEvent = await supabaseService.updateEvent(eventData as any);
      setEvents(prev => prev.map(event => event.id === eventData.id ? updatedEvent : event));
      setLastSync(new Date());
      return updatedEvent;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      await supabaseService.deleteEvent(id);
    setEvents(prev => prev.filter(event => event.id !== id));
      setLastSync(new Date());
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addDJ = async (djData: Omit<DJData, 'id' | 'slug' | 'status' | 'submittedBy' | 'createdAt' | 'updatedAt'>): Promise<DJ> => {
    setLoading(true);
    try {
      const newDJ = await supabaseService.addDJ(djData as any);
      setDJs(prev => [...prev, newDJ]);
      setLastSync(new Date());
      return newDJ;
    } catch (error) {
      console.error('Error adding DJ:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateDJ = async (djData: Partial<DJData> & { id: string }): Promise<DJ> => {
    setLoading(true);
    try {
      const updatedDJ = await supabaseService.updateDJ(djData as any);
      setDJs(prev => prev.map(dj => dj.id === djData.id ? updatedDJ : dj));
      setLastSync(new Date());
      return updatedDJ;
    } catch (error) {
      console.error('Error updating DJ:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteDJ = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      await supabaseService.deleteDJ(id);
    setDJs(prev => prev.filter(dj => dj.id !== id));
      setLastSync(new Date());
    } catch (error) {
      console.error('Error deleting DJ:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addClub = async (clubData: Omit<ClubData, 'id' | 'slug' | 'status' | 'submittedBy' | 'createdAt' | 'updatedAt'>): Promise<Club> => {
    setLoading(true);
    try {
      const newClub = await supabaseService.addClub(clubData as any);
      setClubs(prev => [...prev, newClub]);
      setLastSync(new Date());
      return newClub;
    } catch (error) {
      console.error('Error adding club:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateClub = async (clubData: Partial<ClubData> & { id: string }): Promise<Club> => {
    setLoading(true);
    try {
      const updatedClub = await supabaseService.updateClub(clubData as any);
      setClubs(prev => prev.map(club => club.id === clubData.id ? updatedClub : club));
      setLastSync(new Date());
      return updatedClub;
    } catch (error) {
      console.error('Error updating club:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteClub = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      await supabaseService.deleteClub(id);
    setClubs(prev => prev.filter(club => club.id !== id));
      setLastSync(new Date());
    } catch (error) {
      console.error('Error deleting club:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addPromoter = async (promoterData: Omit<PromoterData, 'id' | 'slug' | 'status' | 'submittedBy' | 'createdAt' | 'updatedAt'>): Promise<Promoter> => {
    setLoading(true);
    try {
      const newPromoter = await supabaseService.addPromoter(promoterData as any);
      setPromoters(prev => [...prev, newPromoter]);
      setLastSync(new Date());
      return newPromoter;
    } catch (error) {
      console.error('Error adding promoter:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePromoter = async (promoterData: Partial<PromoterData> & { id: string }): Promise<Promoter> => {
    setLoading(true);
    try {
      const updatedPromoter = await supabaseService.updatePromoter(promoterData as any);
      setPromoters(prev => prev.map(promoter => promoter.id === promoterData.id ? updatedPromoter : promoter));
      setLastSync(new Date());
      return updatedPromoter;
    } catch (error) {
      console.error('Error updating promoter:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deletePromoter = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      await supabaseService.deletePromoter(id);
    setPromoters(prev => prev.filter(promoter => promoter.id !== id));
      setLastSync(new Date());
    } catch (error) {
      console.error('Error deleting promoter:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Funciones de aprobación para eventos
  const approveEvent = async (id: string): Promise<Event> => {
    const eventData = { id, status: 'approved' as const };
    return await updateEvent(eventData);
  };

  const rejectEvent = async (id: string): Promise<Event> => {
    const eventData = { id, status: 'rejected' as const };
    return await updateEvent(eventData);
  };

  // Funciones de aprobación para DJs
  const approveDJ = async (id: string): Promise<DJ> => {
    const djData = { id, status: 'approved' as const };
    return await updateDJ(djData);
  };

  const rejectDJ = async (id: string): Promise<DJ> => {
    const djData = { id, status: 'rejected' as const };
    return await updateDJ(djData);
  };

  // Funciones de aprobación para clubs
  const approveClub = async (id: string): Promise<Club> => {
    const clubData = { id, status: 'approved' as const };
    return await updateClub(clubData);
  };

  const rejectClub = async (id: string): Promise<Club> => {
    const clubData = { id, status: 'rejected' as const };
    return await updateClub(clubData);
  };

  // Funciones de aprobación para promoters
  const approvePromoter = async (id: string): Promise<Promoter> => {
    const promoterData = { id, status: 'approved' as const };
    return await updatePromoter(promoterData);
  };

  const rejectPromoter = async (id: string): Promise<Promoter> => {
    const promoterData = { id, status: 'rejected' as const };
    return await updatePromoter(promoterData);
  };

  // Función para sincronización
  const syncData = async (): Promise<void> => {
    console.log('🔄 Iniciando sincronización de datos...');
    await loadFromSupabase();
  };

  // Función para recargar todos los datos desde la fuente
  const refreshData = async (): Promise<void> => {
    console.log('🔄 Recargando todos los datos...');
    try {
      setLoading(true);
      await loadFromSupabase();
      console.log('✅ Datos recargados con éxito');
    } catch (error) {
      console.error('❌ Error recargando datos:', error);
      setError(error instanceof Error ? error.message : 'Error al recargar datos');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Obtener estadísticas
  const getStats = () => {
    console.log('📊 Fuente de datos activa:', dataSource);
    return {
      totalEvents: events.length,
      totalDJs: djs.length,
      totalClubs: clubs.length,
      totalPromoters: promoters.length,
      totalUsers: users.length,
      dataSource,
      lastSync,
      isLoading: loading
    };
  };

  const value: UnifiedDataContextType = {
    events,
    djs,
    clubs,
    promoters,
    users,
    loading,
    isLoading: loading,
    error,
    connectionStatus: dataSource,
    
    // Funciones básicas
    getEventById,
    getDJById,
    getClubById,
    getPromoterById,
    
    getEventBySlug,
    getDJBySlug,
    getClubBySlug,
    getPromoterBySlug,
    
    // Funciones para el dashboard de usuario
    getEventsByUserId,
    getDJsByUserId,
    getClubsByUserId,
    getPromotersByUserId,
    
    // Funciones CRUD
    addEvent,
    updateEvent,
    deleteEvent,
    approveEvent,
    rejectEvent,
    
    addDJ,
    updateDJ,
    deleteDJ,
    approveDJ,
    rejectDJ,
    
    addClub,
    updateClub,
    deleteClub,
    approveClub,
    rejectClub,
    
    addPromoter,
    updatePromoter,
    deletePromoter,
    approvePromoter,
    rejectPromoter,
    
    // Sincronización
    syncData,
    refreshData,
    
    // Estadísticas
    getStats
  };

  return (
    <UnifiedDataContext.Provider value={value}>
      {children}
    </UnifiedDataContext.Provider>
  );
};

export default UnifiedDataProvider;


