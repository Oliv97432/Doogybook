import React from 'react';
import Icon from '../../../components/AppIcon';

const ContactCategory = ({ title, description, icon, count, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-lg border transition-smooth text-left ${
        isActive
          ? 'bg-primary/10 border-primary' :'bg-card border-border hover:border-primary/50'
      }`}
      aria-pressed={isActive}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isActive ? 'bg-primary/20' : 'bg-muted'
        }`}>
          <Icon 
            name={icon} 
            size={20} 
            color={isActive ? 'var(--color-primary)' : 'var(--color-muted-foreground)'} 
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className={`font-heading font-semibold ${
              isActive ? 'text-primary' : 'text-foreground'
            }`}>
              {title}
            </h3>
            {count > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {count}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground font-caption">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
};

export default ContactCategory;