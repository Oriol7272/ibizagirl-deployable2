// ============================
// IBIZAGIRL.PICS MAIN SCRIPT v13.1.1 FIXED
// Rotación diaria: 200 fotos + 40 videos del pool total
// Ads mejoradas para producción
// ============================

console.log('🌊 IbizaGirl.pics v13.1.1 Fixed - Loading Paradise Gallery...');

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
console.log('🔌 Port:', window.location.port);

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
        notification_pack: "🎉 ¡{credits} créditos añadidos! Haz clic en cualquier contenido para desbloquearlo.",
        notification_unlocked: "{icon} Desbloqueado! {credits} créditos restantes.",
        payment_error: "❌ Error en el pago. Por favor, intenta de nuevo.",
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
    },
    de: {
        loading: "Paradies wird geladen...",
        subtitle: "Exklusiver Paradies-Inhalt",
        megapack: "📦 MEGA PACKS -70%",
        monthly: "💳 €15/Monat",
        lifetime: "👑 Lebenslang €100",
        welcome: "Willkommen im Paradies 🌴",
        daily_content: "400+ Fotos und 80+ Videos TÄGLICH aktualisiert",
        unlock_all: "🔓 Alles freischalten",
        view_gallery: "📸 Galerie anzeigen",
        photos_today: "Heutige Fotos",
        updated_at: "Aktualisiert um",
        videos_hd: "HD Videos",
        new_content: "NEUER INHALT!",
        total_views: "Gesamtaufrufe",
        today: "heute",
        updates: "Updates",
        always_fresh: "IMMER FRISCH",
        paradise_photos: "📸 Paradies Fotos",
        new_today: "NEU HEUTE!",
        exclusive_videos: "🎬 Exklusive Videos",
        fresh_content: "FRISCHER INHALT!",
        isabella_title: "Isabella - Dein VIP Guide",
        vip_info: "💎 VIP Info",
        news: "📅 Neuigkeiten",
        help: "❓ Hilfe",
        footer_desc: "Dein tägliches Ziel für exklusive mediterrane Paradiesinhalte. 24/7 aktualisiert mit den besten Fotos und Videos.",
        quick_links: "Schnelllinks",
        photos: "Fotos",
        videos: "Videos",
        vip_subscription: "VIP-Abonnement",
        mega_packs: "Mega Packs",
        support: "Support",
        terms: "Nutzungsbedingungen",
        privacy: "Datenschutz",
        contact: "Kontakt",
        copyright: "© 2025 IbizaGirl.pics - Alle Rechte vorbehalten | 18+ Nur für Erwachsene",
        vip_unlimited: "👑 Unbegrenzter VIP-Zugang",
        pack_selection: "📦 MEGA PACKS - Spare 70%",
        unlock_content: "🔓 Inhalt freischalten",
        plan_monthly: "📅 Monatlich",
        plan_lifetime: "♾️ Lebenslang",
        best_value: "BESTER WERT",
        save_yearly: "Spare €80 pro Jahr!",
        pack_starter: "Starter Paket",
        pack_bronze: "Bronze Paket",
        pack_silver: "Silber Paket",
        pack_gold: "Gold Paket",
        items: "Inhalte",
        save: "Spare",
        unlimited_access: "Unbegrenzter Zugang",
        hd_videos: "400+ HD Fotos",
        daily_updates: "80+ HD Videos",
        no_ads: "Keine Werbung",
        all_content: "Alle aktuellen und zukünftigen Inhalte",
        priority_support: "Prioritäts-Support",
        exclusive_content: "Exklusiver VIP Inhalt",
        notification_welcome: "🎉 Willkommen VIP! Alle Inhalte wurden freigeschaltet.",
        notification_pack: "🎉 {credits} Credits hinzugefügt! Klicke auf Inhalte zum Freischalten.",
        notification_unlocked: "{icon} Freigeschaltet! {credits} Credits übrig.",
        payment_error: "❌ Zahlungsfehler. Bitte versuche es erneut.",
        isabella_messages: [
            "Hallo Schöne! 😘 Suchst du das Paradies?",
            "Pssst... VIP-Mitglieder sehen alles ohne Unschärfe! 👀",
            "Bereit, das Paradies freizuschalten? VIP gibt dir sofortigen Zugang zu allem! 🌊",
            "Heute haben wir 400 neue Fotos und 80 neue Videos! 🎉",
            "Klicke einfach auf verschwommene Inhalte, um sie freizuschalten! 💕",
            "Wusstest du, dass du mit Lifetime nie wieder zahlst? Das ist das beste Angebot! 💎",
            "Pakete lassen dich einzelne Inhalte freischalten, perfekt zum Ausprobieren! 📦",
            "Verpasse nicht die täglichen Updates um 3:00 Uhr! ⏰",
            "Der heutige Inhalt ist 🔥🔥🔥 Verpasse es nicht!",
            "Brauchst du Hilfe? Ich bin für dich da, Liebling! 💕"
        ]
    },
    it: {
        loading: "Caricamento del paradiso...",
        subtitle: "Contenuto Esclusivo del Paradiso",
        megapack: "📦 MEGA PACKS -70%",
        monthly: "💳 €15/Mese",
        lifetime: "👑 A vita €100",
        welcome: "Benvenuta in Paradiso 🌴",
        daily_content: "400+ foto e 80+ video aggiornati QUOTIDIANAMENTE",
        unlock_all: "🔓 Sblocca Tutto",
        view_gallery: "📸 Vedi Galleria",
        photos_today: "Foto di Oggi",
        updated_at: "Aggiornato alle",
        videos_hd: "Video HD",
        new_content: "NUOVO CONTENUTO!",
        total_views: "Visualizzazioni Totali",
        today: "oggi",
        updates: "Aggiornamenti",
        always_fresh: "SEMPRE FRESCO",
        paradise_photos: "📸 Foto del Paradiso",
        new_today: "NUOVO OGGI!",
        exclusive_videos: "🎬 Video Esclusivi",
        fresh_content: "CONTENUTO FRESCO!",
        isabella_title: "Isabella - La tua Guida VIP",
        vip_info: "💎 Info VIP",
        news: "📅 Novità",
        help: "❓ Aiuto",
        footer_desc: "La tua destinazione quotidiana per contenuti esclusivi del paradiso mediterraneo. Aggiornato 24/7 con le migliori foto e video.",
        quick_links: "Link Rapidi",
        photos: "Foto",
        videos: "Video",
        vip_subscription: "Abbonamento VIP",
        mega_packs: "Mega Pack",
        support: "Supporto",
        terms: "Termini di Servizio",
        privacy: "Privacy",
        contact: "Contatto",
        copyright: "© 2025 IbizaGirl.pics - Tutti i diritti riservati | 18+ Solo Adulti",
        vip_unlimited: "👑 Accesso VIP Illimitato",
        pack_selection: "📦 MEGA PACK - Risparmia il 70%",
        unlock_content: "🔓 Sblocca Contenuto",
        plan_monthly: "📅 Mensile",
        plan_lifetime: "♾️ A vita",
        best_value: "MIGLIOR VALORE",
        save_yearly: "Risparmia €80 all'anno!",
        pack_starter: "Pacchetto Starter",
        pack_bronze: "Pacchetto Bronze",
        pack_silver: "Pacchetto Silver",
        pack_gold: "Pacchetto Gold",
        items: "contenuti",
        save: "Risparmia",
        unlimited_access: "Accesso illimitato",
        hd_videos: "400+ foto HD",
        daily_updates: "80+ video HD",
        no_ads: "Senza pubblicità",
        all_content: "Tutti i contenuti attuali e futuri",
        priority_support: "Supporto prioritario",
        exclusive_content: "Contenuto esclusivo VIP",
        notification_welcome: "🎉 Benvenuto VIP! Tutti i contenuti sono stati sbloccati.",
        notification_pack: "🎉 {credits} crediti aggiunti! Clicca su qualsiasi contenuto per sbloccarlo.",
        notification_unlocked: "{icon} Sbloccato! {credits} crediti rimanenti.",
        payment_error: "❌ Errore di pagamento. Per favore riprova.",
        isabella_messages: [
            "Ciao bella! 😘 Cerchi il paradiso?",
            "Pssst... I membri VIP vedono tutto senza sfocatura! 👀",
            "Pronta a sbloccare il paradiso? VIP ti dà accesso immediato a tutto! 🌊",
            "Oggi abbiamo 400 nuove foto e 80 nuovi video! 🎉",
            "Clicca su qualsiasi contenuto sfocato per sbloccarlo! 💕",
            "Sapevi che con Lifetime non paghi mai più? È la migliore offerta! 💎",
            "I pacchetti ti permettono di sbloccare singoli contenuti, perfetti per provare! 📦",
            "Non perdere gli aggiornamenti quotidiani alle 3:00! ⏰",
            "Il contenuto di oggi è 🔥🔥🔥 Non perderlo!",
            "Hai bisogno di aiuto? Sono qui per te, cara! 💕"
        ]
    },
    fr: {
        loading: "Chargement du paradis...",
        subtitle: "Contenu Exclusif du Paradis",
        megapack: "📦 MEGA PACKS -70%",
        monthly: "💳 €15/Mois",
        lifetime: "👑 À vie €100",
        welcome: "Bienvenue au Paradis 🌴",
        daily_content: "400+ photos et 80+ vidéos mises à jour QUOTIDIENNEMENT",
        unlock_all: "🔓 Tout Débloquer",
        view_gallery: "📸 Voir la Galerie",
        photos_today: "Photos du Jour",
        updated_at: "Mis à jour à",
        videos_hd: "Vidéos HD",
        new_content: "NOUVEAU CONTENU!",
        total_views: "Vues Totales",
        today: "aujourd'hui",
        updates: "Mises à jour",
        always_fresh: "TOUJOURS FRAIS",
        paradise_photos: "📸 Photos du Paradis",
        new_today: "NOUVEAU AUJOURD'HUI!",
        exclusive_videos: "🎬 Vidéos Exclusives",
        fresh_content: "CONTENU FRAIS!",
        isabella_title: "Isabella - Votre Guide VIP",
        vip_info: "💎 Info VIP",
        news: "📅 Nouveautés",
        help: "❓ Aide",
        footer_desc: "Votre destination quotidienne pour du contenu exclusif du paradis méditerranéen. Mis à jour 24/7 avec les meilleures photos et vidéos.",
        quick_links: "Liens Rapides",
        photos: "Photos",
        videos: "Vidéos",
        vip_subscription: "Abonnement VIP",
        mega_packs: "Mega Packs",
        support: "Support",
        terms: "Conditions d'utilisation",
        privacy: "Confidentialité",
        contact: "Contact",
        copyright: "© 2025 IbizaGirl.pics - Tous droits réservés | 18+ Adultes uniquement",
        vip_unlimited: "👑 Accès VIP Illimité",
        pack_selection: "📦 MEGA PACKS - Économisez 70%",
        unlock_content: "🔓 Débloquer le Contenu",
        plan_monthly: "📅 Mensuel",
        plan_lifetime: "♾️ À vie",
        best_value: "MEILLEURE VALEUR",
        save_yearly: "Économisez €80 par an!",
        pack_starter: "Pack Débutant",
        pack_bronze: "Pack Bronze",
        pack_silver: "Pack Argent",
        pack_gold: "Pack Or",
        items: "contenus",
        save: "Économisez",
        unlimited_access: "Accès illimité",
        hd_videos: "400+ photos HD",
        daily_updates: "80+ vidéos HD",
        no_ads: "Sans publicité",
        all_content: "Tout le contenu actuel et futur",
        priority_support: "Support prioritaire",
        exclusive_content: "Contenu exclusif VIP",
        notification_welcome: "🎉 Bienvenue VIP! Tout le contenu a été débloqué.",
        notification_pack: "🎉 {credits} crédits ajoutés! Cliquez sur n'importe quel contenu pour le débloquer.",
        notification_unlocked: "{icon} Débloqué! {credits} crédits restants.",
        payment_error: "❌ Erreur de paiement. Veuillez réessayer.",
        isabella_messages: [
            "Salut belle! 😘 Tu cherches le paradis?",
            "Pssst... Les membres VIP voient tout sans flou! 👀",
            "Prête à débloquer le paradis? VIP te donne un accès instantané à tout! 🌊",
            "Aujourd'hui nous avons 400 nouvelles photos et 80 nouvelles vidéos! 🎉",
            "Clique simplement sur n'importe quel contenu flou pour le débloquer! 💕",
            "Savais-tu qu'avec Lifetime tu ne paies plus jamais? C'est la meilleure offre! 💎",
            "Les packs te permettent de débloquer du contenu individuel, parfait pour essayer! 📦",
            "Ne manque pas les mises à jour quotidiennes à 3h00! ⏰",
            "Le contenu d'aujourd'hui est 🔥🔥🔥 Ne le manque pas!",
            "Besoin d'aide? Je suis là pour toi, chérie! 💕"
        ]
    },
    ru: {
        loading: "Загрузка рая...",
        subtitle: "Эксклюзивный Райский Контент",
        megapack: "📦 МЕГА ПАКИ -70%",
        monthly: "💳 €15/Месяц",
        lifetime: "👑 Навсегда €100",
        welcome: "Добро пожаловать в Рай 🌴",
        daily_content: "400+ фото и 80+ видео обновляются ЕЖЕДНЕВНО",
        unlock_all: "🔓 Разблокировать Всё",
        view_gallery: "📸 Смотреть Галерею",
        photos_today: "Фото Сегодня",
        updated_at: "Обновлено в",
        videos_hd: "HD Видео",
        new_content: "НОВЫЙ КОНТЕНТ!",
        total_views: "Всего Просмотров",
        today: "сегодня",
        updates: "Обновления",
        always_fresh: "ВСЕГДА СВЕЖЕЕ",
        paradise_photos: "📸 Фото Рая",
        new_today: "НОВОЕ СЕГОДНЯ!",
        exclusive_videos: "🎬 Эксклюзивные Видео",
        fresh_content: "СВЕЖИЙ КОНТЕНТ!",
        isabella_title: "Изабелла - Твой VIP Гид",
        vip_info: "💎 VIP Инфо",
        news: "📅 Новости",
        help: "❓ Помощь",
        footer_desc: "Ваш ежедневный источник эксклюзивного контента средиземноморского рая. Обновляется 24/7 с лучшими фото и видео.",
        quick_links: "Быстрые Ссылки",
        photos: "Фото",
        videos: "Видео",
        vip_subscription: "VIP Подписка",
        mega_packs: "Мега Паки",
        support: "Поддержка",
        terms: "Условия использования",
        privacy: "Конфиденциальность",
        contact: "Контакт",
        copyright: "© 2025 IbizaGirl.pics - Все права защищены | 18+ Только для взрослых",
        vip_unlimited: "👑 Неограниченный VIP Доступ",
        pack_selection: "📦 МЕГА ПАКИ - Экономия 70%",
        unlock_content: "🔓 Разблокировать Контент",
        plan_monthly: "📅 Ежемесячно",
        plan_lifetime: "♾️ Навсегда",
        best_value: "ЛУЧШАЯ ЦЕНА",
        save_yearly: "Экономьте €80 в год!",
        pack_starter: "Стартовый Пакет",
        pack_bronze: "Бронзовый Пакет",
        pack_silver: "Серебряный Пакет",
        pack_gold: "Золотой Пакет",
        items: "контента",
        save: "Экономия",
        unlimited_access: "Неограниченный доступ",
        hd_videos: "400+ HD фото",
        daily_updates: "80+ HD видео",
        no_ads: "Без рекламы",
        all_content: "Весь текущий и будущий контент",
        priority_support: "Приоритетная поддержка",
        exclusive_content: "Эксклюзивный VIP контент",
        notification_welcome: "🎉 Добро пожаловать VIP! Весь контент разблокирован.",
        notification_pack: "🎉 {credits} кредитов добавлено! Нажмите на любой контент для разблокировки.",
        notification_unlocked: "{icon} Разблокировано! {credits} кредитов осталось.",
        payment_error: "❌ Ошибка оплаты. Пожалуйста, попробуйте снова.",
        isabella_messages: [
            "Привет красавица! 😘 Ищешь рай?",
            "Пссст... VIP участники видят всё без размытия! 👀",
            "Готова разблокировать рай? VIP даёт мгновенный доступ ко всему! 🌊",
            "Сегодня у нас 400 новых фото и 80 новых видео! 🎉",
            "Просто нажми на любой размытый контент, чтобы разблокировать его! 💕",
            "Знаешь ли ты, что с Lifetime ты больше никогда не платишь? Это лучшая сделка! 💎",
            "Пакеты позволяют разблокировать отдельный контент, идеально для пробы! 📦",
            "Не пропусти ежедневные обновления в 3:00! ⏰",
            "Сегодняшний контент 🔥🔥🔥 Не пропусти!",
            "Нужна помощь? Я здесь для тебя, дорогая! 💕"
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
// COMPLETE CONTENT POOLS
// ============================

// ALL PHOTOS FROM /uncensored/ - Complete list of 400+ photos
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

// ALL VIDEOS FROM /uncensored-videos/ - Complete list of 80+ videos
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

// BANNER SLIDESHOW IMAGES
const BANNER_IMAGES = [
    'bikbanner.jpg', 'bikbanner2.jpg', 'backbikini.jpg', 'bikini.jpg', 'bikini3.jpg', 'bikini5.jpg'
];

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
    
    // Re-render dynamic content with new language
    if (state.dailyContent) {
        renderPhotosProgressive();
        renderVideosProgressive();
    }
    
    trackEvent('language_changed', { language: lang });
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
    
    // Shuffle and select content for today
    const shuffledPhotos = shuffleWithSeed(ALL_PHOTOS_POOL, dateSeed);
    const shuffledVideos = shuffleWithSeed(ALL_VIDEOS_POOL, dateSeed * 2);
    const shuffledBanners = shuffleWithSeed(BANNER_IMAGES, dateSeed * 3);
    
    const todayPhotos = shuffledPhotos.slice(0, CONFIG.CONTENT.DAILY_PHOTOS);
    const todayVideos = shuffledVideos.slice(0, CONFIG.CONTENT.DAILY_VIDEOS);
    
    // Mark 30% as "new today"
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
// RENDER FUNCTIONS
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
        
        photosHTML += `
            <div class="content-item skeleton ${unlockClass}" 
                 data-id="${id}" 
                 data-type="photo" 
                 onclick="handlePhotoClick('${id}', '${photo}', ${index})">
                ${isNew ? `<span class="new-badge">${trans.new_today}</span>` : ''}
                <img class="item-media" 
                     data-src="public/assets/uncensored/${photo}" 
                     alt="Paradise Photo ${index + 1}"
                     style="filter: ${isUnlocked ? 'none' : `blur(${CONFIG.CONTENT.BLUR_PHOTO}px)`};"
                     loading="lazy">
                
                ${!isUnlocked ? `
                    <div class="lock-overlay">
                        <svg class="lock-icon" width="30" height="30" viewBox="0 0 24 24" fill="white">
                            <path d="M12 2C9.243 2 7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7z"/>
                        </svg>
                    </div>
                    
                    <div class="item-price">
                        €${CONFIG.PAYPAL.PRICES.SINGLE_PHOTO.toFixed(2)}
                    </div>
                ` : ''}
                
                <div class="item-overlay">
                    <div class="item-title">Paradise #${index + 1}</div>
                    <div class="item-info">${views.toLocaleString()} views</div>
                </div>
            </div>
        `;
    });
    
    photosGrid.innerHTML = photosHTML;
    
    // Observe all photos for lazy loading
    document.querySelectorAll('#photosGrid .content-item').forEach(item => {
        if (state.lazyLoadObserver) {
            state.lazyLoadObserver.observe(item);
        }
    });
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
        
        // Use banner image as poster for consistency
        const posterImage = BANNER_IMAGES[index % BANNER_IMAGES.length];
        
        videosHTML += `
            <div class="content-item skeleton ${unlockClass}" 
                 data-id="${id}" 
                 data-type="video" 
                 onclick="handleVideoClick('${id}', '${video}', ${index})">
                ${isNew ? `<span class="new-badge">${trans.fresh_content}</span>` : ''}
                <video class="item-media" 
                       muted 
                       loop 
                       playsinline
                       preload="none"
                       poster="public/assets/full/${posterImage}"
                       style="filter: ${isUnlocked ? 'none' : `blur(${CONFIG.CONTENT.BLUR_VIDEO}px)`};"
                       data-video-id="${id}">
                    <source data-src="public/assets/uncensored-videos/${video}" type="video/mp4">
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
                            <path d="M12 2C9.243 2 7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7z"/>
                        </svg>
                    </div>
                    
                    <div class="item-price">
                        €${CONFIG.PAYPAL.PRICES.SINGLE_VIDEO.toFixed(2)}
                    </div>
                ` : ''}
                
                <div class="item-overlay">
                    <div class="item-title">Video #${index + 1}</div>
                    <div class="item-info">${views.toLocaleString()} views</div>
                </div>
            </div>
        `;
    });
    
    videosGrid.innerHTML = videosHTML;
    
    // Observe all videos for lazy loading
    document.querySelectorAll('#videosGrid .content-item').forEach(item => {
        if (state.lazyLoadObserver) {
            state.lazyLoadObserver.observe(item);
        }
    });
    
    // Setup video hover preview
    setupVideoHoverPreview();
}

// ============================
// VIDEO HOVER PREVIEW
// ============================

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
// EVENT HANDLERS
// ============================

function handlePhotoClick(id, filename, index) {
    trackEvent('photo_click', { photo_id: id, photo_index: index });
    
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
    trackEvent('video_click', { video_id: id, video_index: index });
    
    if (state.isVIP || state.unlockedContent.has(id)) {
        window.open(`public/assets/uncensored-videos/${filename}`, '_blank');
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
    trackEvent('modal_open', { modal_type: 'pay_per_view', content_type: contentType });
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    trackEvent('modal_close');
}

function selectPlan(type) {
    state.selectedSubscriptionType = type;
    
    // Update UI
    document.querySelectorAll('.plan-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    event.currentTarget.classList.add('selected');
    renderPayPalVIPButtons();
    
    trackEvent('plan_selected', { plan_type: type });
}

function selectPack(packType) {
    state.selectedPack = packType;
    
    // Update UI
    document.querySelectorAll('.pack-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    event.currentTarget.classList.add('selected');
    renderPayPalPackButton(packType);
    
    trackEvent('pack_selected', { pack_type: packType });
}

// ============================
// PAYPAL INTEGRATION
// ============================

function renderPayPalVIPButtons() {
    const container = document.getElementById('paypal-button-container-vip');
    if (!container || !window.paypal) return;
    
    // Clear existing buttons
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
                
                // Activate VIP
                activateVIP(state.selectedSubscriptionType);
                
                // Track successful purchase
                trackEvent('purchase_complete', {
                    type: 'vip',
                    plan: state.selectedSubscriptionType,
                    price: price,
                    order_id: data.orderID
                });
                
                // Show success message
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
    
    // Clear existing buttons
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
                
                // Add pack credits
                addPackCredits(pack.items);
                
                // Track successful purchase
                trackEvent('purchase_complete', {
                    type: 'pack',
                    pack: packType,
                    price: pack.price,
                    items: pack.items,
                    order_id: data.orderID
                });
                
                // Show success message
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
    
    // Clear existing buttons
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
                
                // Unlock single content
                unlockSingleContent(contentId);
                
                // Track successful purchase
                trackEvent('purchase_complete', {
                    type: 'ppv',
                    content_type: contentType,
                    content_id: contentId,
                    price: price,
                    order_id: data.orderID
                });
                
                // Show success message
                const trans = TRANSLATIONS[state.currentLanguage];
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
// UNLOCK FUNCTIONS
// ============================

function activateVIP(type) {
    state.isVIP = true;
    
    // Save VIP status
    localStorage.setItem('ibiza_vip', JSON.stringify({
        active: true,
        type: type,
        activatedAt: Date.now()
    }));
    
    // Unlock all content
    unlockAllContent();
    
    // Update Isabella
    const trans = TRANSLATIONS[state.currentLanguage];
    isabellaBot.addMessage(trans.notification_welcome);
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
    
    // Update UI
    const item = document.querySelector(`[data-id="${contentId}"]`);
    if (item) {
        item.classList.add('unlocked');
        const media = item.querySelector('.item-media');
        if (media) {
            media.style.filter = 'none';
        }
    }
    
    // Save to localStorage
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
        
        trackEvent('pack_credit_used', { 
            content_id: contentId, 
            content_type: contentType, 
            credits_remaining: state.packCredits 
        });
    }
}

function updateCreditsDisplay() {
    // Update credits display if exists
    const creditsDisplay = document.getElementById('creditsDisplay');
    if (creditsDisplay) {
        creditsDisplay.textContent = state.packCredits;
    }
}

// ============================
// ISABELLA CHAT BOT
// ============================

const isabellaBot = {
    messages: [],
    
    init() {
        this.messages = TRANSLATIONS[state.currentLanguage].isabella_messages;
        
        // Show initial greeting after 5 seconds
        setTimeout(() => {
            this.showNotification();
            this.addMessage(this.messages[0]);
            
            // Add a tip after greeting
            setTimeout(() => {
                this.addMessage(this.messages[1]);
            }, 2000);
        }, 5000);
        
        // Random tips every 2 minutes
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
        
        // Scroll to bottom
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

// ============================
// AD NETWORK VERIFICATION (MEJORADO)
// ============================

function verifyAdNetworks() {
    if (!CONFIG.ADS.ENABLED) {
        console.log('📢 Ad Networks: Disabled in development mode');
        showPlaceholderAds();
        return;
    }
    
    console.log('🔍 Verifying Ad Networks...');
    
    // En producción, verificar si al menos una red cargó
    setTimeout(() => {
        let adsLoaded = false;
        
        if (window.juicyads_loaded) {
            console.log('✅ JuicyAds: Loaded and ready');
            adsLoaded = true;
        }
        
        if (window.exoclick_loaded) {
            console.log('✅ ExoClick: Loaded and ready');
            adsLoaded = true;
        }
        
        if (window.eroadvertising_loaded) {
            console.log('✅ EroAdvertising: Loaded and ready');
            adsLoaded = true;
        }
        
        if (!adsLoaded) {
            console.log('⚠️ No ad networks loaded, showing placeholders');
            showPlaceholderAds();
        } else {
            console.log('✅ At least one ad network is working');
            // Intentar inicializar ads que no cargaron
            if (!window.juicyads_loaded) initializeJuicyAds();
            if (!window.exoclick_loaded) initializeExoClick();
            if (!window.eroadvertising_loaded) initializeEroAdvertising();
        }
    }, 4000); // Dar más tiempo en producción
}

function showPlaceholderAds() {
    document.querySelectorAll('.ad-container').forEach((container, index) => {
        // Solo agregar placeholder si no tiene contenido de ads válido
        const hasValidAd = container.querySelector('iframe') || 
                          container.querySelector('.eas6a97888e') || 
                          (container.children.length > 1);
        
        if (!hasValidAd) {
            const placeholder = document.createElement('div');
            placeholder.className = 'ad-placeholder';
            placeholder.style.cssText = `
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, rgba(0,119,190,0.15), rgba(0,212,255,0.15));
                border: 2px dashed rgba(127,219,255,0.4);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: rgba(255,255,255,0.7);
                font-size: 14px;
                border-radius: 10px;
                font-family: system-ui, -apple-system, sans-serif;
                text-align: center;
                padding: 20px;
                box-sizing: border-box;
            `;
            
            if (ENVIRONMENT.isDevelopment) {
                placeholder.innerHTML = `
                    <div style="font-size: 16px; margin-bottom: 8px;">🚫</div>
                    <div>Ad Placeholder</div>
                    <div style="font-size: 12px; margin-top: 4px; opacity: 0.6;">(Development Mode)</div>
                `;
            } else {
                placeholder.innerHTML = `
                    <div style="font-size: 16px; margin-bottom: 8px;">📢</div>
                    <div>Advertisement</div>
                    <div style="font-size: 12px; margin-top: 4px; opacity: 0.6;">Loading...</div>
                `;
            }
            
            // Limpiar contenedor y agregar placeholder
            container.innerHTML = '';
            container.appendChild(placeholder);
        }
    });
}

function initializeJuicyAds() {
    if (ENVIRONMENT.isDevelopment || !CONFIG.ADS.JUICYADS.enabled) return;
    
    try {
        const containers = document.querySelectorAll('.adsbyJuicy');
        containers.forEach(container => {
            const zone = container.getAttribute('data-zone');
            if (zone && !container.querySelector('iframe')) {
                const adFrame = document.createElement('iframe');
                adFrame.src = `https://poweredby.jads.co/tag/${zone}.html`;
                adFrame.style.cssText = 'width:100%;height:100%;border:none;background:transparent;';
                adFrame.onload = () => {
                    console.log(`✅ JuicyAds iframe loaded for zone ${zone}`);
                };
                adFrame.onerror = () => {
                    console.warn(`❌ JuicyAds iframe failed for zone ${zone}`);
                };
                container.appendChild(adFrame);
            }
        });
        window.juicyads_loaded = true;
    } catch (e) {
        console.warn('JuicyAds initialization failed:', e.message);
    }
}

function initializeExoClick() {
    if (ENVIRONMENT.isDevelopment || !CONFIG.ADS.EXOCLICK.enabled) return;
    
    try {
        const containers = document.querySelectorAll('.adsbyexoclick');
        containers.forEach(container => {
            const zone = container.getAttribute('data-zone');
            if (zone && !container.querySelector('.eas6a97888e')) {
                const adDiv = document.createElement('div');
                adDiv.id = `exoclick_${zone}`;
                adDiv.innerHTML = `<ins class="eas6a97888e" data-zoneid="${zone}"></ins>`;
                container.appendChild(adDiv);
                console.log(`✅ ExoClick container created for zone ${zone}`);
            }
        });
        window.exoclick_loaded = true;
    } catch (e) {
        console.warn('ExoClick initialization failed:', e.message);
    }
}

function initializeEroAdvertising() {
    if (ENVIRONMENT.isDevelopment || !CONFIG.ADS.EROADVERTISING.enabled) return;
    
    try {
        const containers = document.querySelectorAll('.adsbyero');
        containers.forEach(container => {
            const zone = container.getAttribute('data-zone');
            if (zone && !container.querySelector('iframe')) {
                const adFrame = document.createElement('iframe');
                adFrame.src = `https://ads.eroadvertising.com/iframe/${zone}.html`;
                adFrame.style.cssText = 'width:100%;height:100%;border:none;background:transparent;';
                adFrame.onload = () => {
                    console.log(`✅ EroAdvertising iframe loaded for zone ${zone}`);
                };
                adFrame.onerror = () => {
                    console.warn(`❌ EroAdvertising iframe failed for zone ${zone}`);
                };
                container.appendChild(adFrame);
            }
        });
        window.eroadvertising_loaded = true;
    } catch (e) {
        console.warn('EroAdvertising initialization failed:', e.message);
    }
}

