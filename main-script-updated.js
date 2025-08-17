// ============================
// IBIZAGIRL.PICS v15.0.0 MODULAR INTEGRATION COMPLETE
// Main Script - Modular System Integration
// Last updated: 2025-01-17
// ============================

'use strict';

console.log('🌊 IbizaGirl.pics v15.0.0 MODULAR INTEGRATION - Loading Paradise Gallery...');

// ============================
// ENVIRONMENT DETECTION
// ============================

const ENVIRONMENT = {
    isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    isProduction: window.location.hostname === 'ibizagirl.pics'
};

console.log('🌍 Environment:', ENVIRONMENT.isProduction ? 'Production' : 'Development');

// ============================
// CONFIGURATION
// ============================

const CONFIG = {
    paypal: {
        clientId: 'AfQEdiielw5fm3wF08p9pcxwqR3gPz82YRNUTKY4A8WNG9AktiGsDNyr2i7BsjVzSwwpeCwR7Tt7DPq5',
        currency: 'EUR',
        environment: ENVIRONMENT.isProduction ? 'production' : 'sandbox'
    },
    ui: {
        animationDuration: 300,
        slideInterval: 5000,
        loadingDelay: 1000
    },
    content: {
        photosPerPage: 24,
        videosPerPage: 12,
        rotationHours: 1
    }
};

// ============================
// TRANSLATIONS
// ============================

const TRANSLATIONS = {
    es: {
        loading: "Cargando paraíso...",
        subtitle: "Contenido Exclusivo del Paraíso",
        megapack: "📦 MEGA PACKS -70%",
        monthly: "💳 €15/Mes",
        lifetime: "👑 Lifetime €100",
        welcome: "Bienvenido al Paraíso 🌴",
        daily_content: "200+ fotos y 40+ videos actualizados DIARIAMENTE",
        unlock_all: "🔓 Desbloquear Todo",
        view_gallery: "📸 Ver Galería",
        preview_gallery: "🔥 Vista Previa Exclusiva",
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
        vip_unlimited: "👑 VIP Unlimited Access",
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
        notification.innerHTML = '⚠️ Detectamos algunos errores. <button onclick="window.location.reload()" style="background: white; color: #ff6b35; border: none; padding: 0.5rem 1rem; border-radius: 5px; margin-left: 10px; cursor: pointer; font-weight: 600;">🔄 Recargar</button>';
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 10000);
    }
}

// ============================
// CONTENT SYSTEM MANAGER
// ============================

class ContentSystemManager {
    constructor() {
        this.isModularSystemReady = false;
        this.fallbackContent = {
            photos: [
                'full/bikini.webp',
                'full/bikbanner.webp', 
                'full/bikbanner2.webp',
                'full/backbikini.webp',
                'full/bikini3.webp',
                'full/bikini5.webp'
            ],
            videos: [],
            stats: {
                dailyPhotos: 6,
                dailyVideos: 0,
                newPhotos: 2,
                newVideos: 0
            }
        };
    }
    
    checkModularSystem() {
        return !!(window.ContentAPI && window.UnifiedContentAPI && window.getRandomContentForMainScript);
    }
    
    initializeFallbackContent() {
        console.log('🆘 Inicializando contenido de fallback...');
        
        // Expose arrays for compatibility
        window.ALL_PHOTOS_POOL = this.fallbackContent.photos;
        window.ALL_VIDEOS_POOL = this.fallbackContent.videos;
        window.BANNER_IMAGES = this.fallbackContent.photos.slice(0, 3);
        window.TEASER_IMAGES = this.fallbackContent.photos.slice(3, 6);
        
        console.log('✅ Contenido de fallback inicializado');
    }
    
    getContent() {
        try {
            if (this.checkModularSystem()) {
                console.log('📊 Usando sistema de contenido modular...');
                return window.generateDailyRotationForMainScript();
            } else {
                console.log('🔄 Sistema modular no disponible, usando fallback...');
                this.initializeFallbackContent();
                return {
                    photos: this.fallbackContent.photos,
                    videos: this.fallbackContent.videos,
                    banners: this.fallbackContent.photos.slice(0, 3),
                    teasers: this.fallbackContent.photos.slice(3, 6),
                    newPhotoIndices: new Set([0, 1]),
                    newVideoIndices: new Set(),
                    lastUpdate: new Date(),
                    stats: this.fallbackContent.stats
                };
            }
        } catch (error) {
            ErrorHandler.logError(error, 'ContentSystemManager.getContent');
            this.initializeFallbackContent();
            return {
                photos: this.fallbackContent.photos,
                videos: this.fallbackContent.videos,
                banners: this.fallbackContent.photos.slice(0, 3),
                teasers: this.fallbackContent.photos.slice(3, 6),
                newPhotoIndices: new Set([0, 1]),
                newVideoIndices: new Set(),
                lastUpdate: new Date(),
                stats: this.fallbackContent.stats
            };
        }
    }
}

