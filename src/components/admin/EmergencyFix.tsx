import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { supabase, supabaseAdmin } from '../../lib/supabase';
import { 
  ExclamationTriangleIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const EmergencyFix: React.FC = () => {
  const { events, djs, clubs, promoters, users, loading, error, refreshData } = useData();
  const [isFixing, setIsFixing] = useState(false);
  const [fixResults, setFixResults] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  const runEmergencyDiagnostic = async () => {
    setIsFixing(true);
    setFixResults([]);
    
    const results: string[] = [];
    
    try {
      results.push('🚨 INICIANDO DIAGNÓSTICO DE EMERGENCIA...');
      
      // 1. Verificar variables de entorno
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;
      
      results.push(`📍 URL: ${supabaseUrl || 'NO CONFIGURADA'}`);
      results.push(`🔑 Anon Key: ${supabaseAnonKey ? 'CONFIGURADA' : 'NO CONFIGURADA'}`);
      results.push(`🔐 Service Key: ${supabaseServiceKey ? 'CONFIGURADA' : 'NO CONFIGURADA'}`);
      
      if (!supabaseUrl || !supabaseAnonKey) {
        results.push('❌ PROBLEMA CRÍTICO: Variables de entorno no configuradas');
        results.push('💡 SOLUCIÓN: Verificar archivo .env');
        setFixResults([...results]);
        return;
      }
      
      // 2. Test de conectividad
      results.push('🔗 Probando conectividad...');
      try {
        const { data, error: connError } = await supabase
          .from('events')
          .select('count', { count: 'exact', head: true });
          
        if (connError) {
          results.push(`❌ Error de conectividad: ${connError.message}`);
          results.push('💡 SOLUCIÓN: Verificar credenciales de Supabase');
        } else {
          results.push('✅ Conectividad OK');
        }
      } catch (err) {
        results.push(`❌ Error de red: ${err}`);
        results.push('💡 SOLUCIÓN: Verificar conexión a internet');
      }
      
      // 3. Verificar estructura de tablas
      results.push('🗄️ Verificando estructura de tablas...');
      const tables = ['events', 'djs', 'clubs', 'promoters', 'users'];
      
      for (const table of tables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('*')
            .limit(1);
            
          if (error) {
            results.push(`❌ Tabla ${table}: ${error.message}`);
            if (error.message.includes('does not exist')) {
              results.push(`💡 SOLUCIÓN: Crear tabla ${table} en Supabase`);
            }
          } else {
            results.push(`✅ Tabla ${table}: OK`);
          }
        } catch (err) {
          results.push(`❌ Error verificando tabla ${table}: ${err}`);
        }
      }
      
      // 4. Verificar datos del contexto
      results.push('📊 Verificando datos del contexto...');
      results.push(`📅 Eventos cargados: ${events.length}`);
      results.push(`🎧 DJs cargados: ${djs.length}`);
      results.push(`🏢 Clubs cargados: ${clubs.length}`);
      results.push(`👥 Promotores cargados: ${promoters.length}`);
      results.push(`👤 Usuarios cargados: ${users.length}`);
      
      if (events.length === 0 && djs.length === 0 && clubs.length === 0) {
        results.push('⚠️ ADVERTENCIA: No hay datos cargados');
        results.push('💡 SOLUCIÓN: Ejecutar migración de datos o crear contenido de prueba');
      }
      
      // 5. Verificar errores del contexto
      if (error) {
        results.push(`❌ Error del contexto: ${error}`);
        results.push('💡 SOLUCIÓN: Revisar DataContext y conexión a Supabase');
      }
      
      if (loading) {
        results.push('⏳ Estado: Cargando datos...');
      }
      
      // 6. Test de operaciones CRUD
      results.push('🔧 Probando operaciones CRUD...');
      try {
        // Test de lectura
        const { data: readTest, error: readError } = await supabase
          .from('events')
          .select('id, name, status')
          .limit(5);
          
        if (readError) {
          results.push(`❌ Error de lectura: ${readError.message}`);
        } else {
          results.push(`✅ Lectura OK (${readTest?.length || 0} registros)`);
        }
        
        // Test de filtros
        const { data: filterTest, error: filterError } = await supabase
          .from('events')
          .select('id')
          .eq('status', 'approved')
          .limit(1);
          
        if (filterError) {
          results.push(`❌ Error de filtros: ${filterError.message}`);
        } else {
          results.push('✅ Filtros OK');
        }
        
      } catch (err) {
        results.push(`❌ Error en operaciones CRUD: ${err}`);
      }
      
      // 7. Verificar autenticación
      results.push('🔐 Verificando autenticación...');
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          results.push(`❌ Error de autenticación: ${authError.message}`);
        } else if (user) {
          results.push(`✅ Usuario autenticado: ${user.email}`);
        } else {
          results.push('⚠️ No hay usuario autenticado');
          results.push('💡 SOLUCIÓN: Iniciar sesión para acceder al dashboard');
        }
      } catch (err) {
        results.push(`❌ Error verificando autenticación: ${err}`);
      }
      
      results.push('🎉 DIAGNÓSTICO COMPLETADO');
      
    } catch (error) {
      results.push(`❌ ERROR CRÍTICO EN DIAGNÓSTICO: ${error}`);
    } finally {
      setFixResults(results);
      setIsFixing(false);
    }
  };

  const runQuickFix = async () => {
    setIsFixing(true);
    const results: string[] = [];
    
    try {
      results.push('🔧 INICIANDO REPARACIÓN RÁPIDA...');
      
      // 1. Limpiar caché local
      results.push('🧹 Limpiando caché local...');
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('sb-lgtsfnhzscekojngdcii-auth-token');
      results.push('✅ Caché limpiado');
      
      // 2. Forzar recarga de datos
      results.push('🔄 Forzando recarga de datos...');
      await refreshData();
      results.push('✅ Datos recargados');
      
      // 3. Verificar conexión
      results.push('🔗 Verificando conexión...');
      const { data, error } = await supabase
        .from('events')
        .select('count', { count: 'exact', head: true });
        
      if (error) {
        results.push(`❌ Error de conexión: ${error.message}`);
      } else {
        results.push('✅ Conexión restaurada');
      }
      
      results.push('🎉 REPARACIÓN COMPLETADA');
      
    } catch (error) {
      results.push(`❌ ERROR EN REPARACIÓN: ${error}`);
    } finally {
      setFixResults(prev => [...prev, ...results]);
      setIsFixing(false);
    }
  };

  const createTestData = async () => {
    setIsFixing(true);
    const results: string[] = [];
    
    try {
      results.push('🧪 CREANDO DATOS DE PRUEBA...');
      
      // Crear evento de prueba
      const testEvent = {
        name: 'Evento de Prueba - Sun & Flower',
        description: 'Evento creado para verificar el funcionamiento del sistema',
        date: new Date().toISOString().split('T')[0],
        time: '22:00',
        price: '25€',
        event_type: 'club',
        status: 'approved'
      };
      
      const { data: eventData, error: eventError } = await supabaseAdmin
        .from('events')
        .insert(testEvent)
        .select()
        .single();
        
      if (eventError) {
        results.push(`❌ Error creando evento: ${eventError.message}`);
      } else {
        results.push('✅ Evento de prueba creado');
      }
      
      // Crear DJ de prueba
      const testDJ = {
        name: 'DJ Test',
        description: 'DJ de prueba para verificar el sistema',
        genre: 'Electronic',
        status: 'approved'
      };
      
      const { data: djData, error: djError } = await supabaseAdmin
        .from('djs')
        .insert(testDJ)
        .select()
        .single();
        
      if (djError) {
        results.push(`❌ Error creando DJ: ${djError.message}`);
      } else {
        results.push('✅ DJ de prueba creado');
      }
      
      // Recargar datos
      await refreshData();
      results.push('🔄 Datos recargados');
      
      results.push('🎉 DATOS DE PRUEBA CREADOS');
      
    } catch (error) {
      results.push(`❌ ERROR CREANDO DATOS: ${error}`);
    } finally {
      setFixResults(prev => [...prev, ...results]);
      setIsFixing(false);
    }
  };

  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
        <div>
          <h3 className="text-xl font-bold text-red-800">
            🚨 Kit de Emergencia - Dashboard
          </h3>
          <p className="text-red-600">
            Herramientas para diagnosticar y solucionar problemas críticos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={runEmergencyDiagnostic}
          disabled={isFixing}
          className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-lg flex items-center space-x-2 disabled:opacity-50"
        >
          <WrenchScrewdriverIcon className="w-5 h-5" />
          <span>Diagnóstico Completo</span>
        </button>

        <button
          onClick={runQuickFix}
          disabled={isFixing}
          className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg flex items-center space-x-2 disabled:opacity-50"
        >
          <ArrowPathIcon className={`w-5 h-5 ${isFixing ? 'animate-spin' : ''}`} />
          <span>Reparación Rápida</span>
        </button>

        <button
          onClick={createTestData}
          disabled={isFixing}
          className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg flex items-center space-x-2 disabled:opacity-50"
        >
          <CheckCircleIcon className="w-5 h-5" />
          <span>Crear Datos Prueba</span>
        </button>
      </div>

      {/* Estado actual */}
      <div className="bg-white rounded-lg p-4 mb-4">
        <h4 className="font-semibold mb-2">Estado Actual del Sistema:</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
          <div className={`p-2 rounded ${events.length > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            Eventos: {events.length}
          </div>
          <div className={`p-2 rounded ${djs.length > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            DJs: {djs.length}
          </div>
          <div className={`p-2 rounded ${clubs.length > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            Clubs: {clubs.length}
          </div>
          <div className={`p-2 rounded ${promoters.length > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            Promotores: {promoters.length}
          </div>
          <div className={`p-2 rounded ${loading ? 'bg-yellow-100 text-yellow-800' : error ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            Estado: {loading ? 'Cargando' : error ? 'Error' : 'OK'}
          </div>
        </div>
      </div>

      {/* Resultados */}
      {fixResults.length > 0 && (
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Resultados del Diagnóstico:</h4>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              {showDetails ? 'Ocultar' : 'Mostrar'} Detalles
            </button>
          </div>
          
          <div className={`space-y-1 ${showDetails ? 'max-h-96' : 'max-h-32'} overflow-y-auto`}>
            {fixResults.map((result, index) => (
              <p key={index} className="text-sm font-mono text-gray-700">
                {result}
              </p>
            ))}
          </div>
        </div>
      )}

      {isFixing && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
          <p className="text-yellow-700 text-sm flex items-center space-x-2">
            <ArrowPathIcon className="w-4 h-4 animate-spin" />
            <span>Ejecutando diagnóstico...</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default EmergencyFix; 