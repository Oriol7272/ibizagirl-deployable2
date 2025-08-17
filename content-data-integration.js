// ============================
// CONTENT DATA INTEGRATION v4.1.0 COMPLETE
// Sistema de integración multimedia modular para IbizaGirl.pics
// Conecta todos los módulos de contenido con la aplicación principal
// ============================

'use strict';

// ============================
// VERIFICADOR DE CARGA DE MÓDULOS
// ============================
class ContentModuleLoader {
    constructor() {
        this.loadedModules = new Set();
        this.requiredModules = [
            'content-data1.js',
            'content-data2.js', 
            'content-data3.js',
            'content-data4.js',
            'content-data5.js',
            'content-data6.js'
        ];
        this.loadAttempts = 0;
        this.maxAttempts = 3;
        this.isInitialized = false;
    }

    // Verificar qué módulos están cargados
    checkLoadedModules() {
        const moduleStatus = {
            'content-data1.js': !!(window.ContentConfig && window.TimeUtils && window.ArrayUtils),
            'content-data2.js': !!(window.FULL_IMAGES_POOL && window.BannerTeaserManager),
            'content-data3.js': !!(window.PREMIUM_IMAGES_PART1 && window.PremiumContentPart1),
            'content-data4.js': !!(window.PREMIUM_IMAGES_PART2 && window.PremiumContentPart2),
            'content-data5.js': !!(window.PREMIUM_VIDEOS_POOL && window.VideoContentManager),
            'content-data6.js': !!(window.UnifiedContentAPI && window.ContentAPI)
        };

        console.log('📊 Estado de módulos de contenido:', moduleStatus);
        return moduleStatus;
    }

    // Cargar módulos faltantes dinámicamente
    async loadMissingModules() {
        const moduleStatus = this.checkLoadedModules();
        const missingModules = Object.entries(moduleStatus)
            .filter(([module, loaded]) => !loaded)
            .map(([module]) => module);

        if (missingModules.length === 0) {
            console.log('✅ Todos los módulos de contenido están cargados');
            return true;
        }

        console.log('⚠️ Módulos faltantes:', missingModules);

        if (this.loadAttempts >= this.maxAttempts) {
            console.error('❌ No se pudieron cargar todos los módulos después de varios intentos');
            return false;
        }

        this.loadAttempts++;

        try {
            await Promise.all(
                missingModules.map(module => this.loadScript(module))
            );

            // Esperar un poco para que los módulos se inicialicen
            await new Promise(resolve => setTimeout(resolve, 500));

            // Verificar nuevamente
            return await this.loadMissingModules();

        } catch (error) {
            console.error('❌ Error cargando módulos:', error);
            return false;
        }
    }

    // Cargar un script individual
    loadScript(scriptName) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = scriptName;
            script.defer = true;
            script.onload = () => {
                console.log(`✅ Módulo cargado: ${scriptName}`);
                resolve();
            };
            script.onerror = () => {
                console.warn(`⚠️ No se pudo cargar: ${scriptName}`);
                resolve(); // No rechazar para permitir continuar
            };
            document.head.appendChild(script);
        });
    }

    // Inicializar sistema completo
    async initialize() {
        if (this.isInitialized) {
            return true;
        }

        console.log('🚀 Inicializando sistema de contenido modular...');

        const success = await this.loadMissingModules();
        
        if (success) {
            // Verificar que la API unificada esté disponible
            if (window.UnifiedContentAPI) {
                await window.UnifiedContentAPI.initialize();
            }

            this.isInitialized = true;
            console.log('✅ Sistema de contenido modular inicializado correctamente');
            
            // Disparar evento de inicialización completa
            window.dispatchEvent(new CustomEvent('contentSystemReady', {
                detail: {
                    modules: this.checkLoadedModules(),
                    timestamp: new Date().toISOString()
                }
            }));

            return true;
        } else {
            console.error('❌ No se pudo inicializar el sistema de contenido');
            return false;
        }
    }
}

// ============================
// INTEGRADOR DE CONTENIDO PARA MAIN-SCRIPT.JS
// ============================
class ContentIntegrator {
    constructor() {
        this.contentArrays = {
            photos: [],
            videos: [],
            banners: [],
            teasers: [],
            premiumPhotos: [],
            premiumVideos: []
        };
        this.initialized = false;
    }

    // Integrar todos los arrays de contenido
    integrateContent() {
        try {
            // Fotos públicas del pool completo
            if (window.FULL_IMAGES_POOL) {
                this.contentArrays.photos = [...window.FULL_IMAGES_POOL];
                console.log(`📸 Fotos públicas integradas: ${this.contentArrays.photos.length}`);
            }

            // Videos premium
            if (window.PREMIUM_VIDEOS_POOL) {
                this.contentArrays.videos = [...window.PREMIUM_VIDEOS_POOL];
                this.contentArrays.premiumVideos = [...window.PREMIUM_VIDEOS_POOL];
                console.log(`🎬 Videos premium integrados: ${this.contentArrays.videos.length}`);
            }

            // Fotos premium (combinando parte 1 y parte 2)
            const premiumPart1 = window.PREMIUM_IMAGES_PART1 || [];
            const premiumPart2 = window.PREMIUM_IMAGES_PART2 || [];
            this.contentArrays.premiumPhotos = [...premiumPart1, ...premiumPart2];
            console.log(`💎 Fotos premium integradas: ${this.contentArrays.premiumPhotos.length}`);

            // Banners y teasers desde el gestor
            if (window.BannerTeaserManager) {
                this.contentArrays.banners = window.BannerTeaserManager.getBanners();
                this.contentArrays.teasers = window.BannerTeaserManager.getTeasers();
                console.log(`🎯 Banners: ${this.contentArrays.banners.length}, Teasers: ${this.contentArrays.teasers.length}`);
            }

            // Exponer arrays globalmente para compatibilidad con main-script.js
            this.exposeGlobalArrays();

            this.initialized = true;
            console.log('✅ Integración de contenido completada');
            return true;

        } catch (error) {
            console.error('❌ Error en integración de contenido:', error);
            return false;
        }
    }

    // Exponer arrays globalmente
    exposeGlobalArrays() {
        // Para compatibilidad con main-script.js
        window.ALL_PHOTOS_POOL = this.contentArrays.photos;
        window.ALL_VIDEOS_POOL = this.contentArrays.videos;
        window.ALL_PREMIUM_PHOTOS = this.contentArrays.premiumPhotos;
        window.ALL_PREMIUM_VIDEOS = this.contentArrays.premiumVideos;
        
        // También mantener los nombres originales
        window.BANNER_IMAGES = this.contentArrays.banners;
        window.TEASER_IMAGES = this.contentArrays.teasers;

        console.log('🌐 Arrays globales expuestos para main-script.js');
    }

    // Obtener estadísticas del contenido
    getContentStats() {
        return {
            publicPhotos: this.contentArrays.photos.length,
            premiumPhotos: this.contentArrays.premiumPhotos.length,
            totalPhotos: this.contentArrays.photos.length + this.contentArrays.premiumPhotos.length,
            videos: this.contentArrays.videos.length,
            banners: this.contentArrays.banners.length,
            teasers: this.contentArrays.teasers.length,
            initialized: this.initialized
        };
    }
}

// ============================
// FUNCIONES DE UTILIDAD PARA MAIN-SCRIPT.JS
// ============================

// Función auxiliar para obtener contenido aleatorio que usará main-script.js
function getRandomContentForMainScript() {
    if (!window.ContentAPI) {
        console.warn('⚠️ ContentAPI no disponible, usando fallback');
        return {
            photos: window.ALL_PHOTOS_POOL || [],
            videos: window.ALL_VIDEOS_POOL || [],
            banners: window.BANNER_IMAGES || [],
            teasers: window.TEASER_IMAGES || []
        };
    }

    return {
        photos: window.ContentAPI.getPublicImages(50),
        videos: window.ContentAPI.getVideos(20),
        banners: window.ContentAPI.getBanners(),
        teasers: window.ContentAPI.getTeasers()
    };
}

// Función para generar rotación diaria que usará main-script.js
function generateDailyRotationForMainScript() {
    if (window.UnifiedContentAPI && window.UnifiedContentAPI.initialized) {
        return window.UnifiedContentAPI.getTodaysContent();
    }

    // Fallback si la API unificada no está disponible
    const content = getRandomContentForMainScript();
    return {
        photos: content.photos,
        videos: content.videos,
        banners: content.banners,
        teasers: content.teasers,
        newPhotoIndices: new Set([0, 1, 2, 3, 4]),
        newVideoIndices: new Set([0, 1, 2]),
        lastUpdate: new Date(),
        stats: {
            totalPhotosPool: content.photos.length,
            totalVideosPool: content.videos.length,
            dailyPhotos: content.photos.length,
            dailyVideos: content.videos.length,
            newPhotos: 5,
            newVideos: 3
        }
    };
}

// ============================
// SISTEMA DE INICIALIZACIÓN AUTOMÁTICA
// ============================
class AutoInitializer {
    constructor() {
        this.moduleLoader = new ContentModuleLoader();
        this.contentIntegrator = new ContentIntegrator();
        this.initializationAttempts = 0;
        this.maxInitAttempts = 5;
    }

