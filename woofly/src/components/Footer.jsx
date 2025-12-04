import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './AppIcon';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation principale */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* À propos */}
          <div>
            <h3 className="font-heading font-bold text-foreground mb-4">
              Woofly
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              L'application complète pour gérer la santé et le bien-être de votre chien.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/sharer/sharer.php?u=https://app.wooflyapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-muted rounded-full hover:bg-primary/10 transition-smooth"
                aria-label="Facebook"
              >
                <Icon name="Facebook" size={18} className="text-foreground" />
              </a>
              <a
                href="https://twitter.com/intent/tweet?text=Découvrez Woofly&url=https://app.wooflyapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-muted rounded-full hover:bg-primary/10 transition-smooth"
                aria-label="Twitter"
              >
                <Icon name="Twitter" size={18} className="text-foreground" />
              </a>
            </div>
          </div>

          {/* Application */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Application</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/dog-profile"
                  className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                >
                  Mon chien
                </Link>
              </li>
              <li>
                <Link
                  to="/forum-hub"
                  className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                >
                  Communauté
                </Link>
              </li>
              <li>
                <Link
                  to="/daily-tip"
                  className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                >
                  Conseils & Contacts
                </Link>
              </li>
              <li>
                <Link
                  to="/multi-profile-management"
                  className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                >
                  Gestion des profils
                </Link>
              </li>
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Ressources</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Légal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/cgu"
                  className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                >
                  CGU
                </Link>
              </li>
              <li>
                <Link
                  to="/mentions-legales"
                  className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  to="/politique-confidentialite"
                  className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                >
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} Woofly. Développé par{' '}
              <a
                href="mailto:inbyoliver@gmail.com"
                className="text-primary hover:underline"
              >
                Olivier Avril
              </a>
            </p>
            <p className="text-xs text-muted-foreground">
              Fait avec ❤️ pour nos amis à quatre pattes
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
