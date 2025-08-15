// ============================
// IBIZAGIRL.PICS MAIN SCRIPT v14.1.0 FIXED
// Corrección de errores de carga de contenido
// ============================

console.log('🌊 IbizaGirl.pics v14.1.0 FIXED - Loading Paradise Gallery...');

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
// MULTI-LANGUAGE TRANSLATIONS (COMPLETO)
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
        footer_desc: "Tu destino diario para contenido exclusivo del paraíso mediterráneo. Actualizado 24/7 con las mejores fotos y videos.",
        quick_links: "Enlaces Rápidos",
        photos: "Fotos",
        videos: "Videos",
        vip_subscription: "Suscripción VIP",
        mega_packs: "Mega Packs",
        support: "Soporte",
        terms: "Términos de Servicio",
        privacy: "Política de Privacidad",
        contact: "Contacto",
        copyright: "© 2025 IbizaGirl.pics - Todos los derechos reservados | 18+ Solo Adultos",
        vip_unlimited: "👑 Acceso VIP Ilimitado",
        pack_selection: "📦 MEGA PACKS - Ahorra 70%",
        unlock_content: "🔓 Desbloquear Contenido",
        plan_monthly: "📅 Mensual",
        plan_lifetime: "♾️ Lifetime",
        best_value: "MEJOR VALOR",
        save_yearly: "¡Ahorra €80 al año!",
        pack_starter: "Starter Pack",
        pack_bronze: "Bronze Pack",
        pack_silver: "Silver Pack",
        pack_gold: "Gold Pack",
        items: "contenidos",
        save: "Ahorra",
        unlimited_access: "Acceso ilimitado",
        hd_videos: "200+ fotos HD",
        daily_updates: "40+ videos HD",
        no_ads: "Sin publicidad",
        all_content: "Todo el contenido actual y futuro",
        priority_support: "Soporte prioritario",
        exclusive_content: "Contenido exclusivo VIP",
        notification_welcome: "🎉 ¡Bienvenido VIP! Todo el contenido ha sido desbloqueado.",
        notification_pack: "🎉 {credits} créditos añadidos! Haz clic en cualquier contenido para desbloquearlo.",
        notification_unlocked: "{icon} Desbloqueado! {credits} créditos restantes.",
        payment_error: "❌ Error en el pago. Por favor, intenta de nuevo.",
        preview_gallery: "🔥 Vista Previa Exclusiva - Mejores Fotos Ibiza",
        photos_seo_title: "📸 Fotos del Paraíso de Ibiza",
        gallery_description: "Explora nuestra colección de fotos premium de Ibiza actualizadas cada día. Contenido exclusivo del mediterráneo español con calidad profesional.",
        meta_description: "Galería premium de Ibiza con 400+ fotos y 80+ videos HD actualizados diariamente. Contenido exclusivo del paraíso mediterráneo español.",
        seo_keywords: {
            primary: "ibiza fotos, playas ibiza, españa turismo, mediterráneo, galería ibiza",
            secondary: "fotos diarias, contenido premium ibiza, vacaciones españa, islas baleares"
        },
        isabella_messages: [
            "¡Hola preciosa! 😘 ¿Buscas el paraíso?",
            "Pssst... ¡Los miembros VIP ven todo sin desenfoque! 👀",
            "¿Lista para desbloquear el paraíso? ¡VIP te da acceso instantáneo a todo! 🌊",
            "¡Hoy tenemos 200 fotos nuevas y 40 videos nuevos! 🎉",
            "Solo haz clic en cualquier contenido borroso para desbloquearlo! 💕",
            "¿Sabías que con Lifetime nunca más pagas? ¡Es la mejor oferta! 💎",
            "Los packs te permiten desbloquear contenido individual, ¡perfectos para probar! 📦",
            "¡No te pierdas las actualizaciones diarias a las 3:00 AM! ⏰",
            "El contenido de hoy está 🔥🔥🔥 ¡No te lo pierdas!",
            "¿Necesitas ayuda? ¡Estoy aquí para ti, cariño! 💕"
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
        footer_desc: "Your daily destination for exclusive Mediterranean paradise content. Updated 24/7 with the best photos and videos.",
        quick_links: "Quick Links",
        photos: "Photos",
        videos: "Videos",
        vip_subscription: "VIP Subscription",
        mega_packs: "Mega Packs",
        support: "Support",
        terms: "Terms of Service",
        privacy: "Privacy Policy",
        contact: "Contact",
        copyright: "© 2025 IbizaGirl.pics - All rights reserved | 18+ Adults Only",
        vip_unlimited: "👑 Unlimited VIP Access",
        pack_selection: "📦 MEGA PACKS - Save 70%",
        unlock_content: "🔓 Unlock Content",
        plan_monthly: "📅 Monthly",
        plan_lifetime: "♾️ Lifetime",
        best_value: "BEST VALUE",
        save_yearly: "Save €80 per year!",
        pack_starter: "Starter Pack",
        pack_bronze: "Bronze Pack",
        pack_silver: "Silver Pack",
        pack_gold: "Gold Pack",
        items: "items",
        save: "Save",
        unlimited_access: "Unlimited access",
        hd_videos: "200+ HD photos",
        daily_updates: "40+ HD videos",
        no_ads: "No ads",
        all_content: "All current and future content",
        priority_support: "Priority support",
        exclusive_content: "Exclusive VIP content",
        notification_welcome: "🎉 Welcome VIP! All content has been unlocked.",
        notification_pack: "🎉 {credits} credits added! Click any content to unlock.",
        notification_unlocked: "{icon} Unlocked! {credits} credits remaining.",
        payment_error: "❌ Payment error. Please try again.",
        preview_gallery: "🔥 Exclusive Preview - Best Ibiza Photos",
        photos_seo_title: "📸 Paradise Photos of Ibiza",
        gallery_description: "Explore our collection of premium Ibiza photos updated daily. Exclusive Mediterranean Spanish content with professional quality.",
        meta_description: "Premium Ibiza gallery with 400+ photos and 80+ HD videos updated daily. Exclusive Mediterranean Spanish paradise content.",
        seo_keywords: {
            primary: "ibiza photos, ibiza beaches, spain tourism, mediterranean, ibiza gallery",
            secondary: "daily photos, premium ibiza content, spain vacation, balearic islands"
        },
        isabella_messages: [
            "Hello beautiful! 😘 Looking for paradise?",
            "Pssst... VIP members see everything without blur! 👀",
            "Ready to unlock paradise? VIP gives you instant access to everything! 🌊",
            "Today we have 200 new photos and 40 new videos! 🎉",
            "Just click on any blurred content to unlock it! 💕",
            "Did you know that with Lifetime you never pay again? It's the best deal! 💎",
            "Packs let you unlock individual content, perfect for trying out! 📦",
            "Don't miss the daily updates at 3:00 AM! ⏰",
            "Today's content is 🔥🔥🔥 Don't miss it!",
            "Need help? I'm here for you, darling! 💕"
        ]
    }
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
        BLUR_VIDEO: 10
    },
    
    // Analytics
    ANALYTICS_ID: 'G-DBXYNPBSPY',
    
    // Ad Networks - Only enabled in production
    ADS: {
        ENABLED: ENVIRONMENT.isProduction,
        JUICYADS: {
            enabled: ENVIRONMENT.isProduction,
            zones: { header: 903748, sidebar: 903749, footer: 903750 }
        },
        EXOCLICK: {
            enabled: ENVIRONMENT.isProduction,
            zones: { header: 5696328, sidebar: 5696329, footer: 5696330 }
        },
        EROADVERTISING: {
            enabled: ENVIRONMENT.isProduction,
            zones: { header: 123456, sidebar: 123457, footer: 123458 }
        }
    }
};

