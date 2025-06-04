import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event, DJ, Club, Promoter, User } from '../types/supabase';
import cmsService from '../services/cmsService';

// Interface simplificada del contexto
interface UnifiedDataContextType {
  events: Event[];
  djs: DJ[];
  clubs: Club[];
  promoters: Promoter[];
  users: User[];
  loading: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Funciones básicas
  getEventById: (id: string) => Event | undefined;
  getDJById: (id: string) => DJ | undefined;
  getClubById: (id: string) => Club | undefined;
  getPromoterById: (id: string) => Promoter | undefined;
  
  getEventBySlug: (slug: string) => Event | undefined;
  getDJBySlug: (slug: string) => DJ | undefined;
  getClubBySlug: (slug: string) => Club | undefined;
  getPromoterBySlug: (slug: string) => Promoter | undefined;
  
  // Funciones CRUD básicas
  addEvent: (eventData: any) => Promise<Event>;
  updateEvent: (eventData: any) => Promise<Event>;
  deleteEvent: (id: string) => Promise<void>;
  addDJ: (djData: any) => Promise<DJ>;
  updateDJ: (djData: any) => Promise<DJ>;
  deleteDJ: (id: string) => Promise<void>;
  addClub: (clubData: any) => Promise<Club>;
  updateClub: (clubData: any) => Promise<Club>;
  deleteClub: (id: string) => Promise<void>;
  addPromoter: (promoterData: any) => Promise<Promoter>;
  updatePromoter: (promoterData: any) => Promise<Promoter>;
  deletePromoter: (id: string) => Promise<void>;
}

const UnifiedDataContext = createContext<UnifiedDataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(UnifiedDataContext);
  if (context === undefined) {
    throw new Error('useData debe ser usado dentro de un UnifiedDataProvider');
  }
  return context;
};

// Función de conversión simple
const convertCMSEventToSupabase = (cmsEvent: any): Event => ({
  id: cmsEvent.id,
  name: cmsEvent.name,
  slug: cmsEvent.slug,
  description: cmsEvent.description,
  date: cmsEvent.date,
  time: cmsEvent.time,
  price: cmsEvent.price,
  imageUrl: cmsEvent.imageUrl,
  eventType: cmsEvent.eventType,
  clubId: cmsEvent.clubId,
  promoterId: cmsEvent.promoterId,
  djIds: cmsEvent.djIds || [],
  socialLinks: cmsEvent.socialLinks || [],
  status: cmsEvent.status,
  submittedBy: cmsEvent.submittedBy || '00000000-0000-0000-0000-000000000000',
  createdAt: cmsEvent.createdAt,
  updatedAt: cmsEvent.updatedAt
});

const convertCMSDJToSupabase = (cmsDJ: any): DJ => ({
  id: cmsDJ.id,
  name: cmsDJ.name,
  slug: cmsDJ.slug,
  description: cmsDJ.bio || cmsDJ.description,
  imageUrl: cmsDJ.photoUrl,
  genre: cmsDJ.genres?.join(', '),
  socialLinks: cmsDJ.socialLinks || [],
  status: cmsDJ.status,
  submittedBy: cmsDJ.submittedBy || '00000000-0000-0000-0000-000000000000',
  createdAt: cmsDJ.createdAt,
  updatedAt: cmsDJ.updatedAt
});

const convertCMSClubToSupabase = (cmsClub: any): Club => ({
  id: cmsClub.id,
  name: cmsClub.name,
  slug: cmsClub.slug,
  description: cmsClub.description,
  location: cmsClub.address,
  imageUrl: cmsClub.photos?.[0],
  capacity: undefined,
  socialLinks: cmsClub.socialLinks || [],
  status: cmsClub.status,
  submittedBy: cmsClub.submittedBy || '00000000-0000-0000-0000-000000000000',
  createdAt: cmsClub.createdAt,
  updatedAt: cmsClub.updatedAt
});

const convertCMSPromoterToSupabase = (cmsPromoter: any): Promoter => ({
  id: cmsPromoter.id,
  name: cmsPromoter.name,
  slug: cmsPromoter.slug,
  description: cmsPromoter.description,
  imageUrl: cmsPromoter.logoUrl,
  socialLinks: cmsPromoter.socialLinks || [],
  status: cmsPromoter.status,
  submittedBy: cmsPromoter.submittedBy || '00000000-0000-0000-0000-000000000000',
  createdAt: cmsPromoter.createdAt,
  updatedAt: cmsPromoter.updatedAt
});

const convertCMSUserToSupabase = (cmsUser: any): User => ({
  id: cmsUser.id,
  email: cmsUser.email,
  name: cmsUser.name,
  role: cmsUser.role === 'admin' ? 'ADMIN' : 'USER',
  isBanned: cmsUser.isBanned,
  createdAt: cmsUser.registrationDate,
  updatedAt: cmsUser.registrationDate
});

