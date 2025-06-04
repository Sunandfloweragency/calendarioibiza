import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import CMSLayout from '../components/cms/CMSLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  MusicalNoteIcon, 
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
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';

interface EditModalProps {
  dj: any;
  onSave: (djData: any) => void;
  onClose: () => void;
  isCreating?: boolean;
}

const EditDJModal: React.FC<EditModalProps> = ({ dj, onSave, onClose, isCreating = false }) => {
  const [formData, setFormData] = useState<any>({
    ...dj,
    socialLinks: dj.socialLinks || [{ platform: '', url: '' }]
  });
  const [imageOption, setImageOption] = useState<'url' | 'upload' | 'none'>('url');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(dj.imageUrl || '');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      socialLinks: formData.socialLinks.filter((link: any) => link.platform && link.url)
    };
    onSave(finalData);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass rounded-3xl p-8 w-full max-w-4xl max-h-[95vh] overflow-y-auto border border-brand-orange/20">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold text-gradient">
            {isCreating ? 'Crear Nuevo DJ' : 'Editar DJ'}
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
              <UserIcon className="w-6 h-6 mr-2" />
              Información Básica
            </h4>
            
            <div className="grid md:grid-cols-2 gap-6">
          <div>
                <label className="block text-sm font-medium text-brand-white mb-3">
                  Nombre del DJ *
                </label>
            <input
              type="text"
                  value={formData.name || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
                  className="w-full p-4 glass rounded-xl text-black border border-brand-orange/20 focus:border-brand-orange/50 transition-all duration-300"
                  placeholder="Ej: Calvin Harris"
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
                  placeholder="calvin-harris"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-white mb-3">
                  Géneros Musicales
                </label>
            <input
              type="text"
              value={formData.genre || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, genre: e.target.value }))}
                  className="w-full p-4 glass rounded-xl text-black border border-brand-orange/20 focus:border-brand-orange/50 transition-all duration-300"
                  placeholder="House, Techno, Progressive, Trance (separados por comas)"
                />
              </div>
            </div>
          </div>

          {/* Imagen del DJ */}
          <div className="glass rounded-2xl p-6 border border-brand-purple/10">
            <h4 className="text-xl font-semibold text-brand-purple mb-6 flex items-center">
              <PhotoIcon className="w-6 h-6 mr-2" />
              Imagen del DJ
            </h4>

            <div className="space-y-6">
              {/* Opciones de imagen */}
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
                  URL de Imagen
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

              {/* Campo de URL */}
              {imageOption === 'url' && (
                <div>
                  <label className="block text-sm font-medium text-brand-white mb-3">
                    URL de la Imagen
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl || ''}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    className="w-full p-4 glass rounded-xl text-black border border-brand-orange/20 focus:border-brand-orange/50 transition-all duration-300"
                    placeholder="https://ejemplo.com/imagen-dj.jpg"
                  />
                </div>
              )}

              {/* Campo de subida */}
              {imageOption === 'upload' && (
                <div>
                  <label className="block text-sm font-medium text-brand-white mb-3">
                    Subir Imagen
                  </label>
                  <div className="border-2 border-dashed border-brand-purple/30 rounded-xl p-8 text-center hover:border-brand-purple/50 transition-all duration-300">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <CloudArrowUpIcon className="w-12 h-12 text-brand-purple mb-4" />
                      <span className="text-brand-white font-medium">
                        Haz clic para subir o arrastra una imagen aquí
                      </span>
                      <span className="text-brand-gray text-sm mt-2">
                        PNG, JPG, WebP hasta 10MB
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Vista previa de imagen */}
              {imagePreview && (
                <div className="flex justify-center">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Vista previa"
                      className="w-48 h-48 object-cover rounded-2xl border-4 border-brand-orange shadow-lg"
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

          {/* Biografía y Descripción */}
          <div className="glass rounded-2xl p-6 border border-green-400/10">
            <h4 className="text-xl font-semibold text-green-400 mb-6 flex items-center">
              <MusicalNoteIcon className="w-6 h-6 mr-2" />
              Biografía y Descripción
            </h4>

            <div className="space-y-6">
          <div>
                <label className="block text-sm font-medium text-brand-white mb-3">
                  Biografía Completa
                </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
                  className="w-full p-4 glass rounded-xl text-black border border-green-400/20 focus:border-green-400/50 transition-all duration-300"
                  rows={6}
                  placeholder="Escribe una biografía detallada del DJ, su trayectoria, logros, estilo musical..."
            />
          </div>

          <div>
                <label className="block text-sm font-medium text-brand-white mb-3">
                  Descripción Corta (para tarjetas)
                </label>
                <textarea
                  value={formData.shortDescription || ''}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, shortDescription: e.target.value }))}
                  className="w-full p-4 glass rounded-xl text-black border border-green-400/20 focus:border-green-400/50 transition-all duration-300"
                  rows={3}
                  maxLength={200}
                  placeholder="Descripción breve que aparecerá en las tarjetas de vista previa..."
                />
                <p className="text-brand-gray text-sm mt-2">
                  {(formData.shortDescription || '').length}/200 caracteres
                </p>
              </div>
            </div>
          </div>

          {/* Redes Sociales */}
          <div className="glass rounded-2xl p-6 border border-yellow-400/10">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-semibold text-yellow-400 flex items-center">
                <LinkIcon className="w-6 h-6 mr-2" />
                Redes Sociales
              </h4>
              <button
                type="button"
                onClick={addSocialLink}
                className="flex items-center px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-all duration-300"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Agregar Red Social
              </button>
            </div>

            <div className="space-y-4">
              {formData.socialLinks.map((link: any, index: number) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-sm text-brand-gray mb-2">Plataforma</label>
                    <select
                      value={link.platform}
                      onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                      className="w-full p-3 glass rounded-lg text-black border border-yellow-400/20 focus:border-yellow-400/50 transition-all duration-300"
                    >
                      <option value="">Seleccionar plataforma</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Twitter">Twitter</option>
                      <option value="YouTube">YouTube</option>
                      <option value="Spotify">Spotify</option>
                      <option value="SoundCloud">SoundCloud</option>
                      <option value="Beatport">Beatport</option>
                      <option value="Mixcloud">Mixcloud</option>
                      <option value="TikTok">TikTok</option>
                      <option value="Website">Sitio Web</option>
                    </select>
                  </div>
                  
                  <div className="flex-2">
                    <label className="block text-sm text-brand-gray mb-2">URL</label>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                      className="w-full p-3 glass rounded-lg text-black border border-yellow-400/20 focus:border-yellow-400/50 transition-all duration-300"
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
          <div className="glass rounded-2xl p-6 border border-blue-400/10">
            <h4 className="text-xl font-semibold text-blue-400 mb-6">
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
                  className="w-full p-4 glass rounded-xl text-black border border-blue-400/20 focus:border-blue-400/50 transition-all duration-300"
            >
                  <option value="pending">🟡 Pendiente de Revisión</option>
                  <option value="approved">🟢 Aprobado</option>
                  <option value="rejected">🔴 Rechazado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-white mb-3">
                  Nivel de Popularidad
                </label>
                <select
                  value={formData.popularity || 'medium'}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, popularity: e.target.value }))}
                  className="w-full p-4 glass rounded-xl text-black border border-blue-400/20 focus:border-blue-400/50 transition-all duration-300"
                >
                  <option value="low">⭐ Emergente</option>
                  <option value="medium">⭐⭐ Establecido</option>
                  <option value="high">⭐⭐⭐ Estrella</option>
                  <option value="legendary">⭐⭐⭐⭐ Leyenda</option>
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
              {isCreating ? 'Crear DJ' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminDJManagementPage: React.FC = () => {
  const { djs, loading, updateDJ, deleteDJ, approveDJ, rejectDJ, addDJ } = useData();
  const { currentUser } = useAuth();
  const [editingDJ, setEditingDJ] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  // Función para crear un nuevo DJ vacío
  const createNewDJ = (): any => ({
    id: '',
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    genre: '',
    socialLinks: [],
    status: 'pending',
    submittedBy: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const handleCreate = () => {
    setEditingDJ(createNewDJ());
    setIsCreating(true);
  };

  const handleEdit = (dj: any) => {
    setEditingDJ(dj);
    setIsCreating(false);
  };

  const handleSave = async (djData: any) => {
    if (!currentUser) return;
    setIsSubmitting('save');
    try {
      if (isCreating) {
        // Crear nuevo DJ
        await addDJ({
          name: djData.name,
          description: djData.description,
          photoUrl: '',
          genres: djData.genre ? [djData.genre] : [],
          bio: djData.description || '',
          socialLinks: djData.socialLinks || []
        });
      } else {
        // Actualizar DJ existente
        await updateDJ(djData);
      }
      setEditingDJ(null);
      setIsCreating(false);
    } catch (error) {
      console.error('Error guardando DJ:', error);
      alert('Error al guardar el DJ');
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

  const handleDelete = async (djId: string) => {
    if (!currentUser || !window.confirm('¿Estás seguro de que quieres eliminar este DJ?')) return;
    setIsSubmitting(djId);
    try {
      await deleteDJ(djId);
    } catch (error) {
      console.error('Error eliminando DJ:', error);
      alert('Error al eliminar el DJ');
    } finally {
      setIsSubmitting(null);
    }
  };

  const handleApprove = async (djId: string) => {
    if (!currentUser) return;
    setIsSubmitting(djId);
    try {
      await approveDJ(djId);
    } catch (error) {
      console.error('Error aprobando DJ:', error);
      alert('Error al aprobar el DJ');
    } finally {
      setIsSubmitting(null);
    }
  };

  const handleReject = async (djId: string) => {
    if (!currentUser) return;
    setIsSubmitting(djId);
    try {
      await rejectDJ(djId);
    } catch (error) {
      console.error('Error rechazando DJ:', error);
      alert('Error al rechazar el DJ');
    } finally {
      setIsSubmitting(null);
    }
  };

  if (loading) {
    return (
      <CMSLayout title="Gestión de DJs">
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" text="Cargando DJs..." />
        </div>
      </CMSLayout>
    );
  }

  return (
    <CMSLayout title="Gestión de DJs">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-brand-gray">
          Total de DJs: <span className="font-bold text-brand-orange">{djs.length}</span>
        </p>
        <button className="btn-primary flex items-center space-x-2" onClick={handleCreate}>
          <PlusIcon className="w-5 h-5" />
          <span>Agregar DJ</span>
        </button>
      </div>

      {djs.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎧</div>
          <h3 className="text-xl font-bold text-brand-white mb-2">No hay DJs</h3>
          <p className="text-brand-gray">Agrega el primer DJ para comenzar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {djs.map((dj) => {
            const statusConfig = getStatusConfig(dj.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={dj.id}
                className="bg-brand-surface border border-brand-orange/20 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-brand-white truncate flex-1">
                    {dj.name}
                  </h3>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-bold ${statusConfig.className}`}>
                    <StatusIcon className="w-3 h-3" />
                    <span>{statusConfig.text}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3 mb-4">
                  {dj.genre && (
                    <div className="flex items-center space-x-2">
                      <MusicalNoteIcon className="w-4 h-4 text-brand-orange flex-shrink-0" />
                      <span className="text-sm text-brand-white/80">{dj.genre}</span>
                    </div>
                  )}

                  {dj.description && (
                    <p className="text-sm text-brand-white/70 line-clamp-2">
                      {dj.description}
                    </p>
                  )}

                  <div className="flex items-center space-x-2">
                    <UserIcon className="w-4 h-4 text-brand-purple" />
                    <span className="text-sm text-brand-white/80">
                      DJ Profesional
                    </span>
                  </div>
                </div>

                {/* Quick Actions */}
                {dj.status === 'pending' && (
                  <div className="flex space-x-2 mb-4">
                    <button
                      onClick={() => handleApprove(dj.id)}
                      disabled={isSubmitting === dj.id}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs rounded transition-colors"
                    >
                      {isSubmitting === dj.id ? 'Aprobando...' : 'Aprobar'}
                    </button>
                    <button
                      onClick={() => handleReject(dj.id)}
                      disabled={isSubmitting === dj.id}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs rounded transition-colors"
                    >
                      {isSubmitting === dj.id ? 'Rechazando...' : 'Rechazar'}
                    </button>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-brand-white/10">
                  <div className="text-xs text-brand-white/50">
                    {new Date(dj.createdAt).toLocaleDateString('es-ES')}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleEdit(dj)}
                      className="btn-secondary px-3 py-1 text-xs flex items-center space-x-1"
                    >
                      <PencilIcon className="w-3 h-3" />
                      <span>Editar</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(dj.id)}
                      disabled={isSubmitting === dj.id}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs rounded transition-colors"
                    >
                      {isSubmitting === dj.id ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Edición */}
      {editingDJ && (
        <EditDJModal
          dj={editingDJ}
          onSave={handleSave}
          onClose={() => setEditingDJ(null)}
          isCreating={isCreating}
        />
      )}
    </CMSLayout>
  );
};

export default AdminDJManagementPage;