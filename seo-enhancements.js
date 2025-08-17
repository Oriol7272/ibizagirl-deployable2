// ============================
// SEO ENHANCEMENTS v3.0.0 - COMPLETAMENTE CORREGIDO
// Lazy Loading + Open Graph + JSON-LD + Performance
// FIXED: Rutas de imágenes, manejo de errores, JSON-LD mejorado
// ============================

// ============================
// LAZY LOADING MEJORADO v3.0
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
                
                // Manejar rutas de imagen correctamente
                let imageSrc = img.dataset.src;
                
                // Asegurar que la ruta sea correcta
                if (!imageSrc.startsWith('http') && !imageSrc.startsWith('/')) {
                    // Si no tiene protocolo ni slash inicial, es una ruta relativa
                    if (!imageSrc.includes('/')) {
                        // Si no tiene carpeta, asumir que está en 'full/'
                        imageSrc = 'full/' + imageSrc;
                    }
                }
                
                // Soporte para WEBP con fallback
                if (supportsWebP()) {
                    const webpSrc = imageSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                    if (webpSrc !== imageSrc) {
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
                            loadOriginalImage(img, imageSrc);
                        };
                        webpImg.src = webpSrc;
                    } else {
                        loadOriginalImage(img, imageSrc);
                    }
                } else {
                    loadOriginalImage(img, imageSrc);
                }
                
                observer.unobserve(img);
            }
        });
    }, lazyImageOptions);

    // Función auxiliar para cargar imagen original con mejor manejo de rutas
    function loadOriginalImage(img, src) {
        if (!img || !src) {
            return;
        }
        
        const tempImg = new Image();
        
        tempImg.onload = () => {
            img.src = src;
            img.classList.remove('skeleton', 'lazy');
            img.classList.add('loaded');
            if (img.dataset && img.dataset.src) {
                delete img.dataset.src;
            }
            
            // Track performance
            if (window.trackEvent) {
                window.trackEvent('image_loaded', {
                    src: src,
                    loading_method: 'lazy',
                    supports_webp: supportsWebP()
                });
            }
        };
        
        tempImg.onerror = () => {
            console.warn('Failed to load image:', src);
            img.classList.remove('skeleton', 'lazy');
            img.classList.add('error');
            
            // Try fallback image con ruta correcta
            handleImageFallback(img, src);
        };
        
        tempImg.src = src;
    }
    
    // Función mejorada para manejar fallback de imágenes
    function handleImageFallback(img, originalSrc) {
        const fallbackImages = [
            'full/bikini.webp',
            '/full/bikini.webp',
            'full/bikini.jpg',
            '/full/bikini.jpg'
        ];
        
        let fallbackIndex = 0;
        
        function tryNextFallback() {
            if (fallbackIndex >= fallbackImages.length) {
                // Si todos los fallbacks fallan, crear un placeholder visual
                createVisualPlaceholder(img);
                return;
            }
            
            const fallbackSrc = fallbackImages[fallbackIndex++];
            const testImg = new Image();
            
            testImg.onload = () => {
                img.src = fallbackSrc;
                img.classList.add('fallback-loaded');
            };
            
            testImg.onerror = () => {
                tryNextFallback();
            };
            
            testImg.src = fallbackSrc;
        }
        
        // No intentar fallback si ya es una imagen de fallback
        if (!originalSrc.includes('bikini')) {
            tryNextFallback();
        } else {
            createVisualPlaceholder(img);
        }
    }
    
    // Crear placeholder visual cuando todas las imágenes fallan
    function createVisualPlaceholder(img) {
        img.style.cssText = `
            background: linear-gradient(45deg, #0077be, #00d4ff);
            display: block;
            min-height: 200px;
            object-fit: cover;
            width: 100%;
            height: 100%;
            position: relative;
        `;
        
        // Añadir icono de imagen
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 48px;
            opacity: 0.5;
        `;
        placeholder.innerHTML = '🖼️';
        
        if (img.parentElement) {
            img.parentElement.style.position = 'relative';
            img.parentElement.appendChild(placeholder);
        }
        
        img.alt = 'Content unavailable';
        img.removeAttribute('src');
    }

    // Observer para videos con preload optimizado
    const videoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                const source = video.querySelector('source[data-src]');
                
                if (source && source.dataset.src) {
                    // Manejar rutas de video correctamente
                    let videoSrc = source.dataset.src;
                    
                    if (!videoSrc.startsWith('http') && !videoSrc.startsWith('/')) {
                        if (!videoSrc.includes('/')) {
                            videoSrc = 'uncensored-videos/' + videoSrc;
                        }
                    }
                    
                    source.src = videoSrc;
                    delete source.dataset.src;
                    video.load();
                    
                    video.addEventListener('loadedmetadata', () => {
                        video.classList.remove('skeleton', 'lazy');
                        video.classList.add('loaded');
                        
                        // Performance tracking
                        if (window.trackEvent) {
                            window.trackEvent('video_loaded', {
                                src: videoSrc,
                                duration: video.duration,
                                loading_method: 'lazy'
                            });
                        }
                    }, { once: true });
                    
                    video.addEventListener('error', () => {
                        console.warn('Failed to load video:', videoSrc);
                        video.classList.remove('skeleton', 'lazy');
                        video.classList.add('error');
                        handleVideoFallback(video);
                    }, { once: true });
                }
                
                observer.unobserve(video);
            }
        });
    }, lazyVideoOptions);
    
    // Función para manejar fallback de videos
    function handleVideoFallback(video) {
        // Reemplazar con imagen estática
        const img = document.createElement('img');
        img.src = 'full/bikini.webp';
        img.className = video.className;
        img.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: cover;
        `;
        img.alt = 'Video preview unavailable';
        
        if (video.parentNode) {
            video.parentNode.replaceChild(img, video);
        }
    }

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
            let imageSrc = img.dataset.src;
            
            // Asegurar ruta correcta
            if (!imageSrc.startsWith('http') && !imageSrc.startsWith('/')) {
                if (!imageSrc.includes('/')) {
                    imageSrc = 'full/' + imageSrc;
                }
            }
            
            const tempImg = new Image();
            tempImg.onload = () => {
                img.src = imageSrc;
                img.classList.remove('skeleton');
                delete img.dataset.src;
            };
            tempImg.onerror = () => {
                // Use fallback on error
                img.src = 'full/bikini.webp';
                img.classList.remove('skeleton');
                delete img.dataset.src;
            };
            tempImg.src = imageSrc;
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
        image: 'https://ibizagirl.pics/full/bikini.webp',
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
        { property: 'og:image:type', content: 'image/webp' },
        
        // Para Pinterest
        { name: 'pinterest-rich-pin', content: 'true' },
        { name: 'pinterest:description', content: data.description },
        
        // Dublin Core
        { name: 'DC.title', content: data.title },
        { name: 'DC.description', content: data.description },
        { name: 'DC.language', content: lang }
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
    canonical.href = data.url.split('?')[0]; // Remove query parameters for canonical
    
    // Añadir alternate languages
    updateAlternateLanguages();
}

