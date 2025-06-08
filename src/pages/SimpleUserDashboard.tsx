import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { DJData } from '../types';
import { DJ } from '../types/supabase';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { PlusCircleIcon, PencilSquareIcon, TrashIcon, EyeIcon, LinkIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const SOCIAL_PLATFORMS = ['Instagram', 'Facebook', 'Twitter', 'SoundCloud', 'Mixcloud', 'Spotify', 'YouTube', 'Website', 'Resident Advisor', 'Bandcamp'];

const SimpleUserDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { 
    getDJsByUserId, 
    isLoading,
    addDJ, 
    updateDJ, 
    deleteDJ,
    approveDJ 
  } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDJ, setEditingDJ] = useState<DJ | null>(null);
  const [newDJData, setNewDJData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    genre: '',
    socialLinks: [] as {platform: string, url: string}[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  console.log('SimpleUserDashboard - Usuario actual:', currentUser);

  if (!currentUser || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-black">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-brand-gray mt-4">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  const userDJs = getDJsByUserId(currentUser.id);
  console.log('DJs del usuario:', userDJs);

  const handleAddDJ = async () => {
    if (!newDJData.name) {
      alert('El nombre del DJ es obligatorio');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const djToAdd = {
        name: newDJData.name,
        description: newDJData.description,
        photoUrl: newDJData.imageUrl,
        bio: newDJData.description || '',
        genres: newDJData.genre ? [newDJData.genre] : [],
        socialLinks: newDJData.socialLinks
      };
      
      await addDJ(djToAdd as any);
      setIsModalOpen(false);
      setNewDJData({
        name: '',
        description: '',
        imageUrl: '',
        genre: '',
        socialLinks: []
      });
      alert('DJ creado correctamente. Pendiente de aprobación.');
    } catch (error) {
      console.error('Error al crear DJ:', error);
      alert('Error al crear el DJ. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateDJ = async () => {
    if (!editingDJ || !editingDJ.id) return;
    
    setIsSubmitting(true);
    try {
      const djDataToUpdate = {
        id: editingDJ.id,
        name: editingDJ.name,
        description: editingDJ.description || '',
        photoUrl: editingDJ.imageUrl || '',
        bio: editingDJ.description || '',
        genres: editingDJ.genre ? [editingDJ.genre] : [],
        socialLinks: editingDJ.socialLinks || []
      };
      
      await updateDJ(djDataToUpdate as any);
      setIsModalOpen(false);
      setEditingDJ(null);
      alert('DJ actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar DJ:', error);
      alert('Error al actualizar el DJ. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDJ = async (djId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este DJ?')) return;
    
    try {
      await deleteDJ(djId);
      alert('DJ eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar DJ:', error);
      alert('Error al eliminar el DJ. Inténtalo de nuevo.');
    }
  };

  const handleApproveDJ = async (djId: string) => {
    try {
      await approveDJ(djId);
      alert('DJ aprobado y publicado en el sistema');
    } catch (error) {
      console.error('Error al aprobar DJ:', error);
      alert('Error al aprobar el DJ. Inténtalo de nuevo.');
    }
  };

  const openAddModal = () => {
    setEditingDJ(null);
    setNewDJData({
      name: '',
      description: '',
      imageUrl: '',
      genre: '',
      socialLinks: []
    });
    setIsModalOpen(true);
  };

  const openEditModal = (dj: DJ) => {
    setEditingDJ(dj);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 text-yellow-900';
      case 'approved': return 'bg-green-500 text-white';
      case 'rejected': return 'bg-red-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };
  
  // Funciones para manejar enlaces sociales
  const addSocialLink = () => {
    if (editingDJ) {
      const links = [...(editingDJ.socialLinks || [])];
      links.push({ platform: SOCIAL_PLATFORMS[0], url: '' });
      setEditingDJ({ ...editingDJ, socialLinks: links });
    } else {
      const links = [...newDJData.socialLinks];
      links.push({ platform: SOCIAL_PLATFORMS[0], url: '' });
      setNewDJData({ ...newDJData, socialLinks: links });
    }
  };
  
  const removeSocialLink = (index: number) => {
    if (editingDJ) {
      const links = [...(editingDJ.socialLinks || [])];
      links.splice(index, 1);
      setEditingDJ({ ...editingDJ, socialLinks: links });
    } else {
      const links = [...newDJData.socialLinks];
      links.splice(index, 1);
      setNewDJData({ ...newDJData, socialLinks: links });
    }
  };
  
  const updateSocialLink = (index: number, field: 'platform' | 'url', value: string) => {
    if (editingDJ) {
      const links = [...(editingDJ.socialLinks || [])];
      links[index] = { ...links[index], [field]: value };
      setEditingDJ({ ...editingDJ, socialLinks: links });
    } else {
      const links = [...newDJData.socialLinks];
      links[index] = { ...links[index], [field]: value };
      setNewDJData({ ...newDJData, socialLinks: links });
    }
  };

  return (
    <div className="min-h-screen bg-brand-black p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-brand-orange">Dashboard de Usuario</h1>
        
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-brand-orange/20 rounded-full flex items-center justify-center">
              <span className="text-2xl text-brand-orange">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : '?'}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">{currentUser.name || currentUser.username}</h2>
              <p className="text-gray-400">{currentUser.email}</p>
              <p className="text-brand-orange">Rol: {currentUser.role}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-6 mt-6">
            <h3 className="text-xl font-semibold text-white mb-4">Información del Usuario</h3>
            <ul className="space-y-2 text-gray-300">
              <li>ID: {currentUser.id}</li>
              <li>Fecha de registro: {new Date(currentUser.registrationDate).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'long', 
                year: 'numeric'
              })}</li>
              {currentUser.country && <li>País: {currentUser.country}</li>}
              {currentUser.preferredStyles && currentUser.preferredStyles.length > 0 && (
                <li>Estilos preferidos: {currentUser.preferredStyles.join(', ')}</li>
              )}
            </ul>
          </div>
        </div>
        
        {/* Sección de DJs */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Tus DJs</h3>
            <Button 
              variant="primary" 
              size="sm" 
              onClick={openAddModal}
              className="flex items-center space-x-1"
            >
              <PlusCircleIcon className="h-5 w-5 mr-1" />
              <span>Añadir DJ</span>
            </Button>
          </div>
          
          {userDJs.length > 0 ? (
            <div className="space-y-4 mt-4">
              {userDJs.map(dj => (
                <div key={dj.id} className="bg-gray-700 rounded-lg p-4 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-600 rounded-full overflow-hidden">
                      {dj.imageUrl ? (
                        <img src={dj.imageUrl} alt={dj.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">DJ</div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="text-white font-semibold">{dj.name}</h4>
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getStatusColor(dj.status)}`}>
                          {dj.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">
                        {dj.genre || 'Sin género especificado'}
                      </p>
                      {dj.socialLinks && dj.socialLinks.length > 0 && (
                        <div className="flex mt-1 space-x-1">
                          {dj.socialLinks.map((link, index) => (
                            <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" 
                               className="text-xs text-blue-400 hover:text-blue-300 bg-gray-800/50 px-2 py-0.5 rounded-full">
                              {link.platform}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {dj.status === 'approved' && (
                      <Link 
                        to={`/djs/${dj.slug}`}
                        className="p-2 bg-gray-600 hover:bg-gray-500 rounded-md transition-colors"
                        title="Ver perfil"
                      >
                        <EyeIcon className="h-5 w-5 text-gray-200" />
                      </Link>
                    )}
                    <button
                      className="p-2 bg-blue-600/30 hover:bg-blue-600/50 rounded-md transition-colors"
                      title="Editar"
                      onClick={() => openEditModal(dj)}
                      disabled={dj.status !== 'pending'}
                    >
                      <PencilSquareIcon className="h-5 w-5 text-blue-400" />
                    </button>
                    <button
                      className="p-2 bg-red-600/30 hover:bg-red-600/50 rounded-md transition-colors"
                      title="Eliminar"
                      onClick={() => handleDeleteDJ(dj.id)}
                      disabled={dj.status === 'approved'}
                    >
                      <TrashIcon className="h-5 w-5 text-red-400" />
                    </button>
                    {currentUser.role === 'admin' && dj.status === 'pending' && (
                      <button
                        className="p-2 bg-green-600/30 hover:bg-green-600/50 rounded-md transition-colors"
                        title="Aprobar"
                        onClick={() => handleApproveDJ(dj.id)}
                      >
                        <span className="text-green-400 text-xs font-semibold">APROBAR</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No tienes ningún DJ registrado aún. ¡Añade uno para empezar!
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              <Link 
                to="/" 
                className="block w-full py-3 px-4 bg-brand-orange/20 hover:bg-brand-orange/30 text-brand-orange rounded-lg text-center transition-colors"
              >
                Ver Calendario
              </Link>
              <Link 
                to="/events" 
                className="block w-full py-3 px-4 bg-brand-purple/20 hover:bg-brand-purple/30 text-brand-purple rounded-lg text-center transition-colors"
              >
                Explorar Eventos
              </Link>
              <Link 
                to="/djs" 
                className="block w-full py-3 px-4 bg-green-600/20 hover:bg-green-600/30 text-green-500 rounded-lg text-center transition-colors"
              >
                Ver DJs
              </Link>
              <Link 
                to="/clubs" 
                className="block w-full py-3 px-4 bg-blue-600/20 hover:bg-blue-600/30 text-blue-500 rounded-lg text-center transition-colors"
              >
                Explorar Clubs
              </Link>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Tu Cuenta</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <span className="text-gray-300">Estado de cuenta</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Activo</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <span className="text-gray-300">Tipo de perfil</span>
                <span className="px-3 py-1 bg-brand-orange/20 text-brand-orange rounded-full text-sm">
                  {currentUser.userProfileType || 'Estándar'}
                </span>
              </div>
              
              <Link 
                to="/profile" 
                className="block w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-center transition-colors mt-4"
              >
                Editar Perfil
              </Link>
              
              <button 
                onClick={() => confirm('¿Seguro que deseas cerrar sesión?') && window.location.reload()}
                className="block w-full py-3 px-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-center transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para añadir/editar DJ */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDJ(null);
        }}
        title={editingDJ ? "Editar DJ" : "Añadir Nuevo DJ"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Nombre *</label>
            <input
              type="text"
              value={editingDJ ? editingDJ.name : newDJData.name}
              onChange={(e) => editingDJ 
                ? setEditingDJ({...editingDJ, name: e.target.value})
                : setNewDJData({...newDJData, name: e.target.value})
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-1 focus:ring-brand-orange"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
            <textarea
              value={editingDJ ? editingDJ.description || '' : newDJData.description}
              onChange={(e) => editingDJ 
                ? setEditingDJ({...editingDJ, description: e.target.value})
                : setNewDJData({...newDJData, description: e.target.value})
              }
              rows={4}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-1 focus:ring-brand-orange"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">URL de Imagen</label>
            <input
              type="url"
              value={editingDJ ? editingDJ.imageUrl || '' : newDJData.imageUrl}
              onChange={(e) => editingDJ 
                ? setEditingDJ({...editingDJ, imageUrl: e.target.value})
                : setNewDJData({...newDJData, imageUrl: e.target.value})
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-1 focus:ring-brand-orange"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Género</label>
            <input
              type="text"
              value={editingDJ ? editingDJ.genre || '' : newDJData.genre}
              onChange={(e) => editingDJ 
                ? setEditingDJ({...editingDJ, genre: e.target.value})
                : setNewDJData({...newDJData, genre: e.target.value})
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-1 focus:ring-brand-orange"
              placeholder="Techno, House, etc."
            />
          </div>
          
          {/* Enlaces sociales */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-300 mb-1">Enlaces Sociales</label>
              <button 
                type="button" 
                onClick={addSocialLink}
                className="flex items-center text-xs bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded-md"
              >
                <PlusIcon className="w-3 h-3 mr-1" />
                Añadir
              </button>
            </div>
            
            {/* Lista de enlaces sociales */}
            <div className="space-y-2 mt-2">
              {(editingDJ ? editingDJ.socialLinks || [] : newDJData.socialLinks).map((link, index) => (
                <div key={index} className="flex space-x-2 items-center bg-gray-600/50 p-2 rounded-md">
                  <select
                    value={link.platform}
                    onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-md p-1.5 flex-1"
                  >
                    {SOCIAL_PLATFORMS.map(platform => (
                      <option key={platform} value={platform}>{platform}</option>
                    ))}
                  </select>
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                    placeholder="https://..."
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-md p-1.5 flex-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeSocialLink(index)}
                    className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-md"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {(editingDJ ? editingDJ.socialLinks || [] : newDJData.socialLinks).length === 0 && (
                <div className="text-center py-3 text-gray-400 bg-gray-700/30 rounded-md text-sm">
                  <LinkIcon className="w-4 h-4 mx-auto mb-1" />
                  Sin enlaces sociales
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="light-outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingDJ(null);
              }}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={editingDJ ? handleUpdateDJ : handleAddDJ}
              disabled={isSubmitting}
            >
              {isSubmitting ? <LoadingSpinner size="sm" /> : (editingDJ ? 'Actualizar' : 'Guardar')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SimpleUserDashboard; 