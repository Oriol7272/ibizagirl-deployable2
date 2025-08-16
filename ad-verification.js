// ============================
// AD VERIFICATION SYSTEM v3.0.0 - COMPLETO Y CORREGIDO
// Sistema completo de gestión de anuncios para IbizaGirl.pics
// Incluye: JuicyAds, ExoClick y PopAds
// ============================

(function() {
    'use strict';
    
    const AD_CONFIG = {
        environment: window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' || 
                    window.location.hostname.includes('192.168') ? 'development' : 'production',
        maxRetries: 3,
        retryDelay: 2000,
        networks: {
            juicyads: {
                enabled: true,
                name: 'JuicyAds',
                scriptUrl: 'https://poweredby.jads.co/js/jads.js',
                zones: {
                    header: 903748,
                    sidebar: 903749,
                    footer: 903750
                },
                testMode: false
            },
            exoclick: {
                enabled: true,
                name: 'ExoClick',
                scriptUrls: [
                    'https://a.realsrv.com/ad-provider.js',
                    'https://syndication.exoclick.com/tag.js',
                    'https://main.exoclick.com/tag_gen.js'
                ],
                zones: {
                    header: 5696328,
                    sidebar: 5696329,
                    footer: 5696330
                },
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
        },
        excludedUrls: [
            'chrome-extension://',
            'extension://',
            'paypal.com',
            'paypalobjects.com',
            'googletagmanager.com',
            'google-analytics.com',
            'gtag/js',
            'adsco.re'
        ]
    };
    
    const AdVerificationSystem = {
        loadedNetworks: new Set(),
        retryAttempts: {},
        verificationAttempts: 0,
        popAdsInitialized: false,
        juicyadsInitialized: false,
        exoclickInitialized: false,
        
        init() {
            console.log('🎯 [Ad Networks] Sistema v3.0.0 - Configuración Completa');
            console.log('🌍 Environment:', AD_CONFIG.environment);
            console.log('📊 Configuración:', {
                JuicyAds: AD_CONFIG.networks.juicyads.zones,
                ExoClick: AD_CONFIG.networks.exoclick.zones,
                PopAds: { siteId: AD_CONFIG.networks.popads.config.siteId }
            });
            
            if (AD_CONFIG.environment === 'development') {
                console.log('🔧 Development mode - Usando placeholders');
                this.showDevelopmentPlaceholders();
                return;
            }
            
            // Inicializar redes con delay progresivo
            setTimeout(() => {
                this.loadAdNetworks();
            }, 1000);
            
            // Verificar después de cargar
            setTimeout(() => {
                this.verifyAdNetworks();
            }, 8000);
            
            // Segunda verificación
            setTimeout(() => {
                this.finalVerification();
            }, 15000);
        },
        
        loadAdNetworks() {
            console.log('📢 Iniciando carga de redes de anuncios...');
            
            // Cargar JuicyAds primero
            if (AD_CONFIG.networks.juicyads.enabled && !AD_CONFIG.networks.juicyads.testMode) {
                setTimeout(() => {
                    this.loadJuicyAds();
                }, 100);
            }
            
            // Cargar ExoClick después de 2 segundos
            if (AD_CONFIG.networks.exoclick.enabled && !AD_CONFIG.networks.exoclick.testMode) {
                setTimeout(() => {
                    this.loadExoClick();
                }, 2000);
            }
            
            // Cargar PopAds después de 4 segundos
            if (AD_CONFIG.networks.popads.enabled && !AD_CONFIG.networks.popads.testMode) {
                setTimeout(() => {
                    this.loadPopAds();
                }, 4000);
            }
        },
        
        // ============================
        // JUICYADS IMPLEMENTATION
        // ============================
        loadJuicyAds() {
            console.log('🍊 Cargando JuicyAds...');
            
            // Preparar el objeto global
            if (typeof window.adsbyjuicy === 'undefined') {
                window.adsbyjuicy = {
                    cmd: [],
                    push: function(data) {
                        this.cmd = this.cmd || [];
                        this.cmd.push(data);
                        console.log('🍊 JuicyAds comando añadido:', data);
                    }
                };
                console.log('🍊 JuicyAds objeto global creado');
            }
            
            // Verificar si el script ya existe
            if (document.querySelector('script[src*="jads.co"]')) {
                console.log('🍊 JuicyAds script ya existe, inicializando zonas...');
                this.initializeJuicyAds();
                return;
            }
            
            // Cargar el script
            const script = document.createElement('script');
            script.src = AD_CONFIG.networks.juicyads.scriptUrl;
            script.async = true;
            script.setAttribute('data-network', 'juicyads');
            script.setAttribute('data-cfasync', 'false');
            
            script.onload = () => {
                console.log('✅ JuicyAds script cargado exitosamente');
                this.loadedNetworks.add('juicyads');
                setTimeout(() => {
                    this.initializeJuicyAds();
                }, 1500);
            };
            
            script.onerror = (error) => {
                console.error('❌ Error cargando JuicyAds:', error);
                this.handleLoadError('juicyads', AD_CONFIG.networks.juicyads);
            };
            
            document.head.appendChild(script);
        },
        
        initializeJuicyAds() {
            if (this.juicyadsInitialized) {
                console.log('🍊 JuicyAds ya inicializado');
                return;
            }
            
            console.log('🍊 Inicializando zonas JuicyAds...');
            
            let checkAttempts = 0;
            const maxAttempts = 10;
            
            const checkJuicyAds = () => {
                checkAttempts++;
                
                const isReady = window.adsbyjuicy && 
                               (typeof window.adsbyjuicy === 'object') &&
                               (typeof window.adsbyjuicy.push === 'function');
                
                if (isReady) {
                    console.log('✅ JuicyAds API lista, creando zonas...');
                    
                    const zones = AD_CONFIG.networks.juicyads.zones;
                    Object.entries(zones).forEach(([position, zoneId]) => {
                        this.createJuicyAdsZone(position, zoneId);
                    });
                    
                    this.juicyadsInitialized = true;
                    return;
                }
                
                if (checkAttempts < maxAttempts) {
                    console.log(`🍊 Esperando JuicyAds API... (intento ${checkAttempts}/${maxAttempts})`);
                    setTimeout(checkJuicyAds, 1000);
                } else {
                    console.warn('⚠️ JuicyAds API timeout, creando zonas de todas formas...');
                    const zones = AD_CONFIG.networks.juicyads.zones;
                    Object.entries(zones).forEach(([position, zoneId]) => {
                        this.createJuicyAdsZone(position, zoneId);
                    });
                    this.juicyadsInitialized = true;
                }
            };
            
            checkJuicyAds();
        },
        
        createJuicyAdsZone(position, zoneId) {
            try {
                console.log(`🍊 Creando zona JuicyAds: ${position} (${zoneId})`);
                
                // Crear contenedor principal
                const containerId = `ad-juicyads-${position}`;
                let container = document.getElementById(containerId);
                
                if (!container) {
                    container = document.createElement('div');
                    container.id = containerId;
                    container.className = `ad-container ad-juicyads ad-${position}`;
                    container.style.cssText = this.getContainerStyles(position);
                    this.appendAdContainer(container, position);
                }
                
                // Limpiar contenedor
                container.innerHTML = '';
                
                // Crear zona de anuncio
                const adDiv = document.createElement('div');
                adDiv.id = `juicyads-${position}-${zoneId}`;
                adDiv.className = 'juicyads-zone';
                adDiv.style.cssText = `
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    width: 100% !important;
                    min-height: 50px !important;
                `;
                container.appendChild(adDiv);
                
                // Activar zona
                const pushCommand = () => {
                    if (window.adsbyjuicy && typeof window.adsbyjuicy.push === 'function') {
                        window.adsbyjuicy.push({'adzone': zoneId});
                        console.log(`✅ JuicyAds zona ${position} (${zoneId}) activada`);
                        return true;
                    }
                    return false;
                };
                
                // Intentar activar inmediatamente
                if (!pushCommand()) {
                    // Reintentar después de un delay
                    setTimeout(() => {
                        if (!pushCommand()) {
                            // Último intento
                            setTimeout(pushCommand, 3000);
                        }
                    }, 1500);
                }
                
            } catch (error) {
                console.error(`❌ Error creando zona JuicyAds ${position}:`, error);
            }
        },
        
        // ============================
        // EXOCLICK IMPLEMENTATION
        // ============================
        loadExoClick() {
            console.log('🔵 Cargando ExoClick...');
            
            let urlIndex = 0;
            const tryLoadExoClick = () => {
                if (urlIndex >= AD_CONFIG.networks.exoclick.scriptUrls.length) {
                    console.warn('⚠️ No se pudo cargar ExoClick desde ninguna URL, usando método directo');
                    this.initExoClickDirect();
                    return;
                }
                
                const url = AD_CONFIG.networks.exoclick.scriptUrls[urlIndex];
                console.log(`🔵 Intentando ExoClick URL ${urlIndex + 1}/${AD_CONFIG.networks.exoclick.scriptUrls.length}: ${url}`);
                
                // Verificar si ya existe
                if (document.querySelector(`script[src*="${url.split('/')[2]}"]`)) {
                    console.log('🔵 ExoClick script ya existe, inicializando...');
                    this.initializeExoClick();
                    return;
                }
                
                const script = document.createElement('script');
                script.src = url;
                script.async = true;
                script.setAttribute('data-network', 'exoclick');
                script.setAttribute('data-url-attempt', urlIndex + 1);
                
                script.onload = () => {
                    console.log(`✅ ExoClick cargado desde URL ${urlIndex + 1}`);
                    this.loadedNetworks.add('exoclick');
                    setTimeout(() => {
                        this.initializeExoClick();
                    }, 1500);
                };
                
                script.onerror = () => {
                    console.warn(`⚠️ ExoClick URL ${urlIndex + 1} falló`);
                    urlIndex++;
                    setTimeout(tryLoadExoClick, 1000);
                };
                
                document.head.appendChild(script);
            };
            
            tryLoadExoClick();
        },
        
        initializeExoClick() {
            if (this.exoclickInitialized) {
                console.log('🔵 ExoClick ya inicializado');
                return;
            }
            
            console.log('🔵 Inicializando zonas ExoClick...');
            
            let checkAttempts = 0;
            const maxAttempts = 10;
            
            const checkExoClick = () => {
                checkAttempts++;
                
                const exoAvailable = window.ExoLoader || 
                                   window.exoclick || 
                                   window.adProvider ||
                                   window.ExoClicks ||
                                   window.ExoClickLoader ||
                                   (window.exo && window.exo.load);
                
                if (exoAvailable) {
                    console.log('✅ ExoClick API detectada:', Object.keys(window).filter(k => k.toLowerCase().includes('exo')));
                    
                    const zones = AD_CONFIG.networks.exoclick.zones;
                    Object.entries(zones).forEach(([position, zoneId]) => {
                        this.createExoClickZone(position, zoneId);
                    });
                    
                    this.exoclickInitialized = true;
                    return;
                }
                
                if (checkAttempts < maxAttempts) {
                    console.log(`🔵 Esperando ExoClick API... (intento ${checkAttempts}/${maxAttempts})`);
                    setTimeout(checkExoClick, 1000);
                } else {
                    console.warn('⚠️ ExoClick API timeout, usando implementación directa');
                    this.initExoClickDirect();
                }
            };
            
            checkExoClick();
        },
        
        createExoClickZone(position, zoneId) {
            try {
                console.log(`🔵 Creando zona ExoClick: ${position} (${zoneId})`);
                
                // Crear contenedor principal
                const containerId = `ad-exoclick-${position}`;
                let container = document.getElementById(containerId);
                
                if (!container) {
                    container = document.createElement('div');
                    container.id = containerId;
                    container.className = `ad-container ad-exoclick ad-${position}`;
                    container.style.cssText = this.getContainerStyles(position);
                    this.appendAdContainer(container, position);
                }
                
                // Limpiar contenedor
                container.innerHTML = '';
                
                // Método 1: ExoLoader
                if (window.ExoLoader && window.ExoLoader.addZone) {
                    const adElement = document.createElement('ins');
                    adElement.className = 'adsbyexoclick';
                    adElement.setAttribute('data-zoneid', zoneId);
                    adElement.style.cssText = `
                        display: block !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                        width: 100% !important;
                        min-height: 50px !important;
                    `;
                    container.appendChild(adElement);
                    
                    window.ExoLoader.addZone({"zone_id": zoneId});
                    console.log(`✅ ExoClick zona ${position} (${zoneId}) activada con ExoLoader`);
                }
                // Método 2: Atributo data
                else if (window.exoclick) {
                    container.innerHTML = `<div data-exoclick-zoneid="${zoneId}" style="display:block!important;min-height:50px!important;"></div>`;
                    console.log(`✅ ExoClick zona ${position} (${zoneId}) activada con data attribute`);
                }
                // Método 3: Script directo
                else {
                    this.createExoClickDirectZone(container, position, zoneId);
                }
                
            } catch (error) {
                console.error(`❌ Error creando zona ExoClick ${position}:`, error);
            }
        },
        
        createExoClickDirectZone(container, position, zoneId) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.innerHTML = `
                (function() {
                    try {
                        var exoScript = document.createElement('script');
                        exoScript.type = 'text/javascript';
                        exoScript.src = 'https://syndication.exoclick.com/ads.js?t=1&zoneid=${zoneId}';
                        exoScript.async = true;
                        document.head.appendChild(exoScript);
                        console.log('🔵 ExoClick script directo cargado para zona ${zoneId}');
                    } catch(e) {
                        console.warn('ExoClick direct load error:', e.message);
                    }
                })();
            `;
            container.appendChild(script);
            console.log(`✅ ExoClick zona ${position} (${zoneId}) activada con método directo`);
        },
        
        initExoClickDirect() {
            console.log('🔵 Usando implementación directa de ExoClick...');
            this.exoclickInitialized = true;
            
            const zones = AD_CONFIG.networks.exoclick.zones;
            Object.entries(zones).forEach(([position, zoneId]) => {
                const containerId = `ad-exoclick-${position}`;
                let container = document.getElementById(containerId);
                
                if (!container) {
                    container = document.createElement('div');
                    container.id = containerId;
                    container.className = `ad-container ad-exoclick ad-${position}`;
                    container.style.cssText = this.getContainerStyles(position);
                    this.appendAdContainer(container, position);
                }
                
                this.createExoClickDirectZone(container, position, zoneId);
            });
        },
        
        // ============================
        // POPADS IMPLEMENTATION
        // ============================
        loadPopAds() {
            if (this.popAdsInitialized) {
                console.log('🚀 PopAds ya inicializado');
                return;
            }
            
            console.log('🚀 Cargando PopAds...');
            console.log('🚀 Configuración:', AD_CONFIG.networks.popads.config);
            
            const config = AD_CONFIG.networks.popads.config;
            
            // Verificar si ya existe
            if (window.e494ffb82839a29122608e933394c091) {
                console.log('🚀 PopAds ya existe');
                this.popAdsInitialized = true;
                return;
            }
            
            const popAdsScript = document.createElement('script');
            popAdsScript.type = 'text/javascript';
            popAdsScript.setAttribute('data-cfasync', 'false');
            popAdsScript.innerHTML = `
                /*<![CDATA[/* */
                (function(){
                    var x=window,
                        r="e494ffb82839a29122608e933394c091",
                        l=[
                            ["siteId", ${config.siteId}],
                            ["minBid", ${config.minBid}],
                            ["popundersPerIP", "${config.popundersPerIP}"],
                            ["delayBetween", ${config.delayBetween}],
                            ["default", ${config.default}],
                            ["defaultPerDay", ${config.defaultPerDay}],
                            ["topmostLayer", "${config.topmostLayer}"]
                        ],
                        t=["d3d3LnByZW1pdW12ZXJ0aXNpbmcuY29tL3Bib2JhLm1pbi5jc3M=","ZDJqMDQyY2oxNDIxd2kuY2xvdWRmcm9udC5uZXQvRHEvaGJvb3RzdHJhcC1lZGl0YWJsZS5taW4uanM="],
                        a=-1,o,m,
                        w=function(){
                            clearTimeout(m);
                            a++;
                            if(t[a]&&!(1781262446000<(new Date).getTime()&&1<a)){
                                o=x.document.createElement("script");
                                o.type="text/javascript";
                                o.async=!0;
                                var z=x.document.getElementsByTagName("script")[0];
                                o.src="https://"+atob(t[a]);
                                o.crossOrigin="anonymous";
                                o.onerror=w;
                                o.onload=function(){
                                    clearTimeout(m);
                                    x[r.slice(0,16)+r.slice(0,16)]||w()
                                };
                                m=setTimeout(w,5E3);
                                z.parentNode.insertBefore(o,z)
                            }
                        };
                    if(!x[r]){
                        try{
                            Object.freeze(x[r]=l)
                        }catch(e){}
                        w()
                    }
                })();
                /*]]>/* */
            `;
            
            document.head.appendChild(popAdsScript);
            this.createPopAdsIndicator();
            this.loadedNetworks.add('popads');
            this.popAdsInitialized = true;
            
            console.log('✅ PopAds script inyectado exitosamente');
            this.monitorPopAdsLoading();
        },
        
        createPopAdsIndicator() {
            const indicator = document.createElement('div');
            indicator.id = 'popads-indicator';
            indicator.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: rgba(0, 51, 102, 0.95);
                color: white;
                padding: 10px 15px;
                border-radius: 10px;
                font-size: 12px;
                z-index: 9999;
                border: 1px solid rgba(127, 219, 255, 0.3);
                max-width: 220px;
                font-family: system-ui, -apple-system, sans-serif;
                transition: all 0.3s ease;
            `;
            indicator.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div id="popads-status">🔄</div>
                    <div>
                        <div style="font-weight: bold;">PopAds Active</div>
                        <div style="font-size: 10px; opacity: 0.8;">SiteID: ${AD_CONFIG.networks.popads.config.siteId}</div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(indicator);
            
            // Auto-ocultar después de 10 segundos
            setTimeout(() => {
                if (indicator && indicator.parentNode) {
                    indicator.style.transition = 'opacity 1s ease';
                    indicator.style.opacity = '0';
                    setTimeout(() => {
                        if (indicator.parentNode) {
                            indicator.remove();
                        }
                    }, 1000);
                }
            }, 10000);
        },
        
        monitorPopAdsLoading() {
            let checkCount = 0;
            const checkInterval = setInterval(() => {
                checkCount++;
                
                const popAdsActive = window.e494ffb82839a291 || 
                                   window.e494ffb82839a29122608e933394c091 ||
                                   document.querySelector('[data-cfasync="false"]') ||
                                   document.querySelector('script[src*="premiumvertising"]') ||
                                   document.querySelector('script[src*="popads"]');
                
                if (popAdsActive || checkCount > 20) {
                    clearInterval(checkInterval);
                    
                    if (popAdsActive) {
                        console.log('✅ PopAds confirmado activo');
                        this.updatePopAdsIndicator(true);
                    } else {
                        console.warn('⚠️ PopAds timeout, pero el script fue inyectado');
                        this.updatePopAdsIndicator(false);
                    }
                }
            }, 1000);
        },
        
        updatePopAdsIndicator(success) {
            const indicator = document.getElementById('popads-indicator');
            if (!indicator) return;
            
            const status = indicator.querySelector('#popads-status');
            if (status) {
                status.textContent = success ? '✅' : '⚠️';
            }
            
            indicator.style.borderColor = success ? 
                'rgba(0, 255, 136, 0.5)' : 
                'rgba(255, 107, 53, 0.5)';
        },
        
        // ============================
        // UTILITY FUNCTIONS
        // ============================
        getContainerStyles(position) {
            const styles = {
                header: `
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    width: 100% !important;
                    max-width: 728px !important;
                    min-height: 90px !important;
                    margin: 20px auto !important;
                    background: rgba(0, 119, 190, 0.1) !important;
                    border: 2px solid rgba(0, 255, 136, 0.3) !important;
                    border-radius: 10px !important;
                    padding: 10px !important;
                    text-align: center !important;
                    position: relative !important;
                    z-index: 100 !important;
                `,
                sidebar: `
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    position: fixed !important;
                    right: 10px !important;
                    top: 50% !important;
                    transform: translateY(-50%) !important;
                    width: 300px !important;
                    min-height: 250px !important;
                    background: rgba(0, 119, 190, 0.1) !important;
                    border: 2px solid rgba(0, 255, 136, 0.3) !important;
                    border-radius: 10px !important;
                    padding: 10px !important;
                    text-align: center !important;
                    z-index: 1000 !important;
                `,
                footer: `
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    width: 100% !important;
                    max-width: 728px !important;
                    min-height: 90px !important;
                    margin: 20px auto !important;
                    background: rgba(0, 119, 190, 0.1) !important;
                    border: 2px solid rgba(0, 255, 136, 0.3) !important;
                    border-radius: 10px !important;
                    padding: 10px !important;
                    text-align: center !important;
                    position: relative !important;
                    z-index: 100 !important;
                `
            };
            
            return styles[position] || styles.header;
        },
        
        appendAdContainer(container, position) {
            try {
                let targetElement;
                let inserted = false;
                
                switch(position) {
                    case 'header':
                        targetElement = document.querySelector('.main-header');
                        if (targetElement && targetElement.parentNode) {
                            targetElement.parentNode.insertBefore(container, targetElement.nextSibling);
                            inserted = true;
                        } else {
                            document.body.insertBefore(container, document.body.firstChild);
                            inserted = true;
                        }
                        break;
                        
                    case 'sidebar':
                        document.body.appendChild(container);
                        inserted = true;
                        break;
                        
                    case 'footer':
                        targetElement = document.querySelector('.main-footer');
                        if (targetElement && targetElement.parentNode) {
                            targetElement.parentNode.insertBefore(container, targetElement);
                            inserted = true;
                        } else {
                            document.body.appendChild(container);
                            inserted = true;
                        }
                        break;
                        
                    default:
                        document.body.appendChild(container);
                        inserted = true;
                }
                
                if (inserted) {
                    console.log(`📍 Contenedor ${position} añadido al DOM`);
                }
                
            } catch (error) {
                console.error(`Error añadiendo contenedor ${position}:`, error);
            }
        },
        
        handleLoadError(networkKey, network) {
            if (!this.retryAttempts[networkKey]) {
                this.retryAttempts[networkKey] = 0;
            }
            
            this.retryAttempts[networkKey]++;
            
            if (this.retryAttempts[networkKey] <= AD_CONFIG.maxRetries) {
                console.log(`🔄 Reintentando ${network.name} (intento ${this.retryAttempts[networkKey]}/${AD_CONFIG.maxRetries})`);
                
                setTimeout(() => {
                    switch(networkKey) {
                        case 'juicyads':
                            this.loadJuicyAds();
                            break;
                        case 'exoclick':
                            this.loadExoClick();
                            break;
                        case 'popads':
                            this.loadPopAds();
                            break;
                    }
                }, AD_CONFIG.retryDelay * this.retryAttempts[networkKey]);
            } else {
                console.warn(`⚠️ ${network.name} falló después de ${AD_CONFIG.maxRetries} intentos`);
                this.showPlaceholder(networkKey);
            }
        },
        
        showPlaceholder(networkKey) {
            if (networkKey === 'popads') return;
            
            const network = AD_CONFIG.networks[networkKey];
            if (!network || !network.zones) return;
            
            Object.keys(network.zones).forEach(position => {
                const containerId = `ad-${networkKey}-${position}`;
                let container = document.getElementById(containerId);
                
                if (!container) {
                    container = document.createElement('div');
                    container.id = containerId;
                    container.className = `ad-container ad-placeholder ad-${position}`;
                    container.style.cssText = this.getContainerStyles(position);
                    this.appendAdContainer(container, position);
                }
                
                this.showPlaceholderInContainer(container, network.name, position);
            });
        },
        
        showPlaceholderInContainer(container, networkName, position) {
            const sizes = {
                header: '728x90',
                sidebar: '300x250',
                footer: '728x90'
            };
            
            const size = sizes[position] || '300x250';
            const [width, height] = size.split('x');
            
            container.innerHTML = `
                <div style="
                    width: ${width}px;
                    max-width: 100%;
                    height: ${height}px;
                    background: linear-gradient(135deg, rgba(0,119,190,0.15), rgba(0,212,255,0.15));
                    border: 2px dashed rgba(127,219,255,0.4);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: rgba(255,255,255,0.7);
                    font-size: 14px;
                    border-radius: 10px;
                    font-family: system-ui, -apple-system, sans-serif;
                    text-align: center;
                    padding: 20px;
                    box-sizing: border-box;
                ">
                    <div style="font-size: 16px; margin-bottom: 8px;">📢</div>
                    <div>${networkName}</div>
                    <div style="font-size: 12px; margin-top: 4px; opacity: 0.6;">${position} ad space</div>
                    <div style="font-size: 10px; margin-top: 8px; opacity: 0.5;">Loading...</div>
                </div>
            `;
        },
        
        showDevelopmentPlaceholders() {
            console.log('🔧 Mostrando placeholders de desarrollo...');
            
            Object.entries(AD_CONFIG.networks).forEach(([key, network]) => {
                if (network.enabled && key !== 'popads') {
                    this.showPlaceholder(key);
                }
            });
        },
        
        verifyAdNetworks() {
            console.log('🎯 ===== VERIFICACIÓN DE REDES DE ANUNCIOS =====');
            
            let activeNetworks = 0;
            const report = {};
            
            // Verificar JuicyAds
            const juicyAdsActive = window.adsbyjuicy || 
                                  document.querySelector('[data-network="juicyads"]') || 
                                  document.querySelector('.ad-juicyads') ||
                                  document.querySelector('.juicyads-zone');
            
            if (juicyAdsActive) {
                console.log('✅ JuicyAds: Detectado');
                report.juicyads = 'Active';
                activeNetworks++;
            } else {
                console.log('❌ JuicyAds: No detectado');
                report.juicyads = 'Not Found';
            }
            
            // Verificar ExoClick
            const exoClickActive = window.ExoLoader || 
                                  window.exoclick || 
                                  window.adProvider ||
                                  document.querySelector('[data-network="exoclick"]') ||
                                  document.querySelector('.ad-exoclick') ||
                                  document.querySelector('.adsbyexoclick') ||
                                  document.querySelector('[data-exoclick-zoneid]');
            
            if (exoClickActive) {
                console.log('✅ ExoClick: Detectado');
                report.exoclick = 'Active';
                activeNetworks++;
            } else {
                console.log('❌ ExoClick: No detectado');
                report.exoclick = 'Not Found';
            }
            
            // Verificar PopAds
            const popAdsActive = this.popAdsInitialized || 
                                window.e494ffb82839a291 || 
                                window.e494ffb82839a29122608e933394c091 ||
                                document.querySelector('[data-cfasync="false"]');
            
            if (popAdsActive) {
                console.log('✅ PopAds: Detectado');
                console.log(`   SiteID: ${AD_CONFIG.networks.popads.config.siteId}`);
                report.popads = 'Active';
                activeNetworks++;
            } else {
                console.log('❌ PopAds: No detectado');
                report.popads = 'Not Found';
            }
            
            console.log('📊 ===== RESUMEN =====');
            console.log(`📊 Redes activas: ${activeNetworks}/3`);
            console.log('📊 Reporte:', report);
            console.log(`📊 Estado: ${activeNetworks === 3 ? '✅ Todas las redes funcionando' : '⚠️ Algunas redes no están activas'}`);
            
            return { activeNetworks, report };
        },
        
        finalVerification() {
            console.log('🔍 ===== VERIFICACIÓN FINAL =====');
            
            const result = this.verifyAdNetworks();
            
            // Contar contenedores
            const containers = document.querySelectorAll('.ad-container');
            console.log(`📦 Total de contenedores: ${containers.length}`);
            
            // Verificar contenido de contenedores
            let emptyContainers = 0;
            containers.forEach((container, index) => {
                const hasContent = container.querySelector('.juicyads-zone, .adsbyexoclick, [data-exoclick-zoneid]');
                if (!hasContent && !container.classList.contains('ad-placeholder')) {
                    emptyContainers++;
                    console.warn(`⚠️ Contenedor vacío: ${container.id}`);
                }
            });
            
            if (emptyContainers > 0) {
                console.warn(`⚠️ ${emptyContainers} contenedores vacíos detectados`);
            }
            
            // Resumen final
            console.log('📊 ===== RESUMEN FINAL =====');
            console.log(`✅ Redes activas: ${result.activeNetworks}/3`);
            console.log(`📦 Contenedores: ${containers.length} (${emptyContainers} vacíos)`);
            console.log('🔗 URLs de configuración:');
            console.log('   JuicyAds:', AD_CONFIG.networks.juicyads.zones);
            console.log('   ExoClick:', AD_CONFIG.networks.exoclick.zones);
            console.log('   PopAds SiteID:', AD_CONFIG.networks.popads.config.siteId);
            
            return result;
        },
        
        // Funciones públicas para testing
        testAds() {
            console.log('🔍 Ejecutando prueba completa del sistema de anuncios...');
            console.log('Environment:', AD_CONFIG.environment);
            console.log('Redes cargadas:', Array.from(this.loadedNetworks));
            
            const verification = this.verifyAdNetworks();
            const containers = document.querySelectorAll('.ad-container');
            
            const detailedReport = {
                environment: AD_CONFIG.environment,
                loadedNetworks: Array.from(this.loadedNetworks),
                activeNetworks: verification.activeNetworks,
                networkStatus: verification.report,
                totalContainers: containers.length,
                containerDetails: []
            };
            
            containers.forEach((container, index) => {
                detailedReport.containerDetails.push({
                    index: index + 1,
                    id: container.id,
                    classes: container.className,
                    visible: container.offsetWidth > 0 && container.offsetHeight > 0,
                    dimensions: `${container.offsetWidth}x${container.offsetHeight}`,
                    hasAdContent: !!container.querySelector('.juicyads-zone, .adsbyexoclick, [data-exoclick-zoneid]'),
                    children: container.children.length
                });
            });
            
            console.table(detailedReport.containerDetails);
            
            return detailedReport;
        },
        
        reloadAds() {
            console.log('🔄 Recargando sistema completo de anuncios...');
            
            // Limpiar contenedores existentes
            document.querySelectorAll('.ad-container').forEach(container => {
                container.remove();
            });
            
            // Limpiar indicadores
            const indicator = document.getElementById('popads-indicator');
            if (indicator) indicator.remove();
            
            // Resetear estado
            this.loadedNetworks.clear();
            this.retryAttempts = {};
            this.verificationAttempts = 0;
            this.popAdsInitialized = false;
            this.juicyadsInitialized = false;
            this.exoclickInitialized = false;
            
            // Reiniciar
            this.init();
        }
    };
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            AdVerificationSystem.init();
        });
    } else {
        setTimeout(() => {
            AdVerificationSystem.init();
        }, 100);
    }
    
    // Exponer funciones globales para pruebas
    window.AdVerificationSystem = AdVerificationSystem;
    window.testAds = () => AdVerificationSystem.testAds();
    window.reloadAds = () => AdVerificationSystem.reloadAds();
    
    console.log('✅ Sistema de Anuncios v3.0.0 cargado completamente');
    console.log('💡 Comandos disponibles:');
    console.log('   window.testAds() - Análisis completo del sistema');
    console.log('   window.reloadAds() - Recargar todos los anuncios');
    
})();
