import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PhotoGalleryModal = ({ isOpen, onClose, photos, onAddPhoto }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4">
      <div className="bg-popover rounded-lg shadow-elevated w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-popover border-b border-border p-6 flex items-center justify-between">
          <h3 className="text-xl font-heading font-semibold text-foreground">
            Galerie photo
          </h3>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              iconName="Plus"
              iconPosition="left"
              onClick={onAddPhoto}
            >
              Ajouter
            </Button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-smooth"
              aria-label="Fermer"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {photos?.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Image" size={32} color="var(--color-muted-foreground)" />
              </div>
              <p className="text-muted-foreground font-caption mb-4">
                Aucune photo dans la galerie
              </p>
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={onAddPhoto}
              >
                Ajouter une photo
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos?.map((photo) => (
                <div key={photo?.id} className="group relative aspect-square rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={photo?.url}
                    alt={photo?.alt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center gap-2">
                    <button
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-smooth"
                      aria-label="Voir la photo"
                    >
                      <Icon name="Eye" size={20} color="var(--color-foreground)" />
                    </button>
                    <button
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-smooth"
                      aria-label="Supprimer la photo"
                    >
                      <Icon name="Trash2" size={20} color="var(--color-destructive)" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white text-sm font-caption truncate">
                      {photo?.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoGalleryModal;