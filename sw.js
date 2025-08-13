// ============================
// IBIZAGIRL.PICS SERVICE WORKER v1.0
// PWA + Performance + SEO Optimized
// ============================

const CACHE_NAME = 'ibizagirl-v1.2.0';
const STATIC_CACHE = 'ibizagirl-static-v1.2.0';
const DYNAMIC_CACHE = 'ibizagirl-dynamic-v1.2.0';
const IMAGE_CACHE = 'ibizagirl-images-v1.2.0';

// Archivos críticos para cachear
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/main.html',
  '/main-script.js',
  '/manifest.json',
  
  // Imágenes críticas para SEO
  '/public/assets/full/bikini.jpg',
  '/public/assets/full/bikbanner.jpg',
  '/public/assets/full/bikbanner2.jpg',
  '/public/assets/full/backbikini.jpg',
  '/public/assets/full/bikini3.jpg',
  '/public/assets/full/bikini5.jpg',
  
  // Scripts externos críticos
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js',
  'https://www.paypal.com/sdk/js?client-id=AfQEdiielw5fm3wF08p9pcxwqR3gPz82YRNUTKY4A8WNG9AktiGsDNyr2i7BsjVzSwwpeCwR7Tt7DPq5&currency=EUR&components=buttons,funding-eligibility'
];

// URLs que no deben cachearse
const EXCLUDED_URLS = [
  '/public/assets/uncensored/',
  '/public/assets/uncensored-videos/',
  '/admin',
  'chrome-extension://',
  'extension://'
];

// ============================
// INSTALACIÓN DEL SERVICE WORKER
// ============================

self.addEventListener('install', event => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('📦 Service Worker: Caching static assets...');
        return cache.addAll(STATIC_ASSETS.map(url => {
          return new Request(url, {
            cache: 'reload'
          });
        }));
      })
      .then(() => {
        console.log('✅ Service Worker: Installation complete');
        // Forzar activación inmediata
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Service Worker: Installation failed', error);
      })
  );
});

// ============================
// ACTIVACIÓN DEL SERVICE WORKER
// ============================

self.addEventListener('activate', event => {
  console.log('🚀 Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        // Limpiar caches antiguos
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== IMAGE_CACHE) {
              console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker: Activation complete');
        // Tomar control inmediato
        return self.clients.claim();
      })
  );
});

// ============================
// ESTRATEGIAS DE CACHE
// ============================

// Estrategia: Cache First (para assets estáticos)
function cacheFirst(request) {
  return caches.match(request)
    .then(cached => {
      if (cached) {
        return cached;
      }
      return fetch(request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(STATIC_CACHE)
            .then(cache => cache.put(request, responseClone));
          return response;
        });
    });
}

// Estrategia: Network First (para contenido dinámico)
function networkFirst(request) {
  return fetch(request)
    .then(response => {
      const responseClone = response.clone();
      caches.open(DYNAMIC_CACHE)
        .then(cache => cache.put(request, responseClone));
      return response;
    })
    .catch(() => {
      return caches.match(request);
    });
}

// Estrategia: Stale While Revalidate (para imágenes)
function staleWhileRevalidate(request) {
  return caches.match(request)
    .then(cached => {
      const fetchPromise = fetch(request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(IMAGE_CACHE)
            .then(cache => cache.put(request, responseClone));
          return response;
        });
      
      return cached || fetchPromise;
    });
}

