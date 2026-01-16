import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DiscussionHeader = ({ breedName, totalDiscussions, onNewDiscussion }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 py-4 lg:px-6 lg:py-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <button
            onClick={() => navigate('/forum-hub')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth"
            aria-label="Retour aux forums"
          >
            <Icon name="ArrowLeft" size={20} />
            <span className="hidden lg:inline font-medium">Retour aux forums</span>
          </button>

          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            onClick={onNewDiscussion}
            className="shadow-soft"
          >
            <span className="hidden sm:inline">Nouvelle discussion</span>
            <span className="sm:hidden">Nouveau</span>
          </Button>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="Dog" size={28} color="var(--color-primary)" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-heading font-semibold text-foreground">
              Forum {breedName}
            </h1>
            <p className="text-sm text-muted-foreground font-caption">
              {totalDiscussions} discussion{totalDiscussions !== 1 ? 's' : ''} active{totalDiscussions !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionHeader;