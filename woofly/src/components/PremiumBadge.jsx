import React from 'react';
import { Crown } from 'lucide-react';

/**
 * Badge Premium à afficher sur les profils et posts
 * @param {string} size - 'sm', 'md', 'lg'
 * @param {string} variant - 'default', 'minimal'
 */
const PremiumBadge = ({ size = 'md', variant = 'default' }) => {
  const sizes = {
    sm: {
      container: 'px-2 py-0.5 text-xs gap-1',
      icon: 12
    },
    md: {
      container: 'px-3 py-1 text-sm gap-1.5',
      icon: 14
    },
    lg: {
      container: 'px-4 py-1.5 text-base gap-2',
      icon: 16
    }
  };

  const currentSize = sizes[size];

  if (variant === 'minimal') {
    // Juste l'icône couronne
    return (
      <div className="inline-flex items-center justify-center">
        <Crown 
          size={currentSize.icon} 
          className="text-yellow-500 fill-yellow-500" 
          aria-label="Premium"
        />
      </div>
    );
  }

  // Badge complet
  return (
    <div className={`
      inline-flex items-center font-bold rounded-full
      bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 
      text-yellow-950 shadow-md border border-yellow-300/50
      animate-in fade-in zoom-in duration-300
      ${currentSize.container}
    `}>
      <Crown 
        size={currentSize.icon} 
        className="fill-yellow-900/20" 
      />
      <span className="uppercase tracking-tight">Premium</span>
    </div>
  );
};

export default PremiumBadge;

