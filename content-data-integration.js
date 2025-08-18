/**
 * content-data-integration.js - Integration Module v4.1.0 FIXED
 * Integra el sistema modular con main-script.js
 * Provee compatibilidad y funciones auxiliares
 */

// ============================
// VERIFICACIÓN DE DEPENDENCIAS
// ============================

(function() {
    'use strict';
    
    console.log('🔗 Iniciando módulo de integración v4.1.0...');
    
    // Verificar que los módulos anteriores están cargados
    const requiredModules = [
        'FULL_IMAGES_POOL',
        'PREMIUM_IMAGES_PART1', 
        'PREMIUM_IMAGES_PART2',
        'PREMIUM_VIDEOS_POOL',
        'ContentAPI',
        'UnifiedContentAPI'
    ];
    
    const missingModules = requiredModules.filter(module => !window[module]);
    
    if (missingModules.length > 0) {
        console.warn('⚠️ Módulos faltantes:', missingModules);
        console.log('🔄 Esperando carga de módulos...');
        
        // Reintentar después de un delay
        setTimeout(() => {
            initializeIntegration();
        }, 1000);
    } else {
        initializeIntegration();
    }
})();

// ============================
// FUNCIONES AUXILIARES PARA MAIN-SCRIPT
// ============================

/**
 * Obtiene contenido aleatorio para main-script.js
 * @param {number} photoCount - Número de fotos a obtener
 * @param {number} videoCount - Número de videos a obtener
 * @returns {Object} Contenido mezclado para renderizar
 */
function getRandomContentForMainScript(photoCount = 200, videoCount = 50) {
    try {
        // Usar ContentAPI si está disponible
        if (window.ContentAPI) {
            const publicPhotos = window.ContentAPI.getPublicImages(Math.floor(photoCount * 0.3));
            const premiumPhotos = window.ContentAPI.getPremiumImages(Math.floor(photoCount * 0.7));
            const videos = window.ContentAPI.getVideos(videoCount);
            
            return {
                photos: [...publicPhotos, ...premiumPhotos].sort(() => Math.random() - 0.5),
                videos: videos,
                banners: window.ContentAPI.getBanners(),
                teasers: window.ContentAPI.getTeasers()
            };
        }
        
        // Fallback si ContentAPI no está disponible
        console.warn('⚠️ ContentAPI no disponible, usando arrays directos');
        return {
            photos: [...(window.FULL_IMAGES_POOL || [])].slice(0, photoCount),
            videos: [...(window.PREMIUM_VIDEOS_POOL || [])].slice(0, videoCount),
            banners: [],
            teasers: []
        };
        
    } catch (error) {
        console.error('❌ Error obteniendo contenido aleatorio:', error);
        return {
            photos: [],
            videos: [],
            banners: [],
            teasers: []
        };
    }
}

/**
 * Genera la rotación diaria de contenido
 * @returns {Object} Contenido del día con estadísticas
 */
function generateDailyRotationForMainScript() {
    try {
        const now = new Date();
        const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
        
        // Usar UnifiedContentAPI si está disponible
        if (window.UnifiedContentAPI) {
            const dailyContent = window.UnifiedContentAPI.getTodaysContent();
            
            // Agregar índices de contenido nuevo
            const newPhotoIndices = new Set();
            const newVideoIndices = new Set();
            
            // Marcar primeras 10 fotos y 5 videos como nuevos
            for (let i = 0; i < Math.min(10, dailyContent.photos.length); i++) {
                newPhotoIndices.add(i);
            }
            for (let i = 0; i < Math.min(5, dailyContent.videos.length); i++) {
                newVideoIndices.add(i);
            }
            
            return {
                ...dailyContent,
                newPhotoIndices,
                newVideoIndices,
                lastUpdate: now,
                dayOfYear,
                stats: {
                    dailyPhotos: dailyContent.photos.length,
                    dailyVideos: dailyContent.videos.length,
                    newPhotos: newPhotoIndices.size,
                    newVideos: newVideoIndices.size
                }
            };
        }
        
        // Fallback con rotación básica
        console.warn('⚠️ UnifiedContentAPI no disponible, usando rotación básica');
        
        const allPhotos = [
            ...(window.FULL_IMAGES_POOL || []),
            ...(window.PREMIUM_IMAGES_PART1 || []),
            ...(window.PREMIUM_IMAGES_PART2 || [])
        ];
        
        const allVideos = window.PREMIUM_VIDEOS_POOL || [];
        
        // Rotar basado en el día del año
        const photoStartIndex = (dayOfYear * 50) % allPhotos.length;
        const videoStartIndex = (dayOfYear * 10) % allVideos.length;
        
        const dailyPhotos = [];
        const dailyVideos = [];
        
        // Obtener 200 fotos rotadas
        for (let i = 0; i < 200 && i < allPhotos.length; i++) {
            const index = (photoStartIndex + i) % allPhotos.length;
            dailyPhotos.push(allPhotos[index]);
        }
        
        // Obtener 40 videos rotados
        for (let i = 0; i < 40 && i < allVideos.length; i++) {
            const index = (videoStartIndex + i) % allVideos.length;
            dailyVideos.push(allVideos[index]);
        }
        
        return {
            photos: dailyPhotos,
            videos: dailyVideos,
            banners: (window.BANNER_IMAGES || []).slice(0, 5),
            teasers: (window.TEASER_IMAGES || []).slice(0, 10),
            newPhotoIndices: new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
            newVideoIndices: new Set([0, 1, 2, 3, 4]),
            lastUpdate: now,
            dayOfYear,
            stats: {
                dailyPhotos: dailyPhotos.length,
                dailyVideos: dailyVideos.length,
                newPhotos: 10,
                newVideos: 5
            }
        };
        
    } catch (error) {
        console.error('❌ Error generando rotación diaria:', error);
        return {
            photos: [],
            videos: [],
            banners: [],
            teasers: [],
            newPhotoIndices: new Set(),
            newVideoIndices: new Set(),
            lastUpdate: new Date(),
            stats: {
                dailyPhotos: 0,
                dailyVideos: 0,
                newPhotos: 0,
                newVideos: 0
            }
        };
    }
}