export const UnifiedDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [djs, setDJs] = useState<DJ[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [promoters, setPromoters] = useState<Promoter[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carga inicial simple
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const [cmsEvents, cmsDJs, cmsClubs, cmsPromoters, cmsUsers] = await Promise.all([
          cmsService.getEvents(),
          cmsService.getDJs(),
          cmsService.getClubs(),
          cmsService.getPromoters(),
          cmsService.getUsers()
        ]);

        setEvents(cmsEvents.map(convertCMSEventToSupabase));
        setDJs(cmsDJs.map(convertCMSDJToSupabase));
        setClubs(cmsClubs.map(convertCMSClubToSupabase));
        setPromoters(cmsPromoters.map(convertCMSPromoterToSupabase));
        setUsers(cmsUsers.map(convertCMSUserToSupabase));
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Error loading data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Sin dependencias para evitar re-ejecución

  // Funciones de búsqueda
  const getEventById = (id: string) => events.find(e => e.id === id);
  const getDJById = (id: string) => djs.find(d => d.id === id);
  const getClubById = (id: string) => clubs.find(c => c.id === id);
  const getPromoterById = (id: string) => promoters.find(p => p.id === id);

  const getEventBySlug = (slug: string) => events.find(e => e.slug === slug);
  const getDJBySlug = (slug: string) => djs.find(d => d.slug === slug);
  const getClubBySlug = (slug: string) => clubs.find(c => c.slug === slug);
  const getPromoterBySlug = (slug: string) => promoters.find(p => p.slug === slug);

  // Funciones CRUD básicas
  const addEvent = async (eventData: any) => {
    const cmsEvent = await cmsService.addEvent(eventData);
    const supabaseEvent = convertCMSEventToSupabase(cmsEvent);
    setEvents(prev => [...prev, supabaseEvent]);
    return supabaseEvent;
  };

  const updateEvent = async (eventData: any) => {
    const cmsEvent = await cmsService.updateEvent(eventData);
    const supabaseEvent = convertCMSEventToSupabase(cmsEvent);
    setEvents(prev => prev.map(event => event.id === supabaseEvent.id ? supabaseEvent : event));
    return supabaseEvent;
  };

  const deleteEvent = async (id: string) => {
    await cmsService.deleteEvent(id);
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const addDJ = async (djData: any) => {
    const cmsDJ = await cmsService.addDJ(djData);
    const supabaseDJ = convertCMSDJToSupabase(cmsDJ);
    setDJs(prev => [...prev, supabaseDJ]);
    return supabaseDJ;
  };

  const updateDJ = async (djData: any) => {
    const cmsDJ = await cmsService.updateDJ(djData);
    const supabaseDJ = convertCMSDJToSupabase(cmsDJ);
    setDJs(prev => prev.map(dj => dj.id === supabaseDJ.id ? supabaseDJ : dj));
    return supabaseDJ;
  };

  const deleteDJ = async (id: string) => {
    await cmsService.deleteDJ(id);
    setDJs(prev => prev.filter(dj => dj.id !== id));
  };

  const addClub = async (clubData: any) => {
    const cmsClub = await cmsService.addClub(clubData);
    const supabaseClub = convertCMSClubToSupabase(cmsClub);
    setClubs(prev => [...prev, supabaseClub]);
    return supabaseClub;
  };

  const updateClub = async (clubData: any) => {
    const cmsClub = await cmsService.updateClub(clubData);
    const supabaseClub = convertCMSClubToSupabase(cmsClub);
    setClubs(prev => prev.map(club => club.id === supabaseClub.id ? supabaseClub : club));
    return supabaseClub;
  };

  const deleteClub = async (id: string) => {
    await cmsService.deleteClub(id);
    setClubs(prev => prev.filter(club => club.id !== id));
  };

  const addPromoter = async (promoterData: any) => {
    const cmsPromoter = await cmsService.addPromoter(promoterData);
    const supabasePromoter = convertCMSPromoterToSupabase(cmsPromoter);
    setPromoters(prev => [...prev, supabasePromoter]);
    return supabasePromoter;
  };

  const updatePromoter = async (promoterData: any) => {
    const cmsPromoter = await cmsService.updatePromoter(promoterData);
    const supabasePromoter = convertCMSPromoterToSupabase(cmsPromoter);
    setPromoters(prev => prev.map(promoter => promoter.id === supabasePromoter.id ? supabasePromoter : promoter));
    return supabasePromoter;
  };

  const deletePromoter = async (id: string) => {
    await cmsService.deletePromoter(id);
    setPromoters(prev => prev.filter(promoter => promoter.id !== id));
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
    getEventById,
    getDJById,
    getClubById,
    getPromoterById,
    getEventBySlug,
    getDJBySlug,
    getClubBySlug,
    getPromoterBySlug,
    addEvent,
    updateEvent,
    deleteEvent,
    addDJ,
    updateDJ,
    deleteDJ,
    addClub,
    updateClub,
    deleteClub,
    addPromoter,
    updatePromoter,
    deletePromoter
  };

  return (
    <UnifiedDataContext.Provider value={value}>
      {children}
    </UnifiedDataContext.Provider>
  );
};

export default UnifiedDataProvider;


