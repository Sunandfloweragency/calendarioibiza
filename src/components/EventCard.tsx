import React from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../types/supabase';
import { useData } from '../contexts/DataContext';
import HolographicCard from './3D/HolographicCard';
import EventTooltip from './common/EventTooltip';
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  MapPinIcon, 
  MusicalNoteIcon,
  UserGroupIcon,
  TicketIcon
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

  return (
    <EventTooltip event={event}>
      <div>
    <HolographicCard 
      className={`group ${featured ? 'lg:col-span-2 lg:row-span-2' : ''}`}
      intensity={featured ? 1.5 : 1}
    >
      <Link 
        to={`/events/${event.slug}`}
        className="block"
      >
      {/* Imagen de fondo */}
      <div className={`relative overflow-hidden ${featured ? 'h-96 lg:h-full' : 'h-80'}`}>
        <img 
          src={event.imageUrl || `https://picsum.photos/seed/${event.slug}/800/600`}
          alt={event.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/40 to-brand-black/20"></div>
        
        {/* Badge de fecha en la esquina superior izquierda */}
        <div className="absolute top-4 left-4">
          <div className="bg-brand-orange rounded-2xl px-4 py-3 shadow-lg">
            <div className="text-center">
              <div className="text-xs font-bold text-brand-white opacity-90">
                {dayOfWeek}
              </div>
              <div className="text-2xl font-black text-brand-white leading-none">
                {day}
              </div>
              <div className="text-xs font-bold text-brand-white opacity-90">
                {month}
              </div>
            </div>
          </div>
        </div>

        {/* Badge de categoría/tipo */}
        <div className="absolute top-4 left-20">
          <div className="bg-brand-orange/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg">
            <span className="text-sm font-bold text-brand-white tracking-wider">
              {event.eventType || 'PARTY'}
            </span>
          </div>
        </div>

        {/* Precio en la esquina superior derecha */}
        {event.price && (
          <div className="absolute top-4 right-4">
            <div className="bg-brand-black/70 backdrop-blur-md rounded-2xl px-4 py-2 border border-brand-white/20">
              <div className="text-2xl font-black text-brand-white">
                {event.price}
              </div>
            </div>
          </div>
        )}

        {/* Información principal superpuesta */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {/* Título del evento */}
          <h3 className={`font-black text-brand-white mb-4 group-hover:text-gradient transition-all duration-300 leading-tight ${
            featured ? 'text-3xl lg:text-4xl' : 'text-2xl'
          }`}>
            {event.name}
          </h3>

          {/* Información del evento */}
          <div className="space-y-3">
            {/* Hora y club */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-5 h-5 text-brand-orange" />
                <span className="text-brand-white font-medium">{eventTime}</span>
              </div>
              
              {club && (
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="w-5 h-5 text-brand-purple" />
                  <span className="text-brand-white font-medium truncate max-w-32">
                    {club.name}
                  </span>
                </div>
              )}
            </div>

            {/* DJs */}
            {eventDJs.length > 0 && (
              <div className="flex items-center space-x-2">
                <MusicalNoteIcon className="w-5 h-5 text-brand-orange" />
                <span className="text-brand-white/90 font-medium truncate">
                  {eventDJs.slice(0, 2).map(dj => dj.name).join(', ')}
                  {eventDJs.length > 2 && ` +${eventDJs.length - 2} más`}
                </span>
              </div>
            )}

            {/* Promoter */}
            {promoter && (
              <div className="flex items-center space-x-2">
                <UserGroupIcon className="w-5 h-5 text-brand-purple" />
                <span className="text-brand-white/90 font-medium truncate">
                  {promoter.name}
                </span>
              </div>
            )}

            {/* Botón de tickets si está disponible */}
            {event.originalSourceUrl && (
              <div className="pt-2">
                <div className="inline-flex items-center space-x-2 bg-gradient-orange px-4 py-2 rounded-full text-brand-white font-bold text-sm hover:bg-gradient-purple transition-all duration-300 transform hover:scale-105">
                  <TicketIcon className="w-4 h-4" />
                  <span>ENTRADAS</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Efectos de hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-orange/10 via-transparent to-brand-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
      </div>
    </Link>
    </HolographicCard>
      </div>
    </EventTooltip>
  );
};

export default EventCard;