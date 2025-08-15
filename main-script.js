// ============================
// IBIZAGIRL.PICS MAIN SCRIPT v15.0.0 
// Sin carpetas public/assets - Arrays directos desde content-data.js
// ============================

console.log('🌊 IbizaGirl.pics v15.0.0 - Loading Paradise Gallery...');

// ============================
// LOAD CONTENT DATA
// ============================

// Cargar arrays desde content-data.js
let ALL_PHOTOS_POOL = [];
let ALL_VIDEOS_POOL = [];
let BANNER_IMAGES = [];
let TEASER_IMAGES = [];

// Verificar que los arrays están cargados
if (typeof ALL_PHOTOS_UNCENSORED !== 'undefined') {
    ALL_PHOTOS_POOL = ALL_PHOTOS_UNCENSORED;
    console.log(`✅ Loaded ${ALL_PHOTOS_POOL.length} photos from content-data.js`);
} else {
    console.error('❌ ALL_PHOTOS_UNCENSORED not found in content-data.js');
}

if (typeof ALL_VIDEOS_POOL !== 'undefined') {
    console.log(`✅ Loaded ${ALL_VIDEOS_POOL.length} videos from content-data.js`);
} else {
    console.error('❌ ALL_VIDEOS_POOL not found in content-data.js');
}

// Seleccionar imágenes para banners y teasers del pool principal
if (typeof ALL_PHOTOS_FULL !== 'undefined') {
    // Usar las primeras 6 fotos full para banners
    BANNER_IMAGES = ALL_PHOTOS_FULL.slice(0, 6);
    // Usar las siguientes 12 para teasers
    TEASER_IMAGES = ALL_PHOTOS_FULL.slice(6, 18);
} else {
    // Fallback: usar del pool uncensored
    BANNER_IMAGES = ALL_PHOTOS_POOL.slice(0, 6);
    TEASER_IMAGES = ALL_PHOTOS_POOL.slice(6, 18);
}

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
        BLUR_VIDEO: 10,
        // URLs base para contenido (si tienes CDN o servidor de archivos)
        CDN_BASE: ENVIRONMENT.isDevelopment ? '/' : 'https://cdn.ibizagirl.pics/',
        PHOTO_PATH: 'uncensored/',
        VIDEO_PATH: 'uncensored-videos/',
        FULL_PATH: 'full/'
    },
    
    // Analytics
    ANALYTICS_ID: 'G-DBXYNPBSPY',
    
    // Ad Networks
    ADS: {
        ENABLED: ENVIRONMENT.isProduction,
        JUICYADS: {
            enabled: ENVIRONMENT.isProduction,
            zones: { header: 903748, sidebar: 903749, footer: 903750 }
        },
        EXOCLICK: {
            enabled: ENVIRONMENT.isProduction,
            zones: { header: 5696328, sidebar: 5696329, footer: 5696330 }
        }
    }
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
        help: "❓ Ayuda",
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
        vip_info: "💎 VIP Info",
        news: "📅 What's New",
        help: "❓ Help",
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
    lazyLoadObserver: null,
    currentPayPalContentId: null,
    currentPayPalContentType: null
};

// ============================
// DAILY ROTATION SYSTEM
// ============================