// ============================
// UTILITY FUNCTIONS
// ============================

function loadSavedState() {
    // Load VIP status
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
    
    // Load pack credits
    const savedCredits = localStorage.getItem('ibiza_pack_credits');
    if (savedCredits) {
        state.packCredits = parseInt(savedCredits);
        updateCreditsDisplay();
    }
    
    // Load unlocked content
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
    if (window.gtag) {
        window.gtag('event', eventName, {
            'event_category': 'engagement',
            ...parameters
        });
    }
    
    console.log(`📊 Event: ${eventName}`, parameters);
}

function setupScrollEffects() {
    const header = document.getElementById('mainHeader');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ============================
// INITIALIZATION
// ============================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Initializing Paradise Gallery...');
    
    // Load saved language
    const savedLang = localStorage.getItem('ibiza_language') || 'es';
    state.currentLanguage = savedLang;
    
    // Set language selector
    const langSelect = document.getElementById('languageSelect');
    if (langSelect) langSelect.value = savedLang;
    
    // Apply translations
    changeLanguage(savedLang);
    
    // Verify ad networks (con retraso reducido para development)
    if (ENVIRONMENT.isDevelopment) {
        // En desarrollo, mostrar placeholders inmediatamente
        setTimeout(() => verifyAdNetworks(), 100);
    } else {
        // En producción, dar tiempo a que las ads carguen
        setTimeout(() => verifyAdNetworks(), 2000);
    }
    
    // Get today's content
    state.dailyContent = getDailyRotation();
    console.log(`📅 Today's rotation: ${state.dailyContent.photos.length} photos, ${state.dailyContent.videos.length} videos`);
    
    // Setup lazy loading
    setupLazyLoading();
    
    // Load saved state
    loadSavedState();
    
    // Initialize Isabella bot
    isabellaBot.init();
    
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
    
    // Track page view
    trackEvent('page_view', { page: 'main_gallery', language: state.currentLanguage });
    
    console.log('✅ Gallery loaded successfully!');
    console.log('🌍 Language:', state.currentLanguage);
    console.log('📊 Analytics:', CONFIG.ANALYTICS_ID);
    console.log('💳 PayPal: Ready');
    console.log('📢 Ad Networks:', CONFIG.ADS.ENABLED ? 'Enabled (Production)' : 'Disabled (Development)');
    console.log('🌊 Version: 13.1.1 Fixed - 200 fotos + 40 videos diarios + ads mejoradas');
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

// ============================
// DEBUG TOOLS
// ============================

window.galleryDebug = {
    version: '13.1.1 FIXED - 200 fotos + 40 videos diarios + ads mejoradas',
    environment: ENVIRONMENT,
    state: state,
    config: CONFIG,
    language: () => state.currentLanguage,
    setLanguage: (lang) => changeLanguage(lang),
    verifyAds: () => verifyAdNetworks(),
    photos: () => state.dailyContent?.photos || [],
    videos: () => state.dailyContent?.videos || [],
    allPhotos: () => ALL_PHOTOS_POOL,
    allVideos: () => ALL_VIDEOS_POOL,
    vip: () => state.isVIP,
    unlocked: () => [...state.unlockedContent],
    credits: () => state.packCredits,
    unlockAll: () => {
        state.isVIP = true;
        unlockAllContent();
        console.log('🔓 All content unlocked!');
    },
    addCredits: (n) => {
        state.packCredits += n;
        localStorage.setItem('ibiza_pack_credits', state.packCredits);
        console.log(`💰 Added ${n} credits. Total: ${state.packCredits}`);
    },
    reset: () => {
        localStorage.clear();
        location.reload();
    },
    testAds: () => {
        console.log('Testing ad networks...');
        console.log('Environment:', ENVIRONMENT);
        console.log('Ads enabled:', CONFIG.ADS.ENABLED);
        console.log('JuicyAds zones:', CONFIG.ADS.JUICYADS.zones);
        console.log('ExoClick zones:', CONFIG.ADS.EXOCLICK.zones);
        console.log('EroAdvertising zones:', CONFIG.ADS.EROADVERTISING.zones);
        verifyAdNetworks();
    },
    contentStats: () => {
        console.log('📊 Content Statistics:');
        console.log(`Photos pool: ${ALL_PHOTOS_POOL.length} total items`);
        console.log(`Videos pool: ${ALL_VIDEOS_POOL.length} total items`);
        console.log(`Daily rotation: ${CONFIG.CONTENT.DAILY_PHOTOS} photos + ${CONFIG.CONTENT.DAILY_VIDEOS} videos`);
        console.log(`Today's photos: ${state.dailyContent?.photos.length || 0}`);
        console.log(`Today's videos: ${state.dailyContent?.videos.length || 0}`);
        console.log(`New content percentage: ${CONFIG.CONTENT.NEW_CONTENT_PERCENTAGE * 100}%`);
        console.log(`Unlocked content: ${state.unlockedContent.size}`);
        console.log(`Pack credits: ${state.packCredits}`);
        console.log(`VIP status: ${state.isVIP}`);
        console.log(`Environment: ${ENVIRONMENT.isDevelopment ? 'Development' : 'Production'}`);
    }
};

console.log('🔧 Debug tools available: galleryDebug');
console.log('💡 Try: galleryDebug.contentStats() or galleryDebug.setLanguage("en")');
console.log('📝 Test ads: galleryDebug.testAds()');
console.log('🔓 Unlock all: galleryDebug.unlockAll()');
console.log('💰 Add credits: galleryDebug.addCredits(100)');
console.log('📊 Content stats: galleryDebug.contentStats()');
console.log('🌍 Environment:', ENVIRONMENT.isDevelopment ? 'Development Mode' : 'Production Mode');

// ============================
// END OF SCRIPT
// ============================
