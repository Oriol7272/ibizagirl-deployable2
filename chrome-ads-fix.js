// ============================
// CHROME ADS VISIBILITY ENFORCER v2.1 - FIXED WITH REAL IDs
// Fuerza la visibilidad de anuncios en Chrome con zone IDs correctos de dashboards
// ============================

(function() {
    'use strict';
    
    console.log('🔧 Chrome Ads Visibility Enforcer v2.1 - REAL IDs iniciado...');
    
    // Configuración con zone IDs REALES de los dashboards
    const CONFIG = {
        checkInterval: 2000,
        maxAttempts: 15,
        debugMode: false,
        zoneIds: {
            juicyads: {
                header: 1098658,    // 300x50 Mobile Ads (real)
                sidebar: 1098518,   // 300x250 Image (real)
                footer: 1098656,    // 160x600 Skyscraper (real)
                alternate1: 1098519, // 125x125 Img + Title
                alternate2: 1098657  // 125x125 Img + Title
            },
            exoclick: {
                // Solo tenemos 1 zona, usar en todas las posiciones
                header: 5696328,    // 300x250 Banner (única zona)
                sidebar: 5696328,   // Misma zona
                footer: 5696328     // Misma zona
            },
            eroadvertising: {
                ibizagirl: 8177575, // Zone para ibizagirl
                beach: 8179717      // Zone para beach
            }
        }
    };
    
    let attemptCount = 0;
    let observer = null;
    
    // Función principal para forzar visibilidad
    function forceAdVisibility() {
        const selectors = [
            '.ad-container',
            '[id*="ad-"]',
            '[id*="juicyads"]',
            '[id*="exoclick"]',
            '[id*="eroadvertising"]',
            '[id*="ero_"]',
            '.jaads',
            '.adsbyexoclick',
            'ins[data-aid]',
            'ins[data-zoneid]',
            '[id^="ja_"]',
            '[data-exoclick-zoneid]'
        ];
        
        const adElements = document.querySelectorAll(selectors.join(', '));
        
        if (adElements.length === 0) {
            console.warn('⚠️ No se encontraron elementos de anuncios');
            return false;
        }
        
        let fixedCount = 0;
        
        adElements.forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            const needsFix = computedStyle.display === 'none' || 
                            computedStyle.visibility === 'hidden' || 
                            parseFloat(computedStyle.opacity) < 1 ||
                            CONFIG.debugMode;
            
            if (needsFix) {
                // Forzar visibilidad con estilos inline críticos
                element.style.setProperty('display', 'block', 'important');
                element.style.setProperty('visibility', 'visible', 'important');
                element.style.setProperty('opacity', '1', 'important');
                element.style.setProperty('position', 'relative', 'important');
                element.style.setProperty('z-index', '999', 'important');
                element.style.setProperty('overflow', 'visible', 'important');
                element.style.setProperty('transform', 'none', 'important');
                element.style.setProperty('filter', 'none', 'important');
                element.style.setProperty('clip-path', 'none', 'important');
                element.style.setProperty('width', 'auto', 'important');
                element.style.setProperty('height', 'auto', 'important');
                
                // Chrome-specific fixes
                element.style.setProperty('-webkit-transform', 'translateZ(0)', 'important');
                element.style.setProperty('-webkit-backface-visibility', 'visible', 'important');
                element.style.setProperty('backface-visibility', 'visible', 'important');
                element.style.setProperty('will-change', 'auto', 'important');
                
                // Asegurar dimensiones mínimas según posición
                const position = getElementPosition(element);
                applyPositionSpecificStyles(element, position);
                
                fixedCount++;
            }
            
            // Verificar y arreglar iframes dentro del elemento
            const iframes = element.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                iframe.style.setProperty('display', 'block', 'important');
                iframe.style.setProperty('visibility', 'visible', 'important');
                iframe.style.setProperty('opacity', '1', 'important');
                iframe.style.setProperty('position', 'relative', 'important');
                iframe.style.setProperty('z-index', '1000', 'important');
                iframe.style.setProperty('border', 'none', 'important');
                iframe.style.setProperty('width', '100%', 'important');
                iframe.style.setProperty('height', '100%', 'important');
                
                // Asegurar src válido
                if (!iframe.src && iframe.dataset.src) {
                    iframe.src = iframe.dataset.src;
                }
            });
        });
        
        if (fixedCount > 0) {
            console.log(`✅ Visibilidad forzada en ${fixedCount} elementos de anuncios`);
        }
        
        return fixedCount > 0;
    }
    
    // Determinar posición del elemento
    function getElementPosition(element) {
        const id = element.id || '';
        const className = element.className || '';
        
        if (id.includes('header') || className.includes('header')) return 'header';
        if (id.includes('sidebar') || className.includes('sidebar')) return 'sidebar';
        if (id.includes('footer') || className.includes('footer')) return 'footer';
        
        return 'unknown';
    }
    
    // Aplicar estilos específicos por posición
    function applyPositionSpecificStyles(element, position) {
        const styles = {
            header: {
                'max-width': '728px',
                'min-height': '90px',
                'margin': '20px auto',
                'width': '100%'
            },
            sidebar: {
                'width': '300px',
                'min-height': '250px',
                'position': 'fixed',
                'right': '10px',
                'top': '50%',
                'transform': 'translateY(-50%)',
                'z-index': '2000'
            },
            footer: {
                'max-width': '728px',
                'min-height': '90px',
                'margin': '20px auto',
                'width': '100%'
            }
        };
        
        const positionStyles = styles[position];
        if (positionStyles) {
            Object.entries(positionStyles).forEach(([prop, value]) => {
                element.style.setProperty(prop, value, 'important');
            });
        }
        
        // Ajustes para móviles
        if (window.innerWidth <= 768 && position === 'sidebar') {
            element.style.setProperty('position', 'relative', 'important');
            element.style.setProperty('right', 'auto', 'important');
            element.style.setProperty('top', 'auto', 'important');
            element.style.setProperty('transform', 'none', 'important');
            element.style.setProperty('width', '100%', 'important');
            element.style.setProperty('max-width', '300px', 'important');
            element.style.setProperty('margin', '20px auto', 'important');
        }
    }
    
    // Observer inteligente para detectar nuevos elementos
    function setupIntelligentObserver() {
        if (observer) {
            observer.disconnect();
        }
        
        observer = new MutationObserver((mutations) => {
            let adRelatedChange = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            const isAd = isAdElement(node);
                            if (isAd) {
                                console.log('🔄 Nuevo elemento de anuncio detectado:', node.id || node.className);
                                adRelatedChange = true;
                            }
                        }
                    });
                }
                
                // Detectar cambios en atributos de estilo
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                    const target = mutation.target;
                    if (isAdElement(target)) {
                        const computedStyle = window.getComputedStyle(target);
                        if (computedStyle.display === 'none' || 
                            computedStyle.visibility === 'hidden' || 
                            parseFloat(computedStyle.opacity) < 1) {
                            
                            console.log('🎨 Cambio de estilo detectado en:', target.id || target.className);
                            adRelatedChange = true;
                        }
                    }
                }
            });
            
            if (adRelatedChange) {
                console.log('🔄 Cambio en anuncios detectado, aplicando fixes...');
                setTimeout(() => {
                    forceAdVisibility();
                    enforceAdDimensions();
                }, 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class', 'id']
        });
        
        console.log('👁️ Observer inteligente configurado para monitorear cambios');
    }
    
    // Verificar si un elemento es relacionado con anuncios
    function isAdElement(element) {
        if (!element || !element.id && !element.className) return false;
        
        const id = element.id || '';
        const className = element.className.toString() || '';
        
        return id.includes('ad') || 
               className.includes('ad') ||
               id.includes('juicy') || 
               className.includes('juicy') ||
               id.includes('exo') || 
               className.includes('exo') ||
               id.includes('ero') ||
               className.includes('ero') ||
               element.tagName === 'INS' ||
               element.hasAttribute('data-aid') ||
               element.hasAttribute('data-zoneid');
    }
    
    // Forzar dimensiones específicas
    function enforceAdDimensions() {
        const dimensionMap = {
            'header': { width: 728, height: 90 },
            'sidebar': { width: 300, height: 250 },
            'footer': { width: 728, height: 90 }
        };
        
        Object.entries(dimensionMap).forEach(([position, dimensions]) => {
            const containers = document.querySelectorAll(
                `.ad-${position}, #ad-${position}-container, [id*="${position}"][id*="ad"]`
            );
            
            containers.forEach(container => {
                if (container.id && container.id.includes('ad')) {
                    applyPositionSpecificStyles(container, position);
                }
            });
        });
    }
    
    // Diagnóstico mejorado con zone IDs reales
    function runDiagnostics() {
        console.group('🔍 Diagnóstico de Anuncios Chrome v2.1 - IDs REALES');
        
        const report = [];
        const allContainers = document.querySelectorAll('.ad-container, [id*="ad-"]');
        
        allContainers.forEach((container, index) => {
            const rect = container.getBoundingClientRect();
            const computed = window.getComputedStyle(container);
            const iframe = container.querySelector('iframe');
            const ins = container.querySelector('ins');
            const scripts = container.querySelectorAll('script');
            
            // Detectar zone ID
            let zoneId = 'unknown';
            let network = 'unknown';
            
            // JuicyAds zones
            if (container.id.includes('1098658')) { zoneId = '1098658'; network = 'JuicyAds Mobile'; }
            else if (container.id.includes('1098518')) { zoneId = '1098518'; network = 'JuicyAds 300x250'; }
            else if (container.id.includes('1098656')) { zoneId = '1098656'; network = 'JuicyAds Skyscraper'; }
            else if (container.id.includes('1098519')) { zoneId = '1098519'; network = 'JuicyAds 125x125'; }
            else if (container.id.includes('1098657')) { zoneId = '1098657'; network = 'JuicyAds 125x125 #2'; }
            // ExoClick zone (solo 1)
            else if (container.id.includes('5696328')) { zoneId = '5696328'; network = 'ExoClick Banner'; }
            // EroAdvertising zones
            else if (container.id.includes('8177575')) { zoneId = '8177575'; network = 'EroAds ibizagirl'; }
            else if (container.id.includes('8179717')) { zoneId = '8179717'; network = 'EroAds beach'; }
            
            // También verificar atributos
            if (ins) {
                const aid = ins.getAttribute('data-aid');
                if (aid) {
                    zoneId = aid;
                    if (CONFIG.zoneIds.juicyads[Object.keys(CONFIG.zoneIds.juicyads).find(k => CONFIG.zoneIds.juicyads[k] == aid)]) {
                        network = 'JuicyAds';
                    }
                }
            }
            
            const diagnostics = {
                index: index + 1,
                id: container.id || 'sin-id',
                network: network,
                zoneId: zoneId,
                visible: rect.width > 0 && rect.height > 0,
                dimensions: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
                display: computed.display,
                visibility: computed.visibility,
                opacity: computed.opacity,
                zIndex: computed.zIndex,
                hasIframe: !!iframe,
                hasIns: !!ins,
                hasScripts: scripts.length,
                iframeSrc: iframe ? iframe.src.substring(0, 50) + '...' : 'N/A',
                problema: 'OK'
            };
            
            // Detectar problemas
            if (computed.display === 'none') diagnostics.problema = 'display: none';
            else if (computed.visibility === 'hidden') diagnostics.problema = 'visibility: hidden';
            else if (parseFloat(computed.opacity) < 1) diagnostics.problema = `opacity: ${computed.opacity}`;
            else if (rect.width === 0 || rect.height === 0) diagnostics.problema = 'Sin dimensiones';
            else if (!iframe && !ins && scripts.length === 0) diagnostics.problema = 'Sin contenido';
            
            report.push(diagnostics);
        });
        
        console.table(report);
        
        // Resumen por zona
        console.log('🎯 Zone IDs REALES detectados:');
        console.log('JuicyAds:', Object.values(CONFIG.zoneIds.juicyads));
        console.log('ExoClick:', CONFIG.zoneIds.exoclick.header, '(única zona)');
        console.log('EroAdvertising:', Object.values(CONFIG.zoneIds.eroadvertising));
        
        // Estado de redes
        console.log('📡 Estado de redes:');
        console.log(`  JuicyAds: ${document.querySelector('.jaads, [id^="ja_"]') ? '✅' : '❌'}`);
        console.log(`  ExoClick: ${document.querySelector('.adsbyexoclick, [data-zoneid]') ? '✅' : '❌'}`);
        console.log(`  EroAdvertising: ${document.querySelector('[id*="ero_"]') ? '✅' : '❌'}`);
        console.log(`  PopAds: ${window.e494ffb82839a29122608e933394c091 ? '✅' : '❌'}`);
        
        console.groupEnd();
        
        return report;
    }
    
    // Crear contenedores de emergencia con zone IDs correctos
    function createEmergencyAdContainers() {
        console.log('🚨 Creando contenedores de emergencia con IDs REALES...');
        
        const emergencyConfigs = [
            { network: 'juicyads', position: 'header', zoneId: CONFIG.zoneIds.juicyads.header },
            { network: 'juicyads', position: 'sidebar', zoneId: CONFIG.zoneIds.juicyads.sidebar },
            { network: 'juicyads', position: 'footer', zoneId: CONFIG.zoneIds.juicyads.footer },
            { network: 'exoclick', position: 'header', zoneId: CONFIG.zoneIds.exoclick.header },
            { network: 'exoclick', position: 'sidebar', zoneId: CONFIG.zoneIds.exoclick.sidebar },
            { network: 'exoclick', position: 'footer', zoneId: CONFIG.zoneIds.exoclick.footer }
        ];
        
        emergencyConfigs.forEach(config => {
            const containerId = `emergency-${config.network}-${config.position}-${config.zoneId}`;
            
            if (document.getElementById(containerId)) return;
            
            const container = document.createElement('div');
            container.id = containerId;
            container.className = `ad-container emergency-ad ad-${config.position}`;
            
            const iframeUrl = config.network === 'juicyads' ? 
                `https://www.juicyads.com/iframe_mobile.php?adzone=${config.zoneId}` :
                `https://syndication.exoclick.com/ads-iframe.php?idzone=${config.zoneId}`;
            
            container.innerHTML = `
                <iframe 
                    src="${iframeUrl}"
                    width="100%" 
                    height="${config.position === 'sidebar' ? '250' : '90'}"
                    scrolling="no"
                    frameborder="0"
                    style="border:0; display:block !important; visibility:visible !important;">
                </iframe>
            `;
            
            // Aplicar estilos específicos
            applyPositionSpecificStyles(container, config.position);
            
            // Insertar en DOM
            if (config.position === 'header') {
                const header = document.querySelector('.main-header');
                if (header && header.parentNode) {
                    header.parentNode.insertBefore(container, header.nextSibling);
                } else {
                    document.body.insertBefore(container, document.body.firstChild);
                }
            } else if (config.position === 'footer') {
                const footer = document.querySelector('.main-footer');
                if (footer && footer.parentNode) {
                    footer.parentNode.insertBefore(container, footer);
                } else {
                    document.body.appendChild(container);
                }
            } else {
                document.body.appendChild(container);
            }
            
            console.log(`✅ Contenedor de emergencia creado: ${config.network} ${config.position} (${config.zoneId})`);
        });
    }
    
    // Verificar zone IDs
    function checkZoneIds() {
        console.group('🔍 Verificación de Zone IDs REALES');
        
        const containers = document.querySelectorAll('.ad-container, [id*="ad-"]');
        const foundZones = {
            juicyads: [],
            exoclick: [],
            eroadvertising: []
        };
        
        containers.forEach(container => {
            const id = container.id;
            const ins = container.querySelector('ins[data-aid]');
            const iframe = container.querySelector('iframe');
            
            // JuicyAds zones
            if (ins && ins.getAttribute('data-aid')) {
                const zoneId = ins.getAttribute('data-aid');
                foundZones.juicyads.push(zoneId);
            }
            
            // ExoClick zones
            if (iframe && iframe.src.includes('idzone=')) {
                const match = iframe.src.match(/idzone=(\d+)/);
                if (match) {
                    foundZones.exoclick.push(match[1]);
                }
            }
            
            // EroAdvertising zones
            if (id.includes('ero_')) {
                const match = id.match(/ero_(\d+)/);
                if (match) {
                    foundZones.eroadvertising.push(match[1]);
                }
            }
            
            // From container ID
            const zoneMatch = id.match(/(\d{7})/);
            if (zoneMatch) {
                const zoneId = zoneMatch[1];
                if (Object.values(CONFIG.zoneIds.juicyads).includes(parseInt(zoneId))) {
                    foundZones.juicyads.push(zoneId);
                } else if (Object.values(CONFIG.zoneIds.exoclick).includes(parseInt(zoneId))) {
                    foundZones.exoclick.push(zoneId);
                } else if (Object.values(CONFIG.zoneIds.eroadvertising).includes(parseInt(zoneId))) {
                    foundZones.eroadvertising.push(zoneId);
                }
            }
        });
        
        console.log('📊 Zone IDs encontrados:');
        console.log('  JuicyAds:', [...new Set(foundZones.juicyads)]);
        console.log('  ExoClick:', [...new Set(foundZones.exoclick)]);
        console.log('  EroAdvertising:', [...new Set(foundZones.eroadvertising)]);
        
        console.log('🎯 Zone IDs configurados (REALES):');
        console.log('  JuicyAds:', Object.values(CONFIG.zoneIds.juicyads));
        console.log('  ExoClick:', Object.values(CONFIG.zoneIds.exoclick));
        console.log('  EroAdvertising:', Object.values(CONFIG.zoneIds.eroadvertising));
        
        console.groupEnd();
        
        return foundZones;
    }
    
    // Función principal de inicialización
    function initialize() {
        console.log('🚀 Inicializando Chrome Ads Visibility Enforcer v2.1...');
        console.log('🎯 Zone IDs REALES configurados:', CONFIG.zoneIds);
        
        // Primera ejecución inmediata
        forceAdVisibility();
        enforceAdDimensions();
        
        // Configurar observer inteligente
        setupIntelligentObserver();
        
        // Ejecutar periódicamente con zone IDs correctos
        const interval = setInterval(() => {
            attemptCount++;
            console.log(`🔄 Intento ${attemptCount}/${CONFIG.maxAttempts} - Zone IDs REALES`);
            
            forceAdVisibility();
            enforceAdDimensions();
            
            if (attemptCount >= CONFIG.maxAttempts) {
                clearInterval(interval);
                console.log('✅ Chrome Ads Visibility Enforcer completado');
                
                // Diagnóstico final
                setTimeout(() => {
                    runDiagnostics();
                }, 2000);
            }
        }, CONFIG.checkInterval);
        
        // Verificación post-carga
        window.addEventListener('load', () => {
            setTimeout(() => {
                console.log('🔄 Verificación post-carga con zone IDs REALES...');
                forceAdVisibility();
                enforceAdDimensions();
                checkZoneIds();
            }, 3000);
        });
    }
    
    // Funciones globales para debug
    window.debugAds = function(enable = true) {
        CONFIG.debugMode = enable;
        if (enable) {
            console.log('🛠 Modo debug activado - Bordes de debug visibles');
            document.querySelectorAll('.ad-container, [id*="ad-"]').forEach(el => {
                el.style.border = '3px solid red';
                el.style.background = 'rgba(255, 0, 0, 0.1)';
            });
            runDiagnostics();
        } else {
            console.log('🛠 Modo debug desactivado');
            document.querySelectorAll('.ad-container, [id*="ad-"]').forEach(el => {
                el.style.border = '';
                el.style.background = '';
            });
        }
    };
    
    window.forceAds = function() {
        console.log('💪 Forzando visibilidad manualmente...');
        forceAdVisibility();
        enforceAdDimensions();
        return runDiagnostics();
    };
    
    window.adReport = function() {
        return runDiagnostics();
    };
    
    window.createEmergencyAds = function() {
        createEmergencyAdContainers();
        forceAdVisibility();
        return runDiagnostics();
    };
    
    window.checkZoneIds = function() {
        return checkZoneIds();
    };
    
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 500);
    }
    
    console.log('✅ Chrome Ads Visibility Enforcer v2.1 cargado - IDs REALES');
    console.log('🎯 Zone IDs REALES configurados:');
    console.log('   JuicyAds: 1098658, 1098518, 1098656, 1098519, 1098657');
    console.log('   ExoClick: 5696328 (única zona)');
    console.log('   EroAdvertising: 8177575, 8179717');
    console.log('💡 Comandos disponibles:');
    console.log('  window.debugAds() - Activar/desactivar modo debug');
    console.log('  window.forceAds() - Forzar visibilidad manualmente');
    console.log('  window.adReport() - Generar reporte de diagnóstico');
    console.log('  window.createEmergencyAds() - Crear contenedores de emergencia');
    console.log('  window.checkZoneIds() - Verificar zone IDs');
    
})();
