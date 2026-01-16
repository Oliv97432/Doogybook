import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Grid, List, Users, Send, Instagram } from 'lucide-react';

const TabNavigationPro = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      path: '/pro/dashboard',
      icon: Home,
      label: 'Tableau de bord',
      matchPaths: ['/pro/dashboard']
    },
    {
      path: '/pro/dogs',
      icon: Grid,
      label: 'Mes Chiens',
      matchPaths: ['/pro/dogs', '/pro/dogs/new']
    },
    {
      path: '/pro/dogs-list',
      icon: List,
      label: 'Liste',
      matchPaths: ['/pro/dogs-list']
    },
    {
      path: '/pro/foster-families',
      icon: Users,
      label: 'Familles',
      matchPaths: ['/pro/foster-families']
    },
    {
      path: '/pro/applications',
      icon: Send,
      label: 'Candidatures',
      matchPaths: ['/pro/applications']
    },
    {
      path: '/pro/instagram',
      icon: Instagram,
      label: 'Instagram',
      matchPaths: ['/pro/instagram']
    }
  ];

  const isActive = (tab) => {
    return tab.matchPaths.some(path => location.pathname.startsWith(path));
  };

  return (
    <nav className="border-b border-border bg-card relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 relative">
        {/* Indicateur de scroll à droite sur mobile */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 md:hidden" />
        
        <div 
          className="flex overflow-x-auto scrollbar-hide -mb-px scroll-smooth"
          style={{ 
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'x proximity'
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab);
            
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`flex items-center gap-1.5 xs:gap-2 px-2 xs:px-3 sm:px-4 py-3 border-b-2 whitespace-nowrap text-sm xs:text-sm sm:text-base font-medium transition-colors min-h-[44px] flex-shrink-0 ${
                  active
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
                style={{ scrollSnapAlign: 'start' }}
              >
                <Icon size={20} className="xs:w-5 xs:h-5" />
                <span className="text-xs xs:text-sm sm:text-base">{tab.label}</span>
              </button>
            );
          })}
          {/* Spacer pour faciliter le scroll jusqu'au bout */}
          <div className="flex-shrink-0 w-8" />
        </div>
      </div>
    </nav>
  );
};

export default TabNavigationPro;
