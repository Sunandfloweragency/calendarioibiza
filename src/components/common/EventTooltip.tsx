import React, { useState } from 'react';
import { Event } from '../../types/supabase';
import { CalendarDaysIcon, ClockIcon, MapPinIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';

interface EventTooltipProps {
  event: Event;
  children: React.ReactElement;
}

const EventTooltip: React.FC<EventTooltipProps> = ({ event, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return 'Hora por confirmar';
    return timeString;
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-80">
          <div className="bg-gradient-to-br from-brand-black via-brand-black/95 to-brand-purple/20 
                          border-2 border-brand-purple/30 rounded-2xl p-6 shadow-2xl 
                          backdrop-blur-xl animate-fade-in"
               style={{ 
                 boxShadow: '0 0 30px rgba(91, 62, 228, 0.3), inset 0 0 20px rgba(91, 62, 228, 0.1)' 
               }}>
            
            {/* Título del evento */}
            <h3 className="text-xl font-black text-brand-white mb-3 line-clamp-2 text-gradient">
              {event.name}
            </h3>

            {/* Información básica */}
            <div className="space-y-3">
              {/* Fecha */}
              <div className="flex items-center space-x-3">
                <CalendarDaysIcon className="w-5 h-5 text-brand-purple flex-shrink-0" />
                <span className="text-brand-white font-medium">
                  {formatDate(event.date)}
                </span>
              </div>

              {/* Hora */}
              <div className="flex items-center space-x-3">
                <ClockIcon className="w-5 h-5 text-brand-purple flex-shrink-0" />
                <span className="text-brand-white font-medium">
                  {formatTime(event.time)}
                </span>
              </div>

              {/* Tipo de evento */}
              {event.eventType && (
                <div className="flex items-center space-x-3">
                  <MusicalNoteIcon className="w-5 h-5 text-brand-purple flex-shrink-0" />
                  <span className="text-brand-white font-medium">
                    {event.eventType}
                  </span>
                </div>
              )}

              {/* Descripción breve */}
              {event.description && (
                <div className="flex items-start space-x-3">
                  <MapPinIcon className="w-5 h-5 text-brand-purple flex-shrink-0 mt-0.5" />
                  <span className="text-brand-white font-medium line-clamp-2 text-sm">
                    {event.description.substring(0, 100)}...
                  </span>
                </div>
              )}
            </div>

            {/* Precio si está disponible */}
            {event.price && (
              <div className="mt-4 pt-3 border-t border-brand-purple/20">
                <div className="flex items-center justify-between">
                  <span className="text-brand-gray text-sm">Precio desde:</span>
                  <span className="text-brand-purple font-black text-lg">
                    €{event.price}
                  </span>
                </div>
              </div>
            )}

            {/* Flecha del tooltip */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 
                            border-l-transparent border-r-transparent border-t-brand-purple/30"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventTooltip; 