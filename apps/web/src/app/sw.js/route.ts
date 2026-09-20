import { NextResponse } from 'next/server';

const BUILD_VERSION =
  process.env.NEXT_PUBLIC_APP_VERSION ||
  process.env.BUILD_ID ||
  process.env.VERCEL_GIT_COMMIT_SHA ||
  (process.env.NODE_ENV === 'development'
    ? `dev-${Date.now()}`
    : `prod-${new Date().toISOString().slice(0, 10)}`);

export async function GET() {
  const swCode = `// Lumen Shell Cache Service Worker (Auto-generated version)
const CACHE_VERSION = '${BUILD_VERSION}';
const CACHE_NAME = 'lumen-shell-' + CACHE_VERSION;

const SHELL_ASSETS = [
  '/',
  '/login',
  '/manifest.json',
  '/favicon.ico',
  '/offline.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS).catch(() => {})),
  );
  self.skipWaiting();
});

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

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Bypass non-GET, cross-origin, Next.js HMR, and API requests
  if (
    event.request.method !== 'GET' ||
    url.origin !== self.location.origin ||
    url.pathname.includes('/_next/webpack-hmr') ||
    url.pathname.startsWith('/api/')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        // Stale-while-revalidate for cached shell assets
        fetch(event.request)
          .then((response) => {
            if (response.ok) {
              caches
                .open(CACHE_NAME)
                .then((cache) => cache.put(event.request, response.clone()));
            }
          })
          .catch(() => {});
        return cached;
      }

      return fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      });
    }),
  );
});
`;

  return new NextResponse(swCode, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
  });
}
