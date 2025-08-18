/**
 * IbizaGirl.pics - Main Script v16.0.0 MODULAR FIXED
 * Sistema principal con integración modular corregida
 */

// ============================
// CONFIGURATION
// ============================

const CONFIG = {
    version: '16.0.0',
    environment: 'production',
    debug: false,
    api: {
        baseUrl: 'https://ibizagirl.pics',
        timeout: 30000,
        retryAttempts: 3
    },
    media: {
        lazyLoadOffset: 50,
        imageQuality: 'high',
        videoPreload: 'metadata'
    },
    ui: {
        animationDuration: 300,
        modalBackdrop: true,
        sidebarCollapsible: true
    },
    cache: {
        enabled: true,
        duration: 3600000,
        maxSize: 50
    },
    analytics: {
        enabled: true,
        trackingId: 'G-XXXXXXXXXX'
    }
};

const ENVIRONMENT = {
    isDevelopment: window.location.hostname === 'localhost',
    isStaging: window.location.hostname.includes('staging'),
    isProduction: !window.location.hostname.includes('localhost') && !window.location.hostname.includes('staging')
};

// ============================
// TRANSLATIONS
// ============================

const TRANSLATIONS = {
    es: {
        loading: "Cargando el paraíso...",
        subtitle: "Contenido Exclusivo del Paraíso",
        megapack: "📦 MEGA PACKS -70%",
        monthly: "💳 €15/Mes",
        lifetime: "👑 Lifetime €100",
        welcome: "Bienvenido al Paraíso 🌴",
        daily_content: "200+ fotos y 40+ videos actualizados DIARIAMENTE",
        unlock_all: "🔓 Desbloquear Todo",
        view_gallery: "📸 Ver Galería",
        preview_gallery: "🔥 Preview Exclusivo",
        photos_today: "Fotos de Hoy",
        updated_at: "Actualizado a las",
        videos_hd: "Videos HD",
        new_content: "¡CONTENIDO NUEVO!",
        total_views: "Vistas Totales",
        today: "hoy",
        updates: "Actualizaciones",
        always_fresh: "SIEMPRE FRESCO",
        paradise_photos: "📸 Fotos del Paraíso",
        new_today: "¡NUEVO HOY!",
        exclusive_videos: "🎬 Videos Exclusivos",
        fresh_content: "¡CONTENIDO FRESCO!",
        loading_images: "Cargando imágenes del paraíso...",
        error_loading: "Error al cargar. Por favor, actualiza.",
        special_offers: "⭐ OFERTAS ESPECIALES",
        unlock_now: "🔓 DESBLOQUEAR AHORA",
        vip_access: "💎 ACCESO VIP",
        instant_access: "Acceso instantáneo a TODO el contenido",
        cancel_anytime: "Cancela cuando quieras",
        secure_payment: "Pago 100% seguro",
        satisfaction_guaranteed: "Satisfacción garantizada",
        back: "← Volver",
        continue: "Continuar →",
        close: "✕ Cerrar",
        yes: "Sí",
        no: "No",
        confirm: "Confirmar",
        cancel: "Cancelar",
        success: "¡Éxito!",
        error: "Error",
        warning: "Advertencia",
        info: "Información",
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
        notification_unlocked: "{icon} ¡Desbloqueado! {credits} créditos restantes.",
        payment_error: "❌ Error en el pago. Por favor, intenta de nuevo.",
        isabella_messages: [
            "¡Hola preciosa! 😘 ¿Buscas el paraíso?",
            "Pssst... ¡Los miembros VIP ven todo sin desenfoque! 👀",
            "¿Lista para desbloquear el paraíso? ¡VIP te da acceso instantáneo a todo! 🌊",
            "¡Hoy tenemos 200 fotos nuevas y 40 videos nuevos! 🎉",
            "¡Solo haz clic en cualquier contenido borroso para desbloquearlo! 💕"
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
        loading_images: "Loading paradise images...",
        error_loading: "Error loading. Please refresh.",
        special_offers: "⭐ SPECIAL OFFERS",
        unlock_now: "🔓 UNLOCK NOW",
        vip_access: "💎 VIP ACCESS",
        instant_access: "Instant access to ALL content",
        cancel_anytime: "Cancel anytime",
        secure_payment: "100% secure payment",
        satisfaction_guaranteed: "Satisfaction guaranteed",
        back: "← Back",
        continue: "Continue →",
        close: "✕ Close",
        yes: "Yes",
        no: "No",
        confirm: "Confirm",
        cancel: "Cancel",
        success: "Success!",
        error: "Error",
        warning: "Warning",
        info: "Information",
        isabella_title: "Isabella - Your VIP Guide",
        vip_info: "💎 VIP Info",
        news: "📅 What's New",
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
    currentPPVItem: null
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
        notification.innerHTML = '⚠️ Detectamos algunos errores. <a href="#" onclick="window.location.reload()" style="color: white; text-decoration: underline;">Recargar página</a>';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 10000);
    }
}

