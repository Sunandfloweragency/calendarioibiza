import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import EventCard from '../components/EventCard';
import EventListCompact from '../components/EventListCompact';
import Calendar3D from '../components/3D/Calendar3D';
import FloatingElements from '../components/3D/FloatingElements';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  CalendarDaysIcon, 
  ListBulletIcon,
  SparklesIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const EventsPage: React.FC = () => {
  const { events, clubs, djs, loading } = useData();
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'calendar'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClub, setSelectedClub] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Filtrar eventos - Usar directamente el array events
  const filteredEvents = useMemo(() => {
    // Temporal: usar todos los eventos independientemente del status
    let eventsToFilter = events; // Mostrar todos temporalmente
    
    console.log('📅 EventsPage - Eventos filtrados:', {
      total: events.length,
      filtered: eventsToFilter.length,
      statuses: events.map(e => ({ id: e.id, name: e.name, status: e.status }))
    });

    // Aplicar filtros de búsqueda y fecha
    eventsToFilter = eventsToFilter.filter(event => {
      const nameMatch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
      const clubMatch = event.clubId && clubs.find(club => club.id === event.clubId)?.name.toLowerCase().includes(searchTerm.toLowerCase());
      const djMatch = event.djIds?.some(djId => {
        const dj = djs.find(d => d.id === djId);
        return dj?.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
      
      const searchMatch = nameMatch || clubMatch || djMatch;
      const dateMatch = !selectedDate || event.date === selectedDate;
      
      return searchMatch && dateMatch;
    });

    // Ordenar por fecha
    eventsToFilter.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return eventsToFilter;
  }, [events, searchTerm, selectedDate, clubs, djs]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center relative overflow-hidden">
        <FloatingElements count={20} speed={1.2} />
        <div className="relative z-10">
          <LoadingSpinner 
            size="xl" 
            text="CARGANDO EVENTOS" 
            variant="professional" 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black relative overflow-hidden">
      <FloatingElements count={25} speed={0.6} />

      {/* Header */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-mega text-gradient mb-6 leading-tight">
              EVENTOS
              <br />
              <span className="text-gradient-reverse">IBIZA</span>
            </h1>
            <p className="text-xl text-brand-gray max-w-3xl mx-auto">
              Descubre todos los eventos de música electrónica en la isla blanca
            </p>
          </div>

          {/* Controles de vista y filtros */}
          <div className="bg-gradient-to-br from-brand-surface/50 to-brand-surface-variant/50 backdrop-blur-md rounded-2xl border border-brand-orange/20 p-6 mb-8">
            {/* Selector de vista */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
              <div className="flex items-center justify-center lg:justify-start">
                <div className="bg-brand-surface rounded-xl p-1 border border-brand-orange/20">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                      viewMode === 'list'
                        ? 'bg-brand-orange text-brand-white shadow-orange-glow'
                        : 'text-brand-white/70 hover:text-brand-white'
                    }`}
                  >
                    <ListBulletIcon className="w-5 h-5 mr-2" />
                    Lista
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                      viewMode === 'grid'
                        ? 'bg-brand-orange text-brand-white shadow-orange-glow'
                        : 'text-brand-white/70 hover:text-brand-white'
                    }`}
                  >
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('calendar')}
                    className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                      viewMode === 'calendar'
                        ? 'bg-brand-orange text-brand-white shadow-orange-glow'
                        : 'text-brand-white/70 hover:text-brand-white'
                    }`}
                  >
                    <CalendarDaysIcon className="w-5 h-5 mr-2" />
                    Calendario
                  </button>
                </div>
              </div>

              {/* Búsqueda */}
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-orange" />
                <input
                  type="text"
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-brand-surface border border-brand-orange/30 rounded-xl text-brand-white placeholder-brand-gray focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={selectedClub}
                onChange={(e) => setSelectedClub(e.target.value)}
                className="bg-brand-surface border border-brand-orange/30 rounded-xl text-brand-white px-4 py-3 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all duration-300"
              >
                <option value="">Todos los clubs</option>
                {clubs.map(club => (
                  <option key={club.id} value={club.id}>{club.name}</option>
                ))}
              </select>

              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="bg-brand-surface border border-brand-orange/30 rounded-xl text-brand-white px-4 py-3 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all duration-300"
              >
                <option value="">Todos los géneros</option>
                <option value="Techno">Techno</option>
                <option value="House">House</option>
                <option value="Progressive">Progressive</option>
                <option value="Minimal">Minimal</option>
                <option value="Trance">Trance</option>
              </select>
            </div>

            {/* Contador de resultados */}
            <div className="mt-4 text-center">
              <span className="text-brand-gray">
                {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''} encontrado{filteredEvents.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido principal */}
      <section className="relative pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {viewMode === 'calendar' ? (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              <div className="hidden xl:block xl:col-span-1">
                <EventListCompact maxEvents={12} />
              </div>
              <div className="xl:col-span-3">
                <Calendar3D onEventSelect={(eventId) => {
                  const event = filteredEvents.find(e => e.id === eventId);
                  if (event) {
                    window.location.href = `/events/${event.slug}`;
                  }
                }} />
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid-dynamic">
              {filteredEvents.map((event, index) => (
                <div key={event.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <EventCard event={event} featured={index === 0} />
                </div>
              ))}
            </div>
          ) : (
            /* Vista de lista optimizada para móvil */
            <div className="space-y-4">
              {filteredEvents.map((event, index) => {
                const club = event.clubId ? clubs.find(c => c.id === event.clubId) : null;
                const eventDJs = event.djIds ? djs.filter(dj => event.djIds!.includes(dj.id)) : [];
                const eventDate = new Date(event.date);

                return (
                  <Link
                    key={event.id}
                    to={`/events/${event.slug}`}
                    className="block group animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="bg-gradient-to-br from-brand-surface/50 to-brand-surface-variant/50 backdrop-blur-md rounded-2xl border border-brand-orange/20 p-6 hover:border-brand-orange/40 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start gap-4">
                        {/* Fecha destacada */}
                        <div className="bg-gradient-to-br from-brand-orange to-brand-gold rounded-xl p-3 text-center flex-shrink-0">
                          <div className="text-xs font-bold text-brand-white opacity-90">
                            {eventDate.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase()}
                          </div>
                          <div className="text-2xl font-black text-brand-white leading-none">
                            {eventDate.getDate()}
                          </div>
                          <div className="text-xs font-bold text-brand-white opacity-90">
                            {eventDate.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()}
                          </div>
                        </div>

                        {/* Imagen del evento */}
                        {event.imageUrl && (
                          <img
                            src={event.imageUrl}
                            alt={event.name}
                            className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                          />
                        )}

                        {/* Información del evento */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-black text-brand-white text-lg md:text-xl mb-3 text-with-gradient-glow transition-all duration-300 leading-tight">
                            {event.name}
                          </h3>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-3 text-sm text-brand-white/90">
                              <span className="w-2 h-2 rounded-full bg-brand-orange inline-block flex-shrink-0"></span>
                              <span className="font-medium">{formatDate(eventDate)}</span>
                            </div>
                            
                            {club && (
                              <div className="flex items-center gap-3 text-sm text-brand-white/90">
                                <span className="w-2 h-2 rounded-full bg-brand-purple inline-block flex-shrink-0"></span>
                                <span className="font-medium">{club.name}</span>
                              </div>
                            )}
                            
                            {eventDJs.length > 0 && (
                              <div className="flex items-center gap-3 text-sm text-brand-white/90">
                                <span className="w-2 h-2 rounded-full bg-brand-gold inline-block flex-shrink-0"></span>
                                <span className="font-medium">
                                  {eventDJs.slice(0, 3).map(dj => dj.name).join(', ')}
                                  {eventDJs.length > 3 && ` +${eventDJs.length - 3} más`}
                                </span>
                              </div>
                            )}

                            {event.price && (
                              <div className="flex items-center gap-3 text-sm">
                                <span className="w-2 h-2 rounded-full bg-brand-orange inline-block flex-shrink-0"></span>
                                <span className="font-bold text-brand-orange">{event.price}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Flecha indicadora */}
                        <div className="flex-shrink-0 self-center">
                          <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center group-hover:bg-brand-orange/40 transition-colors duration-300">
                            <span className="text-brand-orange font-bold">→</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}

              {filteredEvents.length === 0 && (
                <div className="text-center py-20">
                  <SparklesIcon className="w-16 h-16 text-brand-white/30 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-brand-white mb-4">
                    No se encontraron eventos
                  </h3>
                  <p className="text-brand-gray">
                    Intenta ajustar los filtros de búsqueda
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default EventsPage; 