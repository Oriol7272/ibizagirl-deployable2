// ============================
// CONTENT DATA 1 - CONFIGURACIÓN Y UTILIDADES v4.1.0
// Sistema de gestión de contenido multimedia modular
// ============================

'use strict';

// ============================
// CONFIGURACIÓN GLOBAL
// ============================
const ContentConfig = {
    version: '4.1.0',
    lastUpdate: new Date().toISOString(),
    
    // Rutas base para contenido
    paths: {
        IMAGES: 'full/',
        PREMIUM: 'premium/',
        VIDEOS: 'videos/'
    },
    
    // Configuración de rotación
    rotation: {
        enabled: true,
        intervalHours: 1,
        bannersCount: 6,
        teasersCount: 9,
        updateTime: '03:00'
    },
    
    // Categorías disponibles
    categories: ['beach', 'paradise', 'lifestyle', 'fashion'],
    
    // Configuración de contenido dinámico
    dynamic: {
        bannersEnabled: true,
        teasersEnabled: true,
        dailyRotation: true,
        autoShuffle: true
    }
};

// ============================
// GENERADOR PSEUDO-ALEATORIO OPTIMIZADO
// ============================
class SeededRandom {
    constructor(seed) {
        this.seed = seed;
    }
    
    // Algoritmo Mulberry32 para números pseudo-aleatorios
    next() {
        let t = this.seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
    
    // Generar entero en rango
    nextInt(min, max) {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }
}

// ============================
// UTILIDADES DE FECHA Y TIEMPO
// ============================
const TimeUtils = {
    // Obtener seed basado en fecha/hora
    getRotationSeed() {
        const now = new Date();
        return now.getFullYear() * 10000 +
               now.getMonth() * 1000 +
               now.getDate() * 100 +
               now.getHours();
    },
    
    // Obtener seed diario
    getDailySeed() {
        const now = new Date();
        return now.getFullYear() * 10000 +
               now.getMonth() * 1000 +
               now.getDate() * 100;
    },
    
    // Verificar si es hora de rotación
    isRotationTime() {
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        
        // Rotar a las 3:00 AM o cada hora si está habilitado
        return (hour === 3 && minute === 0) || 
               (ContentConfig.rotation.enabled && minute === 0);
    }
};

// ============================
// UTILIDADES DE ARRAYS
// ============================
const ArrayUtils = {
    // Mezclar array con seed determinístico
    shuffleWithSeed(array, seed) {
        if (!Array.isArray(array) || array.length === 0) {
            return [];
        }
        
        const shuffled = [...array];
        const rng = new SeededRandom(seed);
        
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(rng.next() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        return shuffled;
    },
    
    // Obtener elementos aleatorios
    getRandomItems(array, count, seed = null) {
        if (!Array.isArray(array) || array.length === 0) {
            return [];
        }
        
        const actualSeed = seed || TimeUtils.getRotationSeed();
        const shuffled = this.shuffleWithSeed(array, actualSeed);
        return shuffled.slice(0, Math.min(count, shuffled.length));
    },
    
    // Filtrar por categoría
    filterByCategory(array, category) {
        if (!category) return array;
        const categoryLower = category.toLowerCase();
        return array.filter(item => item.toLowerCase().includes(categoryLower));
    }
};

// ============================
// GESTOR DE CONTENIDO DINÁMICO
// ============================
class ContentManager {
    constructor() {
        this.rotationInterval = null;
        this.contentCache = new Map();
        this.lastRotation = null;
    }
    
    // Inicializar gestor
    initialize() {
        this.startAutoRotation();
        this.cacheContent();
        console.log('✅ ContentManager inicializado');
    }
    
    // Iniciar rotación automática
    startAutoRotation() {
        if (this.rotationInterval) {
            clearInterval(this.rotationInterval);
        }
        
        if (ContentConfig.rotation.enabled) {
            const intervalMs = ContentConfig.rotation.intervalHours * 3600000;
            this.rotationInterval = setInterval(() => {
                this.rotateContent();
            }, intervalMs);
            
            console.log(`🔄 Rotación automática iniciada (cada ${ContentConfig.rotation.intervalHours}h)`);
        }
    }
    
    // Detener rotación automática
    stopAutoRotation() {
        if (this.rotationInterval) {
            clearInterval(this.rotationInterval);
            this.rotationInterval = null;
            console.log('⏹️ Rotación automática detenida');
        }
    }
    
    // Rotar contenido manualmente
    rotateContent() {
        this.clearCache();
        this.lastRotation = new Date();
        
        // Disparar evento de rotación
        window.dispatchEvent(new CustomEvent('contentRotated', {
            detail: {
                timestamp: this.lastRotation,
                seed: TimeUtils.getRotationSeed()
            }
        }));
        
        console.log('🔄 Contenido rotado:', this.lastRotation);
    }
    
    // Cache de contenido
    cacheContent() {
        this.contentCache.set('lastUpdate', Date.now());
    }
    
    // Limpiar cache
    clearCache() {
        this.contentCache.clear();
    }
    
    // Obtener estadísticas
    getStats() {
        return {
            version: ContentConfig.version,
            lastRotation: this.lastRotation,
            cacheSize: this.contentCache.size,
            rotationEnabled: ContentConfig.rotation.enabled,
            categories: ContentConfig.categories.length
        };
    }
    
    // Cleanup al destruir
    destroy() {
        this.stopAutoRotation();
        this.clearCache();
    }
}

// ============================
// VALIDADORES
// ============================
const Validators = {
    // Validar path de imagen
    isValidImagePath(path) {
        if (typeof path !== 'string') return false;
        const validExtensions = ['.webp', '.jpg', '.jpeg', '.png'];
        return validExtensions.some(ext => path.toLowerCase().endsWith(ext));
    },
    
    // Validar path de video
    isValidVideoPath(path) {
        if (typeof path !== 'string') return false;
        const validExtensions = ['.mp4', '.webm', '.mov'];
        return validExtensions.some(ext => path.toLowerCase().endsWith(ext));
    },
    
    // Validar configuración
    validateConfig(config) {
        const required = ['version', 'paths', 'rotation', 'categories'];
        return required.every(key => key in config);
    }
};

// ============================
// EXPORTACIONES
// ============================
// Crear instancia global del gestor
const globalContentManager = new ContentManager();

// Exponer APIs globales
window.ContentConfig = ContentConfig;
window.TimeUtils = TimeUtils;
window.ArrayUtils = ArrayUtils;
window.ContentManager = globalContentManager;
window.Validators = Validators;

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        globalContentManager.initialize();
    });
} else {
    globalContentManager.initialize();
}

// Cleanup al cerrar la página
window.addEventListener('beforeunload', () => {
    globalContentManager.destroy();
});

console.log('📦 content-data1.js cargado - Configuración y utilidades listas');
