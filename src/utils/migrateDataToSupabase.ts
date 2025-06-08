import { SupabaseService } from '../services/supabaseService';
import cmsService from '../services/cmsService';
import { Event, DJ, Club, Promoter } from '../types/supabase';
import { supabaseAdmin } from '../lib/supabase';

export class DataMigration {
  private supabaseService: SupabaseService;
  
  constructor() {
    this.supabaseService = new SupabaseService();
  }

  // Función para limpiar registros duplicados (opcional)
  private async cleanupDuplicates(): Promise<void> {
    try {
      console.log('🧹 Limpiando posibles registros duplicados...');
      
      // Esta función es opcional - solo para debug
      const status = await this.checkSupabaseData();
      console.log('📊 Estado actual de Supabase:', status);
      
    } catch (error) {
      console.error('❌ Error limpiando duplicados:', error);
      // No bloquear la migración por este error
    }
  }

  // Función para asegurar que existe un usuario administrativo
  private async ensureAdminUser(): Promise<void> {
    try {
      console.log('🔧 Verificando usuario administrativo...');
      
      // Verificar si existe admin@sunflower.com
      const { data: adminUser } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', 'admin@sunflower.com')
        .single();

      if (adminUser) {
        console.log('✅ Usuario admin@sunflower.com ya existe');
        return;
      }

      // Crear usuario administrativo
      console.log('🆕 Creando usuario administrativo...');
      const { data: newAdmin, error } = await supabaseAdmin
        .from('users')
        .insert({
          id: '00000000-0000-0000-0000-000000000002',
          email: 'admin@sunflower.com',
          username: 'admin_sunflower',
          password_hash: '$2b$10$adminHashForSunflowerCalendar12345', // Hash para admin
          name: 'Administrador',
          role: 'admin',
          is_banned: false
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creando usuario admin:', error);
        throw new Error(`Error creando usuario admin: ${error.message}`);
      }

      console.log('✅ Usuario administrativo creado:', newAdmin.id);

    } catch (error) {
      console.error('❌ Error en ensureAdminUser:', error);
      // No arrojar error, continuar con la migración
    }
  }

  async migrateAllData(): Promise<{
    success: boolean;
    results: {
      clubs: { success: number; failed: number; errors: string[] };
      djs: { success: number; failed: number; errors: string[] };
      promoters: { success: number; failed: number; errors: string[] };
      events: { success: number; failed: number; errors: string[] };
    };
    totalMigrated: number;
  }> {
    console.log('🚀 Iniciando migración de datos a Supabase...');
    
    // Verificar estado actual
    await this.cleanupDuplicates();
    
    // Asegurar que existe un usuario administrativo antes de empezar
    await this.ensureAdminUser();
    
    const results = {
      clubs: { success: 0, failed: 0, errors: [] as string[] },
      djs: { success: 0, failed: 0, errors: [] as string[] },
      promoters: { success: 0, failed: 0, errors: [] as string[] },
      events: { success: 0, failed: 0, errors: [] as string[] }
    };

    try {
      // 1. Migrar Clubs primero (son necesarios para los eventos)
      console.log('📍 Migrando clubs...');
      const clubsMap = await this.migrateClubs(results.clubs);
      
      // 2. Migrar DJs
      console.log('🎧 Migrando DJs...');
      const djsMap = await this.migrateDJs(results.djs);
      
      // 3. Migrar Promoters
      console.log('🏢 Migrando promoters...');
      const promotersMap = await this.migratePromoters(results.promoters);
      
      // 4. Migrar Events (último porque depende de clubs, djs y promoters)
      console.log('🎉 Migrando events...');
      await this.migrateEvents(results.events, clubsMap, djsMap, promotersMap);
      
      const totalMigrated = results.clubs.success + results.djs.success + 
                          results.promoters.success + results.events.success;
      
      console.log('✅ Migración completada:', {
        clubs: `${results.clubs.success} éxito, ${results.clubs.failed} fallos`,
        djs: `${results.djs.success} éxito, ${results.djs.failed} fallos`,
        promoters: `${results.promoters.success} éxito, ${results.promoters.failed} fallos`,
        events: `${results.events.success} éxito, ${results.events.failed} fallos`,
        total: totalMigrated
      });
      
      return {
        success: true,
        results,
        totalMigrated
      };
      
    } catch (error) {
      console.error('❌ Error en migración masiva:', error);
      return {
        success: false,
        results,
        totalMigrated: 0
      };
    }
  }

  private async migrateClubs(results: { success: number; failed: number; errors: string[] }): Promise<Map<string, string>> {
    const clubsMap = new Map<string, string>(); // oldId -> newId
    
    try {
      const cmsClubs = await cmsService.getClubs();
      console.log(`📍 Encontrados ${cmsClubs.length} clubs en localStorage`);
      
      for (const cmsClub of cmsClubs) {
        try {
          const supabaseClub: Omit<Club, 'id' | 'slug' | 'status' | 'submittedBy' | 'createdAt' | 'updatedAt'> = {
            name: cmsClub.name,
            description: cmsClub.description || '',
            location: cmsClub.address || '',
            imageUrl: cmsClub.photos?.[0] || '',
            capacity: undefined,
            socialLinks: cmsClub.socialLinks || []
          };
          
          const newClub = await this.supabaseService.addClub(supabaseClub, true);
          clubsMap.set(cmsClub.id, newClub.id);
          results.success++;
          
          console.log(`✅ Club migrado: ${cmsClub.name} → ${newClub.id}`);
          
        } catch (error) {
          results.failed++;
          const errorMsg = `Error migrando club ${cmsClub.name}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          results.errors.push(errorMsg);
          console.error(errorMsg);
        }
      }
      
    } catch (error) {
      console.error('❌ Error cargando clubs desde localStorage:', error);
    }
    
    return clubsMap;
  }

  private async migrateDJs(results: { success: number; failed: number; errors: string[] }): Promise<Map<string, string>> {
    const djsMap = new Map<string, string>(); // oldId -> newId
    
    try {
      const cmsDJs = await cmsService.getDJs();
      console.log(`🎧 Encontrados ${cmsDJs.length} DJs en localStorage`);
      
      for (const cmsDJ of cmsDJs) {
        try {
          const supabaseDJ: Omit<DJ, 'id' | 'slug' | 'status' | 'submittedBy' | 'createdAt' | 'updatedAt'> = {
            name: cmsDJ.name,
            description: cmsDJ.bio || cmsDJ.description || '',
            imageUrl: cmsDJ.photoUrl || '',
            genre: cmsDJ.genres?.join(', ') || '',
            socialLinks: cmsDJ.socialLinks || []
          };
          
          const newDJ = await this.supabaseService.addDJ(supabaseDJ, true);
          djsMap.set(cmsDJ.id, newDJ.id);
          results.success++;
          
          console.log(`✅ DJ migrado: ${cmsDJ.name} → ${newDJ.id}`);
          
        } catch (error) {
          results.failed++;
          const errorMsg = `Error migrando DJ ${cmsDJ.name}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          results.errors.push(errorMsg);
          console.error(errorMsg);
        }
      }
      
    } catch (error) {
      console.error('❌ Error cargando DJs desde localStorage:', error);
    }
    
    return djsMap;
  }

  private async migratePromoters(results: { success: number; failed: number; errors: string[] }): Promise<Map<string, string>> {
    const promotersMap = new Map<string, string>(); // oldId -> newId
    
    try {
      const cmsPromoters = await cmsService.getPromoters();
      console.log(`🏢 Encontrados ${cmsPromoters.length} promoters en localStorage`);
      
      for (const cmsPromoter of cmsPromoters) {
        try {
          const supabasePromoter: Omit<Promoter, 'id' | 'slug' | 'status' | 'submittedBy' | 'createdAt' | 'updatedAt'> = {
            name: cmsPromoter.name,
            description: cmsPromoter.history || cmsPromoter.description || '',
            imageUrl: cmsPromoter.logoUrl || '',
            socialLinks: cmsPromoter.socialLinks || []
          };
          
          const newPromoter = await this.supabaseService.addPromoter(supabasePromoter, true);
          promotersMap.set(cmsPromoter.id, newPromoter.id);
          results.success++;
          
          console.log(`✅ Promoter migrado: ${cmsPromoter.name} → ${newPromoter.id}`);
          
        } catch (error) {
          results.failed++;
          const errorMsg = `Error migrando promoter ${cmsPromoter.name}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          results.errors.push(errorMsg);
          console.error(errorMsg);
        }
      }
      
    } catch (error) {
      console.error('❌ Error cargando promoters desde localStorage:', error);
    }
    
    return promotersMap;
  }

  private async migrateEvents(
    results: { success: number; failed: number; errors: string[] },
    clubsMap: Map<string, string>,
    djsMap: Map<string, string>,
    promotersMap: Map<string, string>
  ): Promise<void> {
    try {
      const cmsEvents = await cmsService.getEvents();
      console.log(`🎉 Encontrados ${cmsEvents.length} events en localStorage`);
      
      for (const cmsEvent of cmsEvents) {
        try {
          // Mapear IDs antiguos a nuevos IDs de Supabase
          const newClubId = cmsEvent.clubId ? clubsMap.get(cmsEvent.clubId) : null;
          const newPromoterId = cmsEvent.promoterId ? promotersMap.get(cmsEvent.promoterId) : null;
          const newDjIds = cmsEvent.djIds ? 
            cmsEvent.djIds.map(djId => djsMap.get(djId)).filter(id => id !== undefined) as string[] : 
            [];
          
          const supabaseEvent: Omit<Event, 'id' | 'slug' | 'status' | 'submittedBy' | 'createdAt' | 'updatedAt'> = {
            name: cmsEvent.name,
            description: cmsEvent.description || '',
            date: cmsEvent.date,
            time: cmsEvent.time || '',
            price: cmsEvent.price || '',
            imageUrl: cmsEvent.imageUrl || '',
            eventType: cmsEvent.eventType || 'party',
            clubId: newClubId || undefined,
            promoterId: newPromoterId || undefined,
            djIds: newDjIds,
            socialLinks: cmsEvent.socialLinks || [],
            originalSourceUrl: cmsEvent.originalSourceUrl || '',
            importNotes: cmsEvent.importNotes || ''
          };
          
          const newEvent = await this.supabaseService.addEvent(supabaseEvent, true);
          results.success++;
          
          console.log(`✅ Event migrado: ${cmsEvent.name} → ${newEvent.id}`);
          
        } catch (error) {
          results.failed++;
          const errorMsg = `Error migrando event ${cmsEvent.name}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          results.errors.push(errorMsg);
          console.error(errorMsg);
        }
      }
      
    } catch (error) {
      console.error('❌ Error cargando events desde localStorage:', error);
    }
  }

  // Método para verificar el estado de la base de datos
  async checkSupabaseData(): Promise<{
    events: number;
    clubs: number;
    djs: number;
    promoters: number;
  }> {
    try {
      const [events, clubs, djs, promoters] = await Promise.all([
        this.supabaseService.getEvents(),
        this.supabaseService.getClubs(),
        this.supabaseService.getDJs(),
        this.supabaseService.getPromoters()
      ]);
      
      return {
        events: events.length,
        clubs: clubs.length,
        djs: djs.length,
        promoters: promoters.length
      };
    } catch (error) {
      console.error('❌ Error verificando datos en Supabase:', error);
      return { events: 0, clubs: 0, djs: 0, promoters: 0 };
    }
  }
}

// Función helper para usar desde cualquier parte
export const migrateDataToSupabase = async () => {
  const migration = new DataMigration();
  return await migration.migrateAllData();
};

export const checkSupabaseStatus = async () => {
  const migration = new DataMigration();
  return await migration.checkSupabaseData();
}; 