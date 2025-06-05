
import React, { useState } from 'react';
import CMSLayout from '../components/cms/CMSLayout';
import { useData } from '../contexts/DataContext';
import { PendingItem, EventData, DJData, PromoterData, ClubData, UserData } from '../types';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { EXTERNAL_IMPORT_USER_ID } from '../constants';

const AdminPendingApprovalsPage: React.FC = () => {
  const { 
    getPendingEvents, getPendingDJs, getPendingPromoters, getPendingClubs,
    approveEvent, rejectEvent,
    approveDJ, rejectDJ,
    approvePromoter, rejectPromoter,
    approveClub, rejectClub,
    getUserById,
    isLoading 
  } = useData();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState<{[key: string]: boolean}>({});
  const { t } = useTranslation();

  const pendingItems: PendingItem[] = [
    ...getPendingEvents().map(item => ({ ...item, type: 'Event' as 'Event' })),
    ...getPendingDJs().map(item => ({ ...item, type: 'DJ' as 'DJ' })),
    ...getPendingPromoters().map(item => ({ ...item, type: 'Promoter' as 'Promoter' })),
    ...getPendingClubs().map(item => ({ ...item, type: 'Club' as 'Club' })),
  ].sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); 

  const handleApproval = async (item: PendingItem, action: 'approve' | 'reject') => {
    if (!currentUser) return;
    
    const submissionKey = `${item.type}-${item.id}-${action}`;
    setIsSubmitting(prev => ({...prev, [submissionKey]: true}));

    try {
      switch (item.type) {
        case 'Event':
          action === 'approve' ? await approveEvent(item.id, currentUser.id) : await rejectEvent(item.id, currentUser.id);
          break;
        case 'DJ':
          action === 'approve' ? await approveDJ(item.id, currentUser.id) : await rejectDJ(item.id, currentUser.id);
          break;
        case 'Promoter':
          action === 'approve' ? await approvePromoter(item.id, currentUser.id) : await rejectPromoter(item.id, currentUser.id);
          break;
        case 'Club':
          action === 'approve' ? await approveClub(item.id, currentUser.id) : await rejectClub(item.id, currentUser.id);
          break;
      }
    } catch (error) {
      console.error(`Failed to ${action} ${item.type}:`, error);
      alert(`Error ${action}ing item. See console.`);
    } finally {
      setIsSubmitting(prev => ({...prev, [submissionKey]: false}));
    }
  };
  
  const getItemSubmitterDisplay = (userId: string): string => {
    if (userId === EXTERNAL_IMPORT_USER_ID) {
      return t('admin.submittedBySystemImport');
    }
    const user = getUserById(userId);
    return user ? (user.name || user.username) : t('admin.unknownUser');
  };

  return (
    <CMSLayout title={t('admin.pendingApprovals.title')}>
      {isLoading ? (
        <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>
      ) : pendingItems.length === 0 ? (
        <p className="text-brand-gray text-center py-8">{t('admin.pendingApprovals.none')}</p>
      ) : (
        <div className="space-y-5"> {/* Increased space between items */}
          {pendingItems.map((item) => {
            const submitterDisplay = getItemSubmitterDisplay(item.submittedBy);
            const approveKey = `${item.type}-${item.id}-approve`;
            const rejectKey = `${item.type}-${item.id}-reject`;
            const eventItem = item.type === 'Event' ? item as EventData : null;

            return (
                <div key={`${item.type}-${item.id}`} className="bg-brand-surface-variant/80 p-5 rounded-lg shadow-main-card transition-all duration-300 hover:shadow-main-card-hover hover:bg-brand-surface-variant transform hover:scale-[1.01]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"> {/* Increased gap */}
                    <div className="flex-grow">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full mr-2 bg-yellow-500 text-yellow-900 shadow-sm">
                        {t('status.pending').toUpperCase()}
                    </span>
                    <strong className="text-lg text-brand-orange">{item.type}:</strong>{' '}
                    <Link to={`/${item.type.toLowerCase()}s/${item.slug}`} target="_blank" className="text-brand-light hover:text-brand-purple hover:underline text-lg">
                        {item.name}
                    </Link>
                    <p className="text-xs text-brand-gray mt-1.5">
                        {t('admin.submittedOn')}: {new Date(item.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })} {t('admin.submittedByPrefix')} <span className="font-medium text-brand-light/90">{submitterDisplay}</span>
                    </p>
                    <p className="text-sm text-brand-light/80 mt-2 line-clamp-3">{item.description}</p>
                    {eventItem?.originalSourceUrl && (
                        <p className="text-xs text-brand-gray mt-1.5">
                            {t('admin.events.externalSourceLabel')}: <a href={eventItem.originalSourceUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-brand-orange">{eventItem.originalSourceUrl}</a>
                        </p>
                    )}
                    {eventItem?.importNotes && (
                        <p className="text-xs text-brand-gray mt-1.5 italic bg-brand-surface/50 p-2 rounded">{t('admin.events.importNotesLabel')}: {eventItem.importNotes}</p>
                    )}
                    </div>
                    <div className="flex space-x-3 shrink-0 mt-3 sm:mt-0 self-end sm:self-center">
                    <Button 
                        variant="secondary"
                        size="sm" 
                        onClick={() => handleApproval(item, 'approve')}
                        disabled={isSubmitting[approveKey] || isSubmitting[rejectKey]}
                        className="hover:shadow-lg"
                    >
                        {isSubmitting[approveKey] ? t('admin.approving') : t('admin.approve')}
                    </Button>
                    <Button 
                        variant="danger" 
                        size="sm" 
                        onClick={() => handleApproval(item, 'reject')}
                        disabled={isSubmitting[approveKey] || isSubmitting[rejectKey]}
                        className="hover:shadow-lg"
                    >
                        {isSubmitting[rejectKey] ? t('admin.rejecting') : t('admin.reject')}
                    </Button>
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
