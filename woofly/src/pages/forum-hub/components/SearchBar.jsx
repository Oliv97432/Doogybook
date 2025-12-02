import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          type="search"
          placeholder="Rechercher une race ou un sujet..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10 pr-10"
        />
        <Icon
          name="Search"
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
            aria-label="Effacer la recherche"
          >
            <Icon name="X" size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;