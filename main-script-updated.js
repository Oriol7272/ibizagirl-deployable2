// ============================
// IBIZAGIRL.PICS MAIN SCRIPT v15.0.0 - INTEGRADO CON SISTEMA MODULAR
// Fixed: Complete integration with modular content system
// Enhanced: Compatibility with content-data modules 1-6
// ============================

console.log('🌊 IbizaGirl.pics v15.0.0 MODULAR INTEGRATION - Loading Paradise Gallery...');

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
// CONFIGURACIÓN MODULAR
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
        preview_gallery: "🔥 Vista Previa Exclusiva",
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
        vip_info: "💎 VIP Info",
        news: "📅 Novedades",
        help: "❓ Ayuda",
        vip_unlimited: "👑 Acceso VIP Ilimitado",
        plan_monthly: "📅 Mensual",
        plan_lifetime: "♾️ Lifetime",
        unlimited_access: "Acceso ilimitado",
        all_content: "Todo el contenido actual y futuro",
        priority_support: "Soporte prioritario",
        exclusive_content: "Contenido exclusivo VIP",
        best_value: "MEJOR VALOR",
        save_yearly: "¡Ahorra €80 al año!",
        pack_selection: "📦 MEGA PACKS - Ahorra 70%",
        pack_starter: "Starter Pack",
        pack_bronze: "Bronze Pack", 
        pack_silver: "Silver Pack",
        pack_gold: "Gold Pack",
        items: "contenidos",
        save: "Ahorra",
        unlock_content: "🔓 Desbloquear Contenido",
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
        preview_gallery: "🔥 Exclusive Preview",
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
        vip_info: "💎 VIP Info",
        news: "📅 News",
        help: "❓ Help",
        vip_unlimited: "👑 Unlimited VIP Access",
        plan_monthly: "📅 Monthly",
        plan_lifetime: "♾️ Lifetime",
        unlimited_access: "Unlimited access",
        all_content: "All current and future content",
        priority_support: "Priority support",
        exclusive_content: "Exclusive VIP content",
        best_value: "BEST VALUE",
        save_yearly: "Save €80 per year!",
        pack_selection: "📦 MEGA PACKS - Save 70%",
        pack_starter: "Starter Pack",
        pack_bronze: "Bronze Pack",
        pack_silver: "Silver Pack", 
        pack_gold: "Gold Pack",
        items: "items",
        save: "Save",
        unlock_content: "🔓 Unlock Content",
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
    contentInitialized: false,
    isabellaOpen: false,
    currentPPVItem: null,
    modulesLoaded: false
};

// ============================
// ENHANCED ERROR HANDLING
// ============================

