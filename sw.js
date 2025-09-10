const CACHE_NAME = 'beachgirl-v1';
const urlsToCache = [
    '/',
    '/ocean-theme.css',
    '/fast-aesthetic.css',
    '/decorative-images/SexyBeachy.ttf'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
