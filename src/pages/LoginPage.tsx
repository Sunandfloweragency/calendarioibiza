import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ADMIN_USERNAME } from '../constants'; 
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  UserIcon, 
  LockClosedIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login, currentUser, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Usuarios de prueba para mostrar al usuario
  const testUsers = [
    {
      username: 'AdminSF',
      password: 'admin123',
      role: 'Administrador',
      description: 'Acceso completo al dashboard'
    },
    {
      username: 'usuario@test.com', 
      password: '12345678',
      role: 'Usuario',
      description: 'Acceso básico a la plataforma'
    }
  ];

  useEffect(() => {
    if (currentUser) {
      setSuccessMessage(`¡Bienvenido ${currentUser.name}!`);
      
      setTimeout(() => {
      console.log('Redirigiendo usuario después de login:', currentUser);
      if (currentUser.role === 'admin') {
        console.log('Redirigiendo a admin dashboard');
        navigate('/admin/dashboard');
      } else {
        console.log('Redirigiendo a user dashboard');
        navigate('/user/dashboard');
      }
      }, 1500);
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoggingIn(true);
    
    try {
      console.log('🔐 Iniciando sesión...', { username });
      
        const loggedInUser = await login(username, password); 
        
        if (loggedInUser) {
        console.log('✅ Login exitoso:', loggedInUser);
        setSuccessMessage(`¡Bienvenido ${loggedInUser.name}!`);
          } else {
        setError('Credenciales incorrectas. Verifica tu usuario y contraseña.');
          setPassword('');
        }
    } catch (err: any) {
      console.error('❌ Error en login:', err);
      setError(err.message || 'Error al iniciar sesión. Inténtalo de nuevo.');
        setPassword('');
    } finally {
    setIsLoggingIn(false);
    }
  };

  const quickLogin = (testUser: typeof testUsers[0]) => {
    setUsername(testUser.username);
    setPassword(testUser.password);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-orange mx-auto"></div>
          <p className="text-brand-gray mt-4">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-black via-gray-900 to-brand-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-brand-orange to-brand-purple rounded-full flex items-center justify-center mb-4">
            <UserIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Sun & Flower Ibiza
        </h1>
          <p className="text-gray-400">
            Inicia sesión para acceder al dashboard
          </p>
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
            <span className="text-red-400 text-sm">{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center space-x-2">
            <CheckCircleIcon className="w-5 h-5 text-green-500" />
            <span className="text-green-400 text-sm">{successMessage}</span>
          </div>
        )}

        {/* Formulario de login */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo de usuario */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Usuario o Email
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                  placeholder="AdminSF"
            required
                />
              </div>
            </div>

            {/* Campo de contraseña */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Contraseña
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                  placeholder="Introduce tu contraseña"
            required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Botón de login */}
            <button
              type="submit"
              disabled={isLoggingIn || !username || !password}
              className="w-full bg-gradient-to-r from-brand-orange to-brand-purple text-white font-semibold py-3 px-4 rounded-lg hover:from-brand-purple hover:to-brand-orange transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoggingIn ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Enlaces adicionales */}
          <div className="mt-6 text-center">
            <Link 
              to="/register" 
              className="text-sm text-gray-400 hover:text-brand-orange transition-colors duration-300"
            >
              ¿No tienes cuenta? Regístrate aquí
            </Link>
          </div>
        </div>

        {/* Usuarios de prueba */}
        <div className="mt-8 bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">
            👤 Usuarios de Prueba
          </h3>
          <div className="space-y-3">
            {testUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{user.username}</div>
                  <div className="text-xs text-gray-400">{user.role} - {user.description}</div>
                  <div className="text-xs text-brand-orange">Contraseña: {user.password}</div>
                </div>
                <button
                  onClick={() => quickLogin(user)}
                  className="px-3 py-1 bg-brand-orange text-white text-xs rounded-lg hover:bg-brand-purple transition-colors duration-300"
                >
                  Usar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
