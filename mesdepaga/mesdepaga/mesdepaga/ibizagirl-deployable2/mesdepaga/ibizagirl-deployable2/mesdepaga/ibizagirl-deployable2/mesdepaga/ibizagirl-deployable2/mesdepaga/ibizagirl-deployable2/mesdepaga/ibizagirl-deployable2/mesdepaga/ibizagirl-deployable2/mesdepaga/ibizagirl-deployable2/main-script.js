// ============================
// IBIZAGIRL.PICS MAIN SCRIPT v17.0.0 SEO OPTIMIZED COMPLETE
// Enhanced for Search Engine Optimization + All Features
// Keywords: Ibiza fotos, galería Ibiza, paradise Mediterranean, playas España
// ============================

console.log('🌊 IbizaGirl.pics v17.0.0 SEO Optimized Complete - Loading Paradise Gallery...');

// ============================
// SEO CONFIGURATION & KEYWORDS
// ============================

const SEO_CONFIG = {
    PRIMARY_KEYWORDS: ['ibiza fotos', 'galería ibiza', 'paradise ibiza', 'playas ibiza'],
    SECONDARY_KEYWORDS: ['mediterráneo', 'españa turismo', 'islas baleares', 'content premium'],
    CONTENT_KEYWORDS: ['photos daily', 'videos HD', 'beach paradise', 'exclusive content'],
    LOCATION_KEYWORDS: ['ibiza spain', 'balearic islands', 'mediterranean sea', 'spanish beaches'],
    YEAR_KEYWORDS: ['2025', 'actualizado diariamente', 'nuevo contenido', 'última actualización']
};

// ============================
// ENHANCED ANALYTICS & SEO TRACKING
// ============================

const SEO_ANALYTICS = {
    // Track keyword performance
    trackKeywordInteraction: function(keyword, context) {
        if (window.gtag) {
            window.gtag('event', 'keyword_interaction', {
                'event_category': 'seo',
                'keyword': keyword,
                'context': context,
                'page_type': 'gallery',
                'user_language': state.currentLanguage
            });
        }
    },
    
    // Track content engagement for SEO
    trackContentEngagement: function(contentType, contentId, action) {
        if (window.gtag) {
            window.gtag('event', 'content_engagement', {
                'event_category': 'content',
                'content_type': contentType,
                'content_id': contentId,
                'action': action,
                'page_location': window.location.href,
                'user_language': state.currentLanguage
            });
        }
    },
    
    // Track search intent signals
    trackSearchIntent: function(intent, source) {
        if (window.gtag) {
            window.gtag('event', 'search_intent', {
                'event_category': 'seo',
                'intent': intent,
                'source': source,
                'timestamp': Date.now()
            });
        }
    },
    
    // Track page depth and time on page for SEO signals
    trackPageDepth: function() {
        const startTime = Date.now();
        let maxScroll = 0;
        
        window.addEventListener('scroll', function() {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            maxScroll = Math.max(maxScroll, scrollPercent);
        });
        
        window.addEventListener('beforeunload', function() {
            const timeOnPage = Date.now() - startTime;
            if (window.gtag) {
                window.gtag('event', 'page_engagement', {
                    'event_category': 'seo',
                    'time_on_page': timeOnPage,
                    'max_scroll_depth': Math.round(maxScroll),
                    'page_type': 'gallery'
                });
            }
        });
    }
};

// ============================
// MULTI-LANGUAGE SEO TRANSLATIONS
// ============================

const TRANSLATIONS = {
    es: {
        // Core content
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
        payment_error: "⚠️ Error en el pago. Por favor, intenta de nuevo.",
        preview_gallery: "🔥 Vista Previa Exclusiva",
        
        // SEO-optimized content descriptions
        meta_description: "Galería premium de Ibiza con 400+ fotos y 80+ videos HD actualizados diariamente. Contenido exclusivo del paraíso mediterráneo español.",
        photos_seo_title: "Fotos de Ibiza - Galería Premium Mediterráneo 2025",
        videos_seo_title: "Videos HD de Ibiza - Contenido Exclusivo Español",
        gallery_description: "Explora nuestra colección exclusiva de fotos de Ibiza actualizadas cada día. Contenido premium del paraíso mediterráneo con calidad profesional.",
        
        // Long-tail keywords for SEO
        seo_keywords: {
            primary: "fotos ibiza premium galería mediterráneo",
            secondary: "videos HD españa islas baleares contenido",
            location: "playas ibiza turismo español paraíso balear",
            content: "galería diaria actualizada premium exclusivo"
        },
        
        // Content with embedded keywords
        hero_seo_text: "Descubre las mejores fotos de Ibiza en nuestra galería premium del Mediterráneo. 400+ imágenes exclusivas de las playas más hermosas de España, actualizadas diariamente para ofrecerte el contenido más fresco del paraíso balear.",
        
        // Isabella messages with SEO keywords
        isabella_messages: [
            "¡Hola preciosa! 😘 ¿Buscas las mejores fotos de Ibiza?",
            "Pssst... ¡Los miembros VIP ven toda la galería de Ibiza sin desenfoque! 👀",
            "¿Lista para desbloquear el paraíso mediterráneo? ¡VIP te da acceso instantáneo a todo! 🌊",
            "¡Hoy tenemos 200 fotos nuevas de Ibiza y 40 videos nuevos del paraíso español! 🎉",
            "Solo haz clic en cualquier contenido borroso para desbloquearlo! 💕",
            "¿Sabías que con Lifetime nunca más pagas? ¡Es la mejor oferta para acceso completo! 💎",
            "Los packs te permiten desbloquear contenido individual de Ibiza, ¡perfectos para probar! 📦",
            "¡No te pierdas las actualizaciones diarias de la galería a las 3:00 AM! ⏰",
            "El contenido de hoy está 🔥🔥🔥 ¡Las mejores fotos del Mediterráneo español!",
            "¿Necesitas ayuda navegando la galería? ¡Estoy aquí para ti, cariño! 💕"
        ]
    },
    en: {
        // Core content
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
        payment_error: "⚠️ Payment error. Please try again.",
        preview_gallery: "🔥 Exclusive Preview",
        
        // SEO-optimized content descriptions
        meta_description: "Premium Ibiza gallery with 400+ photos and 80+ HD videos updated daily. Exclusive Mediterranean paradise content from Spain.",
        photos_seo_title: "Ibiza Photos - Premium Mediterranean Gallery 2025",
        videos_seo_title: "Ibiza HD Videos - Exclusive Spanish Content",
        gallery_description: "Explore our exclusive collection of Ibiza photos updated every day. Premium Mediterranean paradise content with professional quality.",
        
        // Long-tail keywords for SEO
        seo_keywords: {
            primary: "ibiza photos premium gallery mediterranean",
            secondary: "HD videos spain balearic islands content",
            location: "ibiza beaches spanish tourism balearic paradise",
            content: "daily gallery updated premium exclusive"
        },
        
        // Content with embedded keywords
        hero_seo_text: "Discover the best Ibiza photos in our premium Mediterranean gallery. 400+ exclusive images from Spain's most beautiful beaches, updated daily to bring you the freshest content from the Balearic paradise.",
        
        // Isabella messages with SEO keywords
        isabella_messages: [
            "Hello beautiful! 😘 Looking for the best Ibiza photos?",
            "Pssst... VIP members see the entire Ibiza gallery without blur! 👀",
            "Ready to unlock the Mediterranean paradise? VIP gives you instant access to everything! 🌊",
            "Today we have 200 new Ibiza photos and 40 new videos from Spanish paradise! 🎉",
            "Just click on any blurred content to unlock it! 💕",
            "Did you know that with Lifetime you never pay again? It's the best deal for complete access! 💎",
            "Packs let you unlock individual Ibiza content, perfect for trying out! 📦",
            "Don't miss the daily gallery updates at 3:00 AM! ⏰",
            "Today's content is 🔥🔥🔥 The best photos from Spanish Mediterranean!",
            "Need help navigating the gallery? I'm here for you, darling! 💕"
        ]
    }
};

// ============================
// ENHANCED CONFIGURATION
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
        DAILY_PHOTOS: 200,
        DAILY_VIDEOS: 40,
        NEW_CONTENT_PERCENTAGE: 0.3,
        BLUR_PHOTO: 10,
        BLUR_VIDEO: 10
    },
    SEO: {
        SITE_NAME: 'IbizaGirl.pics',
        PRIMARY_LOCATION: 'Ibiza, Spain',
        CONTENT_TYPE: 'Mediterranean Paradise Gallery',
        UPDATE_FREQUENCY: 'Daily',
        LANGUAGE_CODES: ['es-ES', 'en-US']
    },
    ANALYTICS_ID: 'G-DBXYNPBSPY'
};

// ============================
// COMPLETE CONTENT POOLS
// ============================

