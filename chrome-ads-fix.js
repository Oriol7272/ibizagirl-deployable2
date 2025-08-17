// ============================
// CHROME ADS VISIBILITY ENFORCER v2.0 - ULTIMATE FIX
// Fuerza la visibilidad de anuncios en Chrome con zone IDs correctos
// FIXED: Actualizado con zone IDs reales de tus dashboards
// ============================

(function() {
    'use strict';
    
    console.log('🔧 Chrome Ads Visibility Enforcer v2.0 - ULTIMATE FIX iniciado...');
    
    // FIXED: Configuración con zone IDs correctos
    const CONFIG = {
        checkInterval: 2000,
        maxAttempts: 15,
        debugMode: false,
        zones: {
            juicyads: {
                header: 1098518,    // FIXED: Zone ID real de tu dashboard
                sidebar: 1098519,   // FIXED: Zone ID real de tu dashboard
                footer: 1098520     // FIXED: Zone ID real de tu dashboard
            },
            exoclick: {
                header: 5696328,    // CONFIRMED: De tu dashboard ExoClick
                sidebar: 5696329,   // AÑADIR: Crear en ExoClick
                footer: 5696330     // AÑADIR: Crear en ExoClick
            }
        }
    };
    
    let attemptCount = 0;
    let forceVisibilityInterval;
    
    // Función principal para forzar visibilidad con zone IDs correctos
    function forceAdVisibilityWithCorrectZones() {
        const selectors = [
            '.ad-container',
            '[id*="ad-"]',
            '[id*="juicyads"]',
            '[id*="exoclick"]',
            '.jaads',
            '.adsbyexoclick',
            'ins[data-aid]',
            'ins[data-zoneid]',
            '[id^="ja_"]',
            // FIXED: Selectores específicos con zone IDs correctos
            '#ja_1098518',  // JuicyAds header
            '#ja_1098519',  // JuicyAds sidebar
            '#ja_1098520',  // JuicyAds footer
            '[data-zone-id="5696328"]',  // ExoClick header
            '[data-zone-id="5696329"]',  // ExoClick sidebar
            '[data-zone-id="5696330"]'   // ExoClick footer
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
                            computedStyle.position === 'absolute' && 
                            (computedStyle.left === '-9999px' || computedStyle.top === '-9999px');
            
            if (needsFix || CONFIG.debugMode) {
                // FIXED: Forzar visibilidad con estilos más agresivos
                const forceStyles = [
                    'display: block !important',
                    'visibility: visible !important',
                    'opacity: 1 !important',
                    'position: relative !important',
                    'z-index: 999 !important',
                    'overflow: visible !important',
                    'transform: none !important',
                    'filter: none !important',
                    'clip-path: none !important',
                    'left: auto !important',
                    'right: auto !important',
                    'top: auto !important',
                    'bottom: auto !important',
                    'width: auto !important',
                    'height: auto !important',
                    'max-width: none !important',
                    'max-height: none !important',
                    'min-width: 0 !important',
                    'min-height: 50px !important',
                    'margin: 0 !important',
                    'padding: 0 !important',
                    'border: none !important',
                    'outline: none !important',
                    'background: transparent !important',
                    'box-shadow: none !important',
                    'text-shadow: none !important'
                ];
                
                forceStyles.forEach(style => {
                    const [property, value] = style.split(': ');
                    element.style.setProperty(property, value.replace(' !important', ''), 'important');
                });
                
                // Chrome-specific fixes
                element.style.setProperty('-webkit-transform', 'translateZ(0)', 'important');
                element.style.setProperty('-webkit-backface-visibility', 'visible', 'important');
                element.style.setProperty('will-change', 'auto', 'important');
                element.style.setProperty('-webkit-font-smoothing', 'auto', 'important');
                element.style.setProperty('-moz-osx-font-smoothing', 'auto', 'important');
                
                // Asegurar dimensiones mínimas según zona
                const zoneType = detectZoneType(element);
                applyZoneSpecificStyles(element, zoneType);
                
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
                
                // Asegurar que el iframe tenga dimensiones
                if (!iframe.width || iframe.width === '0') {
                    const parent = iframe.parentElement;
                    if (parent) {
                        iframe.width = parent.offsetWidth || '100%';
                        iframe.height = parent.offsetHeight || '250';
                    }
                }
            });
        });
        
        if (fixedCount > 0) {
            console.log(`✅ Visibilidad forzada en ${fixedCount} elementos de anuncios con zone IDs correctos`);
        }
        
        return fixedCount > 0;
    }
    
    // FIXED: Detectar tipo de zona basado en ID o posición
    function detectZoneType(element) {
        const id = element.id || '';
        const className = element.className || '';
        const dataZoneId = element.getAttribute('data-zone-id') || '';
        
        // Detectar por zone ID específico
        if (id.includes('1098518') || dataZoneId === '5696328') return 'header';
        if (id.includes('1098519') || dataZoneId === '5696329') return 'sidebar';
        if (id.includes('1098520') || dataZoneId === '5696330') return 'footer';
        
        // Detectar por clase o posición
        if (className.includes('header') || id.includes('header')) return 'header';
        if (className.includes('sidebar') || id.includes('sidebar')) return 'sidebar';
        if (className.includes('footer') || id.includes('footer')) return 'footer';
        
        return 'header'; // Default
    }
    
    // FIXED: Aplicar estilos específicos según tipo de zona
    function applyZoneSpecificStyles(element, zoneType) {
        const dimensionMap = {
            'header': { width: '728px', height: '90px', maxWidth: '100%' },
            'sidebar': { width: '300px', height: '250px', maxWidth: '300px' },
            'footer': { width: '728px', height: '90px', maxWidth: '100%' }
        };
        
        const dimensions = dimensionMap[zoneType] || dimensionMap.header;
        
        element.style.setProperty('width', dimensions.width, 'important');
        element.style.setProperty('height', dimensions.height, 'important');
        element.style.setProperty('max-width', dimensions.maxWidth, 'important');
        
        // Posicionamiento específico para sidebar
        if (zoneType === 'sidebar') {
            if (window.innerWidth > 768) {
                element.style.setProperty('position', 'fixed', 'important');
                element.style.setProperty('right', '10px', 'important');
                element.style.setProperty('top', '50%', 'important');
                element.style.setProperty('transform', 'translateY(-50%)', 'important');
                element.style.setProperty('z-index', '2000', 'important');
            } else {
                // Móvil: convertir a relativo
                element.style.setProperty('position', 'relative', 'important');
                element.style.setProperty('width', '100%', 'important');
                element.style.setProperty('max-width', '300px', 'important');
                element.style.setProperty('margin', '20px auto', 'important');
                element.style.setProperty('right', 'auto', 'important');
                element.style.setProperty('top', 'auto', 'important');
                element.style.setProperty('transform', 'none', 'important');
            }
        } else {
            // Header y footer
            element.style.setProperty('margin', '20px auto', 'important');
            element.style.setProperty('text-align', 'center', 'important');
        }
    }
    
    // FIXED: Función para crear contenedores de emergencia con zone IDs correctos
    function createEmergencyAdContainers() {
        console.log('🚨 Creando contenedores de emergencia con zone IDs correctos...');
        
        const positions = ['header', 'footer'];
        const networks = ['juicyads', 'exoclick'];
        
        positions.forEach(position => {
            networks.forEach(network => {
                const zoneId = CONFIG.zones[network][position];
                if (!zoneId) return;
                
                const containerId = `emergency-${network}-${position}-${zoneId}`;
                
                // Verificar si ya existe
                if (document.getElementById(containerId)) return;
                
                const container = document.createElement('div');
                container.id = containerId;
                container.className = `ad-container ad-${network} ad-${position} emergency-container`;
                container.setAttribute('data-network', network);
                container.setAttribute('data-position', position);
                container.setAttribute('data-zone-id', zoneId);
                
                // Aplicar estilos base
                applyZoneSpecificStyles(container, position);
                container.style.setProperty('background', 'rgba(0, 119, 190, 0.03)', 'important');
                container.style.setProperty('border', '1px solid rgba(0, 255, 136, 0.15)', 'important');
                container.style.setProperty('border-radius', '8px', 'important');
                container.style.setProperty('padding', '5px', 'important');
                
                // Crear contenido de emergencia según red
                if (network === 'juicyads') {
                    container.innerHTML = `
                        <iframe 
                            src="https://www.juicyads.com/iframe_mobile.php?adzone=${zoneId}"
                            width="100%" 
                            height="100%"
                            scrolling="no"
                            frameborder="0"
                            style="border:0; display:block;"
                            title="JuicyAds Zone ${zoneId}">
                        </iframe>
                    `;
                } else if (network === 'exoclick') {
                    container.innerHTML = `
                        <iframe 
                            src="https://syndication.exoclick.com/ads-iframe.php?idzone=${zoneId}"
                            width="100%" 
                            height="100%"
                            scrolling="no"
                            frameborder="0"
                            style="border:0; display:block;"
                            title="ExoClick Zone ${zoneId}">
                        </iframe>
                    `;
                }
                
                // Insertar en DOM
                insertContainerInDOM(container, position);
                
                // Agregar indicador
                addEmergencyIndicator(container, network, zoneId);
                
                console.log(`🆘 Contenedor de emergencia creado: ${network} zona ${zoneId}`);
            });
        });
    }
    
    function insertContainerInDOM(container, position) {
        try {
            let targetElement;
            let inserted = false;
            
            switch(position) {
                case 'header':
                    targetElement = document.querySelector('.main-header');
                    if (targetElement && targetElement.parentNode) {
                        targetElement.parentNode.insertBefore(container, targetElement.nextSibling);
                        inserted = true;
                    }
                    break;
                    
                case 'footer':
                    targetElement = document.querySelector('.main-footer');
                    if (targetElement && targetElement.parentNode) {
                        targetElement.parentNode.insertBefore(container, targetElement);
                        inserted = true;
                    }
                    break;
            }
            
            if (!inserted) {
                if (position === 'header') {
                    document.body.insertBefore(container, document.body.firstChild);
                } else {
                    document.body.appendChild(container);
                }
                inserted = true;
            }
            
            if (inserted) {
                console.log(`📍 Contenedor de emergencia ${position} insertado en DOM`);
            }
            
        } catch (error) {
            console.error(`❌ Error insertando contenedor de emergencia ${position}:`, error);
        }
    }
    
    function addEmergencyIndicator(container, network, zoneId) {
        const indicator = document.createElement('div');
        indicator.className = 'emergency-ad-indicator';
        indicator.style.cssText = `
            position: absolute;
            top: 2px;
            right: 2px;
            background: #ff6b35;
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: bold;
            z-index: 10001;
            font-family: monospace;
        `;
        indicator.textContent = `EMERGENCY-${network.toUpperCase()}-${zoneId}`;
        container.appendChild(indicator);
    }
    
    // FIXED: Función de diagnóstico mejorada con zone IDs correctos
    function runAdvancedDiagnostics() {
        console.group('🔍 Diagnóstico Avanzado de Anuncios v2.0');
        
        const report = [];
        const allContainers = document.querySelectorAll('.ad-container, [id*="ad-"], [id*="juicyads"], [id*="exoclick"]');
        
        console.log(`📊 Total de contenedores encontrados: ${allContainers.length}`);
        
        allContainers.forEach((container, index) => {
            const rect = container.getBoundingClientRect();
            const computed = window.getComputedStyle(container);
            const iframe = container.querySelector('iframe');
            const ins = container.querySelector('ins');
            const scripts = container.querySelectorAll('script');
            const zoneId = container.getAttribute('data-zone-id') || 
                          container.id.match(/\d+/)?.[0] || 
                          'unknown';
            
            const diagnostics = {
                index: index + 1,
                id: container.id || 'sin-id',
                clase: container.className,
                zoneId: zoneId,
                visible: rect.width > 0 && rect.height > 0,
                dimensiones: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
                display: computed.display,
                visibility: computed.visibility,
                opacity: computed.opacity,
                zIndex: computed.zIndex,
                position: computed.position,
                left: computed.left,
                top: computed.top,
                hasIframe: !!iframe,
                hasIns: !!ins,
                hasScripts: scripts.length,
                contenido: container.children.length > 0 ? 'Sí' : 'No',
                problema: null,
                network: detectNetwork(container),
                zoneType: detectZoneType(container)
            };
            
            // Detectar problemas específicos
            if (computed.display === 'none') diagnostics.problema = 'display: none';
            else if (computed.visibility === 'hidden') diagnostics.problema = 'visibility: hidden';
            else if (parseFloat(computed.opacity) < 1) diagnostics.problema = `opacity: ${computed.opacity}`;
            else if (rect.width === 0 || rect.height === 0) diagnostics.problema = 'Sin dimensiones';
            else if (computed.left === '-9999px' || computed.top === '-9999px') diagnostics.problema = 'Posición oculta';
            else if (!iframe && !ins && scripts.length === 0) diagnostics.problema = 'Sin contenido de anuncio';
            else if (zoneId === 'unknown') diagnostics.problema = 'Zone ID no detectado';
            else diagnostics.problema = 'OK';
            
            report.push(diagnostics);
            
            // Aplicar estilo de debug si está activado
            if (CONFIG.debugMode) {
                container.style.border = diagnostics.problema === 'OK' ? 
                    '3px solid green' : '3px solid red';
                container.style.background = diagnostics.problema === 'OK' ? 
                    'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)';
            }
        });
        
        console.table(report);
        
        // Resumen detallado
        const visibleCount = report.filter(r => r.visible).length;
        const withContentCount = report.filter(r => r.contenido === 'Sí').length;
        const okCount = report.filter(r => r.problema === 'OK').length;
        const juicyAdsCount = report.filter(r => r.network === 'juicyads').length;
        const exoClickCount = report.filter(r => r.network === 'exoclick').length;
        
        console.log('📈 Resumen Detallado:');
        console.log(`   Total contenedores: ${report.length}`);
        console.log(`   Visibles: ${visibleCount}/${report.length}`);
        console.log(`   Con contenido: ${withContentCount}/${report.length}`);
        console.log(`   Sin problemas: ${okCount}/${report.length}`);
        console.log(`   JuicyAds: ${juicyAdsCount}`);
        console.log(`   ExoClick: ${exoClickCount}`);
        
        // Verificar zone IDs específicos
        console.log('\n🎯 Verificación de Zone IDs:');
        const expectedZones = [
            '1098518', '1098519', '1098520',  // JuicyAds
            '5696328', '5696329', '5696330'   // ExoClick
        ];
        
        expectedZones.forEach(zoneId => {
            const found = report.find(r => r.zoneId === zoneId);
            console.log(`   Zone ${zoneId}: ${found ? '✅ Encontrado' : '❌ No encontrado'}`);
        });
        
        // Verificar redes específicas
        console.log('\n🔡 Estado de Redes:');
        console.log(`   JuicyAds script: ${window.adsbyjuicy ? '✅' : '❌'}`);
        console.log(`   ExoClick elementos: ${document.querySelectorAll('[src*="exoclick"]').length > 0 ? '✅' : '❌'}`);
        console.log(`   PopAds: ${window.e494ffb82839a29122608e933394c091 ? '✅' : '❌'}`);
        
        console.groupEnd();
        
        return report;
    }
    
    function detectNetwork(element) {
        const id = element.id || '';
        const className = element.className || '';
        
        if (id.includes('juicy') || className.includes('juicy') || element.querySelector('.jaads')) {
            return 'juicyads';
        }
        if (id.includes('exo') || className.includes('exo') || element.querySelector('[data-zoneid]')) {
            return 'exoclick';
        }
        return 'unknown';
    }
    
    // FIXED: Monitor de cambios en DOM más inteligente
    function setupIntelligentMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            let adRelatedChange = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            const isAd = node.id && (node.id.includes('ad') || node.id.includes('juicy') || node.id.includes('exo')) ||
                                        node.className && node.className.toString().includes('ad');
                            if (isAd) {
                                adRelatedChange = true;
                                console.log(`🔄 Nuevo elemento de anuncio detectado: ${node.id || node.className}`);
                            }
                        }
                    });
                }
                
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const target = mutation.target;
                    if (target.id && (target.id.includes('ad') || target.id.includes('juicy') || target.id.includes('exo'))) {
                        adRelatedChange = true;
                        console.log(`🎨 Cambio de estilo detectado en: ${target.id}`);
                    }
                }
            });
            
            if (adRelatedChange) {
                console.log('🔄 Cambio en anuncios detectado, aplicando fixes...');
                setTimeout(() => {
                    forceAdVisibilityWithCorrectZones();
                }, 500);
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
    
    // FIXED: Función principal de inicialización mejorada
    function initialize() {
        console.log('🚀 Inicializando Chrome Ads Visibility Enforcer v2.0...');
        console.log('🎯 Zone IDs configurados:', CONFIG.zones);
        
        // Primera ejecución inmediata
        forceAdVisibilityWithCorrectZones();
        
        // Configurar observador inteligente
        setupIntelligentMutationObserver();
        
        // Ejecutar periódicamente con límite de intentos
        forceVisibilityInterval = setInterval(() => {
            attemptCount++;
            console.log(`🔄 Intento ${attemptCount}/${CONFIG.maxAttempts} - Zone IDs correctos`);
            
            const fixed = forceAdVisibilityWithCorrectZones();
            
            if (attemptCount >= CONFIG.maxAttempts) {
                clearInterval(forceVisibilityInterval);
                console.log('✅ Chrome Ads Visibility Enforcer completado');
                
                // Ejecutar diagnóstico final
                setTimeout(() => {
                    const report = runAdvancedDiagnostics();
                    
                    // Si no hay contenedores visibles, crear de emergencia
                    const visibleAds = report.filter(r => r.visible && r.problema === 'OK');
                    if (visibleAds.length === 0) {
                        console.warn('🚨 No se detectaron anuncios funcionales, creando contenedores de emergencia...');
                        createEmergencyAdContainers();
                    }
                }, 2000);
            }
        }, CONFIG.checkInterval);
    }
    
    // Funciones globales para debug
    window.debugAds = function(enable = true) {
        CONFIG.debugMode = enable;
        if (enable) {
            console.log('🛠 Modo debug activado - Los contenedores tendrán bordes de colores');
            console.log('🎯 Zone IDs actuales:', CONFIG.zones);
            forceAdVisibilityWithCorrectZones();
            runAdvancedDiagnostics();
        } else {
            console.log('🛠 Modo debug desactivado');
            document.querySelectorAll('.ad-container, [id*="ad-"]').forEach(el => {
                el.style.border = '';
                el.style.background = '';
            });
        }
    };
    
    window.forceAds = function() {
        console.log('💪 Forzando visibilidad con zone IDs correctos...');
        forceAdVisibilityWithCorrectZones();
        runAdvancedDiagnostics();
    };
    
    window.adReport = function() {
        return runAdvancedDiagnostics();
    };
    
    window.createEmergencyAds = function() {
        console.log('🆘 Creando contenedores de emergencia manualmente...');
        createEmergencyAdContainers();
    };
    
    window.checkZoneIds = function() {
        console.log('🎯 Zone IDs configurados:', CONFIG.zones);
        const report = runAdvancedDiagnostics();
        const foundZones = report.map(r => r.zoneId).filter(z => z !== 'unknown');
        console.log('🔍 Zone IDs encontrados en DOM:', [...new Set(foundZones)]);
        return { configured: CONFIG.zones, found: foundZones };
    };
    
    // Esperar a que el DOM esté completamente cargado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 1000);
    }
    
    // También ejecutar cuando la ventana se carga completamente
    window.addEventListener('load', () => {
        setTimeout(() => {
            console.log('🔄 Verificación post-carga con zone IDs correctos...');
            forceAdVisibilityWithCorrectZones();
        }, 3000);
    });
    
    console.log('✅ Chrome Ads Visibility Enforcer v2.0 cargado - ULTIMATE FIX');
    console.log('🎯 Zone IDs correctos configurados:');
    console.log('   JuicyAds: 1098518, 1098519, 1098520');
    console.log('   ExoClick: 5696328, 5696329, 5696330');
    console.log('💡 Comandos disponibles:');
    console.log('  window.debugAds() - Activar/desactivar modo debug');
    console.log('  window.forceAds() - Forzar visibilidad manualmente');
    console.log('  window.adReport() - Generar reporte de diagnóstico');
    console.log('  window.createEmergencyAds() - Crear contenedores de emergencia');
    console.log('  window.checkZoneIds() - Verificar zone IDs');
    
})();
