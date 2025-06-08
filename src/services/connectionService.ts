import { supabase } from '../lib/supabase';

export class ConnectionService {
  private static instance: ConnectionService;
  private connectionStatus: 'connected' | 'disconnected' | 'checking' = 'checking';
  private lastCheck: number = 0;
  private checkInterval = 30000; // 30 segundos

  public static getInstance(): ConnectionService {
    if (!ConnectionService.instance) {
      ConnectionService.instance = new ConnectionService();
    }
    return ConnectionService.instance;
  }

  /**
   * Verifica la conexión a Supabase
   */
  async checkConnection(): Promise<boolean> {
    const now = Date.now();
    
    // Evitar checks muy frecuentes
    if (now - this.lastCheck < 5000) {
      return this.connectionStatus === 'connected';
    }

    this.lastCheck = now;
    this.connectionStatus = 'checking';

    try {
      console.log('🔍 Verificando conexión a Supabase...');
      
      // Test simple: intentar hacer una consulta básica
      const { data, error } = await supabase
        .from('events')
        .select('count(*)')
        .limit(1);

      if (error) {
        console.error('❌ Error de conexión:', error.message);
        this.connectionStatus = 'disconnected';
        return false;
      }

      console.log('✅ Conexión a Supabase establecida');
      this.connectionStatus = 'connected';
      return true;

    } catch (error) {
      console.error('❌ Error verificando conexión:', error);
      this.connectionStatus = 'disconnected';
      return false;
    }
  }

  /**
   * Verifica si hay datos en las tablas principales
   */
  async checkDataAvailability(): Promise<{
    hasEvents: boolean;
    hasDJs: boolean;
    hasClubs: boolean;
    hasPromoters: boolean;
    totalRecords: number;
  }> {
    try {
      const [eventsResult, djsResult, clubsResult, promotersResult] = await Promise.allSettled([
        supabase.from('events').select('count(*)', { count: 'exact' }),
        supabase.from('djs').select('count(*)', { count: 'exact' }),
        supabase.from('clubs').select('count(*)', { count: 'exact' }),
        supabase.from('promoters').select('count(*)', { count: 'exact' })
      ]);

      const eventsCount = eventsResult.status === 'fulfilled' ? (eventsResult.value.count || 0) : 0;
      const djsCount = djsResult.status === 'fulfilled' ? (djsResult.value.count || 0) : 0;
      const clubsCount = clubsResult.status === 'fulfilled' ? (clubsResult.value.count || 0) : 0;
      const promotersCount = promotersResult.status === 'fulfilled' ? (promotersResult.value.count || 0) : 0;

      const result = {
        hasEvents: eventsCount > 0,
        hasDJs: djsCount > 0,
        hasClubs: clubsCount > 0,
        hasPromoters: promotersCount > 0,
        totalRecords: eventsCount + djsCount + clubsCount + promotersCount
      };

      console.log('📊 Estado de datos en Supabase:', result);
      return result;

    } catch (error) {
      console.error('❌ Error verificando disponibilidad de datos:', error);
      return {
        hasEvents: false,
        hasDJs: false,
        hasClubs: false,
        hasPromoters: false,
        totalRecords: 0
      };
    }
  }

  /**
   * Inicializa verificaciones periódicas de conexión
   */
  startPeriodicChecks(): void {
    // Check inicial
    this.checkConnection();

    // Checks periódicos
    setInterval(() => {
      this.checkConnection();
    }, this.checkInterval);

    console.log('🔄 Verificaciones periódicas de conexión iniciadas');
  }

  /**
   * Fuerza una reconexión
   */
  async forceReconnect(): Promise<boolean> {
    console.log('🔄 Forzando reconexión...');
    this.lastCheck = 0; // Resetear cache
    return await this.checkConnection();
  }

  /**
   * Obtiene el estado actual de la conexión
   */
  getConnectionStatus(): 'connected' | 'disconnected' | 'checking' {
    return this.connectionStatus;
  }

  /**
   * Verifica la configuración de entorno
   */
  checkEnvironmentConfig(): {
    isValid: boolean;
    missingVars: string[];
    recommendations: string[];
  } {
    const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
    const missingVars: string[] = [];
    const recommendations: string[] = [];

    requiredVars.forEach(varName => {
      if (!import.meta.env[varName]) {
        missingVars.push(varName);
      }
    });

    if (missingVars.length > 0) {
      recommendations.push('Asegúrate de tener un archivo .env con las variables necesarias');
      recommendations.push('Verifica que las variables estén prefijadas con VITE_');
      recommendations.push('Reinicia el servidor de desarrollo después de cambiar variables');
    }

    // Verificaciones adicionales para producción
    if (import.meta.env.PROD) {
      if (!import.meta.env.VITE_SUPABASE_SERVICE_KEY) {
        recommendations.push('Configura VITE_SUPABASE_SERVICE_KEY para operaciones administrativas');
      }
    }

    return {
      isValid: missingVars.length === 0,
      missingVars,
      recommendations
    };
  }

  /**
   * Migra datos de localStorage a Supabase si es necesario
   */
  async migrateLocalDataIfNeeded(): Promise<boolean> {
    try {
      // Verificar si hay datos locales
      const localEvents = localStorage.getItem('cms_events');
      const localDJs = localStorage.getItem('cms_djs');
      const localClubs = localStorage.getItem('cms_clubs');
      const localPromoters = localStorage.getItem('cms_promoters');

      const hasLocalData = !!(localEvents || localDJs || localClubs || localPromoters);
      
      if (!hasLocalData) {
        console.log('ℹ️  No hay datos locales para migrar');
        return true;
      }

      // Verificar si Supabase tiene datos
      const dataStatus = await this.checkDataAvailability();
      
      if (dataStatus.totalRecords > 0) {
        console.log('ℹ️  Supabase ya tiene datos, omitiendo migración');
        return true;
      }

      console.log('🚀 Iniciando migración de datos locales a Supabase...');
      
      // Aquí podrías llamar a un servicio de migración
      // await migrationService.migrateAllData();
      
      return true;

    } catch (error) {
      console.error('❌ Error durante la migración:', error);
      return false;
    }
  }
}

export const connectionService = ConnectionService.getInstance(); 