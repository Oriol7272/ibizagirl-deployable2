// Sistema completo de idiomas
const translations = {
    es: {
        home: "Inicio",
        premium: "Premium",
        videos: "Videos",
        subscriptions: "Suscripciones",
        emailTitle: "Recibe contenido exclusivo diario",
        emailPlaceholder: "tu@email.com",
        subscribe: "Suscribir"
    },
    en: {
        home: "Home",
        premium: "Premium",
        videos: "Videos",
        subscriptions: "Subscriptions",
        emailTitle: "Get exclusive daily content",
        emailPlaceholder: "your@email.com",
        subscribe: "Subscribe"
    },
    fr: {
        home: "Accueil",
        premium: "Premium",
        videos: "Vidéos",
        subscriptions: "Abonnements",
        emailTitle: "Recevez du contenu exclusif quotidien",
        emailPlaceholder: "votre@email.com",
        subscribe: "S'abonner"
    },
    de: {
        home: "Startseite",
        premium: "Premium",
        videos: "Videos",
        subscriptions: "Abonnements",
        emailTitle: "Erhalten Sie täglich exklusive Inhalte",
        emailPlaceholder: "ihre@email.com",
        subscribe: "Abonnieren"
    },
    it: {
        home: "Home",
        premium: "Premium",
        videos: "Video",
        subscriptions: "Abbonamenti",
        emailTitle: "Ricevi contenuti esclusivi ogni giorno",
        emailPlaceholder: "tua@email.com",
        subscribe: "Iscriviti"
    },
    pt: {
        home: "Início",
        premium: "Premium",
        videos: "Vídeos",
        subscriptions: "Assinaturas",
        emailTitle: "Receba conteúdo exclusivo diário",
        emailPlaceholder: "seu@email.com",
        subscribe: "Inscrever"
    }
};

function setLanguage(lang) {
    localStorage.setItem('lang', lang);
    const t = translations[lang] || translations.es;
    
    // Traducir elementos
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (t[key]) el.textContent = t[key];
    });
    
    // Traducir placeholders
    document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
        const key = el.getAttribute('data-translate-placeholder');
        if (t[key]) el.placeholder = t[key];
    });
    
    // Actualizar indicador
    const flags = {es:'🇪🇸', en:'🇬🇧', fr:'🇫🇷', de:'🇩🇪', it:'🇮🇹', pt:'🇵🇹'};
    const btn = document.getElementById('current-lang');
    if (btn) btn.innerHTML = flags[lang] + ' ' + lang.toUpperCase();
    
    // Cerrar dropdown
    const dropdown = document.getElementById('lang-options');
    if (dropdown) dropdown.classList.remove('show');
}

function toggleDropdown() {
    const dropdown = document.getElementById('lang-options');
    if (dropdown) dropdown.classList.toggle('show');
}

// Cerrar al hacer click fuera
document.addEventListener('click', (e) => {
    if (!e.target.closest('.language-dropdown')) {
        const dropdown = document.getElementById('lang-options');
        if (dropdown) dropdown.classList.remove('show');
    }
});

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    const lang = localStorage.getItem('lang') || 'es';
    setLanguage(lang);
});
