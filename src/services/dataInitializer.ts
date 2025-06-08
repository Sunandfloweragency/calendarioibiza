import { supabaseService } from './supabaseService';
import { supabase } from '../lib/supabase';
import { DJ, Club, Promoter, Event } from '../types/supabase';

/**
 * Clase para inicializar datos en la aplicación y asegurar que hay contenido disponible
 */
export class DataInitializerService {
  /**
   * Verifica si ya existen datos en la base de datos
   */
  private async hasExistingData(): Promise<{
    hasEvents: boolean;
    hasDJs: boolean;
    hasClubs: boolean;
    hasPromoters: boolean;
  }> {
    try {
      const [
        { count: eventsCount, error: eventsError },
        { count: djsCount, error: djsError },
        { count: clubsCount, error: clubsError },
        { count: promotersCount, error: promotersError }
      ] = await Promise.all([
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('djs').select('*', { count: 'exact', head: true }),
        supabase.from('clubs').select('*', { count: 'exact', head: true }),
        supabase.from('promoters').select('*', { count: 'exact', head: true })
      ]);

      if (eventsError) console.error('Error verificando eventos:', eventsError);
      if (djsError) console.error('Error verificando DJs:', djsError);
      if (clubsError) console.error('Error verificando clubs:', clubsError);
      if (promotersError) console.error('Error verificando promotores:', promotersError);

      return {
        hasEvents: (eventsCount || 0) > 0,
        hasDJs: (djsCount || 0) > 0,
        hasClubs: (clubsCount || 0) > 0,
        hasPromoters: (promotersCount || 0) > 0
      };
    } catch (error) {
      console.error('Error al verificar datos existentes:', error);
      return {
        hasEvents: false,
        hasDJs: false,
        hasClubs: false,
        hasPromoters: false
      };
    }
  }

  /**
   * Inicializa datos de ejemplo en la base de datos si no existen
   */
  async initializeData(): Promise<void> {
    try {
      console.log('🚀 Iniciando verificación de datos iniciales...');
      
      const dataStatus = await this.hasExistingData();
      console.log('📊 Estado actual de datos:', dataStatus);
      
      // Solo inicializar datos que no existan
      if (!dataStatus.hasDJs) await this.initializeDJs();
      if (!dataStatus.hasClubs) await this.initializeClubs();
      if (!dataStatus.hasPromoters) await this.initializePromoters();
      if (!dataStatus.hasEvents) await this.initializeEvents();
      
      console.log('✅ Inicialización de datos completada con éxito');
    } catch (error) {
      console.error('❌ Error durante la inicialización de datos:', error);
    }
  }

  /**
   * Inicializa DJs de ejemplo
   */
  private async initializeDJs(): Promise<DJ[]> {
    console.log('👤 Inicializando DJs...');
    
    const djsData = [
      {
        name: 'Carl Cox',
        description: 'Carl Cox es un icónico DJ y productor británico, conocido por su virtuosismo en el techno y el house.',
        imageUrl: 'https://www.absolutibiza.com/wp-content/uploads/Carl-Cox-1.jpg',
        genre: 'Techno, House',
        socialLinks: [
          { platform: 'instagram', url: 'https://www.instagram.com/carlcoxofficial/' },
          { platform: 'facebook', url: 'https://www.facebook.com/carlcox247/' }
        ]
      },
      {
        name: 'Amelie Lens',
        description: 'Amelie Lens es una DJ y productora belga, conocida por su estilo de techno enérgico y potente.',
        imageUrl: 'https://cdn.atwillmedia.com/wp-content/uploads/2022/07/22124750/amelie-lens.jpg',
        genre: 'Techno',
        socialLinks: [
          { platform: 'instagram', url: 'https://www.instagram.com/amelie_lens/' }
        ]
      },
      {
        name: 'Solomun',
        description: 'Solomun es un DJ y productor bosnio-alemán, conocido por sus sets épicos y su sello Diynamic.',
        imageUrl: 'https://ibizadiscoticket.com/wp-content/uploads/2023/06/solomun-pacha-ibiza-2023-tickets-party.jpg',
        genre: 'Deep House, Melodic Techno',
        socialLinks: [
          { platform: 'instagram', url: 'https://www.instagram.com/solomun/' }
        ]
      },
      {
        name: 'Charlotte de Witte',
        description: 'Charlotte de Witte es una DJ y productora belga, líder en la escena techno contemporánea.',
        imageUrl: 'https://www.awakenings.com/wp-content/uploads/2022/10/charlotte-de-witte-awakenings-festival.jpg',
        genre: 'Techno',
        socialLinks: [
          { platform: 'instagram', url: 'https://www.instagram.com/charlottedewittemusic/' }
        ]
      }
    ];
    
    const createdDJs: DJ[] = [];
    
    for (const dj of djsData) {
      try {
        const newDJ = await supabaseService.addDJ(dj as any, true);
        console.log(`✅ DJ creado: ${newDJ.name}`);
        createdDJs.push(newDJ);
      } catch (error) {
        console.error(`❌ Error creando DJ ${dj.name}:`, error);
      }
    }
    
    return createdDJs;
  }