/**
 * Obtiene estadísticas del contenido
 * @returns {Object} Estadísticas detalladas
 */
function getContentStats() {
    try {
        if (window.UnifiedContentAPI) {
            return window.UnifiedContentAPI.getSystemStats();
        }
        
        // Calcular estadísticas manualmente
        const stats = {
            totalPhotos: 0,
            publicPhotos: 0,
            premiumPhotos: 0,
            totalVideos: 0,
            banners: 0,
            teasers: 0
        };
        
        if (window.FULL_IMAGES_POOL) {
            stats.publicPhotos = window.FULL_IMAGES_POOL.length;
            stats.totalPhotos += stats.publicPhotos;
        }
        
        if (window.PREMIUM_IMAGES_PART1) {
            stats.premiumPhotos += window.PREMIUM_IMAGES_PART1.length;
        }
        
        if (window.PREMIUM_IMAGES_PART2) {
            stats.premiumPhotos += window.PREMIUM_IMAGES_PART2.length;
        }
        
        stats.totalPhotos += stats.premiumPhotos;
        
        if (window.PREMIUM_VIDEOS_POOL) {
            stats.totalVideos = window.PREMIUM_VIDEOS_POOL.length;
        }
        
        if (window.BANNER_IMAGES) {
            stats.banners = window.BANNER_IMAGES.length;
        }
        
        if (window.TEASER_IMAGES) {
            stats.teasers = window.TEASER_IMAGES.length;
        }
        
        return stats;
        
    } catch (error) {
        console.error('❌ Error obteniendo estadísticas:', error);
        return {
            totalPhotos: 0,
            publicPhotos: 0,
            premiumPhotos: 0,
            totalVideos: 0,
            banners: 0,
            teasers: 0
        };
    }
}

// ============================
// INTEGRADOR DE CONTENIDO
// ============================

class ContentIntegrator {
    constructor() {
        this.initialized = false;
        this.contentReady = false;
        this.callbacks = [];
    }
    
    /**
     * Verifica si todo el contenido está listo
     */
    checkContentReady() {
        const required = [
            'FULL_IMAGES_POOL',
            'PREMIUM_IMAGES_PART1',
            'PREMIUM_IMAGES_PART2',
            'PREMIUM_VIDEOS_POOL',
            'ContentAPI',
            'UnifiedContentAPI'
        ];
        
        return required.every(module => window[module]);
    }
    
    /**
     * Espera hasta que el contenido esté listo
     */
    waitForContent(callback) {
        if (this.contentReady) {
            callback();
            return;
        }
        
        this.callbacks.push(callback);
        
        if (!this.checking) {
            this.startChecking();
        }
    }
    
    /**
     * Inicia el proceso de verificación
     */
    startChecking() {
        this.checking = true;
        let attempts = 0;
        const maxAttempts = 50;
        
        const checkInterval = setInterval(() => {
            attempts++;
            
            if (this.checkContentReady()) {
                clearInterval(checkInterval);
                this.contentReady = true;
                this.checking = false;
                
                console.log('✅ Todo el contenido está listo');
                
                // Ejecutar callbacks
                this.callbacks.forEach(cb => cb());
                this.callbacks = [];
                
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                this.checking = false;
                
                console.error('❌ Timeout esperando contenido');
                
                // Ejecutar callbacks de todos modos
                this.callbacks.forEach(cb => cb());
                this.callbacks = [];
            }
        }, 100);
    }
    
