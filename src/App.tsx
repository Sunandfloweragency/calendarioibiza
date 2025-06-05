import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from './contexts/AuthContext';
import { UnifiedDataProvider } from './contexts/DataContext';
import DataPersistence from './components/DataPersistence';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import DJsPage from './pages/DJsPage';
import DJProfilePage from './pages/DJProfilePage';
import PromotersPage from './pages/PromotersPage';
import PromoterProfilePage from './pages/PromoterProfilePage';
import ClubsPage from './pages/ClubsPage';
import ClubProfilePage from './pages/ClubProfilePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import DataMigrationPage from './pages/DataMigrationPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminPendingApprovalsPage from './pages/AdminPendingApprovalsPage';
import AdminDJManagementPage from './pages/AdminDJManagementPage';
import AdminPromoterManagementPage from './pages/AdminPromoterManagementPage';
import AdminEventManagementPage from './pages/AdminEventManagementPage';
import AdminClubManagementPage from './pages/AdminClubManagementPage';
import UserDashboardPage from './pages/UserDashboardPage';
import LoadingSpinner from './components/common/LoadingSpinner';

// Componente para scrollear al top en cada navegación
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Loading fallback component
const PageLoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-brand-black flex items-center justify-center">
    <LoadingSpinner size="xl" text="CARGANDO..." variant="professional" />
  </div>
);

// Main App Component
const App: React.FC = () => {
  // Configurar basename para subdominio (se puede cambiar aquí)
  const basename = process.env.NODE_ENV === 'production' ? '/' : '/';

  return (
    <BrowserRouter 
      basename={basename}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
        <AuthProvider>
          <UnifiedDataProvider>
          <div className="App min-h-screen bg-brand-black text-brand-white">
            <ScrollToTop />
            <DataPersistence />
                <Navbar />
            
                <main className="relative">
              <Suspense fallback={<PageLoadingFallback />}>
                  <Routes>
                  {/* Rutas principales */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/events/:slug" element={<EventDetailPage />} />
                    <Route path="/djs" element={<DJsPage />} />
                    <Route path="/djs/:slug" element={<DJProfilePage />} />
                    <Route path="/promoters" element={<PromotersPage />} />
                    <Route path="/promoters/:slug" element={<PromoterProfilePage />} />
                    <Route path="/clubs" element={<ClubsPage />} />
                    <Route path="/clubs/:slug" element={<ClubProfilePage />} />
                  
                  {/* Rutas de autenticación */}
                    <Route path="/login" element={<LoginPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                    
                  {/* Rutas de usuario autenticado */}
                  <Route path="/user/dashboard" element={
                    <ProtectedRoute>
                      <UserDashboardPage />
                    </ProtectedRoute>
                  } />
                    
                  {/* Rutas de administración protegidas */}
                  <Route path="/admin/dashboard" element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin/users" element={
                    <ProtectedRoute adminOnly>
                      <AdminUsersPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin/pending-approvals" element={
                    <ProtectedRoute adminOnly>
                      <AdminPendingApprovalsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin/events" element={
                    <ProtectedRoute adminOnly>
                      <AdminEventManagementPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin/djs" element={
                    <ProtectedRoute adminOnly>
                      <AdminDJManagementPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin/promoters" element={
                    <ProtectedRoute adminOnly>
                      <AdminPromoterManagementPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin/clubs" element={
                    <ProtectedRoute adminOnly>
                      <AdminClubManagementPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Panel de migración (sin protección para desarrollo) */}
                  <Route path="/cms" element={<DataMigrationPage />} />
                  
                  {/* Redirecciones */}
                  <Route path="/home" element={<Navigate to="/" replace />} />
                  <Route path="/calendar" element={<Navigate to="/" replace />} />
                  <Route path="/migration" element={<Navigate to="/cms" replace />} />
                  <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                  
                  {/* 404 - Redirigir a home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
              </Suspense>
                </main>
            </div>
            <SpeedInsights />
            <Analytics />
          </UnifiedDataProvider>
        </AuthProvider>
      </BrowserRouter>
  );
};

export default App;