// Función para actualizar enlaces de idiomas alternativos
function updateAlternateLanguages() {
    const languages = ['es', 'en', 'fr', 'de', 'it', 'pt'];
    const currentUrl = window.location.href.split('?')[0];
    
    languages.forEach(lang => {
        let alternate = document.querySelector(`link[hreflang="${lang}"]`);
        if (!alternate) {
            alternate = document.createElement('link');
            alternate.rel = 'alternate';
            alternate.hreflang = lang;
            document.head.appendChild(alternate);
        }
        alternate.href = `${currentUrl}?lang=${lang}`;
    });
    
    // x-default
    let defaultLang = document.querySelector('link[hreflang="x-default"]');
    if (!defaultLang) {
        defaultLang = document.createElement('link');
        defaultLang.rel = 'alternate';
        defaultLang.hreflang = 'x-default';
        document.head.appendChild(defaultLang);
    }
    defaultLang.href = currentUrl;
}

// ============================
// JSON-LD AVANZADO CORREGIDO
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
        ],
        "hasPart": {
            "@type": "WebPageElement",
            "isAccessibleForFree": false,
            "cssSelector": ".content-section"
        }
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
            "url": "https://ibizagirl.pics/full/bikini.webp",
            "width": 1200,
            "height": 630,
            "caption": "IbizaGirl.pics Logo"
        },
        "image": [
            "https://ibizagirl.pics/full/bikini.webp",
            "https://ibizagirl.pics/full/bikbanner.webp"
        ],
        "sameAs": [
            "https://instagram.com/ibizagirl.pics",
            "https://tiktok.com/@ibizagirl.pics",
            "https://twitter.com/ibizagirlpics"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": ["Spanish", "English", "French", "German", "Italian", "Portuguese"],
            "email": "contact@ibizagirl.pics"
        },
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "ES",
            "addressRegion": "Islas Baleares",
            "addressLocality": "Ibiza"
        }
    };

    // Schema de galería de imágenes mejorado
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
                "url": "https://ibizagirl.pics/full/bikini.webp",
                "caption": trans.seo_keywords?.primary || "Ibiza paradise gallery",
                "width": 1200,
                "height": 800,
                "encodingFormat": "image/webp"
            },
            "lastReviewed": new Date().toISOString()
        },
        "numberOfItems": window.state?.dailyContent ? 
            window.state.dailyContent.photos.length + window.state.dailyContent.videos.length : 
            480,
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
        "keywords": trans.seo_keywords?.primary || "ibiza photos gallery premium content",
        "author": {
            "@type": "Organization",
            "@id": "https://ibizagirl.pics/#organization"
        },
        "publisher": {
            "@type": "Organization",
            "@id": "https://ibizagirl.pics/#organization"
        },
        "copyrightHolder": {
            "@type": "Organization",
            "@id": "https://ibizagirl.pics/#organization"
        },
        "copyrightYear": 2025,
        "license": "https://ibizagirl.pics/terms"
    };

    // Schema de destino turístico mejorado
    const touristDestinationSchema = {
        "@context": "https://schema.org",
        "@type": "TouristDestination",
        "name": "Ibiza Paradise Beaches",
        "description": "Las mejores playas y calas de Ibiza capturadas en nuestra galería premium",
        "url": "https://ibizagirl.pics/",
        "image": [
            "https://ibizagirl.pics/full/bikbanner.webp",
            "https://ibizagirl.pics/full/bikbanner2.webp"
        ],
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
        "touristType": ["Beach Lover", "Photography Enthusiast", "Nature Lover", "Luxury Travel"],
        "includesAttraction": [
            {
                "@type": "TouristAttraction",
                "name": "Playa de Ses Illetes",
                "description": "Una de las playas más hermosas de Ibiza",
                "image": "https://ibizagirl.pics/full/bikini.webp"
            },
            {
                "@type": "TouristAttraction", 
                "name": "Cala Comte",
                "description": "Famosa por sus increíbles atardeceres",
                "image": "https://ibizagirl.pics/full/bikini3.webp"
            },
            {
                "@type": "TouristAttraction",
                "name": "Cala Bassa",
                "description": "Aguas cristalinas y arena blanca",
                "image": "https://ibizagirl.pics/full/bikini5.webp"
            }
        ],
        "publicAccess": true,
        "isAccessibleForFree": false,
        "currenciesAccepted": "EUR",
        "paymentAccepted": "Cash, Credit Card, PayPal"
    };

    // Schema de producto/servicio mejorado
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
            "name": "Worldwide"
        },
        "audience": {
            "@type": "Audience",
            "audienceType": "Adults 18+",
            "geographicArea": {
                "@type": "AdministrativeArea",
                "name": "Global"
            }
        },
        "offers": [
            {
                "@type": "Offer",
                "name": "VIP Lifetime Access",
                "description": "Acceso de por vida a toda la galería premium",
                "price": "100.00",
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock",
                "validFrom": "2025-01-15",
                "url": "https://ibizagirl.pics/main.html",
                "priceValidUntil": "2025-12-31",
                "category": "Premium Subscription"
            },
            {
                "@type": "Offer",
                "name": "VIP Monthly Access",
                "description": "Acceso mensual a toda la galería premium",
                "price": "15.00",
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock",
                "validFrom": "2025-01-15",
                "url": "https://ibizagirl.pics/main.html",
                "category": "Monthly Subscription"
            },
            {
                "@type": "AggregateOffer",
                "name": "Mega Packs",
                "description": "Paquetes de contenido con descuento",
                "lowPrice": "10.00",
                "highPrice": "50.00",
                "priceCurrency": "EUR",
                "offerCount": 4,
                "offers": [
                    {
                        "@type": "Offer",
                        "name": "Starter Pack",
                        "price": "10.00",
                        "priceCurrency": "EUR"
                    },
                    {
                        "@type": "Offer",
                        "name": "Gold Pack",
                        "price": "50.00",
                        "priceCurrency": "EUR"
                    }
                ]
            }
        ],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "bestRating": "5",
            "worstRating": "1",
            "ratingCount": "2847"
        }
    };

    // BreadcrumbList Schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Inicio",
                "item": "https://ibizagirl.pics/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Galería Premium",
                "item": "https://ibizagirl.pics/main.html"
            }
        ]
    };

    // FAQPage Schema
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "¿Cuánto contenido nuevo se añade diariamente?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Añadimos más de 200 fotos y 40 videos HD nuevos cada día, actualizados a las 3:00 AM hora española."
                }
            },
            {
                "@type": "Question",
                "name": "¿Qué incluye la suscripción VIP?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "La suscripción VIP incluye acceso ilimitado a todo el contenido actual y futuro, sin publicidad, soporte prioritario y contenido exclusivo VIP."
                }
            },
            {
                "@type": "Question",
                "name": "¿Cuáles son los métodos de pago aceptados?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Aceptamos PayPal, tarjetas de crédito y débito a través de PayPal."
                }
            }
        ]
    };

    // Inyectar todos los schemas
    const schemas = [
        websiteSchema,
        organizationSchema,
        imageGallerySchema,
        touristDestinationSchema,
        serviceSchema,
        breadcrumbSchema,
        faqSchema
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

    console.log('✅ Advanced JSON-LD schemas injected (7 schemas)');
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
                    
                    // Periodic Background Sync (si está soportado)
                    if ('periodicSync' in registration) {
                        registration.periodicSync.register('content-update', {
                            minInterval: 24 * 60 * 60 * 1000 // 24 horas
                        }).catch(err => {
                            console.log('Periodic sync registration failed:', err);
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
        animation: slideUp 0.3s ease;
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
    let breadcrumbContainer = document.querySelector('.breadcrumb');
    
    // Crear contenedor si no existe
    if (!breadcrumbContainer) {
        breadcrumbContainer = document.createElement('nav');
        breadcrumbContainer.className = 'breadcrumb';
        breadcrumbContainer.setAttribute('aria-label', 'Breadcrumb');
        breadcrumbContainer.style.cssText = `
            padding: 1rem 2rem;
            background: rgba(0, 119, 190, 0.1);
            border-bottom: 1px solid rgba(127, 219, 255, 0.3);
            margin-top: 80px;
        `;
        
        const mainContainer = document.querySelector('.main-container');
        if (mainContainer) {
            mainContainer.insertBefore(breadcrumbContainer, mainContainer.firstChild);
        }
    }

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

    const breadcrumbHTML = `
        <ol itemscope itemtype="https://schema.org/BreadcrumbList" style="
            list-style: none;
            display: flex;
            gap: 1rem;
            margin: 0;
            padding: 0;
            color: var(--text-secondary);
        ">
            ${breadcrumbs.map(crumb => `
                <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                    ${crumb.url ? 
                        `<a itemprop="item" href="${crumb.url}" style="color: var(--aqua-light); text-decoration: none;">
                            <span itemprop="name">${crumb.name}</span>
                        </a>` :
                        `<span itemprop="name">${crumb.name}</span>`
                    }
                    <meta itemprop="position" content="${crumb.position}">
                    ${crumb.position < breadcrumbs.length ? ' › ' : ''}
                </li>
            `).join('')}
        </ol>
    `;

    breadcrumbContainer.innerHTML = breadcrumbHTML;
}

// ============================
// PERFORMANCE MONITORING MEJORADO
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
                            value: Math.round(lastEntry.startTime),
                            element: lastEntry.element?.tagName || 'unknown',
                            url: lastEntry.url || 'none'
                        });
                    }
                    console.log('📊 LCP:', Math.round(lastEntry.startTime), 'ms');
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
                    const fid = entry.processingStart - entry.startTime;
                    if (window.trackEvent) {
                        window.trackEvent('fid_measured', { 
                            value: Math.round(fid),
                            name: entry.name
                        });
                    }
                    console.log('📊 FID:', Math.round(fid), 'ms');
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
                let clsEntries = [];
                
                const clsObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                            clsEntries.push(entry);
                        }
                    }
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
                
                // Report CLS when page is hidden
                document.addEventListener('visibilitychange', () => {
                    if (document.visibilityState === 'hidden') {
                        if (window.trackEvent && clsValue > 0) {
                            window.trackEvent('cls_measured', { 
                                value: Math.round(clsValue * 1000) / 1000,
                                shifts: clsEntries.length
                            });
                        }
                        console.log('📊 CLS:', Math.round(clsValue * 1000) / 1000);
                    }
                });
            } catch (e) {
                console.log('CLS observer setup failed:', e.message);
            }
        }
        
        // TTFB (Time to First Byte)
        try {
            const navigationEntry = performance.getEntriesByType('navigation')[0];
            if (navigationEntry) {
                const ttfb = navigationEntry.responseStart - navigationEntry.fetchStart;
                if (window.trackEvent) {
                    window.trackEvent('ttfb_measured', { 
                        value: Math.round(ttfb)
                    });
                }
                console.log('📊 TTFB:', Math.round(ttfb), 'ms');
            }
        } catch (e) {
            console.log('TTFB measurement failed');
        }
    }
    
    // Web Vitals Report
    if (window.addEventListener) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                reportWebVitals();
            }, 5000);
        });
    }
}

