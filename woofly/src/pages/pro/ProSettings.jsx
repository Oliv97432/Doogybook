import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Building2, Mail, Phone, MapPin, 
  Globe, Save, AlertCircle, CheckCircle, Trash2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import UserMenuPro from '../../components/UserMenuPro';
import Footer from '../../components/Footer';

const ProSettings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [proAccount, setProAccount] = useState({
    organization_name: '',
    organization_type: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    website: '',
    description: ''
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProAccount();
    }
  }, [user]);

  const loadProAccount = async () => {
    try {
      const { data, error } = await supabase
        .from('professional_accounts')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Erreur chargement compte pro:', error);
        // Si pas de compte pro, rediriger
        navigate('/settings');
        return;
      }

      setProAccount({
        organization_name: data.organization_name || '',
        organization_type: data.organization_type || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        postal_code: data.postal_code || '',
        website: data.website || '',
        description: data.description || ''
      });
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const { error } = await supabase
        .from('professional_accounts')
        .update({
          organization_name: proAccount.organization_name,
          organization_type: proAccount.organization_type,
          email: proAccount.email,
          phone: proAccount.phone,
          address: proAccount.address,
          city: proAccount.city,
          postal_code: proAccount.postal_code,
          website: proAccount.website,
          description: proAccount.description,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      alert('❌ Erreur lors de la sauvegarde: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmEmail !== user?.email) {
      alert('❌ L\'email ne correspond pas');
      return;
    }

    const confirmed = window.confirm(
      '⚠️ ATTENTION : Cette action est irréversible !\n\n' +
      'En supprimant votre compte professionnel, vous perdrez :\n' +
      '- Tous vos chiens\n' +
      '- Toutes les candidatures\n' +
      '- Toutes les familles d\'accueil\n' +
      '- Toutes vos données\n\n' +
      'Êtes-vous absolument certain de vouloir continuer ?'
    );

    if (!confirmed) return;

    try {
      // Supprimer toutes les données liées
      const { error: dogsError } = await supabase
        .from('dogs')
        .delete()
        .eq('professional_account_id', user.id);

      if (dogsError) throw dogsError;

      const { error: accountError } = await supabase
        .from('professional_accounts')
        .delete()
        .eq('user_id', user.id);

      if (accountError) throw accountError;

      await signOut();
      navigate('/login');
      
      alert('✅ Votre compte professionnel a été supprimé avec succès');
    } catch (err) {
      console.error('Erreur suppression compte:', err);
      alert('❌ Erreur lors de la suppression du compte: ' + err.message);
    }
  };

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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/pro/dashboard')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth py-2 min-h-[44px]"
          >
            <ChevronLeft size={20} />
            <span className="text-base font-medium">Retour</span>
          </button>
          
          <UserMenuPro />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          
          {/* Header page */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
              Paramètres du compte professionnel
            </h1>
            <p className="text-muted-foreground mt-2">
              Gérez les informations de votre organisation
            </p>
          </div>

          {/* Success message */}
          {saveSuccess && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-green-500" />
                <p className="text-green-900 font-medium">Modifications enregistrées avec succès !</p>
              </div>
            </div>
          )}

          {/* Carte organisation */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-soft">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {proAccount.organization_name?.charAt(0)?.toUpperCase() || 'P'}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-heading font-semibold text-foreground truncate">
                  {proAccount.organization_name || 'Nom de l\'organisation'}
                </h2>
                <p className="text-sm text-muted-foreground truncate">{proAccount.email}</p>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle size={12} className="text-green-500" />
                  <span className="text-xs text-green-600">Compte vérifié</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section Modifier profil */}
          <section className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Building2 className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-heading font-semibold text-foreground">
                  Informations de l'organisation
                </h3>
                <p className="text-sm text-muted-foreground">
                  Nom, type, contact, adresse
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Nom de l'organisation */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nom de l'organisation *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="text"
                    value={proAccount.organization_name}
                    onChange={(e) => setProAccount({ ...proAccount, organization_name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                    placeholder="Ex: Refuge Prospéo"
                    required
                  />
                </div>
              </div>

              {/* Type d'organisation */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Type d'organisation
                </label>
                <select
                  value={proAccount.organization_type}
                  onChange={(e) => setProAccount({ ...proAccount, organization_type: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                >
                  <option value="">Sélectionnez un type</option>
                  <option value="refuge">Refuge</option>
                  <option value="spa">SPA</option>
                  <option value="association">Association</option>
                  <option value="eleveur">Éleveur</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email de contact
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="email"
                    value={proAccount.email}
                    onChange={(e) => setProAccount({ ...proAccount, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                    placeholder="contact@refuge.com"
                  />
                </div>
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Téléphone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="tel"
                    value={proAccount.phone}
                    onChange={(e) => setProAccount({ ...proAccount, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                    placeholder="0262 XX XX XX"
                  />
                </div>
              </div>

              {/* Adresse */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Adresse
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-muted-foreground" size={18} />
                  <input
                    type="text"
                    value={proAccount.address}
                    onChange={(e) => setProAccount({ ...proAccount, address: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                    placeholder="123 Rue du Refuge"
                  />
                </div>
              </div>

              {/* Ville et Code postal */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={proAccount.city}
                    onChange={(e) => setProAccount({ ...proAccount, city: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                    placeholder="Saint-Denis"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Code postal
                  </label>
                  <input
                    type="text"
                    value={proAccount.postal_code}
                    onChange={(e) => setProAccount({ ...proAccount, postal_code: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                    placeholder="97400"
                  />
                </div>
              </div>

              {/* Site web */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Site web
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="url"
                    value={proAccount.website}
                    onChange={(e) => setProAccount({ ...proAccount, website: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                    placeholder="https://www.refuge.com"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description de l'organisation
                </label>
                <textarea
                  value={proAccount.description}
                  onChange={(e) => setProAccount({ ...proAccount, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground resize-none"
                  placeholder="Présentez votre organisation et votre mission..."
                />
              </div>

              {/* Bouton Enregistrer */}
              <button
                type="submit"
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth disabled:opacity-50 font-medium"
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Enregistrer les modifications
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Section Supprimer compte */}
          <section className="bg-card rounded-xl border border-red-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-heading font-semibold text-red-600">
                  Zone dangereuse
                </h3>
                <p className="text-sm text-muted-foreground">
                  Supprimer votre compte professionnel
                </p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-800">
                <strong>⚠️ Attention :</strong> La suppression de votre compte est définitive et irréversible.
                Toutes vos données (chiens, candidatures, familles d'accueil) seront perdues.
              </p>
            </div>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-smooth"
            >
              <Trash2 size={18} />
              Supprimer mon compte professionnel
            </button>
          </section>

        </div>
      </main>

      {/* Modal de confirmation suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-heading font-bold text-foreground">
                Supprimer le compte
              </h3>
            </div>

            <p className="text-muted-foreground mb-4">
              Cette action est <strong>irréversible</strong>. Pour confirmer, veuillez saisir votre adresse email :
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-amber-800">
                <strong>{user?.email}</strong>
              </p>
            </div>

            <input
              type="email"
              value={deleteConfirmEmail}
              onChange={(e) => setDeleteConfirmEmail(e.target.value)}
              placeholder="Confirmez votre email"
              className="w-full px-4 py-3 border border-border rounded-lg mb-4 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />

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

export default ProSettings;
