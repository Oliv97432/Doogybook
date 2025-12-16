import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/AppIcon';

const CGU = () => {
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
            Conditions Générales d'Utilisation
          </h1>
        </div>

        {/* Contenu */}
        <div className="bg-card rounded-3xl p-6 md:p-8 shadow-soft border border-border prose prose-sm max-w-none">
          <p className="text-sm text-muted-foreground mb-6">
            Dernière mise à jour : Décembre 2024
          </p>

          <h2>1. Présentation du service</h2>
          <p>
            Doogybook est une application web gratuite permettant aux propriétaires de chiens de gérer la santé et le bien-être de leurs animaux de compagnie.
          </p>
          <p>
            L'application est éditée par Olivier Avril et hébergée sur Vercel avec une base de données Supabase.
          </p>

          <h2>2. Acceptation des CGU</h2>
          <p>
            L'utilisation de Doogybook implique l'acceptation pleine et entière des présentes Conditions Générales d'Utilisation (CGU). En créant un compte, vous confirmez avoir lu, compris et accepté ces CGU.
          </p>

          <h2>3. Compte utilisateur</h2>
          <p><strong>Création de compte :</strong> Pour utiliser Doogybook, vous devez créer un compte en fournissant une adresse e-mail valide et un mot de passe.</p>
          <p><strong>Sécurité :</strong> Vous êtes responsable de la confidentialité de vos identifiants de connexion.</p>
          <p><strong>Véracité des informations :</strong> Vous vous engagez à fournir des informations exactes.</p>

          <h2>4. Services proposés</h2>
          <p>Doogybook propose les fonctionnalités suivantes :</p>
          <ul>
            <li>Gestion des profils de chiens</li>
            <li>Suivi des vaccinations et traitements</li>
            <li>Carnet de santé numérique</li>
            <li>Historique du poids</li>
            <li>Forum communautaire</li>
            <li>Conseils quotidiens</li>
            <li>Répertoire de contacts vétérinaires</li>
          </ul>

          <h2>5. Gratuité du service</h2>
          <p>
            Doogybook est un service <strong>entièrement gratuit</strong>. Aucun frais n'est demandé pour l'utilisation des fonctionnalités.
          </p>

          <h2>6. Contenu utilisateur</h2>
          <p><strong>Propriété :</strong> Vous conservez tous les droits sur le contenu que vous publiez.</p>
          <p><strong>Contenu interdit :</strong> Vous vous engagez à ne pas publier de contenu illégal, diffamatoire, offensant ou faisant la promotion de maltraitance animale.</p>

          <h2>7. Protection des données personnelles</h2>
          <p>
            Vos données personnelles sont traitées conformément au RGPD. Consultez notre Politique de Confidentialité pour plus de détails.
          </p>

          <h2>8. Limitation de responsabilité</h2>
          <p><strong>Information à titre indicatif :</strong> Les conseils fournis par Doogybook ne remplacent pas l'avis d'un vétérinaire professionnel.</p>
          <p><strong>Disponibilité :</strong> Nous ne garantissons pas une disponibilité absolue du service.</p>

          <h2>9. Résiliation du compte</h2>
          <p>
            Vous pouvez supprimer votre compte à tout moment en nous contactant à{' '}
            <a href="mailto:inbyoliver@gmail.com" className="text-primary hover:underline">
              inbyoliver@gmail.com
            </a>.
          </p>

          <h2>10. Loi applicable</h2>
          <p>Les présentes CGU sont soumises au droit français.</p>

          <div className="mt-8 p-6 bg-muted rounded-2xl not-prose">
            <h3 className="text-lg font-heading font-bold text-foreground mb-3">
              Nous contacter
            </h3>
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

export default CGU;
