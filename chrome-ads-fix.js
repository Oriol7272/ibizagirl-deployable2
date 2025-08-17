// ============================
// CHROME ADS VISIBILITY ENFORCER v1.0
// Fuerza la visibilidad de anuncios en Chrome
// ============================

(function() {
    'use strict';
    
    console.log('🔧 Chrome Ads Visibility Enforcer v1.0 iniciado...');
    
    // Configuración
    const CONFIG = {
        checkInterval: 2000, // Verificar cada 2 segundos
        maxAttempts: 10, // Máximo de intentos
        debugMode: false // Cambiar a true para ver bordes de debug
    };
    
    let attemptCount = 0;
    
    // Función principal para forzar visibilidad
    function forceAdVisibility() {
        const selectors = [
            '.ad-container',
            '[id*="ad-"]',
            '[id*="juicyads"]',
            '[id*="exoclick"]',
            '.jaads',
            '.adsbyexoclick',
            'ins[data-aid]',
            'ins[data-zoneid]',
            '[id^="ja_"]'
        ];
        
        const adElements = document.querySelectorAll(selectors.join(', '));
        
        if (adElements.length === 0) {
            console.warn('⚠️ No se encontraron elementos de anuncios');
            return false;
        }
        
        let fixedCount = 0;
        
        adElements.forEach(element => {
            // Remover cualquier estilo que pueda ocultar
            const computedStyle = window.getComputedStyle(element);
            const needsFix = computedStyle.display === 'none' || 
                            computedStyle.visibility === 'hidden' || 
                            parseFloat(computedStyle.opacity) < 1;
            
            if (needsFix || CONFIG.debugMode) {
                // Forzar visibilidad con estilos inline
                element.style.setProperty('display', 'block', 'important');
                element.style.setProperty('visibility', 'visible', 'important');
                element.style.setProperty('opacity', '1', 'important');
                element.style.setProperty('position', 'relative', 'important');
                element.style.setProperty('z-index', '999', 'important');
                element.style.setProperty('overflow', 'visible', 'important');
                element.style.setProperty('transform', 'none', 'important');
                element.style.setProperty('filter', 'none', 'important');
                element.style.setProperty('clip-path', 'none', 'important');
                
                // Chrome-specific fixes
                element.style.setProperty('-webkit-transform', 'translateZ(0)', 'important');
                element.style.setProperty('-webkit-backface-visibility', 'visible', 'important');
                element.style.setProperty('will-change', 'auto', 'important');
                
                // Asegurar dimensiones mínimas
                if (element.offsetHeight < 50) {
                    element.style.setProperty('min-height', '50px', 'important');
                }
                
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
            console.log(`✅ Visibilidad forzada en ${fixedCount} elementos de anuncios`);
        }
        
        return fixedCount > 0;
    }
    
    // Función para verificar dimensiones específicas
    function enforceAdDimensions() {
        const dimensionMap = {
            'header': { width: 728, height: 90 },
            'sidebar': { width: 300, height: 250 },
            'footer': { width: 728, height: 90 }
        };
        
        Object.entries(dimensionMap).forEach(([position, dimensions]) => {
            const containers = document.querySelectorAll(
                `.ad-${position}, #ad-${position}-container, [id*="${position}"]`
            );
            
            containers.forEach(container => {
                if (container.id && container.id.includes('ad')) {
                    // Forzar dimensiones específicas
                    container.style.setProperty('width', `${dimensions.width}px`, 'important');
                    container.style.setProperty('height', `${dimensions.height}px`, 'important');
                    container.style.setProperty('max-width', '100%', 'important');
                    
                    // Para móviles
                    if (window.innerWidth <= 768 && position === 'sidebar') {
                        container.style.setProperty('position', 'relative', 'important');
                        container.style.setProperty('width', '100%', 'important');
                        container.style.setProperty('max-width', `${dimensions.width}px`, 'important');
                        container.style.setProperty('margin', '20px auto', 'important');
                        container.style.setProperty('right', 'auto', 'important');
                        container.style.setProperty('top', 'auto', 'important');
                        container.style.setProperty('transform', 'none', 'important');
                    }
                }
            });
        });
    }
    
    // Función de diagnóstico mejorada
    function runDiagnostics() {
        console.group('🔍 Diagnóstico de Anuncios');
        
        const report = [];
        const allContainers = document.querySelectorAll('.ad-container, [id*="ad-"]');
        
        allContainers.forEach((container, index) => {
            const rect = container.getBoundingClientRect();
            const computed = window.getComputedStyle(container);
            const iframe = container.querySelector('iframe');
            const ins = container.querySelector('ins');
            const scripts = container.querySelectorAll('script');
            
            const diagnostics = {
                index: index + 1,
                id: container.id || 'sin-id',
                clase: container.className,
                visible: rect.width > 0 && rect.height > 0,
                dimensiones: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
                display: computed.display,
                visibility: computed.visibility,
                opacity: computed.opacity,
                zIndex: computed.zIndex,
                position: computed.position,
                hasIframe: !!iframe,
                hasIns: !!ins,
                hasScripts: scripts.length,
                contenido: container.children.length > 0 ? 'Sí' : 'No',
                problema: null
            };
            
            // Detectar problemas
            if (computed.display === 'none') diagnostics.problema = 'display: none';
            else if (computed.visibility === 'hidden') diagnostics.problema = 'visibility: hidden';
            else if (parseFloat(computed.opacity) < 1) diagnostics.problema = `opacity: ${computed.opacity}`;
            else if (rect.width === 0 || rect.height === 0) diagnostics.problema = 'Sin dimensiones';
            else if (!iframe && !ins && scripts.length === 0) diagnostics.problema = 'Sin contenido de anuncio';
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
        
        // Resumen
        const visibleCount = report.filter(r => r.visible).length;
        const withContentCount = report.filter(r => r.contenido === 'Sí').length;
        const okCount = report.filter(r => r.problema === 'OK').length;
        
        console.log('📊 Resumen:');
        console.log(`  Total contenedores: ${report.length}`);
        console.log(`  Visibles: ${visibleCount}`);
        console.log(`  Con contenido: ${withContentCount}`);
        console.log(`  Sin problemas: ${okCount}`);
        
        // Verificar redes específicas
        console.log('\n📡 Estado de Redes:');
        console.log(`  JuicyAds: ${document.querySelector('.jaads, [id^="ja_"]') ? '✅' : '❌'}`);
        console.log(`  ExoClick: ${document.querySelector('.adsbyexoclick, ins[data-zoneid]') ? '✅' : '❌'}`);
        console.log(`  PopAds: ${window.e494ffb82839a29122608e933394c091 ? '✅' : '❌'}`);
        
        console.groupEnd();
        
        return report;
    }
    
    // Función para monitorear cambios en el DOM
    function setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            let adRelatedChange = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            const isAd = node.id && node.id.includes('ad') ||
                                        node.className && node.className.toString().includes('ad');
                            if (isAd) {
                                adRelatedChange = true;
                            }
                        }
                    });
                }
            });
            
            if (adRelatedChange) {
                console.log('🔄 Cambio detectado en anuncios, aplicando fixes...');
                setTimeout(() => {
                    forceAdVisibility();
                    enforceAdDimensions();
                }, 500);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
        
        console.log('👁️ MutationObserver configurado para monitorear cambios');
    }
    
    // Función principal de inicialización
    function initialize() {
        console.log('🚀 Inicializando Chrome Ads Visibility Enforcer...');
        
        // Primera ejecución inmediata
        forceAdVisibility();
        enforceAdDimensions();
        
        // Configurar observador de cambios
        setupMutationObserver();
        
        // Ejecutar periódicamente durante los primeros segundos
        const interval = setInterval(() => {
            attemptCount++;
            console.log(`🔄 Intento ${attemptCount}/${CONFIG.maxAttempts}`);
            
            const fixed = forceAdVisibility();
            enforceAdDimensions();
            
            if (attemptCount >= CONFIG.maxAttempts) {
                clearInterval(interval);
                console.log('✅ Chrome Ads Visibility Enforcer completado');
                
                // Ejecutar diagnóstico final
                setTimeout(() => {
                    runDiagnostics();
                }, 1000);
            }
        }, CONFIG.checkInterval);
    }
    
    // Funciones globales para debug
    window.debugAds = function(enable = true) {
        CONFIG.debugMode = enable;
        if (enable) {
            console.log('🐛 Modo debug activado - Los contenedores de anuncios tendrán bordes de colores');
            forceAdVisibility();
            runDiagnostics();
        } else {
            console.log('🐛 Modo debug desactivado');
            // Limpiar estilos de debug
            document.querySelectorAll('.ad-container, [id*="ad-"]').forEach(el => {
                el.style.border = '';
                el.style.background = '';
            });
        }
    };
    
    window.forceAds = function() {
        console.log('💪 Forzando visibilidad de anuncios manualmente...');
        forceAdVisibility();
        enforceAdDimensions();
        runDiagnostics();
    };
    
    window.adReport = function() {
        return runDiagnostics();
    };
    
    // Esperar a que el DOM esté completamente cargado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // Si el DOM ya está cargado, esperar un poco para que los scripts de anuncios se carguen
        setTimeout(initialize, 1000);
    }
    
    // También ejecutar cuando la ventana se carga completamente
    window.addEventListener('load', () => {
        setTimeout(() => {
            console.log('🔄 Verificación post-carga...');
            forceAdVisibility();
            enforceAdDimensions();
        }, 3000);
    });
    
    console.log('✅ Chrome Ads Visibility Enforcer cargado');
    console.log('💡 Comandos disponibles:');
    console.log('  window.debugAds() - Activar/desactivar modo debug');
    console.log('  window.forceAds() - Forzar visibilidad manualmente');
    console.log('  window.adReport() - Generar reporte de diagnóstico');
    
})();