function getDailyRotation() {
    const today = new Date();
    const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    
    console.log(`📅 Generating daily rotation for ${today.toDateString()} (seed: ${dateSeed})`);
    
    function seededRandom(seed) {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }
    
    function shuffleWithSeed(array, seed) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(seededRandom(seed + i) * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    // Shuffle and select content for today
    const shuffledPhotos = shuffleWithSeed(ALL_PHOTOS_POOL, dateSeed);
    const shuffledVideos = shuffleWithSeed(ALL_VIDEOS_POOL, dateSeed * 2);
    const shuffledBanners = shuffleWithSeed(BANNER_IMAGES, dateSeed * 3);
    const shuffledTeasers = shuffleWithSeed(TEASER_IMAGES, dateSeed * 4);
    
    const todayPhotos = shuffledPhotos.slice(0, CONFIG.CONTENT.DAILY_PHOTOS);
    const todayVideos = shuffledVideos.slice(0, CONFIG.CONTENT.DAILY_VIDEOS);
    
    // Mark percentage as "new today"
    const newPhotoCount = Math.floor(CONFIG.CONTENT.DAILY_PHOTOS * CONFIG.CONTENT.NEW_CONTENT_PERCENTAGE);
    const newVideoCount = Math.floor(CONFIG.CONTENT.DAILY_VIDEOS * CONFIG.CONTENT.NEW_CONTENT_PERCENTAGE);
    
    const rotation = {
        photos: todayPhotos,
        videos: todayVideos,
        banners: shuffledBanners,
        teasers: shuffledTeasers,
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
}

// ============================
// RENDER PHOTOS
// ============================

function renderPhotosProgressive() {
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
        
        // Construir URL de la imagen
        const imageUrl = `${CONFIG.CONTENT.CDN_BASE}${CONFIG.CONTENT.PHOTO_PATH}${photo}`;
        
        photosHTML += `
            <div class="content-item skeleton ${unlockClass}" 
                 data-id="${id}" 
                 data-type="photo" 
                 data-index="${index}"
                 onclick="handlePhotoClick('${id}', '${photo}', ${index})"
                 role="button"
                 tabindex="0">
                ${isNew ? `<span class="new-badge">${trans.new_today || 'NEW TODAY!'}</span>` : ''}
                
                <img class="item-media" 
                     data-src="${imageUrl}" 
                     alt="Paradise Photo ${index + 1}"
                     style="filter: ${isUnlocked ? 'none' : `blur(${CONFIG.CONTENT.BLUR_PHOTO}px)`};"
                     loading="lazy">
                
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
    
    // Setup lazy loading
    setupLazyLoading();
    
    console.log('✅ Photos rendered successfully');
}

// ============================
// RENDER VIDEOS
// ============================

function renderVideosProgressive() {
    const videosGrid = document.getElementById('videosGrid');
    if (!videosGrid || !state.dailyContent) return;
    
    const videosToShow = state.dailyContent.videos;
    const trans = TRANSLATIONS[state.currentLanguage];
    let videosHTML = '';
    
    console.log(`🎬 Rendering ${videosToShow.length} videos`);
    
    videosToShow.forEach((video, index) => {
        const id = `v${index}`;
        const isUnlocked = state.isVIP || state.unlockedContent.has(id);
        const unlockClass = isUnlocked ? 'unlocked' : '';
        const duration = generateRandomDuration();
        const isNew = state.dailyContent.newVideoIndices.has(index);
        const views = Math.floor(Math.random() * 25000) + 8000;
        const likes = Math.floor(Math.random() * 3000) + 800;
        
        // Construir URL del video
        const videoUrl = `${CONFIG.CONTENT.CDN_BASE}${CONFIG.CONTENT.VIDEO_PATH}${video}`;
        // Usar una imagen de poster del pool de banners
        const posterImage = BANNER_IMAGES[index % BANNER_IMAGES.length];
        const posterUrl = `${CONFIG.CONTENT.CDN_BASE}${CONFIG.CONTENT.FULL_PATH}${posterImage}`;
        
        videosHTML += `
            <div class="content-item skeleton ${unlockClass}" 
                 data-id="${id}" 
                 data-type="video" 
                 data-index="${index}"
                 onclick="handleVideoClick('${id}', '${video}', ${index})"
                 role="button"
                 tabindex="0">
                ${isNew ? `<span class="new-badge">${trans.fresh_content || 'FRESH CONTENT!'}</span>` : ''}
                
                <video class="item-media" 
                       muted 
                       loop 
                       playsinline
                       preload="none"
                       poster="${posterUrl}"
                       style="filter: ${isUnlocked ? 'none' : `blur(${CONFIG.CONTENT.BLUR_VIDEO}px)`};"
                       data-video-id="${id}">
                    <source data-src="${videoUrl}" type="video/mp4">
                    Tu navegador no soporta el elemento video.
                </video>
                
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
    
    // Setup video hover preview
    setupVideoHoverPreview();
    
    console.log('✅ Videos rendered successfully');
}

// ============================
// RENDER TEASER CAROUSEL
// ============================

function renderTeaserCarousel() {
    const teaserCarousel = document.getElementById('teaserCarousel');
    if (!teaserCarousel) return;
    
    const teasersToShow = state.dailyContent.teasers.slice(0, 12);
    let teaserHTML = '';
    
    teasersToShow.forEach((teaser, index) => {
        const views = Math.floor(Math.random() * 25000) + 10000;
        const likes = Math.floor(Math.random() * 5000) + 1000;
        
        // Construir URL del teaser
        const teaserUrl = `${CONFIG.CONTENT.CDN_BASE}${CONFIG.CONTENT.FULL_PATH}${teaser}`;
        
        teaserHTML += `
            <div class="teaser-item" data-index="${index}">
                <img class="item-media" 
                     data-src="${teaserUrl}" 
                     alt="Preview ${index + 1}"
                     loading="lazy">
                
                <div class="teaser-overlay">
                    <div class="teaser-info">
                        <h3>Paradise #${index + 1}</h3>
                        <p>${views.toLocaleString()} views • ${likes.toLocaleString()} likes</p>
                    </div>
                </div>
            </div>
        `;
    });
    
    teaserCarousel.innerHTML = teaserHTML;
    
    // Setup lazy loading para teasers
    setupLazyLoading();
}

// ============================
// LAZY LOADING SYSTEM
// ============================

function setupLazyLoading() {
    const imageOptions = {
        root: null,
        rootMargin: '50px 0px',
        threshold: 0.01
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target.querySelector('.item-media');
                
                if (img && img.dataset && img.dataset.src) {
                    const tempImg = new Image();
                    
                    tempImg.onload = () => {
                        img.src = img.dataset.src;
                        img.classList.remove('skeleton', 'lazy');
                        img.classList.add('loaded');
                        entry.target.classList.remove('skeleton');
                        delete img.dataset.src;
                    };
                    
                    tempImg.onerror = () => {
                        console.error('Failed to load image:', img.dataset.src);
                        img.classList.add('error');
                        // Usar imagen de fallback
                        const fallbackImage = BANNER_IMAGES[0];
                        img.src = `${CONFIG.CONTENT.CDN_BASE}${CONFIG.CONTENT.FULL_PATH}${fallbackImage}`;
                    };
                    
                    tempImg.src = img.dataset.src;
                    observer.unobserve(entry.target);
                }
            }
        });
    }, imageOptions);

    // Observar todas las imágenes
    document.querySelectorAll('.content-item, .teaser-item').forEach(item => {
        imageObserver.observe(item);
    });
    
    state.lazyLoadObserver = imageObserver;
}

