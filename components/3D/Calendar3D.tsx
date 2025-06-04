import React, { useState, useRef, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { ChevronLeftIcon, ChevronRightIcon, SparklesIcon } from '@heroicons/react/24/outline';
import HolographicCard from './HolographicCard';
import NeonButton from './NeonButton';
import FloatingElements from './FloatingElements';
import type { Event, Club, DJ } from '../../types/supabase';

interface Calendar3DProps {
  onEventSelect?: (eventId: string) => void;
}

const Calendar3D: React.FC<Calendar3DProps> = ({ onEventSelect }) => {
  const { getIbizaEvents, clubs, djs } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dayTooltip, setDayTooltip] = useState<{ day: number; position: { top: number; left: number } } | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

  // Obtener eventos del mes actual
  const monthEvents = useMemo(() => {
    const events = getIbizaEvents();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    return events.filter((event: Event) => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });
  }, [getIbizaEvents, currentDate]);

  // Obtener todos los eventos próximos para la lista lateral
  const upcomingEvents = useMemo(() => {
    const events = getIbizaEvents();
    return events
      .filter((event: Event) => new Date(event.date) >= new Date())
      .sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 15); // Límite para la lista lateral
  }, [getIbizaEvents]);

  // Generar días del mes
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Lunes = 0

    const days = [];
    
    // Días vacíos del mes anterior
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = monthEvents.filter((event: Event) => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === day;
      });
      
      days.push({
        day,
        events: dayEvents,
        isToday: isToday(new Date(year, month, day)),
        isWeekend: isWeekend(new Date(year, month, day))
      });
    }
    
    return days;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const handlePrevMonth = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
      setIsAnimating(false);
    }, 200);
  };

  const handleNextMonth = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
      setIsAnimating(false);
    }, 200);
  };

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    
    const dayEvents = monthEvents.filter((event: Event) => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day;
    });
    
    if (dayEvents.length > 0 && onEventSelect) {
      onEventSelect(dayEvents[0].id);
    }
  };

  // Tooltip moderno optimizado - SIN movimiento del calendario
  const handleEventHover = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    setHoveredEvent(event);
    
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const popupWidth = 380;
    const popupHeight = 250;
    
    // Posición inteligente que no hace mover el calendario
    let left = rect.left + rect.width + 15;
    let top = rect.top + (rect.height / 2) - (popupHeight / 2);
    
    // Ajustar si se sale de la pantalla por la derecha
    if (left + popupWidth > window.innerWidth - 20) {
      left = rect.left - popupWidth - 15;
    }
    
    // Ajustar si se sale por arriba
    if (top < 20) {
      top = 20;
    }
    
    // Ajustar si se sale por abajo
    if (top + popupHeight > window.innerHeight - 20) {
      top = window.innerHeight - popupHeight - 20;
    }
    
    setPopupPosition({ top, left });
  };

  const handleEventMouseOut = () => {
    setHoveredEvent(null);
    setPopupPosition(null);
  };

  const handleDayHover = (day: number, e: React.MouseEvent, hasEvents: boolean) => {
    setHoveredDay(day);
    
    // Solo mostrar tooltip para días sin eventos
    if (!hasEvents) {
      const rect = e.currentTarget.getBoundingClientRect();
      setDayTooltip({
        day,
        position: {
          top: rect.top - 50,
          left: rect.left + rect.width / 2
        }
      });
    }
  };

  const handleDayMouseOut = () => {
    setHoveredDay(null);
    setDayTooltip(null);
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="relative">
      <FloatingElements count={15} speed={0.5} />
      
      {/* Título del mes MUY prominente - COLOR BLANCO */}
      <div className="text-center mb-12">
        <h1 className="text-8xl md:text-9xl font-black text-white tracking-wider mb-4 drop-shadow-2xl">
          {monthNames[currentDate.getMonth()].toUpperCase()}
        </h1>
        <div className="text-4xl md:text-5xl font-bold text-brand-gold/90 tracking-[0.5em] mb-2">
          {currentDate.getFullYear()}
        </div>
        {/* Indicador de mes actual */}
        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-brand-orange/20 to-brand-purple/20 px-6 py-3 rounded-full border border-brand-orange/30 backdrop-blur-sm">
          <SparklesIcon className="w-6 h-6 text-brand-gold animate-pulse" />
          <span className="text-brand-white font-bold text-lg">
            MES ACTUAL EN IBIZA CALENDAR
          </span>
          <SparklesIcon className="w-6 h-6 text-brand-gold animate-pulse" />
        </div>
      </div>

      {/* Layout Desktop: Lista lateral + Calendario */}
      <div className="flex gap-8 max-w-7xl mx-auto">
        
        {/* LISTA LATERAL - Solo en desktop */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <HolographicCard className="p-6 h-fit sticky top-6" intensity={1.1}>
            <div className="flex items-center gap-3 mb-6">
              <SparklesIcon className="w-6 h-6 text-brand-orange animate-pulse" />
              <h3 className="text-xl font-black text-brand-white">PRÓXIMOS EVENTOS</h3>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              {upcomingEvents.map((event: Event, index: number) => {
                const club = event.clubId ? clubs.find((c: Club) => c.id === event.clubId) : null;
                const eventDJs = event.djIds ? djs.filter((dj: DJ) => event.djIds!.includes(dj.id)) : [];
                const eventDate = new Date(event.date);
                const isToday = eventDate.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={event.id}
                    className={`
                      relative p-3 rounded-xl cursor-pointer transition-all duration-300 group
                      ${isToday ? 'bg-gradient-to-r from-brand-gold/20 to-brand-orange/20 border border-brand-gold/40' : 'bg-brand-surface/30 hover:bg-brand-surface/50 border border-brand-surface/30 hover:border-brand-orange/40'}
                    `}
                    onClick={() => onEventSelect?.(event.id)}
                    onMouseEnter={(e) => handleEventHover(event, e)}
                    onMouseLeave={handleEventMouseOut}
                  >
                    {isToday && (
                      <div className="absolute -top-1 -right-1 bg-gradient-to-r from-brand-gold to-brand-orange text-brand-white text-xs px-2 py-1 rounded-full font-bold">
                        HOY
                      </div>
                    )}
                    
                    <div className="flex items-start gap-3">
                      {/* Fecha compacta */}
                      <div className="bg-gradient-to-br from-brand-orange to-brand-gold rounded-lg p-2 text-center flex-shrink-0 min-w-[45px]">
                        <div className="text-xs font-bold text-brand-white">
                          {eventDate.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()}
                        </div>
                        <div className="text-lg font-black text-brand-white leading-none">
                          {eventDate.getDate()}
                        </div>
                      </div>

                      {/* Info del evento */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-brand-white text-sm mb-1 truncate group-hover:text-brand-orange transition-colors">
                          {event.name}
                        </h4>
                        
                        {club && (
                          <div className="text-xs text-brand-gray mb-1 truncate">
                            📍 {club.name}
                          </div>
                        )}
                        
                        {eventDJs.length > 0 && (
                          <div className="text-xs text-brand-gold truncate">
                            🎵 {eventDJs[0].name}
                            {eventDJs.length > 1 && ` +${eventDJs.length - 1}`}
                          </div>
                        )}
                        
                        <div className="text-xs text-brand-orange font-semibold mt-1">
                          {event.time || '23:00'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </HolographicCard>
        </div>

        {/* CALENDARIO PRINCIPAL */}
        <div className="flex-1">
          <HolographicCard className="p-8" intensity={1.2}>
            {/* Header del calendario con botones mejorados */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-6">
                {/* Botones de navegación MEJORADOS */}
                <div className="flex items-center space-x-4">
                  <NeonButton
                    variant="secondary"
                    size="lg"
                    onClick={handlePrevMonth}
                    disabled={isAnimating}
                    className="!px-6 !py-4 transition-all duration-300 hover:scale-105 shadow-lg"
                    glowIntensity={1.5}
                  >
                    <ChevronLeftIcon className="w-6 h-6 mr-2" />
                    <div className="text-left">
                      <div className="text-sm font-bold">ANTERIOR</div>
                      <div className="text-xs text-brand-gray">
                        {monthNames[currentDate.getMonth() - 1 < 0 ? 11 : currentDate.getMonth() - 1]}
                      </div>
                    </div>
                  </NeonButton>
                  
                  <NeonButton
                    variant="accent"
                    size="lg"
                    onClick={handleNextMonth}
                    disabled={isAnimating}
                    className="!px-6 !py-4 transition-all duration-300 hover:scale-105 shadow-lg"
                    glowIntensity={1.5}
                  >
                    <div className="text-right mr-2">
                      <div className="text-sm font-bold">SIGUIENTE</div>
                      <div className="text-xs text-brand-gray">
                        {monthNames[currentDate.getMonth() + 1 > 11 ? 0 : currentDate.getMonth() + 1]}
                      </div>
                    </div>
                    <ChevronRightIcon className="w-6 h-6" />
                  </NeonButton>
                </div>
              </div>
              
              {/* Estadísticas del mes */}
              <div className="text-right">
                <div className="text-sm text-brand-gray mb-1">EVENTOS ESTE MES</div>
                <div className="text-4xl font-black text-brand-orange">
                  {monthEvents.length}
                </div>
                <div className="text-xs text-brand-gold">
                  {monthEvents.filter(e => new Date(e.date) >= new Date()).length} próximos
                </div>
              </div>
            </div>

            {/* Días de la semana */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {dayNames.map(day => (
                <div
                  key={day}
                  className="text-center py-4 text-brand-gold font-bold text-lg tracking-wider"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Grid del calendario - SIN efectos de movimiento */}
            <div 
              ref={calendarRef}
              className={`grid grid-cols-7 gap-2 transition-opacity duration-300 ${
                isAnimating ? 'opacity-50' : 'opacity-100'
              }`}
            >
              {calendarDays.map((dayData, index) => {
                if (!dayData) {
                  return <div key={`empty-${index}`} className="h-28" />;
                }

                const { day, events, isToday: isDayToday, isWeekend: isDayWeekend } = dayData;
                const isSelected = selectedDate?.getDate() === day;
                const isHovered = hoveredDay === day;
                const hasEvents = events.length > 0;

                return (
                  <div
                    key={day}
                    className={`
                      relative h-28 rounded-xl cursor-pointer transition-all duration-200 group
                      ${isDayToday ? 'bg-gradient-to-br from-brand-gold/30 to-brand-orange/30 border-2 border-brand-gold' : ''}
                      ${isSelected ? 'bg-gradient-to-br from-brand-purple/40 to-brand-orange/40' : ''}
                      ${isDayWeekend ? 'bg-brand-surface/50' : 'bg-brand-surface/30'}
                      ${isHovered ? 'shadow-lg bg-brand-surface/60' : ''} 
                      ${hasEvents ? 'border border-brand-orange/50 bg-gradient-to-br from-brand-orange/10 to-brand-gold/10' : 'border border-brand-surface/30'}
                      hover:shadow-lg backdrop-blur-sm overflow-hidden
                    `}
                    onClick={() => handleDayClick(day)}
                    onMouseEnter={(e) => handleDayHover(day, e, hasEvents)}
                    onMouseLeave={handleDayMouseOut}
                    style={{
                      boxShadow: hasEvents 
                        ? '0 0 20px rgba(255, 144, 0, 0.3), inset 0 0 20px rgba(221, 169, 93, 0.1)'
                        : undefined
                    }}
                    title={hasEvents ? `${events.length} evento${events.length > 1 ? 's' : ''} - ${events[0]?.name}` : `${day} de ${monthNames[currentDate.getMonth()]}`}
                  >
                    {/* Número del día */}
                    <div className={`
                      absolute top-2 left-2 text-lg font-bold
                      ${isDayToday ? 'text-brand-white' : 'text-brand-gray'}
                      ${isSelected ? 'text-brand-white' : ''}
                      ${hasEvents ? 'text-brand-orange' : ''}
                    `}>
                      {day}
                    </div>

                    {/* Información de eventos mejorada */}
                    {hasEvents && (
                      <div className="absolute bottom-1 left-1 right-1">
                        <div className="space-y-1">
                          {events.slice(0, 2).map((event: Event, eventIndex: number) => {
                            const club = event.clubId ? clubs.find((c: Club) => c.id === event.clubId) : null;
                            const eventName = event.name.length > 15 ? event.name.substring(0, 15) + '...' : event.name;
                            return (
                              <div
                                key={event.id}
                                className="bg-gradient-to-r from-brand-orange/80 to-brand-gold/80 rounded-md px-2 py-1 cursor-pointer hover:from-brand-orange hover:to-brand-gold transition-all duration-200 backdrop-blur-sm"
                                style={{
                                  animationDelay: `${eventIndex * 0.2}s`
                                }}
                                onMouseEnter={(e) => handleEventHover(event, e)}
                                onMouseLeave={handleEventMouseOut}
                              >
                                <div className="text-xs font-bold text-brand-white truncate">
                                  {eventName}
                                </div>
                                {club && (
                                  <div className="text-xs text-brand-white/80 truncate">
                                    {club.name}
                                  </div>
                                )}
                                <div className="text-xs text-brand-white/90 font-semibold">
                                  {event.time || '23:00'}
                                </div>
                              </div>
                            );
                          })}
                          {events.length > 2 && (
                            <div className="text-xs text-brand-orange font-bold text-center bg-brand-surface/80 rounded px-1 py-0.5">
                              +{events.length - 2} más eventos
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Indicador visual adicional para días con eventos */}
                    {hasEvents && (
                      <div className="absolute top-1 right-1">
                        <div className="w-3 h-3 bg-gradient-to-br from-brand-orange to-brand-gold rounded-full animate-pulse shadow-lg">
                          <div className="absolute inset-0 bg-gradient-to-br from-brand-orange to-brand-gold rounded-full animate-ping opacity-75"></div>
                        </div>
                      </div>
                    )}

                    {/* Efecto de brillo en hover - SIN escalado */}
                    {isHovered && (
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/20 via-transparent to-brand-orange/20 rounded-xl" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Información del día seleccionado */}
            {selectedDate && (
              <div className="mt-8 p-6 bg-gradient-to-r from-brand-surface/50 to-brand-surface-variant/50 rounded-2xl border border-brand-orange/30 backdrop-blur-md">
                <h3 className="text-xl font-bold text-brand-gold mb-4">
                  Eventos del {selectedDate.getDate()} de {monthNames[selectedDate.getMonth()]}
                </h3>
                
                {monthEvents
                  .filter((event: Event) => new Date(event.date).getDate() === selectedDate.getDate())
                  .map((event: Event) => {
                    const club = event.clubId ? clubs.find((c: Club) => c.id === event.clubId) : null;
                    const eventDJs = event.djIds ? djs.filter((dj: DJ) => event.djIds!.includes(dj.id)) : [];
                    
                    return (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-4 bg-brand-surface/30 rounded-xl mb-3 hover:bg-brand-surface/50 transition-colors cursor-pointer"
                        onClick={() => onEventSelect?.(event.id)}
                      >
                        <div>
                          <h4 className="font-bold text-brand-white">{event.name}</h4>
                          <p className="text-brand-gray text-sm">
                            {club?.name} • {eventDJs.map((dj: DJ) => dj.name).join(', ')}
                          </p>
                        </div>
                        <div className="text-brand-orange font-bold">
                          {event.time || '23:00'}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </HolographicCard>
        </div>
      </div>

      {/* TOOLTIP MODERNO MEJORADO - Posición fija, sin mover calendario */}
      {hoveredEvent && popupPosition && (
        <div
          style={{ 
            position: 'fixed',
            top: popupPosition.top, 
            left: popupPosition.left,
            zIndex: 2000,
            maxWidth: '420px',
            boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 144, 0, 0.3), 0 0 30px rgba(255, 144, 0, 0.2)'
          }}
          className="glass-effect rounded-3xl border-2 border-brand-orange/40 p-7 shadow-2xl animate-fade-in backdrop-blur-2xl"
          onMouseEnter={() => {/* Mantener tooltip visible */}}
          onMouseLeave={handleEventMouseOut}
        >
          {/* Fondo holográfico animado */}
          <div className="absolute inset-0 holographic rounded-3xl opacity-20 pointer-events-none"></div>
          
          {/* Header moderno con imagen y título */}
          <div className="relative z-10 flex items-start gap-5 mb-6">
            {hoveredEvent.imageUrl && (
              <div className="relative">
                <img
                  src={hoveredEvent.imageUrl}
                  alt={hoveredEvent.name}
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
              <h4 className="font-black text-brand-white mb-3 text-xl leading-tight tracking-wide">
                {hoveredEvent.name}
              </h4>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <div className="inline-block bg-gradient-to-r from-brand-orange via-brand-gold to-brand-orange text-brand-white text-xs px-4 py-2 rounded-full font-bold tracking-wider shadow-orange-glow animate-pulse-gentle">
                  ✨ {hoveredEvent.eventType || 'EVENTO ESPECIAL'} ✨
                </div>
                
                {hoveredEvent.price && (
                  <div className="inline-block bg-gradient-to-r from-green-500 to-emerald-400 text-white text-xs px-3 py-2 rounded-full font-bold shadow-lg">
                    💰 {hoveredEvent.price}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Información detallada con iconos modernos */}
          <div className="relative z-10 space-y-4 mb-6">
            {/* Fecha y hora */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-brand-surface/80 to-brand-surface-variant/80 rounded-2xl border border-brand-orange/30 hover:border-brand-orange/50 transition-all duration-300">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-brand-orange to-brand-gold shadow-orange-glow animate-pulse"></div>
              <div className="flex-1">
                <div className="text-xs font-black text-brand-orange tracking-wider uppercase">📅 Fecha y Hora</div>
                <div className="text-brand-white font-bold text-lg">
                  {new Date(hoveredEvent.date).toLocaleDateString('es-ES', { 
                    weekday: 'long',
                    day: 'numeric', 
                    month: 'long'
                  })} • {hoveredEvent.time || '23:00'}
                </div>
              </div>
            </div>

            {/* Club/Venue */}
            {hoveredEvent.clubId && clubs.find((c: Club) => c.id === hoveredEvent.clubId) && (
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-brand-surface/80 to-brand-surface-variant/80 rounded-2xl border border-brand-purple/30 hover:border-brand-purple/50 transition-all duration-300">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-brand-purple to-brand-orange shadow-purple-glow animate-pulse"></div>
                <div className="flex-1">
                  <div className="text-xs font-black text-brand-purple tracking-wider uppercase">🏛️ Club / Venue</div>
                  <div className="text-brand-white font-bold text-lg">
                    {clubs.find((c: Club) => c.id === hoveredEvent.clubId)?.name}
                  </div>
                </div>
              </div>
            )}

            {/* Artistas/DJs */}
            {hoveredEvent.djIds && hoveredEvent.djIds.length > 0 && (
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-brand-surface/80 to-brand-surface-variant/80 rounded-2xl border border-brand-gold/30 hover:border-brand-gold/50 transition-all duration-300">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-brand-gold to-brand-orange shadow-neon-glow animate-pulse"></div>
                <div className="flex-1">
                  <div className="text-xs font-black text-brand-gold tracking-wider uppercase">🎧 Artistas Principales</div>
                  <div className="text-brand-white font-bold text-lg">
                    {djs.filter((dj: DJ) => hoveredEvent.djIds?.includes(dj.id)).map((dj: DJ) => dj.name).join(' • ')}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Sección de acción mejorada */}
          <div className="relative z-10 pt-6 border-t border-brand-orange/30">
            <button
              onClick={() => {
                onEventSelect?.(hoveredEvent.id);
                handleEventMouseOut();
              }}
              className="w-full relative overflow-hidden bg-gradient-to-r from-brand-orange via-brand-gold to-brand-purple text-brand-white text-sm py-4 px-6 rounded-2xl font-black tracking-wider transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-orange-glow group border border-brand-orange/50"
            >
              {/* Efecto de brillo animado */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer"></div>
              
              <span className="relative z-10 flex items-center justify-center gap-3">
                🎵 VER DETALLES COMPLETOS 🎵
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <div className="w-0 h-0 border-l-3 border-l-white border-t-2 border-b-2 border-t-transparent border-b-transparent ml-0.5"></div>
                </div>
              </span>
            </button>
            
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

      {/* Tooltip simple para días sin eventos */}
      {dayTooltip && (
        <div
          style={{
            position: 'fixed',
            top: dayTooltip.position.top,
            left: dayTooltip.position.left,
            transform: 'translateX(-50%)',
            zIndex: 1500
          }}
          className="bg-gradient-to-r from-brand-surface/95 to-brand-surface-variant/95 backdrop-blur-md border border-brand-orange/40 px-4 py-3 rounded-xl shadow-lg animate-fade-in"
        >
          <div className="text-sm font-bold text-brand-white text-center">
            {dayTooltip.day} de {monthNames[currentDate.getMonth()]}
          </div>
          <div className="text-xs text-brand-gray text-center">
            {currentDate.getFullYear()} • Sin eventos
          </div>
          {/* Flecha hacia abajo */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-brand-surface"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar3D; 