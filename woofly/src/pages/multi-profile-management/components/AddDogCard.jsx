import React from 'react';
import Icon from '../../../components/AppIcon';

const AddDogCard = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-card rounded-lg shadow-soft hover:shadow-elevated active:scale-98 transition-smooth overflow-hidden border-2 border-dashed border-border hover:border-primary group h-full min-h-[280px] sm:min-h-[400px] flex flex-col items-center justify-center p-4 sm:p-6 min-w-0"
      aria-label="Ajouter un nouveau profil de chien"
    >
      {/* Icon circle - responsive */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-smooth flex items-center justify-center mb-3 sm:mb-4">
        <Icon
          name="Plus"
          size={32}
          className="text-primary sm:w-10 sm:h-10"
        />
      </div>
      
      {/* Texte - responsive */}
      <h3 className="text-base sm:text-lg font-heading font-semibold text-foreground mb-1.5 sm:mb-2">
        Ajouter un chien
      </h3>
      <p className="text-xs sm:text-sm text-muted-foreground text-center max-w-[180px] sm:max-w-[200px] leading-relaxed">
        Créez un nouveau profil pour un autre membre de votre famille
      </p>
    </button>
  );
};

export default AddDogCard;
