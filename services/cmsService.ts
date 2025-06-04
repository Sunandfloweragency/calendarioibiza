import { UserData, EventData, DJData, PromoterData, ClubData } from '../types';

// Datos básicos en memoria para evitar problemas de localStorage
const BASIC_EVENTS: EventData[] = [
  {
    id: 'event-1',
    name: 'Sunset Session',
    slug: 'sunset-session',
    description: 'Una sesión de música electrónica al atardecer',
    date: '2025-07-15',
    time: '20:00',
    price: '€50',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    eventType: 'Party',
    clubId: 'club-1',
    promoterId: 'promoter-1',
    djIds: ['dj-1'],
    socialLinks: [],
    status: 'approved',
    submittedBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'event-2',
    name: 'Beach Club Opening',
    slug: 'beach-club-opening',
    description: 'Inauguración de temporada en el beach club',
    date: '2025-06-20',
    time: '18:00',
    price: '€75',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    eventType: 'Opening',
    clubId: 'club-2',
    promoterId: 'promoter-2',
    djIds: ['dj-2'],
    socialLinks: [],
    status: 'approved',
    submittedBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const BASIC_DJS: DJData[] = [
  {
    id: 'dj-1',
    name: 'DJ Martinez',
    slug: 'dj-martinez',
    bio: 'DJ especializado en house y techno',
    description: 'DJ especializado en house y techno',
    photoUrl: 'https://picsum.photos/200/200?random=10',
    genres: ['House', 'Techno'],
    socialLinks: [],
    status: 'approved',
    submittedBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'dj-2',
    name: 'Sara Beats',
    slug: 'sara-beats',
    bio: 'Productora y DJ de música electrónica',
    description: 'Productora y DJ de música electrónica',
    photoUrl: 'https://picsum.photos/200/200?random=11',
    genres: ['Deep House', 'Progressive'],
    socialLinks: [],
    status: 'approved',
    submittedBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const BASIC_CLUBS: ClubData[] = [
  {
    id: 'club-1',
    name: 'Ocean Club',
    slug: 'ocean-club',
    description: 'Club frente al mar con las mejores vistas',
    address: 'Playa d\'en Bossa, Ibiza',
    photos: ['https://picsum.photos/400/300?random=20'],
    musicType: 'House, Techno',
    services: ['Bar', 'VIP', 'Terraza'],
    socialLinks: [],
    status: 'approved',
    submittedBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'club-2',
    name: 'Sunset Beach',
    slug: 'sunset-beach',
    description: 'Beach club exclusivo para disfrutar del atardecer',
    address: 'San Antonio, Ibiza',
    photos: ['https://picsum.photos/400/300?random=21'],
    musicType: 'Deep House, Chill Out',
    services: ['Bar', 'Restaurant', 'Pool'],
    socialLinks: [],
    status: 'approved',
    submittedBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const BASIC_PROMOTERS: PromoterData[] = [
  {
    id: 'promoter-1',
    name: 'Ibiza Events Co',
    slug: 'ibiza-events-co',
    description: 'Organizadores de los mejores eventos de la isla',
    logoUrl: 'https://picsum.photos/200/200?random=30',
    history: 'Organizando eventos desde 2015',
    eventTypeFocus: 'Pool Party, Beach Club',
    socialLinks: [],
    status: 'approved',
    submittedBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'promoter-2',
    name: 'White Island Parties',
    slug: 'white-island-parties',
    description: 'Especialistas en fiestas VIP y eventos exclusivos',
    logoUrl: 'https://picsum.photos/200/200?random=31',
    history: 'Más de 10 años creando experiencias únicas',
    eventTypeFocus: 'VIP Party, Exclusive Event',
    socialLinks: [],
    status: 'approved',
    submittedBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const BASIC_USERS: UserData[] = [
  {
    id: 'admin',
    username: 'admin',
    email: 'admin@sunflower.com',
    passwordHash: 'admin123',
    name: 'Admin',
    role: 'admin',
    isBanned: false,
    registrationDate: new Date().toISOString()
  }
];

// Simple in-memory storage
let eventsData = [...BASIC_EVENTS];
let djsData = [...BASIC_DJS];
let clubsData = [...BASIC_CLUBS];
let promotersData = [...BASIC_PROMOTERS];
let usersData = [...BASIC_USERS];

const generateId = () => Math.random().toString(36).substr(2, 9);
const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const cmsService = {
  // Events
  getEvents: async (): Promise<EventData[]> => {
    return [...eventsData];
  },
  
  getEventById: async (id: string): Promise<EventData | undefined> => {
    return eventsData.find(event => event.id === id);
  },
  
  addEvent: async (event: Omit<EventData, 'id' | 'slug'>): Promise<EventData> => {
    const newEvent: EventData = { 
      ...event, 
      id: generateId(), 
      slug: slugify(event.name),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    eventsData.push(newEvent);
    return newEvent;
  },
  
  updateEvent: async (updatedEvent: EventData): Promise<EventData> => {
    const index = eventsData.findIndex(event => event.id === updatedEvent.id);
    if (index !== -1) {
      eventsData[index] = { ...updatedEvent, updatedAt: new Date().toISOString() };
      return eventsData[index];
    }
    throw new Error('Event not found');
  },
  
  deleteEvent: async (id: string): Promise<void> => {
    eventsData = eventsData.filter(event => event.id !== id);
  },

  // DJs
  getDJs: async (): Promise<DJData[]> => {
    return [...djsData];
  },
  
  getDJById: async (id: string): Promise<DJData | undefined> => {
    return djsData.find(dj => dj.id === id);
  },
  
  addDJ: async (dj: Omit<DJData, 'id' | 'slug'>): Promise<DJData> => {
    const newDJ: DJData = { 
      ...dj, 
      id: generateId(), 
      slug: slugify(dj.name),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    djsData.push(newDJ);
    return newDJ;
  },
  
  updateDJ: async (updatedDJ: DJData): Promise<DJData> => {
    const index = djsData.findIndex(dj => dj.id === updatedDJ.id);
    if (index !== -1) {
      djsData[index] = { ...updatedDJ, updatedAt: new Date().toISOString() };
      return djsData[index];
    }
    throw new Error('DJ not found');
  },
  
  deleteDJ: async (id: string): Promise<void> => {
    djsData = djsData.filter(dj => dj.id !== id);
  },

  // Clubs
  getClubs: async (): Promise<ClubData[]> => {
    return [...clubsData];
  },
  
  getClubById: async (id: string): Promise<ClubData | undefined> => {
    return clubsData.find(club => club.id === id);
  },
  
  addClub: async (club: Omit<ClubData, 'id' | 'slug'>): Promise<ClubData> => {
    const newClub: ClubData = { 
      ...club, 
      id: generateId(), 
      slug: slugify(club.name),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    clubsData.push(newClub);
    return newClub;
  },
  
  updateClub: async (updatedClub: ClubData): Promise<ClubData> => {
    const index = clubsData.findIndex(club => club.id === updatedClub.id);
    if (index !== -1) {
      clubsData[index] = { ...updatedClub, updatedAt: new Date().toISOString() };
      return clubsData[index];
    }
    throw new Error('Club not found');
  },
  
  deleteClub: async (id: string): Promise<void> => {
    clubsData = clubsData.filter(club => club.id !== id);
  },

  // Promoters
  getPromoters: async (): Promise<PromoterData[]> => {
    return [...promotersData];
  },
  
  getPromoterById: async (id: string): Promise<PromoterData | undefined> => {
    return promotersData.find(promoter => promoter.id === id);
  },
  
  addPromoter: async (promoter: Omit<PromoterData, 'id' | 'slug'>): Promise<PromoterData> => {
    const newPromoter: PromoterData = { 
      ...promoter, 
      id: generateId(), 
      slug: slugify(promoter.name),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    promotersData.push(newPromoter);
    return newPromoter;
  },
  
  updatePromoter: async (updatedPromoter: PromoterData): Promise<PromoterData> => {
    const index = promotersData.findIndex(promoter => promoter.id === updatedPromoter.id);
    if (index !== -1) {
      promotersData[index] = { ...updatedPromoter, updatedAt: new Date().toISOString() };
      return promotersData[index];
    }
    throw new Error('Promoter not found');
  },
  
  deletePromoter: async (id: string): Promise<void> => {
    promotersData = promotersData.filter(promoter => promoter.id !== id);
  },

  // Users
  getUsers: async (): Promise<UserData[]> => {
    return [...usersData];
  },
  
  getUserById: async (id: string): Promise<UserData | undefined> => {
    return usersData.find(user => user.id === id);
  },
  
  // Auth methods
  login: async (email: string, password: string): Promise<UserData | null> => {
    if ((email === 'admin@sunflower.com' && password === 'admin123') ||
        (email === 'AdminBassse' && password === 'admin123') ||
        (email === 'AdminSF' && password === 'admin123')) {
      return usersData.find(user => user.email === 'admin@sunflower.com') || null;
    }
    return null;
  }
};

export default cmsService;