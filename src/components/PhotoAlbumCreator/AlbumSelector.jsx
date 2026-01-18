import React, { useState } from 'react';
import { Plus, BookOpen, Edit2, Trash2 } from 'lucide-react';

const AlbumSelector = ({
  albums,
  currentAlbumId,
  onSelectAlbum,
  onCreateAlbum,
  onRenameAlbum,
  onDeleteAlbum
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [editingAlbumId, setEditingAlbumId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleCreateAlbum = () => {
    if (newAlbumTitle.trim()) {
      onCreateAlbum(newAlbumTitle.trim());
      setNewAlbumTitle('');
      setIsCreating(false);
    }
  };

  const handleRename = (albumId) => {
    if (editTitle.trim()) {
      onRenameAlbum(albumId, editTitle.trim());
      setEditingAlbumId(null);
      setEditTitle('');
    }
  };

  const startEditing = (album) => {
    setEditingAlbumId(album.id);
    setEditTitle(album.album_title);
  };

  const cancelEditing = () => {
    setEditingAlbumId(null);
    setEditTitle('');
  };

  return (
    <div className="album-selector">
      <div className="selector-header">
        <h3 className="text-lg font-semibold text-gray-800">
          📚 Mes Albums
        </h3>
        <button
          onClick={() => setIsCreating(true)}
          className="btn-create-album"
          title="Créer un nouvel album"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Nouvel Album</span>
        </button>
      </div>

      {/* Formulaire de création */}
      {isCreating && (
        <div className="album-form">
          <input
            type="text"
            value={newAlbumTitle}
            onChange={(e) => setNewAlbumTitle(e.target.value)}
            placeholder="Titre de l'album (ex: Vacances 2024)"
            maxLength={100}
            className="album-input"
            autoFocus
            onKeyPress={(e) => e.key === 'Enter' && handleCreateAlbum()}
          />
          <div className="form-actions">
            <button onClick={handleCreateAlbum} className="btn-save-sm">
              Créer
            </button>
            <button onClick={() => {
              setIsCreating(false);
              setNewAlbumTitle('');
            }} className="btn-cancel-sm">
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Liste des albums */}
      <div className="albums-list">
        {albums.length === 0 ? (
          <div className="empty-albums">
            <BookOpen size={40} className="text-gray-300" />
            <p className="text-gray-500 text-sm mt-2">Aucun album</p>
            <p className="text-gray-400 text-xs">
              Créez votre premier album !
            </p>
          </div>
        ) : (
          albums.map((album) => (
            <div
              key={album.id}
              className={`album-item ${currentAlbumId === album.id ? 'active' : ''}`}
            >
              {editingAlbumId === album.id ? (
                // Mode édition
                <div className="album-form">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    maxLength={100}
                    className="album-input"
                    autoFocus
                    onKeyPress={(e) => e.key === 'Enter' && handleRename(album.id)}
                  />
                  <div className="form-actions">
                    <button onClick={() => handleRename(album.id)} className="btn-save-sm">
                      OK
                    </button>
                    <button onClick={cancelEditing} className="btn-cancel-sm">
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                // Mode normal
                <>
                  <div
                    className="album-info"
                    onClick={() => onSelectAlbum(album.id)}
                  >
                    <BookOpen size={16} className="album-icon" />
                    <div className="album-details">
                      <h4 className="album-name">{album.album_title}</h4>
                      <p className="album-meta">
                        {album.page_count || 0} page{(album.page_count || 0) !== 1 ? 's' : ''}
                        {album.updated_at && (
                          <span className="ml-2">
                            • {new Date(album.updated_at).toLocaleDateString('fr-FR')}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="album-actions">
                    <button
                      onClick={() => startEditing(album)}
                      className="action-icon"
                      title="Renommer"
                    >
                      <Edit2 size={14} />
                    </button>
                    {albums.length > 1 && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'album "${album.album_title}" ?`)) {
                            onDeleteAlbum(album.id);
                          }
                        }}
                        className="action-icon delete"
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlbumSelector;
