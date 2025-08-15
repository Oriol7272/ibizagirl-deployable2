// ============================
// AD NETWORK VERIFICATION SYSTEM v2.0
// Sistema robusto con detección de ad blockers
// ============================

(function() {
    'use strict';
    
    // Configuración
    const AD_CONFIG = {
        checkDelay: 3000,        // Esperar 3 segundos antes de verificar
        retryDelay: 5000,        // Reintentar cada 5 segundos
        maxRetries: 2,           // Máximo 2 reintentos
        showDebug: true          // Mostrar mensajes de debug
    };
    
    // Estado de las ad networks
    const adNetworkStatus = {
        juicyads: false,
        exoclick: false,
        eroadvertising: false,
        adBlockerDetected: false,
        trackingProtection: false
    };
    
    // Función de logging condicional
    function log(message, type = 'log') {
        if (!AD_CONFIG.showDebug) return;
        
        const prefix = '🎯 [Ad Networks]';
        const styles = {
            log: 'color: #0077be',
            success: 'color: #00ff88',
            warning: 'color: #ff6b35',
            error: 'color: #ff0000'
        };
        
        console[type === 'error' ? 'error' : 'log'](
            `%c${prefix} ${message}`, 
            styles[type] || styles.log
        );
    }
    
    // Detectar Enhanced Tracking Protection
    function detectTrackingProtection() {
        // Método 1: Verificar si los scripts de tracking fueron bloqueados
        const blockedScripts = [
            'js.juicyads.com',
            'assets.ero-advertising.com',
            'a.exoclick.com'
        ];
        
        let blocked = 0;
        blockedScripts.forEach(domain => {
            const scripts = document.querySelectorAll(`script[src*="${domain}"]`);
            scripts.forEach(script => {
                // Si el script existe pero no se cargó
                if (!script.loaded && script.src) {
                    blocked++;
                }
            });
        });
        
        if (blocked > 0) {
            adNetworkStatus.trackingProtection = true;
            log(`Enhanced Tracking Protection detectado (${blocked} scripts bloqueados)`, 'warning');
            return true;
        }
        
        return false;
    }
    
    // Detectar Ad Blocker genérico
    function detectAdBlocker() {
        // Método 1: Crear elemento de prueba
        const testAd = document.createElement('div');
        testAd.innerHTML = '&nbsp;';
        testAd.className = 'adsbox pub_300x250 pub_300x250m pub_728x90 ad-placement ad-placeholder';
        testAd.style.position = 'absolute';
        testAd.style.top = '-9999px';
        testAd.style.left = '-9999px';
        document.body.appendChild(testAd);
        
        setTimeout(() => {
            if (testAd.offsetHeight === 0 || 
                testAd.offsetWidth === 0 || 
                testAd.clientHeight === 0 || 
                testAd.clientWidth === 0 ||
                window.getComputedStyle(testAd).display === 'none' ||
                window.getComputedStyle(testAd).visibility === 'hidden') {
                
                adNetworkStatus.adBlockerDetected = true;
                log('Ad Blocker detectado', 'warning');
            }
            document.body.removeChild(testAd);
        }, 100);
    }
    
    // Verificar JuicyAds
    function checkJuicyAds() {
        if (window.juicyads_loaded === true) {
            adNetworkStatus.juicyads = true;
            log('JuicyAds: Cargado correctamente ✅', 'success');
            return true;
        }
        
        if (typeof window.adsbyjuicy !== 'undefined' && Array.isArray(window.adsbyjuicy)) {
            adNetworkStatus.juicyads = true;
            log('JuicyAds: Detectado (adsbyjuicy) ✅', 'success');
            return true;
        }
        
        // Verificar si hay elementos JuicyAds en el DOM
        const juicyElements = document.querySelectorAll('.juicyads, ins[data-zone]');
        if (juicyElements.length > 0) {
            // Verificar si tienen contenido
            let hasContent = false;
            juicyElements.forEach(el => {
                if (el.innerHTML.trim() !== '' && el.children.length > 0) {
                    hasContent = true;
                }
            });
            
            if (hasContent) {
                adNetworkStatus.juicyads = true;
                log('JuicyAds: Contenido detectado en DOM ✅', 'success');
                return true;
            }
        }
        
        log('JuicyAds: No detectado ❌', 'warning');
        return false;
    }
    
    // Verificar ExoClick
    function checkExoClick() {
        if (window.exoclick_loaded === true) {
            adNetworkStatus.exoclick = true;
            log('ExoClick: Cargado correctamente ✅', 'success');
            return true;
        }
        
        if (typeof window.ExoLoader !== 'undefined' && typeof window.ExoLoader.addZone === 'function') {
            adNetworkStatus.exoclick = true;
            log('ExoClick: ExoLoader disponible ✅', 'success');
            return true;
        }
        
        // Verificar elementos ExoClick en el DOM
        const exoElements = document.querySelectorAll('[id^="exoclick"]');
        if (exoElements.length > 0) {
            let hasContent = false;
            exoElements.forEach(el => {
                if (el.innerHTML.trim() !== '') {
                    hasContent = true;
                }
            });
            
            if (hasContent) {
                adNetworkStatus.exoclick = true;
                log('ExoClick: Contenido detectado en DOM ✅', 'success');
                return true;
            }
        }
        
        log('ExoClick: No detectado ❌', 'warning');
        return false;
    }
    
    // Verificar EroAdvertising
    function checkEroAdvertising() {
        if (window.eroadvertising_loaded === true) {
            adNetworkStatus.eroadvertising = true;
            log('EroAdvertising: Cargado correctamente ✅', 'success');
            return true;
        }
        
        // Verificar elementos EroAdvertising
        const eroElements = document.querySelectorAll('[data-ero-spot]');
        if (eroElements.length > 0) {
            let hasContent = false;
            eroElements.forEach(el => {
                if (el.innerHTML.trim() !== '') {
                    hasContent = true;
                }
            });
            
            if (hasContent) {
                adNetworkStatus.eroadvertising = true;
                log('EroAdvertising: Contenido detectado en DOM ✅', 'success');
                return true;
            }
        }
        
        log('EroAdvertising: No detectado ❌', 'warning');
        return false;
    }
    
    // Mostrar placeholders mejorados
    function showEnhancedPlaceholders() {
        const containers = document.querySelectorAll('.ad-container');
        
        containers.forEach((container, index) => {
            // Si ya tiene contenido válido, no hacer nada
            if (container.querySelector('iframe') || 
                container.querySelector('ins') || 
                container.querySelector('[id^="exo"]')) {
                return;
            }
            
            // Si ya tiene placeholder, no duplicar
            if (container.querySelector('.ad-placeholder-enhanced')) {
                return;
            }
            
            // Limpiar contenedor
            container.innerHTML = '';
            
            // Crear placeholder mejorado
            const placeholder = document.createElement('div');
            placeholder.className = 'ad-placeholder-enhanced';
            placeholder.style.cssText = `
                width: 100%;
                min-height: 100px;
                background: linear-gradient(135deg, rgba(0,119,190,0.1), rgba(0,212,255,0.1));
                border: 2px dashed rgba(127,219,255,0.3);
                border-radius: 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 20px;
                text-align: center;
                font-family: system-ui, -apple-system, sans-serif;
            `;
            
            // Contenido del placeholder basado en el estado
            let content = '';
            
            if (adNetworkStatus.adBlockerDetected || adNetworkStatus.trackingProtection) {
                content = `
                    <div style="font-size: 24px; margin-bottom: 10px;">🛡️</div>
                    <div style="color: #ff6b35; font-weight: 600; margin-bottom: 5px;">
                        Ad Blocker Detectado
                    </div>
                    <div style="color: rgba(255,255,255,0.6); font-size: 12px;">
                        Por favor, desactiva tu ad blocker para apoyar el sitio
                    </div>
                `;
            } else {
                content = `
                    <div style="font-size: 24px; margin-bottom: 10px;">📢</div>
                    <div style="color: rgba(255,255,255,0.7); font-weight: 500;">
                        Espacio Publicitario
                    </div>
                    <div style="color: rgba(255,255,255,0.5); font-size: 11px; margin-top: 5px;">
                        Zona ${index + 1}
                    </div>
                `;
            }
            
            placeholder.innerHTML = content;
            container.appendChild(placeholder);
        });
        
        log(`Placeholders mostrados en ${containers.length} contenedores`, 'log');
    }
    
    // Verificación principal
    function verifyAllNetworks() {
        log('===== Iniciando verificación de Ad Networks =====', 'log');
        
        // Detectar protecciones
        detectTrackingProtection();
        detectAdBlocker();
        
        // Verificar cada red
        const results = {
            juicyads: checkJuicyAds(),
            exoclick: checkExoClick(),
            eroadvertising: checkEroAdvertising()
        };
        
        // Contar redes activas
        const activeNetworks = Object.values(results).filter(v => v === true).length;
        
        // Resumen
        log('===== Resumen de verificación =====', 'log');
        log(`Redes activas: ${activeNetworks}/3`, activeNetworks > 0 ? 'success' : 'error');
        
        if (adNetworkStatus.adBlockerDetected) {
            log('⚠️ Ad Blocker detectado - Los anuncios pueden no mostrarse', 'warning');
        }
        
        if (adNetworkStatus.trackingProtection) {
            log('⚠️ Enhanced Tracking Protection activo - Algunas redes bloqueadas', 'warning');
        }
        
        // Mostrar placeholders si es necesario
        if (activeNetworks === 0 || adNetworkStatus.adBlockerDetected) {
            showEnhancedPlaceholders();
        }
        
        // Devolver estado
        return {
            ...adNetworkStatus,
            activeNetworks: activeNetworks,
            timestamp: new Date().toISOString()
        };
    }
    
    // Sistema de reintentos
    let retryCount = 0;
    
    function retryVerification() {
        if (retryCount >= AD_CONFIG.maxRetries) {
            log('Máximo de reintentos alcanzado', 'warning');
            return;
        }
        
        retryCount++;
        log(`Reintento ${retryCount}/${AD_CONFIG.maxRetries}...`, 'log');
        
        setTimeout(() => {
            const results = verifyAllNetworks();
            
            // Si aún no hay redes activas, reintentar
            if (results.activeNetworks === 0 && retryCount < AD_CONFIG.maxRetries) {
                retryVerification();
            }
        }, AD_CONFIG.retryDelay);
    }
    
    // Inicialización
    function init() {
        log('Sistema de verificación de Ad Networks iniciado', 'log');
        
        // Primera verificación
        setTimeout(() => {
            const results = verifyAllNetworks();
            
            // Si no hay redes activas, iniciar reintentos
            if (results.activeNetworks === 0) {
                retryVerification();
            }
            
            // Exponer resultados globalmente
            window.adNetworkStatus = results;
            
            // Disparar evento personalizado
            window.dispatchEvent(new CustomEvent('adNetworksVerified', {
                detail: results
            }));
            
        }, AD_CONFIG.checkDelay);
    }
    
    // Exponer API pública
    window.AdNetworkVerifier = {
        verify: verifyAllNetworks,
        getStatus: () => adNetworkStatus,
        showPlaceholders: showEnhancedPlaceholders,
        config: AD_CONFIG
    };
    
    // Iniciar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
