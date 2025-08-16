// ============================
// AD VERIFICATION SYSTEM v3.0.0 - CONFIGURACIÓN CORREGIDA
// Sistema completo de gestión de anuncios con JuicyAds, ExoClick y PopAds
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
        }
    };
    
    const AdVerificationSystem = {
        loadedNetworks: new Set(),
        retryAttempts: {},
        verificationAttempts: 0,
        popAdsInitialized: false,
        juicyadsInitialized: false,
        exoclickInitialized: false,
        
        init() {
            console.log('🎯 [Ad Networks] Sistema v3.0.0 - Configuración Corregida');
            console.log('🌍 Environment:', AD_CONFIG.environment);
            
            if (AD_CONFIG.environment === 'development') {
                console.log('🔧 Development mode - Using test configuration');
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
        },
        
        loadAdNetworks() {
            console.log('📢 Cargando redes de anuncios...');
            
            // Cargar JuicyAds primero
            if (AD_CONFIG.networks.juicyads.enabled) {
                this.loadJuicyAds();
            }
            
            // Cargar ExoClick después de 2 segundos
            if (AD_CONFIG.networks.exoclick.enabled) {
                setTimeout(() => {
                    this.loadExoClick();
                }, 2000);
            }
            
            // Cargar PopAds después de 4 segundos
            if (AD_CONFIG.networks.popads.enabled) {
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
                    }
                };
            }
            
            // Cargar el script
            const script = document.createElement('script');
            script.src = AD_CONFIG.networks.juicyads.scriptUrl;
            script.async = true;
            script.setAttribute('data-network', 'juicyads');
            
            script.onload = () => {
                console.log('✅ JuicyAds script cargado');
                this.loadedNetworks.add('juicyads');
                setTimeout(() => {
                    this.initializeJuicyAds();
                }, 1500);
            };
            
            script.onerror = () => {
                console.error('❌ Error cargando JuicyAds');
                this.handleLoadError('juicyads');
            };
            
            document.head.appendChild(script);
        },
        
        initializeJuicyAds() {
            if (this.juicyadsInitialized) return;
            
            console.log('🍊 Inicializando zonas JuicyAds...');
            
            const zones = AD_CONFIG.networks.juicyads.zones;
            
            Object.entries(zones).forEach(([position, zoneId]) => {
                this.createJuicyAdsZone(position, zoneId);
            });
            
            this.juicyadsInitialized = true;
        },
        
        createJuicyAdsZone(position, zoneId) {
            try {
                // Crear contenedor principal
                const containerId = `ad-juicyads-${position}`;
                let container = document.getElementById(containerId);
                
                if (!container) {
                    container = document.createElement('div');
                    container.id = containerId;
                    container.className = `ad-container ad-juicyads ad-${position}`;
                    this.appendAdContainer(container, position);
                }
                
                // Crear zona de anuncio
                const adDiv = document.createElement('div');
                adDiv.id = `juicyads-${position}-${zoneId}`;
                adDiv.className = 'juicyads-zone';
                container.appendChild(adDiv);
                
                // Activar zona
                if (window.adsbyjuicy && typeof window.adsbyjuicy.push === 'function') {
                    window.adsbyjuicy.push({'adzone': zoneId});
                    console.log(`✅ JuicyAds zona ${position} (${zoneId}) activada`);
                }
            } catch (error) {
                console.error(`Error creando zona JuicyAds ${position}:`, error);
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
                    console.warn('⚠️ No se pudo cargar ExoClick desde ninguna URL');
                    this.initExoClickDirect();
                    return;
                }
                
                const url = AD_CONFIG.networks.exoclick.scriptUrls[urlIndex];
                console.log(`🔵 Intentando URL ${urlIndex + 1}: ${url}`);
                
                const script = document.createElement('script');
                script.src = url;
                script.async = true;
                script.setAttribute('data-network', 'exoclick');
                
                script.onload = () => {
                    console.log(`✅ ExoClick cargado desde URL ${urlIndex + 1}`);
                    this.loadedNetworks.add('exoclick');
                    setTimeout(() => {
                        this.initializeExoClick();
                    }, 1500);
                };
                
                script.onerror = () => {
                    console.warn(`⚠️ Fallo URL ${urlIndex + 1}`);
                    urlIndex++;
                    setTimeout(tryLoadExoClick, 1000);
                };
                
                document.head.appendChild(script);
            };
            
            tryLoadExoClick();
        },
        
        initializeExoClick() {
            if (this.exoclickInitialized) return;
            
            console.log('🔵 Inicializando zonas ExoClick...');
            
            const zones = AD_CONFIG.networks.exoclick.zones;
            
            Object.entries(zones).forEach(([position, zoneId]) => {
                this.createExoClickZone(position, zoneId);
            });
            
            this.exoclickInitialized = true;
        },
        
        createExoClickZone(position, zoneId) {
            try {
                // Crear contenedor principal
                const containerId = `ad-exoclick-${position}`;
                let container = document.getElementById(containerId);
                
                if (!container) {
                    container = document.createElement('div');
                    container.id = containerId;
                    container.className = `ad-container ad-exoclick ad-${position}`;
                    this.appendAdContainer(container, position);
                }
                
                // Método 1: ExoLoader
                if (window.ExoLoader && window.ExoLoader.addZone) {
                    const adElement = document.createElement('ins');
                    adElement.className = 'adsbyexoclick';
                    adElement.setAttribute('data-zoneid', zoneId);
                    container.appendChild(adElement);
                    
                    window.ExoLoader.addZone({"zone_id": zoneId});
                    console.log(`✅ ExoClick zona ${position} (${zoneId}) activada con ExoLoader`);
                }
                // Método 2: Script directo
                else {
                    this.createExoClickDirectZone(container, position, zoneId);
                }
            } catch (error) {
                console.error(`Error creando zona ExoClick ${position}:`, error);
            }
        },
        
        createExoClickDirectZone(container, position, zoneId) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.innerHTML = `
                (function() {
                    var exoScript = document.createElement('script');
                    exoScript.type = 'text/javascript';
                    exoScript.src = 'https://syndication.exoclick.com/ads.js?t=1&zoneid=${zoneId}';
                    exoScript.async = true;
                    document.head.appendChild(exoScript);
                })();
            `;
            container.appendChild(script);
            console.log(`✅ ExoClick zona ${position} (${zoneId}) activada con método directo`);
        },
        
        initExoClickDirect() {
            console.log('🔵 Usando implementación directa de ExoClick...');
            const zones = AD_CONFIG.networks.exoclick.zones;
            
            Object.entries(zones).forEach(([position, zoneId]) => {
                const containerId = `ad-exoclick-${position}`;
                let container = document.getElementById(containerId);
                
                if (!container) {
                    container = document.createElement('div');
                    container.id = containerId;
                    container.className = `ad-container ad-exoclick ad-${position}`;
                    this.appendAdContainer(container, position);
                }
                
                this.createExoClickDirectZone(container, position, zoneId);
            });
        },
        
        // ============================
        // POPADS IMPLEMENTATION
        // ============================
        loadPopAds() {
            if (this.popAdsInitialized) return;
            
            console.log('🚀 Cargando PopAds...');
            console.log('🚀 SiteID:', AD_CONFIG.networks.popads.config.siteId);
            
            const config = AD_CONFIG.networks.popads.config;
            
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
            
            console.log('✅ PopAds script inyectado');
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
        
        // ============================
        // UTILITY FUNCTIONS
        // ============================
        appendAdContainer(container, position) {
            try {
                let targetElement;
                
                switch(position) {
                    case 'header':
                        targetElement = document.querySelector('.main-header');
                        if (targetElement) {
                            targetElement.parentNode.insertBefore(container, targetElement.nextSibling);
                        } else {
                            document.body.insertBefore(container, document.body.firstChild);
                        }
                        break;
                        
                    case 'sidebar':
                        container.style.cssText = `
                            position: fixed;
                            right: 10px;
                            top: 50%;
                            transform: translateY(-50%);
                            z-index: 100;
                            max-width: 300px;
                            min-height: 250px;
                        `;
                        document.body.appendChild(container);
                        break;
                        
                    case 'footer':
                        targetElement = document.querySelector('.main-footer');
                        if (targetElement) {
                            targetElement.parentNode.insertBefore(container, targetElement);
                        } else {
                            document.body.appendChild(container);
                        }
                        break;
                        
                    default:
                        document.body.appendChild(container);
                }
                
                console.log(`📍 Contenedor ${position} añadido al DOM`);
            } catch (error) {
                console.error(`Error añadiendo contenedor ${position}:`, error);
            }
        },
        
        handleLoadError(networkKey) {
            if (!this.retryAttempts[networkKey]) {
                this.retryAttempts[networkKey] = 0;
            }
            
            this.retryAttempts[networkKey]++;
            
            if (this.retryAttempts[networkKey] <= AD_CONFIG.maxRetries) {
                console.log(`🔄 Reintentando ${networkKey} (intento ${this.retryAttempts[networkKey]}/${AD_CONFIG.maxRetries})`);
                
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
                console.warn(`⚠️ ${networkKey} falló después de ${AD_CONFIG.maxRetries} intentos`);
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
            
            // Verificar JuicyAds
            if (window.adsbyjuicy || 
                document.querySelector('[data-network="juicyads"]') || 
                document.querySelector('.ad-juicyads')) {
                console.log('✅ JuicyAds: Detectado');
                activeNetworks++;
            } else {
                console.log('❌ JuicyAds: No detectado');
            }
            
            // Verificar ExoClick
            if (window.ExoLoader || 
                window.exoclick || 
                document.querySelector('[data-network="exoclick"]') ||
                document.querySelector('.ad-exoclick')) {
                console.log('✅ ExoClick: Detectado');
                activeNetworks++;
            } else {
                console.log('❌ ExoClick: No detectado');
            }
            
            // Verificar PopAds
            if (this.popAdsInitialized || 
                window.e494ffb82839a291 || 
                window.e494ffb82839a29122608e933394c091) {
                console.log('✅ PopAds: Detectado');
                activeNetworks++;
            } else {
                console.log('❌ PopAds: No detectado');
            }
            
            console.log('📊 ===== RESUMEN =====');
            console.log(`📊 Redes activas: ${activeNetworks}/3`);
            console.log(`📊 Estado: ${activeNetworks === 3 ? '✅ Todas las redes funcionando' : '⚠️ Algunas redes no están activas'}`);
            
            return activeNetworks;
        },
        
        // Funciones de prueba globales
        testAds() {
            console.log('🔍 Probando sistema de anuncios...');
            console.log('Environment:', AD_CONFIG.environment);
            console.log('Redes cargadas:', Array.from(this.loadedNetworks));
            
            const verification = this.verifyAdNetworks();
            const containers = document.querySelectorAll('.ad-container');
            console.log(`Contenedores encontrados: ${containers.length}`);
            
            containers.forEach((container, index) => {
                console.log(`Container ${index + 1}:`, {
                    id: container.id,
                    classes: container.className,
                    visible: container.offsetWidth > 0 && container.offsetHeight > 0,
                    children: container.children.length
                });
            });
            
            return {
                environment: AD_CONFIG.environment,
                loadedNetworks: Array.from(this.loadedNetworks),
                activeNetworks: verification,
                containers: containers.length,
                config: AD_CONFIG.networks
            };
        },
        
        reloadAds() {
            console.log('🔄 Recargando sistema de anuncios...');
            
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
    
    console.log('✅ Sistema de Anuncios v3.0.0 cargado');
    console.log('💡 Usa window.testAds() para análisis detallado');
    console.log('💡 Usa window.reloadAds() para recargar anuncios');
    
})();
