import React from 'react';

const PhotoSidebar = ({ photos, onRandomFill, dogName }) => {
  const handleDragStart = (e, photo) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('photoId', photo.id);
  };

  return (
    <div className="photo-sidebar">
      <div className="sidebar-header">
        <h2 className="text-xl font-semibold text-gray-800">
          Photos de {dogName}
        </h2>
        <span className="photo-count">{photos.length} photo{photos.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Boutons d'action */}
      <div className="sidebar-actions">
        <button
          onClick={onRandomFill}
          disabled={photos.length === 0}
          className="btn-random"
          title="Répartir toutes les photos de façon aléatoire dans l'album"
        >
          🎲 Remplissage Aléatoire
        </button>
      </div>

      {/* Liste des miniatures */}
      <div className="photo-grid">
        {photos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📷</div>
            <p className="text-gray-500 text-sm">Aucune photo disponible</p>
            <p className="text-gray-400 text-xs mt-2">
              Ajoutez des photos depuis le profil de {dogName}
            </p>
            <a
              href="/dog-profile"
              className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Aller au profil
            </a>
          </div>
        ) : (
          photos.map((photo) => (
            <div
              key={photo.id}
              className="photo-thumbnail"
              draggable
              onDragStart={(e) => handleDragStart(e, photo)}
            >
              <img
                src={photo.url}
                alt={photo.name}
                className="thumbnail-image"
              />
              <div className="thumbnail-overlay">
                <span className="drag-hint">Glisser</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Instructions */}
      {photos.length > 0 && (
        <div className="sidebar-footer">
          <p className="text-xs text-gray-500">
            💡 Glissez une photo vers l'album ou utilisez le remplissage aléatoire
          </p>
        </div>
      )}
    </div>
  );
};

export default PhotoSidebar;
