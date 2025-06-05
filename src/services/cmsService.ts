import { UserData, EventData, DJData, PromoterData, ClubData } from '../types';

// Función para obtener fechas futuras
const getFutureDate = (monthsAhead: number = 0, additionalDays: number = 0) => {
  const now = new Date();
  now.setMonth(now.getMonth() + monthsAhead);
  now.setDate(now.getDate() + additionalDays);
  return now.toISOString().split('T')[0];
};

// Datos básicos optimizados y funcionales
const BASIC_EVENTS: EventData[] = [
  {
    id: 'event-1',
    name: '🔥 SunBeach Club Opening',
    slug: 'sunbeach-club-opening',
    description: 'La apertura más esperada del año con David Guetta y invitados especiales',
    date: getFutureDate(0, 1),
    time: '20:00',
    price: '€80-120',
    imageUrl: 'https://picsum.photos/seed/sunbeachopening/800/600',
    eventType: 'Pool Party',
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
    name: '🌅 Sunset Session with Solomun',
    slug: 'sunset-session-solomun',
    description: 'Una sesión única de sunset con el maestro bosnio en la terraza más bella de Ibiza',
    date: getFutureDate(0, 3),
    time: '18:00',
    price: '€70-100',
    imageUrl: 'https://picsum.photos/seed/solomunsunset/800/600',
    eventType: 'Sunset Session',
    clubId: 'club-2',
    promoterId: 'promoter-2',
    djIds: ['dj-2'],
    socialLinks: [],
    status: 'approved',
    submittedBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'event-3',
    name: '🎭 elrow Psychedelic Trip',
    slug: 'elrow-psychedelic-trip',
    description: 'La fiesta más colorida y loca del mundo aterriza en Ibiza con decoraciones inmersivas',
    date: getFutureDate(0, 5),
    time: '16:00',
    price: '€60-90',
    imageUrl: 'https://picsum.photos/seed/elrowpsyche/800/600',
    eventType: 'Fiesta Temática',
    clubId: 'club-3',
    promoterId: 'promoter-1',
    djIds: ['dj-3'],
    socialLinks: [],
    status: 'approved',
    submittedBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'event-4',
    name: '🌟 Martin Garrix STMPD Experience',
    slug: 'martin-garrix-stmpd-experience',
    description: 'El fenómeno holandés presenta su sello discográfico con invitados especiales',
    date: getFutureDate(0, 7),
    time: '17:00',
    price: '€90-150',
    imageUrl: 'https://picsum.photos/seed/garrixstmpd/800/600',
    eventType: 'Label Showcase',
    clubId: 'club-4',
    promoterId: 'promoter-3',
    djIds: ['dj-4'],
    socialLinks: [],
    status: 'approved',
    submittedBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'event-5',
    name: '🏛️ Circoloco Underground',
    slug: 'circoloco-underground',
    description: 'La experiencia underground más auténtica de Ibiza desde 1999',
    date: getFutureDate(0, 9),
    time: '16:00',
    price: '€40-70',
    imageUrl: 'https://picsum.photos/seed/circoloco/800/600',
    eventType: 'Underground',
    clubId: 'club-5',
    promoterId: 'promoter-2',
    djIds: ['dj-1', 'dj-2'],
    socialLinks: [],
    status: 'approved',
    submittedBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'event-6',
    name: '💎 Calvin Harris Funk Wav Bounces',
    slug: 'calvin-harris-funk-wav',
    description: 'El rey del EDM trae su sonido único con funk, electro y dance music',
    date: getFutureDate(0, 11),
    time: '18:00',
    price: '€100-180',
    imageUrl: 'https://picsum.photos/seed/calvinharris/800/600',
    eventType: 'Pool Party',
    clubId: 'club-1',
    promoterId: 'promoter-1',
    djIds: ['dj-3'],
    socialLinks: [],
    status: 'approved',
    submittedBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'event-7',
    name: '🌙 ANTS Colony Invasion',
    slug: 'ants-colony-invasion',
    description: 'La colonia ANTS invade Ushuaïa con tech house y producción espectacular',
    date: getFutureDate(0, 13),
    time: '17:00',
    price: '€75-120',
    imageUrl: 'https://picsum.photos/seed/antscolony/800/600',
    eventType: 'Pool Party',
    clubId: 'club-3',
    promoterId: 'promoter-3',
    djIds: ['dj-4'],
    socialLinks: [],
    status: 'approved',
    submittedBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'event-8',
    name: '🎪 Paradise City - Jamie Jones',
    slug: 'paradise-city-jamie-jones',
    description: 'Jamie Jones presenta Paradise con decoración tropical y el mejor tech house',
    date: getFutureDate(0, 15),
    time: '17:00',
    price: '€50-80',
    imageUrl: 'https://picsum.photos/seed/paradisecity/800/600',
    eventType: 'Fiesta Temática',
    clubId: 'club-5',
    promoterId: 'promoter-2',
    djIds: ['dj-2'],
    socialLinks: [],
    status: 'approved',
    submittedBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'event-9',
    name: '✨ Glitterbox Love & Dancing',
    slug: 'glitterbox-love-dancing',
    description: 'Celebración de música disco y house con drag queens y bailarines',
    date: getFutureDate(0, 17),
    time: '23:00',
    price: '€55-85',
    imageUrl: 'https://picsum.photos/seed/glitterbox/800/600',
    eventType: 'Disco House',
    clubId: 'club-4',
    promoterId: 'promoter-1',
    djIds: ['dj-1'],
    socialLinks: [],
    status: 'approved',
    submittedBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'event-10',
    name: '🏠 Defected House All Life Long',
    slug: 'defected-house-all-life',
    description: 'El sello house más importante del mundo en una noche épica',
    date: getFutureDate(0, 19),
    time: '22:00',
    price: '€50-75',
    imageUrl: 'https://picsum.photos/seed/defected/800/600',
    eventType: 'House Music',
    clubId: 'club-2',
    promoterId: 'promoter-3',
    djIds: ['dj-3'],
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
    name: 'David Guetta',
    slug: 'david-guetta',
    description: 'DJ y productor francés, uno de los más influyentes de la música electrónica mundial.',
    bio: 'DJ y productor francés, uno de los más influyentes de la música electrónica mundial.',
    photoUrl: 'https://picsum.photos/seed/davidguetta/400/400',
    genres: ['House', 'EDM'],
    socialLinks: [
      { platform: 'Instagram', url: '@davidguetta' },
      { platform: 'Spotify', url: 'David Guetta' }
    ],
    status: 'approved',
    submittedBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'dj-2',
    name: 'Solomun',
    slug: 'solomun',
    description: 'DJ y productor bosnio, conocido por sus sets emocionales y su residencia en Pacha.',
    bio: 'DJ y productor bosnio, conocido por sus sets emocionales y su residencia en Pacha.',
    photoUrl: 'https://picsum.photos/seed/solomun/400/400',
    genres: ['Deep House', 'Melodic Techno'],
    socialLinks: [
      { platform: 'Instagram', url: '@solomun' },
      { platform: 'SoundCloud', url: 'Solomun' }
    ],
    status: 'approved',
    submittedBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'dj-3',
    name: 'Calvin Harris',
    slug: 'calvin-harris',
    description: 'Productor escocés y uno de los DJs mejor pagados del mundo.',
    bio: 'Productor escocés y uno de los DJs mejor pagados del mundo.',
    photoUrl: 'https://picsum.photos/seed/calvinharris/400/400',
    genres: ['EDM', 'House', 'Pop'],
    socialLinks: [
      { platform: 'Instagram', url: '@calvinharris' },
      { platform: 'Twitter', url: '@CalvinHarris' }
    ],
    status: 'approved',
    submittedBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'dj-4',
    name: 'Martin Garrix',
    slug: 'martin-garrix',
    description: 'Fenómeno holandés del EDM y dueño del sello STMPD RCRDS.',
    bio: 'Fenómeno holandés del EDM y dueño del sello STMPD RCRDS.',
    photoUrl: 'https://picsum.photos/seed/martingarrix/400/400',
    genres: ['Progressive House', 'Future Bass', 'EDM'],
    socialLinks: [
      { platform: 'Instagram', url: '@martingarrix' },
      { platform: 'YouTube', url: 'Martin Garrix' }
    ],
    status: 'approved',
    submittedBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const BASIC_CLUBS: ClubData[] = [
  {
    id: 'club-1',
    name: 'Pacha Ibiza',
    slug: 'pacha-ibiza',
    description: 'Club legendario desde 1973, hogar de las mejores residencias de Ibiza.',
    address: 'Avinguda de 8 d\'Agost, 07800 Ibiza',
    photos: ['https://picsum.photos/seed/pacha/800/600'],
    musicType: 'House, Deep House, Tech House',
    services: ['VIP Area', 'Restaurant', 'Terrace'],
    socialLinks: [
      { platform: 'Instagram', url: '@pachaofficial' },
      { platform: 'Website', url: 'https://www.pachaibiza.com' }
    ],
    status: 'approved',
    submittedBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'club-2',
    name: 'Amnesia Ibiza',
    slug: 'amnesia-ibiza',
    description: 'Superclub mundial famoso por sus fiestas épicas y la mejor producción.',
    address: 'Ctra. Ibiza a San Antonio, Km 5, 07816 Sant Rafael',
    photos: ['https://picsum.photos/seed/amnesia/800/600'],
    musicType: 'Techno, House, Trance',
    services: ['Main Room', 'Terrace', 'VIP'],
    socialLinks: [
      { platform: 'Instagram', url: '@amnesia_ibiza' },
      { platform: 'Website', url: 'https://www.amnesia.es' }
    ],
    status: 'approved',
    submittedBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'club-3',
    name: 'Ushuaïa Ibiza',
    slug: 'ushuaia-ibiza',
    description: 'Club al aire libre con pool parties y los mejores DJs del mundo.',
    address: 'Carrer de Platja d\'en Bossa, 10, 07817 Sant Jordi de ses Salines',
    photos: ['https://picsum.photos/seed/ushuaia/800/600'],
    musicType: 'EDM, Progressive House, Big Room',
    services: ['Pool', 'Beach Access', 'VIP Cabanas'],
    socialLinks: [
      { platform: 'Instagram', url: '@ushuaiaibiza' },
      { platform: 'Website', url: 'https://www.ushuaiaibiza.com' }
    ],
    status: 'approved',
    submittedBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'club-4',
    name: 'Hï Ibiza',
    slug: 'hi-ibiza',
    description: 'Superclub ultramoderno con tecnología de última generación.',
    address: 'Carrer de Platja d\'en Bossa, 07817 Sant Jordi de ses Salines',
    photos: ['https://picsum.photos/seed/hiibiza/800/600'],
    musicType: 'House, Techno, Progressive',
    services: ['Theatre', 'Wild Corner', 'VIP'],
    socialLinks: [
      { platform: 'Instagram', url: '@hiibiza' },
      { platform: 'Website', url: 'https://hiibiza.com' }
    ],
    status: 'approved',
    submittedBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'club-5',
    name: 'DC-10',
    slug: 'dc-10',
    description: 'Club underground icónico, hogar de Circoloco y la escena techno más auténtica.',
    address: 'Carretera Salinas Km 1, 07817 Sant Jordi de ses Salines',
    photos: ['https://picsum.photos/seed/dc10/800/600'],
    musicType: 'Underground Techno, Minimal, House',
    services: ['Main Room', 'Garden', 'Underground Vibe'],
    socialLinks: [
      { platform: 'Instagram', url: '@dc10ibiza' },
      { platform: 'Website', url: 'https://dc10ibiza.com' }
    ],
    status: 'approved',
    submittedBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const BASIC_PROMOTERS: PromoterData[] = [
  {
    id: 'promoter-1',
    name: 'Sun & Flower Events',
    slug: 'sun-flower-events',
    description: 'Organizadores de los eventos más exclusivos y memorables de Ibiza',
    logoUrl: 'https://picsum.photos/seed/sunflower/200/200',
    history: 'Creando experiencias únicas en Ibiza desde 2015',
    eventTypeFocus: 'Pool Party, Beach Club, VIP Events',
    socialLinks: [
      { platform: 'Instagram', url: '@sunflowerevents' },
      { platform: 'Website', url: 'https://sunflowerevents.com' }
    ],
    status: 'approved',
    submittedBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'promoter-2',
    name: 'White Island Collective',
    slug: 'white-island-collective',
    description: 'Especialistas en experiencias underground y fiestas temáticas únicas',
    logoUrl: 'https://picsum.photos/seed/whiteisland/200/200',
    history: 'Más de 10 años creando la escena underground de Ibiza',
    eventTypeFocus: 'Underground, Techno, Experiential',
    socialLinks: [
      { platform: 'Instagram', url: '@whiteislandcollective' },
      { platform: 'SoundCloud', url: 'White Island' }
    ],
    status: 'approved',
    submittedBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'promoter-3',
    name: 'Balearic Vibes',
    slug: 'balearic-vibes',
    description: 'Creadores de las mejores experiencias de música electrónica mediterránea',
    logoUrl: 'https://picsum.photos/seed/balearic/200/200',
    history: 'Pioneros del sonido Balearic desde los años 90',
    eventTypeFocus: 'Sunset Sessions, Deep House, Melodic',
    socialLinks: [
      { platform: 'Instagram', url: '@balearicvibes' },
      { platform: 'Spotify', url: 'Balearic Vibes' }
    ],
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

// Storage en memoria simple
let eventsData = [...BASIC_EVENTS];
let djsData = [...BASIC_DJS];
let clubsData = [...BASIC_CLUBS];
let promotersData = [...BASIC_PROMOTERS];
let usersData = [...BASIC_USERS];

const generateId = () => Math.random().toString(36).substr(2, 9);

// CMS Service simplificado y funcional
const cmsService = {
  // Events
  getEvents: async (): Promise<EventData[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...eventsData];
  },

  getEventById: async (id: string): Promise<EventData | null> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    return eventsData.find(event => event.id === id) || null;
  },

  addEvent: async (eventData: Partial<EventData>): Promise<EventData> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const newEvent: EventData = {
      id: generateId(),
      slug: eventData.name?.toLowerCase().replace(/\s+/g, '-') || '',
      name: '',
      description: '',
      date: '',
      time: '',
      imageUrl: '',
      socialLinks: [],
      status: 'approved',
      submittedBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...eventData
    } as EventData;
    eventsData.push(newEvent);
    return newEvent;
  },

  updateEvent: async (eventData: EventData): Promise<EventData> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const index = eventsData.findIndex(event => event.id === eventData.id);
    if (index !== -1) {
      eventsData[index] = { ...eventData, updatedAt: new Date().toISOString() };
      return eventsData[index];
    }
    throw new Error('Event not found');
  },

  deleteEvent: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    eventsData = eventsData.filter(event => event.id !== id);
  },

  // DJs
  getDJs: async (): Promise<DJData[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...djsData];
  },

  getDJById: async (id: string): Promise<DJData | null> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    return djsData.find(dj => dj.id === id) || null;
  },

  addDJ: async (djData: Partial<DJData>): Promise<DJData> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const newDJ: DJData = {
      id: generateId(),
      slug: djData.name?.toLowerCase().replace(/\s+/g, '-') || '',
      name: '',
      description: '',
      bio: '',
      photoUrl: '',
      genres: [],
      socialLinks: [],
      status: 'approved',
      submittedBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...djData
    } as DJData;
    djsData.push(newDJ);
    return newDJ;
  },

  updateDJ: async (djData: DJData): Promise<DJData> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const index = djsData.findIndex(dj => dj.id === djData.id);
    if (index !== -1) {
      djsData[index] = { ...djData, updatedAt: new Date().toISOString() };
      return djsData[index];
    }
    throw new Error('DJ not found');
  },

  deleteDJ: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    djsData = djsData.filter(dj => dj.id !== id);
  },

  // Clubs
  getClubs: async (): Promise<ClubData[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...clubsData];
  },

  getClubById: async (id: string): Promise<ClubData | null> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    return clubsData.find(club => club.id === id) || null;
  },

  addClub: async (clubData: Partial<ClubData>): Promise<ClubData> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const newClub: ClubData = {
      id: generateId(),
      slug: clubData.name?.toLowerCase().replace(/\s+/g, '-') || '',
      name: '',
      description: '',
      address: '',
      photos: [],
      musicType: '',
      services: [],
      socialLinks: [],
      status: 'approved',
      submittedBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...clubData
    } as ClubData;
    clubsData.push(newClub);
    return newClub;
  },

  updateClub: async (clubData: ClubData): Promise<ClubData> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const index = clubsData.findIndex(club => club.id === clubData.id);
    if (index !== -1) {
      clubsData[index] = { ...clubData, updatedAt: new Date().toISOString() };
      return clubsData[index];
    }
    throw new Error('Club not found');
  },

  deleteClub: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    clubsData = clubsData.filter(club => club.id !== id);
  },

  // Promoters
  getPromoters: async (): Promise<PromoterData[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...promotersData];
  },

  getPromoterById: async (id: string): Promise<PromoterData | null> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    return promotersData.find(promoter => promoter.id === id) || null;
  },

  addPromoter: async (promoterData: Partial<PromoterData>): Promise<PromoterData> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const newPromoter: PromoterData = {
      id: generateId(),
      slug: promoterData.name?.toLowerCase().replace(/\s+/g, '-') || '',
      name: '',
      description: '',
      logoUrl: '',
      history: '',
      eventTypeFocus: '',
      socialLinks: [],
      status: 'approved',
      submittedBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...promoterData
    } as PromoterData;
    promotersData.push(newPromoter);
    return newPromoter;
  },

  updatePromoter: async (promoterData: PromoterData): Promise<PromoterData> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const index = promotersData.findIndex(promoter => promoter.id === promoterData.id);
    if (index !== -1) {
      promotersData[index] = { ...promoterData, updatedAt: new Date().toISOString() };
      return promotersData[index];
    }
    throw new Error('Promoter not found');
  },

  deletePromoter: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    promotersData = promotersData.filter(promoter => promoter.id !== id);
  },

  // Users
  getUsers: async (): Promise<UserData[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...usersData];
  },

  getUserById: async (id: string): Promise<UserData | null> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    return usersData.find(user => user.id === id) || null;
  },

  // Authentication
  login: async (email: string, password: string): Promise<UserData | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const user = usersData.find(u => u.email === email && u.passwordHash === password);
    return user || null;
  },

  // Statistics
  getStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
      events: eventsData.length,
      djs: djsData.length,
      clubs: clubsData.length,
      promoters: promotersData.length,
      users: usersData.length
    };
  }
};

export default cmsService;