// ALL PHOTOS FROM /uncensored/ (400+ photos)
const ALL_PHOTOS_POOL = [
    '00wd2wVE89BJnQVenuNP.jpg', '01CTDHff9PmCsZqjjCoO.jpg', '02gNvnd7bLJgBX7wvQ2r.jpg',
    '081YXXFwiGwFJpJCqkV9.jpg', '08cuJR4dA17oVjLQcQd7.jpg', '09HFl7nAkIjFBFbg3SeA.jpg',
    '0K7AtRh7U93R2VH9axxQ.jpg', '0Scwe5oo0JuUEanBguCT.jpg', '0VBC7iOXjVN2c89AngyH.jpg',
    '0XOhygF9EVXZI4PEp1GG.jpg', '0iELEcoTlZgqxYoQG168.jpg', '0ijarBbN0aKx6uXbanyP.jpg',
    '0oN44NT2wHztAUYhV5bc.jpg', '0qvHNvqJU86FmxFEu8Fv.jpg', '0yiMo3Hxx1iFQquiFJtX.jpg',
    '12IdAS832WEcngM0TmiU.jpg', '15rRK9JyAaWsDxwVzCRM.jpg', '1DCEysi2B2gEWgZnDyqg.jpg',
    '1G4FDSg9HpEVWWDhmpDO.jpg', '1bITefcv83TIA7idRrrO.jpg', '1cCATxFagDwKacKPXz0S.jpg',
    '1dsu1ynPOBgwxVIVMm98.jpg', '1nmCjq8qcYS5FI9j3hN6.jpg', '1pMMHfrCT7WQEN3aJDsC.jpg',
    '1xUbXQJILXBEBoXRvC5D.jpg', '2J6UGbexO5xfFKKhz32I.jpg', '2R3uT1L7N7Q1iq7As9NX.jpg',
    '2SRGCpe7oLwqRYHB4iTn.jpg', '2XaRIysrVi2K7cVPUKsT.jpg', '2c1EDSm7ULtMHlm1TzmW.jpg',
    '2fTpn1FbvDpznuZ5fIQd.jpg', '2oDBdtvtqAGojxJFhuR4.jpg', '2q4lbVbHtmY9qfEqh1Ey.jpg',
    '2uWScXgZ5pqb3NEtzrlz.jpg', '31vAZT8MZI5qtnuApW4W.jpg', '35H8tCgsszXQMJVMOC3l.jpg',
    '3PclVfFD7nJ3InJVwttg.jpg', '3WgVIdLpmtrHE84hkBfh.jpg', '3kZqhcfslBFziRb03SyP.jpg',
    '3m9WiyhGocSOHasI9jNK.jpg', '3n4MIVGQIB11aRmCBeoX.jpg', '3sVGyXMADBwgIntxAEZ3.jpg',
    '3xWh5OFFxwTCOfchavPq.jpg', '403My6cJ8dy91m6mLcLq.jpg', '461c6YZMoZeUAUMmuROj.jpg',
    '46TvCsW1KG6wcG0OWRc7.jpg', '46yy65BCWILWvvLCbqn2.jpg', '4DXLdKZgVq1Q329fFPyt.jpg',
    '4J4pjTHMnGA41KobOcix.jpg', '4K0QR8fpSVgfqZkHLDRZ.jpg', '4mcXgi9YTy0MDVLSFwSc.jpg',
    '4yL507qGjWSU4a2jG88v.jpg', '56zvcPsKbH436elhTW9v.jpg', '59FS3M0yvTO9m1T5RZaW.jpg',
    '5NSmf9UdwUJBWNS7LxM5.jpg', '5UaQChlNIlRegwT0Ze2S.jpg', '5jNEr8DlVNisD1JmgjeH.jpg',
    '5qUWFqgvq00BJhlDvaal.jpg', '5sKc0zYrls3NUrzzjErK.jpg', '6EY9skMPqrLwBUNjGFiv.jpg',
    '6ONISuRyiUS9ZCdRhOSg.jpg', '6akVvgSAP9kKu3Ob6L9d.jpg', '6apiRuvUyKSHHRMmMgmG.jpg',
    '6lMSMiVHv1XMgSPwW4ip.jpg', '6r6lVgDdfHbbtidgSPZN.jpg', '6s0sdzRWqsoxt1WPCnPM.jpg',
    '6yN7dx3DoyEwlN3Ol7Ut.jpg', '6zLWLniPGUkRJY5POGIL.jpg', '71vfJAfMsE4xUq29LXCo.jpg',
    '732dTb1kgPbfj1Os7gpC.jpg', '74YxySrakRiQjhlx3eGC.jpg', '77dloZ2NC0zWArP9SehU.jpg',
    '7Fx3i0mFdo4geEFEwWOA.jpg', '7XWsrGdGy37iMYnqxbfi.jpg', '7ZVh6C8cX23R74oaTsmF.jpg',
    '7inANxeWqD6aaicOuE2S.jpg', '7yrnh8Oz9H5wUFIbU3OC.jpg', '84KsLMS8hVxaFO0Q9f5U.jpg',
    '89KP7lZmKrgLm44MBptH.jpg', '8DA2kf0McrBgX94SzGhN.jpg', '8Ka0jEYLqYV0GGCpfF6r.jpg',
    '8WiqA1mLF0ja4a4YtpJD.jpg', '8cndfemRf3gFaOImXrrq.jpg', '8ft3e5R8H7LnMi4cG94M.jpg',
    '8iWFfZygYpXIhRjvgnDn.jpg', '8oZuGhXOtLHIMw9HkPh5.jpg', '8phioNKwTe78kkBxfQxv.jpg',
    '8vbm5FHM8vgTIgwxd0hY.jpg', '946jQMQ9GmyNXBdBMG8J.jpg', '9HoKHfzfIKXiINyRQ7OG.jpg',
    '9KlT5M8s7HTxMuptLEkN.jpg', '9YLpn3gsg8sTGaN0CmZm.jpg', 'A3lni0mmt59IIQ1U0cki.jpg',
    'AOOPNFh6elOmLpET52cL.jpg', 'AWHi4bruJeZpZWykW5WY.jpg', 'AeMMkssAnwhOZTeM4cLo.jpg',
    'At5HwZnBpTKKrye94W2M.jpg', 'AxBUJVXIfxuHd0aHWzQJ.jpg', 'BLHvjp8XiOuMwnFiiSx0.jpg',
    'BR4erJG0H1rJe4ZJ5NST.jpg', 'BUantPVDTvninIArlmnK.jpg', 'BW2SigW9ypARcB9M6gwU.jpg',
    'Bay55kBwPyPNFWVOuUuE.jpg', 'Bn8Hnr3lg3JqtyjSVJAm.jpg', 'Bn92cX5S8V6Dgol3USGl.jpg',
    'BumjAYfdAZcXbkRbkmrv.jpg', 'C51PrtXJH59RHNPOMrrW.jpg', 'CJoiRWToytr1BwAXi9fY.jpg',
    'CKowwClF8BDYHfDWTyyn.jpg', 'CR9rpq7Z02JceUfzItVA.jpg', 'CTAQFqFPN7REXCqYT4Pt.jpg',
    'Cd9njNgqaD1K2K4mdQti.jpg', 'D0mPdYeYsfvlsrAIKDYT.jpg', 'D1ucetT6b2O4sxJzDNCI.jpg',
    'DD4hHF5hYqn6ZU1Vo1ir.jpg', 'DuE3kpTijyH0TXZeNRov.jpg', 'DummLHc01i6ZMJIxhJTQ.jpg',
    'DvCbL0ojNUx8yzgxz8zx.jpg', 'Dxm1dyC83PKkRYOrfJiW.jpg', 'E75eiElJeiCVSn0WS72T.jpg',
    'E7JzkeEr78vOg3uIWy5I.jpg', 'EAgRrr2lNOrxmrDL3yVU.jpg', 'EPmllKLsG506WCkz199l.jpg',
    'EQHgWHYT0Jzre8QYnlmT.jpg', 'EdXOtADBqeo2W6AREooM.jpg', 'El1t70PQ1bUFWP1zwcPB.jpg',
    'Em2gLRr2h2FGkQqrF9eL.jpg', 'ErAKl9ZeXxFDEe7ZXfeL.jpg', 'F3yLtdx1zDT72xCUNhyp.jpg',
    'F6rxwO5AqTPCP0966scx.jpg', 'F7DfIkzXjoHim0pcNtiX.jpg', 'FAYtHPEqBLgxLlVmGzSl.jpg',
    'FJyYszquUW4GAB9fGimM.jpg', 'FUQXqgoiz9dZtNBtNj1h.jpg', 'FfBIu6uUwjaLMmvituyJ.jpg',
    'FjcagIkEyERN5UkD00sc.jpg', 'Fpd4oXLjygVVcjFoUwMJ.jpg', 'GBaZuttvlobM3dZ0DvMp.jpg',
    'GDK5lZW2nJBRkhcYUQeN.jpg', 'GEjoHmqbZNl78oeYxdDu.jpg', 'GVj1Znv6r8n25DVL35Sg.jpg',
    'GXQNHxT1zqfgDPEV1vsS.jpg', 'GfKCNq1M1XRsuyZCSr46.jpg', 'GqQr7Ywtyq8G7MJ8XtdY.jpg',
    'GuseB7bjqZnXhww3OA3p.jpg', 'Gw7Pz77APe8DlIsAn8oO.jpg', 'H2G48QtUrqK6CTkVFepL.jpg',
    'HGMKwHDnRHyC8JcVjM4d.jpg', 'HI1hEiBDawW7Jt69olSP.jpg', 'HJk26Z6e0TG9m5R4FGSF.jpg',
    'HQDdvBI7oMMbwo74KM6P.jpg', 'HVUKSu4G934WlNSkGzLK.jpg', 'HWU31WfJnKiOnncOIS1Y.jpg',
    'HbTH3rkNRjidzdICdP2b.jpg', 'HdbSTiiVGxwsEEsXrwAY.jpg', 'I153uRWwV7VOeJDIs4sW.jpg',
    'I1ShZ7ErsJgCeQwmZwwF.jpg', 'I43EYSqDdcgBkaFdbkHY.jpg', 'I9cJBstV9Y6eozlZZtW9.jpg',
    'IpsKgU2YRTmPe2nNHBrE.jpg', 'J5Kwtdb5IugC0tRQYiSL.jpg', 'J6veLoeh1n1Sn7GLMFGI.jpg',
    'JFIqTqkFspgFZDpiXz1E.jpg', 'JJdSiCOKhwnOVS52xMoJ.jpg', 'JLi7W8qCzYE8fSD84EOL.jpg',
    'JODBt6yyAJW89FOY6e3f.jpg', 'JTPqS6ON0FEUIWgPkgfP.jpg', 'JcqsT7TH5R7mNg2HhQ4V.jpg',
    'JxNhYcIxiiUXXQqYsEFJ.jpg', 'K1jKFhSlZDPveOh77wv0.jpg', 'K5MQWWTZ5DH31NLdu0MK.jpg',
    'KCgnUpcVu2p3Lk6ppULd.jpg', 'KJKm1yAasOarP8RCmqTL.jpg', 'KXIiOrTZuPIftCkvbbJr.jpg',
    'LNN7yt3LxaWZM0GLv9GH.jpg', 'LRN5FatqF8trNHPNO1hf.jpg', 'LTNnisZwtW4gCMWBDnRt.jpg',
    'LYSESzSp78K3C45L6tsX.jpg', 'LZrIcGadINB1ozCi3V0s.jpg', 'LfVhOTzOvtgfwJOjHvzU.jpg',
    'LtSsb8EEfAY9kJeaIYMw.jpg', 'LumVkeyGUZdYOHaWkQYz.jpg', 'LwMDwrC3vWknoJqpFfwd.jpg',
    'LxlIJ4VjxLLd97JcWxar.jpg', 'M0vnSlmKQmrKMwH5ZUgj.jpg', 'M5g8cirHf8JJPdpnnsv6.jpg',
    'MR6e2zwM8nBpBATk69uV.jpg', 'MS78j8iZVCPITPEZSJyS.jpg', 'N7QBurnWQH4xeS8X6iUA.jpg',
    'NDR21wdM9EXPH9PLWnbV.jpg', 'NU5dkcdR1r43NND2VNNB.jpg', 'NhcBhFni2HJg9Qgo9Wtl.jpg',
    'NqO93fUipM4zuYSCRSt5.jpg', 'NwQ9Qyu7hw4v1euBi5Eo.jpg', 'O1liPEh6fua3iMGqbGSv.jpg',
    'OEgHK5KXpZFdq6NLoG5Y.jpg', 'OEikSia0qKPA9abxuCkt.jpg', 'OM8HPUdhhBQ9X4NEFrlu.jpg',
    'ONx32lOdGQ9ZPQdUBZSy.jpg', 'OWmeGkbmX9ThZv53PWJt.jpg', 'OZlQLWFUfmpSXXMl2Pre.jpg',
    'OtDIJvuToJKU4tTHERCF.jpg', 'P3GqyhUt8X9wpa6AQq83.jpg', 'P5Ub5tzpVEJqb5XJz2Gb.jpg',
    'PAo0HSU3ztynrbi5Z0Pm.jpg', 'PAvOdXJAJd3gsBEfYAdl.jpg', 'PE866GTsiVCSFkO7pCTD.jpg',
    'PKqJWd0mti9zeAi90dHg.jpg', 'PKrb6qNV5YCg2Q06e7S8.jpg', 'PKvQVSoNhaFFcoQErJks.jpg',
    'PMaNxIBeS0dm4c0bFgvC.jpg', 'PQRyzGlNikD21FdS7pBs.jpg', 'PcP60ZVq56xmJvq4dvqW.jpg',
    'PlDZ1pKn1q3I1hXXLExl.jpg', 'PlwSDconyj0i8CwiBrDF.jpg', 'Po0MI0Pljmjzo0g0bgSO.jpg',
    'Q1ykJ3sHIwR1f9kYOluf.jpg', 'Q3VtgaAlFcFsFkxYRgIJ.jpg', 'Q8YLAcSYnDB3Vb4pKuyk.jpg',
    'QBUkOSvqdloHZ7iyXPpO.jpg', 'QBy5ZfWHVJvnLyxNRnKf.jpg', 'QHww2p6ylZs1yHAk65sM.jpg',
    'QMeka4uzpb3ymNmeUgbG.jpg', 'QPLXhHvbt5qivgqmbVSM.jpg', 'QXDnGBK6MKoUHXg71OPq.jpg',
    'QXJvPlfZaXmk6wVKbZBj.jpg', 'Qa5pHwcgDH6ffwFaG3oa.jpg', 'Qo81ClhOc0XlM2PYm6qG.jpg',
    'QraltuskN2uvgnNTVI0x.jpg', 'Qv0rAMYkvdiAE7JGvu9R.jpg', 'R72I1Vrwagr4YQFpwcZp.jpg',
    'RFmBcbzkkjVgANIJIvsF.jpg', 'RMDX2WN1CkmjBilpzDfg.jpg', 'RhCfK8G3IqBOCzVyASkc.jpg',
    'RlmOXuCEIgvURQnuV94V.jpg', 'Rmv9Xwwg3e2pN2zbGVGT.jpg', 'RvDCkxFEkl73MTBJReM4.jpg',
    'S4J6LLRoGsjvq4BNylGE.jpg', 'SPx53vX83UXLurLpvx3H.jpg', 'SV2MqZOgdWI9rGY314Tz.jpg',
    'SV9V4eEQruzAPC13ur88.jpg', 'SXTzZBVucvSX7gKhmd91.jpg', 'SaBqVqA0TXxRXMI1vQc5.jpg',
    'Sc2yy5V2ajuciQ8FN4in.jpg', 'SfodO0wyRBWzKyheHytj.jpg', 'SrPco4nWLMbJXQoWYfFc.jpg',
    'SyWKyUgFoMmXtcTCGRcD.jpg', 'Te2nfJ7cUJ4CLzPXOGNP.jpg', 'TgxnDUvTym3gq8YTlsJ2.jpg',
    'TvU7xoUCwoitZrr3EsNd.jpg', 'TxrLV79hkygFYw7PDpwR.jpg', 'Ty5J5IaTVkbdQJyS0hC2.jpg',
    'TzeaqxRMZ12lDvpoLlK2.jpg', 'U7P8FbQo0hWzHrxvi9wk.jpg', 'UQzUY6tuS0GVfhvLeNK4.jpg',
    'Ufy0mWkrko5ed2UkruWI.jpg', 'UhtDnlRDjqxL6x28wdRn.jpg', 'UvjPQmDagzzEos0XG1CE.jpg',
    'UyCBJ2zBqBhJucsYdiwp.jpg', 'V598zvT31JDtncTW8taC.jpg', 'VDIBPJUuL4Ux4Q95ANNY.jpg',
    'VT16zdTynZ6KLd1gM5MW.jpg', 'VUSbYDdTQAPUAbQL2k5t.jpg', 'VXo54Kcv8xj0036eFgzu.jpg',
    'VZMm5YiJeGpoUt5VsLDk.jpg', 'Vdk4r7LEyIWXicSheqOV.jpg', 'Vqe3FDWRy9t64oawHLAj.jpg',
    'W9dJWz2EQiyHO6hi61Ke.jpg', 'WEYv5fEVOU5b3TXEhdvp.jpg', 'WGqmQbPGcAFj3zRebbtZ.jpg',
    'WKEloNrb602t5Z305td2.jpg', 'WMob9VUs8BZQ6AnSsxM9.jpg', 'WPxkhDyjBs16CP58mEes.jpg',
    'WQlK4LV4UdMfkOAdpqdX.jpg', 'WiLxvIQAfj0OE81yvehw.jpg', 'XDC7mdzYxqbcW96Ll8F1.jpg',
    'XrwKIgKRAo8bThGJivai.jpg', 'XvRO8b4jw6jOB63k00YB.jpg', 'Y1v5ySZBgQ9bvFMzv0A4.jpg',
    'Y20jBClEmK9x7H3gAEbQ.jpg', 'Y8zMVR7HKXDnqEt8jgLy.jpg', 'YBOXRS5JuRRnkG3ORgbK.jpg',
    'YKEv532dcs0wjRUwPsgo.jpg', 'YNwwlpcd4rOAWIumzGVE.jpg', 'YXVZw5NwlZLL57a4Bq6V.jpg',
    'YXmjoYna5YFEGbpZnusH.jpg', 'YuujAXHGHTJa2b0Ma0Xd.jpg', 'Z7Z7UTXyqeJ8LszoaSgW.jpg',
    'ZJQkp1PjTIYYISINiSeI.jpg', 'ZMeqaOEpYTZEzIrgPkce.jpg', 'ZgVIcYVuhSWbyRHZp2Gz.jpg',
    'ZjeRXsd3kDsL0XWGR4BN.jpg', 'ZqrNZJMkwWcuckpUMfxM.jpg', 'Zv7rn9Iq9Fvv8ketJ0qM.jpg',
    'a6OfuGsnOyOnD1fpeFHp.jpg', 'aD2uZbupvQP5eG4H88hu.jpg', 'aer0cOYKwlfdLN2soOxd.jpg',
    'amjSkXY4CehaPR7pb6LP.jpg', 'avrdLWr4n6wdrVj7Ace2.jpg', 'b3gbniWeQ3SYhpA5R3S2.jpg',
    'b6DSThKWZmLSwHdkQUcs.jpg', 'bISH5IZHpOqJljTXI5a5.jpg', 'bS5wI3lzdj9uBSaLxw4s.jpg',
    'bYeR8DqBoQA6FeA1TAY0.jpg', 'bbuiH38TdHwzmiUwJlyk.jpg', 'bfYXN3JxyKRj9mxqspKx.jpg',
    'bghKRc69Diizw4aW0Z1s.jpg', 'bq6LfiHrOu1hm6hyA51z.jpg', 'buena.jpg', 'bymSR1aP4BBTZXfHXqDx.jpg',
    'bywUeU5kqyduPEyNnH1d.jpg', 'c6GDaL5ct2FzHMnWTQJx.jpg', 'cDXwVaOVYHhqAjBqFTDf.jpg',
    'cEcK1EQc02yxsviqkQ4N.jpg', 'cPMEn2ZXOzrv6XvX4SsX.jpg', 'cQcaPweOKtYOpQJQ7N2P.jpg',
    'cXDRoW23fDfaocJdTVZs.jpg', 'cj7ehJboFud6ZLuS4IBB.jpg', 'cpoIVHMZzemmt5HJTjHk.jpg',
    'd2VE38Jpn8y8IzBvUgXb.jpg', 'dDRLUWKcxwS7HoUd63bg.jpg', 'dJX6NykQEMnAMi4I5j4t.jpg',
    'dSKs7G60OQ19t3wjDjG0.jpg', 'dsDTrTCZY4z8TeVxoqzy.jpg', 'dwNhaABVUxVgZqEh8x7R.jpg',
    'dwer.jpg', 'e0cgUGya6Zd2knd2FWo4.jpg', 'eQReQsoJjyZmW1cToOUj.jpg',
    'ekmYbNBjpyWxZwRlc1EK.jpg', 'em8NYnW4IDBJVnQs9lto.jpg', 'eoLBYaofqZgS4nlCIhQR.jpg',
    'f113QHZHP04PMmqpBMfa.jpg', 'f8wGqIcKeKvhNyPEUfe7.jpg', 'fWYgODcQXKeRGaYAM22W.jpg',
    'feDWFZXdWOjqFXBuGVBW.jpg', 'fima8JceRo46sZEPXqa2.jpg', 'frByUlLa0C2K5lgDkcQ4.jpg',
    'g9YZrmTt09PEvbCs4RPE.jpg', 'gHzeQOkqUV84zzzuSpgE.jpg', 'gKzWF1nTDITgeW5ncsqP.jpg',
    'gSjn06ayDntNK7UL5You.jpg', 'gWHDLmu43lpXkeDV4tbF.jpg', 'gcLWreCoolbJqNwOf8U1.jpg',
    'gyqtLyHCjFjxa5Xlu6Ne.jpg', 'h45ORs5aLOgFeqKyTnWF.jpg', 'hBMxpVCedayVkP0BqEQV.jpg',
    'hd1lg4PmT8FlPiRGl3lo.jpg', 'hdXKfkAqMbbJskcA4BxU.jpg', 'i9xJTxC3Eg2uoe9Jj6gJ.jpg',
    'iK69xs2gC17gjdQVf7up.jpg', 'iO7iZkkFMi37vU9SZ4xd.jpg', 'iUYW7O0vg8JsWx5MslUE.jpg',
    'iV778dwfnhrH6XUJO8yp.jpg', 'ibBknsEWo2ZZsqY8ebGd.jpg', 'ivlJ70pfwGp4OvaZWKDI.jpg',
    'j4ztrGMxFLctL4McHEUZ.jpg', 'jFnhrqggWafAUbJzHDGv.jpg', 'jSEHrkQCSaTuzwY1jOeO.jpg',
    'jT3PVCsGq6nB21KImB18.jpg', 'jVcbIFSxvYMeyg3usCx5.jpg', 'jaCGsa3mIpZowavgiRYm.jpg',
    'jeHUaQKdkvKP3jpwDOYF.jpg', 'jt426nGP8qxAKabKAFm3.jpg', 'kBZg980vFtgITgH3U9eP.jpg',
    'kBhnbWMg1wlbsK1rocEt.jpg', 'kFqXeWd9kDO8mK40WFGm.jpg', 'kMOVTOl3HyJSFM9SSy3z.jpg',
    'kRVFX2Hx82yLkxMv2Bkv.jpg', 'kvMWPx1dZLAKZTdYz021.jpg', 'lMpWr6oDCT9jbQOwKbWj.jpg',
    'lUHym7kHYRdhnkw6VD7s.jpg', 'lfwP4u79vuwM4va0YWZl.jpg', 'ln4cy8UbL9pYn1VLTF0e.jpg',
    'm2kKb7qO1uuD3EUcB2cJ.jpg', 'm4oKDDAF9xsbLkaOfVUA.jpg', 'm5mNwWpXUjyzMSltrz1B.jpg',
    'm73nqvEQU4Fecsk00rus.jpg', 'mCWN6vWMYeUVXmMwIQR9.jpg', 'mJ5co04gw0DHvm11vrSm.jpg',
    'mclWDmpQy6Jw4mioMNj7.jpg', 'mrDqEi5kwO2z7tUPLsRb.jpg', 'n2SCfQGfx3Si6ccI10hp.jpg',
    'n9a2o9706P5FLtEoQoAB.jpg', 'nEWH46LuSKNm1jwxLVHi.jpg', 'nO3zP3L1tCqeVfOgoHVS.jpg',
    'nPwyzQniFFbKSfS8aYCr.jpg', 'nTNsF9TsXAR57edrOwt7.jpg', 'nTZcGjrmMkT0Og9p0z6C.jpg',
    'niRDWeZ3BtT2RR9Cdckc.jpg', 'nyVLfjGqj8DdIYERQ99Q.jpg', 'oEedv8rm03NALlSPM5tx.jpg',
    'oSgZP9KBPzYTwLvOPwlZ.jpg', 'oVlFS64S0Xl6WcZQcAgd.jpg', 'oXf4T6sbNqjCYoxPSjV1.jpg',
    'ocMCWfpPdb0UdxA8X5DJ.jpg', 'oiAgfPQdhkjIpMG52dqw.jpg', 'oiaNx0RXf70ZSCb6yOoC.jpg',
    'omcO6PYtLWtwCXQjf8UG.jpg', 'osLuGEmMEbvUS4Wg0vPd.jpg', 'oyvzaYAsJMYwriGwLPpH.jpg',
    'p0dStxOXaQWuSKOUnSHU.jpg', 'p8rYPj7cs9pgmNHwc6LO.jpg', 'pBR6vTdna2mbQ6v6EQwn.jpg',
    'pE5nmAr4Lizvo924w8Sb.jpg', 'pNW4hpBgw31BVY3fd6To.jpg', 'pcwWIs299QC1Lsdr9muq.jpg',
    'pi6Lxcrb5ba8mRgO6a7n.jpg', 'pqY5nm0h3KOVpPeMavsh.jpg', 'pshgDOF3v7yu8WjL2yOw.jpg',
    'q6SE4dVL7eizodS3xyfH.jpg', 'q6V5X7sH0dGRPcMFZ425.jpg', 'q7pjuQKY7eWM17QjF4jA.jpg',
    'qOlZbg4apVmI99ZjBWZl.jpg', 'qSv5wb0i30t7SdK2keWB.jpg', 'qUJdXMuHYIuGRv5ESyqH.jpg',
    'qZPA1xJ6KVyLzp2jMc4y.jpg', 'qhvjLVrp1aIC5Re5rloh.jpg', 'qjHfE9t6JL0S68R40RxG.jpg',
    'qkuJlaGJWpdwEIc0lSqj.jpg', 'qkv44mGKiKa7EWTcvzDO.jpg', 'qtxWuSAFLyXBjHVE1Tpu.jpg',
    'r03rrbTNB5oV8V3xRBFr.jpg', 'r3mHXwdpLzdn84ct5Rbc.jpg', 'r7i7XouqttVdu76L68kD.jpg',
    'rHFTHB859rwkXlJiJP1l.jpg', 'rILjDeGRxOXO8wM52cTZ.jpg', 'rJm7LCq6kmMgwKhbkFSt.jpg',
    'rPEZ7xbwNUIAYKKEhpaE.jpg', 'rR6Uav165srBNywxL5GN.jpg', 'rVfyVHn2N3vWCt4kX346.jpg',
    'rWXDNQryc5Tj7UWM0alH.jpg', 'rb67UqzysqHAT7qYgG3B.jpg', 'rgh4PWAo3zhT0cm0fN9E.jpg',
    'rmOwWvP02A4uUpm7kfgz.jpg', 'rsfMAiPzZKLa55Yl6oM5.jpg', 's0yJlM1LkAD1GgcxE9Tl.jpg',
    's1Z1dpOlcfmfpmxIPsQz.jpg', 's201pek0Ftm1mlgP0Ssm.jpg', 'sBcbjHl9tBNpffy5N757.jpg',
    'sOxSZ1h0vQk0f7Ryq2sw.jpg', 'sYazvt63dV6PJZGtoJJ3.jpg', 'sa3gQ79THDgzz410pD2m.jpg',
    'sj6e6K3wYlhptzAOmeNd.jpg', 'sma7tEF3edHQwDF16ydC.jpg', 'soPyWPzfHk4mkIOyQusT.jpg',
    'sswuJjrax66x9z46s2ol.jpg', 'stzVPLHAEPf2tSjyaQv7.jpg', 'suU3JgTP9BD64Z1DVfcR.jpg',
    'tBwHQg7O6ABrMtw202qU.jpg', 'tI6JPICqch1FrlkerM3o.jpg', 'tL5qXPGTRSz83nhLqOWA.jpg',
    'tNuOh5aHab3OSOwcaYd6.jpg', 'tRhEfgN2nZDDghUAsdjg.jpg', 'tcvZT8b6xDsJU8ELJLZR.jpg',
    'tymVwJGf7k95S23WgwHf.jpg', 'u1Gq93pkObkJWXfhlStS.jpg', 'u3mgMxMEioMv9j4v2fb8.jpg',
    'u6QOkB8xo9Yl8xje0wRn.jpg', 'u8IByrxIxqzIpDOPUoLv.jpg', 'uApLODJD67HU2QbFL2SK.jpg',
    'uQNskNXWxZYwYrsQi0sk.jpg', 'uRtZMBc6s4Qo1ABNeFx7.jpg', 'ukDMjQc287vTIu0dSDjD.jpg',
    'uuWZbWHBiO61Hak3zs4Y.jpg', 'v0J2Re0pvY0Gs5x6lbRX.jpg', 'v2cCao3ZiCPRRzWPiLzq.jpg',
    'v3rqOU23LhBZpTGNtziT.jpg', 'vFpmVchGQTYXh2tLbXNe.jpg', 'vKQoBDqUoPXarpR3vYpP.jpg',
    'vXRd2oZvaaxA7eJdcvoo.jpg', 'vkBTEyNDhLOwkVLFyQJe.jpg', 'vkwJiraLyrhOBVLz1B1o.jpg',
    'vr6T66fOk1VKjDzxBl96.jpg', 'wDwfRvTM7QcdZI5DPDBn.jpg', 'wWECQrjyNR8tCzCyBqaS.jpg',
    'wgSM78L5vvQNKjA2tH7F.jpg', 'wmLduS9rO8qU9aX2uWIe.jpg', 'wtuihFN4OoObLMyng5Qg.jpg',
    'wx0EdfjBwmcgVHSpTMxS.jpg', 'x9YlCH20dNEb1gCFlECV.jpg', 'xIEZ7YxNcUjgUTQKaHbx.jpg',
    'xMZrzpTgB8ZVzlIpoz6e.jpg', 'xRSeg3ANfcjoJX8N4o2B.jpg', 'xWeT3IEAvld7aAfyv2IS.jpg',
    'xYzRmsYF8TmtQ0tF3dhH.jpg', 'xaVDntVPn9ebtoaFT8Dz.jpg', 'y0sWGIcLhfq2UxtaOwed.jpg',
    'y2djGXOKJEz8Bb6eTeUc.jpg', 'yBgWtvwdkyMq9TFg3qKP.jpg', 'yfg3k230t90RBUEUoBGz.jpg',
    'yk0bZlZR6aSRAoUCihPq.jpg', 'yqTobCZL2AABmmNJ7EPU.jpg', 'yz4R00MMukJ7GJBzzDtl.jpg',
    'zJ5oe5Ouj4BMABGhuUC0.jpg', 'zNs4RDOF8MOVNtohZqaf.jpg', 'zgaFEhJq9b3FJ7y9LCcC.jpg',
    'zl3FIFdh4OZMogOhLQXv.jpg', 'zqpBmzZ1EfnsMxLnnSNS.jpg'
];

