/**
 * content-data6.js - Unified API v4.1.0 FIXED
 * API unificada y funciones principales del sistema
 */

// ============================
// VERIFICACIÓN DE DEPENDENCIAS
// ============================

(function() {
    'use strict';
    
    // Verificar que los módulos anteriores están cargados
    const requiredModules = [
        { name: 'ContentConfig', module: 'content-data1.js' },
        { name: 'FULL_IMAGES_POOL', module: 'content-data2.js' },
        { name: 'PREMIUM_IMAGES_PART1', module: 'content-data3.js' },
        { name: 'PREMIUM_IMAGES_PART2', module: 'content-data4.js' },
        { name: 'PREMIUM_VIDEOS_POOL', module: 'content-data5.js' }
    ];
    
    const missingModules = requiredModules.filter(m => !window[m.name]);
    
    if (missingModules.length > 0) {
        console.warn('⚠️ Módulos faltantes:', missingModules.map(m => m.module));
        console.log('⏳ Esperando carga de módulos...');
    }
})();

// ============================
// CONTENT API SIMPLIFICADA
// ============================

const ContentAPI = {
    // Obtener imágenes públicas
    getPublicImages(count = 10) {
        if (!window.FULL_IMAGES_POOL) return [];
        
        if (window.ArrayUtils) {
            return window.ArrayUtils.getRandomItems(window.FULL_IMAGES_POOL, count);
        }
        
        return window.FULL_IMAGES_POOL.slice(0, count);
    },
    
    // Obtener imágenes premium
    getPremiumImages(count = 10) {
        const allPremium = [
            ...(window.PREMIUM_IMAGES_PART1 || []),
            ...(window.PREMIUM_IMAGES_PART2 || [])
        ];
        
        if (window.ArrayUtils) {
            return window.ArrayUtils.getRandomItems(allPremium, count);
        }
        
        return allPremium.slice(0, count);
    },
    
    // Obtener videos
    getVideos(count = 10) {
        if (!window.PREMIUM_VIDEOS_POOL) return [];
        
        if (window.ArrayUtils) {
            return window.ArrayUtils.getRandomItems(window.PREMIUM_VIDEOS_POOL, count);
        }
        
        return window.PREMIUM_VIDEOS_POOL.slice(0, count);
    },
    
    // Obtener banners
    getBanners() {
        if (window.BannerTeaserManager) {
            return window.BannerTeaserManager.getBanners();
        }
        
        // Fallback: buscar imágenes con 'banner' en el nombre
        return (window.FULL_IMAGES_POOL || [])
            .filter(img => img.includes('banner') || img.includes('bik'))
            .slice(0, 5);
    },
    
    // Obtener teasers
    getTeasers() {
        if (window.BannerTeaserManager) {
            return window.BannerTeaserManager.getTeasers();
        }
        
        // Fallback: buscar imágenes específicas para teasers
        return (window.FULL_IMAGES_POOL || [])
            .filter(img => img.includes('teaser') || img.includes('Sin') || img.includes('bikini'))
            .slice(0, 10);
    },
    
    // Buscar contenido
    search(query) {
        const results = {
            photos: [],
            videos: []
        };
        
        if (!query) return results;
        
        const queryLower = query.toLowerCase();
        
        // Buscar en fotos
        const allPhotos = [
            ...(window.FULL_IMAGES_POOL || []),
            ...(window.PREMIUM_IMAGES_PART1 || []),
            ...(window.PREMIUM_IMAGES_PART2 || [])
        ];
        
        results.photos = allPhotos.filter(img => 
            img.toLowerCase().includes(queryLower)
        );
        
        // Buscar en videos
        results.videos = (window.PREMIUM_VIDEOS_POOL || []).filter(video => 
            video.toLowerCase().includes(queryLower)
        );
        
        return results;
    },
    
    // Obtener estadísticas
    getStats() {
        return {
            total: this.getTotalCount(),
            public: window.FULL_IMAGES_POOL ? window.FULL_IMAGES_POOL.length : 0,
            premium: this.getPremiumCount(),
            videos: window.PREMIUM_VIDEOS_POOL ? window.PREMIUM_VIDEOS_POOL.length : 0
        };
    },
    
    // Obtener conteo total
    getTotalCount() {
        let total = 0;
        total += window.FULL_IMAGES_POOL ? window.FULL_IMAGES_POOL.length : 0;
        total += window.PREMIUM_IMAGES_PART1 ? window.PREMIUM_IMAGES_PART1.length : 0;
        total += window.PREMIUM_IMAGES_PART2 ? window.PREMIUM_IMAGES_PART2.length : 0;
        total += window.PREMIUM_VIDEOS_POOL ? window.PREMIUM_VIDEOS_POOL.length : 0;
        return total;
    },
    
    // Obtener conteo premium
    getPremiumCount() {
        let count = 0;
        count += window.PREMIUM_IMAGES_PART1 ? window.PREMIUM_IMAGES_PART1.length : 0;
        count += window.PREMIUM_IMAGES_PART2 ? window.PREMIUM_IMAGES_PART2.length : 0;
        return count;
    },
    
    // Rotar contenido
    rotate() {
        if (window.BannerTeaserManager) {
            window.BannerTeaserManager.rotateContent();
        }
        
        // Disparar evento de rotación
        if (window.EventManager) {
            window.EventManager.emit('contentRotated', {
                timestamp: Date.now()
            });
        }
        
        return true;
    }
};

