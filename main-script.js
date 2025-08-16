// ============================
// IBIZAGIRL.PICS MAIN SCRIPT v14.3.4 - ERRORES CRÍTICOS CORREGIDOS
// ============================

console.log('🌊 IbizaGirl.pics v14.3.4 CRITICAL FIXES - Loading Paradise Gallery...');

// ============================
// ENVIRONMENT DETECTION
// ============================

const ENVIRONMENT = {
    isDevelopment: window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' || 
                   window.location.hostname.includes('192.168') || 
                   window.location.protocol === 'file:' ||
                   window.location.port !== '',
    get isProduction() { return !this.isDevelopment; }
};

console.log('🌍 Environment:', ENVIRONMENT.isDevelopment ? 'Development' : 'Production');

// ============================
// CONFIGURACIÓN CORREGIDA - USAR ARRAYS DINÁMICOS
// ============================

// Usar arrays del content-data.js si están disponibles, sino fallback
const getPhotoPool = () => {
    if (window.ALL_PHOTOS_POOL && window.ALL_PHOTOS_POOL.length > 0) {
        return window.ALL_PHOTOS_POOL;
    }
    // Fallback básico
    return [
        'full/bikini.webp', 'full/bikini3.webp', 'full/bikini5.webp', 
        'full/backbikini.webp', 'full/bikbanner.webp', 'full/bikbanner2.webp'
    ];
};

const getVideoPool = () => {
    if (window.ALL_VIDEOS_POOL && window.ALL_VIDEOS_POOL.length > 0) {
        return window.ALL_VIDEOS_POOL;
    }
    // Fallback básico - SIN videos que fallan
    return [
        'uncensored-videos/placeholder_video_1.mp4',
        'uncensored-videos/placeholder_video_2.mp4'
    ];
};

// Arrays dinámicos
let ALL_PHOTOS_POOL = [];
let ALL_VIDEOS_POOL = [];
let BANNER_IMAGES = [];
let TEASER_IMAGES = [];

// Inicializar arrays cuando estén disponibles
function initializeContentArrays() {
    ALL_PHOTOS_POOL = getPhotoPool();
    ALL_VIDEOS_POOL = getVideoPool();
    
    // Extraer solo nombres de archivo para banners y teasers
    BANNER_IMAGES = ALL_PHOTOS_POOL.slice(0, 6).map(path => {
        const parts = path.split('/');
        return parts[parts.length - 1]; // Solo el nombre del archivo
    });
    
    TEASER_IMAGES = ALL_PHOTOS_POOL.slice(6, 12).map(path => {
        const parts = path.split('/');
        return parts[parts.length - 1];
    });
    
    console.log(`📊 Content initialized: ${ALL_PHOTOS_POOL.length} photos, ${ALL_VIDEOS_POOL.length} videos`);
}

// ============================
// CONFIGURACIÓN
// ============================

const CONFIG = {
    PAYPAL: {
        CLIENT_ID: 'AfQEdiielw5fm3wF08p9pcxwqR3gPz82YRNUTKY4A8WNG9AktiGsDNyr2i7BsjVzSwwpeCwR7Tt7DPq5',
        CURRENCY: 'EUR',
        PRICES: {
            MONTHLY_SUBSCRIPTION: 15.00,
            LIFETIME_SUBSCRIPTION: 100.00,
            SINGLE_PHOTO: 0.10,
            SINGLE_VIDEO: 0.30
        },
        PACKS: {
            starter: { items: 10, price: 10.00, savings: 33 },
            bronze: { items: 20, price: 15.00, savings: 50 },
            silver: { items: 50, price: 30.00, savings: 60 },
            gold: { items: 100, price: 50.00, savings: 70 }
        }
    },
    
    CONTENT: {
        DAILY_PHOTOS: 127,
        DAILY_VIDEOS: 40,
        NEW_CONTENT_PERCENTAGE: 0.3,
        BLUR_PHOTO: 10,
        BLUR_VIDEO: 10
    },
    
    ANALYTICS_ID: 'G-DBXYNPBSPY'
};

