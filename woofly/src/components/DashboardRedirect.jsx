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
        console.log('DashboardRedirect: Checking account for user:', user.id, user.email);
        
        // ÉTAPE 1 : Vérifier si l'utilisateur est admin PAR EMAIL
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('is_admin, email, id')
          .eq('email', user.email)
          .maybeSingle();

        console.log('DashboardRedirect: Profile result:', { profile, profileError });

        if (profile && profile.is_admin === true) {
          console.log('DashboardRedirect: User is admin, redirecting to admin dashboard');
          navigate('/admin/dashboard');
          return;
        }

        // ÉTAPE 2 : Vérifier si l'utilisateur a un compte pro (par user_id)
        let proAccount = null;
        
        const { data: proByUserId, error: proError1 } = await supabase
          .from('professional_accounts')
          .select('id, is_active, user_id')
          .eq('user_id', user.id)
          .maybeSingle();

        console.log('DashboardRedirect: Pro account by user_id:', { proByUserId, proError1 });

        if (proByUserId) {
          proAccount = proByUserId;
        } else {
          // FALLBACK : Chercher par email dans professional_accounts
          const { data: proByEmail, error: proError2 } = await supabase
            .from('professional_accounts')
            .select('id, is_active, user_id, contact_email')
            .eq('contact_email', user.email)
            .maybeSingle();

          console.log('DashboardRedirect: Pro account by email:', { proByEmail, proError2 });

          if (proByEmail) {
            proAccount = proByEmail;
            
            // Mettre à jour le user_id si différent
            if (proByEmail.user_id !== user.id) {
              console.log('DashboardRedirect: Updating user_id in professional_accounts');
              await supabase
                .from('professional_accounts')
                .update({ user_id: user.id })
                .eq('id', proByEmail.id);
            }
          }
        }

        // Si un compte pro existe, rediriger vers le dashboard pro
        if (proAccount) {
          console.log('DashboardRedirect: User has pro account, redirecting to pro dashboard');
          navigate('/pro/dashboard');
        } else {
          console.log('DashboardRedirect: Regular user, redirecting to dog-profile');
          navigate('/dog-profile');
        }
      } catch (error) {
        console.error('DashboardRedirect: Error checking account:', error);
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
