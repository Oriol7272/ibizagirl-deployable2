/**
 * content-data1.js - Configuration & Utilities v4.1.0 FIXED
 * Configuración base y utilidades para el sistema modular
 */

// ============================
// CONFIGURACIÓN GLOBAL
// ============================

const ContentConfig = {
    version: '4.1.0',
    environment: window.location.hostname === 'localhost' ? 'development' : 'production',
    debug: window.location.hostname === 'localhost',
    
    // Configuración de rotación
    rotation: {
        enabled: true,
        intervalHours: 24,
        bannersCount: 5,
        teasersCount: 10,
        dailyPhotosCount: 200,
        dailyVideosCount: 40
    },
    
    // Configuración de caché
    cache: {
        enabled: true,
        duration: 3600000, // 1 hora
        maxSize: 100 // items máximos
    },
    
    // Configuración de lazy loading
    lazyLoading: {
        enabled: true,
        rootMargin: '50px',
        threshold: 0.1
    },
    
    // Configuración de contenido
    content: {
        photosPerPage: 30,
        videosPerPage: 12,
        enableInfiniteScroll: true,
        enableSearch: true,
        enableFilters: true
    },
    
    // Configuración de acceso
    access: {
        guestPreview: true,
        blurredContent: true,
        watermark: false,
        previewDuration: 30 // segundos para videos
    }
};

// ============================
// UTILIDADES DE TIEMPO
// ============================

const TimeUtils = {
    // Obtener timestamp actual
    now() {
        return Date.now();
    },
    
    // Obtener fecha actual
    today() {
        return new Date();
    },
    
    // Obtener día del año
    getDayOfYear(date = new Date()) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    },
    
    // Obtener semana del año
    getWeekOfYear(date = new Date()) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    },
    
    // Generar seed basado en fecha
    getDateSeed(date = new Date()) {
        return date.getFullYear() * 10000 + 
               date.getMonth() * 100 + 
               date.getDate();
    },
    
    // Formatear fecha
    formatDate(date, format = 'DD/MM/YYYY') {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        
        return format
            .replace('DD', day)
            .replace('MM', month)
            .replace('YYYY', year);
    },
    
    // Tiempo relativo
    getRelativeTime(date) {
        const seconds = Math.floor((Date.now() - date) / 1000);
        
        const intervals = {
            año: 31536000,
            mes: 2592000,
            semana: 604800,
            día: 86400,
            hora: 3600,
            minuto: 60
        };
        
        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return `hace ${interval} ${unit}${interval > 1 ? 's' : ''}`;
            }
        }
        
        return 'justo ahora';
    }
};

// ============================
// UTILIDADES DE ARRAYS
// ============================

