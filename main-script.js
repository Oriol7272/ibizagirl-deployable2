// ============================
// IBIZAGIRL.PICS MAIN SCRIPT v14.4.0 - TODOS LOS ERRORES CORREGIDOS
// Fixed: Twitter bot 429, Modal functions, Isabella chat, PayPal integration
// ============================

console.log('🌊 IbizaGirl.pics v14.4.0 FULL ERROR FIXES - Loading Paradise Gallery...');

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
// CONFIGURACIÓN CORREGIDA
// ============================

const getPhotoPool = () => {
    if (window.ALL_PHOTOS_POOL && window.ALL_PHOTOS_POOL.length > 0) {
        return window.ALL_PHOTOS_POOL;
    }
    // Fallback básico con imágenes que existen
    return [
        'full/bikini.webp', 'full/bikini3.webp', 'full/bikini5.webp', 
        'full/backbikini.webp', 'full/bikbanner.webp', 'full/bikbanner2.webp'
    ];
};

const getVideoPool = () => {
    if (window.ALL_VIDEOS_POOL && window.ALL_VIDEOS_POOL.length > 0) {
        return window.ALL_VIDEOS_POOL;
    }
    return [];
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
    
    BANNER_IMAGES = ALL_PHOTOS_POOL.slice(0, 6).map(path => {
        const parts = path.split('/');
        return parts[parts.length - 1];
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
        items: "items",
        save: "Save",
        unlock_content: "🔓 Unlock Content",
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
        footer_desc: "Your daily destination for exclusive Mediterranean paradise content.",
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
        items: "contenidos",
        save: "Ahorra",
        unlock_content: "🔓 Desbloquear Contenido",
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
        footer_desc: "Tu destino diario para contenido exclusivo del paraíso mediterráneo.",
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