// ALL VIDEOS FROM /uncensored-videos/ (80+ videos)
const ALL_VIDEOS_POOL = [
    '0nF138CMxl1eGWUxaG2d.mp4', '0xXK6PxXSv6cpYxvI7HX.mp4', '1NYBqpy4q2GVCDCXmXDK.mp4',
    '1SZsGxjFfrA7diW05Yvj.mp4', '2FO1Ra6RDA8FjGWmDv8d.mp4', '3W7GxdRyaPj0uAK9fD4I.mp4',
    '3i61FDkL2wmF6RjQbZKR.mp4', '5qsmyiUv590ZBfrpct6G.mp4', '7gBpFJiLzDH9s5ukalLs.mp4',
    '8RF2trrwvytHFkimtzDE.mp4', '8fQQnk9u7YAQQXDpfOW3.mp4', '8qfK5e4NbCYglU2WfMQ6.mp4',
    '8yE2nxCwV2QcJsdXGf32.mp4', '99ACESTm9KLPGdLSh0J1.mp4', '9weRZL3KvPUd3qNQz0Mt.mp4',
    'BA7Bvw9GHNCbsEKOruXh.mp4', 'Bg8z3Gk9SuxEAFGt1WBo.mp4', 'CzAtUvr9DPCv7JVMFNez.mp4',
    'Fc6f8RSjO8QBTmjjppHO.mp4', 'G4LILz0eqoh4m3YOZ2WK.mp4', 'G4XjXiZIHZZRsKwlDYCp.mp4',
    'Hn9Su6XHo4m7EGiR9f5S.mp4', 'IES8pgSNhuVYlqcse2sm.mp4', 'ImHBnXCOaNfqltnBwcUh.mp4',
    'J2E8ciwOpkU0Jv79cdKj.mp4', 'JswE4SwqdmsQfLef3PzC.mp4', 'Jz7oLnRbSV732OCdu3u9.mp4',
    'M6TEA1f8hNdjol3Wi1se.mp4', 'MCZSxdyGPDN7E7Mkdj8F.mp4', 'MOsBiYkWV6VFfK2P0Pxz.mp4',
    'MaV4A0BTJiYg1UThuwHk.mp4', 'MkWQbiVWaJbShjipx4Kq.mp4', 'N6j12lQQ199vM8HTZw1O.mp4',
    'NTGWrlYi5RltnwhDSO6R.mp4', 'Nnb48ZgMp3tNboq4uXWb.mp4', 'Ocb0MqRnLH1pezhcgpHh.mp4',
    'P6FrIUZnYN1l3N7AKjX0.mp4', 'PiMHNagAFVaFtqmYvimt.mp4', 'QGeTBD8xHjPvnqA72uiF.mp4',
    'RzI8s0b5kfP9tVnoGbAd.mp4', 'S7cVIsUsWJ1Nnf31dhTq.mp4', 'T6auQxu1yZKCGPqVJ7ue.mp4',
    'THeZZmwgwAViHxyn8bA1.mp4', 'UQGldJ8bdBrYyWDP0MEN.mp4', 'UiQ8qKsHUJAvIIPFCLnz.mp4',
    'VijVO7RT6KjdzwE1iFRi.mp4', 'W1vTYUeyTSl8Pvv72sPW.mp4', 'XEW69wj2uK8Bu6NwHuce.mp4',
    'XRCoUfkNLzwUepShH19v.mp4', 'Z8C1oBoK0vERMZ2g8aD9.mp4', 'ZPPOJjpdigAhYYekcnPx.mp4',
    'ZaszI9a5huBi41yXZq2w.mp4', 'ahLNYijoKI9YoYoGToLK.mp4', 'beSTk3pKEdHZJSH7rwHs.mp4',
    'eXZcQY7SeVHjcgwv8hHn.mp4', 'ebNx2Mft0L7qtcGy2sUy.mp4', 'f8FbeCjEOwLRvwIgfK8l.mp4',
    'fCE3ydur09Lbf0hxFHyD.mp4', 'g9fe19vfWl138v5dqou2.mp4', 'gII1RvXkZk6Szauv9cDp.mp4',
    'iniuJRrZzzGp74LWfZYy.mp4', 'juHQDjTQ8HeFlLsuDhzS.mp4', 'k7mErb1EfpdRUhafYFS5.mp4',
    'kAU1KdI09ffEf1fjCgPC.mp4', 'kfDFWczYHsZXjtwmMsP4.mp4', 'n4DaX8Nwj1glWI1Oe9vj.mp4',
    'nLejk9R1jPVuOpyrlrAN.mp4', 'o8cMQhNaSZiO0d0NoshF.mp4', 'owT8LTlvFEfwHj5cOtbc.mp4',
    'peTmHJhWF44gaz25ACCr.mp4', 'qEOel0dBNRP2ttJtVUcQ.mp4', 'r14kVENgyJthsXKP4ckJ.mp4',
    'rBSogUSRYAorst0XO7oy.mp4', 'rWwDSNSYmt9jpPd2ngiI.mp4', 'raKwkNU85MId6acMS6a0.mp4',
    'udkEtFkLN2SKU1I3aSIT.mp4', 'vF3JI0gM7nDGJAiKFb7S.mp4', 'vhDZYiY0UkTLtmu7HrfF.mp4',
    'wtcVFSKn4McI9xahFEGr.mp4', 'ymdZTKkujrU5ON7ZB66H.mp4', 'zB6YDw2LZ6BZl8CbXMiV.mp4',
    'zX53TSjhlQj4Gy76iK0H.mp4'
];

