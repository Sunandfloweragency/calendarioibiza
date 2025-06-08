import React, { useState, useEffect } from 'react';
import { supabase, supabaseAdmin } from '../../lib/supabase';
import { useData } from '../../contexts/DataContext';
import { dataInitializer } from '../../services/dataInitializer';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  XCircleIcon,
  ArrowPathIcon,
  WifiIcon,
  ServerIcon,
  CircleStackIcon,
  ClockIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';

interface ConnectionStatus {
  isConnected: boolean;
  lastChecked: Date;
  error?: string;
  latency?: number;
  tables: {
    events: number;
    djs: number;
    clubs: number;
    promoters: number;
    users: number;
  };
}

const DatabaseStatus: React.FC = () => {
  const { events, djs, clubs, promoters, users, loading, error, refreshData } = useData();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: false,
    lastChecked: new Date(),
    tables: { events: 0, djs: 0, clubs: 0, promoters: 0, users: 0 }
  });
  const [isChecking, setIsChecking] = useState(false);
  const [diagnostics, setDiagnostics] = useState<string[]>([]);
  const [isInitializing, setIsInitializing] = useState(false);
  const [initMessages, setInitMessages] = useState<string[]>([]);

  const checkConnection = async () => {
    setIsChecking(true);
    setDiagnostics([]);
    const startTime = Date.now();
    
    try {
      console.log('🔍 Iniciando diagnóstico de conexión...');
      const newDiagnostics: string[] = [];
      
      // 1. Verificar variables de entorno
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      newDiagnostics.push(`✅ URL configurada: ${supabaseUrl ? 'SÍ' : 'NO'}`);
      newDiagnostics.push(`✅ Clave anónima configurada: ${supabaseAnonKey ? 'SÍ' : 'NO'}`);
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Variables de entorno no configuradas');
      }
      
      // 2. Test de conectividad básica
      newDiagnostics.push('🔗 Probando conectividad básica...');
      const { data: healthCheck, error: healthError } = await supabase
        .from('events')
        .select('count', { count: 'exact', head: true });
      
      if (healthError) {
        newDiagnostics.push(`❌ Error de conectividad: ${healthError.message}`);
        throw healthError;
      }
      
      newDiagnostics.push('✅ Conectividad básica OK');
      
      // 3. Verificar cada tabla
      const tableChecks = await Promise.allSettled([
        supabase.from('events').select('count', { count: 'exact', head: true }),
        supabase.from('djs').select('count', { count: 'exact', head: true }),
        supabase.from('clubs').select('count', { count: 'exact', head: true }),
        supabase.from('promoters').select('count', { count: 'exact', head: true }),
        supabase.from('users').select('count', { count: 'exact', head: true })
      ]);
      
      const tableNames = ['events', 'djs', 'clubs', 'promoters', 'users'];
      const tableCounts = { events: 0, djs: 0, clubs: 0, promoters: 0, users: 0 };
      
      tableChecks.forEach((result, index) => {
        const tableName = tableNames[index];
        if (result.status === 'fulfilled' && !result.value.error) {
          const count = result.value.count || 0;
          tableCounts[tableName as keyof typeof tableCounts] = count;
          newDiagnostics.push(`✅ Tabla ${tableName}: ${count} registros`);
        } else {
          newDiagnostics.push(`❌ Error en tabla ${tableName}: ${result.status === 'rejected' ? result.reason : result.value.error?.message}`);
        }
      });
      
      // 4. Test de operaciones CRUD
      newDiagnostics.push('🔧 Probando operaciones CRUD...');
      try {
        // Test de lectura con filtros
        const { data: testRead, error: readError } = await supabase
          .from('events')
          .select('id, name')
          .limit(1);
          
        if (readError) {
          newDiagnostics.push(`❌ Error de lectura: ${readError.message}`);
        } else {
          newDiagnostics.push(`✅ Operación de lectura OK (${testRead?.length || 0} registros)`);
        }
      } catch (err) {
        newDiagnostics.push(`❌ Error en test CRUD: ${err}`);
      }
      
      const latency = Date.now() - startTime;
      newDiagnostics.push(`⚡ Latencia total: ${latency}ms`);
      
      setConnectionStatus({
        isConnected: true,
        lastChecked: new Date(),
        latency,
        tables: tableCounts
      });
      
      newDiagnostics.push('🎉 Diagnóstico completado exitosamente');
      
    } catch (error) {
      console.error('❌ Error en diagnóstico:', error);
      const latency = Date.now() - startTime;
      
      setConnectionStatus({
        isConnected: false,
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'Error desconocido',
        latency,
        tables: { events: 0, djs: 0, clubs: 0, promoters: 0, users: 0 }
      });
      
      setDiagnostics(prev => [...prev, `❌ Diagnóstico falló: ${error instanceof Error ? error.message : 'Error desconocido'}`]);
    } finally {
      setIsChecking(false);
      setDiagnostics(prev => prev);
    }
  };

  const forceRefresh = async () => {
    try {
      console.log('🔄 Forzando recarga de datos...');
      await refreshData();
      await checkConnection();
      console.log('✅ Recarga forzada completada');
    } catch (error) {
      console.error('❌ Error en recarga forzada:', error);
    }
  };

  const resetConnection = async () => {
    try {
      console.log('🔄 Reiniciando conexión...');
      
      // Limpiar cualquier caché local
      localStorage.removeItem('supabase.auth.token');
      
      // Forzar nueva conexión
      await supabase.auth.signOut();
      
      // Recargar datos
      await forceRefresh();
      
      console.log('✅ Conexión reiniciada');
    } catch (error) {
      console.error('❌ Error reiniciando conexión:', error);
    }
  };
  
  // Función para inicializar datos de ejemplo
  const initializeData = async () => {
    setIsInitializing(true);
    setInitMessages(['🚀 Iniciando carga de datos de ejemplo...']);
    
    try {
      // Interceptar logs para mostrarlos en la UI
      const originalConsoleLog = console.log;
      const originalConsoleError = console.error;
      
      console.log = (...args) => {
        originalConsoleLog(...args);
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');
        setInitMessages(prev => [...prev, message]);
      };
      
      console.error = (...args) => {
        originalConsoleError(...args);
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');
        setInitMessages(prev => [...prev, `❌ ${message}`]);
      };
      
      // Inicializar datos
      await dataInitializer.initializeData();
      
      // Restaurar console original
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      
      // Recargar datos en la UI
      await forceRefresh();
      
      setInitMessages(prev => [...prev, '✅ Inicialización completada con éxito']);
    } catch (error) {
      console.error('❌ Error durante la inicialización:', error);
      setInitMessages(prev => [...prev, `❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`]);
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Auto-check cada 30 segundos
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    if (isChecking) {
      return <ArrowPathIcon className="w-5 h-5 text-blue-500 animate-spin" />;
    }
    
    if (connectionStatus.isConnected) {
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    }
    
    return <XCircleIcon className="w-5 h-5 text-red-500" />;
  };

  const getStatusColor = () => {
    if (isChecking) return 'border-blue-500 bg-blue-50';
    if (connectionStatus.isConnected) return 'border-green-500 bg-green-50';
    return 'border-red-500 bg-red-50';
  };

  return (
    <div className={`border-2 rounded-xl p-6 ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <h3 className="text-xl font-bold text-gray-800">
            Estado de la Base de Datos
          </h3>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={initializeData}
            disabled={isInitializing || isChecking}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center space-x-2"
          >
            <PlusCircleIcon className={`w-4 h-4 ${isInitializing ? 'animate-spin' : ''}`} />
            <span>Inicializar Datos</span>
          </button>
          
          <button
            onClick={checkConnection}
            disabled={isChecking}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center space-x-2"
          >
            <ArrowPathIcon className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            <span>Verificar</span>
          </button>
          
          <button
            onClick={forceRefresh}
            disabled={isChecking}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 flex items-center space-x-2"
          >
            <CircleStackIcon className="w-4 h-4" />
            <span>Recargar</span>
          </button>
          
          <button
            onClick={resetConnection}
            disabled={isChecking}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center space-x-2"
          >
            <WifiIcon className="w-4 h-4" />
            <span>Reiniciar</span>
          </button>
        </div>
      </div>
      
      {/* Estado de conexión */}
      {Object.values(connectionStatus.tables).reduce((a, b) => a + b, 0) === 0 && connectionStatus.isConnected && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <PlusCircleIcon className="h-6 w-6 text-yellow-500" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-800">Base de datos vacía</h3>
              <div className="mt-2 text-yellow-700">
                <p>No hay datos en la base de datos. Utiliza el botón "Inicializar Datos" para cargar ejemplos de DJs, Clubs, Promotores y Eventos.</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={initializeData}
                  disabled={isInitializing}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  {isInitializing ? (
                    <>
                      <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                      Inicializando...
                    </>
                  ) : (
                    <>
                      <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                      Inicializar Datos Ahora
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center space-x-2 mb-2">
            <ServerIcon className="w-5 h-5 text-blue-500" />
            <span className="font-semibold">Conexión</span>
          </div>
          <p className={`text-lg font-bold ${connectionStatus.isConnected ? 'text-green-600' : 'text-red-600'}`}>
            {connectionStatus.isConnected ? 'Conectado' : 'Desconectado'}
          </p>
          {connectionStatus.latency && (
            <p className="text-sm text-gray-500">
              Latencia: {connectionStatus.latency}ms
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center space-x-2 mb-2">
            <ClockIcon className="w-5 h-5 text-purple-500" />
            <span className="font-semibold">Última verificación</span>
          </div>
          <p className="text-sm text-gray-600">
            {connectionStatus.lastChecked.toLocaleTimeString()}
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center space-x-2 mb-2">
            <CircleStackIcon className="w-5 h-5 text-green-500" />
            <span className="font-semibold">Total registros</span>
          </div>
          <p className="text-lg font-bold text-green-600">
            {Object.values(connectionStatus.tables).reduce((a, b) => a + b, 0)}
          </p>
        </div>
      </div>

      {/* Inicialización de datos */}
      {initMessages.length > 0 && (
        <div className="bg-green-50 rounded-lg p-4 border border-green-200 mb-6">
          <h4 className="font-semibold mb-3 flex items-center">
            <PlusCircleIcon className={`w-5 h-5 mr-2 ${isInitializing ? 'animate-spin text-green-600' : 'text-green-500'}`} />
            Inicialización de datos de ejemplo:
          </h4>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {initMessages.map((message, index) => (
              <p key={index} className="text-sm font-mono text-gray-700">
                {message}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Estadísticas de tablas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {Object.entries(connectionStatus.tables).map(([table, count]) => (
          <div key={table} className="bg-white rounded-lg p-3 border text-center">
            <p className="text-sm font-medium text-gray-600 capitalize">{table}</p>
            <p className="text-xl font-bold text-blue-600">{count}</p>
          </div>
        ))}
      </div>

      {/* Diagnósticos */}
      {diagnostics.length > 0 && (
        <div className="bg-white rounded-lg p-4 border">
          <h4 className="font-semibold mb-3">Diagnóstico detallado:</h4>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {diagnostics.map((diagnostic, index) => (
              <p key={index} className="text-sm font-mono text-gray-700">
                {diagnostic}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Error actual */}
      {(error || connectionStatus.error) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
          <h4 className="font-semibold text-red-800 mb-2">Error detectado:</h4>
          <p className="text-red-700 text-sm">
            {error || connectionStatus.error}
          </p>
        </div>
      )}

      {/* Estado de carga */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <p className="text-blue-700 text-sm flex items-center space-x-2">
            <ArrowPathIcon className="w-4 h-4 animate-spin" />
            <span>Cargando datos...</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default DatabaseStatus; 