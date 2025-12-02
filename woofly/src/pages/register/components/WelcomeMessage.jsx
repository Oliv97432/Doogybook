import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeMessage = () => {
  const benefits = [
    {
      icon: 'Heart',
      title: 'Suivi de santé complet',
      description: 'Gardez un historique détaillé des vaccinations, traitements et visites vétérinaires'
    },
    {
      icon: 'Users',
      title: 'Communauté active',
      description: 'Échangez avec d\'autres propriétaires de la même race que votre chien'
    },
    {
      icon: 'BookOpen',
      title: 'Conseils quotidiens',
      description: 'Recevez des astuces d\'experts pour améliorer le bien-être de votre compagnon'
    },
    {
      icon: 'Bell',
      title: 'Rappels automatiques',
      description: 'Ne manquez plus jamais un rendez-vous vétérinaire ou un traitement important'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center lg:text-left">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <Icon name="Dog" size={32} color="var(--color-primary)" />
        </div>
        <h2 className="text-2xl lg:text-3xl font-heading font-semibold text-foreground mb-3">
          Bienvenue sur Woofly
        </h2>
        <p className="text-muted-foreground font-caption text-base lg:text-lg">
          La plateforme complète pour prendre soin de votre chien et rejoindre une communauté passionnée
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {benefits?.map((benefit, index) => (
          <div
            key={index}
            className="bg-card rounded-lg p-4 border border-border hover:shadow-elevated transition-smooth"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={benefit?.icon} size={20} color="var(--color-primary)" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-semibold text-foreground mb-1">
                  {benefit?.title}
                </h3>
                <p className="text-sm text-muted-foreground font-caption">
                  {benefit?.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} color="var(--color-accent)" className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-accent-foreground font-caption">
              <strong className="font-semibold">Gratuit et sans engagement.</strong> Commencez dès maintenant à gérer la santé de votre chien et connectez-vous avec des milliers de propriétaires.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;