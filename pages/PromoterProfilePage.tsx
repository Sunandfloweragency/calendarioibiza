import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EventCard from '../components/EventCard';
import { 
  LinkIcon, 
  TagIcon, 
  CalendarDaysIcon,
  BuildingOfficeIcon,
  TrophyIcon,
  ShareIcon,
  HeartIcon,
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  BoltIcon,
  SparklesIcon,
  PhotoIcon,
  MusicalNoteIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const PromoterProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getPromoterBySlug, events, clubs, djs, isLoading } = useData();
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'artists'>('overview');

  if (isLoading) return <div className="flex justify-center items-center h-screen"><LoadingSpinner size="lg" /></div>;

  const promoter = slug ? getPromoterBySlug(slug) : undefined;

  if (!promoter) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-brand-white mb-4">Promotor no encontrado</h2>
          <p className="text-brand-gray mb-8">El promotor que buscas no existe o ha sido eliminado.</p>
          <Link to="/promoters" className="btn-primary">
            Ver todos los Promotores
          </Link>
        </div>
      </div>
    );
  }

  const upcomingEvents = events.filter(event => 
    event.promoterId === promoter.id && new Date(event.date) >= new Date()
  ).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastEvents = events.filter(event => 
    event.promoterId === promoter.id && new Date(event.date) < new Date()
  ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 9);

  const promoterClubs = clubs.filter(club => 
    [...upcomingEvents, ...pastEvents].some(event => event.clubId === club.id)
  );

  const collaboratingDJs = djs.filter(dj => 
    [...upcomingEvents, ...pastEvents].some(event => event.djIds?.includes(dj.id))
  ).slice(0, 6);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: promoter.name,
          text: `Descubre a ${promoter.name} - Promotor de eventos en Ibiza`,
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
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 via-brand-orange/10 to-transparent"></div>
            
            <div className="relative p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Promoter Logo & Info */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-brand-purple shadow-2xl bg-brand-surface">
                        {promoter.imageUrl ? (
                          <img 
                            src={promoter.imageUrl}
                            alt={`${promoter.name} logo`}
                            className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BuildingOfficeIcon className="w-16 h-16 text-brand-gray" />
                          </div>
                        )}
                      </div>
                      
                      {/* Status Indicator */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-brand-black">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>

                    <div>
                      <h1 className="text-4xl lg:text-6xl font-bold text-gradient mb-2">{promoter.name}</h1>
                      <div className="flex items-center bg-brand-purple/20 px-4 py-2 rounded-full mb-4">
                        <TagIcon className="w-5 h-5 text-brand-purple mr-2" />
                        <span className="text-brand-purple font-semibold">Event Promoter</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center bg-brand-orange/20 px-4 py-2 rounded-full">
                      <MapPinIcon className="w-5 h-5 text-brand-orange mr-2" />
                      <span className="text-brand-orange font-semibold">Ibiza, España</span>
                    </div>
                    <div className="flex items-center bg-green-500/20 px-4 py-2 rounded-full">
                      <StarIcon className="w-5 h-5 text-green-400 mr-2" />
                      <span className="text-green-400 font-semibold">4.8 ★</span>
                    </div>
                    <div className="flex items-center bg-yellow-500/20 px-4 py-2 rounded-full">
                      <TrophyIcon className="w-5 h-5 text-yellow-400 mr-2" />
                      <span className="text-yellow-400 font-semibold">Premium</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={toggleLike}
                      className={`flex items-center px-6 py-3 rounded-full transition-all duration-300 ${
                        isLiked 
                          ? 'bg-red-500 text-white shadow-red-500/25' 
                          : 'bg-brand-surface border border-brand-purple/30 text-brand-purple hover:bg-brand-purple hover:text-white'
                      } shadow-lg`}
                    >
                      {isLiked ? (
                        <HeartSolidIcon className="w-5 h-5 mr-2" />
                      ) : (
                        <HeartIcon className="w-5 h-5 mr-2" />
                      )}
                      {isLiked ? 'Following' : 'Follow'}
                    </button>
                    
                    <button
                      onClick={handleShare}
                      className="flex items-center px-6 py-3 bg-brand-orange text-white rounded-full hover:bg-brand-orange/80 transition-all duration-300 shadow-lg"
                    >
                      <ShareIcon className="w-5 h-5 mr-2" />
                      Compartir
                    </button>

                    <Link
                      to="/events"
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-brand-purple to-brand-orange text-white rounded-full hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      <CalendarDaysIcon className="w-5 h-5 mr-2" />
                      Ver Eventos
                    </Link>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="glass rounded-2xl p-6 text-center border border-brand-purple/20">
                    <div className="w-12 h-12 bg-brand-purple rounded-full flex items-center justify-center mx-auto mb-3">
                      <CalendarDaysIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-brand-purple mb-1">{upcomingEvents.length}</div>
                    <div className="text-brand-gray text-sm">Próximos Eventos</div>
                  </div>

                  <div className="glass rounded-2xl p-6 text-center border border-brand-orange/20">
                    <div className="w-12 h-12 bg-brand-orange rounded-full flex items-center justify-center mx-auto mb-3">
                      <BoltIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-brand-orange mb-1">{pastEvents.length}</div>
                    <div className="text-brand-gray text-sm">Eventos Pasados</div>
                  </div>

                  <div className="glass rounded-2xl p-6 text-center border border-green-400/20">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <BuildingOfficeIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-green-400 mb-1">{promoterClubs.length}</div>
                    <div className="text-brand-gray text-sm">Clubs</div>
                  </div>

                  <div className="glass rounded-2xl p-6 text-center border border-yellow-400/20">
                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <UserGroupIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-yellow-400 mb-1">{collaboratingDJs.length}</div>
                    <div className="text-brand-gray text-sm">DJs</div>
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
                { id: 'overview', label: 'Overview', icon: UserGroupIcon },
                { id: 'events', label: 'Eventos', icon: CalendarDaysIcon },
                { id: 'artists', label: 'Artistas', icon: SparklesIcon }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-6 py-3 rounded-full transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-brand-purple text-white shadow-lg'
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
                    <BoltIcon className="w-6 h-6 mr-3 text-brand-purple" />
                    Sobre {promoter.name}
                  </h2>
                  {promoter.description ? (
                    <div 
                      className="prose prose-lg max-w-none text-brand-gray leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: promoter.description.replace(/\n/g, '<br />') }} 
                    />
                  ) : (
                    <p className="text-brand-gray text-lg leading-relaxed">
                      {promoter.name} es un reconocido promotor de eventos en Ibiza, especializado en crear 
                      experiencias únicas de música electrónica. Con años de experiencia en la industria, 
                      {promoter.name} ha establecido una reputación sólida organizando eventos inolvidables 
                      que combinan los mejores DJs, venues exclusivos y una producción de primera clase.
                    </p>
                  )}
                </div>

                {/* Event Types */}
                <div className="glass rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-gradient mb-6 flex items-center">
                    <SparklesIcon className="w-6 h-6 mr-3 text-brand-orange" />
                    Tipos de Eventos
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { type: 'Pool Parties', icon: '🏊‍♂️', color: 'from-blue-500 to-cyan-400' },
                      { type: 'Beach Clubs', icon: '🏖️', color: 'from-yellow-400 to-orange-500' },
                      { type: 'Underground', icon: '🎧', color: 'from-purple-500 to-pink-500' },
                      { type: 'Rooftop Events', icon: '🌃', color: 'from-indigo-500 to-purple-600' }
                    ].map((event, index) => (
                      <div 
                        key={index}
                        className="flex items-center p-4 bg-brand-surface rounded-xl border border-brand-orange/20 hover:border-brand-orange/50 transition-all duration-300"
                      >
                        <div className={`w-12 h-12 bg-gradient-to-r ${event.color} rounded-full flex items-center justify-center mr-4 text-2xl`}>
                          {event.icon}
                        </div>
                        <span className="text-brand-white font-semibold">{event.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Social Links */}
                {promoter.socialLinks && promoter.socialLinks.length > 0 && (
                  <div className="glass rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-brand-purple mb-4 flex items-center">
                      <LinkIcon className="w-5 h-5 mr-2 text-brand-orange" />
                      Conecta
                    </h3>
                    <div className="space-y-3">
                      {promoter.socialLinks.map(link => (
                        <a 
                          key={link.platform} 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center p-3 bg-brand-surface hover:bg-brand-purple/20 rounded-lg transition-all duration-300 border border-brand-purple/20 hover:border-brand-purple/50"
                        >
                          <div className="w-10 h-10 bg-brand-purple rounded-full flex items-center justify-center mr-3">
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

                {/* Top Clubs */}
                {promoterClubs.length > 0 && (
                  <div className="glass rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-brand-purple mb-4">Clubs Principales</h3>
                    <div className="space-y-3">
                      {promoterClubs.slice(0, 4).map(club => (
                        <Link
                          key={club.id}
                          to={`/clubs/${club.slug}`}
                          className="flex items-center p-3 bg-brand-surface hover:bg-brand-orange/20 rounded-lg transition-all duration-300 border border-brand-orange/20 hover:border-brand-orange/50"
                        >
                          <div className="w-10 h-10 bg-brand-orange rounded-full flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-sm">
                              {club.name.charAt(0)}
                            </span>
                          </div>
                          <span className="text-brand-white">{club.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-brand-purple mb-4">Estadísticas</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-brand-gray">Eventos este año</span>
                      <span className="text-brand-white font-bold">{upcomingEvents.length + pastEvents.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-brand-gray">Rating promedio</span>
                      <span className="text-green-400 font-bold">4.8 ★</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-brand-gray">Años en la industria</span>
                      <span className="text-brand-orange font-bold">8+</span>
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
                    <ClockIcon className="w-8 h-8 mr-3 text-brand-purple" />
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
                    <CalendarDaysIcon className="w-8 h-8 mr-3 text-brand-orange" />
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
                  <p className="text-brand-gray">Este promotor aún no tiene eventos programados.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'artists' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gradient mb-8 flex items-center">
                <SparklesIcon className="w-8 h-8 mr-3 text-brand-purple" />
                DJs Colaboradores
              </h2>
              
              {collaboratingDJs.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {collaboratingDJs.map(dj => (
                    <Link
                      key={dj.id}
                      to={`/djs/${dj.slug}`}
                      className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 border border-brand-orange/20 hover:border-brand-orange/50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-brand-orange">
                          {dj.imageUrl ? (
                            <img 
                              src={dj.imageUrl}
                              alt={dj.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-brand-surface to-brand-surface-variant flex items-center justify-center">
                              <MusicalNoteIcon className="w-8 h-8 text-brand-gray" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-brand-white mb-1">{dj.name}</h3>
                          <p className="text-brand-orange text-sm">{dj.genre || 'Electronic'}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <UserGroupIcon className="w-24 h-24 text-brand-gray mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-brand-white mb-4">No hay colaboraciones</h3>
                  <p className="text-brand-gray">Este promotor aún no ha trabajado con DJs.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromoterProfilePage;