import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { UserGroupIcon, StarIcon } from '@heroicons/react/24/outline';

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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span style={{ color: '#FF9000' }}>PROMOTORES</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Descubre los mejores promotores de eventos en Ibiza
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Buscar promotores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 bg-gray-900 border border-gray-700 rounded-lg text-white"
          />
        </div>

        {/* Promoters Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPromoters.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <UserGroupIcon className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">No hay promotores disponibles</p>
            </div>
          ) : (
            filteredPromoters.map((promoter) => (
              <Link
                key={promoter.id}
                to={`/promoters/${promoter.slug}`}
                className="block bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-orange-500 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: '#FF9000' }}
                  >
                    {promoter.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-white">
                      {promoter.name}
                    </h3>
                    <p className="text-sm text-gray-400">Promotor</p>
                  </div>
                </div>
                
                {promoter.description && (
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {promoter.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-yellow-400">
                    <StarIcon className="w-4 h-4 mr-1" />
                    <span className="text-sm">4.5</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    Ver perfil →
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PromotersPage;