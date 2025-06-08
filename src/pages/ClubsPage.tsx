import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { MapPinIcon, MusicalNoteIcon, SparklesIcon, ArrowTopRightOnSquareIcon, StarIcon, ClockIcon } from '@heroicons/react/24/outline';

const ClubsPage: React.FC = () => {
  const { clubs, events, loading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMusicType, setSelectedMusicType] = useState('');
  const [selectedCapacity, setSelectedCapacity] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Función para contar eventos de un club
  const getClubEventCount = useCallback((clubId: string) => {
    return events.filter(event => 
      event.clubId === clubId && 
      event.status === 'approved'
    ).length;
  }, [events]);

  const filteredClubs = useMemo(() => {
    // Temporal: usar todos los clubs independientemente del status
    let filtered = clubs.filter(club => {
      const nameMatch = club.name.toLowerCase().includes(searchTerm.toLowerCase());
      const locationMatch = club.location?.toLowerCase().includes(searchTerm.toLowerCase());
      const capacityMatch = selectedCapacity ? 
        (selectedCapacity === 'small' && club.capacity && club.capacity < 500) ||
        (selectedCapacity === 'medium' && club.capacity && club.capacity >= 500 && club.capacity < 1500) ||
        (selectedCapacity === 'large' && club.capacity && club.capacity >= 1500) : true;
      
      return nameMatch || locationMatch && capacityMatch;
    });
    
    console.log('🏢 ClubsPage - Clubs filtrados:', {
      total: clubs.length,
      filtered: filtered.length,
      statuses: clubs.map(c => ({ id: c.id, name: c.name, status: c.status }))
    });

    // Ordenar según el criterio seleccionado
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'popularity':
          return getClubEventCount(b.id) - getClubEventCount(a.id);
        case 'capacity':
          return (b.capacity || 0) - (a.capacity || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [clubs, searchTerm, selectedCapacity, sortBy, getClubEventCount]);

  // Obtener tipos de música únicos - simplificado
  const musicTypes = useMemo(() => {
    return ['Techno', 'House', 'Tech House', 'Trance', 'EDM', 'Progressive'];
  }, []);

  // Clubs destacados (superclubs)
  const featuredClubs = clubs.filter(club => 
    ['Amnesia', 'Pacha', 'Hï', 'Ushuaïa', 'DC-10'].some(name => 
      club.name.toLowerCase().includes(name.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <div className="text-lg text-brand-gray mt-4">Cargando clubs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black">
      {/* Sección de filtros */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="glass-orange rounded-3xl p-8 shadow-orange-glow animate-slide-up">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Input
                  type="text"
                  placeholder="Buscar clubs por nombre, música o ubicación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  label="Buscar Clubs"
                  className="text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-white mb-3 tracking-wider">
                  TIPO DE MÚSICA
                </label>
                <select 
                  value={selectedMusicType} 
                  onChange={(e) => setSelectedMusicType(e.target.value)}
                  className="w-full px-4 py-3 bg-brand-surface border border-brand-orange/20 rounded-xl text-brand-white focus:ring-brand-orange focus:border-brand-orange transition-all duration-300 text-lg"
                >
                  <option value="">Todos los géneros</option>
                  {musicTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
            </div>
            
            {/* Géneros populares */}
            <div className="mt-6 pt-6 border-t border-brand-orange/20">
              <div className="text-sm font-bold text-brand-white mb-3 tracking-wider">GÉNEROS POPULARES</div>
              <div className="flex flex-wrap gap-2">
                {['Techno', 'House', 'Tech House', 'Trance', 'EDM'].map(genre => (
                  <button
                    key={genre}
                    onClick={() => setSelectedMusicType(selectedMusicType === genre ? '' : genre)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedMusicType === genre
                        ? 'bg-brand-orange text-brand-white shadow-orange-glow'
                        : 'bg-brand-orange/20 text-brand-orange hover:bg-brand-orange/30'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Superclubs destacados */}
      {featuredClubs.length > 0 && (
        <section className="py-20 px-6 bg-gradient-surface">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">





              <h2 className="text-4xl md:text-6xl font-black text-gradient mb-6">
                SUPER
                <br />
                <span className="text-gradient-reverse">CLUBS</span>
              </h2>
              <p className="text-xl text-brand-gray">
                Los templos legendarios de la música electrónica
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredClubs.slice(0, 6).map((club, index) => (
                <Link 
                  key={club.id} 
                  to={`/clubs/${club.slug}`}
                  className="group relative overflow-hidden rounded-3xl transition-all duration-700 hover-lift card-3d shadow-main-card hover:shadow-main-card-hover"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Imagen de fondo */}
                  <div className="relative overflow-hidden h-80">
                    <img 
                      src={club.imageUrl || `https://picsum.photos/seed/${club.slug}/800/600`} 
                      alt={club.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Overlay gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/40 to-brand-black/20"></div>

                    {/* Rating en la esquina superior derecha */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-brand-black/70 backdrop-blur-md rounded-2xl px-4 py-2 border border-brand-white/20">
                        <div className="flex items-center space-x-1">
                          <StarIcon className="w-4 h-4 text-brand-orange" />
                          <span className="text-lg font-bold text-brand-white">4.9</span>
                        </div>
                      </div>
                    </div>

                    {/* Información principal superpuesta */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      {/* Nombre del club */}
                      <h3 className="text-2xl font-black text-brand-white mb-4 group-hover:text-gradient transition-all duration-300 leading-tight">
                        {club.name}
                      </h3>

                      {/* Ubicación */}
                      <div className="flex items-center space-x-2 mb-4">
                        <MapPinIcon className="w-4 h-4 text-brand-orange" />
                        <span className="text-brand-white/90 text-sm font-medium">
                          {club.location?.split(',')[0]}
                        </span>
                      </div>

                      {/* Información adicional */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <ClockIcon className="w-4 h-4 text-brand-orange" />
                          <span className="text-brand-white/80 text-sm font-medium">{getClubEventCount(club.id)} eventos</span>
                        </div>
                        
                        <div className="inline-flex items-center space-x-2 bg-gradient-orange px-3 py-1 rounded-full text-brand-white font-bold text-xs hover:bg-gradient-purple transition-all duration-300">
                          <span>EXPLORAR</span>
                          <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                        </div>
                      </div>
                    </div>

                    {/* Efectos de hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-orange/10 via-transparent to-brand-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Todos los clubs */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-gradient mb-6">
              TODOS LOS
              <br />
              <span className="text-gradient-reverse">VENUES</span>
            </h2>
            <p className="text-xl text-brand-gray">
              {filteredClubs.length} clubs encontrados
            </p>
          </div>

          {filteredClubs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredClubs.map((club, index) => (
                <Link 
                  key={club.id} 
                  to={`/clubs/${club.slug}`}
                  className="group relative overflow-hidden rounded-3xl transition-all duration-500 hover-lift card-3d shadow-main-card hover:shadow-main-card-hover"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Imagen de fondo */}
                  <div className="relative overflow-hidden h-64">
                    <img 
                      src={club.imageUrl || `https://picsum.photos/seed/${club.slug}/400/300`} 
                      alt={club.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Overlay gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/40 to-brand-black/20"></div>

                    {/* Número de eventos en la esquina superior derecha */}
                    <div className="absolute top-3 right-3">
                      <div className="bg-brand-black/70 backdrop-blur-md rounded-xl px-3 py-2 border border-brand-white/20">
                        <div className="flex items-center space-x-1">
                          <MusicalNoteIcon className="w-3 h-3 text-brand-orange" />
                          <span className="text-xs font-bold text-brand-white">{getClubEventCount(club.id)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Información principal superpuesta */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      {/* Nombre del club */}
                      <h3 className="text-lg font-black text-brand-white mb-2 group-hover:text-gradient transition-all duration-300">
                        {club.name}
                      </h3>

                      {/* Ubicación */}
                      <div className="flex items-center space-x-2 mb-3">
                        <MapPinIcon className="w-4 h-4 text-brand-orange flex-shrink-0" />
                        <span className="text-brand-white/90 text-sm truncate">{club.location?.split(',')[0]}</span>
                      </div>

                      {/* Botón de acción */}
                      <div className="flex items-center justify-between">
                        <div className="text-brand-white/70 text-xs">
                          Club • Ibiza
                        </div>
                        <div className="inline-flex items-center space-x-1 bg-gradient-orange px-2 py-1 rounded-full text-brand-white font-bold text-xs hover:bg-gradient-purple transition-all duration-300">
                          <span>VER</span>
                          <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                        </div>
                      </div>
                    </div>

                    {/* Efectos de hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-orange/10 via-transparent to-brand-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="glass rounded-3xl p-12 max-w-md mx-auto">
                <SparklesIcon className="w-16 h-16 text-brand-white/30 mx-auto mb-6" />
                <h3 className="text-display text-brand-white mb-4">
                  No se encontraron clubs
                </h3>
                <p className="text-lg text-brand-gray mb-6">
                  Intenta con otros términos de búsqueda
                </p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedMusicType('');
                  }}
                  className="btn-modern px-6 py-3 rounded-xl"
                >
                  LIMPIAR FILTROS
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Sección de géneros musicales */}
      <section className="py-20 px-6 bg-gradient-surface">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-gradient mb-6">
              GÉNEROS
              <br />
              <span className="text-gradient-reverse">MUSICALES</span>
            </h2>
            <p className="text-xl text-brand-gray">
              La diversidad sonora de Ibiza
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {musicTypes.slice(0, 12).map((type, index) => (
              <button
                key={type}
                onClick={() => setSelectedMusicType(type)}
                className="group p-6 glass rounded-2xl hover:shadow-main-card transition-all duration-300 text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl mb-3">🎵</div>
                <div className="text-sm font-bold text-brand-white group-hover:text-gradient transition-colors duration-300 mb-1">
                  {type}
                </div>
                <div className="text-xs text-brand-gray">
                  {clubs.filter(c => c.description?.includes(type)).length} clubs
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ClubsPage;