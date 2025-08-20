<<<<<<< HEAD
// BeachGirl.pics Service Worker - Paradise Beach Collection
const CACHE_NAME = 'beachgirl-pics-v1.0';
const urlsToCache = [
  '/',
  '/beachgirl-index.html',
  '/decorative-images/paradise-beach.png',
  '/favicon.ico',
  'https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Dancing+Script:wght@400;700&family=Poppins:wght@300;400;500;600;700&display=swap'
];

// Install event - cache resources
self.addEventListener('install', function(event) {
  console.log('🏖️ BeachGirl.pics SW: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('📦 BeachGirl.pics SW: Caching files');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', function(event) {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external domains (ads, analytics, etc.)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version if available
        if (response) {
          return response;
        }

        // Otherwise fetch from network
        return fetch(event.request).then(function(response) {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response for caching
          var responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(function(cache) {
              // Only cache specific file types
              if (event.request.url.match(/\.(js|css|html|png|jpg|jpeg|webp|gif|ico)$/)) {
                cache.put(event.request, responseToCache);
              }
            });

          return response;
        }).catch(function() {
          // Return a fallback page when offline
          if (event.request.headers.get('accept').includes('text/html')) {
            return new Response(`
              <html>
                <head>
                  <title>BeachGirl.pics - Offline</title>
                  <style>
                    body { 
                      font-family: Arial, sans-serif; 
                      text-align: center; 
                      padding: 50px;
                      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                      color: white;
                      min-height: 100vh;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      flex-direction: column;
                    }
                    h1 { font-size: 2em; margin-bottom: 20px; }
                    p { font-size: 1.2em; }
                  </style>
                </head>
                <body>
                  <h1>🏖️ BeachGirl.pics</h1>
                  <p>Estás sin conexión</p>
                  <p>Conéctate a internet para acceder al paraíso</p>
                </body>
              </html>
            `, {
              headers: { 'Content-Type': 'text/html' }
            });
          }
        });
      })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', function(event) {
  console.log('✅ BeachGirl.pics SW: Activated');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME && cacheName.startsWith('beachgirl-pics-')) {
            console.log('🗑️ BeachGirl.pics SW: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
=======
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
>>>>>>> 2605afd1078c28a88b0c9f9589a5dea632e8c75e
});