// ============================
// MULTI-LANGUAGE TRANSLATIONS
// ============================

const TRANSLATIONS = {
    es: {
        loading: "Cargando el paraíso...",
        subtitle: "Contenido Exclusivo del Paraíso",
        megapack: "📦 MEGA PACKS -70%",
        monthly: "💳 €15/Mes",
        lifetime: "👑 Lifetime €100",
        welcome: "Bienvenida al Paraíso 🌴",
        daily_content: "200+ fotos y 40+ videos actualizados DIARIAMENTE",
        unlock_all: "🔓 Desbloquear Todo",
        view_gallery: "📸 Ver Galería",
        photos_today: "Fotos de Hoy",
        updated_at: "Actualizado a las",
        videos_hd: "Videos HD",
        new_content: "¡NUEVO CONTENIDO!",
        total_views: "Vistas Totales",
        today: "hoy",
        updates: "Actualizaciones",
        always_fresh: "SIEMPRE FRESCO",
        paradise_photos: "📸 Fotos del Paraíso",
        new_today: "¡NUEVO HOY!",
        exclusive_videos: "🎬 Videos Exclusivos",
        fresh_content: "¡CONTENIDO FRESCO!",
        isabella_title: "Isabella - Tu Guía VIP",
        notification_welcome: "🎉 ¡Bienvenido VIP! Todo el contenido ha sido desbloqueado.",
        notification_pack: "🎉 {credits} créditos añadidos! Haz clic en cualquier contenido para desbloquearlo.",
        notification_unlocked: "{icon} Desbloqueado! {credits} créditos restantes.",
        payment_error: "❌ Error en el pago. Por favor, intenta de nuevo.",
        isabella_messages: [
            "¡Hola preciosa! 😘 ¿Buscas el paraíso?",
            "Pssst... ¡Los miembros VIP ven todo sin desenfoque! 👀",
            "¿Lista para desbloquear el paraíso? ¡VIP te da acceso instantáneo a todo! 🌊",
            "¡Hoy tenemos 200 fotos nuevas y 40 videos nuevos! 🎉",
            "Solo haz clic en cualquier contenido borroso para desbloquearlo! 💕"
        ]
    },
    en: {
        loading: "Loading paradise...",
        subtitle: "Exclusive Paradise Content",
        megapack: "📦 MEGA PACKS -70%",
        monthly: "💳 €15/Month",
        lifetime: "👑 Lifetime €100",
        welcome: "Welcome to Paradise 🌴",
        daily_content: "200+ photos and 40+ videos updated DAILY",
        unlock_all: "🔓 Unlock Everything",
        view_gallery: "📸 View Gallery",
        photos_today: "Today's Photos",
        updated_at: "Updated at",
        videos_hd: "HD Videos",
        new_content: "NEW CONTENT!",
        total_views: "Total Views",
        today: "today",
        updates: "Updates",
        always_fresh: "ALWAYS FRESH",
        paradise_photos: "📸 Paradise Photos",
        new_today: "NEW TODAY!",
        exclusive_videos: "🎬 Exclusive Videos",
        fresh_content: "FRESH CONTENT!",
        isabella_title: "Isabella - Your VIP Guide",
        notification_welcome: "🎉 Welcome VIP! All content has been unlocked.",
        notification_pack: "🎉 {credits} credits added! Click any content to unlock.",
        notification_unlocked: "{icon} Unlocked! {credits} credits remaining.",
        payment_error: "❌ Payment error. Please try again.",
        isabella_messages: [
            "Hello beautiful! 😘 Looking for paradise?",
            "Pssst... VIP members see everything without blur! 👀",
            "Ready to unlock paradise? VIP gives you instant access to everything! 🌊",
            "Today we have 200 new photos and 40 new videos! 🎉",
            "Just click on any blurred content to unlock it! 💕"
        ]
    }
};

