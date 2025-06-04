import React from 'react';
import DataMigrationPanel from '../components/admin/DataMigrationPanel';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const DataMigrationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-black relative overflow-hidden">
      {/* Fondo gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-black via-brand-black/95 to-brand-black"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-brand-orange/20">
          <div className="max-w-4xl mx-auto flex items-center">
            <Link 
              to="/" 
              className="inline-flex items-center text-brand-orange hover:text-brand-white transition-colors mr-6"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Volver al Inicio
            </Link>
            <h1 className="text-3xl font-black text-brand-white">
              Panel CMS - Sun & Flower Ibiza
            </h1>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <DataMigrationPanel />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-brand-orange/20">
          <div className="max-w-4xl mx-auto text-center text-brand-gray text-sm">
            <p>
              🌴 Sun & Flower Ibiza Calendar - Panel CMS & Administración
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataMigrationPage; 