import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Composant de redirection pour /dog-profile (sans ID)
 * Redirige vers /user-dashboard car le profil sans ID n'a plus d'utilité
 */
const DogProfileRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger immédiatement vers le dashboard utilisateur
    navigate('/user-dashboard', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirection...</p>
      </div>
    </div>
  );
};

export default DogProfileRedirect;
