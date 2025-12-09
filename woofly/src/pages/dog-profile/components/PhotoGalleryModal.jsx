import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PhotoGalleryModal = ({ isOpen, onClose, photos, onAddPhoto }) => {
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  // ✅ CORRIGÉ : Gestion correcte de l'input file
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      console.log('Aucun fichier sélectionné');
      return;
    }

    console.log('Fichier sélectionné:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    setIsUploading(true);
    
    try {
      await onAddPhoto(file);
      // Reset input après succès
      e.target.value = '';
    } catch (err) {
      console.error('Erreur upload:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddPhotoClick = () => {
    // Déclencher l'input file
    document.getElementById('photo-upload-input').click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-card border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-heading font-semibold text-foreground">
              Galerie photos
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {photos?.length || 0} photo{photos?.length > 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              onClick={handleAddPhotoClick}
              disabled={isUploading}
            >
              {isUploading ? 'Upload...' : 'Ajouter une photo'}
            </Button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-smooth"
            >
              <Icon name="X" size={24} />
            </button>
          </div>
        </div>

        {/* Input file caché */}
        <input
          id="photo-upload-input"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {(!photos || photos.length === 0) ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Image" size={40} color="var(--color-muted-foreground)" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                Aucune photo dans la galerie
              </h3>
              <p className="text-muted-foreground mb-4">
                Ajoutez des photos de votre chien pour créer sa galerie
              </p>
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={handleAddPhotoClick}
                disabled={isUploading}
              >
                {isUploading ? 'Upload en cours...' : 'Ajouter une photo'}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer hover:shadow-lg transition-smooth"
                >
                  <img
                    src={photo.photo_url}
                    alt={photo.caption || 'Photo du chien'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-smooth">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-sm">
                        {new Date(photo.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4 bg-muted/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Info" size={16} />
            <span>Formats acceptés : JPG, PNG, WEBP • Taille max : 5 MB</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoGalleryModal;
