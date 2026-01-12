/**
 * 🎨 Image Optimizer pour Supabase Storage
 * Réduit drastiquement la taille des images et améliore les performances
 */

export const getOptimizedImageUrl = (url, options = {}) => {
  if (!url) return null;
  
  const {
    width = 800,
    quality = 75,
    format = 'webp'
  } = options;
  
  // Si c'est une URL Supabase Storage
  if (url.includes('supabase.co') && url.includes('storage/v1/object/public')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}width=${width}&quality=${quality}&format=${format}`;
  }
  
  return url;
};

// Présets d'optimisation pour différents cas d'usage
export const IMAGE_PRESETS = {
  thumbnail: { width: 200, quality: 70 },    // Miniatures (listes, grids)
  card: { width: 400, quality: 75 },         // Cartes de chiens
  profile: { width: 600, quality: 80 },      // Photos de profil
  cover: { width: 1200, quality: 85 },       // Photos de couverture
  gallery: { width: 800, quality: 80 },      // Galeries photos
  hero: { width: 1920, quality: 90 }         // Images hero/bannières
};

// Hook personnalisé pour les images optimisées
export const useOptimizedImage = (url, preset = 'card') => {
  const options = IMAGE_PRESETS[preset] || IMAGE_PRESETS.card;
  return getOptimizedImageUrl(url, options);
};
