import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import CMSLayout from '../components/cms/CMSLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  UserIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  PlusIcon,
  PencilIcon,
  PhotoIcon,
  LinkIcon,
  TrashIcon,
  CloudArrowUpIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  StarIcon,
  CurrencyEuroIcon,
  CalendarDaysIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';

interface EditModalProps {
  promoter: any;
  onSave: (promoterData: any) => void;
  onClose: () => void;
  isCreating?: boolean;
}

const EditPromoterModal: React.FC<EditModalProps> = ({ promoter, onSave, onClose, isCreating = false }) => {
  const [formData, setFormData] = useState<any>({
    ...promoter,
    socialLinks: promoter.socialLinks || [{ platform: '', url: '' }],
    eventTypes: promoter.eventTypes || []
  });
  const [imageOption, setImageOption] = useState<'url' | 'upload' | 'none'>('url');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(promoter.imageUrl || '');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData((prev: any) => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setImagePreview(url);
    setFormData((prev: any) => ({ ...prev, imageUrl: url }));
  };

  const addSocialLink = () => {
    setFormData((prev: any) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: '', url: '' }]
    }));
  };

  const removeSocialLink = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_: any, i: number) => i !== index)
    }));
  };

  const updateSocialLink = (index: number, field: 'platform' | 'url', value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link: any, i: number) =>
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const toggleEventType = (eventType: string) => {
    setFormData((prev: any) => ({
      ...prev,
      eventTypes: prev.eventTypes.includes(eventType)
        ? prev.eventTypes.filter((type: string) => type !== eventType)
        : [...prev.eventTypes, eventType]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      socialLinks: formData.socialLinks.filter((link: any) => link.platform && link.url)
    };
    onSave(finalData);
  };

  const eventTypeOptions = [
    { value: 'club', label: '🏢 Club Night', color: 'bg-purple-500/20 border-purple-400/30' },
    { value: 'festival', label: '🎪 Festival', color: 'bg-orange-500/20 border-orange-400/30' },
    { value: 'pool', label: '🏊‍♂️ Pool Party', color: 'bg-blue-500/20 border-blue-400/30' },
    { value: 'beach', label: '🏖️ Beach Party', color: 'bg-cyan-500/20 border-cyan-400/30' },
    { value: 'rooftop', label: '🌃 Rooftop', color: 'bg-yellow-500/20 border-yellow-400/30' },
    { value: 'underground', label: '🎧 Underground', color: 'bg-gray-500/20 border-gray-400/30' },
    { value: 'boat', label: '⛵ Boat Party', color: 'bg-teal-500/20 border-teal-400/30' },
    { value: 'warehouse', label: '🏭 Warehouse', color: 'bg-red-500/20 border-red-400/30' }
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass rounded-3xl p-8 w-full max-w-5xl max-h-[95vh] overflow-y-auto border border-brand-orange/20">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold text-gradient">
            {isCreating ? 'Crear Nuevo Promotor' : 'Editar Promotor'}
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
              <BuildingOfficeIcon className="w-6 h-6 mr-2" />
              Información Básica del Promotor
            </h4>
            
            <div className="grid md:grid-cols-2 gap-6">
          <div>
                <label className="block text-sm font-medium text-brand-white mb-3">
                  Nombre del Promotor *
                </label>
            <input
              type="text"
                  value={formData.name || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
                  className="w-full p-4 glass rounded-xl text-black border border-brand-orange/20 focus:border-brand-orange/50 transition-all duration-300"
                  placeholder="Ej: Ibiza Global Events"
              required
            />
          </div>

          <div>
                <label className="block text-sm font-medium text-brand-white mb-3">
                  Slug (URL amigable)
                </label>
                <input
                  type="text"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, slug: e.target.value }))}
                  className="w-full p-4 glass rounded-xl text-black border border-brand-purple/20 focus:border-brand-purple/50 transition-all duration-300"
                  placeholder="ibiza-global-events"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-white mb-3">
                  Email de Contacto
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, email: e.target.value }))}
                  className="w-full p-4 glass rounded-xl text-black border border-brand-orange/20 focus:border-brand-orange/50 transition-all duration-300"
                  placeholder="contact@promotor.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-white mb-3">
                  Teléfono de Contacto
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, phone: e.target.value }))}
                  className="w-full p-4 glass rounded-xl text-black border border-brand-orange/20 focus:border-brand-orange/50 transition-all duration-300"
                  placeholder="+34 123 456 789"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-white mb-3">
                  Ubicación / Base de Operaciones
                </label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, location: e.target.value }))}
                  className="w-full p-4 glass rounded-xl text-black border border-brand-orange/20 focus:border-brand-orange/50 transition-all duration-300"
                  placeholder="Ibiza, España"
                />
              </div>
            </div>
          </div>

          {/* Logo/Imagen del Promotor */}
          <div className="glass rounded-2xl p-6 border border-brand-purple/10">
            <h4 className="text-xl font-semibold text-brand-purple mb-6 flex items-center">
              <PhotoIcon className="w-6 h-6 mr-2" />
              Logo del Promotor
            </h4>

            <div className="space-y-6">
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => setImageOption('url')}
                  className={`flex items-center px-6 py-3 rounded-xl transition-all duration-300 ${
                    imageOption === 'url'
                      ? 'bg-brand-orange text-white'
                      : 'glass border border-brand-orange/20 text-brand-white hover:border-brand-orange/50'
                  }`}
                >
                  <GlobeAltIcon className="w-5 h-5 mr-2" />
                  URL de Logo
                </button>
                
                <button
                  type="button"
                  onClick={() => setImageOption('upload')}
                  className={`flex items-center px-6 py-3 rounded-xl transition-all duration-300 ${
                    imageOption === 'upload'
                      ? 'bg-brand-purple text-white'
                      : 'glass border border-brand-purple/20 text-brand-white hover:border-brand-purple/50'
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
                    className="w-full p-4 glass rounded-xl text-black border border-brand-orange/20 focus:border-brand-orange/50 transition-all duration-300"
                    placeholder="https://ejemplo.com/logo-promotor.jpg"
                  />
                </div>
              )}

              {imageOption === 'upload' && (
                <div className="border-2 border-dashed border-brand-purple/30 rounded-xl p-8 text-center hover:border-brand-purple/50 transition-all duration-300">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="promoter-image-upload"
                  />
                  <label htmlFor="promoter-image-upload" className="cursor-pointer flex flex-col items-center">
                    <CloudArrowUpIcon className="w-12 h-12 text-brand-purple mb-4" />
                    <span className="text-brand-white font-medium">Subir logo del promotor</span>
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
                      className="w-48 h-32 object-cover rounded-2xl border-4 border-brand-orange shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setFormData((prev: any) => ({ ...prev, imageUrl: '' }));
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

          {/* Tipos de Eventos */}
          <div className="glass rounded-2xl p-6 border border-green-400/10">
            <h4 className="text-xl font-semibold text-green-400 mb-6 flex items-center">
              <CalendarDaysIcon className="w-6 h-6 mr-2" />
              Especialidades en Tipos de Eventos
            </h4>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {eventTypeOptions.map(({ value, label, color }) => (
                <label
                  key={value}
                  className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                    formData.eventTypes.includes(value)
                      ? `${color} scale-105`
                      : 'glass border border-green-400/20 hover:border-green-400/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.eventTypes.includes(value)}
                    onChange={() => toggleEventType(value)}
                    className="sr-only"
                  />
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    formData.eventTypes.includes(value) ? 'bg-green-400 text-black' : 'bg-brand-surface'
                  }`}>
                    {formData.eventTypes.includes(value) ? '✓' : '🎉'}
                  </div>
                  <span className="text-brand-white font-medium">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Descripción y Experiencia */}
          <div className="glass rounded-2xl p-6 border border-yellow-400/10">
            <h4 className="text-xl font-semibold text-yellow-400 mb-6 flex items-center">
              <StarIcon className="w-6 h-6 mr-2" />
              Experiencia y Descripción
            </h4>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-brand-white mb-3">
                  Descripción Completa de la Empresa
                </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
                  className="w-full p-4 glass rounded-xl text-black border border-yellow-400/20 focus:border-yellow-400/50 transition-all duration-300"
                  rows={6}
                  placeholder="Historia, filosofía, experiencia en el sector, especialidades..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-brand-white mb-3">
                    Años de Experiencia
                  </label>
                  <input
                    type="number"
                    value={formData.yearsExperience || ''}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, yearsExperience: e.target.value }))}
                    className="w-full p-4 glass rounded-xl text-black border border-yellow-400/20 focus:border-yellow-400/50 transition-all duration-300"
                    placeholder="10"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-white mb-3">
                    Número de Eventos Anuales (aprox.)
                  </label>
                  <input
                    type="number"
                    value={formData.eventsPerYear || ''}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, eventsPerYear: e.target.value }))}
                    className="w-full p-4 glass rounded-xl text-black border border-yellow-400/20 focus:border-yellow-400/50 transition-all duration-300"
                    placeholder="50"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-white mb-3">
                    Capacidad Máxima de Eventos
                  </label>
                  <input
                    type="text"
                    value={formData.maxCapacity || ''}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, maxCapacity: e.target.value }))}
                    className="w-full p-4 glass rounded-xl text-black border border-yellow-400/20 focus:border-yellow-400/50 transition-all duration-300"
                    placeholder="5000 personas, Sin límite, Depende del venue"
            />
          </div>

          <div>
                  <label className="block text-sm font-medium text-brand-white mb-3">
                    Nivel de Precios
                  </label>
                  <select
                    value={formData.priceRange || ''}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, priceRange: e.target.value }))}
                    className="w-full p-4 glass rounded-xl text-black border border-yellow-400/20 focus:border-yellow-400/50 transition-all duration-300"
                  >
                    <option value="">Seleccionar rango</option>
                    <option value="budget">💰 Económico (€10-30)</option>
                    <option value="mid">💰💰 Medio (€30-60)</option>
                    <option value="premium">💰💰💰 Premium (€60-100)</option>
                    <option value="luxury">💰💰💰💰 Lujo (€100+)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Redes Sociales */}
          <div className="glass rounded-2xl p-6 border border-blue-400/10">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-semibold text-blue-400 flex items-center">
                <LinkIcon className="w-6 h-6 mr-2" />
                Redes Sociales y Contacto
              </h4>
              <button
                type="button"
                onClick={addSocialLink}
                className="flex items-center px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all duration-300"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Agregar Red Social
              </button>
            </div>

            <div className="space-y-4">
              {formData.socialLinks.map((link: any, index: number) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <select
                      value={link.platform}
                      onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                      className="w-full p-3 glass rounded-lg text-black border border-blue-400/20 focus:border-blue-400/50 transition-all duration-300"
                    >
                      <option value="">Seleccionar plataforma</option>
                      <option value="Instagram">📷 Instagram</option>
                      <option value="Facebook">📘 Facebook</option>
                      <option value="Twitter">🐦 Twitter</option>
                      <option value="LinkedIn">💼 LinkedIn</option>
                      <option value="Website">🌐 Sitio Web</option>
                      <option value="WhatsApp">💬 WhatsApp Business</option>
                      <option value="Telegram">✈️ Telegram</option>
                      <option value="Email">📧 Email</option>
                    </select>
                  </div>
                  
                  <div className="flex-2">
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                      className="w-full p-3 glass rounded-lg text-black border border-blue-400/20 focus:border-blue-400/50 transition-all duration-300"
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
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, status: e.target.value }))}
                  className="w-full p-4 glass rounded-xl text-black border border-purple-400/20 focus:border-purple-400/50 transition-all duration-300"
            >
                  <option value="pending">🟡 Pendiente de Revisión</option>
                  <option value="approved">🟢 Aprobado</option>
                  <option value="rejected">🔴 Rechazado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-white mb-3">
                  Nivel de Promotor
                </label>
                <select
                  value={formData.tier || 'standard'}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, tier: e.target.value }))}
                  className="w-full p-4 glass rounded-xl text-black border border-purple-400/20 focus:border-purple-400/50 transition-all duration-300"
                >
                  <option value="standard">⭐ Estándar</option>
                  <option value="premium">⭐⭐ Premium</option>
                  <option value="vip">⭐⭐⭐ VIP</option>
                  <option value="elite">⭐⭐⭐⭐ Elite</option>
            </select>
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
              {isCreating ? 'Crear Promotor' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminPromoterManagementPage: React.FC = () => {
  const { promoters, loading, updatePromoter, deletePromoter, approvePromoter, rejectPromoter, addPromoter } = useData();
  const { currentUser } = useAuth();
  const [editingPromoter, setEditingPromoter] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  const createNewPromoter = (): any => ({
    id: '',
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    email: '',
    phone: '',
    location: '',
    socialLinks: [],
    eventTypes: [],
    yearsExperience: '',
    eventsPerYear: '',
    maxCapacity: '',
    priceRange: '',
    tier: 'standard',
    status: 'pending',
    submittedBy: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const handleCreate = () => {
    setEditingPromoter(createNewPromoter());
    setIsCreating(true);
  };

  const handleEdit = (promoter: any) => {
    setEditingPromoter(promoter);
    setIsCreating(false);
  };

  const handleSave = async (promoterData: any) => {
    if (!currentUser) return;
    setIsSubmitting('save');
    try {
      if (isCreating) {
        await addPromoter({
          name: promoterData.name,
          description: promoterData.description,
          photoUrl: promoterData.imageUrl || '',
          contactInfo: {
            email: promoterData.email,
            phone: promoterData.phone
          },
          socialLinks: promoterData.socialLinks || []
        });
      } else {
        await updatePromoter(promoterData);
      }
      setEditingPromoter(null);
      setIsCreating(false);
    } catch (error) {
      console.error('Error guardando promotor:', error);
      alert('Error al guardar el promotor');
    } finally {
      setIsSubmitting(null);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
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
          className: 'bg-yellow-500 text-black'
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

  const handleDelete = async (promoterId: string) => {
    if (!currentUser || !window.confirm('¿Estás seguro de que quieres eliminar este promotor?')) return;
    setIsSubmitting(promoterId);
    try {
      await deletePromoter(promoterId);
    } catch (error) {
      console.error('Error eliminando promotor:', error);
      alert('Error al eliminar el promotor');
    } finally {
      setIsSubmitting(null);
    }
  };

  const handleApprove = async (promoterId: string) => {
    if (!currentUser) return;
    setIsSubmitting(promoterId);
    try {
      await approvePromoter(promoterId);
    } catch (error) {
      console.error('Error aprobando promotor:', error);
      alert('Error al aprobar el promotor');
    } finally {
      setIsSubmitting(null);
    }
  };

  const handleReject = async (promoterId: string) => {
    if (!currentUser) return;
    setIsSubmitting(promoterId);
    try {
      await rejectPromoter(promoterId);
    } catch (error) {
      console.error('Error rechazando promotor:', error);
      alert('Error al rechazar el promotor');
    } finally {
      setIsSubmitting(null);
    }
  };

  if (loading) {
    return (
      <CMSLayout title="Gestión de Promotores">
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" text="Cargando promotores..." />
        </div>
      </CMSLayout>
    );
  }

  return (
    <CMSLayout title="Gestión de Promotores">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-brand-gray">
          Total de promotores: <span className="font-bold text-brand-orange">{promoters.length}</span>
        </p>
        <button className="btn-primary flex items-center space-x-2" onClick={handleCreate}>
          <PlusIcon className="w-5 h-5" />
          <span>Agregar Promotor</span>
        </button>
      </div>

      {promoters.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎭</div>
          <h3 className="text-xl font-bold text-brand-white mb-2">No hay promotores</h3>
          <p className="text-brand-gray">Agrega el primer promotor para comenzar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promoters.map((promoter) => {
            const statusConfig = getStatusConfig(promoter.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={promoter.id}
                className="bg-brand-surface border border-brand-orange/20 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-brand-white truncate flex-1">
                    {promoter.name}
                  </h3>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-bold ${statusConfig.className}`}>
                    <StatusIcon className="w-3 h-3" />
                    <span>{statusConfig.text}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3 mb-4">
                  {promoter.location && (
                    <div className="flex items-center space-x-2">
                      <BuildingOfficeIcon className="w-4 h-4 text-brand-orange flex-shrink-0" />
                      <span className="text-sm text-brand-white/80">{promoter.location}</span>
                    </div>
                  )}

                  {promoter.description && (
                    <p className="text-sm text-brand-white/70 line-clamp-2">
                      {promoter.description}
                    </p>
                  )}

                  <div className="flex items-center space-x-2">
                    <UsersIcon className="w-4 h-4 text-brand-purple" />
                    <span className="text-sm text-brand-white/80">
                      Organizador de Eventos
                    </span>
                  </div>

                  {promoter.eventTypes && promoter.eventTypes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {promoter.eventTypes.slice(0, 3).map((type: string) => (
                        <span key={type} className="px-2 py-1 bg-brand-orange/20 text-brand-orange text-xs rounded-full">
                          {type}
                        </span>
                      ))}
                      {promoter.eventTypes.length > 3 && (
                        <span className="px-2 py-1 bg-brand-gray/20 text-brand-gray text-xs rounded-full">
                          +{promoter.eventTypes.length - 3}
                    </span>
                      )}
                  </div>
                  )}
                </div>

                {/* Quick Actions */}
                {promoter.status === 'pending' && (
                  <div className="flex space-x-2 mb-4">
                    <button
                      onClick={() => handleApprove(promoter.id)}
                      disabled={isSubmitting === promoter.id}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs rounded transition-colors"
                    >
                      {isSubmitting === promoter.id ? 'Aprobando...' : 'Aprobar'}
                    </button>
                    <button
                      onClick={() => handleReject(promoter.id)}
                      disabled={isSubmitting === promoter.id}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs rounded transition-colors"
                    >
                      {isSubmitting === promoter.id ? 'Rechazando...' : 'Rechazar'}
                    </button>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-brand-white/10">
                  <div className="text-xs text-brand-white/50">
                    {new Date(promoter.createdAt).toLocaleDateString('es-ES')}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleEdit(promoter)}
                      className="btn-secondary px-3 py-1 text-xs flex items-center space-x-1"
                    >
                      <PencilIcon className="w-3 h-3" />
                      <span>Editar</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(promoter.id)}
                      disabled={isSubmitting === promoter.id}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs rounded transition-colors"
                    >
                      {isSubmitting === promoter.id ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Edición */}
      {editingPromoter && (
        <EditPromoterModal
          promoter={editingPromoter}
          onSave={handleSave}
          onClose={() => setEditingPromoter(null)}
          isCreating={isCreating}
        />
      )}
    </CMSLayout>
  );
};

export default AdminPromoterManagementPage;