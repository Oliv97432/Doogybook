import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterControls = ({ 
  searchQuery, 
  onSearchChange, 
  sortBy, 
  onSortChange,
  filterType,
  onFilterTypeChange 
}) => {
  const sortOptions = [
    { value: 'recent', label: 'Plus récentes' },
    { value: 'popular', label: 'Plus populaires' },
    { value: 'oldest', label: 'Plus anciennes' }
  ];

  const typeOptions = [
    { value: 'all', label: 'Toutes les discussions' },
    { value: 'questions', label: 'Questions uniquement' },
    { value: 'photos', label: 'Avec photos' }
  ];

  return (
    <div className="bg-card border-b border-border">
      <div className="max-w-screen-xl mx-auto px-4 py-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <div className="relative">
              <Input
                type="search"
                placeholder="Rechercher dans les discussions..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e?.target?.value)}
                className="pl-10"
              />
              <Icon 
                name="Search" 
                size={18} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:col-span-2">
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={onSortChange}
              placeholder="Trier par"
            />

            <Select
              options={typeOptions}
              value={filterType}
              onChange={onFilterTypeChange}
              placeholder="Filtrer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;