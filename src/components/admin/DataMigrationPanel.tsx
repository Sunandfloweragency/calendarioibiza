import React, { useState, useEffect } from 'react';
import { migrateDataToSupabase, checkSupabaseStatus } from '../../utils/migrateDataToSupabase';
import { useData } from '../../contexts/DataContext';
import { CloudArrowUpIcon, ServerIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface MigrationResults {
  success: boolean;
  results: {
    clubs: { success: number; failed: number; errors: string[] };
    djs: { success: number; failed: number; errors: string[] };
    promoters: { success: number; failed: number; errors: string[] };
    events: { success: number; failed: number; errors: string[] };
  };
  totalMigrated: number;
}

interface SupabaseStatus {
  events: number;
  clubs: number;
  djs: number;
  promoters: number;
}

const DataMigrationPanel: React.FC = () => {
  const { switchToSupabaseMode } = useData();
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResults, setMigrationResults] = useState<MigrationResults | null>(null);
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatus | null>(null);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  // Verificar estado de Supabase al cargar
  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const status = await checkSupabaseStatus();
      setSupabaseStatus(status);
      setLastCheck(new Date());
    } catch (error) {
      console.error('Error verificando estado de Supabase:', error);
    }
  };

  const handleMigration = async () => {
    if (isMigrating) return;
    
    const confirm = window.confirm(
      '⚠️ MIGRACIÓN MASIVA DE DATOS\n\n' +
      'Esta acción subirá TODOS los datos de localStorage a Supabase:\n' +
      '• Clubs\n' +
      '• DJs\n' +
      '• Promoters\n' +
      '• Events\n\n' +
      '¿Estás seguro de que quieres continuar?'
    );
    
    if (!confirm) return;

    setIsMigrating(true);
    setMigrationResults(null);

    try {
      console.log('🚀 Iniciando migración desde interfaz...');
      const results = await migrateDataToSupabase();
      setMigrationResults(results);
      
      // Verificar estado actualizado
      await checkStatus();
      
      // Si la migración fue exitosa, cambiar la app a modo Supabase
      if (results.success && results.totalMigrated > 0) {
        console.log('✅ Migración exitosa - Cambiando a modo Supabase...');
        await switchToSupabaseMode();
        
        // Mostrar mensaje de éxito
        alert(
          '🎉 ¡MIGRACIÓN EXITOSA!\n\n' +
          `Se migraron ${results.totalMigrated} elementos a Supabase.\n\n` +
          'La aplicación ahora está conectada a la base de datos real.\n' +
          'Los datos se cargarán desde Supabase en lugar de localStorage.'
        );
      }
      
    } catch (error) {
      console.error('❌ Error en migración:', error);
      alert('Error durante la migración: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsMigrating(false);
    }
  };

  const getTotalLocalStorageData = () => {
    try {
      const events = localStorage.getItem('s&f_events');
      const clubs = localStorage.getItem('s&f_clubs');
      const djs = localStorage.getItem('s&f_djs');
      const promoters = localStorage.getItem('s&f_promoters');
      
      return {
        events: events ? JSON.parse(events).length : 0,
        clubs: clubs ? JSON.parse(clubs).length : 0,
        djs: djs ? JSON.parse(djs).length : 0,
        promoters: promoters ? JSON.parse(promoters).length : 0
      };
    } catch (error) {
      return { events: 0, clubs: 0, djs: 0, promoters: 0 };
    }
  };

  const localData = getTotalLocalStorageData();
  const totalLocalData = localData.events + localData.clubs + localData.djs + localData.promoters;
  const totalSupabaseData = supabaseStatus ? 
    supabaseStatus.events + supabaseStatus.clubs + supabaseStatus.djs + supabaseStatus.promoters : 0;

  return (
    <div className="bg-brand-black/90 backdrop-blur-md rounded-xl border border-brand-orange/20 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-brand-white mb-2">
          <CloudArrowUpIcon className="w-8 h-8 inline-block mr-2 text-brand-orange" />
          Migración de Datos a Supabase
        </h2>
        <p className="text-brand-gray">
          Transfiere todos los datos de localStorage a la base de datos real de Supabase
        </p>
      </div>

      {/* Estado actual de los datos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* localStorage */}
        <div className="bg-brand-black/50 rounded-lg p-4 border border-brand-purple/20">
          <h3 className="font-bold text-brand-white mb-3 flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            localStorage (Local)
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-brand-gray">📅 Eventos:</span>
              <span className="text-brand-white font-mono">{localData.events}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-gray">🏪 Clubs:</span>
              <span className="text-brand-white font-mono">{localData.clubs}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-gray">🎧 DJs:</span>
              <span className="text-brand-white font-mono">{localData.djs}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-gray">🏢 Promoters:</span>
              <span className="text-brand-white font-mono">{localData.promoters}</span>
            </div>
            <div className="border-t border-brand-purple/20 pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span className="text-brand-white">Total:</span>
                <span className="text-brand-orange">{totalLocalData}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Supabase */}
        <div className="bg-brand-black/50 rounded-lg p-4 border border-brand-green/20">
          <h3 className="font-bold text-brand-white mb-3 flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            Supabase (Base de Datos)
          </h3>
          {supabaseStatus ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-brand-gray">📅 Eventos:</span>
                <span className="text-brand-white font-mono">{supabaseStatus.events}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-gray">🏪 Clubs:</span>
                <span className="text-brand-white font-mono">{supabaseStatus.clubs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-gray">🎧 DJs:</span>
                <span className="text-brand-white font-mono">{supabaseStatus.djs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-gray">🏢 Promoters:</span>
                <span className="text-brand-white font-mono">{supabaseStatus.promoters}</span>
              </div>
              <div className="border-t border-brand-green/20 pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span className="text-brand-white">Total:</span>
                  <span className="text-brand-green">{totalSupabaseData}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-brand-gray text-sm">Verificando...</div>
          )}
          
          {lastCheck && (
            <div className="text-xs text-brand-gray mt-2">
              Última verificación: {lastCheck.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleMigration}
          disabled={isMigrating || totalLocalData === 0}
          className={`flex-1 px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 ${
            isMigrating || totalLocalData === 0
              ? 'bg-brand-gray/20 text-brand-gray cursor-not-allowed'
              : 'bg-gradient-to-r from-brand-orange to-brand-purple text-brand-white hover:shadow-lg hover:shadow-brand-orange/25 hover:scale-105'
          }`}
        >
          {isMigrating ? (
            <>
              <div className="w-5 h-5 border-2 border-brand-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
              Migrando Datos...
            </>
          ) : (
            <>
              <CloudArrowUpIcon className="w-5 h-5 inline-block mr-2" />
              Migrar a Supabase ({totalLocalData} elementos)
            </>
          )}
        </button>

        <button
          onClick={checkStatus}
          disabled={isMigrating}
          className="px-4 py-3 rounded-lg font-bold text-brand-white bg-brand-black/50 border border-brand-gray/30 hover:border-brand-orange/50 transition-all duration-300"
        >
          <ServerIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Resultados de migración */}
      {migrationResults && (
        <div className={`rounded-lg p-4 border ${
          migrationResults.success 
            ? 'bg-green-500/10 border-green-500/30' 
            : 'bg-red-500/10 border-red-500/30'
        }`}>
          <h3 className="font-bold text-lg mb-3 flex items-center">
            {migrationResults.success ? (
              <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
            ) : (
              <ExclamationTriangleIcon className="w-6 h-6 text-red-500 mr-2" />
            )}
            Resultado de la Migración
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-brand-white font-bold text-lg">
                {migrationResults.results.clubs.success}
              </div>
              <div className="text-brand-gray text-sm">Clubs migrados</div>
              {migrationResults.results.clubs.failed > 0 && (
                <div className="text-red-400 text-xs">
                  {migrationResults.results.clubs.failed} fallos
                </div>
              )}
            </div>

            <div className="text-center">
              <div className="text-brand-white font-bold text-lg">
                {migrationResults.results.djs.success}
              </div>
              <div className="text-brand-gray text-sm">DJs migrados</div>
              {migrationResults.results.djs.failed > 0 && (
                <div className="text-red-400 text-xs">
                  {migrationResults.results.djs.failed} fallos
                </div>
              )}
            </div>

            <div className="text-center">
              <div className="text-brand-white font-bold text-lg">
                {migrationResults.results.promoters.success}
              </div>
              <div className="text-brand-gray text-sm">Promoters migrados</div>
              {migrationResults.results.promoters.failed > 0 && (
                <div className="text-red-400 text-xs">
                  {migrationResults.results.promoters.failed} fallos
                </div>
              )}
            </div>

            <div className="text-center">
              <div className="text-brand-white font-bold text-lg">
                {migrationResults.results.events.success}
              </div>
              <div className="text-brand-gray text-sm">Eventos migrados</div>
              {migrationResults.results.events.failed > 0 && (
                <div className="text-red-400 text-xs">
                  {migrationResults.results.events.failed} fallos
                </div>
              )}
            </div>
          </div>

          <div className="text-center">
            <div className="text-brand-white font-bold text-xl">
              Total: {migrationResults.totalMigrated} elementos migrados
            </div>
          </div>

          {/* Mostrar errores si los hay */}
          {Object.values(migrationResults.results).some(result => result.errors.length > 0) && (
            <div className="mt-4 p-3 bg-red-500/10 rounded border border-red-500/20">
              <h4 className="font-bold text-red-400 mb-2">Errores encontrados:</h4>
              <div className="text-sm text-red-300 max-h-32 overflow-y-auto">
                {Object.values(migrationResults.results).map((result, index) => 
                  result.errors.map((error, errorIndex) => (
                    <div key={`${index}-${errorIndex}`} className="mb-1">
                      • {error}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Advertencias */}
      <div className="mt-6 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
        <h4 className="font-bold text-yellow-400 mb-2 flex items-center">
          <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
          Importante:
        </h4>
        <ul className="text-yellow-300 text-sm space-y-1">
          <li>• Esta migración creará nuevos registros en Supabase</li>
          <li>• Los IDs cambiarán (serán UUIDs generados por Supabase)</li>
          <li>• Una vez migrado, la app utilizará Supabase como fuente principal</li>
          <li>• Asegúrate de que la conexión a Supabase esté funcionando</li>
        </ul>
      </div>
    </div>
  );
};

export default DataMigrationPanel; 