import React, { useState, useRef, useEffect } from 'react';
import Icon from './AppIcon';

/**
 * Composant pour capturer des photos directement depuis la caméra de l'appareil
 * Fonctionne sur mobile et desktop
 */
const CameraCapture = ({ onCapture, onClose, aspectRatio = 1 }) => {
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    startCamera();
    checkMultipleCameras();

    return () => {
      stopCamera();
    };
  }, [isFrontCamera]);

  /**
   * Vérifier s'il y a plusieurs caméras disponibles
   */
  const checkMultipleCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setHasMultipleCameras(videoDevices.length > 1);
    } catch (err) {
      console.error('Erreur énumération devices:', err);
    }
  };

  /**
   * Démarrer la caméra
   */
  const startCamera = async () => {
    try {
      setError(null);

      // Arrêter le stream précédent si existe
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: {
          facingMode: isFrontCamera ? 'user' : 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Erreur accès caméra:', err);
      setError(
        err.name === 'NotAllowedError'
          ? 'Accès à la caméra refusé. Veuillez autoriser l\'accès dans les paramètres de votre navigateur.'
          : err.name === 'NotFoundError'
          ? 'Aucune caméra trouvée sur cet appareil.'
          : 'Erreur lors de l\'accès à la caméra. Veuillez réessayer.'
      );
    }
  };

  /**
   * Arrêter la caméra
   */
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  /**
   * Basculer entre caméra avant/arrière
   */
  const toggleCamera = () => {
    setIsFrontCamera(!isFrontCamera);
  };

  /**
   * Capturer une photo
   */
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Définir les dimensions du canvas
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    // Calculer les dimensions avec aspect ratio
    let width, height, x, y;

    if (aspectRatio) {
      const videoAspectRatio = videoWidth / videoHeight;

      if (videoAspectRatio > aspectRatio) {
        // Vidéo plus large que l'aspect ratio souhaité
        height = videoHeight;
        width = height * aspectRatio;
        x = (videoWidth - width) / 2;
        y = 0;
      } else {
        // Vidéo plus haute que l'aspect ratio souhaité
        width = videoWidth;
        height = width / aspectRatio;
        x = 0;
        y = (videoHeight - height) / 2;
      }
    } else {
      width = videoWidth;
      height = videoHeight;
      x = 0;
      y = 0;
    }

    canvas.width = width;
    canvas.height = height;

    // Dessiner l'image capturée
    context.drawImage(video, x, y, width, height, 0, 0, width, height);

    // Convertir en data URL
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageDataUrl);
  };

  /**
   * Confirmer et retourner la photo
   */
  const confirmPhoto = () => {
    if (capturedImage) {
      // Convertir data URL en File
      fetch(capturedImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `photo_${Date.now()}.jpg`, {
            type: 'image/jpeg'
          });
          onCapture(file);
          stopCamera();
          onClose();
        })
        .catch(err => {
          console.error('Erreur conversion image:', err);
          setError('Erreur lors de la sauvegarde de la photo');
        });
    }
  };

  /**
   * Reprendre une nouvelle photo
   */
  const retakePhoto = () => {
    setCapturedImage(null);
  };

  /**
   * Fermer et annuler
   */
  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm p-4 flex items-center justify-between">
        <button
          onClick={handleClose}
          className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <Icon name="X" size={24} />
        </button>

        <h2 className="text-white font-semibold text-lg">Prendre une photo</h2>

        {hasMultipleCameras && !capturedImage && (
          <button
            onClick={toggleCamera}
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Icon name="SwitchCamera" size={24} />
          </button>
        )}

        {!hasMultipleCameras && <div className="w-10" />}
      </div>

      {/* Zone de capture */}
      <div className="flex-1 relative overflow-hidden bg-black">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="bg-red-500/20 border border-red-500 rounded-xl p-6 max-w-md">
              <div className="flex items-start gap-3 text-white">
                <Icon name="AlertCircle" size={24} className="flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Erreur d'accès à la caméra</h3>
                  <p className="text-sm opacity-90">{error}</p>
                </div>
              </div>
            </div>
          </div>
        ) : capturedImage ? (
          <img
            src={capturedImage}
            alt="Photo capturée"
            className="w-full h-full object-contain"
          />
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Grille de composition (règle des tiers) */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border border-white/20" />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Canvas caché pour la capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Footer avec boutons */}
      <div className="bg-black/50 backdrop-blur-sm p-6">
        {capturedImage ? (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={retakePhoto}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors"
            >
              <Icon name="RotateCcw" size={20} />
              Reprendre
            </button>
            <button
              onClick={confirmPhoto}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
            >
              <Icon name="Check" size={20} />
              Confirmer
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <button
              onClick={capturePhoto}
              disabled={!!error}
              className="w-16 h-16 rounded-full bg-white border-4 border-gray-300 hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              <span className="sr-only">Capturer</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
