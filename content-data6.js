// content-data6.js - API Unificada con Singleton Pattern
// Previene múltiples inicializaciones y mejora el rendimiento

(function() {
    'use strict';
    
    // Variable singleton global
    let apiInstance = null;
    let initializationPromise = null;
    
    class UnifiedContentAPI {
        constructor() {
            // Implementar patrón Singleton
            if (apiInstance) {
                console.log('♻️ Retornando instancia existente de UnifiedContentAPI');
                return apiInstance;
            }
            
            console.log('🚀 Creando nueva instancia de UnifiedContentAPI...');
            
            this.initialized = false;
            this.initializing = false;
            this.dependencies = {
                ContentManager: false,
                BannerTeaserManager: false,
                PremiumContentPart1: false,
                PremiumContentPart2: false,
                VideoContentManager: false
            };
            
            this.cache = {
                publicImages: null,
                premiumImages: null,
                videos: null,
                banners: null,
                teasers: null,
                lastUpdate: null
            };
            
            this.config = {
                cacheTimeout: 5 * 60 * 1000, // 5 minutos
                rotationInterval: 60 * 60 * 1000, // 1 hora
                batchSize: 50
            };
            
            // Guardar instancia singleton
            apiInstance = this;
            
            // Auto-inicializar
            this.initialize();
        }
        
        async initialize() {
            // Prevenir múltiples inicializaciones
            if (this.initialized) {
                console.log('✅ UnifiedContentAPI ya está inicializada');
                return Promise.resolve(this);
            }
            
            if (this.initializing) {
                console.log('⏳ UnifiedContentAPI ya se está inicializando, esperando...');
                return initializationPromise;
            }
            
            this.initializing = true;
            
            // Crear promesa de inicialización
            initializationPromise = new Promise(async (resolve, reject) => {
                try {
                    console.log('🔄 Inicializando UnifiedContentAPI...');
                    
                    // Verificar dependencias
                    await this.checkDependencies();
                    
                    // Cargar datos iniciales en caché
                    await this.preloadCache();
                    
                    // Configurar rotación automática
                    this.setupAutoRotation();
                    
                    // Marcar como inicializada
                    this.initialized = true;
                    this.initializing = false;
                    
                    console.log('✅ UnifiedContentAPI inicializada correctamente');
                    
                    // Disparar evento
                    window.dispatchEvent(new CustomEvent('unifiedContentAPIReady', {
                        detail: { api: this }
                    }));
                    
                    resolve(this);
                } catch (error) {
                    console.error('❌ Error inicializando UnifiedContentAPI:', error);
                    this.initializing = false;
                    reject(error);
                }
            });
            
            return initializationPromise;
        }
        
        async checkDependencies() {
            return new Promise((resolve) => {
                let checkCount = 0;
                const maxChecks = 50;
                
                const checkInterval = setInterval(() => {
                    // Verificar cada dependencia
                    this.dependencies.ContentManager = !!(window.ContentManager?.initialized);
                    this.dependencies.BannerTeaserManager = !!(window.BannerTeaserManager?.initialized);
                    this.dependencies.PremiumContentPart1 = !!(window.PremiumContentPart1?.initialized);
                    this.dependencies.PremiumContentPart2 = !!(window.PremiumContentPart2?.initialized);
                    this.dependencies.VideoContentManager = !!(window.VideoContentManager?.initialized);
                    
                    const allLoaded = Object.values(this.dependencies).every(dep => dep === true);
                    
                    if (allLoaded) {
                        clearInterval(checkInterval);
                        console.log('✅ Todas las dependencias cargadas correctamente');
                        resolve();
                    } else if (++checkCount >= maxChecks) {
                        clearInterval(checkInterval);
                        console.warn('⚠️ Timeout esperando dependencias, continuando con las disponibles');
                        console.log('Estado de dependencias:', this.dependencies);
                        resolve();
                    }
                }, 100);
            });
        }
        
        async preloadCache() {
            console.log('📦 Precargando caché de contenido...');
            
            try {
                // Precargar imágenes públicas
                if (this.dependencies.ContentManager) {
                    this.cache.publicImages = this.getAllPublicImages();
                }
                
                // Precargar imágenes premium
                if (this.dependencies.PremiumContentPart1 || this.dependencies.PremiumContentPart2) {
                    this.cache.premiumImages = this.getAllPremiumImages();
                }
                
                // Precargar videos
                if (this.dependencies.VideoContentManager) {
                    this.cache.videos = window.VideoContentManager.getAllVideos();
                }
                
                // Precargar banners y teasers
                if (this.dependencies.BannerTeaserManager) {
                    this.cache.banners = window.BannerTeaserManager.getCurrentBanners();
                    this.cache.teasers = window.BannerTeaserManager.getCurrentTeasers();
                }
                
                this.cache.lastUpdate = Date.now();
                
                console.log('✅ Caché precargado:', {
                    publicImages: this.cache.publicImages?.length || 0,
                    premiumImages: this.cache.premiumImages?.length || 0,
                    videos: this.cache.videos?.length || 0,
                    banners: this.cache.banners?.length || 0,
                    teasers: this.cache.teasers?.length || 0
                });
            } catch (error) {
                console.error('❌ Error precargando caché:', error);
            }
        }
        
        setupAutoRotation() {
            // Rotación automática cada hora
            setInterval(() => {
                console.log('🔄 Rotación automática de contenido...');
                this.refreshCache();
                this.notifyRotation();
            }, this.config.rotationInterval);
        }
        
        refreshCache() {
            // Invalidar caché
            this.cache.lastUpdate = null;
            
            // Recargar
            this.preloadCache();
        }
        
        notifyRotation() {
            window.dispatchEvent(new CustomEvent('contentRotation', {
                detail: {
                    timestamp: Date.now(),
                    cache: this.cache
                }
            }));
        }
        
        // Verificación de inicialización con auto-inicialización
        ensureInitialized() {
            if (!this.initialized && !this.initializing) {
                console.log('⚠️ UnifiedContentAPI no está inicializada. Inicializando...');
                return this.initialize();
            }
            return Promise.resolve(this);
        }
        
        // Métodos para obtener contenido con caché
        getAllPublicImages() {
            // Usar caché si está disponible y no ha expirado
            if (this.cache.publicImages && this.isCacheValid()) {
                return [...this.cache.publicImages];
            }
            
            let allImages = [];
            
            if (window.ContentManager?.publicPhotos) {
                allImages = [...window.ContentManager.publicPhotos];
            }
            
            // Actualizar caché
            this.cache.publicImages = allImages;
            
            return allImages;
        }
        
        getRandomPublicImages(count = 20) {
            const allImages = this.getAllPublicImages();
            return this.shuffleArray([...allImages]).slice(0, count);
        }
        
        getAllPremiumImages() {
            // Usar caché si está disponible
            if (this.cache.premiumImages && this.isCacheValid()) {
                return [...this.cache.premiumImages];
            }
            
            let allPremium = [];
            
            if (window.CombinedPremiumContent?.allImages) {
                allPremium = [...window.CombinedPremiumContent.allImages];
            } else {
                if (window.PremiumContentPart1?.images) {
                    allPremium = [...window.PremiumContentPart1.images];
                }
                if (window.PremiumContentPart2?.images) {
                    allPremium = [...allPremium, ...window.PremiumContentPart2.images];
                }
            }
            
            // Actualizar caché
            this.cache.premiumImages = allPremium;
            
            return allPremium;
        }
        
        getRandomPremiumImages(count = 30) {
            const allImages = this.getAllPremiumImages();
            return this.shuffleArray([...allImages]).slice(0, count);
        }
        
        getCurrentBanners() {
            if (this.cache.banners && this.isCacheValid()) {
                return [...this.cache.banners];
            }
            
            const banners = window.BannerTeaserManager?.getCurrentBanners() || [];
            this.cache.banners = banners;
            
            return banners;
        }
        
        getCurrentTeasers() {
            if (this.cache.teasers && this.isCacheValid()) {
                return [...this.cache.teasers];
            }
            
            const teasers = window.BannerTeaserManager?.getCurrentTeasers() || [];
            this.cache.teasers = teasers;
            
            return teasers;
        }
        
        searchContent(query, options = {}) {
            const {
                type = 'all', // 'public', 'premium', 'videos', 'all'
                limit = 20,
                sortBy = 'relevance' // 'relevance', 'date', 'random'
            } = options;
            
            let results = [];
            const searchTerm = query.toLowerCase();
            
            // Buscar en diferentes tipos según el parámetro
            if (type === 'all' || type === 'public') {
                const publicImages = this.getAllPublicImages();
                const publicResults = publicImages.filter(img => 
                    img.title?.toLowerCase().includes(searchTerm) ||
                    img.description?.toLowerCase().includes(searchTerm) ||
                    img.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
                );
                results = [...results, ...publicResults];
            }
            
            if (type === 'all' || type === 'premium') {
                const premiumImages = this.getAllPremiumImages();
                const premiumResults = premiumImages.filter(img =>
                    img.title?.toLowerCase().includes(searchTerm) ||
                    img.description?.toLowerCase().includes(searchTerm)
                );
                results = [...results, ...premiumResults];
            }
            
            if (type === 'all' || type === 'videos') {
                const videos = window.VideoContentManager?.searchVideos(query) || [];
                results = [...results, ...videos];
            }
            
            // Ordenar resultados
            if (sortBy === 'random') {
                results = this.shuffleArray(results);
            } else if (sortBy === 'date' && results[0]?.date) {
                results.sort((a, b) => new Date(b.date) - new Date(a.date));
            }
            
            return results.slice(0, limit);
        }
        
        getRandomVideos(count = 5) {
            const videos = window.VideoContentManager?.getRandomVideos(count) || [];
            return videos;
        }
        
        getDailyRotation() {
            // Generar rotación diaria basada en la fecha
            const today = new Date().toDateString();
            const seed = this.hashCode(today);
            
            return {
                photos: this.getSeededRandom(this.getAllPublicImages(), 50, seed),
                videos: this.getSeededRandom(window.VideoContentManager?.getAllVideos() || [], 3, seed + 1),
                premium: this.getSeededRandom(this.getAllPremiumImages(), 20, seed + 2),
                banners: this.getCurrentBanners(),
                teasers: this.getCurrentTeasers()
            };
        }
        
        getContentStats() {
            return {
                public: this.getAllPublicImages().length,
                premium: this.getAllPremiumImages().length,
                videos: window.VideoContentManager?.getAllVideos()?.length || 0,
                banners: this.getCurrentBanners().length,
                teasers: this.getCurrentTeasers().length,
                total: this.getAllPublicImages().length + 
                       this.getAllPremiumImages().length + 
                       (window.VideoContentManager?.getAllVideos()?.length || 0),
                cacheAge: this.cache.lastUpdate ? 
                    Date.now() - this.cache.lastUpdate : null,
                initialized: this.initialized
            };
        }
        
        // Utilidades
        isCacheValid() {
            if (!this.cache.lastUpdate) return false;
            return (Date.now() - this.cache.lastUpdate) < this.config.cacheTimeout;
        }
        
        shuffleArray(array) {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        }
        
        hashCode(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return Math.abs(hash);
        }
        
        getSeededRandom(array, count, seed) {
            if (!array || array.length === 0) return [];
            
            // Generador de números pseudo-aleatorios con seed
            const random = (seed) => {
                const x = Math.sin(seed) * 10000;
                return x - Math.floor(x);
            };
            
            const shuffled = [...array];
            let currentSeed = seed;
            
            for (let i = shuffled.length - 1; i > 0; i--) {
                currentSeed++;
                const j = Math.floor(random(currentSeed) * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            
            return shuffled.slice(0, Math.min(count, shuffled.length));
        }
        
        // Método para resetear el singleton (útil para testing)
        static reset() {
            apiInstance = null;
            initializationPromise = null;
            console.log('🔄 Singleton reseteado');
        }
    }
    
    // API simplificada con métodos estáticos
    window.ContentAPI = {
        async getPublicImages(count) {
            await apiInstance?.ensureInitialized();
            return count ? 
                apiInstance?.getRandomPublicImages(count) : 
                apiInstance?.getAllPublicImages();
        },
        
        async getPremiumImages(count) {
            await apiInstance?.ensureInitialized();
            return count ? 
                apiInstance?.getRandomPremiumImages(count) : 
                apiInstance?.getAllPremiumImages();
        },
        
        async getVideos(count) {
            await apiInstance?.ensureInitialized();
            return apiInstance?.getRandomVideos(count);
        },
        
        async getBanners() {
            await apiInstance?.ensureInitialized();
            return apiInstance?.getCurrentBanners();
        },
        
        async getTeasers() {
            await apiInstance?.ensureInitialized();
            return apiInstance?.getCurrentTeasers();
        },
        
        async search(query, options) {
            await apiInstance?.ensureInitialized();
            return apiInstance?.searchContent(query, options);
        },
        
        async getDailyContent() {
            await apiInstance?.ensureInitialized();
            return apiInstance?.getDailyRotation();
        },
        
        async getStats() {
            await apiInstance?.ensureInitialized();
            return apiInstance?.getContentStats();
        },
        
        getInstance() {
            return apiInstance;
        }
    };
    
    // Crear instancia única (singleton)
    window.UnifiedContentAPI = new UnifiedContentAPI();
    
    console.log('📦 content-data6.js cargado - API unificada con Singleton disponible');
    console.log('🎯 Usar window.ContentAPI para acceso simplificado');
    console.log('🔧 Usar window.UnifiedContentAPI para acceso completo');
    
})();
