/**
 * Optimise les URLs d'images Supabase
 * Réduit drastiquement la taille et améliore les performances
 */

export const getOptimizedImageUrl = (url, options = {}) => {
  if (!url) return null;
  
  const {
    width = 800,        // Largeur max
    quality = 75,       // Qualité (75 = bon compromis)
    format = 'webp'     // Format moderne
  } = options;
  
  // Si c'est une URL Supabase Storage
  if (url.includes('supabase.co') && url.includes('storage/v1/object/public')) {
    // Supabase supporte les transformations d'images
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}width=${width}&quality=${quality}&format=${format}`;
  }
  
  return url;
};

// Présets courants
export const IMAGE_PRESETS = {
  thumbnail: { width: 200, quality: 70 },
  card: { width: 400, quality: 75 },
  profile: { width: 600, quality: 80 },
  cover: { width: 1200, quality: 85 },
  gallery: { width: 800, quality: 80 }
};

// Hook personnalisé pour les images optimisées
export const useOptimizedImage = (url, preset = 'card') => {
  const options = IMAGE_PRESETS[preset] || IMAGE_PRESETS.card;
  return getOptimizedImageUrl(url, options);
};
