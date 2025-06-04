import { UserData, EventData, DJData, PromoterData, ClubData } from '../types';
import { INITIAL_DJS, INITIAL_PROMOTERS, INITIAL_CLUBS, INITIAL_EVENTS_PLACEHOLDER, slugify, INITIAL_USERS, ADMIN_USER_ID } from '../constants';

// Utility functions
const generateId = (): string => Math.random().toString(36).substr(2, 9);

const apiDelay = (ms: number = 50) => new Promise(resolve => setTimeout(resolve, ms));

// Cache para evitar múltiples cargas simultáneas
const dataCache = new Map<string, any>();
const loadingFlags = new Map<string, boolean>();

const getStoredData = <T,>(
  key: string, 
  initialData: any[] = [], 
  needsSlug: boolean = true
): T[] => {
  // Verificar caché primero
  if (dataCache.has(key)) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`📦 Devolviendo datos de caché para ${key}:`, dataCache.get(key).length);
    }
    return dataCache.get(key);
  }

  // Evitar múltiples cargas simultáneas
  if (loadingFlags.get(key)) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏳ Carga ya en progreso para ${key}, esperando...`);
    }
    return [];
  }

  loadingFlags.set(key, true);

  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ Datos cargados desde localStorage para ${key}:`, parsed.length);
        }
        dataCache.set(key, parsed);
        loadingFlags.set(key, false);
        return parsed;
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Error reading ${key} from localStorage:`, error);
    }
  }
  
  // Initialize with default data if nothing stored or error
  if (initialData.length > 0) {
    const processedData = initialData.map((item: any) => ({
      ...item,
      id: item.id || generateId(),
      slug: needsSlug && item.name ? slugify(item.name) : (item.slug || ''),
    }));
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔧 Inicializando datos por defecto para ${key}:`, processedData.length);
    }
    
    // Store the initialized data
    try {
      localStorage.setItem(key, JSON.stringify(processedData));
      dataCache.set(key, processedData);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Error storing initial ${key} data:`, error);
      }
    }
    
    loadingFlags.set(key, false);
    return processedData as T[];
  }
  
  loadingFlags.set(key, false);
  return [];
};

const setStoredData = <T,>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    // Actualizar caché también
    dataCache.set(key, data);
    if (process.env.NODE_ENV === 'development') {
      console.log(`💾 Datos guardados para ${key}:`, data.length);
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error storing ${key} data:`, error);
    }
  }
};

// Función para invalidar caché
const invalidateCache = (key?: string) => {
  if (key) {
    dataCache.delete(key);
    if (process.env.NODE_ENV === 'development') {
      console.log(`🗑️ Caché invalidado para ${key}`);
    }
  } else {
    dataCache.clear();
    if (process.env.NODE_ENV === 'development') {
      console.log('🗑️ Caché completamente limpiado');
    }
  }
};