// ============================
// UTILITY FUNCTIONS
// ============================

function generateRandomDuration() {
    const minutes = Math.floor(Math.random() * 15) + 1;
    const seconds = Math.floor(Math.random() * 60);
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function setupVideoHoverPreview() {
    const videos = document.querySelectorAll('.content-item[data-type="video"]');
    
    videos.forEach(item => {
        const video = item.querySelector('video');
        if (!video) return;
        
        let hoverTimeout;
        
        item.addEventListener('mouseenter', () => {
            if (state.isVIP || state.unlockedContent.has(item.dataset.id)) {
                hoverTimeout = setTimeout(() => {
                    // Cargar el video si no está cargado
                    const source = video.querySelector('source[data-src]');
                    if (source && source.dataset.src) {
                        source.src = source.dataset.src;
                        delete source.dataset.src;
                        video.load();
                    }
                    
                    video.play().catch(() => {
                        console.log('Video autoplay prevented');
                    });
                }, 500);
            }
        });
        
        item.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimeout);
            if (!video.paused) {
                video.pause();
                video.currentTime = 0;
            }
        });
    });
}

// ============================
// EVENT HANDLERS
// ============================

function handlePhotoClick(id, filename, index) {
    if (state.isVIP || state.unlockedContent.has(id)) {
        // Abrir imagen completa
        const fullUrl = `${CONFIG.CONTENT.CDN_BASE}${CONFIG.CONTENT.PHOTO_PATH}${filename}`;
        window.open(fullUrl, '_blank');
    } else if (state.packCredits > 0) {
        usePackCredit(id, 'photo');
    } else {
        showPayPerViewModal(id, 'photo', `Paradise Photo #${index + 1}`, CONFIG.PAYPAL.PRICES.SINGLE_PHOTO);
    }
}

