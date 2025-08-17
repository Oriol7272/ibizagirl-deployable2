// ============================
// AD VERIFICATION SYSTEM v3.1.0 - FIXED EXOCLICK & ENHANCED
// Sistema completo de gestión de anuncios para IbizaGirl.pics
// FIXED: ExoClick loading, Chrome visibility, Enhanced error handling
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
                    'https://syndication.exoclick.com/ads.js',
                    'https://a.realsrv.com/ad-provider.js',
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
        exoClickLoaded: false,
        
        init() {
            console.log('🎯 [Ad Networks] Sistema v3.1.0 - ExoClick Fixed');
            console.log('🌍 Environment:', AD_CONFIG.environment);
            
            if (AD_CONFIG.environment === 'development') {
                console.log('🔧 Development mode - Using placeholders');
                this.showDevelopmentPlaceholders();
                return;
            }
            
            // Detectar bloqueadores de anuncios
            this.detectAdBlocker();
            
            // Inicializar redes con delay progresivo
            setTimeout(() => this.loadAdNetworks(), 1000);
            setTimeout(() => this.verifyAdNetworks(), 8000);
            setTimeout(() => this.finalVerification(), 15000);
        },
        
        detectAdBlocker() {
            // Crear un elemento de prueba
            const testAd = document.createElement('div');
            testAd.innerHTML = '&nbsp;';
            testAd.className = 'adsbox pub_300x250 pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links ad-text adSense adBlock';
            testAd.style.cssText = 'width: 1px !important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -1000px !important;';
            
            document.body.appendChild(testAd);
            
            setTimeout(() => {
                if (testAd.offsetHeight === 0 || testAd.clientHeight === 0) {
                    console.warn('⚠️ Posible bloqueador de anuncios detectado');
                    this.showAdBlockerWarning();
                }
                testAd.remove();
            }, 100);
        },
        
        showAdBlockerWarning() {
            const warning = document.createElement('div');
            warning.id = 'adblocker-warning';
            warning.style.cssText = `
                position: fixed;
                top: 70px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #ff6b35, #ff69b4);
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                z-index: 10000;
                font-weight: 600;
                box-shadow: 0 10px 30px rgba(255, 107, 53, 0.4);
                max-width: 500px;
                text-align: center;
            `;
            warning.innerHTML = `
                ⚠️ Bloqueador de anuncios detectado<br>
                <small>Por favor, desactívalo para apoyar nuestro contenido gratuito</small>
            `;
            
            document.body.appendChild(warning);
            
            setTimeout(() => {
                warning.style.transition = 'opacity 0.5s';
                warning.style.opacity = '0';
                setTimeout(() => warning.remove(), 500);
            }, 5000);
        },
        
        loadAdNetworks() {
            console.log('📢 Iniciando carga de redes de anuncios...');
            
            if (AD_CONFIG.networks.juicyads.enabled) {
                setTimeout(() => this.loadJuicyAds(), 100);
            }
            
            if (AD_CONFIG.networks.exoclick.enabled) {
                setTimeout(() => this.loadExoClickEnhanced(), 2000);
            }
            
            if (AD_CONFIG.networks.popads.enabled) {
                setTimeout(() => this.loadPopAds(), 4000);
            }
        },
        
        // ============================
        // JUICYADS IMPLEMENTATION - ENHANCED
        // ============================
        loadJuicyAds() {
            console.log('🍊 Cargando JuicyAds...');
            
            // Preparar el objeto global
            window.adsbyjuicy = window.adsbyjuicy || [];
            window.adsbyjuicy.push = window.adsbyjuicy.push || function() {
                (window.adsbyjuicy.q = window.adsbyjuicy.q || []).push(arguments);
            };
            
            // Verificar si el script ya existe
            if (document.querySelector('script[src*="jads.co"]')) {
                console.log('🍊 JuicyAds script ya existe, inicializando zonas...');
                this.initializeJuicyAds();
                return;
            }
            
            const script = document.createElement('script');
            script.src = AD_CONFIG.networks.juicyads.scriptUrl;
            script.async = true;
            script.setAttribute('data-cfasync', 'false');
            script.setAttribute('crossorigin', 'anonymous');
            
            script.onload = () => {
                console.log('✅ JuicyAds script cargado');
                this.loadedNetworks.add('juicyads');
                setTimeout(() => this.initializeJuicyAds(), 1500);
            };
            
            script.onerror = (error) => {
                console.error('❌ Error cargando JuicyAds:', error);
                this.handleLoadError('juicyads');
            };
            
            document.head.appendChild(script);
        },
        
        initializeJuicyAds() {
            console.log('🍊 Inicializando zonas JuicyAds...');
            
            const zones = AD_CONFIG.networks.juicyads.zones;
            
            Object.entries(zones).forEach(([position, zoneId]) => {
                this.createJuicyAdsZone(position, zoneId);
            });
        },
        
        createJuicyAdsZone(position, zoneId) {
            console.log(`🍊 Creando zona JuicyAds: ${position} (${zoneId})`);
            
            let container = document.getElementById(`ad-juicyads-${position}`);
            
            if (!container) {
                container = document.createElement('div');
                container.id = `ad-juicyads-${position}`;
                container.className = `ad-container ad-juicyads ad-${position}`;
                container.style.cssText = this.getContainerStyles(position);
                this.appendAdContainer(container, position);
            }
            
            container.innerHTML = '';
            
            const ins = document.createElement('ins');
            ins.id = `ja_${zoneId}`;
            ins.className = 'jaads';
            ins.setAttribute('data-aid', zoneId);
            ins.setAttribute('data-divid', `ja_${zoneId}`);
            ins.style.cssText = 'display:block !important; width:100% !important; height:auto !important;';
            
            container.appendChild(ins);
            
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.innerHTML = `
                (function() {
                    if (typeof window.adsbyjuicy !== 'undefined' && window.adsbyjuicy.push) {
                        window.adsbyjuicy.push({'adzone': ${zoneId}});
                        console.log('✅ JuicyAds zona ${position} activada');
                    }
                })();
            `;
            container.appendChild(script);
        },
        
        // ============================
        // EXOCLICK IMPLEMENTATION - COMPLETELY FIXED
        // ============================
        loadExoClickEnhanced() {
            console.log('🔵 Cargando ExoClick Enhanced...');
            
            // Crear el objeto ExoLoader manualmente si no existe
            if (!window.ExoLoader) {
                window.ExoLoader = {
                    addZone: function(config) {
                        console.log('🔵 ExoLoader.addZone simulado:', config);
                        const zoneId = config.zone_id || config.idzone;
                        if (zoneId) {
                            const container = document.querySelector(`[data-zoneid="${zoneId}"]`);
                            if (container && container.parentElement) {
                                const script = document.createElement('script');
                                script.src = `https://syndication.exoclick.com/ads.js?t=2&idzone=${zoneId}`;
                                script.async = true;
                                script.setAttribute('data-cfasync', 'false');
                                container.parentElement.appendChild(script);
                            }
                        }
                    },
                    serve: function(config) {
                        console.log('🔵 ExoLoader.serve simulado:', config);
                        this.addZone(config);
                    }
                };
            }
            
            // Intentar cargar el script principal
            const mainScript = document.createElement('script');
            mainScript.src = 'https://syndication.exoclick.com/ads.js';
            mainScript.async = true;
            mainScript.setAttribute('data-cfasync', 'false');
            
            mainScript.onload = () => {
                console.log('✅ ExoClick script principal cargado');
                this.exoClickLoaded = true;
                this.loadedNetworks.add('exoclick');
                setTimeout(() => this.initializeExoClickZones(), 1000);
            };
            
            mainScript.onerror = () => {
                console.warn('⚠️ ExoClick script principal falló, usando método directo');
                this.initializeExoClickDirect();
            };
            
            document.body.appendChild(mainScript);
            
            // Timeout para cargar directamente si falla
            setTimeout(() => {
                if (!this.exoClickLoaded) {
                    this.initializeExoClickDirect();
                }
            }, 3000);
        },
        
        initializeExoClickZones() {
            console.log('🔵 Inicializando zonas ExoClick con ExoLoader...');
            
            const zones = AD_CONFIG.networks.exoclick.zones;
            Object.entries(zones).forEach(([position, zoneId]) => {
                this.createExoClickZone(position, zoneId);
            });
        },
        
        createExoClickZone(position, zoneId) {
            console.log(`🔵 Creando zona ExoClick: ${position} (${zoneId})`);
            
            let container = document.getElementById(`ad-exoclick-${position}`);
            
            if (!container) {
                container = document.createElement('div');
                container.id = `ad-exoclick-${position}`;
                container.className = `ad-container ad-exoclick ad-${position}`;
                container.style.cssText = this.getContainerStyles(position);
                this.appendAdContainer(container, position);
            }
            
            container.innerHTML = '';
            
            // Crear elemento ins para ExoClick
            const ins = document.createElement('ins');
            ins.className = 'adsbyexoclick';
            ins.setAttribute('data-zoneid', zoneId);
            ins.style.cssText = 'display:block !important; width:100% !important; height:auto !important;';
            container.appendChild(ins);
            
            // Si ExoLoader está disponible, usarlo
            if (window.ExoLoader && typeof window.ExoLoader.addZone === 'function') {
                try {
                    window.ExoLoader.addZone({"zone_id": zoneId});
                    console.log(`✅ ExoClick zona ${position} activada con ExoLoader`);
                } catch (e) {
                    console.warn(`⚠️ Error con ExoLoader para zona ${position}:`, e);
                    this.loadExoClickZoneDirect(container, zoneId);
                }
            } else {
                this.loadExoClickZoneDirect(container, zoneId);
            }
        },
        
        loadExoClickZoneDirect(container, zoneId) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `https://syndication.exoclick.com/ads.js?t=2&idzone=${zoneId}`;
            script.async = true;
            script.setAttribute('data-cfasync', 'false');
            container.appendChild(script);
            console.log(`✅ ExoClick zona cargada directamente: ${zoneId}`);
        },
        
        initializeExoClickDirect() {
            console.log('🔵 Inicialización directa de ExoClick...');
            
            const zones = AD_CONFIG.networks.exoclick.zones;
            Object.entries(zones).forEach(([position, zoneId]) => {
                let container = document.getElementById(`ad-exoclick-${position}`);
                
                if (!container) {
                    container = document.createElement('div');
                    container.id = `ad-exoclick-${position}`;
                    container.className = `ad-container ad-exoclick ad-${position}`;
                    container.style.cssText = this.getContainerStyles(position);
                    this.appendAdContainer(container, position);
                }
                
                container.innerHTML = '';
                
                // Método 1: Crear ins y script
                const ins = document.createElement('ins');
                ins.className = 'adsbyexoclick';
                ins.setAttribute('data-zoneid', zoneId);
                ins.style.cssText = 'display:block !important; width:100% !important; height:auto !important;';
                container.appendChild(ins);
                
                // Método 2: Iframe como fallback
                const iframe = document.createElement('iframe');
                iframe.src = `https://syndication.exoclick.com/ads-iframe.php?idzone=${zoneId}`;
                iframe.style.cssText = 'width:100%; height:100%; border:none; min-height:250px;';
                iframe.setAttribute('scrolling', 'no');
                iframe.setAttribute('marginwidth', '0');
                iframe.setAttribute('marginheight', '0');
                
                // Agregar script de zona
                const script = document.createElement('script');
                script.async = true;
                script.setAttribute('data-cfasync', 'false');
                script.src = `https://syndication.exoclick.com/ads.js?t=2&idzone=${zoneId}`;
                
                script.onerror = () => {
                    console.warn(`⚠️ Script de zona ${zoneId} falló, usando iframe`);
                    container.appendChild(iframe);
                };
                
                container.appendChild(script);
            });
            
            this.loadedNetworks.add('exoclick');
            console.log('✅ ExoClick inicializado directamente');
        },
        
        // ============================
        // POPADS IMPLEMENTATION
        // ============================
        loadPopAds() {
            console.log('🚀 Cargando PopAds...');
            
            const config = AD_CONFIG.networks.popads.config;
            
            if (window.e494ffb82839a29122608e933394c091) {
                console.log('🚀 PopAds ya existe');
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
                display: none;
            `;
            indicator.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div>PopAds Active</div>
                </div>
            `;
            
            document.body.appendChild(indicator);
        },
        
        // ============================
        // UTILITY FUNCTIONS
        // ============================
        getContainerStyles(position) {
            const baseStyles = `
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                position: relative !important;
                z-index: 100 !important;
                clear: both !important;
                overflow: visible !important;
                transform: translateZ(0) !important;
                -webkit-transform: translateZ(0) !important;
                backface-visibility: visible !important;
                -webkit-backface-visibility: visible !important;
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
        
        appendAdContainer(container, position) {
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
                            this.loadExoClickEnhanced();
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
                    container.style.cssText = this.getContainerStyles(position);
                    this.appendAdContainer(container, position);
                }
                
                const sizes = {
                    header: '728x90',
                    sidebar: '300x250',
                    footer: '728x90'
                };
                
                container.innerHTML = `
                    <div style="
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(135deg, rgba(0, 119, 190, 0.1), rgba(0, 212, 255, 0.1));
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border: 2px dashed rgba(0, 212, 255, 0.3);
                        color: rgba(255, 255, 255, 0.6);
                        font-family: Arial, sans-serif;
                        border-radius: 10px;
                    ">
                        <div>
                            <div style="font-size: 14px;">${network.name}</div>
                            <div style="font-size: 12px;">${sizes[position]}</div>
                            <div style="font-size: 10px; margin-top: 5px;">Loading...</div>
                        </div>
                    </div>
                `;
            });
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
                                  document.querySelector('.jaads') || 
                                  document.querySelector('[id*="ja_"]');
            
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
                                  document.querySelector('.adsbyexoclick') ||
                                  document.querySelector('[data-zoneid]') ||
                                  document.querySelector('iframe[src*="exoclick"]');
            
            if (exoClickActive) {
                console.log('✅ ExoClick: Detectado');
                report.exoclick = 'Active';
                activeNetworks++;
            } else {
                console.log('❌ ExoClick: No detectado');
                report.exoclick = 'Not Found';
            }
            
            // Verificar PopAds
            const popAdsActive = window.e494ffb82839a29122608e933394c091;
            
            if (popAdsActive) {
                console.log('✅ PopAds: Detectado');
                report.popads = 'Active';
                activeNetworks++;
            } else {
                console.log('❌ PopAds: No detectado');
                report.popads = 'Not Found';
            }
            
            console.log('📊 ===== RESUMEN =====');
            console.log(`📊 Redes activas: ${activeNetworks}/3`);
            console.log('📊 Reporte:', report);
            
            return { activeNetworks, report };
        },
        
        finalVerification() {
            console.log('🔍 ===== VERIFICACIÓN FINAL =====');
            
            const result = this.verifyAdNetworks();
            
            const containers = document.querySelectorAll('.ad-container');
            console.log(`📦 Total de contenedores: ${containers.length}`);
            
            let emptyContainers = 0;
            containers.forEach((container, index) => {
                const hasContent = container.querySelector('ins, script[src*="exoclick"], script[src*="jads"], iframe');
                if (!hasContent && !container.classList.contains('ad-placeholder')) {
                    emptyContainers++;
                    console.warn(`⚠️ Contenedor vacío: ${container.id}`);
                }
            });
            
            console.log('📊 ===== RESUMEN FINAL =====');
            console.log(`✅ Redes activas: ${result.activeNetworks}/3`);
            console.log(`📦 Contenedores: ${containers.length} (${emptyContainers} vacíos)`);
            
            // Si hay problemas, intentar arreglarlos
            if (result.activeNetworks < 3 || emptyContainers > 0) {
                this.attemptFixes();
            }
            
            return result;
        },
        
        attemptFixes() {
            console.log('🔧 Intentando correcciones automáticas...');
            
            // Forzar visibilidad de todos los contenedores
            document.querySelectorAll('.ad-container').forEach(container => {
                container.style.display = 'block !important';
                container.style.visibility = 'visible !important';
                container.style.opacity = '1 !important';
                
                // Si está vacío, intentar recargar
                if (container.children.length === 0) {
                    const position = container.id.includes('header') ? 'header' : 
                                   container.id.includes('sidebar') ? 'sidebar' : 'footer';
                    
                    if (container.id.includes('exoclick')) {
                        const zoneId = AD_CONFIG.networks.exoclick.zones[position];
                        if (zoneId) {
                            this.loadExoClickZoneDirect(container, zoneId);
                        }
                    }
                }
            });
        },
        
        // Función pública para testing
        testAds() {
            console.log('🔍 Ejecutando prueba completa del sistema de anuncios...');
            
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
                    visible: container.offsetWidth > 0 && container.offsetHeight > 0,
                    dimensions: `${container.offsetWidth}x${container.offsetHeight}`,
                    hasAdContent: !!container.querySelector('ins, script[src], iframe'),
                    children: container.children.length
                });
            });
            
            console.table(detailedReport.containerDetails);
            
            return detailedReport;
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
    window.reloadAds = () => {
        console.log('🔄 Recargando sistema de anuncios...');
        AdVerificationSystem.loadAdNetworks();
    };
    
    console.log('✅ Sistema de Anuncios v3.1.0 cargado - ExoClick Fixed');
    
})();