class ErrorHandler {
    static logError(error, context = '') {
        const errorMessage = error?.message || error?.toString() || 'Unknown error';
        
        const ignoredErrors = [
            'Script error',
            'ResizeObserver',
            'Non-Error promise rejection',
            '429',
            'Failed to fetch',
            'NetworkError',
            'Load failed',
            'The user aborted a request',
            'Extension context',
            'chrome-extension',
            'moz-extension'
        ];
        
        const shouldIgnore = ignoredErrors.some(ignored => 
            errorMessage.toLowerCase().includes(ignored.toLowerCase())
        );
        
        if (shouldIgnore) {
            return;
        }
        
        state.errorCount++;
        console.error(`❌ Error ${state.errorCount} [${context}]:`, error);
        
        if (window.gtag && state.errorCount <= 10) {
            try {
                window.gtag('event', 'exception', {
                    description: `${context}: ${errorMessage}`,
                    fatal: false
                });
            } catch (e) {
                // Silent fail
            }
        }
        
        if (state.errorCount > 50) {
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
// CONTENT SYSTEM INTEGRATION
// ============================

class ContentSystemManager {
    constructor() {
        this.contentReady = false;
        this.retryAttempts = 0;
        this.maxRetries = 10;
    }

    // Esperar a que el sistema de contenido esté listo
    async waitForContentSystem() {
        return new Promise((resolve) => {
            // Si ya está listo, resolver inmediatamente
            if (this.isContentSystemReady()) {
                this.contentReady = true;
                resolve(true);
                return;
            }

            // Escuchar el evento de sistema listo
            const handleContentReady = () => {
                console.log('✅ Sistema de contenido listo - evento recibido');
                this.contentReady = true;
                window.removeEventListener('contentSystemReady', handleContentReady);
                resolve(true);
            };

            window.addEventListener('contentSystemReady', handleContentReady);

            // También verificar periódicamente
            const checkInterval = setInterval(() => {
                if (this.isContentSystemReady()) {
                    this.contentReady = true;
                    clearInterval(checkInterval);
                    window.removeEventListener('contentSystemReady', handleContentReady);
                    resolve(true);
                } else {
                    this.retryAttempts++;
                    if (this.retryAttempts >= this.maxRetries) {
                        console.warn('⚠️ Timeout esperando sistema de contenido, usando fallback');
                        clearInterval(checkInterval);
                        window.removeEventListener('contentSystemReady', handleContentReady);
                        this.initializeFallbackContent();
                        resolve(true);
                    }
                }
            }, 500);
        });
    }

    // Verificar si el sistema de contenido está listo
    isContentSystemReady() {
        return !!(
            window.ContentAPI && 
            window.UnifiedContentAPI && 
            window.ALL_PHOTOS_POOL && 
            window.ALL_PHOTOS_POOL.length > 0
        );
    }

    // Inicializar contenido de fallback
    initializeFallbackContent() {
        console.log('🆘 Inicializando contenido de fallback...');
        
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

        this.contentReady = true;
        console.log('✅ Contenido de fallback inicializado');
    }

    // Obtener contenido usando la API modular o fallback
    getContent() {
        if (window.generateDailyRotationForMainScript) {
            return window.generateDailyRotationForMainScript();
        }

        if (window.getRandomContentForMainScript) {
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
                    totalPhotosPool: content.photos.length,
                    totalVideosPool: content.videos.length,
                    dailyPhotos: content.photos.length,
                    dailyVideos: content.videos.length,
                    newPhotos: 5,
                    newVideos: 3
                }
            };
        }

        // Fallback manual
        return {
            photos: window.ALL_PHOTOS_POOL || [],
            videos: window.ALL_VIDEOS_POOL || [],
            banners: window.BANNER_IMAGES || [],
            teasers: window.TEASER_IMAGES || [],
            newPhotoIndices: new Set([0, 1, 2]),
            newVideoIndices: new Set([0]),
            lastUpdate: new Date(),
            stats: {
                totalPhotosPool: (window.ALL_PHOTOS_POOL || []).length,
                totalVideosPool: (window.ALL_VIDEOS_POOL || []).length,
                dailyPhotos: (window.ALL_PHOTOS_POOL || []).length,
                dailyVideos: (window.ALL_VIDEOS_POOL || []).length,
                newPhotos: 3,
                newVideos: 1
            }
        };
    }
}

// ============================
// RENDER FUNCTIONS
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

function renderTeaserCarousel() {
    try {
        const carousel = document.getElementById('teaserCarousel');
        if (!carousel || !state.dailyContent) return;
        
        let teaserHTML = '';
        const teasersToShow = state.dailyContent.teasers.slice(0, 12);
        
        teasersToShow.forEach((teaser, index) => {
            const imagePath = `full/${teaser}`;
            teaserHTML += `
                <div class="teaser-item" onclick="handleTeaserClick(${index})">
                    <img src="${imagePath}" 
                         alt="Teaser ${index + 1}"
                         loading="lazy"
                         onerror="handleImageError(this)">
                    <div class="teaser-overlay">
                        <div class="teaser-info">
                            <h3>Paradise Collection #${index + 1}</h3>
                            <p>${Math.floor(Math.random() * 50) + 10} exclusive photos</p>
                        </div>
                    </div>
                </div>
            `;
        });
        
        carousel.innerHTML = teaserHTML;
    } catch (error) {
        ErrorHandler.logError(error, 'renderTeaserCarousel');
    }
}

// ============================
// ERROR HANDLERS
// ============================

function handleImageError(img) {
    try {
        console.warn('Image error:', img.src);
        
        if (!img.src.includes('bikini.webp')) {
            img.src = 'full/bikini.webp';
        } else {
            img.style.cssText = `
                background: linear-gradient(45deg, #0077be, #00d4ff);
                display: block;
                min-height: 200px;
                object-fit: cover;
                width: 100%;
                height: 100%;
            `;
            img.alt = 'Content unavailable';
            img.removeAttribute('src');
        }
    } catch (error) {
        ErrorHandler.logError(error, 'handleImageError');
    }
}

// ============================
// MODAL FUNCTIONS
// ============================

function showVIPModal() {
    try {
        const modal = document.getElementById('vipModal');
        if (modal) {
            modal.classList.add('active');
            initializePayPalButtons('vip');
            trackEvent('modal_opened', { type: 'vip' });
        }
    } catch (error) {
        ErrorHandler.logError(error, 'showVIPModal');
    }
}

function showPackModal() {
    try {
        const modal = document.getElementById('packModal');
        if (modal) {
            modal.classList.add('active');
            initializePayPalButtons('pack');
            trackEvent('modal_opened', { type: 'pack' });
        }
    } catch (error) {
        ErrorHandler.logError(error, 'showPackModal');
    }
}

function showPPVModal(itemId, price) {
    try {
        const modal = document.getElementById('ppvModal');
        if (modal) {
            state.currentPPVItem = itemId;
            const priceElement = document.getElementById('ppvPrice');
            if (priceElement) {
                priceElement.textContent = `€${price.toFixed(2)}`;
            }
            modal.classList.add('active');
            initializePayPalButtons('ppv', price);
            trackEvent('modal_opened', { type: 'ppv', item: itemId, price: price });
        }
    } catch (error) {
        ErrorHandler.logError(error, 'showPPVModal');
    }
}

function closeModal() {
    try {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        trackEvent('modal_closed');
    } catch (error) {
        ErrorHandler.logError(error, 'closeModal');
    }
}

function selectPlan(planType) {
    try {
        state.selectedSubscriptionType = planType;
        document.querySelectorAll('.plan-card').forEach(card => {
            card.classList.remove('selected');
        });
        event.currentTarget.classList.add('selected');
        initializePayPalButtons('vip');
        trackEvent('plan_selected', { plan: planType });
    } catch (error) {
        ErrorHandler.logError(error, 'selectPlan');
    }
}

function selectPack(packType) {
    try {
        state.selectedPack = packType;
        document.querySelectorAll('.pack-card').forEach(card => {
            card.classList.remove('selected');
        });
        event.currentTarget.classList.add('selected');
        initializePayPalButtons('pack');
        trackEvent('pack_selected', { pack: packType });
    } catch (error) {
        ErrorHandler.logError(error, 'selectPack');
    }
}

// ============================
// ISABELLA CHAT
// ============================

function toggleIsabella() {
    try {
        const window = document.getElementById('isabellaWindow');
        if (window) {
            state.isabellaOpen = !state.isabellaOpen;
            window.classList.toggle('active');
            
            if (state.isabellaOpen && !window.querySelector('.isabella-message')) {
                showIsabellaMessage('welcome');
            }
            
            trackEvent('isabella_toggled', { open: state.isabellaOpen });
        }
    } catch (error) {
        ErrorHandler.logError(error, 'toggleIsabella');
    }
}

function isabellaAction(action) {
    try {
        const trans = TRANSLATIONS[state.currentLanguage];
        
        switch(action) {
            case 'vip':
                showIsabellaMessage('vip');
                setTimeout(() => showVIPModal(), 1000);
                break;
            case 'daily':
                showIsabellaMessage('daily');
                break;
            case 'help':
                showIsabellaMessage('help');
                break;
        }
        
        trackEvent('isabella_action', { action: action });
    } catch (error) {
        ErrorHandler.logError(error, 'isabellaAction');
    }
}

function showIsabellaMessage(type) {
    try {
        const messages = document.getElementById('isabellaMessages');
        if (!messages) return;
        
        const trans = TRANSLATIONS[state.currentLanguage];
        let messageText = '';
        
        switch(type) {
            case 'welcome':
                messageText = trans.isabella_messages[0];
                break;
            case 'vip':
                messageText = trans.isabella_messages[1];
                break;
            case 'daily':
                messageText = trans.isabella_messages[3];
                break;
            case 'help':
                messageText = trans.isabella_messages[4];
                break;
            default:
                messageText = trans.isabella_messages[Math.floor(Math.random() * trans.isabella_messages.length)];
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'isabella-message';
        messageDiv.textContent = messageText;
        messages.appendChild(messageDiv);
        
        messages.scrollTop = messages.scrollHeight;
    } catch (error) {
        ErrorHandler.logError(error, 'showIsabellaMessage');
    }
}

// ============================
// PAYPAL INTEGRATION
// ============================

function initializePayPalButtons(type, price = null) {
    try {
        if (!window.paypal) {
            console.warn('PayPal SDK not loaded');
            return;
        }
        
        let containerId, amount;
        
        switch(type) {
            case 'vip':
                containerId = 'paypal-button-container-vip';
                amount = state.selectedSubscriptionType === 'lifetime' ? 
                    CONFIG.PAYPAL.PRICES.LIFETIME_SUBSCRIPTION : 
                    CONFIG.PAYPAL.PRICES.MONTHLY_SUBSCRIPTION;
                break;
            case 'pack':
                containerId = 'paypal-button-container-pack';
                amount = CONFIG.PAYPAL.PACKS[state.selectedPack].price;
                break;
            case 'ppv':
                containerId = 'paypal-button-container-ppv';
                amount = price || CONFIG.PAYPAL.PRICES.SINGLE_PHOTO;
                break;
            default:
                return;
        }
        
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        
        paypal.Buttons({
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: amount.toFixed(2),
                            currency_code: CONFIG.PAYPAL.CURRENCY
                        }
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    handlePaymentSuccess(type, amount);
                });
            },
            onError: function(err) {
                handlePaymentError(err);
            }
        }).render('#' + containerId);
        
    } catch (error) {
        ErrorHandler.logError(error, 'initializePayPalButtons');
    }
}

