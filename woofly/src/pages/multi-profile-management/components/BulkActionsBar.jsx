import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActionsBar = ({ selectedCount, onClearSelection, onScheduleVisit, onUpdateMedication }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:max-w-md bg-card border border-border rounded-lg shadow-elevated p-4 z-50 animate-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">{selectedCount}</span>
          </div>
          <span className="text-sm font-medium text-foreground">
            {selectedCount === 1 ? 'chien sélectionné' : 'chiens sélectionnés'}
          </span>
        </div>
        <button
          onClick={onClearSelection}
          className="text-muted-foreground hover:text-foreground transition-smooth"
          aria-label="Désélectionner tous"
        >
          <Icon name="X" size={20} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          iconName="Calendar"
          iconPosition="left"
          onClick={onScheduleVisit}
        >
          Visite vétérinaire
        </Button>
        <Button
          variant="outline"
          size="sm"
          iconName="Pill"
          iconPosition="left"
          onClick={onUpdateMedication}
        >
          Médicaments
        </Button>
      </div>
    </div>
  );
};

export default BulkActionsBar;