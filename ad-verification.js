// ============================
// AD VERIFICATION SYSTEM v3.1.0 - ULTIMATE FIX
// Sistema completo de gestión de anuncios con fallbacks
// FIXED: Bloqueo de scripts, CORS, CSP y tracking protection
// ============================

(function() {
    'use strict';
    
    const AD_CONFIG = {
        environment: window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' || 
                    window.location.hostname.includes('192.168') ? 'development' : 'production',
        maxRetries: 3,
        retryDelay: 2000,
        useProxy: true, // Activar proxy para scripts bloqueados
        useFallback: true, // Usar iframes como fallback
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
                iframeUrl: 'https://www.juicyads.com/iframe_mobile.php?adzone=',
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
            console.log('🎯 [Ad Networks] Sistema v3.1.0 - Ultimate Fix');
            console.log('🌍 Environment:', AD_CONFIG.environment);
            
            if (AD_CONFIG.environment === 'development') {
                console.log('🔧 Development mode - Using placeholders');
                this.showDevelopmentPlaceholders();
                return;
            }
            
            // Detectar bloqueadores y protecciones
            this.detectBlockers();
            
            // Inicializar redes con múltiples estrategias
            this.initializeNetworks();
            
            // Verificación y corrección periódica
            setInterval(() => this.verifyAndFixAds(), 10000);
        },
        
        detectBlockers() {
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
        
        initializeNetworks() {
            console.log('📢 Iniciando carga de redes de anuncios...');
            
            // Estrategia 1: Cargar scripts normalmente
            if (AD_CONFIG.networks.juicyads.enabled) {
                this.loadJuicyAds();
            }
            
            if (AD_CONFIG.networks.exoclick.enabled) {
                this.loadExoClick();
            }
            
            if (AD_CONFIG.networks.popads.enabled) {
                this.loadPopAds();
            }
            
            // Estrategia 2: Si fallan, usar proxy
            setTimeout(() => {
                if (!this.loadedNetworks.has('juicyads') && AD_CONFIG.useProxy) {
                    this.loadViaProxy('juicyads');
                }
                if (!this.loadedNetworks.has('exoclick') && AD_CONFIG.useProxy) {
                    this.loadViaProxy('exoclick');
                }
            }, 5000);
            
            // Estrategia 3: Si todo falla, usar iframes
            setTimeout(() => {
                if (AD_CONFIG.useFallback) {
                    this.loadIframeFallbacks();
                }
            }, 8000);
        },
        
        // ============================
        // JUICYADS - MÚLTIPLES MÉTODOS
        // ============================
        loadJuicyAds() {
            console.log('🍊 Cargando JuicyAds...');
            
            // Método 1: Script directo
            if (!document.querySelector('script[src*="jads.co"]')) {
                const script = document.createElement('script');
                script.src = AD_CONFIG.networks.juicyads.scriptUrl;
                script.async = true;
                script.setAttribute('data-cfasync', 'false');
                
                script.onload = () => {
                    console.log('✅ JuicyAds script cargado');
                    this.loadedNetworks.add('juicyads');
                    this.initializeJuicyAdsZones();
                };
                
                script.onerror = () => {
                    console.warn('⚠️ JuicyAds script falló - Intentando método alternativo');
                    this.loadJuicyAdsFallback();
                };
                
                document.head.appendChild(script);
            } else {
                this.initializeJuicyAdsZones();
            }
        },
        
        loadJuicyAdsFallback() {
            console.log('🍊 Usando fallback para JuicyAds...');
            
            const zones = AD_CONFIG.networks.juicyads.zones;
            
            Object.entries(zones).forEach(([position, zoneId]) => {
                if (this.containersCreated.has(`juicyads-${position}`)) return;
                
                const container = this.createAdContainer('juicyads', position);
                
                // Método 2: Iframe directo
                const iframe = document.createElement('iframe');
                iframe.src = `${AD_CONFIG.networks.juicyads.iframeUrl}${zoneId}`;
                iframe.style.cssText = 'width: 100%; height: 100%; border: 0;';
                iframe.setAttribute('scrolling', 'no');
                iframe.setAttribute('marginheight', '0');
                iframe.setAttribute('marginwidth', '0');
                iframe.setAttribute('allowtransparency', 'true');
                
                container.appendChild(iframe);
                this.containersCreated.add(`juicyads-${position}`);
            });
            
            this.loadedNetworks.add('juicyads');
        },
        
        initializeJuicyAdsZones() {
            console.log('🍊 Inicializando zonas JuicyAds...');
            
            const zones = AD_CONFIG.networks.juicyads.zones;
            
            Object.entries(zones).forEach(([position, zoneId]) => {
                if (this.containersCreated.has(`juicyads-${position}`)) return;
                
                const container = this.createAdContainer('juicyads', position);
                
                // Crear ins tag
                const ins = document.createElement('ins');
                ins.id = `ja_${zoneId}`;
                ins.className = 'jaads';
                ins.setAttribute('data-aid', zoneId);
                ins.setAttribute('data-divid', `ja_${zoneId}`);
                ins.style.cssText = 'display:block !important;';
                
                container.appendChild(ins);
                
                // Activar zona
                if (window.adsbyjuicy && window.adsbyjuicy.push) {
                    window.adsbyjuicy.push({'adzone': zoneId});
                }
                
                this.containersCreated.add(`juicyads-${position}`);
            });
        },
        
        // ============================
        // EXOCLICK - MÚLTIPLES MÉTODOS
        // ============================
        loadExoClick() {
            console.log('🔵 Cargando ExoClick...');
            
            const zones = AD_CONFIG.networks.exoclick.zones;
            
            Object.entries(zones).forEach(([position, zoneId]) => {
                if (this.containersCreated.has(`exoclick-${position}`)) return;
                
                const container = this.createAdContainer('exoclick', position);
                
                // Método 1: Script directo por zona
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = `https://syndication.exoclick.com/ads.js?t=2&idzone=${zoneId}`;
                script.async = true;
                
                script.onload = () => {
                    console.log(`✅ ExoClick zona ${position} cargada`);
                };
                
                script.onerror = () => {
                    console.warn(`⚠️ ExoClick zona ${position} falló - Usando iframe`);
                    this.loadExoClickIframe(container, position, zoneId);
                };
                
                container.appendChild(script);
                this.containersCreated.add(`exoclick-${position}`);
            });
            
            this.loadedNetworks.add('exoclick');
        },
        
        loadExoClickIframe(container, position, zoneId) {
            // Limpiar container
            container.innerHTML = '';
            
            // Método 2: Iframe directo
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
        loadPopAds() {
            console.log('🚀 Cargando PopAds...');
            
            if (window.e494ffb82839a29122608e933394c091) {
                console.log('🚀 PopAds ya existe');
                return;
            }
            
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
                        ];
                    if(!x[r]){
                        try{
                            Object.freeze(x[r]=l)
                        }catch(e){}
                        
                        // Cargar script de PopAds
                        var s = document.createElement("script");
                        s.type = "text/javascript";
                        s.async = true;
                        s.src = "https://www.premiumvertising.com/pboba.min.js";
                        s.onerror = function() {
                            console.warn("PopAds script failed to load");
                        };
                        var z = document.getElementsByTagName("script")[0];
                        z.parentNode.insertBefore(s, z);
                    }
                })();
                /*]]>/* */
            `;
            
            document.head.appendChild(popAdsScript);
            this.loadedNetworks.add('popads');
            console.log('✅ PopAds script inyectado');
        },
        
        // ============================
        // CARGA VIA PROXY
        // ============================
        async loadViaProxy(network) {
            console.log(`🔄 Cargando ${network} via proxy...`);
            
            try {
                let scriptUrl = '';
                
                if (network === 'juicyads') {
                    scriptUrl = AD_CONFIG.networks.juicyads.scriptUrl;
                } else if (network === 'exoclick') {
                    scriptUrl = AD_CONFIG.networks.exoclick.scriptUrls[0];
                }
                
                if (!scriptUrl) return;
                
                const proxyUrl = `/proxy.php?url=${encodeURIComponent(scriptUrl)}`;
                const response = await fetch(proxyUrl);
                
                if (response.ok) {
                    const scriptContent = await response.text();
                    const script = document.createElement('script');
                    script.textContent = scriptContent;
                    document.head.appendChild(script);
                    
                    console.log(`✅ ${network} cargado via proxy`);
                    this.loadedNetworks.add(network);
                    
                    // Inicializar zonas después de cargar
                    if (network === 'juicyads') {
                        this.initializeJuicyAdsZones();
                    }
                } else {
                    throw new Error(`Proxy failed: ${response.status}`);
                }
            } catch (error) {
                console.error(`❌ Error cargando ${network} via proxy:`, error);
                // Usar iframe como último recurso
                if (network === 'juicyads') {
                    this.loadJuicyAdsFallback();
                }
            }
        },
        
        // ============================
        // FALLBACK CON IFRAMES
        // ============================
        loadIframeFallbacks() {
            console.log('🔧 Cargando fallbacks con iframes...');
            
            // JuicyAds iframes
            if (!this.loadedNetworks.has('juicyads') || AD_CONFIG.useFallback) {
                const juicyZones = AD_CONFIG.networks.juicyads.zones;
                Object.entries(juicyZones).forEach(([position, zoneId]) => {
                    const containerId = `juicyads-iframe-${position}`;
                    if (!this.containersCreated.has(containerId)) {
                        const container = this.createAdContainer('juicyads-iframe', position);
                        container.innerHTML = `
                            <iframe 
                                src="${AD_CONFIG.networks.juicyads.iframeUrl}${zoneId}"
                                width="100%" 
                                height="${position === 'sidebar' ? '250' : '90'}"
                                scrolling="no"
                                frameborder="0"
                                marginheight="0"
                                marginwidth="0"
                                allowtransparency="true"
                                style="border:0; margin:0; padding:0;">
                            </iframe>
                        `;
                        this.containersCreated.add(containerId);
                    }
                });
            }
            
            // ExoClick iframes
            if (!this.loadedNetworks.has('exoclick') || AD_CONFIG.useFallback) {
                const exoZones = AD_CONFIG.networks.exoclick.zones;
                Object.entries(exoZones).forEach(([position, zoneId]) => {
                    const containerId = `exoclick-iframe-${position}`;
                    if (!this.containersCreated.has(containerId)) {
                        const container = this.createAdContainer('exoclick-iframe', position);
                        container.innerHTML = `
                            <iframe 
                                src="${AD_CONFIG.networks.exoclick.iframeUrl}${zoneId}"
                                width="100%" 
                                height="${position === 'sidebar' ? '250' : '90'}"
                                scrolling="no"
                                frameborder="0"
                                style="border:0;">
                            </iframe>
                        `;
                        this.containersCreated.add(containerId);
                    }
                });
            }
        },
        
        // ============================
        // CREAR CONTENEDOR DE ANUNCIOS
        // ============================
        createAdContainer(network, position) {
            const containerId = `ad-${network}-${position}`;
            
            // Verificar si ya existe
            let container = document.getElementById(containerId);
            if (container) {
                return container;
            }
            
            // Crear nuevo contenedor
            container = document.createElement('div');
            container.id = containerId;
            container.className = `ad-container ad-${network} ad-${position}`;
            
            // Estilos según posición
            const styles = this.getContainerStyles(position);
            container.style.cssText = styles;
            
            // Insertar en el DOM
            this.insertContainerInDOM(container, position);
            
            console.log(`📍 Contenedor ${network}-${position} creado`);
            
            return container;
        },
        
        getContainerStyles(position) {
            const baseStyles = `
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                position: relative !important;
                z-index: 100 !important;
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
                console.error(`Error insertando contenedor ${position}:`, error);
            }
        },
        
        // ============================
        // VERIFICACIÓN Y CORRECCIÓN
        // ============================
        verifyAndFixAds() {
            console.log('🔍 Verificando y corrigiendo anuncios...');
            
            // Verificar cada contenedor
            const containers = document.querySelectorAll('.ad-container');
            let emptyContainers = 0;
            
            containers.forEach(container => {
                // Verificar si tiene contenido
                const hasContent = container.querySelector('iframe, ins, script[src]');
                
                if (!hasContent || container.children.length === 0) {
                    emptyContainers++;
                    console.warn(`⚠️ Contenedor vacío: ${container.id}`);
                    
                    // Intentar rellenar con iframe
                    const position = container.className.match(/ad-(header|sidebar|footer)/)?.[1];
                    if (position) {
                        // Determinar red y zona
                        if (container.id.includes('juicy')) {
                            const zoneId = AD_CONFIG.networks.juicyads.zones[position];
                            if (zoneId) {
                                container.innerHTML = `
                                    <iframe 
                                        src="${AD_CONFIG.networks.juicyads.iframeUrl}${zoneId}"
                                        width="100%" 
                                        height="100%"
                                        scrolling="no"
                                        frameborder="0"
                                        style="border:0;">
                                    </iframe>
                                `;
                            }
                        } else if (container.id.includes('exo')) {
                            const zoneId = AD_CONFIG.networks.exoclick.zones[position];
                            if (zoneId) {
                                container.innerHTML = `
                                    <iframe 
                                        src="${AD_CONFIG.networks.exoclick.iframeUrl}${zoneId}"
                                        width="100%" 
                                        height="100%"
                                        scrolling="no"
                                        frameborder="0"
                                        style="border:0;">
                                    </iframe>
                                `;
                            }
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
                const container = this.createAdContainer('placeholder', position);
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
        // TEST FUNCTION
        // ============================
        testAds() {
            console.log('🔍 Ejecutando prueba completa del sistema de anuncios...');
            
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
                    visible: container.offsetWidth > 0 && container.offsetHeight > 0,
                    dimensions: `${container.offsetWidth}x${container.offsetHeight}`,
                    hasContent: hasIframe || hasIns || hasScript,
                    contentType: hasIframe ? 'iframe' : hasIns ? 'ins' : hasScript ? 'script' : 'empty'
                });
            });
            
            console.table(report.containerDetails);
            
            return report;
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
    window.fixAds = () => AdVerificationSystem.verifyAndFixAds();
    window.reloadAds = () => {
        AdVerificationSystem.loadIframeFallbacks();
        AdVerificationSystem.verifyAndFixAds();
    };
    
    console.log('✅ Sistema de Anuncios v3.1.0 cargado - Ultimate Fix');
    console.log('💡 Comandos disponibles:');
    console.log('  window.testAds() - Verificar estado de anuncios');
    console.log('  window.fixAds() - Corregir anuncios vacíos');
    console.log('  window.reloadAds() - Recargar todos los anuncios');
    
})();
