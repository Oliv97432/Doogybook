import React from 'react';
import Input from '../../../components/ui/Input';

const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <div className="mb-6">
      <Input
        type="search"
        placeholder={placeholder || "Rechercher un vétérinaire, une clinique..."}
        value={value}
        onChange={(e) => onChange(e?.target?.value)}
        className="w-full"
      />
    </div>
  );
};

export default SearchBar;