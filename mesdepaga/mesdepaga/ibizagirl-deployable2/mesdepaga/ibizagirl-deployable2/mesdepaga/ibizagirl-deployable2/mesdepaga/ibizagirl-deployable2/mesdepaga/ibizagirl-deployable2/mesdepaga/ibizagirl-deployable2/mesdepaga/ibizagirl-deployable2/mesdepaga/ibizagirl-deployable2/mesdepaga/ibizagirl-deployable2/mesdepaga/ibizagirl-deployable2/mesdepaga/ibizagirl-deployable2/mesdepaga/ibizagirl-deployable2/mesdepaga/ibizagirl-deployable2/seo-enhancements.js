// ============================
// SEO ENHANCEMENTS - LAZY LOADING + OPEN GRAPH + JSON-LD
// Añadir al final del main-script.js o como archivo separado
// ============================

// ============================
// LAZY LOADING MEJORADO v2.0
// ============================

function setupAdvancedLazyLoading() {
    // Configuración más agresiva para mejor performance
    const lazyImageOptions = {
        root: null,
        rootMargin: '50px 0px', // Precargar antes de que sea visible
        threshold: 0.01
    };

    const lazyVideoOptions = {
        root: null,
        rootMargin: '100px 0px', // Videos necesitan más tiempo
        threshold: 0.1
    };

    // Observer para imágenes con soporte WEBP
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Soporte para WEBP con fallback
                if (supportsWebP()) {
                    const webpSrc = img.dataset.src?.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                    if (webpSrc && webpSrc !== img.dataset.src) {
                        // Intentar cargar WEBP primero
                        const webpImg = new Image();
                        webpImg.onload = () => {
                            img.src = webpSrc;
                            img.classList.remove('skeleton', 'lazy');
                            img.classList.add('loaded');
                        };
                        webpImg.onerror = () => {
                            // Fallback a formato original
                            img.src = img.dataset.src;
                            img.classList.remove('skeleton', 'lazy');
                            img.classList.add('loaded');
                        };
                        webpImg.src = webpSrc;
                    } else {
                        img.src = img.dataset.src;
                        img.classList.remove('skeleton', 'lazy');
                        img.classList.add('loaded');
                    }
                } else {
                    img.src = img.dataset.src;
                    img.classList.remove('skeleton', 'lazy');
                    img.classList.add('loaded');
                }
                
                // Performance tracking
                img.addEventListener('load', () => {
                    trackEvent('image_loaded', {
                        src: img.src,
                        loading_method: 'lazy',
                        supports_webp: supportsWebP()
                    });
                });
                
                observer.unobserve(img);
            }
        });
    }, lazyImageOptions);

    // Observer para videos con preload optimizado
    const videoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                const source = video.querySelector('source[data-src]');
                
                if (source && source.dataset.src) {
                    source.src = source.dataset.src;
                    video.load();
                    video.classList.remove('skeleton', 'lazy');
                    video.classList.add('loaded');
                    
                    // Preload metadata para mejor UX
                    video.preload = 'metadata';
                    
                    delete source.dataset.src;
                    
                    // Performance tracking
                    video.addEventListener('loadedmetadata', () => {
                        trackEvent('video_loaded', {
                            src: source.src,
                            duration: video.duration,
                            loading_method: 'lazy'
                        });
                    });
                }
                
                observer.unobserve(video);
            }
        });
    }, lazyVideoOptions);

    // Aplicar observers
    document.querySelectorAll('img[data-src]').forEach(img => {
        img.classList.add('lazy');
        imageObserver.observe(img);
    });

    document.querySelectorAll('video[data-video-id]').forEach(video => {
        video.classList.add('lazy');
        videoObserver.observe(video);
    });

    // Progressive loading para crítico above-the-fold
    loadCriticalImages();
    
    return { imageObserver, videoObserver };
}

