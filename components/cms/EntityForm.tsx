import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import { DJ_GENRES, EVENT_TYPES, SOCIAL_PLATFORMS, USER_PROFILE_TYPES } from '../../constants';
import { useData } from '../../contexts/DataContext';
import { BaseEntity, DJData, EventData, PromoterData, ClubData, FormEntityCreateData as GenericFormEntityCreateData, FormEntityData, UserData } from '../../types';
import { useTranslation } from 'react-i18next';

interface EntityFormProps<T extends EventData | DJData | PromoterData | ClubData, U extends GenericFormEntityCreateData> {
  entityType: 'Event' | 'DJ' | 'Promoter' | 'Club';
  initialData?: T; 
  onSubmit: (data: U | T) => Promise<void>; 
  onCancel: () => void;
  isSubmitting: boolean;
}

const EntityForm = <
  T extends EventData | DJData | PromoterData | ClubData, 
  U extends GenericFormEntityCreateData
>({
  entityType,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: EntityFormProps<T, U>) => {
  const [formData, setFormData] = useState<FormEntityData>(() => {
    if (initialData) return initialData;

    switch (entityType) {
        case 'Event':
            return { name: '', description: '', date: '', time: '', imageUrl: '', djIds: [], socialLinks: [] } as Partial<Omit<EventData, 'id' | 'slug' | 'status' | 'submittedBy' | 'createdAt' | 'updatedAt'>>;
        case 'DJ':
            return { name: '', description: '', photoUrl: '', bio: '', genres: [], socialLinks: [] } as Partial<Omit<DJData, 'id' | 'slug' | 'status' | 'submittedBy' | 'createdAt' | 'updatedAt'>>;
        case 'Promoter':
            return { name: '', description: '', logoUrl: '', history: '', eventTypeFocus: '', socialLinks: [] } as Partial<Omit<PromoterData, 'id' | 'slug' | 'status' | 'submittedBy' | 'createdAt' | 'updatedAt'>>;
        case 'Club':
            return { name: '', description: '', address: '', musicType: '', photos: [], services: [], socialLinks: [] } as Partial<Omit<ClubData, 'id' | 'slug' | 'status' | 'submittedBy' | 'createdAt' | 'updatedAt'>>;
        default:
            return {name: '', description: ''} as any;
    }
  });

  const { djs, clubs, promoters } = useData(); 
  const { t } = useTranslation();

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      switch (entityType) {
        case 'Event':
            setFormData({ name: '', description: '', date: '', time: '', imageUrl: '', djIds: [], socialLinks: [] } as Partial<Omit<EventData, 'id' | 'slug' | 'status' | 'submittedBy' | 'createdAt' | 'updatedAt'>>);
            break;
        case 'DJ':
            setFormData({ name: '', description: '', photoUrl: '', bio: '', genres: [], socialLinks: [] } as Partial<Omit<DJData, 'id' | 'slug' | 'status' | 'submittedBy' | 'createdAt' | 'updatedAt'>>);
            break;
        case 'Promoter':
            setFormData({ name: '', description: '', logoUrl: '', history: '', eventTypeFocus: '', socialLinks: [] } as Partial<Omit<PromoterData, 'id' | 'slug' | 'status' | 'submittedBy' | 'createdAt' | 'updatedAt'>>);
            break;
        case 'Club':
            setFormData({ name: '', description: '', address: '', musicType: '', photos: [], services: [], socialLinks: [] } as Partial<Omit<ClubData, 'id' | 'slug' | 'status' | 'submittedBy' | 'createdAt' | 'updatedAt'>>);
            break;
        default:
            setFormData({name: '', description: ''} as any); 
            break;
      }
    }
  }, [initialData, entityType]); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        if (name === 'genres_checkbox') { 
            setFormData(prev => {
                const currentGenres = (prev as Partial<DJData>).genres || [];
                return { ...prev, genres: checked ? [...currentGenres, value] : currentGenres.filter(item => item !== value) };
            });
        } else if (name === 'services_checkbox') { 
             setFormData(prev => {
                const currentServices = (prev as Partial<ClubData>).services || [];
                return { ...prev, services: checked ? [...currentServices, value] : currentServices.filter(item => item !== value) };
            });
        } else if (name === 'djIds_checkbox') { 
            setFormData(prev => {
                const currentDjIds = (prev as Partial<EventData>).djIds || [];
                return { ...prev, djIds: checked ? [...currentDjIds, value] : currentDjIds.filter(id => id !== value) };
            });
        }
    } else if (name === 'photos' && entityType === 'Club') { 
        setFormData(prev => ({ ...prev, photos: value.split(',').map(s => s.trim()).filter(s => s) }));
    } else if (name === 'services' && entityType === 'Club') { 
         // For Club services if they were a comma separated input - now they are checkboxes
        // setFormData(prev => ({ ...prev, services: value.split(',').map(s => s.trim()).filter(s => s) }));
    }
    else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSocialLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
    const currentLinks = (formData as Partial<BaseEntity | EventData>).socialLinks || [];
    const newSocialLinks = [...currentLinks];
    newSocialLinks[index] = { ...newSocialLinks[index], [field]: value };
    setFormData(prev => ({ ...prev, socialLinks: newSocialLinks }));
  };

  const addSocialLink = () => {
    const currentLinks = (formData as Partial<BaseEntity | EventData>).socialLinks || [];
    const newSocialLinks = [...currentLinks, { platform: SOCIAL_PLATFORMS[0], url: '' }];
    setFormData(prev => ({ ...prev, socialLinks: newSocialLinks }));
  };

  const removeSocialLink = (index: number) => {
    const currentLinks = (formData as Partial<BaseEntity | EventData>).socialLinks || [];
    const newSocialLinks = currentLinks.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, socialLinks: newSocialLinks }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!('name' in formData) || !formData.name || formData.name.trim() === '') {
        alert(`${entityType} name is required.`);
        return;
    }
    onSubmit(initialData ? formData as T : formData as U);
  };
  
  const commonSelectClass = "w-full px-3 py-2.5 bg-brand-surface-variant border border-brand-surface-variant/70 rounded-md text-brand-light focus:ring-1 focus:ring-brand-orange focus:ring-offset-0 focus:ring-offset-brand-black focus:border-brand-orange transition-all duration-300 ease-in-out";
  const checkboxClass = "form-checkbox h-4 w-4 text-brand-orange bg-brand-surface-variant border-brand-surface-variant/70 rounded focus:ring-brand-orange focus:ring-1 focus:ring-offset-0 focus:ring-offset-brand-black";
  const checkboxLabelClass = "flex items-center space-x-2 text-sm text-brand-light cursor-pointer";

  const renderCommonFields = () => (
    <>
      <Input label="Name" name="name" value={(formData as Partial<BaseEntity>).name || ''} onChange={handleChange} required />
      <Textarea label="Description" name="description" value={(formData as Partial<BaseEntity>).description || ''} onChange={handleChange} />
    </>
  );

  const renderSocialLinksFields = () => (
    <div className="space-y-3 mt-6 border-t border-brand-surface-variant/50 pt-6">
      <h4 className="text-md font-semibold text-brand-purple">{t('form.socialLinks.label')}</h4>
      {((formData as Partial<BaseEntity | EventData>).socialLinks || []).map((link, index) => (
        <div key={index} className="flex items-center space-x-2 p-2.5 bg-brand-surface-variant/60 rounded-md">
          <select 
            name={`socialPlatform-${index}`} 
            value={link.platform} 
            onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
            className={`flex-1 px-2 py-1.5 text-sm ${commonSelectClass}`}
          >
            <option value="">{t('form.socialLinks.selectPlatform')}</option>
            {SOCIAL_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <Input 
            type="url" 
            name={`socialUrl-${index}`}
            placeholder="URL" 
            value={link.url} 
            onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)} 
            className="flex-grow !mb-0" 
          />
          <Button type="button" variant="danger" size="sm" onClick={() => removeSocialLink(index)} className="!px-2.5 !py-1.5 shrink-0 hover:shadow-md">&times;</Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addSocialLink}>{t('form.socialLinks.add')}</Button>
    </div>
  );

  const renderDJFields = () => (
    <>
      {renderCommonFields()}
      <Input label="Photo URL" name="photoUrl" value={(formData as Partial<DJData>).photoUrl || ''} onChange={handleChange} />
      <Textarea label="Bio" name="bio" value={(formData as Partial<DJData>).bio || ''} onChange={handleChange} />
      <div>
        <label className="block text-sm font-medium text-brand-gray mb-1">{t('form.genres.label')}</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 max-h-48 overflow-y-auto p-3 bg-brand-surface-variant/60 rounded-md custom-scrollbar">
          {DJ_GENRES.map(genre => (
            <label key={genre} className={checkboxLabelClass}>
              <input 
                type="checkbox" 
                name="genres_checkbox" 
                value={genre} 
                checked={((formData as Partial<DJData>).genres || []).includes(genre)} 
                onChange={handleChange}
                className={checkboxClass}
              />
              <span>{genre}</span>
            </label>
          ))}
        </div>
      </div>
      {renderSocialLinksFields()}
    </>
  );

  const renderPromoterFields = () => (
    <>
      {renderCommonFields()}
      <Input label="Logo URL" name="logoUrl" value={(formData as Partial<PromoterData>).logoUrl || ''} onChange={handleChange} />
      <Textarea label="History/About" name="history" value={(formData as Partial<PromoterData>).history || ''} onChange={handleChange} />
      <Input label="Event Type Focus" name="eventTypeFocus" value={(formData as Partial<PromoterData>).eventTypeFocus || ''} onChange={handleChange} />
      {renderSocialLinksFields()}
    </>
  );

  const renderClubFields = () => (
    <>
      {renderCommonFields()}
      <Input label="Address" name="address" value={(formData as Partial<ClubData>).address || ''} onChange={handleChange} />
      <Input label="Map Link (Optional)" name="mapLink" type="url" value={(formData as Partial<ClubData>).mapLink || ''} onChange={handleChange} />
      <Input label="Music Type" name="musicType" value={(formData as Partial<ClubData>).musicType || ''} onChange={handleChange} />
      <Textarea label="Photos (comma-separated URLs)" name="photos" value={((formData as Partial<ClubData>).photos || []).join(',\n')} onChange={handleChange} placeholder="e.g. url1,\nurl2,\nurl3" rows={3} />
       <div>
        <label className="block text-sm font-medium text-brand-gray mb-1">{t('form.services.label')}</label>
        <Textarea name="services_textarea_placeholder" label="Services (one per line for checkbox generation below, or update directly)" value={((formData as Partial<ClubData>).services || []).join('\n')} onChange={e => {
             setFormData(prev => ({ ...prev, services: e.target.value.split('\n').map(s => s.trim()).filter(s => s) }));
        }} placeholder="e.g. VIP Area\nTerrace\nBar (Edit here or use checkboxes)" rows={3}/>
         {/* This is a conceptual way to show services, better to manage as a tag input or dynamic list if complex */}
      </div>
      {renderSocialLinksFields()}
    </>
  );
  
  const renderEventFields = () => (
    <>
      <Input label="Name" name="name" value={(formData as Partial<EventData>).name || ''} onChange={handleChange} required />
      <Textarea label="Description" name="description" value={(formData as Partial<EventData>).description || ''} onChange={handleChange} />
      <Input label="Date" name="date" type="date" value={(formData as Partial<EventData>).date ? (formData as Partial<EventData>).date!.substring(0,10) : ''} onChange={handleChange} required />
      <Input label="Time" name="time" type="time" value={(formData as Partial<EventData>).time || ''} onChange={handleChange} required />
      <Input label="Image URL (Flyer)" name="imageUrl" value={(formData as Partial<EventData>).imageUrl || ''} onChange={handleChange} />
      <Input label="Video URL (Optional)" name="videoUrl" type="url" value={(formData as Partial<EventData>).videoUrl || ''} onChange={handleChange} />
      <Input label="Price (e.g., €20, Free)" name="price" value={(formData as Partial<EventData>).price || ''} onChange={handleChange} />
      <Input label="Ticket Link (Optional)" name="ticketLink" type="url" value={(formData as Partial<EventData>).ticketLink || ''} onChange={handleChange} />
      
      <div>
        <label htmlFor="eventType" className="block text-sm font-medium text-brand-gray mb-1">{t('form.eventType.label')}</label>
        <select name="eventType" id="eventType" value={(formData as Partial<EventData>).eventType || ''} onChange={handleChange} className={commonSelectClass}>
          <option value="">{t('form.eventType.select')}</option>
          {EVENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="clubId" className="block text-sm font-medium text-brand-gray mb-1">{t('form.clubVenue.label')}</label>
        <div className="flex items-center space-x-2">
          <select name="clubId" id="clubId" value={(formData as Partial<EventData>).clubId || ''} onChange={handleChange} className={`${commonSelectClass} flex-grow`}>
            <option value="">{t('form.clubVenue.select')}</option>
            {clubs.map(club => <option key={club.id} value={club.id}>{club.name}</option>)}
          </select>
          {/* Future: <Button type="button" variant="outline" size="sm" disabled title={t('form.addNew.future', { entity: t('form.clubVenue.entityName') })}>{t('Add New')}</Button> */}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-gray mb-1">{t('form.djsPerforming.label')}</label>
         <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 max-h-48 overflow-y-auto p-3 bg-brand-surface-variant/60 rounded-md custom-scrollbar">
            {djs.map(dj => (
              <label key={dj.id} className={checkboxLabelClass}>
                <input 
                    type="checkbox" 
                    name="djIds_checkbox" 
                    value={dj.id} 
                    checked={((formData as Partial<EventData>).djIds || []).includes(dj.id)} 
                    onChange={handleChange}
                    className={checkboxClass}
                />
                <span>{dj.name}</span>
              </label>
            ))}
        </div>
         {/* Future: <Button type="button" variant="outline" size="sm" className="mt-2" disabled title={t('form.addNew.future', { entity: t('form.djsPerforming.entityName') })}>{t('Add New')}</Button> */}
      </div>

      <div>
        <label htmlFor="promoterId" className="block text-sm font-medium text-brand-gray mb-1">{t('form.promoter.label')}</label>
         <div className="flex items-center space-x-2">
            <select name="promoterId" id="promoterId" value={(formData as Partial<EventData>).promoterId || ''} onChange={handleChange} className={`${commonSelectClass} flex-grow`}>
              <option value="">{t('form.promoter.select')}</option>
              {promoters.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {/* Future: <Button type="button" variant="outline" size="sm" disabled title={t('form.addNew.future', { entity: t('form.promoter.entityName') })}>{t('Add New')}</Button> */}
        </div>
      </div>
      {renderSocialLinksFields()}
    </>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {entityType === 'Event' && renderEventFields()}
      {entityType === 'DJ' && renderDJFields()}
      {entityType === 'Promoter' && renderPromoterFields()}
      {entityType === 'Club' && renderClubFields()}
      
      <div className="flex justify-end space-x-3 pt-6 border-t border-brand-surface-variant/50 mt-6">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          {t('form.cancel')}
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? t('form.submitting') : (initialData ? t('form.update') : t('form.create')) + ` ${t(`entity.${entityType.toLowerCase()}`)}`}
        </Button>
      </div>
    </form>
  );
};

export default EntityForm;