// ============================
// UNIFIED CONTENT API COMPLETA
// ============================

const UnifiedContentAPI = {
    // Obtener todas las imágenes públicas
    getAllPublicImages() {
        return window.FULL_IMAGES_POOL || [];
    },
    
    // Obtener todas las imágenes premium
    getAllPremiumImages() {
        return [
            ...(window.PREMIUM_IMAGES_PART1 || []),
            ...(window.PREMIUM_IMAGES_PART2 || [])
        ];
    },
    
    // Obtener todos los videos
    getAllVideos() {
        return window.PREMIUM_VIDEOS_POOL || [];
    },
    
    // Obtener todo el contenido
    getAllContent() {
        return {
            publicImages: this.getAllPublicImages(),
            premiumImages: this.getAllPremiumImages(),
            videos: this.getAllVideos()
        };
    },
    
    // Buscar en todo el contenido
    searchAll(query) {
        if (!query) {
            return this.getAllContent();
        }
        
        const queryLower = query.toLowerCase();
        const all = this.getAllContent();
        
        return {
            publicImages: all.publicImages.filter(img => 
                img.toLowerCase().includes(queryLower)
            ),
            premiumImages: all.premiumImages.filter(img => 
                img.toLowerCase().includes(queryLower)
            ),
            videos: all.videos.filter(video => 
                video.toLowerCase().includes(queryLower)
            )
        };
    },
    
    // Obtener estadísticas del sistema
    getSystemStats() {
        const stats = {
            photos: {
                public: this.getAllPublicImages().length,
                premium: this.getAllPremiumImages().length,
                total: 0
            },
            videos: {
                total: this.getAllVideos().length
            },
            system: {
                cacheSize: 0,
                memoryUsage: 0,
                loadTime: 0
            }
        };
        
        stats.photos.total = stats.photos.public + stats.photos.premium;
        
        // Estadísticas de caché si está disponible
        if (window.CacheSystem) {
            stats.system.cacheSize = window.CacheSystem.size();
        }
        
        // Estimación de uso de memoria
        if (performance && performance.memory) {
            stats.system.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1048576);
        }
        
        // Tiempo de carga
        if (performance && performance.timing) {
            stats.system.loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        }
        
        return stats;
    },
    
    // Obtener contenido del día
    getTodaysContent() {
        const seed = window.TimeUtils ? window.TimeUtils.getDateSeed() : Date.now();
        
        // Obtener contenido mezclado con seed del día
        const publicPhotos = window.ArrayUtils 
            ? window.ArrayUtils.shuffleWithSeed(this.getAllPublicImages(), seed)
            : this.getAllPublicImages();
            
        const premiumPhotos = window.ArrayUtils
            ? window.ArrayUtils.shuffleWithSeed(this.getAllPremiumImages(), seed)
            : this.getAllPremiumImages();
            
        const videos = window.ArrayUtils
            ? window.ArrayUtils.shuffleWithSeed(this.getAllVideos(), seed)
            : this.getAllVideos();
        
        // Configuración de rotación
        const config = window.ContentConfig?.rotation || {
            dailyPhotosCount: 200,
            dailyVideosCount: 40,
            bannersCount: 5,
            teasersCount: 10
        };
        
        // Combinar fotos públicas y premium
        const allPhotos = [];
        const publicCount = Math.floor(config.dailyPhotosCount * 0.3);
        const premiumCount = config.dailyPhotosCount - publicCount;
        
        allPhotos.push(...publicPhotos.slice(0, publicCount));
        allPhotos.push(...premiumPhotos.slice(0, premiumCount));
        
        // Mezclar fotos finales
        const finalPhotos = window.ArrayUtils
            ? window.ArrayUtils.shuffleWithSeed(allPhotos, seed + 1)
            : allPhotos;
        
        return {
            photos: finalPhotos.slice(0, config.dailyPhotosCount),
            videos: videos.slice(0, config.dailyVideosCount),
            banners: ContentAPI.getBanners(),
            teasers: ContentAPI.getTeasers(),
            seed: seed,
            date: new Date()
        };
    },
    
    // Obtener contenido por página
    getContentByPage(page = 1, perPage = 30, type = 'all') {
        let content = [];
        
        switch(type) {
            case 'public':
                content = this.getAllPublicImages();
                break;
            case 'premium':
                content = this.getAllPremiumImages();
                break;
            case 'videos':
                content = this.getAllVideos();
                break;
            case 'all':
            default:
                content = [
                    ...this.getAllPublicImages(),
                    ...this.getAllPremiumImages()
                ];
        }
        
        if (window.ArrayUtils) {
            return window.ArrayUtils.paginate(content, page, perPage);
        }
        
        // Fallback pagination
        const start = (page - 1) * perPage;
        const end = start + perPage;
        
        return {
            data: content.slice(start, end),
            page,
            perPage,
            total: content.length,
            totalPages: Math.ceil(content.length / perPage),
            hasNext: end < content.length,
            hasPrev: page > 1
        };
    },
    
    // Validar contenido
    validateContent() {
        const errors = [];
        const warnings = [];
        
        // Verificar pools de contenido
        if (!window.FULL_IMAGES_POOL || window.FULL_IMAGES_POOL.length === 0) {
            errors.push('FULL_IMAGES_POOL no está disponible o está vacío');
        }
        
        if (!window.PREMIUM_IMAGES_PART1 || window.PREMIUM_IMAGES_PART1.length === 0) {
            warnings.push('PREMIUM_IMAGES_PART1 no está disponible o está vacío');
        }
        
        if (!window.PREMIUM_IMAGES_PART2 || window.PREMIUM_IMAGES_PART2.length === 0) {
            warnings.push('PREMIUM_IMAGES_PART2 no está disponible o está vacío');
        }
        
        if (!window.PREMIUM_VIDEOS_POOL || window.PREMIUM_VIDEOS_POOL.length === 0) {
            warnings.push('PREMIUM_VIDEOS_POOL no está disponible o está vacío');
        }
        
        // Verificar utilidades
        if (!window.ArrayUtils) {
            warnings.push('ArrayUtils no está disponible');
        }
        
        if (!window.TimeUtils) {
            warnings.push('TimeUtils no está disponible');
        }
        
        return {
            valid: errors.length === 0,
            errors,
            warnings,
            stats: this.getSystemStats()
        };
    },
    
    // Precargar contenido
    preloadContent(urls = []) {
        const promises = urls.map(url => {
            return new Promise((resolve, reject) => {
                if (url.endsWith('.mp4')) {
                    // Precargar video
                    const video = document.createElement('video');
                    video.preload = 'metadata';
                    video.onloadedmetadata = () => resolve(url);
                    video.onerror = () => reject(new Error(`Failed to preload video: ${url}`));
                    video.src = url;
                } else {
                    // Precargar imagen
                    const img = new Image();
                    img.onload = () => resolve(url);
                    img.onerror = () => reject(new Error(`Failed to preload image: ${url}`));
                    img.src = url;
                }
            });
        });
        
        return Promise.allSettled(promises);
    }
};

