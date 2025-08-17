// ============================
// CONTENT DATA 6 - FUNCIONES PRINCIPALES v4.1.0
// API unificada y funciones principales del sistema
// ============================

'use strict';

// ============================
// VERIFICADOR DE DEPENDENCIAS
// ============================
class DependencyChecker {
    constructor() {
        this.requiredDependencies = [
            'ContentConfig',
            'TimeUtils', 
            'ArrayUtils',
            'ContentManager',
            'BannerTeaserManager',
            'FULL_IMAGES_POOL',
            'PREMIUM_IMAGES_PART1',
            'PREMIUM_IMAGES_PART2',
            'PREMIUM_VIDEOS_POOL'
        ];
        this.loadedDependencies = new Set();
        this.retryCount = 0;
        this.maxRetries = 10;
    }
    
    // Verificar si todas las dependencias están cargadas
    checkDependencies() {
        this.loadedDependencies.clear();
        
        this.requiredDependencies.forEach(dep => {
            if (window[dep] !== undefined) {
                this.loadedDependencies.add(dep);
            }
        });
        
        const allLoaded = this.loadedDependencies.size === this.requiredDependencies.length;
        
        if (!allLoaded) {
            const missing = this.requiredDependencies.filter(dep => !this.loadedDependencies.has(dep));
            console.warn(`⚠️ Dependencias faltantes: ${missing.join(', ')}`);
            
            if (this.retryCount < this.maxRetries) {
                this.retryCount++;
                setTimeout(() => this.checkDependencies(), 200);
                return false;
            } else {
                console.error('❌ No se pudieron cargar todas las dependencias después de varios intentos');
                return false;
            }
        }
        
        console.log('✅ Todas las dependencias cargadas correctamente');
        return true;
    }
    
    // Obtener estado de dependencias
    getDependencyStatus() {
        return {
            required: this.requiredDependencies.length,
            loaded: this.loadedDependencies.size,
            missing: this.requiredDependencies.filter(dep => !this.loadedDependencies.has(dep)),
            allLoaded: this.loadedDependencies.size === this.requiredDependencies.length
        };
    }
}

// ============================
// API UNIFICADA DEL SISTEMA
// ============================
class UnifiedContentAPI {
    constructor() {
        this.initialized = false;
        this.dependencyChecker = new DependencyChecker();
    }
    
    // Inicializar API
    async initialize() {
        console.log('🚀 Inicializando UnifiedContentAPI...');
        
        // Esperar a que las dependencias se carguen
        const dependenciesLoaded = await this.waitForDependencies();
        
        if (!dependenciesLoaded) {
            console.error('❌ Error: No se pudieron cargar las dependencias necesarias');
            return false;
        }
        
        this.initialized = true;
        console.log('✅ UnifiedContentAPI inicializada correctamente');
        
        // Configurar event listeners
        this.setupEventListeners();
        
        return true;
    }
    
