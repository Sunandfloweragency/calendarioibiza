

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import { EventData, DJData, PromoterData, ClubData, UserSubmissionItem, FormEntityCreateData, FormEntityData, EntityType as AppEntityType } from '../types';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import EntityForm from '../components/cms/EntityForm';
import { PlusCircleIcon, PencilSquareIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

type ModalEntityType = 'Event' | 'DJ' | 'Promoter' | 'Club';

const UserDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { 
    getEventsByUserId, 
    getDJsByUserId, 
    getPromotersByUserId, 
    getClubsByUserId, 
    isLoading,
    addEvent, updateEvent, deleteEvent, 
    addDJ, updateDJ, deleteDJ,
    addPromoter, updatePromoter, deletePromoter,
    addClub, updateClub, deleteClub,
  } = useData();
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalEntityType | null>(null);
  const [editingItem, setEditingItem] = useState<UserSubmissionItem | undefined>(undefined);
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);

  if (isLoading || !currentUser) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>;
  }

  const userEvents = getEventsByUserId(currentUser.id);
  const userDJs = getDJsByUserId(currentUser.id);
  const userPromoters = getPromotersByUserId(currentUser.id);
  const userClubs = getClubsByUserId(currentUser.id);

  const allSubmissions: UserSubmissionItem[] = [
    ...userEvents.map(item => ({ ...item, type: 'Event' as 'Event' })),
    ...userDJs.map(item => ({ ...item, type: 'DJ' as 'DJ' })),
    ...userPromoters.map(item => ({ ...item, type: 'Promoter' as 'Promoter' })),
    ...userClubs.map(item => ({ ...item, type: 'Club' as 'Club' })),
  ].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const openModalForAdd = (type: ModalEntityType) => {
    setModalType(type);
    setEditingItem(undefined);
    setIsModalOpen(true);
  };

  const openModalForEdit = (item: UserSubmissionItem) => {
    setModalType(item.type);
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setEditingItem(undefined);
  };

  const handleFormSubmit = async (formDataFromForm: FormEntityData) => {
    if (!currentUser || !modalType) return;
    setIsSubmittingModal(true);

    try {
      if (editingItem) { // Update existing pending submission
        const fullUpdateData = { ...editingItem, ...formDataFromForm, id: editingItem.id, slug: editingItem.slug } as UserSubmissionItem; // Ensure ID and slug are preserved
        switch (modalType) {
          case 'Event': await updateEvent(fullUpdateData as EventData, currentUser.id, false); break;
          case 'DJ': await updateDJ(fullUpdateData as DJData, currentUser.id, false); break;
          case 'Promoter': await updatePromoter(fullUpdateData as PromoterData, currentUser.id, false); break;
          case 'Club': await updateClub(fullUpdateData as ClubData, currentUser.id, false); break;
        }
      } else { // Add new submission
        switch (modalType) {
          case 'Event': await addEvent(formDataFromForm as Omit<EventData, 'id' | 'slug' | 'status' | 'submittedBy' | 'createdAt' | 'updatedAt'>, currentUser.id, false); break;
          case 'DJ': await addDJ(formDataFromForm as Omit<DJData, 'id' | 'slug' | 'status' | 'submittedBy' | 'createdAt' | 'updatedAt'>, currentUser.id, false); break;
          case 'Promoter': await addPromoter(formDataFromForm as Omit<PromoterData, 'id' | 'slug' | 'status' | 'submittedBy' | 'createdAt' | 'updatedAt'>, currentUser.id, false); break;
          case 'Club': await addClub(formDataFromForm as Omit<ClubData, 'id' | 'slug' | 'status' | 'submittedBy' | 'createdAt' | 'updatedAt'>, currentUser.id, false); break;
        }
      }
      closeModal();
    } catch (error) {
      console.error(`Failed to save ${modalType}:`, error);
      alert(`Error saving ${modalType}. See console for details.`);
    } finally {
      setIsSubmittingModal(false);
    }
  };

  const handleDelete = async (itemType: ModalEntityType, itemId: string) => {
    if (!currentUser) return;
    const confirmDelete = window.confirm(`Are you sure you want to delete this ${itemType.toLowerCase()} submission?`);
    if (confirmDelete) {
      setIsSubmittingModal(true); // Use this to indicate generic loading for delete
      try {
        switch (itemType) {
          case 'Event': await deleteEvent(itemId, currentUser.id, false); break;
          case 'DJ': await deleteDJ(itemId, currentUser.id, false); break;
          case 'Promoter': await deletePromoter(itemId, currentUser.id, false); break;
          case 'Club': await deleteClub(itemId, currentUser.id, false); break;
        }
      } catch (error) {
        console.error(`Error deleting ${itemType}:`, error);
        alert(`Could not delete ${itemType}. It might have already been processed or an error occurred.`);
      } finally {
        setIsSubmittingModal(false);
      }
    }
  };
  
  const getStatusColor = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 text-yellow-900 shadow-sm';
      case 'approved': return 'bg-green-500 text-white shadow-sm';
      case 'rejected': return 'bg-red-600 text-white shadow-sm'; // Brighter red
      default: return 'bg-gray-500 text-white shadow-sm';
    }
  };

  const getModalTitle = () => {
    if (!modalType) return "";
    const action = editingItem ? t('Edit') : t('userDashboard.submitNew');
    return `${action} ${t(`entity.${modalType.toLowerCase()}`)}`;
  };

  return (
    <div className="animate-fade-in space-y-10"> {/* Increased base spacing */}
      <h1 className="text-4xl font-headings font-bold text-brand-orange">{t('userDashboard.title')}</h1>
      <p className="text-brand-gray text-lg">{t('userDashboard.welcome')}, {currentUser.name || currentUser.username}!</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 p-6 bg-brand-surface-variant/50 rounded-xl shadow-main-card">
        <Button variant="primary" className="w-full py-3" onClick={() => openModalForAdd('Event')}>
            <PlusCircleIcon className="h-5 w-5 mr-2 inline" /> {t('userDashboard.submitNewEntity', { entity: t('entity.event')})}
        </Button>
         <Button variant="primary" className="w-full py-3" onClick={() => openModalForAdd('DJ')}>
            <PlusCircleIcon className="h-5 w-5 mr-2 inline" /> {t('userDashboard.submitNewEntity', { entity: t('entity.dj')})}
        </Button>
         <Button variant="primary" className="w-full py-3" onClick={() => openModalForAdd('Promoter')}>
            <PlusCircleIcon className="h-5 w-5 mr-2 inline" /> {t('userDashboard.submitNewEntity', { entity: t('entity.promoter')})}
        </Button>
         <Button variant="primary" className="w-full py-3" onClick={() => openModalForAdd('Club')}>
            <PlusCircleIcon className="h-5 w-5 mr-2 inline" /> {t('userDashboard.submitNewEntity', { entity: t('entity.club')})}
        </Button>
      </div>

      <h2 className="text-3xl font-headings text-brand-purple mb-6">{t('userDashboard.yourSubmissions')}</h2>
      {allSubmissions.length > 0 ? (
        <div className="bg-brand-surface p-4 sm:p-6 rounded-xl shadow-main-card">
          <ul className="space-y-5">
            {allSubmissions.map(item => (
              <li key={`${item.type}-${item.id}`} className="bg-brand-surface-variant p-5 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300 hover:shadow-lg hover:bg-brand-surface-variant/80">
                <div className="flex-grow">
                  <div className="flex items-center mb-1.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full mr-3 ${getStatusColor(item.status)}`}>
                      {t(`status.${item.status}`).toUpperCase()}
                    </span>
                    <strong className="text-brand-purple text-sm uppercase tracking-wider">{item.type}</strong>
                  </div>
                  <Link to={item.status === 'approved' ? `/${item.type.toLowerCase()}s/${item.slug}` : '#'} 
                        className={`text-xl font-semibold text-brand-light ${item.status === 'approved' ? 'hover:text-brand-orange hover:underline' : 'cursor-default'}`}
                        title={item.status === 'approved' ? 'View details' : 'View details (only available for approved items)'}
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-brand-gray mt-1">
                    {t('userDashboard.submittedOn')}: {new Date(item.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric'})}
                  </p>
                </div>
                <div className="flex space-x-2 shrink-0 mt-3 sm:mt-0 self-end sm:self-center">
                  {item.status === 'approved' && (
                    <Link to={`/${item.type.toLowerCase()}s/${item.slug}`}
                      className="p-2.5 text-brand-light hover:text-brand-orange rounded-md bg-brand-surface hover:bg-opacity-70 shadow-sm hover:shadow-md transition-all"
                      title={t('userDashboard.viewApprovedItem')}>
                       <EyeIcon className="h-5 w-5" />
                    </Link>
                  )}
                  <Button 
                    variant="light-outline" 
                    size="sm" 
                    onClick={() => openModalForEdit(item)}
                    disabled={item.status !== 'pending'} 
                    title={item.status !== 'pending' ? t('userDashboard.cannotEdit') : t('userDashboard.editSubmission')}
                    className="!px-2.5 !py-2"
                  > 
                    <PencilSquareIcon className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => handleDelete(item.type, item.id)}
                    disabled={item.status === 'approved'} 
                    title={item.status === 'approved' ? t('userDashboard.cannotDeleteApproved') : t('userDashboard.deleteSubmission')}
                    className="!px-2.5 !py-2"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-brand-gray text-center py-10 text-lg">{t('userDashboard.noSubmissions')}</p>
      )}

      {modalType && (
        <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            title={getModalTitle()}
        >
            <EntityForm<EventData | DJData | PromoterData | ClubData, FormEntityCreateData>
                // Fix: Pass modalType directly as it's already correctly typed ('Event' | 'DJ' | 'Promoter' | 'Club')
                entityType={modalType}
                initialData={editingItem as any} // Cast as any for simplicity, proper typing would require conditional rendering
                onSubmit={handleFormSubmit}
                onCancel={closeModal}
                isSubmitting={isSubmittingModal}
                // isUserSubmission={true} // EntityForm already defaults this if not provided or handles specific form fields
            />
        </Modal>
      )}
    </div>
  );
};

export default UserDashboardPage;