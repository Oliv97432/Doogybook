import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const signals = [
    {
      icon: 'Shield',
      text: 'Données sécurisées et confidentielles'
    },
    {
      icon: 'Award',
      text: 'Recommandé par les vétérinaires français'
    },
    {
      icon: 'Users',
      text: 'Plus de 50 000 propriétaires de chiens'
    }
  ];

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {signals?.map((signal, index) => (
          <div
            key={index}
            className="flex items-center gap-3 justify-center sm:justify-start"
          >
            <Icon 
              name={signal?.icon} 
              size={20} 
              color="var(--color-success)" 
              className="flex-shrink-0"
            />
            <p className="text-xs text-muted-foreground font-caption text-center sm:text-left">
              {signal?.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustSignals;