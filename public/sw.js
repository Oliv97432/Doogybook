// Service Worker pour Doogybook PWA - Optimisé pour performances
const CACHE_NAME = 'doogybook-v1.0.3';
const RUNTIME_CACHE = 'doogybook-runtime-v1.0.3';

// Fichiers à mettre en cache lors de l'installation (minimisé pour FCP)
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installation...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Précache des assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
          })
          .map((cacheName) => {
            console.log('[SW] Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Stratégie de cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-GET
  if (request.method !== 'GET') {
    return;
  }

  // Ignorer les requêtes Chrome extensions et autres protocoles
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Stratégie Network First pour Supabase API
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone la réponse
          const responseClone = response.clone();
          // Mise en cache si succès
          if (response.status === 200) {
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback vers le cache en cas d'échec
          return caches.match(request);
        })
    );
    return;
  }

  // Stratégie Cache First pour les assets statiques
  if (
    request.destination === 'image' ||
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        });
      })
    );
    return;
  }

  // Stratégie Network First pour le reste (HTML, navigation)
  event.respondWith(
    fetch(request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Page offline de fallback
          if (request.destination === 'document') {
            return caches.match('/');
          }
        });
      })
  );
});

// Gestion des messages du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ==========================================
// 🔔 WEB PUSH NOTIFICATIONS
// ==========================================

// Écouter les notifications push
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification reçue');

  let notificationData = {
    title: 'Nouvelle notification',
    body: 'Vous avez une nouvelle notification sur Doogybook',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: 'doogybook-notification',
    requireInteraction: false,
    data: {
      url: '/notifications'
    }
  };

  // Si la notification contient des données
  if (event.data) {
    try {
      const payload = event.data.json();
      notificationData = {
        title: payload.title || notificationData.title,
        body: payload.body || notificationData.body,
        icon: payload.icon || notificationData.icon,
        badge: payload.badge || notificationData.badge,
        tag: payload.tag || notificationData.tag,
        requireInteraction: payload.requireInteraction || false,
        data: payload.data || notificationData.data,
        image: payload.image,
        actions: payload.actions || []
      };
    } catch (e) {
      console.error('[SW] Erreur parsing notification:', e);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction,
      data: notificationData.data,
      image: notificationData.image,
      actions: notificationData.actions,
      vibrate: [200, 100, 200]
    })
  );
});

// Gérer les clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification cliquée:', event.notification.tag);
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/notifications';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Chercher une fenêtre déjà ouverte
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus().then(() => {
              // Naviguer vers l'URL de la notification
              return client.postMessage({
                type: 'NOTIFICATION_CLICKED',
                url: urlToOpen
              });
            });
          }
        }
        // Ouvrir une nouvelle fenêtre si aucune n'est ouverte
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Gérer la fermeture des notifications
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification fermée:', event.notification.tag);
});
