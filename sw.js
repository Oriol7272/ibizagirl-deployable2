/**
 * IbizaGirl.pics - Service Worker v10.0.0 FIXED
 * Optimized caching and background sync with proper error handling
 */

// ============================
// CONFIGURATION
// ============================

const CACHE_VERSION = 'v10.0.0';
const CACHE_PREFIX = 'ibizagirl-';
const STATIC_CACHE = `${CACHE_PREFIX}static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `${CACHE_PREFIX}dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `${CACHE_PREFIX}images-${CACHE_VERSION}`;
const VIDEO_CACHE = `${CACHE_PREFIX}videos-${CACHE_VERSION}`;

// Cache configuration
const CACHE_CONFIG = {
    maxAge: 86400000, // 24 hours
    maxItems: 100,
    maxSize: 50 * 1024 * 1024, // 50MB per cache
    networkTimeoutMs: 5000
};

// Background sync configuration
const SYNC_CONFIG = {
    enabled: true,
    tag: 'ibizagirl-sync',
    cooldownMs: 300000, // 5 minutes
    maxRetries: 3
};

// Essential files to cache
const ESSENTIAL_FILES = [
    '/',
    '/index.html',
    '/main.html',
    '/styles.css',
    '/main-script.js',
    '/manifest.json',
    '/offline.html'
];

// Patterns for different cache strategies
const CACHE_PATTERNS = {
    staticAssets: /\.(css|js|woff2?|ttf|eot|svg)(\?.*)?$/i,
    images: /\.(jpg|jpeg|png|webp|gif|ico)(\?.*)?$/i,
    videos: /\.(mp4|webm|ogg)(\?.*)?$/i,
    api: /\/api\//i,
    external: /^https?:\/\/(?!ibizagirl\.pics)/i
};

// ============================
// STATE MANAGEMENT
// ============================

let backgroundSyncEnabled = true;
let activeOperations = 0;
const MAX_CONCURRENT_OPERATIONS = 3;
const syncCooldown = new Map();

// ============================
// INSTALL EVENT
// ============================

self.addEventListener('install', event => {
    console.log('🔧 Service Worker: Installing version', CACHE_VERSION);
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('📦 Caching essential files...');
                // Add files one by one to handle errors gracefully
                return Promise.allSettled(
                    ESSENTIAL_FILES.map(file => 
                        cache.add(file).catch(err => {
                            console.warn(`Failed to cache ${file}:`, err.message);
                            return null;
                        })
                    )
                );
            })
            .then(() => {
                console.log('✅ Essential files cached');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Installation failed:', error);
            })
    );
});

// ============================
// ACTIVATE EVENT
// ============================

self.addEventListener('activate', event => {
    console.log('🚀 Service Worker: Activating version', CACHE_VERSION);
    
    event.waitUntil(
        Promise.all([
            // Clean old caches
            cleanupOldCaches(),
            // Take control of all clients
            self.clients.claim()
        ]).then(() => {
            console.log('✅ Service Worker activated and controlling all clients');
        })
    );
});

// ============================
// FETCH EVENT
// ============================

self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Skip chrome extension requests
    if (event.request.url.includes('chrome-extension://') || 
        event.request.url.includes('moz-extension://')) {
        return;
    }
    
    event.respondWith(handleFetch(event.request));
});