// BANNER & TEASER IMAGES FROM /full/
const BANNER_IMAGES = [
    'bikbanner.jpg', 'bikbanner2.jpg', 'backbikini.jpg', 'bikini.jpg', 'bikini3.jpg', 'bikini5.jpg'
];

const TEASER_IMAGES = [
    { img: 'bikini.jpg', title: 'Paradise Beach Ibiza', desc: 'Exclusive Mediterranean content', keywords: 'ibiza beach paradise' },
    { img: 'bikini3.jpg', title: 'Ocean Views Ibiza', desc: 'Spanish Mediterranean paradise', keywords: 'ibiza ocean views' },
    { img: 'bikini5.jpg', title: 'Sunset Ibiza Sessions', desc: 'Golden hour moments Spain', keywords: 'ibiza sunset' },
    { img: 'bikbanner.jpg', title: 'Beach Life Ibiza', desc: 'Living the Spanish dream', keywords: 'ibiza beach life' },
    { img: 'bikbanner2.jpg', title: 'Island Vibes Ibiza', desc: 'Balearic paradise', keywords: 'ibiza island' },
    { img: 'backbikini.jpg', title: 'Summer Days Ibiza', desc: 'Endless Spanish sunshine', keywords: 'ibiza summer' }
];

// ============================
// SEO-ENHANCED STATE MANAGEMENT
// ============================