// ============================
// COMPLETE CONTENT POOLS - USANDO ARRAYS DE CONTENT-DATA.JS
// ============================

// Arrays temporales hasta que content-data.js esté corregido
const ALL_PHOTOS_POOL = [];
const ALL_VIDEOS_POOL = [];
const BANNER_IMAGES = ['bikbanner.jpg', 'bikbanner2.jpg', 'backbikini.jpg', 'bikini.jpg', 'bikini3.jpg', 'bikini5.jpg'];
const TEASER_IMAGES = ['bikini.jpg', 'bikini3.jpg', 'bikini5.jpg', 'backbikini.jpg', 'bikbanner.jpg', 'bikbanner2.jpg'];

// Intentar cargar desde window si están disponibles
if (typeof window.ALL_PHOTOS_POOL !== 'undefined' && Array.isArray(window.ALL_PHOTOS_POOL)) {
    ALL_PHOTOS_POOL.push(...window.ALL_PHOTOS_POOL);
    console.log(`📸 Loaded ${ALL_PHOTOS_POOL.length} photos from pool`);
} else {
    // Fallback: generar lista de ejemplo
    for (let i = 0; i < 200; i++) {
        ALL_PHOTOS_POOL.push(`photo_${i}.jpg`);
    }
    console.warn('⚠️ Using fallback photo pool');
}