async function handleFetch(request) {
    try {
        const url = new URL(request.url);
        
        // For images - Stale While Revalidate
        if (CACHE_PATTERNS.images.test(url.pathname)) {
            return await staleWhileRevalidate(request, IMAGE_CACHE);
        }
        
        // For videos - Cache First with size limit
        if (CACHE_PATTERNS.videos.test(url.pathname)) {
            return await cacheFirstWithSizeLimit(request, VIDEO_CACHE);
        }
        
        // For static assets - Cache First
        if (CACHE_PATTERNS.staticAssets.test(url.pathname)) {
            return await cacheFirst(request, STATIC_CACHE);
        }
        
        // For API calls - Network First
        if (CACHE_PATTERNS.api.test(url.pathname)) {
            return await networkFirst(request, DYNAMIC_CACHE);
        }
        
        // For external resources - Network Only
        if (CACHE_PATTERNS.external.test(url.href)) {
            return await fetch(request);
        }
        
        // Default: Network First with fallback
        return await networkFirstWithFallback(request);
        
    } catch (error) {
        console.warn('Fetch failed for', request.url, ':', error.message);
        
        // Try to return cached version
        const cached = await caches.match(request);
        if (cached) return cached;
        
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
            const offlinePage = await caches.match('/offline.html');
            if (offlinePage) return offlinePage;
        }
        
        // Return error response
        return new Response('Network error', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

// ============================
// CACHING STRATEGIES
// ============================

async function cacheFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
        // Update cache in background
        throttledOperation(() => {
            fetch(request)
                .then(response => {
                    if (response.ok) {
                        cache.put(request, response.clone());
                    }
                })
                .catch(() => {});
        });
        return cached;
    }
    
    const response = await fetch(request);
    if (response.ok) {
        cache.put(request, response.clone());
    }
    return response;
}

async function networkFirst(request, cacheName) {
    try {
        const response = await fetchWithTimeout(request, CACHE_CONFIG.networkTimeoutMs);
        
        if (response.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, response.clone());
        }
        
        return response;
    } catch (error) {
        const cached = await caches.match(request);
        if (cached) return cached;
        throw error;
    }
}

async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    const fetchPromise = fetch(request)
        .then(response => {
            if (response.ok) {
                cache.put(request, response.clone());
            }
            return response;
        })
        .catch(error => {
            console.warn('Background update failed:', error.message);
            return cached;
        });
    
    return cached || fetchPromise;
}

async function cacheFirstWithSizeLimit(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) return cached;
    
    try {
        const response = await fetch(request);
        
        if (response.ok) {
            // Check content size
            const contentLength = response.headers.get('content-length');
            const size = contentLength ? parseInt(contentLength) : 0;
            
            // Only cache if under size limit (10MB for videos)
            if (size < 10 * 1024 * 1024) {
                cache.put(request, response.clone());
            }
        }
        
        return response;
    } catch (error) {
        throw error;
    }
}

async function networkFirstWithFallback(request) {
    try {
        const response = await fetchWithTimeout(request, CACHE_CONFIG.networkTimeoutMs);
        
        if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, response.clone());
        }
        
        return response;
    } catch (error) {
        // Try any cache
        const cached = await caches.match(request);
        if (cached) return cached;
        
        // For navigation, return offline page
        if (request.mode === 'navigate') {
            const offlinePage = await caches.match('/offline.html');
            if (offlinePage) return offlinePage;
        }
        
        throw error;
    }
}

// ============================
// UTILITY FUNCTIONS
// ============================

async function fetchWithTimeout(request, timeoutMs) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
        const response = await fetch(request, {
            signal: controller.signal
        });
        clearTimeout(timeout);
        return response;
    } catch (error) {
        clearTimeout(timeout);
        if (error.name === 'AbortError') {
            throw new Error('Network timeout');
        }
        throw error;
    }
}

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

async function cleanupOldCaches() {
    try {
        const cacheNames = await caches.keys();
        const oldCaches = cacheNames.filter(name => 
            name.startsWith(CACHE_PREFIX) && 
            !name.includes(CACHE_VERSION)
        );
        
        if (oldCaches.length > 0) {
            console.log('🧹 Cleaning old caches:', oldCaches);
            await Promise.all(oldCaches.map(name => caches.delete(name)));
        }
        
        // Also cleanup caches that are too large
        await cleanupLargeCaches();
        
    } catch (error) {
        console.warn('Cache cleanup failed:', error.message);
    }
}

