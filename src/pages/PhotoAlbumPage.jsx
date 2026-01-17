import React from 'react';
import { useNavigate } from 'react-router-dom';
import PhotoAlbumCreator from '../components/PhotoAlbumCreator/PhotoAlbumCreator';

const PhotoAlbumPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Barre de navigation simple */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
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
