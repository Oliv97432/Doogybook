import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, X, Crown, Dog, Camera, Users, BookOpen, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import UserMenu from '../components/UserMenu';
import UserMenuPro from '../components/UserMenuPro';
import Footer from '../components/Footer';

const PremiumPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isProAccount, setIsProAccount] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAccountType();
  }, [user]);

  const checkAccountType = async () => {
    if (!user) return;
    
    try {
      const { data: proAccount } = await supabase
        .from('professional_accounts')
        .select('id')
        .eq('user_id', user.id)
        .single();

      setIsProAccount(!!proAccount);
    } catch (error) {
      console.error('Erreur vérification compte:', error);
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Gratuit',
      price: '0€',
      period: '/mois',
      description: 'Pour découvrir Doogybook',
      features: [
        { icon: Dog, text: '1 chien', subtext: 'Gérez le profil d\'un seul chien', included: true },
        { icon: Camera, text: '10 photos maximum', subtext: 'Album photo limité', included: true },
        { icon: Users, text: 'Communauté', subtext: 'Accès aux forums et posts', included: true },
        { icon: BookOpen, text: 'Conseils quotidiens', subtext: 'Tips pour votre chien', included: true },
        { icon: Dog, text: 'Chiens illimités', subtext: '', included: false },
        { icon: Camera, text: 'Photos illimitées', subtext: '', included: false },
        { icon: Crown, text: 'Badge Premium', subtext: '', included: false },
        { icon: Sparkles, text: 'Fonctionnalités avancées', subtext: '', included: false }
      ],
      cta: 'Gratuit',
      ctaDisabled: true,
      gradient: 'from-gray-50 to-gray-100',
      textColor: 'text-gray-900'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '3,99€',
      period: '/mois',
      yearlyPrice: 'ou 39€/an (économisez 9€ !)',
      description: 'Pour les propriétaires passionnés',
      popular: true,
      features: [
        { icon: Dog, text: 'Chiens illimités 🐕', subtext: 'Gérez autant de chiens que vous voulez', included: true },
        { icon: Camera, text: 'Photos illimitées 📸', subtext: 'Albums photo sans limite', included: true },
        { icon: Crown, text: 'Badge Premium 👑', subtext: 'Visible sur votre profil et vos posts', included: true },
        { icon: Users, text: 'Communauté', subtext: 'Accès complet aux forums', included: true },
        { icon: BookOpen, text: 'Conseils quotidiens', subtext: 'Tips avancés', included: true },
        { icon: Sparkles, text: 'Priorité support', subtext: 'Réponses en priorité', included: true }
      ],
      cta: 'Passer à Premium',
      gradient: 'from-green-500 via-blue-500 to-purple-600',
      textColor: 'text-white'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header avec navigation */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth py-2 min-h-[44px]"
          >
            <ChevronLeft size={20} />
            <span className="text-base font-medium">Retour</span>
          </button>
          
          {isProAccount ? <UserMenuPro /> : <UserMenu />}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
          {/* Header section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
              <Sparkles size={16} />
              Passez Premium
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
              Profitez pleinement de Doogybook
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Chiens illimités, photos illimitées et bien plus encore
            </p>
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-12">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-8 border-2 transition-all ${
                  plan.popular
                    ? 'border-primary shadow-2xl scale-105'
                    : 'border-border bg-card'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-4 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium shadow-lg">
                      <Sparkles size={14} />
                      Populaire
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className={`mb-6 ${plan.popular ? `bg-gradient-to-r ${plan.gradient} text-white rounded-xl p-6 -m-8 mb-6` : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-2xl font-heading font-bold ${plan.popular ? 'text-white' : 'text-foreground'}`}>
                      {plan.id === 'premium' && <Crown className="inline mr-2" size={24} />}
                      {plan.name}
                    </h3>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-foreground'}`}>
                      {plan.price}
                    </span>
                    <span className={`text-lg ${plan.popular ? 'text-white/80' : 'text-muted-foreground'}`}>
                      {plan.period}
                    </span>
                  </div>
                  {plan.yearlyPrice && (
                    <p className="text-sm text-white/90 bg-white/20 inline-block px-3 py-1 rounded-full">
                      {plan.yearlyPrice}
                    </p>
                  )}
                  <p className={`mt-3 ${plan.popular ? 'text-white/90' : 'text-muted-foreground'}`}>
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={index}
                        className={`flex gap-3 ${!feature.included ? 'opacity-40' : ''}`}
                      >
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                          feature.included
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {feature.included ? <Check size={14} /> : <X size={14} />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{feature.text}</p>
                          {feature.subtext && (
                            <p className="text-sm text-muted-foreground">{feature.subtext}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* CTA */}
                <button
                  disabled={plan.ctaDisabled}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 text-white hover:shadow-xl hover:scale-105'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Info section */}
          <div className="text-center text-sm text-muted-foreground">
            <p>✨ Annulation possible à tout moment</p>
            <p className="mt-1">🔒 Paiement sécurisé</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PremiumPage;
