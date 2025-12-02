import React from 'react';
import Icon from '../../../components/AppIcon';

const AddDogCard = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-card rounded-lg shadow-soft hover:shadow-elevated transition-smooth overflow-hidden border-2 border-dashed border-border hover:border-primary group h-full min-h-[400px] flex flex-col items-center justify-center p-6"
      aria-label="Ajouter un nouveau profil de chien"
    >
      <div className="w-20 h-20 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-smooth flex items-center justify-center mb-4">
        <Icon
          name="Plus"
          size={40}
          className="text-primary"
        />
      </div>
      <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
        Ajouter un chien
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-[200px]">
        Créez un nouveau profil pour un autre membre de votre famille
      </p>
    </button>
  );
};

export default AddDogCard;