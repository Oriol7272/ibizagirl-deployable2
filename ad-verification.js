// ============================
// AD VERIFICATION SYSTEM v2.3 FINAL FIX
// ExoClick corregido + PopAds reemplaza EroAdvertising
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
                enabled: true, // CORREGIDO
                name: 'ExoClick',
                scriptUrl: 'https://a.realsrv.com/ad-provider.js', // URL CORREGIDA
                zones: {
                    header: 5696328,
                    sidebar: 5696329,
                    footer: 5696330
                },
                testMode: false
            },
            popads: {
                enabled: true, // REEMPLAZA EroAdvertising
                name: 'PopAds',
                scriptUrl: 'https://c2.popads.media/pop.js',
                zones: {
                    pop_under: 4987321,
                    banner_header: 4987322,
                    banner_footer: 4987323
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
            console.log('🎯 [Ad Networks] Sistema v2.3 FINAL FIX iniciado');
            console.log('🌍 Environment:', AD_CONFIG.environment);
            console.log('📋 Networks: JuicyAds + ExoClick + PopAds (replaces EroAdvertising)');
            
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
            
            // Special handling for PopAds (no external script needed)
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
                    case 'popads':
                        this.initPopAds(network);
                        break;
                }
            } catch (error) {
                console.error(`Error initializing ${networkKey}:`, error);
                this.showPlaceholder(networkKey);
            }
        },
        
        initJuicyAds(network) {
            try {
                // Initialize JuicyAds global
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
                // CORREGIDO: Mejor inicialización de ExoClick
                const checkExoClick = () => {
                    // ExoClick puede usar diferentes nombres globales
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
                
                console.log('🚀 Initializing PopAds (replacing EroAdvertising)');
                
                // Create PopAds pop-under
                this.createPopAdsPopunder(network.zones.pop_under);
                
                // Create PopAds banner zones
                this.createPopAdsBanner('header', network.zones.banner_header);
                this.createPopAdsBanner('footer', network.zones.banner_footer);
                
                this.loadedNetworks.add('popads');
                this.popAdsInitialized = true;
                
                console.log('✅ PopAds initialized successfully');
                
            } catch (error) {
                console.error('PopAds initialization error:', error);
                this.showPlaceholder('popads');
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
            
            // JuicyAds implementation
            const adDiv = document.createElement('div');
            adDiv.id = `juicyads-${position}-${zoneId}`;
            container.appendChild(adDiv);
            
            // Push to JuicyAds
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
            
            // CORREGIDO: Múltiples métodos de ExoClick
            try {
                // Método 1: ExoLoader
                if (typeof window.ExoLoader !== 'undefined') {
                    const adElement = document.createElement('ins');
                    adElement.className = 'adsbyexoclick';
                    adElement.setAttribute('data-zoneid', zoneId);
                    container.appendChild(adElement);
                    
                    window.ExoLoader.addZone({"zone_id": zoneId});
                }
                // Método 2: Script directo
                else {
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
        
        createPopAdsPopunder(zoneId) {
            try {
                // PopAds pop-under implementation
                const popScript = document.createElement('script');
                popScript.innerHTML = `
                    (function() {
                        var popAdsConfig = {
                            enabled: true,
                            zoneId: '${zoneId}',
                            frequency: 1440, // minutes (24 hours)
                            delay: 10000 // 10 seconds
                        };
                        
                        function showPopAds() {
                            var lastPop = localStorage.getItem('popads_last_show');
                            var now = Date.now();
                            
                            if (lastPop && (now - parseInt(lastPop)) < (popAdsConfig.frequency * 60 * 1000)) {
                                return; // Don't show yet
                            }
                            
                            try {
                                var popup = window.open(
                                    'https://www.popads.media/pop/' + popAdsConfig.zoneId,
                                    '_blank',
                                    'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=1,height=1'
                                );
                                
                                if (popup) {
                                    popup.blur();
                                    window.focus();
                                    localStorage.setItem('popads_last_show', now.toString());
                                    console.log('🚀 PopAds pop-under shown');
                                }
                            } catch (e) {
                                console.warn('PopAds blocked:', e);
                            }
                        }
                        
                        // Show pop-under after delay
                        setTimeout(showPopAds, popAdsConfig.delay);
                        
                        // Also on click events
                        document.addEventListener('click', function() {
                            setTimeout(showPopAds, 1000);
                        }, { once: true });
                    })();
                `;
                document.head.appendChild(popScript);
                
            } catch (error) {
                console.error('PopAds pop-under error:', error);
            }
        },
        
        createPopAdsBanner(position, zoneId) {
            const containerId = `ad-popads-${position}`;
            let container = document.getElementById(containerId);
            
            if (!container) {
                container = document.createElement('div');
                container.id = containerId;
                container.className = `ad-container ad-popads ad-${position}`;
                this.appendAdContainer(container, position);
            }
            
            // PopAds banner implementation
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.popads.media/adframe.php?zid=${zoneId}`;
            iframe.width = position === 'header' || position === 'footer' ? '728' : '300';
            iframe.height = position === 'header' || position === 'footer' ? '90' : '250';
            iframe.frameBorder = '0';
            iframe.scrolling = 'no';
            iframe.style.border = 'none';
            
            container.appendChild(iframe);
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
            console.log('🎯 [Ad Networks] ===== Verificación de redes v2.3 =====');
            
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
            if (this.popAdsInitialized || document.querySelector('.ad-popads')) {
                console.log('🎯 [Ad Networks] PopAds: Detectado ✅');
                activeNetworks++;
            } else {
                console.log('🎯 [Ad Networks] PopAds: No detectado ❌');
                if (AD_CONFIG.networks.popads.enabled) {
                    this.showPlaceholder('popads');
                    placeholdersShown++;
                }
            }
            
            console.log('🎯 [Ad Networks] ===== Resumen v2.3 =====');
            console.log(`🎯 [Ad Networks] Redes activas: ${activeNetworks}/3`);
            console.log(`🎯 [Ad Networks] Placeholders: ${placeholdersShown}`);
            console.log('🎯 [Ad Networks] EroAdvertising → PopAds (migrado)');
            
            // Retry verification if needed
            if (activeNetworks === 0 && this.verificationAttempts < AD_CONFIG.maxRetries) {
                this.verificationAttempts++;
                console.log(`🎯 [Ad Networks] Reintento ${this.verificationAttempts}/${AD_CONFIG.maxRetries}...`);
                
                setTimeout(() => {
                    this.verifyAdNetworks();
                }, AD_CONFIG.retryDelay);
            }
            
            return activeNetworks;
        },
        
        showPlaceholder(networkKey) {
            const network = AD_CONFIG.networks[networkKey];
            if (!network) return;
            
            // For PopAds, show different zones
            if (networkKey === 'popads') {
                ['header', 'footer'].forEach(position => {
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
            } else {
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
            }
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
                    ${networkName === 'PopAds' ? 
                        '<div style="font-size: 10px; margin-top: 8px; opacity: 0.5;">Replaces EroAdvertising</div>' : 
                        '<div style="font-size: 10px; margin-top: 8px; opacity: 0.5;">Loading...</div>'
                    }
                </div>
            `;
        },
        
        showDevelopmentPlaceholders() {
            console.log('📢 Showing development placeholders...');
            
            Object.entries(AD_CONFIG.networks).forEach(([key, network]) => {
                if (network.enabled) {
                    this.showPlaceholder(key);
                }
            });
        },
        
        // Public API
        testAds() {
            console.log('🔍 Testing ad networks v2.3...');
            console.log('Environment:', AD_CONFIG.environment);
            console.log('Loaded networks:', Array.from(this.loadedNetworks));
            
            const verification = this.verifyAdNetworks();
            
            const containers = document.querySelectorAll('.ad-container');
            console.log(`Found ${containers.length} ad containers:`);
            
            containers.forEach((container, index) => {
                console.log(`Container ${index + 1}:`, {
                    id: container.id,
                    className: container.className,
                    hasContent: container.children.length > 0,
                    isVisible: container.offsetParent !== null
                });
            });
            
            return {
                environment: AD_CONFIG.environment,
                loadedNetworks: Array.from(this.loadedNetworks),
                activeNetworks: verification,
                containers: containers.length,
                migration: 'EroAdvertising → PopAds'
            };
        },
        
        reloadAds() {
            console.log('🔄 Reloading ad networks v2.3...');
            
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
    
    console.log('✅ Ad Verification System v2.3 FINAL FIX loaded');
    console.log('💡 Use window.testAds() to test ad networks');
    console.log('💡 Use window.reloadAds() to reload all ads');
    console.log('📋 Networks: JuicyAds + ExoClick + PopAds');
    
})();
