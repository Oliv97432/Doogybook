import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProfileHeader = ({ profile, onEdit }) => {
  return (
    <div className="bg-card rounded-2xl md:rounded-3xl shadow-soft p-3 md:p-4">
      {/* Infos compactes inline - Option B */}
      <div className="space-y-2">
        {/* Ligne 1 : Race + Sexe */}
        <div className="flex items-center gap-2 md:gap-4 text-gray-700 flex-wrap text-sm md:text-base">
          <span className="flex items-center gap-1">
            🐕 <span className="font-medium">{profile?.breed || 'Race non renseignée'}</span>
          </span>
          <span className="text-gray-300">•</span>
          <span className="flex items-center gap-1">
            {profile?.gender === 'Mâle' || profile?.gender === 'male' ? '♂️' : '♀️'} 
            <span className="font-medium">{profile?.gender || 'Non renseigné'}</span>
          </span>
        </div>

        {/* Ligne 2 : Âge + Poids */}
        <div className="flex items-center gap-2 md:gap-4 text-gray-700 flex-wrap text-sm md:text-base">
          <span className="flex items-center gap-1">
            📅 <span className="font-medium">{profile?.age || 'Âge non renseigné'}</span>
          </span>
          <span className="text-gray-300">•</span>
          <span className="flex items-center gap-1">
            ⚖️ <span className="font-medium">{profile?.weight || 'Poids non renseigné'}</span>
          </span>
        </div>

        {/* Ligne 3 : Statut stérilisation */}
        <div className="flex items-center gap-1 text-gray-700 text-sm md:text-base">
          💚 <span className="font-medium">{profile?.sterilized || 'Statut non renseigné'}</span>
        </div>
      </div>

      {/* Bouton Modifier (optionnel, peut être enlevé si déjà dans le header) */}
      {onEdit && (
        <div className="mt-4 pt-4 border-t border-border">
          <Button
            variant="outline"
            iconName="Edit"
            iconPosition="left"
            onClick={onEdit}
            className="w-full sm:w-auto"
          >
            Modifier le profil
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