    async initialize() {
        console.log('🎯 Iniciando auto-inicialización del sistema de contenido...');

        try {
            // Paso 1: Cargar módulos
            const modulesLoaded = await this.moduleLoader.initialize();
            if (!modulesLoaded) {
                throw new Error('No se pudieron cargar todos los módulos');
            }

            // Paso 2: Integrar contenido
            const contentIntegrated = this.contentIntegrator.integrateContent();
            if (!contentIntegrated) {
                throw new Error('No se pudo integrar el contenido');
            }

            // Paso 3: Exponer funciones auxiliares globalmente
            this.exposeHelperFunctions();

            // Paso 4: Verificar compatibilidad con main-script.js
            this.verifyMainScriptCompatibility();

            console.log('🎉 Sistema de contenido inicializado exitosamente');
            console.log('📊 Estadísticas:', this.contentIntegrator.getContentStats());

            return true;

        } catch (error) {
            this.initializationAttempts++;
            console.error(`❌ Error en inicialización (intento ${this.initializationAttempts}):`, error);

            if (this.initializationAttempts < this.maxInitAttempts) {
                console.log(`🔄 Reintentando inicialización en 2 segundos...`);
                setTimeout(() => this.initialize(), 2000);
            } else {
                console.error('💥 No se pudo inicializar el sistema después de varios intentos');
                this.initializeFallbackMode();
            }

            return false;
        }
    }

    // Exponer funciones auxiliares globalmente
    exposeHelperFunctions() {
        window.getRandomContentForMainScript = getRandomContentForMainScript;
        window.generateDailyRotationForMainScript = generateDailyRotationForMainScript;
        window.getContentStats = () => this.contentIntegrator.getContentStats();
        
        console.log('🔗 Funciones auxiliares expuestas globalmente');
    }

    // Verificar compatibilidad con main-script.js
    verifyMainScriptCompatibility() {
        const requiredGlobals = [
            'ALL_PHOTOS_POOL',
            'ALL_VIDEOS_POOL', 
            'BANNER_IMAGES',
            'TEASER_IMAGES'
        ];

        const missingGlobals = requiredGlobals.filter(global => !window[global]);

        if (missingGlobals.length > 0) {
            console.warn('⚠️ Variables globales faltantes para main-script.js:', missingGlobals);
            this.createFallbackGlobals();
        } else {
            console.log('✅ Compatibilidad con main-script.js verificada');
        }
    }

    // Crear variables globales de fallback
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
        }

        if (!window.ALL_VIDEOS_POOL) {
            window.ALL_VIDEOS_POOL = [];
        }

        if (!window.BANNER_IMAGES) {
            window.BANNER_IMAGES = ['bikini.webp', 'bikini3.webp'];
        }

        if (!window.TEASER_IMAGES) {
            window.TEASER_IMAGES = ['bikini.webp', 'bikini3.webp', 'bikini5.webp'];
        }

        console.log('🛠️ Variables globales de fallback creadas');
    }

    // Modo fallback si todo falla
    initializeFallbackMode() {
        console.log('🆘 Iniciando modo fallback...');
        this.createFallbackGlobals();
        this.exposeHelperFunctions();

        // Disparar evento de fallback
        window.dispatchEvent(new CustomEvent('contentSystemFallback', {
            detail: {
                reason: 'Failed to load all modules',
                timestamp: new Date().toISOString()
            }
        }));
    }
}

// ============================
// INICIALIZACIÓN AUTOMÁTICA
// ============================

const autoInitializer = new AutoInitializer();

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        autoInitializer.initialize();
    });
} else {
    autoInitializer.initialize();
}

// También inicializar si se carga después del DOMContentLoaded
setTimeout(() => {
    if (!autoInitializer.contentIntegrator.initialized) {
        autoInitializer.initialize();
    }
}, 1000);

// ============================
// EXPORTS GLOBALES
// ============================

window.ContentModuleLoader = ContentModuleLoader;
window.ContentIntegrator = ContentIntegrator;
window.AutoInitializer = AutoInitializer;

console.log('📦 content-data-integration.js v4.1.0 cargado - Sistema de integración listo');

// ============================
// DEBUGGING Y UTILIDADES DE DESARROLLO
// ============================

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugContentSystem = function() {
        console.log('🔍 DEBUG: Estado del sistema de contenido');
        console.table({
            'Módulos cargados': autoInitializer.moduleLoader.checkLoadedModules(),
            'Estadísticas': autoInitializer.contentIntegrator.getContentStats(),
            'Variables globales': {
                'ALL_PHOTOS_POOL': !!window.ALL_PHOTOS_POOL,
                'ALL_VIDEOS_POOL': !!window.ALL_VIDEOS_POOL,
                'ContentAPI': !!window.ContentAPI,
                'UnifiedContentAPI': !!window.UnifiedContentAPI
            }
        });
    };

    window.testContentIntegration = function() {
        console.log('🧪 TEST: Probando integración de contenido');
        const randomContent = getRandomContentForMainScript();
        console.log('Contenido aleatorio:', randomContent);
        const dailyRotation = generateDailyRotationForMainScript();
        console.log('Rotación diaria:', dailyRotation);
    };

    console.log('🛠️ Funciones de debug disponibles: debugContentSystem(), testContentIntegration()');
}