// ============================
// STATE MANAGEMENT
// ============================

let state = {
    currentLanguage: 'es',
    isVIP: false,
    unlockedContent: new Set(),
    packCredits: 0,
    selectedPack: 'silver',
    selectedSubscriptionType: 'lifetime',
    currentSlide: 0,
    dailyContent: null,
    errorCount: 0,
    contentInitialized: false
};

// Make globals available
window.TRANSLATIONS = TRANSLATIONS;
window.state = state;

// ============================
// ERROR HANDLING MEJORADO
// ============================

class ErrorHandler {
    static logError(error, context = '') {
        state.errorCount++;
        console.error(`❌ Error ${state.errorCount} [${context}]:`, error);
        
        if (window.gtag) {
            try {
                window.gtag('event', 'exception', {
                    description: `${context}: ${error.message}`,
                    fatal: false
                });
            } catch (e) {
                // Silent fail
            }
        }
        
        // Solo mostrar recovery después de muchos errores
        if (state.errorCount > 20) {
            this.showErrorRecovery();
        }
    }
    
    static showErrorRecovery() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff6b35, #ff69b4);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            z-index: 10002;
            font-weight: 600;
            box-shadow: 0 10px 30px rgba(255, 107, 53, 0.4);
        `;
        notification.innerHTML = '⚠️ Detectamos algunos errores. Recargando...';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }
}

// ============================
// DAILY ROTATION SYSTEM MEJORADO
// ============================

function getDailyRotation() {
    try {
        // Asegurar que los arrays estén inicializados
        if (!state.contentInitialized) {
            initializeContentArrays();
            state.contentInitialized = true;
        }
        
        const today = new Date();
        const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        
        console.log(`📅 Generating daily rotation for ${today.toDateString()} (seed: ${dateSeed})`);
        
        function seededRandom(seed) {
            const x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        }
        
        function shuffleWithSeed(array, seed) {
            if (!array || array.length === 0) return [];
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(seededRandom(seed + i) * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        }
        
        // Verificar que tengamos contenido
        if (ALL_PHOTOS_POOL.length === 0) {
            console.warn('⚠️ No photos available, using fallback');
            ALL_PHOTOS_POOL = getPhotoPool();
        }
        
        if (ALL_VIDEOS_POOL.length === 0) {
            console.warn('⚠️ No videos available, using fallback');
            ALL_VIDEOS_POOL = getVideoPool();
        }
        
        // Crear pools expandidos
        const expandedPhotos = [];
        const targetPhotoCount = Math.min(CONFIG.CONTENT.DAILY_PHOTOS, 200); // Límite seguro
        
        for (let i = 0; i < targetPhotoCount; i++) {
            const basePhoto = ALL_PHOTOS_POOL[i % ALL_PHOTOS_POOL.length];
            expandedPhotos.push(basePhoto);
        }
        
        const expandedVideos = [];
        const targetVideoCount = Math.min(CONFIG.CONTENT.DAILY_VIDEOS, 50); // Límite seguro
        
        for (let i = 0; i < targetVideoCount; i++) {
            const baseVideo = ALL_VIDEOS_POOL[i % ALL_VIDEOS_POOL.length];
            expandedVideos.push(baseVideo);
        }
        
        // Shuffle content
        const shuffledPhotos = shuffleWithSeed(expandedPhotos, dateSeed);
        const shuffledVideos = shuffleWithSeed(expandedVideos, dateSeed * 2);
        const shuffledBanners = shuffleWithSeed(BANNER_IMAGES, dateSeed * 3);
        const shuffledTeasers = shuffleWithSeed(TEASER_IMAGES, dateSeed * 4);
        
        const todayPhotos = shuffledPhotos.slice(0, targetPhotoCount);
        const todayVideos = shuffledVideos.slice(0, targetVideoCount);
        
        // Mark new content
        const newPhotoCount = Math.floor(todayPhotos.length * CONFIG.CONTENT.NEW_CONTENT_PERCENTAGE);
        const newVideoCount = Math.floor(todayVideos.length * CONFIG.CONTENT.NEW_CONTENT_PERCENTAGE);
        
        const rotation = {
            photos: todayPhotos,
            videos: todayVideos,
            banners: shuffledBanners.slice(0, 6),
            teasers: shuffledTeasers.slice(0, 12),
            newPhotoIndices: new Set(Array.from({length: newPhotoCount}, (_, i) => i)),
            newVideoIndices: new Set(Array.from({length: newVideoCount}, (_, i) => i)),
            lastUpdate: new Date(),
            stats: {
                totalPhotosPool: ALL_PHOTOS_POOL.length,
                totalVideosPool: ALL_VIDEOS_POOL.length,
                dailyPhotos: todayPhotos.length,
                dailyVideos: todayVideos.length,
                newPhotos: newPhotoCount,
                newVideos: newVideoCount
            }
        };
        
        console.log('📊 Daily rotation stats:', rotation.stats);
        return rotation;
        
    } catch (error) {
        ErrorHandler.logError(error, 'getDailyRotation');
        return {
            photos: ['full/bikini.webp', 'full/bikini3.webp'],
            videos: [], // Sin videos si hay error
            banners: ['bikini.webp', 'bikini3.webp'],
            teasers: ['bikini.webp', 'bikini3.webp'],
            newPhotoIndices: new Set([0]),
            newVideoIndices: new Set(),
            lastUpdate: new Date(),
            stats: {
                totalPhotosPool: 2,
                totalVideosPool: 0,
                dailyPhotos: 2,
                dailyVideos: 0,
                newPhotos: 1,
                newVideos: 0
            }
        };
    }
}

// ============================
// RENDER FUNCTIONS CORREGIDAS
// ============================

function renderPhotosProgressive() {
    try {
        const photosGrid = document.getElementById('photosGrid');
        if (!photosGrid || !state.dailyContent) return;
        
        const photosToShow = state.dailyContent.photos;
        const trans = TRANSLATIONS[state.currentLanguage];
        let photosHTML = '';
        
        console.log(`📸 Rendering ${photosToShow.length} photos`);
        
        photosToShow.forEach((photo, index) => {
            const id = `p${index}`;
            const isUnlocked = state.isVIP || state.unlockedContent.has(id);
            const unlockClass = isUnlocked ? 'unlocked' : '';
            const isNew = state.dailyContent.newPhotoIndices.has(index);
            const views = Math.floor(Math.random() * 15000) + 5000;
            const likes = Math.floor(Math.random() * 2000) + 500;
            
            // Determinar ruta correcta
            let imagePath = photo;
            if (!photo.includes('/')) {
                imagePath = `full/${photo}`;
            }
            
            photosHTML += `
                <div class="content-item ${unlockClass}" 
                     data-id="${id}" 
                     data-type="photo" 
                     data-index="${index}"
                     onclick="handlePhotoClick('${id}', '${photo}', ${index})"
                     role="button"
                     tabindex="0">
                    ${isNew ? `<span class="new-badge">${trans.new_today || 'NEW TODAY!'}</span>` : ''}
                    
                    <img class="item-media" 
                         src="${imagePath}" 
                         alt="Paradise Photo ${index + 1}"
                         style="filter: ${isUnlocked ? 'none' : `blur(${CONFIG.CONTENT.BLUR_PHOTO}px)`};"
                         loading="lazy"
                         onerror="handleImageError(this)">
                    
                    ${!isUnlocked ? `
                        <div class="lock-overlay">
                            <svg class="lock-icon" width="30" height="30" viewBox="0 0 24 24" fill="white">
                                <path d="M12 2C9.243 2 7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7z"></path>
                            </svg>
                        </div>
                        <div class="item-price">
                            €${CONFIG.PAYPAL.PRICES.SINGLE_PHOTO.toFixed(2)}
                        </div>
                    ` : ''}
                    
                    <div class="item-overlay">
                        <div class="item-title">Paradise #${index + 1}</div>
                        <div class="item-info">
                            ${views.toLocaleString()} views • ${likes.toLocaleString()} likes
                        </div>
                    </div>
                </div>
            `;
        });
        
        photosGrid.innerHTML = photosHTML;
        console.log('✅ Photos rendered successfully');
    } catch (error) {
        ErrorHandler.logError(error, 'renderPhotosProgressive');
    }
}

function renderVideosProgressive() {
    try {
        const videosGrid = document.getElementById('videosGrid');
        if (!videosGrid || !state.dailyContent) return;
        
        const videosToShow = state.dailyContent.videos;
        const trans = TRANSLATIONS[state.currentLanguage];
        let videosHTML = '';
        
        console.log(`🎬 Rendering ${videosToShow.length} videos`);
        
        // Si no hay videos, mostrar mensaje
        if (videosToShow.length === 0) {
            videosHTML = `
                <div style="
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 2rem;
                    background: rgba(0, 119, 190, 0.1);
                    border-radius: 15px;
                    border: 1px solid rgba(127, 219, 255, 0.3);
                ">
                    <h3>🎬 Videos Coming Soon!</h3>
                    <p>Los videos exclusivos estarán disponibles pronto.</p>
                </div>
            `;
            videosGrid.innerHTML = videosHTML;
            return;
        }
        
        videosToShow.forEach((video, index) => {
            const id = `v${index}`;
            const isUnlocked = state.isVIP || state.unlockedContent.has(id);
            const unlockClass = isUnlocked ? 'unlocked' : '';
            const duration = generateRandomDuration();
            const isNew = state.dailyContent.newVideoIndices.has(index);
            const views = Math.floor(Math.random() * 25000) + 8000;
            const likes = Math.floor(Math.random() * 3000) + 800;
            
            // Usar imagen de poster en lugar de video
            const posterImage = state.dailyContent.banners[index % state.dailyContent.banners.length] || 'bikini.webp';
            
            videosHTML += `
                <div class="content-item ${unlockClass}" 
                     data-id="${id}" 
                     data-type="video" 
                     data-index="${index}"
                     onclick="handleVideoClick('${id}', '${video}', ${index})"
                     role="button"
                     tabindex="0">
                    ${isNew ? `<span class="new-badge">${trans.fresh_content || 'FRESH CONTENT!'}</span>` : ''}
                    
