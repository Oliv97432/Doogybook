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
      path: '/pro/instagram-generator',
      icon: Instagram,
      label: 'Instagram',
      matchPaths: ['/pro/instagram-generator']
    }
  ];

  const isActive = (tab) => {
    return tab.matchPaths.some(path => location.pathname.startsWith(path));
  };

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex overflow-x-auto scrollbar-hide -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab);
            
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap text-sm font-medium transition-colors min-h-[44px] ${
                  active
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                <Icon size={18} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default TabNavigationPro;
