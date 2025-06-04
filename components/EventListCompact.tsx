import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { 
  CalendarDaysIcon,
  MapPinIcon,
  ClockIcon, 
  MusicalNoteIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import type { Event, Club, DJ } from '../types/supabase';

interface EventListCompactProps {
  maxEvents?: number;
}

const EventListCompact: React.FC<EventListCompactProps> = ({ maxEvents = 20 }) => {
  const { getIbizaEvents, clubs, djs } = useData();
  const events = getIbizaEvents();

  // Filtrar eventos futuros y ordenar por fecha
  const upcomingEvents = events
    .filter((event: Event) => new Date(event.date) >= new Date())
    .sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, maxEvents); // Usar maxEvents como límite

  if (upcomingEvents.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <MusicalNoteIcon className="w-20 h-20 text-brand-gray mx-auto mb-6" />
        <h3 className="text-xl font-bold text-brand-white mb-4">
          No hay eventos próximos
        </h3>
        <p className="text-brand-gray">
          Los eventos se cargarán pronto. ¡Mantente atento!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Header móvil */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-brand-orange/20 to-brand-purple/20 px-6 py-3 rounded-full border border-brand-orange/30 backdrop-blur-sm mb-4">
          <CalendarDaysIcon className="w-5 h-5 text-brand-orange" />
          <span className="text-brand-white font-bold text-sm tracking-wider">
            PRÓXIMOS EVENTOS
            </span>
        </div>
        <p className="text-brand-gray text-sm">
          {upcomingEvents.length} eventos próximos en Ibiza
        </p>
      </div>

      {/* Lista de eventos optimizada para móvil */}
      <div className="space-y-4">
        {upcomingEvents.map((event: Event, index: number) => {
          const club = event.clubId ? clubs.find((c: Club) => c.id === event.clubId) : null;
          const eventDJs = event.djIds ? djs.filter((dj: DJ) => event.djIds!.includes(dj.id)) : [];
            const eventDate = new Date(event.date);
          const isToday = eventDate.toDateString() === new Date().toDateString();
          const isTomorrow = eventDate.toDateString() === new Date(Date.now() + 86400000).toDateString();

            return (
              <Link
                key={event.id}
              to={`/events/${event.id}`}
              className="block animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`
                relative bg-gradient-to-r from-brand-surface/60 to-brand-surface-variant/60 
                rounded-2xl p-4 border backdrop-blur-sm transition-all duration-300
                hover:from-brand-surface/80 hover:to-brand-surface-variant/80
                hover:border-brand-orange/60 hover:shadow-lg
                ${isToday ? 'border-brand-gold shadow-lg shadow-brand-gold/20' : 'border-brand-surface/40'}
                ${isTomorrow ? 'border-brand-orange/60 shadow-md shadow-brand-orange/10' : ''}
              `}>
                {/* Badge de fecha especial */}
                {isToday && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-brand-gold to-brand-orange text-brand-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                    HOY
                  </div>
                )}
                {isTomorrow && !isToday && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-brand-orange to-brand-purple text-brand-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                    MAÑANA
                  </div>
                )}

                {/* Header del evento */}
                <div className="flex items-start gap-4 mb-3">
                  {/* Imagen del evento */}
                  <div className="relative flex-shrink-0">
                    {event.imageUrl ? (
                      <img
                        src={event.imageUrl}
                        alt={event.name}
                        className="w-16 h-16 object-cover rounded-xl border-2 border-brand-orange/30"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-brand-orange/30 to-brand-gold/30 rounded-xl border-2 border-brand-orange/30 flex items-center justify-center">
                        <MusicalNoteIcon className="w-8 h-8 text-brand-white" />
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-brand-orange to-brand-gold rounded-full border-2 border-brand-surface animate-pulse"></div>
                  </div>

                  {/* Información principal */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-brand-white text-lg leading-tight mb-1 truncate">
                      {event.name}
                    </h3>
                    {event.eventType && (
                      <div className="inline-block bg-gradient-to-r from-brand-orange/80 to-brand-gold/80 text-brand-white text-xs px-2 py-1 rounded-full font-bold tracking-wider mb-2">
                        {event.eventType}
                      </div>
                    )}
                  </div>
                </div>

                {/* Información detallada */}
                <div className="space-y-2">
                  {/* Fecha y hora */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-brand-orange/20 to-brand-gold/20 rounded-lg flex items-center justify-center">
                      <CalendarDaysIcon className="w-4 h-4 text-brand-orange" />
                    </div>
                    <div>
                      <div className="text-brand-white font-semibold text-sm">
                        {eventDate.toLocaleDateString('es-ES', { 
                          weekday: 'short',
                          day: 'numeric', 
                          month: 'short'
                        })}
                      </div>
                      <div className="text-brand-gray text-xs">
                        {event.time || '23:00'}
                      </div>
                    </div>
                  </div>

                  {/* Club */}
                  {club && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-brand-purple/20 to-brand-gold/20 rounded-lg flex items-center justify-center">
                        <MapPinIcon className="w-4 h-4 text-brand-purple" />
                      </div>
                      <div>
                        <div className="text-brand-white font-semibold text-sm">
                          {club.name}
                        </div>
                        {club.location && (
                          <div className="text-brand-gray text-xs">
                            {club.location}
                          </div>
                        )}
                      </div>
                          </div>
                        )}

                  {/* DJs */}
                  {eventDJs.length > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-brand-gold/20 to-brand-orange/20 rounded-lg flex items-center justify-center">
                        <UserGroupIcon className="w-4 h-4 text-brand-gold" />
                      </div>
                      <div>
                        <div className="text-brand-white font-semibold text-sm">
                          {eventDJs.length === 1 
                            ? eventDJs[0].name
                            : `${eventDJs[0].name} y ${eventDJs.length - 1} más`
                          }
                        </div>
                        <div className="text-brand-gray text-xs">
                          {eventDJs.length === 1 ? 'Artista principal' : `${eventDJs.length} artistas`}
                          </div>
                      </div>
                    </div>
                  )}

                  {/* Precio */}
                  {event.price && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-brand-green/20 to-brand-gold/20 rounded-lg flex items-center justify-center">
                        <span className="text-brand-green text-xs font-bold">€</span>
                      </div>
                      <div>
                        <div className="text-brand-white font-semibold text-sm">
                          {event.price}
                        </div>
                        <div className="text-brand-gray text-xs">
                          Precio entrada
                        </div>
                  </div>
                    </div>
                  )}
                </div>

                {/* Footer con acción */}
                <div className="mt-4 pt-3 border-t border-brand-surface/30 flex items-center justify-between">
                  <div className="text-brand-gray text-xs">
                    Toca para ver detalles
                  </div>
                  <div className="text-brand-orange text-sm font-bold">
                    Ver evento →
                  </div>
                </div>

                {/* Efectos visuales */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-orange/5 via-transparent to-brand-purple/5 rounded-2xl pointer-events-none"></div>
                </div>
              </Link>
            );
        })}
      </div>

      {/* Footer de la lista */}
      <div className="text-center mt-8 py-6">
          <Link
            to="/events"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-brand-orange to-brand-gold text-brand-white px-6 py-3 rounded-full font-bold text-sm tracking-wider hover:from-brand-purple hover:to-brand-orange transition-all duration-300 shadow-lg"
          >
          <span>VER TODOS LOS EVENTOS</span>
          <CalendarDaysIcon className="w-4 h-4" />
          </Link>
        </div>
    </div>
  );
};

export default EventListCompact; 