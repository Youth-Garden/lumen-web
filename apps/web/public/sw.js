// Lumen Shell Cache Service Worker
// Caches critical app shell for offline support and fast subsequent loads

const CACHE_VERSION = 'v1';
const CACHE_NAME = `lumen-shell-${CACHE_VERSION}`;

// App shell assets to cache immediately on install
const SHELL_ASSETS = [
  '/',
  '/login',
  '/manifest.json',
  '/favicon.ico',
  // Core CSS/JS will be added by Next.js
];

// Install - cache the shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)),
  );
  self.skipWaiting();
});

// Activate - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        }),
      ),
    ),
  );
  self.clients.claim();
});

// Fetch - serve from cache, falling back to network
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only handle GET requests for same-origin
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      // Stale-while-revalidate for shell assets
      if (cached) {
        fetch(event.request).then((response) => {
          if (response.ok) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()));
          }
        }).catch(() => {
          // Offline, serve fallback for navigations
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        });
        return cached;
      }

      // Network first for uncached
      return fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      });
    }),
  );
});