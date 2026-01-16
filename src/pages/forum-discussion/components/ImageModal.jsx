import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ImageModal = ({ isOpen, image, onClose }) => {
  if (!isOpen || !image) return null;

  return (
    <div 
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-background/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 bg-card text-foreground rounded-full flex items-center justify-center shadow-elevated hover:bg-muted transition-smooth"
        aria-label="Fermer l'image"
      >
        <Icon name="X" size={24} />
      </button>
      <div 
        className="max-w-4xl max-h-[90vh] w-full"
        onClick={(e) => e?.stopPropagation()}
      >
        <Image
          src={image?.url}
          alt={image?.alt}
          className="w-full h-full object-contain rounded-lg"
        />
      </div>
    </div>
  );
};

export default ImageModal;