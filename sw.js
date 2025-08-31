
const CACHE_NAME = 'diario-cardio-v1';
const FILES_TO_CACHE = [
  './diario_cardio_tickavel_v5_pwa.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null)))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  const req = evt.request;
  evt.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((resp) => {
      const copy = resp.clone();
      caches.open(CACHE_NAME).then(cache => {
        if (req.method === 'GET' && resp.status === 200 && req.url.startsWith(self.location.origin)) {
          cache.put(req, copy);
        }
      });
      return resp;
    }).catch(() => cached))
  );
});