function handlePaymentSuccess(type, amount) {
    try {
        const trans = TRANSLATIONS[state.currentLanguage];
        
        switch(type) {
            case 'vip':
                state.isVIP = true;
                unlockAllContent();
                showNotification(trans.notification_welcome);
                break;
            case 'pack':
                const pack = CONFIG.PAYPAL.PACKS[state.selectedPack];
                state.packCredits += pack.items;
                updateCreditsDisplay();
                showNotification(trans.notification_pack.replace('{credits}', pack.items));
                break;
            case 'ppv':
                if (state.currentPPVItem) {
                    state.unlockedContent.add(state.currentPPVItem);
                    updateContentItem(state.currentPPVItem);
                    showNotification(trans.notification_unlocked
                        .replace('{icon}', '🔓')
                        .replace('{credits}', state.packCredits));
                }
                break;
        }
        
        closeModal();
        trackEvent('payment_success', { type: type, amount: amount });
        
        if (window.confetti) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
        
    } catch (error) {
        ErrorHandler.logError(error, 'handlePaymentSuccess');
    }
}

function handlePaymentError(error) {
    const trans = TRANSLATIONS[state.currentLanguage];
    showNotification(trans.payment_error);
    ErrorHandler.logError(error, 'PayPal Payment');
}

// ============================
// CLICK HANDLERS
// ============================

