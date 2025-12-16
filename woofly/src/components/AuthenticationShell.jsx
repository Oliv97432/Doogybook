import React from 'react';
import Icon from './AppIcon';

const AuthenticationShell = ({ children, title, subtitle }) => {
  return (
    <div className="auth-shell">
      <div className="auth-container">
        <div className="brand-header">
          <div className="brand-logo">
            <Icon name="Dog" size={40} color="var(--color-primary)" />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-semibold text-foreground mb-2">
            Doogybook
          </h1>
          {title && (
            <h2 className="text-xl font-heading font-medium text-foreground mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-muted-foreground font-caption">
              {subtitle}
            </p>
          )}
        </div>

        <div className="space-y-6">
          {children}
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground font-caption">
            © 2025 Doogybook. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationShell;