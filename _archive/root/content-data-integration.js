/**
 * content-data-integration.js - Integration Module v4.1.0 FIXED
 * Módulo de integración entre el sistema modular y main-script.js
 */

(function() {
    'use strict';
    
    console.log('🔗 Cargando módulo de integración v4.1.0...');
    
    // ============================
    // SISTEMA DE INTEGRACIÓN
    // ============================
    
    class IntegrationSystem {
        constructor() {
            this.initialized = false;
            this.modules = {
                config: false,
                public: false,
                premium1: false,
                premium2: false,
                videos: false,
                api: false
            };
        }
        
        // Verificar disponibilidad de módulos
        checkModules() {
            this.modules.config = !!window.ContentConfig;
            this.modules.public = !!window.FULL_IMAGES_POOL;
            this.modules.premium1 = !!window.PREMIUM_IMAGES_PART1;
            this.modules.premium2 = !!window.PREMIUM_IMAGES_PART2;
            this.modules.videos = !!window.PREMIUM_VIDEOS_POOL;
            this.modules.api = !!(window.ContentAPI && window.UnifiedContentAPI);
            
            const allLoaded = Object.values(this.modules).every(v => v === true);
            
            if (!allLoaded) {
                console.warn('⏳ Esperando carga de módulos:', this.modules);
            }
            
            return allLoaded;
        }
        
        // Crear arrays globales para compatibilidad
        createGlobalArrays() {
            // Array combinado de todas las fotos
            if (!window.ALL_PHOTOS_POOL) {
                window.ALL_PHOTOS_POOL = [
                    ...(window.FULL_IMAGES_POOL || []),
                    ...(window.PREMIUM_IMAGES_PART1 || []),
                    ...(window.PREMIUM_IMAGES_PART2 || [])
                ];
                console.log(`📸 ALL_PHOTOS_POOL creado: ${window.ALL_PHOTOS_POOL.length} imágenes`);
            }
            
            // Array de videos
            if (!window.ALL_VIDEOS_POOL) {
                window.ALL_VIDEOS_POOL = window.PREMIUM_VIDEOS_POOL || [];
                console.log(`🎬 ALL_VIDEOS_POOL creado: ${window.ALL_VIDEOS_POOL.length} videos`);
            }
            
            // Banners y teasers si no existen
            if (!window.BANNER_IMAGES) {
                window.BANNER_IMAGES = window.ContentAPI ? window.ContentAPI.getBanners() : [];
            }
            
            if (!window.TEASER_IMAGES) {
                window.TEASER_IMAGES = window.ContentAPI ? window.ContentAPI.getTeasers() : [];
            }
        }
        
        // Crear funciones de compatibilidad
        createCompatibilityFunctions() {
            // Función para obtener contenido aleatorio (usada por main-script.js)
            window.getRandomContentForMainScript = function(photoCount = 200, videoCount = 50) {
                console.log(`🎲 Generando contenido aleatorio: ${photoCount} fotos, ${videoCount} videos`);
                
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
                return {
                    photos: (window.ALL_PHOTOS_POOL || []).slice(0, photoCount),
                    videos: (window.ALL_VIDEOS_POOL || []).slice(0, videoCount),
                    banners: window.BANNER_IMAGES || [],
                    teasers: window.TEASER_IMAGES || []
                };
            };
            
            // Función para generar rotación diaria
            window.generateDailyRotationForMainScript = function() {
                console.log('🔄 Generando rotación diaria...');
                
                if (window.UnifiedContentAPI && window.UnifiedContentAPI.initialized) {
                    return window.UnifiedContentAPI.getTodaysContent();
                }
                
                // Fallback: usar contenido aleatorio
                return window.getRandomContentForMainScript();
            };
            
            // Función de estadísticas
            window.getContentStats = function() {
                return {
                    totalPhotos: (window.ALL_PHOTOS_POOL || []).length,
                    totalVideos: (window.ALL_VIDEOS_POOL || []).length,
                    publicPhotos: (window.FULL_IMAGES_POOL || []).length,
                    premiumPhotos: ((window.PREMIUM_IMAGES_PART1 || []).length + 
                                    (window.PREMIUM_IMAGES_PART2 || []).length),
                    banners: (window.BANNER_IMAGES || []).length,
                    teasers: (window.TEASER_IMAGES || []).length,
                    modulesLoaded: Object.values(this.modules || {}).filter(v => v).length
                };
            }.bind(this);
        }
        
        // Inicializar sistema
        initialize() {
            console.log('🚀 Inicializando sistema de integración...');
            
            // Verificar módulos
            if (!this.checkModules()) {
                console.log('⏳ Algunos módulos aún no están cargados');
                setTimeout(() => this.initialize(), 500);
                return false;
            }
            
            // Crear arrays globales
            this.createGlobalArrays();
            
            // Crear funciones de compatibilidad
            this.createCompatibilityFunctions();
            
            // Marcar como inicializado
            this.initialized = true;
            
            // Disparar evento de sistema listo
            window.dispatchEvent(new CustomEvent('modularSystemReady', {
                detail: {
                    stats: window.getContentStats(),
                    modules: this.modules
                }
            }));
            
            console.log('✅ Sistema de integración inicializado correctamente');
            console.log('📊 Estadísticas:', window.getContentStats());
            
            return true;
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