                    <img class="item-media" 
                         src="full/${posterImage}"
                         alt="Video Preview ${index + 1}"
                         style="filter: ${isUnlocked ? 'none' : `blur(${CONFIG.CONTENT.BLUR_VIDEO}px)`};"
                         loading="lazy"
                         onerror="handleImageError(this)">
                    
                    <div class="video-duration">${duration}</div>
                    
                    <div class="video-play-overlay">
                        <div class="play-button">
                            <div class="play-icon"></div>
                        </div>
                    </div>
                    
                    ${!isUnlocked ? `
                        <div class="lock-overlay">
                            <svg class="lock-icon" width="30" height="30" viewBox="0 0 24 24" fill="white">
                                <path d="M12 2C9.243 2 7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7z"></path>
                            </svg>
                        </div>
                        <div class="item-price">
                            €${CONFIG.PAYPAL.PRICES.SINGLE_VIDEO.toFixed(2)}
                        </div>
                    ` : ''}
                    
                    <div class="item-overlay">
                        <div class="item-title">Video #${index + 1}</div>
                        <div class="item-info">
                            ${views.toLocaleString()} views • ${likes.toLocaleString()} likes
                        </div>
                    </div>
                </div>
            `;
        });
        
        videosGrid.innerHTML = videosHTML;
        console.log('✅ Videos rendered successfully');
    } catch (error) {
        ErrorHandler.logError(error, 'renderVideosProgressive');
    }
}

// ============================
// ERROR HANDLERS MEJORADOS
// ============================

function handleImageError(img) {
    try {
        // Intentar fallback .webp
        if (!img.src.includes('.webp') && img.src.includes('.jpg')) {
            img.src = img.src.replace('.jpg', '.webp');
            return;
        }
        
        // Fallback final seguro
        if (!img.src.includes('bikini.webp')) {
            img.src = 'full/bikini.webp';
        } else {
            // Crear placeholder visual si todo falla
            img.style.cssText = `
                background: linear-gradient(45deg, #0077be, #00d4ff);
                display: block;
                min-height: 200px;
                object-fit: cover;
            `;
            img.alt = 'Content unavailable';
        }
    } catch (error) {
        ErrorHandler.logError(error, 'handleImageError');
    }
}

function handleVideoError(video) {
    try {
        console.warn('Video error:', video.src);
        ErrorHandler.logError(new Error(`Video failed: ${video.src}`), 'video_error');
        
        // Reemplazar con imagen estática
        const img = document.createElement('img');
        img.src = 'full/bikini.webp';
        img.className = video.className;
        img.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: cover;
        `;
        img.alt = 'Video preview unavailable';
        
        if (video.parentNode) {
            video.parentNode.replaceChild(img, video);
        }
    } catch (error) {
        ErrorHandler.logError(error, 'handleVideoError');
    }
}

