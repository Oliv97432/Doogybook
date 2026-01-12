import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const DashboardRedirect = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Attendre que le chargement d'auth soit terminé
    if (loading) return;
    
    const checkAccountType = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        // ÉTAPE 1 : Vérifier si l'utilisateur est admin PAR EMAIL
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('is_admin, email, id')
          .eq('email', user.email)
          .single();

        if (profile && profile.is_admin === true) {
          navigate('/admin/dashboard');
          return;
        }

        // ÉTAPE 2 : Vérifier si l'utilisateur a un compte pro
        const { data: proAccount, error: proError } = await supabase
          .from('professional_accounts')
          .select('id, is_active')
          .eq('user_id', user.id)
          .single();

        // Si un compte pro existe (actif ou non), rediriger vers le dashboard pro
        if (proAccount) {
          navigate('/pro/dashboard');
        } else {
          navigate('/dog-profile');
        }
      } catch (error) {
        // En cas d'erreur → Dashboard User
        navigate('/dog-profile');
      } finally {
        setChecking(false);
      }
    };

    checkAccountType();
  }, [user, loading, navigate]);

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center w-full max-w-sm mx-auto">
          {/* Animation de chargement */}
          <div className="relative mb-6">
            <div className="w-20 h-20 mx-auto">
              <div className="animate-spin h-20 w-20 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">D</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Message */}
          <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
            Doogybook
          </h2>
          <p className="text-muted-foreground mb-6">
            Préparation de votre espace...
          </p>
          
          {/* Barre de progression */}
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full animate-pulse"></div>
          </div>
          
          {/* Conseils de chargement */}
          <div className="mt-8 space-y-2 text-left">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-xs text-muted-foreground">Vérification du compte</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <p className="text-xs text-muted-foreground">Chargement des données</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <p className="text-xs text-muted-foreground">Redirection vers votre tableau de bord</p>
            </div>
          </div>
          
          {/* Message mobile spécifique */}
          <p className="text-xs text-muted-foreground mt-6">
            Si la redirection prend trop de temps, vérifiez votre connexion.
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default DashboardRedirect;