function handleVideoClick(id, filename, index) {
    if (state.isVIP || state.unlockedContent.has(id)) {
        // Abrir video completo
        const fullUrl = `${CONFIG.CONTENT.CDN_BASE}${CONFIG.CONTENT.VIDEO_PATH}${filename}`;
        window.open(fullUrl, '_blank');
    } else if (state.packCredits > 0) {
        usePackCredit(id, 'video');
    } else {
        showPayPerViewModal(id, 'video', `Paradise Video #${index + 1}`, CONFIG.PAYPAL.PRICES.SINGLE_VIDEO);
    }
}

// ============================
// BANNER SLIDESHOW
// ============================

function startBannerSlideshow() {
    const slides = document.querySelectorAll('.banner-slide');
    
    if (slides.length === 0) return;
    
    // Actualizar slides con los banners de hoy
    slides.forEach((slide, index) => {
        const img = slide.querySelector('img');
        if (img && state.dailyContent && state.dailyContent.banners[index]) {
            const bannerUrl = `${CONFIG.CONTENT.CDN_BASE}${CONFIG.CONTENT.FULL_PATH}${state.dailyContent.banners[index]}`;
            img.src = bannerUrl;
        }
    });
    
    // Iniciar slideshow automático
    setInterval(() => {
        if (slides[state.currentSlide]) {
            slides[state.currentSlide].classList.remove('active');
        }
        state.currentSlide = (state.currentSlide + 1) % slides.length;
        if (slides[state.currentSlide]) {
            slides[state.currentSlide].classList.add('active');
        }
    }, 5000);
}

// ============================
// PAYPAL INTEGRATION
// ============================

function renderPayPalVIPButtons() {
    const container = document.getElementById('paypal-button-container-vip');
    if (!container || !window.paypal) return;
    
    container.innerHTML = '';
    
    const isMonthly = state.selectedSubscriptionType === 'monthly';
    const price = isMonthly ? CONFIG.PAYPAL.PRICES.MONTHLY_SUBSCRIPTION : CONFIG.PAYPAL.PRICES.LIFETIME_SUBSCRIPTION;
    const description = isMonthly ? 'IbizaGirl VIP Monthly Access' : 'IbizaGirl VIP Lifetime Access';
    
    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: String(price.toFixed(2)),
                        currency_code: CONFIG.PAYPAL.CURRENCY
                    },
                    description: description
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                console.log('VIP Transaction completed');
                activateVIP(state.selectedSubscriptionType);
                const trans = TRANSLATIONS[state.currentLanguage];
                showNotification(trans.notification_welcome);
                closeModal();
            });
        },
        onError: function(err) {
            console.error('PayPal VIP Error:', err);
            const trans = TRANSLATIONS[state.currentLanguage];
            showNotification(trans.payment_error);
        }
    }).render('#paypal-button-container-vip');
}

function renderPayPalPackButton(packType) {
    const container = document.getElementById('paypal-button-container-pack');
    if (!container || !window.paypal || !packType) return;
    
    container.innerHTML = '';
    
    const pack = CONFIG.PAYPAL.PACKS[packType];
    if (!pack) return;
    
    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: String(pack.price.toFixed(2)),
                        currency_code: CONFIG.PAYPAL.CURRENCY
                    },
                    description: `IbizaGirl ${packType} Pack - ${pack.items} items`
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                console.log('Pack Transaction completed');
                addPackCredits(pack.items);
                const trans = TRANSLATIONS[state.currentLanguage];
                const message = trans.notification_pack.replace('{credits}', pack.items);
                showNotification(message);
                closeModal();
            });
        },
        onError: function(err) {
            console.error('PayPal Pack Error:', err);
            const trans = TRANSLATIONS[state.currentLanguage];
            showNotification(trans.payment_error);
        }
    }).render('#paypal-button-container-pack');
}

