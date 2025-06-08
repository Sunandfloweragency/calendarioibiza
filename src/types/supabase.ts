export interface Event {
  id: string;
  name: string;
  slug: string;
  description?: string;
  date: string;
  time?: string;
  price?: string;
  imageUrl?: string;
  eventType?: string;
  clubId?: string;
  promoterId?: string;
  djIds?: string[];
  socialLinks?: { platform: string; url: string }[];
  originalSourceUrl?: string;
  importNotes?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Club {
  id: string;
  name: string;
  slug: string;
  description?: string;
  location?: string;
  imageUrl?: string;
  capacity?: number;
  socialLinks?: { platform: string; url: string }[];
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DJ {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  genre?: string;
  socialLinks?: { platform: string; url: string }[];
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Promoter {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  socialLinks?: { platform: string; url: string }[];
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  role: 'user' | 'moderator' | 'admin';
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
} 