// Detectar soporte WEBP
function supportsWebP() {
    if (typeof supportsWebP.result === 'undefined') {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        supportsWebP.result = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return supportsWebP.result;
}

// Cargar imágenes críticas inmediatamente
function loadCriticalImages() {
    const criticalImages = document.querySelectorAll('.banner-slide img, .teaser-item img');
    criticalImages.forEach(img => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('skeleton');
            delete img.dataset.src;
        }
    });
}

// ============================
// OPEN GRAPH DINÁMICO
// ============================

function updateOpenGraph(contentData = {}) {
    const defaultData = {
        title: 'IbizaGirl.pics - Galería Premium Ibiza | 400+ Fotos Diarias',
        description: 'Galería premium de Ibiza con 400+ fotos y 80+ videos HD actualizados diariamente. Contenido exclusivo del paraíso mediterráneo español.',
        image: 'https://ibizagirl.pics/public/assets/full/bikini.jpg',
        url: window.location.href,
        type: 'website'
    };

    const data = { ...defaultData, ...contentData };

    // Actualizar meta tags existentes o crear nuevos
    const metaTags = [
        { property: 'og:title', content: data.title },
        { property: 'og:description', content: data.description },
        { property: 'og:image', content: data.image },
        { property: 'og:url', content: data.url },
        { property: 'og:type', content: data.type },
        { property: 'og:site_name', content: 'IbizaGirl.pics' },
        { property: 'og:locale', content: state.currentLanguage === 'es' ? 'es_ES' : 'en_US' },
        { property: 'og:updated_time', content: new Date().toISOString() },
        
        // Twitter Cards
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@ibizagirlpics' },
        { name: 'twitter:title', content: data.title },
        { name: 'twitter:description', content: data.description },
        { name: 'twitter:image', content: data.image },
        
        // Adicionales para mejor SEO
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'Galería premium de Ibiza - Fotos exclusivas mediterráneo' },
        
        // Para Pinterest
        { name: 'pinterest-rich-pin', content: 'true' },
        { name: 'pinterest:description', content: data.description },
        
        // Para LinkedIn
        { property: 'og:video', content: 'https://ibizagirl.pics/preview-video.mp4' },
        { property: 'og:video:type', content: 'video/mp4' },
        { property: 'og:video:width', content: '1280' },
        { property: 'og:video:height', content: '720' }
    ];

    metaTags.forEach(tag => {
        let element = document.querySelector(`meta[${tag.property ? 'property' : 'name'}="${tag.property || tag.name}"]`);
        
        if (!element) {
            element = document.createElement('meta');
            if (tag.property) {
                element.setAttribute('property', tag.property);
            } else {
                element.setAttribute('name', tag.name);
            }
            document.head.appendChild(element);
        }
        
        element.setAttribute('content', tag.content);
    });

    // Actualizar canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
    }
    canonical.href = data.url;
}

// ============================
// JSON-LD AVANZADO
// ============================

