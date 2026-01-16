import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MapModal = ({ contact, onClose }) => {
  if (!contact) return null;

  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(contact?.address)}&z=14&output=embed`;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4"
      onClick={onClose}
    >
      <div 
        className="bg-card rounded-lg shadow-elevated max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e?.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex-1 min-w-0 mr-4">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
              {contact?.name}
            </h3>
            <p className="text-sm text-muted-foreground font-caption">
              {contact?.address}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-muted transition-smooth flex items-center justify-center flex-shrink-0"
            aria-label="Fermer la carte"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="h-[500px] w-full">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            title={contact?.name}
            referrerPolicy="no-referrer-when-downgrade"
            src={mapUrl}
            className="border-0"
          />
        </div>

        <div className="p-4 border-t border-border flex flex-wrap gap-2">
          <Button
            variant="default"
            iconName="Phone"
            iconPosition="left"
            onClick={() => window.location.href = `tel:${contact?.phone}`}
          >
            Appeler
          </Button>
          <Button
            variant="outline"
            iconName="Navigation"
            iconPosition="left"
            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(contact?.address)}`, '_blank')}
          >
            Ouvrir dans Maps
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MapModal;