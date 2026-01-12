import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dog, Users, Heart, BookOpen, ChefHat, Bell } from 'lucide-react';
import PremiumBadge from './PremiumBadge';

const TabNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { 
      path: '/dog-profile',
      label: 'Mon Chien', 
      icon: Dog 
    },
    { 
      path: '/social-feed',
      label: 'Communauté', 
      icon: Users 
    },
    { 
      path: '/adoption',
      label: 'Adoption', 
      icon: Heart 
    },
    { 
      path: '/daily-tip',
      label: 'Conseils', 
      icon: BookOpen 
    },
    { 
      path: '/recipes',
      label: 'Recettes', 
      icon: ChefHat,
      premium: true
    },
    { 
      path: '/reminders',
      label: 'Rappels', 
      icon: Bell,
      premium: true // Badge premium
    }
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="sticky top-[73px] z-40 bg-white border-b border-gray-200">
      {/* Suppression de max-w-screen-xl pour permettre le scroll */}
      <div className="w-full">
        <div 
          className="flex overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth px-2" 
          style={{ 
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'x proximity'
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.path);
            
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`
                  flex-shrink-0 flex items-center justify-center gap-2 py-4 px-4
                  font-medium text-sm transition-all relative
                  ${active 
                    ? 'text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
                style={{ scrollSnapAlign: 'start' }}
              >
                <Icon size={20} />
                <span className="whitespace-nowrap">{tab.label}</span>
                
                {/* Badge Premium */}
                {tab.premium && (
                  <PremiumBadge size="sm" variant="minimal" />
                )}
                
                {active && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            );
          })}
          {/* Padding à droite pour faciliter le scroll jusqu'au bout */}
          <div className="flex-shrink-0 w-4" />
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
