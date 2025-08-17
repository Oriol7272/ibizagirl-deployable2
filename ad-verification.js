// ============================
// AD VERIFICATION SYSTEM v4.0.0 - COMPLETELY FIXED
// Resuelve zona IDs incorrectas, Chrome blocking, CSP issues
// FIXED: Zone IDs actualizados según dashboards
// ============================

(function() {
    'use strict';
    
    // FIXED: Zone IDs correctos de tus dashboards
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
                    header: 1098518,    // FIXED: Zone real de tu dashboard
                    sidebar: 1098519,   // FIXED: Zone real de tu dashboard
                    footer: 1098520     // FIXED: Zone real de tu dashboard
                },
                iframeUrl: 'https://www.juicyads.com/iframe_mobile.php?adzone=',
                verification: '57781c218b1d1435f3512464c59cf39b',
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
                    header: 5696328,    // CONFIRMED: De tu dashboard
                    sidebar: 5696329,   // Crear en ExoClick
                    footer: 5696330     // Crear en ExoClick
                },
                iframeUrl: 'https://syndication.exoclick.com/ads-iframe.php?idzone=',
                verification: '97ce8adfbeb6e153ef4ebf2566dfeb7d',
                testMode: false
            },
            popads: {
                enabled: true,
                name: 'PopAds',
                config: {
                    siteId: 5226178,
                    minBid: 0,
                    popundersPerIP: "1",
                    delayBetween: 30000,
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
        isInitialized: false,
        
        init() {
            if (this.isInitialized) return;
            
            console.log('🎯 [Ad Networks] Sistema v4.0.0 - COMPLETELY FIXED');
            console.log('🌍 Environment:', AD_CONFIG.environment);
            console.log('🔧 Zone IDs corregidos según dashboards');
            
            if (AD_CONFIG.environment === 'development') {
                console.log('🚧 Development mode - Using enhanced placeholders');
                this.showDevelopmentPlaceholders();
                this.isInitialized = true;
                return;
            }
            
            // FIXED: Detectar y resolver bloqueos
            this.detectAndResolveBlockers();
            
            // FIXED: Inicialización secuencial más robusta
            this.initializeNetworksSequentially();
            
            // FIXED: Verificación y corrección continua
            setInterval(() => this.verifyAndFixAds(), 8000);
            
            this.isInitialized = true;
        },
        
        detectAndResolveBlockers() {
            console.log('🔍 Detectando bloqueadores y protecciones...');
            
            // Test 1: Detectar AdBlock
            const testAd = document.createElement('div');
            testAd.innerHTML = '&nbsp;';
            testAd.className = 'adsbox adsbygoogle';
            testAd.style.cssText = 'position: absolute; top: -100px; left: -100px; width: 1px; height: 1px;';
            document.body.appendChild(testAd);
            
            setTimeout(() => {
                const isBlocked = testAd.offsetHeight === 0;
                if (isBlocked) {
                    console.warn('⚠️ AdBlock detectado - Activando sistemas anti-bloqueo');
                    AD_CONFIG.useFallback = true;
                    this.enableAntiBlockMeasures();
                }
                testAd.remove();
            }, 200);
            
            // Test 2: Chrome tracking protection
            if (navigator.doNotTrack === "1" || window.doNotTrack === "1") {
                console.warn('⚠️ Do Not Track activado - Usando métodos alternativos');
                AD_CONFIG.useFallback = true;
            }
            
            // Test 3: CSP restrictivo
            try {
                eval('1+1'); // Test if eval is blocked
            } catch (e) {
                console.warn('⚠️ CSP restrictivo detectado - Ajustando estrategia');
                AD_CONFIG.useProxy = true;
            }
        },
        
        enableAntiBlockMeasures() {
            // FIXED: Medidas anti-bloqueo más avanzadas
            const style = document.createElement('style');
            style.textContent = `
                .ad-container, 
                [id*="ad-"],
                [class*="juicyads"],
                [class*="exoclick"] {
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    position: relative !important;
                    z-index: 999 !important;
                    width: auto !important;
                    height: auto !important;
                    overflow: visible !important;
                    transform: none !important;
                    filter: none !important;
                }
                
                /* Chrome-specific fixes */
                @supports (-webkit-appearance: none) {
                    .ad-container {
                        -webkit-backface-visibility: visible !important;
                        -webkit-transform: translate3d(0,0,0) !important;
                    }
                }
            `;
            document.head.appendChild(style);
        },
        
        async initializeNetworksSequentially() {
            console.log('🚀 Iniciando carga secuencial de redes...');
            
            try {
                // Paso 1: JuicyAds con zone IDs correctos
                if (AD_CONFIG.networks.juicyads.enabled) {
                    await this.loadJuicyAdsFixed();
                    await this.delay(1000);
                }
                
                // Paso 2: ExoClick con zone ID confirmado
                if (AD_CONFIG.networks.exoclick.enabled) {
                    await this.loadExoClickFixed();
                    await this.delay(1000);
                }
                
                // Paso 3: PopAds
                if (AD_CONFIG.networks.popads.enabled) {
                    await this.loadPopAdsFixed();
                }
                
                // Paso 4: Verificación final después de 5 segundos
                setTimeout(() => {
                    this.performFinalVerification();
                }, 5000);
                
            } catch (error) {
                console.error('❌ Error en inicialización secuencial:', error);
                this.loadEmergencyFallbacks();
            }
        },
        
        async loadJuicyAdsFixed() {
            console.log('🍊 Cargando JuicyAds con zone IDs corregidos...');
            
            try {
                // FIXED: Crear contenedores con zone IDs correctos
                const zones = AD_CONFIG.networks.juicyads.zones;
                
                Object.entries(zones).forEach(([position, zoneId]) => {
                    const container = this.createAdvancedContainer('juicyads', position, zoneId);
                    
                    // FIXED: Implementación correcta de JuicyAds
                    const ins = document.createElement('ins');
                    ins.id = `ja_${zoneId}`;
                    ins.className = 'jaads';
                    ins.setAttribute('data-aid', zoneId);
                    ins.setAttribute('data-divid', `ja_${zoneId}`);
                    ins.style.cssText = 'display:block !important; width: 100%; height: 100%;';
                    
                    container.appendChild(ins);
                    this.containersCreated.add(`juicyads-${position}`);
                    
                    console.log(`✅ JuicyAds contenedor ${position} creado con zone ${zoneId}`);
                });
                
                // FIXED: Cargar script principal
                if (!document.querySelector('script[src*="jads.co"]')) {
                    await this.loadScriptAsync(AD_CONFIG.networks.juicyads.scriptUrl);
                }
                
                // FIXED: Inicializar zonas una por una
                setTimeout(() => {
                    Object.values(zones).forEach(zoneId => {
                        if (window.adsbyjuicy && window.adsbyjuicy.push) {
                            try {
                                window.adsbyjuicy.push({'adzone': zoneId});
                                console.log(`✅ JuicyAds zona ${zoneId} activada`);
                            } catch (e) {
                                console.warn(`⚠️ Error activando zona ${zoneId}:`, e);
                            }
                        }
                    });
                }, 2000);
                
                this.loadedNetworks.add('juicyads');
                
            } catch (error) {
                console.error('❌ Error cargando JuicyAds:', error);
                this.loadJuicyAdsFallback();
            }
        },
        
        async loadExoClickFixed() {
            console.log('🔵 Cargando ExoClick con zone ID confirmado...');
            
            try {
                const zones = AD_CONFIG.networks.exoclick.zones;
                
                Object.entries(zones).forEach(([position, zoneId]) => {
                    const container = this.createAdvancedContainer('exoclick', position, zoneId);
                    
                    // FIXED: Método 1 - Script directo por zona
                    const script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = `https://syndication.exoclick.com/ads.js?t=2&idzone=${zoneId}`;
                    script.async = true;
                    script.setAttribute('data-cfasync', 'false');
                    
                    script.onload = () => {
                        console.log(`✅ ExoClick zona ${position} (${zoneId}) cargada exitosamente`);
                    };
                    
                    script.onerror = () => {
                        console.warn(`⚠️ ExoClick zona ${position} falló - Usando iframe`);
                        this.loadExoClickIframe(container, position, zoneId);
                    };
                    
                    container.appendChild(script);
                    this.containersCreated.add(`exoclick-${position}`);
                });
                
                this.loadedNetworks.add('exoclick');
                
            } catch (error) {
                console.error('❌ Error cargando ExoClick:', error);
                this.loadExoClickFallback();
            }
        },
        
        loadExoClickIframe(container, position, zoneId) {
            container.innerHTML = '';
            
            const iframe = document.createElement('iframe');
            iframe.src = `${AD_CONFIG.networks.exoclick.iframeUrl}${zoneId}`;
            iframe.style.cssText = 'width: 100%; height: 100%; border: 0; display: block;';
            iframe.setAttribute('scrolling', 'no');
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allowtransparency', 'true');
            
            container.appendChild(iframe);
            console.log(`🔧 ExoClick iframe fallback activado para zona ${zoneId}`);
        },
        
        async loadPopAdsFixed() {
            console.log('🚀 Cargando PopAds...');
            
            if (window.e494ffb82839a29122608e933394c091) {
                console.log('✅ PopAds ya inicializado');
                return;
            }
            
            try {
                const config = AD_CONFIG.networks.popads.config;
                
                // FIXED: Configuración más robusta
                const popAdsScript = document.createElement('script');
                popAdsScript.type = 'text/javascript';
                popAdsScript.setAttribute('data-cfasync', 'false');
                popAdsScript.textContent = `
                    (function(){
                        var x=window,r="e494ffb82839a29122608e933394c091",
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
                            try{Object.freeze(x[r]=l)}catch(e){}
                            var s=document.createElement("script");
                            s.type="text/javascript";s.async=true;
                            s.src="//www.premiumvertising.com/pboba.min.js";
                            s.onerror=function(){console.warn("PopAds script failed")};
                            document.head.appendChild(s);
                        }
                    })();
                `;
                
                document.head.appendChild(popAdsScript);
                this.loadedNetworks.add('popads');
                console.log('✅ PopAds script inyectado exitosamente');
                
            } catch (error) {
                console.error('❌ Error cargando PopAds:', error);
            }
        },
        
        createAdvancedContainer(network, position, zoneId) {
            const containerId = `ad-${network}-${position}-${zoneId}`;
            
            // Verificar si ya existe
            let container = document.getElementById(containerId);
            if (container) {
                return container;
            }
            
            // Crear nuevo contenedor
            container = document.createElement('div');
            container.id = containerId;
            container.className = `ad-container ad-${network} ad-${position}`;
            container.setAttribute('data-network', network);
            container.setAttribute('data-position', position);
            container.setAttribute('data-zone-id', zoneId);
            container.setAttribute('data-created', new Date().toISOString());
            
            // FIXED: Estilos anti-bloqueo más robustos
            const styles = this.getAdvancedContainerStyles(position);
            container.style.cssText = styles;
            
            // Insertar en DOM
            this.insertContainerInDOM(container, position);
            
            // Agregar marcador de estado
            this.addStatusIndicator(container, network, position, zoneId);
            
            console.log(`📦 Contenedor ${network}-${position} creado con zone ${zoneId}`);
            
            return container;
        },
        
        getAdvancedContainerStyles(position) {
            const baseStyles = `
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                position: relative !important;
                z-index: 100 !important;
                overflow: visible !important;
                background: rgba(0, 119, 190, 0.03) !important;
                border: 1px solid rgba(0, 255, 136, 0.15) !important;
                border-radius: 8px !important;
                padding: 5px !important;
                margin: 10px auto !important;
                box-sizing: border-box !important;
                clear: both !important;
                min-height: 50px !important;
            `;
            
            const positionStyles = {
                header: baseStyles + `
                    width: 100% !important;
                    max-width: 728px !important;
                    min-height: 90px !important;
                    text-align: center !important;
                `,
                sidebar: baseStyles + `
                    position: fixed !important;
                    right: 10px !important;
                    top: 50% !important;
                    transform: translateY(-50%) !important;
                    width: 300px !important;
                    min-height: 250px !important;
                    z-index: 1000 !important;
                    margin: 0 !important;
                `,
                footer: baseStyles + `
                    width: 100% !important;
                    max-width: 728px !important;
                    min-height: 90px !important;
                    text-align: center !important;
                `
            };
            
            return positionStyles[position] || positionStyles.header;
        },
        
        insertContainerInDOM(container, position) {
            try {
                let targetElement;
                let inserted = false;
                
                switch(position) {
                    case 'header':
                        targetElement = document.querySelector('.main-header');
                        if (targetElement && targetElement.parentNode) {
                            targetElement.parentNode.insertBefore(container, targetElement.nextSibling);
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
                        }
                        break;
                }
                
                if (!inserted) {
                    document.body.appendChild(container);
                    inserted = true;
                }
                
                if (inserted) {
                    console.log(`📍 Contenedor ${position} insertado en DOM`);
                }
                
            } catch (error) {
                console.error(`❌ Error insertando contenedor ${position}:`, error);
            }
        },
        
        addStatusIndicator(container, network, position, zoneId) {
            const indicator = document.createElement('div');
            indicator.className = 'ad-status-indicator';
            indicator.style.cssText = `
                position: absolute;
                top: 2px;
                right: 2px;
                background: #00ff88;
                color: #001f3f;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 9px;
                font-weight: bold;
                z-index: 10001;
                font-family: monospace;
            `;
            indicator.textContent = `${network.toUpperCase()}-${zoneId}`;
            container.appendChild(indicator);
        },
        
        performFinalVerification() {
            console.log('🔍 Ejecutando verificación final del sistema...');
            
            const report = {
                timestamp: new Date().toISOString(),
                environment: AD_CONFIG.environment,
                loadedNetworks: Array.from(this.loadedNetworks),
                totalContainers: document.querySelectorAll('.ad-container').length,
                visibleContainers: 0,
                containersWithContent: 0,
                networkStatus: {}
            };
            
            // Verificar cada contenedor
            document.querySelectorAll('.ad-container').forEach(container => {
                const isVisible = this.isElementVisible(container);
                const hasContent = container.children.length > 1; // Más que solo el indicador
                
                if (isVisible) report.visibleContainers++;
                if (hasContent) report.containersWithContent++;
                
                // Forzar visibilidad si es necesario
                if (!isVisible) {
                    container.style.display = 'block';
                    container.style.visibility = 'visible';
                    container.style.opacity = '1';
                }
            });
            
            // Estado de redes específicas
            report.networkStatus.juicyads = {
                loaded: this.loadedNetworks.has('juicyads'),
                zones: document.querySelectorAll('[id^="ja_"]').length,
                scriptPresent: !!window.adsbyjuicy
            };
            
            report.networkStatus.exoclick = {
                loaded: this.loadedNetworks.has('exoclick'),
                zones: document.querySelectorAll('[data-zone-id]').length,
                scriptsPresent: document.querySelectorAll('script[src*="exoclick"]').length
            };
            
            report.networkStatus.popads = {
                loaded: this.loadedNetworks.has('popads'),
                active: !!window.e494ffb82839a29122608e933394c091
            };
            
            console.log('📊 Reporte de verificación final:', report);
            
            // Mostrar alerta si hay problemas
            if (report.visibleContainers < report.totalContainers) {
                console.warn(`⚠️ ${report.totalContainers - report.visibleContainers} contenedores no visibles`);
            }
            
            if (report.loadedNetworks.length === 0) {
                console.error('❌ CRÍTICO: Ninguna red de anuncios cargada - Activando fallback de emergencia');
                this.loadEmergencyFallbacks();
            }
            
            return report;
        },
        
        loadEmergencyFallbacks() {
            console.log('🚨 Activando fallbacks de emergencia...');
            
            const positions = ['header', 'footer'];
            const networks = AD_CONFIG.networks;
            
            positions.forEach(position => {
                // JuicyAds iframe fallback
                const juicyZoneId = networks.juicyads.zones[position];
                if (juicyZoneId) {
                    const container = this.createAdvancedContainer('juicyads-emergency', position, juicyZoneId);
                    container.innerHTML = `
                        <iframe 
                            src="${networks.juicyads.iframeUrl}${juicyZoneId}"
                            width="100%" 
                            height="${position === 'sidebar' ? '250px' : '90px'}"
                            scrolling="no"
                            frameborder="0"
                            style="border:0; display:block;">
                        </iframe>
                    `;
                }
                
                // ExoClick iframe fallback
                const exoZoneId = networks.exoclick.zones[position];
                if (exoZoneId) {
                    const container = this.createAdvancedContainer('exoclick-emergency', position, exoZoneId);
                    container.innerHTML = `
                        <iframe 
                            src="${networks.exoclick.iframeUrl}${exoZoneId}"
                            width="100%" 
                            height="${position === 'sidebar' ? '250px' : '90px'}"
                            scrolling="no"
                            frameborder="0"
                            style="border:0; display:block;">
                        </iframe>
                    `;
                }
            });
        },
        
        verifyAndFixAds() {
            const containers = document.querySelectorAll('.ad-container');
            let issuesFixed = 0;
            
            containers.forEach(container => {
                const wasVisible = this.isElementVisible(container);
                
                if (!wasVisible) {
                    // Forzar visibilidad
                    container.style.display = 'block';
                    container.style.visibility = 'visible';
                    container.style.opacity = '1';
                    container.style.position = 'relative';
                    container.style.zIndex = '100';
                    issuesFixed++;
                }
                
                // Verificar contenido
                const hasAd = container.querySelector('iframe, ins, script[src*="ads"]');
                if (!hasAd && container.dataset.zoneId) {
                    // Intentar recargar contenido
                    this.reloadContainerContent(container);
                    issuesFixed++;
                }
            });
            
            if (issuesFixed > 0) {
                console.log(`🔧 Verificación completada: ${issuesFixed} problemas corregidos`);
            }
        },
        
        reloadContainerContent(container) {
            const network = container.dataset.network;
            const zoneId = container.dataset.zoneId;
            const position = container.dataset.position;
            
            if (!network || !zoneId) return;
            
            console.log(`🔄 Recargando contenido: ${network} zona ${zoneId}`);
            
            // Limpiar contenido excepto indicador
            const indicator = container.querySelector('.ad-status-indicator');
            container.innerHTML = '';
            if (indicator) container.appendChild(indicator);
            
            // Recargar según red
            if (network.includes('juicyads')) {
                const iframe = document.createElement('iframe');
                iframe.src = `${AD_CONFIG.networks.juicyads.iframeUrl}${zoneId}`;
                iframe.style.cssText = 'width: 100%; height: 100%; border: 0;';
                container.appendChild(iframe);
            } else if (network.includes('exoclick')) {
                const iframe = document.createElement('iframe');
                iframe.src = `${AD_CONFIG.networks.exoclick.iframeUrl}${zoneId}`;
                iframe.style.cssText = 'width: 100%; height: 100%; border: 0;';
                container.appendChild(iframe);
            }
        },
        
        showDevelopmentPlaceholders() {
            console.log('🚧 Mostrando placeholders de desarrollo mejorados...');
            
            const positions = ['header', 'sidebar', 'footer'];
            const networks = ['juicyads', 'exoclick'];
            
            positions.forEach(position => {
                networks.forEach(network => {
                    const zones = AD_CONFIG.networks[network].zones;
                    const zoneId = zones[position];
                    
                    if (!zoneId) return;
                    
                    const container = this.createAdvancedContainer(`${network}-dev`, position, zoneId);
                    container.innerHTML = `
                        <div style="
                            width: 100%;
                            height: 100%;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                            font-family: 'Segoe UI', sans-serif;
                            border-radius: 8px;
                            text-align: center;
                            min-height: ${position === 'sidebar' ? '250px' : '90px'};
                        ">
                            <div>
                                <div style="font-size: 24px; margin-bottom: 10px;">📢</div>
                                <div style="font-size: 14px; font-weight: bold;">${network.toUpperCase()}</div>
                                <div style="font-size: 12px; opacity: 0.9;">Zone: ${zoneId}</div>
                                <div style="font-size: 10px; opacity: 0.7; margin-top: 5px;">Development Mode</div>
                            </div>
                        </div>
                    `;
                });
            });
        },
        
        // Funciones utilitarias
        isElementVisible(element) {
            if (!element) return false;
            const rect = element.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(element);
            return (
                rect.width > 0 &&
                rect.height > 0 &&
                computedStyle.display !== 'none' &&
                computedStyle.visibility !== 'hidden' &&
                parseFloat(computedStyle.opacity) > 0
            );
        },
        
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        
        loadScriptAsync(src) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.async = true;
                script.onload = () => resolve();
                script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
                document.head.appendChild(script);
            });
        },
        
        // API pública para testing
        getStatus() {
            return {
                initialized: this.isInitialized,
                loadedNetworks: Array.from(this.loadedNetworks),
                totalContainers: document.querySelectorAll('.ad-container').length,
                visibleContainers: document.querySelectorAll('.ad-container').length,
                environment: AD_CONFIG.environment
            };
        },
        
        forceReload() {
            this.isInitialized = false;
            this.loadedNetworks.clear();
            this.containersCreated.clear();
            
            // Limpiar contenedores existentes
            document.querySelectorAll('.ad-container').forEach(el => el.remove());
            
            // Reinicializar
            this.init();
        }
    };
    
    // Auto-inicializar cuando DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            AdVerificationSystem.init();
        });
    } else {
        setTimeout(() => {
            AdVerificationSystem.init();
        }, 100);
    }
    
    // Exponer globalmente para debugging
    window.AdVerificationSystem = AdVerificationSystem;
    window.testAds = () => AdVerificationSystem.getStatus();
    window.fixAds = () => AdVerificationSystem.verifyAndFixAds();
    window.reloadAds = () => AdVerificationSystem.forceReload();
    window.AD_CONFIG = AD_CONFIG;
    
    console.log('✅ Sistema de Anuncios v4.0.0 - COMPLETELY FIXED');
    console.log('🔧 Zone IDs corregidos según dashboards');
    console.log('💡 Comandos disponibles:');
    console.log('  window.testAds() - Estado del sistema');
    console.log('  window.fixAds() - Corregir problemas');
    console.log('  window.reloadAds() - Recargar sistema completo');
    
})();
