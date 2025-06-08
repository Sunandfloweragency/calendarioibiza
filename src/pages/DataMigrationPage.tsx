import React from 'react';
import DataMigrationPanel from '../components/admin/DataMigrationPanel';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const DataMigrationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
      {/* Fondo animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-black via-brand-surface to-brand-black animate-gradientBG"></div>
      
      {/* Partículas de fondo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-2 h-2 bg-brand-orange rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-3 h-3 bg-brand-purple rounded-full animate-bounce-gentle"></div>
        <div className="absolute bottom-20 left-20 w-2 h-2 bg-brand-orange rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-10 right-10 w-3 h-3 bg-brand-purple rounded-full animate-bounce-gentle" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header mejorado */}
        <div className="p-6 border-b border-brand-orange/20 backdrop-blur-sm bg-brand-black/50">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <Link 
                to="/" 
                className="inline-flex items-center text-brand-orange hover:text-brand-orange-light transition-colors duration-300 mr-6 group"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                Volver al Inicio
              </Link>
              
              <div className="flex items-center">
                <ShieldCheckIcon className="w-8 h-8 text-brand-purple mr-3" />
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-brand-white">
                    Panel CMS
                  </h1>
                  <p className="text-brand-gray text-sm">
                    Sun & Flower Ibiza Calendar
                  </p>
                </div>
              </div>
            </div>
            
            {/* Indicador de estado */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-brand-gray text-sm">Sistema Operativo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Título de bienvenida */}
            <div className="mb-8 text-center">
              <h2 className="text-4xl font-black text-gradient mb-3">
                🚀 Centro de Migración de Datos
              </h2>
              <p className="text-brand-gray text-lg max-w-3xl mx-auto">
                Gestiona la migración de datos entre localStorage y Supabase de forma segura y eficiente
              </p>
            </div>
            
            {/* Panel principal */}
            <div className="animate-fade-in">
              <DataMigrationPanel />
            </div>
          </div>
        </div>

        {/* Footer mejorado */}
        <div className="p-6 border-t border-brand-orange/20 backdrop-blur-sm bg-brand-black/50">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <p className="text-brand-gray text-sm flex items-center justify-center md:justify-start">
                  <span className="mr-2">🌴</span>
                  Sun & Flower Ibiza Calendar - Panel CMS & Administración
                </p>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-brand-gray">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-brand-orange rounded-full"></div>
                  <span>localStorage</span>
                </div>
                <div className="w-px h-4 bg-brand-gray"></div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-brand-purple rounded-full"></div>
                  <span>Supabase</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataMigrationPage; 