import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ContactCard = ({ contact, onCall, onMap }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case '24/7':
        return 'text-success bg-success/10';
      case 'Ouvert':
        return 'text-primary bg-primary/10';
      case 'Fermé':
        return 'text-muted-foreground bg-muted';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'personal':
        return 'Stethoscope';
      case 'emergency':
        return 'AlertCircle';
      case 'clinic':
        return 'Building2';
      case 'association':
        return 'Heart';
      default:
        return 'Phone';
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-soft hover:shadow-elevated transition-smooth border border-border">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon 
            name={getCategoryIcon(contact?.category)} 
            size={24} 
            color="var(--color-primary)" 
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
                {contact?.name}
              </h3>
              {contact?.specialization && (
                <p className="text-sm text-muted-foreground font-caption">
                  {contact?.specialization}
                </p>
              )}
            </div>
            {contact?.status && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contact?.status)}`}>
                {contact?.status}
              </span>
            )}
          </div>

          {contact?.rating && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                {[...Array(5)]?.map((_, index) => (
                  <Icon
                    key={index}
                    name={index < Math.floor(contact?.rating) ? 'Star' : 'Star'}
                    size={16}
                    color={index < Math.floor(contact?.rating) ? '#F59E0B' : '#E5E7EB'}
                    strokeWidth={index < Math.floor(contact?.rating) ? 0 : 2}
                    className={index < Math.floor(contact?.rating) ? 'fill-current' : ''}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground font-caption">
                {contact?.rating?.toFixed(1)} ({contact?.reviewCount} avis)
              </span>
            </div>
          )}

          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2">
              <Icon name="Phone" size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
              <a 
                href={`tel:${contact?.phone}`}
                className="text-sm text-foreground hover:text-primary transition-smooth font-caption"
              >
                {contact?.phone}
              </a>
            </div>

            {contact?.address && (
              <div className="flex items-start gap-2">
                <Icon name="MapPin" size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground font-caption">
                  {contact?.address}
                </p>
              </div>
            )}

            {contact?.hours && (
              <div className="flex items-start gap-2">
                <Icon name="Clock" size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground font-caption">
                  {contact?.hours}
                </p>
              </div>
            )}

            {contact?.certification && (
              <div className="flex items-start gap-2">
                <Icon name="Award" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-primary font-caption font-medium">
                  {contact?.certification}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="default"
              size="sm"
              iconName="Phone"
              iconPosition="left"
              onClick={() => onCall(contact?.phone)}
            >
              Appeler
            </Button>

            {contact?.address && (
              <Button
                variant="outline"
                size="sm"
                iconName="MapPin"
                iconPosition="left"
                onClick={() => onMap(contact)}
              >
                Itinéraire
              </Button>
            )}

            {contact?.website && (
              <Button
                variant="ghost"
                size="sm"
                iconName="Globe"
                iconPosition="left"
                onClick={() => window.open(contact?.website, '_blank')}
              >
                Site web
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;