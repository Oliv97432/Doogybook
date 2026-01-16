import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TipArchive = ({ tips, onSelectTip }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      training: 'GraduationCap',
      health: 'Heart',
      nutrition: 'Apple',
      grooming: 'Scissors',
      safety: 'Shield'
    };
    return icons?.[category] || 'Info';
  };

  return (
    <div className="bg-card rounded-lg shadow-elevated p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-heading font-semibold text-foreground">
          Conseils récents
        </h3>
        <Icon name="History" size={20} className="text-muted-foreground" />
      </div>
      <div className="space-y-4">
        {tips?.map((tip) => (
          <button
            key={tip?.id}
            onClick={() => onSelectTip(tip)}
            className="w-full flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-smooth text-left"
          >
            <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={tip?.image}
                alt={tip?.imageAlt}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Icon name={getCategoryIcon(tip?.category)} size={14} className="text-primary" />
                <span className="text-xs font-medium text-primary capitalize">
                  {tip?.category}
                </span>
              </div>
              <h4 className="text-sm font-medium text-foreground mb-1 line-clamp-2">
                {tip?.title}
              </h4>
              <p className="text-xs text-muted-foreground">
                {new Date(tip.date)?.toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long'
                })}
              </p>
            </div>

            {tip?.bookmarked && (
              <Icon name="BookmarkCheck" size={16} className="text-primary flex-shrink-0" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TipArchive;