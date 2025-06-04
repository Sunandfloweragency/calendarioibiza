import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import ImageGalleryManager from '../admin/ImageGalleryManager';
import EntitySelector from '../admin/EntitySelector';
import { DJ_GENRES, EVENT_TYPES, SOCIAL_PLATFORMS } from '../../constants';
import { useData } from '../../contexts/DataContext';
import { 
  BaseEntity, 
  DJData, 
  EventData, 
  PromoterData, 
  ClubData, 
  FormEntityCreateData as GenericFormEntityCreateData, 
  FormEntityData, 
  MediaItem
} from '../../types';
import { useTranslation } from 'react-i18next';

interface EntityFormImprovedProps<T extends EventData | DJData | PromoterData | ClubData, U extends GenericFormEntityCreateData> {
  entityType: 'Event' | 'DJ' | 'Promoter' | 'Club';
  initialData?: T; 
  onSubmit: (data: U | T) => Promise<void>; 
  onCancel: () => void;
  isSubmitting: boolean;
}

const EntityFormImproved = <
  T extends EventData | DJData | PromoterData | ClubData, 
  U extends GenericFormEntityCreateData
>({
  entityType,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: EntityFormImprovedProps<T, U>) => {
  
  // Estado principal del formulario
  const [formData, setFormData] = useState<FormEntityData>(() => {
    if (initialData) return initialData;

    const baseForm = { 
      name: '', 
      description: '', 
      socialLinks: [],
      mainImage: undefined,
      gallery: []
    };

    switch (entityType) {
      case 'Event':
        return { 
          ...baseForm, 
          date: '', 
          time: '', 
          imageUrl: '', 
          djIds: [],
          clubId: '',
          promoterId: '',
          price: '',
          eventType: '',
          lineup: [],
          ticketPrices: []
        } as Partial<EventData>;
      case 'DJ':
        return { 
          ...baseForm, 
          photoUrl: '', 
          bio: '', 
          genres: [],
          realName: '',
          country: '',
          yearsActive: '',
          recordLabels: [],
          achievements: []
        } as Partial<DJData>;
      case 'Promoter':
        return { 
          ...baseForm, 
          logoUrl: '', 
          history: '', 
          eventTypeFocus: '',
          foundedYear: undefined,
          headquarters: '',
          contactEmail: '',
          website: ''
        } as Partial<PromoterData>;
      case 'Club':
        return { 
          ...baseForm, 
          address: '', 
          musicType: '', 
          photos: [], 
          services: [],
          capacity: undefined,
          priceRange: '',
          ageRestriction: '',
          amenities: []
        } as Partial<ClubData>;
      default:
        return baseForm as any;
    }
  });

  const { djs, clubs, promoters } = useData(); 
  const { t } = useTranslation();

  // Manejar cambios en campos de entrada
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      if (name === 'genres_checkbox') { 
        setFormData(prev => {
          const currentGenres = (prev as Partial<DJData>).genres || [];
          return { 
            ...prev, 
            genres: checked 
              ? [...currentGenres, value] 
              : currentGenres.filter(item => item !== value) 
          };
        });
      } else if (name === 'services_checkbox') { 
        setFormData(prev => {
          const currentServices = (prev as Partial<ClubData>).services || [];
          return { 
            ...prev, 
            services: checked 
              ? [...currentServices, value] 
              : currentServices.filter(item => item !== value) 
          };
        });
      } else if (name === 'amenities_checkbox') { 
        setFormData(prev => {
          const currentAmenities = (prev as Partial<ClubData>).amenities || [];
          return { 
            ...prev, 
            amenities: checked 
              ? [...currentAmenities, value] 
              : currentAmenities.filter(item => item !== value) 
          };
        });
      }
    } else if (name === 'capacity' && entityType === 'Club') {
      setFormData(prev => ({ ...prev, capacity: value ? parseInt(value) : undefined }));
    } else if (name === 'foundedYear' && entityType === 'Promoter') {
      setFormData(prev => ({ ...prev, foundedYear: value ? parseInt(value) : undefined }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Manejar cambios en las galerías de imágenes
  const handleImagesChange = (images: MediaItem[]) => {
    setFormData(prev => ({ ...prev, gallery: images }));
    
    // Actualizar imagen principal si existe
    const mainImage = images.find(img => img.isMain);
    if (mainImage) {
      setFormData(prev => ({ ...prev, mainImage }));
      
      // Mantener compatibilidad con campos legacy
      if (entityType === 'Event') {
        setFormData(prev => ({ ...prev, imageUrl: mainImage.url }));
      } else if (entityType === 'DJ') {
        setFormData(prev => ({ ...prev, photoUrl: mainImage.url }));
      } else if (entityType === 'Promoter') {
        setFormData(prev => ({ ...prev, logoUrl: mainImage.url }));
      } else if (entityType === 'Club') {
        setFormData(prev => ({ 
          ...prev, 
          photos: images.map(img => img.url)
        }));
      }
    }
  };

  // Manejar cambios en la selección de entidades
  const handleEntitySelectionChange = (field: string) => (selectedIds: string[]) => {
    setFormData(prev => ({ ...prev, [field]: selectedIds }));
  };

  // Manejar cambios en redes sociales
  const handleSocialLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
    const currentLinks = (formData as any).socialLinks || [];
    const newSocialLinks = [...currentLinks];
    newSocialLinks[index] = { ...newSocialLinks[index], [field]: value };
    setFormData(prev => ({ ...prev, socialLinks: newSocialLinks }));
  };

  const addSocialLink = () => {
    const currentLinks = (formData as any).socialLinks || [];
    const newSocialLinks = [...currentLinks, { platform: SOCIAL_PLATFORMS[0], url: '' }];
    setFormData(prev => ({ ...prev, socialLinks: newSocialLinks }));
  };

  const removeSocialLink = (index: number) => {
    const currentLinks = (formData as any).socialLinks || [];
    const newSocialLinks = currentLinks.filter((_: any, i: number) => i !== index);
    setFormData(prev => ({ ...prev, socialLinks: newSocialLinks }));
  };

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!('name' in formData) || !formData.name || formData.name.trim() === '') {
      alert(`${entityType} name is required.`);
      return;
    }
    onSubmit(initialData ? formData as T : formData as U);
  };

  // Preparar opciones para selecciones con verificaciones de tipos
  const djOptions = djs.map(dj => {
    // Usar campos correctos de los tipos de datos
    const photoUrl = 'photoUrl' in dj ? (dj as any).photoUrl : 'imageUrl' in dj ? (dj as any).imageUrl : '';
    const genres = 'genres' in dj ? (dj as any).genres : 'genre' in dj ? [(dj as any).genre] : [];
    
    return {
      id: dj.id,
      name: dj.name,
      slug: dj.slug,
      image: typeof photoUrl === 'string' ? photoUrl : undefined,
      subtitle: Array.isArray(genres) ? genres.join(', ') : (typeof genres === 'string' ? genres : '')
    };
  });

  const clubOptions = clubs.map(club => {
    // Usar campos correctos de los tipos de datos
    const photos = 'photos' in club ? (club as any).photos : [];
    const address = 'address' in club ? (club as any).address : 'location' in club ? (club as any).location : '';
    
    return {
      id: club.id,
      name: club.name,
      slug: club.slug,
      image: Array.isArray(photos) && photos.length > 0 ? photos[0] : ('imageUrl' in club ? (club as any).imageUrl : undefined),
      subtitle: typeof address === 'string' ? address : ''
    };
  });

  const promoterOptions = promoters.map(promoter => {
    // Usar campos correctos de los tipos de datos
    const logoUrl = 'logoUrl' in promoter ? (promoter as any).logoUrl : 'imageUrl' in promoter ? (promoter as any).imageUrl : '';
    const eventTypeFocus = 'eventTypeFocus' in promoter ? (promoter as any).eventTypeFocus : '';
    
    return {
      id: promoter.id,
      name: promoter.name,
      slug: promoter.slug,
      image: typeof logoUrl === 'string' ? logoUrl : undefined,
      subtitle: typeof eventTypeFocus === 'string' ? eventTypeFocus : ''
    };
  });

  // Estilos comunes
  const commonSelectClass = "w-full px-3 py-2 bg-brand-dark border border-brand-gray/30 rounded-md text-white focus:border-brand-orange focus:outline-none";
  const checkboxClass = "form-checkbox h-4 w-4 text-brand-orange bg-brand-dark border-brand-gray/30 rounded focus:ring-brand-orange";
  const checkboxLabelClass = "flex items-center space-x-2 text-sm text-brand-white cursor-pointer";

  // Campos comunes para todas las entidades
  const renderCommonFields = () => (
    <>
      <Input 
        label="Nombre" 
        name="name" 
        value={(formData as any).name || ''} 
        onChange={handleChange} 
        required 
      />
      <Textarea 
        label="Descripción" 
        name="description" 
        value={(formData as any).description || ''} 
        onChange={handleChange} 
      />
      
      {/* Gestión de imágenes */}
      <ImageGalleryManager
        images={(formData as any).gallery || []}
        onImagesChange={handleImagesChange}
        maxImages={entityType === 'Event' ? 10 : entityType === 'Club' ? 15 : 5}
        allowMainImage={true}
        title={`Imágenes ${entityType === 'Event' ? 'del Evento' : entityType === 'DJ' ? 'del DJ' : entityType === 'Promoter' ? 'de la Promotora' : 'del Club'}`}
      />
    </>
  );

  // Campos específicos para eventos
  const renderEventFields = () => (
    <>
      {renderCommonFields()}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          label="Fecha" 
          name="date" 
          type="date" 
          value={(formData as Partial<EventData>).date || ''} 
          onChange={handleChange} 
          required 
        />
        <Input 
          label="Hora" 
          name="time" 
          type="time" 
          value={(formData as Partial<EventData>).time || ''} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          label="Precio" 
          name="price" 
          value={(formData as Partial<EventData>).price || ''} 
          onChange={handleChange}
          placeholder="ej. €20-€50, Gratis"
        />
        <div>
          <label className="block text-sm font-medium text-brand-white mb-2">Tipo de Evento</label>
          <select 
            name="eventType" 
            value={(formData as Partial<EventData>).eventType || ''} 
            onChange={handleChange} 
            className={commonSelectClass}
          >
            <option value="">Seleccionar tipo</option>
            {EVENT_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Selector de Club */}
      <EntitySelector
        label="Club/Venue"
        options={clubOptions}
        selectedIds={(formData as Partial<EventData>).clubId ? [(formData as Partial<EventData>).clubId!] : []}
        onSelectionChange={(ids) => setFormData(prev => ({ ...prev, clubId: ids[0] || '' }))}
        multiple={false}
        placeholder="Seleccionar club..."
        allowEmpty={true}
      />

      {/* Selector de DJs */}
      <EntitySelector
        label="DJs del Evento"
        options={djOptions}
        selectedIds={(formData as Partial<EventData>).djIds || []}
        onSelectionChange={handleEntitySelectionChange('djIds')}
        multiple={true}
        placeholder="Seleccionar DJs..."
        maxSelections={10}
      />

      {/* Selector de Promotora */}
      <EntitySelector
        label="Promotora"
        options={promoterOptions}
        selectedIds={(formData as Partial<EventData>).promoterId ? [(formData as Partial<EventData>).promoterId!] : []}
        onSelectionChange={(ids) => setFormData(prev => ({ ...prev, promoterId: ids[0] || '' }))}
        multiple={false}
        placeholder="Seleccionar promotora..."
        allowEmpty={true}
      />

      <Input 
        label="Enlace de entradas (opcional)" 
        name="ticketLink" 
        type="url" 
        value={(formData as Partial<EventData>).ticketLink || ''} 
        onChange={handleChange}
        placeholder="https://..." 
      />

      {renderSocialLinksFields()}
    </>
  );

  // Campos específicos para DJs
  const renderDJFields = () => (
    <>
      {renderCommonFields()}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          label="Nombre Real (opcional)" 
          name="realName" 
          value={(formData as Partial<DJData>).realName || ''} 
          onChange={handleChange} 
        />
        <Input 
          label="País" 
          name="country" 
          value={(formData as Partial<DJData>).country || ''} 
          onChange={handleChange} 
        />
      </div>

      <Textarea 
        label="Biografía" 
        name="bio" 
        value={(formData as Partial<DJData>).bio || ''} 
        onChange={handleChange}
        rows={4}
      />

      <Input 
        label="Años Activo" 
        name="yearsActive" 
        value={(formData as Partial<DJData>).yearsActive || ''} 
        onChange={handleChange}
        placeholder="ej. 2010-presente"
      />

      <div>
        <label className="block text-sm font-medium text-brand-white mb-2">Géneros Musicales</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-3 bg-brand-dark/50 rounded-md">
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

  // Campos específicos para promotoras
  const renderPromoterFields = () => (
    <>
      {renderCommonFields()}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          label="Año de Fundación" 
          name="foundedYear" 
          type="number" 
          value={(formData as Partial<PromoterData>).foundedYear?.toString() || ''} 
          onChange={handleChange}
          min="1900"
          max={new Date().getFullYear()}
        />
        <Input 
          label="Sede" 
          name="headquarters" 
          value={(formData as Partial<PromoterData>).headquarters || ''} 
          onChange={handleChange} 
        />
      </div>

      <Textarea 
        label="Historia/Acerca de" 
        name="history" 
        value={(formData as Partial<PromoterData>).history || ''} 
        onChange={handleChange}
        rows={4}
      />

      <Input 
        label="Enfoque de Eventos" 
        name="eventTypeFocus" 
        value={(formData as Partial<PromoterData>).eventTypeFocus || ''} 
        onChange={handleChange}
        placeholder="ej. Techno, House, Eventos de día"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          label="Email de Contacto" 
          name="contactEmail" 
          type="email" 
          value={(formData as Partial<PromoterData>).contactEmail || ''} 
          onChange={handleChange} 
        />
        <Input 
          label="Sitio Web" 
          name="website" 
          type="url" 
          value={(formData as Partial<PromoterData>).website || ''} 
          onChange={handleChange} 
        />
      </div>

      {renderSocialLinksFields()}
    </>
  );

  // Campos específicos para clubs
  const renderClubFields = () => {
    const commonAmenities = [
      'VIP Area', 'Terraza', 'Área de Fumadores', 'Bar Principal', 'Bar Secundario',
      'Guardarropa', 'Parking Privado', 'Piscina', 'Jardín', 'Escenario Principal',
      'Escenario Secundario', 'Área Chill Out', 'Cabinas VIP', 'Zona Gourmet'
    ];

    return (
      <>
        {renderCommonFields()}
        
        <Input 
          label="Dirección" 
          name="address" 
          value={(formData as Partial<ClubData>).address || ''} 
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input 
            label="Capacidad" 
            name="capacity" 
            type="number" 
            value={(formData as Partial<ClubData>).capacity?.toString() || ''} 
            onChange={handleChange}
            min="1"
          />
          <Input 
            label="Rango de Precios" 
            name="priceRange" 
            value={(formData as Partial<ClubData>).priceRange || ''} 
            onChange={handleChange}
            placeholder="ej. €20-€80"
          />
          <Input 
            label="Restricción de Edad" 
            name="ageRestriction" 
            value={(formData as Partial<ClubData>).ageRestriction || ''} 
            onChange={handleChange}
            placeholder="ej. 18+, 21+"
          />
        </div>

        <Input 
          label="Tipo de Música" 
          name="musicType" 
          value={(formData as Partial<ClubData>).musicType || ''} 
          onChange={handleChange}
          placeholder="ej. Techno, House, EDM"
        />

        <div>
          <label className="block text-sm font-medium text-brand-white mb-2">Servicios y Amenidades</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-3 bg-brand-dark/50 rounded-md">
            {commonAmenities.map(amenity => (
              <label key={amenity} className={checkboxLabelClass}>
                <input 
                  type="checkbox" 
                  name="amenities_checkbox" 
                  value={amenity} 
                  checked={((formData as Partial<ClubData>).amenities || []).includes(amenity)} 
                  onChange={handleChange}
                  className={checkboxClass}
                />
                <span>{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        <Input 
          label="Enlace del Mapa (opcional)" 
          name="mapLink" 
          type="url" 
          value={(formData as Partial<ClubData>).mapLink || ''} 
          onChange={handleChange}
          placeholder="Google Maps URL"
        />

        {renderSocialLinksFields()}
      </>
    );
  };

  // Campos de redes sociales
  const renderSocialLinksFields = () => (
    <div className="space-y-3 border-t border-brand-gray/20 pt-6">
      <h4 className="text-lg font-semibold text-brand-orange">Redes Sociales</h4>
      {((formData as any).socialLinks || []).map((link: any, index: number) => (
        <div key={index} className="flex items-center space-x-2 p-3 bg-brand-dark/50 rounded-lg">
          <select 
            value={link.platform} 
            onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
            className="px-3 py-2 bg-brand-dark border border-brand-gray/30 rounded text-white"
          >
            <option value="">Plataforma</option>
            {SOCIAL_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <Input 
            type="url" 
            placeholder="URL" 
            value={link.url} 
            onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)} 
            className="flex-grow"
          />
          <Button 
            type="button" 
            variant="danger" 
            size="sm" 
            onClick={() => removeSocialLink(index)}
          >
            ×
          </Button>
        </div>
      ))}
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        onClick={addSocialLink}
      >
        + Añadir Red Social
      </Button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {entityType === 'Event' && renderEventFields()}
        {entityType === 'DJ' && renderDJFields()}
        {entityType === 'Promoter' && renderPromoterFields()}
        {entityType === 'Club' && renderClubFields()}
        
        <div className="flex justify-end space-x-3 pt-6 border-t border-brand-gray/20">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel} 
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? 'Guardando...' 
              : (initialData ? 'Actualizar' : 'Crear') + ` ${entityType}`
            }
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EntityFormImproved; 