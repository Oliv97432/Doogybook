import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const SearchFilterBar = ({ searchQuery, onSearchChange, filterBreed, onFilterChange, breeds }) => {
  return (
    <div className="bg-card rounded-lg shadow-soft p-4 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="relative">
          <Input
            type="search"
            placeholder="Rechercher un chien par nom..."
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

        <Select
          placeholder="Filtrer par race"
          options={breeds}
          value={filterBreed}
          onChange={onFilterChange}
          clearable
        />
      </div>
    </div>
  );
};

export default SearchFilterBar;