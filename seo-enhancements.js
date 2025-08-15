// ============================
// SEO ENHANCEMENTS v2.1.0 - FIXED
// Lazy Loading + Open Graph + JSON-LD + Performance
// ============================

// ============================
// LAZY LOADING MEJORADO v2.1
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
                
                // Solo procesar si tiene data-src
                if (!img.dataset.src) {
                    observer.unobserve(img);
                    return;
                }
                
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
                            delete img.dataset.src;
                        };
                        webpImg.onerror = () => {
                            // Fallback a formato original
                            loadOriginalImage(img);
                        };
                        webpImg.src = webpSrc;
                    } else {
                        loadOriginalImage(img);
                    }
                } else {
                    loadOriginalImage(img);
                }
                
                observer.unobserve(img);
            }
        });
    }, lazyImageOptions);

    // Función auxiliar para cargar imagen original
    function loadOriginalImage(img) {
        if (!img || !img.dataset || !img.dataset.src) {
            return;
        }
        
        const tempImg = new Image();
        
        tempImg.onload = () => {
            img.src = img.dataset.src;
            img.classList.remove('skeleton', 'lazy');
            img.classList.add('loaded');
            delete img.dataset.src;
            
            // Track performance
            if (window.trackEvent) {
                window.trackEvent('image_loaded', {
                    src: img.src,
                    loading_method: 'lazy',
                    supports_webp: supportsWebP()
                });
            }
        };
        
        tempImg.onerror = () => {
            console.warn('Failed to load image:', img.dataset.src);
            img.classList.remove('skeleton', 'lazy');
            img.classList.add('error');
            
            // Try fallback image - RUTA CORREGIDA
            if (!img.src || img.src.includes('data:')) {
                img.src = 'full/bikini.jpg';
            }
        };
        
        tempImg.src = img.dataset.src;
    }

    // Observer para videos con preload optimizado
    const videoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                const source = video.querySelector('source[data-src]');
                
                if (source && source.dataset.src) {
                    source.src = source.dataset.src;
                    delete source.dataset.src;
                    video.load();
                    
                    video.addEventListener('loadedmetadata', () => {
                        video.classList.remove('skeleton', 'lazy');
                        video.classList.add('loaded');
                        
                        // Performance tracking
                        if (window.trackEvent) {
                            window.trackEvent('video_loaded', {
                                src: source.src,
                                duration: video.duration,
                                loading_method: 'lazy'
                            });
                        }
                    }, { once: true });
                    
                    video.addEventListener('error', () => {
                        console.warn('Failed to load video:', source.src);
                        video.classList.remove('skeleton', 'lazy');
                        video.classList.add('error');
                    }, { once: true });
                }
                
                observer.unobserve(video);
            }
        });
    }, lazyVideoOptions);

    // Aplicar observers solo a elementos con data-src
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length > 0) {
        lazyImages.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
        console.log(`🖼️ Lazy loading setup for ${lazyImages.length} images`);
    }

    const lazyVideos = document.querySelectorAll('video source[data-src]');
    if (lazyVideos.length > 0) {
        lazyVideos.forEach(source => {
            const video = source.parentElement;
            if (video) {
                video.classList.add('lazy');
                videoObserver.observe(video);
            }
        });
        console.log(`🎬 Lazy loading setup for ${lazyVideos.length} videos`);
    }

    // Progressive loading para crítico above-the-fold
    loadCriticalImages();
    
    return { imageObserver, videoObserver };
}

// Detectar soporte WEBP
function supportsWebP() {
    if (typeof supportsWebP.result === 'undefined') {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            supportsWebP.result = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        } catch(e) {
            supportsWebP.result = false;
        }
    }
    return supportsWebP.result;
}

