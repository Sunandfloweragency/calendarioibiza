import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Input from '../components/common/Input';
import { 
  UserGroupIcon, 
  SparklesIcon, 
  ArrowTopRightOnSquareIcon, 
  BuildingOfficeIcon, 
  StarIcon, 
  CalendarDaysIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  HeartIcon,
  ShareIcon,
  PlayIcon,
  TrophyIcon,
  FireIcon
} from '@heroicons/react/24/outline';

const PromotersPage: React.FC = () => {
  const { promoters, events, loading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'events' | 'rating'>('name');

  // Debug: Log de datos cuando cambian
  useEffect(() => {
    console.log('🎪 PromotersPage - Estado de datos DETALLADO:', {
      promotersTotal: promoters.length,
      eventsTotal: events.length,
      loading,
      promotersConNombre: promoters.map(p => ({ id: p.id, nombre: p.name, status: p.status })),
      timestamp: new Date().toISOString(),
      location: window.location.pathname
    });
  }, [promoters.length, events.length, loading]);

  // Función para contar eventos de un promoter
  const getPromoterEventCount = useCallback((promoterId: string) => {
    return events.filter(event => 
      event.promoterId === promoterId && 
      event.status === 'approved'
    ).length;
  }, [events]);

  const filteredPromoters = useMemo(() => {
    // Temporal: usar todos los promoters independientemente del status
    let filtered = promoters.filter(promoter => {
      const nameMatch = promoter.name.toLowerCase().includes(searchTerm.toLowerCase());
      const descriptionMatch = promoter.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return nameMatch || descriptionMatch;
    });
    
    console.log('🎪 PromotersPage - Promoters filtrados:', {
      total: promoters.length,
      filtered: filtered.length,
      statuses: promoters.map(p => ({ id: p.id, name: p.name, status: p.status }))
    });

    // Ordenar según el criterio seleccionado
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'events':
          return getPromoterEventCount(b.id) - getPromoterEventCount(a.id);
        case 'rating':
          return Math.random() - 0.5; // Simulado por ahora
        default:
          return 0;
      }
    });

    return filtered;
  }, [promoters, searchTerm, sortBy, getPromoterEventCount]);

  // Obtener tipos de eventos únicos - simplificado
  const eventTypes = useMemo(() => {
    return ['Techno', 'House', 'Tech House', 'Progressive', 'Trance', 'Deep House'];
  }, []);

  // Efecto de scroll para animaciones
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [filteredPromoters]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <div className="text-lg text-brand-gray mt-4">Cargando promotores...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black relative overflow-hidden">
      {/* Fondo de partículas animadas */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 bg-brand-purple/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 left-20 w-48 h-48 bg-brand-orange/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-56 h-56 bg-brand-purple/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Filtros y Controles Mejorados */}
          <div className="max-w-6xl mx-auto mb-16 animate-slide-up">
            <div className="glass rounded-3xl p-8 shadow-main-card border border-brand-white/10">
              {/* Barra de búsqueda principal */}
              <div className="relative mb-8">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-6 w-6 text-brand-purple" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar promotores por nombre, tipo de evento o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-6 py-4 bg-brand-surface border border-brand-purple/20 rounded-2xl text-brand-white placeholder-brand-gray focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition-all duration-300 text-lg"
                />
              </div>

              {/* Controles de filtro y vista */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* Ordenar por */}
                <div>
                  <label className="block text-sm font-bold text-brand-white mb-3 tracking-wider">
                    ORDENAR POR
                  </label>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-4 py-3 bg-brand-surface border border-brand-orange/20 rounded-xl text-brand-white focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
                  >
                    <option value="name">Nombre A-Z</option>
                    <option value="events">Más eventos</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>

                {/* Modo de vista */}
                <div>
                  <label className="block text-sm font-bold text-brand-white mb-3 tracking-wider">
                    VISTA
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                        viewMode === 'grid'
                          ? 'bg-brand-purple text-brand-white shadow-purple-glow'
                          : 'bg-brand-surface text-brand-gray hover:bg-brand-purple/20'
                      }`}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                        viewMode === 'list'
                          ? 'bg-brand-orange text-brand-white shadow-orange-glow'
                          : 'bg-brand-surface text-brand-gray hover:bg-brand-orange/20'
                      }`}
                    >
                      Lista
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Tipos de eventos populares como botones */}
              <div className="pt-6 border-t border-brand-white/10">
                <div className="text-sm font-bold text-brand-white mb-4 tracking-wider">TIPOS DE EVENTOS POPULARES</div>
                <div className="flex flex-wrap gap-3">
                  {['Techno', 'House', 'Tech House', 'Fiestas Temáticas', 'Eventos Diurnos', 'Underground'].map(type => (
                    <button
                      key={type}
                      onClick={() => setSearchTerm(type)}
                      className="px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 bg-brand-surface border border-brand-purple/20 text-brand-purple hover:bg-brand-purple/10"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Grid/Lista de Promotores */}
          {filteredPromoters.length > 0 ? (
            <div className={`animate-on-scroll ${
              viewMode === 'grid' 
                ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' 
                : 'space-y-6'
            }`}>
              {filteredPromoters.map((promoter, index) => (
                <div
                  key={promoter.id}
                  className="animate-on-scroll"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {viewMode === 'grid' ? (
                    // Vista Grid Simplificada - Solo tipo de evento principal, nombre y ver más
                    <Link 
                      to={`/promoters/${promoter.slug}`}
                      className="group relative overflow-hidden rounded-3xl transition-all duration-700 hover-lift card-3d shadow-main-card hover:shadow-main-card-hover block"
                    >
                      {/* Imagen de fondo */}
                      <div className="relative overflow-hidden h-80">
                        <img 
                          src={promoter.imageUrl || `https://picsum.photos/seed/${promoter.slug}/800/600`}
                          alt={promoter.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        {/* Overlay gradiente */}
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/40 to-brand-black/20"></div>
                        
                        {/* Badge de tipo de evento principal */}
                        <div className="absolute top-4 left-4">
                          <div className="bg-brand-purple rounded-2xl px-4 py-3 shadow-lg">
                            <div className="text-center">
                              <div className="text-sm font-bold text-brand-white">
                                {'EVENTOS'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Número de eventos en la esquina superior derecha */}
                        <div className="absolute top-4 right-4">
                          <div className="bg-brand-black/70 backdrop-blur-md rounded-2xl px-4 py-2 border border-brand-white/20">
                            <div className="flex items-center space-x-1">
                              <CalendarDaysIcon className="w-4 h-4 text-brand-orange" />
                              <span className="text-lg font-bold text-brand-white">
                                {getPromoterEventCount(promoter.id)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Información principal superpuesta - Simplificada */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          {/* Nombre del promotor */}
                          <h3 className="text-2xl font-black text-brand-white mb-6 text-with-gradient-glow transition-all duration-300 leading-tight">
                            {promoter.name}
                          </h3>

                          {/* Solo botón VER PERFIL */}
                          <div className="flex justify-center">
                            <div className="inline-flex items-center space-x-2 bg-gradient-purple px-6 py-3 rounded-full text-brand-white font-bold text-sm hover:bg-gradient-orange transition-all duration-300 shadow-lg">
                              <span>VER PERFIL</span>
                              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                            </div>
                          </div>
                        </div>

                        {/* Efectos de hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-purple/10 via-transparent to-brand-orange/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                      </div>
                    </Link>
                  ) : (
                    // Vista Lista Simplificada
                    <Link 
                      to={`/promoters/${promoter.slug}`}
                      className="group flex items-center space-x-6 glass rounded-2xl p-6 hover:shadow-main-card transition-all duration-300 border border-brand-white/10"
                    >
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-brand-surface to-brand-surface-variant flex items-center justify-center">
                        <img 
                          src={promoter.imageUrl || `https://picsum.photos/seed/${promoter.slug}/200/200`}
                          alt={promoter.name}
                          className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-brand-white mb-3 text-with-gradient-glow transition-colors duration-300">
                          {promoter.name}
                        </h3>
                        <div className="inline-block bg-brand-purple/20 text-brand-purple px-3 py-1 rounded-full text-sm font-medium">
                          {'EVENTOS'}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 flex-shrink-0">
                        <div className="text-center">
                          <div className="text-lg font-bold text-brand-white">{getPromoterEventCount(promoter.id)}</div>
                          <div className="text-xs text-brand-gray">Eventos</div>
                        </div>
                        <div className="inline-flex items-center space-x-2 bg-gradient-purple px-4 py-2 rounded-full text-brand-white font-bold text-sm hover:bg-gradient-orange transition-all duration-300">
                          <span>VER PERFIL</span>
                          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Estado vacío mejorado
            <div className="text-center py-20 animate-on-scroll">
              <div className="glass rounded-3xl p-12 max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-brand-purple to-brand-orange rounded-full flex items-center justify-center mx-auto mb-6">
                  <SparklesIcon className="w-12 h-12 text-brand-white" />
                </div>
                <h3 className="text-2xl font-bold text-brand-white mb-4">
                  No se encontraron promotores
                </h3>
                <p className="text-lg text-brand-gray mb-8">
                  Intenta con otros términos de búsqueda o tipos de eventos
                </p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                  }}
                  className="btn-modern bg-gradient-to-r from-brand-purple to-brand-orange px-8 py-3 rounded-xl font-bold text-brand-white hover:shadow-lg transition-all duration-300"
                >
                  LIMPIAR FILTROS
                </button>
              </div>
            </div>
          )}

          {/* Sección de tipos de eventos destacados */}
          <div className="mt-32 pt-20 border-t border-brand-white/10">
            <div className="text-center mb-16">
              <h2 className="text-mega text-gradient mb-6">
                TIPOS DE
                <br />
                <span className="text-gradient-reverse">EVENTOS</span>
              </h2>
              <p className="text-xl text-brand-gray max-w-3xl mx-auto">
                Explora la diversidad de experiencias que ofrecen los mejores promotores de Ibiza
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {eventTypes.slice(0, 12).map((eventType, index) => {
                const promoterCount = promoters.filter(p => p.description?.includes(eventType)).length;
                return (
                  <button
                    key={eventType}
                    onClick={() => setSearchTerm(eventType)}
                    className="group glass rounded-2xl p-6 hover:shadow-main-card transition-all duration-300 text-center transform hover:scale-105"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="text-4xl mb-4">
                      {index % 6 === 0 ? '🎉' : index % 6 === 1 ? '🎪' : index % 6 === 2 ? '🌟' : index % 6 === 3 ? '��' : index % 6 === 4 ? '⚡' : '🎭'}
                    </div>
                    <div className="text-sm font-bold text-brand-white text-with-gradient-glow transition-colors duration-300 mb-2">
                      {eventType}
                    </div>
                    <div className="text-xs text-brand-gray">
                      {promoterCount} promotores
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotersPage;