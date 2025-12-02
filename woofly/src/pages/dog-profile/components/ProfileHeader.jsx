import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProfileHeader = ({ profile, onEdit, onGallery }) => {
  return (
    <div className="bg-card rounded-lg shadow-soft p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full lg:w-auto flex justify-center lg:justify-start">
          <div className="relative">
            <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
              {profile?.image ? (
                <Image 
                  src={profile?.image} 
                  alt={profile?.imageAlt}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Icon name="Dog" size={64} color="var(--color-primary)" />
              )}
            </div>
            <button
              onClick={onGallery}
              className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-elevated hover:bg-primary/90 transition-smooth"
              aria-label="Ouvrir la galerie photo"
            >
              <Icon name="Camera" size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-heading font-semibold text-foreground mb-2">
                {profile?.name}
              </h1>
              <p className="text-lg text-muted-foreground font-caption">
                {profile?.breed}
              </p>
            </div>
            <Button
              variant="outline"
              iconName="Edit"
              iconPosition="left"
              onClick={onEdit}
              className="sm:flex-shrink-0"
            >
              Modifier
            </Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-background rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Calendar" size={20} color="var(--color-primary)" />
                <span className="text-sm text-muted-foreground font-caption">Âge</span>
              </div>
              <p className="text-xl font-semibold text-foreground">{profile?.age}</p>
            </div>

            <div className="bg-background rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Weight" size={20} color="var(--color-primary)" />
                <span className="text-sm text-muted-foreground font-caption">Poids</span>
              </div>
              <p className="text-xl font-semibold text-foreground">{profile?.weight}</p>
            </div>

            <div className="bg-background rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="MapPin" size={20} color="var(--color-primary)" />
                <span className="text-sm text-muted-foreground font-caption">Sexe</span>
              </div>
              <p className="text-xl font-semibold text-foreground">{profile?.gender}</p>
            </div>

            <div className="bg-background rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Heart" size={20} color="var(--color-primary)" />
                <span className="text-sm text-muted-foreground font-caption">Statut</span>
              </div>
              <p className="text-xl font-semibold text-foreground">{profile?.sterilized}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;