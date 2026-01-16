// Hook pour améliorer l'accessibilité automatiquement
import { useEffect } from 'react';

export const useA11y = () => {
  useEffect(() => {
    // Ajouter aria-label aux boutons sans texte visible
    const buttons = document.querySelectorAll('button:not([aria-label])');
    buttons.forEach((button) => {
      // Si le bouton n'a que des icônes ou images
      if (!button.textContent.trim() && !button.ariaLabel) {
        const icon = button.querySelector('svg, img');
        if (icon) {
          button.setAttribute('aria-label', 'Action button');
        }
      }
    });

    // Ajouter role="main" au contenu principal
    const mainContent = document.querySelector('#root > div > div:not(nav):not(header):not(footer)');
    if (mainContent && !mainContent.getAttribute('role')) {
      mainContent.setAttribute('role', 'main');
    }
  }, []);
};

// Composant Button accessible
export const AccessibleButton = ({ 
  children, 
  ariaLabel, 
  onClick, 
  className = '',
  type = 'button',
  disabled = false,
  ...props 
}) => {
  const label = ariaLabel || (typeof children === 'string' ? children : 'Button');
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      aria-label={label}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
