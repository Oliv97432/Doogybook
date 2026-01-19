import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import CameraCapture from '../../../components/CameraCapture';

const PhotoGalleryModal = ({ isOpen, onClose, photos, onAddPhoto, currentProfilePhotoUrl, onSetProfilePhoto, isPremium, onShowPremiumModal }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [showCamera, setShowCamera] = useState(false);

  if (!isOpen) return null;

  // Vérifier si l'utilisateur a atteint la limite de photos
  const hasReachedLimit = !isPremium && photos && photos.length >= 5;

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
    // Vérifier la limite avant d'ouvrir le sélecteur de fichiers
    if (hasReachedLimit) {
      if (onShowPremiumModal) {
        onShowPremiumModal();
      }
      return;
    }
    document.getElementById('photo-upload-input').click();
  };

  // Ouvrir la caméra
  const handleCameraClick = () => {
    if (hasReachedLimit) {
      if (onShowPremiumModal) {
        onShowPremiumModal();
      }
      return;
    }
    setShowCamera(true);
  };

  // Gérer la capture de photo depuis la caméra
  const handleCameraCapture = async (file) => {
    setIsUploading(true);
    try {
      await onAddPhoto(file);
    } catch (err) {
      console.error('Erreur upload photo caméra:', err);
    } finally {
      setIsUploading(false);
    }
  };

  // Définir une photo comme photo de profil
  const handleSetAsProfilePhoto = async (photoUrl) => {
    if (onSetProfilePhoto) {
      await onSetProfilePhoto(photoUrl);
      alert('✅ Photo de profil mise à jour !');
    }
  };

  // Vérifier si c'est la photo de profil actuelle
  const isProfilePhoto = (photoUrl) => {
    return photoUrl === currentProfilePhotoUrl;
  };

  // ✅ OPTIMISATION 1 : Fonction pour générer srcset Supabase
  const getResponsiveImageUrl = (url, width) => {
    if (!url) return '';
    
    // Si c'est une URL Supabase Storage
    if (url.includes('supabase') && url.includes('storage')) {
      // Ajouter des paramètres de transformation (si supporté par votre setup)
      // Exemple: https://xxx.supabase.co/storage/v1/object/public/bucket/file.jpg
      return `${url}?width=${width}&quality=80&format=webp`;
    }
    
    return url;
  };

  // ✅ OPTIMISATION 2 : Générer srcset pour images responsives
  const getSrcSet = (url) => {
    if (!url) return '';
    
    return `
      ${getResponsiveImageUrl(url, 400)} 400w,
      ${getResponsiveImageUrl(url, 800)} 800w,
      ${getResponsiveImageUrl(url, 1200)} 1200w
    `.trim();
  };

  // ✅ OPTIMISATION 3 : Gérer les erreurs d'image
  const handleImageError = (photoId) => {
    setImageErrors(prev => ({ ...prev, [photoId]: true }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-card border-b border-border p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-heading font-semibold text-foreground">
                Galerie photos
              </h2>
              {!isPremium && (
                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                  {photos?.length || 0}/5
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {isPremium
                ? `${photos?.length || 0} photo${photos?.length > 1 ? 's' : ''} (illimité)`
                : `${photos?.length || 0} photo${photos?.length > 1 ? 's' : ''} sur 5 max`
              }
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              iconName="Camera"
              iconPosition="left"
              onClick={handleCameraClick}
              disabled={isUploading || hasReachedLimit}
              className="hidden sm:flex"
            >
              Prendre une photo
            </Button>
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              onClick={handleAddPhotoClick}
              disabled={isUploading || hasReachedLimit}
            >
              {isUploading ? 'Upload...' : hasReachedLimit ? 'Limite atteinte' : 'Ajouter une photo'}
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
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Button
                  variant="outline"
                  iconName="Camera"
                  iconPosition="left"
                  onClick={handleCameraClick}
                  disabled={isUploading}
                >
                  Prendre une photo
                </Button>
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
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => {
                const isCurrentProfilePhoto = isProfilePhoto(photo.photo_url);
                const hasError = imageErrors[photo.id];
                
                return (
                  <div
                    key={photo.id}
                    className="group relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer hover:shadow-lg transition-smooth"
                  >
                    {/* ✅ OPTIMISATION 4 : Image responsive avec lazy loading */}
                    {!hasError ? (
                      <img
                        src={getResponsiveImageUrl(photo.photo_url, 400)}
                        srcSet={getSrcSet(photo.photo_url)}
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        alt={photo.caption || 'Photo du chien'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        width="400"
                        height="400"
                        onError={() => handleImageError(photo.id)}
                        onClick={() => setSelectedPhoto(photo)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <Icon name="ImageOff" size={40} color="var(--color-muted-foreground)" />
                      </div>
                    )}
                    
                    {/* Badge "Photo de profil" */}
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
                        
                        {/* Bouton "Définir comme photo de profil" */}
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
          {hasReachedLimit ? (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <Icon name="Lock" size={20} className="text-orange-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-orange-900 mb-1">
                    Limite de 5 photos atteinte
                  </h4>
                  <p className="text-xs text-orange-700 mb-3">
                    Vous avez atteint la limite de photos en version gratuite.
                    Passez à Premium pour ajouter des photos illimitées !
                  </p>
                  <Button
                    variant="default"
                    size="sm"
                    iconName="Sparkles"
                    onClick={() => {
                      if (onShowPremiumModal) {
                        onShowPremiumModal();
                      }
                    }}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  >
                    Passer à Premium
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="Info" size={16} />
              <span>Formats acceptés : JPG, PNG, WEBP • Taille max : 5 MB</span>
            </div>
          )}
        </div>
      </div>

      {/* ✅ OPTIMISATION 5 : Modal preview avec image optimisée */}
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
              src={getResponsiveImageUrl(selectedPhoto.photo_url, 1200)}
              srcSet={getSrcSet(selectedPhoto.photo_url)}
              sizes="90vw"
              alt={selectedPhoto.caption || 'Photo du chien'}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      )}

      {/* Composant CameraCapture */}
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
          aspectRatio={1}
        />
      )}
    </div>
  );
};

export default PhotoGalleryModal;
