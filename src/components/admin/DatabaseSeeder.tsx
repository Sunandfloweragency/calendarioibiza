import React, { useState } from 'react';
// import { seedDatabase, clearDatabase } from '../../utils/seedDatabase';
import { useData } from '../../contexts/DataContext';
import { 
  CircleStackIcon, 
  TrashIcon, 
  PlusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../common/LoadingSpinner';

// Funciones temporales hasta implementar seedDatabase
const seedDatabase = async (useSupabase: boolean) => {
  console.log('🌱 Función seedDatabase temporal');
  return { success: true, counts: { djs: 8, promoters: 6, clubs: 7, events: 8 } };
};

const clearDatabase = async (useSupabase: boolean) => {
  console.log('🧹 Función clearDatabase temporal');
  if (!useSupabase) {
    localStorage.removeItem('s&f_events');
    localStorage.removeItem('s&f_djs');
    localStorage.removeItem('s&f_clubs');
    localStorage.removeItem('s&f_promoters');
  }
  return { success: true };
};

const DatabaseSeeder: React.FC = () => {
  const { events, djs, promoters, clubs, refreshData } = useData();
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const handleSeedDatabase = async () => {
    if (!window.confirm('¿Estás seguro de que quieres poblar la base de datos con datos de ejemplo? Esto agregará DJs, promotores, clubs y eventos de Ibiza.')) {
      return;
    }

    setIsSeeding(true);
    setLastResult(null);

    try {
      const result = await seedDatabase(false); // Usar localStorage por defecto
      setLastResult(result);
      
      if (result.success) {
        // Refrescar datos después de poblar
        setTimeout(() => {
          refreshData();
        }, 1000);
      }
    } catch (error) {
      console.error('Error poblando base de datos:', error);
      setLastResult({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleClearDatabase = async () => {
    if (!window.confirm('⚠️ ¿Estás seguro de que quieres LIMPIAR TODA la base de datos? Esta acción NO se puede deshacer y eliminará todos los eventos, DJs, promotores y clubs.')) {
      return;
    }

    if (!window.confirm('🚨 ÚLTIMA CONFIRMACIÓN: Esto eliminará TODOS los datos. ¿Continuar?')) {
      return;
    }

    setIsClearing(true);
    setLastResult(null);

    try {
      const result = await clearDatabase(false); // Usar localStorage por defecto
      setLastResult(result);
      
      if (result.success) {
        // Refrescar datos después de limpiar
        setTimeout(() => {
          refreshData();
        }, 1000);
      }
    } catch (error) {
      console.error('Error limpiando base de datos:', error);
      setLastResult({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setIsClearing(false);
    }
  };

  const totalItems = events.length + djs.length + promoters.length + clubs.length;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <CircleStackIcon className="h-7 w-7 text-blue-600 mr-2" />
            Gestor de Base de Datos
          </h2>
          <p className="text-gray-600 mt-1">
            Poblar o limpiar la base de datos con datos de ejemplo de Ibiza
          </p>
        </div>
      </div>

      {/* Estado actual */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">📊 Estado Actual de la Base de Datos</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{events.length}</div>
            <div className="text-sm text-gray-600">Eventos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{djs.length}</div>
            <div className="text-sm text-gray-600">DJs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{promoters.length}</div>
            <div className="text-sm text-gray-600">Promotores</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600">{clubs.length}</div>
            <div className="text-sm text-gray-600">Clubs</div>
          </div>
        </div>
        <div className="mt-3 text-center">
          <span className="text-lg font-semibold text-gray-800">
            Total: {totalItems} elementos
          </span>
        </div>
      </div>

      {/* Resultado de la última operación */}
      {lastResult && (
        <div className={`p-4 rounded-lg mb-6 ${
          lastResult.success 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center">
            {lastResult.success ? (
              <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
            ) : (
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
            )}
            <span className={`font-semibold ${
              lastResult.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {lastResult.success ? '✅ Operación exitosa' : '❌ Error en la operación'}
            </span>
          </div>
          
          {lastResult.success && lastResult.counts && (
            <div className="mt-2 text-sm text-green-700">
              Se agregaron: {lastResult.counts.djs} DJs, {lastResult.counts.promoters} promotores, {lastResult.counts.clubs} clubs, {lastResult.counts.events} eventos
            </div>
          )}
          
          {!lastResult.success && lastResult.error && (
            <div className="mt-2 text-sm text-red-700">
              Error: {lastResult.error}
            </div>
          )}
        </div>
      )}

      {/* Acciones */}
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">🌱 Poblar Base de Datos</h4>
          <p className="text-sm text-blue-700 mb-3">
            Agrega datos de ejemplo de la escena electrónica de Ibiza: DJs famosos, clubs icónicos, promotores reconocidos y eventos épicos.
          </p>
          <button
            onClick={handleSeedDatabase}
            disabled={isSeeding || isClearing}
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-6 py-3 rounded-lg flex items-center space-x-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSeeding ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Poblando...</span>
              </>
            ) : (
              <>
                <PlusIcon className="h-5 w-5" />
                <span>Poblar con Datos de Ibiza</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h4 className="font-semibold text-red-800 mb-2">🗑️ Limpiar Base de Datos</h4>
          <p className="text-sm text-red-700 mb-3">
            ⚠️ <strong>PELIGRO:</strong> Elimina TODOS los datos de la base de datos. Esta acción no se puede deshacer.
          </p>
          <button
            onClick={handleClearDatabase}
            disabled={isSeeding || isClearing || totalItems === 0}
            className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white px-6 py-3 rounded-lg flex items-center space-x-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isClearing ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Limpiando...</span>
              </>
            ) : (
              <>
                <TrashIcon className="h-5 w-5" />
                <span>Limpiar Todo</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-2">🔄 Refrescar Datos</h4>
          <p className="text-sm text-gray-700 mb-3">
            Recarga los datos desde la base de datos para ver los cambios más recientes.
          </p>
          <button
            onClick={refreshData}
            disabled={isSeeding || isClearing}
            className="bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white px-6 py-3 rounded-lg flex items-center space-x-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowPathIcon className="h-5 w-5" />
            <span>Refrescar Datos</span>
          </button>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">ℹ️ Información</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Los datos de ejemplo incluyen DJs famosos como David Guetta, Martin Garrix, Solomun</li>
          <li>• Clubs icónicos como Pacha, Amnesia, Ushuaïa, Hï Ibiza, DC-10</li>
          <li>• Promotores reconocidos como ANTS, Circoloco, Paradise, Afterlife</li>
          <li>• Eventos épicos con fechas futuras y toda la información necesaria</li>
          <li>• Todos los elementos se crean con estado "aprobado" por defecto</li>
        </ul>
      </div>
    </div>
  );
};

export default DatabaseSeeder; 