import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/AppIcon';

const MentionsLegales = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-bg pb-20 pt-4 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-muted rounded-full transition-smooth"
          >
            <Icon name="ArrowLeft" size={24} className="text-foreground" />
          </button>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            Mentions Légales
          </h1>
        </div>

        {/* Contenu */}
        <div className="bg-card rounded-3xl p-6 md:p-8 shadow-soft border border-border prose prose-sm max-w-none">
          <p className="text-sm text-muted-foreground mb-6">
            Dernière mise à jour : Décembre 2024
          </p>

          <h2>1. Éditeur du site</h2>
          <p><strong>Nom :</strong> Olivier Avril</p>
          <p><strong>Type :</strong> Personne physique - Projet personnel</p>
          <p><strong>Email :</strong>{' '}
            <a href="mailto:inbyoliver@gmail.com" className="text-primary hover:underline">
              inbyoliver@gmail.com
            </a>
          </p>
          <p><strong>Site web :</strong>{' '}
            <a href="https://app.wooflyapp.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              https://app.wooflyapp.com
            </a>
          </p>

          <h2>2. Hébergement</h2>
          <p><strong>Hébergeur web :</strong> Vercel Inc.</p>
          <p><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
          <p><strong>Site web :</strong>{' '}
            <a href="https://vercel.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              https://vercel.com
            </a>
          </p>

          <h2>3. Base de données</h2>
          <p><strong>Fournisseur :</strong> Supabase Inc.</p>
          <p><strong>Site web :</strong>{' '}
            <a href="https://supabase.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              https://supabase.com
            </a>
          </p>

          <h2>4. Propriété intellectuelle</h2>
          <p>
            L'ensemble du contenu de ce site (structure, textes, logos, images, vidéos) est la propriété exclusive d'Olivier Avril, sauf mention contraire.
          </p>
          <p>
            Toute reproduction, distribution, modification, adaptation, retransmission ou publication de ces éléments est strictement interdite sans l'accord écrit préalable d'Olivier Avril.
          </p>

          <h2>5. Données personnelles</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez de droits sur vos données personnelles.
          </p>
          <p>
            Consultez notre{' '}
            <button
              onClick={() => navigate('/politique-confidentialite')}
              className="text-primary hover:underline font-medium"
            >
              Politique de Confidentialité
            </button>
            {' '}pour plus d'informations.
          </p>

          <h2>6. Responsabilité</h2>
          <p>
            Les informations fournies sur Woofly le sont à titre indicatif et ne remplacent en aucun cas un avis médical vétérinaire professionnel.
          </p>
          <p>
            L'éditeur ne saurait être tenu responsable des dommages directs ou indirects résultant de l'utilisation du site ou de l'impossibilité d'y accéder.
          </p>

          <h2>7. Liens hypertextes</h2>
          <p>
            Le site peut contenir des liens vers d'autres sites. L'éditeur n'est pas responsable du contenu de ces sites tiers.
          </p>

          <h2>8. Cookies</h2>
          <p>
            Woofly utilise des cookies strictement nécessaires au fonctionnement du site (authentification). Aucun cookie de tracking ou publicitaire n'est utilisé actuellement.
          </p>

          <h2>9. Droit applicable</h2>
          <p>
            Les présentes mentions légales sont régies par le droit français. Tout litige sera soumis aux tribunaux compétents français.
          </p>

          <div className="mt-8 p-6 bg-muted rounded-2xl not-prose">
            <h3 className="text-lg font-heading font-bold text-foreground mb-3">
              Nous contacter
            </h3>
            <p className="text-foreground mb-2">
              Pour toute question concernant ces mentions légales :
            </p>
            <p className="text-foreground">
              <strong>Email :</strong>{' '}
              <a href="mailto:inbyoliver@gmail.com" className="text-primary hover:underline">
                inbyoliver@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentionsLegales;
