import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EventCard from '../components/EventCard';
import { 
  MusicalNoteIcon, 
  LinkIcon, 
  CalendarDaysIcon,
  PlayIcon,
  HeartIcon,
  ShareIcon,
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  SpeakerWaveIcon,
  StarIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const DJProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getDJBySlug, events, clubs, isLoading } = useData();
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'gallery'>('overview');

  if (isLoading) return <div className="flex justify-center items-center h-screen"><LoadingSpinner size="lg" /></div>;

  const dj = slug ? getDJBySlug(slug) : undefined;

  if (!dj) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-brand-white mb-4">DJ no encontrado</h2>
          <p className="text-brand-gray mb-8">El DJ que buscas no existe o ha sido eliminado.</p>
          <Link to="/djs" className="btn-primary">
            Ver todos los DJs
          </Link>
        </div>
      </div>
    );
  }

  const upcomingEvents = events.filter(event => 
    event.djIds?.includes(dj.id) && new Date(event.date) >= new Date()
  ).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastEvents = events.filter(event => 
    event.djIds?.includes(dj.id) && new Date(event.date) < new Date()
  ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);

  const djClubs = clubs.filter(club => 
    upcomingEvents.some(event => event.clubId === club.id)
  );

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: dj.name,
          text: `Descubre a ${dj.name} - ${dj.genre || 'Electronic Music'}`,
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
            <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/20 via-brand-purple/20 to-transparent"></div>
            
            <div className="relative p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row items-start gap-8">
                {/* DJ Image */}
                <div className="relative group">
                  <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-brand-orange shadow-2xl">
                    {dj.imageUrl ? (
                      <img 
                        src={dj.imageUrl}
                        alt={dj.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-brand-surface to-brand-surface-variant flex items-center justify-center">
                        <MusicalNoteIcon className="w-32 h-32 text-brand-gray" />
                      </div>
                    )}
                  </div>
                  
                  {/* Floating Play Button */}
                  <button className="absolute bottom-4 right-4 w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300 group-hover:bg-brand-purple">
                    <PlayIcon className="w-8 h-8 text-white ml-1" />
                  </button>
                </div>

                {/* DJ Info */}
                <div className="flex-1 space-y-6">
                  <div>
                    <h1 className="text-5xl lg:text-7xl font-bold text-gradient mb-4">{dj.name}</h1>
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <div className="flex items-center bg-brand-orange/20 px-4 py-2 rounded-full">
                        <MusicalNoteIcon className="w-5 h-5 text-brand-orange mr-2" />
                        <span className="text-brand-orange font-semibold">{dj.genre || 'Electronic'}</span>
                      </div>
                      <div className="flex items-center bg-brand-purple/20 px-4 py-2 rounded-full">
                        <MapPinIcon className="w-5 h-5 text-brand-purple mr-2" />
                        <span className="text-brand-purple font-semibold">Ibiza, España</span>
                      </div>
                      <div className="flex items-center bg-green-500/20 px-4 py-2 rounded-full">
                        <StarIcon className="w-5 h-5 text-green-400 mr-2" />
                        <span className="text-green-400 font-semibold">4.9 ★</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-brand-orange">{upcomingEvents.length}</div>
                      <div className="text-brand-gray text-sm">Próximos Shows</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-brand-purple">{pastEvents.length}</div>
                      <div className="text-brand-gray text-sm">Shows Pasados</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400">{djClubs.length}</div>
                      <div className="text-brand-gray text-sm">Clubs</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={toggleLike}
                      className={`flex items-center px-6 py-3 rounded-full transition-all duration-300 ${
                        isLiked 
                          ? 'bg-red-500 text-white shadow-red-500/25' 
                          : 'bg-brand-surface border border-brand-orange/30 text-brand-orange hover:bg-brand-orange hover:text-white'
                      } shadow-lg`}
                    >
                      {isLiked ? (
                        <HeartSolidIcon className="w-5 h-5 mr-2" />
                      ) : (
                        <HeartIcon className="w-5 h-5 mr-2" />
                      )}
                      {isLiked ? 'Liked' : 'Like'}
                    </button>
                    
                    <button
                      onClick={handleShare}
                      className="flex items-center px-6 py-3 bg-brand-purple text-white rounded-full hover:bg-brand-purple/80 transition-all duration-300 shadow-lg"
                    >
                      <ShareIcon className="w-5 h-5 mr-2" />
                      Compartir
                    </button>

                    <Link
                      to="/events"
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-brand-orange to-brand-purple text-white rounded-full hover:scale-105 transition-all duration-300 shadow-lg"
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

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="glass rounded-full p-2">
            <div className="flex space-x-2">
              {[
                { id: 'overview', label: 'Overview', icon: UserGroupIcon },
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
              {/* Bio */}
              <div className="lg:col-span-2 glass rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gradient mb-6 flex items-center">
                  <SpeakerWaveIcon className="w-6 h-6 mr-3 text-brand-orange" />
                  Sobre {dj.name}
                </h2>
                {dj.description ? (
                  <div 
                    className="prose prose-lg max-w-none text-brand-gray leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: dj.description.replace(/\n/g, '<br />') }} 
                  />
                ) : (
                  <p className="text-brand-gray text-lg leading-relaxed">
                    {dj.name} es un talentoso DJ especializado en {dj.genre || 'música electrónica'} que ha cautivado 
                    a audiencias en Ibiza y más allá. Con un estilo único y una energía contagiosa, 
                    {dj.name} ofrece sets memorables que mantienen a la multitud bailando toda la noche.
                  </p>
                )}

                {/* Music Style */}
                <div className="mt-8 p-6 bg-gradient-to-r from-brand-orange/10 to-brand-purple/10 rounded-xl border border-brand-orange/20">
                  <h3 className="text-xl font-bold text-brand-orange mb-4">Estilo Musical</h3>
                  <div className="flex flex-wrap gap-3">
                    {(dj.genre || 'House,Techno,Progressive').split(',').map((style, index) => (
                      <span 
                        key={index}
                        className="px-4 py-2 bg-brand-surface rounded-full text-brand-white border border-brand-orange/30"
                      >
                        {style.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Social Links */}
                {dj.socialLinks && dj.socialLinks.length > 0 && (
                  <div className="glass rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-brand-purple mb-4 flex items-center">
                      <LinkIcon className="w-5 h-5 mr-2 text-brand-orange" />
                      Conecta
                    </h3>
                    <div className="space-y-3">
                      {dj.socialLinks.map(link => (
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

                {/* Clubs frecuentes */}
                {djClubs.length > 0 && (
                  <div className="glass rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-brand-purple mb-4">Clubs Frecuentes</h3>
                    <div className="space-y-3">
                      {djClubs.slice(0, 3).map(club => (
                        <Link
                          key={club.id}
                          to={`/clubs/${club.slug}`}
                          className="flex items-center p-3 bg-brand-surface hover:bg-brand-purple/20 rounded-lg transition-all duration-300 border border-brand-purple/20 hover:border-brand-purple/50"
                        >
                          <div className="w-10 h-10 bg-brand-purple rounded-full flex items-center justify-center mr-3">
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
                    Próximos Shows
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
                    Shows Pasados
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
                  <p className="text-brand-gray">Este DJ aún no tiene eventos programados.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="glass rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-gradient mb-8 flex items-center">
                <PhotoIcon className="w-8 h-8 mr-3 text-brand-orange" />
                Galería
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

export default DJProfilePage;