function renderPayPalSingleButton(contentId, contentType, contentTitle, price) {
    const container = document.getElementById('paypal-button-container-ppv');
    if (!container || !window.paypal) return;
    
    container.innerHTML = '';
    
    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: String(price.toFixed(2)),
                        currency_code: CONFIG.PAYPAL.CURRENCY
                    },
                    description: `IbizaGirl - ${contentTitle}`
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                console.log('PPV Transaction completed');
                unlockSingleContent(contentId);
                const trans = TRANSLATIONS[state.currentLanguage];
                const icon = contentType === 'video' ? '🎬' : '📸';
                const message = trans.notification_unlocked
                    .replace('{icon}', icon)
                    .replace('{credits}', state.packCredits);
                showNotification(message);
                closeModal();
            });
        },
        onError: function(err) {
            console.error('PayPal PPV Error:', err);
            const trans = TRANSLATIONS[state.currentLanguage];
            showNotification(trans.payment_error);
        }
    }).render('#paypal-button-container-ppv');
}

// ============================
// ISABELLA BOT
// ============================

const isabellaBot = {
    messages: [],
    messageIndex: 0,
    
    init() {
        this.messages = TRANSLATIONS[state.currentLanguage].isabella_messages;
        
        // Mostrar saludo inicial después de 5 segundos
        setTimeout(() => {
            this.showNotification();
            this.addMessage(this.messages[0]);
        }, 5000);
        
        // Tips aleatorios cada 2 minutos
        setInterval(() => {
            const window = document.getElementById('isabellaWindow');
            if (window && !window.classList.contains('active')) {
                this.showRandomTip();
            }
        }, 120000);
    },
    
    addMessage(text) {
        const messagesDiv = document.getElementById('isabellaMessages');
        if (!messagesDiv) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'isabella-message';
        messageDiv.innerHTML = text;
        messagesDiv.appendChild(messageDiv);
        
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    },
    
    showNotification() {
        const notification = document.querySelector('.isabella-notification');
        if (notification) {
            notification.style.display = 'flex';
            notification.textContent = '1';
            
            setTimeout(() => {
                notification.style.display = 'none';
            }, 10000);
        }
    },
    
    showRandomTip() {
        const randomMessage = this.messages[Math.floor(Math.random() * this.messages.length)];
        this.showNotification();
    }
};

// ============================
// UNLOCK FUNCTIONS
// ============================

function activateVIP(type) {
    state.isVIP = true;
    
    localStorage.setItem('ibiza_vip', JSON.stringify({
        active: true,
        type: type,
        activatedAt: Date.now()
    }));
    
    unlockAllContent();
    
    console.log('👑 VIP activated:', type);
}

function unlockAllContent() {
    document.querySelectorAll('.content-item').forEach(item => {
        item.classList.add('unlocked');
        const media = item.querySelector('.item-media');
        if (media) {
            media.style.filter = 'none';
        }
    });
    
    console.log('🔓 All content unlocked');
}

function unlockSingleContent(contentId) {
    state.unlockedContent.add(contentId);
    
    const item = document.querySelector(`[data-id="${contentId}"]`);
    if (item) {
        item.classList.add('unlocked');
        const media = item.querySelector('.item-media');
        if (media) {
            media.style.filter = 'none';
        }
    }
    
    saveUnlockedContent();
    
    console.log('🔓 Content unlocked:', contentId);
}

function addPackCredits(credits) {
    state.packCredits += credits;
    localStorage.setItem('ibiza_pack_credits', state.packCredits);
    updateCreditsDisplay();
    
    console.log(`💰 Pack credits added: ${credits}. Total: ${state.packCredits}`);
}

function usePackCredit(contentId, contentType) {
    if (state.packCredits > 0) {
        state.packCredits--;
        unlockSingleContent(contentId);
        
        localStorage.setItem('ibiza_pack_credits', state.packCredits);
        updateCreditsDisplay();
        
        const trans = TRANSLATIONS[state.currentLanguage];
        const icon = contentType === 'video' ? '🎬' : '📸';
        const message = trans.notification_unlocked
            .replace('{icon}', icon)
            .replace('{credits}', state.packCredits);
        
        showNotification(message);
    }
}

function updateCreditsDisplay() {
    const creditsDisplay = document.getElementById('creditsDisplay');
    const creditsNumber = document.getElementById('creditsNumber');
    
    if (state.packCredits > 0) {
        if (creditsNumber) creditsNumber.textContent = state.packCredits;
        if (creditsDisplay) creditsDisplay.classList.add('active');
    } else {
        if (creditsDisplay) creditsDisplay.classList.remove('active');
    }
}

// ============================
// UTILITY FUNCTIONS
// ============================

function showNotification(message) {
    document.querySelectorAll('.notification-toast').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 500);
    }, 5000);
}

function loadSavedState() {
    try {
        // Cargar estado VIP
        const vipData = localStorage.getItem('ibiza_vip');
        if (vipData) {
            const data = JSON.parse(vipData);
            if (data.active) {
                state.isVIP = true;
                setTimeout(() => unlockAllContent(), 500);
            }
        }
        
        // Cargar créditos
        const savedCredits = localStorage.getItem('ibiza_pack_credits');
        if (savedCredits) {
            state.packCredits = parseInt(savedCredits) || 0;
            updateCreditsDisplay();
        }
        
        // Cargar contenido desbloqueado
        const unlockedData = localStorage.getItem('ibiza_unlocked');
        if (unlockedData) {
            const parsed = JSON.parse(unlockedData);
            if (Array.isArray(parsed)) {
                state.unlockedContent = new Set(parsed);
                setTimeout(() => {
                    state.unlockedContent.forEach(id => unlockSingleContent(id));
                }, 500);
            }
        }
        
        // Cargar idioma
        const savedLang = localStorage.getItem('ibiza_language') || 'es';
        if (savedLang !== state.currentLanguage) {
            changeLanguage(savedLang);
        }
        
    } catch (e) {
        console.error('Error loading saved state:', e);
    }
}

function saveUnlockedContent() {
    try {
        localStorage.setItem('ibiza_unlocked', JSON.stringify([...state.unlockedContent]));
    } catch (e) {
        console.error('Error saving unlocked content:', e);
    }
}

function changeLanguage(lang) {
    if (!TRANSLATIONS[lang]) return;
    
    state.currentLanguage = lang;
    localStorage.setItem('ibiza_language', lang);
    
    // Actualizar todos los elementos traducibles
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (TRANSLATIONS[lang][key]) {
            element.textContent = TRANSLATIONS[lang][key];
        }
    });
    
    // Actualizar Isabella
    if (window.isabellaBot) {
        isabellaBot.messages = TRANSLATIONS[lang].isabella_messages;
    }
    
    document.documentElement.lang = lang;
    
    // Re-renderizar contenido dinámico
    if (state.dailyContent) {
        renderPhotosProgressive();
        renderVideosProgressive();
        renderTeaserCarousel();
    }
    
    console.log(`🌐 Language changed to: ${lang}`);
}

// ============================
// MODAL FUNCTIONS
// ============================

function showVIPModal() {
    const modal = document.getElementById('vipModal');
    if (modal) {
        modal.classList.add('active');
        renderPayPalVIPButtons();
    }
}

function showPackModal() {
    const modal = document.getElementById('packModal');
    if (modal) {
        modal.classList.add('active');
        renderPayPalPackButton(state.selectedPack);
    }
}

