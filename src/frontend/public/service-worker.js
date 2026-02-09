// PlayPal Service Worker - Draft 13 Version
const CACHE_VERSION = 'v13';
const CACHE_NAME = `playpal-${CACHE_VERSION}`;

// Assets to precache
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/generated/playpal-logo.dim_512x512.png',
  '/assets/generated/playpal-logo.dim_192x192.png',
  '/assets/generated/playpal-logo.dim_180x180.png'
];

// Install event - precache shell assets
self.addEventListener('install', (event) => {
  console.log(`[SW] Installing version ${CACHE_VERSION}`);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching shell assets');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Precache failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log(`[SW] Activating version ${CACHE_VERSION}`);
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              const isPlayPalCache = cacheName.startsWith('playpal-');
              const isPadelMatchCache = cacheName.startsWith('padelmatch-');
              const isCurrentVersion = cacheName === CACHE_NAME;
              return (isPlayPalCache || isPadelMatchCache) && !isCurrentVersion;
            })
            .map((cacheName) => {
              console.log(`[SW] Deleting old cache: ${cacheName}`);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
      .then(() => {
        console.log(`[SW] Version ${CACHE_VERSION} activated`);
      })
  );
});

// Fetch event - network-first strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') {
    return;
  }

  if (!url.protocol.startsWith('http')) {
    return;
  }

  if (url.pathname.startsWith('/api') || url.search.includes('canisterId')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
  } else {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          return response || fetch(request).then((fetchResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, fetchResponse.clone());
              return fetchResponse;
            });
          });
        })
    );
  }
});
