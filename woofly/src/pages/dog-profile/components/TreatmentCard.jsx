import React from 'react';
import Icon from '../../../components/AppIcon';

const TreatmentCard = ({ treatment, type, onEdit, onDelete }) => {
  const getIcon = () => {
    switch(type) {
      case 'vermifuge':
        return 'Pill';
      case 'flea':
        return 'Bug';
      default:
        return 'Activity';
    }
  };

  const getColor = () => {
    switch(type) {
      case 'vermifuge':
        return 'var(--color-secondary)';
      case 'flea':
        return 'var(--color-accent)';
      default:
        return 'var(--color-primary)';
    }
  };

  const isUpcoming = new Date(treatment.nextDate) > new Date();
  const daysUntil = Math.ceil((new Date(treatment.nextDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-background rounded-lg p-4 border border-border hover:shadow-soft transition-smooth">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon name={getIcon()} size={20} color={getColor()} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground mb-1">{treatment?.product}</h4>
            <p className="text-sm text-muted-foreground font-caption">
              Dernière application: {treatment?.lastDate}
            </p>
            <p className="text-sm text-muted-foreground font-caption">
              Prochaine application: {treatment?.nextDate}
            </p>
            {treatment?.notes && (
              <p className="text-sm text-muted-foreground font-caption mt-2">
                Note: {treatment?.notes}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(treatment)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-smooth"
            aria-label="Modifier le traitement"
          >
            <Icon name="Edit" size={16} color="var(--color-muted-foreground)" />
          </button>
          <button
            onClick={() => onDelete(treatment?.id)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-destructive/10 transition-smooth"
            aria-label="Supprimer le traitement"
          >
            <Icon name="Trash2" size={16} color="var(--color-destructive)" />
          </button>
        </div>
      </div>
      {isUpcoming && daysUntil <= 7 && (
        <div className="flex items-center gap-2 px-3 py-2 bg-warning/10 rounded-lg">
          <Icon name="Bell" size={16} color="var(--color-warning)" />
          <span className="text-sm text-warning-foreground font-caption">
            À faire dans {daysUntil} jour{daysUntil > 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
};

export default TreatmentCard;