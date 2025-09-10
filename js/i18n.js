// Sistema de internacionalización para IbizaGirl.pics
const translations = {
    es: {
        welcome: "bienvenido al paraíso",
        featured: "Destacadas del Día", 
        gallery: "Galería Completa",
        loadMore: "Cargar Más",
        view: "Ver"
    },
    en: {
        welcome: "welcome to paradise",
        featured: "Featured Today",
        gallery: "Complete Gallery", 
        loadMore: "Load More",
        view: "View"
    },
    fr: {
        welcome: "bienvenue au paradis",
        featured: "En Vedette Aujourd'hui",
        gallery: "Galerie Complète",
        loadMore: "Charger Plus", 
        view: "Voir"
    },
    de: {
        welcome: "willkommen im paradies",
        featured: "Heute Vorgestellt", 
        gallery: "Komplette Galerie",
        loadMore: "Mehr Laden",
        view: "Ansehen"
    },
    it: {
        welcome: "benvenuto in paradiso",
        featured: "In Evidenza Oggi",
        gallery: "Galleria Completa", 
        loadMore: "Carica Altro",
        view: "Visualizza"
    }
};

window.IbizaGirlI18n = {
    currentLang: 'es',
    
    setLanguage(lang) {
        this.currentLang = lang;
        this.updateUI();
    },
    
    t(key) {
        return translations[this.currentLang]?.[key] || translations.es[key] || key;
    },
    
    updateUI() {
        // Actualizar textos traducibles
        const subtitle = document.querySelector('.site-subtitle');
        if (subtitle) subtitle.textContent = this.t('welcome');
        
        const featured = document.querySelector('.carousel-section .section-title');
        if (featured) featured.textContent = this.t('featured');
        
        const gallery = document.querySelector('.gallery-section .section-title');
        if (gallery) gallery.textContent = this.t('gallery');
        
        const loadMore = document.getElementById('load-more');
        if (loadMore) loadMore.textContent = this.t('loadMore');
        
        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => btn.textContent = this.t('view'));
    }
};

// Auto-inicializar
document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('language-select');
    if (select) {
        select.addEventListener('change', (e) => {
            window.IbizaGirlI18n.setLanguage(e.target.value);
        });
    }
});