  /**
   * Inicializa Clubs de ejemplo
   */
  private async initializeClubs(): Promise<Club[]> {
    console.log('🏢 Inicializando Clubs...');
    
    const clubsData = [
      {
        name: 'Pacha Ibiza',
        description: 'Pacha es uno de los clubes más emblemáticos de Ibiza, conocido por sus fiestas legendarias y su icónico logo de cerezas.',
        location: 'Av. 8 d\'Agost, 07800 Ibiza',
        imageUrl: 'https://www.ibiza-spotlight.es/night/clubs/pacha/thumb/pacha-2024-ibiza.jpg',
        capacity: 3000,
        socialLinks: [
          { platform: 'instagram', url: 'https://www.instagram.com/pachaibiza/' },
          { platform: 'website', url: 'https://www.pacha.com/' }
        ]
      },
      {
        name: 'Amnesia Ibiza',
        description: 'Amnesia es un club de renombre mundial, famoso por su sistema de sonido y sus icónicas fiestas como Cocoon y Pyramid.',
        location: 'Carretera Ibiza a San Antonio, Km 5, 07816 Ibiza',
        imageUrl: 'https://www.ibiza-spotlight.es/night/clubs/amnesia/thumb/amnesia-ibiza-new-terrace-2022.jpg',
        capacity: 5000,
        socialLinks: [
          { platform: 'instagram', url: 'https://www.instagram.com/amnesiaibiza/' },
          { platform: 'website', url: 'https://www.amnesia.es/' }
        ]
      },
      {
        name: 'Hï Ibiza',
        description: 'Hï Ibiza es uno de los clubes más modernos de la isla, construido donde antes se ubicaba Space. Cuenta con tecnología de última generación.',
        location: 'Platja d\'en Bossa, 07817 Ibiza',
        imageUrl: 'https://www.ibiza-spotlight.es/night/clubs/hi-ibiza/thumb/hi-ibiza-club-main-room-2022.jpg',
        capacity: 5000,
        socialLinks: [
          { platform: 'instagram', url: 'https://www.instagram.com/hiibizaofficial/' },
          { platform: 'website', url: 'https://www.hiibiza.com/' }
        ]
      },
      {
        name: 'Ushuaïa Ibiza',
        description: 'Ushuaïa es un club al aire libre y hotel, famoso por sus espectaculares fiestas diurnas y producción visual.',
        location: 'Platja d\'en Bossa, 10, 07817 Ibiza',
        imageUrl: 'https://clubbingibiza.nl/wp-content/uploads/2023/06/Ushuaia-Ibiza-Poolparty-Stage-2023.jpg',
        capacity: 4000,
        socialLinks: [
          { platform: 'instagram', url: 'https://www.instagram.com/ushuaiaibiza/' },
          { platform: 'website', url: 'https://www.theushuaiaexperience.com/' }
        ]
      }
    ];
    
    const createdClubs: Club[] = [];
    
    for (const club of clubsData) {
      try {
        const newClub = await supabaseService.addClub(club as any, true);
        console.log(`✅ Club creado: ${newClub.name}`);
        createdClubs.push(newClub);
      } catch (error) {
        console.error(`❌ Error creando Club ${club.name}:`, error);
      }
    }
    
    return createdClubs;
  }

