import React from 'react';
import Icon from '../../../components/AppIcon';


const VaccinationCard = ({ vaccination, onEdit, onDelete }) => {
  const isUpcoming = new Date(vaccination.nextDate) > new Date();
  const daysUntil = Math.ceil((new Date(vaccination.nextDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-background rounded-lg p-4 border border-border hover:shadow-soft transition-smooth">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUpcoming ? 'bg-success/10' : 'bg-warning/10'
          }`}>
            <Icon 
              name="Syringe" 
              size={20} 
              color={isUpcoming ? 'var(--color-success)' : 'var(--color-warning)'} 
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground mb-1">{vaccination?.name}</h4>
            <p className="text-sm text-muted-foreground font-caption">
              Dernière dose: {vaccination?.lastDate}
            </p>
            <p className="text-sm text-muted-foreground font-caption">
              Prochaine dose: {vaccination?.nextDate}
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(vaccination)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-smooth"
            aria-label="Modifier la vaccination"
          >
            <Icon name="Edit" size={16} color="var(--color-muted-foreground)" />
          </button>
          <button
            onClick={() => onDelete(vaccination?.id)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-destructive/10 transition-smooth"
            aria-label="Supprimer la vaccination"
          >
            <Icon name="Trash2" size={16} color="var(--color-destructive)" />
          </button>
        </div>
      </div>
      {isUpcoming && daysUntil <= 30 && (
        <div className="flex items-center gap-2 px-3 py-2 bg-warning/10 rounded-lg">
          <Icon name="Bell" size={16} color="var(--color-warning)" />
          <span className="text-sm text-warning-foreground font-caption">
            Rappel dans {daysUntil} jour{daysUntil > 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
};

export default VaccinationCard;