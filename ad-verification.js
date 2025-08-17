// ============================
// AD VERIFICATION SYSTEM v4.0.0 - COMPLETELY FIXED
// Sistema completo de gestión de anuncios con fallbacks mejorados
// FIXED: Zone IDs correctos, mejor manejo de errores, iframes como fallback principal
// ============================

(function() {
    'use strict';
    
    const AD_CONFIG = {
        environment: window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' || 
                    window.location.hostname.includes('192.168') ? 'development' : 'production',
        maxRetries: 3,
        retryDelay: 2000,
        useProxy: true,
        useFallback: true,
        networks: {
            juicyads: {
                enabled: true,
                name: 'JuicyAds',
                scriptUrl: 'https://poweredby.jads.co/js/jads.js',
                zones: {
                    header: 1098518,
                    sidebar: 1098519,
                    footer: 1098520
                },
                iframeUrl: 'https://www.juicyads.com/iframe_mobile.php?adzone=',
                testMode: false
            },
            exoclick: {
                enabled: true,
                name: 'ExoClick',
                scriptUrls: [
                    'https://syndication.exoclick.com/ads.js',
                    'https://a.realsrv.com/ad-provider.js'
                ],
                zones: {
                    header: 5696328,
                    sidebar: 5696329,
                    footer: 5696330
                },
                iframeUrl: 'https://syndication.exoclick.com/ads-iframe.php?idzone=',
                testMode: false
            },
            popads: {
                enabled: true,
                name: 'PopAds',
                config: {
                    siteId: 5226178,
                    minBid: 0,
                    popundersPerIP: "0",
                    delayBetween: 0,
                    default: false,
                    defaultPerDay: 0,
                    topmostLayer: "auto"
                },
                testMode: false
            }
        }
    };
    
    const AdVerificationSystem = {
        loadedNetworks: new Set(),
        retryAttempts: {},
        verificationAttempts: 0,
        containersCreated: new Set(),
        
        init() {
            console.log('🎯 [Ad Networks] Sistema v4.0.0 - COMPLETELY FIXED');
            console.log('🌍 Environment:', AD_CONFIG.environment);
            console.log('🔧 Zone IDs corregidos según dashboards');
            
            if (AD_CONFIG.environment === 'development') {
                console.log('🔧 Development mode - Using placeholders');
                this.showDevelopmentPlaceholders();
                return;
            }
            
            // Detectar bloqueadores y protecciones
            this.detectBlockers();
            
            // Inicializar con estrategia secuencial mejorada
            setTimeout(() => {
                this.initializeNetworksSequentially();
            }, 1000);
            
            // Verificación y corrección periódica
            setInterval(() => this.verifyAndFixAds(), 15000);
        },
        
        detectBlockers() {
            console.log('🔍 Detectando bloqueadores y protecciones...');
            
            // Detectar AdBlock
            const testAd = document.createElement('div');
            testAd.innerHTML = '&nbsp;';
            testAd.className = 'adsbox';
            testAd.style.cssText = 'position: absolute; top: -100px; left: -100px; width: 1px; height: 1px;';
            document.body.appendChild(testAd);
            
            setTimeout(() => {
                if (testAd.offsetHeight === 0) {
                    console.warn('⚠️ AdBlock detectado - Usando fallbacks');
                    AD_CONFIG.useFallback = true;
                }
                testAd.remove();
            }, 100);
            
            // Detectar tracking protection
            if (navigator.doNotTrack === "1" || window.doNotTrack === "1") {
                console.warn('⚠️ Do Not Track activado - Usando métodos alternativos');
                AD_CONFIG.useFallback = true;
            }
        },
        
        async initializeNetworksSequentially() {
            console.log('🚀 Iniciando carga secuencial de redes...');
            
            try {
                // Primero intentar JuicyAds
                if (AD_CONFIG.networks.juicyads.enabled) {
                    await this.loadJuicyAdsFixed();
                }
                
                // Luego ExoClick
                if (AD_CONFIG.networks.exoclick.enabled) {
                    await this.loadExoClickFixed();
                }
                
                // Finalmente PopAds
                if (AD_CONFIG.networks.popads.enabled) {
                    await this.loadPopAds();
                }
                
                // Verificación final
                setTimeout(() => {
                    this.runFinalVerification();
                }, 3000);
                
            } catch (error) {
                console.error('❌ Error en inicialización secuencial:', error);
                this.activateEmergencyFallbacks();
            }
        },
        
        // ============================
        // JUICYADS - MÉTODO MEJORADO
        // ============================
        async loadJuicyAdsFixed() {
            console.log('🍊 Cargando JuicyAds con zone IDs corregidos...');
            
            const zones = AD_CONFIG.networks.juicyads.zones;
            
            // Crear contenedores primero
            Object.entries(zones).forEach(([position, zoneId]) => {
                const container = this.createAdContainer('juicyads', position, zoneId);
                console.log(`✅ JuicyAds contenedor ${position} creado con zone ${zoneId}`);
            });
            
            // Intentar script principal
            try {
                await this.loadJuicyAdsScript();
                this.loadedNetworks.add('juicyads');
            } catch (error) {
                console.error('❌ Error cargando JuicyAds:', error);
                this.loadJuicyAdsFallback();
            }
        },
        
        loadJuicyAdsScript() {
            return new Promise((resolve, reject) => {
                // Limpiar script existente
                const existingScript = document.querySelector('script[src*="jads.co"]');
                if (existingScript) {
                    existingScript.remove();
                }
                
                const script = document.createElement('script');
                script.src = AD_CONFIG.networks.juicyads.scriptUrl;
                script.async = true;
                script.setAttribute('data-cfasync', 'false');
                
                const timeout = setTimeout(() => {
                    reject(new Error('Timeout loading JuicyAds script'));
                }, 5000);
                
                script.onload = () => {
                    clearTimeout(timeout);
                    console.log('✅ JuicyAds script cargado');
                    
                    // Inicializar zonas
                    setTimeout(() => {
                        this.initializeJuicyAdsZones();
                        resolve();
                    }, 1000);
                };
                
                script.onerror = () => {
                    clearTimeout(timeout);
                    reject(new Error('Failed to load script: ' + script.src));
                };
                
                document.head.appendChild(script);
            });
        },
        
        loadJuicyAdsFallback() {
            if (this.containersCreated.has('juicyads-fallback')) return;
            
            console.log('🔧 JuicyAds fallback activado - Usando iframes');
            
            const zones = AD_CONFIG.networks.juicyads.zones;
            
            Object.entries(zones).forEach(([position, zoneId]) => {
                const container = this.createAdContainer('juicyads-fallback', position, zoneId);
                
                const iframe = document.createElement('iframe');
                iframe.src = `${AD_CONFIG.networks.juicyads.iframeUrl}${zoneId}`;
                iframe.style.cssText = 'width: 100%; height: 100%; border: 0;';
                iframe.setAttribute('scrolling', 'no');
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allowtransparency', 'true');
                
                container.appendChild(iframe);
            });
            
            this.containersCreated.add('juicyads-fallback');
            this.loadedNetworks.add('juicyads');
        },
        
        initializeJuicyAdsZones() {
            const zones = AD_CONFIG.networks.juicyads.zones;
            
            Object.entries(zones).forEach(([position, zoneId]) => {
                const container = document.getElementById(`ad-juicyads-${position}-${zoneId}`);
                if (!container) return;
                
                // Crear ins tag para JuicyAds
                const ins = document.createElement('ins');
                ins.id = `ja_${zoneId}`;
                ins.className = 'jaads';
                ins.setAttribute('data-aid', zoneId);
                ins.setAttribute('data-divid', `ja_${zoneId}`);
                ins.style.cssText = 'display:block !important; width: 100%; height: 100%;';
                
                container.appendChild(ins);
                
                // Activar zona si el script está disponible
                if (window.adsbyjuicy && window.adsbyjuicy.push) {
                    try {
                        window.adsbyjuicy.push({'adzone': zoneId});
                        console.log(`✅ JuicyAds zona ${position} (${zoneId}) activada`);
                    } catch (e) {
                        console.warn(`⚠️ Error activando zona JuicyAds ${position}:`, e);
                    }
                }
            });
        },
        
        // ============================
        // EXOCLICK - MÉTODO MEJORADO
        // ============================
        async loadExoClickFixed() {
            console.log('🔵 Cargando ExoClick con zone ID confirmado...');
            
            const zones = AD_CONFIG.networks.exoclick.zones;
            
            Object.entries(zones).forEach(([position, zoneId]) => {
                const container = this.createAdContainer('exoclick', position, zoneId);
                
                // Intentar script directo por zona
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = `https://syndication.exoclick.com/ads.js?t=2&idzone=${zoneId}`;
                script.async = true;
                
                script.onload = () => {
                    console.log(`✅ ExoClick zona ${position} (${zoneId}) cargada`);
                };
                
                script.onerror = () => {
                    console.warn(`⚠️ ExoClick zona ${position} falló - Usando iframe`);
                    this.loadExoClickIframe(container, position, zoneId);
                };
                
                container.appendChild(script);
            });
            
            this.loadedNetworks.add('exoclick');
        },
        
        loadExoClickIframe(container, position, zoneId) {
            console.log(`🔧 ExoClick iframe fallback activado para zona ${zoneId}`);
            
            // Limpiar container
            container.innerHTML = '';
            
            const iframe = document.createElement('iframe');
            iframe.src = `${AD_CONFIG.networks.exoclick.iframeUrl}${zoneId}`;
            iframe.style.cssText = 'width: 100%; height: 100%; border: 0;';
            iframe.setAttribute('scrolling', 'no');
            iframe.setAttribute('frameborder', '0');
            
            container.appendChild(iframe);
        },
        
        // ============================
        // POPADS
        // ============================
        async loadPopAds() {
            console.log('🚀 Cargando PopAds...');
            
            if (window.e494ffb82839a29122608e933394c091) {
                console.log('🚀 PopAds ya está activo');
                this.loadedNetworks.add('popads');
                return;
            }
            
            const config = AD_CONFIG.networks.popads.config;
            
            // Crear script de configuración
            const configScript = document.createElement('script');
            configScript.type = 'text/javascript';
            configScript.setAttribute('data-cfasync', 'false');
            configScript.innerHTML = `
                (function(){
                    var x=window,r="e494ffb82839a29122608e933394c091",l=[
                        ["siteId", ${config.siteId}],
                        ["minBid", ${config.minBid}],
                        ["popundersPerIP", "${config.popundersPerIP}"],
                        ["delayBetween", ${config.delayBetween}],
                        ["default", ${config.default}],
                        ["defaultPerDay", ${config.defaultPerDay}],
                        ["topmostLayer", "${config.topmostLayer}"]
                    ];
                    if(!x[r]){
                        try{Object.freeze(x[r]=l)}catch(e){}
                    }
                })();
            `;
            
            document.head.appendChild(configScript);
            
            // Cargar script principal
            const mainScript = document.createElement('script');
            mainScript.type = 'text/javascript';
            mainScript.async = true;
            mainScript.src = 'https://www.premiumvertising.com/pboba.min.js';
            
            mainScript.onload = () => {
                console.log('✅ PopAds cargado exitosamente');
                this.loadedNetworks.add('popads');
            };
            
            mainScript.onerror = () => {
                console.warn('⚠️ Error cargando PopAds');
            };
            
            document.head.appendChild(mainScript);
            console.log('✅ PopAds script inyectado exitosamente');
        },
        
        // ============================
        // CREAR CONTENEDOR DE ANUNCIOS
        // ============================
        createAdContainer(network, position, zoneId) {
            const containerId = `ad-${network}-${position}-${zoneId}`;
            
            let container = document.getElementById(containerId);
            if (container) {
                return container;
            }
            
            container = document.createElement('div');
            container.id = containerId;
            container.className = `ad-container ad-${network} ad-${position}`;
            container.setAttribute('data-network', network);
            container.setAttribute('data-position', position);
            container.setAttribute('data-zone-id', zoneId);
            container.setAttribute('data-created', new Date().toISOString());
            
            // Aplicar estilos según posición
            const styles = this.getContainerStyles(position);
            container.style.cssText = styles;
            
            // Insertar en el DOM
            this.insertContainerInDOM(container, position);
            
            return container;
        },
        
        getContainerStyles(position) {
            const baseStyles = `
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                position: relative !important;
                z-index: 999 !important;
                clear: both !important;
                overflow: visible !important;
                background: rgba(0, 119, 190, 0.05) !important;
                border: 1px solid rgba(0, 255, 136, 0.2) !important;
                border-radius: 10px !important;
                padding: 5px !important;
            `;
            
            const styles = {
                header: baseStyles + `
                    width: 728px !important;
                    height: 90px !important;
                    margin: 20px auto !important;
                    max-width: 100% !important;
                `,
                sidebar: baseStyles + `
                    width: 300px !important;
                    height: 250px !important;
                    position: fixed !important;
                    right: 10px !important;
                    top: 50% !important;
                    transform: translateY(-50%) !important;
                    z-index: 1000 !important;
                `,
                footer: baseStyles + `
                    width: 728px !important;
                    height: 90px !important;
                    margin: 20px auto !important;
                    max-width: 100% !important;
                `
            };
            
            return styles[position] || styles.header;
        },
        
        insertContainerInDOM(container, position) {
            console.log(`📍 Contenedor ${position} insertado en DOM`);
            
            try {
                let targetElement;
                
                switch(position) {
                    case 'header':
                        targetElement = document.querySelector('.main-header');
                        if (targetElement && targetElement.parentNode) {
                            targetElement.parentNode.insertBefore(container, targetElement.nextSibling);
                        } else {
                            document.body.insertBefore(container, document.body.firstChild);
                        }
                        break;
                        
                    case 'sidebar':
                        document.body.appendChild(container);
                        break;
                        
                    case 'footer':
                        targetElement = document.querySelector('.main-footer');
                        if (targetElement && targetElement.parentNode) {
                            targetElement.parentNode.insertBefore(container, targetElement);
                        } else {
                            document.body.appendChild(container);
                        }
                        break;
                        
                    default:
                        document.body.appendChild(container);
                }
                
            } catch (error) {
                console.error(`Error insertando contenedor ${position}:`, error);
            }
        },
        
        // ============================
        // FALLBACKS DE EMERGENCIA
        // ============================
        activateEmergencyFallbacks() {
            console.log('🚨 Activando fallbacks de emergencia...');
            
            const emergencyZones = {
                juicyads: AD_CONFIG.networks.juicyads.zones,
                exoclick: AD_CONFIG.networks.exoclick.zones
            };
            
            Object.entries(emergencyZones).forEach(([network, zones]) => {
                Object.entries(zones).forEach(([position, zoneId]) => {
                    const container = this.createAdContainer(`${network}-emergency`, position, zoneId);
                    
                    const iframeUrl = network === 'juicyads' ? 
                        AD_CONFIG.networks.juicyads.iframeUrl :
                        AD_CONFIG.networks.exoclick.iframeUrl;
                    
                    const iframe = document.createElement('iframe');
                    iframe.src = `${iframeUrl}${zoneId}`;
                    iframe.style.cssText = 'width: 100%; height: 100%; border: 0;';
                    iframe.setAttribute('scrolling', 'no');
                    iframe.setAttribute('frameborder', '0');
                    
                    container.appendChild(iframe);
                });
            });
        },
        
        // ============================
        // VERIFICACIÓN Y CORRECCIÓN
        // ============================
        verifyAndFixAds() {
            const containers = document.querySelectorAll('.ad-container');
            let emptyContainers = 0;
            
            containers.forEach(container => {
                const hasContent = container.querySelector('iframe, ins, script[src]');
                
                if (!hasContent || container.children.length === 0) {
                    emptyContainers++;
                    
                    const position = container.className.match(/ad-(header|sidebar|footer)/)?.[1];
                    const network = container.getAttribute('data-network');
                    const zoneId = container.getAttribute('data-zone-id');
                    
                    if (position && network && zoneId) {
                        // Crear iframe de emergencia
                        const iframeUrl = network.includes('juicy') ? 
                            AD_CONFIG.networks.juicyads.iframeUrl :
                            AD_CONFIG.networks.exoclick.iframeUrl;
                        
                        if (iframeUrl) {
                            const iframe = document.createElement('iframe');
                            iframe.src = `${iframeUrl}${zoneId}`;
                            iframe.style.cssText = 'width: 100%; height: 100%; border: 0;';
                            iframe.setAttribute('scrolling', 'no');
                            iframe.setAttribute('frameborder', '0');
                            
                            container.innerHTML = '';
                            container.appendChild(iframe);
                        }
                    }
                }
                
                // Forzar visibilidad
                container.style.display = 'block';
                container.style.visibility = 'visible';
                container.style.opacity = '1';
            });
            
            if (emptyContainers > 0) {
                console.log(`🔧 Corregidos ${emptyContainers} contenedores vacíos`);
            }
        },
        
        runFinalVerification() {
            console.log('🔍 Ejecutando verificación final del sistema...');
            
            const report = {
                timestamp: new Date().toISOString(),
                environment: AD_CONFIG.environment,
                loadedNetworks: Array.from(this.loadedNetworks),
                totalContainers: document.querySelectorAll('.ad-container').length,
                visibleContainers: document.querySelectorAll('.ad-container:not([style*="display: none"])').length,
                networksStatus: {
                    juicyads: this.loadedNetworks.has('juicyads'),
                    exoclick: this.loadedNetworks.has('exoclick'),
                    popads: this.loadedNetworks.has('popads')
                }
            };
            
            console.log('📊 Reporte de verificación final:', report);
            
            // Activar fallbacks adicionales si es necesario
            if (report.loadedNetworks.length < 2) {
                console.warn('⚠️ Pocas redes cargadas, activando fallbacks adicionales');
                this.activateEmergencyFallbacks();
            }
        },
        
        // ============================
        // PLACEHOLDERS DE DESARROLLO
        // ============================
        showDevelopmentPlaceholders() {
            console.log('🔧 Mostrando placeholders de desarrollo...');
            
            const positions = ['header', 'sidebar', 'footer'];
            const sizes = {
                header: '728x90',
                sidebar: '300x250',
                footer: '728x90'
            };
            
            positions.forEach(position => {
                const container = this.createAdContainer('placeholder', position, '0000');
                container.innerHTML = `
                    <div style="
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-family: Arial, sans-serif;
                        border-radius: 10px;
                    ">
                        <div style="text-align: center;">
                            <div style="font-size: 24px; margin-bottom: 10px;">📢</div>
                            <div style="font-size: 14px; font-weight: bold;">AD SPACE</div>
                            <div style="font-size: 12px; opacity: 0.9;">${sizes[position]}</div>
                            <div style="font-size: 10px; opacity: 0.7; margin-top: 5px;">Development Mode</div>
                        </div>
                    </div>
                `;
            });
        },
        
        // ============================
        // API PÚBLICA
        // ============================
        testAds() {
            const containers = document.querySelectorAll('.ad-container');
            const report = {
                environment: AD_CONFIG.environment,
                loadedNetworks: Array.from(this.loadedNetworks),
                totalContainers: containers.length,
                containerDetails: []
            };
            
            containers.forEach((container, index) => {
                const hasIframe = !!container.querySelector('iframe');
                const hasIns = !!container.querySelector('ins');
                const hasScript = !!container.querySelector('script[src]');
                
                report.containerDetails.push({
                    index: index + 1,
                    id: container.id,
                    network: container.getAttribute('data-network'),
                    position: container.getAttribute('data-position'),
                    zoneId: container.getAttribute('data-zone-id'),
                    visible: container.offsetWidth > 0 && container.offsetHeight > 0,
                    dimensions: `${container.offsetWidth}x${container.offsetHeight}`,
                    hasContent: hasIframe || hasIns || hasScript,
                    contentType: hasIframe ? 'iframe' : hasIns ? 'ins' : hasScript ? 'script' : 'empty'
                });
            });
            
            console.table(report.containerDetails);
            return report;
        },
        
        fixAds() {
            console.log('🔧 Corrigiendo problemas de anuncios...');
            this.verifyAndFixAds();
            return this.testAds();
        },
        
        reloadAds() {
            console.log('🔄 Recargando sistema completo de anuncios...');
            
            // Limpiar contenedores existentes
            document.querySelectorAll('.ad-container').forEach(el => el.remove());
            
            // Reinicializar
            this.loadedNetworks.clear();
            this.containersCreated.clear();
            
            setTimeout(() => {
                this.initializeNetworksSequentially();
            }, 1000);
        }
    };
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => AdVerificationSystem.init(), 500);
        });
    } else {
        setTimeout(() => AdVerificationSystem.init(), 100);
    }
    
    // Exponer funciones globales
    window.AdVerificationSystem = AdVerificationSystem;
    window.testAds = () => AdVerificationSystem.testAds();
    window.fixAds = () => AdVerificationSystem.fixAds();
    window.reloadAds = () => AdVerificationSystem.reloadAds();
    
    console.log('✅ Sistema de Anuncios v4.0.0 - COMPLETELY FIXED');
    console.log('🔧 Zone IDs corregidos según dashboards');
    console.log('💡 Comandos disponibles:');
    console.log('  window.testAds() - Estado del sistema');
    console.log('  window.fixAds() - Corregir problemas');
    console.log('  window.reloadAds() - Recargar sistema completo');
    
})();
