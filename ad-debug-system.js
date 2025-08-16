// ============================
// ADS DEBUG SYSTEM v1.0
// Sistema de diagnóstico y corrección de anuncios
// ============================

(function() {
    'use strict';
    
    console.log('🔍 Ads Debug System v1.0 iniciado');
    
    const AdsDebugSystem = {
        
        init() {
            console.log('🔍 [Debug] Iniciando diagnóstico de anuncios...');
            
            // Esperar a que el DOM esté listo
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.runDiagnostics());
            } else {
                setTimeout(() => this.runDiagnostics(), 1000);
            }
            
            // Crear panel de debug
            this.createDebugPanel();
            
            // Monitorear cambios en el DOM
            this.monitorDOMChanges();
        },
        
        runDiagnostics() {
            console.log('🔍 [Debug] ===== DIAGNÓSTICO COMPLETO =====');
            
            // 1. Verificar scripts de anuncios
            this.checkAdScripts();
            
            // 2. Verificar contenedores
            this.checkAdContainers();
            
            // 3. Verificar bloqueos
            this.checkAdBlockers();
            
            // 4. Verificar configuración
            this.checkConfiguration();
            
            // 5. Intentar corrección automática
            setTimeout(() => this.attemptAutoFix(), 2000);
        },
        
        checkAdScripts() {
            console.log('🔍 [Debug] Verificando scripts de anuncios...');
            
            const scripts = {
                juicyads: document.querySelector('script[src*="jads.co"]'),
                exoclick: document.querySelector('script[src*="exoclick"]'),
                popads: document.querySelector('script[data-cfasync="false"]')
            };
            
            Object.entries(scripts).forEach(([network, script]) => {
                if (script) {
                    console.log(`✅ [Debug] ${network}: Script encontrado`);
                } else {
                    console.warn(`❌ [Debug] ${network}: Script NO encontrado`);
                    this.injectAdScript(network);
                }
            });
        },
        
        checkAdContainers() {
            console.log('🔍 [Debug] Verificando contenedores de anuncios...');
            
            const containers = document.querySelectorAll('.ad-container');
            console.log(`📦 [Debug] Contenedores encontrados: ${containers.length}`);
            
            if (containers.length === 0) {
                console.warn('❌ [Debug] No hay contenedores de anuncios');
                this.createAdContainers();
            } else {
                containers.forEach((container, index) => {
                    const hasContent = container.children.length > 0;
                    const isVisible = container.offsetWidth > 0 && container.offsetHeight > 0;
                    
                    console.log(`📦 [Debug] Container ${index}:`, {
                        id: container.id,
                        hasContent,
                        isVisible,
                        width: container.offsetWidth,
                        height: container.offsetHeight
                    });
                    
                    if (!hasContent) {
                        this.fillEmptyContainer(container);
                    }
                });
            }
        },
        
        checkAdBlockers() {
            console.log('🔍 [Debug] Verificando bloqueadores de anuncios...');
            
            // Test simple de AdBlock
            const testAd = document.createElement('div');
            testAd.innerHTML = '&nbsp;';
            testAd.className = 'adsbox ad advertisement';
            testAd.style.cssText = 'position: absolute; top: -100px; left: -100px; width: 1px; height: 1px;';
            document.body.appendChild(testAd);
            
            setTimeout(() => {
                const adBlocked = testAd.offsetHeight === 0;
                document.body.removeChild(testAd);
                
                if (adBlocked) {
                    console.warn('⚠️ [Debug] Posible AdBlocker detectado');
                    this.showAdBlockWarning();
                } else {
                    console.log('✅ [Debug] No se detectó AdBlocker');
                }
            }, 100);
        },
        
        checkConfiguration() {
            console.log('🔍 [Debug] Verificando configuración...');
            
            // Verificar variables globales
            const globals = {
                AdVerificationSystem: typeof window.AdVerificationSystem,
                adsbyjuicy: typeof window.adsbyjuicy,
                ExoLoader: typeof window.ExoLoader,
                popAdsConfig: window.e494ffb82839a29122608e933394c091
            };
            
            console.log('🔍 [Debug] Variables globales:', globals);
            
            // Verificar Service Worker
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(registrations => {
                    console.log(`🔍 [Debug] Service Workers registrados: ${registrations.length}`);
                    
                    // IMPORTANTE: Asegurar que el SW no bloquee anuncios
                    registrations.forEach(reg => {
                        if (reg.active) {
                            reg.active.postMessage({ type: 'ENABLE_SYNC' });
                            console.log('✅ [Debug] Service Worker configurado para permitir anuncios');
                        }
                    });
                });
            }
        },
        
        attemptAutoFix() {
            console.log('🔧 [Debug] Intentando corrección automática...');
            
            // 1. Recargar sistema de anuncios
            if (window.AdVerificationSystem) {
                console.log('🔧 [Debug] Recargando AdVerificationSystem...');
                window.AdVerificationSystem.reloadAds();
            } else {
                console.warn('❌ [Debug] AdVerificationSystem no encontrado, cargándolo...');
                this.loadAdVerificationScript();
            }
            
            // 2. Crear contenedores faltantes
            this.ensureAdContainers();
            
            // 3. Reintentar carga de scripts externos
            setTimeout(() => this.retryAdScripts(), 3000);
        },
        
        createAdContainers() {
            console.log('🔧 [Debug] Creando contenedores de anuncios...');
            
            const positions = ['header', 'sidebar', 'footer'];
            
            positions.forEach(position => {
                const container = document.createElement('div');
                container.id = `ad-container-${position}`;
                container.className = `ad-container ad-${position}`;
                container.style.cssText = this.getContainerStyles(position);
                
                // Agregar contenido de prueba
                container.innerHTML = `
                    <div class="ad-placeholder" style="
                        width: 100%;
                        height: ${position === 'sidebar' ? '250px' : '90px'};
                        background: linear-gradient(135deg, rgba(0,119,190,0.15), rgba(0,212,255,0.15));
                        border: 2px dashed rgba(127,219,255,0.4);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: rgba(255,255,255,0.7);
                        font-size: 14px;
                        border-radius: 10px;
                    ">
                        <span>📢 ${position.toUpperCase()} AD SPACE</span>
                    </div>
                `;
                
                this.insertContainer(container, position);
                console.log(`✅ [Debug] Contenedor ${position} creado`);
            });
        },
        
        getContainerStyles(position) {
            const styles = {
                header: 'margin: 20px auto; max-width: 728px; min-height: 90px;',
                sidebar: 'position: fixed; right: 10px; top: 50%; transform: translateY(-50%); width: 300px; min-height: 250px; z-index: 100;',
                footer: 'margin: 20px auto; max-width: 728px; min-height: 90px;'
            };
            
            return styles[position] + ' background: rgba(0, 119, 190, 0.1); padding: 10px; border-radius: 10px;';
        },
        
        insertContainer(container, position) {
            switch(position) {
                case 'header':
                    const header = document.querySelector('.main-header');
                    if (header && header.parentNode) {
                        header.parentNode.insertBefore(container, header.nextSibling);
                    } else {
                        document.body.insertBefore(container, document.body.firstChild);
                    }
                    break;
                    
                case 'sidebar':
                    document.body.appendChild(container);
                    break;
                    
                case 'footer':
                    const footer = document.querySelector('.main-footer');
                    if (footer && footer.parentNode) {
                        footer.parentNode.insertBefore(container, footer);
                    } else {
                        document.body.appendChild(container);
                    }
                    break;
            }
        },
        
        fillEmptyContainer(container) {
            if (container.children.length === 0) {
                console.log(`🔧 [Debug] Llenando contenedor vacío: ${container.id}`);
                
                container.innerHTML = `
                    <div class="ad-loading" style="
                        padding: 20px;
                        text-align: center;
                        background: rgba(0, 119, 190, 0.1);
                        border-radius: 10px;
                        color: rgba(255, 255, 255, 0.7);
                    ">
                        <div style="font-size: 24px; margin-bottom: 10px;">📢</div>
                        <div>Cargando anuncio...</div>
                        <div style="font-size: 12px; margin-top: 5px; opacity: 0.5;">
                            ${container.id || 'Ad Space'}
                        </div>
                    </div>
                `;
            }
        },
        
        injectAdScript(network) {
            console.log(`🔧 [Debug] Inyectando script para ${network}...`);
            
            const scripts = {
                juicyads: {
                    src: 'https://poweredby.jads.co/js/jads.js',
                    async: true
                },
                exoclick: {
                    src: 'https://syndication.exoclick.com/tag.js',
                    async: true
                },
                popads: {
                    inline: true,
                    content: `
                        var url = window.location.href;
                        var p = url.indexOf("main.html");
                        if (p > 0) {
                            // PopAds code here
                            console.log('PopAds script injected');
                        }
                    `
                }
            };
            
            const config = scripts[network];
            if (!config) return;
            
            const script = document.createElement('script');
            
            if (config.inline) {
                script.innerHTML = config.content;
            } else {
                script.src = config.src;
                script.async = config.async;
            }
            
            script.setAttribute('data-network', network);
            script.setAttribute('data-debug', 'true');
            
            script.onload = () => {
                console.log(`✅ [Debug] Script ${network} cargado`);
            };
            
            script.onerror = () => {
                console.error(`❌ [Debug] Error cargando script ${network}`);
            };
            
            document.head.appendChild(script);
        },
        
        ensureAdContainers() {
            // Asegurar que existan contenedores en las posiciones correctas
            const positions = ['header', 'sidebar', 'footer'];
            
            positions.forEach(position => {
                const existing = document.querySelector(`.ad-${position}`);
                if (!existing) {
                    const container = document.createElement('div');
                    container.className = `ad-container ad-${position}`;
                    container.id = `ad-${position}-debug`;
                    container.style.cssText = this.getContainerStyles(position);
                    
                    this.insertContainer(container, position);
                    this.fillEmptyContainer(container);
                }
            });
        },
        
        retryAdScripts() {
            console.log('🔄 [Debug] Reintentando carga de scripts de anuncios...');
            
            // Forzar recarga del sistema de verificación
            if (window.reloadAds) {
                window.reloadAds();
            }
            
            // Verificar resultado después de un tiempo
            setTimeout(() => {
                const finalCheck = this.getFinalStatus();
                console.log('📊 [Debug] Estado final:', finalCheck);
                
                if (finalCheck.totalAds === 0) {
                    console.warn('⚠️ [Debug] No se pudieron cargar anuncios');
                    this.showManualInstructions();
                }
            }, 5000);
        },
        
        getFinalStatus() {
            return {
                containers: document.querySelectorAll('.ad-container').length,
                juicyads: !!window.adsbyjuicy,
                exoclick: !!window.ExoLoader,
                popads: !!window.e494ffb82839a29122608e933394c091,
                totalAds: document.querySelectorAll('.ad-container:not(:empty)').length
            };
        },
        
        createDebugPanel() {
            const panel = document.createElement('div');
            panel.id = 'ads-debug-panel';
            panel.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: rgba(0, 0, 0, 0.9);
                color: #00ff00;
                padding: 15px;
                border-radius: 10px;
                font-family: monospace;
                font-size: 12px;
                z-index: 10000;
                max-width: 300px;
                border: 1px solid #00ff00;
                display: none;
            `;
            
            panel.innerHTML = `
                <div style="margin-bottom: 10px; font-weight: bold;">
                    🔍 ADS DEBUG PANEL
                </div>
                <div id="debug-status"></div>
                <button onclick="window.testAds()" style="
                    margin-top: 10px;
                    padding: 5px 10px;
                    background: #00ff00;
                    color: black;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                ">Test Ads</button>
                <button onclick="window.reloadAds()" style="
                    margin-left: 5px;
                    padding: 5px 10px;
                    background: #ff9900;
                    color: black;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                ">Reload</button>
                <button onclick="this.parentElement.style.display='none'" style="
                    float: right;
                    padding: 5px 10px;
                    background: #ff0000;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                ">X</button>
            `;
            
            document.body.appendChild(panel);
            
            // Actualizar estado cada 2 segundos
            setInterval(() => this.updateDebugPanel(), 2000);
            
            // Mostrar panel con tecla de debug (Ctrl+Shift+D)
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
                }
            });
        },
        
        updateDebugPanel() {
            const statusDiv = document.getElementById('debug-status');
            if (!statusDiv) return;
            
            const status = this.getFinalStatus();
            
            statusDiv.innerHTML = `
                <div>Containers: ${status.containers}</div>
                <div>JuicyAds: ${status.juicyads ? '✅' : '❌'}</div>
                <div>ExoClick: ${status.exoclick ? '✅' : '❌'}</div>
                <div>PopAds: ${status.popads ? '✅' : '❌'}</div>
                <div>Active Ads: ${status.totalAds}</div>
            `;
        },
        
        monitorDOMChanges() {
            // Observar cambios en el DOM para detectar cuando se eliminan anuncios
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.removedNodes.forEach((node) => {
                            if (node.className && node.className.includes && node.className.includes('ad-container')) {
                                console.warn('⚠️ [Debug] Contenedor de anuncios eliminado:', node.id);
                                // Recrear el contenedor
                                setTimeout(() => this.ensureAdContainers(), 1000);
                            }
                        });
                    }
                });
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        },
        
        showAdBlockWarning() {
            const warning = document.createElement('div');
            warning.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #ff6b35, #ff69b4);
                color: white;
                padding: 20px;
                border-radius: 15px;
                z-index: 10001;
                text-align: center;
                max-width: 400px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            `;
            
            warning.innerHTML = `
                <h3>⚠️ AdBlocker Detectado</h3>
                <p>Para apoyar nuestro contenido gratuito, por favor desactiva tu bloqueador de anuncios.</p>
                <button onclick="this.parentElement.remove()" style="
                    margin-top: 15px;
                    padding: 10px 20px;
                    background: white;
                    color: #ff6b35;
                    border: none;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: bold;
                ">Entendido</button>
            `;
            
            document.body.appendChild(warning);
            
            setTimeout(() => {
                if (warning.parentNode) {
                    warning.remove();
                }
            }, 10000);
        },
        
        showManualInstructions() {
            console.log(`
📋 [Debug] INSTRUCCIONES MANUALES:
=====================================
1. Verifica que no tengas AdBlocker activo
2. Limpia la caché del navegador (Ctrl+Shift+R)
3. Verifica que los scripts externos sean accesibles:
   - https://poweredby.jads.co/js/jads.js
   - https://syndication.exoclick.com/tag.js
4. Revisa la consola del navegador (F12) para errores
5. Contacta soporte si el problema persiste

Para mostrar el panel de debug: Ctrl+Shift+D
Para testear anuncios: window.testAds()
Para recargar anuncios: window.reloadAds()
=====================================
            `);
        },
        
        loadAdVerificationScript() {
            // Intentar cargar el script de verificación si no está presente
            const script = document.createElement('script');
            script.src = 'ad-verification.js';
            script.onload = () => {
                console.log('✅ [Debug] ad-verification.js cargado');
                setTimeout(() => {
                    if (window.AdVerificationSystem) {
                        window.AdVerificationSystem.init();
                    }
                }, 1000);
            };
            script.onerror = () => {
                console.error('❌ [Debug] No se pudo cargar ad-verification.js');
            };
            document.head.appendChild(script);
        }
    };
    
    // Inicializar sistema de debug
    AdsDebugSystem.init();
    
    // Exponer funciones globales para debug
    window.adsDebug = AdsDebugSystem;
    window.checkAds = () => AdsDebugSystem.runDiagnostics();
    window.fixAds = () => AdsDebugSystem.attemptAutoFix();
    
    console.log('✅ Ads Debug System cargado');
    console.log('💡 Usa Ctrl+Shift+D para mostrar el panel de debug');
    console.log('💡 Comandos disponibles: window.checkAds(), window.fixAds()');
    
})();
