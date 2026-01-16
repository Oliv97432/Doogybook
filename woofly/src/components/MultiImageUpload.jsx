import React, { useState, useRef } from 'react';
import Icon from './AppIcon';
import useUpload from '../hooks/useUpload';

/**
 * Composant d'upload d'images multiples
 * Avec preview, drag & drop, et gestion individuelle
 * 
 * @param {Object} props
 * @param {string} props.bucket - Nom du bucket Supabase
 * @param {string} props.folder - Dossier de destination
 * @param {string[]} props.currentImages - URLs des images actuelles (optionnel)
 * @param {Function} props.onUploadComplete - Callback après upload (urls[])
 * @param {number} props.maxFiles - Nombre max de fichiers (défaut: 10)
 * @param {number} props.maxSizeMB - Taille max par fichier en MB (défaut: 5)
 * @param {string} props.label - Label du champ (optionnel)
 * @param {string} props.className - Classes CSS additionnelles (optionnel)
 */
const MultiImageUpload = ({
  bucket = 'health-notes-photos',
  folder,
  currentImages = [],
  onUploadComplete,
  maxFiles = 10,
  maxSizeMB = 5,
  label = 'Photos',
  className = ''
}) => {
  const fileInputRef = useRef(null);
  const [images, setImages] = useState(currentImages);
  const [isDragging, setIsDragging] = useState(false);

  const { uploadMultiple, uploading, progress, error, reset } = useUpload({
    bucket,
    maxSizeMB
  });

  /**
   * Gérer la sélection de fichiers multiples
   */
  const handleFilesSelect = async (files) => {
    if (!files || files.length === 0) return;

    // Vérifier le nombre max
    const remainingSlots = maxFiles - images.length;
    if (files.length > remainingSlots) {
      alert(`Vous ne pouvez ajouter que ${remainingSlots} photo(s) supplémentaire(s)`);
      return;
    }

    // Créer des previews locaux
    const previews = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result);
        if (previews.length === files.length) {
          setImages([...images, ...previews]);
        }
      };
      reader.readAsDataURL(file);
    }

    // Upload vers Supabase
    try {
      const urls = await uploadMultiple(Array.from(files), folder);
      const updatedImages = [...images, ...urls];
      setImages(updatedImages);
      
      if (onUploadComplete) {
        onUploadComplete(updatedImages);
      }
    } catch (err) {
      console.error('Erreur upload multiple:', err);
      // Remettre les images précédentes en cas d'erreur
      setImages(images);
    }
  };

  /**
   * Gérer le changement via input file
   */
  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFilesSelect(files);
    }
  };

  /**
   * Gérer le drag & drop
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFilesSelect(files);
    }
  };

  /**
   * Ouvrir le sélecteur de fichier
   */
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  /**
   * Supprimer une image spécifique
   */
  const handleRemove = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    
    if (onUploadComplete) {
      onUploadComplete(updatedImages);
    }
  };

  /**
   * Supprimer toutes les images
   */
  const handleClearAll = () => {
    setImages([]);
    if (onUploadComplete) {
      onUploadComplete([]);
    }
    reset();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header avec label et actions */}
      <div className="flex items-center justify-between">
        {label && (
          <label className="block text-sm font-medium text-foreground">
            {label} ({images.length}/{maxFiles})
          </label>
        )}
        
        {images.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            disabled={uploading}
            className="text-sm text-red-500 hover:text-red-700 font-medium"
          >
            Tout supprimer
          </button>
        )}
      </div>

      {/* Zone d'upload */}
      {images.length < maxFiles && (
        <div
          className={`border-2 border-dashed rounded-lg transition-all ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <button
            type="button"
            onClick={openFileDialog}
            disabled={uploading}
            className="w-full p-8 flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-foreground transition-smooth"
          >
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Icon name="Upload" size={24} />
            </div>
            <div className="text-center">
              <p className="font-medium">
                {uploading ? 'Upload en cours...' : 'Ajouter des photos'}
              </p>
              <p className="text-sm">
                {uploading
                  ? `${progress}%`
                  : `Cliquez ou glissez (max ${maxFiles} photos, ${maxSizeMB}MB chacune)`}
              </p>
            </div>
          </button>

          {/* Input file caché */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            multiple
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      )}

      {/* Progress bar globale */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Upload en cours...</span>
            <span className="font-medium text-primary">{progress}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <Icon name="AlertCircle" size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">Erreur d'upload</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Grille des images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden bg-muted"
            >
              <img
                src={image}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay avec bouton supprimer */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  disabled={uploading}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-smooth"
                >
                  <Icon name="Trash2" size={20} />
                </button>
              </div>

              {/* Numéro de la photo */}
              <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded-full">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message si limite atteinte */}
      {images.length >= maxFiles && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <Icon name="Info" size={20} className="text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-900">
            Limite de {maxFiles} photos atteinte. Supprimez des photos pour en ajouter de nouvelles.
          </p>
        </div>
      )}
    </div>
  );
};

export default MultiImageUpload;
