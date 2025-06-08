import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserCircleIcon,
  CalendarDaysIcon,
  SparklesIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  MusicalNoteIcon,
  UserGroupIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Detectar scroll para cambiar la apariencia del navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
  // Cerrar menús al cambiar de ruta
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const closeMenu = () => setMobileMenuOpen(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'INICIO', icon: CalendarDaysIcon },
    { path: '/events', label: 'EVENTOS', icon: MusicalNoteIcon },
    { path: '/djs', label: 'DJS', icon: MusicalNoteIcon },
    { path: '/promoters', label: 'PROMOTORES', icon: UserGroupIcon },
    { path: '/clubs', label: 'CLUBS', icon: BuildingStorefrontIcon },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-brand-black/90 backdrop-blur-xl border-b border-brand-orange/20' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 group"
              onClick={closeMenu}
            >
              <div className="relative">
                <SparklesIcon className="w-8 h-8 text-brand-orange group-hover:text-brand-purple transition-colors duration-300" />
                <div className="absolute inset-0 w-8 h-8 bg-brand-orange/20 rounded-full blur-lg group-hover:bg-brand-purple/20 transition-colors duration-300"></div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`font-black text-sm tracking-wider transition-all duration-300 transform hover:scale-105 ${
                    isActive(path) 
                      ? 'text-brand-purple shadow-lg' 
                      : 'text-brand-purple hover:text-blue-400'
                  }`}
                  style={{
                    textShadow: isActive(path) ? '0 0 10px rgba(91, 62, 228, 0.8)' : '0 0 5px rgba(91, 62, 228, 0.3)'
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* User Menu / Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  {isAdmin() && (
                    <>
                      <Link
                        to="/admin/dashboard"
                        className="btn-outline px-4 py-2 text-sm rounded-lg flex items-center"
                      >
                        <Cog6ToothIcon className="w-4 h-4 mr-2" />
                        ADMIN
                      </Link>
                      <Link
                        to="/cms"
                        className="btn-outline px-4 py-2 text-sm rounded-lg flex items-center bg-brand-purple/20 text-brand-purple"
                      >
                        <Cog6ToothIcon className="w-4 h-4 mr-2" />
                        CMS
                      </Link>
                    </>
                  )}
                  
                  {/* Botón de Perfil mejorado */}
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 bg-gradient-to-r from-brand-orange to-brand-purple px-6 py-3 rounded-xl hover:from-brand-purple hover:to-brand-orange transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <UserCircleIcon className="w-6 h-6 text-brand-white" />
                    <div className="text-left">
                      <div className="text-brand-white font-bold text-sm">{currentUser.name}</div>
                      <div className="text-brand-white/80 text-xs">MI PERFIL</div>
                  </div>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="btn-outline px-4 py-2 text-sm rounded-lg flex items-center hover:bg-red-500 hover:border-red-500 transition-colors duration-300"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                    SALIR
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="font-black text-sm tracking-wider text-brand-purple hover:text-brand-orange transition-colors duration-300 transform hover:scale-105"
                    style={{ textShadow: '0 0 8px rgba(91, 62, 228, 0.3)' }}
                  >
                    INICIAR SESIÓN
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-brand-orange to-brand-purple text-brand-white font-black px-6 py-2 text-sm rounded-lg hover:from-brand-purple hover:to-brand-orange transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    REGISTRARSE
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-lg glass-orange hover:bg-brand-orange/20 transition-colors duration-300"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6 text-brand-orange" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-brand-orange" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
        mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-brand-black/90 backdrop-blur-xl"
          onClick={closeMenu}
        ></div>

        {/* Menu Content */}
        <div className={`absolute top-20 left-0 right-0 bg-gradient-surface border-b border-brand-orange/20 transition-all duration-500 ${
          mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}>
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Navigation Links */}
            <div className="space-y-6 mb-8">
              {navLinks.map(({ path, label }, index) => (
                <Link
                  key={path}
                  to={path}
                  onClick={closeMenu}
                  className={`flex items-center justify-center p-4 rounded-xl transition-all duration-300 animate-slide-down transform hover:scale-105 ${
                    isActive(path) 
                      ? 'bg-gradient-to-r from-brand-purple to-blue-500 text-brand-white shadow-lg' 
                      : 'glass hover:bg-gradient-to-r hover:from-brand-purple/20 hover:to-blue-500/20 text-brand-purple hover:text-blue-400 border hover:border-brand-purple/50'
                  }`}
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    boxShadow: isActive(path) ? '0 0 20px rgba(91, 62, 228, 0.5)' : undefined,
                    textShadow: '0 0 8px rgba(91, 62, 228, 0.4)'
                  }}
                >
                  <span className="text-lg font-black tracking-wider">{label}</span>
                </Link>
              ))}
            </div>

            {/* User Section */}
            <div className="border-t border-brand-orange/20 pt-8">
              {currentUser ? (
                <div className="space-y-4">
                  {/* User Info */}
                  <div className="flex items-center space-x-4 p-4 glass-orange rounded-xl">
                    <UserIcon className="w-8 h-8 text-brand-orange" />
                    <div>
                      <div className="text-brand-white font-bold">{currentUser.name}</div>
                      <div className="text-brand-gray text-sm">{currentUser.email}</div>
                    </div>
                  </div>

                  {/* Admin Link */}
                  {isAdmin() && (
                    <Link
                      to="/admin/dashboard"
                      onClick={closeMenu}
                      className="flex items-center space-x-4 p-4 glass-purple rounded-xl hover:bg-brand-purple/20 transition-colors duration-300"
                    >
                      <Cog6ToothIcon className="w-6 h-6 text-brand-purple" />
                      <span className="text-lg font-bold tracking-wider text-brand-white">PANEL ADMIN</span>
                    </Link>
                  )}

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-4 p-4 glass rounded-xl hover:bg-red-500/20 hover:border-red-500/30 transition-colors duration-300"
                  >
                    <ArrowRightOnRectangleIcon className="w-6 h-6 text-red-400" />
                    <span className="text-lg font-bold tracking-wider text-red-400">CERRAR SESIÓN</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="w-full flex items-center justify-center p-4 border-2 border-brand-purple/50 text-brand-purple hover:bg-brand-purple hover:text-brand-white rounded-xl text-lg font-black tracking-wider transition-all duration-300 transform hover:scale-105 shadow-lg"
                    style={{ textShadow: '0 0 8px rgba(91, 62, 228, 0.3)' }}
                  >
                    INICIAR SESIÓN
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="w-full flex items-center justify-center p-4 bg-gradient-to-r from-brand-orange to-brand-purple text-brand-white hover:from-brand-purple hover:to-brand-orange rounded-xl text-lg font-black tracking-wider transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    REGISTRARSE
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer para el navbar fijo */}
      <div className="h-20"></div>
    </>
  );
};

export default Navbar;