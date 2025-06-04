import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import EventCard from '../components/EventCard';
import EventCalendar from '../components/EventCalendar';
import Calendar3D from '../components/3D/Calendar3D';
import EventListCompact from '../components/EventListCompact';
import FloatingElements from '../components/3D/FloatingElements';
import HolographicCard from '../components/3D/HolographicCard';
import NeonButton from '../components/3D/NeonButton';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { 
  CalendarDaysIcon, 
  MapPinIcon, 
  MusicalNoteIcon, 
  SparklesIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';

const HomePage: React.FC = () => {
  const { events, loading } = useData();
  
  // Estado del dispositivo y vista
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentView, setCurrentView] = useState<'events' | 'calendar'>(window.innerWidth < 768 ? 'events' : 'calendar');
  
  // Ref para evitar spam de logs
  const hasLoggedDataRef = useRef<string>('');

  // Obtener eventos próximos usando directamente events
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter((event: any) => new Date(event.date) >= now)
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 12); // Máximo 12 para mejor rendimiento
  }, [events]);

  // Detectar tamaño de pantalla y ajustar vista automáticamente
  useEffect(() => {
    // Auto-ajustar vista basada en el dispositivo - SOLO UNA VEZ AL MONTAR O CAMBIAR DISPOSITIVO
    if (isMobile && currentView === 'calendar') {
      setCurrentView('events'); // Forzar lista en móvil
    } else if (!isMobile && currentView === 'events') {
      setCurrentView('calendar'); // Forzar calendario en desktop
    }
  }, [isMobile]); // Solo isMobile como dependencia, no currentView
  
  // Debug: Log de datos cuando cambian - OPTIMIZADO PARA EVITAR SPAM
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !loading && upcomingEvents.length > 0) {
      // Solo loggear una vez cuando los datos están listos
      const logKey = `homepage-${upcomingEvents.length}`;
      if (hasLoggedDataRef.current !== logKey) {
        console.log('🏠 HomePage - Datos cargados:', {
          events: upcomingEvents.length,
          loading,
          isMobile,
          currentView,
          timestamp: new Date().toISOString()
        });
        hasLoggedDataRef.current = logKey;
      }
    }
  }, [loading, upcomingEvents.length]); // Removido connectionStatus

  // Vista change handler memoizado (con validación responsive)
  const handleViewChange = useCallback((view: 'events' | 'calendar') => {
    // En móvil, no permitir cambiar a calendario
    if (isMobile && view === 'calendar') {
      return;
    }
    setCurrentView(view);
  }, [isMobile]);

  // Efecto de partículas (optimizado)
  useEffect(() => {
    let particleCount = 0;
    const maxParticles = isMobile ? 20 : 50; // Menos partículas en móvil

    const createParticle = () => {
      if (particleCount >= maxParticles) return;

      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 6 + 's';
      
      const particlesContainer = document.querySelector('.particles-bg');
      if (particlesContainer) {
        particlesContainer.appendChild(particle);
        particleCount++;
        
        setTimeout(() => {
          if (particle.parentNode) {
            particle.remove();
            particleCount--;
          }
        }, 8000);
      }
    };

    const interval = setInterval(createParticle, isMobile ? 800 : 500); // Menos frecuente en móvil
    return () => {
      clearInterval(interval);
      // Limpiar partículas al desmontar
      const particlesContainer = document.querySelector('.particles-bg');
      if (particlesContainer) {
        particlesContainer.innerHTML = '';
      }
    };
  }, [isMobile]);

  // Efecto de scroll para animaciones (optimizado)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const timeoutId = setTimeout(() => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  // Loading state optimizado
  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center relative overflow-hidden">
        <FloatingElements count={isMobile ? 10 : 15} speed={1.2} />
        <div className="relative z-10">
          <LoadingSpinner 
            size="xl" 
            text="SUN & FLOWER IBIZA" 
            variant="professional" 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black relative overflow-hidden">
      {/* Fondo de partículas optimizado */}
      <FloatingElements count={isMobile ? 15 : 25} speed={0.8} />
      <div className="particles-bg"></div>

      {/* Hero Section - Responsive */}
      <section className="relative min-h-screen flex items-start justify-center px-4 md:px-6 pt-10">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-black via-brand-black/95 to-brand-black"></div>
        
        {/* Texto repetitivo de fondo - Solo en desktop */}
        {!isMobile && (
          <>
            <div className="absolute top-20 left-0 w-full overflow-hidden opacity-5 pointer-events-none">
              <div className="text-repeat text-4xl md:text-6xl font-black text-brand-orange">
                IBIZA CALENDAR IBIZA CALENDAR IBIZA CALENDAR IBIZA CALENDAR
              </div>
            </div>
            
            <div className="absolute bottom-20 left-0 w-full overflow-hidden opacity-5 pointer-events-none">
              <div className="text-repeat text-4xl md:text-6xl font-black text-brand-purple" style={{ animationDirection: 'reverse' }}>
                ELECTRONIC MUSIC ELECTRONIC MUSIC ELECTRONIC MUSIC ELECTRONIC MUSIC
              </div>
            </div>
          </>
        )}

        <div className="relative z-10 text-center max-w-6xl mx-auto" style={{ marginTop: isMobile ? '20px' : '40px' }}>
          {/* Título principal responsive */}
          <div className="mb-8 md:mb-10 animate-fade-in">
            <h1 className={`sun-flower-mega-3d text-gradient mb-4 md:mb-6 ${isMobile ? 'text-4xl' : ''}`}>
              SUN AND FLOWER
            </h1>
            
            <h2 className={`text-brand-white mb-3 md:mb-4 animate-slide-up font-black tracking-tighter ${
              isMobile ? 'text-4xl' : 'text-mega md:text-[8rem]'
            }`} style={{ animationDelay: '0.2s' }}>
              IBIZA
              <br />
              <span className="text-gradient-reverse">CALENDAR</span>
            </h2>
            
            {/* Subtítulo descriptivo */}
            <p className={`text-brand-gray max-w-3xl mx-auto animate-slide-up font-medium ${
              isMobile ? 'text-lg px-4' : 'text-xl md:text-2xl'
            }`} style={{ animationDelay: '0.3s' }}>
              La guía definitiva de música electrónica en la isla blanca
            </p>
          </div>

          {/* Indicador de vista actual */}
          <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-center space-x-4 text-brand-gray text-sm">
              {isMobile ? (
                <>
                  <DevicePhoneMobileIcon className="w-5 h-5 text-brand-orange" />
                  <span>Vista de móvil - Lista de eventos</span>
                </>
              ) : (
                <>
                  <ComputerDesktopIcon className="w-5 h-5 text-brand-purple" />
                  <span>Vista de escritorio - Calendario interactivo</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-brand-orange rounded-full flex justify-center">
            <div className="w-1 h-3 bg-brand-orange rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Sección de contenido principal */}
      <section className="relative min-h-screen py-8 md:py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Vista de eventos (siempre en móvil, opcional en desktop) */}
          {(isMobile || currentView === 'events') && (
            <div className="animate-fade-in">
              <div className="text-center mb-6 md:mb-8 animate-on-scroll">
                <h2 className={`font-black text-gradient mb-3 md:mb-4 ${
                  isMobile ? 'text-4xl' : 'text-6xl md:text-8xl'
                }`}>
                  PRÓXIMOS EVENTOS
                </h2>
                <p className={`text-brand-gray max-w-2xl mx-auto ${
                  isMobile ? 'text-lg px-4' : 'text-xl'
                }`}>
                  Descubre la mejor música electrónica en los clubs más exclusivos de Ibiza
                </p>
              </div>

              {upcomingEvents.length > 0 ? (
                <div className={`gap-6 md:gap-8 ${
                  isMobile ? 'grid grid-cols-1' : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                }`}>
                  {upcomingEvents.map((event, index) => (
                    <div 
                      key={event.id}
                      className="animate-on-scroll"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {isMobile ? (
                        <EventCard event={event} />
                      ) : (
                        <HolographicCard>
                          <EventCard event={event} />
                        </HolographicCard>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 md:py-20">
                  <MusicalNoteIcon className={`text-brand-gray mx-auto mb-6 ${
                    isMobile ? 'w-16 h-16' : 'w-24 h-24'
                  }`} />
                  <h3 className={`font-bold text-brand-white mb-4 ${
                    isMobile ? 'text-xl' : 'text-2xl'
                  }`}>
                    No hay eventos próximos
                  </h3>
                  <p className="text-brand-gray">
                    Los eventos se cargarán pronto. ¡Mantente atento!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Vista calendario - Solo en desktop */}
          {!isMobile && currentView === 'calendar' && (
            <div className="animate-fade-in">
              <Calendar3D />
            </div>
          )}
        </div>
      </section>

      {/* Sección adicional de características */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-6xl md:text-8xl font-black text-gradient mb-6">
              EXPERIENCIA COMPLETA
            </h2>
            <p className="text-xl text-brand-gray max-w-3xl mx-auto">
              Todo lo que necesitas para vivir la mejor experiencia de música electrónica en Ibiza
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Eventos */}
            <div className="animate-on-scroll">
              <HolographicCard>
                <div className="text-center p-6">
                  <CalendarDaysIcon className="w-16 h-16 text-brand-orange mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-brand-white mb-4">EVENTOS</h3>
                  <p className="text-brand-gray">
                    Los mejores eventos de música electrónica actualizados en tiempo real
                  </p>
                </div>
              </HolographicCard>
            </div>

            {/* DJs */}
            <div className="animate-on-scroll" style={{ animationDelay: '0.2s' }}>
              <HolographicCard>
                <div className="text-center p-6">
                  <MusicalNoteIcon className="w-16 h-16 text-brand-purple mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-brand-white mb-4">ARTISTAS</h3>
                  <p className="text-brand-gray">
                    Perfiles completos de los mejores DJs locales e internacionales
                  </p>
                </div>
              </HolographicCard>
            </div>

            {/* Clubs */}
            <div className="animate-on-scroll" style={{ animationDelay: '0.4s' }}>
              <HolographicCard>
                <div className="text-center p-6">
                  <MapPinIcon className="w-16 h-16 text-brand-gold mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-brand-white mb-4">VENUES</h3>
                  <p className="text-brand-gray">
                    Los clubs más exclusivos y venues únicos de la isla
                  </p>
                </div>
              </HolographicCard>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;