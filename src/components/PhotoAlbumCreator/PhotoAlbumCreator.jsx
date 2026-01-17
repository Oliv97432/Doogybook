import React, { useState, useCallback, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AlbumViewer from './AlbumViewer';
import PhotoSidebar from './PhotoSidebar';
import ConfigPanel from './ConfigPanel';
import PageThumbnails from './PageThumbnails';
import { generateAlbumPDF, previewAlbumData } from '../../utils/albumPdfGenerator';
import './PhotoAlbumCreator.css';

const PhotoAlbumCreator = () => {
  // Sélection du chien
  const [userDogs, setUserDogs] = useState([]);
  const [selectedDogId, setSelectedDogId] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Charger les chiens de l'utilisateur
  useEffect(() => {
    const fetchUserDogs = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: dogs, error } = await supabase
          .from('dogs')
          .select('id, name, breed, photo_url')
          .eq('user_id', user.id)
          .order('name');

        if (error) throw error;
        setUserDogs(dogs || []);

        // Sélectionner automatiquement le premier chien s'il y en a un seul
        if (dogs && dogs.length === 1) {
          setSelectedDogId(dogs[0].id);
        }
      } catch (error) {
        console.error('Erreur chargement chiens:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDogs();
  }, []);

  // Charger les photos du chien sélectionné
  useEffect(() => {
    const fetchDogPhotos = async () => {
      if (!selectedDogId) {
        setImportedPhotos([]);
        return;
      }

      try {
        const { data: photos, error } = await supabase
          .from('dog_photos')
          .select('id, photo_url, created_at')
          .eq('dog_id', selectedDogId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedPhotos = (photos || []).map((photo, index) => ({
          id: photo.id,
          url: photo.photo_url,
          name: `Photo ${index + 1}`
        }));

        setImportedPhotos(formattedPhotos);
      } catch (error) {
        console.error('Erreur chargement photos:', error);
      }
    };

    fetchDogPhotos();
  }, [selectedDogId]);

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

  // Écran de chargement
  if (loading) {
    return (
      <div className="photo-album-creator">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  // Écran de sélection du chien
  if (!selectedDogId) {
    return (
      <div className="photo-album-creator">
        <div className="album-header">
          <h1 className="text-3xl font-bold text-gray-800">
            Créateur d'Album Photo Premium
          </h1>
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="max-w-2xl w-full p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">📸</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Sélectionnez un chien pour créer son album
              </h2>
              <p className="text-gray-600">
                Choisissez le chien dont vous souhaitez utiliser les photos pour créer un album PDF
              </p>
            </div>

            {userDogs.length === 0 ? (
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-4">
                  Vous n'avez pas encore de chien enregistré.
                </p>
                <a
                  href="/dog-profile"
                  className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Ajouter un chien
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userDogs.map((dog) => (
                  <button
                    key={dog.id}
                    onClick={() => setSelectedDogId(dog.id)}
                    className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all"
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      {dog.photo_url ? (
                        <img
                          src={dog.photo_url}
                          alt={dog.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          🐕
                        </div>
                      )}
                    </div>
                    <div className="ml-4 text-left">
                      <h3 className="font-semibold text-gray-800">{dog.name}</h3>
                      <p className="text-sm text-gray-600">{dog.breed}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const selectedDog = userDogs.find(d => d.id === selectedDogId);

  return (
    <div className="photo-album-creator">
      {/* En-tête */}
      <div className="album-header">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Album de {selectedDog?.name}
          </h1>
          <button
            onClick={() => setSelectedDogId(null)}
            className="text-sm text-indigo-600 hover:text-indigo-700 mt-1"
          >
            ← Changer de chien
          </button>
        </div>
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
        {/* Panneau latéral gauche - Photos du chien */}
        <PhotoSidebar
          photos={importedPhotos}
          onRandomFill={handleRandomFill}
          dogName={selectedDog?.name}
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
