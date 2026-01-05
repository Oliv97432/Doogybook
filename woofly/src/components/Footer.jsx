import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dog, Users, BookOpen } from 'lucide-react';

const Footer = () => {
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  const navItems = [
    {
      path: '/dog-profile',
      icon: Dog,
      label: 'Mon Chien',
      isActive: location.pathname === '/dog-profile' || location.pathname.includes('/multi-profile-management')
    },
    {
      path: '/social-feed',
      icon: Users,
      label: 'Communauté',
      isActive: location.pathname === '/social-feed' || location.pathname.includes('/forum')
    },
    {
      path: '/daily-tip',
      icon: BookOpen,
      label: 'Conseils',
      isActive: location.pathname === '/daily-tip' || location.pathname.includes('/important-contacts')
    }
  ];

  return (
    <>
      {/* Navigation mobile (bottom bar) - Visible uniquement sur mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
        <div className="flex items-center justify-around h-16 max-w-screen-xl mx-auto px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  item.isActive
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-500'
                }`}
              >
                <Icon
                  size={24}
                  strokeWidth={item.isActive ? 2.5 : 2}
                  className="mb-1"
                />
                <span className={`text-xs font-medium ${item.isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer informationnel (desktop) - Visible uniquement sur desktop */}
      <footer className="hidden md:block bg-gray-100 border-t border-gray-200 mt-auto py-8 px-4">
        <div className="max-w-screen-xl mx-auto">
          {/* Navigation principale */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Doogybook */}
            <div>
              <h3 className="font-bold mb-4">Doogybook</h3>
              <p className="text-sm text-gray-600">
                L'application complète pour gérer la santé et le bien-être de votre chien.
              </p>
            </div>

            {/* Application */}
            <div>
              <h4 className="font-semibold mb-4">Application</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/dog-profile" className="text-sm text-gray-600 hover:text-blue-500">
                    Mon chien
                  </Link>
                </li>
                <li>
                  <Link to="/social-feed" className="text-sm text-gray-600 hover:text-blue-500">
                    Communauté
                  </Link>
                </li>
                <li>
                  <Link to="/daily-tip" className="text-sm text-gray-600 hover:text-blue-500">
                    Conseils & Contacts
                  </Link>
                </li>
              </ul>
            </div>

            {/* Ressources */}
            <div>
              <h4 className="font-semibold mb-4">Ressources</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-sm text-gray-600 hover:text-blue-500">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-sm text-gray-600 hover:text-blue-500">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Légal */}
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/cgu" className="text-sm text-gray-600 hover:text-blue-500">
                    CGU
                  </Link>
                </li>
                <li>
                  <Link to="/mentions-legales" className="text-sm text-gray-600 hover:text-blue-500">
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <Link to="/politique-confidentialite" className="text-sm text-gray-600 hover:text-blue-500">
                    Politique de confidentialité
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              © {currentYear} Doogybook. Développé par{' '}
              <a href="mailto:inbyoliver@gmail.com" className="text-blue-500 hover:underline">
                Olivier Avril
              </a>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Fait avec ❤️ pour nos amis à quatre pattes
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
