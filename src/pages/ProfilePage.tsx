import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import FloatingElements from '../components/3D/FloatingElements';
import HolographicCard from '../components/3D/HolographicCard';
import NeonButton from '../components/3D/NeonButton';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  UserCircleIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  CogIcon,
  HeartIcon,
  TicketIcon
} from '@heroicons/react/24/outline';

const ProfilePage: React.FC = () => {
  const { currentUser, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'favorites' | 'tickets'>('profile');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center relative overflow-hidden">
        <FloatingElements count={20} speed={1.2} />
        <div className="relative z-10">
          <LoadingSpinner 
            size="xl" 
            text="CARGANDO PERFIL" 
            variant="professional" 
          />
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center relative overflow-hidden">
        <FloatingElements count={20} speed={1.2} />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold text-brand-white mb-4">Acceso Denegado</h1>
          <p className="text-brand-gray mb-8">Debes iniciar sesión para ver tu perfil</p>
          <NeonButton variant="primary" onClick={() => window.location.href = '/login'}>
            INICIAR SESIÓN
          </NeonButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black relative overflow-hidden">
      <FloatingElements count={25} speed={0.6} />

      {/* Header */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-mega text-gradient mb-6 leading-tight">
              MI
              <br />
              <span className="text-gradient-reverse">PERFIL</span>
            </h1>
            <p className="text-xl text-brand-gray">
              Gestiona tu cuenta y preferencias
            </p>
          </div>
        </div>
      </section>

      {/* Contenido principal */}
      <section className="relative pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Información del usuario */}
          <HolographicCard className="mb-8">
            <div className="flex items-center gap-6 p-8">
              <div className="w-24 h-24 bg-gradient-to-br from-brand-orange to-brand-gold rounded-full flex items-center justify-center flex-shrink-0">
                <UserCircleIcon className="w-16 h-16 text-brand-white" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-brand-white mb-2">{currentUser.name}</h2>
                <div className="flex items-center gap-2 text-brand-gray mb-4">
                  <EnvelopeIcon className="w-5 h-5" />
                  <span>{currentUser.email}</span>
                </div>
                <div className="flex items-center gap-2 text-brand-gray">
                  <CalendarDaysIcon className="w-5 h-5" />
                  <span>Miembro desde {new Date(currentUser.registrationDate || Date.now()).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="flex-shrink-0">
                <NeonButton variant="secondary" size="sm">
                  <CogIcon className="w-5 h-5 mr-2" />
                  EDITAR
                </NeonButton>
              </div>
            </div>
          </HolographicCard>

          {/* Tabs */}
          <div className="mb-8">
            <div className="bg-gradient-to-br from-brand-surface/50 to-brand-surface-variant/50 backdrop-blur-md rounded-2xl border border-brand-orange/20 p-2">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 flex items-center justify-center px-6 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === 'profile'
                      ? 'bg-brand-orange text-brand-white shadow-orange-glow'
                      : 'text-brand-white/70 hover:text-brand-white hover:bg-brand-surface/30'
                  }`}
                >
                  <UserCircleIcon className="w-5 h-5 mr-2" />
                  Perfil
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`flex-1 flex items-center justify-center px-6 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === 'favorites'
                      ? 'bg-brand-orange text-brand-white shadow-orange-glow'
                      : 'text-brand-white/70 hover:text-brand-white hover:bg-brand-surface/30'
                  }`}
                >
                  <HeartIcon className="w-5 h-5 mr-2" />
                  Favoritos
                </button>
                <button
                  onClick={() => setActiveTab('tickets')}
                  className={`flex-1 flex items-center justify-center px-6 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === 'tickets'
                      ? 'bg-brand-orange text-brand-white shadow-orange-glow'
                      : 'text-brand-white/70 hover:text-brand-white hover:bg-brand-surface/30'
                  }`}
                >
                  <TicketIcon className="w-5 h-5 mr-2" />
                  Entradas
                </button>
              </div>
            </div>
          </div>

          {/* Contenido de tabs */}
          <HolographicCard>
            <div className="p-8">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gradient mb-6">Información Personal</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-brand-white font-medium mb-2">Nombre</label>
                      <input
                        type="text"
                        value={currentUser.name}
                        disabled
                        className="w-full px-4 py-3 bg-brand-surface border border-brand-orange/30 rounded-xl text-brand-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-brand-white font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={currentUser.email}
                        disabled
                        className="w-full px-4 py-3 bg-brand-surface border border-brand-orange/30 rounded-xl text-brand-white"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-brand-orange/20">
                    <h4 className="text-lg font-bold text-brand-white mb-4">Preferencias</h4>
                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <span className="text-brand-white">Recibir notificaciones de nuevos eventos</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <span className="text-brand-white">Newsletter semanal</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'favorites' && (
                <div className="text-center py-12">
                  <HeartIcon className="w-16 h-16 text-brand-white/30 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-brand-white mb-4">
                    Eventos Favoritos
                  </h3>
                  <p className="text-brand-gray mb-8">
                    Aquí aparecerán los eventos que marques como favoritos
                  </p>
                  <NeonButton variant="primary" onClick={() => window.location.href = '/events'}>
                    EXPLORAR EVENTOS
                  </NeonButton>
                </div>
              )}

              {activeTab === 'tickets' && (
                <div className="text-center py-12">
                  <TicketIcon className="w-16 h-16 text-brand-white/30 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-brand-white mb-4">
                    Mis Entradas
                  </h3>
                  <p className="text-brand-gray mb-8">
                    Aquí aparecerán las entradas que hayas comprado
                  </p>
                  <NeonButton variant="primary" onClick={() => window.location.href = '/events'}>
                    COMPRAR ENTRADAS
                  </NeonButton>
                </div>
              )}
            </div>
          </HolographicCard>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage; 