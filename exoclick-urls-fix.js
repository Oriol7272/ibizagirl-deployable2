// exoclick-urls-fix.js v2.0 - Auto-fix para URLs de ExoClick
// Corrige automáticamente las URLs incorrectas de ExoClick

(function() {
    'use strict';
    
    console.log('🔧 ExoClick URLs Auto-Fix v2.0 iniciando...');
    
    // Configuración
    const CONFIG = {
        correctUrl: 'https://syndication.exoclick.com/iframe.php',
        incorrectPatterns: [
            'ads-iframe.php',
            'ads_iframe.php',
            'ad-iframe.php',
            'adsframe.php'
        ],
        zoneId: 5696328,
        checkInterval: 2000,
        maxRetries: 5,
        debug: true
    };
    
    let fixCount = 0;
    let checkCount = 0;
    
    // Función principal de corrección
    function fixExoClickUrls() {
        const iframes = document.querySelectorAll('iframe');
        let fixed = 0;
        
        iframes.forEach(iframe => {
            const src = iframe.src;
            
            // Verificar si es un iframe de ExoClick con URL incorrecta
            if (src && src.includes('exoclick.com')) {
                let needsFix = false;
                
                // Comprobar patrones incorrectos
                CONFIG.incorrectPatterns.forEach(pattern => {
                    if (src.includes(pattern)) {
                        needsFix = true;
                    }
                });
                
                // También verificar iframes sin src o con about:blank
                if (!src || src === 'about:blank' || src === '') {
                    // Verificar si el iframe tiene atributos que indiquen que es de ExoClick
                    const parent = iframe.parentElement;
                    if (parent && (parent.className.includes('exoclick') || 
                                  parent.id.includes('exoclick'))) {
                        needsFix = true;
                    }
                }
                
                if (needsFix) {
                    // Construir URL correcta
                    let newSrc = `${CONFIG.correctUrl}?idzone=${CONFIG.zoneId}`;
                    
                    // Intentar extraer el zone ID de la URL incorrecta
                    const zoneMatch = src.match(/idzone=(\d+)/);
                    if (zoneMatch) {
                        newSrc = `${CONFIG.correctUrl}?idzone=${zoneMatch[1]}`;
                    }
                    
                    // Añadir parámetros adicionales si existen
                    if (src.includes('&')) {
                        const params = src.split('&').slice(1).join('&');
                        newSrc += '&' + params;
                    }
                    
                    // Añadir timestamp para evitar caché
                    newSrc += `&t=${Date.now()}`;
                    
                    // Aplicar la corrección
                    iframe.src = newSrc;
                    
                    // Aplicar estilos para asegurar visibilidad
                    iframe.style.cssText = `
                        width: 100% !important;
                        min-height: 250px !important;
                        display: block !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                        border: none !important;
                    `;
                    
                    fixed++;
                    fixCount++;
                    
                    if (CONFIG.debug) {
                        console.log(`✅ ExoClick iframe URL corregida: ${newSrc}`);
                    }
                    
                    // Añadir listener para manejar errores de carga
                    iframe.onerror = function() {
                        console.error(`❌ Error cargando iframe ExoClick: ${newSrc}`);
                        // Reintentar con URL alternativa
                        setTimeout(() => {
                            iframe.src = `${CONFIG.correctUrl}?idzone=${CONFIG.zoneId}&retry=${Date.now()}`;
                        }, 2000);
                    };
                    
                    iframe.onload = function() {
                        console.log(`✅ iframe ExoClick cargado correctamente`);
                    };
                }
            }
        });
        
        if (fixed > 0) {
            console.log(`🔧 ${fixed} URLs de ExoClick corregidas`);
        }
        
        return fixed;
    }
    
    // Función para crear iframes de emergencia si no existen
    function createEmergencyExoClickAds() {
        const positions = ['header', 'sidebar', 'footer'];
        let created = 0;
        
        positions.forEach(position => {
            // Buscar contenedor de ExoClick para esta posición
            const container = document.querySelector(`.ad-exoclick.ad-${position}`) ||
                            document.querySelector(`#ad-exoclick-${position}-${CONFIG.zoneId}`);
            
            if (container) {
                // Verificar si ya tiene un iframe
                const existingIframe = container.querySelector('iframe');
                
                if (!existingIframe) {
                    // Crear nuevo iframe
                    const iframe = document.createElement('iframe');
                    iframe.src = `${CONFIG.correctUrl}?idzone=${CONFIG.zoneId}&pos=${position}&t=${Date.now()}`;
                    iframe.style.cssText = `
                        width: 100% !important;
                        min-height: ${position === 'sidebar' ? '250px' : '90px'} !important;
                        display: block !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                        border: none !important;
                    `;
                    iframe.setAttribute('scrolling', 'no');
                    iframe.setAttribute('marginwidth', '0');
                    iframe.setAttribute('marginheight', '0');
                    iframe.setAttribute('frameborder', '0');
                    
                    container.appendChild(iframe);
                    created++;
                    
                    console.log(`🚨 iframe de emergencia creado para ExoClick ${position}`);
                }
            }
        });
        
        if (created > 0) {
            console.log(`✅ ${created} iframes de emergencia creados para ExoClick`);
        }
    }
    
    // Observer para detectar nuevos iframes
    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            let hasNewIframes = false;
            
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName === 'IFRAME' || 
                        (node.querySelectorAll && node.querySelectorAll('iframe').length > 0)) {
                        hasNewIframes = true;
                    }
                });
            });
            
            if (hasNewIframes) {
                setTimeout(fixExoClickUrls, 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('👁️ Observer configurado para detectar nuevos iframes');
    }
    
    // Verificación periódica
    function periodicCheck() {
        checkCount++;
        
        if (checkCount <= CONFIG.maxRetries) {
            const fixed = fixExoClickUrls();
            
            // Si no se encontraron iframes, intentar crearlos
            if (fixed === 0 && checkCount === 3) {
                createEmergencyExoClickAds();
            }
            
            // Continuar verificación
            setTimeout(periodicCheck, CONFIG.checkInterval);
        } else {
            console.log(`✅ Verificación de URLs ExoClick completada. Total corregidas: ${fixCount}`);
        }
    }
    
    // Función de diagnóstico
    function diagnosticExoClick() {
        console.log('🔍 Diagnóstico de ExoClick');
        console.log('=========================');
        
        const allIframes = document.querySelectorAll('iframe');
        const exoClickIframes = [];
        
        allIframes.forEach(iframe => {
            if (iframe.src.includes('exoclick') || 
                iframe.parentElement?.className?.includes('exoclick')) {
                exoClickIframes.push({
                    src: iframe.src,
                    visible: iframe.offsetWidth > 0 && iframe.offsetHeight > 0,
                    dimensions: `${iframe.offsetWidth}x${iframe.offsetHeight}`,
                    parent: iframe.parentElement?.id || iframe.parentElement?.className
                });
            }
        });
        
        console.log(`Total iframes ExoClick: ${exoClickIframes.length}`);
        exoClickIframes.forEach((data, i) => {
            console.log(`iframe ${i + 1}:`, data);
        });
        
        // Verificar contenedores vacíos
        const emptyContainers = document.querySelectorAll('.ad-exoclick:not(:has(iframe))');
        if (emptyContainers.length > 0) {
            console.warn(`⚠️ ${emptyContainers.length} contenedores ExoClick sin iframe`);
        }
        
        return exoClickIframes;
    }
    
    // Inicialización
    function init() {
        console.log('🚀 Iniciando corrección automática de URLs ExoClick...');
        
        // Primera corrección inmediata
        fixExoClickUrls();
        
        // Configurar observer
        setupObserver();
        
        // Iniciar verificación periódica
        setTimeout(periodicCheck, CONFIG.checkInterval);
        
        // Exponer funciones globales para debugging
        window.fixExoClickIframes = fixExoClickUrls;
        window.createExoClickAds = createEmergencyExoClickAds;
        window.exoClickDiagnostic = diagnosticExoClick;
    }
    
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM ya está listo
        setTimeout(init, 100);
    }
    
    // También ejecutar cuando la ventana se carga completamente
    window.addEventListener('load', () => {
        setTimeout(() => {
            fixExoClickUrls();
            // Verificación final
            if (document.querySelectorAll('.ad-exoclick iframe').length === 0) {
                console.warn('⚠️ No se detectaron iframes de ExoClick, creando de emergencia...');
                createEmergencyExoClickAds();
            }
        }, 2000);
    });
    
    console.log('✅ ExoClick URLs Fix v2.0 cargado');
    console.log('💡 Comandos disponibles:');
    console.log('   window.fixExoClickIframes() - Corregir URLs manualmente');
    console.log('   window.createExoClickAds() - Crear iframes de emergencia');
    console.log('   window.exoClickDiagnostic() - Ejecutar diagnóstico');
    
})();
