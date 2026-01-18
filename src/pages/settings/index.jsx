import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Crown, Trash2, ChevronLeft, Mail, Phone, 
  MapPin, Save, AlertCircle, X, Check, Moon, Sun
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import UserMenu from '../../components/UserMenu';
import UserMenuPro from '../../components/UserMenuPro';
import Footer from '../../components/Footer';
import SubscriptionBadge from '../../components/SubscriptionBadge';

const Settings = () => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  
  const [isProAccount, setIsProAccount] = useState(false);
  const [checkingAccountType, setCheckingAccountType] = useState(true);
  const [subscriptionTier, setSubscriptionTier] = useState('free');
  
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: ''
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');

  useEffect(() => {
    checkAccountType();
  }, [user]);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const checkAccountType = async () => {
    if (!user) return;
    
    setCheckingAccountType(true);
    try {
      const { data: proAccount } = await supabase
        .from('professional_accounts')
        .select('id, is_active')
        .eq('user_id', user.id)
        .single();
      
      setIsProAccount(proAccount && proAccount.is_active);
    } catch (error) {
      console.log('No pro account found');
      setIsProAccount(false);
    } finally {
      setCheckingAccountType(false);
    }
  };

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      setProfile({
        full_name: data?.full_name || user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: data?.phone || user.user_metadata?.phone || '',
        location: data?.location || user.user_metadata?.location || ''
      });
      
      setSubscriptionTier(data?.subscription_tier || 'free');
    } catch (err) {
      console.error('Erreur chargement profil:', err);
      setProfile({
        full_name: user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
        location: user.user_metadata?.location || ''
      });
      setSubscriptionTier('free');
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: profile.full_name,
          phone: profile.phone,
          location: profile.location
        }
      });
      
      if (authError) throw authError;

      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          location: profile.location,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (profileError) throw profileError;
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('❌ Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmEmail !== user?.email) {
      alert('⚠️ L\'email ne correspond pas');
      return;
    }

    if (!window.confirm('⚠️ DERNIÈRE CONFIRMATION\n\nToutes vos données seront supprimées définitivement.\n\nContinuer ?')) {
      return;
    }

    try {
      const { error: dogsError } = await supabase
        .from('dogs')
        .delete()
        .eq('user_id', user.id);

      if (dogsError) throw dogsError;

      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) throw profileError;

      await signOut();
      navigate('/login');
      
      alert('✅ Votre compte a été supprimé avec succès');
    } catch (err) {
      console.error('Erreur suppression compte:', err);
      alert('❌ Erreur lors de la suppression du compte: ' + err.message);
    }
  };

  const handleThemeToggle = () => {
    setTheme(); // Toggle le thème (gratuit pour tous)
  };

  // Vérifier si l'utilisateur est Premium ou Professional
  const isPremiumUser = subscriptionTier === 'premium' || subscriptionTier === 'professional';

  if (checkingAccountType) {
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
      {/* Header avec UserMenu */}
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

      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          
          {/* Header page */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
              Paramètres
            </h1>
            <p className="text-muted-foreground mt-2">
              Gérez votre compte et vos préférences
            </p>
          </div>

          {/* Success message */}
          {saveSuccess && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg mx-4">
              <div className="flex items-center gap-2">
                <div className="text-green-500">✓</div>
                <p className="text-green-900 font-medium">Modifications enregistrées avec succès !</p>
              </div>
            </div>
          )}

          {/* Carte utilisateur */}
          <div className="bg-card rounded-xl border border-border p-6 mx-4 shadow-soft">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {profile.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-heading font-semibold text-foreground truncate">
                  {profile.full_name || 'Utilisateur'}
                </h2>
                <p className="text-sm text-muted-foreground truncate mb-2">{profile.email}</p>
                <SubscriptionBadge tier={subscriptionTier} size="sm" />
              </div>
            </div>
          </div>

          {/* Section Modifier profil */}
          <section className="bg-card rounded-xl border border-border p-6 mx-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <User className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-heading font-semibold text-foreground">
                  Modifier mon profil
                </h3>
                <p className="text-sm text-muted-foreground">
                  Nom, email, téléphone, localisation
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Nom complet */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  placeholder="Votre nom"
                  className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Email (lecture seule) */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <div className="flex items-center gap-2 px-4 py-3 bg-muted border border-border rounded-lg">
                  <Mail size={20} className="text-muted-foreground flex-shrink-0" />
                  <input
                    type="email"
                    value={profile.email}
                    readOnly
                    className="flex-1 bg-transparent outline-none text-muted-foreground cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  L'email ne peut pas être modifié pour des raisons de sécurité
                </p>
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Téléphone
                </label>
                <div className="flex items-center gap-2 px-4 py-3 border border-border rounded-lg bg-card">
                  <Phone size={20} className="text-muted-foreground flex-shrink-0" />
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="06 12 34 56 78"
                    className="flex-1 bg-transparent text-foreground outline-none focus:ring-0"
                  />
                </div>
              </div>

              {/* Localisation */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Localisation
                </label>
                <div className="flex items-center gap-2 px-4 py-3 border border-border rounded-lg bg-card">
                  <MapPin size={20} className="text-muted-foreground flex-shrink-0" />
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    placeholder="Ville, Pays"
                    className="flex-1 bg-transparent text-foreground outline-none focus:ring-0"
                  />
                </div>
              </div>

              {/* Bouton sauvegarder */}
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-smooth flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Enregistrer les modifications
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Section Apparence - MODE SOMBRE (GRATUIT) */}
          <section className="bg-card rounded-xl border border-border p-6 mx-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                {theme === 'dark' ? (
                  <Moon className="text-purple-600" size={24} />
                ) : (
                  <Sun className="text-purple-600" size={24} />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-heading font-semibold text-foreground">
                  Apparence
                </h3>
                <p className="text-sm text-muted-foreground">
                  Choisissez votre thème préféré
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  {theme === 'dark' ? (
                    <Moon className="text-gray-300" size={20} />
                  ) : (
                    <Sun className="text-gray-600" size={20} />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {theme === 'dark' ? 'Mode sombre' : 'Mode clair'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {theme === 'dark' ? 'Repose tes yeux 🌙' : 'Lumineux et clair ☀️'}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={handleThemeToggle}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer ${
                  theme === 'dark' ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </section>

          {/* Section Premium - CONDITIONNEL */}
          {isPremiumUser ? (
            // SI PREMIUM : Badge actif (vert)
            <section className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-700 p-6 mx-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Crown className="text-white" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-heading font-semibold text-green-900 dark:text-green-100 flex items-center gap-2">
                    Compte Premium actif
                    <Check size={20} className="text-green-600 dark:text-green-400" />
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                    Chiens illimités • Photos illimitées • Recettes personnalisées
                  </p>
                </div>
              </div>
            </section>
          ) : (
            // SI GRATUIT : Afficher les plans Gratuit et Premium côte à côte
            <section className="mx-4">
              {/* Header section */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-medium mb-4">
                  <Crown size={16} />
                  <span>Choisissez votre plan</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-2">
                  Profitez pleinement de Doogybook
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Commencez gratuitement ou passez Premium pour débloquer toutes les fonctionnalités
                </p>
              </div>

              {/* Plans Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Plan Gratuit */}
                <div className="relative rounded-2xl p-6 border-2 border-border bg-card">
                  <div className="mb-6">
                    <h4 className="text-2xl font-heading font-bold text-foreground mb-2">
                      Gratuit
                    </h4>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-4xl font-bold text-foreground">0€</span>
                      <span className="text-lg text-muted-foreground">/mois</span>
                    </div>
                    <p className="text-muted-foreground">Pour découvrir Doogybook</p>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-green-100 text-green-600">
                        <Check size={14} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">1 chien</p>
                        <p className="text-sm text-muted-foreground">Gérez le profil d'un seul chien</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-green-100 text-green-600">
                        <Check size={14} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">10 photos</p>
                        <p className="text-sm text-muted-foreground">Stockage limité à 10 photos</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-green-100 text-green-600">
                        <Check size={14} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Conseils quotidiens</p>
                        <p className="text-sm text-muted-foreground">Tips pour votre chien</p>
                      </div>
                    </div>

                    <div className="flex gap-3 opacity-40">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <X size={14} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Chiens illimités</p>
                      </div>
                    </div>

                    <div className="flex gap-3 opacity-40">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <X size={14} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Photos illimitées</p>
                      </div>
                    </div>

                    <div className="flex gap-3 opacity-40">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <X size={14} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Recettes personnalisées</p>
                      </div>
                    </div>

                    <div className="flex gap-3 opacity-40">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <X size={14} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Badge Premium</p>
                      </div>
                    </div>
                  </div>

                  <button
                    disabled
                    className="w-full py-4 bg-muted text-muted-foreground rounded-xl font-semibold text-lg cursor-not-allowed"
                  >
                    Gratuit
                  </button>
                </div>

                {/* Plan Premium */}
                <div className="relative rounded-2xl p-6 border-2 border-blue-500 shadow-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 md:scale-105">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-medium shadow-lg">
                      <Crown size={14} />
                      Populaire
                    </span>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="text-blue-600" size={28} />
                      <h4 className="text-2xl font-heading font-bold text-foreground">
                        Premium
                      </h4>
                    </div>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">3,99€</span>
                      <span className="text-lg text-muted-foreground">/mois</span>
                    </div>
                    <p className="text-sm text-blue-600 bg-blue-100 dark:bg-blue-900/30 inline-block px-3 py-1 rounded-full mb-2">
                      ou 39€/an (économisez 9€ !)
                    </p>
                    <p className="text-muted-foreground">Pour les propriétaires passionnés</p>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                        <Check size={14} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Chiens illimités 🐕</p>
                        <p className="text-sm text-muted-foreground">Gérez autant de chiens que vous voulez</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                        <Check size={14} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Photos illimitées 📸</p>
                        <p className="text-sm text-muted-foreground">Albums photo sans limite</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                        <Check size={14} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Recettes personnalisées 🍽️</p>
                        <p className="text-sm text-muted-foreground">Créez des recettes sur mesure</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                        <Check size={14} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Badge Premium 👑</p>
                        <p className="text-sm text-muted-foreground">Visible sur votre profil</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                        <Check size={14} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Conseils quotidiens</p>
                        <p className="text-sm text-muted-foreground">Tips avancés</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                        <Check size={14} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Priorité support</p>
                        <p className="text-sm text-muted-foreground">Réponses en priorité</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/premium')}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <Crown size={20} />
                    <span>Passer à Premium</span>
                  </button>

                  <p className="text-center text-xs text-muted-foreground mt-4">
                    ✨ Annulation possible à tout moment
                  </p>
                </div>
              </div>

              {/* Info section */}
              <div className="text-center mt-8 text-sm text-muted-foreground">
                <p>🔒 Paiement sécurisé • ⚡ Activation instantanée</p>
              </div>
            </section>
          )}

          {/* Supprimer compte */}
          <section className="bg-card rounded-xl border border-red-200 dark:border-red-800 p-6 mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle className="text-white" size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-heading font-semibold text-red-900 dark:text-red-100">
                  Supprimer mon compte
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Action irréversible - Toutes vos données seront perdues
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-smooth flex items-center justify-center gap-2"
            >
              <Trash2 size={20} />
              Supprimer mon compte
            </button>
          </section>

          {/* Info version */}
          <div className="text-center text-sm text-muted-foreground px-4">
            <p>Doogybook v1.0.0</p>
            <p className="mt-1">© 2025 Doogybook. Tous droits réservés.</p>
          </div>

        </div>
      </main>

      {/* Modal suppression compte */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-card rounded-xl shadow-xl max-w-md w-full p-6 mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-heading font-bold text-foreground">
                Supprimer mon compte
              </h3>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmEmail('');
                }}
                className="p-2 hover:bg-muted rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2 flex items-center gap-2">
                <AlertCircle size={20} className="text-red-900 dark:text-red-100" />
                Données qui seront supprimées :
              </h4>
              <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
                <li>• Tous vos chiens et leurs profils</li>
                <li>• Toutes les photos</li>
                <li>• Toutes les vaccinations et traitements</li>
                <li>• Toutes les notes médicales</li>
                <li>• Votre compte utilisateur</li>
              </ul>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Confirmez votre email pour continuer :
              </label>
              <input
                type="email"
                value={deleteConfirmEmail}
                onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                placeholder={user?.email}
                className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmEmail('');
                }}
                className="px-4 py-3 border border-border rounded-lg hover:bg-muted transition-smooth"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmEmail !== user?.email}
                className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-smooth"
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Settings;