// ============================
// SISTEMA DE ROTACIÓN DIARIA
// ============================

class DailyRotationSystem {
    constructor() {
        this.lastRotation = null;
        this.currentContent = null;
        this.initialized = false;
    }
    
    initialize() {
        if (this.initialized) return;
        
        // Cargar última rotación de localStorage
        if (window.StorageUtils) {
            this.lastRotation = window.StorageUtils.load('lastRotation');
        }
        
        // Verificar si necesita rotación
        this.checkRotation();
        
        // Programar próxima rotación
        this.scheduleNextRotation();
        
        this.initialized = true;
        console.log('✅ DailyRotationSystem inicializado');
    }
    
    checkRotation() {
        const now = new Date();
        const today = now.toDateString();
        
        if (!this.lastRotation || this.lastRotation.date !== today) {
            this.rotate();
        } else {
            this.currentContent = this.lastRotation.content;
        }
    }
    
    rotate() {
        console.log('🔄 Ejecutando rotación diaria...');
        
        // Obtener nuevo contenido
        this.currentContent = UnifiedContentAPI.getTodaysContent();
        
        // Guardar rotación
        this.lastRotation = {
            date: new Date().toDateString(),
            timestamp: Date.now(),
            content: this.currentContent
        };
        
        if (window.StorageUtils) {
            window.StorageUtils.save('lastRotation', this.lastRotation);
        }
        
        // Emitir evento
        if (window.EventManager) {
            window.EventManager.emit('dailyRotation', this.currentContent);
        }
        
        console.log('✅ Rotación diaria completada');
    }
    
