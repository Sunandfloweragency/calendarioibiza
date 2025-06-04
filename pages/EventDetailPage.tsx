import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import HolographicCard from '../components/3D/HolographicCard';
import FloatingElements from '../components/3D/FloatingElements';
import { 
  MapPinIcon, 
  TicketIcon, 
  UsersIcon, 
  UserGroupIcon, 
  BuildingStorefrontIcon, 
  CalendarDaysIcon, 
  PhotoIcon,
  ClockIcon,
  MusicalNoteIcon,
  SparklesIcon,
  PlayIcon,
  HeartIcon,
  ShareIcon,
  LinkIcon,
  SpeakerWaveIcon,
  MegaphoneIcon,
  StarIcon,
  FireIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const EventDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getEventBySlug, getClubById, getDJById, getPromoterById, loading, error, connectionStatus } = useData();
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'lineup' | 'venue'>('info');

  // Scroll al top cuando se carga el componente
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.name || 'Evento en Ibiza',
          text: `Descubre ${event?.name} en Ibiza`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('URL copiada al portapapeles');
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center relative overflow-hidden">
        <FloatingElements count={20} speed={1.2} />
        <div className="relative z-10">
          <LoadingSpinner 
            size="xl" 
            text="CARGANDO EVENTO" 
            variant="professional" 
          />
        </div>
      </div>
    );
  }

  if (error && connectionStatus === 'error') {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center relative overflow-hidden">
        <FloatingElements count={15} speed={0.8} />
        <div className="relative z-10 text-center">
          <HolographicCard className="p-12 max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-brand-orange to-brand-purple rounded-full flex items-center justify-center mx-auto mb-6">
              <PhotoIcon className="w-12 h-12 text-brand-white" />
            </div>
            <h2 className="text-3xl font-bold text-gradient mb-4">Error de Conexión</h2>
            <p className="text-brand-gray mb-8 text-lg">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-brand-orange to-brand-purple text-brand-white px-8 py-4 rounded-2xl font-bold hover:shadow-lg transition-all duration-300"
            >
              REINTENTAR
            </button>
          </HolographicCard>
        </div>
      </div>
    );
  }
  
  const event = slug ? getEventBySlug(slug) : undefined;

  if (!event) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center relative overflow-hidden">
        <FloatingElements count={15} speed={0.8} />
        <div className="relative z-10 text-center">
          <HolographicCard className="p-12 max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-brand-orange to-brand-purple rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarDaysIcon className="w-12 h-12 text-brand-white" />
            </div>
            <h2 className="text-3xl font-bold text-gradient mb-4">Evento No Encontrado</h2>
            <p className="text-brand-gray mb-8 text-lg">No pudimos encontrar el evento solicitado.</p>
            <Link 
              to="/events" 
              className="bg-gradient-to-r from-brand-orange to-brand-purple text-brand-white px-8 py-4 rounded-2xl font-bold hover:shadow-lg transition-all duration-300 inline-block"
            >
              VER TODOS LOS EVENTOS
            </Link>
          </HolographicCard>
        </div>
      </div>
    );
  }

  const club = event.clubId ? getClubById(event.clubId) : null;
  const djs = event.djIds ? event.djIds.map(id => getDJById(id)).filter(Boolean) : [];
  const promoter = event.promoterId ? getPromoterById(event.promoterId) : null;

  const formatEventDate = (dateString: string, timeString?: string) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    if (timeString) {
      return `${formattedDate} a las ${timeString}`;
    }
    return formattedDate;
  };

  const eventDate = new Date(event.date);
  const isToday = eventDate.toDateString() === new Date().toDateString();
  const isPast = eventDate < new Date();

  return (
    <div className="min-h-screen bg-brand-black relative overflow-hidden">
      <FloatingElements count={30} speed={0.5} />

      {/* Hero Section Espectacular */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Imagen de fondo con overlay */}
        <div className="absolute inset-0">
          <img 
            src={event.imageUrl || `https://picsum.photos/seed/${event.slug}/1920/1080`}
            alt={event.name}
            className="w-full h-full object-cover scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://picsum.photos/seed/eventdefault/1920/1080';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/80 to-brand-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/10 via-transparent to-brand-purple/10"></div>
        </div>

        {/* Contenido Hero */}
        <div className="relative z-10 text-center max-w-6xl mx-auto px-6 pt-20">
          {/* Badge de estado */}
          <div className="mb-8 flex justify-center">
            {isToday ? (
              <div className="bg-gradient-to-r from-brand-gold to-brand-orange text-brand-white px-8 py-3 rounded-full font-black text-lg animate-pulse shadow-orange-glow">
                🔥 HOY - EN VIVO 🔥
              </div>
            ) : isPast ? (
              <div className="bg-gradient-to-r from-brand-gray/50 to-brand-gray/30 text-brand-white px-8 py-3 rounded-full font-bold text-lg">
                📅 EVENTO PASADO
              </div>
            ) : (
              <div className="bg-gradient-to-r from-brand-purple to-brand-orange text-brand-white px-8 py-3 rounded-full font-black text-lg shadow-purple-glow">
                ✨ PRÓXIMAMENTE ✨
              </div>
            )}
          </div>

          {/* Título principal */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-brand-white mb-8 leading-tight">
            <span className="text-with-gradient-glow">
              {event.name}
            </span>
          </h1>

          {/* Tipo de evento */}
          {event.eventType && (
            <div className="mb-8">
              <span className="inline-block bg-gradient-to-r from-brand-orange via-brand-gold to-brand-orange text-brand-white text-xl px-6 py-3 rounded-full font-bold tracking-wider shadow-lg">
                {event.eventType}
              </span>
            </div>
          )}

          {/* Información principal */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Fecha y hora */}
            <HolographicCard className="p-6 text-center" intensity={1.2}>
              <CalendarDaysIcon className="w-12 h-12 text-brand-orange mx-auto mb-4" />
              <h3 className="text-sm font-black text-brand-orange tracking-wider uppercase mb-2">FECHA Y HORA</h3>
              <p className="text-brand-white font-bold text-lg">
                {eventDate.toLocaleDateString('es-ES', { 
                  weekday: 'long',
                  day: 'numeric', 
                  month: 'long'
                })}
              </p>
              <p className="text-brand-gold font-bold text-xl">
                {event.time || '23:00'}
              </p>
            </HolographicCard>

            {/* Club */}
            {club && (
              <HolographicCard className="p-6 text-center" intensity={1.2}>
                <BuildingStorefrontIcon className="w-12 h-12 text-brand-purple mx-auto mb-4" />
                <h3 className="text-sm font-black text-brand-purple tracking-wider uppercase mb-2">VENUE</h3>
                <Link 
                  to={`/clubs/${club.slug}`}
                  className="text-brand-white font-bold text-lg hover:text-brand-orange transition-colors duration-300"
                >
                  {club.name}
                </Link>
                {club.location && (
                  <p className="text-brand-gray text-sm mt-1">{club.location}</p>
                )}
              </HolographicCard>
            )}

            {/* Precio */}
            {event.price && (
              <HolographicCard className="p-6 text-center" intensity={1.2}>
                <TicketIcon className="w-12 h-12 text-brand-gold mx-auto mb-4" />
                <h3 className="text-sm font-black text-brand-gold tracking-wider uppercase mb-2">PRECIO</h3>
                <p className="text-brand-white font-black text-2xl">
                  {event.price}
                </p>
              </HolographicCard>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={toggleLike}
              className={`flex items-center space-x-2 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${
                isLiked 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg' 
                  : 'bg-brand-surface/50 text-brand-white hover:bg-brand-surface/70'
              }`}
            >
              {isLiked ? (
                <HeartSolidIcon className="w-6 h-6" />
              ) : (
                <HeartIcon className="w-6 h-6" />
              )}
              <span>{isLiked ? 'ME GUSTA' : 'LIKE'}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center space-x-2 bg-brand-surface/50 text-brand-white px-6 py-4 rounded-2xl font-bold hover:bg-brand-surface/70 transition-all duration-300"
            >
              <ShareIcon className="w-6 h-6" />
              <span>COMPARTIR</span>
            </button>

            {event.originalSourceUrl && (
              <a
                href={event.originalSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-gradient-to-r from-brand-orange to-brand-purple text-brand-white px-8 py-4 rounded-2xl font-black hover:shadow-lg transition-all duration-300"
              >
                <TicketIcon className="w-6 h-6" />
                <span>COMPRAR TICKETS</span>
              </a>
            )}
          </div>

          {/* Scroll indicator */}
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-brand-orange rounded-full flex justify-center">
              <div className="w-1 h-3 bg-brand-orange rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido principal */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Navigation Tabs */}
          <div className="flex justify-center mb-16">
            <HolographicCard className="p-2" intensity={1.1}>
              <div className="flex space-x-2">
                {[
                  { id: 'info', label: 'Info', icon: SparklesIcon },
                  { id: 'lineup', label: 'Line-up', icon: MusicalNoteIcon },
                  { id: 'venue', label: 'Venue', icon: BuildingStorefrontIcon }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center px-6 py-3 rounded-2xl transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-brand-orange to-brand-purple text-white shadow-lg'
                        : 'text-brand-gray hover:text-brand-white hover:bg-brand-surface/50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </HolographicCard>
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in">
            {activeTab === 'info' && (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Descripción principal */}
                <div className="lg:col-span-2">
                  <HolographicCard className="p-8" intensity={1.1}>
                    <h2 className="text-3xl font-black text-gradient mb-6 flex items-center">
                      <BoltIcon className="w-8 h-8 mr-3 text-brand-orange" />
                      Sobre el Evento
                    </h2>
                    {event.description ? (
                      <div 
                        className="prose prose-lg max-w-none text-brand-gray leading-relaxed"
                        dangerouslySetInnerHTML={{ 
                          __html: event.description.replace(/\n/g, '<br />') 
                        }} 
                      />
                    ) : (
                      <p className="text-brand-gray text-lg leading-relaxed">
                        Prepárate para una noche inolvidable en {club?.name || 'Ibiza'}. 
                        {event.name} promete ser uno de los eventos más emocionantes de la temporada, 
                        combinando la mejor música electrónica con una producción de primera clase 
                        y una atmósfera única que solo Ibiza puede ofrecer.
                      </p>
                    )}

                    {/* Event highlights */}
                    <div className="mt-8 grid md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-brand-orange/10 to-brand-gold/10 rounded-xl p-4 border border-brand-orange/20">
                        <FireIcon className="w-8 h-8 text-brand-orange mb-2" />
                        <h4 className="font-bold text-brand-white mb-1">Experiencia Única</h4>
                        <p className="text-brand-gray text-sm">Vive la magia de la música electrónica en un ambiente exclusivo</p>
                      </div>
                      <div className="bg-gradient-to-r from-brand-purple/10 to-brand-orange/10 rounded-xl p-4 border border-brand-purple/20">
                        <StarIcon className="w-8 h-8 text-brand-purple mb-2" />
                        <h4 className="font-bold text-brand-white mb-1">Calidad Premium</h4>
                        <p className="text-brand-gray text-sm">Sonido y producción de la más alta calidad</p>
                      </div>
                    </div>
                  </HolographicCard>
                </div>

                {/* Sidebar con información adicional */}
                <div className="space-y-6">
                  {/* Promoter */}
                  {promoter && (
                    <HolographicCard className="p-6" intensity={1.1}>
                      <h3 className="text-xl font-bold text-gradient mb-4 flex items-center">
                        <MegaphoneIcon className="w-6 h-6 mr-2 text-brand-purple" />
                        Promoter
                      </h3>
                      <Link 
                        to={`/promoters/${promoter.slug}`}
                        className="flex items-center space-x-3 hover:bg-brand-surface/30 p-3 rounded-xl transition-colors duration-300"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-brand-purple to-brand-orange rounded-full flex items-center justify-center">
                          <UserGroupIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-brand-white">{promoter.name}</h4>
                          <p className="text-brand-gray text-sm">Organizador del evento</p>
                        </div>
                      </Link>
                    </HolographicCard>
                  )}

                  {/* Social Links */}
                  {event.socialLinks && event.socialLinks.length > 0 && (
                    <HolographicCard className="p-6" intensity={1.1}>
                      <h3 className="text-xl font-bold text-gradient mb-4 flex items-center">
                        <LinkIcon className="w-6 h-6 mr-2 text-brand-orange" />
                        Enlaces del Evento
                      </h3>
                      <div className="space-y-3">
                        {event.socialLinks.map((link, index) => (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center space-x-3 bg-gradient-to-r from-brand-orange/20 to-brand-purple/20 hover:from-brand-orange/30 hover:to-brand-purple/30 p-3 rounded-xl transition-all duration-300 border border-brand-orange/30"
                          >
                            <LinkIcon className="w-5 h-5 text-brand-orange" />
                            <span className="text-brand-white font-medium">{link.platform}</span>
                          </a>
                        ))}
                      </div>
                    </HolographicCard>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'lineup' && (
              <div className="space-y-8">
                <h2 className="text-4xl font-black text-gradient text-center mb-12 flex items-center justify-center">
                  <MusicalNoteIcon className="w-10 h-10 mr-4 text-brand-orange" />
                  Line-up del Evento
                </h2>
                
                {djs.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {djs.map((dj, index) => dj && (
                      <Link
                        key={dj.id}
                        to={`/djs/${dj.slug}`}
                        className="group"
                      >
                        <HolographicCard className="p-6 hover:scale-105 transition-all duration-300" intensity={1.2}>
                          <div className="text-center">
                            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-brand-orange shadow-orange-glow">
                              {dj.imageUrl ? (
                                <img 
                                  src={dj.imageUrl}
                                  alt={dj.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-brand-surface to-brand-surface-variant flex items-center justify-center">
                                  <MusicalNoteIcon className="w-12 h-12 text-brand-gray" />
                                </div>
                              )}
                            </div>
                            <h3 className="text-xl font-bold text-brand-white mb-2 group-hover:text-brand-orange transition-colors duration-300">
                              {dj.name}
                            </h3>
                            {dj.genre && (
                              <p className="text-brand-orange text-sm font-medium bg-brand-orange/20 px-3 py-1 rounded-full inline-block">
                                {dj.genre}
                              </p>
                            )}
                          </div>
                        </HolographicCard>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <HolographicCard className="p-12 max-w-md mx-auto">
                      <SpeakerWaveIcon className="w-16 h-16 text-brand-gray mx-auto mb-6" />
                      <h3 className="text-2xl font-bold text-brand-white mb-4">Line-up por confirmar</h3>
                      <p className="text-brand-gray">El line-up de este evento se anunciará pronto.</p>
                    </HolographicCard>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'venue' && (
              <div className="space-y-8">
                <h2 className="text-4xl font-black text-gradient text-center mb-12 flex items-center justify-center">
                  <BuildingStorefrontIcon className="w-10 h-10 mr-4 text-brand-purple" />
                  Información del Venue
                </h2>
                
                {club ? (
                  <div className="grid lg:grid-cols-2 gap-8">
                    <HolographicCard className="p-8" intensity={1.2}>
                      <Link to={`/clubs/${club.slug}`} className="group">
                        <h3 className="text-3xl font-bold text-brand-white mb-4 group-hover:text-brand-purple transition-colors duration-300">
                          {club.name}
                        </h3>
                        {club.location && (
                          <div className="flex items-center space-x-2 mb-4">
                            <MapPinIcon className="w-5 h-5 text-brand-orange" />
                            <span className="text-brand-gray">{club.location}</span>
                          </div>
                        )}
                        {club.description && (
                          <p className="text-brand-gray leading-relaxed mb-6">
                            {club.description}
                          </p>
                        )}
                        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-brand-purple to-brand-orange text-brand-white px-6 py-3 rounded-2xl font-bold group-hover:shadow-lg transition-all duration-300">
                          <span>VER CLUB COMPLETO</span>
                          <BuildingStorefrontIcon className="w-5 h-5" />
                        </div>
                      </Link>
                    </HolographicCard>

                    <HolographicCard className="p-8" intensity={1.2}>
                      <h4 className="text-xl font-bold text-brand-white mb-6">Características del Venue</h4>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-brand-orange rounded-full"></div>
                          <span className="text-brand-gray">Capacidad premium</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-brand-purple rounded-full"></div>
                          <span className="text-brand-gray">Sistema de sonido profesional</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-brand-gold rounded-full"></div>
                          <span className="text-brand-gray">Ambiente exclusivo</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-brand-orange rounded-full"></div>
                          <span className="text-brand-gray">Ubicación privilegiada</span>
                        </div>
                      </div>
                    </HolographicCard>
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <HolographicCard className="p-12 max-w-md mx-auto">
                      <BuildingStorefrontIcon className="w-16 h-16 text-brand-gray mx-auto mb-6" />
                      <h3 className="text-2xl font-bold text-brand-white mb-4">Venue por confirmar</h3>
                      <p className="text-brand-gray">La ubicación de este evento se anunciará pronto.</p>
                    </HolographicCard>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Back to Events */}
          <div className="text-center mt-20">
            <Link 
              to="/events" 
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-brand-surface/50 to-brand-surface-variant/50 text-brand-white px-8 py-4 rounded-2xl font-bold hover:from-brand-orange hover:to-brand-purple hover:shadow-lg transition-all duration-300 border border-brand-orange/20"
            >
              <span>← VOLVER A EVENTOS</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventDetailPage;