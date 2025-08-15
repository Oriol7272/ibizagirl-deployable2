// ============================
// IBIZAGIRL.PICS MAIN SCRIPT v14.0.0 - AD NETWORKS FIXED
// Solo 3 redes: JuicyAds, ExoClick, EroAdvertising
// ============================

console.log('🌊 IbizaGirl.pics v14.0.0 - Loading Paradise Gallery...');

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
console.log('🌐 Hostname:', window.location.hostname);
console.log('🔌 Port:', window.location.port || 'default');

// ============================
// CONFIGURATION
// ============================

const CONFIG = {
    // PayPal Configuration
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
    
    // Content Configuration
    CONTENT: {
        DAILY_PHOTOS: 200,
        DAILY_VIDEOS: 40,
        NEW_CONTENT_PERCENTAGE: 0.3,
        BLUR_PHOTO: 10,
        BLUR_VIDEO: 10
    },
    
    // Analytics
    ANALYTICS_ID: 'G-DBXYNPBSPY',
    
    // Ad Networks - Solo 3 redes
    ADS: {
        ENABLED: ENVIRONMENT.isProduction,
        JUICYADS: {
            enabled: true,
            zones: ['903748', '903749', '903750']
        },
        EXOCLICK: {
            enabled: true,
            zones: ['5748443', '5748444', '5748445']
        },
        EROADVERTISING: {
            enabled: true,
            zones: ['123456', '123457', '123458']
        }
    }
};

// ============================
// AD NETWORK VERIFICATION SYSTEM
// ============================

function verifyAdNetworks() {
    console.log('🔍 Verifying Ad Networks...');
    
    let adsDetected = 0;
    const adStatus = {
        juicyads: false,
        exoclick: false,
        eroadvertising: false
    };
    
    // Check JuicyAds
    if (window.juicyads_loaded || typeof adsbyjuicy !== 'undefined') {
        console.log('✅ JuicyAds: Loaded');
        adStatus.juicyads = true;
        adsDetected++;
    } else {
        console.warn('⚠️ JuicyAds: Not loaded');
    }
    
    // Check ExoClick
    if (window.exoclick_loaded || typeof ExoLoader !== 'undefined') {
        console.log('✅ ExoClick: Loaded');
        adStatus.exoclick = true;
        adsDetected++;
    } else {
        console.warn('⚠️ ExoClick: Not loaded');
    }
    
    // Check EroAdvertising
    if (window.eroadvertising_loaded || document.querySelector('[data-ero-spot]')) {
        console.log('✅ EroAdvertising: Loaded');
        adStatus.eroadvertising = true;
        adsDetected++;
    } else {
        console.warn('⚠️ EroAdvertising: Not loaded');
    }
    
    // Show status
    if (adsDetected === 0) {
        console.warn('⚠️ No ad networks loaded, showing placeholders');
        showAdPlaceholders();
    } else {
        console.log(`✅ ${adsDetected}/3 ad networks loaded successfully`);
    }
    
    // Track ad network status
    trackEvent('ad_networks_status', {
        juicyads: adStatus.juicyads,
        exoclick: adStatus.exoclick,
        eroadvertising: adStatus.eroadvertising,
        total_loaded: adsDetected
    });
    
    return adStatus;
}

function showAdPlaceholders() {
    document.querySelectorAll('.ad-container').forEach((container, index) => {
        if (container.children.length === 0 || container.innerHTML.trim() === '') {
            const placeholder = document.createElement('div');
            placeholder.className = 'ad-placeholder';
            placeholder.innerHTML = ENVIRONMENT.isDevelopment ? 
                'Ad Placeholder (Dev Mode)' : 
                'Advertisement';
            container.appendChild(placeholder);
        }
    });
}

// Initialize ExoClick zones safely
function initializeExoClick() {
    if (typeof ExoLoader !== 'undefined' && ExoLoader.addZone) {
        try {
            console.log('Initializing ExoClick zones...');
            
            // Initialize each zone from config
            if (CONFIG.ADS.EXOCLICK.enabled) {
                CONFIG.ADS.EXOCLICK.zones.forEach(zoneId => {
                    try {
                        ExoLoader.addZone({
                            type: "banner",
                            width: "728",
                            height: "90",
                            idzone: zoneId
                        });
                        console.log(`ExoClick zone ${zoneId} added`);
                    } catch (e) {
                        console.warn(`Failed to add ExoClick zone ${zoneId}:`, e);
                    }
                });
            }
        } catch (e) {
            console.error('ExoClick initialization error:', e);
        }
    }
}

// Initialize JuicyAds safely
function initializeJuicyAds() {
    if (typeof adsbyjuicy !== 'undefined') {
        console.log('JuicyAds is ready');
        // JuicyAds will auto-initialize with data-zone attributes
    }
}

// Initialize EroAdvertising safely
function initializeEroAdvertising() {
    if (window.eroadvertising_loaded) {
        console.log('EroAdvertising is ready');
        // EroAdvertising will auto-initialize with data-ero-spot attributes
    }
}

