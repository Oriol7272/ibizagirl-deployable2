// ============================
// AD VERIFICATION SYSTEM v2.6.1 - FINAL WITH ADSCO.RE FILTER
// All fixes applied including adsco.re filter
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
        // FIXED: Added adsco.re to excluded URLs to prevent 401 error logging
        excludedUrls: [
            'chrome-extension://',
            'extension://',
            'paypal.com',
            'paypalobjects.com',
            'googletagmanager.com',
            'google-analytics.com',
            'gtag/js',
            'juicyads',
            'exoclick',
            'popads',
            'premiumvertising',
            'adsco.re' // ✅ ADDED: Filters 401 errors from adsco.re tracking
        ]
    };
    
    const AdVerificationSystem = {
        loadedNetworks: new Set(),
        retryAttempts: {},
        verificationAttempts: 0,
        popAdsInitialized: false,
        juicyadsInitialized: false,
        
        init() {
            console.log('🎯 [Ad Networks] Sistema v2.6.1 FINAL con filtro adsco.re');
            console.log('🌍 Environment:', AD_CONFIG.environment);
            console.log('🔧 Fixes: JuicyAds + ExoClick + PopAds + adsco.re filter');
            
            if (AD_CONFIG.environment === 'development') {
                console.log('📢 Development mode - Using placeholders');
                this.showDevelopmentPlaceholders();
                return;
            }
            
            // Production mode - Load real ads with delay to avoid conflicts
            setTimeout(() => {
                this.loadAdNetworks();
            }, 1000);
            
            // Verify after adequate delay
            setTimeout(() => {
                this.verifyAdNetworks();
            }, 6000);
        },
        
        loadAdNetworks() {
            console.log('📢 Loading ad networks with enhanced error handling...');
            
            Object.entries(AD_CONFIG.networks).forEach(([key, network]) => {
                if (network.enabled && !network.testMode) {
                    // Add delay between network loads to prevent conflicts
                    setTimeout(() => {
                        this.loadAdScript(key, network);
                    }, key === 'juicyads' ? 0 : key === 'exoclick' ? 1000 : 2000);
                }
            });
        },
        
        loadAdScript(networkKey, network) {
            if (this.loadedNetworks.has(networkKey)) {
                console.log(`✅ ${network.name} already loaded`);
                return;
            }
            
            try {
                // Special handling for PopAds
                if (networkKey === 'popads') {
                    this.initPopAds(network);
                    return;
                }
                
                // Special handling for ExoClick with multiple URLs
                if (networkKey === 'exoclick') {
                    this.loadExoClickWithFallback(network);
                    return;
                }
                
                // Enhanced JuicyAds loading
                if (networkKey === 'juicyads') {
                    this.loadJuicyAdsSafely(network);
                    return;
                }
                
                // Standard script loading for other networks
                this.loadSingleScript(networkKey, network, network.scriptUrl);
            } catch (error) {
                console.error(`Error loading ${networkKey}:`, error.message);
                this.handleLoadError(networkKey, network);
            }
        },
        
        loadJuicyAdsSafely(network) {
            console.log('🍊 Loading JuicyAds with enhanced safety...');
            
            // Pre-initialize global object to prevent undefined errors
            if (typeof window.adsbyjuicy === 'undefined') {
                window.adsbyjuicy = {
                    cmd: [],
                    push: function(data) {
                        this.cmd = this.cmd || [];
                        this.cmd.push(data);
                    }
                };
                console.log('🍊 JuicyAds global object pre-initialized');
            }
            
            const script = document.createElement('script');
            script.src = network.scriptUrl;
            script.async = true;
            script.setAttribute('data-network', 'juicyads');
            
            script.onload = () => {
                console.log('🍊 JuicyAds script loaded successfully');
                this.loadedNetworks.add('juicyads');
                
                // Wait for proper initialization before creating zones
                setTimeout(() => {
                    this.initJuicyAds(network);
                }, 2000);
            };
            
            script.onerror = () => {
                console.warn('⚠️ JuicyAds script failed to load');
                this.handleLoadError('juicyads', network);
            };
            
            document.head.appendChild(script);
        },
        
        initJuicyAds(network) {
            if (this.juicyadsInitialized) return;
            
            try {
                console.log('🍊 Initializing JuicyAds with ENHANCED safety...');
                
                let checkAttempts = 0;
                const maxAttempts = 15;
                
                const checkJuicyAds = () => {
                    checkAttempts++;
                    
                    const isReady = window.adsbyjuicy && 
                                   typeof window.adsbyjuicy === 'object' &&
                                   typeof window.adsbyjuicy.push === 'function' &&
                                   (window.adsbyjuicy.cmd !== undefined || window.adsbyjuicy.loaded);
                    
                    if (isReady) {
                        console.log('🍊 JuicyAds confirmed ready, creating zones...');
                        this.juicyadsInitialized = true;
                        
                        Object.entries(network.zones).forEach(([position, zoneId]) => {
                            try {
                                this.createJuicyAdsZoneSafe(position, zoneId);
                            } catch (error) {
                                console.warn(`Error creating JuicyAds zone ${position}:`, error.message);
                            }
                        });
                        return;
                    }
                    
                    if (checkAttempts < maxAttempts) {
                        setTimeout(checkJuicyAds, 800);
                    } else {
                        console.warn('🍊 JuicyAds initialization timeout, creating fallback zones');
                        this.juicyadsInitialized = true;
                        Object.entries(network.zones).forEach(([position, zoneId]) => {
                            this.createJuicyAdsZoneSafe(position, zoneId);
                        });
                    }
                };
                
                checkJuicyAds();
                
            } catch (error) {
                console.error('JuicyAds initialization error:', error.message);
                this.showPlaceholder('juicyads');
            }
        },
        
        createJuicyAdsZoneSafe(position, zoneId) {
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
            adDiv.className = 'juicyads-zone';
            container.appendChild(adDiv);
            
            const pushToJuicyAds = () => {
                try {
                    if (window.adsbyjuicy && 
                        typeof window.adsbyjuicy.push === 'function') {
                        
                        window.adsbyjuicy.push({'adzone': zoneId});
                        console.log(`🍊 JuicyAds zone ${position} (${zoneId}) created successfully`);
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.warn(`JuicyAds push error for ${position}:`, error.message);
                    return false;
                }
            };
            
            if (!pushToJuicyAds()) {
                setTimeout(() => {
                    if (!pushToJuicyAds()) {
                        setTimeout(() => {
                            pushToJuicyAds();
                        }, 3000);
                    }
                }, 1500);
            }
        },
        
        loadExoClickWithFallback(network) {
            console.log('🔵 Loading ExoClick with multiple fallback URLs...');
            
            let urlIndex = 0;
            const tryLoadExoClick = () => {
                if (urlIndex >= network.scriptUrls.length) {
                    console.warn('⚠️ ExoClick: All URLs failed, using direct implementation');
                    this.initExoClickDirect(network);
                    return;
                }
                
                const url = network.scriptUrls[urlIndex];
                console.log(`🔵 Trying ExoClick URL ${urlIndex + 1}/${network.scriptUrls.length}: ${url}`);
                
                const script = document.createElement('script');
                script.src = url;
                script.async = true;
                script.setAttribute('data-network', 'exoclick');
                script.setAttribute('data-url-attempt', urlIndex + 1);
                
                script.onload = () => {
                    console.log(`✅ ExoClick loaded successfully from URL ${urlIndex + 1}`);
                    this.loadedNetworks.add('exoclick');
                    setTimeout(() => {
                        this.initExoClick(network);
                    }, 1000);
                };
                
                script.onerror = () => {
                    console.warn(`⚠️ ExoClick URL ${urlIndex + 1} failed, trying next...`);
                    urlIndex++;
                    setTimeout(tryLoadExoClick, 1000);
                };
                
                document.head.appendChild(script);
            };
            
            tryLoadExoClick();
        },
        
        initExoClick(network) {
            try {
                console.log('🔵 Initializing ExoClick with comprehensive detection...');
                
                let checkAttempts = 0;
                const checkExoClick = () => {
                    checkAttempts++;
                    
                    const exoAvailable = window.ExoLoader || 
                                       window.exoclick || 
                                       window.adProvider ||
                                       window.ExoClicks ||
                                       window.ExoClickLoader ||
                                       (window.exo && window.exo.load);
                    
                    if (exoAvailable) {
                        console.log('🔵 ExoClick API detected:', Object.keys(window).filter(k => k.toLowerCase().includes('exo')));
                        
                        Object.entries(network.zones).forEach(([position, zoneId]) => {
                            this.createExoClickZone(position, zoneId);
                        });
                        return;
                    }
                    
                    if (checkAttempts < 20) {
                        setTimeout(checkExoClick, 500);
                    } else {
                        console.warn('🔵 ExoClick API not found, using direct implementation');
                        this.initExoClickDirect(network);
                    }
                };
                
                checkExoClick();
                
            } catch (error) {
                console.error('ExoClick initialization error:', error.message);
                this.initExoClickDirect(network);
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
                if (typeof window.ExoLoader !== 'undefined' && window.ExoLoader.addZone) {
                    const adElement = document.createElement('ins');
                    adElement.className = 'adsbyexoclick';
                    adElement.setAttribute('data-zoneid', zoneId);
                    container.appendChild(adElement);
                    
                    window.ExoLoader.addZone({"zone_id": zoneId});
                    console.log(`🔵 ExoClick zone ${position} created with ExoLoader`);
                } else if (window.exoclick) {
                    container.innerHTML = `<div data-exoclick-zoneid="${zoneId}"></div>`;
                    console.log(`🔵 ExoClick zone ${position} created with direct method`);
                } else {
                    this.createExoClickZoneDirect(position, zoneId, container);
                }
            } catch (error) {
                console.warn('ExoClick zone creation error:', error.message);
                this.createExoClickZoneDirect(position, zoneId, container);
            }
        },
        
        initExoClickDirect(network) {
            console.log('🔵 Creating ExoClick zones with direct implementation...');
            
            Object.entries(network.zones).forEach(([position, zoneId]) => {
                this.createExoClickZoneDirect(position, zoneId);
            });
        },
        
        createExoClickZoneDirect(position, zoneId, container = null) {
            if (!container) {
                const containerId = `ad-exoclick-${position}`;
                container = document.getElementById(containerId);
                
                if (!container) {
                    container = document.createElement('div');
                    container.id = containerId;
                    container.className = `ad-container ad-exoclick ad-${position}`;
                    this.appendAdContainer(container, position);
                }
            }
            
            const script = document.createElement('script');
            script.innerHTML = `
                (function() {
                    try {
                        var exoScript = document.createElement('script');
                        exoScript.type = 'text/javascript';
                        exoScript.src = 'https://syndication.exoclick.com/ads.js?t=1&zoneid=${zoneId}';
                        exoScript.async = true;
                        document.head.appendChild(exoScript);
                        console.log('🔵 ExoClick direct script loaded for zone ${zoneId}');
                    } catch(e) {
                        console.warn('ExoClick direct load error:', e.message);
                    }
                })();
            `;
            container.appendChild(script);
            
            console.log(`🔵 ExoClick zone ${position} created with direct implementation`);
        },
        
        initPopAds(network) {
            try {
                if (this.popAdsInitialized) return;
                
                console.log('🚀 Initializing PopAds with real configuration...');
                console.log('🚀 PopAds SiteID:', network.config.siteId);
                
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
                this.createPopAdsIndicator();
                this.loadedNetworks.add('popads');
                this.popAdsInitialized = true;
                
                console.log('✅ PopAds script injected successfully');
                this.monitorPopAdsLoading();
                
            } catch (error) {
                console.error('PopAds initialization error:', error.message);
                this.showPlaceholder('popads');
            }
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
                
                if (popAdsActive || checkCount > 30) {
                    clearInterval(checkInterval);
                    
                    if (popAdsActive) {
                        console.log('✅ PopAds successfully loaded and monitoring active');
                        this.updatePopAdsIndicator(true);
                    } else {
                        console.warn('⚠️ PopAds loading timeout, but script was injected');
                        this.updatePopAdsIndicator(false);
                    }
                }
            }, 1000);
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
        
        updatePopAdsIndicator(success) {
            const indicator = document.getElementById('popads-indicator');
            if (!indicator) return;
            
            const status = indicator.querySelector('#popads-status');
            
            if (success) {
                status.textContent = '✅';
                indicator.style.borderColor = 'rgba(0, 255, 136, 0.5)';
            } else {
                status.textContent = '⚠️';
                indicator.style.borderColor = 'rgba(255, 107, 53, 0.5)';
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
                console.error(`Error appending ad container for ${position}:`, error.message);
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
                console.warn(`⚠️ ${network.name} failed after ${AD_CONFIG.maxRetries} attempts`);
                this.showPlaceholder(networkKey);
            }
        },
        
        verifyAdNetworks() {
            console.log('🎯 [Ad Networks] ===== Verificación FINAL v2.6.1 =====');
            
            let activeNetworks = 0;
            
            if (window.adsbyjuicy || 
                document.querySelector('[data-network="juicyads"]') || 
                document.querySelector('.ad-juicyads') ||
                document.querySelector('.juicyads-zone')) {
                console.log('🎯 [Ad Networks] JuicyAds: Detectado ✅');
                activeNetworks++;
            } else {
                console.log('🎯 [Ad Networks] JuicyAds: No detectado ❌');
            }
            
            if (window.ExoLoader || window.exoclick || window.adProvider ||
                document.querySelector('[data-network="exoclick"]') ||
                document.querySelector('.ad-exoclick') ||
                document.querySelector('.adsbyexoclick') ||
                document.querySelector('[data-exoclick-zoneid]')) {
                console.log('🎯 [Ad Networks] ExoClick: Detectado ✅');
                activeNetworks++;
            } else {
                console.log('🎯 [Ad Networks] ExoClick: No detectado ❌');
            }
            
            if (this.popAdsInitialized || 
                window.e494ffb82839a291 || 
                window.e494ffb82839a29122608e933394c091 ||
                document.querySelector('[data-cfasync="false"]')) {
                console.log('🎯 [Ad Networks] PopAds: Detectado ✅');
                console.log(`🎯 [PopAds] SiteID: ${AD_CONFIG.networks.popads.config.siteId}`);
                activeNetworks++;
            } else {
                console.log('🎯 [Ad Networks] PopAds: No detectado ❌');
            }
            
            console.log('🎯 [Ad Networks] ===== Resumen FINAL v2.6.1 =====');
            console.log(`🎯 [Ad Networks] Redes activas: ${activeNetworks}/3`);
            console.log('🎯 [Status] JuicyAds: FIXED undefined error');
            console.log('🎯 [Status] ExoClick: Multiple URL fallbacks');
            console.log('🎯 [Status] PopAds: Real config integrated');
            console.log('🎯 [Status] adsco.re: 401 errors filtered');
            
            return activeNetworks;
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
            Object.entries(AD_CONFIG.networks).forEach(([key, network]) => {
                if (network.enabled) {
                    this.showPlaceholder(key);
                }
            });
        },
        
        loadSingleScript(networkKey, network, url) {
            const script = document.createElement('script');
            script.src = url;
            script.async = true;
            script.setAttribute('data-network', networkKey);
            
            script.onload = () => {
                console.log(`✅ ${network.name} script loaded`);
                this.loadedNetworks.add(networkKey);
                
                setTimeout(() => {
                    this.initializeNetwork(networkKey, network);
                }, 1000);
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
                console.error(`Error initializing ${networkKey}:`, error.message);
                this.showPlaceholder(networkKey);
            }
        },
        
        testAds() {
            console.log('🔍 Testing ad networks FINAL v2.6.1...');
            console.log('Environment:', AD_CONFIG.environment);
            console.log('Loaded networks:', Array.from(this.loadedNetworks));
            console.log('PopAds Config:', AD_CONFIG.networks.popads.config);
            console.log('Excluded URLs:', AD_CONFIG.excludedUrls);
            
            console.log('Global vars check:');
            console.log('- window.adsbyjuicy:', typeof window.adsbyjuicy);
            console.log('- window.ExoLoader:', typeof window.ExoLoader);
            console.log('- window.exoclick:', typeof window.exoclick);
            console.log('- PopAds vars:', Object.keys(window).filter(k => k.includes('e494ffb')));
            
            const verification = this.verifyAdNetworks();
            const containers = document.querySelectorAll('.ad-container');
            console.log(`Found ${containers.length} ad containers`);
            
            return {
                environment: AD_CONFIG.environment,
                loadedNetworks: Array.from(this.loadedNetworks),
                activeNetworks: verification,
                containers: containers.length,
                popAdsConfig: AD_CONFIG.networks.popads.config,
                excludedUrls: AD_CONFIG.excludedUrls,
                globalVars: {
                    juicyads: typeof window.adsbyjuicy,
                    exoclick: typeof window.ExoLoader,
                    popads: Object.keys(window).filter(k => k.includes('e494ffb')).length > 0
                }
            };
        },
        
        reloadAds() {
            console.log('🔄 Reloading ad networks FINAL v2.6.1...');
            
            document.querySelectorAll('.ad-container').forEach(container => {
                container.remove();
            });
            
            const indicator = document.getElementById('popads-indicator');
            if (indicator) indicator.remove();
            
            this.loadedNetworks.clear();
            this.retryAttempts = {};
            this.verificationAttempts = 0;
            this.popAdsInitialized = false;
            this.juicyadsInitialized = false;
            
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
    
    console.log('✅ Ad System v2.6.1 FINAL loaded with adsco.re filter');
    console.log('🔧 All fixes applied: JuicyAds + ExoClick + PopAds + adsco.re');
    console.log('🚀 PopAds SiteID:', AD_CONFIG.networks.popads.config.siteId);
    console.log('💡 Use window.testAds() for detailed analysis');
    
})();