    /**
     * Crea arrays globales para compatibilidad
     */
    createGlobalArrays() {
        // Crear ALL_PHOTOS_POOL combinado
        if (!window.ALL_PHOTOS_POOL) {
            window.ALL_PHOTOS_POOL = [
                ...(window.FULL_IMAGES_POOL || []),
                ...(window.PREMIUM_IMAGES_PART1 || []),
                ...(window.PREMIUM_IMAGES_PART2 || [])
            ];
            console.log(`📦 ALL_PHOTOS_POOL creado: ${window.ALL_PHOTOS_POOL.length} fotos`);
        }
        
        // Crear ALL_VIDEOS_POOL alias
        if (!window.ALL_VIDEOS_POOL && window.PREMIUM_VIDEOS_POOL) {
            window.ALL_VIDEOS_POOL = window.PREMIUM_VIDEOS_POOL;
            console.log(`📦 ALL_VIDEOS_POOL creado: ${window.ALL_VIDEOS_POOL.length} videos`);
        }
        
        // Crear BANNER_IMAGES si no existe
        if (!window.BANNER_IMAGES) {
            if (window.BannerTeaserManager) {
                window.BANNER_IMAGES = window.BannerTeaserManager.getBanners();
            } else {
                window.BANNER_IMAGES = (window.FULL_IMAGES_POOL || [])
                    .filter(img => img.includes('banner') || img.includes('bik'))
                    .slice(0, 5);
            }
            console.log(`📦 BANNER_IMAGES creado: ${window.BANNER_IMAGES.length} banners`);
        }
        
        // Crear TEASER_IMAGES si no existe
        if (!window.TEASER_IMAGES) {
            if (window.BannerTeaserManager) {
                window.TEASER_IMAGES = window.BannerTeaserManager.getTeasers();
            } else {
                window.TEASER_IMAGES = (window.FULL_IMAGES_POOL || [])
                    .filter(img => img.includes('teaser') || img.includes('Sin'))
                    .slice(0, 10);
            }
            console.log(`📦 TEASER_IMAGES creado: ${window.TEASER_IMAGES.length} teasers`);
        }
    }
    
    /**
     * Obtiene estadísticas del contenido
     */
    getContentStats() {
        return getContentStats();
    }
}

// ============================
// SISTEMA DE INICIALIZACIÓN
// ============================

class IntegrationSystem {
    constructor() {
        this.contentIntegrator = new ContentIntegrator();
        this.initialized = false;
        this.initializationAttempts = 0;
        this.maxInitAttempts = 3;
    }
    
    /**
     * Inicializa el sistema de integración
     */
    initialize() {
        if (this.initialized) {
            console.log('⚠️ Sistema ya inicializado');
            return true;
        }
        
        console.log('🚀 Inicializando sistema de integración...');
        
        try {
            // Verificar dependencias
            if (!this.contentIntegrator.checkContentReady()) {
                console.log('⏳ Esperando módulos de contenido...');
                
                this.contentIntegrator.waitForContent(() => {
                    this.completeInitialization();
                });
                
                return false;
            }
            
            return this.completeInitialization();
            
        } catch (error) {
            this.handleInitializationError(error);
            return false;
        }
    }
    
    /**
     * Completa la inicialización
     */
    completeInitialization() {
        try {
            // Crear arrays globales
            this.contentIntegrator.createGlobalArrays();
            
            // Exponer funciones auxiliares
            this.exposeHelperFunctions();
            
            // Verificar compatibilidad
            this.verifyMainScriptCompatibility();
            
            this.initialized = true;
            
            console.log('🎉 Sistema de integración inicializado exitosamente');
            console.log('📊 Estadísticas:', this.contentIntegrator.getContentStats());
            
            return true;
            
        } catch (error) {
            this.handleInitializationError(error);
            return false;
        }
    }
    
    /**
     * Maneja errores de inicialización
     */
    handleInitializationError(error) {
        this.initializationAttempts++;
        console.error(`❌ Error en inicialización (intento ${this.initializationAttempts}):`, error);
        
        if (this.initializationAttempts < this.maxInitAttempts) {
            console.log(`🔄 Reintentando inicialización en 2 segundos...`);
            setTimeout(() => this.initialize(), 2000);
        } else {
            console.error('💥 No se pudo inicializar el sistema después de varios intentos');
            this.initializeFallbackMode();
        }
    }
    
