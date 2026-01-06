// Service Worker pour PWA et cache optimisé
const CACHE_NAME = 'doogybook-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // Ajouter les assets critiques ici
];

// Installation du service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Stratégie de cache : Network First pour les API, Cache First pour les assets
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Stratégie différente selon le type de requête
  if (url.origin === location.origin) {
    // Requêtes same-origin : Cache First
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request);
      })
    );
  } else if (url.hostname.includes('supabase') || url.pathname.includes('/api/')) {
    // API : Network First
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request);
      })
    );
  } else if (request.url.includes('fonts.googleapis.com') || request.url.includes('fonts.gstatic.com')) {
    // Fonts : Cache First avec longue durée
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request).then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, response.clone());
            return response;
          });
        });
      })
    );
  } else {
    // Autres ressources externes : Stale While Revalidate
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((response) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
          return response || fetchPromise;
        });
      })
    );
  }
});
