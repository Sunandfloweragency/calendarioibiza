import React, { useState } from 'react';
import { MediaItem, ImageUploadOptions } from '../../types';
import { PlusIcon, TrashIcon, LinkIcon, PhotoIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

interface ImageGalleryManagerProps {
  images: MediaItem[];
  onImagesChange: (images: MediaItem[]) => void;
  maxImages?: number;
  allowMainImage?: boolean;
  title?: string;
}

const ImageGalleryManager: React.FC<ImageGalleryManagerProps> = ({
  images = [],
  onImagesChange,
  maxImages = 10,
  allowMainImage = true,
  title = "Gestión de Imágenes"
}) => {
  const [uploadMethod, setUploadMethod] = useState<'url' | 'google_drive'>('url');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Función para extraer URL de Google Drive del enlace compartido
  const extractGoogleDriveUrl = (shareUrl: string): string => {
    try {
      // Formato: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
      const fileIdMatch = shareUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (fileIdMatch) {
        const fileId = fileIdMatch[1];
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
      }
      return shareUrl; // Si no es un enlace de Drive, devolver tal como está
    } catch {
      return shareUrl;
    }
  };

  const addImage = async () => {
    if (!newImageUrl.trim()) return;

    setIsLoading(true);
    try {
      let finalUrl = newImageUrl.trim();
      
      // Procesar enlaces de Google Drive
      if (uploadMethod === 'google_drive' && newImageUrl.includes('drive.google.com')) {
        finalUrl = extractGoogleDriveUrl(newImageUrl);
      }

      const newImage: MediaItem = {
        id: generateId(),
        url: finalUrl,
        caption: newImageCaption.trim() || undefined,
        type: 'image',
        isMain: allowMainImage && images.length === 0, // Primera imagen es principal por defecto
        uploadMethod: uploadMethod,
        driveFileId: uploadMethod === 'google_drive' && newImageUrl.includes('drive.google.com') 
          ? newImageUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1] 
          : undefined
      };

      const updatedImages = [...images, newImage];
      onImagesChange(updatedImages);
      
      // Limpiar formulario
      setNewImageUrl('');
      setNewImageCaption('');
    } catch (error) {
      console.error('Error añadiendo imagen:', error);
      alert('Error al añadir la imagen. Verifica que la URL sea válida.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (imageId: string) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    onImagesChange(updatedImages);
  };

  const setMainImage = (imageId: string) => {
    const updatedImages = images.map(img => ({
      ...img,
      isMain: img.id === imageId
    }));
    onImagesChange(updatedImages);
  };

  const updateImageCaption = (imageId: string, caption: string) => {
    const updatedImages = images.map(img => 
      img.id === imageId ? { ...img, caption: caption.trim() || undefined } : img
    );
    onImagesChange(updatedImages);
  };

  const mainImage = images.find(img => img.isMain);
  const galleryImages = images.filter(img => !img.isMain);

  return (
    <div className="space-y-6">
      <div className="border-b border-brand-gray/20 pb-3">
        <h3 className="text-lg font-semibold text-brand-orange">{title}</h3>
        <p className="text-sm text-brand-gray mt-1">
          Añade hasta {maxImages} imágenes. {allowMainImage && "La primera imagen será la principal."}
        </p>
      </div>

      {/* Formulario para añadir imágenes */}
      <div className="bg-brand-dark/50 rounded-lg p-4 space-y-4">
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setUploadMethod('url')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
              uploadMethod === 'url'
                ? 'bg-brand-orange text-white'
                : 'bg-brand-gray/20 text-brand-gray hover:bg-brand-gray/30'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>URL Directa</span>
          </button>
          <button
            type="button"
            onClick={() => setUploadMethod('google_drive')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
              uploadMethod === 'google_drive'
                ? 'bg-brand-orange text-white'
                : 'bg-brand-gray/20 text-brand-gray hover:bg-brand-gray/30'
            }`}
          >
            <CloudArrowUpIcon className="w-4 h-4" />
            <span>Google Drive</span>
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-brand-white mb-2">
              {uploadMethod === 'google_drive' ? 'Enlace de Google Drive' : 'URL de la imagen'}
            </label>
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder={
                uploadMethod === 'google_drive'
                  ? 'https://drive.google.com/file/d/...'
                  : 'https://ejemplo.com/imagen.jpg'
              }
              className="w-full px-3 py-2 bg-brand-dark border border-brand-gray/30 rounded-md text-white placeholder-brand-gray/50 focus:border-brand-orange focus:outline-none"
            />
            {uploadMethod === 'google_drive' && (
              <p className="text-xs text-brand-gray mt-1">
                Asegúrate de que el archivo en Google Drive tenga permisos de visualización pública
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-white mb-2">
              Descripción (opcional)
            </label>
            <input
              type="text"
              value={newImageCaption}
              onChange={(e) => setNewImageCaption(e.target.value)}
              placeholder="Descripción de la imagen..."
              className="w-full px-3 py-2 bg-brand-dark border border-brand-gray/30 rounded-md text-white placeholder-brand-gray/50 focus:border-brand-orange focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={addImage}
            disabled={!newImageUrl.trim() || isLoading || images.length >= maxImages}
            className="w-full flex items-center justify-center space-x-2 bg-brand-orange hover:bg-brand-orange/80 disabled:bg-brand-gray/20 disabled:text-brand-gray text-white px-4 py-2 rounded-md transition-colors"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Añadiendo...</span>
              </>
            ) : (
              <>
                <PlusIcon className="w-4 h-4" />
                <span>Añadir Imagen</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Vista previa de imágenes */}
      {images.length > 0 && (
        <div className="space-y-6">
          {/* Imagen principal */}
          {allowMainImage && mainImage && (
            <div className="space-y-2">
              <h4 className="text-md font-medium text-brand-orange">Imagen Principal</h4>
              <div className="relative group">
                <img
                  src={mainImage.url}
                  alt={mainImage.caption || 'Imagen principal'}
                  className="w-full h-48 object-cover rounded-lg border-2 border-brand-orange"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://via.placeholder.com/400x300?text=Error+cargando+imagen`;
                  }}
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => removeImage(mainImage.id)}
                    className="bg-red-600 hover:bg-red-700 text-white p-1 rounded-md transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2">
                  <input
                    type="text"
                    value={mainImage.caption || ''}
                    onChange={(e) => updateImageCaption(mainImage.id, e.target.value)}
                    placeholder="Descripción..."
                    className="w-full px-2 py-1 bg-brand-dark border border-brand-gray/30 rounded text-sm text-white placeholder-brand-gray/50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Galería de imágenes */}
          {galleryImages.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-md font-medium text-brand-white">
                Galería ({galleryImages.length} imagen{galleryImages.length !== 1 ? 's' : ''})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt={image.caption || 'Imagen de galería'}
                      className="w-full h-32 object-cover rounded-lg border border-brand-gray/30 hover:border-brand-orange transition-colors cursor-pointer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://via.placeholder.com/200x150?text=Error`;
                      }}
                    />
                    <div className="absolute top-1 right-1 flex space-x-1">
                      {allowMainImage && (
                        <button
                          type="button"
                          onClick={() => setMainImage(image.id)}
                          title="Establecer como imagen principal"
                          className="bg-brand-orange hover:bg-brand-orange/80 text-white p-1 rounded text-xs transition-colors"
                        >
                          <PhotoIcon className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        title="Eliminar imagen"
                        className="bg-red-600 hover:bg-red-700 text-white p-1 rounded text-xs transition-colors"
                      >
                        <TrashIcon className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="mt-1">
                      <input
                        type="text"
                        value={image.caption || ''}
                        onChange={(e) => updateImageCaption(image.id, e.target.value)}
                        placeholder="Descripción..."
                        className="w-full px-2 py-1 bg-brand-dark border border-brand-gray/30 rounded text-xs text-white placeholder-brand-gray/50"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 text-brand-gray">
          <PhotoIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No hay imágenes añadidas</p>
          <p className="text-sm">Añade imágenes usando el formulario de arriba</p>
        </div>
      )}
    </div>
  );
};

export default ImageGalleryManager; 