    /**
     * Expone funciones auxiliares globalmente
     */
    exposeHelperFunctions() {
        window.getRandomContentForMainScript = getRandomContentForMainScript;
        window.generateDailyRotationForMainScript = generateDailyRotationForMainScript;
        window.getContentStats = getContentStats;
        
        console.log('🔗 Funciones auxiliares expuestas globalmente');
    }
    
    /**
     * Verifica compatibilidad con main-script.js
     */
    verifyMainScriptCompatibility() {
        const requiredGlobals = [
            'ALL_PHOTOS_POOL',
            'ALL_VIDEOS_POOL',
            'BANNER_IMAGES',
            'TEASER_IMAGES'
        ];
        
        const missingGlobals = requiredGlobals.filter(global => !window[global]);
        
        if (missingGlobals.length > 0) {
            console.warn('⚠️ Variables globales faltantes:', missingGlobals);
            this.createFallbackGlobals();
        } else {
            console.log('✅ Compatibilidad con main-script.js verificada');
        }
    }
    
    /**
     * Crea variables globales de fallback
     */
    createFallbackGlobals() {
        if (!window.ALL_PHOTOS_POOL) {
            window.ALL_PHOTOS_POOL = [
                'full/bikini.webp',
                'full/bikini3.webp',
                'full/bikini5.webp',
                'full/backbikini.webp',
                'full/bikbanner.webp',
                'full/bikbanner2.webp'
            ];
            console.log('📦 ALL_PHOTOS_POOL fallback creado');
        }
        
        if (!window.ALL_VIDEOS_POOL) {
            window.ALL_VIDEOS_POOL = [];
            console.log('📦 ALL_VIDEOS_POOL fallback creado');
        }
        
        if (!window.BANNER_IMAGES) {
            window.BANNER_IMAGES = [
                'full/bikbanner.webp',
                'full/bikbanner2.webp'
            ];
            console.log('📦 BANNER_IMAGES fallback creado');
        }
        
        if (!window.TEASER_IMAGES) {
            window.TEASER_IMAGES = [
                'full/bikini.webp',
                'full/bikini3.webp',
                'full/bikini5.webp'
            ];
            console.log('📦 TEASER_IMAGES fallback creado');
        }
    }
    
    /**
     * Modo fallback cuando falla la inicialización
     */
    initializeFallbackMode() {
        console.log('🆘 Activando modo fallback...');
        
        // Crear todas las variables necesarias con contenido mínimo
        this.createFallbackGlobals();
        
        // Crear APIs mínimas
        if (!window.ContentAPI) {
            window.ContentAPI = {
                getPublicImages: (count) => window.ALL_PHOTOS_POOL.slice(0, count),
                getPremiumImages: (count) => [],
                getVideos: (count) => [],
                getBanners: () => window.BANNER_IMAGES,
                getTeasers: () => window.TEASER_IMAGES,
                search: () => ({ photos: [], videos: [] }),
                getStats: () => ({ total: 6, public: 6, premium: 0, videos: 0 })
            };
        }
        
        if (!window.UnifiedContentAPI) {
            window.UnifiedContentAPI = {
                getAllPublicImages: () => window.ALL_PHOTOS_POOL,
                getAllPremiumImages: () => [],
                getAllVideos: () => [],
                searchAll: () => ({ photos: [], videos: [] }),
                getSystemStats: () => ({ photos: 6, videos: 0 }),
                getTodaysContent: () => ({
                    photos: window.ALL_PHOTOS_POOL,
                    videos: [],
                    banners: window.BANNER_IMAGES,
                    teasers: window.TEASER_IMAGES
                })
            };
        }
        
        // Exponer funciones auxiliares
        this.exposeHelperFunctions();
        
        console.log('✅ Modo fallback activado');
    }
}

// ============================
// INICIALIZACIÓN GLOBAL
// ============================

function initializeIntegration() {
    console.log('🎯 Iniciando integración del sistema modular...');
    
    // Crear sistema de integración
    const integrationSystem = new IntegrationSystem();
    
    // Exponer globalmente para debugging
    window.IntegrationSystem = integrationSystem;
    
    // Inicializar
    const success = integrationSystem.initialize();
    
    if (success) {
        console.log('✅ content-data-integration.js v4.1.0 FIXED - Integración completa');
    } else {
        console.log('⏳ content-data-integration.js v4.1.0 FIXED - Integración en proceso...');
    }
}

// Log de confirmación de carga
console.log('📦 content-data-integration.js v4.1.0 FIXED cargado');