let state = {
    currentLanguage: 'es',
    isVIP: false,
    unlockedContent: new Set(),
    packCredits: 0,
    selectedPack: 'silver',
    selectedSubscriptionType: 'lifetime',
    currentSlide: 0,
    currentTeaserSlide: 0,
    dailyContent: null,
    lazyLoadObserver: null,
    currentPayPalContentId: null,
    currentPayPalContentType: null,
    
    // SEO tracking state
    seoMetrics: {
        pageStartTime: Date.now(),
        contentInteractions: 0,
        keywordTriggers: 0,
        scrollDepth: 0,
        userIntent: 'browse' // browse, purchase, explore
    }
};

// ============================
// TEASER CAROUSEL FUNCTIONS
// ============================

function initializeTeaserCarousel() {
    const carousel = document.getElementById('teaserCarousel');
    
    if (!carousel) return;
    
    // Create SEO-optimized teaser items
    let teaserHTML = '';
    TEASER_IMAGES.forEach((item, index) => {
        const trans = TRANSLATIONS[state.currentLanguage];
        const seoAltText = `${item.title} - ${item.desc} - Galería premium Ibiza`;
        
        teaserHTML += `
            <article class="teaser-item" 
                     onclick="showVIPModal()"
                     itemscope itemtype="https://schema.org/ImageObject"
                     data-keywords="${item.keywords}">
                <img src="public/assets/full/${item.img}" 
                     alt="${seoAltText}"
                     title="${item.title} - ${trans.seo_keywords?.primary}"
                     itemprop="contentUrl"
                     loading="lazy"
                     width="250"
                     height="350">
                     
                <meta itemprop="name" content="${item.title}">
                <meta itemprop="description" content="${item.desc}">
                <meta itemprop="keywords" content="${item.keywords}">
                
                <div class="teaser-overlay">
                    <div class="teaser-info">
                        <h3>${item.title}</h3>
                        <p>${item.desc}</p>
                    </div>
                </div>
            </article>
        `;
    });
    carousel.innerHTML = teaserHTML;
    
    // Track teaser carousel view for SEO
    SEO_ANALYTICS.trackContentEngagement('teaser', 'carousel', 'initialized');
}

