import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EventCard from '../components/EventCard';
import { 
  MapPinIcon, 
  MusicalNoteIcon, 
  LinkIcon, 
  CheckCircleIcon, 
  PhotoIcon, 
  CalendarDaysIcon,
  ShareIcon,
  HeartIcon,
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  SparklesIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const ClubProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getClubBySlug, events, djs, promoters, isLoading } = useData();
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'gallery'>('overview');

  if (isLoading) return <div className="flex justify-center items-center h-screen"><LoadingSpinner size="lg" /></div>;

  const club = slug ? getClubBySlug(slug) : undefined;

  if (!club) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-brand-white mb-4">Club no encontrado</h2>
          <p className="text-brand-gray mb-8">El club que buscas no existe o ha sido eliminado.</p>
          <Link to="/clubs" className="btn-primary">
            Ver todos los Clubs
          </Link>
        </div>
      </div>
    );
  }

  const upcomingEvents = events.filter(event => 
    event.clubId === club.id && new Date(event.date) >= new Date()
  ).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastEvents = events.filter(event => 
    event.clubId === club.id && new Date(event.date) < new Date()
  ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 9);

  const clubDJs = djs.filter(dj => 
    [...upcomingEvents, ...pastEvents].some(event => event.djIds?.includes(dj.id))
  ).slice(0, 6);

  const clubPromoters = promoters.filter(promoter => 
    [...upcomingEvents, ...pastEvents].some(event => event.promoterId === promoter.id)
  ).slice(0, 4);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: club.name,
          text: `Descubre ${club.name} - Club en Ibiza`,
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

  return (
    <div className="min-h-screen bg-brand-black py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="relative mb-12 animate-fade-in">
          <div className="glass rounded-3xl overflow-hidden">
            {/* Background Image */}
            <div className="relative h-96 lg:h-[600px]">
              {club.imageUrl ? (
                <img 
                  src={club.imageUrl}
                  alt={club.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-brand-surface to-brand-surface-variant">
                  <BuildingOfficeIcon className="h-32 w-32 text-brand-gray"/>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/30 to-transparent"></div>
              
              {/* Overlaid Information */}
              <div className="absolute inset-0 flex items-end p-8 lg:p-12">
                <div className="w-full">
                  <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                    <div className="space-y-4">
                      <h1 className="text-5xl lg:text-7xl font-bold text-gradient">{club.name}</h1>
                      
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center bg-brand-orange/20 px-4 py-2 rounded-full backdrop-blur-sm">
                          <MusicalNoteIcon className="w-5 h-5 text-brand-orange mr-2" />
                          <span className="text-brand-orange font-semibold">Electronic Music</span>
                        </div>
                        <div className="flex items-center bg-brand-purple/20 px-4 py-2 rounded-full backdrop-blur-sm">
                          <MapPinIcon className="w-5 h-5 text-brand-purple mr-2" />
                          <span className="text-brand-purple font-semibold">{club.location || 'Ibiza, España'}</span>
                        </div>
                        <div className="flex items-center bg-green-500/20 px-4 py-2 rounded-full backdrop-blur-sm">
                          <StarIcon className="w-5 h-5 text-green-400 mr-2" />
                          <span className="text-green-400 font-semibold">4.9 ★</span>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="flex space-x-6 text-brand-white">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-brand-orange">{upcomingEvents.length}</div>
                          <div className="text-sm text-brand-gray">Próximos</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-brand-purple">{pastEvents.length}</div>
                          <div className="text-sm text-brand-gray">Pasados</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">{clubDJs.length}</div>
                          <div className="text-sm text-brand-gray">DJs</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={toggleLike}
                        className={`flex items-center px-6 py-3 rounded-full transition-all duration-300 backdrop-blur-sm ${
                          isLiked 
                            ? 'bg-red-500 text-white shadow-red-500/25' 
                            : 'bg-brand-surface/80 border border-brand-orange/30 text-brand-orange hover:bg-brand-orange hover:text-white'
                        } shadow-lg`}
                      >
                        {isLiked ? (
                          <HeartSolidIcon className="w-5 h-5 mr-2" />
                        ) : (
                          <HeartIcon className="w-5 h-5 mr-2" />
                        )}
                        {isLiked ? 'Saved' : 'Save'}
                      </button>
                      
                      <button
                        onClick={handleShare}
                        className="flex items-center px-6 py-3 bg-brand-orange/80 text-white rounded-full hover:bg-brand-orange transition-all duration-300 shadow-lg backdrop-blur-sm"
                      >
                        <ShareIcon className="w-5 h-5 mr-2" />
                        Compartir
                      </button>

                      <Link
                        to="/events"
                        className="flex items-center px-6 py-3 bg-brand-purple/80 text-white rounded-full hover:bg-brand-purple transition-all duration-300 shadow-lg backdrop-blur-sm"
                      >
                        <CalendarDaysIcon className="w-5 h-5 mr-2" />
                        Ver Eventos
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="glass rounded-full p-2">
            <div className="flex space-x-2">
              {[
                { id: 'overview', label: 'Overview', icon: BuildingOfficeIcon },
                { id: 'events', label: 'Eventos', icon: CalendarDaysIcon },
                { id: 'gallery', label: 'Galería', icon: PhotoIcon }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-6 py-3 rounded-full transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-brand-orange text-white shadow-lg'
                      : 'text-brand-gray hover:text-brand-white hover:bg-brand-surface'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* About */}
                <div className="glass rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-gradient mb-6 flex items-center">
                    <SpeakerWaveIcon className="w-6 h-6 mr-3 text-brand-orange" />
                    Sobre {club.name}
                  </h2>
                  {club.description ? (
                    <div 
                      className="prose prose-lg max-w-none text-brand-gray leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: club.description.replace(/\n/g, '<br />') }} 
                    />
                  ) : (
                    <p className="text-brand-gray text-lg leading-relaxed">
                      {club.name} es uno de los clubs más exclusivos de Ibiza, reconocido por su ambiente único 
                      y su compromiso con la mejor música electrónica. Con una ubicación privilegiada y un sistema 
                      de sonido de última generación, {club.name} ofrece una experiencia nocturna incomparable.
                    </p>
                  )}
                </div>

                {/* Music & Atmosphere */}
                <div className="glass rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-gradient mb-6 flex items-center">
                    <SparklesIcon className="w-6 h-6 mr-3 text-brand-purple" />
                    Información del Club
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center p-4 bg-brand-surface rounded-xl border border-brand-orange/20">
                        <div className="w-12 h-12 bg-gradient-to-r from-brand-orange to-red-500 rounded-full flex items-center justify-center mr-4">
                          <MusicalNoteIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-brand-white">Electronic Music</h4>
                          <p className="text-brand-gray text-sm">Género principal</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-4 bg-brand-surface rounded-xl border border-brand-purple/20">
                        <div className="w-12 h-12 bg-gradient-to-r from-brand-purple to-blue-500 rounded-full flex items-center justify-center mr-4">
                          <UserGroupIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-brand-white">Capacidad</h4>
                          <p className="text-brand-gray text-sm">{club.capacity || '1500+'} personas</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center p-4 bg-brand-surface rounded-xl border border-green-400/20">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-4">
                          <ClockIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-brand-white">Horarios</h4>
                          <p className="text-brand-gray text-sm">23:00 - 06:00</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-4 bg-brand-surface rounded-xl border border-yellow-400/20">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mr-4">
                          <StarIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-brand-white">Rating</h4>
                          <p className="text-brand-gray text-sm">4.9/5 estrellas</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Featured Artists */}
                {clubDJs.length > 0 && (
                  <div className="glass rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-gradient mb-6 flex items-center">
                      <SparklesIcon className="w-6 h-6 mr-3 text-brand-orange" />
                      DJs Destacados
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {clubDJs.slice(0, 4).map(dj => (
                        <Link
                          key={dj.id}
                          to={`/djs/${dj.slug}`}
                          className="flex items-center p-4 bg-brand-surface hover:bg-brand-orange/20 rounded-xl transition-all duration-300 border border-brand-orange/20 hover:border-brand-orange/50"
                        >
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-orange mr-4">
                            {dj.imageUrl ? (
                              <img 
                                src={dj.imageUrl}
                                alt={dj.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-brand-surface to-brand-surface-variant flex items-center justify-center">
                                <MusicalNoteIcon className="w-6 h-6 text-brand-gray" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-brand-white">{dj.name}</h4>
                            <p className="text-brand-orange text-sm">{dj.genre || 'Electronic'}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Social Links */}
                {club.socialLinks && club.socialLinks.length > 0 && (
                  <div className="glass rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-brand-purple mb-4 flex items-center">
                      <LinkIcon className="w-5 h-5 mr-2 text-brand-orange" />
                      Redes Sociales
                    </h3>
                    <div className="space-y-3">
                      {club.socialLinks.map(link => (
                        <a 
                          key={link.platform} 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center p-3 bg-brand-surface hover:bg-brand-orange/20 rounded-lg transition-all duration-300 border border-brand-orange/20 hover:border-brand-orange/50"
                        >
                          <div className="w-10 h-10 bg-brand-orange rounded-full flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-sm">
                              {link.platform.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-brand-white font-medium">{link.platform}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Promoters */}
                {clubPromoters.length > 0 && (
                  <div className="glass rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-brand-purple mb-4">Promotores</h3>
                    <div className="space-y-3">
                      {clubPromoters.map(promoter => (
                        <Link
                          key={promoter.id}
                          to={`/promoters/${promoter.slug}`}
                          className="flex items-center p-3 bg-brand-surface hover:bg-brand-purple/20 rounded-lg transition-all duration-300 border border-brand-purple/20 hover:border-brand-purple/50"
                        >
                          <div className="w-10 h-10 bg-brand-purple rounded-full flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-sm">
                              {promoter.name.charAt(0)}
                            </span>
                          </div>
                          <span className="text-brand-white">{promoter.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-brand-purple mb-4">Información</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-brand-gray">
                      <MapPinIcon className="w-5 h-5 mr-3 text-brand-orange" />
                      <span className="text-sm">{club.location || 'Ibiza, España'}</span>
                    </div>
                    <div className="flex items-center text-brand-gray">
                      <ClockIcon className="w-5 h-5 mr-3 text-brand-purple" />
                      <span className="text-sm">Abierto: 23:00 - 06:00</span>
                    </div>
                    <div className="flex items-center text-brand-gray">
                      <MusicalNoteIcon className="w-5 h-5 mr-3 text-green-400" />
                      <span className="text-sm">Electronic Music</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-8">
              {/* Upcoming Events */}
              {upcomingEvents.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold text-gradient mb-8 flex items-center">
                    <ClockIcon className="w-8 h-8 mr-3 text-brand-orange" />
                    Próximos Eventos
                  </h2>
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {upcomingEvents.map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              )}

              {/* Past Events */}
              {pastEvents.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold text-gradient mb-8 flex items-center">
                    <CalendarDaysIcon className="w-8 h-8 mr-3 text-brand-purple" />
                    Eventos Pasados
                  </h2>
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {pastEvents.map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              )}

              {upcomingEvents.length === 0 && pastEvents.length === 0 && (
                <div className="text-center py-20">
                  <CalendarDaysIcon className="w-24 h-24 text-brand-gray mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-brand-white mb-4">No hay eventos</h3>
                  <p className="text-brand-gray">Este club aún no tiene eventos programados.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gradient mb-8 flex items-center">
                <PhotoIcon className="w-8 h-8 mr-3 text-brand-orange" />
                Galería de Fotos
              </h2>
              
              <div className="text-center py-20">
                <PhotoIcon className="w-24 h-24 text-brand-gray mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-brand-white mb-4">Galería próximamente</h3>
                <p className="text-brand-gray">La galería de fotos estará disponible pronto.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubProfilePage;