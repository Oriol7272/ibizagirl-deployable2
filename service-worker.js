const CACHE_NAME = 'ibizagirl-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/age-verification.html',
    '/gallery.html',
    '/premium.html',
    '/videos.html',
    '/subscription.html',
    '/content-data1.js',
    '/content-data2.js',
    '/content-data3.js',
    '/content-data4.js',
    '/content-data5.js',
    '/content-data6.js',
    '/manifest.json'
];

// Install service worker
self.addEventListener('install', event => {
    console.log('🔧 Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Caching files');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activate service worker
self.addEventListener('activate', event => {
    console.log('✅ Service Worker activated');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch handler
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;
    
    // Skip external requests
    if (!event.request.url.startsWith(self.location.origin)) return;
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// Push notification handler (for future use)
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'Nuevo contenido disponible!',
        icon: '/full/bikbanner.webp',
        badge: '/full/bikbanner2.webp',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Ver Contenido',
                icon: '/full/bikbanner.webp'
            },
            {
                action: 'close',
                title: 'Cerrar',
                icon: '/full/bikbanner2.webp'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('IbizaGirl.pics', options)
    );
});