function scrollCarousel(direction) {
    const carousel = document.getElementById('teaserCarousel');
    if (!carousel) return;
    
    const scrollAmount = 270; // width of teaser item + gap
    carousel.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
    
    // Track carousel interaction for SEO
    SEO_ANALYTICS.trackContentEngagement('teaser', 'carousel', direction > 0 ? 'scroll_right' : 'scroll_left');
}

// ============================
// SEO-ENHANCED LANGUAGE SYSTEM
// ============================

function changeLanguage(lang) {
    if (!TRANSLATIONS[lang]) return;
    
    const previousLang = state.currentLanguage;
    state.currentLanguage = lang;
    localStorage.setItem('ibiza_language', lang);
    
    // Update page language attribute for SEO
    document.documentElement.lang = lang === 'es' ? 'es-ES' : 'en-US';
    
    // Update meta tags for SEO
    updateSEOMetaTags(lang);
    
    // Update text content
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (TRANSLATIONS[lang][key]) {
            element.textContent = TRANSLATIONS[lang][key];
        }
    });
    
    // Update Isabella bot messages
    if (window.isabellaBot) {
        isabellaBot.messages = TRANSLATIONS[lang].isabella_messages;
    }
    
    // Re-render content with new language keywords
    if (state.dailyContent) {
        renderPhotosProgressive();
        renderVideosProgressive();
    }
    
    // Inject updated structured data
    injectStructuredData();
    
    // Track language change for SEO analytics
    trackEvent('language_changed', { 
        from_language: previousLang,
        to_language: lang,
        user_preference: 'manual'
    });
    
    // Track SEO keywords for new language
    const newKeywords = TRANSLATIONS[lang].seo_keywords?.primary;
    SEO_ANALYTICS.trackKeywordInteraction(newKeywords, 'language_change');
}

function updateSEOMetaTags(lang) {
    const trans = TRANSLATIONS[lang];
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && trans.meta_description) {
        metaDesc.content = trans.meta_description;
    }
    
    // Update Open Graph title and description
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    
    if (ogTitle && trans.photos_seo_title) {
        ogTitle.content = trans.photos_seo_title;
    }
    
    if (ogDesc && trans.meta_description) {
        ogDesc.content = trans.meta_description;
    }
    
    // Update page title
    if (trans.photos_seo_title) {
        document.title = trans.photos_seo_title;
    }
}

// ============================
// DAILY ROTATION SYSTEM
// ============================

function getDailyRotation() {
    const today = new Date();
    const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    
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
    
    const shuffledPhotos = shuffleWithSeed(ALL_PHOTOS_POOL, dateSeed);
    const shuffledVideos = shuffleWithSeed(ALL_VIDEOS_POOL, dateSeed * 2);
    const shuffledBanners = shuffleWithSeed(BANNER_IMAGES, dateSeed * 3);
    
    const todayPhotos = shuffledPhotos.slice(0, CONFIG.CONTENT.DAILY_PHOTOS);
    const todayVideos = shuffledVideos.slice(0, CONFIG.CONTENT.DAILY_VIDEOS);
    
    const newPhotoCount = Math.floor(CONFIG.CONTENT.DAILY_PHOTOS * CONFIG.CONTENT.NEW_CONTENT_PERCENTAGE);
    const newVideoCount = Math.floor(CONFIG.CONTENT.DAILY_VIDEOS * CONFIG.CONTENT.NEW_CONTENT_PERCENTAGE);
    
    return {
        photos: todayPhotos,
        videos: todayVideos,
        banners: shuffledBanners,
        newPhotoIndices: new Set(Array.from({length: newPhotoCount}, (_, i) => i)),
        newVideoIndices: new Set(Array.from({length: newVideoCount}, (_, i) => i)),
        lastUpdate: new Date()
    };
}

// ============================
// LAZY LOADING SYSTEM
// ============================

function setupLazyLoading() {
    const options = {
        root: null,
        rootMargin: '100px',
        threshold: 0.01
    };

    state.lazyLoadObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const item = entry.target;
                const media = item.querySelector('.item-media');
                
                if (media && media.dataset.src) {
                    if (media.tagName === 'IMG') {
                        media.src = media.dataset.src;
                        media.onload = () => {
                            item.classList.remove('skeleton');
                        };
                    } else if (media.tagName === 'VIDEO') {
                        const source = media.querySelector('source');
                        if (source && source.dataset.src) {
                            source.src = source.dataset.src;
                            media.load();
                            item.classList.remove('skeleton');
                        }
                    }
                    
                    delete media.dataset.src;
                    observer.unobserve(item);
                }
            }
        });
    }, options);
}

// ============================
// SEO-ENHANCED RENDER FUNCTIONS
// ============================

function renderPhotosProgressive() {
    const photosGrid = document.getElementById('photosGrid');
    if (!photosGrid) return;
    
    const photosToShow = state.dailyContent.photos;
    const trans = TRANSLATIONS[state.currentLanguage];
    let photosHTML = '';
    
    photosToShow.forEach((photo, index) => {
        const id = `p${index}`;
        const isUnlocked = state.isVIP || state.unlockedContent.has(id);
        const unlockClass = isUnlocked ? 'unlocked' : '';
        const isNew = state.dailyContent.newPhotoIndices.has(index);
        const views = Math.floor(Math.random() * 15000) + 5000;
        
        // SEO-optimized alt text with keywords
        const seoAltText = `Foto premium de Ibiza #${index + 1} - Galería mediterránea exclusiva - ${photo}`;
        const seoTitle = `${trans.seo_keywords?.primary} - Imagen ${index + 1}`;
        
        photosHTML += `
            <article class="content-item skeleton ${unlockClass}" 
                     data-id="${id}" 
                     data-type="photo" 
                     data-keywords="${trans.seo_keywords?.primary}"
                     itemscope itemtype="https://schema.org/ImageObject"
                     onclick="handlePhotoClick('${id}', '${photo}', ${index})">
                     
                ${isNew ? `<span class="new-badge">${trans.new_today}</span>` : ''}
                
                <img class="item-media" 
                     data-src="public/assets/uncensored/${photo}" 
                     alt="${seoAltText}"
                     title="${seoTitle}"
                     itemprop="contentUrl"
                     style="filter: ${isUnlocked ? 'none' : `blur(${CONFIG.CONTENT.BLUR_PHOTO}px)`};"
                     loading="lazy">
                
                <meta itemprop="name" content="Foto Ibiza Premium #${index + 1}">
                <meta itemprop="description" content="Imagen exclusiva de Ibiza - Galería mediterránea premium">
                <meta itemprop="keywords" content="${trans.seo_keywords?.primary}">
                
                ${!isUnlocked ? `
                    <div class="lock-overlay">
                        <svg class="lock-icon" width="30" height="30" viewBox="0 0 24 24" fill="white" aria-label="Contenido bloqueado">
                            <path d="M12 2C9.243 2 7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7z"/>
                        </svg>
                    </div>
                    
                    <div class="item-price" role="button" aria-label="Precio para desbloquear">
                        €${CONFIG.PAYPAL.PRICES.SINGLE_PHOTO.toFixed(2)}
                    </div>
                ` : ''}
                
                <div class="item-overlay">
                    <h3 class="item-title">Paradise Ibiza #${index + 1}</h3>
                    <div class="item-info">${views.toLocaleString()} vistas</div>
                </div>
            </article>
        `;
    });
    
    photosGrid.innerHTML = photosHTML;
    
    // Setup lazy loading with SEO benefits
    document.querySelectorAll('#photosGrid .content-item').forEach(item => {
        if (state.lazyLoadObserver) {
            state.lazyLoadObserver.observe(item);
        }
    });
    
    // Track content render for SEO
    SEO_ANALYTICS.trackContentEngagement('photos', 'gallery_render', 'photos_loaded');
}

function renderVideosProgressive() {
    const videosGrid = document.getElementById('videosGrid');
    if (!videosGrid) return;
    
    const videosToShow = state.dailyContent.videos;
    const trans = TRANSLATIONS[state.currentLanguage];
    let videosHTML = '';
    
    videosToShow.forEach((video, index) => {
        const id = `v${index}`;
        const isUnlocked = state.isVIP || state.unlockedContent.has(id);
        const unlockClass = isUnlocked ? 'unlocked' : '';
        const duration = `${Math.floor(Math.random() * 15) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
        const isNew = state.dailyContent.newVideoIndices.has(index);
        const views = Math.floor(Math.random() * 25000) + 8000;
        const posterImage = BANNER_IMAGES[index % BANNER_IMAGES.length];
        
        // SEO-optimized video metadata
        const seoAltText = `Video HD de Ibiza #${index + 1} - Contenido exclusivo mediterráneo - ${video}`;
        const seoTitle = `${trans.seo_keywords?.secondary} - Video ${index + 1}`;
        
        videosHTML += `
            <article class="content-item skeleton ${unlockClass}" 
                     data-id="${id}" 
                     data-type="video" 
                     data-keywords="${trans.seo_keywords?.secondary}"
                     itemscope itemtype="https://schema.org/VideoObject"
                     onclick="handleVideoClick('${id}', '${video}', ${index})">
                     
                ${isNew ? `<span class="new-badge">${trans.fresh_content}</span>` : ''}
                
                <video class="item-media" 
                       muted 
                       loop 
                       playsinline
                       preload="none"
                       poster="public/assets/full/${posterImage}"
                       style="filter: ${isUnlocked ? 'none' : `blur(${CONFIG.CONTENT.BLUR_VIDEO}px)`};"
                       data-video-id="${id}"
                       aria-label="${seoAltText}">
                    <source data-src="public/assets/uncensored-videos/${video}" type="video/mp4">
                </video>
                
                <meta itemprop="name" content="Video Ibiza HD #${index + 1}">
                <meta itemprop="description" content="Video exclusivo de Ibiza - Contenido mediterráneo premium">
                <meta itemprop="duration" content="PT${duration.replace(':', 'M')}S">
                <meta itemprop="keywords" content="${trans.seo_keywords?.secondary}">
                
                <div class="video-duration" aria-label="Duración del video">${duration}</div>
                
                <div class="video-play-overlay" aria-label="Reproducir video">
                    <div class="play-button">
                        <div class="play-icon" aria-hidden="true"></div>
                    </div>
                </div>
                
                ${!isUnlocked ? `
                    <div class="lock-overlay">
                        <svg class="lock-icon" width="30" height="30" viewBox="0 0 24 24" fill="white" aria-label="Contenido bloqueado">
                            <path d="M12 2C9.243 2 7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7z"/>
                        </svg>
                    </div>
                    
                    <div class="item-price" role="button" aria-label="Precio para desbloquear">
                        €${CONFIG.PAYPAL.PRICES.SINGLE_VIDEO.toFixed(2)}
                    </div>
                ` : ''}
                
                <div class="item-overlay">
                    <h3 class="item-title">Video Ibiza #${index + 1}</h3>
                    <div class="item-info">${views.toLocaleString()} vistas</div>
                </div>
            </article>
        `;
    });
    
    videosGrid.innerHTML = videosHTML;
    
    // Setup lazy loading and video hover
    document.querySelectorAll('#videosGrid .content-item').forEach(item => {
        if (state.lazyLoadObserver) {
            state.lazyLoadObserver.observe(item);
        }
    });
    
    setupVideoHoverPreview();
    
    // Track content render for SEO
    SEO_ANALYTICS.trackContentEngagement('videos', 'gallery_render', 'videos_loaded');
}

