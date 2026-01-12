// Utilitaires pour l'installation PWA

let deferredPrompt = null;

// Écouter l'événement beforeinstallprompt
export const initPWAInstall = () => {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Empêcher l'affichage automatique de la bannière
    e.preventDefault();
    // Stocker l'événement pour l'utiliser plus tard
    deferredPrompt = e;
    // Déclencher un événement personnalisé pour notifier l'app
    window.dispatchEvent(new Event('pwa-install-available'));
  });

  // Écouter l'installation
  window.addEventListener('appinstalled', () => {
    console.log('PWA installée avec succès!');
    deferredPrompt = null;
    // Déclencher un événement personnalisé
    window.dispatchEvent(new Event('pwa-installed'));
  });
};

// Afficher le prompt d'installation
export const promptPWAInstall = async () => {
  if (!deferredPrompt) {
    return false;
  }

  // Afficher le prompt
  deferredPrompt.prompt();

  // Attendre le choix de l'utilisateur
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User response to install prompt: ${outcome}`);

  // Reset le prompt
  deferredPrompt = null;

  return outcome === 'accepted';
};

// Vérifier si l'app est déjà installée
export const isPWAInstalled = () => {
  // Standalone mode (installé)
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }
  // iOS Safari
  if (window.navigator.standalone === true) {
    return true;
  }
  return false;
};

// Vérifier si l'installation est disponible
export const isPWAInstallAvailable = () => {
  return deferredPrompt !== null;
};
