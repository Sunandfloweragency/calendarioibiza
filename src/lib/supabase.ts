import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zxuucjdnnqpkwdatdare.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4dXVjamRubnFwa3dkYXRkYXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2MTE1MjQsImV4cCI6MjA2MzE4NzUyNH0.P9uWY2UbsLCiOx7PuuELq2cKP2dy2_-_5eEccMaXNQA'

// Clave de servicio actualizada con la correcta
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4dXVjamRubnFwa3dkYXRkYXJlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzYxMTUyNCwiZXhwIjoyMDYzMTg3NTI0fQ.u4CQLmBBOvJ3y2N00ZMyjf3nISleTH9I8fXQULLlT74'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente administrativo para operaciones sin RLS (como migraciones)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Tipos para las tablas de Supabase
export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          date: string
          time: string | null
          price: string | null
          image_url: string | null
          event_type: string | null
          club_id: string | null
          promoter_id: string | null
          dj_ids: string[] | null
          social_links: any[] | null
          original_source_url: string | null
          import_notes: string | null
          status: 'pending' | 'approved' | 'rejected'
          submitted_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          date: string
          time?: string | null
          price?: string | null
          image_url?: string | null
          event_type?: string | null
          club_id?: string | null
          promoter_id?: string | null
          dj_ids?: string[] | null
          social_links?: any[] | null
          original_source_url?: string | null
          import_notes?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          submitted_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          date?: string
          time?: string | null
          price?: string | null
          image_url?: string | null
          event_type?: string | null
          club_id?: string | null
          promoter_id?: string | null
          dj_ids?: string[] | null
          social_links?: any[] | null
          original_source_url?: string | null
          import_notes?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          submitted_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      djs: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          genre: string | null
          social_links: any[] | null
          status: 'pending' | 'approved' | 'rejected'
          submitted_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          genre?: string | null
          social_links?: any[] | null
          status?: 'pending' | 'approved' | 'rejected'
          submitted_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          genre?: string | null
          social_links?: any[] | null
          status?: 'pending' | 'approved' | 'rejected'
          submitted_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      clubs: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          location: string | null
          image_url: string | null
          capacity: number | null
          social_links: any[] | null
          status: 'pending' | 'approved' | 'rejected'
          submitted_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          location?: string | null
          image_url?: string | null
          capacity?: number | null
          social_links?: any[] | null
          status?: 'pending' | 'approved' | 'rejected'
          submitted_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          location?: string | null
          image_url?: string | null
          capacity?: number | null
          social_links?: any[] | null
          status?: 'pending' | 'approved' | 'rejected'
          submitted_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      promoters: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          social_links: any[] | null
          status: 'pending' | 'approved' | 'rejected'
          submitted_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          social_links?: any[] | null
          status?: 'pending' | 'approved' | 'rejected'
          submitted_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          social_links?: any[] | null
          status?: 'pending' | 'approved' | 'rejected'
          submitted_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          role: 'USER' | 'MODERATOR' | 'ADMIN'
          is_banned: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          role?: 'USER' | 'MODERATOR' | 'ADMIN'
          is_banned?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: 'USER' | 'MODERATOR' | 'ADMIN'
          is_banned?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 