if (typeof window.ALL_VIDEOS_POOL !== 'undefined' && Array.isArray(window.ALL_VIDEOS_POOL)) {
    ALL_VIDEOS_POOL.push(...window.ALL_VIDEOS_POOL);
    console.log(`🎬 Loaded ${ALL_VIDEOS_POOL.length} videos from pool`);
} else {
    // Fallback: generar lista de ejemplo
    for (let i = 0; i < 40; i++) {
        ALL_VIDEOS_POOL.push(`video_${i}.mp4`);
    }
    console.warn('⚠️ Using fallback video pool');
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

// Make TRANSLATIONS available globally
window.TRANSLATIONS = TRANSLATIONS;
window.state = state;

// ============================
// LANGUAGE SYSTEM
// ============================

function changeLanguage(lang) {
    if (!TRANSLATIONS[lang]) return;
    
    state.currentLanguage = lang;
    localStorage.setItem('ibiza_language', lang);
    
    // Update all translatable elements
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (TRANSLATIONS[lang][key]) {
            element.textContent = TRANSLATIONS[lang][key];
        }
    });
    
    // Update Isabella messages
    if (window.isabellaBot) {
        isabellaBot.messages = TRANSLATIONS[lang].isabella_messages;
    }
    
    // Update document language attribute
    document.documentElement.lang = lang;
    
    // Re-render dynamic content with new language
    if (state.dailyContent) {
        renderPhotosProgressive();
        renderVideosProgressive();
        renderTeaserCarousel();
    }
    
    trackEvent('language_changed', { language: lang });
    console.log(`🌍 Language changed to: ${lang}`);
}

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
// RENDER FUNCTIONS
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
        
        // Determinar la ruta correcta de la imagen
        let imagePath = photo;
        if (!photo.startsWith('http') && !photo.startsWith('/')) {
            // Si es de uncensored
            if (photo.includes('.webp') || photo.includes('.jpg')) {
                imagePath = photo.includes('uncensored/') ? photo : `uncensored/${photo}`;
            }
        }
        
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
                     src="public/assets/${imagePath}" 
                     alt="Paradise Photo ${index + 1}"
                     style="filter: ${isUnlocked ? 'none' : `blur(${CONFIG.CONTENT.BLUR_PHOTO}px)`};"
                     loading="lazy"
                     onerror="this.src='public/assets/full/bikini.jpg'">
                
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
}

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
        
        // Determinar la ruta correcta del video
        let videoPath = video;
        if (!video.startsWith('http') && !video.startsWith('/')) {
            if (video.includes('.mp4')) {
                videoPath = video.includes('uncensored-videos/') ? video : `uncensored-videos/${video}`;
            }
        }
        
        // Use banner image as poster
        const posterImage = BANNER_IMAGES[index % BANNER_IMAGES.length];
        
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
                       preload="metadata"
                       poster="public/assets/full/${posterImage}"
                       style="filter: ${isUnlocked ? 'none' : `blur(${CONFIG.CONTENT.BLUR_VIDEO}px)`};">
                    <source src="public/assets/${videoPath}" type="video/mp4">
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
    setupVideoHoverPreview();
    console.log('✅ Videos rendered successfully');
}

