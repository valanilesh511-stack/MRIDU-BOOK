/**
 * MRIDU BOOK STUDIO – Service Worker
 * Fully dynamic: caches every visited core/module file automatically.
 * No hardcoded file lists. Never needs updating when files are added.
 */
const CACHE_NAME = 'mridu-core-v1';

// Only the absolute minimum to bootstrap offline
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './boot.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Only handle same-origin GET requests
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        // Return cached response immediately, but update from network in background
        const fetchPromise = fetch(event.request).then(networkResponse => {
          // Only cache successful responses
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // Network failed, nothing to do
        });

        // If cached, return it right away; otherwise wait for network
        return cachedResponse || fetchPromise;
      });
    })
  );
});