// ============================
// MODULAR SYSTEM INTEGRATION
// ============================

function waitForContentSystem(callback, timeout = 10000) {
    const startTime = Date.now();
    const checkInterval = 100;
    
    const check = () => {
        if (window.ContentAPI && window.UnifiedContentAPI && window.getRandomContentForMainScript) {
            console.log('✅ Sistema de contenido listo - evento recibido');
            callback();
            return;
        }
        
        if (Date.now() - startTime > timeout) {
            console.warn('⚠️ Timeout esperando sistema de contenido, usando fallback');
            callback();
            return;
        }
        
        setTimeout(check, checkInterval);
    };
    
    check();
}

// Listen for content system ready event
window.addEventListener('contentSystemReady', (event) => {
    console.log('✅ Sistema de contenido listo - evento recibido');
    if (!state.contentInitialized && event.detail?.initialized) {
        initializeApplication();
    }
});

// ============================
// IMAGE AND VIDEO HANDLERS
// ============================

function handleImageError(img) {
    try {
        const fallbacks = [
            'full/bikini.webp',
            'full/bikbanner.webp',
            'full/backbikini.webp'
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
}

// ============================
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
        console.log('✅ Photos rendered successfully');
        
    } catch (error) {
        ErrorHandler.logError(error, 'renderPhotosProgressive');
    }
}

function renderVideosProgressive() {
    try {
        const videos = state.dailyContent?.videos || window.ALL_VIDEOS_POOL || [];
        const videosContainer = document.getElementById('videosGrid');
        
        if (!videosContainer) {
            console.warn('⚠️ No videos container found');
            return;
        }
        
        console.log(`🎬 Rendering ${videos.length} videos`);
        
        if (videos.length === 0) {
            videosContainer.innerHTML = '<div class="no-videos">🎬 Videos premium disponibles para miembros VIP</div>';
            return;
        }
        
        let videosHTML = '';
        videos.forEach((video, index) => {
            const isNew = state.dailyContent?.newVideoIndices?.has(index) || index < 3;
            const isBlurred = !state.isVIP && !state.unlockedContent.has(video);
            
            videosHTML += `
                <div class="video-item ${isNew ? 'new-content' : ''}" data-index="${index}">
                    ${isNew ? '<span class="new-badge">🆕 NUEVO</span>' : ''}
                    <div class="video-thumbnail ${isBlurred ? 'blurred' : ''}" onclick="handleVideoClick('${video}', ${index})">
                        <div class="play-button">▶️</div>
                        <div class="video-duration">HD</div>
                    </div>
                    <div class="video-actions">
                        <button class="unlock-btn" onclick="handleVideoClick('${video}', ${index})">
                            ${isBlurred ? '🔓 Desbloquear' : '🎬 Reproducir'}
                        </button>
                    </div>
                </div>
            `;
        });
        
        videosContainer.innerHTML = videosHTML;
        console.log('✅ Videos rendered successfully');
        
    } catch (error) {
        ErrorHandler.logError(error, 'renderVideosProgressive');
    }
}

function renderTeaserCarousel() {
    try {
        const teasers = state.dailyContent?.teasers || window.TEASER_IMAGES || [];
        const teaserContainer = document.getElementById('teaserCarousel');
        
        if (!teaserContainer || teasers.length === 0) return;
        
        let teaserHTML = '';
        teasers.forEach((teaser, index) => {
            teaserHTML += `
                <div class="teaser-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                    <img 
                        src="${teaser}"
                        alt="Paradise Teaser ${index + 1}"
                        loading="lazy"
                        class="teaser-image"
                        onclick="handleTeaserClick('${teaser}', ${index})"
                        onerror="handleImageError(this)"
                    />
                    <div class="teaser-overlay">
                        <h3>Exclusive Content</h3>
                        <p>Unlock paradise gallery</p>
                    </div>
                </div>
            `;
        });
        
        teaserContainer.innerHTML = teaserHTML;
        
    } catch (error) {
        ErrorHandler.logError(error, 'renderTeaserCarousel');
    }
}

// ============================
// EVENT HANDLERS
// ============================

function handlePhotoClick(photoPath, index) {
    try {
        if (state.isVIP || state.unlockedContent.has(photoPath)) {
            // Open fullscreen viewer
            openPhotoViewer(photoPath, index);
        } else {
            // Show unlock modal
            showPPVModal(photoPath, 'photo', 0.10);
        }
        
        trackEvent('photo_click', { path: photoPath, index: index });
    } catch (error) {
        ErrorHandler.logError(error, 'handlePhotoClick');
    }
}

