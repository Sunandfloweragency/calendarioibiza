import React from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../types/supabase';
import { useData } from '../contexts/DataContext';
import HolographicCard from './3D/HolographicCard';
import NeonButton from './3D/NeonButton';
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  MapPinIcon, 
  MusicalNoteIcon,
  UserGroupIcon,
  TicketIcon,
  SparklesIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface EventCardProps {
  event: Event;
  featured?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, featured = false }) => {
  const { clubs, djs, promoters } = useData();
  
  // Obtener información relacionada
  const club = event.clubId ? clubs.find(c => c.id === event.clubId) : null;
  const eventDJs = event.djIds ? djs.filter(dj => event.djIds!.includes(dj.id)) : [];
  const promoter = event.promoterId ? promoters.find(p => p.id === event.promoterId) : null;
  
  // Formatear fecha
  const eventDate = new Date(event.date);
  const dayOfWeek = eventDate.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase();
  const day = eventDate.getDate().toString().padStart(2, '0');
  const month = eventDate.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase();
  
  // Formatear hora
  const eventTime = event.time || '23:00';

  // Verificar si es hoy o mañana
  const isToday = eventDate.toDateString() === new Date().toDateString();
  const isTomorrow = eventDate.toDateString() === new Date(Date.now() + 86400000).toDateString();

  return (
    <div className={`relative group ${featured ? 'lg:col-span-2 lg:row-span-2' : ''}`}>
      <HolographicCard 
        className="h-full overflow-hidden"
        intensity={featured ? 1.8 : 1.2}
      >
        <Link 
          to={`/events/${event.slug}`}
          className="block h-full"
        >
          {/* Imagen de fondo con efectos mejorados */}
          <div className={`relative overflow-hidden ${featured ? 'h-96 lg:h-full' : 'h-80'}`}>
            <img 
              src={event.imageUrl || `https://picsum.photos/seed/${event.slug}/800/600`}
              alt={event.name} 
              className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-125 group-hover:rotate-2"
            />
            
            {/* Múltiples overlays para efectos dramáticos */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/95 via-brand-black/60 to-brand-black/30"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/20 via-transparent to-brand-purple/20 opacity-0 group-hover:opacity-60 transition-opacity duration-700"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-gold/10 via-transparent to-brand-orange/10 opacity-0 group-hover:opacity-80 transition-opacity duration-1000"></div>
            
            {/* Efectos de partículas flotantes */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
              <div className="absolute top-10 left-10 w-2 h-2 bg-brand-gold rounded-full animate-pulse"></div>
              <div className="absolute top-20 right-20 w-1 h-1 bg-brand-orange rounded-full animate-ping"></div>
              <div className="absolute bottom-20 left-20 w-3 h-3 bg-brand-purple rounded-full animate-bounce"></div>
            </div>

            {/* Badge de fecha mejorado */}
            <div className="absolute top-6 left-6 transform group-hover:scale-110 transition-transform duration-300">
              <div className={`relative bg-gradient-to-br from-brand-orange to-brand-gold rounded-3xl px-5 py-4 shadow-2xl border-2 ${
                isToday ? 'border-brand-gold animate-pulse shadow-brand-gold/50' : 
                isTomorrow ? 'border-brand-orange shadow-brand-orange/30' : 'border-brand-white/20'
              }`}>
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-3xl"></div>
                
                <div className="relative text-center">
                  <div className="text-xs font-black text-brand-white opacity-90">
                    {dayOfWeek}
                  </div>
                  <div className="text-3xl font-black text-brand-white leading-none my-1">
                    {day}
                  </div>
                  <div className="text-xs font-black text-brand-white opacity-90">
                    {month}
                  </div>
                </div>
                
                {/* Badge especial para eventos de hoy/mañana */}
                {isToday && (
                  <div className="absolute -top-2 -right-2 bg-brand-gold text-brand-black text-xs px-2 py-1 rounded-full font-black animate-bounce">
                    HOY
                  </div>
                )}
                {isTomorrow && !isToday && (
                  <div className="absolute -top-2 -right-2 bg-brand-orange text-brand-white text-xs px-2 py-1 rounded-full font-black animate-pulse">
                    MAÑANA
                  </div>
                )}
              </div>
            </div>

            {/* Badge de categoría mejorado */}
            <div className="absolute top-6 right-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <div className="bg-gradient-to-r from-brand-purple/90 to-brand-orange/90 backdrop-blur-md rounded-full px-6 py-3 shadow-lg border border-brand-white/20">
                <div className="flex items-center space-x-2">
                  <SparklesIcon className="w-4 h-4 text-brand-white" />
                  <span className="text-sm font-black text-brand-white tracking-wider">
                    {event.eventType || 'PARTY'}
                  </span>
                </div>
              </div>
            </div>

            {/* Precio mejorado */}
            {event.price && (
              <div className="absolute top-20 right-6 transform group-hover:scale-110 transition-transform duration-300">
                <div className="bg-brand-black/80 backdrop-blur-md rounded-2xl px-5 py-3 border-2 border-brand-gold/50 shadow-xl">
                  <div className="text-center">
                    <div className="text-xs text-brand-gold font-bold opacity-90">DESDE</div>
                    <div className="text-2xl font-black text-brand-white leading-none">
                      {event.price}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Información principal con efectos mejorados */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              {/* Título del evento con efectos especiales */}
              <h3 className={`font-black text-brand-white mb-6 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-brand-gold group-hover:via-brand-orange group-hover:to-brand-purple group-hover:bg-clip-text transition-all duration-500 leading-tight ${
                featured ? 'text-4xl lg:text-5xl' : 'text-2xl lg:text-3xl'
              }`}>
                {event.name}
              </h3>

              {/* Grid de información mejorado */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Columna izquierda */}
                <div className="space-y-4">
                  {/* Hora */}
                  <div className="flex items-center space-x-3 bg-brand-black/50 backdrop-blur-sm rounded-full px-4 py-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-brand-orange to-brand-gold rounded-full flex items-center justify-center">
                      <ClockIcon className="w-4 h-4 text-brand-white" />
                    </div>
                    <span className="text-brand-white font-bold">{eventTime}</span>
                  </div>

                  {/* Club */}
                  {club && (
                    <div className="flex items-center space-x-3 bg-brand-black/50 backdrop-blur-sm rounded-full px-4 py-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-brand-purple to-brand-orange rounded-full flex items-center justify-center">
                        <MapPinIcon className="w-4 h-4 text-brand-white" />
                      </div>
                      <span className="text-brand-white font-bold truncate">
                        {club.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Columna derecha */}
                <div className="space-y-4">
                  {/* DJs */}
                  {eventDJs.length > 0 && (
                    <div className="flex items-center space-x-3 bg-brand-black/50 backdrop-blur-sm rounded-full px-4 py-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-brand-gold to-brand-purple rounded-full flex items-center justify-center">
                        <MusicalNoteIcon className="w-4 h-4 text-brand-white" />
                      </div>
                      <span className="text-brand-white font-bold truncate">
                        {eventDJs.slice(0, 2).map(dj => dj.name).join(', ')}
                        {eventDJs.length > 2 && ` +${eventDJs.length - 2}`}
                      </span>
                    </div>
                  )}

                  {/* Promoter */}
                  {promoter && (
                    <div className="flex items-center space-x-3 bg-brand-black/50 backdrop-blur-sm rounded-full px-4 py-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-brand-orange to-brand-purple rounded-full flex items-center justify-center">
                        <UserGroupIcon className="w-4 h-4 text-brand-white" />
                      </div>
                      <span className="text-brand-white font-bold truncate">
                        {promoter.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Botón de entradas mejorado */}
              {event.originalSourceUrl && (
                <div className="mt-6 flex justify-center">
                  <div className="relative group-hover:scale-110 transition-transform duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-orange via-brand-gold to-brand-purple rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative bg-gradient-to-r from-brand-orange to-brand-gold text-brand-white font-black text-lg px-8 py-4 rounded-full shadow-xl border-2 border-brand-white/20 hover:border-brand-white/40 transition-all duration-300 flex items-center space-x-3">
                      <TicketIcon className="w-6 h-6" />
                      <span>CONSEGUIR ENTRADAS</span>
                      <StarIcon className="w-6 h-6 animate-spin" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Efectos adicionales de hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-orange/5 via-transparent to-brand-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
            
            {/* Brillo perimetral */}
            <div className="absolute inset-0 border-4 border-transparent group-hover:border-brand-gold/30 rounded-2xl transition-all duration-500 pointer-events-none"></div>
          </div>
        </Link>
      </HolographicCard>
    </div>
  );
};

export default EventCard;