// ============================
// SEO-ENHANCED EVENT HANDLERS
// ============================

function handlePhotoClick(id, filename, index) {
    // Track keyword interaction
    const keywords = TRANSLATIONS[state.currentLanguage].seo_keywords?.primary;
    SEO_ANALYTICS.trackKeywordInteraction(keywords, 'photo_click');
    
    // Track content engagement
    SEO_ANALYTICS.trackContentEngagement('photo', id, 'click');
    
    // Update user intent
    state.seoMetrics.userIntent = state.isVIP ? 'view' : 'purchase';
    state.seoMetrics.contentInteractions++;
    
    trackEvent('photo_click', { 
        photo_id: id, 
        photo_index: index,
        keywords: keywords,
        user_intent: state.seoMetrics.userIntent
    });
    
    if (state.isVIP || state.unlockedContent.has(id)) {
        window.open(`public/assets/uncensored/${filename}`, '_blank');
        trackEvent('photo_view', { photo_id: id, photo_index: index });
    } else if (state.packCredits > 0) {
        usePackCredit(id, 'photo');
    } else {
        showPayPerViewModal(id, 'photo', `Paradise Photo #${index + 1}`, CONFIG.PAYPAL.PRICES.SINGLE_PHOTO);
    }
}

function handleVideoClick(id, filename, index) {
    // Track keyword interaction
    const keywords = TRANSLATIONS[state.currentLanguage].seo_keywords?.secondary;
    SEO_ANALYTICS.trackKeywordInteraction(keywords, 'video_click');
    
    // Track content engagement
    SEO_ANALYTICS.trackContentEngagement('video', id, 'click');
    
    // Update user intent
    state.seoMetrics.userIntent = state.isVIP ? 'view' : 'purchase';
    state.seoMetrics.contentInteractions++;
    
    trackEvent('video_click', { 
        video_id: id, 
        video_index: index,
        keywords: keywords,
        user_intent: state.seoMetrics.userIntent
    });
    
    if (state.isVIP || state.unlockedContent.has(id)) {
        window.open(`public/assets/uncensored-videos/${filename}`, '_blank');
        trackEvent('video_view', { video_id: id, video_index: index });
    } else if (state.packCredits > 0) {
        usePackCredit(id, 'video');
    } else {
        showPayPerViewModal(id, 'video', `Paradise Video #${index + 1}`, CONFIG.PAYPAL.PRICES.SINGLE_VIDEO);
    }
}

function setupVideoHoverPreview() {
    const videos = document.querySelectorAll('.content-item[data-type="video"]');
    
    videos.forEach(item => {
        const video = item.querySelector('video');
        if (!video) return;
        
        item.addEventListener('mouseenter', () => {
            if (state.isVIP || state.unlockedContent.has(item.dataset.id)) {
                video.play().catch(() => {});
            }
        });
        
        item.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
    });
}

// ============================
// PAYPAL INTEGRATION
// ============================

function renderPayPalVIPButtons() {
    const container = document.getElementById('paypal-button-container-vip');
    if (!container || !window.paypal) return;
    
    container.innerHTML = '';
    
    const price = state.selectedSubscriptionType === 'monthly' 
        ? CONFIG.PAYPAL.PRICES.MONTHLY_SUBSCRIPTION 
        : CONFIG.PAYPAL.PRICES.LIFETIME_SUBSCRIPTION;
    
    paypal.Buttons({
        createOrder: function(data, actions) {
            trackEvent('paypal_checkout_started', { 
                type: 'vip', 
                plan: state.selectedSubscriptionType,
                price: price 
            });
            
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: price.toFixed(2),
                        currency_code: CONFIG.PAYPAL.CURRENCY
                    },
                    description: `IbizaGirl VIP ${state.selectedSubscriptionType === 'monthly' ? 'Monthly' : 'Lifetime'} Access`
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                console.log('Transaction completed by ' + details.payer.name.given_name);
                activateVIP(state.selectedSubscriptionType);
                trackEvent('purchase_complete', {
                    type: 'vip',
                    plan: state.selectedSubscriptionType,
                    price: price,
                    order_id: data.orderID
                });
                const trans = TRANSLATIONS[state.currentLanguage];
                showNotification(trans.notification_welcome);
                celebrateUnlock();
                closeModal();
            });
        },
        onError: function(err) {
            console.error('PayPal Error:', err);
            const trans = TRANSLATIONS[state.currentLanguage];
            showNotification(trans.payment_error);
            trackEvent('payment_error', { type: 'vip', error: err.toString() });
        },
        onCancel: function(data) {
            trackEvent('payment_cancelled', { type: 'vip' });
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
            trackEvent('paypal_checkout_started', { 
                type: 'pack', 
                pack: packType,
                price: pack.price 
            });
            
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: pack.price.toFixed(2),
                        currency_code: CONFIG.PAYPAL.CURRENCY
                    },
                    description: `IbizaGirl ${packType} Pack - ${pack.items} items`
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                console.log('Transaction completed by ' + details.payer.name.given_name);
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
            console.error('PayPal Error:', err);
            const trans = TRANSLATIONS[state.currentLanguage];
            showNotification(trans.payment_error);
            trackEvent('payment_error', { type: 'pack', error: err.toString() });
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
            trackEvent('paypal_checkout_started', { 
                type: 'ppv', 
                content_type: contentType,
                content_id: contentId,
                price: price 
            });
            
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: price.toFixed(2),
                        currency_code: CONFIG.PAYPAL.CURRENCY
                    },
                    description: `Unlock ${contentTitle}`
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                console.log('Transaction completed by ' + details.payer.name.given_name);
                unlockSingleContent(contentId);
                trackEvent('purchase_complete', {
                    type: 'ppv',
                    content_type: contentType,
                    content_id: contentId,
                    price: price,
                    order_id: data.orderID
                });
                showNotification(`🔓 ${contentTitle} unlocked!`);
                celebrateUnlock();
                closeModal();
            });
        },
        onError: function(err) {
            console.error('PayPal Error:', err);
            const trans = TRANSLATIONS[state.currentLanguage];
            showNotification(trans.payment_error);
            trackEvent('payment_error', { type: 'ppv', error: err.toString() });
        },
        onCancel: function(data) {
            trackEvent('payment_cancelled', { type: 'ppv' });
        }
    }).render('#paypal-button-container-ppv');
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
        
        // Track SEO intent
        state.seoMetrics.userIntent = 'purchase';
        SEO_ANALYTICS.trackSearchIntent('vip_subscription', 'modal_click');
    }
}