function handlePhotoClick(id, filename, index) {
    try {
        if (state.isVIP || state.unlockedContent.has(id)) {
            viewFullContent(id, filename, 'photo');
        } else if (state.packCredits > 0) {
            unlockWithCredits(id);
        } else {
            showPPVModal(id, CONFIG.PAYPAL.PRICES.SINGLE_PHOTO);
        }
        
        trackEvent('photo_clicked', { id: id, index: index });
    } catch (error) {
        ErrorHandler.logError(error, 'handlePhotoClick');
    }
}

function handleVideoClick(id, filename, index) {
    try {
        if (state.isVIP || state.unlockedContent.has(id)) {
            viewFullContent(id, filename, 'video');
        } else if (state.packCredits > 0) {
            unlockWithCredits(id);
        } else {
            showPPVModal(id, CONFIG.PAYPAL.PRICES.SINGLE_VIDEO);
        }
        
        trackEvent('video_clicked', { id: id, index: index });
    } catch (error) {
        ErrorHandler.logError(error, 'handleVideoClick');
    }
}

function handleTeaserClick(index) {
    console.log('Teaser clicked:', index);
    document.getElementById('photosSection').scrollIntoView({ behavior: 'smooth' });
}

function viewFullContent(id, filename, type) {
    console.log(`Viewing ${type}:`, id, filename);
}