    // Esperar a que se carguen las dependencias
    waitForDependencies() {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (this.dependencyChecker.checkDependencies()) {
                    clearInterval(checkInterval);
                    resolve(true);
                } else if (this.dependencyChecker.retryCount >= this.dependencyChecker.maxRetries) {
                    clearInterval(checkInterval);
                    resolve(false);
                }
            }, 200);
        });
    }
    
    // Configurar event listeners
    setupEventListeners() {
        // Listener para rotación de contenido
        window.addEventListener('contentRotated', (event) => {
            console.log('🔄 Contenido rotado:', event.detail);
        });
        
        // Listener para upgrade premium
        window.addEventListener('premiumUpgrade', (event) => {
            console.log('🎉 Premium upgrade:', event.detail);
        });
    }
    
    // ============================
    // FUNCIONES PRINCIPALES DE IMÁGENES
    // ============================
    
    // Obtener todas las imágenes públicas
    getAllPublicImages() {
        this.ensureInitialized();
        return window.FULL_IMAGES_POOL ? [...window.FULL_IMAGES_POOL] : [];
    }
    
    // Obtener todas las imágenes premium
    getAllPremiumImages() {
        this.ensureInitialized();
        const part1 = window.PREMIUM_IMAGES_PART1 || [];
        const part2 = window.PREMIUM_IMAGES_PART2 || [];
        return [...part1, ...part2];
    }
    
    // Obtener imágenes aleatorias públicas
    getRandomPublicImages(count = 10) {
        this.ensureInitialized();
        const images = this.getAllPublicImages();
        return window.ArrayUtils.getRandomItems(images, count);
    }
    
    // Obtener imágenes aleatorias premium
    getRandomPremiumImages(count = 10) {
        this.ensureInitialized();
        const images = this.getAllPremiumImages();
        return window.ArrayUtils.getRandomItems(images, count);
    }
    
    // ============================
    // FUNCIONES DE BANNERS Y TEASERS
    // ============================
    
    // Obtener banners actuales
    getCurrentBanners() {
        this.ensureInitialized();
        return window.BannerTeaserManager ? window.BannerTeaserManager.getBanners() : [];
    }
    
    // Obtener teasers actuales
    getCurrentTeasers() {
        this.ensureInitialized();
        return window.BannerTeaserManager ? window.BannerTeaserManager.getTeasers() : [];
    }
    
    // Rotar banners y teasers manualmente
    rotateBannersAndTeasers() {
        this.ensureInitialized();
        if (window.BannerTeaserManager) {
            window.BannerTeaserManager.rotateContent();
            return true;
        }
        return false;
    }
    
    // ============================
    // FUNCIONES DE VIDEOS
    // ============================
    
    // Obtener todos los videos
    getAllVideos() {
        this.ensureInitialized();
        if (window.VideoContentManager) {
            return window.VideoContentManager.getAllVideos();
        }
        return window.PREMIUM_VIDEOS_POOL ? [...window.PREMIUM_VIDEOS_POOL] : [];
    }
    
    // Obtener videos aleatorios
    getRandomVideos(count = 5) {
        this.ensureInitialized();
        if (window.VideoContentManager) {
            return window.VideoContentManager.getRandomVideos(count);
        }
        const videos = this.getAllVideos();
        return window.ArrayUtils.getRandomItems(videos, count);
    }
    
    // Verificar acceso a videos
    checkVideoAccess() {
        this.ensureInitialized();
        return window.VideoContentManager ? window.VideoContentManager.accessLevel : 'guest';
    }
    
    // ============================
    // FUNCIONES DE BÚSQUEDA
    // ============================
    
    // Buscar en todo el contenido
    searchAll(query) {
        this.ensureInitialized();
        const results = {
            publicImages: this.searchPublicImages(query),
            premiumImages: this.searchPremiumImages(query),
            videos: this.searchVideos(query)
        };
        
        results.total = results.publicImages.length + results.premiumImages.length + results.videos.length;
        return results;
    }
    
    // Buscar imágenes públicas
    searchPublicImages(query) {
        const images = this.getAllPublicImages();
        if (!query) return images;
        const queryLower = query.toLowerCase();
        return images.filter(img => img.toLowerCase().includes(queryLower));
    }
    
    // Buscar imágenes premium
    searchPremiumImages(query) {
        const images = this.getAllPremiumImages();
        if (!query) return images;
        const queryLower = query.toLowerCase();
        return images.filter(img => img.toLowerCase().includes(queryLower));
    }
    
    // Buscar videos
    searchVideos(query) {
        const videos = this.getAllVideos();
        if (!query) return videos;
        const queryLower = query.toLowerCase();
        return videos.filter(video => video.toLowerCase().includes(queryLower));
    }
    
    // ============================
    // FUNCIONES DE ESTADÍSTICAS
    // ============================
    
    // Obtener estadísticas completas del sistema
    getSystemStats() {
        this.ensureInitialized();
        
        const publicImages = this.getAllPublicImages();
        const premiumImages = this.getAllPremiumImages();
        const videos = this.getAllVideos();
        const banners = this.getCurrentBanners();
        const teasers = this.getCurrentTeasers();
        
        return {
            system: {
                version: window.ContentConfig?.version || '4.1.0',
                initialized: this.initialized,
                lastUpdate: new Date().toISOString()
            },
            content: {
                publicImages: publicImages.length,
                premiumImages: premiumImages.length,
                totalImages: publicImages.length + premiumImages.length,
                videos: videos.length,
                banners: banners.length,
                teasers: teasers.length
            },
            access: {
                videoAccess: this.checkVideoAccess(),
                premiumContent: this.checkVideoAccess() !== 'guest'
            },
            dependencies: this.dependencyChecker.getDependencyStatus()
        };
    }
    
    // ============================
    // FUNCIONES DE CONTENIDO DINÁMICO
    // ============================
    
    // Obtener contenido "nuevo" del día
    getTodaysContent() {
        this.ensureInitialized();
        const seed = window.TimeUtils.getDailySeed();
        
        return {
            newPublicImages: window.ArrayUtils.getRandomItems(this.getAllPublicImages(), 20, seed),
            newPremiumImages: window.ArrayUtils.getRandomItems(this.getAllPremiumImages(), 15, seed + 100),
            newVideos: window.ArrayUtils.getRandomItems(this.getAllVideos(), 10, seed + 200),
            date: new Date().toDateString()
        };
    }
    
    // Obtener contenido destacado
    getFeaturedContent() {
        this.ensureInitialized();
        const seed = Date.now();
        
        return {
            featuredBanner: this.getCurrentBanners()[0],
            featuredImages: window.ArrayUtils.getRandomItems(this.getAllPublicImages(), 6, seed),
            featuredPremium: window.ArrayUtils.getRandomItems(this.getAllPremiumImages(), 4, seed + 300),
            featuredVideos: window.ArrayUtils.getRandomItems(this.getAllVideos(), 3, seed + 400)
        };
    }
    
    // ============================
    // FUNCIONES DE UTILIDAD
    // ============================
    
    // Verificar si la API está inicializada
    ensureInitialized() {
        if (!this.initialized) {
            console.warn('⚠️ UnifiedContentAPI no está inicializada. Inicializando...');
            this.initialize();
        }
    }
    
    // Obtener configuración actual
    getConfig() {
        return window.ContentConfig || {};
    }
    
    // Verificar estado del sistema
    getSystemHealth() {
        const stats = this.getSystemStats();
        const issues = [];
        
        if (stats.content.publicImages === 0) issues.push('No hay imágenes públicas');
        if (stats.content.premiumImages === 0) issues.push('No hay imágenes premium');
        if (stats.content.videos === 0) issues.push('No hay videos');
        if (stats.content.banners === 0) issues.push('No hay banners generados');
        if (!stats.dependencies.allLoaded) issues.push('Dependencias faltantes');
        
        return {
            healthy: issues.length === 0,
            issues: issues,
            score: Math.max(0, 100 - (issues.length * 20))
        };
    }
}

