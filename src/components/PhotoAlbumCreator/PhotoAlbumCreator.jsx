import React, { useState, useCallback } from 'react';
import AlbumViewer from './AlbumViewer';
import PhotoSidebar from './PhotoSidebar';
import ConfigPanel from './ConfigPanel';
import PageThumbnails from './PageThumbnails';
import { generateAlbumPDF, previewAlbumData } from '../../utils/albumPdfGenerator';
import './PhotoAlbumCreator.css';

const PhotoAlbumCreator = () => {
  // État principal de l'album
  const [albumData, setAlbumData] = useState({
    pages: [
      { id: 'page-1', layout: 'fullPage', photos: [] },
      { id: 'page-2', layout: 'fullPage', photos: [] },
      { id: 'page-3', layout: 'fullPage', photos: [] },
      { id: 'page-4', layout: 'fullPage', photos: [] }
    ]
  });

  const [importedPhotos, setImportedPhotos] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedLayout, setSelectedLayout] = useState('fullPage');
  const [showThumbnails, setShowThumbnails] = useState(false);

  // Importation de photos
  const handlePhotoImport = useCallback((files) => {
    const newPhotos = Array.from(files).map((file, index) => ({
      id: `photo-${Date.now()}-${index}`,
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));

    setImportedPhotos(prev => [...prev, ...newPhotos]);
  }, []);

  // Remplissage aléatoire
  const handleRandomFill = useCallback(() => {
    if (importedPhotos.length === 0) {
      alert('Veuillez d\'abord importer des photos');
      return;
    }

    const shuffled = [...importedPhotos].sort(() => Math.random() - 0.5);
    const newPages = [...albumData.pages];
    let photoIndex = 0;

    newPages.forEach(page => {
      const capacity = getLayoutCapacity(page.layout);
      const photosForPage = [];

      for (let i = 0; i < capacity && photoIndex < shuffled.length; i++) {
        photosForPage.push({
          id: shuffled[photoIndex].id,
          url: shuffled[photoIndex].url,
          slotIndex: i
        });
        photoIndex++;
      }

      page.photos = photosForPage;
    });

    setAlbumData({ pages: newPages });
  }, [importedPhotos, albumData.pages]);

  // Obtenir la capacité d'une mise en page
  const getLayoutCapacity = (layout) => {
    switch (layout) {
      case 'fullPage': return 1;
      case 'twoPerPage': return 2;
      case 'threePerPage': return 3;
      default: return 1;
    }
  };

  // Glisser-déposer manuel
  const handlePhotoDrop = useCallback((photoId, pageId, slotIndex) => {
    const photo = importedPhotos.find(p => p.id === photoId);
    if (!photo) return;

    const newPages = albumData.pages.map(page => {
      if (page.id === pageId) {
        const capacity = getLayoutCapacity(page.layout);
        if (slotIndex < capacity) {
          const existingPhotoIndex = page.photos.findIndex(p => p.slotIndex === slotIndex);
          const newPhotos = [...page.photos];

          if (existingPhotoIndex >= 0) {
            newPhotos[existingPhotoIndex] = { id: photo.id, url: photo.url, slotIndex };
          } else {
            newPhotos.push({ id: photo.id, url: photo.url, slotIndex });
          }

          return { ...page, photos: newPhotos };
        }
      }
      return page;
    });

    setAlbumData({ pages: newPages });
  }, [importedPhotos, albumData.pages]);

  // Changer la mise en page d'une page
  const handleLayoutChange = useCallback((pageId, newLayout) => {
    const newPages = albumData.pages.map(page => {
      if (page.id === pageId) {
        const newCapacity = getLayoutCapacity(newLayout);
        const trimmedPhotos = page.photos.slice(0, newCapacity).map((photo, index) => ({
          ...photo,
          slotIndex: index
        }));
        return { ...page, layout: newLayout, photos: trimmedPhotos };
      }
      return page;
    });

    setAlbumData({ pages: newPages });
  }, [albumData.pages]);

  // Ajouter une page
  const handleAddPage = useCallback(() => {
    const newPage = {
      id: `page-${Date.now()}`,
      layout: selectedLayout,
      photos: []
    };

    setAlbumData(prev => ({
      pages: [...prev.pages, newPage]
    }));
  }, [selectedLayout]);

  // Dupliquer une page
  const handleDuplicatePage = useCallback((pageId) => {
    const pageIndex = albumData.pages.findIndex(p => p.id === pageId);
    if (pageIndex === -1) return;

    const pageToDuplicate = albumData.pages[pageIndex];
    const newPage = {
      ...pageToDuplicate,
      id: `page-${Date.now()}`,
      photos: [...pageToDuplicate.photos]
    };

    const newPages = [...albumData.pages];
    newPages.splice(pageIndex + 1, 0, newPage);

    setAlbumData({ pages: newPages });
  }, [albumData.pages]);

  // Supprimer une page
  const handleDeletePage = useCallback((pageId) => {
    if (albumData.pages.length <= 1) {
      alert('L\'album doit contenir au moins une page');
      return;
    }

    const newPages = albumData.pages.filter(p => p.id !== pageId);
    setAlbumData({ pages: newPages });

    if (currentPageIndex >= newPages.length) {
      setCurrentPageIndex(newPages.length - 1);
    }
  }, [albumData.pages, currentPageIndex]);

  // Réorganiser les pages
  const handleReorderPages = useCallback((fromIndex, toIndex) => {
    const newPages = [...albumData.pages];
    const [movedPage] = newPages.splice(fromIndex, 1);
    newPages.splice(toIndex, 0, movedPage);

    setAlbumData({ pages: newPages });
  }, [albumData.pages]);

  // Générer et télécharger le PDF
  const handleGeneratePDF = useCallback(async () => {
    if (albumData.pages.every(page => page.photos.length === 0)) {
      alert('Veuillez ajouter au moins une photo à votre album avant de générer le PDF.');
      return;
    }

    // Afficher un message de chargement
    const loadingMessage = document.createElement('div');
    loadingMessage.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(102, 126, 234, 0.95);
      color: white;
      padding: 2rem 3rem;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      z-index: 10000;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    `;
    loadingMessage.textContent = '📄 Génération du PDF en cours...';
    document.body.appendChild(loadingMessage);

    try {
      // Générer le PDF
      const result = await generateAlbumPDF(albumData, 'mon-album-photo.pdf');

      // Retirer le message de chargement
      document.body.removeChild(loadingMessage);

      if (result.success) {
        alert('✅ PDF téléchargé avec succès!');
        // Afficher aussi les données dans la console pour référence
        previewAlbumData(albumData);
      } else {
        alert('❌ ' + result.message);
      }
    } catch (error) {
      document.body.removeChild(loadingMessage);
      alert('❌ Erreur lors de la génération du PDF: ' + error.message);
      console.error('Erreur PDF:', error);
    }
  }, [albumData]);

  // Supprimer une photo d'une page
  const handleRemovePhotoFromPage = useCallback((pageId, photoSlotIndex) => {
    const newPages = albumData.pages.map(page => {
      if (page.id === pageId) {
        return {
          ...page,
          photos: page.photos.filter(p => p.slotIndex !== photoSlotIndex)
        };
      }
      return page;
    });

    setAlbumData({ pages: newPages });
  }, [albumData.pages]);

  return (
    <div className="photo-album-creator">
      {/* En-tête */}
      <div className="album-header">
        <h1 className="text-3xl font-bold text-gray-800">
          Créateur d'Album Photo Premium
        </h1>
        <div className="header-actions">
          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className="btn-secondary"
          >
            {showThumbnails ? 'Masquer' : 'Afficher'} les miniatures
          </button>
          <button
            onClick={handleGeneratePDF}
            className="btn-primary"
          >
            📄 Télécharger en PDF
          </button>
        </div>
      </div>

      {/* Zone principale */}
      <div className="album-main-content">
        {/* Panneau latéral gauche - Photos importées */}
        <PhotoSidebar
          photos={importedPhotos}
          onPhotoImport={handlePhotoImport}
          onRandomFill={handleRandomFill}
        />

        {/* Zone centrale - Visualisation de l'album */}
        <div className="album-center">
          <AlbumViewer
            pages={albumData.pages}
            currentPageIndex={currentPageIndex}
            onPageChange={setCurrentPageIndex}
            onPhotoDrop={handlePhotoDrop}
            onRemovePhoto={handleRemovePhotoFromPage}
          />

          {/* Miniatures de pages */}
          {showThumbnails && (
            <PageThumbnails
              pages={albumData.pages}
              currentPageIndex={currentPageIndex}
              onPageSelect={setCurrentPageIndex}
              onReorder={handleReorderPages}
              onDuplicate={handleDuplicatePage}
              onDelete={handleDeletePage}
            />
          )}
        </div>

        {/* Panneau de configuration à droite */}
        <ConfigPanel
          currentPage={albumData.pages[currentPageIndex]}
          selectedLayout={selectedLayout}
          onLayoutChange={(layout) => {
            setSelectedLayout(layout);
            handleLayoutChange(albumData.pages[currentPageIndex].id, layout);
          }}
          onAddPage={handleAddPage}
        />
      </div>
    </div>
  );
};

export default PhotoAlbumCreator;
