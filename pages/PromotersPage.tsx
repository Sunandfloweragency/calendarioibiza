import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { UserGroupIcon, StarIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const PromotersPage: React.FC = () => {
  const { promoters, loading } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPromoters = useMemo(() => {
    return promoters.filter(promoter => 
      promoter.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [promoters, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black text-brand-white relative overflow-hidden">
      {/* Fondo de partículas animadas */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 bg-brand-purple/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 left-20 w-48 h-48 bg-brand-orange/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-56 h-56 bg-brand-purple/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
              PROMOTORES
            </h1>
            <p className="text-lg text-brand-gray max-w-2xl mx-auto">
              Descubre los mejores promotores de eventos en Ibiza
            </p>
          </div>

          {/* Search */}
          <div className="mb-12 animate-slide-up-fade">
            <div className="glass rounded-2xl p-6 shadow-main-card border border-brand-white/10">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-6 w-6 text-brand-purple" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar promotores por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-brand-surface border border-brand-purple/20 rounded-xl text-brand-white placeholder-brand-gray focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Promoters Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up-fade">
            {filteredPromoters.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="glass rounded-3xl p-12 max-w-md mx-auto shadow-main-card">
                  <UserGroupIcon className="w-16 h-16 mx-auto text-brand-purple mb-6" />
                  <h3 className="text-2xl font-bold text-brand-white mb-4">
                    No hay promotores disponibles
                  </h3>
                  <p className="text-brand-gray">
                    Intenta con otros términos de búsqueda
                  </p>
                </div>
              </div>
            ) : (
              filteredPromoters.map((promoter, index) => (
                <Link
                  key={promoter.id}
                  to={`/promoters/${promoter.slug}`}
                  className="group glass rounded-2xl p-6 border border-brand-white/10 hover:shadow-main-card-hover transition-all duration-500 hover-lift animate-on-scroll"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-orange rounded-full flex items-center justify-center text-brand-white font-bold text-lg shadow-orange-glow">
                      {promoter.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-brand-white group-hover:text-gradient transition-all duration-300">
                        {promoter.name}
                      </h3>
                      <p className="text-sm text-brand-purple font-medium">
                        Promotor
                      </p>
                    </div>
                  </div>
                  
                  {promoter.description && (
                    <p className="text-brand-gray text-sm mb-6 line-clamp-3 leading-relaxed">
                      {promoter.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-brand-gold">
                      <StarIcon className="w-5 h-5 mr-2" />
                      <span className="text-sm font-semibold">4.5</span>
                    </div>
                    <div className="inline-flex items-center text-brand-purple group-hover:text-brand-orange transition-colors duration-300 font-medium text-sm">
                      Ver perfil →
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Call to Action */}
          {filteredPromoters.length > 0 && (
            <div className="text-center mt-16 animate-fade-in">
              <div className="glass rounded-3xl p-8 max-w-2xl mx-auto shadow-main-card border border-brand-white/10">
                <h3 className="text-2xl font-bold text-gradient mb-4">
                  ¿Eres promotor?
                </h3>
                <p className="text-brand-gray mb-6">
                  Únete a nuestra plataforma y conecta con la mejor audiencia de Ibiza
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center bg-gradient-purple px-8 py-4 rounded-xl text-brand-white font-bold hover:shadow-purple-glow transition-all duration-300 transform hover:scale-105"
                >
                  Únete como promotor
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromotersPage;