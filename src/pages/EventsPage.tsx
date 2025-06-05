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
  MagnifyingGlassIcon,
  ClockIcon,
  MapPinIcon,
  MusicalNoteIcon
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
            /* Vista de lista espectacular */
            <div className="space-y-6">
              {filteredEvents.map((event, index) => {
                const club = event.clubId ? clubs.find(c => c.id === event.clubId) : null;
                const eventDJs = event.djIds ? djs.filter(dj => event.djIds!.includes(dj.id)) : [];
                const eventDate = new Date(event.date);
                const isToday = eventDate.toDateString() === new Date().toDateString();
                const isTomorrow = eventDate.toDateString() === new Date(Date.now() + 86400000).toDateString();

                return (
                  <Link
                    key={event.id}
                    to={`/events/${event.slug}`}
                    className="block group animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`relative bg-gradient-to-br from-brand-surface/60 to-brand-surface-variant/60 backdrop-blur-md rounded-3xl border-2 p-8 hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2 ${
                      isToday ? 'border-brand-gold shadow-2xl shadow-brand-gold/30 animate-pulse' : 
                      isTomorrow ? 'border-brand-orange shadow-xl shadow-brand-orange/20' : 
                      'border-brand-orange/30 hover:border-brand-orange/60'
                    }`}>
                      
                      {/* Efectos de fondo */}
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 via-transparent to-brand-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-gold/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-3xl"></div>
                      
                      {/* Badge especial para eventos de hoy/mañana */}
                      {isToday && (
                        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-brand-gold to-brand-orange text-brand-white text-sm px-4 py-2 rounded-full font-black shadow-lg animate-bounce border-2 border-brand-white/20">
                          🔥 HOY 🔥
                        </div>
                      )}
                      {isTomorrow && !isToday && (
                        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-brand-orange to-brand-purple text-brand-white text-sm px-4 py-2 rounded-full font-black shadow-lg animate-pulse border-2 border-brand-white/20">
                          ⭐ MAÑANA ⭐
                        </div>
                      )}

                      <div className="relative flex items-start gap-6">
                        {/* Fecha destacada mejorada */}
                        <div className="flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300">
                          <div className="bg-gradient-to-br from-brand-orange via-brand-gold to-brand-purple rounded-2xl p-5 text-center shadow-2xl border-2 border-brand-white/20 relative overflow-hidden">
                            {/* Efecto brillante */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            <div className="relative">
                              <div className="text-xs font-black text-brand-white opacity-90 mb-1">
                                {eventDate.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase()}
                              </div>
                              <div className="text-3xl font-black text-brand-white leading-none mb-1">
                                {eventDate.getDate()}
                              </div>
                              <div className="text-xs font-black text-brand-white opacity-90">
                                {eventDate.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Imagen del evento mejorada */}
                        <div className="flex-shrink-0 relative transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                          {event.imageUrl ? (
                            <div className="relative">
                              <img
                                src={event.imageUrl}
                                alt={event.name}
                                className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-2xl shadow-xl border-2 border-brand-orange/30"
                              />
                              <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/20 via-transparent to-brand-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                            </div>
                          ) : (
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-brand-orange/40 to-brand-gold/40 rounded-2xl shadow-xl border-2 border-brand-orange/30 flex items-center justify-center">
                              <MusicalNoteIcon className="w-12 h-12 text-brand-white" />
                            </div>
                          )}
                        </div>

                        {/* Información del evento mejorada */}
                        <div className="flex-1 min-w-0 relative">
                          <h3 className="font-black text-brand-white text-2xl md:text-3xl mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-brand-gold group-hover:via-brand-orange group-hover:to-brand-purple group-hover:bg-clip-text transition-all duration-500 leading-tight">
                            {event.name}
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Información básica */}
                            <div className="space-y-3">
                              <div className="flex items-center gap-3 bg-brand-black/30 backdrop-blur-sm rounded-full px-4 py-2">
                                <div className="w-6 h-6 bg-gradient-to-r from-brand-orange to-brand-gold rounded-full flex items-center justify-center">
                                  <ClockIcon className="w-4 h-4 text-brand-white" />
                                </div>
                                <span className="font-bold text-brand-white">{formatDate(eventDate)}</span>
                              </div>
                              
                              {club && (
                                <div className="flex items-center gap-3 bg-brand-black/30 backdrop-blur-sm rounded-full px-4 py-2">
                                  <div className="w-6 h-6 bg-gradient-to-r from-brand-purple to-brand-orange rounded-full flex items-center justify-center">
                                    <MapPinIcon className="w-4 h-4 text-brand-white" />
                                  </div>
                                  <span className="font-bold text-brand-white">{club.name}</span>
                                </div>
                              )}
                            </div>

                            {/* Información adicional */}
                            <div className="space-y-3">
                              {eventDJs.length > 0 && (
                                <div className="flex items-center gap-3 bg-brand-black/30 backdrop-blur-sm rounded-full px-4 py-2">
                                  <div className="w-6 h-6 bg-gradient-to-r from-brand-gold to-brand-purple rounded-full flex items-center justify-center">
                                    <MusicalNoteIcon className="w-4 h-4 text-brand-white" />
                                  </div>
                                  <span className="font-bold text-brand-white truncate">
                                    {eventDJs.slice(0, 2).map(dj => dj.name).join(', ')}
                                    {eventDJs.length > 2 && ` +${eventDJs.length - 2} más`}
                                  </span>
                                </div>
                              )}

                              {event.price && (
                                <div className="flex items-center gap-3 bg-brand-black/30 backdrop-blur-sm rounded-full px-4 py-2">
                                  <div className="w-6 h-6 bg-gradient-to-r from-brand-green to-brand-gold rounded-full flex items-center justify-center">
                                    <span className="text-brand-white text-xs font-black">€</span>
                                  </div>
                                  <span className="font-black text-brand-orange">{event.price}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Flecha indicadora mejorada */}
                        <div className="flex-shrink-0 self-center">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-brand-orange/30 to-brand-gold/30 flex items-center justify-center group-hover:from-brand-orange group-hover:to-brand-gold transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-12 border-2 border-brand-white/20">
                            <span className="text-2xl font-black text-brand-white group-hover:animate-bounce">→</span>
                          </div>
                        </div>
                      </div>

                      {/* Efectos adicionales */}
                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-brand-gold/40 rounded-3xl transition-all duration-500 pointer-events-none"></div>
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