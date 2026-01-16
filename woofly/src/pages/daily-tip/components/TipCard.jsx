import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TipCard = ({ tip, onRefresh, onRate, onShare, onBookmark }) => {
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

  const getCategoryColor = (category) => {
    const colors = {
      training: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
      health: 'text-red-600 bg-red-50 dark:bg-red-900/20',
      nutrition: 'text-green-600 bg-green-50 dark:bg-green-900/20',
      grooming: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
      safety: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20'
    };
    return colors?.[category] || 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
  };

  return (
    <div className="bg-card rounded-lg shadow-elevated overflow-hidden">
      <div className="relative h-64 lg:h-80 overflow-hidden">
        <Image
          src={tip?.image}
          alt={tip?.imageAlt}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${getCategoryColor(tip?.category)}`}>
            <Icon name={getCategoryIcon(tip?.category)} size={16} />
            <span className="text-sm font-medium capitalize">{tip?.category}</span>
          </div>
        </div>
        <button
          onClick={onRefresh}
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-smooth shadow-soft"
          aria-label="Actualiser le conseil"
        >
          <Icon name="RefreshCw" size={20} color="var(--color-primary)" />
        </button>
      </div>
      <div className="p-6 lg:p-8">
        <h2 className="text-2xl lg:text-3xl font-heading font-semibold text-foreground mb-4">
          {tip?.title}
        </h2>

        <div className="prose prose-sm lg:prose-base max-w-none text-foreground mb-6">
          <p className="whitespace-pre-line leading-relaxed">{tip?.content}</p>
        </div>

        {tip?.source && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
            <Icon name="Award" size={16} />
            <span>Source: {tip?.source}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onRate(tip?.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-smooth"
            aria-label="Évaluer ce conseil"
          >
            <Icon name="ThumbsUp" size={18} />
            <span className="text-sm font-medium">Utile</span>
            {tip?.likes > 0 && (
              <span className="text-xs text-muted-foreground">({tip?.likes})</span>
            )}
          </button>

          <button
            onClick={() => onBookmark(tip?.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-smooth ${
              tip?.bookmarked
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
            aria-label={tip?.bookmarked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <Icon name={tip?.bookmarked ? 'BookmarkCheck' : 'Bookmark'} size={18} />
            <span className="text-sm font-medium">
              {tip?.bookmarked ? 'Enregistré' : 'Enregistrer'}
            </span>
          </button>

          <button
            onClick={() => onShare(tip)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-smooth"
            aria-label="Partager ce conseil"
          >
            <Icon name="Share2" size={18} />
            <span className="text-sm font-medium">Partager</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TipCard;