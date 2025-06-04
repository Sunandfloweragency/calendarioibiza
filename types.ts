export type UserRole = 'user' | 'admin';

export interface UserData {
  id: string;
  username: string; 
  email: string;
  passwordHash: string; 
  role: UserRole;
  isBanned: boolean;
  registrationDate: string; // ISO string
  acceptedTermsDate?: string; // ISO string
  name?: string; 
  country?: string; // New
  preferredStyles?: string[]; // New (e.g., music genres, event types)
  userProfileType?: 'consumer' | 'dj' | 'promoter_staff' | 'venue_staff' | 'artist'; // New
}

// Nuevo tipo para manejar fotos/imágenes
export interface MediaItem {
  id: string;
  url: string;
  alt?: string;
  caption?: string;
  type: 'image' | 'video';
  isMain?: boolean; // Para identificar la foto principal
  uploadMethod?: 'url' | 'google_drive' | 'upload'; // Método de subida
  driveFileId?: string; // ID del archivo en Google Drive si aplica
}

export interface BaseEntity {
  id: string;
  name: string;
  slug: string;
  description: string; 
  socialLinks?: { platform: string; url: string }[];
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string; // User ID
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  // Nuevo sistema de galerías
  mainImage?: MediaItem; // Imagen principal
  gallery?: MediaItem[]; // Galería de imágenes adicionales
}

export interface DJData extends BaseEntity {
  photoUrl: string; // Mantener para compatibilidad
  genres: string[];
  bio: string;
  // Nuevos campos para el minisite
  realName?: string; // Nombre real del DJ
  country?: string;
  yearsActive?: string; // e.g., "2010-present"
  recordLabels?: string[]; // Sellos discográficos
  achievements?: string[]; // Logros destacados
  upcomingEvents?: string[]; // IDs de eventos futuros
  pastEvents?: string[]; // IDs de eventos pasados
  collaborations?: string[]; // IDs de otros DJs con los que ha colaborado
}

export interface PromoterData extends BaseEntity {
  logoUrl: string; // Mantener para compatibilidad
  history: string; 
  eventTypeFocus: string;
  // Nuevos campos para el minisite
  foundedYear?: number;
  headquarters?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  teamMembers?: Array<{
    name: string;
    role: string;
    photo?: string;
  }>;
  organisedEvents?: string[]; // IDs de eventos organizados
  partnerClubs?: string[]; // IDs de clubs con los que trabajan
  featuredArtists?: string[]; // IDs de DJs que han trabajado con ellos
}

export interface ClubData extends BaseEntity {
  photos: string[]; // Mantener para compatibilidad
  address: string;
  mapLink?: string;
  musicType: string;
  services: string[];
  // Nuevos campos para el minisite
  capacity?: number;
  openingHours?: {
    [day: string]: string; // e.g., "monday": "22:00-06:00"
  };
  priceRange?: string; // e.g., "€20-€80"
  dresscode?: string;
  ageRestriction?: string; // e.g., "18+", "21+"
  parkingInfo?: string;
  publicTransport?: string;
  amenities?: string[]; // e.g., ["VIP Area", "Smoking Area", "Outdoor Terrace"]
  pastEvents?: string[]; // IDs de eventos que se han celebrado aquí
  residencies?: Array<{ // DJs/promotores con residencia
    djId?: string;
    promoterId?: string;
    name: string;
    description: string;
    frequency: string; // e.g., "Every Saturday"
  }>;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface EventData {
  id: string;
  name: string;
  slug: string;
  date: string; 
  time: string; 
  description: string; 
  imageUrl: string; // Mantener para compatibilidad
  videoUrl?: string;
  clubId?: string; 
  djIds?: string[]; 
  promoterId?: string; 
  price?: string;
  ticketLink?: string;
  eventType?: string; 
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string; // User ID
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  socialLinks?: { platform: string; url: string }[]; // Added for BaseEntity compatibility in renderers
  originalSourceUrl?: string; // For imported events
  importNotes?: string; // For imported events
  // Nuevos campos para el minisite
  mainImage?: MediaItem; // Imagen principal del evento
  gallery?: MediaItem[]; // Galería de fotos del evento
  endTime?: string; // Hora de finalización
  ageRestriction?: string;
  dresscode?: string;
  lineup?: Array<{ // Lineup detallado
    djId: string;
    timeSlot?: string;
    stage?: string;
    isHeadliner?: boolean;
  }>;
  ticketPrices?: Array<{
    type: string; // e.g., "Early Bird", "Regular", "VIP"
    price: string;
    availability?: string;
  }>;
  specialGuests?: string[]; // Invitados especiales
  theme?: string; // Tema del evento
  weatherPlan?: string; // Plan en caso de mal tiempo (para eventos outdoor)
}

export type EntityType = 'events' | 'djs' | 'promoters' | 'clubs' | 'users';
export type EntityDataUnion = EventData | DJData | PromoterData | ClubData;

// Tipos para el sistema de subida de imágenes
export interface ImageUploadOptions {
  method: 'url' | 'google_drive' | 'file_upload';
  url?: string;
  driveLink?: string;
  file?: File;
}

export interface ImageUploadResponse {
  success: boolean;
  mediaItem?: MediaItem;
  error?: string;
}

export interface AuthContextType {
  currentUser: UserData | null;
  isLoading: boolean;
  isAdmin: () => boolean;
  login: (username: string, password: string) => Promise<UserData | null>;
  register: (
    username: string, 
    email: string, 
    password: string, 
    name?: string,
    country?: string,
    preferredStyles?: string[],
    userProfileType?: 'consumer' | 'dj' | 'promoter_staff' | 'venue_staff' | 'artist'
  ) => Promise<UserData | null>; 
  logout: () => void;
}

export interface FilterOptions {
  date?: string; // YYYY-MM-DD
  eventType?: string;
  djId?: string;
  promoterId?: string;
  clubId?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  slug: string;
  imageUrl?: string;
  clubName?: string;
  djName?: string;
  category?: string;
}

export type SubmissionType = 'Event' | 'DJ' | 'Promoter' | 'Club';

// Combines entity data with its type, used for heterogeneous lists like pending items or user submissions.
export type PendingItem = 
  (EventData & { type: 'Event' }) | 
  (DJData & { type: 'DJ' }) | 
  (PromoterData & { type: 'Promoter' }) | 
  (ClubData & { type: 'Club' });

export type UserSubmissionItem = PendingItem;

export type FormEntityCreateData = 
  Omit<EventData, 'id' | 'slug' | 'status' | 'submittedBy' | 'createdAt' | 'updatedAt'> |
  Omit<DJData, 'id' | 'slug' | 'status' | 'submittedBy' | 'createdAt' | 'updatedAt'> |
  Omit<PromoterData, 'id' | 'slug' | 'status' | 'submittedBy' | 'createdAt' | 'updatedAt'> |
  Omit<ClubData, 'id' | 'slug' | 'status' | 'submittedBy' | 'createdAt' | 'updatedAt'>;

export type FormEntityData = Partial<EventData> | Partial<DJData> | Partial<PromoterData> | Partial<ClubData> | Partial<FormEntityCreateData>;