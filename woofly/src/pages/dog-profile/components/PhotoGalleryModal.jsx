import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PhotoGalleryModal = ({ isOpen, onClose, photos, onAddPhoto, currentProfilePhotoUrl, onSetProfilePhoto }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  if (!isOpen) return null;

  // Gestion de l'input file
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
      e.target.value = '';
    } catch (err) {
      console.error('Erreur upload:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddPhotoClick = () => {
    document.getElementById('photo-upload-input').click();
  };

  // ✅ NOUVEAU : Définir une photo comme photo de profil
  const handleSetAsProfilePhoto = async (photoUrl) => {
    if (onSetProfilePhoto) {
      await onSetProfilePhoto(photoUrl);
      alert('✅ Photo de profil mise à jour !');
    }
  };

  // ✅ NOUVEAU : Vérifier si c'est la photo de profil actuelle
  const isProfilePhoto = (photoUrl) => {
    return photoUrl === currentProfilePhotoUrl;
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50">
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
              {photos.map((photo) => {
                const isCurrentProfilePhoto = isProfilePhoto(photo.photo_url);
                
                return (
                  <div
                    key={photo.id}
                    className="group relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer hover:shadow-lg transition-smooth"
                  >
                    {/* Image */}
                    <img
                      src={photo.photo_url}
                      alt={photo.caption || 'Photo du chien'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onClick={() => setSelectedPhoto(photo)}
                    />
                    
                    {/* ✅ Badge "Photo de profil" */}
                    {isCurrentProfilePhoto && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
                        <Icon name="Star" size={12} />
                        Profil
                      </div>
                    )}
                    
                    {/* Overlay avec actions */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-smooth">
                      <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
                        {/* Date */}
                        <p className="text-white text-xs">
                          {new Date(photo.created_at).toLocaleDateString('fr-FR')}
                        </p>
                        
                        {/* ✅ Bouton "Définir comme photo de profil" */}
                        {!isCurrentProfilePhoto && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetAsProfilePhoto(photo.photo_url);
                            }}
                            className="w-full bg-white/90 hover:bg-white text-foreground px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-smooth"
                          >
                            <Icon name="User" size={14} />
                            Définir comme photo de profil
                          </button>
                        )}
                        
                        {isCurrentProfilePhoto && (
                          <div className="w-full bg-primary/90 text-primary-foreground px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2">
                            <Icon name="Check" size={14} />
                            Photo de profil actuelle
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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

      {/* ✅ Modal preview photo (optionnel) */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-4xl max-h-[90vh] relative">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <Icon name="X" size={32} />
            </button>
            <img
              src={selectedPhoto.photo_url}
              alt={selectedPhoto.caption || 'Photo du chien'}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGalleryModal;
