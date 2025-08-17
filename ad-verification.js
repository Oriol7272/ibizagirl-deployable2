// ============================
// AD VERIFICATION SYSTEM v5.1.0 - COMPLETAMENTE CORREGIDO
// Sistema completo de gestión de anuncios con zone IDs correctos
// FIXED: Zone IDs actualizados, scripts corregidos, mejor gestión de errores
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
                fallbackUrl: 'https://www.juicyads.com/js/jads.js',
                zones: {
                    // FIXED: Zone IDs correctos del dashboard de JuicyAds
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
                    // FIXED: Zone IDs correctos del dashboard de ExoClick
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
            console.log('🎯 [Ad Networks] Sistema v5.1.0 - COMPLETAMENTE CORREGIDO');
            console.log('🌍 Environment:', AD_CONFIG.environment);
            console.log('🔧 Zone IDs actualizados según dashboards');
            
            if (AD_CONFIG.environment === 'development') {
                console.log('🔧 Development mode - Using test placeholders');
                this.showDevelopmentPlaceholders();
                return;
            }
            
            // Detectar bloqueadores
            this.detectBlockers();
            
            // Inicializar con estrategia secuencial
            setTimeout(() => {
                this.initializeNetworksSequentially();
            }, 1000);
            
            // Verificación periódica
            setInterval(() => this.verifyAndFixAds(), 30000);
        },
        
        detectBlockers() {
            console.log('🔍 Detectando bloqueadores...');
            
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
        },
        
        async initializeNetworksSequentially() {
            console.log('🚀 Iniciando carga secuencial de redes...');
            
            try {
                // JuicyAds
                if (AD_CONFIG.networks.juicyads.enabled) {
                    await this.loadJuicyAdsFixed();
                }
                
                // ExoClick  
                if (AD_CONFIG.networks.exoclick.enabled) {
                    await this.loadExoClickFixed();
                }
                
                // PopAds
                if (AD_CONFIG.networks.popads.enabled) {
                    await this.loadPopAds();
                }
                
                // Verificación final
                setTimeout(() => {
                    this.runFinalVerification();
                }, 3000);
                
            } catch (error) {
                console.error('❌ Error en inicialización:', error);
                this.activateEmergencyFallbacks();
            }
        },
        
        // ============================
        // JUICYADS - MÉTODO COMPLETAMENTE CORREGIDO
        // ============================
        async loadJuicyAdsFixed() {
            console.log('🟠 Cargando JuicyAds con zone IDs correctos...');
            
            const zones = AD_CONFIG.networks.juicyads.zones;
            
            // Crear contenedores primero
            Object.entries(zones).forEach(([position, zoneId]) => {
                const container = this.createAdContainer('juicyads', position, zoneId);
                console.log(`✅ JuicyAds contenedor ${position} creado con zone ${zoneId}`);
            });
            
            try {
                await this.loadJuicyAdsScript();
                this.loadedNetworks.add('juicyads');
                console.log('✅ JuicyAds script cargado');
            } catch (error) {
                console.warn('⚠️ Script JuicyAds falló:', error.message);
                this.loadJuicyAdsFallback();
            }
        },
        
        loadJuicyAdsScript() {
            return new Promise((resolve, reject) => {
                // Limpiar script existente
                const existingScript = document.querySelector('script[src*="jads"]');
                if (existingScript) {
                    existingScript.remove();
                }
                
                const script = document.createElement('script');
                script.src = AD_CONFIG.networks.juicyads.scriptUrl;
                script.async = true;
                script.setAttribute('data-cfasync', 'false');
                script.type = 'text/javascript';
                
                const timeout = setTimeout(() => {
                    script.remove();
                    reject(new Error('Timeout JuicyAds'));
                }, 10000);
                
                script.onload = () => {
                    clearTimeout(timeout);
                    console.log('✅ JuicyAds script cargado');
                    
                    setTimeout(() => {
                        this.initializeJuicyAdsZones();
                        resolve();
                    }, 1500);
                };
                
                script.onerror = () => {
                    clearTimeout(timeout);
                    script.remove();
                    reject(new Error('Error cargando JuicyAds'));
                };
                
                document.head.appendChild(script);
            });
        },
        
        loadJuicyAdsFallback() {
            console.log('🔧 JuicyAds fallback - iframes directos');
            
            const zones = AD_CONFIG.networks.juicyads.zones;
            
            Object.entries(zones).forEach(([position, zoneId]) => {
                const container = this.createAdContainer('juicyads-fallback', position, zoneId);
                
                container.innerHTML = '';
                
                const iframe = document.createElement('iframe');
                iframe.src = `${AD_CONFIG.networks.juicyads.iframeUrl}${zoneId}`;
                iframe.style.cssText = `
                    width: 100% !important; 
                    height: 100% !important; 
                    border: 0 !important;
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                `;
                iframe.setAttribute('scrolling', 'no');
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allowtransparency', 'true');
                
                container.appendChild(iframe);
                console.log(`✅ JuicyAds iframe ${position} (${zoneId}) creado`);
            });
            
            this.loadedNetworks.add('juicyads');
        },
        
        initializeJuicyAdsZones() {
            const zones = AD_CONFIG.networks.juicyads.zones;
            
            // Inicializar window.adsbyjuicy
            if (!window.adsbyjuicy) {
                window.adsbyjuicy = window.adsbyjuicy || [];
            }
            
            Object.entries(zones).forEach(([position, zoneId]) => {
                const container = document.getElementById(`ad-juicyads-${position}-${zoneId}`);
                if (!container) return;
                
                container.innerHTML = '';
                
                // Crear ins tag
                const ins = document.createElement('ins');
                ins.id = `ja_${zoneId}`;
                ins.className = 'jaads';
                ins.setAttribute('data-aid', zoneId);
                ins.setAttribute('data-divid', `ja_${zoneId}`);
                ins.style.cssText = `
                    display: block !important; 
                    width: 100% !important; 
                    height: 100% !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                `;
                
                container.appendChild(ins);
                
                // Activar zona
                try {
                    if (window.adsbyjuicy && Array.isArray(window.adsbyjuicy)) {
                        window.adsbyjuicy.push({'adzone': zoneId});
                        console.log(`✅ JuicyAds zona ${position} (${zoneId}) activada`);
                    }
                } catch (e) {
                    console.warn(`⚠️ Error activando zona ${position}:`, e);
                    this.createDirectJuicyAdIframe(container, zoneId);
                }
            });
        },
        
        createDirectJuicyAdIframe(container, zoneId) {
            const iframe = document.createElement('iframe');
            iframe.src = `${AD_CONFIG.networks.juicyads.iframeUrl}${zoneId}`;
            iframe.style.cssText = `
                width: 100% !important; 
                height: 100% !important; 
                border: 0 !important;
                display: block !important;
            `;
            iframe.setAttribute('scrolling', 'no');
            iframe.setAttribute('frameborder', '0');
            
            container.innerHTML = '';
            container.appendChild(iframe);
            console.log(`🔧 JuicyAds iframe directo para zona ${zoneId}`);
        },
        
        // ============================
        // EXOCLICK - MÉTODO CORREGIDO
        // ============================
        async loadExoClickFixed() {
            console.log('🔵 Cargando ExoClick con zone IDs correctos...');
            
            const zones = AD_CONFIG.networks.exoclick.zones;
            
            // Crear contenedores e iframes directamente
            Object.entries(zones).forEach(([position, zoneId]) => {
                const container = this.createAdContainer('exoclick', position, zoneId);
                this.loadExoClickIframe(container, position, zoneId);
            });
            
            this.loadedNetworks.add('exoclick');
        },
        
        loadExoClickIframe(container, position, zoneId) {
            console.log(`🔧 ExoClick iframe para zona ${zoneId}`);
            
            container.innerHTML = '';
            
            const iframe = document.createElement('iframe');
            iframe.src = `${AD_CONFIG.networks.exoclick.iframeUrl}${zoneId}`;
            iframe.style.cssText = `
                width: 100% !important; 
                height: 100% !important; 
                border: 0 !important;
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
            `;
            iframe.setAttribute('scrolling', 'no');
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allowtransparency', 'true');
            iframe.setAttribute('data-zone-id', zoneId);
            
            iframe.onload = () => {
                console.log(`✅ ExoClick iframe ${position} (${zoneId}) cargado`);
            };
            
            iframe.onerror = () => {
                console.warn(`⚠️ ExoClick iframe ${position} (${zoneId}) falló`);
                this.createExoClickPlaceholder(container, position, zoneId);
            };
            
            container.appendChild(iframe);
        },
        
        createExoClickPlaceholder(container, position, zoneId) {
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
                    text-align: center;
                ">
                    <div>
                        <div style="font-size: 24px; margin-bottom: 10px;">📢</div>
                        <div style="font-size: 14px; font-weight: bold;">ExoClick</div>
                        <div style="font-size: 12px; opacity: 0.9;">Zone ${zoneId}</div>
                        <div style="font-size: 10px; opacity: 0.7; margin-top: 5px;">${position}</div>
                    </div>
                </div>
            `;
        },
        
        // ============================
        // POPADS - CORREGIDO
        // ============================
        async loadPopAds() {
            console.log('🚀 Cargando PopAds...');
            
            if (window.e494ffb82839a29122608e933394c091) {
                console.log('✅ PopAds ya activo');
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
            return new Promise((resolve, reject) => {
                const mainScript = document.createElement('script');
                mainScript.type = 'text/javascript';
                mainScript.async = true;
                mainScript.src = 'https://www.premiumvertising.com/pboba.min.js';
                
                const timeout = setTimeout(() => {
                    mainScript.remove();
                    console.warn('⚠️ PopAds timeout');
                    resolve();
                }, 10000);
                
                mainScript.onload = () => {
                    clearTimeout(timeout);
                    console.log('✅ PopAds cargado');
                    this.loadedNetworks.add('popads');
                    resolve();
                };
                
                mainScript.onerror = () => {
                    clearTimeout(timeout);
                    mainScript.remove();
                    console.warn('⚠️ Error cargando PopAds');
                    resolve();
                };
                
                document.head.appendChild(mainScript);
            });
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
            
            // Aplicar estilos
            const styles = this.getContainerStyles(position);
            container.style.cssText = styles;
            
            // Insertar en DOM
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
                box-sizing: border-box !important;
            `;
            
            const styles = {
                header: baseStyles + `
                    width: 100% !important;
                    max-width: 728px !important;
                    height: 90px !important;
                    margin: 20px auto !important;
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
                    width: 100% !important;
                    max-width: 728px !important;
                    height: 90px !important;
                    margin: 20px auto !important;
                `
            };
            
            return styles[position] || styles.header;
        },
        
        insertContainerInDOM(container, position) {
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
                    iframe.style.cssText = `
                        width: 100% !important; 
                        height: 100% !important; 
                        border: 0 !important;
                        display: block !important;
                    `;
                    iframe.setAttribute('scrolling', 'no');
                    iframe.setAttribute('frameborder', '0');
                    
                    container.appendChild(iframe);
                    console.log(`🚨 Emergency fallback ${network} ${position} (${zoneId}) creado`);
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
                        const iframeUrl = network.includes('juicy') ? 
                            AD_CONFIG.networks.juicyads.iframeUrl :
                            AD_CONFIG.networks.exoclick.iframeUrl;
                        
                        const iframe = document.createElement('iframe');
                        iframe.src = `${iframeUrl}${zoneId}`;
                        iframe.style.cssText = `
                            width: 100% !important; 
                            height: 100% !important; 
                            border: 0 !important;
                            display: block !important;
                        `;
                        iframe.setAttribute('scrolling', 'no');
                        iframe.setAttribute('frameborder', '0');
                        
                        container.innerHTML = '';
                        container.appendChild(iframe);
                        
                        console.log(`🔧 Contenedor vacío reparado: ${position} (${zoneId})`);
                    }
                }
            });
            
            if (emptyContainers > 0) {
                console.log(`🔧 ${emptyContainers} contenedores reparados`);
            }
        },
        
        runFinalVerification() {
            console.log('🔍 Verificación final de anuncios...');
            
            const report = {
                containers: document.querySelectorAll('.ad-container').length,
                juicyads: document.querySelectorAll('[id*="juicyads"], .jaads').length,
                exoclick: document.querySelectorAll('[id*="exoclick"], .adsbyexoclick').length,
                popads: !!window.e494ffb82839a29122608e933394c091,
                loadedNetworks: Array.from(this.loadedNetworks)
            };
            
            console.table(report);
            
            if (report.containers === 0) {
                console.warn('⚠️ No se crearon contenedores, activando emergencia');
                this.activateEmergencyFallbacks();
            }
        },
        
        showDevelopmentPlaceholders() {
            console.log('🔧 Mostrando placeholders de desarrollo...');
            
            const positions = ['header', 'sidebar', 'footer'];
            const zones = [1098518, 1098519, 1098520];
            
            positions.forEach((position, index) => {
                const container = this.createAdContainer('dev', position, zones[index]);
                container.innerHTML = `
                    <div style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100%;
                        background: linear-gradient(45deg, #0077be, #00d4ff);
                        color: white;
                        font-weight: bold;
                        text-align: center;
                        border-radius: 10px;
                    ">
                        <div>
                            <div style="font-size: 20px;">🏖️ DEV MODE</div>
                            <div style="font-size: 14px;">${position.toUpperCase()}</div>
                            <div style="font-size: 12px;">Zone ${zones[index]}</div>
                        </div>
                    </div>
                `;
            });
        }
    };
    
    // Auto-inicializar
    AdVerificationSystem.init();
    
    // Exponer globalmente para debug
    window.AdVerificationSystem = AdVerificationSystem;
    window.testAds = () => AdVerificationSystem.runFinalVerification();
    
    console.log('✅ Ad Verification System v5.1.0 COMPLETAMENTE CORREGIDO');
    
})();
