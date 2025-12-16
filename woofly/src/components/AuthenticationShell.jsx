import React from 'react';

const AuthenticationShell = ({ children, title, subtitle }) => {
  return (
    <div className="auth-shell">
      <div className="auth-container">
        <div className="brand-header">
          <div className="brand-logo">
            <img 
              src="/logo.png" 
              alt="Doogybook" 
              className="w-20 h-20 mx-auto"
            />
          </div>
        </div>
        
        <div className="text-center mb-8">
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
