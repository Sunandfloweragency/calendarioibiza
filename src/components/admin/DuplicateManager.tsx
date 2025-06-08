import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { 
  ExclamationTriangleIcon, 
  TrashIcon, 
  CheckCircleIcon,
  XMarkIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../common/LoadingSpinner';

interface DuplicateGroup {
  type: 'Event' | 'DJ' | 'Promoter' | 'Club';
  items: any[];
  duplicateKey: string;
  reason: string;
}

const DuplicateManager: React.FC = () => {
  const { 
    events, djs, promoters, clubs, 
    deleteEvent, deleteDJ, deletePromoter, deleteClub,
    loading 
  } = useData();
  
  const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  // Función para normalizar strings para comparación
  const normalizeString = (str: string): string => {
    return str.toLowerCase()
      .trim()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/[ñ]/g, 'n')
      .replace(/[^a-z0-9]/g, '');
  };

  // Función para detectar duplicados
  const detectDuplicates = () => {
    setIsAnalyzing(true);
    const foundDuplicates: DuplicateGroup[] = [];

    // Detectar eventos duplicados
    const eventGroups = new Map<string, any[]>();
    events.forEach(event => {
      const nameKey = normalizeString(event.name);
      const dateKey = event.date;
      const key = `${nameKey}_${dateKey}`;
      
      if (!eventGroups.has(key)) {
        eventGroups.set(key, []);
      }
      eventGroups.get(key)!.push(event);
    });

    eventGroups.forEach((items, key) => {
      if (items.length > 1) {
        foundDuplicates.push({
          type: 'Event',
          items,
          duplicateKey: key,
          reason: `Mismo nombre y fecha: "${items[0].name}" - ${items[0].date}`
        });
      }
    });

    // Detectar DJs duplicados
    const djGroups = new Map<string, any[]>();
    djs.forEach(dj => {
      const nameKey = normalizeString(dj.name);
      
      if (!djGroups.has(nameKey)) {
        djGroups.set(nameKey, []);
      }
      djGroups.get(nameKey)!.push(dj);
    });

    djGroups.forEach((items, key) => {
      if (items.length > 1) {
        foundDuplicates.push({
          type: 'DJ',
          items,
          duplicateKey: key,
          reason: `Mismo nombre: "${items[0].name}"`
        });
      }
    });

    // Detectar Promotores duplicados
    const promoterGroups = new Map<string, any[]>();
    promoters.forEach(promoter => {
      const nameKey = normalizeString(promoter.name);
      
      if (!promoterGroups.has(nameKey)) {
        promoterGroups.set(nameKey, []);
      }
      promoterGroups.get(nameKey)!.push(promoter);
    });

    promoterGroups.forEach((items, key) => {
      if (items.length > 1) {
        foundDuplicates.push({
          type: 'Promoter',
          items,
          duplicateKey: key,
          reason: `Mismo nombre: "${items[0].name}"`
        });
      }
    });

    // Detectar Clubs duplicados
    const clubGroups = new Map<string, any[]>();
    clubs.forEach(club => {
      const nameKey = normalizeString(club.name);
      
      if (!clubGroups.has(nameKey)) {
        clubGroups.set(nameKey, []);
      }
      clubGroups.get(nameKey)!.push(club);
    });

    clubGroups.forEach((items, key) => {
      if (items.length > 1) {
        foundDuplicates.push({
          type: 'Club',
          items,
          duplicateKey: key,
          reason: `Mismo nombre: "${items[0].name}"`
        });
      }
    });

    setDuplicates(foundDuplicates);
    setIsAnalyzing(false);
  };

  // Función para alternar selección de elemento para eliminación
  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedForDeletion);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedForDeletion(newSelection);
  };

  // Función para seleccionar automáticamente duplicados (mantener el más reciente)
  const autoSelectDuplicates = () => {
    const newSelection = new Set<string>();
    
    duplicates.forEach(group => {
      // Ordenar por fecha de creación (más reciente primero)
      const sortedItems = [...group.items].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      // Seleccionar todos excepto el más reciente para eliminación
      sortedItems.slice(1).forEach(item => {
        newSelection.add(item.id);
      });
    });
    
    setSelectedForDeletion(newSelection);
  };

  // Función para eliminar elementos seleccionados
  const deleteSelected = async () => {
    if (selectedForDeletion.size === 0) return;
    
    if (!window.confirm(`¿Estás seguro de que quieres eliminar ${selectedForDeletion.size} elementos duplicados?`)) {
      return;
    }

    setIsDeleting(true);
    
    try {
      for (const id of selectedForDeletion) {
        // Encontrar el tipo de elemento
        const eventItem = events.find(e => e.id === id);
        const djItem = djs.find(d => d.id === id);
        const promoterItem = promoters.find(p => p.id === id);
        const clubItem = clubs.find(c => c.id === id);

        if (eventItem) {
          await deleteEvent(id);
        } else if (djItem) {
          await deleteDJ(id);
        } else if (promoterItem) {
          await deletePromoter(id);
        } else if (clubItem) {
          await deleteClub(id);
        }
      }
      
      setSelectedForDeletion(new Set());
      // Re-analizar después de eliminar
      setTimeout(detectDuplicates, 1000);
      
    } catch (error) {
      console.error('Error eliminando duplicados:', error);
      alert('Error al eliminar algunos elementos');
    } finally {
      setIsDeleting(false);
    }
  };

  // Detectar duplicados al cargar el componente
  useEffect(() => {
    if (!loading && events.length > 0) {
      detectDuplicates();
    }
  }, [loading, events.length, djs.length, promoters.length, clubs.length]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Event': return 'from-purple-500 to-purple-700';
      case 'DJ': return 'from-blue-500 to-blue-700';
      case 'Promoter': return 'from-green-500 to-green-700';
      case 'Club': return 'from-pink-500 to-pink-700';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  if (loading || isAnalyzing) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="flex items-center justify-center">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-lg font-medium text-gray-700">
            {loading ? 'Cargando datos...' : 'Analizando duplicados...'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <ExclamationTriangleIcon className="h-7 w-7 text-orange-500 mr-2" />
            Gestor de Duplicados
          </h2>
          <p className="text-gray-600 mt-1">
            {duplicates.length === 0 
              ? '✅ No se encontraron duplicados' 
              : `⚠️ Se encontraron ${duplicates.length} grupos de duplicados`
            }
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={detectDuplicates}
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transition-all duration-300"
          >
            🔍 Re-analizar
          </button>
          
          {duplicates.length > 0 && (
            <>
              <button
                onClick={autoSelectDuplicates}
                className="bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transition-all duration-300"
              >
                ⚡ Auto-seleccionar
              </button>
              
              <button
                onClick={deleteSelected}
                disabled={selectedForDeletion.size === 0 || isDeleting}
                className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Eliminando...</span>
                  </>
                ) : (
                  <>
                    <TrashIcon className="h-4 w-4 inline mr-1" />
                    Eliminar ({selectedForDeletion.size})
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {duplicates.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">¡Excelente!</h3>
          <p className="text-gray-600">No se encontraron elementos duplicados en la base de datos.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {duplicates.map((group, groupIndex) => (
            <div key={groupIndex} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 flex items-center">
                    <span className={`inline-block w-3 h-3 rounded-full bg-gradient-to-r ${getTypeColor(group.type)} mr-2`}></span>
                    {group.type} Duplicados
                  </h3>
                  <p className="text-sm text-gray-600">{group.reason}</p>
                </div>
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {group.items.length} elementos
                </span>
              </div>
              
              <div className="grid gap-3">
                {group.items.map((item, itemIndex) => (
                  <div 
                    key={item.id} 
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      selectedForDeletion.has(item.id) 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedForDeletion.has(item.id)}
                            onChange={() => toggleSelection(item.id)}
                            className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-800">{item.name}</h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>ID: <code className="bg-gray-200 px-1 rounded">{item.id}</code></p>
                              <p>Creado: {new Date(item.createdAt).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}</p>
                              {item.description && (
                                <p className="line-clamp-2">{item.description}</p>
                              )}
                              {group.type === 'Event' && item.date && (
                                <p>Fecha evento: {new Date(item.date).toLocaleDateString('es-ES')}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {itemIndex === 0 && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                            MÁS RECIENTE
                          </span>
                        )}
                        {item.slug && (
                          <a
                            href={`/${group.type.toLowerCase()}s/${item.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DuplicateManager; 