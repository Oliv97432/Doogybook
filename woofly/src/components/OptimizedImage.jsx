import React, { useState, useEffect, useRef } from 'react';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';

/**
 * 🖼️ Composant Image Optimisé
 * - Lazy loading natif
 * - Placeholder pendant chargement
 * - Intersection Observer
 * - Gestion erreurs
 * - Support WebP
 */
const OptimizedImage = ({ 
  src, 
  alt, 
  className = '',
  width = 800,
  quality = 75,
  placeholder = true,
  eager = false,
  onLoad,
  onError,
  ...props 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isVisible, setIsVisible] = useState(eager);
  const imgRef = useRef(null);

  // Intersection Observer pour lazy loading
  useEffect(() => {
    if (eager || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Commence à charger 50px avant d'être visible
        threshold: 0.01
      }
    );

    observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [eager]);

  const handleLoad = (e) => {
    setImageLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setImageError(true);
    console.error('Erreur chargement image:', src);
    onError?.(e);
  };

  const optimizedSrc = getOptimizedImageUrl(src, { width, quality });

  return (
    <div ref={imgRef} className={`relative w-full h-full ${className}`}>
      {/* Placeholder pendant chargement */}
      {placeholder && !imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {/* Image principale */}
      {isVisible && !imageError && (
        <img
          src={optimizedSrc}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      )}

      {/* Fallback en cas d'erreur */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
          <div className="text-center">
            <span className="text-4xl font-bold text-primary/30">
              {alt?.charAt(0)?.toUpperCase() || '🐕'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