    scheduleNextRotation() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const msUntilMidnight = tomorrow - now;
        
        setTimeout(() => {
            this.rotate();
            this.scheduleNextRotation();
        }, msUntilMidnight);
        
        console.log(`⏰ Próxima rotación en ${Math.floor(msUntilMidnight / 3600000)} horas`);
    }
    
    getCurrentContent() {
        if (!this.currentContent) {
            this.checkRotation();
        }
        return this.currentContent;
    }
    
    forceRotation() {
        this.rotate();
        return this.currentContent;
    }
}

// ============================
// INICIALIZACIÓN Y EXPORTACIÓN
// ============================

// Crear instancia del sistema de rotación
const globalRotationSystem = new DailyRotationSystem();

// Exponer APIs globales
window.ContentAPI = ContentAPI;
window.UnifiedContentAPI = UnifiedContentAPI;
window.DailyRotationSystem = globalRotationSystem;

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        globalRotationSystem.initialize();
    });
} else {
    globalRotationSystem.initialize();
}

// Funciones helper para compatibilidad
window.getContentAPI = () => ContentAPI;
window.getUnifiedAPI = () => UnifiedContentAPI;
window.getDailyContent = () => globalRotationSystem.getCurrentContent();
window.forceRotation = () => globalRotationSystem.forceRotation();

// Log de inicialización
console.log('📦 content-data6.js v4.1.0 FIXED loaded');
console.log('   - ContentAPI disponible');
console.log('   - UnifiedContentAPI disponible');
console.log('   - DailyRotationSystem inicializado');

// Validar contenido en modo debug
if (window.ContentConfig?.debug) {
    const validation = UnifiedContentAPI.validateContent();
    
    if (validation.errors.length > 0) {
        console.error('❌ Errores de validación:', validation.errors);
    }
    
    if (validation.warnings.length > 0) {
        console.warn('⚠️ Advertencias:', validation.warnings);
    }
    
    console.log('📊 Estadísticas del sistema:', validation.stats);
}

// Exportar para módulos ES6 si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ContentAPI,
        UnifiedContentAPI,
        DailyRotationSystem: globalRotationSystem
    };
}
