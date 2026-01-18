import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, X, Crown, Sparkles } from 'lucide-react';
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

  // Plans data - matching landing page design
  const freePlanFeatures = [
    { text: '1 chien', subtext: 'Gérez le profil d\'un seul chien', included: true },
    { text: '10 photos', subtext: 'Stockage limité à 10 photos', included: true },
    { text: 'Conseils quotidiens', subtext: 'Tips pour votre chien', included: true },
    { text: 'Mode sombre', subtext: 'Interface adaptée à vos yeux', included: true },
    { text: 'Chiens illimités', included: false },
    { text: 'Photos illimitées', included: false },
    { text: 'Recettes personnalisées', included: false },
    { text: 'Badge Premium', included: false }
  ];

  const premiumPlanFeatures = [
    { text: 'Chiens illimités 🐕', subtext: 'Gérez autant de chiens que vous voulez', included: true },
    { text: 'Photos illimitées 📸', subtext: 'Albums photo sans limite', included: true },
    { text: 'Recettes personnalisées 🍽️', subtext: 'Créez des recettes sur mesure', included: true },
    { text: 'Badge Premium 👑', subtext: 'Visible sur votre profil', included: true },
    { text: 'Albums photo PDF 📄', subtext: 'Téléchargez vos souvenirs', included: true },
    { text: 'Rappels intelligents 🔔', subtext: 'Ne manquez plus aucun soin', included: true },
    { text: 'Conseils quotidiens', subtext: 'Tips avancés', included: true },
    { text: 'Mode sombre', subtext: 'Interface adaptée à vos yeux', included: true }
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-medium mb-6">
              <Sparkles size={16} />
              <span>Choisissez votre plan</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
              Profitez pleinement de Doogybook
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Commencez gratuitement ou passez Premium pour débloquer toutes les fonctionnalités
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-12">
            {/* Plan Gratuit */}
            <div className="relative rounded-2xl p-6 sm:p-8 border-2 border-border bg-card">
              <div className="mb-6">
                <h3 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-2">
                  Gratuit
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl sm:text-5xl font-bold text-foreground">0€</span>
                  <span className="text-lg text-muted-foreground">/mois</span>
                </div>
                <p className="text-muted-foreground">Pour découvrir Doogybook</p>
              </div>

              <div className="space-y-4 mb-8">
                {freePlanFeatures.map((feature, index) => (
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
                ))}
              </div>

              <button
                onClick={() => navigate('/register')}
                className="w-full py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-all"
              >
                Commencer gratuitement
              </button>
            </div>

            {/* Plan Premium */}
            <div className="relative rounded-2xl p-6 sm:p-8 border-2 border-blue-500 shadow-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 md:scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-medium shadow-lg">
                  <Sparkles size={14} />
                  Populaire
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="text-blue-600" size={28} />
                  <h3 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
                    Premium
                  </h3>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">3,99€</span>
                  <span className="text-lg text-muted-foreground">/mois</span>
                </div>
                <p className="text-sm text-blue-600 bg-blue-100 dark:bg-blue-900/30 inline-block px-3 py-1 rounded-full mb-2">
                  ou 39€/an (économisez 9€ !)
                </p>
                <p className="text-muted-foreground">Pour les propriétaires passionnés</p>
              </div>

              <div className="space-y-4 mb-8">
                {premiumPlanFeatures.map((feature, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                      <Check size={14} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{feature.text}</p>
                      {feature.subtext && (
                        <p className="text-sm text-muted-foreground">{feature.subtext}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/register')}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Crown size={20} />
                <span>Commencer avec Premium</span>
              </button>

              <p className="text-center text-xs text-muted-foreground mt-4">
                ✨ Annulation possible à tout moment
              </p>
            </div>
          </div>

          {/* Info section */}
          <div className="text-center text-sm text-muted-foreground">
            <p>🔒 Paiement sécurisé • ⚡ Activation instantanée</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PremiumPage;