  /**
   * Inicializa Promotores de ejemplo
   */
  private async initializePromoters(): Promise<Promoter[]> {
    console.log('🎭 Inicializando Promotores...');
    
    const promotersData = [
      {
        name: 'Elrow',
        description: 'Elrow es una de las fiestas más coloridas y temáticas del mundo, conocida por su decoración extravagante y atmósfera carnavalesca.',
        imageUrl: 'https://elrow.com/wp-content/uploads/2022/04/elrow-logo-coloured.png',
        socialLinks: [
          { platform: 'instagram', url: 'https://www.instagram.com/elrowofficial/' },
          { platform: 'website', url: 'https://elrow.com/' }
        ]
      },
      {
        name: 'Circoloco',
        description: 'Circoloco es una de las fiestas más influyentes de la música electrónica, con sede en DC-10, Ibiza.',
        imageUrl: 'https://edmidentity.com/wp-content/uploads/2018/10/Circoloco-Logo.jpg',
        socialLinks: [
          { platform: 'instagram', url: 'https://www.instagram.com/circolocoibiza/' },
          { platform: 'website', url: 'https://www.circolocoibiza.com/' }
        ]
      },
      {
        name: 'Paradise',
        description: 'Paradise es la fiesta insignia de Jamie Jones, centrada en el house y el tech-house de calidad.',
        imageUrl: 'https://www.ibiza-spotlight.es/night/promoters/paradise/thumb/paradise-ibiza-2019.jpg',
        socialLinks: [
          { platform: 'instagram', url: 'https://www.instagram.com/paradiseibiza/' }
        ]
      },
      {
        name: 'ANTS',
        description: 'ANTS es una exitosa fiesta de Ushuaïa Ibiza, conocida por su estética de hormigas y su música house y techno.',
        imageUrl: 'https://www.ibiza-spotlight.es/night/promoters/ants/thumb/ants-ushuaia-ibiza-2022.jpg',
        socialLinks: [
          { platform: 'instagram', url: 'https://www.instagram.com/antsofficial/' }
        ]
      }
    ];
    
    const createdPromoters: Promoter[] = [];
    
    for (const promoter of promotersData) {
      try {
        const newPromoter = await supabaseService.addPromoter(promoter as any, true);
        console.log(`✅ Promotor creado: ${newPromoter.name}`);
        createdPromoters.push(newPromoter);
      } catch (error) {
        console.error(`❌ Error creando Promotor ${promoter.name}:`, error);
      }
    }
    
    return createdPromoters;
  }

