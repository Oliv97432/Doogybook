import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeSection = () => {
  const features = [
    {
      icon: 'Heart',
      text: 'Suivez la santé de votre compagnon'
    },
    {
      icon: 'Users',
      text: 'Rejoignez une communauté passionnée'
    },
    {
      icon: 'BookOpen',
      text: 'Accédez à des conseils d\'experts'
    }
  ];

  return (
    <div className="text-center space-y-6 mb-8">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-2xl">
        <Icon name="Dog" size={48} color="var(--color-primary)" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-heading font-semibold text-foreground">
          Bienvenue sur Doogybook
        </h1>
        <p className="text-lg text-muted-foreground font-caption max-w-md mx-auto">
          Votre compagnon pour prendre soin de votre meilleur ami à quatre pattes
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-4">
        {features?.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name={feature?.icon} size={20} color="var(--color-primary)" />
            </div>
            <p className="text-sm text-foreground font-medium text-center">
              {feature?.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeSection;