// ============================
// IBIZAGIRL.PICS SERVICE WORKER v1.4.3 BACKGROUND SYNC FIXED
// PWA + Performance + SEO + Background Sync Optimization
// ============================

const CACHE_VERSION = '1.4.3';
const CACHE_NAME = `ibizagirl-v${CACHE_VERSION}`;
const STATIC_CACHE = `ibizagirl-static-v${CACHE_VERSION}`;
const DYNAMIC_CACHE = `ibizagirl-dynamic-v${CACHE_VERSION}`;
const IMAGE_CACHE = `ibizagirl-images-v${CACHE_VERSION}`;

// Critical assets for caching
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/main.html',
    '/main-script.js',
    '/styles.css',
    '/seo-enhancements.js',
    '/manifest.json',
    
    // Critical images
    '/full/bikini.webp',
    '/full/bikbanner.webp',
    '/full/bikbanner2.webp',
    '/full/backbikini.webp',
    '/full/bikini3.webp',
    '/full/bikini5.webp'
];

// External scripts to cache
const EXTERNAL_SCRIPTS = [
    'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js'
];

// URLs that should not be cached
const EXCLUDED_URLS = [
    'chrome-extension://',
    'extension://',
    'paypal.com',
    'paypalobjects.com',
    'googletagmanager.com',
    'google-analytics.com',
    'gtag/js',
    'juicyads',
    'exoclick',
    'popads',
    'premiumvertising',
    'adsco.re'
];

// FIXED: Background sync control
let backgroundSyncEnabled = true;
let lastSyncTime = 0;
const SYNC_COOLDOWN = 300000; // 5 minutes cooldown

// ============================
// SERVICE WORKER INSTALLATION
// ============================

self.addEventListener('install', event => {
    console.log('🔧 Service Worker: Installing version', CACHE_VERSION);
    
    event.waitUntil(
        Promise.all([
            caches.open(STATIC_CACHE).then(cache => {
                console.log('📦 Service Worker: Caching static assets...');
                return Promise.allSettled(
                    STATIC_ASSETS.map(url => {
                        return cache.add(url).catch(err => {
                            console.warn(`Failed to cache ${url}:`, err.message);
                            return Promise.resolve();
                        });
                    })
                );
            }),
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
// SERVICE WORKER ACTIVATION
// ============================

self.addEventListener('activate', event => {
    console.log('🚀 Service Worker: Activating version', CACHE_VERSION);
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
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
// FETCH EVENT HANDLER - OPTIMIZED
// ============================

self.addEventListener('fetch', event => {
    const { request } = event;
    
    // Only handle GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    try {
        const url = new URL(request.url);
        
        // Ignore excluded URLs
        if (EXCLUDED_URLS.some(excludedUrl => url.href.includes(excludedUrl))) {
            return;
        }
        
        // Ignore chrome-extension and extension requests
        if (url.protocol === 'chrome-extension:' || url.protocol === 'extension:') {
            return;
        }
        
        // Ignore data URLs
        if (url.protocol === 'data:') {
            return;
        }
        
        event.respondWith(handleFetch(request, url));
        
    } catch (error) {
        console.warn('Service Worker: URL parsing failed for:', request.url, error.message);
        return;
    }
});

async function handleFetch(request, url) {
    try {
        // For HTML - Network First
        if (request.headers.get('accept')?.includes('text/html')) {
            return await networkFirstWithFallback(request);
        }
        
        // For images - Stale While Revalidate (FIXED)
        if (request.headers.get('accept')?.includes('image/') || 
            url.pathname.includes('/full/') ||
            url.pathname.includes('/uncensored/') ||
            url.pathname.includes('/uncensored-videos/') ||
            url.pathname.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)) {
            return await staleWhileRevalidateFixed(request);
        }
        
        // For JavaScript/CSS - Cache First with timeout
        if (url.pathname.endsWith('.js') || 
            url.pathname.endsWith('.css') ||
            url.hostname === 'cdn.jsdelivr.net') {
            return await cacheFirstWithTimeout(request);
        }
        
        // For PayPal and APIs - Network Only
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
        try {
            const cached = await caches.match(request);
            if (cached) return cached;
        } catch (cacheError) {
            console.warn('Service Worker: Cache lookup failed', cacheError.message);
        }
        
        // Return a basic error response
        return new Response('Network error occurred', {
            status: 408,
            statusText: 'Request Timeout',
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

// ============================
// CACHING STRATEGIES - OPTIMIZED
// ============================

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
        console.warn('Cache first timeout:', error.message);
    }
    
    try {
        const response = await fetch(request);
        if (response && response.ok && response.status < 400) {
            const cache = await caches.open(STATIC_CACHE);
            // FIXED: Clone before using
            cache.put(request, response.clone()).catch(() => {});
        }
        return response;
    } catch (error) {
        const cached = await caches.match(request);
        if (cached) return cached;
        throw error;
    }
}

async function networkFirstWithFallback(request) {
    try {
        const response = await fetch(request);
        if (response && response.ok && response.status < 400) {
            const cache = await caches.open(DYNAMIC_CACHE);
            // FIXED: Clone before using
            cache.put(request, response.clone()).catch(() => {});
        }
        return response;
    } catch (error) {
        const cached = await caches.match(request);
        if (cached) {
            return cached;
        }
        
        // Fallback for HTML pages
        if (request.headers.get('accept')?.includes('text/html')) {
            const indexCached = await caches.match('/index.html');
            if (indexCached) return indexCached;
        }
        
        throw error;
    }
}

// FIXED: Stale While Revalidate without clone errors
async function staleWhileRevalidateFixed(request) {
    const cached = await caches.match(request);
    
    // Background fetch without clone errors
    const fetchPromise = fetch(request).then(response => {
        if (response && response.ok && response.status < 400) {
            caches.open(IMAGE_CACHE).then(cache => {
                // FIXED: Check if response can be cloned
                try {
                    if (response.body && !response.bodyUsed) {
                        cache.put(request, response.clone()).catch(() => {});
                    }
                } catch (cloneError) {
                    // Silent fail on clone error
                }
            }).catch(() => {});
        }
        return response;
    }).catch(() => {
        // Return cached version if fetch fails
        return cached;
    });
    
    // Return cached version immediately if available, otherwise wait for fetch
    return cached || fetchPromise;
}

// ============================
// MESSAGE HANDLING
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
    
    // FIXED: Background sync control
    if (event.data && event.data.type === 'DISABLE_SYNC') {
        backgroundSyncEnabled = false;
        console.log('🔇 Background sync disabled');
    }
    
    if (event.data && event.data.type === 'ENABLE_SYNC') {
        backgroundSyncEnabled = true;
        console.log('🔊 Background sync enabled');
    }
});

// ============================
// BACKGROUND SYNC - FIXED
// ============================

self.addEventListener('sync', event => {
    // FIXED: Add cooldown and control mechanism
    const currentTime = Date.now();
    
    if (!backgroundSyncEnabled) {
        console.log('🔇 Background sync disabled, skipping');
        return;
    }
    
    if (currentTime - lastSyncTime < SYNC_COOLDOWN) {
        console.log('⏳ Background sync cooldown active, skipping');
        return;
    }
    
    console.log('🔄 Background sync triggered:', event.tag);
    lastSyncTime = currentTime;
    
    if (event.tag === 'content-preload') {
        event.waitUntil(preloadContent());
    }
});

async function preloadContent() {
    try {
        console.log('🔄 Service Worker: Preloading content...');
        
        // FIXED: Only preload essential images to prevent excessive background activity
        const imagesToPreload = [
            '/full/bikini.webp',
            '/full/bikbanner.webp',
            '/full/bikini3.webp'
        ];
        
        const cache = await caches.open(IMAGE_CACHE);
        
        await Promise.allSettled(
            imagesToPreload.map(async url => {
                try {
                    // Check if already cached to avoid unnecessary requests
                    const cached = await cache.match(url);
                    if (cached) {
                        return;
                    }
                    
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
        
        // FIXED: Disable further background syncs for a while
        setTimeout(() => {
            backgroundSyncEnabled = true;
        }, SYNC_COOLDOWN);
        
    } catch (error) {
        console.error('❌ Service Worker: Preload failed', error);
    }
}

// ============================
// PERFORMANCE OPTIMIZATION
// ============================

// FIXED: Limit concurrent operations
let activeOperations = 0;
const MAX_CONCURRENT_OPERATIONS = 3;

async function throttledOperation(operation) {
    if (activeOperations >= MAX_CONCURRENT_OPERATIONS) {
        return;
    }
    
    activeOperations++;
    try {
        await operation();
    } finally {
        activeOperations--;
    }
}

// FIXED: Cleanup old caches more aggressively
async function cleanupOldCaches() {
    try {
        const cacheNames = await caches.keys();
        const oldCaches = cacheNames.filter(name => 
            !name.includes(CACHE_VERSION) && 
            (name.includes('ibizagirl') || name.includes('dynamic') || name.includes('images'))
        );
        
        if (oldCaches.length > 0) {
            console.log('🧹 Cleaning up old caches:', oldCaches);
            await Promise.all(oldCaches.map(name => caches.delete(name)));
        }
    } catch (error) {
        console.warn('Cache cleanup failed:', error.message);
    }
}

// Run cleanup periodically
setInterval(cleanupOldCaches, 3600000); // Every hour

// ============================
// ERROR HANDLING IMPROVEMENT
// ============================

self.addEventListener('error', event => {
    console.error('Service Worker Error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
    console.error('Service Worker Unhandled Promise Rejection:', event.reason);
});

console.log(`🌊 IbizaGirl.pics Service Worker v${CACHE_VERSION} loaded - Background sync FIXED`);