  /**
   * Inicializa Eventos de ejemplo
   */
  private async initializeEvents(): Promise<Event[]> {
    console.log('🎉 Inicializando Eventos...');
    
    // Primero obtener los IDs de DJs, Clubs y Promotores existentes
    const [djs, clubs, promoters] = await Promise.all([
      supabaseService.getDJs(),
      supabaseService.getClubs(),
      supabaseService.getPromoters()
    ]);
    
    // Verificar que existan entidades para referenciar
    if (!djs.length || !clubs.length || !promoters.length) {
      console.error('❌ No hay suficientes entidades para crear eventos. Asegúrate de inicializar DJs, Clubs y Promotores primero.');
      return [];
    }
    
    // Fechas para eventos (durante la temporada de verano de Ibiza)
    const generateFutureDate = (daysAhead: number) => {
      const date = new Date();
      date.setDate(date.getDate() + daysAhead);
      return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    };
    
    const eventsData = [
      {
        name: 'Elrow at Amnesia',
        description: 'La fiesta más colorida de Ibiza regresa a Amnesia con su ambiente carnavalesco y los mejores DJs.',
        date: generateFutureDate(7),
        time: '23:00',
        price: '40€ - 60€',
        imageUrl: 'https://www.ibiza-spotlight.es/night/promoters/elrow/thumb/elrow-amnesia-ibiza-2022.jpg',
        eventType: 'party',
        clubId: clubs.find(c => c.name.includes('Amnesia'))?.id,
        promoterId: promoters.find(p => p.name.includes('Elrow'))?.id,
        djIds: [
          djs.find(d => d.name.includes('Amelie'))?.id,
          djs.find(d => d.name.includes('Solomun'))?.id
        ].filter(Boolean) as string[],
        socialLinks: [
          { platform: 'instagram', url: 'https://www.instagram.com/elrowofficial/' },
          { platform: 'facebook', url: 'https://www.facebook.com/elrowofficial/' }
        ]
      },
      {
        name: 'Paradise at Hi Ibiza',
        description: 'Jamie Jones presenta Paradise, una noche de house y tech-house de la más alta calidad.',
        date: generateFutureDate(14),
        time: '23:59',
        price: '50€ - 70€',
        imageUrl: 'https://www.theushuaiaexperience.com/uploads/Paradise_Club_Room.jpg',
        eventType: 'party',
        clubId: clubs.find(c => c.name.includes('Hï'))?.id,
        promoterId: promoters.find(p => p.name.includes('Paradise'))?.id,
        djIds: [
          djs.find(d => d.name.includes('Solomun'))?.id
        ].filter(Boolean) as string[],
        socialLinks: [
          { platform: 'instagram', url: 'https://www.instagram.com/paradiseibiza/' }
        ]
      },
      {
        name: 'Music On at Pacha',
        description: 'La legendaria fiesta de Marco Carola llega a Pacha Ibiza para una noche de techno imparable.',
        date: generateFutureDate(21),
        time: '23:59',
        price: '60€ - 80€',
        imageUrl: 'https://www.ibizadiscoticket.com/wp-content/uploads/2018/02/music-on-amnesia-ibiza-2018-tickets.jpg',
        eventType: 'party',
        clubId: clubs.find(c => c.name.includes('Pacha'))?.id,
        djIds: [
          djs.find(d => d.name.includes('Carl'))?.id,
          djs.find(d => d.name.includes('Charlotte'))?.id
        ].filter(Boolean) as string[],
        socialLinks: [
          { platform: 'instagram', url: 'https://www.instagram.com/musiconibiza/' }
        ]
      },
      {
        name: 'ANTS at Ushuaïa',
        description: 'La colonia de ANTS toma el control de Ushuaïa para una tarde de house y techno bajo el sol ibicenco.',
        date: generateFutureDate(28),
        time: '16:00',
        price: '55€ - 75€',
        imageUrl: 'https://www.ibiza-spotlight.es/night/promoters/ants/thumb/ants-ushuaia-ibiza-2023.jpg',
        eventType: 'daytime',
        clubId: clubs.find(c => c.name.includes('Ushuaïa'))?.id,
        promoterId: promoters.find(p => p.name.includes('ANTS'))?.id,
        djIds: [
          djs.find(d => d.name.includes('Amelie'))?.id,
          djs.find(d => d.name.includes('Charlotte'))?.id
        ].filter(Boolean) as string[],
        socialLinks: [
          { platform: 'instagram', url: 'https://www.instagram.com/antsofficial/' }
        ]
      }
    ];
    
    const createdEvents: Event[] = [];
    
    for (const event of eventsData) {
      try {
        const newEvent = await supabaseService.addEvent(event as any, true);
        console.log(`✅ Evento creado: ${newEvent.name} (${newEvent.date})`);
        createdEvents.push(newEvent);
      } catch (error) {
        console.error(`❌ Error creando Evento ${event.name}:`, error);
      }
    }
    
    return createdEvents;
  }
}

export const dataInitializer = new DataInitializerService(); 