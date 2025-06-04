import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Event, DJ, Club, Promoter, User } from '../types/supabase';
import { EventData, DJData, ClubData, PromoterData, UserData } from '../types';
import cmsService from '../services/cmsService';
import { SupabaseService } from '../services/supabaseService';

// Inicializar servicios
const supabaseService = new SupabaseService();

// Interface del contexto - SIMPLIFICADA PARA PRODUCCIÓN
interface UnifiedDataContextType {
  // Estado
  events: Event[];
  djs: DJ[];
  clubs: Club[];
  promoters: Promoter[];
  users: User[];
  loading: boolean;
  isLoading: boolean; // Alias para compatibilidad
  lastDataUpdate: Date | null;
  error: string | null;
  connectionStatus: 'supabase' | 'cms-only' | 'loading' | 'error';
  
  // Funciones de datos
  getIbizaEvents: () => Event[];
  getUpcomingEvents: Event[];
  getFeaturedEvents: Event[];
  
  // Funciones por ID
  getEventById: (id: string) => Event | undefined;
  getDJById: (id: string) => DJ | undefined;
  getClubById: (id: string) => Club | undefined;
  getPromoterById: (id: string) => Promoter | undefined;
  getUserById: (id: string) => User | undefined;
  
  // Funciones por Slug
  getEventBySlug: (slug: string) => Event | undefined;
  getDJBySlug: (slug: string) => DJ | undefined;
  getClubBySlug: (slug: string) => Club | undefined;
  getPromoterBySlug: (slug: string) => Promoter | undefined;
  
  // Funciones de utilidad
  refreshAllData: () => Promise<void>;
  syncWithSupabase: () => Promise<void>;
  switchToSupabaseMode: () => Promise<void>;
  
  // Funciones de administración básicas (solo para compatibilidad)
  getPendingEvents: () => Event[];
  getPendingDJs: () => DJ[];
  getPendingPromoters: () => Promoter[];
  getPendingClubs: () => Club[];
  
  // Funciones CRUD básicas (delegando al cmsService)
  addEvent: (eventData: any) => Promise<Event>;
  updateEvent: (eventData: any) => Promise<Event>;
  deleteEvent: (id: string) => Promise<void>;
  approveEvent: (id: string) => Promise<void>;
  rejectEvent: (id: string) => Promise<void>;
  
  addDJ: (djData: any) => Promise<DJ>;
  updateDJ: (djData: any) => Promise<DJ>;
  deleteDJ: (id: string) => Promise<void>;
  approveDJ: (id: string) => Promise<void>;
  rejectDJ: (id: string) => Promise<void>;
  
  addClub: (clubData: any) => Promise<Club>;
  updateClub: (clubData: any) => Promise<Club>;
  deleteClub: (id: string) => Promise<void>;
  approveClub: (id: string) => Promise<void>;
  rejectClub: (id: string) => Promise<void>;
  
  addPromoter: (promoterData: any) => Promise<Promoter>;
  updatePromoter: (promoterData: any) => Promise<Promoter>;
  deletePromoter: (id: string) => Promise<void>;
  approvePromoter: (id: string) => Promise<void>;
  rejectPromoter: (id: string) => Promise<void>;
  
  // Funciones de usuario
  toggleUserBan: (userId: string, adminId: string) => Promise<void>;
  changeUserRole: (userId: string, role: string, adminId: string) => Promise<void>;
}

// Crear contexto
const UnifiedDataContext = createContext<UnifiedDataContextType | undefined>(undefined);

// Hook para usar el contexto
export const useData = () => {
  const context = useContext(UnifiedDataContext);
  if (context === undefined) {
    throw new Error('useData debe ser usado dentro de un UnifiedDataProvider');
  }
  return context;
};

