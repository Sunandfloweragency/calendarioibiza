import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CalendarEvent, FilterOptions } from '../types';
import { useData } from '../contexts/DataContext';
import { Event, Club, DJ } from '../types/supabase';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  CalendarDaysIcon, 
  ListBulletIcon,
  MapPinIcon,
  ClockIcon,
  MusicalNoteIcon
} from '@heroicons/react/24/outline';

interface EventCalendarProps {
  initialFilters?: FilterOptions;
}

const EventCalendar: React.FC<EventCalendarProps> = ({ initialFilters: _initialFilters }) => {
  const { getIbizaEvents, clubs, djs, loading } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mobileViewMode, setMobileViewMode] = useState<'list' | 'calendar'>('list');
  const [hoveredEvent, setHoveredEvent] = useState<CalendarEvent | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  
  // Mapa de meses en español
  const monthNames = {
    0: 'Enero', 1: 'Febrero', 2: 'Marzo', 3: 'Abril', 4: 'Mayo', 5: 'Junio',
    6: 'Julio', 7: 'Agosto', 8: 'Septiembre', 9: 'Octubre', 10: 'Noviembre', 11: 'Diciembre'
  };

  // Transformar eventos de Ibiza para el calendario
  const calendarEvents = useMemo((): CalendarEvent[] => {
    return getIbizaEvents()
      .map((event: Event) => ({
        id: event.id,
        title: event.name,
        start: new Date(event.date),
        slug: event.slug,
        imageUrl: event.imageUrl,
        clubName: event.clubId ? clubs.find((c: Club) => c.id === event.clubId)?.name : undefined,
        djName: event.djIds && event.djIds.length > 0 ? djs.filter((dj: DJ) => event.djIds!.includes(dj.id)).map((dj: DJ) => dj.name).join(', ') : undefined,
        category: event.eventType || 'Party'
      }));
  }, [getIbizaEvents, clubs, djs]);

  // Eventos filtrados y ordenados para la lista (solo eventos de Ibiza)
  const sortedEvents = useMemo(() => {
    return [...calendarEvents]
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .filter(event => {
        const eventDate = new Date(event.start);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return eventDate >= today;
      });
  }, [calendarEvents]);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const handlePrevMonth = () => {
    if (animating) return;
    setDirection('left');
    setAnimating(true);
    setTimeout(() => {
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
      setTimeout(() => {
        setAnimating(false);
        setDirection(null);
      }, 300);
    }, 300);
  };

  const handleNextMonth = () => {
    if (animating) return;
    setDirection('right');
    setAnimating(true);
    setTimeout(() => {
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
      setTimeout(() => {
        setAnimating(false);
        setDirection(null);
      }, 300);
    }, 300);
  };

  const handleEventHover = (event: CalendarEvent, e: React.MouseEvent) => {
    setHoveredEvent(event);
    const popupWidth = 300;
    const popupHeight = 180;
    let left = e.clientX + 20;
    let top = e.clientY + 20;
    if (left + popupWidth > window.innerWidth) {
      left = e.clientX - popupWidth - 20;
    }
    if (top + popupHeight > window.innerHeight) {
      top = e.clientY - popupHeight - 20;
    }
    setPopupPosition({ top, left });
  };

  const handleEventMouseOut = () => {
    setHoveredEvent(null);
    setPopupPosition(null);
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('es-ES', options);
  };

  // Renderizado del calendario
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const numDays = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    const blanks = Array(firstDay).fill(null);
    const daysArray = Array.from({ length: numDays }, (_, i) => i + 1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const animationClass = direction === 'left'
      ? 'animate-slide-out-right'
      : direction === 'right'
        ? 'animate-slide-out-left'
        : animating ? 'opacity-0' : 'animate-fade-in';

    return (
      <div className="bg-gradient-surface rounded-3xl border border-brand-orange/20 overflow-hidden shadow-main-card">
        {/* Header del calendario mejorado */}
        <div className="bg-gradient-orange p-6 flex items-center justify-between">
          <h3 className="text-2xl font-black text-brand-white">
            {monthNames[month as keyof typeof monthNames]} {year}
          </h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrevMonth}
              disabled={animating}
              className="p-3 rounded-xl text-brand-white hover:bg-brand-white/10 transition-colors duration-200 disabled:opacity-50"
              aria-label="Mes anterior"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button
              onClick={handleNextMonth}
              disabled={animating}
              className="p-3 rounded-xl text-brand-white hover:bg-brand-white/10 transition-colors duration-200 disabled:opacity-50"
              aria-label="Mes siguiente"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Calendario más grande */}
        <div className={`${animationClass} transition-all duration-500`}>
          <div className="grid grid-cols-7 gap-px bg-brand-surface-variant">
            {/* Días de la semana mejorados */}
            {['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'].map(day => (
              <div key={day} className="py-4 text-center font-bold text-brand-orange bg-brand-dark text-sm tracking-wider">
                {day}
              </div>
            ))}

            {/* Celdas vacías */}
            {blanks.map((_, i) => (
              <div key={`blank-${i}`} className="bg-brand-surface h-40 lg:h-48"></div>
            ))}

            {/* Días del mes más grandes */}
            {daysArray.map(day => {
              const dayDate = new Date(year, month, day);
              dayDate.setHours(0, 0, 0, 0);
              const dayEvents = calendarEvents.filter(event =>
                event.start.getFullYear() === year &&
                event.start.getMonth() === month &&
                event.start.getDate() === day
              );
              const isToday = today.getTime() === dayDate.getTime();
              const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6;

              return (
                <div
                  key={day}
                  className={`relative bg-brand-surface p-4 h-40 lg:h-48 overflow-y-auto hover:bg-brand-surface-variant/70 transition-colors duration-300 ${isWeekend ? 'bg-brand-surface-variant/30' : ''}`}
                >
                  {/* Número del día más grande */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`inline-block rounded-xl w-10 h-10 flex items-center justify-center text-lg font-bold ${isToday
                        ? 'bg-brand-orange text-brand-white shadow-orange-glow'
                        : 'text-brand-white/80'
                      }`}>
                      {day}
                    </span>
                  </div>

                  {/* Eventos del día mejorados */}
                  <div className="mt-16 space-y-2">
                    {dayEvents.slice(0, 4).map((event, index) => (
                      <div
                        key={event.id}
                        className={`text-sm p-3 rounded-xl cursor-pointer transition-all duration-300 ${index === 0
                            ? 'bg-brand-orange/90 text-brand-white shadow-sm'
                            : index === 1
                            ? 'bg-brand-purple/90 text-brand-white shadow-sm'
                            : index === 2
                            ? 'bg-brand-white/20 text-brand-white shadow-sm'
                            : 'bg-brand-white/10 text-brand-white shadow-sm'
                          }`}
                        onMouseEnter={(e) => handleEventHover(event, e)}
                        onMouseLeave={handleEventMouseOut}
                      >
                        <Link to={`/events/${event.slug}`} className="block">
                          <div className="font-bold truncate mb-1">{event.title}</div>
                          {event.clubName && (
                            <div className="text-xs opacity-90 truncate">{event.clubName}</div>
                          )}
                        </Link>
                      </div>
                    ))}

                    {/* Indicador de más eventos mejorado */}
                    {dayEvents.length > 4 && (
                      <div className="text-sm text-brand-orange text-center font-bold cursor-pointer bg-brand-orange/10 rounded-xl py-2 hover:bg-brand-orange/20 transition-colors duration-200">
                        +{dayEvents.length - 4} eventos más
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Renderizado de la lista de eventos
  const renderEventsList = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gradient mb-4">Próximos Eventos</h3>
        {sortedEvents.length > 0 ? (
          <div className="space-y-4 max-h-96 lg:max-h-[600px] overflow-y-auto custom-scrollbar">
            {sortedEvents.slice(0, 10).map((event: CalendarEvent) => {
              const originalEvent = getIbizaEvents().find((e: Event) => e.id === event.id);
              if (!originalEvent) return null;

              return (
                <Link
                  key={event.id}
                  to={`/events/${event.slug}`}
                  className="block card-3d bg-gradient-surface border border-brand-orange/20 rounded-lg p-4 hover-lift transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    {/* Imagen del evento */}
                    {event.imageUrl && (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    )}

                    {/* Información del evento */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-brand-white mb-2 truncate">{event.title}</h4>
                      
                      <div className="space-y-1 text-sm text-brand-white/80">
                        <div className="flex items-center space-x-2">
                          <ClockIcon className="w-4 h-4 text-brand-orange flex-shrink-0" />
                          <span>{formatDate(event.start)}</span>
                        </div>
                        
                        {event.clubName && (
                          <div className="flex items-center space-x-2">
                            <MapPinIcon className="w-4 h-4 text-brand-purple flex-shrink-0" />
                            <span className="truncate">{event.clubName}</span>
                          </div>
                        )}
                        
                        {event.djName && (
                          <div className="flex items-center space-x-2">
                            <MusicalNoteIcon className="w-4 h-4 text-brand-orange flex-shrink-0" />
                            <span className="truncate">{event.djName}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Fecha destacada */}
                    <div className="text-right flex-shrink-0">
                      <div className="bg-brand-orange rounded-lg p-2 text-center">
                        <div className="text-xs font-medium text-brand-white">
                          {event.start.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()}
                        </div>
                        <div className="text-lg font-bold text-brand-white">
                          {event.start.getDate()}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <CalendarDaysIcon className="w-16 h-16 text-brand-white/30 mx-auto mb-4" />
            <p className="text-brand-white/60">No hay eventos próximos</p>
          </div>
        )}
      </div>
    );
  };

  // Componente de carga
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="professional-loader mb-6"></div>
        <p className="text-brand-white/80 text-lg">Cargando eventos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Vista móvil */}
      <div className="lg:hidden">
        {/* Selector de vista móvil */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-brand-surface rounded-lg p-1 border border-brand-orange/20">
            <button
              onClick={() => setMobileViewMode('list')}
              className={`flex items-center px-4 py-2 rounded-md transition-all duration-300 ${mobileViewMode === 'list'
                  ? 'bg-brand-orange text-brand-white shadow-orange-glow'
                  : 'text-brand-white/70 hover:text-brand-white'
                }`}
            >
              <ListBulletIcon className="w-5 h-5 mr-2" />
              Lista
            </button>
            <button
              onClick={() => setMobileViewMode('calendar')}
              className={`flex items-center px-4 py-2 rounded-md transition-all duration-300 ${mobileViewMode === 'calendar'
                  ? 'bg-brand-orange text-brand-white shadow-orange-glow'
                  : 'text-brand-white/70 hover:text-brand-white'
                }`}
            >
              <CalendarDaysIcon className="w-5 h-5 mr-2" />
              Calendario
            </button>
          </div>
        </div>

        {/* Contenido móvil */}
        <div className="animate-fade-in">
          {mobileViewMode === 'list' ? renderEventsList() : renderCalendar()}
        </div>
      </div>

      {/* Vista de escritorio - Calendario a ancho completo */}
      <div className="hidden lg:block">
        {/* Lista de eventos compacta arriba */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gradient mb-4">Próximos Eventos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-64 overflow-y-auto custom-scrollbar">
            {sortedEvents.slice(0, 8).map((event: CalendarEvent) => {
              const originalEvent = getIbizaEvents().find((e: Event) => e.id === event.id);
              if (!originalEvent) return null;

              return (
                <Link
                  key={event.id}
                  to={`/events/${event.slug}`}
                  className="block card-3d bg-gradient-surface border border-brand-orange/20 rounded-xl p-3 hover-lift transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    {/* Imagen pequeña */}
                    {event.imageUrl && (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                      />
                    )}

                    {/* Información del evento */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-brand-white text-sm truncate">{event.title}</h4>
                      <div className="text-xs text-brand-white/80 truncate">
                        {formatDate(event.start)}
                      </div>
                      {event.clubName && (
                        <div className="text-xs text-brand-purple truncate">{event.clubName}</div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Calendario a ancho completo */}
        <div className="w-full">
          {renderCalendar()}
        </div>
      </div>

      {/* Popup de información de evento mejorado */}
      {hoveredEvent && popupPosition && (
        <div
          style={{ top: popupPosition.top, left: popupPosition.left }}
          className="fixed glass-effect backdrop-blur-2xl border-2 border-brand-orange/40 p-7 rounded-3xl shadow-2xl z-50 w-[420px] animate-fade-in"
        >
          {/* Fondo holográfico animado */}
          <div className="absolute inset-0 holographic rounded-3xl opacity-20 pointer-events-none"></div>
          
          <div className="relative z-10 flex items-start gap-5 mb-6">
            {hoveredEvent.imageUrl && (
              <div className="relative">
                <img
                  src={hoveredEvent.imageUrl}
                  alt={hoveredEvent.title}
                  className="w-28 h-28 object-cover rounded-2xl shadow-luxury border-2 border-brand-orange/40 flex-shrink-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 via-transparent to-transparent rounded-2xl"></div>
                
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-brand-orange/90 rounded-full flex items-center justify-center shadow-orange-glow">
                    <div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-b-2 border-t-transparent border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <h4 className="font-black text-brand-white mb-3 text-xl leading-tight tracking-wide">{hoveredEvent.title}</h4>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <div className="inline-block bg-gradient-to-r from-brand-orange via-brand-gold to-brand-orange text-brand-white text-xs px-4 py-2 rounded-full font-bold tracking-wider shadow-orange-glow animate-pulse-gentle">
                  ✨ {hoveredEvent.category || 'EVENTO ESPECIAL'} ✨
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 space-y-4 mb-6">
            {/* Fecha y hora */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-brand-surface/80 to-brand-surface-variant/80 rounded-2xl border border-brand-orange/30 hover:border-brand-orange/50 transition-all duration-300">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-brand-orange to-brand-gold shadow-orange-glow animate-pulse"></div>
              <div className="flex-1">
                <div className="text-xs font-black text-brand-orange tracking-wider uppercase">📅 Fecha y Hora</div>
                <div className="text-brand-white font-bold text-lg">{formatDate(hoveredEvent.start)}</div>
              </div>
            </div>
            
            {hoveredEvent.clubName && (
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-brand-surface/80 to-brand-surface-variant/80 rounded-2xl border border-brand-purple/30 hover:border-brand-purple/50 transition-all duration-300">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-brand-purple to-brand-orange shadow-purple-glow animate-pulse"></div>
                <div className="flex-1">
                  <div className="text-xs font-black text-brand-purple tracking-wider uppercase">🏛️ Club / Venue</div>
                  <div className="text-brand-white font-bold text-lg">{hoveredEvent.clubName}</div>
                </div>
              </div>
            )}
            
            {hoveredEvent.djName && (
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-brand-surface/80 to-brand-surface-variant/80 rounded-2xl border border-brand-gold/30 hover:border-brand-gold/50 transition-all duration-300">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-brand-gold to-brand-orange shadow-neon-glow animate-pulse"></div>
                <div className="flex-1">
                  <div className="text-xs font-black text-brand-gold tracking-wider uppercase">🎧 Artistas Principales</div>
                  <div className="text-brand-white font-bold text-lg">{hoveredEvent.djName}</div>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative z-10 pt-6 border-t border-brand-orange/30">
            <Link
              to={`/events/${hoveredEvent.slug}`}
              className="block w-full relative overflow-hidden bg-gradient-to-r from-brand-orange via-brand-gold to-brand-purple text-brand-white text-sm py-4 px-6 rounded-2xl font-black tracking-wider transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-orange-glow group border border-brand-orange/50 text-center"
            >
              {/* Efecto de brillo animado */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer"></div>
              
              <span className="relative z-10 flex items-center justify-center gap-3">
                🎵 VER EVENTO COMPLETO 🎵
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <div className="w-0 h-0 border-l-3 border-l-white border-t-2 border-b-2 border-t-transparent border-b-transparent ml-0.5"></div>
                </div>
              </span>
            </Link>
            
            {/* Info adicional */}
            <div className="mt-4 text-center text-xs text-brand-gray">
              💡 Haz clic para ver toda la información del evento
            </div>
          </div>

          {/* Efectos visuales modernos */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-orange/5 via-transparent to-brand-purple/5 rounded-3xl pointer-events-none"></div>
          
          {/* Borde brillante animado */}
          <div className="absolute -top-1 -left-1 -right-1 -bottom-1 bg-gradient-to-r from-brand-orange/50 via-brand-gold/50 to-brand-purple/50 rounded-3xl blur-sm -z-10 animate-pulse-gentle"></div>
          
          {/* Partículas flotantes */}
          <div className="absolute top-2 right-2 w-2 h-2 bg-brand-gold rounded-full animate-float opacity-60"></div>
          <div className="absolute bottom-4 left-4 w-1 h-1 bg-brand-orange rounded-full animate-bounce-gentle opacity-40" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-6 w-1.5 h-1.5 bg-brand-purple rounded-full animate-pulse opacity-50" style={{ animationDelay: '0.5s' }}></div>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;