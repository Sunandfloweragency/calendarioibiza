import { createClient } from '@supabase/supabase-js'

// Usar variables de entorno para mayor seguridad
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lgtsfnhzscekojngdcii.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxndHNmbmh6c2Nla29qbmdkY2lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNTg4MzksImV4cCI6MjA2NTYzNDgzOX0.sFJKaMCKoLpJy9Lqh88VKqmHtdDBi0x6eC8uKSKlYaQ'
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxndHNmbmh6c2Nla29qbmdkY2lpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDA1ODgzOSwiZXhwIjoyMDY1NjM0ODM5fQ.LB6QXfVSTQT9lMn0VhQd9u2iAPhZOGKJMzFpSqd9J-Y'

// Verificar que las variables de entorno estén configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Las variables de entorno de Supabase no están configuradas correctamente');
  console.error('Necesitas configurar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY');
}

// Validación adicional de conexión
const validateConnection = async () => {
  try {
    console.log('🔍 Validando conexión a Supabase...');
    console.log('📍 URL:', supabaseUrl);
    console.log('🔑 Anon Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NO CONFIGURADA');
    
    // Test básico de conexión
    const testClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await testClient.from('events').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Error de conexión:', error.message);
      return false;
    }
    
    console.log('✅ Conexión a Supabase exitosa');
    return true;
  } catch (err) {
    console.error('❌ Error validando conexión:', err);
    return false;
  }
};

// Cliente público para operaciones normales
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// Cliente administrativo para operaciones sin RLS
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Debug info en desarrollo
if (import.meta.env.DEV) {
  console.log('🔗 Supabase configurado:', {
    url: supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
    hasServiceKey: !!supabaseServiceKey,
    environment: import.meta.env.MODE
  });
  
  // Validar conexión en desarrollo
  validateConnection();
}

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
          username: string
          password_hash: string
          name: string | null
          role: 'user' | 'moderator' | 'admin'
          is_banned: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          username: string
          password_hash: string
          name?: string | null
          role?: 'user' | 'moderator' | 'admin'
          is_banned?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          password_hash?: string
          name?: string | null
          role?: 'user' | 'moderator' | 'admin'
          is_banned?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 