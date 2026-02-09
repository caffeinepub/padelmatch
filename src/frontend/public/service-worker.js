// PlayPal Service Worker - Production Version
// IMPORTANT: Increment CACHE_VERSION before each production deployment
const CACHE_VERSION = 'v2';
const CACHE_NAME = `playpal-${CACHE_VERSION}`;

// Assets to precache (only stable shell assets)
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
        // Skip waiting to activate immediately
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
        // Delete all caches that don't match current version
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Keep only caches that match our naming pattern (both old and new)
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
        // Claim all clients immediately
        return self.clients.claim();
      })
      .then(() => {
        console.log(`[SW] Version ${CACHE_VERSION} activated and controlling all clients`);
      })
  );
});

// Fetch event - network-first strategy with cache fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Network-first strategy for API calls and dynamic content
  // Cache-first strategy for static assets
  if (url.pathname.startsWith('/api') || url.search.includes('canisterId')) {
    // Network-first for API calls
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Optionally cache successful API responses
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request);
        })
    );
  } else {
    // Cache-first for static assets
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // Not in cache, fetch from network
          return fetch(request)
            .then((response) => {
              // Cache successful responses
              if (response && response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(request, responseClone);
                });
              }
              return response;
            })
            .catch((error) => {
              console.error('[SW] Fetch failed:', error);
              // Return a custom offline page if available
              return caches.match('/index.html');
            });
        })
    );
  }
});

// Message event - handle update notifications
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Received SKIP_WAITING message');
    self.skipWaiting();
  }
});

// Log version on startup
console.log(`[SW] PlayPal Service Worker ${CACHE_VERSION} loaded`);
