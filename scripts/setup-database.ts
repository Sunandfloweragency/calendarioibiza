import { supabase, supabaseAdmin } from '../src/lib/supabase';

interface DatabaseStats {
  events: number;
  djs: number;
  clubs: number;
  promoters: number;
  users: number;
}

class DatabaseSetup {
  async checkConnection(): Promise<boolean> {
    try {
      console.log('🔍 Verificando conexión a Supabase...');
      const { data, error } = await supabase.from('events').select('count(*)', { count: 'exact' });
      
      if (error) {
        console.error('❌ Error de conexión:', error.message);
        return false;
      }
      
      console.log('✅ Conexión establecida correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error verificando conexión:', error);
      return false;
    }
  }

  async getStats(): Promise<DatabaseStats> {
    try {
      const [eventsResult, djsResult, clubsResult, promotersResult, usersResult] = await Promise.allSettled([
        supabase.from('events').select('count(*)', { count: 'exact' }),
        supabase.from('djs').select('count(*)', { count: 'exact' }),
        supabase.from('clubs').select('count(*)', { count: 'exact' }),
        supabase.from('promoters').select('count(*)', { count: 'exact' }),
        supabase.from('users').select('count(*)', { count: 'exact' })
      ]);

      return {
        events: eventsResult.status === 'fulfilled' ? (eventsResult.value.count || 0) : 0,
        djs: djsResult.status === 'fulfilled' ? (djsResult.value.count || 0) : 0,
        clubs: clubsResult.status === 'fulfilled' ? (clubsResult.value.count || 0) : 0,
        promoters: promotersResult.status === 'fulfilled' ? (promotersResult.value.count || 0) : 0,
        users: usersResult.status === 'fulfilled' ? (usersResult.value.count || 0) : 0,
      };
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      return { events: 0, djs: 0, clubs: 0, promoters: 0, users: 0 };
    }
  }

