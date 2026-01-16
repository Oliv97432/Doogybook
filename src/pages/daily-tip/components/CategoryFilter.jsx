import React from 'react';
import Icon from '../../../components/AppIcon';

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      all: 'Sparkles',
      training: 'GraduationCap',
      health: 'Heart',
      nutrition: 'Apple',
      grooming: 'Scissors',
      safety: 'Shield'
    };
    return icons?.[category] || 'Info';
  };

  return (
    <div className="bg-card rounded-lg shadow-elevated p-4 lg:p-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">
        Filtrer par catégorie
      </h3>
      <div className="flex flex-wrap gap-2">
        {categories?.map((category) => (
          <button
            key={category?.id}
            onClick={() => onSelectCategory(category?.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-smooth ${
              selectedCategory === category?.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80 text-foreground'
            }`}
            aria-label={`Filtrer par ${category?.label}`}
            aria-pressed={selectedCategory === category?.id}
          >
            <Icon name={getCategoryIcon(category?.id)} size={16} />
            <span className="text-sm font-medium">{category?.label}</span>
            <span className="text-xs opacity-75">({category?.count})</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;