function injectAdvancedJSONLD() {
    const trans = TRANSLATIONS[state.currentLanguage];
    
    // Schema principal del sitio web
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://ibizagirl.pics/#website",
        "name": "IbizaGirl.pics",
        "alternateName": ["Galería Ibiza", "Ibiza Photos", "Paradise Gallery"],
        "description": trans.meta_description,
        "url": "https://ibizagirl.pics/",
        "inLanguage": state.currentLanguage === 'es' ? 'es-ES' : 'en-US',
        "isAccessibleForFree": false,
        "datePublished": "2025-01-15T00:00:00+01:00",
        "dateModified": new Date().toISOString(),
        "publisher": {
            "@type": "Organization",
            "@id": "https://ibizagirl.pics/#organization"
        },
        "potentialAction": [
            {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": "https://ibizagirl.pics/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
            },
            {
                "@type": "ViewAction",
                "target": "https://ibizagirl.pics/main.html",
                "name": "Ver Galería Premium"
            }
        ]
    };

    // Schema de la organización
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": "https://ibizagirl.pics/#organization",
        "name": "IbizaGirl.pics",
        "legalName": "IbizaGirl.pics",
        "url": "https://ibizagirl.pics/",
        "logo": {
            "@type": "ImageObject",
            "url": "https://ibizagirl.pics/public/assets/full/bikini.jpg",
            "width": 1200,
            "height": 630
        },
        "sameAs": [
            "https://instagram.com/ibizagirl.pics",
            "https://tiktok.com/@ibizagirl.pics",
            "https://twitter.com/ibizagirlpics"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": ["Spanish", "English"]
        }
    };

    // Schema de galería de imágenes
    const imageGallerySchema = {
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        "@id": "https://ibizagirl.pics/main.html#gallery",
        "name": trans.photos_seo_title,
        "description": trans.gallery_description,
        "url": "https://ibizagirl.pics/main.html",
        "mainEntity": {
            "@type": "WebPage",
            "@id": "https://ibizagirl.pics/main.html#webpage",
            "name": trans.photos_seo_title,
            "description": trans.gallery_description,
            "primaryImageOfPage": {
                "@type": "ImageObject",
                "url": "https://ibizagirl.pics/public/assets/full/bikini.jpg",
                "caption": trans.seo_keywords?.primary,
                "width": 1200,
                "height": 800
            }
        },
        "numberOfItems": state.dailyContent ? state.dailyContent.photos.length : 400,
        "contentLocation": {
            "@type": "Place",
            "name": "Ibiza, España",
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": "38.9067",
                "longitude": "1.4206"
            },
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "ES",
                "addressRegion": "Islas Baleares",
                "addressLocality": "Ibiza"
            }
        },
        "dateModified": new Date().toISOString(),
        "inLanguage": state.currentLanguage === 'es' ? 'es-ES' : 'en-US',
        "keywords": trans.seo_keywords?.primary,
        "author": {
            "@type": "Organization",
            "@id": "https://ibizagirl.pics/#organization"
        },
        "publisher": {
            "@type": "Organization",
            "@id": "https://ibizagirl.pics/#organization"
        }
    };

    // Schema de destino turístico
    const touristDestinationSchema = {
        "@context": "https://schema.org",
        "@type": "TouristDestination",
        "name": "Ibiza Paradise Beaches",
        "description": "Las mejores playas y calas de Ibiza capturadas en nuestra galería premium",
        "url": "https://ibizagirl.pics/",
        "image": "https://ibizagirl.pics/public/assets/full/bikbanner.jpg",
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "38.9067",
            "longitude": "1.4206"
        },
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "ES",
            "addressRegion": "Islas Baleares",
            "addressLocality": "Ibiza"
        },
        "touristType": ["Beach Lover", "Photography Enthusiast", "Nature Lover"],
        "includesAttraction": [
            {
                "@type": "TouristAttraction",
                "name": "Playa de Ses Illetes",
                "description": "Una de las playas más hermosas de Ibiza"
            },
            {
                "@type": "TouristAttraction", 
                "name": "Cala Comte",
                "description": "Famosa por sus increíbles atardeceres"
            }
        ]
    };

    // Schema de producto/servicio
    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Galería Premium Ibiza",
        "description": "Servicio de galería fotográfica premium con contenido exclusivo de Ibiza",
        "provider": {
            "@type": "Organization",
            "@id": "https://ibizagirl.pics/#organization"
        },
        "areaServed": {
            "@type": "Place",
            "name": "España"
        },
        "audience": {
            "@type": "Audience",
            "audienceType": "Adults 18+"
        },
        "offers": [
            {
                "@type": "Offer",
                "name": "VIP Lifetime Access",
                "description": "Acceso de por vida a toda la galería premium",
                "price": "100",
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock",
                "validFrom": "2025-01-15"
            },
            {
                "@type": "Offer",
                "name": "VIP Monthly Access",
                "description": "Acceso mensual a toda la galería premium",
                "price": "15",
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock",
                "validFrom": "2025-01-15"
            }
        ]
    };

    // Inyectar todos los schemas
    const schemas = [
        websiteSchema,
        organizationSchema,
        imageGallerySchema,
        touristDestinationSchema,
        serviceSchema
    ];

    schemas.forEach((schema, index) => {
        let scriptTag = document.getElementById(`jsonld-schema-${index}`);
        if (!scriptTag) {
            scriptTag = document.createElement('script');
            scriptTag.type = 'application/ld+json';
            scriptTag.id = `jsonld-schema-${index}`;
            document.head.appendChild(scriptTag);
        }
        scriptTag.textContent = JSON.stringify(schema, null, 2);
    });

    console.log('✅ Advanced JSON-LD schemas injected');
}

