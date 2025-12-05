import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Bell, Palette, Globe, Trash2, ChevronLeft, 
  Camera, Mail, Phone, MapPin, Save, AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import TabNavigation from '../components/TabNavigation';
import Footer from '../components/Footer';

/**
 * Page Settings - Paramètres de l'application
 */
const Settings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  // États pour le profil utilisateur
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // États pour les préférences
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    reminders: true
  });
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('fr');

  // Charger le profil utilisateur
  useEffect(() => {
    if (user) {
      setProfile({
        full_name: user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
        location: user.user_metadata?.location || ''
      });
    }
  }, [user]);

  // Sauvegarder le profil
  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profile.full_name,
          phone: profile.phone,
          location: profile.location
        }
      });
      
      if (error) throw error;
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('❌ Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  // Supprimer le compte
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      '⚠️ ATTENTION : Cette action est irréversible.\n\n' +
      'Toutes vos données seront définitivement supprimées :\n' +
      '- Vos chiens\n' +
      '- Vos rappels\n' +
      '- Vos notes\n' +
      '- Votre historique\n\n' +
      'Êtes-vous absolument sûr de vouloir supprimer votre compte ?'
    );
    
    if (!confirmed) return;
    
    const doubleConfirm = window.confirm(
      '🚨 DERNIÈRE CONFIRMATION\n\n' +
      'Tapez votre email pour confirmer la suppression.\n\n' +
      'Cette action ne peut PAS être annulée.'
    );
    
    if (!doubleConfirm) return;
    
    try {
      // TODO: Implémenter la suppression via Edge Function
      alert('🚧 Fonctionnalité en cours de développement.\n\nContactez le support pour supprimer votre compte.');
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('❌ Erreur lors de la suppression');
    }
  };

  const sections = [
    {
      id: 'profile',
      title: 'Mon Profil',
      icon: User,
      description: 'Gérer vos informations personnelles'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      description: 'Gérer les alertes et rappels'
    },
    {
      id: 'appearance',
      title: 'Apparence',
      icon: Palette,
      description: 'Thème et affichage'
    },
    {
      id: 'language',
      title: 'Langue',
      icon: Globe,
      description: 'Choisir la langue de l\'application'
    },
    {
      id: 'danger',
      title: 'Zone dangereuse',
      icon: Trash2,
      description: 'Supprimer votre compte'
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card border-b border-border shadow-soft">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-muted rounded-lg transition-smooth"
            >
              <ChevronLeft size={24} className="text-foreground" />
            </button>
            <h1 className="text-2xl font-heading font-semibold text-foreground">
              Paramètres
            </h1>
          </div>
        </div>
      </div>

      {/* TabNavigation */}
      <TabNavigation />

      {/* Main content */}
      <main className="main-content flex-1">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          
          {/* Success message */}
          {saveSuccess && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
              <div className="flex items-center gap-2">
                <div className="text-green-500">✓</div>
                <p className="text-green-900 font-medium">Modifications enregistrées avec succès !</p>
              </div>
            </div>
          )}

          {/* Section Mon Profil */}
          <section className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="text-blue-600" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-heading font-semibold text-foreground">Mon Profil</h2>
                <p className="text-sm text-muted-foreground">Gérer vos informations personnelles</p>
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
                  className="w-full px-4 py-3 border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Email (lecture seule) */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <div className="flex items-center gap-2 px-4 py-3 bg-muted border border-border rounded-lg">
                  <Mail size={18} className="text-muted-foreground" />
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
                  <Phone size={18} className="text-muted-foreground" />
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="06 12 34 56 78"
                    className="flex-1 bg-transparent outline-none focus:ring-0"
                  />
                </div>
              </div>

              {/* Localisation */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Localisation
                </label>
                <div className="flex items-center gap-2 px-4 py-3 border border-border rounded-lg bg-card">
                  <MapPin size={18} className="text-muted-foreground" />
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    placeholder="Ville, Pays"
                    className="flex-1 bg-transparent outline-none focus:ring-0"
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
                    <Save size={18} />
                    Enregistrer les modifications
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Section Notifications */}
          <section className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Bell className="text-purple-600" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-heading font-semibold text-foreground">Notifications</h2>
                <p className="text-sm text-muted-foreground">Gérer les alertes et rappels</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Notifications email */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Notifications par email</p>
                  <p className="text-sm text-muted-foreground">Recevoir les rappels par email</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                  className={`relative w-12 h-6 rounded-full transition-smooth ${
                    notifications.email ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications.email ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Push notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Notifications push</p>
                  <p className="text-sm text-muted-foreground">Recevoir les alertes sur votre appareil</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, push: !notifications.push })}
                  className={`relative w-12 h-6 rounded-full transition-smooth ${
                    notifications.push ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications.push ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Rappels */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Rappels automatiques</p>
                  <p className="text-sm text-muted-foreground">Vaccins, vermifuges, toilettage</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, reminders: !notifications.reminders })}
                  className={`relative w-12 h-6 rounded-full transition-smooth ${
                    notifications.reminders ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications.reminders ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Section Apparence */}
          <section className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Palette className="text-indigo-600" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-heading font-semibold text-foreground">Apparence</h2>
                <p className="text-sm text-muted-foreground">Thème et affichage</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {['light', 'dark', 'auto'].map((themeOption) => (
                <button
                  key={themeOption}
                  onClick={() => setTheme(themeOption)}
                  className={`p-4 rounded-lg border-2 transition-smooth ${
                    theme === themeOption
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">
                      {themeOption === 'light' && '☀️'}
                      {themeOption === 'dark' && '🌙'}
                      {themeOption === 'auto' && '⚙️'}
                    </div>
                    <p className="text-sm font-medium text-foreground capitalize">
                      {themeOption === 'light' && 'Clair'}
                      {themeOption === 'dark' && 'Sombre'}
                      {themeOption === 'auto' && 'Auto'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Section Langue */}
          <section className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Globe className="text-green-600" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-heading font-semibold text-foreground">Langue</h2>
                <p className="text-sm text-muted-foreground">Choisir la langue de l'application</p>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { code: 'fr', label: 'Français', flag: '🇫🇷' },
                { code: 'en', label: 'English', flag: '🇬🇧' },
                { code: 'es', label: 'Español', flag: '🇪🇸' }
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-smooth ${
                    language === lang.code
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="font-medium text-foreground">{lang.label}</span>
                  {language === lang.code && (
                    <div className="ml-auto text-primary">✓</div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Section Zone dangereuse */}
          <section className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-heading font-semibold text-red-900">Zone dangereuse</h2>
                <p className="text-sm text-red-700">Actions irréversibles</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-red-200">
              <h3 className="font-semibold text-red-900 mb-2">Supprimer mon compte</h3>
              <p className="text-sm text-red-700 mb-4">
                Cette action supprimera définitivement votre compte et toutes vos données. 
                Cette action ne peut pas être annulée.
              </p>
              <button
                onClick={handleDeleteAccount}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-smooth flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Supprimer mon compte
              </button>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Settings;