const initializeEvents = (): EventData[] => {
  const stored = getStoredData<EventData>('s&f_events', INITIAL_EVENTS_PLACEHOLDER);
  
  // If we have placeholder data, replace with real initial events
  if (stored.length > 0 && stored[0].name.includes('Placeholder')) {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Reemplazando datos placeholder con eventos reales...');
    }
    
    const realEvents: Omit<EventData, 'id' | 'slug'>[] = [
      {
        name: "David Guetta - F*** Me I'm Famous",
        date: "2025-07-15",
        time: "23:00",
        description: "La residencia más famosa de David Guetta en Pacha Ibiza. Una noche épica de house y EDM.",
        imageUrl: "https://via.placeholder.com/400x300?text=David+Guetta",
        price: "€80-120",
        eventType: "Residency",
        clubId: "",
        djIds: [],
        promoterId: "",
        socialLinks: [],
        status: "approved",
        submittedBy: ADMIN_USER_ID,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        name: "Solomun +1",
        date: "2025-08-03",
        time: "23:00",
        description: "La residencia de Solomun en Pacha, donde invita a un artista especial cada semana.",
        imageUrl: "https://via.placeholder.com/400x300?text=Solomun",
        price: "€70-100",
        eventType: "Residency",
        clubId: "",
        djIds: [],
        promoterId: "",
        socialLinks: [],
        status: "approved",
        submittedBy: ADMIN_USER_ID,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    const processedEvents = realEvents.map(event => ({
      ...event,
      id: generateId(),
      slug: slugify(event.name)
    }));
    
    setStoredData('s&f_events', processedEvents);
    return processedEvents;
  }
  
  return stored;
};

const cmsService = {
  // Cache management
  invalidateCache,
  
  // Events
  getEvents: async (): Promise<EventData[]> => {
    await apiDelay();
    return initializeEvents();
  },
  
  getEventById: async (id: string): Promise<EventData | undefined> => {
    await apiDelay();
    const events = getStoredData<EventData>('s&f_events');
    return events.find(event => event.id === id);
  },
  
  addEvent: async (event: Omit<EventData, 'id' | 'slug'>): Promise<EventData> => {
    await apiDelay();
    const events = getStoredData<EventData>('s&f_events');
    const newEvent: EventData = { ...event, id: generateId(), slug: slugify(event.name) };
    const updatedEvents = [...events, newEvent];
    setStoredData('s&f_events', updatedEvents);
    return newEvent;
  },
  
  updateEvent: async (updatedEvent: EventData): Promise<EventData> => {
    await apiDelay();
    let events = getStoredData<EventData>('s&f_events');
    events = events.map(event => event.id === updatedEvent.id ? { ...updatedEvent, slug: slugify(updatedEvent.name) } : event);
    setStoredData('s&f_events', events);
    return updatedEvent;
  },
  
  deleteEvent: async (id: string): Promise<void> => {
    await apiDelay();
    let events = getStoredData<EventData>('s&f_events');
    events = events.filter(event => event.id !== id);
    setStoredData('s&f_events', events);
  },

  // DJs
  getDJs: async (): Promise<DJData[]> => {
    await apiDelay();
    return getStoredData<DJData>('s&f_djs', INITIAL_DJS);
  },
  
  getDJById: async (id: string): Promise<DJData | undefined> => {
    await apiDelay();
    const djs = getStoredData<DJData>('s&f_djs');
    return djs.find(d => d.id === id);
  },
  
  addDJ: async (dj: Omit<DJData, 'id' | 'slug'>): Promise<DJData> => {
    await apiDelay();
    const djs = getStoredData<DJData>('s&f_djs');
    const newDJ: DJData = { ...dj, id: generateId(), slug: slugify(dj.name) };
    const updatedDJs = [...djs, newDJ];
    setStoredData('s&f_djs', updatedDJs);
    return newDJ;
  },
  
  updateDJ: async (updatedDJ: DJData): Promise<DJData> => {
    await apiDelay();
    let djs = getStoredData<DJData>('s&f_djs');
    djs = djs.map(djItem => djItem.id === updatedDJ.id ? { ...updatedDJ, slug: slugify(updatedDJ.name) } : djItem);
    setStoredData('s&f_djs', djs);
    return updatedDJ;
  },
  
  deleteDJ: async (id: string): Promise<void> => {
    await apiDelay();
    let djs = getStoredData<DJData>('s&f_djs');
    djs = djs.filter(djItem => djItem.id !== id);
    setStoredData('s&f_djs', djs);
  },

  // Promoters
  getPromoters: async (): Promise<PromoterData[]> => {
    await apiDelay();
    return getStoredData<PromoterData>('s&f_promoters', INITIAL_PROMOTERS);
  },
  
   getPromoterById: async (id: string): Promise<PromoterData | undefined> => {
    await apiDelay();
    const promoters = getStoredData<PromoterData>('s&f_promoters');
    return promoters.find(p => p.id === id);
  },
  
  addPromoter: async (promoter: Omit<PromoterData, 'id' | 'slug'>): Promise<PromoterData> => {
    await apiDelay();
    const promoters = getStoredData<PromoterData>('s&f_promoters');
    const newPromoter: PromoterData = { ...promoter, id: generateId(), slug: slugify(promoter.name) };
    const updatedPromoters = [...promoters, newPromoter];
    setStoredData('s&f_promoters', updatedPromoters);
    return newPromoter;
  },
  
  updatePromoter: async (updatedPromoter: PromoterData): Promise<PromoterData> => {
    await apiDelay();
    let promoters = getStoredData<PromoterData>('s&f_promoters');
    promoters = promoters.map(p => p.id === updatedPromoter.id ? { ...updatedPromoter, slug: slugify(updatedPromoter.name) } : p);
    setStoredData('s&f_promoters', promoters);
    return updatedPromoter;
  },
  
  deletePromoter: async (id: string): Promise<void> => {
    await apiDelay();
    let promoters = getStoredData<PromoterData>('s&f_promoters');
    promoters = promoters.filter(p => p.id !== id);
    setStoredData('s&f_promoters', promoters);
  },

  // Clubs
  getClubs: async (): Promise<ClubData[]> => {
    await apiDelay();
    return getStoredData<ClubData>('s&f_clubs', INITIAL_CLUBS);
  },
  
  getClubById: async (id: string): Promise<ClubData | undefined> => {
    await apiDelay();
    const clubs = getStoredData<ClubData>('s&f_clubs');
    return clubs.find(c => c.id === id);
  },
  
  addClub: async (club: Omit<ClubData, 'id' | 'slug'>): Promise<ClubData> => {
    await apiDelay();
    const clubs = getStoredData<ClubData>('s&f_clubs');
    const newClub: ClubData = { ...club, id: generateId(), slug: slugify(club.name) };
    setStoredData('s&f_clubs', [...clubs, newClub]);
    return newClub;
  },
  
  updateClub: async (updatedClub: ClubData): Promise<ClubData> => {
    await apiDelay();
    let clubs = getStoredData<ClubData>('s&f_clubs');
    clubs = clubs.map(c => c.id === updatedClub.id ? { ...updatedClub, slug: slugify(updatedClub.name) } : c);
    setStoredData('s&f_clubs', clubs);
    return updatedClub;
  },
  
  deleteClub: async (id: string): Promise<void> => {
    await apiDelay();
    let clubs = getStoredData<ClubData>('s&f_clubs');
    clubs = clubs.filter(c => c.id !== id);
    setStoredData('s&f_clubs', clubs);
  },

  // Users
  getUsers: async (): Promise<UserData[]> => {
    await apiDelay();
    return getStoredData<UserData>('s&f_users', INITIAL_USERS, false);
  },
  
  getUserByUsername: async (username: string): Promise<UserData | undefined> => { 
    await apiDelay();
    const users = getStoredData<UserData>('s&f_users', [], false);
    return users.find(user => user.username.toLowerCase() === username.toLowerCase());
  },
  
  getUserByEmail: async (email: string): Promise<UserData | undefined> => {
    await apiDelay();
    const users = getStoredData<UserData>('s&f_users', [], false);
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
  },
  
  getUserById: async (id: string): Promise<UserData | undefined> => {
    await apiDelay();
    const users = getStoredData<UserData>('s&f_users', [], false);
    return users.find(user => user.id === id);
  },
  
  addUser: async (userData: Omit<UserData, 'id' | 'isBanned' | 'registrationDate' | 'passwordHash'> & {password: string}): Promise<UserData> => {
    await apiDelay();
    const users = getStoredData<UserData>('s&f_users', [], false);
    
    if (users.some(u => u.username.toLowerCase() === userData.username.toLowerCase())) {
        throw new Error("Username already exists.");
    }
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
        throw new Error("Email already exists.");
    }

    const newUser: UserData = {
      id: generateId(),
      username: userData.username, 
      email: userData.email,
      passwordHash: userData.password, // Storing plain password for mock
      role: userData.role || 'user',
      isBanned: false,
      registrationDate: new Date().toISOString(),
      acceptedTermsDate: new Date().toISOString(), 
      name: userData.name,
      country: userData.country,
      preferredStyles: userData.preferredStyles,
      userProfileType: userData.userProfileType,
    };
    setStoredData('s&f_users', [...users, newUser]);
    return newUser;
  },
  
  updateUser: async (updatedUser: UserData): Promise<UserData> => {
    await apiDelay();
    let users = getStoredData<UserData>('s&f_users', [], false);
    users = users.map(user => user.id === updatedUser.id ? updatedUser : user);
    setStoredData('s&f_users', users);
    return updatedUser;
  },
};

export default cmsService;