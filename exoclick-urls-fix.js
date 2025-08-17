// ============================
// EXOCLICK URLS FIX
// Corrección de URLs para evitar errores 404
// ============================

(function() {
    'use strict';
    
    // Configuración corregida de ExoClick
    const EXOCLICK_CONFIG = {
        zones: {
            banner: 5696328  // Tu zona real de ExoClick
        },
        // URLs correctas de ExoClick
        urls: {
            iframe: 'https://syndication.exoclick.com/iframe.php?idzone=',
            script: 'https://syndication.exoclick.com/tag_serve.js?idzone=',
            ads: 'https://a.realsrv.com/ad-provider.js'
        }
    };
    
    // Función para arreglar iframes de ExoClick existentes
    function fixExoClickIframes() {
        const iframes = document.querySelectorAll('iframe[src*="ads-iframe.php"]');
        
        iframes.forEach(iframe => {
            const currentSrc = iframe.src;
            if (currentSrc.includes('idzone=5696328')) {
                // Reemplazar con la URL correcta
                iframe.src = EXOCLICK_CONFIG.urls.iframe + EXOCLICK_CONFIG.zones.banner;
                console.log('✅ ExoClick iframe URL corregida:', iframe.src);
            }
        });
    }
    
    // Función para crear iframe de ExoClick correctamente
    function createExoClickIframe(containerId, zoneId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Limpiar contenedor
        container.innerHTML = '';
        
        // Opción 1: Iframe directo
        const iframe = document.createElement('iframe');
        iframe.src = EXOCLICK_CONFIG.urls.iframe + zoneId;
        iframe.style.cssText = `
            width: 300px !important;
            height: 250px !important;
            border: 0 !important;
            display: block !important;
            margin: 0 auto !important;
        `;
        iframe.setAttribute('scrolling', 'no');
        iframe.setAttribute('frameborder', '0');
        
        // Manejar errores
        iframe.onerror = () => {
            console.warn('⚠️ ExoClick iframe falló, intentando método alternativo');
            createExoClickAlternative(container, zoneId);
        };
        
        container.appendChild(iframe);
    }
    
    // Método alternativo usando script tag
    function createExoClickAlternative(container, zoneId) {
        container.innerHTML = `
            <div id="exoclick-${zoneId}" style="width: 300px; height: 250px; margin: 0 auto;">
                <script type="text/javascript">
                    var ExoLoader = ExoLoader || {
                        addZone: function(id, data) {
                            // ExoClick loader placeholder
                        }
                    };
                    ExoLoader.addZone(${zoneId}, {
                        "type": "banner",
                        "width": "300",
                        "height": "250"
                    });
                </script>
                <script async src="${EXOCLICK_CONFIG.urls.script}${zoneId}"></script>
            </div>
        `;
    }
    
    // Función para verificar y corregir todas las zonas de ExoClick
    function fixAllExoClickZones() {
        // Buscar todos los contenedores de ExoClick
        const exoContainers = document.querySelectorAll('[id*="exoclick"]');
        
        exoContainers.forEach(container => {
            // Verificar si tiene iframe con error
            const iframe = container.querySelector('iframe');
            if (iframe && iframe.src.includes('ads-iframe.php')) {
                // Reemplazar con la URL correcta
                iframe.src = EXOCLICK_CONFIG.urls.iframe + EXOCLICK_CONFIG.zones.banner;
            }
        });
    }
    
    // Interceptar creación de iframes para corregir URLs
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
        const element = originalCreateElement.call(document, tagName);
        
        if (tagName.toLowerCase() === 'iframe') {
            // Interceptar asignación de src
            let _src = '';
            Object.defineProperty(element, 'src', {
                get() {
                    return _src;
                },
                set(value) {
                    // Corregir URL si es de ExoClick
                    if (value && value.includes('ads-iframe.php?idzone=')) {
                        value = value.replace('ads-iframe.php', 'iframe.php');
                        value = value.replace('/ads-iframe.php', '/iframe.php');
                        
                        // Asegurar que use HTTPS y el dominio correcto
                        if (!value.startsWith('http')) {
                            value = 'https://syndication.exoclick.com/iframe.php?idzone=5696328';
                        }
                    }
                    _src = value;
                    this.setAttribute('src', value);
                }
            });
        }
        
        return element;
    };
    
    // Ejecutar correcciones cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                fixExoClickIframes();
                fixAllExoClickZones();
            }, 1000);
        });
    } else {
        setTimeout(() => {
            fixExoClickIframes();
            fixAllExoClickZones();
        }, 1000);
    }
    
    // Monitorear cambios en el DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.tagName === 'IFRAME' && node.src && node.src.includes('ads-iframe.php')) {
                        // Corregir URL inmediatamente
                        node.src = node.src.replace('ads-iframe.php', 'iframe.php');
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Exponer funciones globalmente para debug
    window.fixExoClickIframes = fixExoClickIframes;
    window.fixAllExoClickZones = fixAllExoClickZones;
    window.EXOCLICK_CONFIG = EXOCLICK_CONFIG;
    
    console.log('✅ ExoClick URLs Fix cargado');
    console.log('💡 Usa window.fixExoClickIframes() para corregir manualmente');
    
})();
