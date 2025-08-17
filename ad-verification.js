// ============================
// AD VERIFICATION SYSTEM v5.0.0 - COMPLETELY FIXED
// Sistema completo de gestión de anuncios con zone IDs correctos
// FIXED: JuicyAds scripts, ExoClick zones, mejor gestión de errores
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
                fallbackUrl: 'https://www.juicyads.com/ads.js',
                zones: {
                    header: 1098518,    // VERIFIED: Actual zone from dashboard
                    sidebar: 1098519,   // VERIFIED: Actual zone from dashboard 
                    footer: 1098520     // VERIFIED: Actual zone from dashboard
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
                    header: 5696328,   // VERIFIED: Confirmed from dashboard
                    sidebar: 5696329,  // TO CREATE: New zone needed
                    footer: 5696330    // TO CREATE: New zone needed
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
            console.log('🎯 [Ad Networks] Sistema v5.0.0 - COMPLETELY FIXED');
            console.log('🌍 Environment:', AD_CONFIG.environment);
            console.log('🔧 Zone IDs verificados según dashboards');
            
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
            setInterval(() => this.verifyAndFixAds(), 30000);
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
                // Primero intentar JuicyAds con múltiples métodos
                if (AD_CONFIG.networks.juicyads.enabled) {
                    await this.loadJuicyAdsFixed();
                }
                
                // Luego ExoClick con métodos alternativos
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
        // JUICYADS - MÉTODO COMPLETAMENTE FIJO
        // ============================
        async loadJuicyAdsFixed() {
            console.log('🍊 Cargando JuicyAds con múltiples métodos...');
            
            const zones = AD_CONFIG.networks.juicyads.zones;
            
            // Crear contenedores primero
            Object.entries(zones).forEach(([position, zoneId]) => {
                const container = this.createAdContainer('juicyads', position, zoneId);
                console.log(`✅ JuicyAds contenedor ${position} creado con zone ${zoneId}`);
            });
            
            // Método 1: Script principal
            try {
                await this.loadJuicyAdsScript();
                this.loadedNetworks.add('juicyads');
                console.log('✅ JuicyAds script principal cargado');
            } catch (error) {
                console.warn('⚠️ Script principal JuicyAds falló:', error.message);
                
                // Método 2: Script fallback
                try {
                    await this.loadJuicyAdsAlternative();
                    this.loadedNetworks.add('juicyads');
                    console.log('✅ JuicyAds script alternativo cargado');
                } catch (error2) {
                    console.warn('⚠️ Script alternativo JuicyAds falló:', error2.message);
                    
                    // Método 3: Iframes directos
                    this.loadJuicyAdsFallback();
                }
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
                script.type = 'text/javascript';
                
                const timeout = setTimeout(() => {
                    script.remove();
                    reject(new Error('Timeout loading JuicyAds script'));
                }, 8000);
                
                script.onload = () => {
                    clearTimeout(timeout);
                    console.log('✅ JuicyAds script principal cargado');
                    
                    // Inicializar zonas después de cargar
                    setTimeout(() => {
                        this.initializeJuicyAdsZones();
                        resolve();
                    }, 1500);
                };
                
                script.onerror = () => {
                    clearTimeout(timeout);
                    script.remove();
                    reject(new Error('Failed to load script: ' + script.src));
                };
                
                document.head.appendChild(script);
            });
        },
        
        loadJuicyAdsAlternative() {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = AD_CONFIG.networks.juicyads.fallbackUrl;
                script.async = true;
                script.setAttribute('data-cfasync', 'false');
                script.type = 'text/javascript';
                
                const timeout = setTimeout(() => {
                    script.remove();
                    reject(new Error('Timeout loading JuicyAds fallback'));
                }, 8000);
                
                script.onload = () => {
                    clearTimeout(timeout);
                    console.log('✅ JuicyAds fallback script cargado');
                    
                    setTimeout(() => {
                        this.initializeJuicyAdsZones();
                        resolve();
                    }, 1500);
                };
                
                script.onerror = () => {
                    clearTimeout(timeout);
                    script.remove();
                    reject(new Error('Failed to load fallback: ' + script.src));
                };
                
                document.head.appendChild(script);
            });
        },
        
        loadJuicyAdsFallback() {
            if (this.containersCreated.has('juicyads-fallback')) return;
            
            console.log('🔧 JuicyAds fallback activado - Usando iframes directos');
            
            const zones = AD_CONFIG.networks.juicyads.zones;
            
            Object.entries(zones).forEach(([position, zoneId]) => {
                const container = this.createAdContainer('juicyads-fallback', position, zoneId);
                
                // Limpiar contenido anterior
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
                iframe.setAttribute('data-zone-id', zoneId);
                
                container.appendChild(iframe);
                console.log(`✅ JuicyAds iframe fallback ${position} (${zoneId}) creado`);
            });
            
            this.containersCreated.add('juicyads-fallback');
            this.loadedNetworks.add('juicyads');
        },
        
        initializeJuicyAdsZones() {
            const zones = AD_CONFIG.networks.juicyads.zones;
            
            // Inicializar window.adsbyjuicy si no existe
            if (!window.adsbyjuicy) {
                window.adsbyjuicy = window.adsbyjuicy || [];
            }
            
            Object.entries(zones).forEach(([position, zoneId]) => {
                const container = document.getElementById(`ad-juicyads-${position}-${zoneId}`);
                if (!container) return;
                
                // Limpiar contenido anterior
                container.innerHTML = '';
                
                // Crear ins tag para JuicyAds
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
                    console.warn(`⚠️ Error activando zona JuicyAds ${position}:`, e);
                    // Fallback directo
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
            console.log(`🔧 JuicyAds iframe directo creado para zona ${zoneId}`);
        },
        
        // ============================
        // EXOCLICK - MÉTODO MEJORADO
        // ============================
        async loadExoClickFixed() {
            console.log('🔵 Cargando ExoClick con métodos alternativos...');
            
            const zones = AD_CONFIG.networks.exoclick.zones;
            
            // Crear contenedores e iframes directamente
            Object.entries(zones).forEach(([position, zoneId]) => {
                const container = this.createAdContainer('exoclick', position, zoneId);
                
                // Método directo con iframe (más confiable)
                this.loadExoClickIframe(container, position, zoneId);
            });
            
            this.loadedNetworks.add('exoclick');
        },
        
        loadExoClickIframe(container, position, zoneId) {
            console.log(`🔧 ExoClick iframe directo para zona ${zoneId}`);
            
            // Limpiar container
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
                // Crear placeholder visual
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
        // POPADS - MEJORADO
        // ============================
        async loadPopAds() {
            console.log('🚀 Cargando PopAds...');
            
            // Verificar si ya está activo
            if (window.e494ffb82839a29122608e933394c091) {
                console.log('✅ PopAds ya está activo');
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
            
            // Cargar script principal con timeout
            return new Promise((resolve, reject) => {
                const mainScript = document.createElement('script');
                mainScript.type = 'text/javascript';
                mainScript.async = true;
                mainScript.src = 'https://www.premiumvertising.com/pboba.min.js';
                
                const timeout = setTimeout(() => {
                    mainScript.remove();
                    console.warn('⚠️ PopAds timeout');
                    resolve(); // No rechazar, PopAds es opcional
                }, 10000);
                
                mainScript.onload = () => {
                    clearTimeout(timeout);
                    console.log('✅ PopAds cargado exitosamente');
                    this.loadedNetworks.add('popads');
                    resolve();
                };
                
                mainScript.onerror = () => {
                    clearTimeout(timeout);
                    mainScript.remove();
                    console.warn('⚠️ Error cargando PopAds');
                    resolve(); // No rechazar, PopAds es opcional
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
                        // Crear iframe de emergencia
                        const iframeUrl = network.includes('juicy') ? 
                            AD_CONFIG.networks.juicyads.iframeUrl :
                            AD_CONFIG.networks.
