import React, { useState } from 'react';

const AlbumViewer = ({
  pages,
  currentPageIndex,
  onPageChange,
  onPhotoDrop,
  onRemovePhoto
}) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState('');
  const [draggedPhoto, setDraggedPhoto] = useState(null);

  const currentPage = pages[currentPageIndex];
  const nextPageIndex = currentPageIndex + 1;
  const hasNextPage = nextPageIndex < pages.length;

  // Navigation
  const handlePrevPage = () => {
    if (currentPageIndex > 0 && !isFlipping) {
      setFlipDirection('backward');
      setIsFlipping(true);
      setTimeout(() => {
        onPageChange(currentPageIndex - 1);
        setIsFlipping(false);
        setFlipDirection('');
      }, 600);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage && !isFlipping) {
      setFlipDirection('forward');
      setIsFlipping(true);
      setTimeout(() => {
        onPageChange(currentPageIndex + 1);
        setIsFlipping(false);
        setFlipDirection('');
      }, 600);
    }
  };

  // Gestion du drag and drop
  const handleDragStart = (e, photoId) => {
    setDraggedPhoto(photoId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, pageId, slotIndex) => {
    e.preventDefault();
    const photoId = e.dataTransfer.getData('photoId') || draggedPhoto;

    if (photoId) {
      onPhotoDrop(photoId, pageId, slotIndex);
    }
    setDraggedPhoto(null);
  };

  // Rendu d'une photo slot
  const renderPhotoSlot = (page, slotIndex) => {
    const photo = page.photos.find(p => p.slotIndex === slotIndex);
    const layoutClass = `photo-slot layout-${page.layout}`;

    return (
      <div
        key={slotIndex}
        className={layoutClass}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, page.id, slotIndex)}
      >
        {photo ? (
          <div className="photo-container">
            <img
              src={photo.url}
              alt={`Photo ${slotIndex + 1}`}
              className="album-photo"
              draggable
              onDragStart={(e) => handleDragStart(e, photo.id)}
            />
            <button
              className="remove-photo-btn"
              onClick={() => onRemovePhoto(page.id, slotIndex)}
              title="Supprimer cette photo"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="empty-slot">
            <span className="text-gray-400">Glissez une photo ici</span>
          </div>
        )}
      </div>
    );
  };

  // Rendu d'une page complète
  const renderPage = (page, isRight = false) => {
    if (!page) return <div className="album-page empty" />;

    const capacity = getLayoutCapacity(page.layout);
    const slots = Array.from({ length: capacity }, (_, i) => i);

    return (
      <div className={`album-page ${isRight ? 'right' : 'left'}`}>
        <div className={`page-content layout-${page.layout}`}>
          {slots.map(slotIndex => renderPhotoSlot(page, slotIndex))}
        </div>
        <div className="page-number">
          {pages.indexOf(page) + 1}
        </div>
      </div>
    );
  };

  const getLayoutCapacity = (layout) => {
    switch (layout) {
      case 'fullPage': return 1;
      case 'twoPerPage': return 2;
      case 'threePerPage': return 3;
      default: return 1;
    }
  };

  return (
    <div className="album-viewer">
      {/* Contrôles de navigation */}
      <div className="album-controls">
        <button
          onClick={handlePrevPage}
          disabled={currentPageIndex === 0 || isFlipping}
          className="nav-btn prev-btn"
          title="Page précédente"
        >
          ← Précédent
        </button>

        <span className="page-indicator">
          Page {currentPageIndex + 1} sur {pages.length}
        </span>

        <button
          onClick={handleNextPage}
          disabled={!hasNextPage || isFlipping}
          className="nav-btn next-btn"
          title="Page suivante"
        >
          Suivant →
        </button>
      </div>

      {/* Livre ouvert avec effet de page tournante */}
      <div className={`album-book ${isFlipping ? 'flipping' : ''} ${flipDirection}`}>
        <div className="book-spine"></div>

        {/* Page de gauche */}
        <div className="book-left">
          {renderPage(currentPage, false)}
        </div>

        {/* Page de droite */}
        <div className="book-right">
          {hasNextPage ? renderPage(pages[nextPageIndex], true) : (
            <div className="album-page right empty">
              <div className="end-message">Fin de l'album</div>
            </div>
          )}
        </div>

        {/* Page qui se tourne (animation) */}
        {isFlipping && (
          <div className={`turning-page ${flipDirection}`}>
            {flipDirection === 'forward' ? renderPage(currentPage) : renderPage(pages[nextPageIndex])}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="album-instructions">
        <p>💡 Glissez-déposez des photos depuis le panneau latéral ou utilisez le bouton "Remplissage Aléatoire"</p>
      </div>
    </div>
  );
};

export default AlbumViewer;
