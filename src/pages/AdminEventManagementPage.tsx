import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import CMSLayout from '../components/cms/CMSLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  CalendarDaysIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  PlusIcon,
  PencilIcon,
  PhotoIcon,
  LinkIcon,
  TrashIcon,
  CloudArrowUpIcon,
  GlobeAltIcon,
  MusicalNoteIcon,
  CurrencyEuroIcon,
  UserGroupIcon,
  TicketIcon
} from '@heroicons/react/24/outline';
import { EventData } from '../types';
import { useAuth } from '../hooks/useAuth';

interface EditModalProps {
  event: EventData;
  clubs: any[];
  djs: any[];
  promoters: any[];
  onSave: (eventData: EventData) => void;
  onClose: () => void;
  isCreating?: boolean;
}

const EditEventModal: React.FC<EditModalProps> = ({ 
  event, 
  clubs, 
  djs, 
  promoters, 
  onSave, 
  onClose,
  isCreating = false 
}) => {
  const [formData, setFormData] = useState<EventData>({
    ...event,
    date: event.date ? event.date.split('T')[0] : new Date().toISOString().split('T')[0],
    socialLinks: event.socialLinks || [{ platform: '', url: '' }],
    djIds: event.djIds || []
  });

  const [imageOption, setImageOption] = useState<'url' | 'upload' | 'none'>('url');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(event.imageUrl || '');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setImagePreview(url);
    setFormData(prev => ({ ...prev, imageUrl: url }));
  };

  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      socialLinks: [...(prev.socialLinks || []), { platform: '', url: '' }]
    }));
  };

  const removeSocialLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: (prev.socialLinks || []).filter((_, i) => i !== index)
    }));
  };

  const updateSocialLink = (index: number, field: 'platform' | 'url', value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: (prev.socialLinks || []).map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const toggleDJ = (djId: string) => {
    setFormData(prev => ({
      ...prev,
      djIds: prev.djIds?.includes(djId)
        ? prev.djIds.filter(id => id !== djId)
        : [...(prev.djIds || []), djId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      socialLinks: (formData.socialLinks || []).filter(link => link.platform && link.url)
    };
    onSave(finalData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content w-full max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold text-gradient">
            {isCreating ? 'Crear Nuevo Evento' : 'Editar Evento'}
          </h3>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center text-red-400 transition-all duration-300"
          >
            <XCircleIcon className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información Básica */}
          <div className="glass rounded-2xl p-6 border border-brand-orange/10">
            <h4 className="text-xl font-semibold text-brand-orange mb-6 flex items-center">
              <CalendarDaysIcon className="w-6 h-6 mr-2" />
              Información Básica del Evento
            </h4>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="label-contrast">
                  Nombre del Evento *
                </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input-contrast"
                  placeholder="Ej: Sunset Party Ibiza 2024"
              required
            />
          </div>

            <div>
                <label className="label-contrast">
                  Fecha del Evento *
                </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="input-contrast"
                required
              />
            </div>

            <div>
                <label className="label-contrast">
                  Hora de Inicio
                </label>
              <input
                  type="time"
                value={formData.time || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="input-contrast"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-white mb-3">
                  Tipo de Evento
                </label>
                <select
                  value={formData.eventType || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, eventType: e.target.value }))}
                  className="w-full p-4 glass rounded-xl text-black border border-brand-orange/20 focus:border-brand-orange/50 transition-all duration-300"
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="club">🏢 Club Night</option>
                  <option value="festival">🎪 Festival</option>
                  <option value="pool">🏊‍♂️ Pool Party</option>
                  <option value="beach">🏖️ Beach Party</option>
                  <option value="rooftop">🌃 Rooftop</option>
                  <option value="underground">🎧 Underground</option>
                  <option value="boat">⛵ Boat Party</option>
                  <option value="warehouse">🏭 Warehouse</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-white mb-3">
                  Precio de Entrada
                </label>
                <div className="relative">
                  <CurrencyEuroIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-orange" />
                  <input
                    type="text"
                    value={formData.price || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full pl-12 p-4 glass rounded-xl text-black border border-brand-orange/20 focus:border-brand-orange/50 transition-all duration-300"
                    placeholder="25, Gratis, VIP €50"
              />
                </div>
              </div>
            </div>
          </div>

          {/* Ubicación y Lugar */}
          <div className="glass rounded-2xl p-6 border border-brand-purple/10">
            <h4 className="text-xl font-semibold text-brand-purple mb-6 flex items-center">
              <MapPinIcon className="w-6 h-6 mr-2" />
              Ubicación y Lugar
            </h4>

            <div className="grid md:grid-cols-2 gap-6">
          <div>
                <label className="block text-sm font-medium text-brand-white mb-3">
                  Club/Venue *
                </label>
            <select
              value={formData.clubId || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, clubId: e.target.value }))}
                  className="w-full p-4 glass rounded-xl text-black border border-brand-purple/20 focus:border-brand-purple/50 transition-all duration-300"
                  required
            >
                  <option value="">Seleccionar venue</option>
              {clubs.map(club => (
                <option key={club.id} value={club.id}>{club.name}</option>
              ))}
            </select>
          </div>

          <div>
                <label className="block text-sm font-medium text-brand-white mb-3">
                  Promotor
                </label>
                <select
                  value={formData.promoterId || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, promoterId: e.target.value }))}
                  className="w-full p-4 glass rounded-xl text-black border border-brand-purple/20 focus:border-brand-purple/50 transition-all duration-300"
                >
                  <option value="">Seleccionar promotor</option>
                  {promoters.map(promoter => (
                    <option key={promoter.id} value={promoter.id}>{promoter.name}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-white mb-3">
                  Dirección o Ubicación Específica
                </label>
            <input
              type="text"
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-4 glass rounded-xl text-black border border-brand-purple/20 focus:border-brand-purple/50 transition-all duration-300"
                  placeholder="Información adicional de ubicación..."
                />
              </div>
            </div>
          </div>

          {/* Imagen del Evento */}
          <div className="glass rounded-2xl p-6 border border-green-400/10">
            <h4 className="text-xl font-semibold text-green-400 mb-6 flex items-center">
              <PhotoIcon className="w-6 h-6 mr-2" />
              Imagen del Evento
            </h4>

            <div className="space-y-6">
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => setImageOption('url')}
                  className={`flex items-center px-6 py-3 rounded-xl transition-all duration-300 ${
                    imageOption === 'url'
                      ? 'bg-green-500 text-white'
                      : 'glass border border-green-400/20 text-brand-white hover:border-green-400/50'
                  }`}
                >
                  <GlobeAltIcon className="w-5 h-5 mr-2" />
                  URL de Imagen
                </button>
                
                <button
                  type="button"
                  onClick={() => setImageOption('upload')}
                  className={`flex items-center px-6 py-3 rounded-xl transition-all duration-300 ${
                    imageOption === 'upload'
                      ? 'bg-green-500 text-white'
                      : 'glass border border-green-400/20 text-brand-white hover:border-green-400/50'
                  }`}
                >
                  <CloudArrowUpIcon className="w-5 h-5 mr-2" />
                  Subir Archivo
                </button>
              </div>

              {imageOption === 'url' && (
                <div>
                  <input
                    type="url"
                    value={formData.imageUrl || ''}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    className="w-full p-4 glass rounded-xl text-black border border-green-400/20 focus:border-green-400/50 transition-all duration-300"
                    placeholder="https://ejemplo.com/imagen-evento.jpg"
                  />
                </div>
              )}

              {imageOption === 'upload' && (
                <div className="border-2 border-dashed border-green-400/30 rounded-xl p-8 text-center hover:border-green-400/50 transition-all duration-300">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="event-image-upload"
                  />
                  <label htmlFor="event-image-upload" className="cursor-pointer flex flex-col items-center">
                    <CloudArrowUpIcon className="w-12 h-12 text-green-400 mb-4" />
                    <span className="text-brand-white font-medium">Subir imagen del evento</span>
                    <span className="text-brand-gray text-sm mt-2">PNG, JPG, WebP hasta 10MB</span>
                  </label>
                </div>
              )}

              {imagePreview && (
                <div className="flex justify-center">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Vista previa"
                      className="w-64 h-40 object-cover rounded-2xl border-4 border-green-400 shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setFormData(prev => ({ ...prev, imageUrl: '' }));
                      }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                    >
                      <XCircleIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Artistas y DJs */}
          <div className="glass rounded-2xl p-6 border border-yellow-400/10">
            <h4 className="text-xl font-semibold text-yellow-400 mb-6 flex items-center">
              <MusicalNoteIcon className="w-6 h-6 mr-2" />
              Artistas y DJs
            </h4>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto custom-scrollbar">
              {djs.map(dj => (
                <label
                  key={dj.id}
                  className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                    formData.djIds?.includes(dj.id)
                      ? 'bg-yellow-500/20 border border-yellow-400/50'
                      : 'glass border border-yellow-400/20 hover:border-yellow-400/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.djIds?.includes(dj.id) || false}
                    onChange={() => toggleDJ(dj.id)}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      formData.djIds?.includes(dj.id) ? 'bg-yellow-400 text-black' : 'bg-brand-surface'
                    }`}>
                      {formData.djIds?.includes(dj.id) ? '✓' : '♪'}
                    </div>
                    <div>
                      <span className="text-brand-white font-medium">{dj.name}</span>
                      <p className="text-brand-gray text-sm">{dj.genre}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Descripción del Evento */}
          <div className="glass rounded-2xl p-6 border border-blue-400/10">
            <h4 className="text-xl font-semibold text-blue-400 mb-6">
              Descripción del Evento
            </h4>

            <div className="space-y-6">
          <div>
                <label className="block text-sm font-medium text-brand-white mb-3">
                  Descripción Completa
                </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-4 glass rounded-xl text-black border border-blue-400/20 focus:border-blue-400/50 transition-all duration-300"
                  rows={6}
                  placeholder="Describe el evento, la música, el ambiente, qué esperar..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-brand-white mb-3">
                    Información Adicional
                  </label>
                  <input
                    type="text"
                    value={formData.weatherPlan || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, weatherPlan: e.target.value }))}
                    className="w-full p-4 glass rounded-xl text-black border border-blue-400/20 focus:border-blue-400/50 transition-all duration-300"
                    placeholder="Plan para mal tiempo, notas especiales..."
            />
          </div>

          <div>
                  <label className="block text-sm font-medium text-brand-white mb-3">
                    Edad Mínima
                  </label>
                  <input
                    type="text"
                    value={formData.ageRestriction || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, ageRestriction: e.target.value }))}
                    className="w-full p-4 glass rounded-xl text-black border border-blue-400/20 focus:border-blue-400/50 transition-all duration-300"
                    placeholder="18+, 21+, Sin restricción"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Redes Sociales del Evento */}
          <div className="glass rounded-2xl p-6 border border-pink-400/10">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-semibold text-pink-400 flex items-center">
                <LinkIcon className="w-6 h-6 mr-2" />
                Links y Redes Sociales
              </h4>
              <button
                type="button"
                onClick={addSocialLink}
                className="flex items-center px-4 py-2 bg-pink-500/20 text-pink-400 rounded-lg hover:bg-pink-500/30 transition-all duration-300"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Agregar Link
              </button>
            </div>

            <div className="space-y-4">
              {(formData.socialLinks || []).map((link: any, index: number) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <select
                      value={link.platform}
                      onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                      className="w-full p-3 glass rounded-lg text-black border border-pink-400/20 focus:border-pink-400/50 transition-all duration-300"
                    >
                      <option value="">Seleccionar tipo</option>
                      <option value="Facebook Event">📘 Evento de Facebook</option>
                      <option value="Instagram">📷 Instagram</option>
                      <option value="Tickets">🎫 Venta de Tickets</option>
                      <option value="Website">🌐 Sitio Web</option>
                      <option value="WhatsApp">💬 WhatsApp</option>
                      <option value="Telegram">✈️ Telegram</option>
                    </select>
                  </div>
                  
                  <div className="flex-2">
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                      className="w-full p-3 glass rounded-lg text-black border border-pink-400/20 focus:border-pink-400/50 transition-all duration-300"
                      placeholder="https://..."
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => removeSocialLink(index)}
                    className="p-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-300"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Estado y Configuración */}
          <div className="glass rounded-2xl p-6 border border-purple-400/10">
            <h4 className="text-xl font-semibold text-purple-400 mb-6">
              Estado y Configuración
            </h4>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-brand-white mb-3">
                  Estado de Aprobación
                </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full p-4 glass rounded-xl text-black border border-purple-400/20 focus:border-purple-400/50 transition-all duration-300"
            >
                  <option value="pending">🟡 Pendiente de Revisión</option>
                  <option value="approved">🟢 Aprobado</option>
                  <option value="rejected">🔴 Rechazado</option>
            </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-white mb-3">
                  Link de Tickets
                </label>
                <input
                  type="url"
                  value={formData.ticketLink || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, ticketLink: e.target.value }))}
                  className="w-full p-4 glass rounded-xl text-black border border-purple-400/20 focus:border-purple-400/50 transition-all duration-300"
                  placeholder="https://tickets.com/evento"
                />
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-4 pt-8 border-t border-brand-orange/20">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 glass border border-gray-500/30 text-gray-300 rounded-xl hover:border-gray-500/50 transition-all duration-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-brand-orange to-brand-purple text-white rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
            >
              {isCreating ? 'Crear Evento' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminEventManagementPage: React.FC = () => {
  const { events, clubs, djs, promoters, loading, updateEvent, deleteEvent, approveEvent, rejectEvent, addEvent } = useData();
  const { currentUser } = useAuth();
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  const getStatusConfig = (status: string | undefined) => {
    // Manejar casos donde status es undefined o null
    if (!status) {
      return {
        icon: ClockIcon,
        text: 'PENDIENTE',
        className: 'bg-gray-500 text-white'
      };
    }

    switch (status.toLowerCase()) {
      case 'approved':
        return {
          icon: CheckCircleIcon,
          text: 'APROBADO',
          className: 'bg-green-500 text-white'
        };
      case 'pending':
        return {
          icon: ClockIcon,
          text: 'PENDIENTE',
          className: 'bg-yellow-500 text-white'
        };
      case 'rejected':
        return {
          icon: XCircleIcon,
          text: 'RECHAZADO',
          className: 'bg-red-500 text-white'
        };
      default:
        return {
          icon: ClockIcon,
          text: status.toUpperCase(),
          className: 'bg-gray-500 text-white'
        };
    }
  };

  const handleEdit = (event: any) => {
    setEditingEvent(event as EventData);
  };

  // Función para crear un nuevo evento vacío
  const createNewEvent = (): EventData => ({
    id: '',
    name: '',
    slug: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    price: '',
    imageUrl: '',
    eventType: '',
    clubId: '',
    promoterId: '',
    djIds: [],
    socialLinks: [],
    originalSourceUrl: '',
    importNotes: '',
    status: 'pending',
    submittedBy: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const handleCreate = () => {
    setEditingEvent(createNewEvent());
    setIsCreating(true);
  };

  const handleSave = async (eventData: EventData) => {
    if (!currentUser) return;
    setIsSubmitting('save');
    try {
      if (isCreating) {
        // Crear nuevo evento
        await addEvent({
          name: eventData.name,
          description: eventData.description,
          date: eventData.date,
          time: eventData.time,
          price: eventData.price,
          imageUrl: eventData.imageUrl,
          eventType: eventData.eventType,
          clubId: eventData.clubId,
          promoterId: eventData.promoterId,
          djIds: eventData.djIds || [],
          socialLinks: eventData.socialLinks || [],
          originalSourceUrl: eventData.originalSourceUrl
        });
      } else {
        // Actualizar evento existente
        await updateEvent(eventData);
      }
      setEditingEvent(null);
      setIsCreating(false);
    } catch (error) {
      console.error('Error guardando evento:', error);
      alert('Error al guardar el evento');
    } finally {
      setIsSubmitting(null);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!currentUser || !window.confirm('¿Estás seguro de que quieres eliminar este evento?')) return;
    setIsSubmitting(eventId);
    try {
      await deleteEvent(eventId);
    } catch (error) {
      console.error('Error eliminando evento:', error);
      alert('Error al eliminar el evento');
    } finally {
      setIsSubmitting(null);
    }
  };

  const handleApprove = async (eventId: string) => {
    if (!currentUser) return;
    setIsSubmitting(eventId);
    try {
      await approveEvent(eventId);
    } catch (error) {
      console.error('Error aprobando evento:', error);
      alert('Error al aprobar el evento');
    } finally {
      setIsSubmitting(null);
    }
  };

  const handleReject = async (eventId: string) => {
    if (!currentUser) return;
    setIsSubmitting(eventId);
    try {
      await rejectEvent(eventId);
    } catch (error) {
      console.error('Error rechazando evento:', error);
      alert('Error al rechazar el evento');
    } finally {
      setIsSubmitting(null);
    }
  };

  if (loading) {
    return (
      <CMSLayout title="Gestión de Eventos">
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" text="Cargando eventos..." />
        </div>
      </CMSLayout>
    );
  }

  return (
    <CMSLayout title="Gestión de Eventos">
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-700">
              Total de eventos: <span className="font-bold text-orange-600">{events.length}</span>
        </p>
            <p className="text-sm text-gray-500 mt-1">
              Aprobados: {events.filter(e => e.status === 'approved').length} | 
              Pendientes: {events.filter(e => e.status === 'pending').length} | 
              Rechazados: {events.filter(e => e.status === 'rejected').length}
            </p>
          </div>
          <button 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300" 
            onClick={handleCreate}
          >
          <PlusIcon className="w-5 h-5" />
          <span>Agregar Evento</span>
        </button>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-lg">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No hay eventos</h3>
          <p className="text-gray-600">Agrega el primer evento para comenzar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const statusConfig = getStatusConfig(event.status);
            const StatusIcon = statusConfig.icon;
            const club = event.clubId ? clubs.find(c => c.id === event.clubId) : null;

            return (
              <div
                key={event.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 shadow-lg"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-brand-white truncate flex-1">
                    {event.name}
                  </h3>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-bold ${statusConfig.className}`}>
                    <StatusIcon className="w-3 h-3" />
                    <span>{statusConfig.text}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <CalendarDaysIcon className="w-4 h-4 text-brand-orange flex-shrink-0" />
                    <span className="text-sm text-brand-white/80">
                      {new Date(event.date).toLocaleDateString('es-ES')}
                    </span>
                    {event.time && (
                      <>
                        <ClockIcon className="w-4 h-4 text-brand-purple" />
                        <span className="text-sm text-brand-white/80">{event.time}</span>
                      </>
                    )}
                  </div>

                  {club && (
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="w-4 h-4 text-brand-purple flex-shrink-0" />
                      <span className="text-sm text-brand-white/80">{club.name}</span>
                    </div>
                  )}

                  {event.description && (
                    <p className="text-sm text-brand-white/70 line-clamp-2">
                      {event.description}
                    </p>
                  )}

                  {event.price && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-brand-orange">{event.price}</span>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                {event.status === 'pending' && (
                  <div className="flex space-x-2 mb-4">
                    <button
                      onClick={() => handleApprove(event.id)}
                      disabled={isSubmitting === event.id}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs rounded transition-colors"
                    >
                      {isSubmitting === event.id ? 'Aprobando...' : 'Aprobar'}
                    </button>
                    <button
                      onClick={() => handleReject(event.id)}
                      disabled={isSubmitting === event.id}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs rounded transition-colors"
                    >
                      {isSubmitting === event.id ? 'Rechazando...' : 'Rechazar'}
                    </button>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-brand-white/10">
                  <div className="text-xs text-brand-white/50">
                    {new Date(event.createdAt).toLocaleDateString('es-ES')}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleEdit(event)}
                      className="btn-secondary px-3 py-1 text-xs flex items-center space-x-1"
                    >
                      <PencilIcon className="w-3 h-3" />
                      <span>Editar</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(event.id)}
                      disabled={isSubmitting === event.id}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs rounded transition-colors"
                    >
                      {isSubmitting === event.id ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Edición */}
      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          clubs={clubs}
          djs={djs}
          promoters={promoters}
          onSave={handleSave}
          onClose={() => setEditingEvent(null)}
          isCreating={isCreating}
        />
      )}
    </CMSLayout>
  );
};

export default AdminEventManagementPage;