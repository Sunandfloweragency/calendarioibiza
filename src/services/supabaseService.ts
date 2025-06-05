import { supabase, supabaseAdmin } from '../lib/supabase';
import { Event, DJ, Club, Promoter, User } from '../types/supabase';

export class SupabaseService {
  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // Eventos
  async getEvents(): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'approved')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      throw new Error('Error al cargar eventos');
    }

    return data?.map(this.transformEvent) || [];
  }

  async getEventById(id: string): Promise<Event | undefined> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching event:', error);
      return undefined;
    }

    return data ? this.transformEvent(data) : undefined;
  }

  async addEvent(eventData: Omit<Event, 'id' | 'slug' | 'status' | 'submittedBy' | 'createdAt' | 'updatedAt'>, isMigration = false): Promise<Event> {
    const slug = this.generateSlug(eventData.name);
    
    let submittedById = '00000000-0000-0000-0000-000000000001';
    
    if (isMigration) {
      submittedById = await this.ensureMigrationUser();
    }
    
    console.log('🔧 addEvent - Datos a insertar:', {
      name: eventData.name,
      slug: slug,
      description: eventData.description || '',
      date: eventData.date,
      time: eventData.time || '',
      price: eventData.price || '',
      image_url: eventData.imageUrl || '',
      event_type: eventData.eventType || 'party',
      club_id: eventData.clubId || null,
      promoter_id: eventData.promoterId || null,
      dj_ids: eventData.djIds || [],
      social_links: eventData.socialLinks || [],
      original_source_url: eventData.originalSourceUrl || '',
      import_notes: eventData.importNotes || '',
      status: 'approved',
      submitted_by: submittedById
    });

    // Usar cliente admin para migraciones, cliente normal para operaciones regulares
    const client = isMigration ? supabaseAdmin : supabase;
    
    const { data, error } = await client
      .from('events')
      .insert({
        name: eventData.name,
        slug: slug,
        description: eventData.description || '',
        date: eventData.date,
        time: eventData.time || '',
        price: eventData.price || '',
        image_url: eventData.imageUrl || '',
        event_type: eventData.eventType || 'party',
        club_id: eventData.clubId || null,
        promoter_id: eventData.promoterId || null,
        dj_ids: eventData.djIds || [],
        social_links: eventData.socialLinks || [],
        original_source_url: eventData.originalSourceUrl || '',
        import_notes: eventData.importNotes || '',
        status: isMigration ? 'approved' : 'pending',
        submitted_by: submittedById
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error adding event - Detalles:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw new Error(`Error al crear evento: ${error.message}`);
    }

    console.log('✅ Evento creado exitosamente:', data);
    return this.transformEvent(data);
  }

  async updateEvent(eventData: Event): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .update({
        name: eventData.name,
        slug: eventData.slug,
        description: eventData.description,
        date: eventData.date,
        time: eventData.time,
        price: eventData.price,
        image_url: eventData.imageUrl,
        event_type: eventData.eventType,
        club_id: eventData.clubId,
        promoter_id: eventData.promoterId,
        dj_ids: eventData.djIds,
        social_links: eventData.socialLinks,
        original_source_url: eventData.originalSourceUrl,
        import_notes: eventData.importNotes,
        status: eventData.status
      })
      .eq('id', eventData.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating event:', error);
      throw new Error('Error al actualizar evento');
    }

    return this.transformEvent(data);
  }

  async deleteEvent(id: string): Promise<void> {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting event:', error);
      throw new Error('Error al eliminar evento');
    }
  }

  // DJs
  async getDJs(): Promise<DJ[]> {
    const { data, error } = await supabase
      .from('djs')
      .select('*')
      .eq('status', 'approved')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching DJs:', error);
      throw new Error('Error al cargar DJs');
    }

    return data?.map(this.transformDJ) || [];
  }

  async getDJById(id: string): Promise<DJ | undefined> {
    const { data, error } = await supabase
      .from('djs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching DJ:', error);
      return undefined;
    }

    return data ? this.transformDJ(data) : undefined;
  }

  async addDJ(djData: Omit<DJ, 'id' | 'slug' | 'status' | 'submittedBy' | 'createdAt' | 'updatedAt'>, isMigration = false): Promise<DJ> {
    const slug = this.generateSlug(djData.name);
    
    let submittedById = '00000000-0000-0000-0000-000000000001';
    
    if (isMigration) {
      submittedById = await this.ensureMigrationUser();
    }
    
    console.log('🔧 addDJ - Datos a insertar:', {
      name: djData.name,
      slug: slug,
      description: djData.description || '',
      image_url: djData.imageUrl || '',
      genre: djData.genre || '',
      social_links: djData.socialLinks || [],
      status: isMigration ? 'approved' : 'pending',
      submitted_by: submittedById
    });

    // Usar cliente admin para migraciones, cliente normal para operaciones regulares
    const client = isMigration ? supabaseAdmin : supabase;

    const { data, error } = await client
      .from('djs')
      .insert({
        name: djData.name,
        slug: slug,
        description: djData.description || '',
        image_url: djData.imageUrl || '',
        genre: djData.genre || '',
        social_links: djData.socialLinks || [],
        status: isMigration ? 'approved' : 'pending',
        submitted_by: submittedById
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error adding DJ - Detalles:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw new Error(`Error al crear DJ: ${error.message}`);
    }

    console.log('✅ DJ creado exitosamente:', data);
    return this.transformDJ(data);
  }

  async updateDJ(djData: DJ): Promise<DJ> {
    const { data, error } = await supabase
      .from('djs')
      .update({
        name: djData.name,
        slug: djData.slug,
        description: djData.description,
        image_url: djData.imageUrl,
        genre: djData.genre,
        social_links: djData.socialLinks,
        status: djData.status
      })
      .eq('id', djData.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating DJ:', error);
      throw new Error('Error al actualizar DJ');
    }

    return this.transformDJ(data);
  }

  async deleteDJ(id: string): Promise<void> {
    const { error } = await supabase
      .from('djs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting DJ:', error);
      throw new Error('Error al eliminar DJ');
    }
  }

  // Clubs
  async getClubs(): Promise<Club[]> {
    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .eq('status', 'approved')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching clubs:', error);
      throw new Error('Error al cargar clubs');
    }

    return data?.map(this.transformClub) || [];
  }

  async getClubById(id: string): Promise<Club | undefined> {
    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching club:', error);
      return undefined;
    }

    return data ? this.transformClub(data) : undefined;
  }

  async addClub(clubData: Omit<Club, 'id' | 'slug' | 'status' | 'submittedBy' | 'createdAt' | 'updatedAt'>, isMigration = false): Promise<Club> {
    const slug = this.generateSlug(clubData.name);
    
    let submittedById = '00000000-0000-0000-0000-000000000001';
    
    if (isMigration) {
      submittedById = await this.ensureMigrationUser();
    }
    
    console.log('🔧 addClub - Datos a insertar:', {
      name: clubData.name,
      slug: slug,
      description: clubData.description || '',
      location: clubData.location || '',
      image_url: clubData.imageUrl || '',
      capacity: clubData.capacity || null,
      social_links: clubData.socialLinks || [],
      status: isMigration ? 'approved' : 'pending',
      submitted_by: submittedById
    });

    // Usar cliente admin para migraciones, cliente normal para operaciones regulares
    const client = isMigration ? supabaseAdmin : supabase;
    
    const { data, error } = await client
      .from('clubs')
      .insert({
        name: clubData.name,
        slug: slug,
        description: clubData.description,
        location: clubData.location,
        image_url: clubData.imageUrl,
        capacity: clubData.capacity,
        social_links: clubData.socialLinks,
        status: isMigration ? 'approved' : 'pending',
        submitted_by: submittedById
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error adding club - Detalles:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw new Error(`Error al crear club: ${error.message}`);
    }

    console.log('✅ Club creado exitosamente:', data);
    return this.transformClub(data);
  }

  async updateClub(clubData: Club): Promise<Club> {
    const { data, error } = await supabase
      .from('clubs')
      .update({
        name: clubData.name,
        slug: clubData.slug,
        description: clubData.description,
        location: clubData.location,
        image_url: clubData.imageUrl,
        capacity: clubData.capacity,
        social_links: clubData.socialLinks,
        status: clubData.status
      })
      .eq('id', clubData.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating club:', error);
      throw new Error('Error al actualizar club');
    }

    return this.transformClub(data);
  }

  async deleteClub(id: string): Promise<void> {
    const { error } = await supabase
      .from('clubs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting club:', error);
      throw new Error('Error al eliminar club');
    }
  }

  // Promoters
  async getPromoters(): Promise<Promoter[]> {
    const { data, error } = await supabase
      .from('promoters')
      .select('*')
      .eq('status', 'approved')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching promoters:', error);
      throw new Error('Error al cargar promotores');
    }

    return data?.map(this.transformPromoter) || [];
  }

  async getPromoterById(id: string): Promise<Promoter | undefined> {
    const { data, error } = await supabase
      .from('promoters')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching promoter:', error);
      return undefined;
    }

    return data ? this.transformPromoter(data) : undefined;
  }

  async addPromoter(promoterData: Omit<Promoter, 'id' | 'slug' | 'status' | 'submittedBy' | 'createdAt' | 'updatedAt'>, isMigration = false): Promise<Promoter> {
    const slug = this.generateSlug(promoterData.name);
    
    let submittedById = '00000000-0000-0000-0000-000000000001';
    
    if (isMigration) {
      submittedById = await this.ensureMigrationUser();
    }
    
    console.log('🔧 addPromoter - Datos a insertar:', {
      name: promoterData.name,
      slug: slug,
      description: promoterData.description || '',
      image_url: promoterData.imageUrl || '',
      social_links: promoterData.socialLinks || [],
      status: isMigration ? 'approved' : 'pending',
      submitted_by: submittedById
    });

    // Usar cliente admin para migraciones, cliente normal para operaciones regulares
    const client = isMigration ? supabaseAdmin : supabase;

    const { data, error } = await client
      .from('promoters')
      .insert({
        name: promoterData.name,
        slug: slug,
        description: promoterData.description || '',
        image_url: promoterData.imageUrl || '',
        social_links: promoterData.socialLinks || [],
        status: isMigration ? 'approved' : 'pending',
        submitted_by: submittedById
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error adding promoter - Detalles:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw new Error(`Error al crear promotor: ${error.message}`);
    }

    console.log('✅ Promotor creado exitosamente:', data);
    return this.transformPromoter(data);
  }

  async updatePromoter(promoterData: Promoter): Promise<Promoter> {
    const { data, error } = await supabase
      .from('promoters')
      .update({
        name: promoterData.name,
        slug: promoterData.slug,
        description: promoterData.description,
        image_url: promoterData.imageUrl,
        social_links: promoterData.socialLinks,
        status: promoterData.status
      })
      .eq('id', promoterData.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating promoter:', error);
      throw new Error('Error al actualizar promotor');
    }

    return this.transformPromoter(data);
  }

  async deletePromoter(id: string): Promise<void> {
    const { error } = await supabase
      .from('promoters')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting promoter:', error);
      throw new Error('Error al eliminar promotor');
    }
  }

  // Users
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      throw new Error('Error al cargar usuarios');
    }

    return data?.map(this.transformUser) || [];
  }

  async updateUser(userData: User): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update({
        email: userData.email,
        name: userData.name,
        role: userData.role,
        is_banned: userData.isBanned
      })
      .eq('id', userData.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      throw new Error('Error al actualizar usuario');
    }

    return this.transformUser(data);
  }

  // Métodos de transformación
  private transformEvent(data: any): Event {
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      date: data.date,
      time: data.time,
      price: data.price,
      imageUrl: data.image_url,
      eventType: data.event_type,
      clubId: data.club_id,
      promoterId: data.promoter_id,
      djIds: data.dj_ids || [],
      socialLinks: data.social_links || [],
      originalSourceUrl: data.original_source_url,
      importNotes: data.import_notes,
      status: data.status,
      submittedBy: data.submitted_by,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  private transformDJ(data: any): DJ {
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      imageUrl: data.image_url,
      genre: data.genre,
      socialLinks: data.social_links || [],
      status: data.status,
      submittedBy: data.submitted_by,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  private transformClub(data: any): Club {
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      location: data.location,
      imageUrl: data.image_url,
      capacity: data.capacity,
      socialLinks: data.social_links || [],
      status: data.status,
      submittedBy: data.submitted_by,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  private transformPromoter(data: any): Promoter {
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      imageUrl: data.image_url,
      socialLinks: data.social_links || [],
      status: data.status,
      submittedBy: data.submitted_by,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  private transformUser(data: any): User {
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      isBanned: data.is_banned,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  // Métodos de autenticación (placeholder)
  async login(credentials: { email: string; password: string }) {
    // Implementar autenticación con Supabase Auth
    throw new Error('Método no implementado');
  }

  async register(userData: any) {
    // Implementar registro con Supabase Auth
    throw new Error('Método no implementado');
  }

  async logout() {
    // Implementar logout con Supabase Auth
    throw new Error('Método no implementado');
  }

  // Métodos adicionales
  async uploadImage(file: File): Promise<{ url: string; publicId: string }> {
    // Implementar subida de imágenes con Supabase Storage
    throw new Error('Método no implementado');
  }

  // Método helper para asegurar que existe un usuario para migraciones
  private async ensureMigrationUser(): Promise<string> {
    const migrationUserId = '00000000-0000-0000-0000-000000000001';
    
    try {
      // Intentar obtener el usuario de migración
      const { data: existingUser, error: getUserError } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('id', migrationUserId)
        .single();

      if (existingUser) {
        return migrationUserId;
      }

      // Si no existe, crear el usuario de migración
      const { data: newUser, error: createUserError } = await supabaseAdmin
        .from('users')
        .insert({
          id: migrationUserId,
          email: 'migration@sunandflower.agency',
          name: 'Sistema de Migración',
          role: 'ADMIN',
          is_banned: false
        })
        .select()
        .single();

      if (createUserError) {
        console.error('Error creando usuario de migración:', createUserError);
        // Si no se puede crear el usuario, intentar con un UUID aleatorio
        return crypto.randomUUID();
      }

      console.log('✅ Usuario de migración creado:', newUser);
      return migrationUserId;

    } catch (error) {
      console.error('Error en ensureMigrationUser:', error);
      // Como fallback, generar un UUID aleatorio
      return crypto.randomUUID();
    }
  }
}

export const supabaseService = new SupabaseService(); 