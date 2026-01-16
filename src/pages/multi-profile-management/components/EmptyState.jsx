import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ onAddDog }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Icon name="Dog" size={48} className="text-primary" />
      </div>
      <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
        Aucun chien trouvé
      </h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Commencez par ajouter le profil de votre premier compagnon à quatre pattes
      </p>
      <Button
        variant="default"
        iconName="Plus"
        iconPosition="left"
        onClick={onAddDog}
      >
        Ajouter mon premier chien
      </Button>
    </div>
  );
};

export default EmptyState;