function showPackModal() {
    const modal = document.getElementById('packModal');
    if (modal) {
        modal.classList.add('active');
        renderPayPalPackButton(state.selectedPack);
        trackEvent('modal_open', { modal_type: 'pack_selection' });
        
        // Track SEO intent
        state.seoMetrics.userIntent = 'purchase';
        SEO_ANALYTICS.trackSearchIntent('pack_purchase', 'modal_click');
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
    trackEvent('modal_open', { modal_type: 'pay_per_view', content_type: contentType });
    
    // Track SEO intent
    state.seoMetrics.userIntent = 'purchase';
    SEO_ANALYTICS.trackSearchIntent('individual_content', 'ppv_modal');
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
    
    event.currentTarget.classList.add('selected');
    renderPayPalVIPButtons();
    
    trackEvent('plan_selected', { plan_type: type });
}

function selectPack(packType) {
    state.selectedPack = packType;
    
    document.querySelectorAll('.pack-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    event.currentTarget.classList.add('selected');
    renderPayPalPackButton(packType);
    
    trackEvent('pack_selected', { pack_type: packType });
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
    isabellaBot.addMessage(trans.notification_welcome);
    
    // Track VIP conversion for SEO
    SEO_ANALYTICS.trackSearchIntent('conversion', 'vip_activated');
}

function unlockAllContent() {
    document.querySelectorAll('.content-item').forEach(item => {
        item.classList.add('unlocked');
        const media = item.querySelector('.item-media');
        if (media) {
            media.style.filter = 'none';
        }
    });
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
}

function addPackCredits(credits) {
    state.packCredits += credits;
    localStorage.setItem('ibiza_pack_credits', state.packCredits);
    updateCreditsDisplay();
}

function usePackCredit(contentId, contentType) {
    if (state.packCredits > 0) {
        state.packCredits--;
        unlockSingleContent(contentId);
        
        localStorage.setItem('ibiza_pack_credits', state.packCredits);
        
        const trans = TRANSLATIONS[state.currentLanguage];
        const icon = contentType === 'video' ? '🎬' : '📸';
        const message = trans.notification_unlocked
            .replace('{icon}', icon)
            .replace('{credits}', state.packCredits);
        
        showNotification(message);
        celebrateUnlock();
        updateCreditsDisplay();
        
        trackEvent('pack_credit_used', { 
            content_id: contentId, 
            content_type: contentType, 
            credits_remaining: state.packCredits 
        });
    }
}

function updateCreditsDisplay() {
    const creditsNumber = document.getElementById('creditsNumber');
    const creditsDisplay = document.getElementById('creditsDisplay');
    
    if (creditsNumber) {
        creditsNumber.textContent = state.packCredits;
    }
    
    if (creditsDisplay) {
        if (state.packCredits > 0) {
            creditsDisplay.classList.add('active');
        } else {
            creditsDisplay.classList.remove('active');
        }
    }
}

// ============================
// ISABELLA CHAT BOT
// ============================

const isabellaBot = {
    messages: [],
    
    init() {
        this.messages = TRANSLATIONS[state.currentLanguage].isabella_messages;
        
        setTimeout(() => {
            this.showNotification();
            this.addMessage(this.messages[0]);
            
            setTimeout(() => {
                this.addMessage(this.messages[1]);
            }, 2000);
        }, 5000);
        
        setInterval(() => {
            const window = document.getElementById('isabellaWindow');
            if (window && !window.classList.contains('active')) {
                this.showNotification();
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
            setTimeout(() => {
                notification.style.display = 'none';
            }, 10000);
        }
    }
};

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
    }
    
    trackEvent('isabella_action', { action: action });
}

// ============================
// SEO STRUCTURED DATA INJECTION
// ============================

function injectStructuredData() {
    const trans = TRANSLATIONS[state.currentLanguage];
    
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        "name": CONFIG.SEO.SITE_NAME,
        "description": trans.meta_description,
        "url": window.location.href,
        "mainEntity": {
            "@type": "WebPage",
            "name": trans.photos_seo_title,
            "description": trans.gallery_description,
            "primaryImageOfPage": {
                "@type": "ImageObject",
                "url": "https://ibizagirl.pics/public/assets/full/bikini.jpg",
                "caption": trans.seo_keywords?.primary
            }
        },
        "contentLocation": {
            "@type": "Place",
            "name": CONFIG.SEO.PRIMARY_LOCATION,
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": "38.9067",
                "longitude": "1.4206"
            }
        },
        "dateModified": new Date().toISOString(),
        "inLanguage": state.currentLanguage === 'es' ? 'es-ES' : 'en-US',
        "keywords": trans.seo_keywords?.primary,
        "author": {
            "@type": "Organization",
            "name": CONFIG.SEO.SITE_NAME
        }
    };
    
    // Inject or update structured data
    let scriptTag = document.getElementById('dynamic-structured-data');
    if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.type = 'application/ld+json';
        scriptTag.id = 'dynamic-structured-data';
        document.head.appendChild(scriptTag);
    }
    
    scriptTag.textContent = JSON.stringify(structuredData);
}

// ============================
// UTILITY FUNCTIONS
// ============================

function loadSavedState() {
    const vipData = localStorage.getItem('ibiza_vip');
    if (vipData) {
        try {
            const data = JSON.parse(vipData);
            if (data.active) {
                state.isVIP = true;
                setTimeout(() => unlockAllContent(), 500);
            }
        } catch (e) {
            console.error('Error loading VIP data:', e);
        }
    }
    
    const savedCredits = localStorage.getItem('ibiza_pack_credits');
    if (savedCredits) {
        state.packCredits = parseInt(savedCredits);
        updateCreditsDisplay();
    }
    
    const unlockedData = localStorage.getItem('ibiza_unlocked');
    if (unlockedData) {
        try {
            const parsed = JSON.parse(unlockedData);
            if (Array.isArray(parsed)) {
                state.unlockedContent = new Set(parsed);
                setTimeout(() => {
                    state.unlockedContent.forEach(id => unlockSingleContent(id));
                }, 500);
            }
        } catch (e) {
            console.error('Error loading unlocked content:', e);
        }
    }
}

function saveUnlockedContent() {
    localStorage.setItem('ibiza_unlocked', JSON.stringify([...state.unlockedContent]));
}

function celebrateUnlock() {
    if (typeof confetti !== 'undefined') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00d4ff', '#ff69b4', '#ffd700', '#00ff88', '#7fdbff']
        });
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

function startBannerSlideshow() {
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
    }
}

function initializeViewCounter() {
    setInterval(() => {
        const views = document.getElementById('totalViews');
        if (views) {
            const current = parseFloat(views.textContent.replace('M', ''));
            const newViews = (current + 0.001).toFixed(1);
            views.textContent = `${newViews}M`;
        }
    }, 30000);
}

function trackEvent(eventName, parameters = {}) {
    // Enhanced parameters with SEO data
    const enhancedParams = {
        'event_category': 'engagement',
        'page_language': state.currentLanguage,
        'user_intent': state.seoMetrics.userIntent,
        'content_interactions': state.seoMetrics.contentInteractions,
        'session_time': Date.now() - state.seoMetrics.pageStartTime,
        'page_type': 'gallery',
        'site_section': 'main',
        ...parameters
    };
    
    if (window.gtag) {
        window.gtag('event', eventName, enhancedParams);
    }
    
    console.log(`📊 Event: ${eventName}`, enhancedParams);
}

function setupScrollEffects() {
    const header = document.getElementById('mainHeader');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Track scroll depth for SEO
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        state.seoMetrics.scrollDepth = Math.max(state.seoMetrics.scrollDepth, scrollPercent);
    });
}

// ============================
// ADS INITIALIZATION
// ============================

function initializeAds() {
    console.log('📢 Initializing advertisement spaces...');
    
    // Check for ad blockers and tracking protection
    const hasAdBlocker = window.navigator.doNotTrack === "1" || 
                        window.doNotTrack === "1" ||
                        typeof window.adsbygoogle === 'undefined';
    
    if (hasAdBlocker) {
        console.warn('⚠️ Ad blocker or tracking protection detected');
        document.querySelectorAll('.ad-placeholder').forEach(el => {
            el.textContent = 'Ads blocked by browser protection';
            el.style.fontSize = '0.8rem';
            el.style.opacity = '0.5';
        });
        return;
    }
    
    // Initialize ad spaces with placeholder content
    const adSpaces = [
        { id: 'ad-header', type: 'header', size: '728x90' },
        { id: 'ad-middle', type: 'middle', size: '728x90' },
        { id: 'ad-footer', type: 'footer', size: '728x90' }
    ];
    
    adSpaces.forEach(ad => {
        const container = document.getElementById(ad.id);
        if (container) {
            // Add a colorful placeholder that looks like a real ad
            container.innerHTML = `
                <div style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 20px;
                    border-radius: 10px;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                ">
                    <div style="font-size: 1.2rem; font-weight: bold; margin-bottom: 10px;">
                        🌊 Premium Paradise Content
                    </div>
                    <div style="font-size: 0.9rem; opacity: 0.9;">
                        Exclusive Mediterranean Gallery • Daily Updates • VIP Access
                    </div>
                    <div style="
                        position: absolute;
                        top: 5px;
                        right: 10px;
                        font-size: 0.7rem;
                        opacity: 0.6;
                    ">
                        Sponsored
                    </div>
                </div>
            `;
            
            // Track ad view
            trackEvent('ad_view', { 
                ad_id: ad.id, 
                ad_type: ad.type,
                ad_size: ad.size 
            });
        }
    });
    
    console.log('✅ Advertisement spaces initialized');
}

// ============================
// INITIALIZATION WITH SEO ENHANCEMENTS
// ============================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Initializing SEO-Optimized Paradise Gallery...');
    
    // Initialize SEO tracking
    SEO_ANALYTICS.trackPageDepth();
    
    // Load saved language with SEO considerations
    const savedLang = localStorage.getItem('ibiza_language') || 'es';
    state.currentLanguage = savedLang;
    
    const langSelect = document.getElementById('languageSelect');
    if (langSelect) langSelect.value = savedLang;
    
    changeLanguage(savedLang);
    
    // Inject structured data
    injectStructuredData();
    
    // Initialize components
    initializeTeaserCarousel();
    
    // Get today's content
    state.dailyContent = getDailyRotation();
    console.log(`📅 Today's rotation: ${state.dailyContent.photos.length} photos, ${state.dailyContent.videos.length} videos`);
    
    // Setup lazy loading
    setupLazyLoading();
    
    // Load saved state
    loadSavedState();
    
    // Initialize Isabella bot
    isabellaBot.init();
    
    // Initialize ads
    initializeAds();
    
    // Render content
    renderPhotosProgressive();
    renderVideosProgressive();
    
    // Start animations
    startBannerSlideshow();
    
    // Initialize counters
    initializeViewCounter();
    updateLastUpdateTime();
    
    // Setup scroll effects
    setupScrollEffects();
    
    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 1500);
    
    // Track initial page view with SEO data
    trackEvent('page_view', { 
        page: 'main_gallery', 
        language: state.currentLanguage,
        content_type: 'image_gallery',
        total_photos: state.dailyContent.photos.length,
        total_videos: state.dailyContent.videos.length,
        primary_keywords: TRANSLATIONS[state.currentLanguage].seo_keywords?.primary
    });
    
    console.log('✅ SEO-Optimized Gallery loaded successfully!');
    console.log('🌍 Language:', state.currentLanguage);
    console.log('🔍 SEO Keywords:', TRANSLATIONS[state.currentLanguage].seo_keywords?.primary);
    console.log('📊 Analytics:', CONFIG.ANALYTICS_ID);
    console.log('💳 PayPal: Ready');
    console.log('🌊 Version: 17.0.0 SEO Optimized Complete');
});

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
window.isabellaBot = isabellaBot;

// ============================
// END OF SEO OPTIMIZED COMPLETE SCRIPT
// ============================