// Provider principal - OPTIMIZADO PARA PRODUCCIÓN
export const UnifiedDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estados principales
  const [events, setEvents] = useState<Event[]>([]);
  const [djs, setDJs] = useState<DJ[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [promoters, setPromoters] = useState<Promoter[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDataUpdate, setLastDataUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'supabase' | 'cms-only' | 'loading' | 'error'>('loading');

  // Refs para control
  const initializingRef = useRef(false);
  const mountedRef = useRef(true);

  // Funciones de conversión CMS → Supabase - MEMOIZADAS ESTÁTICAS
  const convertCMSEventToSupabase = useCallback((cmsEvent: EventData): Event => ({
    id: cmsEvent.id,
    name: cmsEvent.name,
    slug: cmsEvent.slug,
    description: cmsEvent.description || undefined,
    date: cmsEvent.date,
    time: cmsEvent.time || undefined,
    price: cmsEvent.price || undefined,
    imageUrl: cmsEvent.imageUrl || undefined,
    eventType: cmsEvent.eventType || undefined,
    clubId: cmsEvent.clubId || undefined,
    promoterId: cmsEvent.promoterId || undefined,
    djIds: cmsEvent.djIds || [],
    socialLinks: cmsEvent.socialLinks || [],
    originalSourceUrl: cmsEvent.originalSourceUrl || undefined,
    importNotes: cmsEvent.importNotes || undefined,
    status: cmsEvent.status,
    submittedBy: cmsEvent.submittedBy || '00000000-0000-0000-0000-000000000000',
    createdAt: cmsEvent.createdAt,
    updatedAt: cmsEvent.updatedAt
  }), []); // Sin dependencias para evitar re-creación

  const convertCMSDJToSupabase = useCallback((cmsDJ: DJData): DJ => ({
    id: cmsDJ.id,
    name: cmsDJ.name,
    slug: cmsDJ.slug,
    description: cmsDJ.bio || cmsDJ.description || undefined,
    imageUrl: cmsDJ.photoUrl || undefined,
    genre: cmsDJ.genres?.join(', ') || undefined,
    socialLinks: cmsDJ.socialLinks || [],
    status: cmsDJ.status,
    submittedBy: cmsDJ.submittedBy || '00000000-0000-0000-0000-000000000000',
    createdAt: cmsDJ.createdAt,
    updatedAt: cmsDJ.updatedAt
  }), []); // Sin dependencias

  const convertCMSClubToSupabase = useCallback((cmsClub: ClubData): Club => ({
    id: cmsClub.id,
    name: cmsClub.name,
    slug: cmsClub.slug,
    description: cmsClub.description || undefined,
    location: cmsClub.address || undefined,
    imageUrl: cmsClub.photos?.[0] || undefined,
    capacity: undefined,
    socialLinks: cmsClub.socialLinks || [],
    status: cmsClub.status,
    submittedBy: cmsClub.submittedBy || '00000000-0000-0000-0000-000000000000',
    createdAt: cmsClub.createdAt,
    updatedAt: cmsClub.updatedAt
  }), []); // Sin dependencias

  const convertCMSPromoterToSupabase = useCallback((cmsPromoter: PromoterData): Promoter => ({
    id: cmsPromoter.id,
    name: cmsPromoter.name,
    slug: cmsPromoter.slug,
    description: cmsPromoter.description || undefined,
    imageUrl: cmsPromoter.logoUrl || undefined,
    socialLinks: cmsPromoter.socialLinks || [],
    status: cmsPromoter.status,
    submittedBy: cmsPromoter.submittedBy || '00000000-0000-0000-0000-000000000000',
    createdAt: cmsPromoter.createdAt,
    updatedAt: cmsPromoter.updatedAt
  }), []); // Sin dependencias

  const convertCMSUserToSupabase = useCallback((cmsUser: UserData): User => ({
    id: cmsUser.id,
    email: cmsUser.email,
    name: cmsUser.name || undefined,
    role: cmsUser.role === 'admin' ? 'ADMIN' : 'USER',
    isBanned: cmsUser.isBanned,
    createdAt: cmsUser.registrationDate,
    updatedAt: cmsUser.registrationDate
  }), []); // Sin dependencias

  // Función para cargar desde localStorage - ESTABILIZADA
  const loadFromLocalStorage = useCallback(async (): Promise<{
    events: Event[];
    djs: DJ[];
    clubs: Club[];
    promoters: Promoter[];
    users: User[];
  }> => {
    try {
      const [cmsEvents, cmsDJs, cmsClubs, cmsPromoters, cmsUsers] = await Promise.all([
        cmsService.getEvents(),
        cmsService.getDJs(),
        cmsService.getClubs(),
        cmsService.getPromoters(),
        cmsService.getUsers()
      ]);

      return {
        events: cmsEvents.map(convertCMSEventToSupabase),
        djs: cmsDJs.map(convertCMSDJToSupabase),
        clubs: cmsClubs.map(convertCMSClubToSupabase),
        promoters: cmsPromoters.map(convertCMSPromoterToSupabase),
        users: cmsUsers.map(convertCMSUserToSupabase)
      };
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error cargando desde localStorage:', error);
      }
      return {
        events: [],
        djs: [],
        clubs: [],
        promoters: [],
        users: []
      };
    }
  }, [convertCMSEventToSupabase, convertCMSDJToSupabase, convertCMSClubToSupabase, convertCMSPromoterToSupabase, convertCMSUserToSupabase]);

  // Función principal de carga de datos - SIN DEPENDENCIAS PROBLEMÁTICAS
  const loadAllData = useCallback(async (forceReload = false, preferSupabase = false) => {
    if (initializingRef.current && !forceReload) {
      return;
    }
    
    initializingRef.current = true;
    setLoading(true);
    setConnectionStatus('loading');
    setError(null);
    
    try {
      // Leer connectionStatus actual para evitar dependencia
      const currentConnectionStatus = connectionStatus;
      
      if (preferSupabase || currentConnectionStatus === 'supabase') {
        try {
          const [supabaseEvents, supabaseDJs, supabaseClubs, supabasePromoters, supabaseUsers] = await Promise.all([
            supabaseService.getEvents(),
            supabaseService.getDJs(),
            supabaseService.getClubs(),
            supabaseService.getPromoters(),
            supabaseService.getUsers()
          ]);

          if (mountedRef.current) {
            setEvents(supabaseEvents);
            setDJs(supabaseDJs);
            setClubs(supabaseClubs);
            setPromoters(supabasePromoters);
            setUsers(supabaseUsers);
            setConnectionStatus('supabase');
            setLastDataUpdate(new Date());
          }
        } catch (supabaseError) {
          if (process.env.NODE_ENV === 'development') {
            console.error('❌ Error conectando con Supabase:', supabaseError);
          }
          
          const localData = await loadFromLocalStorage();
          
          if (mountedRef.current) {
            setEvents(localData.events);
            setDJs(localData.djs);
            setClubs(localData.clubs);
            setPromoters(localData.promoters);
            setUsers(localData.users);
            setConnectionStatus('cms-only');
            setLastDataUpdate(new Date());
          }
        }
      } else {
        const localData = await loadFromLocalStorage();
        
        if (mountedRef.current) {
          setEvents(localData.events);
          setDJs(localData.djs);
          setClubs(localData.clubs);
          setPromoters(localData.promoters);
          setUsers(localData.users);
          setConnectionStatus('cms-only');
          setLastDataUpdate(new Date());
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error crítico cargando datos:', error);
      }
      if (mountedRef.current) {
        setError(error instanceof Error ? error.message : 'Error desconocido');
        setConnectionStatus('error');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        initializingRef.current = false;
      }
    }
  }, [loadFromLocalStorage]); // Solo loadFromLocalStorage como dependencia

  // Funciones de búsqueda y filtrado
  const getIbizaEvents = useCallback(() => {
    return events.filter(event => 
      event.status === 'approved' || event.status === 'pending'
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events]);

  const getUpcomingEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter(event => 
        (event.status === 'approved' || event.status === 'pending') && 
        new Date(event.date) >= now
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 10);
  }, [events]);

  const getFeaturedEvents = useMemo(() => {
    return events
      .filter(event => event.status === 'approved')
      .slice(0, 6);
  }, [events]);

  // Funciones por ID
  const getEventById = useCallback((id: string) => events.find(e => e.id === id), [events]);
  const getDJById = useCallback((id: string) => djs.find(d => d.id === id), [djs]);
  const getClubById = useCallback((id: string) => clubs.find(c => c.id === id), [clubs]);
  const getPromoterById = useCallback((id: string) => promoters.find(p => p.id === id), [promoters]);
  const getUserById = useCallback((id: string) => users.find(u => u.id === id), [users]);

  // Funciones por Slug
  const getEventBySlug = useCallback((slug: string) => events.find(e => e.slug === slug), [events]);
  const getDJBySlug = useCallback((slug: string) => djs.find(d => d.slug === slug), [djs]);
  const getClubBySlug = useCallback((slug: string) => clubs.find(c => c.slug === slug), [clubs]);
  const getPromoterBySlug = useCallback((slug: string) => promoters.find(p => p.slug === slug), [promoters]);

  // Funciones de utilidad
  const refreshAllData = useCallback(() => loadAllData(true), [loadAllData]);
  const syncWithSupabase = useCallback(() => loadAllData(true, true), [loadAllData]);
  const switchToSupabaseMode = useCallback(() => loadAllData(true, true), [loadAllData]);

  // Efecto de inicialización
  useEffect(() => {
    mountedRef.current = true;
    loadAllData();
    
    return () => {
      mountedRef.current = false;
    };
  }, [loadAllData]);

  // Funciones de administración básicas (solo para compatibilidad)
  const getPendingEvents = useCallback(() => {
    return events.filter(event => event.status === 'pending');
  }, [events]);

  const getPendingDJs = useCallback(() => {
    return djs.filter(dj => dj.status === 'pending');
  }, [djs]);

  const getPendingPromoters = useCallback(() => {
    return promoters.filter(promoter => promoter.status === 'pending');
  }, [promoters]);

  const getPendingClubs = useCallback(() => {
    return clubs.filter(club => club.status === 'pending');
  }, [clubs]);

  // Funciones CRUD básicas (delegando al cmsService)
  const addEvent = useCallback(async (eventData: any) => {
    try {
      const cmsEvent = await cmsService.addEvent(eventData);
      const supabaseEvent = convertCMSEventToSupabase(cmsEvent);
      setEvents([...events, supabaseEvent]);
      return supabaseEvent;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error añadiendo evento:', error);
      }
      throw error;
    }
  }, [convertCMSEventToSupabase, events]);

  const updateEvent = useCallback(async (eventData: any) => {
    try {
      const cmsEvent = await cmsService.updateEvent(eventData);
      const supabaseEvent = convertCMSEventToSupabase(cmsEvent);
      setEvents(events.map(event => event.id === supabaseEvent.id ? supabaseEvent : event));
      return supabaseEvent;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error actualizando evento:', error);
      }
      throw error;
    }
  }, [convertCMSEventToSupabase, events]);

  const deleteEvent = useCallback(async (id: string) => {
    try {
      await cmsService.deleteEvent(id);
      setEvents(events.filter(event => event.id !== id));
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error eliminando evento:', error);
      }
      throw error;
    }
  }, [events]);

  const approveEvent = useCallback(async (id: string) => {
    try {
      // Simular aprobación - en realidad solo actualiza el estado local
      setEvents(events.map(event => event.id === id ? { ...event, status: 'approved' } : event));
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Evento aprobado localmente:', id);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error aprobando evento:', error);
      }
      throw error;
    }
  }, [events]);

  const rejectEvent = useCallback(async (id: string) => {
    try {
      // Simular rechazo - en realidad solo actualiza el estado local
      setEvents(events.map(event => event.id === id ? { ...event, status: 'rejected' } : event));
      if (process.env.NODE_ENV === 'development') {
        console.log('❌ Evento rechazado localmente:', id);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error rechazando evento:', error);
      }
      throw error;
    }
  }, [events]);

  const addDJ = useCallback(async (djData: any) => {
    try {
      const cmsDJ = await cmsService.addDJ(djData);
      const supabaseDJ = convertCMSDJToSupabase(cmsDJ);
      setDJs([...djs, supabaseDJ]);
      return supabaseDJ;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error añadiendo DJ:', error);
      }
      throw error;
    }
  }, [convertCMSDJToSupabase, djs]);

  const updateDJ = useCallback(async (djData: any) => {
    try {
      const cmsDJ = await cmsService.updateDJ(djData);
      const supabaseDJ = convertCMSDJToSupabase(cmsDJ);
      setDJs(djs.map(dj => dj.id === supabaseDJ.id ? supabaseDJ : dj));
      return supabaseDJ;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error actualizando DJ:', error);
      }
      throw error;
    }
  }, [convertCMSDJToSupabase, djs]);

  const deleteDJ = useCallback(async (id: string) => {
    try {
      await cmsService.deleteDJ(id);
      setDJs(djs.filter(dj => dj.id !== id));
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error eliminando DJ:', error);
      }
      throw error;
    }
  }, [djs]);

  const approveDJ = useCallback(async (id: string) => {
    try {
      // Simular aprobación - en realidad solo actualiza el estado local
      setDJs(djs.map(dj => dj.id === id ? { ...dj, status: 'approved' } : dj));
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ DJ aprobado localmente:', id);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error aprobando DJ:', error);
      }
      throw error;
    }
  }, [djs]);

  const rejectDJ = useCallback(async (id: string) => {
    try {
      // Simular rechazo - en realidad solo actualiza el estado local
      setDJs(djs.map(dj => dj.id === id ? { ...dj, status: 'rejected' } : dj));
      if (process.env.NODE_ENV === 'development') {
        console.log('❌ DJ rechazado localmente:', id);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error rechazando DJ:', error);
      }
      throw error;
    }
  }, [djs]);

  const addClub = useCallback(async (clubData: any) => {
    try {
      const cmsClub = await cmsService.addClub(clubData);
      const supabaseClub = convertCMSClubToSupabase(cmsClub);
      setClubs([...clubs, supabaseClub]);
      return supabaseClub;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error añadiendo club:', error);
      }
      throw error;
    }
  }, [convertCMSClubToSupabase, clubs]);

  const updateClub = useCallback(async (clubData: any) => {
    try {
      const cmsClub = await cmsService.updateClub(clubData);
      const supabaseClub = convertCMSClubToSupabase(cmsClub);
      setClubs(clubs.map(club => club.id === supabaseClub.id ? supabaseClub : club));
      return supabaseClub;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error actualizando club:', error);
      }
      throw error;
    }
  }, [convertCMSClubToSupabase, clubs]);

  const deleteClub = useCallback(async (id: string) => {
    try {
      await cmsService.deleteClub(id);
      setClubs(clubs.filter(club => club.id !== id));
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error eliminando club:', error);
      }
      throw error;
    }
  }, [clubs]);

  const approveClub = useCallback(async (id: string) => {
    try {
      // Simular aprobación - en realidad solo actualiza el estado local
      setClubs(clubs.map(club => club.id === id ? { ...club, status: 'approved' } : club));
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Club aprobado localmente:', id);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error aprobando club:', error);
      }
      throw error;
    }
  }, [clubs]);

  const rejectClub = useCallback(async (id: string) => {
    try {
      // Simular rechazo - en realidad solo actualiza el estado local
      setClubs(clubs.map(club => club.id === id ? { ...club, status: 'rejected' } : club));
      if (process.env.NODE_ENV === 'development') {
        console.log('❌ Club rechazado localmente:', id);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error rechazando club:', error);
      }
      throw error;
    }
  }, [clubs]);

  const addPromoter = useCallback(async (promoterData: any) => {
    try {
      const cmsPromoter = await cmsService.addPromoter(promoterData);
      const supabasePromoter = convertCMSPromoterToSupabase(cmsPromoter);
      setPromoters([...promoters, supabasePromoter]);
      return supabasePromoter;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error añadiendo promotor:', error);
      }
      throw error;
    }
  }, [convertCMSPromoterToSupabase, promoters]);

  const updatePromoter = useCallback(async (promoterData: any) => {
    try {
      const cmsPromoter = await cmsService.updatePromoter(promoterData);
      const supabasePromoter = convertCMSPromoterToSupabase(cmsPromoter);
      setPromoters(promoters.map(promoter => promoter.id === supabasePromoter.id ? supabasePromoter : promoter));
      return supabasePromoter;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error actualizando promotor:', error);
      }
      throw error;
    }
  }, [convertCMSPromoterToSupabase, promoters]);

  const deletePromoter = useCallback(async (id: string) => {
    try {
      await cmsService.deletePromoter(id);
      setPromoters(promoters.filter(promoter => promoter.id !== id));
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error eliminando promotor:', error);
      }
      throw error;
    }
  }, [promoters]);

  const approvePromoter = useCallback(async (id: string) => {
    try {
      // Simular aprobación - en realidad solo actualiza el estado local
      setPromoters(promoters.map(promoter => promoter.id === id ? { ...promoter, status: 'approved' } : promoter));
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Promotor aprobado localmente:', id);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error aprobando promotor:', error);
      }
      throw error;
    }
  }, [promoters]);

  const rejectPromoter = useCallback(async (id: string) => {
    try {
      // Simular rechazo - en realidad solo actualiza el estado local
      setPromoters(promoters.map(promoter => promoter.id === id ? { ...promoter, status: 'rejected' } : promoter));
      if (process.env.NODE_ENV === 'development') {
        console.log('❌ Promotor rechazado localmente:', id);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error rechazando promotor:', error);
      }
      throw error;
    }
  }, [promoters]);

  // Funciones de usuario
  const toggleUserBan = useCallback(async (userId: string, adminId: string) => {
    try {
      // Simular toggle ban - en realidad solo actualiza el estado local
      setUsers(users.map(user => user.id === userId ? { ...user, isBanned: !user.isBanned } : user));
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Estado de ban cambiado localmente para usuario:', userId);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error cambiando estado de usuario:', error);
      }
      throw error;
    }
  }, [users]);

  const changeUserRole = useCallback(async (userId: string, role: string, adminId: string) => {
    try {
      // Simular cambio de rol - en realidad solo actualiza el estado local
      const validRole = role === 'admin' ? 'ADMIN' : 'USER'; // Convertir a tipos válidos
      setUsers(users.map(user => user.id === userId ? { ...user, role: validRole } : user));
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Rol cambiado localmente para usuario:', userId, 'nuevo rol:', validRole);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error cambiando rol de usuario:', error);
      }
      throw error;
    }
  }, [users]);

  // Valor del contexto
  const contextValue: UnifiedDataContextType = {
    // Estado
    events,
    djs,
    clubs,
    promoters,
    users,
    loading,
    isLoading: loading,
    lastDataUpdate,
    error,
    connectionStatus,
    
    // Funciones de datos
    getIbizaEvents,
    getUpcomingEvents,
    getFeaturedEvents,
    
    // Funciones por ID
    getEventById,
    getDJById,
    getClubById,
    getPromoterById,
    getUserById,
    
    // Funciones por Slug
    getEventBySlug,
    getDJBySlug,
    getClubBySlug,
    getPromoterBySlug,
    
    // Funciones de utilidad
    refreshAllData,
    syncWithSupabase,
    switchToSupabaseMode,
    
    // Funciones de administración básicas (solo para compatibilidad)
    getPendingEvents,
    getPendingDJs,
    getPendingPromoters,
    getPendingClubs,
    
    // Funciones CRUD básicas (delegando al cmsService)
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
    
    // Funciones de usuario
    toggleUserBan,
    changeUserRole
  };

  return (
    <UnifiedDataContext.Provider value={contextValue}>
      {children}
    </UnifiedDataContext.Provider>
  );
};

export default UnifiedDataProvider;