// ============================
// UTILITY FUNCTIONS
// ============================

function generateRandomDuration() {
    const minutes = Math.floor(Math.random() * 15) + 1;
    const seconds = Math.floor(Math.random() * 60);
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function changeLanguage(lang) {
    try {
        if (!TRANSLATIONS[lang]) return;
        
        state.currentLanguage = lang;
        localStorage.setItem('ibiza_language', lang);
        
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (TRANSLATIONS[lang][key]) {
                element.textContent = TRANSLATIONS[lang][key];
            }
        });
        
        document.documentElement.lang = lang;
        
        if (state.dailyContent) {
            renderPhotosProgressive();
            renderVideosProgressive();
        }
        
        console.log(`🌍 Language changed to: ${lang}`);
    } catch (error) {
        ErrorHandler.logError(error, 'changeLanguage');
    }
}

function trackEvent(eventName, parameters = {}) {
    try {
        if (window.gtag) {
            window.gtag('event', eventName, {
                'event_category': 'engagement',
                'event_label': state.currentLanguage,
                ...parameters
            });
        }
        
        if (ENVIRONMENT.isDevelopment) {
            console.log(`📊 Event: ${eventName}`, parameters);
        }
    } catch (error) {
        // Silent fail for analytics
    }
}

// ============================
// INITIALIZATION SEQUENCE MEJORADA
// ============================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Initializing Paradise Gallery v14.3.4 CRITICAL FIXES...');
    
    try {
        // Inicializar contenido primero
        initializeContentArrays();
        
        // Cargar estado guardado
        loadSavedState();
        
        // Configurar selector de idioma
        const langSelect = document.getElementById('languageSelect');
        if (langSelect) {
            langSelect.value = state.currentLanguage;
        }
        
        // Obtener rotación del día
        state.dailyContent = getDailyRotation();
        if (state.dailyContent) {
            console.log(`📅 Daily rotation initialized: ${state.dailyContent.photos.length} photos, ${state.dailyContent.videos.length} videos`);
        }
        
        // Renderizar contenido
        renderPhotosProgressive();
        renderVideosProgressive();
        
        // Inicializar sistemas
        startBannerSlideshow();
        updateViewCounters();
        
        // Ocultar pantalla de carga
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
                console.log('🚀 Loading screen hidden');
            }
        }, 1500);
        
        // Track page view
        trackEvent('page_view', { 
            page: 'main_gallery', 
            language: state.currentLanguage,
            daily_photos: state.dailyContent.photos.length,
            daily_videos: state.dailyContent.videos.length,
            version: '14.3.4'
        });
        
        console.log('✅ Paradise Gallery loaded successfully!');
        console.log(`🌊 Version: 14.3.4 CRITICAL FIXES - ${state.dailyContent.stats.dailyPhotos} fotos + ${state.dailyContent.stats.dailyVideos} videos diarios`);
        
    } catch (error) {
        ErrorHandler.logError(error, 'DOMContentLoaded');
        console.error('❌ Critical initialization error:', error);
        
        // Mostrar contenido de fallback
        document.body.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                background: linear-gradient(180deg, #001f3f 0%, #003366 100%);
                color: white;
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 2rem;
            ">
                <div>
                    <h1>🌊 IbizaGirl.pics</h1>
                    <p>Estamos experimentando dificultades técnicas.</p>
                    <p>Por favor, recarga la página en unos momentos.</p>
                    <button onclick="window.location.reload()" style="
                        background: linear-gradient(135deg, #00a8cc, #00d4ff);
                        color: #001f3f;
                        border: none;
                        padding: 1rem 2rem;
                        border-radius: 25px;
                        font-weight: 600;
                        cursor: pointer;
                        margin-top: 1rem;
                    ">🔄 Recargar</button>
                </div>
            </div>
        `;
    }
});

// ============================
// FUNCIONES BÁSICAS REQUERIDAS
// ============================

function loadSavedState() {
    try {
        const savedLang = localStorage.getItem('ibiza_language') || 'es';
        if (savedLang !== state.currentLanguage) {
            state.currentLanguage = savedLang;
        }
    } catch (e) {
        console.error('Error loading saved state:', e);
    }
}

function startBannerSlideshow() {
    try {
        const slides = document.querySelectorAll('.banner-slide');
        if (slides.length === 0) return;
        
        setInterval(() => {
            if (slides[state.currentSlide]) {
                slides[state.currentSlide].classList.remove('active');
            }
            state.currentSlide = (state.currentSlide + 1) % slides.length;
            if (slides[state.currentSlide]) {
                slides[state.currentSlide].classList.add('active');
            }
        }, 5000);
        
        console.log('🎬 Banner slideshow started');
    } catch (error) {
        ErrorHandler.logError(error, 'startBannerSlideshow');
    }
}

function updateViewCounters() {
    try {
        if (state.dailyContent) {
            const photoCount = document.getElementById('photoCount');
            const videoCount = document.getElementById('videoCount');
            
            if (photoCount) photoCount.textContent = state.dailyContent.stats.dailyPhotos;
            if (videoCount) videoCount.textContent = state.dailyContent.stats.dailyVideos;
        }
    } catch (error) {
        ErrorHandler.logError(error, 'updateViewCounters');
    }
}

// Placeholder functions para evitar errores
function handlePhotoClick(id, filename, index) {
    console.log('Photo clicked:', id);
}

function handleVideoClick(id, filename, index) {
    console.log('Video clicked:', id);
}

// ============================
// GLOBAL EXPORTS
// ============================

window.handleImageError = handleImageError;
window.handleVideoError = handleVideoError;
window.changeLanguage = changeLanguage;
window.handlePhotoClick = handlePhotoClick;
window.handleVideoClick = handleVideoClick;

// ============================
// ERROR HANDLING GLOBAL
// ============================

window.addEventListener('error', (e) => {
    ErrorHandler.logError(e.error || new Error(e.message), 'Global Error Handler');
});

window.addEventListener('unhandledrejection', (e) => {
    ErrorHandler.logError(e.reason, 'Unhandled Promise Rejection');
    e.preventDefault();
});

console.log('✅ Script loaded and ready with CRITICAL FIXES v14.3.4!');