// ============================
// PWA SERVICE WORKER REGISTRATION
// ============================

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('✅ Service Worker registered:', registration);
                    
                    // Manejar actualizaciones
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // Nueva versión disponible
                                showUpdateNotification();
                            }
                        });
                    });
                    
                    // Sincronización en background
                    if ('sync' in window.ServiceWorkerRegistration.prototype) {
                        registration.sync.register('content-preload');
                    }
                })
                .catch(error => {
                    console.error('❌ Service Worker registration failed:', error);
                });
        });
    }
}

function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
        <div class="update-content">
            <span>🆕 Nueva versión disponible</span>
            <button onclick="updateApp()" class="update-btn">Actualizar</button>
            <button onclick="this.parentElement.parentElement.remove()" class="close-btn">×</button>
        </div>
    `;
    document.body.appendChild(notification);
}

function updateApp() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(registration => {
            if (registration && registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
            }
        });
    }
}

// ============================
// BREADCRUMBS DINÁMICOS
// ============================

function updateBreadcrumbs(currentPage = '') {
    const breadcrumbContainer = document.querySelector('.breadcrumb');
    if (!breadcrumbContainer) return;

    const trans = TRANSLATIONS[state.currentLanguage];
    const breadcrumbs = [
        { name: 'Inicio', url: '/', position: 1 }
    ];

    if (currentPage === 'gallery') {
        breadcrumbs.push({ 
            name: 'Galería Premium Ibiza', 
            url: '/main.html', 
            position: 2 
        });
    }

    const breadcrumbHTML = breadcrumbs.map(crumb => `
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            ${crumb.url ? 
                `<a itemprop="item" href="${crumb.url}"><span itemprop="name">${crumb.name}</span></a>` :
                `<span itemprop="name">${crumb.name}</span>`
            }
            <meta itemprop="position" content="${crumb.position}">
        </li>
    `).join('');

    breadcrumbContainer.innerHTML = breadcrumbHTML;
}

// ============================
// INICIALIZACIÓN GLOBAL
// ============================

function initializeSEOEnhancements() {
    console.log('🚀 Initializing SEO Enhancements...');
    
    // Lazy loading avanzado
    setupAdvancedLazyLoading();
    
    // Open Graph dinámico
    updateOpenGraph();
    
    // JSON-LD avanzado
    injectAdvancedJSONLD();
    
    // Service Worker PWA
    registerServiceWorker();
    
    // Breadcrumbs
    updateBreadcrumbs('gallery');
    
    // Performance observer
    if ('PerformanceObserver' in window) {
        const perfObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'largest-contentful-paint') {
                    trackEvent('lcp_measured', { value: entry.startTime });
                }
                if (entry.entryType === 'first-input') {
                    trackEvent('fid_measured', { value: entry.processingStart - entry.startTime });
                }
            }
        });
        
        perfObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
    }
    
    console.log('✅ SEO Enhancements initialized');
}

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSEOEnhancements);
} else {
    initializeSEOEnhancements();
}

// Exponer funciones globales
window.updateOpenGraph = updateOpenGraph;
window.updateBreadcrumbs = updateBreadcrumbs;
window.initializeSEOEnhancements = initializeSEOEnhancements;
