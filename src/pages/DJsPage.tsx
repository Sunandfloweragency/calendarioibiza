import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { DJ_GENRES } from '../constants';
import Input from '../components/common/Input';
import { 
  MusicalNoteIcon, 
  SparklesIcon, 
  ArrowTopRightOnSquareIcon, 
  UserIcon, 
  StarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlayIcon,
  HeartIcon,
  ShareIcon
} from '@heroicons/react/24/outline';

const DJsPage: React.FC = () => {
  const { djs, events, loading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'popularity' | 'genre'>('name');

  // Debug: Log de datos cuando cambian
  useEffect(() => {
    console.log('🎧 DJsPage - Estado de datos DETALLADO:', {
      djsTotal: djs.length,
      eventsTotal: events.length,
      loading,
      djsConNombre: djs.map(d => ({ id: d.id, nombre: d.name, status: d.status })),
      timestamp: new Date().toISOString(),
      location: window.location.pathname
    });
  }, [djs.length, events.length, loading]);

  // Función para contar eventos de un DJ
  const getDJEventCount = useCallback((djId: string) => {
    return events.filter(event => 
      event.djIds?.includes(djId) && 
      event.status === 'approved'
    ).length;
  }, [events]);

  const filteredDJs = useMemo(() => {
    // Temporal: usar todos los DJs independientemente del status
    let filtered = djs.filter(dj => {
      const nameMatch = dj.name.toLowerCase().includes(searchTerm.toLowerCase());
      const genreMatch = selectedGenre ? dj.genre?.includes(selectedGenre) : true;
      return nameMatch && genreMatch;
    });
    
    console.log('🎧 DJsPage - DJs filtrados:', {
      total: djs.length,
      filtered: filtered.length,
      statuses: djs.map(d => ({ id: d.id, name: d.name, status: d.status }))
    });

    // Ordenar según el criterio seleccionado
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'popularity':
          return getDJEventCount(b.id) - getDJEventCount(a.id);
        case 'genre':
          return (a.genre || '').localeCompare(b.genre || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [djs, searchTerm, selectedGenre, sortBy, getDJEventCount]);

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
  }, [filteredDJs]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <div className="text-lg text-brand-gray mt-4">Cargando DJs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black relative overflow-hidden">
      {/* Fondo de partículas animadas */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-brand-purple/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-56 h-56 bg-brand-orange/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Filtros y Controles Mejorados */}
          <div className="max-w-6xl mx-auto mb-16 animate-slide-up">
            <div className="glass rounded-3xl p-8 shadow-main-card border border-brand-white/10">
              {/* Barra de búsqueda principal */}
              <div className="relative mb-8">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-6 w-6 text-brand-orange" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar DJs por nombre, estilo o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-6 py-4 bg-brand-surface border border-brand-orange/20 rounded-2xl text-brand-white placeholder-brand-gray focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300 text-lg"
                />
              </div>

              {/* Controles de filtro y vista */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* Filtro por género */}
                <div>
                  <label className="block text-sm font-bold text-brand-white mb-3 tracking-wider flex items-center">
                    <FunnelIcon className="w-4 h-4 mr-2 text-brand-orange" />
                    FILTRAR POR GÉNERO
                  </label>
                  <select 
                    value={selectedGenre} 
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full px-4 py-3 bg-brand-surface border border-brand-orange/20 rounded-xl text-brand-white focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
                  >
                    <option value="">Todos los géneros</option>
                    {DJ_GENRES.map(genre => <option key={genre} value={genre}>{genre}</option>)}
                  </select>
                </div>

                {/* Ordenar por */}
                <div>
                  <label className="block text-sm font-bold text-brand-white mb-3 tracking-wider">
                    ORDENAR POR
                  </label>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-4 py-3 bg-brand-surface border border-brand-purple/20 rounded-xl text-brand-white focus:ring-brand-purple focus:border-brand-purple transition-all duration-300"
                  >
                    <option value="name">Nombre A-Z</option>
                    <option value="popularity">Popularidad</option>
                    <option value="genre">Género</option>
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
                          ? 'bg-brand-orange text-brand-white shadow-orange-glow'
                          : 'bg-brand-surface text-brand-gray hover:bg-brand-orange/20'
                      }`}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                        viewMode === 'list'
                          ? 'bg-brand-purple text-brand-white shadow-purple-glow'
                          : 'bg-brand-surface text-brand-gray hover:bg-brand-purple/20'
                      }`}
                    >
                      Lista
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Géneros populares como botones */}
              <div className="pt-6 border-t border-brand-white/10">
                <div className="text-sm font-bold text-brand-white mb-4 tracking-wider">GÉNEROS POPULARES</div>
                <div className="flex flex-wrap gap-3">
                  {['Techno', 'House', 'Tech House', 'Melodic Techno', 'Deep House', 'Progressive House'].map(genre => (
                    <button
                      key={genre}
                      onClick={() => setSelectedGenre(selectedGenre === genre ? '' : genre)}
                      className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                        selectedGenre === genre
                          ? 'bg-gradient-to-r from-brand-orange to-brand-purple text-brand-white shadow-lg'
                          : 'bg-brand-surface border border-brand-orange/20 text-brand-orange hover:bg-brand-orange/10'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Grid/Lista de DJs */}
          {filteredDJs.length > 0 ? (
            <div className={`animate-on-scroll ${
              viewMode === 'grid' 
                ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' 
                : 'space-y-6'
            }`}>
              {filteredDJs.map((dj, index) => (
                <div
                  key={dj.id}
                  className="animate-on-scroll"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {viewMode === 'grid' ? (
                    // Vista Grid Simplificada - Solo género, nombre y ver más
                    <Link 
                      to={`/djs/${dj.slug}`} 
                      className="group relative overflow-hidden rounded-3xl transition-all duration-700 hover-lift card-3d shadow-main-card hover:shadow-main-card-hover block"
                    >
                      {/* Imagen de fondo */}
                      <div className="relative overflow-hidden h-80">
                        <img 
                          src={dj.imageUrl || `https://picsum.photos/seed/${dj.slug}/600/600`}
                          alt={dj.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        {/* Overlay gradiente */}
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/40 to-brand-black/20"></div>
                        
                        {/* Badge de género principal - Solo uno */}
                        <div className="absolute top-4 left-4">
                          <div className="bg-brand-orange rounded-2xl px-4 py-3 shadow-lg">
                            <div className="text-center">
                              <div className="text-sm font-bold text-brand-white">
                                {dj.genre || 'Electronic'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Información principal superpuesta - Simplificada */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          {/* Nombre del DJ */}
                          <h3 className="text-2xl font-black text-brand-white mb-6 text-with-gradient-glow transition-all duration-300 leading-tight">
                            {dj.name}
                          </h3>

                          {/* Solo botón VER MÁS */}
                          <div className="flex justify-center">
                            <div className="inline-flex items-center space-x-2 bg-gradient-orange px-6 py-3 rounded-full text-brand-white font-bold text-sm hover:bg-gradient-purple transition-all duration-300 shadow-lg">
                              <span>VER MÁS</span>
                              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                            </div>
                          </div>
                        </div>

                        {/* Efectos de hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-orange/10 via-transparent to-brand-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                      </div>
                    </Link>
                  ) : (
                    // Vista Lista Simplificada
                    <Link 
                      to={`/djs/${dj.slug}`}
                      className="group flex items-center space-x-6 glass rounded-2xl p-6 hover:shadow-main-card transition-all duration-300 border border-brand-white/10"
                    >
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                        <img 
                          src={dj.imageUrl || `https://picsum.photos/seed/${dj.slug}/200/200`}
                          alt={dj.name} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/50 to-transparent"></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-brand-white mb-3 text-with-gradient-glow transition-colors duration-300">
                          {dj.name}
                        </h3>
                        <div className="inline-block bg-brand-orange/20 text-brand-orange px-3 py-1 rounded-full text-sm font-medium">
                          {dj.genre || 'Electronic'}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 flex-shrink-0">
                        <div className="inline-flex items-center space-x-2 bg-gradient-orange px-4 py-2 rounded-full text-brand-white font-bold text-sm hover:bg-gradient-purple transition-all duration-300">
                          <span>VER MÁS</span>
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
                <div className="w-24 h-24 bg-gradient-to-br from-brand-orange to-brand-purple rounded-full flex items-center justify-center mx-auto mb-6">
                  <SparklesIcon className="w-12 h-12 text-brand-white" />
                </div>
                <h3 className="text-2xl font-bold text-brand-white mb-4">
                  No se encontraron DJs
                </h3>
                <p className="text-lg text-brand-gray mb-8">
                  Intenta con otros términos de búsqueda o géneros musicales
                </p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedGenre('');
                  }}
                  className="btn-modern bg-gradient-to-r from-brand-orange to-brand-purple px-8 py-3 rounded-xl font-bold text-brand-white hover:shadow-lg transition-all duration-300"
                >
                  LIMPIAR FILTROS
                </button>
              </div>
            </div>
          )}

          {/* Sección de géneros destacados */}
          <div className="mt-32 pt-20 border-t border-brand-white/10">
            <div className="text-center mb-16">
              <h2 className="text-mega text-gradient mb-6">
                EXPLORA
                <br />
                <span className="text-gradient-reverse">GÉNEROS</span>
              </h2>
              <p className="text-xl text-brand-gray max-w-3xl mx-auto">
                Sumérgete en la diversidad musical que define el sonido de Ibiza
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {DJ_GENRES.slice(0, 12).map((genre, index) => {
                const djCount = djs.filter(dj => dj.genre?.includes(genre)).length;
                return (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className="group glass rounded-2xl p-6 hover:shadow-main-card transition-all duration-300 text-center transform hover:scale-105"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="text-4xl mb-4">
                      {index % 6 === 0 ? '🎵' : index % 6 === 1 ? '🎧' : index % 6 === 2 ? '🎤' : index % 6 === 3 ? '🎹' : index % 6 === 4 ? '🥁' : '🎸'}
                    </div>
                    <div className="text-sm font-bold text-brand-white text-with-gradient-glow transition-colors duration-300 mb-2">
                      {genre}
                    </div>
                    <div className="text-xs text-brand-gray">
                      {djCount} DJs
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

export default DJsPage;