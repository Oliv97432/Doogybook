import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Building2, Mail, Phone, MapPin, Globe, Instagram, 
  Facebook, Check, ArrowLeft, Upload, AlertCircle
} from 'lucide-react';
import Footer from '../../components/Footer';

const ProRegistration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    organization_name: '',
    organization_type: 'association',
    siret: '',
    description: '',
    address: '',
    city: '',
    postal_code: '',
    phone: '',
    email: user?.email || '',
    website: '',
    instagram: '',
    facebook: '',
    logo_url: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Vérifier si l'utilisateur a déjà un compte pro
      const { data: existing, error: checkError } = await supabase
        .from('professional_accounts')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existing) {
        setError('Vous avez déjà un compte professionnel.');
        setLoading(false);
        return;
      }

      // Créer le compte professionnel
      const { data, error: insertError } = await supabase
        .from('professional_accounts')
        .insert([{
          user_id: user.id,
          ...formData,
          is_verified: false, // En attente de vérification
          is_active: true
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      setSuccess(true);
      
      // Rediriger vers le dashboard pro après 2 secondes
      setTimeout(() => {
        navigate('/pro/dashboard');
      }, 2000);

    } catch (err) {
      console.error('Erreur création compte pro:', err);
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Connexion requise
          </h2>
          <p className="text-gray-600 mb-6">
            Vous devez être connecté pour créer un compte professionnel
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">
            Demande envoyée !
          </h2>
          <p className="text-gray-600 mb-6">
            Votre compte professionnel a été créé et est en attente de vérification.
            Vous serez notifié par email une fois votre compte validé.
          </p>
          <button
            onClick={() => navigate('/pro/dashboard')}
            className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600"
          >
            Accéder au dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Retour</span>
          </button>
          <h1 className="text-xl font-heading font-bold text-gray-900">
            Compte Professionnel
          </h1>
          <div className="w-20"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Building2 size={32} />
            <h2 className="text-3xl font-heading font-bold">
              Devenez partenaire Doogybook
            </h2>
          </div>
          <p className="text-lg text-white/90 mb-6">
            Créez votre compte professionnel pour gérer vos chiens à l'adoption,
            recevoir des candidatures et toucher des milliers d'adoptants potentiels.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Check size={24} className="mb-2" />
              <p className="font-semibold">Visibilité maximale</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Check size={24} className="mb-2" />
              <p className="font-semibold">Gestion simplifiée</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Check size={24} className="mb-2" />
              <p className="font-semibold">100% gratuit</p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-sm">
          <h3 className="text-2xl font-heading font-bold text-gray-900 mb-6">
            Informations de l'organisation
          </h3>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
              <AlertCircle size={20} className="text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Type d'organisation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type d'organisation *
              </label>
              <select
                name="organization_type"
                value={formData.organization_type}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="association">Association loi 1901</option>
                <option value="refuge">Refuge</option>
                <option value="spa">SPA</option>
                <option value="eleveur">Éleveur</option>
              </select>
            </div>

            {/* Nom de l'organisation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'organisation *
              </label>
              <input
                type="text"
                name="organization_name"
                value={formData.organization_name}
                onChange={handleChange}
                required
                placeholder="Ex: Refuge de l'Espoir"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* SIRET */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SIRET (optionnel)
              </label>
              <input
                type="text"
                name="siret"
                value={formData.siret}
                onChange={handleChange}
                placeholder="123 456 789 00010"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description de votre organisation *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Décrivez votre mission, vos valeurs..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Adresse */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="123 rue de la Paix"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code postal *
                </label>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  required
                  placeholder="75001"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="Paris"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email de contact *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="contact@refuge.fr"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="06 12 34 56 78"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe size={16} className="inline mr-1" />
                  Site web
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Instagram size={16} className="inline mr-1" />
                  Instagram
                </label>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="@votre_compte"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Facebook size={16} className="inline mr-1" />
                  Facebook
                </label>
                <input
                  type="text"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  placeholder="VotrePage"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Bouton submit */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Envoi en cours...' : 'Créer mon compte professionnel'}
              </button>
              <p className="text-sm text-gray-500 text-center mt-4">
                Votre compte sera vérifié par notre équipe sous 48h
              </p>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default ProRegistration;
