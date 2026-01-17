import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import PhotoAlbumCreator from '../components/PhotoAlbumCreator/PhotoAlbumCreator';
import PremiumModal from '../components/PremiumModal';

const PhotoAlbumPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!user?.id) {
        navigate('/login');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('is_premium')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        const premium = data?.is_premium || false;
        setIsPremium(premium);

        if (!premium) {
          setShowPremiumModal(true);
        }
      } catch (error) {
        console.error('Erreur vérification Premium:', error);
        setShowPremiumModal(true);
      } finally {
        setLoading(false);
      }
    };

    checkPremiumStatus();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isPremium) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Fonctionnalité Premium
            </h2>
            <p className="text-gray-600 mb-6">
              L'album photo est réservé aux membres Premium. Passez à Premium pour créer des albums personnalisés de vos chiens.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setShowPremiumModal(true)}
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Découvrir Premium
              </button>
              <button
                onClick={() => navigate('/user-dashboard')}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Retour au dashboard
              </button>
            </div>
          </div>
        </div>

        {showPremiumModal && (
          <PremiumModal onClose={() => setShowPremiumModal(false)} />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Barre de navigation simple */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/user-dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span>←</span>
            <span>Retour</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full">
              PREMIUM
            </span>
          </div>
        </div>
      </div>

      {/* Composant principal */}
      <PhotoAlbumCreator />
    </div>
  );
};

export default PhotoAlbumPage;