function renderTeaserCarousel() {
    const teaserCarousel = document.getElementById('teaserCarousel');
    if (!teaserCarousel) return;
    
    const teasersToShow = state.dailyContent.teasers.slice(0, 12);
    let teaserHTML = '';
    
    teasersToShow.forEach((teaser, index) => {
        const views = Math.floor(Math.random() * 25000) + 10000;
        const likes = Math.floor(Math.random() * 5000) + 1000;
        
        teaserHTML += `
            <div class="teaser-item" data-index="${index}">
                <img class="item-media" 
                     src="public/assets/full/${teaser}" 
                     alt="Preview ${index + 1}"
                     loading="lazy"
                     onerror="this.src='public/assets/full/bikini.jpg'">
                
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
}

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
    trackEvent('photo_click', { 
        photo_id: id, 
        photo_index: index,
        is_unlocked: state.isVIP || state.unlockedContent.has(id)
    });
    
    if (state.isVIP || state.unlockedContent.has(id)) {
        // Abrir imagen completa
        const imagePath = filename.includes('uncensored/') ? filename : `uncensored/${filename}`;
        window.open(`public/assets/${imagePath}`, '_blank');
        trackEvent('photo_view', { photo_id: id, photo_index: index });
    } else if (state.packCredits > 0) {
        usePackCredit(id, 'photo');
    } else {
        showPayPerViewModal(id, 'photo', `Paradise Photo #${index + 1}`, CONFIG.PAYPAL.PRICES.SINGLE_PHOTO);
    }
}

function handleVideoClick(id, filename, index) {
    trackEvent('video_click', { 
        video_id: id, 
        video_index: index,
        is_unlocked: state.isVIP || state.unlockedContent.has(id)
    });
    
    if (state.isVIP || state.unlockedContent.has(id)) {
        // Abrir video completo
        const videoPath = filename.includes('uncensored-videos/') ? filename : `uncensored-videos/${filename}`;
        window.open(`public/assets/${videoPath}`, '_blank');
        trackEvent('video_view', { video_id: id, video_index: index });
    } else if (state.packCredits > 0) {
        usePackCredit(id, 'video');
    } else {
        showPayPerViewModal(id, 'video', `Paradise Video #${index + 1}`, CONFIG.PAYPAL.PRICES.SINGLE_VIDEO);
    }
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
            trackEvent('isabella_opened');
        } else {
            trackEvent('isabella_closed');
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
    
    trackEvent('isabella_action', { action: action });
}

// ============================
// MODAL FUNCTIONS
// ============================

function showVIPModal() {
    const modal = document.getElementById('vipModal');
    if (modal) {
        modal.classList.add('active');
        renderPayPalVIPButtons();
        trackEvent('modal_open', { modal_type: 'vip_subscription' });
    }
}

function showPackModal() {
    const modal = document.getElementById('packModal');
    if (modal) {
        modal.classList.add('active');
        renderPayPalPackButton(state.selectedPack);
        trackEvent('modal_open', { modal_type: 'pack_selection' });
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
    trackEvent('modal_open', { 
        modal_type: 'pay_per_view', 
        content_type: contentType,
        content_id: contentId,
        price: price
    });
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    trackEvent('modal_close');
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
    trackEvent('plan_selected', { plan_type: type });
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
    trackEvent('pack_selected', { pack_type: packType });
}

// ============================
// PAYPAL FUNCTIONS
// ============================

function renderPayPalVIPButtons() {
    const container = document.getElementById('paypal-button-container-vip');
    if (!container || !window.paypal) return;
    
    container.innerHTML = '';
    
    const isMonthly = state.selectedSubscriptionType === 'monthly';
    const price = isMonthly ? 15.00 : 100.00;
    const description = isMonthly ? 'IbizaGirl VIP Monthly Access' : 'IbizaGirl VIP Lifetime Access';
    
    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: String(price.toFixed(2)),
                        currency_code: 'EUR'
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
                celebrateUnlock();
                closeModal();
            });
        },
        onError: function(err) {
            console.error('PayPal VIP Error:', err);
            const trans = TRANSLATIONS[state.currentLanguage];
            showNotification(trans.payment_error);
        },
        onCancel: function(data) {
            console.log('Payment cancelled');
        }
    }).render('#paypal-button-container-vip');
}