// ============================
// CONTENT SYSTEM MANAGER
// ============================

class ContentSystemManager {
    constructor() {
        this.initialized = false;
        this.contentCache = new Map();
    }
    
    waitForContentSystem(callback, maxRetries = 50) {
        let retries = 0;
        const checkInterval = setInterval(() => {
            retries++;
            
            if (window.ContentAPI && window.UnifiedContentAPI) {
                clearInterval(checkInterval);
                this.initialized = true;
                callback();
            } else if (retries >= maxRetries) {
                clearInterval(checkInterval);
                console.warn('⚠️ Content system timeout, using fallback');
                this.useFallback();
                callback();
            }
        }, 100);
    }
    
    useFallback() {
        // Crear APIs fallback si no están disponibles
        if (!window.ContentAPI) {
            window.ContentAPI = {
                getPublicImages: () => [],
                getPremiumImages: () => [],
                getVideos: () => [],
                getBanners: () => [],
                getTeasers: () => [],
                search: () => ({ photos: [], videos: [] }),
                getStats: () => ({ total: 0, public: 0, premium: 0, videos: 0 })
            };
        }
        
        if (!window.UnifiedContentAPI) {
            window.UnifiedContentAPI = {
                getAllPublicImages: () => [],
                getAllPremiumImages: () => [],
                getAllVideos: () => [],
                searchAll: () => ({ photos: [], videos: [] }),
                getSystemStats: () => ({ photos: 0, videos: 0 })
            };
        }
    }
    
    getContent() {
        try {
            if (!this.initialized) {
                this.useFallback();
            }
            
            const photos = window.ALL_PHOTOS_POOL || window.ContentAPI?.getPublicImages(200) || [];
            const videos = window.ALL_VIDEOS_POOL || window.ContentAPI?.getVideos(50) || [];
            const banners = window.BANNER_IMAGES || window.ContentAPI?.getBanners() || [];
            const teasers = window.TEASER_IMAGES || window.ContentAPI?.getTeasers() || [];
            
            return {
                photos: photos,
                videos: videos,
                banners: banners,
                teasers: teasers,
                stats: {
                    dailyPhotos: photos.length || 6,
                    dailyVideos: videos.length || 0,
                    totalPhotos: photos.length,
                    totalVideos: videos.length
                },
                newPhotoIndices: new Set([0, 1, 2, 3, 4]),
                newVideoIndices: new Set([0, 1])
            };
        } catch (error) {
            ErrorHandler.logError(error, 'ContentSystemManager.getContent');
            return this.getDefaultContent();
        }
    }
    
    getDefaultContent() {
        return {
            photos: [],
            videos: [],
            banners: [],
            teasers: [],
            stats: {
                dailyPhotos: 0,
                dailyVideos: 0,
                totalPhotos: 0,
                totalVideos: 0
            },
            newPhotoIndices: new Set(),
            newVideoIndices: new Set()
        };
    }
}

// ============================
// IMAGE AND VIDEO ERROR HANDLERS
// ============================

function handleImageError(img) {
    try {
        if (!img || img.dataset.errorHandled === 'true') return;
        img.dataset.errorHandled = 'true';
        
        const fallbacks = [
            '/full/alina-48.webp',
            '/full/preview-1.webp',
            '/full/teaser-1.webp',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="20"%3EImagen no disponible%3C/text%3E%3C/svg%3E'
        ];
        
        let currentSrc = img.src.split('/').pop();
        let fallbackIndex = fallbacks.findIndex(f => f.includes(currentSrc));
        
        if (fallbackIndex === -1 || fallbackIndex >= fallbacks.length - 1) {
            fallbackIndex = 0;
        } else {
            fallbackIndex++;
        }
        
        img.src = fallbacks[fallbackIndex];
        img.onerror = null;
    } catch (error) {
        ErrorHandler.logError(error, 'handleImageError');
    }
}