// Cargar imágenes críticas inmediatamente - RUTAS CORREGIDAS
function loadCriticalImages() {
    const criticalImages = document.querySelectorAll('.banner-slide img, .teaser-item img');
    criticalImages.forEach(img => {
        // Solo procesar si tiene data-src
        if (img.dataset && img.dataset.src) {
            const tempImg = new Image();
            tempImg.onload = () => {
                img.src = img.dataset.src;
                img.classList.remove('skeleton');
                delete img.dataset.src;
            };
            tempImg.onerror = () => {
                // Use fallback on error - RUTA CORREGIDA
                img.src = 'full/bikini.jpg';
                img.classList.remove('skeleton');
                delete img.dataset.src;
            };
            tempImg.src = img.dataset.src;
        }
    });
}

// ============================
// OPEN GRAPH DINÁMICO
// ============================

function updateOpenGraph(contentData = {}) {
    const lang = window.state?.currentLanguage || 'es';
    const trans = window.TRANSLATIONS?.[lang] || {};
    
    const defaultData = {
        title: trans.photos_seo_title || 'IbizaGirl.pics - Galería Premium Ibiza | 400+ Fotos Diarias',
        description: trans.meta_description || 'Galería premium de Ibiza con 400+ fotos y 80+ videos HD actualizados diariamente.',
        image: 'https://ibizagirl.pics/full/bikini.jpg', // RUTA CORREGIDA
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
        { property: 'og:locale', content: lang === 'es' ? 'es_ES' : 
                                        lang === 'en' ? 'en_US' :
                                        lang === 'fr' ? 'fr_FR' :
                                        lang === 'de' ? 'de_DE' :
                                        lang === 'it' ? 'it_IT' :
                                        lang === 'pt' ? 'pt_PT' : 'es_ES' },
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
        { name: 'pinterest:description', content: data.description }
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
    const lang = window.state?.currentLanguage || 'es';
    const trans = window.TRANSLATIONS?.[lang] || {};
    
    // Schema principal del sitio web - RUTAS CORREGIDAS
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://ibizagirl.pics/#website",
        "name": "IbizaGirl.pics",
        "alternateName": ["Galería Ibiza", "Ibiza Photos", "Paradise Gallery"],
        "description": trans.meta_description || "Galería premium de Ibiza con contenido exclusivo",
        "url": "https://ibizagirl.pics/",
        "inLanguage": lang === 'es' ? 'es-ES' : 
                      lang === 'en' ? 'en-US' :
                      lang === 'fr' ? 'fr-FR' :
                      lang === 'de' ? 'de-DE' :
                      lang === 'it' ? 'it-IT' :
                      lang === 'pt' ? 'pt-PT' : 'es-ES',
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

    // Schema de la organización - RUTAS CORREGIDAS
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": "https://ibizagirl.pics/#organization",
        "name": "IbizaGirl.pics",
        "legalName": "IbizaGirl.pics",
        "url": "https://ibizagirl.pics/",
        "logo": {
            "@type": "ImageObject",
            "url": "https://ibizagirl.pics/full/bikini.jpg",
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
            "availableLanguage": ["Spanish", "English", "French", "German", "Italian", "Portuguese"]
        }
    };

    // Schema de galería de imágenes - RUTAS CORREGIDAS
    const imageGallerySchema = {
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        "@id": "https://ibizagirl.pics/main.html#gallery",
        "name": trans.photos_seo_title || "Galería de Fotos de Ibiza",
        "description": trans.gallery_description || "Colección exclusiva de fotos de Ibiza",
        "url": "https://ibizagirl.pics/main.html",
        "mainEntity": {
            "@type": "WebPage",
            "@id": "https://ibizagirl.pics/main.html#webpage",
            "name": trans.photos_seo_title || "Fotos de Ibiza",
            "description": trans.gallery_description || "Galería premium",
            "primaryImageOfPage": {
                "@type": "ImageObject",
                "url": "https://ibizagirl.pics/full/bikini.jpg",
                "caption": trans.seo_keywords?.primary || "Ibiza paradise gallery",
                "width": 1200,
                "height": 800
            }
        },
        "numberOfItems": window.state?.dailyContent ? window.state.dailyContent.photos.length : 400,
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
        "inLanguage": lang === 'es' ? 'es-ES' : 
                      lang === 'en' ? 'en-US' :
                      lang === 'fr' ? 'fr-FR' :
                      lang === 'de' ? 'de-DE' :
                      lang === 'it' ? 'it-IT' :
                      lang === 'pt' ? 'pt-PT' : 'es-ES',
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

    // Schema de destino turístico - RUTAS CORREGIDAS
    const touristDestinationSchema = {
        "@context": "https://schema.org",
        "@type": "TouristDestination",
        "name": "Ibiza Paradise Beaches",
        "description": "Las mejores playas y calas de Ibiza capturadas en nuestra galería premium",
        "url": "https://ibizagirl.pics/",
        "image": "https://ibizagirl.pics/full/bikbanner.jpg",
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
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('✅ Service Worker registered:', registration);
                    
                    // Manejar actualizaciones
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        if (newWorker) {
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    // Nueva versión disponible
                                    showUpdateNotification();
                                }
                            });
                        }
                    });
                    
                    // Sincronización en background
                    if ('sync' in registration) {
                        registration.sync.register('content-preload').catch(err => {
                            console.log('Background sync registration failed:', err);
                        });
                    }
                })
                .catch(error => {
                    console.warn('Service Worker registration failed:', error);
                });
        });
    } else {
        console.log('Service Worker not supported or not on HTTPS');
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
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #00ff88, #4ade80);
        color: #001f3f;
        padding: 1rem 2rem;
        border-radius: 50px;
        font-weight: 700;
        z-index: 10001;
        box-shadow: 0 10px 30px rgba(0, 255, 136, 0.4);
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

    const lang = window.state?.currentLanguage || 'es';
    const trans = window.TRANSLATIONS?.[lang] || {};
    const breadcrumbs = [
        { name: 'Inicio', url: '/', position: 1 }
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
// PERFORMANCE MONITORING (FIXED)
// ============================

function initPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
        // LCP (Largest Contentful Paint)
        try {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                if (entries.length > 0) {
                    const lastEntry = entries[entries.length - 1];
                    if (window.trackEvent) {
                        window.trackEvent('lcp_measured', { 
                            value: lastEntry.startTime,
                            element: lastEntry.element?.tagName 
                        });
                    }
                }
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            console.log('LCP observer not supported');
        }

        // FID (First Input Delay)
        try {
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (window.trackEvent) {
                        window.trackEvent('fid_measured', { 
                            value: entry.processingStart - entry.startTime,
                            name: entry.name
                        });
                    }
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
            console.log('FID observer not supported');
        }

        // CLS (Cumulative Layout Shift) - Solo si está soportado
        if (PerformanceObserver.supportedEntryTypes && 
            PerformanceObserver.supportedEntryTypes.includes('layout-shift')) {
            try {
                let clsValue = 0;
                const clsObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    }
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
                
                // Report CLS when page is hidden
                document.addEventListener('visibilitychange', () => {
                    if (document.visibilityState === 'hidden' && window.trackEvent) {
                        window.trackEvent('cls_measured', { value: clsValue });
                    }
                });
            } catch (e) {
                console.log('CLS observer setup failed:', e.message);
            }
        }
    }
}

// ============================
// INICIALIZACIÓN GLOBAL
// ============================

function initializeSEOEnhancements() {
    console.log('🚀 Initializing SEO Enhancements v2.1.0 FIXED...');
    
    try {
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
        
        // Performance monitoring
        initPerformanceMonitoring();
        
        console.log('✅ SEO Enhancements initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing SEO Enhancements:', error);
    }
}

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSEOEnhancements);
} else {
    // DOM ya está listo
    initializeSEOEnhancements();
}

// Exponer funciones globales
window.updateOpenGraph = updateOpenGraph;
window.updateBreadcrumbs = updateBreadcrumbs;
window.updateApp = updateApp;
window.initializeSEOEnhancements = initializeSEOEnhancements;

console.log('✅ SEO Enhancements script loaded');