function renderPayPalPackButton(packType) {
    const container = document.getElementById('paypal-button-container-pack');
    if (!container || !window.paypal || !packType) return;
    
    container.innerHTML = '';
    
    const pack = CONFIG.PAYPAL.PACKS[packType];
    if (!pack) {
        console.log('Pack not found:', packType);
        return;
    }
    
    const packDescription = 'IbizaGirl ' + packType + ' Pack - ' + pack.items + ' items';
    const packPrice = Number(pack.price).toFixed(2);
    
    paypal.Buttons({
        createOrder: function(data, actions) {
            trackEvent('paypal_checkout_started', { 
                type: 'pack', 
                pack: packType,
                price: pack.price 
            });
            
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: packPrice,
                        currency_code: CONFIG.PAYPAL.CURRENCY
                    },
                    description: packDescription
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                console.log('Pack Transaction completed');
                addPackCredits(pack.items);
                trackEvent('purchase_complete', {
                    type: 'pack',
                    pack: packType,
                    price: pack.price,
                    items: pack.items,
                    order_id: data.orderID
                });
                const trans = TRANSLATIONS[state.currentLanguage];
                const message = trans.notification_pack.replace('{credits}', pack.items);
                showNotification(message);
                celebrateUnlock();
                closeModal();
            });
        },
        onError: function(err) {
            console.error('PayPal Pack Error:', err);
            const trans = TRANSLATIONS[state.currentLanguage];
            showNotification(trans.payment_error);
            trackEvent('payment_error', { type: 'pack', error: String(err) });
        },
        onCancel: function(data) {
            trackEvent('payment_cancelled', { type: 'pack' });
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
                        currency_code: 'EUR'
                    },
                    description: `Unlock ${contentTitle}`
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                console.log('Single content purchase completed');
                unlockSingleContent(contentId);
                const trans = TRANSLATIONS[state.currentLanguage];
                const icon = contentType === 'video' ? '🎬' : '📸';
                showNotification(`${icon} ${contentTitle} unlocked!`);
                celebrateUnlock();
                closeModal();
            });
        },
        onError: function(err) {
            console.error('PayPal Single Error:', err);
            const trans = TRANSLATIONS[state.currentLanguage];
            showNotification(trans.payment_error);
        }
    }).render('#paypal-button-container-ppv');
}

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
    
    const trans = TRANSLATIONS[state.currentLanguage];
    if (window.isabellaBot) {
        isabellaBot.addMessage(trans.notification_welcome);
    }
    
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
        celebrateUnlock();
        
        trackEvent('pack_credit_used', { 
            content_id: contentId, 
            content_type: contentType, 
            credits_remaining: state.packCredits 
        });
    }
}

function updateCreditsDisplay() {
    const creditsDisplay = document.getElementById('creditsDisplay');
    const creditsNumber = document.getElementById('creditsNumber');
    
    if (state.packCredits > 0) {
        if (creditsNumber) creditsNumber.textContent = state.packCredits;
        if (creditsDisplay) {
            creditsDisplay.classList.add('active');
            state.creditsDisplayVisible = true;
        }
    } else {
        if (creditsDisplay) {
            creditsDisplay.classList.remove('active');
            state.creditsDisplayVisible = false;
        }
    }
}

// ============================
// ISABELLA CHAT BOT
// ============================

const isabellaBot = {
    messages: [],
    messageIndex: 0,
    
    init() {
        this.messages = TRANSLATIONS[state.currentLanguage].isabella_messages;
        
        setTimeout(() => {
            this.showNotification();
            this.addMessage(this.messages[0]);
            
            setTimeout(() => {
                const randomTip = this.messages[Math.floor(Math.random() * (this.messages.length - 1)) + 1];
                this.addMessage(randomTip);
            }, 3000);
        }, 5000);
        
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

window.isabellaBot = isabellaBot;

// ============================
// UTILITY FUNCTIONS
// ============================

function trackEvent(eventName, parameters = {}) {
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
}

function loadSavedState() {
    try {
        const vipData = localStorage.getItem('ibiza_vip');
        if (vipData) {
            const data = JSON.parse(vipData);
            if (data.active) {
                state.isVIP = true;
                setTimeout(() => unlockAllContent(), 500);
                console.log('👑 VIP status restored');
            }
        }
        
        const savedCredits = localStorage.getItem('ibiza_pack_credits');
        if (savedCredits) {
            state.packCredits = parseInt(savedCredits) || 0;
            updateCreditsDisplay();
            console.log('💰 Pack credits restored:', state.packCredits);
        }
        
        const unlockedData = localStorage.getItem('ibiza_unlocked');
        if (unlockedData) {
            const parsed = JSON.parse(unlockedData);
            if (Array.isArray(parsed)) {
                state.unlockedContent = new Set(parsed);
                setTimeout(() => {
                    state.unlockedContent.forEach(id => unlockSingleContent(id));
                }, 500);
                console.log('🔓 Unlocked content restored:', state.unlockedContent.size, 'items');
            }
        }
        
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

function celebrateUnlock() {
    if (typeof confetti !== 'undefined') {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00d4ff', '#ff69b4', '#ffd700', '#00ff88', '#7fdbff'],
            shapes: ['circle', 'square'],
            scalar: 1.2
        });
        
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 50,
                origin: { y: 0.8 },
                colors: ['#ff69b4', '#ffd700'],
                shapes: ['circle']
            });
        }, 300);
    }
}

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
    
    trackEvent('carousel_scroll', { direction: direction });
}