const ArrayUtils = {
    // Mezclar array con seed
    shuffleWithSeed(array, seed) {
        const arr = [...array];
        let m = arr.length;
        let t, i;
        
        // Generador de números pseudoaleatorios con seed
        const random = () => {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };
        
        while (m) {
            i = Math.floor(random() * m--);
            t = arr[m];
            arr[m] = arr[i];
            arr[i] = t;
        }
        
        return arr;
    },
    
    // Obtener items aleatorios
    getRandomItems(array, count, seed = null) {
        if (!array || array.length === 0) return [];
        
        if (seed !== null) {
            const shuffled = this.shuffleWithSeed(array, seed);
            return shuffled.slice(0, Math.min(count, shuffled.length));
        }
        
        const shuffled = [...array].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, shuffled.length));
    },
    
    // Dividir array en chunks
    chunk(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    },
    
    // Paginar array
    paginate(array, page, perPage) {
        const start = (page - 1) * perPage;
        const end = start + perPage;
        return {
            data: array.slice(start, end),
            page,
            perPage,
            total: array.length,
            totalPages: Math.ceil(array.length / perPage),
            hasNext: end < array.length,
            hasPrev: page > 1
        };
    },
    
    // Filtrar duplicados
    unique(array) {
        return [...new Set(array)];
    },
    
    // Buscar en array
    search(array, query, keys = []) {
        if (!query) return array;
        
        const queryLower = query.toLowerCase();
        return array.filter(item => {
            if (typeof item === 'string') {
                return item.toLowerCase().includes(queryLower);
            }
            
            if (keys.length > 0) {
                return keys.some(key => 
                    item[key] && item[key].toString().toLowerCase().includes(queryLower)
                );
            }
            
            return false;
        });
    },
    
    // Ordenar array
    sortBy(array, key, order = 'asc') {
        return [...array].sort((a, b) => {
            const aVal = typeof a === 'object' ? a[key] : a;
            const bVal = typeof b === 'object' ? b[key] : b;
            
            if (order === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
    }
};

// ============================
// UTILIDADES DE ALMACENAMIENTO
// ============================

const StorageUtils = {
    // Guardar en localStorage
    save(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            return false;
        }
    },
    
    // Obtener de localStorage
    load(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Error loading from localStorage:', e);
            return defaultValue;
        }
    },
    
    // Eliminar de localStorage
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error removing from localStorage:', e);
            return false;
        }
    },
    
    // Limpiar localStorage
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Error clearing localStorage:', e);
            return false;
        }
    },
    
    // Guardar en sessionStorage
    saveSession(key, value) {
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error saving to sessionStorage:', e);
            return false;
        }
    },
    
    // Obtener de sessionStorage
    loadSession(key, defaultValue = null) {
        try {
            const item = sessionStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Error loading from sessionStorage:', e);
            return defaultValue;
        }
    }
};

// ============================
// UTILIDADES DE VALIDACIÓN
// ============================

const Validators = {
    // Validar email
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Validar URL
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    },
    
    // Validar ruta de imagen
    isValidImagePath(path) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        return imageExtensions.some(ext => path.toLowerCase().endsWith(ext));
    },
    
    // Validar ruta de video
    isValidVideoPath(path) {
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov'];
        return videoExtensions.some(ext => path.toLowerCase().endsWith(ext));
    },
    
    // Validar número
    isNumber(value) {
        return !isNaN(value) && isFinite(value);
    },
    
    // Validar rango
    isInRange(value, min, max) {
        return this.isNumber(value) && value >= min && value <= max;
    }
};

// ============================
// GESTOR DE EVENTOS
// ============================

class EventManager {
    constructor() {
        this.events = {};
    }
    
    // Suscribir a evento
    on(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }
    
    // Desuscribir de evento
    off(eventName, callback) {
        if (!this.events[eventName]) return;
        
        const index = this.events[eventName].indexOf(callback);
        if (index > -1) {
            this.events[eventName].splice(index, 1);
        }
    }
    
    // Emitir evento
    emit(eventName, data) {
        if (!this.events[eventName]) return;
        
        this.events[eventName].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in event handler for ${eventName}:`, error);
            }
        });
    }
    
    // Suscribir una sola vez
    once(eventName, callback) {
        const onceWrapper = (data) => {
            callback(data);
            this.off(eventName, onceWrapper);
        };
        this.on(eventName, onceWrapper);
    }
}

// ============================
// SISTEMA DE CACHÉ
// ============================

class CacheSystem {
    constructor(maxSize = 100, ttl = 3600000) {
        this.cache = new Map();
        this.maxSize = maxSize;
        this.ttl = ttl; // Time to live en ms
    }
    
    // Guardar en caché
    set(key, value) {
        // Si alcanzamos el límite, eliminar el más antiguo
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        
        this.cache.set(key, {
            value,
            timestamp: Date.now()
        });
    }
    
    // Obtener de caché
    get(key) {
        const item = this.cache.get(key);
        
        if (!item) return null;
        
        // Verificar si expiró
        if (Date.now() - item.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }
        
        return item.value;
    }
    
    // Verificar si existe
    has(key) {
        return this.get(key) !== null;
    }
    
    // Eliminar de caché
    delete(key) {
        return this.cache.delete(key);
    }
    
    // Limpiar caché
    clear() {
        this.cache.clear();
    }
    
    // Obtener tamaño
    size() {
        return this.cache.size;
    }
    
    // Limpiar expirados
    cleanup() {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now - item.timestamp > this.ttl) {
                this.cache.delete(key);
            }
        }
    }
}

// ============================
// DETECTOR DE CARACTERÍSTICAS
// ============================

const FeatureDetector = {
    // Detectar soporte WebP
    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    },
    
    // Detectar soporte de lazy loading nativo
    supportsLazyLoading() {
        return 'loading' in HTMLImageElement.prototype;
    },
    
    // Detectar IntersectionObserver
    supportsIntersectionObserver() {
        return 'IntersectionObserver' in window;
    },
    
    // Detectar Service Worker
    supportsServiceWorker() {
        return 'serviceWorker' in navigator;
    },
    
    // Detectar dispositivo móvil
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    // Detectar dispositivo táctil
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },
    
    // Obtener información del navegador
    getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = 'Unknown';
        let version = 'Unknown';
        
        if (ua.indexOf('Chrome') > -1) {
            browser = 'Chrome';
            version = ua.match(/Chrome\/(\d+)/)?.[1] || version;
        } else if (ua.indexOf('Safari') > -1) {
            browser = 'Safari';
            version = ua.match(/Version\/(\d+)/)?.[1] || version;
        } else if (ua.indexOf('Firefox') > -1) {
            browser = 'Firefox';
            version = ua.match(/Firefox\/(\d+)/)?.[1] || version;
        }
        
        return { browser, version, userAgent: ua };
    }
};

// ============================
// INICIALIZACIÓN Y EXPORTACIÓN
// ============================

// Crear instancias globales
const globalEventManager = new EventManager();
const globalCache = new CacheSystem(
    ContentConfig.cache.maxSize,
    ContentConfig.cache.duration
);

// Exponer APIs globales
window.ContentConfig = ContentConfig;
window.TimeUtils = TimeUtils;
window.ArrayUtils = ArrayUtils;
window.StorageUtils = StorageUtils;
window.Validators = Validators;
window.EventManager = globalEventManager;
window.CacheSystem = globalCache;
window.FeatureDetector = FeatureDetector;

// Auto-limpiar caché periódicamente
if (ContentConfig.cache.enabled) {
    setInterval(() => {
        globalCache.cleanup();
    }, 300000); // Cada 5 minutos
}

// Log de inicialización
console.log('📦 content-data1.js v4.1.0 FIXED loaded');
console.log('   - Configuration loaded');
console.log('   - Utilities initialized');
console.log('   - Cache system ready');
console.log('   - Event manager ready');
console.log('   - Feature detector available');

// Modo debug
if (ContentConfig.debug) {
    console.log('🔧 Debug mode enabled');
    window.ContentDebug = {
        config: ContentConfig,
        cache: globalCache,
        events: globalEventManager,
        
        // Funciones de debug
        inspectCache() {
            console.table(Array.from(globalCache.cache.entries()).map(([key, value]) => ({
                key,
                value: value.value,
                age: Date.now() - value.timestamp
            })));
        },
        
        testFeatures() {
            console.table({
                WebP: FeatureDetector.supportsWebP(),
                LazyLoading: FeatureDetector.supportsLazyLoading(),
                IntersectionObserver: FeatureDetector.supportsIntersectionObserver(),
                ServiceWorker: FeatureDetector.supportsServiceWorker(),
                Mobile: FeatureDetector.isMobile(),
                Touch: FeatureDetector.isTouchDevice()
            });
        },
        
        browserInfo() {
            console.table(FeatureDetector.getBrowserInfo());
        }
    };
}

// Exportar para módulos ES6 si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ContentConfig,
        TimeUtils,
        ArrayUtils,
        StorageUtils,
        Validators,
        EventManager: globalEventManager,
        CacheSystem: globalCache,
        FeatureDetector
    };
}