function handleVideoClick(videoPath, index) {
    try {
        if (state.isVIP || state.unlockedContent.has(videoPath)) {
            // Open video player
            openVideoPlayer(videoPath, index);
        } else {
            // Show unlock modal
            showPPVModal(videoPath, 'video', 0.30);
        }
        
        trackEvent('video_click', { path: videoPath, index: index });
    } catch (error) {
        ErrorHandler.logError(error, 'handleVideoClick');
    }
}

function handleTeaserClick(teaserPath, index) {
    try {
        showVIPModal();
        trackEvent('teaser_click', { path: teaserPath, index: index });
    } catch (error) {
        ErrorHandler.logError(error, 'handleTeaserClick');
    }
}

// ============================
// MODAL FUNCTIONS
// ============================

function showVIPModal() {
    try {
        const modal = document.getElementById('vipModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            trackEvent('vip_modal_open');
        }
    } catch (error) {
        ErrorHandler.logError(error, 'showVIPModal');
    }
}

function showPackModal() {
    try {
        const modal = document.getElementById('packModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            trackEvent('pack_modal_open');
        }
    } catch (error) {
        ErrorHandler.logError(error, 'showPackModal');
    }
}

function showPPVModal(itemPath, itemType, price) {
    try {
        const modal = document.getElementById('ppvModal');
        const title = document.getElementById('ppvTitle');
        const priceElement = document.getElementById('ppvPrice');
        
        if (modal && title && priceElement) {
            state.currentPPVItem = { path: itemPath, type: itemType, price: price };
            title.textContent = itemType === 'video' ? '🎬 Desbloquear Video' : '📸 Desbloquear Foto';
            priceElement.textContent = `€${price.toFixed(2)}`;
            
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Initialize PayPal button for PPV
            if (window.paypal && document.getElementById('paypal-button-container-ppv')) {
                initializePPVPayPal(price);
            }
            
            trackEvent('ppv_modal_open', { type: itemType, price: price });
        }
    } catch (error) {
        ErrorHandler.logError(error, 'showPPVModal');
    }
}

function closeModal() {
    try {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
        state.currentPPVItem = null;
    } catch (error) {
        ErrorHandler.logError(error, 'closeModal');
    }
}

// ============================
// PAYPAL INTEGRATION
// ============================

function initializePayPalButtons() {
    try {
        if (!window.paypal) {
            console.warn('⚠️ PayPal SDK not loaded');
            return;
        }
        
        // VIP Subscription PayPal
        const vipContainer = document.getElementById('paypal-button-container-vip');
        if (vipContainer && !vipContainer.hasChildNodes()) {
            window.paypal.Buttons({
                createOrder: function(data, actions) {
                    const amount = state.selectedSubscriptionType === 'monthly' ? '15.00' : '100.00';
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: amount,
                                currency_code: 'EUR'
                            },
                            description: state.selectedSubscriptionType === 'monthly' ? 'VIP Monthly Subscription' : 'VIP Lifetime Access'
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
        }
        
        // Pack PayPal
        const packContainer = document.getElementById('paypal-button-container-pack');
        if (packContainer && !packContainer.hasChildNodes()) {
            window.paypal.Buttons({
                createOrder: function(data, actions) {
                    const packPrices = { starter: '10.00', bronze: '25.00', silver: '45.00', gold: '75.00' };
                    const amount = packPrices[state.selectedPack] || '45.00';
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: amount,
                                currency_code: 'EUR'
                            },
                            description: `${state.selectedPack.charAt(0).toUpperCase() + state.selectedPack.slice(1)} Pack`
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
        }
        
    } catch (error) {
        ErrorHandler.logError(error, 'initializePayPalButtons');
    }
}

function initializePPVPayPal(price) {
    try {
        const container = document.getElementById('paypal-button-container-ppv');
        if (!container) return;
        
        container.innerHTML = ''; // Clear existing buttons
        
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
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            z-index: 10003;
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;
        
        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #00d4ff, #00a8cc)';
        } else if (type === 'error') {
            notification.style.background = 'linear-gradient(135deg, #ff6b35, #ff69b4)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
    } catch (error) {
        ErrorHandler.logError(error, 'showNotification');
    }
}

function trackEvent(eventName, properties = {}) {
    try {
        if (window.gtag) {
            window.gtag('event', eventName, properties);
        }
        
        if (ENVIRONMENT.isDevelopment) {
            console.log(`📊 Event: ${eventName}`, properties);
        }
    } catch (error) {
        ErrorHandler.logError(error, 'trackEvent');
    }
}

function setupEventListeners() {
    try {
        // Language switching
        const langSwitcher = document.getElementById('languageSwitch');
        if (langSwitcher) {
            langSwitcher.addEventListener('change', (e) => {
                changeLanguage(e.target.value);
            });
        }
        
        // Modal close events
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                closeModal();
            }
        });
        
        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
        
        // Isabella chat toggle
        const isabellaBtn = document.querySelector('.isabella-btn');
        if (isabellaBtn) {
            isabellaBtn.addEventListener('click', toggleIsabella);
        }
        
    } catch (error) {
        ErrorHandler.logError(error, 'setupEventListeners');
    }
}

function changeLanguage(lang) {
    try {
        state.currentLanguage = lang;
        
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
                element.textContent = TRANSLATIONS[lang][key];
            }
        });
        
        localStorage.setItem('ibizagirl_language', lang);
        trackEvent('language_change', { language: lang });
    } catch (error) {
        ErrorHandler.logError(error, 'changeLanguage');
    }
}