function startBannerSlideshow() {
    const slides = document.querySelectorAll('.banner-slide');
    
    if (slides.length === 0) return;
    
    slides.forEach((slide, index) => {
        const img = slide.querySelector('img');
        if (img && state.dailyContent && state.dailyContent.banners[index]) {
            img.src = `public/assets/full/${state.dailyContent.banners[index]}`;
        }
    });
    
    setInterval(() => {
        if (slides[state.currentSlide]) {
            slides[state.currentSlide].classList.remove('active');
        }
        state.currentSlide = (state.currentSlide + 1) % slides.length;
        if (slides[state.currentSlide]) {
            slides[state.currentSlide].classList.add('active');
        }
    }, 5000);
    
    console.log('🎬 Banner slideshow started with', slides.length, 'slides');
}

function updateLastUpdateTime() {
    const updateHour = document.getElementById('updateHour');
    if (updateHour) {
        const now = new Date();
        const updateTime = new Date(now);
        updateTime.setHours(3, 0, 0, 0);
        
        if (now.getHours() < 3) {
            updateTime.setDate(updateTime.getDate() - 1);
        }
        
        const hours = updateTime.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        
        updateHour.textContent = `${displayHours}:00 ${ampm}`;
        updateHour.setAttribute('datetime', updateTime.toISOString());
    }
}

function initializeViewCounter() {
    setInterval(() => {
        const views = document.getElementById('totalViews');
        if (views) {
            const current = parseFloat(views.textContent.replace('M', ''));
            const increment = Math.random() * 0.002 + 0.001;
            const newViews = (current + increment).toFixed(1);
            views.textContent = `${newViews}M`;
        }
    }, 30000);
    
    if (state.dailyContent) {
        const photoCount = document.getElementById('photoCount');
        const videoCount = document.getElementById('videoCount');
        
        if (photoCount) photoCount.textContent = state.dailyContent.stats.dailyPhotos;
        if (videoCount) videoCount.textContent = state.dailyContent.stats.dailyVideos;
    }
}

function setupScrollEffects() {
    const header = document.getElementById('mainHeader');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    });
}

// ============================
// GLOBAL FUNCTIONS FOR ONCLICK
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

// ============================
// INITIALIZATION
// ============================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Initializing Paradise Gallery v14.1.0 FIXED...');
    
    // Load saved state first
    loadSavedState();
    
    // Set language selector
    const langSelect = document.getElementById('languageSelect');
    if (langSelect) {
        langSelect.value = state.currentLanguage;
    }
    
    // Get today's content rotation
    state.dailyContent = getDailyRotation();
    console.log(`📅 Daily rotation initialized: ${state.dailyContent.photos.length} photos, ${state.dailyContent.videos.length} videos`);
    
    // Initialize Isabella bot
    isabellaBot.init();
    console.log('🤖 Isabella bot initialized');
    
    // Render all content
    renderPhotosProgressive();
    renderVideosProgressive();
    renderTeaserCarousel();
    console.log('🎨 Content rendering completed');
    
    // Start animations and effects
    startBannerSlideshow();
    setupScrollEffects();
    
    // Initialize counters and timers
    initializeViewCounter();
    updateLastUpdateTime();
    
    // Hide loading screen
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
        environment: ENVIRONMENT.isDevelopment ? 'dev' : 'prod',
        daily_photos: state.dailyContent.photos.length,
        daily_videos: state.dailyContent.videos.length
    });
    
    // Apply initial language
    changeLanguage(state.currentLanguage);
    
    console.log('✅ Paradise Gallery loaded successfully!');
    console.log(`🌊 Version: 14.1.0 FIXED - ${CONFIG.CONTENT.DAILY_PHOTOS} fotos + ${CONFIG.CONTENT.DAILY_VIDEOS} videos diarios`);
});

// ============================
// ERROR HANDLING
// ============================

window.addEventListener('error', (e) => {
    console.error('❌ Runtime Error:', e.error);
    trackEvent('runtime_error', {
        message: e.message,
        filename: e.filename,
        line: e.lineno,
        column: e.colno
    });
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('❌ Unhandled Promise Rejection:', e.reason);
    trackEvent('unhandled_rejection', {
        reason: e.reason?.toString() || 'Unknown rejection'
    });
});

console.log('✅ Script loaded and ready!');
