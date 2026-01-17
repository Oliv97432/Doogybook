import React, { useState } from 'react';

const PageThumbnails = ({
  pages,
  currentPageIndex,
  onPageSelect,
  onReorder,
  onDuplicate,
  onDelete
}) => {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onReorder(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const getLayoutName = (layout) => {
    switch (layout) {
      case 'fullPage': return 'Pleine Page';
      case 'twoPerPage': return '2 par Page';
      case 'threePerPage': return '3 par Page';
      default: return 'Pleine Page';
    }
  };

  return (
    <div className="page-thumbnails">
      <div className="thumbnails-header">
        <h3 className="text-lg font-semibold text-gray-800">Pages de l'Album</h3>
        <span className="page-count-badge">{pages.length} page{pages.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="thumbnails-grid">
        {pages.map((page, index) => (
          <div
            key={page.id}
            className={`page-thumbnail-card ${currentPageIndex === index ? 'active' : ''} ${
              dragOverIndex === index ? 'drag-over' : ''
            }`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            onClick={() => onPageSelect(index)}
          >
            {/* Aperçu de la page */}
            <div className="thumbnail-preview">
              <div className={`preview-layout layout-${page.layout}`}>
                {page.photos.length > 0 ? (
                  page.photos.map((photo, photoIndex) => (
                    <div key={photoIndex} className="preview-photo">
                      <img src={photo.url} alt="" />
                    </div>
                  ))
                ) : (
                  <div className="preview-empty">
                    <span className="text-gray-400 text-xs">Vide</span>
                  </div>
                )}
              </div>
            </div>

            {/* Informations */}
            <div className="thumbnail-info">
              <div className="info-header">
                <span className="page-number">Page {index + 1}</span>
                <span className="layout-badge">{getLayoutName(page.layout)}</span>
              </div>
              <div className="photo-info">
                <span className="text-xs text-gray-600">
                  {page.photos.length} photo{page.photos.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="thumbnail-actions">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(page.id);
                }}
                className="action-icon duplicate"
                title="Dupliquer cette page"
              >
                📋
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Voulez-vous vraiment supprimer cette page ?')) {
                    onDelete(page.id);
                  }
                }}
                className="action-icon delete"
                title="Supprimer cette page"
                disabled={pages.length <= 1}
              >
                🗑️
              </button>
            </div>

            {/* Indicateur de glissement */}
            {draggedIndex === index && (
              <div className="dragging-indicator">
                <span>Déplacement...</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="thumbnails-footer">
        <p className="text-xs text-gray-500">
          💡 Glissez-déposez pour réorganiser les pages
        </p>
      </div>
    </div>
  );
};

export default PageThumbnails;
