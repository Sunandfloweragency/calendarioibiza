import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import CMSLayout from '../components/cms/CMSLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  BuildingOfficeIcon,
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
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  MusicalNoteIcon,
  UserGroupIcon,
  StarIcon,
  ClockIcon as ClockIconOutline,
  CurrencyEuroIcon,
  WifiIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';

interface EditModalProps {
  club: any;
  onSave: (clubData: any) => void;
  onClose: () => void;
  isCreating?: boolean;
}

const EditClubModal: React.FC<EditModalProps> = ({ club, onSave, onClose, isCreating = false }) => {
  const [formData, setFormData] = useState<any>({
    ...club,
    socialLinks: club.socialLinks || [{ platform: '', url: '' }],
    musicStyles: club.musicStyles || [],
    amenities: club.amenities || []
  });
  const [imageOption, setImageOption] = useState<'url' | 'upload' | 'none'>('url');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(club.imageUrl || '');

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

  const toggleMusicStyle = (style: string) => {
    setFormData((prev: any) => ({
      ...prev,
      musicStyles: prev.musicStyles.includes(style)
        ? prev.musicStyles.filter((s: string) => s !== style)
        : [...prev.musicStyles, style]
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((prev: any) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a: string) => a !== amenity)
        : [...prev.amenities, amenity]
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

  const musicStyleOptions = [
    { value: 'house', label: '🏠 House', color: 'bg-orange-500/20 border-orange-400/30' },
    { value: 'techno', label: '⚡ Techno', color: 'bg-red-500/20 border-red-400/30' },
    { value: 'trance', label: '🌀 Trance', color: 'bg-purple-500/20 border-purple-400/30' },
    { value: 'progressive', label: '🎯 Progressive', color: 'bg-blue-500/20 border-blue-400/30' },
    { value: 'deep', label: '🌊 Deep House', color: 'bg-cyan-500/20 border-cyan-400/30' },
    { value: 'minimal', label: '⚪ Minimal', color: 'bg-gray-500/20 border-gray-400/30' },
    { value: 'disco', label: '🕺 Disco', color: 'bg-yellow-500/20 border-yellow-400/30' },
    { value: 'latin', label: '🎺 Latin House', color: 'bg-green-500/20 border-green-400/30' }
  ];

  const amenityOptions = [
    { value: 'terrace', label: '🌅 Terraza', color: 'bg-orange-500/20 border-orange-400/30' },
    { value: 'pool', label: '🏊‍♂️ Piscina', color: 'bg-blue-500/20 border-blue-400/30' },
    { value: 'vip', label: '👑 Zona VIP', color: 'bg-purple-500/20 border-purple-400/30' },
    { value: 'restaurant', label: '🍽️ Restaurante', color: 'bg-green-500/20 border-green-400/30' },
    { value: 'parking', label: '🅿️ Parking', color: 'bg-gray-500/20 border-gray-400/30' },
    { value: 'beach', label: '🏖️ Acceso Playa', color: 'bg-cyan-500/20 border-cyan-400/30' },
    { value: 'wifi', label: '📶 WiFi Gratis', color: 'bg-yellow-500/20 border-yellow-400/30' },
    { value: 'cocktails', label: '🍸 Cocktail Bar', color: 'bg-pink-500/20 border-pink-400/30' }
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass rounded-3xl p-8 w-full max-w-6xl max-h-[95vh] overflow-y-auto border border-brand-orange/20">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold text-gradient">
            {isCreating ? 'Crear Nuevo Club' : 'Editar Club'}
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
              Información Básica del Club
            </h4>
            
            <div className="grid md:grid-cols-2 gap-6">
          <div>
                <label className="block text-sm font-medium text-brand-white mb-3">
                  Nombre del Club *
                </label>
            <input
              type="text"
                  value={formData.name || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
                  className="w-full p-4 glass rounded-xl text-black border border-brand-orange/20 focus:border-brand-orange/50 transition-all duration-300"
                  placeholder="Ej: Amnesia Ibiza"
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
                  placeholder="amnesia-ibiza"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-white mb-3">
                  Dirección Completa *
                </label>
            <input
              type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, address: e.target.value }))}
                  className="w-full p-4 glass rounded-xl text-black border border-brand-orange/20 focus:border-brand-orange/50 transition-all duration-300"
                  placeholder="Carretera Ibiza a San Antonio, Km 5, 07816 San Rafael, Islas Baleares"
                  required
            />
          </div>

          <div>
                <label className="block text-sm font-medium text-brand-white mb-3">
                  Teléfono de Contacto
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-orange" />
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, phone: e.target.value }))}
                    className="w-full pl-12 p-4 glass rounded-xl text-black border border-brand-orange/20 focus:border-brand-orange/50 transition-all duration-300"
                    placeholder="+34 971 198 041"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-white mb-3">
                  Email de Contacto
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-orange" />
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-12 p-4 glass rounded-xl text-black border border-brand-orange/20 focus:border-brand-orange/50 transition-all duration-300"
                    placeholder="info@club.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Imagen del Club */}
          <div className="glass rounded-2xl p-6 border border-brand-purple/10">
            <h4 className="text-xl font-semibold text-brand-purple mb-6 flex items-center">
              <PhotoIcon className="w-6 h-6 mr-2" />
              Imagen Principal del Club
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

              {imageOption === 'url' && (
                <div>
                  <input
                    type="url"
                    value={formData.imageUrl || ''}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    className="w-full p-4 glass rounded-xl text-black border border-brand-orange/20 focus:border-brand-orange/50 transition-all duration-300"
                    placeholder="https://ejemplo.com/imagen-club.jpg"
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
                    id="club-image-upload"
                  />
                  <label htmlFor="club-image-upload" className="cursor-pointer flex flex-col items-center">
                    <CloudArrowUpIcon className="w-12 h-12 text-brand-purple mb-4" />
                    <span className="text-brand-white font-medium">Subir imagen del club</span>
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
                      className="w-64 h-40 object-cover rounded-2xl border-4 border-brand-orange shadow-lg"
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

          {/* Información del Venue */}
          <div className="glass rounded-2xl p-6 border border-green-400/10">
            <h4 className="text-xl font-semibold text-green-400 mb-6 flex items-center">
              <MapPinIcon className="w-6 h-6 mr-2" />
              Detalles del Venue
            </h4>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-brand-white mb-3">
                  Capacidad Máxima
                </label>
                <div className="relative">
                  <UserGroupIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                  <input
                    type="number"
                    value={formData.capacity || ''}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, capacity: e.target.value }))}
                    className="w-full pl-12 p-4 glass rounded-xl text-black border border-green-400/20 focus:border-green-400/50 transition-all duration-300"
                    placeholder="5000"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-white mb-3">
                  Tipo de Venue
                </label>
                <select
                  value={formData.venueType || ''}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, venueType: e.target.value }))}
                  className="w-full p-4 glass rounded-xl text-black border border-green-400/20 focus:border-green-400/50 transition-all duration-300"
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="nightclub">🌃 Discoteca</option>
                  <option value="beach_club">🏖️ Beach Club</option>
                  <option value="rooftop">🌆 Rooftop</option>
                  <option value="warehouse">🏭 Warehouse</option>
                  <option value="outdoor">🌳 Espacio al Aire Libre</option>
                  <option value="lounge">🛋️ Lounge</option>
                  <option value="pool_club">🏊‍♂️ Pool Club</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-white mb-3">
                  Horario de Apertura
                </label>
                <div className="relative">
                  <ClockIconOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                  <input
                    type="text"
                    value={formData.openingHours || ''}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, openingHours: e.target.value }))}
                    className="w-full pl-12 p-4 glass rounded-xl text-black border border-green-400/20 focus:border-green-400/50 transition-all duration-300"
                    placeholder="22:00 - 06:00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-white mb-3">
                  Precio de Entrada (aprox.)
                </label>
                <div className="relative">
                  <CurrencyEuroIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                  <input
                    type="text"
                    value={formData.entryPrice || ''}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, entryPrice: e.target.value }))}
                    className="w-full pl-12 p-4 glass rounded-xl text-black border border-green-400/20 focus:border-green-400/50 transition-all duration-300"
                    placeholder="30-60€, Lista gratuita antes 01:00"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Estilos Musicales */}
          <div className="glass rounded-2xl p-6 border border-yellow-400/10">
            <h4 className="text-xl font-semibold text-yellow-400 mb-6 flex items-center">
              <MusicalNoteIcon className="w-6 h-6 mr-2" />
              Estilos Musicales Principales
            </h4>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {musicStyleOptions.map(({ value, label, color }) => (
                <label
                  key={value}
                  className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                    formData.musicStyles.includes(value)
                      ? `${color} scale-105`
                      : 'glass border border-yellow-400/20 hover:border-yellow-400/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.musicStyles.includes(value)}
                    onChange={() => toggleMusicStyle(value)}
                    className="sr-only"
                  />
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    formData.musicStyles.includes(value) ? 'bg-yellow-400 text-black' : 'bg-brand-surface'
                  }`}>
                    {formData.musicStyles.includes(value) ? '✓' : '♪'}
                  </div>
                  <span className="text-brand-white font-medium">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Servicios y Amenidades */}
          <div className="glass rounded-2xl p-6 border border-blue-400/10">
            <h4 className="text-xl font-semibold text-blue-400 mb-6 flex items-center">
              <StarIcon className="w-6 h-6 mr-2" />
              Servicios y Amenidades
            </h4>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {amenityOptions.map(({ value, label, color }) => (
                <label
                  key={value}
                  className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                    formData.amenities.includes(value)
                      ? `${color} scale-105`
                      : 'glass border border-blue-400/20 hover:border-blue-400/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(value)}
                    onChange={() => toggleAmenity(value)}
                    className="sr-only"
                  />
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    formData.amenities.includes(value) ? 'bg-blue-400 text-black' : 'bg-brand-surface'
                  }`}>
                    {formData.amenities.includes(value) ? '✓' : '🎯'}
                  </div>
                  <span className="text-brand-white font-medium">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Descripción */}
          <div className="glass rounded-2xl p-6 border border-pink-400/10">
            <h4 className="text-xl font-semibold text-pink-400 mb-6">
              Descripción del Club
            </h4>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-brand-white mb-3">
                  Descripción Completa
                </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
                  className="w-full p-4 glass rounded-xl text-black border border-pink-400/20 focus:border-pink-400/50 transition-all duration-300"
                  rows={6}
                  placeholder="Historia del club, ambiente, características especiales, qué lo hace único..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-brand-white mb-3">
                    Ambiente Principal
                  </label>
                  <input
                    type="text"
                    value={formData.atmosphere || ''}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, atmosphere: e.target.value }))}
                    className="w-full p-4 glass rounded-xl text-black border border-pink-400/20 focus:border-pink-400/50 transition-all duration-300"
                    placeholder="Underground, Elegante, Bohemio, Vanguardista"
            />
          </div>

          <div>
                  <label className="block text-sm font-medium text-brand-white mb-3">
                    Dress Code
                  </label>
                  <select
                    value={formData.dressCode || ''}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, dressCode: e.target.value }))}
                    className="w-full p-4 glass rounded-xl text-black border border-pink-400/20 focus:border-pink-400/50 transition-all duration-300"
                  >
                    <option value="">Seleccionar dress code</option>
                    <option value="casual">👕 Casual</option>
                    <option value="smart_casual">👔 Smart Casual</option>
                    <option value="elegant">🤵 Elegante</option>
                    <option value="exclusive">👗 Exclusivo</option>
                    <option value="no_restrictions">🏖️ Sin Restricciones</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Redes Sociales */}
          <div className="glass rounded-2xl p-6 border border-purple-400/10">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-semibold text-purple-400 flex items-center">
                <LinkIcon className="w-6 h-6 mr-2" />
                Redes Sociales y Enlaces
              </h4>
              <button
                type="button"
                onClick={addSocialLink}
                className="flex items-center px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all duration-300"
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
                      className="w-full p-3 glass rounded-lg text-black border border-purple-400/20 focus:border-purple-400/50 transition-all duration-300"
                    >
                      <option value="">Seleccionar plataforma</option>
                      <option value="Instagram">📷 Instagram</option>
                      <option value="Facebook">📘 Facebook</option>
                      <option value="Twitter">🐦 Twitter</option>
                      <option value="Website">🌐 Sitio Web Official</option>
                      <option value="Booking">🎫 Reservas/Booking</option>
                      <option value="WhatsApp">💬 WhatsApp</option>
                      <option value="YouTube">📺 YouTube</option>
                      <option value="TikTok">🎵 TikTok</option>
                    </select>
                  </div>
                  
                  <div className="flex-2">
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                      className="w-full p-3 glass rounded-lg text-black border border-purple-400/20 focus:border-purple-400/50 transition-all duration-300"
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
          <div className="glass rounded-2xl p-6 border border-orange-400/10">
            <h4 className="text-xl font-semibold text-brand-orange mb-6">
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
                  className="w-full p-4 glass rounded-xl text-black border border-orange-400/20 focus:border-orange-400/50 transition-all duration-300"
            >
                  <option value="pending">🟡 Pendiente de Revisión</option>
                  <option value="approved">🟢 Aprobado</option>
                  <option value="rejected">🔴 Rechazado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-white mb-3">
                  Categoría del Club
                </label>
                <select
                  value={formData.category || 'standard'}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, category: e.target.value }))}
                  className="w-full p-4 glass rounded-xl text-black border border-orange-400/20 focus:border-orange-400/50 transition-all duration-300"
                >
                  <option value="standard">⭐ Estándar</option>
                  <option value="premium">⭐⭐ Premium</option>
                  <option value="vip">⭐⭐⭐ VIP</option>
                  <option value="legendary">⭐⭐⭐⭐ Legendario</option>
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
              {isCreating ? 'Crear Club' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminClubManagementPage: React.FC = () => {
  const { clubs, loading, updateClub, deleteClub, approveClub, rejectClub, addClub } = useData();
  const { currentUser } = useAuth();
  const [editingClub, setEditingClub] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  const createNewClub = (): any => ({
    id: '',
    name: '',
    slug: '',
    description: '',
    address: '',
    imageUrl: '',
    phone: '',
    email: '',
    capacity: '',
    venueType: '',
    openingHours: '',
    entryPrice: '',
    musicStyles: [],
    amenities: [],
    atmosphere: '',
    dressCode: '',
    socialLinks: [],
    category: 'standard',
    status: 'pending',
    submittedBy: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const handleCreate = () => {
    setEditingClub(createNewClub());
    setIsCreating(true);
  };

  const handleEdit = (club: any) => {
    setEditingClub(club);
    setIsCreating(false);
  };

  const handleSave = async (clubData: any) => {
    if (!currentUser) return;
    setIsSubmitting('save');
    try {
      if (isCreating) {
        await addClub({
          name: clubData.name,
          description: clubData.description,
          address: clubData.address,
          phoneNumber: clubData.phone,
          email: clubData.email,
          capacity: parseInt(clubData.capacity) || 0,
          priceRange: clubData.entryPrice || '',
          musicGenres: clubData.musicStyles || [],
          socialLinks: clubData.socialLinks || []
        });
      } else {
        await updateClub(clubData);
      }
      setEditingClub(null);
      setIsCreating(false);
    } catch (error) {
      console.error('Error guardando club:', error);
      alert('Error al guardar el club');
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

  const handleDelete = async (clubId: string) => {
    if (!currentUser || !window.confirm('¿Estás seguro de que quieres eliminar este club?')) return;
    setIsSubmitting(clubId);
    try {
      await deleteClub(clubId);
    } catch (error) {
      console.error('Error eliminando club:', error);
      alert('Error al eliminar el club');
    } finally {
      setIsSubmitting(null);
    }
  };

  const handleApprove = async (clubId: string) => {
    if (!currentUser) return;
    setIsSubmitting(clubId);
    try {
      await approveClub(clubId);
    } catch (error) {
      console.error('Error aprobando club:', error);
      alert('Error al aprobar el club');
    } finally {
      setIsSubmitting(null);
    }
  };

  const handleReject = async (clubId: string) => {
    if (!currentUser) return;
    setIsSubmitting(clubId);
    try {
      await rejectClub(clubId);
    } catch (error) {
      console.error('Error rechazando club:', error);
      alert('Error al rechazar el club');
    } finally {
      setIsSubmitting(null);
    }
  };

  if (loading) {
    return (
      <CMSLayout title="Gestión de Clubs">
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" text="Cargando clubs..." />
        </div>
      </CMSLayout>
    );
  }

  return (
    <CMSLayout title="Gestión de Clubs">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-brand-gray">
          Total de clubs: <span className="font-bold text-brand-orange">{clubs.length}</span>
        </p>
        <button className="btn-primary flex items-center space-x-2" onClick={handleCreate}>
          <PlusIcon className="w-5 h-5" />
          <span>Agregar Club</span>
        </button>
      </div>

      {clubs.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🏢</div>
          <h3 className="text-xl font-bold text-brand-white mb-2">No hay clubs</h3>
          <p className="text-brand-gray">Agrega el primer club para comenzar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => {
            const statusConfig = getStatusConfig(club.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={club.id}
                className="bg-brand-surface border border-brand-orange/20 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-brand-white truncate flex-1">
                    {club.name}
                  </h3>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-bold ${statusConfig.className}`}>
                    <StatusIcon className="w-3 h-3" />
                    <span>{statusConfig.text}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3 mb-4">
                  {club.address && (
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="w-4 h-4 text-brand-orange flex-shrink-0" />
                      <span className="text-sm text-brand-white/80 line-clamp-1">{club.address}</span>
                    </div>
                  )}

                  {club.description && (
                    <p className="text-sm text-brand-white/70 line-clamp-2">
                      {club.description}
                    </p>
                  )}

                  <div className="flex items-center space-x-2">
                    <BuildingOfficeIcon className="w-4 h-4 text-brand-purple" />
                    <span className="text-sm text-brand-white/80">
                      Club & Discoteca
                    </span>
                  </div>

                  {club.capacity && (
                    <div className="flex items-center space-x-2">
                      <UserGroupIcon className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-brand-white/80">
                        Capacidad: {club.capacity} personas
                      </span>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                {club.status === 'pending' && (
                  <div className="flex space-x-2 mb-4">
                    <button
                      onClick={() => handleApprove(club.id)}
                      disabled={isSubmitting === club.id}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs rounded transition-colors"
                    >
                      {isSubmitting === club.id ? 'Aprobando...' : 'Aprobar'}
                    </button>
                    <button
                      onClick={() => handleReject(club.id)}
                      disabled={isSubmitting === club.id}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs rounded transition-colors"
                    >
                      {isSubmitting === club.id ? 'Rechazando...' : 'Rechazar'}
                    </button>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-brand-white/10">
                  <div className="text-xs text-brand-white/50">
                    {new Date(club.createdAt).toLocaleDateString('es-ES')}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleEdit(club)}
                      className="btn-secondary px-3 py-1 text-xs flex items-center space-x-1"
                    >
                      <PencilIcon className="w-3 h-3" />
                      <span>Editar</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(club.id)}
                      disabled={isSubmitting === club.id}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs rounded transition-colors"
                    >
                      {isSubmitting === club.id ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Edición */}
      {editingClub && (
        <EditClubModal
          club={editingClub}
          onSave={handleSave}
          onClose={() => setEditingClub(null)}
          isCreating={isCreating}
        />
      )}
    </CMSLayout>
  );
};

export default AdminClubManagementPage;