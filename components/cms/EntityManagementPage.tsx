
import React, { useState, ReactNode } from 'react'; 
import CMSLayout from './CMSLayout';
import Button from '../common/Button';
import Modal from '../common/Modal';
import EntityForm from './EntityForm';
import { PlusCircleIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { BaseEntity, EventData, DJData, PromoterData, ClubData, FormEntityCreateData } from '../../types'; 
import { useAuth } from '../../hooks/useAuth'; 
import { useTranslation } from 'react-i18next';

type Entity = EventData | DJData | PromoterData | ClubData; 

interface EntityManagementPageProps<T extends Entity, U extends FormEntityCreateData> {
  entityName: 'Event' | 'DJ' | 'Promoter' | 'Club'; 
  entityNamePlural: string; 
  entities: T[];
  onAdd: (data: U, userId: string, isAdmin: boolean) => Promise<T>; 
  onUpdate: (data: T, userId: string, isAdmin: boolean) => Promise<T>; 
  onDelete: (id: string, userId: string, isAdmin: boolean) => Promise<void>;
  renderListItem: (entity: T, onEdit: () => void, onDeleteConfirm: () => void) => React.ReactNode;
  isLoading: boolean;
  children?: ReactNode; 
}

const EntityManagementPage = <T extends Entity, U extends FormEntityCreateData,> ({
  entityName,
  entityNamePlural,
  entities,
  onAdd,
  onUpdate,
  onDelete,
  renderListItem,
  isLoading,
  children 
}: EntityManagementPageProps<T, U>) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<T | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser, isAdmin: isCurrentUserAdmin } = useAuth();
  const { t } = useTranslation();

  const openModalForAdd = () => {
    setEditingEntity(undefined);
    setIsModalOpen(true);
  };

  const openModalForEdit = (entity: T) => {
    setEditingEntity(entity);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEntity(undefined);
  };

  const handleSubmit = async (formDataFromForm: U | T) => { 
    setIsSubmitting(true);
    const userId = currentUser?.id;
    const isAdminFuncResult = isCurrentUserAdmin();

    if (!userId) {
      alert("User not authenticated. Cannot save."); 
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingEntity && 'id' in formDataFromForm) { 
        await onUpdate(formDataFromForm as T, userId, isAdminFuncResult);
      } else {
        await onAdd(formDataFromForm as U, userId, isAdminFuncResult);
      }
      closeModal();
    } catch (error) {
      console.error(`Failed to save ${entityName}:`, error);
      alert(`Error saving ${entityName}. See console for details.`); 
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteConfirm = async (id: string) => {
    const userId = currentUser?.id;
    const isAdminFuncResult = isCurrentUserAdmin();

    if (!userId) {
        alert("User not authenticated. Cannot delete."); 
        return;
    }

    if (window.confirm(`Are you sure you want to delete this ${entityName}? This action cannot be undone.`)) { 
      setIsSubmitting(true); 
      try {
        await onDelete(id, userId, isAdminFuncResult);
      } catch (error) {
        console.error(`Failed to delete ${entityName}:`, error);
        alert(`Error deleting ${entityName}. See console for details.`); 
      } finally {
        setIsSubmitting(false);
      }
    }
  };


  return (
    <CMSLayout title={`${t('Manage')} ${entityNamePlural}`}>
      <div className="mb-8 flex justify-between items-center"> {/* Increased margin */}
        <div>{children}</div> 
        <Button onClick={openModalForAdd} variant="primary" size="md">
          <PlusCircleIcon className="h-5 w-5 mr-2 inline" /> {`${t('Add New')} ${entityName}`}
        </Button>
      </div>

      {isLoading ? (
        <p className="text-brand-light text-center py-10">{`${t('page.loading')} ${entityNamePlural.toLowerCase()}...`}</p>
      ) : entities.length === 0 ? (
        <p className="text-brand-gray text-center py-10">{`${t('No')} ${entityNamePlural.toLowerCase()} ${t('found')}. ${t('Click')} "${t('Add New')} ${entityName}" ${t('to get started')}.`}</p>
      ) : (
        <div className="space-y-5"> {/* Increased spacing */}
          {entities.map(entity => 
            renderListItem(
                entity, 
                () => openModalForEdit(entity), 
                () => handleDeleteConfirm((entity as BaseEntity).id) 
            )
          )}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingEntity ? `${t('Edit')} ${entityName}` : `${t('Add New')} ${entityName}`}
      >
        <EntityForm<T, U>
          entityType={entityName} 
          initialData={editingEntity}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </CMSLayout>
  );
};

export const defaultRenderListItem = <T extends (BaseEntity | EventData) & { name: string; id: string; description?: string },>( 
    entity: T, 
    onEdit: () => void, 
    onDeleteConfirm: () => void,
    customContent?: React.ReactNode
  ) => (
  <div key={entity.id} className="bg-brand-surface-variant p-5 rounded-lg shadow-main-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300 hover:shadow-main-card-hover hover:bg-brand-surface-variant/80 transform hover:scale-[1.01]">
    <div className="flex-grow">
      <h3 className="text-lg font-headings font-semibold text-brand-orange group-hover:text-brand-purple transition-colors">{entity.name}</h3>
      {customContent || <p className="text-sm text-brand-gray truncate max-w-md">{entity.description || 'No description available.'}</p>}
    </div>
    <div className="flex space-x-2 shrink-0 mt-3 sm:mt-0 self-end sm:self-center">
      <Button onClick={onEdit} variant="light-outline" size="sm" aria-label={`Edit ${entity.name}`} className="hover:border-brand-orange hover:text-brand-orange !px-2.5 !py-1.5"> {/* Made button smaller */}
        <PencilSquareIcon className="h-4 w-4" />
      </Button>
      <Button onClick={onDeleteConfirm} variant="danger" size="sm" aria-label={`Delete ${entity.name}`} className="!px-2.5 !py-1.5"> {/* Made button smaller */}
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

export default EntityManagementPage;