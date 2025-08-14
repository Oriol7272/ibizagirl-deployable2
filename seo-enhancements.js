// ============================
// SEO ENHANCEMENTS - LAZY LOADING + OPEN GRAPH + JSON-LD
// Version 2.1.0 - COMPLETE FIXED with Thumbs Loading + Multi-Language
// ============================

// ============================
// ENHANCED LAZY LOADING v2.1 WITH COMPLETE THUMBS FIX
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

    // Observer para imágenes con soporte WEBP y fix completo de thumbs
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // COMPLETE FIX: Manejar todas las posibilidades de carga de imágenes
                if (img.dataset.src) {
                    // Caso 1: Imagen con data-src para lazy loading
                    if (supportsWebP()) {
                        const webpSrc = img.dataset.src?.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                        if (webpSrc && webpSrc !== img.dataset.src) {
                            // Intentar cargar WEBP primero
                            const webpImg = new Image();
                            webpImg.onload = () => {
                                img.src = webpSrc;
                                img.classList.remove('skeleton', 'lazy');
                                img.classList.add('loaded');
                                trackImageLoad(img, 'webp_success');
                            };
                            webpImg.onerror = () => {
                                // Fallback a formato original
                                img.src = img.dataset.src;
                                img.classList.remove('skeleton', 'lazy');
                                img.classList.add('loaded');
                                trackImageLoad(img, 'webp_fallback');
                            };
                            webpImg.src = webpSrc;
                        } else {
                            img.src = img.dataset.src;
                            img.classList.remove('skeleton', 'lazy');
                            img.classList.add('loaded');
                            trackImageLoad(img, 'standard');
                        }
                    } else {
                        img.src = img.dataset.src;
                        img.classList.remove('skeleton', 'lazy');
                        img.classList.add('loaded');
                        trackImageLoad(img, 'no_webp');
                    }
                    delete img.dataset.src;
                } 
                else if (img.src && img.src !== '' && !img.src.includes('data:')) {
                    // Caso 2: Imagen ya tiene src válida
                    img.classList.remove('skeleton', 'lazy');
                    img.classList.add('loaded');
                    trackImageLoad(img, 'already_loaded');
                }
                else {
                    // Caso 3: Imagen sin src válida - remover skeleton
                    console.warn('Image without valid src detected:', img);
                    img.classList.remove('skeleton', 'lazy');
                    
                    // Intentar cargar una imagen por defecto si está en content-item
                    const parentItem = img.closest('.content-item, .teaser-item');
                    if (parentItem && parentItem.dataset.id) {
                        // Intentar construir una URL válida
                        const defaultSrc = 'public/assets/full/bikini.jpg';
                        img.src = defaultSrc;
                        img.classList.add('loaded');
                        trackImageLoad(img, 'fallback_default');
                    }
                }
                
                observer.unobserve(img);
            }
        });
    }, lazyImageOptions);

    // Observer para videos con preload optimizado y fix completo
    const videoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                const source = video.querySelector('source[data-src], source[src]');
                
                if (source) {
                    if (source.dataset.src) {
                        // Video con data-src
                        source.src = source.dataset.src;
                        video.load();
                        video.classList.remove('skeleton', 'lazy');
                        video.classList.add('loaded');
                        
                        // Preload metadata para mejor UX
                        video.preload = 'metadata';
                        
                        delete source.dataset.src;
                        trackVideoLoad(video, 'lazy_loaded');
                    } else if (source.src && source.src !== '') {
                        // Video ya tiene src
                        video.classList.remove('skeleton', 'lazy');
                        video.classList.add('loaded');
                        video.preload = 'metadata';
                        trackVideoLoad(video, 'already_loaded');
                    }
                } else {
                    // Video sin source - remover skeleton
                    video.classList.remove('skeleton', 'lazy');
                    console.warn('Video without valid source detected:', video);
                }
                
                observer.unobserve(video);
            }
        });
    }, lazyVideoOptions);

    // Aplicar observers a todas las imágenes y videos
    document.querySelectorAll('img[data-src], img.lazy, img.skeleton').forEach(img => {
        img.classList.add('lazy');
        imageObserver.observe(img);
    });

    document.querySelectorAll('video[data-video-id], video.lazy, video.skeleton').forEach(video => {
        video.classList.add('lazy');
        videoObserver.observe(video);
    });

    // Progressive loading para crítico above-the-fold
    loadCriticalImages();
    
    console.log('✅ Advanced lazy loading setup complete with thumbs fix');
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
        } else if (!img.src || img.src === '') {
            // Asegurar que las imágenes críticas tengan src
            if (img.closest('.banner-slide')) {
                img.src = 'public/assets/full/bikbanner.jpg';
            } else if (img.closest('.teaser-item')) {
                img.src = 'public/assets/full/bikini.jpg';
            }
            img.classList.remove('skeleton');
        }
    });
}

