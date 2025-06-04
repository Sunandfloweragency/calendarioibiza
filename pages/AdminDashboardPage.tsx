import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import CMSLayout from '../components/cms/CMSLayout';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminDashboardPage: React.FC = () => {
  const { events, djs, promoters, clubs, users, getPendingEvents, getPendingDJs, getPendingPromoters, getPendingClubs, isLoading } = useData();

  const pendingApprovalsCount = getPendingEvents().length + getPendingDJs().length + getPendingPromoters().length + getPendingClubs().length;

  const stats = [
    { name: 'Aprobaciones Pendientes', count: pendingApprovalsCount, link: '/admin/pending-approvals', emphasis: true },
    { name: 'Gestionar Eventos', count: events.length, link: '/admin/events' },
    { name: 'Gestionar DJs', count: djs.length, link: '/admin/djs' },
    { name: 'Gestionar Promotoras', count: promoters.length, link: '/admin/promoters' },
    { name: 'Gestionar Clubs', count: clubs.length, link: '/admin/clubs' },
    { name: 'Gestionar Usuarios', count: users.length, link: '/admin/users' },
  ];

  const quickLinks = [
    { name: "Aprobaciones Pendientes", path: "/admin/pending-approvals" },
    { name: "Gestionar Eventos", path: "/admin/events" },
    { name: "Gestionar DJs", path: "/admin/djs" },
    { name: "Gestionar Promotoras", path: "/admin/promoters" },
    { name: "Gestionar Clubs", path: "/admin/clubs" },
    { name: "Gestionar Usuarios", path: "/admin/users" },
  ];

  return (
    <CMSLayout title="Panel de Control">
      <p className="text-brand-gray mb-8 text-lg">
        Bienvenido al Panel de Administración del Calendario Sun and Flower Ibiza. Gestiona todo el contenido y usuarios.
      </p>
      
      {isLoading ? (
         <div className="flex justify-center items-center py-10">
           <LoadingSpinner size="lg" />
         </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {stats.map(stat => (
            <Link 
              to={stat.link} 
              key={stat.name} 
              className={`block p-6 rounded-lg shadow-main-card hover:shadow-main-card-hover transition-all duration-300 transform hover:-translate-y-1 
                ${stat.emphasis ? 'bg-brand-orange text-white hover:bg-opacity-90' : 'bg-brand-surface-variant hover:bg-brand-surface'}`}
            >
              <h3 className={`text-xl font-semibold ${stat.emphasis ? 'text-white' : 'text-brand-purple'}`}>
                {stat.name}
              </h3>
              <p className={`text-4xl font-bold my-2 ${stat.emphasis ? 'text-white' : 'text-brand-orange'}`}>
                {stat.count}
              </p>
              <span className={`text-sm flex items-center ${stat.emphasis ? 'text-gray-200 hover:underline' : 'text-brand-purple hover:underline'}`}>
                Gestionar <ArrowRightCircleIcon className="h-4 w-4 ml-1" />
              </span>
            </Link>
          ))}
        </div>
      )}

      <h2 className="text-2xl font-headings text-brand-purple mb-4">Enlaces Rápidos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickLinks.map(item => (
            <Link 
                key={item.path}
                to={item.path}
                className="bg-brand-purple text-white p-4 rounded-lg hover:bg-brand-orange transition-colors duration-300 text-center font-medium shadow-md hover:shadow-lg"
            >
                {item.name}
            </Link>
        ))}
      </div>
    </CMSLayout>
  );
};

export default AdminDashboardPage;