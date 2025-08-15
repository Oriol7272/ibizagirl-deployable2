// ============================
// IBIZAGIRL.PICS SERVICE WORKER v1.4.0 FIXED
// PWA + Performance + SEO Optimized
// ============================

const CACHE_VERSION = '1.4.0';
const CACHE_NAME = `ibizagirl-v${CACHE_VERSION}`;
const STATIC_CACHE = `ibizagirl-static-v${CACHE_VERSION}`;
const DYNAMIC_CACHE = `ibizagirl-dynamic-v${CACHE_VERSION}`;
const IMAGE_CACHE = `ibizagirl-images-v${CACHE_VERSION}`;

// Archivos críticos para cachear - RUTAS CORREGIDAS
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/main.html',
    '/main-script.js',
    '/styles.css',
    '/seo-enhancements.js',
    '/manifest.json',
    
    // Imágenes críticas para SEO y UI - SIN public/assets
    '/full/bikini.jpg',
    '/full/bikbanner.jpg',
    '/full/bikbanner2.jpg',
    '/full/backbikini.jpg',
    '/full/bikini3.jpg',
    '/full/bikini5.jpg'
];

// External scripts to cache
const EXTERNAL_SCRIPTS = [
    'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js'
];

// URLs que no deben cachearse
const EXCLUDED_URLS = [
    'chrome-extension://',
    'extension://',
    'paypal.com',
    'paypalobjects.com',
    'googletagmanager.com',
    'google-analytics.com',
    'gtag/js'
];

// ============================
// INSTALACIÓN DEL SERVICE WORKER
// ============================

self.addEventListener('install', event => {
    console.log('🔧 Service Worker: Installing version', CACHE_VERSION);
    
    event.waitUntil(
        Promise.all([
            // Cache static assets
            caches.open(STATIC_CACHE).then(cache => {
                console.log('📦 Service Worker: Caching static assets...');
                return Promise.allSettled(
                    STATIC_ASSETS.map(url => {
                        return cache.add(url).catch(err => {
                            console.warn(`Failed to cache ${url}:`, err.message);
                            return Promise.resolve(); // Continue even if one fails
                        });
                    })
                );
            }),
            // Cache external scripts with fetch
            caches.open(STATIC_CACHE).then(cache => {
                return Promise.allSettled(
                    EXTERNAL_SCRIPTS.map(url => {
                        return fetch(url, { mode: 'cors' })
                            .then(response => {
                                if (response && response.ok) {
                                    return cache.put(url, response);
                                }
                            })
                            .catch(err => {
                                console.warn(`Failed to cache external script ${url}:`, err.message);
                                return Promise.resolve();
                            });
                    })
                );
            })
        ]).then(() => {
            console.log('✅ Service Worker: Installation complete');
            return self.skipWaiting();
        }).catch(error => {
            console.error('❌ Service Worker: Installation failed', error);
        })
    );
});

// ============================
// ACTIVACIÓN DEL SERVICE WORKER
// ============================

self.addEventListener('activate', event => {
    console.log('🚀 Service Worker: Activating version', CACHE_VERSION);
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            // Limpiar caches antiguos
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheName.includes(CACHE_VERSION)) {
                        console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✅ Service Worker: Activation complete');
            return self.clients.claim();
        }).catch(error => {
            console.error('❌ Service Worker: Activation error', error);
        })
    );
});

// ============================
// ESTRATEGIAS DE CACHE
// ============================

// Estrategia: Cache First con timeout
async function cacheFirstWithTimeout(request, timeout = 3000) {
    try {
        const cachePromise = caches.match(request);
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Cache timeout')), timeout)
        );
        
        const cached = await Promise.race([cachePromise, timeoutPromise]).catch(() => null);
        if (cached) {
            return cached;
        }
    } catch (error) {
        // Continue to network
    }
    
    try {
        const response = await fetch(request);
        if (response && response.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, response.clone()).catch(() => {});
        }
        return response;
    } catch (error) {
        // Try cache again as last resort
        const cached = await caches.match(request);
        if (cached) return cached;
        throw error;
    }
}

// Estrategia: Network First con fallback
async function networkFirstWithFallback(request) {
    try {
        const response = await fetch(request);
        if (response && response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, response.clone()).catch(() => {});
        }
        return response;
    } catch (error) {
        const cached = await caches.match(request);
        if (cached) {
            return cached;
        }
        
        // Fallback para páginas HTML
        if (request.headers.get('accept')?.includes('text/html')) {
            const indexCached = await caches.match('/index.html');
            if (indexCached) return indexCached;
        }
        
        throw error;
    }
}

// Estrategia: Stale While Revalidate
async function staleWhileRevalidate(request) {
    const cached = await caches.match(request);
    
    // Fetch en background
    const fetchPromise = fetch(request).then(response => {
        if (response && response.ok) {
            caches.open(IMAGE_CACHE).then(cache => {
                cache.put(request, response.clone()).catch(() => {});
            });
        }
        return response;
    }).catch(() => cached);
    
    return cached || fetchPromise;
}

// ============================
// INTERCEPTAR REQUESTS
// ============================

