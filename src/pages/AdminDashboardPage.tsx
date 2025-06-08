import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../hooks/useAuth';
import DatabaseStatus from '../components/admin/DatabaseStatus';
import EmergencyFix from '../components/admin/EmergencyFix';
import QuickDiagnostic from '../components/admin/QuickDiagnostic';
import { 
  UserGroupIcon, 
  MusicalNoteIcon, 
  CalendarDaysIcon, 
  BuildingStorefrontIcon,
  UserIcon,
  ClockIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  FireIcon,
  EyeIcon,
  WrenchScrewdriverIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const AdminDashboardPage: React.FC = () => {
  const { events, djs, promoters, clubs, users, loading } = useData();
  const { currentUser } = useAuth();
  const [showEmergencyPanel, setShowEmergencyPanel] = useState(false);

  // Datos en tiempo real
  const [realTimeData, setRealTimeData] = useState({
    events: events?.length || 0,
    djs: djs?.length || 0,
    promoters: promoters?.length || 0,
    clubs: clubs?.length || 0,
    users: users?.length || 0,
    lastUpdate: new Date().toLocaleTimeString()
  });

  // Actualizar datos en tiempo real
  useEffect(() => {
    setRealTimeData({
      events: events?.length || 0,
      djs: djs?.length || 0,
      promoters: promoters?.length || 0,
      clubs: clubs?.length || 0,
      users: users?.length || 0,
      lastUpdate: new Date().toLocaleTimeString()
    });
  }, [events, djs, promoters, clubs, users]);

  // Calcular estadísticas
  const totalContent = realTimeData.events + realTimeData.djs + realTimeData.promoters + realTimeData.clubs;
  const isSystemHealthy = totalContent > 0 && !loading;

  // Próximos eventos
  const upcomingEvents = events
    ?.filter(event => new Date(event.date) > new Date())
    ?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    ?.slice(0, 5) || [];

  const recentActivity = [
    { action: 'Nuevos eventos cargados', count: realTimeData.events, time: realTimeData.lastUpdate, type: 'success' },
    { action: 'DJs sincronizados', count: realTimeData.djs, time: realTimeData.lastUpdate, type: 'info' },
    { action: 'Promotores actualizados', count: realTimeData.promoters, time: realTimeData.lastUpdate, type: 'info' },
    { action: 'Clubs verificados', count: realTimeData.clubs, time: realTimeData.lastUpdate, type: 'success' }
  ];

  const managementCards = [
    {
      title: 'Eventos',
      count: realTimeData.events,
      icon: CalendarDaysIcon,
      link: '/admin/events',
      color: 'from-blue-600 to-blue-800',
      description: 'Gestionar eventos de música'
    },
    {
      title: 'DJs',
      count: realTimeData.djs,
      icon: MusicalNoteIcon,
      link: '/admin/djs',
      color: 'from-purple-600 to-purple-800',
      description: 'Administrar perfiles de DJs'
    },
    {
      title: 'Promotores',
      count: realTimeData.promoters,
      icon: UserGroupIcon,
      link: '/admin/promoters',
      color: 'from-green-600 to-green-800',
      description: 'Gestionar promotores'
    },
    {
      title: 'Clubs',
      count: realTimeData.clubs,
      icon: BuildingStorefrontIcon,
      link: '/admin/clubs',
      color: 'from-orange-600 to-orange-800',
      description: 'Administrar clubs y venues'
    },
    {
      title: 'Usuarios',
      count: realTimeData.users,
      icon: UserIcon,
      link: '/admin/users',
      color: 'from-pink-600 to-pink-800',
      description: 'Gestionar usuarios'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-brand-orange border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-xl">Cargando Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header del Dashboard */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold text-white mb-2">
                🎛️ Dashboard Admin
              </h1>
              <p className="text-blue-200 text-lg">
                ¡Bienvenido {currentUser?.name}! 
                Sistema actualizado: {realTimeData.lastUpdate}
              </p>
              <div className="flex items-center space-x-4 mt-4">
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                  isSystemHealthy ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                }`}>
                  {isSystemHealthy ? (
                    <CheckCircleIcon className="w-4 h-4" />
                  ) : (
                    <ExclamationTriangleIcon className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {isSystemHealthy ? 'Sistema Operativo' : 'Revisión Requerida'}
                  </span>
                </div>
                <div className="text-blue-300 text-sm">
                  Total contenido: {totalContent} elementos
                </div>
              </div>
            </div>

            {/* Botones de acción rápida */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowEmergencyPanel(!showEmergencyPanel)}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2"
              >
                <WrenchScrewdriverIcon className="w-4 h-4" />
                <span>Panel de Emergencia</span>
              </button>
              
              <Link
                to="/cms"
                className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2"
              >
                <CogIcon className="w-4 h-4" />
                <span>CMS Avanzado</span>
              </Link>

              <Link
                to="/"
                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2"
              >
                <EyeIcon className="w-4 h-4" />
                <span>Ver Sitio</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Panel de Emergencia */}
        {showEmergencyPanel && (
          <div className="mb-8">
            <EmergencyFix />
         </div>
        )}

        {/* Tarjetas de gestión */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {managementCards.map((card, index) => (
            <Link 
              key={card.title}
              to={card.link}
              className="group block"
            >
              <div className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <card.icon className="w-8 h-8" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{card.count}</div>
                    <div className="text-sm opacity-80">{card.title}</div>
                  </div>
                </div>
                <p className="text-sm opacity-90 mb-3">
                  {card.description}
              </p>
                <div className="flex items-center text-sm">
                  <span className="mr-2">Gestionar →</span>
                  <div className="flex-1 h-1 bg-white/20 rounded-full">
                    <div className="h-1 bg-white/60 rounded-full group-hover:w-full transition-all duration-500" style={{ width: '20%' }}></div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Estado de la base de datos */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <ChartBarIcon className="w-6 h-6 mr-3 text-green-400" />
              Estado del Sistema
            </h2>
            <DatabaseStatus />
          </div>

          {/* Próximos eventos */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <FireIcon className="w-6 h-6 mr-3 text-red-400" />
              Próximos Eventos
            </h2>
            
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={event.id} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-sm">{event.name}</h3>
                        <p className="text-blue-200 text-xs">Próximo evento</p>
                      </div>
                      <div className="text-right">
                        <div className="text-orange-300 text-xs font-medium">
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="text-purple-300 text-xs">
                          {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-blue-200 text-center py-8">No hay eventos próximos</p>
            )}
          </div>
        </div>

        {/* Actividad reciente */}
        <div className="mt-8 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <ClockIcon className="w-6 h-6 mr-3 text-yellow-400" />
            Actividad del Sistema
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-400' : 'bg-blue-400'
                  }`}></div>
                  <span className="text-xs text-blue-200">{activity.time}</span>
                </div>
                <p className="text-white text-sm font-medium mb-1">{activity.action}</p>
                <p className="text-2xl font-bold text-orange-300">{activity.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer del dashboard */}
        <div className="mt-8 text-center">
          <div className="bg-white/5 rounded-full px-6 py-3 inline-flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-blue-200 text-sm">
              Dashboard operativo • Sun & Flower Ibiza • {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;