async function cleanupLargeCaches() {
    const cacheNames = [IMAGE_CACHE, VIDEO_CACHE, DYNAMIC_CACHE];
    
    for (const cacheName of cacheNames) {
        try {
            const cache = await caches.open(cacheName);
            const requests = await cache.keys();
            
            // If cache has too many items, remove oldest
            if (requests.length > CACHE_CONFIG.maxItems) {
                const toDelete = requests.slice(0, requests.length - CACHE_CONFIG.maxItems);
                await Promise.all(toDelete.map(req => cache.delete(req)));
                console.log(`📦 Cleaned ${toDelete.length} items from ${cacheName}`);
            }
        } catch (error) {
            console.warn(`Failed to cleanup ${cacheName}:`, error.message);
        }
    }
}

// ============================
// BACKGROUND SYNC
// ============================

self.addEventListener('sync', event => {
    if (event.tag === SYNC_CONFIG.tag) {
        console.log('🔄 Background sync triggered');
        
        // Check cooldown
        const lastSync = syncCooldown.get(SYNC_CONFIG.tag);
        if (lastSync && Date.now() - lastSync < SYNC_CONFIG.cooldownMs) {
            console.log('⏳ Sync cooldown active, skipping');
            return;
        }
        
        event.waitUntil(handleBackgroundSync());
    }
});

async function handleBackgroundSync() {
    if (!backgroundSyncEnabled) {
        console.log('🔇 Background sync disabled');
        return;
    }
    
    try {
        syncCooldown.set(SYNC_CONFIG.tag, Date.now());
        
        // Preload critical images
        const criticalImages = [
            '/full/alina-48.webp',
            '/full/preview-1.webp',
            '/full/teaser-1.webp'
        ];
        
        const imageCache = await caches.open(IMAGE_CACHE);
        await Promise.allSettled(
            criticalImages.map(url => 
                fetch(url)
                    .then(response => {
                        if (response.ok) {
                            return imageCache.put(url, response);
                        }
                    })
                    .catch(() => {})
            )
        );
        
        console.log('✅ Background sync completed');
        
    } catch (error) {
        console.error('❌ Background sync failed:', error);
    }
}

// ============================
// MESSAGE HANDLING
// ============================

self.addEventListener('message', event => {
    const { type, data } = event.data || {};
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'GET_VERSION':
            event.ports[0]?.postMessage({
                version: CACHE_VERSION,
                caches: {
                    static: STATIC_CACHE,
                    dynamic: DYNAMIC_CACHE,
                    images: IMAGE_CACHE,
                    videos: VIDEO_CACHE
                }
            });
            break;
            
        case 'CLEAR_CACHE':
            caches.keys()
                .then(names => Promise.all(names.map(name => caches.delete(name))))
                .then(() => {
                    event.ports[0]?.postMessage({ success: true });
                })
                .catch(error => {
                    event.ports[0]?.postMessage({ success: false, error: error.message });
                });
            break;
            
        case 'ENABLE_SYNC':
            backgroundSyncEnabled = true;
            console.log('🔊 Background sync enabled');
            break;
            
        case 'DISABLE_SYNC':
            backgroundSyncEnabled = false;
            console.log('🔇 Background sync disabled');
            break;
            
        case 'CLEANUP_CACHE':
            cleanupOldCaches()
                .then(() => {
                    console.log('✅ Cache cleanup completed');
                });
            break;
    }
});

// ============================
// ERROR HANDLING
// ============================

self.addEventListener('error', event => {
    console.error('Service Worker Error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
    console.error('Service Worker Unhandled Rejection:', event.reason);
});

// ============================
// PERIODIC CLEANUP
// ============================

// Clean caches every hour
setInterval(() => {
    throttledOperation(() => {
        cleanupOldCaches();
    });
}, 3600000);

// Log status
console.log(`🌊 IbizaGirl.pics Service Worker ${CACHE_VERSION} loaded`);
