/**
 * content-data-integration.js - Integration Module v4.1.0 FIXED
 * Integra el sistema modular con main-script.js
 * Provee compatibilidad y funciones auxiliares
 */

(function() {
    'use strict';
    
    console.log('🔗 Iniciando módulo de integración v4.1.0...');
    
    // ============================
    // CLASE INTEGRATION SYSTEM
    // ============================
    class IntegrationSystem {
        constructor() {
            this.initialized = false;
            this.initializationAttempts = 0;
            this.maxInitAttempts = 3;
        }
        
        /**
         * Verificar módulos cargados
         */
        checkModules() {
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
                return false;
            }
            
            console.log('✅ Todos los módulos requeridos están cargados');
            return true;
        }
        
        /**
         * Crear arrays globales para compatibilidad
         */
        createGlobalArrays() {
            // Crear ALL_PHOTOS_POOL combinando todas las imágenes
            if (!window.ALL_PHOTOS_POOL) {
                window.ALL_PHOTOS_POOL = [
                    ...(window.FULL_IMAGES_POOL || []),
                    ...(window.PREMIUM_IMAGES_PART1 || []),
                    ...(window.PREMIUM_IMAGES_PART2 || [])
                ];
                console.log(`📸 ALL_PHOTOS_POOL creado con ${window.ALL_PHOTOS_POOL.length} imágenes`);
            }
            
            // Crear ALL_VIDEOS_POOL
            if (!window.ALL_VIDEOS_POOL) {
                window.ALL_VIDEOS_POOL = window.PREMIUM_VIDEOS_POOL || [];
                console.log(`🎬 ALL_VIDEOS_POOL creado con ${window.ALL_VIDEOS_POOL.length} videos`);
            }
            
            // Asegurar que existen los arrays de banners y teasers
            if (!window.BANNER_IMAGES) {
                window.BANNER_IMAGES = window.BannerTeaserManager ? 
                    window.BannerTeaserManager.getBanners() : 
                    ['bikini.webp', 'bikini3.webp', 'bikini5.webp'];
            }
            
            if (!window.TEASER_IMAGES) {
                window.TEASER_IMAGES = window.BannerTeaserManager ? 
                    window.BannerTeaserManager.getTeasers() : 
                    ['bikini.webp', 'bikini3.webp', 'bikini5.webp'];
            }
        }
        
        /**
         * Exponer funciones auxiliares para main-script
         */
        exposeHelperFunctions() {
            // Función para obtener contenido aleatorio
            window.getRandomContentForMainScript = function(photoCount = 200, videoCount = 50) {
                try {
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
                        photos: [...(window.ALL_PHOTOS_POOL || [])].slice(0, photoCount),
                        videos: [...(window.ALL_VIDEOS_POOL || [])].slice(0, videoCount),
                        banners: window.BANNER_IMAGES || [],
                        teasers: window.TEASER_IMAGES || []
                    };
                } catch (error) {
                    console.error('❌ Error en getRandomContentForMainScript:', error);
                    return {
                        photos: [],
                        videos: [],
                        banners: [],
                        teasers: []
                    };
                }
            };
            
            // Función para generar rotación diaria
            window.generateDailyRotationForMainScript = function() {
                try {
                    if (window.UnifiedContentAPI && window.UnifiedContentAPI.initialized) {
                        return window.UnifiedContentAPI.getTodaysContent();
                    }
                    
                    // Fallback
                    const content = window.getRandomContentForMainScript();
                    return {
                        photos: content.photos,
                        videos: content.videos,
                        banners: content.banners,
                        teasers: content.teasers,
                        newPhotoIndices: new Set([0, 1, 2, 3, 4]),
                        newVideoIndices: new Set([0, 1, 2]),
                        lastUpdate: new Date(),
                        stats: {
                            totalPhotosPool: (window.ALL_PHOTOS_POOL || []).length,
                            totalVideosPool: (window.ALL_VIDEOS_POOL || []).length,
                            dailyPhotos: content.photos.length,
                            dailyVideos: content.videos.length,
                            newPhotos: 5,
                            newVideos: 3
                        }
                    };
                } catch (error) {
                    console.error('❌ Error en generateDailyRotationForMainScript:', error);
                    return {
                        photos: [],
                        videos: [],
                        banners: [],
                        teasers: [],
                        newPhotoIndices: new Set(),
                        newVideoIndices: new Set(),
                        lastUpdate: new Date(),
                        stats: {
                            totalPhotosPool: 0,
                            totalVideosPool: 0,
                            dailyPhotos: 0,
                            dailyVideos: 0,
                            newPhotos: 0,
                            newVideos: 0
                        }
                    };
                }
            };
            
            // Función para obtener estadísticas
            window.getContentStats = function() {
                return {
                    totalPhotos: (window.ALL_PHOTOS_POOL || []).length,
                    totalVideos: (window.ALL_VIDEOS_POOL || []).length,
                    publicPhotos: (window.FULL_IMAGES_POOL || []).length,
                    premiumPhotos: ((window.PREMIUM_IMAGES_PART1 || []).length + (window.PREMIUM_IMAGES_PART2 || []).length),
                    banners: (window.BANNER_IMAGES || []).length,
                    teasers: (window.TEASER_IMAGES || []).length
                };
            };
            
            console.log('✅ Funciones auxiliares expuestas globalmente');
        }
        
        /**
         * Inicializar el sistema
         */
        initialize() {
            if (this.initialized) {
                console.log('⚠️ Sistema ya inicializado');
                return true;
            }
            
            console.log('🚀 Inicializando sistema de integración...');
            
            try {
                // Verificar módulos
                if (!this.checkModules()) {
                    this.initializationAttempts++;
                    
                    if (this.initializationAttempts < this.maxInitAttempts) {
                        console.log(`🔄 Reintentando en 1 segundo... (intento ${this.initializationAttempts}/${this.maxInitAttempts})`);
                        setTimeout(() => this.initialize(), 1000);
                        return false;
                    } else {
                        console.error('❌ No se pudieron cargar todos los módulos después de varios intentos');
                        this.initializeFallback();
                        return false;
                    }
                }
                
                // Crear arrays globales
                this.createGlobalArrays();
                
                // Exponer funciones
                this.exposeHelperFunctions();
                
                // Marcar como inicializado
                this.initialized = true;
                
                console.log('✅ Sistema de integración inicializado correctamente');
                console.log('📊 Estadísticas:', window.getContentStats());
                
                // Disparar evento de sistema listo
                window.dispatchEvent(new CustomEvent('contentSystemReady', {
                    detail: {
                        initialized: true,
                        stats: window.getContentStats()
                    }
                }));
                
                return true;
                
            } catch (error) {
                console.error('❌ Error durante la inicialización:', error);
                this.initializeFallback();
                return false;
            }
        }
        
        /**
         * Modo fallback si falla la inicialización
         */
        initializeFallback() {
            console.log('🆘 Activando modo fallback...');
            
            // Crear arrays mínimos
            window.ALL_PHOTOS_POOL = window.ALL_PHOTOS_POOL || [
                'full/bikini.webp',
                'full/bikbanner.webp',
                'full/bikbanner2.webp',
                'full/backbikini.webp',
                'full/bikini3.webp',
                'full/bikini5.webp'
            ];
            
            window.ALL_VIDEOS_POOL = window.ALL_VIDEOS_POOL || [];
            window.BANNER_IMAGES = window.BANNER_IMAGES || ['bikini.webp', 'bikini3.webp'];
            window.TEASER_IMAGES = window.TEASER_IMAGES || ['bikini.webp', 'bikini3.webp', 'bikini5.webp'];
            
            // Crear APIs mínimas si no existen
            if (!window.ContentAPI) {
                window.ContentAPI = {
                    getPublicImages: (count) => window.ALL_PHOTOS_POOL.slice(0, count),
                    getPremiumImages: () => [],
                    getVideos: () => [],
                    getBanners: () => window.BANNER_IMAGES,
                    getTeasers: () => window.TEASER_IMAGES,
                    search: () => ({ photos: [], videos: [] }),
                    getStats: () => ({ total: 6, public: 6, premium: 0, videos: 0 })
                };
            }
            
            if (!window.UnifiedContentAPI) {
                window.UnifiedContentAPI = {
                    initialized: false,
                    getAllPublicImages: () => window.ALL_PHOTOS_POOL,
                    getAllPremiumImages: () => [],
                    getAllVideos: () => [],
                    searchAll: () => ({ photos: [], videos: [] }),
                    getSystemStats: () => ({ photos: 6, videos: 0 }),
                    getTodaysContent: () => ({
                        photos: window.ALL_PHOTOS_POOL,
                        videos: [],
                        banners: window.BANNER_IMAGES,
                        teasers: window.TEASER_IMAGES,
                        stats: {
                            totalPhotosPool: 6,
                            totalVideosPool: 0,
                            dailyPhotos: 6,
                            dailyVideos: 0,
                            newPhotos: 2,
                            newVideos: 0
                        }
                    })
                };
            }
            
            // Exponer funciones auxiliares
            this.exposeHelperFunctions();
            
            console.log('✅ Modo fallback activado');
        }
    }
    
    // ============================
    // FUNCIONES DE DEBUG
    // ============================
    
    window.debugModularSystem = function() {
        console.log('🛠️ DEBUG: Estado del sistema modular');
        console.log('Módulos cargados:', {
            config: !!window.ContentConfig,
            public: !!window.FULL_IMAGES_POOL,
            premium1: !!window.PREMIUM_IMAGES_PART1,
            premium2: !!window.PREMIUM_IMAGES_PART2,
            videos: !!window.PREMIUM_VIDEOS_POOL,
            apis: !!(window.ContentAPI && window.UnifiedContentAPI)
        });
        console.log('Estadísticas:', window.getContentStats ? window.getContentStats() : 'No disponible');
    };
    
    window.testModularContent = function() {
        console.log('🧪 TEST: Probando contenido modular');
        if (window.getRandomContentForMainScript) {
            const content = window.getRandomContentForMainScript(10, 5);
            console.log('Contenido aleatorio:', content);
            return content;
        } else {
            console.error('❌ Función getRandomContentForMainScript no disponible');
            return null;
        }
    };
    
    window.forceReloadContent = function() {
        console.log('🔄 Forzando recarga de contenido...');
        const system = new IntegrationSystem();
        system.initialize();
        const content = window.generateDailyRotationForMainScript ? 
            window.generateDailyRotationForMainScript() : 
            null;
        console.log('✅ Contenido recargado:', content);
        return content;
    };
    
    // ============================
    // INICIALIZACIÓN AUTOMÁTICA
    // ============================
    
    function initializeIntegration() {
        console.log('🎯 Iniciando integración del sistema modular...');
        
        // Crear instancia del sistema
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

// Log de confirmación de carga
console.log('📦 content-data-integration.js v4.1.0 FIXED cargado');