  async seedSampleData(): Promise<boolean> {
    try {
      console.log('🌱 Poblando base de datos con datos de ejemplo...');

      // Crear usuario de migración si no existe
      const migrationUserId = '00000000-0000-0000-0000-000000000001';
      
      // Datos de ejemplo para Ibiza
      const sampleClubs = [
        {
          name: 'Pacha Ibiza',
          slug: 'pacha-ibiza',
          description: 'El club más icónico de Ibiza desde 1973',
          location: 'Av. 8 d\'Agost, 07800 Eivissa',
          capacity: 3000,
          image_url: 'https://images.unsplash.com/photo-1571266028243-d220c9c3b2d2?w=800',
          website: 'https://pacha.com',
          social_links: ['https://instagram.com/pacha'],
          status: 'approved',
          submitted_by: migrationUserId
        },
        {
          name: 'Amnesia Ibiza',
          slug: 'amnesia-ibiza',
          description: 'Legendario club con dos salas principales',
          location: 'Ctra. Ibiza a San Antonio, Km 5',
          capacity: 5000,
          image_url: 'https://images.unsplash.com/photo-1571266028243-d220c9c3b2d2?w=800',
          website: 'https://amnesia.es',
          social_links: ['https://instagram.com/amnesia_ibiza'],
          status: 'approved',
          submitted_by: migrationUserId
        }
      ];

      const sampleDJs = [
        {
          name: 'David Guetta',
          slug: 'david-guetta',
          description: 'DJ y productor francés, rey del EDM mundial',
          genre: 'EDM, House',
          image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
          social_links: ['https://instagram.com/davidguetta'],
          website: 'https://davidguetta.com',
          status: 'approved',
          submitted_by: migrationUserId
        },
        {
          name: 'Martin Garrix',
          slug: 'martin-garrix',
          description: 'Joven prodigio holandés del EDM',
          genre: 'Progressive House, EDM',
          image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
          social_links: ['https://instagram.com/martingarrix'],
          website: 'https://martingarrix.com',
          status: 'approved',
          submitted_by: migrationUserId
        }
      ];

      const samplePromoters = [
        {
          name: 'ANTS Metropolis',
          slug: 'ants-metropolis',
          description: 'La colonia de hormigas más famosa de Ibiza',
          contact_email: 'info@ants.com',
          image_url: 'https://images.unsplash.com/photo-1571266028243-d220c9c3b2d2?w=800',
          social_links: ['https://instagram.com/ants'],
          website: 'https://ants.com',
          status: 'approved',
          submitted_by: migrationUserId
        }
      ];

      // Insertar datos usando el cliente admin
      const clubsResult = await supabaseAdmin.from('clubs').insert(sampleClubs).select();
      const djsResult = await supabaseAdmin.from('djs').insert(sampleDJs).select();
      const promotersResult = await supabaseAdmin.from('promoters').insert(samplePromoters).select();

      if (clubsResult.error || djsResult.error || promotersResult.error) {
        console.error('❌ Error insertando datos:', {
          clubs: clubsResult.error,
          djs: djsResult.error,
          promoters: promotersResult.error
        });
        return false;
      }

      // Crear eventos de ejemplo
      const sampleEvents = [
        {
          name: 'David Guetta at Pacha',
          slug: 'david-guetta-pacha-2024',
          description: 'Una noche épica con el rey del EDM',
          date: '2024-07-15',
          time: '23:00',
          price: '€80',
          image_url: 'https://images.unsplash.com/photo-1571266028243-d220c9c3b2d2?w=800',
          event_type: 'party',
          club_id: clubsResult.data?.[0]?.id,
          promoter_id: promotersResult.data?.[0]?.id,
          dj_ids: [djsResult.data?.[0]?.id],
          social_links: ['https://instagram.com/pacha'],
          status: 'approved',
          submitted_by: migrationUserId
        }
      ];

      const eventsResult = await supabaseAdmin.from('events').insert(sampleEvents).select();

      if (eventsResult.error) {
        console.error('❌ Error insertando eventos:', eventsResult.error);
        return false;
      }

      console.log('✅ Datos de ejemplo insertados correctamente');
      return true;

    } catch (error) {
      console.error('❌ Error poblando base de datos:', error);
      return false;
    }
  }

  async run(): Promise<void> {
    console.log('🚀 Iniciando configuración de base de datos...\n');

    // 1. Verificar conexión
    const isConnected = await this.checkConnection();
    if (!isConnected) {
      console.error('❌ No se pudo establecer conexión. Verifica tu configuración.');
      process.exit(1);
    }

    // 2. Obtener estadísticas actuales
    const stats = await this.getStats();
    console.log('📊 Estado actual de la base de datos:');
    console.log(`   • Eventos: ${stats.events}`);
    console.log(`   • DJs: ${stats.djs}`);
    console.log(`   • Clubs: ${stats.clubs}`);
    console.log(`   • Promotores: ${stats.promoters}`);
    console.log(`   • Usuarios: ${stats.users}\n`);

    // 3. Poblar con datos de ejemplo si está vacía
    const totalRecords = stats.events + stats.djs + stats.clubs + stats.promoters;
    
    if (totalRecords === 0) {
      console.log('📝 Base de datos vacía, poblando con datos de ejemplo...');
      const seeded = await this.seedSampleData();
      
      if (seeded) {
        const newStats = await this.getStats();
        console.log('\n✅ Base de datos configurada correctamente:');
        console.log(`   • Eventos: ${newStats.events}`);
        console.log(`   • DJs: ${newStats.djs}`);
        console.log(`   • Clubs: ${newStats.clubs}`);
        console.log(`   • Promotores: ${newStats.promoters}`);
      }
    } else {
      console.log('ℹ️  La base de datos ya contiene datos.');
    }

    console.log('\n🎉 Configuración completada. La aplicación está lista para usar.');
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const setup = new DatabaseSetup();
  setup.run().catch(console.error);
}

export default DatabaseSetup; 