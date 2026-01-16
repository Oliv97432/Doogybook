import React, { useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dog, Users, Heart, BookOpen, ChefHat, Bell } from 'lucide-react';
import PremiumBadge from './PremiumBadge';

const TabNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollContainerRef = useRef(null);

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
      premium: true
    }
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Auto-scroll to active tab on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeIndex = tabs.findIndex(tab => isActive(tab.path));
      if (activeIndex > 0) {
        const buttons = scrollContainerRef.current.querySelectorAll('button');
        if (buttons[activeIndex]) {
          buttons[activeIndex].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      }
    }
  }, [location.pathname]);

  return (
    <nav className="sticky top-[73px] z-40 bg-white border-b border-gray-200">
      <div 
        ref={scrollContainerRef}
        className="flex w-full overflow-x-auto scrollbar-hide"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
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
                flex-none flex items-center justify-center gap-1.5 py-3 px-3 sm:px-4
                font-medium text-xs sm:text-sm transition-colors relative whitespace-nowrap
                ${active 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              <Icon size={16} className="flex-shrink-0" />
              <span>{tab.label}</span>
              
              {tab.premium && (
                <PremiumBadge size="sm" variant="minimal" />
              )}
              
              {active && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          );
        })}
        {/* Extra padding at the end for scroll */}
        <div className="flex-none w-4" aria-hidden="true" />
      </div>
    </nav>
  );
};

export default TabNavigation;
