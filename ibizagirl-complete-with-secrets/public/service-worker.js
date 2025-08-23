const CACHE_NAME = 'ibiza-v1';
const EXCLUDE_PREFIXES = ['/premium/', '/uncensored/', '/uncensored-videos/'];

self.addEventListener('install', (event) => { self.skipWaiting(); });
self.addEventListener('activate', (event) => { event.waitUntil(clients.claim()); });

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (EXCLUDE_PREFIXES.some(p => url.pathname.startsWith(p))) { return; }
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.open(CACHE_NAME).then(async (cache) => {
    try {
      const net = await fetch(event.request);
      if (net.ok && net.type === 'basic') cache.put(event.request, net.clone());
      return net;
    } catch (e) {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      throw e;
    }
  }));
});
