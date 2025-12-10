import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Crown, Trash2, ChevronLeft, Mail, Phone, 
  MapPin, Save, AlertCircle, Lock, X
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import TabNavigation from '../../components/TabNavigation';
import Footer from '../../components/Footer';

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');

  // Charger le profil utilisateur
  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      setProfile({
        full_name: data?.full_name || user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: data?.phone || user.user_metadata?.phone || '',
        location: data?.location || user.user_metadata?.location || ''
      });
    } catch (err) {
      console.error('Erreur chargement profil:', err);
      setProfile({
        full_name: user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
        location: user.user_metadata?.location || ''
      });
    }
  };

  // Sauvegarder le profil
  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      // Mettre à jour user_metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: profile.full_name,
          phone: profile.phone,
          location: profile.location
        }
      });
      
      if (authError) throw authError;

      // Mettre à jour user_profiles
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          full_name: profile.full_name,
          phone: profile.phone,
          location: profile.location,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
      
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

  // Supprimer le compte
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
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      await signOut();
      navigate('/login');
      
      alert('✅ Votre compte a été supprimé avec succès');
    } catch (err) {
      console.error('Erreur suppression compte:', err);
      alert('❌ Erreur lors de la suppression du compte: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TabNavigation />

      <main className="main-content flex-1">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-smooth"
            >
              <ChevronLeft size={20} />
              <span>Retour</span>
            </button>
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Paramètres
            </h1>
            <p className="text-muted-foreground mt-2">
              Gérez votre compte et vos préférences
            </p>
          </div>

          {/* Success message */}
          {saveSuccess && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
              <div className="flex items-center gap-2">
                <div className="text-green-500">✓</div>
                <p className="text-green-900 font-medium">Modifications enregistrées avec succès !</p>
              </div>
            </div>
          )}

          {/* Carte utilisateur */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {profile.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-lg font-heading font-semibold text-foreground">
                  {profile.full_name || 'Utilisateur'}
                </h2>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>
            </div>
          </div>

          {/* Section Modifier profil */}
          <section className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
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

          {/* Passer à Premium (grisé) */}
          <section className="bg-card rounded-2xl border border-border p-6 opacity-50 cursor-not-allowed">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center">
                  <Crown className="text-amber-500" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
                    Passer à Premium
                    <span className="text-xs bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-2 py-1 rounded font-medium">
                      Bientôt
                    </span>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Sans pub + fonctionnalités avancées
                  </p>
                </div>
              </div>
              <Lock size={24} className="text-muted-foreground" />
            </div>
          </section>

          {/* Supprimer compte */}
          <section className="bg-card rounded-2xl border border-red-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-heading font-semibold text-red-900">
                  Supprimer mon compte
                </h3>
                <p className="text-sm text-red-700">
                  Action irréversible - Toutes vos données seront perdues
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-smooth flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              Supprimer mon compte
            </button>
          </section>

          {/* Info version */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Woofly v1.0.0</p>
            <p className="mt-1">© 2024 Woofly. Tous droits réservés.</p>
          </div>

        </div>
      </main>

      {/* Modal suppression compte */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-card rounded-2xl shadow-xl max-w-md w-full p-6">
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

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                <AlertCircle size={16} className="text-red-900" />
                Données qui seront supprimées :
              </h4>
              <ul className="text-sm text-red-800 space-y-1">
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
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmEmail('');
                }}
                className="flex-1 px-4 py-3 border border-border rounded-lg hover:bg-muted transition-smooth"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmEmail !== user?.email}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-smooth"
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
