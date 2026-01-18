import React, { useState, useCallback, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AlbumViewer from './AlbumViewer';
import PhotoSidebar from './PhotoSidebar';
import ConfigPanel from './ConfigPanel';
import PageThumbnails from './PageThumbnails';
import AlbumSelector from './AlbumSelector';
import { generateAlbumPDF, previewAlbumData } from '../../utils/albumPdfGenerator';
import { Save, Download, AlertCircle, Check } from 'lucide-react';
import './PhotoAlbumCreator.css';

const PhotoAlbumCreator = () => {
  // Sélection du chien
  const [userDogs, setUserDogs] = useState([]);
  const [selectedDogId, setSelectedDogId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Gestion des albums multiples
  const [albums, setAlbums] = useState([]);
  const [currentAlbumId, setCurrentAlbumId] = useState(null);
  const [albumTitle, setAlbumTitle] = useState('Mon Album');

  // État principal de l'album
  const [albumData, setAlbumData] = useState({
    pages: [
      { id: 'page-1', layout: 'fullPage', photos: [] },
      { id: 'page-2', layout: 'fullPage', photos: [] }
    ]
  });

  const MAX_PAGES = 10; // Limite maximale de pages

  const [importedPhotos, setImportedPhotos] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedLayout, setSelectedLayout] = useState('fullPage');
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null); // Pour le mode clic sur mobile

  // États pour la sauvegarde
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [showSaveWarning, setShowSaveWarning] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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

  // Charger la liste des albums quand un chien est sélectionné
  useEffect(() => {
    const fetchAlbums = async () => {
      if (!selectedDogId) {
        setAlbums([]);
        setCurrentAlbumId(null);
        setAlbumTitle('Mon Album');
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: albumsList, error } = await supabase
          .from('dog_albums')
          .select('id, album_title, album_data, created_at, updated_at')
          .eq('dog_id', selectedDogId)
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (error) throw error;

        if (!albumsList || albumsList.length === 0) {
          // Créer automatiquement un premier album
          await handleCreateAlbum('Mon Album');
        } else {
          // Ajouter le nombre de pages à chaque album
          const albumsWithPageCount = albumsList.map(album => ({
            ...album,
            page_count: album.album_data?.pages?.length || 0
          }));
          setAlbums(albumsWithPageCount);
          // Sélectionner le premier album par défaut
          const firstAlbum = albumsWithPageCount[0];
          setCurrentAlbumId(firstAlbum.id);
          setAlbumTitle(firstAlbum.album_title);
        }
      } catch (error) {
        console.error('Erreur chargement albums:', error);
      }
    };

    fetchAlbums();
  }, [selectedDogId]);

  // Créer un nouvel album
  const handleCreateAlbum = async (title) => {
    if (!selectedDogId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non connecté');

      const newAlbumData = {
        pages: [
          { id: 'page-1', layout: 'fullPage', photos: [] },
          { id: 'page-2', layout: 'fullPage', photos: [] }
        ]
      };

      const { data, error } = await supabase
        .from('dog_albums')
        .insert({
          dog_id: selectedDogId,
          user_id: user.id,
          album_title: title,
          album_data: newAlbumData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setAlbums(prev => [...prev, data]);
      setCurrentAlbumId(data.id);
      setAlbumTitle(data.album_title);
      setAlbumData(newAlbumData);
      setHasUnsavedChanges(false);
      showNotification('✅ Nouvel album créé!', 'success');
    } catch (error) {
      console.error('Erreur création album:', error);
      showNotification('❌ Erreur lors de la création de l\'album', 'error');
    }
  };

  // Renommer un album
  const handleRenameAlbum = async (albumId, newTitle) => {
    try {
      const { error } = await supabase
        .from('dog_albums')
        .update({
          album_title: newTitle,
          updated_at: new Date().toISOString()
        })
        .eq('id', albumId);

      if (error) throw error;

      setAlbums(prev => prev.map(album =>
        album.id === albumId ? { ...album, album_title: newTitle } : album
      ));

      if (currentAlbumId === albumId) {
        setAlbumTitle(newTitle);
      }

      showNotification('✅ Album renommé!', 'success');
    } catch (error) {
      console.error('Erreur renommage album:', error);
      showNotification('❌ Erreur lors du renommage', 'error');
    }
  };

  // Supprimer un album
  const handleDeleteAlbum = async (albumId) => {
    if (albums.length <= 1) {
      showNotification('⚠️ Vous devez avoir au moins un album', 'error');
      return;
    }

    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet album ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('dog_albums')
        .delete()
        .eq('id', albumId);

      if (error) throw error;

      const updatedAlbums = albums.filter(album => album.id !== albumId);
      setAlbums(updatedAlbums);

      // Si l'album supprimé était sélectionné, sélectionner le premier album restant
      if (currentAlbumId === albumId && updatedAlbums.length > 0) {
        const firstAlbum = updatedAlbums[0];
        setCurrentAlbumId(firstAlbum.id);
        setAlbumTitle(firstAlbum.album_title);
        await handleLoadAlbumById(firstAlbum.id);
      }

      showNotification('✅ Album supprimé!', 'success');
    } catch (error) {
      console.error('Erreur suppression album:', error);
      showNotification('❌ Erreur lors de la suppression', 'error');
    }
  };

  // Sélectionner un album
  const handleSelectAlbum = async (albumId) => {
    const album = albums.find(a => a.id === albumId);
    if (!album) return;

    setCurrentAlbumId(albumId);
    setAlbumTitle(album.album_title);
    await handleLoadAlbumById(albumId);
  };

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
            newPhotos[existingPhotoIndex] = {
              id: photo.id,
              url: photo.url,
              slotIndex,
              title: '',
              caption: '',
              fontFamily: 'Arial',
              fontSize: 14,
              textColor: '#000000'
            };
          } else {
            newPhotos.push({
              id: photo.id,
              url: photo.url,
              slotIndex,
              title: '',
              caption: '',
              fontFamily: 'Arial',
              fontSize: 14,
              textColor: '#000000'
            });
          }

          return { ...page, photos: newPhotos };
        }
      }
      return page;
    });

    setAlbumData({ pages: newPages });
    setHasUnsavedChanges(true);
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
    setHasUnsavedChanges(true);
  }, [albumData.pages]);

  // Ajouter une page
  const handleAddPage = useCallback(() => {
    if (albumData.pages.length >= MAX_PAGES) {
      showNotification(`⚠️ Limite de ${MAX_PAGES} pages atteinte`, 'error');
      return;
    }

    const newPage = {
      id: `page-${Date.now()}`,
      layout: selectedLayout,
      photos: []
    };

    setAlbumData(prev => ({
      pages: [...prev.pages, newPage]
    }));
    setHasUnsavedChanges(true);
  }, [selectedLayout, albumData.pages.length]);

  // Dupliquer une page
  const handleDuplicatePage = useCallback((pageId) => {
    if (albumData.pages.length >= MAX_PAGES) {
      showNotification(`⚠️ Impossible de dupliquer: limite de ${MAX_PAGES} pages atteinte`, 'error');
      return;
    }

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
    setHasUnsavedChanges(true);
  }, [albumData.pages]);

  // Supprimer une page
  const handleDeletePage = useCallback((pageId) => {
    if (albumData.pages.length <= 1) {
      alert('L\'album doit contenir au moins une page');
      return;
    }

    const newPages = albumData.pages.filter(p => p.id !== pageId);
    setAlbumData({ pages: newPages });
    setHasUnsavedChanges(true);

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
    setHasUnsavedChanges(true);
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
    setHasUnsavedChanges(true);
  }, [albumData.pages]);

  // Mettre à jour les textes d'une photo
  const handleUpdatePhotoText = useCallback((pageId, photoSlotIndex, updates) => {
    const newPages = albumData.pages.map(page => {
      if (page.id === pageId) {
        const newPhotos = page.photos.map(photo => {
          if (photo.slotIndex === photoSlotIndex) {
            return { ...photo, ...updates };
          }
          return photo;
        });
        return { ...page, photos: newPhotos };
      }
      return page;
    });

    setAlbumData({ pages: newPages });
    setHasUnsavedChanges(true);
  }, [albumData.pages]);

  // Sauvegarder l'album dans Supabase (JSON compressé)
  const handleSaveAlbum = useCallback(async () => {
    if (!selectedDogId || !currentAlbumId) return;

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non connecté');

      // Préparer les données de l'album (seulement les infos essentielles, pas les URLs complètes)
      const albumToSave = {
        pages: albumData.pages.map(page => ({
          id: page.id,
          layout: page.layout,
          photos: page.photos.map(photo => ({
            id: photo.id,
            slotIndex: photo.slotIndex,
            title: photo.title || '',
            caption: photo.caption || '',
            fontFamily: photo.fontFamily || 'Arial',
            fontSize: photo.fontSize || 14,
            textColor: photo.textColor || '#000000'
          }))
        }))
      };

      // Sauvegarder dans Supabase avec l'ID de l'album spécifique
      const { error } = await supabase
        .from('dog_albums')
        .update({
          album_data: albumToSave,
          album_title: albumTitle,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentAlbumId);

      if (error) throw error;

      // Mettre à jour la liste des albums avec le nombre de pages
      setAlbums(prev => prev.map(album =>
        album.id === currentAlbumId
          ? {
              ...album,
              album_title: albumTitle,
              page_count: albumData.pages.length,
              updated_at: new Date().toISOString()
            }
          : album
      ));

      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      setShowSaveWarning(false);

      // Afficher une notification de succès
      showNotification('✅ Album sauvegardé avec succès!', 'success');
    } catch (error) {
      console.error('Erreur sauvegarde album:', error);
      showNotification('❌ Erreur lors de la sauvegarde', 'error');
    } finally {
      setIsSaving(false);
    }
  }, [selectedDogId, currentAlbumId, albumData, albumTitle]);

  // Charger un album sauvegardé par ID
  const handleLoadAlbumById = useCallback(async (albumId) => {
    if (!albumId) return;

    try {
      const { data, error } = await supabase
        .from('dog_albums')
        .select('album_data, album_title, updated_at')
        .eq('id', albumId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data && data.album_data) {
        // Reconstituer l'album avec les URLs des photos
        const loadedPages = data.album_data.pages.map(page => ({
          ...page,
          photos: page.photos.map(photoData => {
            const originalPhoto = importedPhotos.find(p => p.id === photoData.id);
            return {
              ...photoData,
              url: originalPhoto?.url || ''
            };
          }).filter(p => p.url) // Garder seulement les photos qui existent encore
        }));

        setAlbumData({ pages: loadedPages });
        setAlbumTitle(data.album_title);
        setLastSaved(new Date(data.updated_at));
        setHasUnsavedChanges(false);
        showNotification('✅ Album chargé avec succès!', 'success');
      }
    } catch (error) {
      console.error('Erreur chargement album:', error);
    }
  }, [importedPhotos]);

  // Charger l'album au démarrage quand un album est sélectionné
  useEffect(() => {
    if (currentAlbumId && importedPhotos.length > 0) {
      handleLoadAlbumById(currentAlbumId);
    }
  }, [currentAlbumId, importedPhotos.length, handleLoadAlbumById]);

  // Sauvegarde automatique toutes les 2 minutes
  useEffect(() => {
    if (!hasUnsavedChanges || !selectedDogId) return;

    const autoSaveInterval = setInterval(() => {
      handleSaveAlbum();
    }, 120000); // 2 minutes

    return () => clearInterval(autoSaveInterval);
  }, [hasUnsavedChanges, selectedDogId, handleSaveAlbum]);

  // Notification simple
  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      z-index: 10001;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  };

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

          {/* Indicateur de sauvegarde */}
          {lastSaved && (
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
              <Check size={14} className="text-green-500" />
              <span>
                Dernière sauvegarde: {lastSaved.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )}
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2 mt-2 text-xs text-orange-600">
              <AlertCircle size={14} />
              <span>Modifications non sauvegardées</span>
            </div>
          )}
        </div>
        <div className="header-actions">
          <button
            onClick={handleSaveAlbum}
            disabled={isSaving || !hasUnsavedChanges}
            className="btn-secondary flex items-center gap-2"
            title="Sauvegarder l'album"
          >
            <Save size={18} />
            <span className="hidden sm:inline">
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </span>
          </button>
          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className="btn-secondary"
          >
            {showThumbnails ? 'Masquer' : 'Afficher'} les miniatures
          </button>
          <button
            onClick={handleGeneratePDF}
            className="btn-primary flex items-center gap-2"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Télécharger PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>
      </div>

      {/* Sélecteur d'albums */}
      {selectedDogId && (
        <AlbumSelector
          albums={albums}
          currentAlbumId={currentAlbumId}
          onSelectAlbum={handleSelectAlbum}
          onCreateAlbum={handleCreateAlbum}
          onRenameAlbum={handleRenameAlbum}
          onDeleteAlbum={handleDeleteAlbum}
        />
      )}

      {/* Message d'avertissement pour sauvegarder */}
      {showSaveWarning && albumData.pages.some(p => p.photos.length > 0) && (
        <div className="save-warning-banner">
          <div className="warning-content">
            <AlertCircle size={20} className="flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">💡 N'oubliez pas de sauvegarder votre travail !</p>
              <p className="text-sm mt-1">
                Votre album est sauvegardé automatiquement toutes les 2 minutes, mais pensez aussi à le télécharger en PDF
                pour une copie permanente sur votre appareil.
              </p>
            </div>
            <button
              onClick={() => setShowSaveWarning(false)}
              className="text-white hover:text-gray-200 flex-shrink-0"
              title="Masquer ce message"
            >
              ×
            </button>
          </div>
          <div className="warning-actions">
            <button
              onClick={handleSaveAlbum}
              className="warning-btn-primary"
            >
              <Save size={16} />
              Sauvegarder maintenant
            </button>
            <button
              onClick={handleGeneratePDF}
              className="warning-btn-secondary"
            >
              <Download size={16} />
              Télécharger en PDF
            </button>
          </div>
        </div>
      )}

      {/* Zone principale */}
      <div className="album-main-content">
        {/* Panneau latéral gauche - Photos du chien */}
        <PhotoSidebar
          photos={importedPhotos}
          onRandomFill={handleRandomFill}
          dogName={selectedDog?.name}
          selectedPhoto={selectedPhoto}
          onPhotoSelect={setSelectedPhoto}
        />

        {/* Zone centrale - Visualisation de l'album */}
        <div className="album-center">
          <AlbumViewer
            pages={albumData.pages}
            currentPageIndex={currentPageIndex}
            onPageChange={setCurrentPageIndex}
            onPhotoDrop={handlePhotoDrop}
            onRemovePhoto={handleRemovePhotoFromPage}
            selectedPhoto={selectedPhoto}
            onPhotoSelect={setSelectedPhoto}
            onUpdatePhotoText={handleUpdatePhotoText}
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
          currentPageCount={albumData.pages.length}
          maxPages={MAX_PAGES}
        />
      </div>
    </div>
  );
};

export default PhotoAlbumCreator;