// Función para reportar Web Vitals
function reportWebVitals() {
    if (!performance || !performance.getEntriesByType) return;
    
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    
    const vitals = {
        domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
        loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
        firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime,
        firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime,
        resources: performance.getEntriesByType('resource').length
    };
    
    console.log('📊 Web Vitals:', vitals);
    
    if (window.trackEvent) {
        window.trackEvent('web_vitals', vitals);
    }
}

// ============================
// PRELOAD CRÍTICO
// ============================

function preloadCriticalResources() {
    const criticalResources = [
        { href: '/full/bikini.webp', as: 'image', type: 'image/webp' },
        { href: '/full/bikbanner.webp', as: 'image', type: 'image/webp' },
        { href: '/styles.css', as: 'style' },
        { href: '/main-script.js', as: 'script' }
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        if (resource.type) {
            link.type = resource.type;
        }
        document.head.appendChild(link);
    });
}

// ============================
// INICIALIZACIÓN GLOBAL
// ============================

function initializeSEOEnhancements() {
    console.log('🚀 Initializing SEO Enhancements v3.0.0 FIXED...');
    
    try {
        // Preload crítico
        preloadCriticalResources();
        
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
        // Continuar con la página aunque falle el SEO
    }
}

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSEOEnhancements);
} else {
    // DOM ya está listo
    setTimeout(initializeSEOEnhancements, 100);
}

// Exponer funciones globales
window.updateOpenGraph = updateOpenGraph;
window.updateBreadcrumbs = updateBreadcrumbs;
window.updateApp = updateApp;
window.initializeSEOEnhancements = initializeSEOEnhancements;
window.reportWebVitals = reportWebVitals;
window.supportsWebP = supportsWebP;

console.log('✅ SEO Enhancements v3.0.0 script loaded');