// ============================
// INTERCEPTAR REQUESTS
// ============================

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorar URLs excluidas
  if (EXCLUDED_URLS.some(excludedUrl => url.pathname.includes(excludedUrl))) {
    return;
  }
  
  // Ignorar requests que no sean GET
  if (request.method !== 'GET') {
    return;
  }
  
  // Ignorar chrome-extension y extension requests
  if (url.protocol === 'chrome-extension:' || url.protocol === 'extension:') {
    return;
  }
  
  event.respondWith(
    (async () => {
      try {
        // Estrategia para HTML (Network First)
        if (request.headers.get('accept')?.includes('text/html')) {
          return await networkFirst(request);
        }
        
        // Estrategia para imágenes (Stale While Revalidate)
        if (request.headers.get('accept')?.includes('image/') || 
            url.pathname.includes('/public/assets/full/') ||
            url.pathname.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)) {
          return await staleWhileRevalidate(request);
        }
        
        // Estrategia para JavaScript/CSS (Cache First)
        if (url.pathname.includes('.js') || 
            url.pathname.includes('.css') ||
            url.hostname === 'cdn.jsdelivr.net' ||
            url.hostname === 'www.paypal.com') {
          return await cacheFirst(request);
        }
        
        // Para PayPal y APIs externas (Network First)
        if (url.hostname !== location.hostname) {
          return await networkFirst(request);
        }
        
        // Default: Network First
        return await networkFirst(request);
        
      } catch (error) {
        console.error('🚨 Service Worker: Fetch error', error);
        
        // Fallback para páginas HTML
        if (request.headers.get('accept')?.includes('text/html')) {
          return await caches.match('/index.html') || 
                 await caches.match('/');
        }
        
        // Fallback para imágenes
        if (request.headers.get('accept')?.includes('image/')) {
          return await caches.match('/public/assets/full/bikini.jpg');
        }
        
        return new Response('Network error', {
          status: 408,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    })()
  );
});

// ============================
// MENSAJES DEL CLIENTE
// ============================

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: CACHE_NAME,
      static: STATIC_CACHE,
      dynamic: DYNAMIC_CACHE,
      images: IMAGE_CACHE
    });
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }).then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
});

// ============================
// SINCRONIZACIÓN EN BACKGROUND
// ============================

self.addEventListener('sync', event => {
  if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalytics());
  }
  
  if (event.tag === 'content-preload') {
    event.waitUntil(preloadTodayContent());
  }
});

// Función para sincronizar analytics
async function syncAnalytics() {
  try {
    // Aquí podrías sincronizar datos de analytics offline
    console.log('📊 Service Worker: Syncing analytics...');
    
    // Ejemplo: enviar eventos guardados mientras estaba offline
    const offlineEvents = await getOfflineEvents();
    if (offlineEvents.length > 0) {
      await sendAnalyticsEvents(offlineEvents);
      await clearOfflineEvents();
    }
  } catch (error) {
    console.error('❌ Service Worker: Analytics sync failed', error);
  }
}

// Función para precargar contenido del día
async function preloadTodayContent() {
  try {
    console.log('🔄 Service Worker: Preloading today content...');
    
    // Precargar algunas imágenes de preview
    const previewImages = [
      '/public/assets/full/bikini.jpg',
      '/public/assets/full/bikbanner.jpg',
      '/public/assets/full/bikini3.jpg'
    ];
    
    const cache = await caches.open(IMAGE_CACHE);
    await Promise.all(
      previewImages.map(url => 
        fetch(url).then(response => {
          if (response.ok) {
            cache.put(url, response.clone());
          }
          return response;
        })
      )
    );
    
    console.log('✅ Service Worker: Content preloaded');
  } catch (error) {
    console.error('❌ Service Worker: Preload failed', error);
  }
}

// Funciones auxiliares para analytics offline
async function getOfflineEvents() {
  // Implementar lógica para obtener eventos offline
  return [];
}

async function sendAnalyticsEvents(events) {
  // Implementar lógica para enviar eventos
  console.log('📤 Sending offline analytics events:', events);
}

async function clearOfflineEvents() {
  // Implementar lógica para limpiar eventos enviados
  console.log('🗑️ Clearing offline events');
}

// ============================
// NOTIFICACIONES PUSH (futuro)
// ============================

self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'Nuevo contenido disponible en IbizaGirl.pics',
      icon: '/public/assets/full/bikini.jpg',
      badge: '/public/assets/full/bikini.jpg',
      image: data.image || '/public/assets/full/bikbanner.jpg',
      tag: 'ibiza-update',
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: 'Ver galería',
          icon: '/public/assets/full/bikini.jpg'
        },
        {
          action: 'close',
          title: 'Cerrar'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(
        data.title || 'IbizaGirl.pics - Nuevo contenido',
        options
      )
    );
  }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('https://ibizagirl.pics/main.html')
    );
  }
});

console.log('🌊 IbizaGirl.pics Service Worker v1.2.0 loaded successfully');
