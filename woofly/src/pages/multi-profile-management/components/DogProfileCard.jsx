import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DogProfileCard = ({ profile, isActive, onSelect, onEdit }) => {
  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'text-success bg-success/10';
      case 'good':
        return 'text-primary bg-primary/10';
      case 'attention':
        return 'text-warning bg-warning/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getHealthStatusLabel = (status) => {
    switch (status) {
      case 'excellent':
        return 'Excellent';
      case 'good':
        return 'Bon';
      case 'attention':
        return 'Attention requise';
      default:
        return 'Non défini';
    }
  };

  return (
    <div
      className={`relative bg-card rounded-lg shadow-soft hover:shadow-elevated transition-smooth overflow-hidden ${
        isActive ? 'ring-2 ring-primary' : ''
      }`}
    >
      {isActive && (
        <div className="absolute top-3 right-3 z-10 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <Icon name="Check" size={14} />
          <span>Actif</span>
        </div>
      )}
      <div
        onClick={onSelect}
        className="cursor-pointer"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e?.key === 'Enter' || e?.key === ' ') {
            e?.preventDefault();
            onSelect();
          }
        }}
        aria-label={`Sélectionner le profil de ${profile?.name}`}
      >
        <div className="aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={profile?.image}
            alt={profile?.imageAlt}
            className="w-full h-full object-cover hover:scale-105 transition-smooth"
          />
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-heading font-semibold text-foreground truncate mb-1">
                {profile?.name}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {profile?.breed}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Icon name="Calendar" size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">{profile?.age}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Weight" size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">{profile?.weight}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div
              className={`px-2 py-1 rounded-md text-xs font-medium ${getHealthStatusColor(
                profile?.healthStatus
              )}`}
            >
              {getHealthStatusLabel(profile?.healthStatus)}
            </div>
          </div>

          {profile?.upcomingReminders && profile?.upcomingReminders?.length > 0 && (
            <div className="bg-warning/10 border border-warning/20 rounded-md p-2 mb-3">
              <div className="flex items-start gap-2">
                <Icon name="Bell" size={14} className="text-warning mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-warning mb-1">
                    Rappels à venir
                  </p>
                  {profile?.upcomingReminders?.slice(0, 2)?.map((reminder, index) => (
                    <p key={index} className="text-xs text-foreground truncate">
                      • {reminder}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {profile?.recentActivity && (
            <div className="text-xs text-muted-foreground">
              <Icon
                name="Activity"
                size={12}
                className="inline mr-1"
              />
              {profile?.recentActivity}
            </div>
          )}
        </div>
      </div>
      <div className="px-4 pb-4">
        <Button
          variant="outline"
          size="sm"
          fullWidth
          iconName="Edit"
          iconPosition="left"
          onClick={(e) => {
            e?.stopPropagation();
            onEdit();
          }}
        >
          Modifier le profil
        </Button>
      </div>
    </div>
  );
};

export default DogProfileCard;