function toggleIsabella() {
    try {
        const isabellaChat = document.querySelector('.isabella-chat');
        if (isabellaChat) {
            state.isabellaOpen = !state.isabellaOpen;
            isabellaChat.style.display = state.isabellaOpen ? 'block' : 'none';
            
            if (state.isabellaOpen) {
                showIsabellaMessage();
            }
        }
    } catch (error) {
        ErrorHandler.logError(error, 'toggleIsabella');
    }
}

function showIsabellaMessage() {
    try {
        const messages = TRANSLATIONS[state.currentLanguage].isabella_messages;
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        const messageElement = document.querySelector('.isabella-message');
        if (messageElement) {
            messageElement.textContent = randomMessage;
        }
    } catch (error) {
        ErrorHandler.logError(error, 'showIsabellaMessage');
    }
}

function startBannerSlideshow() {
    try {
        const slides = document.querySelectorAll('.teaser-slide');
        if (slides.length <= 1) return;
        
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
        if (state.dailyContent && state.dailyContent.stats) {
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
// INITIALIZATION
// ============================

function initializeApplication() {
    try {
        console.log('🎨 Initializing Paradise Gallery v15.0.0 MODULAR INTEGRATION...');
        
        // Wait for modular content system
        waitForContentSystem(() => {
            console.log('✅ Sistema de contenido modular listo');
            
            // Get content from modular system
            const contentSystemManager = new ContentSystemManager();
            state.dailyContent = contentSystemManager.getContent();
            
            // FIX: Verificar que dailyContent tiene la estructura correcta
            if (!state.dailyContent || !state.dailyContent.stats) {
                console.warn('⚠️ dailyContent no tiene estructura válida, usando fallback');
                state.dailyContent = {
                    stats: {
                        dailyPhotos: 6,
                        dailyVideos: 0
                    },
                    photos: window.ALL_PHOTOS_POOL || [],
                    videos: window.ALL_VIDEOS_POOL || []
                };
            }
            
            // FIX: Verificar que stats tiene las propiedades necesarias
            if (typeof state.dailyContent.stats.dailyPhotos === 'undefined') {
                state.dailyContent.stats.dailyPhotos = state.dailyContent.photos?.length || 6;
            }
            
            if (typeof state.dailyContent.stats.dailyVideos === 'undefined') {
                state.dailyContent.stats.dailyVideos = state.dailyContent.videos?.length || 0;
            }
            
            console.log(`📅 Daily rotation initialized: ${state.dailyContent?.stats?.dailyPhotos || 0} photos, ${state.dailyContent?.stats?.dailyVideos || 0} videos`);
            
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
            console.log(`🌊 Version: 15.0.0 MODULAR - ${state.dailyContent.stats.dailyPhotos} photos + ${state.dailyContent.stats.dailyVideos} videos daily`);
            
            // Mark as initialized
            state.contentInitialized = true;
            
            // Hide loading screen
            setTimeout(() => {
                const loadingScreen = document.querySelector('.loading-screen');
                if (loadingScreen) {
                    loadingScreen.style.display = 'none';
                    console.log('🚀 Loading screen hidden');
                }
            }, 1000);
            
        });
        
    } catch (error) {
        ErrorHandler.logError(error, 'Application Initialization');
        console.error('❌ Critical initialization error:', error);
        showFallbackContent();
    }
}

function loadSavedState() {
    try {
        // Load VIP status
        const savedVIP = localStorage.getItem('ibizagirl_vip');
        if (savedVIP === 'true') {
            state.isVIP = true;
        }
        
        // Load credits
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