function handleVideoError(video) {
    try {
        video.style.display = 'none';
        const container = video.closest('.video-item');
        if (container) {
            container.innerHTML = '<div class="video-placeholder">🎬 Video no disponible</div>';
        }
    } catch (error) {
        ErrorHandler.logError(error, 'handleVideoError');
    }
}// ============================
// RENDERING FUNCTIONS
// ============================

function renderPhotosProgressive() {
    try {
        const photos = state.dailyContent?.photos || window.ALL_PHOTOS_POOL || [];
        const photosContainer = document.getElementById('photosGrid');
        
        if (!photosContainer || photos.length === 0) {
            console.warn('⚠️ No photos container or photos found');
            return;
        }
        
        console.log(`📸 Rendering ${photos.length} photos`);
        
        let photosHTML = '';
        photos.forEach((photo, index) => {
            const isNew = state.dailyContent?.newPhotoIndices?.has(index) || index < 5;
            const isBlurred = !state.isVIP && !state.unlockedContent.has(photo);
            
            photosHTML += `
                <div class="photo-item ${isNew ? 'new-content' : ''}" data-index="${index}">
                    ${isNew ? '<span class="new-badge">🆕 NUEVO</span>' : ''}
                    <img 
                        src="${photo}"
                        alt="Paradise Photo ${index + 1}"
                        loading="lazy"
                        class="photo-image ${isBlurred ? 'blurred' : ''}"
                        onclick="handlePhotoClick('${photo}', ${index})"
                        onerror="handleImageError(this)"
                    />
                    <div class="photo-overlay">
                        <div class="photo-actions">
                            <button class="unlock-btn" onclick="handlePhotoClick('${photo}', ${index})">
                                ${isBlurred ? '🔓 Desbloquear' : '👁️ Ver'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        photosContainer.innerHTML = photosHTML;
        
    } catch (error) {
        ErrorHandler.logError(error, 'renderPhotosProgressive');
    }
}

function renderVideosProgressive() {
    try {
        const videos = state.dailyContent?.videos || window.ALL_VIDEOS_POOL || [];
        const videosContainer = document.getElementById('videosGrid');
        
        if (!videosContainer || videos.length === 0) {
            console.warn('⚠️ No videos container or videos found');
            return;
        }
        
        console.log(`🎬 Rendering ${videos.length} videos`);
        
        let videosHTML = '';
        videos.forEach((video, index) => {
            const isNew = state.dailyContent?.newVideoIndices?.has(index) || index < 2;
            const isBlurred = !state.isVIP;
            
            videosHTML += `
                <div class="video-item ${isNew ? 'new-content' : ''}" data-index="${index}">
                    ${isNew ? '<span class="new-badge">🆕 NUEVO</span>' : ''}
                    <div class="video-thumbnail ${isBlurred ? 'blurred' : ''}">
                        <video 
                            src="${video}"
                            preload="metadata"
                            muted
                            onclick="handleVideoClick('${video}', ${index})"
                            onerror="handleVideoError(this)"
                        ></video>
                        <div class="play-button">▶️</div>
                    </div>
                    <div class="video-overlay">
                        <button class="unlock-btn" onclick="handleVideoClick('${video}', ${index})">
                            ${isBlurred ? '🔓 Desbloquear VIP' : '▶️ Reproducir'}
                        </button>
                    </div>
                </div>
            `;
        });
        
        videosContainer.innerHTML = videosHTML;
        
    } catch (error) {
        ErrorHandler.logError(error, 'renderVideosProgressive');
    }
}

function renderTeaserCarousel() {
    try {
        const teasers = state.dailyContent?.teasers || window.TEASER_IMAGES || [];
        const carouselContainer = document.getElementById('teaserCarousel');
        
        if (!carouselContainer || teasers.length === 0) {
            console.warn('⚠️ No teaser carousel or teasers found');
            return;
        }
        
        let teasersHTML = '<div class="teaser-wrapper">';
        teasers.forEach((teaser, index) => {
            teasersHTML += `
                <div class="teaser-slide" data-index="${index}">
                    <img 
                        src="${teaser}"
                        alt="Teaser ${index + 1}"
                        loading="lazy"
                        onclick="handleTeaserClick('${teaser}', ${index})"
                        onerror="handleImageError(this)"
                    />
                </div>
            `;
        });
        teasersHTML += '</div>';
        
        carouselContainer.innerHTML = teasersHTML;
        
    } catch (error) {
        ErrorHandler.logError(error, 'renderTeaserCarousel');
    }
}

// ============================
// CLICK HANDLERS
// ============================

function handlePhotoClick(photo, index) {
    try {
        trackEvent('photo_click', { index, path: photo });
        
        if (!state.isVIP && !state.unlockedContent.has(photo)) {
            if (state.packCredits > 0) {
                // Desbloquear con créditos
                state.packCredits--;
                state.unlockedContent.add(photo);
                localStorage.setItem('ibizagirl_credits', state.packCredits.toString());
                
                // Actualizar UI
                const photoElements = document.querySelectorAll(`[onclick*="${photo}"]`);
                photoElements.forEach(el => {
                    el.classList.remove('blurred');
                });
                
                showNotification(`📸 ¡Desbloqueado! ${state.packCredits} créditos restantes.`, 'success');
            } else {
                // Mostrar modal VIP o PPV
                state.currentPPVItem = { type: 'photo', path: photo, price: 1.99 };
                showVIPModal();
            }
        } else {
            // Ver foto en pantalla completa
            openPhotoViewer(photo);
        }
    } catch (error) {
        ErrorHandler.logError(error, 'handlePhotoClick');
    }
}

function handleVideoClick(video, index) {
    try {
        trackEvent('video_click', { index, path: video });
        
        if (!state.isVIP) {
            state.currentPPVItem = { type: 'video', path: video, price: 4.99 };
            showVIPModal();
        } else {
            playVideo(video);
        }
    } catch (error) {
        ErrorHandler.logError(error, 'handleVideoClick');
    }
}

function handleTeaserClick(teaser, index) {
    try {
        trackEvent('teaser_click', { index, path: teaser });
        showPPVModal();
    } catch (error) {
        ErrorHandler.logError(error, 'handleTeaserClick');
    }
}

function openPhotoViewer(photo) {
    console.log('Opening photo viewer for:', photo);
    // Implementar visor de fotos
}

function playVideo(video) {
    console.log('Playing video:', video);
    // Implementar reproductor de video
}

// ============================
// MODAL FUNCTIONS
// ============================

function showVIPModal() {
    try {
        const modalHTML = `
            <div class="modal-backdrop" onclick="closeModal()"></div>
            <div class="modal-content vip-modal">
                <button class="modal-close" onclick="closeModal()">✕</button>
                <h2>💎 ${TRANSLATIONS[state.currentLanguage].vip_unlimited}</h2>
                <div class="vip-options">
                    <div class="plan-option" data-plan="monthly" onclick="selectPlan('monthly')">
                        <h3>${TRANSLATIONS[state.currentLanguage].plan_monthly}</h3>
                        <p class="price">€15/mes</p>
                    </div>
                    <div class="plan-option selected" data-plan="lifetime" onclick="selectPlan('lifetime')">
                        <h3>${TRANSLATIONS[state.currentLanguage].plan_lifetime}</h3>
                        <p class="price">€100</p>
                        <span class="badge">${TRANSLATIONS[state.currentLanguage].best_value}</span>
                    </div>
                </div>
                <div id="paypal-button-container-vip"></div>
            </div>
        `;
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = modalHTML;
        document.body.appendChild(modal);
        
        initializeVIPPayPal();
        
    } catch (error) {
        ErrorHandler.logError(error, 'showVIPModal');
    }
}

function showPackModal() {
    try {
        const modalHTML = `
            <div class="modal-backdrop" onclick="closeModal()"></div>
            <div class="modal-content pack-modal">
                <button class="modal-close" onclick="closeModal()">✕</button>
                <h2>${TRANSLATIONS[state.currentLanguage].pack_selection}</h2>
                <div class="pack-options">
                    <div class="pack-option" data-pack="starter" onclick="selectPack('starter')">
                        <h3>${TRANSLATIONS[state.currentLanguage].pack_starter}</h3>
                        <p>50 ${TRANSLATIONS[state.currentLanguage].items}</p>
                        <p class="price">€9.99</p>
                    </div>
                    <div class="pack-option selected" data-pack="silver" onclick="selectPack('silver')">
                        <h3>${TRANSLATIONS[state.currentLanguage].pack_silver}</h3>
                        <p>300 ${TRANSLATIONS[state.currentLanguage].items}</p>
                        <p class="price">€49.99</p>
                    </div>
                    <div class="pack-option" data-pack="gold" onclick="selectPack('gold')">
                        <h3>${TRANSLATIONS[state.currentLanguage].pack_gold}</h3>
                        <p>500 ${TRANSLATIONS[state.currentLanguage].items}</p>
                        <p class="price">€79.99</p>
                    </div>
                </div>
                <div id="paypal-button-container-pack"></div>
            </div>
        `;
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = modalHTML;
        document.body.appendChild(modal);
        
        initializePackPayPal();
        
    } catch (error) {
        ErrorHandler.logError(error, 'showPackModal');
    }
}

function showPPVModal() {
    try {
        if (!state.currentPPVItem) return;
        
        const modalHTML = `
            <div class="modal-backdrop" onclick="closeModal()"></div>
            <div class="modal-content ppv-modal">
                <button class="modal-close" onclick="closeModal()">✕</button>
                <h2>${TRANSLATIONS[state.currentLanguage].unlock_content}</h2>
                <p>Precio: €${state.currentPPVItem.price}</p>
                <div id="paypal-button-container-ppv"></div>
            </div>
        `;
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = modalHTML;
        document.body.appendChild(modal);
        
        initializePPVPayPal(state.currentPPVItem.price);
        
    } catch (error) {
        ErrorHandler.logError(error, 'showPPVModal');
    }
}

function closeModal() {
    try {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => modal.remove());
    } catch (error) {
        ErrorHandler.logError(error, 'closeModal');
    }
}

// ============================
// PAYPAL INTEGRATION
// ============================

function initializePayPalButtons() {
    // Verificar si PayPal está disponible
    if (typeof window.paypal === 'undefined') {
        console.warn('⚠️ PayPal SDK not loaded');
        return;
    }
    
    console.log('✅ PayPal SDK loaded');
}

function initializeVIPPayPal() {
    try {
        if (!window.paypal) return;
        
        const price = state.selectedSubscriptionType === 'monthly' ? 15 : 100;
        
        window.paypal.Buttons({
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: price.toFixed(2),
                            currency_code: 'EUR'
                        },
                        description: `VIP ${state.selectedSubscriptionType}`
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    handleVIPSuccess(details);
                });
            },
            onError: function(err) {
                ErrorHandler.logError(err, 'PayPal VIP Error');
                showNotification('❌ Error en el pago. Por favor, intenta de nuevo.', 'error');
            }
        }).render('#paypal-button-container-vip');
        
    } catch (error) {
        ErrorHandler.logError(error, 'initializeVIPPayPal');
    }
}

function initializePackPayPal() {
    try {
        if (!window.paypal) return;
        
        const prices = { starter: 9.99, bronze: 29.99, silver: 49.99, gold: 79.99 };
        const price = prices[state.selectedPack] || 49.99;
        
        window.paypal.Buttons({
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: price.toFixed(2),
                            currency_code: 'EUR'
                        },
                        description: `${state.selectedPack} Pack`
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    handlePackSuccess(details);
                });
            },
            onError: function(err) {
                ErrorHandler.logError(err, 'PayPal Pack Error');
                showNotification('❌ Error en el pago. Por favor, intenta de nuevo.', 'error');
            }
        }).render('#paypal-button-container-pack');
        
    } catch (error) {
        ErrorHandler.logError(error, 'initializePackPayPal');
    }
}

function initializePPVPayPal(price) {
    try {
        if (!window.paypal) return;
        
        window.paypal.Buttons({
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: price.toFixed(2),
                            currency_code: 'EUR'
                        },
                        description: `Unlock ${state.currentPPVItem?.type || 'content'}`
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    handlePPVSuccess(details);
                });
            },
            onError: function(err) {
                ErrorHandler.logError(err, 'PayPal PPV Error');
                showNotification('❌ Error en el pago. Por favor, intenta de nuevo.', 'error');
            }
        }).render('#paypal-button-container-ppv');
        
    } catch (error) {
        ErrorHandler.logError(error, 'initializePPVPayPal');
    }
}

// ============================
// PAYMENT SUCCESS HANDLERS
// ============================

function handleVIPSuccess(details) {
    try {
        state.isVIP = true;
        localStorage.setItem('ibizagirl_vip', 'true');
        closeModal();
        
        showNotification('🎉 ¡Bienvenido VIP! Todo el contenido ha sido desbloqueado.', 'success');
        
        // Remove blur from all content
        document.querySelectorAll('.blurred').forEach(el => {
            el.classList.remove('blurred');
        });
        
        trackEvent('vip_purchase_success', { type: state.selectedSubscriptionType });
    } catch (error) {
        ErrorHandler.logError(error, 'handleVIPSuccess');
    }
}

function handlePackSuccess(details) {
    try {
        const packCredits = { starter: 50, bronze: 150, silver: 300, gold: 500 };
        const credits = packCredits[state.selectedPack] || 300;
        
        state.packCredits += credits;
        localStorage.setItem('ibizagirl_credits', state.packCredits.toString());
        closeModal();
        
        showNotification(`🎉 ${credits} créditos añadidos! Haz clic en cualquier contenido para desbloquearlo.`, 'success');
        
        trackEvent('pack_purchase_success', { pack: state.selectedPack, credits: credits });
    } catch (error) {
        ErrorHandler.logError(error, 'handlePackSuccess');
    }
}

function handlePPVSuccess(details) {
    try {
        if (state.currentPPVItem) {
            state.unlockedContent.add(state.currentPPVItem.path);
            
            // Save to localStorage
            const unlockedArray = Array.from(state.unlockedContent);
            localStorage.setItem('ibizagirl_unlocked', JSON.stringify(unlockedArray));
            
            closeModal();
            
            // Remove blur from this specific item
            const elements = document.querySelectorAll(`[onclick*="${state.currentPPVItem.path}"]`);
            elements.forEach(el => {
                const img = el.querySelector('.blurred') || (el.classList.contains('blurred') ? el : null);
                if (img) img.classList.remove('blurred');
            });
            
            showNotification(`${state.currentPPVItem.type === 'video' ? '🎬' : '📸'} ¡Desbloqueado!`, 'success');
            
            trackEvent('ppv_purchase_success', { 
                type: state.currentPPVItem.type, 
                price: state.currentPPVItem.price 
            });
        }
    } catch (error) {
        ErrorHandler.logError(error, 'handlePPVSuccess');
    }
}

// ============================
// UTILITY FUNCTIONS
// ============================

function selectPlan(planType) {
    try {
        state.selectedSubscriptionType = planType;
        
        // Update UI to show selected plan
        document.querySelectorAll('.plan-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        const selectedOption = document.querySelector(`[data-plan="${planType}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
        
        trackEvent('plan_selected', { plan: planType });
    } catch (error) {
        ErrorHandler.logError(error, 'selectPlan');
    }
}

function selectPack(packType) {
    try {
        state.selectedPack = packType;
        
        // Update UI to show selected pack
        document.querySelectorAll('.pack-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        const selectedOption = document.querySelector(`[data-pack="${packType}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
        
        trackEvent('pack_selected', { pack: packType });
    } catch (error) {
        ErrorHandler.logError(error, 'selectPack');
    }
}

function showNotification(message, type = 'info') {
    try {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #00d4ff, #00a8cc)' : 'linear-gradient(135deg, #ff6b35, #ff69b4)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            z-index: 10001;
            font-weight: 600;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease-out;
        `;
        notification.innerHTML = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    } catch (error) {
        ErrorHandler.logError(error, 'showNotification');
    }
}

function changeLanguage(lang) {
    try {
        if (TRANSLATIONS[lang]) {
            state.currentLanguage = lang;
            localStorage.setItem('ibizagirl_language', lang);
            updateUILanguage();
        }
    } catch (error) {
        ErrorHandler.logError(error, 'changeLanguage');
    }
}

function updateUILanguage() {
    // Actualizar todos los textos de la UI con el nuevo idioma
    console.log(`Language changed to: ${state.currentLanguage}`);
}

function trackEvent(eventName, params = {}) {
    try {
        if (window.gtag) {
            window.gtag('event', eventName, params);
        }
    } catch (error) {
        // Silent fail
    }
}

function toggleIsabella() {
    state.isabellaOpen = !state.isabellaOpen;
    console.log('Isabella toggled:', state.isabellaOpen);
}

// ============================
// BANNER SLIDESHOW
// ============================

function startBannerSlideshow() {
    try {
        const banners = state.dailyContent?.banners || [];
        if (banners.length === 0) return;
        
        let currentBanner = 0;
        const bannerContainer = document.getElementById('bannerSlideshow');
        
        if (!bannerContainer) return;
        
        setInterval(() => {
            currentBanner = (currentBanner + 1) % banners.length;
            bannerContainer.style.backgroundImage = `url(${banners[currentBanner]})`;
        }, 5000);
        
    } catch (error) {
        ErrorHandler.logError(error, 'startBannerSlideshow');
    }
}

// ============================
// VIEW COUNTERS
// ============================

function updateViewCounters() {
    try {
        if (state.dailyContent && state.dailyContent.stats) {
            const photoCount = document.getElementById('photoCount');
            const videoCount = document.getElementById('videoCount');
            
            if (photoCount) photoCount.textContent = state.dailyContent.stats.dailyPhotos || 0;
            if (videoCount) videoCount.textContent = state.dailyContent.stats.dailyVideos || 0;
        }
    } catch (error) {
        ErrorHandler.logError(error, 'updateViewCounters');
    }
}

// ============================
// EVENT LISTENERS
// ============================

function setupEventListeners() {
    try {
        // Lazy loading para imágenes
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
        
    } catch (error) {
        ErrorHandler.logError(error, 'setupEventListeners');
    }
}

// ============================
// SAVED STATE
// ============================

function loadSavedState() {
    try {
        // Load VIP status
        const savedVIP = localStorage.getItem('ibizagirl_vip');
        if (savedVIP === 'true') {
            state.isVIP = true;
        }
        
        // Load pack credits
        const savedCredits = localStorage.getItem('ibizagirl_credits');
        if (savedCredits) {
            state.packCredits = parseInt(savedCredits) || 0;
        }
        
        // Load unlocked content
        const savedUnlocked = localStorage.getItem('ibizagirl_unlocked');
        if (savedUnlocked) {
            try {
                const unlockedArray = JSON.parse(savedUnlocked);
                state.unlockedContent = new Set(unlockedArray);
            } catch (e) {
                // Invalid JSON, reset
                state.unlockedContent = new Set();
            }
        }
        
        // Load language
        const savedLanguage = localStorage.getItem('ibizagirl_language');
        if (savedLanguage && TRANSLATIONS[savedLanguage]) {
            changeLanguage(savedLanguage);
        }
        
    } catch (error) {
        ErrorHandler.logError(error, 'loadSavedState');
    }
}

// ============================
// INITIALIZATION
// ============================

function initializeApplication() {
    try {
        console.log('🎨 Initializing Paradise Gallery v16.0.0 MODULAR FIXED...');
        
        // Initialize content system manager
        const contentManager = new ContentSystemManager();
        
        // Wait for modular content system
        contentManager.waitForContentSystem(() => {
            console.log('✅ Sistema de contenido modular listo');
            
            // Get content from modular system
            state.dailyContent = contentManager.getContent();
            
            // Verificar que dailyContent tiene la estructura correcta
            if (!state.dailyContent || !state.dailyContent.stats) {
                console.warn('⚠️ dailyContent no tiene estructura válida, usando fallback');
                state.dailyContent = contentManager.getDefaultContent();
            }
            
            console.log(`📅 Daily rotation initialized: ${state.dailyContent.stats.dailyPhotos} photos, ${state.dailyContent.stats.dailyVideos} videos`);
            
            // Render content
            renderPhotosProgressive();
            renderVideosProgressive();
            renderTeaserCarousel();
            
            // Start banner slideshow
            startBannerSlideshow();
            
            // Update counters
            updateViewCounters();
            
            // Initialize other components
            initializePayPalButtons();
            setupEventListeners();
            
            // Load saved state
            loadSavedState();
            
            // Show success
            console.log('✅ Paradise Gallery loaded successfully with modular system!');
            state.contentInitialized = true;
        });
        
    } catch (error) {
        ErrorHandler.logError(error, 'initializeApplication');
        showFallbackContent();
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
window.handleVideoError = handleVideoError;
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
window.trackEvent = trackEvent;

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
            'Daily Content': !!state.dailyContent,
            'Content Initialized': state.contentInitialized
        });
        return state;
    };
}

console.log('✅ Main Script v16.0.0 MODULAR FIXED loaded successfully');