// Retry loading failed ad networks
function retryAdNetworks() {
    const maxRetries = 3;
    let retryCount = 0;
    
    const retryInterval = setInterval(() => {
        retryCount++;
        console.log(`Ad network retry attempt ${retryCount}/${maxRetries}`);
        
        const status = verifyAdNetworks();
        
        // Try to reinitialize networks that haven't loaded
        if (!status.exoclick) {
            initializeExoClick();
        }
        if (!status.juicyads) {
            initializeJuicyAds();
        }
        if (!status.eroadvertising) {
            initializeEroAdvertising();
        }
        
        // Stop retrying after max attempts or if all loaded
        if (retryCount >= maxRetries || 
            (status.juicyads && status.exoclick && status.eroadvertising)) {
            clearInterval(retryInterval);
            console.log('Ad network initialization complete');
        }
    }, 3000);
}

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
    lazyLoadObserver: null,
    currentPayPalContentId: null,
    currentPayPalContentType: null,
    creditsDisplayVisible: false
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
        vip_info: "💎 VIP Info",
        news: "📅 Novedades",
        help: "❓ Ayuda"
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
        vip_info: "💎 VIP Info",
        news: "📅 What's New",
        help: "❓ Help"
    }
};

// ============================
// UTILITY FUNCTIONS
// ============================

function trackEvent(eventName, parameters = {}) {
    // Google Analytics tracking
    if (window.gtag) {
        window.gtag('event', eventName, {
            'event_category': 'engagement',
            'event_label': state.currentLanguage,
            ...parameters
        });
    }
    
    // Console logging for development
    if (ENVIRONMENT.isDevelopment) {
        console.log(`📊 Event: ${eventName}`, parameters);
    }
}

function showNotification(message) {
    // Remove existing notifications
    document.querySelectorAll('.notification-toast').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 500);
    }, 5000);
}

// ============================
// INITIALIZATION
// ============================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Initializing Paradise Gallery...');
    console.log('📊 Event: page_view', { page: 'main_gallery', language: state.currentLanguage });
    
    // Hide loading screen after delay
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 1500);
    
    // Initialize ad networks
    if (CONFIG.ADS.ENABLED) {
        console.log('📢 Ad Networks: Enabled (Production)');
        setTimeout(() => {
            verifyAdNetworks();
            initializeExoClick();
            initializeJuicyAds();
            initializeEroAdvertising();
            
            // Start retry mechanism
            setTimeout(() => retryAdNetworks(), 5000);
        }, 2000);
    } else {
        console.log('📢 Ad Networks: Disabled (Development)');
        setTimeout(() => showAdPlaceholders(), 1000);
    }
    
    console.log('✅ Gallery loaded successfully!');
    console.log('🌍 Language:', state.currentLanguage);
    console.log('📊 Analytics:', CONFIG.ANALYTICS_ID);
    console.log('💳 PayPal: Ready');
    console.log('📢 Ad Networks: Enabled (Production)');
    console.log('🌊 Version: 14.0.0 - 200 fotos + 40 videos diarios + ads mejoradas');
});

// ============================
// GLOBAL FUNCTIONS FOR ONCLICK
// ============================

window.changeLanguage = function(lang) {
    if (TRANSLATIONS[lang]) {
        state.currentLanguage = lang;
        console.log(`Language changed to: ${lang}`);
        // Update UI elements here
    }
};

window.scrollCarousel = function(direction) {
    console.log(`Carousel scroll: ${direction}`);
    // Implement carousel scroll
};

window.showVIPModal = function() {
    console.log('Opening VIP modal');
    const modal = document.getElementById('vipModal');
    if (modal) modal.classList.add('active');
};

window.showPackModal = function() {
    console.log('Opening Pack modal');
    const modal = document.getElementById('packModal');
    if (modal) modal.classList.add('active');
};

window.closeModal = function() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
};

window.selectPlan = function(plan) {
    state.selectedSubscriptionType = plan;
    console.log(`Plan selected: ${plan}`);
};

window.selectPack = function(pack) {
    state.selectedPack = pack;
    console.log(`Pack selected: ${pack}`);
};

window.toggleIsabella = function() {
    const window = document.getElementById('isabellaWindow');
    if (window) {
        window.classList.toggle('active');
    }
};

window.isabellaAction = function(action) {
    console.log(`Isabella action: ${action}`);
};

// ============================
// DEBUG TOOLS
// ============================

window.galleryDebug = {
    version: '14.0.0 - Ad Networks Fixed',
    environment: ENVIRONMENT,
    config: CONFIG,
    state: state,
    
    // Ad network testing
    testAds: () => {
        console.log('🔍 Testing ad networks...');
        console.log('Environment:', ENVIRONMENT);
        console.log('Ads enabled:', CONFIG.ADS.ENABLED);
        console.log('JuicyAds config:', CONFIG.ADS.JUICYADS);
        console.log('ExoClick config:', CONFIG.ADS.EXOCLICK);
        console.log('EroAdvertising config:', CONFIG.ADS.EROADVERTISING);
        
        verifyAdNetworks();
    },
    
    // Force show placeholders
    showPlaceholders: () => {
        showAdPlaceholders();
    },
    
    // Check ad container status
    checkContainers: () => {
        const containers = document.querySelectorAll('.ad-container');
        console.log(`Found ${containers.length} ad containers:`);
        containers.forEach((container, index) => {
            console.log(`Container ${index}:`, {
                id: container.id,
                hasContent: container.children.length > 0,
                innerHTML: container.innerHTML.substring(0, 100) + '...'
            });
        });
    }
};

console.log('🔧 Debug tools available: galleryDebug');
console.log('💡 Try: galleryDebug.testAds() or galleryDebug.checkContainers()');
console.log('🌊 IbizaGirl.pics Paradise Gallery - Ready!');