// Funciones de tracking para debugging
function trackImageLoad(img, method) {
    if (window.trackEvent) {
        window.trackEvent('image_loaded', {
            src: img.src,
            loading_method: method,
            supports_webp: supportsWebP(),
            has_alt: !!img.alt
        });
    }
    console.log(`📸 Image loaded: ${method} - ${img.src.split('/').pop()}`);
}

function trackVideoLoad(video, method) {
    if (window.trackEvent) {
        window.trackEvent('video_loaded', {
            loading_method: method,
            has_poster: !!video.poster,
            duration: video.duration || 0
        });
    }
    console.log(`🎬 Video loaded: ${method}`);
}

// ============================
// OPEN GRAPH DINÁMICO MEJORADO
// ============================

function updateOpenGraph(contentData = {}) {
    // Usar el estado global si está disponible
    const currentLang = window.state?.currentLanguage || 'es';
    const trans = window.TRANSLATIONS?.[currentLang] || {};
    
    const defaultData = {
        title: trans.photos_seo_title || 'IbizaGirl.pics - Galería Premium Ibiza | 400+ Fotos Diarias',
        description: trans.meta_description || 'Galería premium de Ibiza con 400+ fotos y 80+ videos HD actualizados diariamente. Contenido exclusivo del paraíso mediterráneo español.',
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
        { property: 'og:locale', content: getOGLocale(currentLang) },
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
    
    console.log('✅ Open Graph updated for language:', currentLang);
}

function getOGLocale(lang) {
    const locales = {
        'es': 'es_ES',
        'en': 'en_US',
        'fr': 'fr_FR',
        'de': 'de_DE',
        'it': 'it_IT'
    };
    return locales[lang] || 'es_ES';
}

// ============================
// JSON-LD AVANZADO CON TODOS LOS IDIOMAS
// ============================

function injectAdvancedJSONLD() {
    const currentLang = window.state?.currentLanguage || 'es';
    const trans = window.TRANSLATIONS?.[currentLang] || {};
    const dailyContent = window.state?.dailyContent;
    
    // Schema principal del sitio web
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://ibizagirl.pics/#website",
        "name": "IbizaGirl.pics",
        "alternateName": ["Galería Ibiza", "Ibiza Photos", "Paradise Gallery", "Galerie Ibiza", "Ibiza Fotos"],
        "description": trans.meta_description || "Premium Ibiza gallery with daily updates",
        "url": "https://ibizagirl.pics/",
        "inLanguage": getSchemaLanguage(currentLang),
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
                "name": trans.view_gallery || "Ver Galería Premium"
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
            "availableLanguage": ["Spanish", "English", "French", "German", "Italian"]
        }
    };

    // Schema de galería de imágenes
    const imageGallerySchema = {
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        "@id": "https://ibizagirl.pics/main.html#gallery",
        "name": trans.photos_seo_title || "Galería Premium de Ibiza",
        "description": trans.gallery_description || "Galería premium con contenido exclusivo de Ibiza",
        "url": "https://ibizagirl.pics/main.html",
        "mainEntity": {
            "@type": "WebPage",
            "@id": "https://ibizagirl.pics/main.html#webpage",
            "name": trans.photos_seo_title || "Galería Premium de Ibiza",
            "description": trans.gallery_description || "Galería premium con contenido exclusivo de Ibiza",
            "primaryImageOfPage": {
                "@type": "ImageObject",
                "url": "https://ibizagirl.pics/public/assets/full/bikini.jpg",
                "caption": trans.seo_keywords?.primary || "galería premium ibiza",
                "width": 1200,
                "height": 800
            }
        },
        "numberOfItems": dailyContent ? dailyContent.photos.length : 400,
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
        "inLanguage": getSchemaLanguage(currentLang),
        "keywords": trans.seo_keywords?.primary || "ibiza photos gallery",
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
        "description": getDestinationDescription(currentLang),
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
        "name": getServiceName(currentLang),
        "description": getServiceDescription(currentLang),
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

    console.log('✅ Advanced JSON-LD schemas injected for language:', currentLang);
}

function getSchemaLanguage(lang) {
    const languages = {
        'es': 'es-ES',
        'en': 'en-US',
        'fr': 'fr-FR',
        'de': 'de-DE',
        'it': 'it-IT'
    };
    return languages[lang] || 'es-ES';
}

function getDestinationDescription(lang) {
    const descriptions = {
        'es': "Las mejores playas y calas de Ibiza capturadas en nuestra galería premium",
        'en': "The best beaches and coves of Ibiza captured in our premium gallery",
        'fr': "Les meilleures plages et criques d'Ibiza capturées dans notre galerie premium",
        'de': "Die besten Strände und Buchten von Ibiza in unserer Premium-Galerie eingefangen",
        'it': "Le migliori spiagge e calette di Ibiza catturate nella nostra galleria premium"
    };
    return descriptions[lang] || descriptions['es'];
}

function getServiceName(lang) {
    const names = {
        'es': "Galería Premium Ibiza",
        'en': "Premium Ibiza Gallery",
        'fr': "Galerie Premium Ibiza",
        'de': "Premium Ibiza Galerie",
        'it': "Galleria Premium Ibiza"
    };
    return names[lang] || names['es'];
}

