import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../contexts/DataContext';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  ClockIcon,
  UserIcon,
  CogIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const QuickDiagnostic: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const { events, djs, promoters, clubs, loading } = useData();
  const [diagnosticResults, setDiagnosticResults] = useState<any[]>([]);

  useEffect(() => {
    const runDiagnostic = () => {
      const results = [
        {
          test: 'Autenticación de Usuario',
          status: currentUser ? 'success' : 'error',
          message: currentUser ? `Usuario: ${currentUser.name} (${currentUser.role})` : 'No hay usuario autenticado',
          action: currentUser ? null : 'Ir a Login',
          link: '/login'
        },
        {
          test: 'Permisos de Administrador',
          status: isAdmin() ? 'success' : 'warning',
          message: isAdmin() ? 'Permisos de admin confirmados' : 'Sin permisos de administrador',
          action: null,
          link: null
        },
        {
          test: 'Carga de Datos',
          status: loading ? 'loading' : (events.length > 0 ? 'success' : 'warning'),
          message: loading ? 'Cargando datos...' : `${events.length} eventos, ${djs.length} DJs, ${promoters.length} promotores, ${clubs.length} clubs`,
          action: null,
          link: null
        },
        {
          test: 'Dashboard de Admin',
          status: isAdmin() ? 'success' : 'error',
          message: isAdmin() ? 'Acceso al dashboard disponible' : 'Acceso denegado',
          action: isAdmin() ? 'Ir al Dashboard' : null,
          link: '/admin/dashboard'
        },
        {
          test: 'Panel CMS',
          status: 'success',
          message: 'Panel CMS siempre disponible',
          action: 'Ir al CMS',
          link: '/cms'
        }
      ];

      setDiagnosticResults(results);
    };

    runDiagnostic();
    const interval = setInterval(runDiagnostic, 5000); // Actualizar cada 5 segundos

    return () => clearInterval(interval);
  }, [currentUser, isAdmin, events, djs, promoters, clubs, loading]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'loading':
        return <ArrowPathIcon className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20';
      case 'error':
        return 'bg-red-500/10 border-red-500/20';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20';
      case 'loading':
        return 'bg-blue-500/10 border-blue-500/20';
      default:
        return 'bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <CogIcon className="w-6 h-6 mr-3 text-blue-400" />
          Diagnóstico del Sistema
        </h3>
        <div className="text-sm text-gray-400">
          {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="space-y-4">
        {diagnosticResults.map((result, index) => (
          <div key={index} className={`border rounded-lg p-4 ${getStatusBg(result.status)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(result.status)}
                <div>
                  <div className="text-white font-medium text-sm">
                    {result.test}
                  </div>
                  <div className="text-gray-300 text-xs">
                    {result.message}
                  </div>
                </div>
              </div>

              {result.action && result.link && (
                <Link
                  to={result.link}
                  className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-1 rounded-lg text-xs transition-colors duration-300"
                >
                  {result.action}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Estado general */}
      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-300">
            Estado general del sistema:
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            diagnosticResults.filter(r => r.status === 'success').length >= 3
              ? 'bg-green-500/20 text-green-300'
              : 'bg-yellow-500/20 text-yellow-300'
          }`}>
            {diagnosticResults.filter(r => r.status === 'success').length}/{diagnosticResults.length} OK
          </div>
        </div>
      </div>

      {/* Enlaces rápidos */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Link
          to="/login"
          className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 px-4 py-2 rounded-lg text-sm transition-colors duration-300 text-center"
        >
          🔐 Login
        </Link>
        <Link
          to="/admin/dashboard"
          className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-4 py-2 rounded-lg text-sm transition-colors duration-300 text-center"
        >
          🎛️ Dashboard
        </Link>
        <Link
          to="/cms"
          className="bg-green-500/20 hover:bg-green-500/30 text-green-300 px-4 py-2 rounded-lg text-sm transition-colors duration-300 text-center"
        >
          ⚙️ CMS
        </Link>
        <Link
          to="/"
          className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-lg text-sm transition-colors duration-300 text-center"
        >
          🏠 Inicio
        </Link>
      </div>
    </div>
  );
};

export default QuickDiagnostic; 