self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Ignorar requests que no sean GET
    if (request.method !== 'GET') {
        return;
    }
    
    // Ignorar URLs excluidas
    if (EXCLUDED_URLS.some(excludedUrl => url.href.includes(excludedUrl))) {
        return;
    }
    
    // Ignorar chrome-extension y extension requests
    if (url.protocol === 'chrome-extension:' || url.protocol === 'extension:') {
        return;
    }
    
    // Ignorar data URLs
    if (url.protocol === 'data:') {
        return;
    }
    
    event.respondWith(handleFetch(request, url));
});

async function handleFetch(request, url) {
    try {
        // Para HTML - Network First
        if (request.headers.get('accept')?.includes('text/html')) {
            return await networkFirstWithFallback(request);
        }
        
        // Para imágenes - Stale While Revalidate - RUTAS CORREGIDAS
        if (request.headers.get('accept')?.includes('image/') || 
            url.pathname.includes('/full/') ||
            url.pathname.includes('/uncensored/') ||
            url.pathname.includes('/uncensored-videos/') ||
            url.pathname.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)) {
            return await staleWhileRevalidate(request);
        }
        
        // Para JavaScript/CSS - Cache First con timeout
        if (url.pathname.endsWith('.js') || 
            url.pathname.endsWith('.css') ||
            url.hostname === 'cdn.jsdelivr.net') {
            return await cacheFirstWithTimeout(request);
        }
        
        // Para PayPal y APIs externas - Network Only
        if (url.hostname.includes('paypal') || 
            url.hostname.includes('google') ||
            url.hostname !== location.hostname) {
            return await fetch(request);
        }
        
        // Default: Network First
        return await networkFirstWithFallback(request);
        
    } catch (error) {
        console.warn('Service Worker: Fetch failed for', request.url, error.message);
        
        // Try to return a cached response
        const cached = await caches.match(request);
        if (cached) return cached;
        
        // Return a basic error response
        return new Response('Network error occurred', {
            status: 408,
            statusText: 'Request Timeout',
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

// ============================
// MENSAJES DEL CLIENTE
// ============================

self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        if (event.ports && event.ports[0]) {
            event.ports[0].postMessage({
                version: CACHE_VERSION,
                caches: {
                    static: STATIC_CACHE,
                    dynamic: DYNAMIC_CACHE,
                    images: IMAGE_CACHE
                }
            });
        }
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
            );
        }).then(() => {
            if (event.ports && event.ports[0]) {
                event.ports[0].postMessage({ success: true });
            }
        });
    }
});

// ============================
// SINCRONIZACIÓN EN BACKGROUND
// ============================

self.addEventListener('sync', event => {
    console.log('🔄 Background sync triggered:', event.tag);
    
    if (event.tag === 'content-preload') {
        event.waitUntil(preloadContent());
    }
});

// Función para precargar contenido - RUTAS CORREGIDAS
async function preloadContent() {
    try {
        console.log('🔄 Service Worker: Preloading content...');
        
        const imagesToPreload = [
            '/full/bikini.jpg',
            '/full/bikbanner.jpg',
            '/full/bikini3.jpg'
        ];
        
        const cache = await caches.open(IMAGE_CACHE);
        
        await Promise.allSettled(
            imagesToPreload.map(async url => {
                try {
                    const response = await fetch(url);
                    if (response && response.ok) {
                        await cache.put(url, response);
                    }
                } catch (err) {
                    console.warn(`Failed to preload ${url}:`, err.message);
                }
            })
        );
        
        console.log('✅ Service Worker: Content preloaded');
    } catch (error) {
        console.error('❌ Service Worker: Preload failed', error);
    }
}

// ============================
// NOTIFICACIONES PUSH (Preparado para futuro)
// ============================

self.addEventListener('push', event => {
    if (!event.data) return;
    
    try {
        const data = event.data.json();
        
        const options = {
            body: data.body || 'Nuevo contenido disponible en IbizaGirl.pics',
            icon: '/full/bikini.jpg',
            badge: '/full/bikini.jpg',
            image: data.image || '/full/bikbanner.jpg',
            tag: 'ibiza-update',
            requireInteraction: false,
            data: {
                url: data.url || '/main.html'
            },
            actions: [
                {
                    action: 'view',
                    title: 'Ver galería',
                    icon: '/full/bikini.jpg'
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
    } catch (error) {
        console.error('Push notification error:', error);
    }
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'view' || !event.action) {
        const urlToOpen = event.notification.data?.url || '/main.html';
        event.waitUntil(
            clients.openWindow(`https://ibizagirl.pics${urlToOpen}`)
        );
    }
});

// ============================
// PERIODIC BACKGROUND SYNC (Experimental)
// ============================

self.addEventListener('periodicsync', event => {
    if (event.tag === 'update-content') {
        event.waitUntil(updateContent());
    }
});

async function updateContent() {
    try {
        // Update critical assets
        const cache = await caches.open(STATIC_CACHE);
        const updates = [
            '/main.html',
            '/main-script.js',
            '/styles.css'
        ];
        
        await Promise.allSettled(
            updates.map(url => 
                fetch(url)
                    .then(response => {
                        if (response && response.ok) {
                            return cache.put(url, response);
                        }
                    })
                    .catch(() => {})
            )
        );
    } catch (error) {
        console.error('Periodic sync error:', error);
    }
}

console.log(`🌊 IbizaGirl.pics Service Worker v${CACHE_VERSION} loaded successfully`);
