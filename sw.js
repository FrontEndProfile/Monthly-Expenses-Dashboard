// sw.js — simple, valid SW (no blob)
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Optional: network-first with cache fallback
const CACHE = 'expense-app-v1';
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((resp) => {
        // cache only GET requests
        if (event.request.method === 'GET') {
          const copy = resp.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return resp;
      })
      .catch(() => caches.match(event.request))
  );
});