function showPayPerViewModal(contentId, contentType, contentTitle, price) {
    const trans = TRANSLATIONS[state.currentLanguage];
    const ppvTitle = document.getElementById('ppvTitle');
    const ppvPrice = document.getElementById('ppvPrice');
    const ppvModal = document.getElementById('ppvModal');
    
    if (ppvTitle) ppvTitle.textContent = `${trans.unlock_content} - ${contentTitle}`;
    if (ppvPrice) ppvPrice.textContent = `€${price.toFixed(2)}`;
    if (ppvModal) ppvModal.classList.add('active');
    
    state.currentPayPalContentId = contentId;
    state.currentPayPalContentType = contentType;
    
    renderPayPalSingleButton(contentId, contentType, contentTitle, price);
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

function selectPlan(type) {
    state.selectedSubscriptionType = type;
    
    document.querySelectorAll('.plan-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('selected');
    }
    
    renderPayPalVIPButtons();
}

function selectPack(packType) {
    state.selectedPack = packType;
    
    document.querySelectorAll('.pack-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('selected');
    }
    
    renderPayPalPackButton(packType);
}

function toggleIsabella() {
    const window = document.getElementById('isabellaWindow');
    if (window) {
        window.classList.toggle('active');
        
        if (window.classList.contains('active')) {
            const notification = document.querySelector('.isabella-notification');
            if (notification) {
                notification.style.display = 'none';
            }
        }
    }
}

function isabellaAction(action) {
    const messages = TRANSLATIONS[state.currentLanguage].isabella_messages;
    
    switch(action) {
        case 'vip':
            isabellaBot.addMessage(messages[2]);
            setTimeout(() => showVIPModal(), 1000);
            break;
        case 'daily':
            isabellaBot.addMessage(messages[3]);
            break;
        case 'help':
            isabellaBot.addMessage(messages[4]);
            break;
        default:
            isabellaBot.addMessage(messages[0]);
    }
}

function scrollCarousel(direction) {
    const carousel = document.getElementById('teaserCarousel');
    if (!carousel) return;
    
    const scrollAmount = 270;
    const currentScroll = carousel.scrollLeft;
    const newScroll = currentScroll + (direction * scrollAmount);
    
    carousel.scrollTo({
        left: newScroll,
        behavior: 'smooth'
    });
}

// ============================
// GLOBAL FUNCTIONS
// ============================

window.handlePhotoClick = handlePhotoClick;
window.handleVideoClick = handleVideoClick;
window.toggleIsabella = toggleIsabella;
window.isabellaAction = isabellaAction;
window.showVIPModal = showVIPModal;
window.showPackModal = showPackModal;
window.closeModal = closeModal;
window.selectPlan = selectPlan;
window.selectPack = selectPack;
window.changeLanguage = changeLanguage;
window.scrollCarousel = scrollCarousel;
window.isabellaBot = isabellaBot;

// ============================
// INITIALIZATION
// ============================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Initializing Paradise Gallery v15.0.0...');
    
    // Verificar que content-data.js está cargado
    if (ALL_PHOTOS_POOL.length === 0) {
        console.error('❌ Content data not loaded! Make sure content-data.js is included before main-script.js');
        return;
    }
    
    // Cargar estado guardado
    loadSavedState();
    
    // Establecer idioma
    const langSelect = document.getElementById('languageSelect');
    if (langSelect) {
        langSelect.value = state.currentLanguage;
    }
    
    // Obtener rotación diaria
    state.dailyContent = getDailyRotation();
    
    // Inicializar Isabella bot
    isabellaBot.init();
    
    // Renderizar todo el contenido
    renderPhotosProgressive();
    renderVideosProgressive();
    renderTeaserCarousel();
    
    // Iniciar animaciones
    startBannerSlideshow();
    
    // Actualizar contadores
    const photoCount = document.getElementById('photoCount');
    const videoCount = document.getElementById('videoCount');
    
    if (photoCount) photoCount.textContent = state.dailyContent.stats.dailyPhotos;
    if (videoCount) videoCount.textContent = state.dailyContent.stats.dailyVideos;
    
    // Ocultar pantalla de carga
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 1500);
    
    // Aplicar idioma inicial
    changeLanguage(state.currentLanguage);
    
    console.log('✅ Paradise Gallery loaded successfully!');
    console.log(`🌊 Version: 15.0.0 - ${CONFIG.CONTENT.DAILY_PHOTOS} fotos + ${CONFIG.CONTENT.DAILY_VIDEOS} videos diarios`);
});

// ============================
// ERROR HANDLING
// ============================

window.addEventListener('error', (e) => {
    console.error('❌ Runtime Error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('❌ Unhandled Promise Rejection:', e.reason);
});

console.log(`
🌊 ===============================================
   IbizaGirl.pics Paradise Gallery v15.0.0
   ===============================================
   
   🎯 Features:
   • ${ALL_PHOTOS_POOL.length} fotos totales
   • ${ALL_VIDEOS_POOL.length} videos totales  
   • Sin carpetas public/assets
   • Arrays directos desde content-data.js
   • PayPal integration
   • Isabella chat bot
   
🌊 ===============================================
`);