function getServiceDescription(lang) {
    const descriptions = {
        'es': "Servicio de galería fotográfica premium con contenido exclusivo de Ibiza",
        'en': "Premium photographic gallery service with exclusive Ibiza content",
        'fr': "Service de galerie photographique premium avec contenu exclusif d'Ibiza",
        'de': "Premium-Fotogalerie-Service mit exklusiven Ibiza-Inhalten",
        'it': "Servizio di galleria fotografica premium con contenuti esclusivi di Ibiza"
    };
    return descriptions[lang] || descriptions['es'];
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

    const currentLang = window.state?.currentLanguage || 'es';
    const trans = window.TRANSLATIONS?.[currentLang] || {};
    const breadcrumbs = [
        { name: trans.home || 'Inicio', url: '/', position: 1 }
    ];

    if (currentPage === 'gallery') {
        breadcrumbs.push({ 
            name: trans.photos_seo_title || 'Galería Premium Ibiza', 
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
// MULTILINGUAL HREFLANG TAGS
// ============================

function injectHreflangTags() {
    // Limpiar hreflang existentes
    document.querySelectorAll('link[hreflang]').forEach(link => link.remove());
    
    const languages = {
        'es': 'https://ibizagirl.pics/',
        'en': 'https://ibizagirl.pics/en/',
        'fr': 'https://ibizagirl.pics/fr/',
        'de': 'https://ibizagirl.pics/de/',
        'it': 'https://ibizagirl.pics/it/'
    };
    
    // Agregar hreflang para cada idioma
    Object.entries(languages).forEach(([lang, url]) => {
        const link = document.createElement('link');
        link.rel = 'alternate';
        link.hreflang = lang;
        link.href = url;
        document.head.appendChild(link);
    });
    
    // Agregar x-default
    const defaultLink = document.createElement('link');
    defaultLink.rel = 'alternate';
    defaultLink.hreflang = 'x-default';
    defaultLink.href = 'https://ibizagirl.pics/';
    document.head.appendChild(defaultLink);
    
    console.log('✅ Hreflang tags injected for all languages');
}

// ============================
// PERFORMANCE METRICS TRACKING
// ============================

function setupPerformanceTracking() {
    // Core Web Vitals
    if ('PerformanceObserver' in window) {
        const perfObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'largest-contentful-paint') {
                    if (window.trackEvent) {
                        window.trackEvent('lcp_measured', { 
                            value: entry.startTime,
                            element: entry.element?.tagName || 'unknown'
                        });
                    }
                }
                if (entry.entryType === 'first-input') {
                    if (window.trackEvent) {
                        window.trackEvent('fid_measured', { 
                            value: entry.processingStart - entry.startTime,
                            input_type: entry.name
                        });
                    }
                }
                if (entry.entryType === 'layout-shift') {
                    if (window.trackEvent) {
                        window.trackEvent('cls_measured', { 
                            value: entry.value,
                            had_recent_input: entry.hadRecentInput
                        });
                    }
                }
            }
        });
        
        perfObserver.observe({ 
            entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] 
        });
    }
    
    // Page load timing
    window.addEventListener('load', () => {
        setTimeout(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation && window.trackEvent) {
                window.trackEvent('page_timing', {
                    'dns_lookup': navigation.domainLookupEnd - navigation.domainLookupStart,
                    'tcp_connect': navigation.connectEnd - navigation.connectStart,
                    'server_response': navigation.responseStart - navigation.requestStart,
                    'dom_interactive': navigation.domInteractive - navigation.navigationStart,
                    'dom_complete': navigation.domComplete - navigation.navigationStart
                });
            }
        }, 1000);
    });
    
    console.log('✅ Performance tracking setup complete');
}

// ============================
// INICIALIZACIÓN GLOBAL
// ============================

function initializeSEOEnhancements() {
    console.log('🚀 Initializing SEO Enhancements v2.1.0...');
    
    // Lazy loading avanzado con fix completo
    setupAdvancedLazyLoading();
    
    // Open Graph dinámico
    updateOpenGraph();
    
    // JSON-LD avanzado
    injectAdvancedJSONLD();
    
    // Hreflang tags
    injectHreflangTags();
    
    // Service Worker PWA
    registerServiceWorker();
    
    // Breadcrumbs
    updateBreadcrumbs('gallery');
    
    // Performance tracking
    setupPerformanceTracking();
    
    // Monitor for language changes
    if (window.state) {
        let lastLang = window.state.currentLanguage;
        setInterval(() => {
            if (window.state.currentLanguage !== lastLang) {
                console.log('Language changed, updating SEO elements...');
                updateOpenGraph();
                injectAdvancedJSONLD();
                updateBreadcrumbs('gallery');
                lastLang = window.state.currentLanguage;
            }
        }, 1000);
    }
    
    console.log('✅ SEO Enhancements v2.1.0 initialized complete');
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
window.injectAdvancedJSONLD = injectAdvancedJSONLD;
window.setupAdvancedLazyLoading = setupAdvancedLazyLoading;
