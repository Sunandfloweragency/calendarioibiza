
import React, { useState } from 'react';
import CMSLayout from '../components/cms/CMSLayout';
import { useData } from '../contexts/DataContext';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  CalendarDaysIcon,
  MusicalNoteIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';

interface PendingItem {
  id: string;
  name: string;
  description?: string;
  type: 'Event' | 'DJ' | 'Promoter' | 'Club';
  status: string;
  createdAt: string;
  submittedBy?: string;
  slug?: string;
}

const AdminPendingApprovalsPage: React.FC = () => {
  const { 
    events, djs, promoters, clubs,
    approveEvent, rejectEvent,
    approveDJ, rejectDJ,
    approvePromoter, rejectPromoter,
    approveClub, rejectClub,
    loading 
  } = useData();
  const [isSubmitting, setIsSubmitting] = useState<{[key: string]: boolean}>({});

  // Filtrar elementos pendientes
  const pendingEvents = events.filter(e => e.status === 'pending');
  const pendingDJs = djs.filter(d => d.status === 'pending');
  const pendingPromoters = promoters.filter(p => p.status === 'pending');
  const pendingClubs = clubs.filter(c => c.status === 'pending');

  const pendingItems: PendingItem[] = [
    ...pendingEvents.map(item => ({ ...item, type: 'Event' as 'Event' })),
    ...pendingDJs.map(item => ({ ...item, type: 'DJ' as 'DJ' })),
    ...pendingPromoters.map(item => ({ ...item, type: 'Promoter' as 'Promoter' })),
    ...pendingClubs.map(item => ({ ...item, type: 'Club' as 'Club' })),
  ].sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); 

  const handleApproval = async (item: PendingItem, action: 'approve' | 'reject') => {
    const submissionKey = `${item.type}-${item.id}-${action}`;
    setIsSubmitting(prev => ({...prev, [submissionKey]: true}));

    try {
      switch (item.type) {
        case 'Event':
          action === 'approve' ? await approveEvent(item.id) : await rejectEvent(item.id);
          break;
        case 'DJ':
          action === 'approve' ? await approveDJ(item.id) : await rejectDJ(item.id);
          break;
        case 'Promoter':
          action === 'approve' ? await approvePromoter(item.id) : await rejectPromoter(item.id);
          break;
        case 'Club':
          action === 'approve' ? await approveClub(item.id) : await rejectClub(item.id);
          break;
      }
    } catch (error) {
      console.error(`Error al ${action === 'approve' ? 'aprobar' : 'rechazar'} ${item.type}:`, error);
      alert(`Error al ${action === 'approve' ? 'aprobar' : 'rechazar'} el elemento.`);
    } finally {
      setIsSubmitting(prev => ({...prev, [submissionKey]: false}));
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Event': return CalendarDaysIcon;
      case 'DJ': return MusicalNoteIcon;
      case 'Promoter': return UserGroupIcon;
      case 'Club': return BuildingStorefrontIcon;
      default: return ClockIcon;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Event': return 'from-purple-500 to-purple-700';
      case 'DJ': return 'from-blue-500 to-blue-700';
      case 'Promoter': return 'from-green-500 to-green-700';
      case 'Club': return 'from-pink-500 to-pink-700';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  return (
    <CMSLayout title="Aprobaciones Pendientes">
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">📋 Elementos Pendientes de Aprobación</h2>
            <p className="text-gray-600">
              Total pendientes: <span className="font-bold text-orange-600">{pendingItems.length}</span>
            </p>
            <div className="flex gap-4 mt-2 text-sm">
              <span>Eventos: <strong className="text-purple-600">{pendingEvents.length}</strong></span>
              <span>DJs: <strong className="text-blue-600">{pendingDJs.length}</strong></span>
              <span>Promotores: <strong className="text-green-600">{pendingPromoters.length}</strong></span>
              <span>Clubs: <strong className="text-pink-600">{pendingClubs.length}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : pendingItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-lg">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">¡Todo al día!</h3>
          <p className="text-gray-600">No hay elementos pendientes de aprobación</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingItems.map((item) => {
            const approveKey = `${item.type}-${item.id}-approve`;
            const rejectKey = `${item.type}-${item.id}-reject`;
            const TypeIcon = getTypeIcon(item.type);
            const typeColor = getTypeColor(item.type);

            return (
              <div key={`${item.type}-${item.id}`} className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${typeColor}`}>
                        <TypeIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300">
                          PENDIENTE
                    </span>
                        <h3 className="text-lg font-bold text-gray-800 mt-1">
                          {item.type}: {item.name}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      Creado: {new Date(item.createdAt).toLocaleDateString('es-ES', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    
                    {item.description && (
                      <p className="text-sm text-gray-700 mt-2 line-clamp-3 bg-gray-50 p-3 rounded-lg">
                        {item.description}
                        </p>
                    )}
                    
                    {item.slug && (
                      <div className="mt-3">
                        <Link 
                          to={`/${item.type.toLowerCase()}s/${item.slug}`} 
                          target="_blank" 
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          Ver detalles
                        </Link>
                      </div>
                    )}
                    </div>
                  
                  <div className="flex space-x-3 shrink-0">
                    <button 
                        onClick={() => handleApproval(item, 'approve')}
                        disabled={isSubmitting[approveKey] || isSubmitting[rejectKey]}
                      className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                      <span>{isSubmitting[approveKey] ? 'Aprobando...' : 'Aprobar'}</span>
                    </button>
                    
                    <button 
                        onClick={() => handleApproval(item, 'reject')}
                        disabled={isSubmitting[approveKey] || isSubmitting[rejectKey]}
                      className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      <XCircleIcon className="h-4 w-4" />
                      <span>{isSubmitting[rejectKey] ? 'Rechazando...' : 'Rechazar'}</span>
                    </button>
                    </div>
                </div>
                </div>
            );
            })}
        </div>
      )}
    </CMSLayout>
  );
};

export default AdminPendingApprovalsPage;
