import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Composant qui redirige automatiquement vers /profile/{user.id}
 * Accessible via /mon-profil
 */
const MyProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Rediriger vers /profile/USER_ID
      navigate(`/profile/${user.id}`, { replace: true });
    } else {
      // Si pas connecté, rediriger vers login
      navigate('/login', { 
        state: { returnTo: '/mon-profil' } 
      });
    }
  }, [user, navigate]);

  // Afficher un loader pendant la redirection
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    </div>
  );
};

export default MyProfile;
