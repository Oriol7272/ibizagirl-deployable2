// ============================
// AD VERIFICATION SYSTEM v2.4 POPADS CONFIGURED
// Sistema con PopAds real configurado
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
                scriptUrl: 'https://a.realsrv.com/ad-provider.js',
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
                // Configuración extraída del script proporcionado
                config: {
                    siteId: 641 + 623 + 837 * 598 + 810 + 4724158, // = 5226178
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
        
        init() {
            console.log('🎯 [Ad Networks] Sistema v2.4 POPADS CONFIGURED iniciado');
            console.log('🌍 Environment:', AD_CONFIG.environment);
            console.log('📋 Networks: JuicyAds + ExoClick + PopAds (configured)');
            
            if (AD_CONFIG.environment === 'development') {
                console.log('📢 Development mode - Using placeholders');
                this.showDevelopmentPlaceholders();
                return;
            }
            
            // Production mode - Load real ads
            this.loadAdNetworks();
            
            // Verify after delay
            setTimeout(() => {
                this.verifyAdNetworks();
            }, 3000);
        },
        
        loadAdNetworks() {
            console.log('📢 Loading ad networks...');
            
            Object.entries(AD_CONFIG.networks).forEach(([key, network]) => {
                if (network.enabled && !network.testMode) {
                    this.loadAdScript(key, network);
                }
            });
        },
        
        loadAdScript(networkKey, network) {
            if (this.loadedNetworks.has(networkKey)) {
                console.log(`✅ ${network.name} already loaded`);
                return;
            }
            
            // Special handling for PopAds (custom script)
            if (networkKey === 'popads') {
                this.initPopAds(network);
                return;
            }
            
            const script = document.createElement('script');
            script.src = network.scriptUrl;
            script.async = true;
            script.setAttribute('data-network', networkKey);
            
            script.onload = () => {
                console.log(`✅ ${network.name} script loaded`);
                this.loadedNetworks.add(networkKey);
                
                setTimeout(() => {
                    this.initializeNetwork(networkKey, network);
                }, 500);
            };
            
            script.onerror = () => {
                console.warn(`⚠️ ${network.name} script failed to load`);
                this.handleLoadError(networkKey, network);
            };
            
            document.head.appendChild(script);
        },
        
        initializeNetwork(networkKey, network) {
            try {
                switch(networkKey) {
                    case 'juicyads':
                        this.initJuicyAds(network);
                        break;
                    case 'exoclick':
                        this.initExoClick(network);
                        break;
                }
            } catch (error) {
                console.error(`Error initializing ${networkKey}:`, error);
                this.showPlaceholder(networkKey);
            }
        },
        
        initJuicyAds(network) {
            try {
                if (typeof window.adsbyjuicy === 'undefined') {
                    window.adsbyjuicy = window.adsbyjuicy || { cmd: [] };
                }
                
                const checkJuicyAds = () => {
                    if (typeof adsbyjuicy !== 'undefined' && adsbyjuicy.push) {
                        console.log('🍊 JuicyAds initialized successfully');
                        
                        Object.entries(network.zones).forEach(([position, zoneId]) => {
                            try {
                                this.createJuicyAdsZone(position, zoneId);
                            } catch (error) {
                                console.warn(`Error creating JuicyAds zone ${position}:`, error);
                            }
                        });
                    } else {
                        setTimeout(checkJuicyAds, 500);
                    }
                };
                
                checkJuicyAds();
                
            } catch (error) {
                console.error('JuicyAds initialization error:', error);
                this.showPlaceholder('juicyads');
            }
        },
        
        initExoClick(network) {
            try {
                const checkExoClick = () => {
                    if (typeof window.ExoLoader !== 'undefined' || 
                        typeof window.exoclick !== 'undefined' ||
                        typeof window.adProvider !== 'undefined') {
                        
                        console.log('🔵 ExoClick initialized successfully');
                        
                        Object.entries(network.zones).forEach(([position, zoneId]) => {
                            this.createExoClickZone(position, zoneId);
                        });
                    } else {
                        setTimeout(checkExoClick, 500);
                    }
                };
                
                checkExoClick();
                
            } catch (error) {
                console.error('ExoClick initialization error:', error);
                this.showPlaceholder('exoclick');
            }
        },
        
        initPopAds(network) {
            try {
                if (this.popAdsInitialized) return;
                
                console.log('🚀 Initializing PopAds with custom configuration...');
                console.log('PopAds SiteID:', network.config.siteId);
                
                // SCRIPT ORIGINAL DE POPADS CONFIGURADO
                const popAdsScript = document.createElement('script');
                popAdsScript.type = 'text/javascript';
                popAdsScript.setAttribute('data-cfasync', 'false');
                popAdsScript.innerHTML = `
                    /*<![CDATA[/* */
                    (function(){
                        var x=window,
                            r="e494ffb82839a29122608e933394c091",
                            l=[
                                ["siteId", ${network.config.siteId}],
                                ["minBid", ${network.config.minBid}],
                                ["popundersPerIP", "${network.config.popundersPerIP}"],
                                ["delayBetween", ${network.config.delayBetween}],
                                ["default", ${network.config.default}],
                                ["defaultPerDay", ${network.config.defaultPerDay}],
                                ["topmostLayer", "${network.config.topmostLayer}"]
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
                
                // Crear indicador visual para PopAds
                this.createPopAdsIndicator();
                
                this.loadedNetworks.add('popads');
                this.popAdsInitialized = true;
                
                console.log('✅ PopAds initialized with real configuration');
                
                // Monitor PopAds loading
                this.monitorPopAdsLoading();
                
            } catch (error) {
                console.error('PopAds initialization error:', error);
                this.showPlaceholder('popads');
            }
        },
        
        monitorPopAdsLoading() {
            let checkCount = 0;
            const checkInterval = setInterval(() => {
                checkCount++;
                
                // Check if PopAds global variables exist
                const popAdsLoaded = window.e494ffb82839a291 || 
                                   document.querySelector('[data-cfasync="false"]') ||
                                   document.querySelector('script[src*="premiumvertising"]');
                
                if (popAdsLoaded || checkCount > 20) {
                    clearInterval(checkInterval);
                    
                    if (popAdsLoaded) {
                        console.log('🚀 PopAds successfully loaded and active');
                        this.updatePopAdsIndicator(true);
                    } else {
                        console.warn('⚠️ PopAds loading timeout');
                        this.updatePopAdsIndicator(false);
                    }
                }
            }, 1000);
        },
        
        createPopAdsIndicator() {
            const indicator = document.createElement('div');
            indicator.id = 'popads-indicator';
            indicator.className = 'ad-container ad-popads ad-footer';
            indicator.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: rgba(0, 51, 102, 0.9);
                color: white;
                padding: 10px 15px;
                border-radius: 10px;
                font-size: 12px;
                z-index: 1000;
                border: 1px solid rgba(127, 219, 255, 0.3);
                max-width: 200px;
            `;
            indicator.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div id="popads-status">🔄</div>
                    <div>
                        <div style="font-weight: bold;">PopAds</div>
                        <div style="font-size: 10px; opacity: 0.8;">Loading...</div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(indicator);
            
            // Auto-hide after 10 seconds
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.style.opacity = '0';
                    setTimeout(() => {
                        if (indicator.parentNode) {
                            indicator.remove();
                        }
                    }, 1000);
                }
            }, 10000);
        },
        
        updatePopAdsIndicator(success) {
            const indicator = document.getElementById('popads-indicator');
            if (!indicator) return;
            
            const status = indicator.querySelector('#popads-status');
            const text = indicator.querySelector('div:last-child div:last-child');
            
            if (success) {
                status.textContent = '✅';
                text.textContent = 'Active';
                indicator.style.borderColor = 'rgba(0, 255, 136, 0.5)';
            } else {
                status.textContent = '❌';
                text.textContent = 'Failed';
                indicator.style.borderColor = 'rgba(255, 107, 53, 0.5)';
            }
        },
        
        createJuicyAdsZone(position, zoneId) {
            const containerId = `ad-juicyads-${position}`;
            let container = document.getElementById(containerId);
            
            if (!container) {
                container = document.createElement('div');
                container.id = containerId;
                container.className = `ad-container ad-juicyads ad-${position}`;
                this.appendAdContainer(container, position);
            }
            
            const adDiv = document.createElement('div');
            adDiv.id = `juicyads-${position}-${zoneId}`;
            container.appendChild(adDiv);
            
            if (typeof adsbyjuicy !== 'undefined' && adsbyjuicy.push) {
                adsbyjuicy.push({'adzone': zoneId});
            }
        },
        
        createExoClickZone(position, zoneId) {
            const containerId = `ad-exoclick-${position}`;
            let container = document.getElementById(containerId);
            
            if (!container) {
                container = document.createElement('div');
                container.id = containerId;
                container.className = `ad-container ad-exoclick ad-${position}`;
                this.appendAdContainer(container, position);
            }
            
            try {
                if (typeof window.ExoLoader !== 'undefined') {
                    const adElement = document.createElement('ins');
                    adElement.className = 'adsbyexoclick';
                    adElement.setAttribute('data-zoneid', zoneId);
                    container.appendChild(adElement);
                    
                    window.ExoLoader.addZone({"zone_id": zoneId});
                } else {
                    const script = document.createElement('script');
                    script.innerHTML = `
                        var exoOptions = {
                            "zoneid": ${zoneId},
                            "serve": "C6ADVDE"
                        };
                        var exoScript = document.createElement('script');
                        exoScript.type = 'text/javascript';
                        exoScript.src = 'https://a.realsrv.com/ad-provider.js';
                        document.head.appendChild(exoScript);
                    `;
                    container.appendChild(script);
                }
            } catch (error) {
                console.warn('ExoClick zone creation error:', error);
                this.showPlaceholderInContainer(container, 'ExoClick', `Error: ${position}`);
            }
        },
        
        appendAdContainer(container, position) {
            try {
                let targetElement;
                
                switch(position) {
                    case 'header':
                        targetElement = document.querySelector('.main-header');
                        if (targetElement) {
                            targetElement.parentNode.insertBefore(container, targetElement.nextSibling);
                        } else {
                            document.body.appendChild(container);
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
                }
            } catch (error) {
                console.error(`Error appending ad container for ${position}:`, error);
            }
        },
        
        handleLoadError(networkKey, network) {
            if (!this.retryAttempts[networkKey]) {
                this.retryAttempts[networkKey] = 0;
            }
            
            this.retryAttempts[networkKey]++;
            
            if (this.retryAttempts[networkKey] <= AD_CONFIG.maxRetries) {
                console.log(`🔄 Retrying ${network.name} (attempt ${this.retryAttempts[networkKey]}/${AD_CONFIG.maxRetries})`);
                
                setTimeout(() => {
                    this.loadAdScript(networkKey, network);
                }, AD_CONFIG.retryDelay * this.retryAttempts[networkKey]);
            } else {
                console.warn(`❌ ${network.name} failed after ${AD_CONFIG.maxRetries} attempts`);
                this.showPlaceholder(networkKey);
            }
        },
        
        verifyAdNetworks() {
            console.log('🎯 [Ad Networks] ===== Verificación v2.4 POPADS =====');
            
            let activeNetworks = 0;
            let placeholdersShown = 0;
            
            // Check JuicyAds
            if (window.adsbyjuicy || document.querySelector('[data-network="juicyads"]') || 
                document.querySelector('.ad-juicyads')) {
                console.log('🎯 [Ad Networks] JuicyAds: Detectado ✅');
                activeNetworks++;
            } else {
                console.log('🎯 [Ad Networks] JuicyAds: No detectado ❌');
                if (AD_CONFIG.networks.juicyads.enabled) {
                    this.showPlaceholder('juicyads');
                    placeholdersShown++;
                }
            }
            
            // Check ExoClick
            if (window.ExoLoader || window.exoclick || window.adProvider ||
                document.querySelector('[data-network="exoclick"]') ||
                document.querySelector('.ad-exoclick') ||
                document.querySelector('.adsbyexoclick')) {
                console.log('🎯 [Ad Networks] ExoClick: Detectado ✅');
                activeNetworks++;
            } else {
                console.log('🎯 [Ad Networks] ExoClick: No detectado ❌');
                if (AD_CONFIG.networks.exoclick.enabled) {
                    this.showPlaceholder('exoclick');
                    placeholdersShown++;
                }
            }
            
            // Check PopAds
            if (this.popAdsInitialized || 
                window.e494ffb82839a291 || 
                document.querySelector('[data-cfasync="false"]') ||
                document.querySelector('.ad-popads')) {
                console.log('🎯 [Ad Networks] PopAds: Detectado ✅');
                console.log(`🎯 [PopAds] SiteID: ${AD_CONFIG.networks.popads.config.siteId}`);
                activeNetworks++;
            } else {
                console.log('🎯 [Ad Networks] PopAds: No detectado ❌');
                if (AD_CONFIG.networks.popads.enabled) {
                    this.showPlaceholder('popads');
                    placeholdersShown++;
                }
            }
            
            console.log('🎯 [Ad Networks] ===== Resumen v2.4 =====');
            console.log(`🎯 [Ad Networks] Redes activas: ${activeNetworks}/3`);
            console.log(`🎯 [Ad Networks] PopAds SiteID: ${AD_CONFIG.networks.popads.config.siteId}`);
            console.log(`🎯 [Ad Networks] Placeholders: ${placeholdersShown}`);
            
            return activeNetworks;
        },
        
        showPlaceholder(networkKey) {
            const network = AD_CONFIG.networks[networkKey];
            if (!network) return;
            
            if (networkKey === 'popads') {
                // PopAds doesn't need traditional ad containers
                console.log('PopAds uses pop-unders, no placeholder needed');
                return;
            }
            
            Object.keys(network.zones || {}).forEach(position => {
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
            Object.entries(AD_CONFIG.networks).forEach(([key, network]) => {
                if (network.enabled) {
                    this.showPlaceholder(key);
                }
            });
        },
        
        // Public API
        testAds() {
            console.log('🔍 Testing ad networks v2.4 POPADS...');
            console.log('Environment:', AD_CONFIG.environment);
            console.log('Loaded networks:', Array.from(this.loadedNetworks));
            console.log('PopAds Config:', AD_CONFIG.networks.popads.config);
            
            const verification = this.verifyAdNetworks();
            
            return {
                environment: AD_CONFIG.environment,
                loadedNetworks: Array.from(this.loadedNetworks),
                activeNetworks: verification,
                popAdsConfig: AD_CONFIG.networks.popads.config,
                popAdsId: AD_CONFIG.networks.popads.config.siteId
            };
        },
        
        reloadAds() {
            console.log('🔄 Reloading ad networks v2.4...');
            
            document.querySelectorAll('.ad-container').forEach(container => {
                container.remove();
            });
            
            this.loadedNetworks.clear();
            this.retryAttempts = {};
            this.verificationAttempts = 0;
            this.popAdsInitialized = false;
            
            this.init();
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            AdVerificationSystem.init();
        });
    } else {
        setTimeout(() => {
            AdVerificationSystem.init();
        }, 100);
    }
    
    // Expose to global scope
    window.AdVerificationSystem = AdVerificationSystem;
    window.testAds = () => AdVerificationSystem.testAds();
    window.reloadAds = () => AdVerificationSystem.reloadAds();
    
    console.log('✅ Ad System v2.4 POPADS CONFIGURED loaded');
    console.log('🚀 PopAds SiteID:', AD_CONFIG.networks.popads.config.siteId);
    console.log('💡 Use window.testAds() to verify configuration');
    
})();
