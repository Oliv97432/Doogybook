import React, { useRef } from 'react';

const PhotoSidebar = ({ photos, onPhotoImport, onRandomFill }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onPhotoImport(files);
    }
  };

  const handleDragStart = (e, photo) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('photoId', photo.id);
  };

  return (
    <div className="photo-sidebar">
      <div className="sidebar-header">
        <h2 className="text-xl font-semibold text-gray-800">Mes Photos</h2>
        <span className="photo-count">{photos.length} photo{photos.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Boutons d'action */}
      <div className="sidebar-actions">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-upload"
        >
          📸 Ajouter vos photos
        </button>

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
            <p className="text-gray-500 text-sm">Aucune photo importée</p>
            <p className="text-gray-400 text-xs mt-2">
              Cliquez sur "Ajouter vos photos" pour commencer
            </p>
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
