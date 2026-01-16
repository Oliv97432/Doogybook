import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ onNewDiscussion, searchQuery }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Icon name="MessageSquare" size={40} color="var(--color-primary)" />
      </div>
      
      <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
        {searchQuery ? 'Aucun résultat trouvé' : 'Aucune discussion pour le moment'}
      </h3>
      
      <p className="text-muted-foreground font-caption mb-6 max-w-md">
        {searchQuery 
          ? 'Essayez avec d\'autres mots-clés ou créez une nouvelle discussion' :'Soyez le premier à partager votre expérience avec la communauté'
        }
      </p>

      {!searchQuery && (
        <Button
          variant="default"
          iconName="Plus"
          iconPosition="left"
          onClick={onNewDiscussion}
        >
          Créer la première discussion
        </Button>
      )}
    </div>
  );
};

export default EmptyState;