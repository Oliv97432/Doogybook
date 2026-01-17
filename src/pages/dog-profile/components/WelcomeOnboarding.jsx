import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WelcomeOnboarding = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: 'Syringe',
      title: 'Carnet de santé complet',
      description: 'Suivez vaccins, vermifuges et traitements anti-puces en un clin d\'oeil',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: 'TrendingUp',
      title: 'Suivi du poids',
      description: 'Graphiques d\'évolution pour surveiller la santé de votre compagnon',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: 'Bell',
      title: 'Rappels automatiques',
      description: 'Ne manquez jamais un rendez-vous vétérinaire ou un traitement',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: 'Camera',
      title: 'Album photos',
      description: 'Créez des souvenirs inoubliables avec votre chien',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: 'Users',
      title: 'Communauté active',
      description: 'Partagez et échangez avec d\'autres propriétaires de chiens',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: 'FileText',
      title: 'Export PDF',
      description: 'Exportez le carnet de santé complet pour vos visites vétérinaires',
      gradient: 'from-teal-500 to-cyan-500'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Chiens enregistrés' },
    { value: '50,000+', label: 'Vaccins suivis' },
    { value: '98%', label: 'Satisfaction' }
  ];

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gradient-to-b from-blue-50 via-purple-50/30 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-8 sm:pt-12 pb-8 text-center">
        {/* Illustration/Icon principale */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            {/* Cercle décoratif animé */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>

            {/* Icon principale */}
            <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-8 shadow-2xl">
              <Icon name="Dog" size={64} color="white" strokeWidth={2} />
            </div>

            {/* Badges flottants */}
            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              Gratuit
            </div>
            <div className="absolute -bottom-2 -left-2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              100% Sécurisé
            </div>
          </div>
        </div>

        {/* Titre principal */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-4 leading-tight">
          Bienvenue sur <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">DoogyBook</span> !
        </h1>

        {/* Sous-titre */}
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          Le carnet de santé digital qui simplifie le suivi médical de votre compagnon à quatre pattes
        </p>

        {/* CTA principal */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
          <Button
            size="lg"
            className="px-8 shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 min-h-[48px] text-base font-semibold"
            onClick={() => navigate('/multi-profile-management')}
            iconName="Plus"
          >
            Créer le profil de mon chien
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="px-8 min-h-[48px] text-base border-2"
            onClick={() => navigate('/social-feed')}
            iconName="Users"
          >
            Découvrir la communauté
          </Button>
        </div>

        {/* Texte de réassurance */}
        <p className="text-sm text-gray-500">
          Sans engagement • Sans carte bancaire • Sans publicité
        </p>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-3xl mx-auto">
          <div className="grid grid-cols-3 gap-4 divide-x divide-gray-200">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-8 sm:py-12">
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-center text-gray-900 mb-3">
          Tout ce dont vous avez besoin
        </h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Une suite complète d'outils pour prendre soin de la santé de votre chien
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-transparent hover:-translate-y-1"
            >
              {/* Icon avec gradient */}
              <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon name={feature.icon} size={28} color="white" strokeWidth={2} />
              </div>

              {/* Titre */}
              <h3 className="font-heading font-semibold text-gray-900 mb-2 text-lg">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section finale */}
      <section className="container mx-auto px-4 py-12 pb-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 sm:p-12 text-center text-white max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
            Rejoignez des milliers de propriétaires qui font déjà confiance à DoogyBook
          </p>

          <Button
            size="xl"
            className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all font-semibold px-10"
            onClick={() => navigate('/multi-profile-management')}
            iconName="Sparkles"
          >
            Commencer gratuitement
          </Button>

          {/* Avatar stack (effet social proof) */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-2 border-white flex items-center justify-center"
                >
                  <Icon name="Dog" size={20} color="white" />
                </div>
              ))}
            </div>
            <p className="text-sm text-blue-100">
              <strong className="text-white">10 000+</strong> propriétaires nous font confiance
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WelcomeOnboarding;