// ============================
// FUNCIONES LEGACY PARA COMPATIBILIDAD
// ============================
const LegacyAPI = {
    // Funciones antiguas mantenidas por compatibilidad
    getAllPhotos() {
        return unifiedAPI.getAllPublicImages();
    },
    
    getAllUncensoredPhotos() {
        return unifiedAPI.getAllPremiumImages();
    },
    
    getAllVideos() {
        return unifiedAPI.getAllVideos();
    },
    
    getRandomPhotos(count) {
        return unifiedAPI.getRandomPublicImages(count);
    },
    
    getRandomUncensoredPhotos(count) {
        return unifiedAPI.getRandomPremiumImages(count);
    },
    
    getRandomVideos(count) {
        return unifiedAPI.getRandomVideos(count);
    },
    
    getBannerImages() {
        return unifiedAPI.getCurrentBanners();
    },
    
    getTeaserImages() {
        return unifiedAPI.getCurrentTeasers();
    },
    
    rotateBannersAndTeasers() {
        return unifiedAPI.rotateBannersAndTeasers();
    },
    
    getContentStats() {
        return unifiedAPI.getSystemStats();
    },
    
    getTodaysNewContent() {
        return unifiedAPI.getTodaysContent();
    }
};

// ============================
// INICIALIZACIÓN Y EXPORTACIÓN
// ============================
const unifiedAPI = new UnifiedContentAPI();

// Exponer APIs globales
window.UnifiedContentAPI = unifiedAPI;
window.DependencyChecker = DependencyChecker;

// Exponer funciones legacy
Object.assign(window, LegacyAPI);

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        await unifiedAPI.initialize();
    });
} else {
    unifiedAPI.initialize();
}

// ============================
// FUNCIONES PRINCIPALES PARA LA UI
// ============================
window.ContentAPI = {
    // API simplificada para uso en la UI
    getPublicImages: (count) => unifiedAPI.getRandomPublicImages(count),
    getPremiumImages: (count) => unifiedAPI.getRandomPremiumImages(count),
    getVideos: (count) => unifiedAPI.getRandomVideos(count),
    getBanners: () => unifiedAPI.getCurrentBanners(),
    getTeasers: () => unifiedAPI.getCurrentTeasers(),
    search: (query) => unifiedAPI.searchAll(query),
    getStats: () => unifiedAPI.getSystemStats(),
    getTodayContent: () => unifiedAPI.getTodaysContent(),
    getFeatured: () => unifiedAPI.getFeaturedContent(),
    rotate: () => unifiedAPI.rotateBannersAndTeasers(),
    getHealth: () => unifiedAPI.getSystemHealth()
};

// ============================
// HERRAMIENTAS DE DEBUGGING
// ============================
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.ContentDebug = {
        // Herramientas de debugging para desarrollo
        logStats() {
            console.table(unifiedAPI.getSystemStats());
        },
        
        logHealth() {
            console.log('🏥 System Health:', unifiedAPI.getSystemHealth());
        },
        
        testRotation() {
            console.log('🔄 Testing rotation...');
            const beforeBanners = unifiedAPI.getCurrentBanners();
            unifiedAPI.rotateBannersAndTeasers();
            const afterBanners = unifiedAPI.getCurrentBanners();
            console.log('Before:', beforeBanners[0]);
            console.log('After:', afterBanners[0]);
        },
        
        simulatePremium() {
            if (window.VideoContentManager) {
                window.VideoContentManager.upgradeToPremium();
                console.log('🎉 Premium access simulated');
            }
        },
        
        inspectDependencies() {
            console.table(unifiedAPI.dependencyChecker.getDependencyStatus());
        }
    };
    
    console.log('🐛 ContentDebug tools available');
}

console.log('📦 content-data6.js cargado - API unificada disponible');
console.log('🎯 Usar window.ContentAPI para acceso simplificado');
console.log('🔧 Usar window.UnifiedContentAPI para acceso completo');