function unlockWithCredits(id) {
    if (state.packCredits > 0) {
        state.packCredits--;
        state.unlockedContent.add(id);
        updateContentItem(id);
        updateCreditsDisplay();
        
        const trans = TRANSLATIONS[state.currentLanguage];
        showNotification(trans.notification_unlocked
            .replace('{icon}', '🔓')
            .replace('{credits}', state.packCredits));
    }
}

function unlockAllContent() {
    document.querySelectorAll('.content-item').forEach(item => {
        const id = item.dataset.id;
        if (id) {
            state.unlockedContent.add(id);
            item.classList.add('unlocked');
        }
    });
}

function updateContentItem(id) {
    const item = document.querySelector(`[data-id="${id}"]`);
    if (item) {
        item.classList.add('unlocked');
    }
}

function updateCreditsDisplay() {
    const display = document.getElementById('creditsDisplay');
    const number = document.getElementById('creditsNumber');
    
    if (display && number) {
        number.textContent = state.packCredits;
        display.classList.toggle('active', state.packCredits > 0);
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function scrollCarousel(direction) {
    try {
        const carousel = document.getElementById('teaserCarousel');
        if (carousel) {
            const scrollAmount = 280 * direction;
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    } catch (error) {
        ErrorHandler.logError(error, 'scrollCarousel');
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

function showFallbackContent() {
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

// ============================
// GLOBAL ERROR HANDLING
// ============================

window.addEventListener('error', (e) => {
    const message = e.message || e.error?.message || '';
    const filename = e.filename || '';
    
    const ignoredPatterns = [
        'Script error',
        'ResizeObserver',
        'Non-Error promise rejection',
        'extension://',
        'chrome-extension://',
        'moz-extension://',
        '429',
        'Failed to fetch',
        'NetworkError',
        'AbortError',
        'The user aborted',
        'Load failed',
        'TypeError: Failed to fetch',
        'TypeError: NetworkError',
        'net::ERR_',
        'Cross-origin',
        'CORS',
        'Refused to execute',
        'Blocked by',
        'Mixed Content'
    ];
    
    const shouldIgnore = ignoredPatterns.some(pattern => 
        message.includes(pattern) || filename.includes(pattern)
    );
    
    if (!shouldIgnore) {
        ErrorHandler.logError(e.error || new Error(message), 'Global Error');
    }
    
    e.preventDefault();
});

window.addEventListener('unhandledrejection', (e) => {
    const reason = e.reason?.message || e.reason?.toString() || '';
    
    const ignoredRejections = [
        'Load failed',
        'NetworkError',
        'AbortError',
        'The user aborted',
        '429',
        'Failed to fetch',
        'TypeError: Failed to fetch',
        'net::ERR_',
        'CORS',
        'Cross-origin',
        'Blocked',
        'Mixed Content'
    ];
    
    const shouldIgnore = ignoredRejections.some(pattern => 
        reason.includes(pattern)
    );
    
    if (!shouldIgnore) {
        ErrorHandler.logError(e.reason, 'Unhandled Promise Rejection');
    }
    
    e.preventDefault();
});

// ============================
// GLOBAL EXPORTS
// ============================

window.handleImageError = handleImageError;
window.changeLanguage = changeLanguage;
window.handlePhotoClick = handlePhotoClick;
window.handleVideoClick = handleVideoClick;
window.handleTeaserClick = handleTeaserClick;
window.showVIPModal = showVIPModal;
window.showPackModal = showPackModal;
window.showPPVModal = showPPVModal;
window.closeModal = closeModal;
window.selectPlan = selectPlan;
window.selectPack = selectPack;
window.toggleIsabella = toggleIsabella;
window.isabellaAction = isabellaAction;
window.scrollCarousel = scrollCarousel;
window.trackEvent = trackEvent;

// ============================
// INITIALIZATION SEQUENCE
// ============================

async function initializeApplication() {
    console.log('🎨 Initializing Paradise Gallery v15.0.0 MODULAR INTEGRATION...');
    
    try {
        // Paso 1: Esperar al sistema de contenido modular
        const contentSystemManager = new ContentSystemManager();
        console.log('⏳ Esperando sistema de contenido modular...');
        
        await contentSystemManager.waitForContentSystem();
        console.log('✅ Sistema de contenido modular listo');
        
        // Paso 2: Cargar estado guardado
        loadSavedState();
        
        // Paso 3: Configurar selector de idioma
        const langSelect = document.getElementById('languageSelect');
        if (langSelect) {
            langSelect.value = state.currentLanguage;
        }
        
        // Paso 4: Obtener contenido diario usando el sistema modular
        state.dailyContent = contentSystemManager.getContent();
        if (state.dailyContent) {
            console.log(`📅 Daily rotation initialized: ${state.dailyContent.photos.length} photos, ${state.dailyContent.videos.length} videos`);
        }
        
        // Paso 5: Renderizar todo el contenido
        renderPhotosProgressive();
        renderVideosProgressive();
        renderTeaserCarousel();
        
        // Paso 6: Inicializar sistemas
        startBannerSlideshow();
        updateViewCounters();
        
        // Paso 7: Configurar Isabella
        setTimeout(() => {
            const notification = document.querySelector('.isabella-notification');
            if (notification) {
                notification.style.display = 'block';
            }
        }, 3000);
        
        // Paso 8: Event listeners
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
        
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
        });
        
        // Paso 9: Ocultar pantalla de carga
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
                console.log('🚀 Loading screen hidden');
            }
        }, 1500);
        
        // Paso 10: Analytics
        trackEvent('page_view', { 
            page: 'main_gallery', 
            language: state.currentLanguage,
            daily_photos: state.dailyContent.photos.length,
            daily_videos: state.dailyContent.videos.length,
            version: '15.0.0',
            modular_system: true,
            content_system_ready: contentSystemManager.contentReady
        });
        
        console.log('✅ Paradise Gallery loaded successfully with modular system!');
        console.log(`🌊 Version: 15.0.0 MODULAR - ${state.dailyContent.stats.dailyPhotos} photos + ${state.dailyContent.stats.dailyVideos} videos daily`);
        
        // Marcar como inicializado
        state.contentInitialized = true;
        
    } catch (error) {
        ErrorHandler.logError(error, 'Application Initialization');
        console.error('❌ Critical initialization error:', error);
        showFallbackContent();
    }
}

// ============================
// DOM READY HANDLER
// ============================

document.addEventListener('DOMContentLoaded', initializeApplication);

// ============================
// COMPATIBILITY AND DEBUGGING
// ============================

// Asegurar compatibilidad con el sistema anterior
window.state = state;
window.CONFIG = CONFIG;
window.TRANSLATIONS = TRANSLATIONS;

// Funciones de debugging para desarrollo
if (ENVIRONMENT.isDevelopment) {
    window.debugModularSystem = function() {
        console.log('🔍 DEBUG: Estado del sistema modular');
        console.table({
            'Content System Ready': !!(window.ContentAPI && window.UnifiedContentAPI),
            'Arrays Available': {
                'ALL_PHOTOS_POOL': !!window.ALL_PHOTOS_POOL,
                'ALL_VIDEOS_POOL': !!window.ALL_VIDEOS_POOL,
                'BANNER_IMAGES': !!window.BANNER_IMAGES,
                'TEASER_IMAGES': !!window.TEASER_IMAGES
            },
            'State': state,
            'Daily Content': !!state.dailyContent
        });
        
        if (window.getContentStats) {
            console.log('📊 Content Stats:', window.getContentStats());
        }
    };
    
    window.testModularContent = function() {
        console.log('🧪 TEST: Probando contenido modular');
        if (window.getRandomContentForMainScript) {
            console.log('Random Content:', window.getRandomContentForMainScript());
        }
        if (window.generateDailyRotationForMainScript) {
            console.log('Daily Rotation:', window.generateDailyRotationForMainScript());
        }
    };
    
    window.forceReloadContent = function() {
        console.log('🔄 Forzando recarga de contenido...');
        const contentSystemManager = new ContentSystemManager();
        state.dailyContent = contentSystemManager.getContent();
        renderPhotosProgressive();
        renderVideosProgressive();
        renderTeaserCarousel();
        updateViewCounters();
        console.log('✅ Contenido recargado');
    };
    
    console.log('🛠️ Funciones de debug disponibles:');
    console.log('  - debugModularSystem()');
    console.log('  - testModularContent()');
    console.log('  - forceReloadContent()');
}

console.log('✅ Script loaded and ready - v15.0.0 MODULAR INTEGRATION COMPLETE!');
