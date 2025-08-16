// ============================
// AD VERIFICATION SYSTEM v2.1 FIXED
// Sistema corregido de verificación y carga de anuncios
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
                scriptUrl: 'https://a.exoclick.com/tag_gen.js',
                zones: {
                    header: 5696328,
                    sidebar: 5696329,
                    footer: 5696330
                },
                testMode: false
            },
            eroadvertising: {
                enabled: true,
                name: 'EroAdvertising',
                scriptUrl: 'https://www.ero-advertising.com/manager/script.js',
                zones: {
                    header: 123456,
                    sidebar: 123457,
                    footer: 123458
                },
                testMode: false
            }
        }
    };
    
    const AdVerificationSystem = {
        loadedNetworks: new Set(),
        retryAttempts: {},
        verificationAttempts: 0,
        
        init() {
            console.log('🎯 [Ad Networks] Sistema de verificación de Ad Networks iniciado');
            console.log('🌍 Environment:', AD_CONFIG.environment);
            
            if (AD_CONFIG.environment === 'development') {
                console.log('📢 Ad Networks: Development mode - Using placeholders');
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
            console.log('📢 Loading ad networks in production...');
            
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
            
            const script = document.createElement('script');
            script.src = network.scriptUrl;
            script.async = true;
            script.setAttribute('data-network', networkKey);
            
            script.onload = () => {
                console.log(`✅ ${network.name} script loaded`);
                this.loadedNetworks.add(networkKey);
                
                // Initialize network-specific code with delay
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
                // Network-specific initialization
                switch(networkKey) {
                    case 'juicyads':
                        this.initJuicyAds(network);
                        break;
                    case 'exoclick':
                        this.initExoClick(network);
                        break;
                    case 'eroadvertising':
                        this.initEroAdvertising(network);
                        break;
                }
            } catch (error) {
                console.error(`Error initializing ${networkKey}:`, error);
                this.showPlaceholder(networkKey);
            }
        },
        
        initJuicyAds(network) {
            try {
                // Fix for JuicyAds initialization
                if (typeof window.adsbyjuicy === 'undefined') {
                    window.adsbyjuicy = window.adsbyjuicy || { cmd: [] };
                }
                
                console.log('🍊 JuicyAds initialized');
                
                // Create ad zones with error handling
                Object.entries(network.zones).forEach(([position, zoneId]) => {
                    try {
                        this.createAdZone('juicyads', position, zoneId);
                    } catch (error) {
                        console.warn(`Error creating JuicyAds zone ${position}:`, error);
                    }
                });
            } catch (error) {
                console.error('JuicyAds initialization error:', error);
                this.showPlaceholder('juicyads');
            }
        },
        
        initExoClick(network) {
            try {
                if (window.ExoLoader || window.exoclick) {
                    console.log('🔵 ExoClick initialized');
                    // Create ad zones
                    Object.entries(network.zones).forEach(([position, zoneId]) => {
                        this.createAdZone('exoclick', position, zoneId);
                    });
                } else {
                    console.warn('ExoClick loader not found');
                    this.showPlaceholder('exoclick');
                }
            } catch (error) {
                console.error('ExoClick initialization error:', error);
                this.showPlaceholder('exoclick');
            }
        },
        
        initEroAdvertising(network) {
            try {
                console.log('🔴 EroAdvertising initialized');
                // Create ad zones
                Object.entries(network.zones).forEach(([position, zoneId]) => {
                    this.createAdZone('eroadvertising', position, zoneId);
                });
            } catch (error) {
                console.error('EroAdvertising initialization error:', error);
                this.showPlaceholder('eroadvertising');
            }
        },
        
        createAdZone(network, position, zoneId) {
            try {
                const containerId = `ad-${network}-${position}`;
                let container = document.getElementById(containerId);
                
                if (!container) {
                    // Create container if it doesn't exist
                    container = document.createElement('div');
                    container.id = containerId;
                    container.className = `ad-container ad-${network} ad-${position}`;
                    container.setAttribute('data-zone-id', zoneId);
                    
                    // Append to appropriate location
                    this.appendAdContainer(container, position);
                }
                
                // Network-specific ad insertion
                this.insertAd(network, container, zoneId);
            } catch (error) {
                console.error(`Error creating ad zone ${network}-${position}:`, error);
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
                            // Fallback - append to body
                            document.body.appendChild(container);
                        }
                        break;
                    case 'sidebar':
                        targetElement = document.querySelector('.main-container');
                        if (targetElement) {
                            container.style.position = 'fixed';
                            container.style.right = '10px';
                            container.style.top = '50%';
                            container.style.transform = 'translateY(-50%)';
                            container.style.zIndex = '100';
                            document.body.appendChild(container);
                        }
                        break;
                    case 'footer':
                        targetElement = document.querySelector('.main-footer');
                        if (targetElement) {
                            targetElement.parentNode.insertBefore(container, targetElement);
                        } else {
                            // Fallback - append to body
                            document.body.appendChild(container);
                        }
                        break;
                }
            } catch (error) {
                console.error(`Error appending ad container for ${position}:`, error);
            }
        },
        
        insertAd(network, container, zoneId) {
            try {
                switch(network) {
                    case 'juicyads':
                        // Fixed JuicyAds implementation
                        if (typeof window.adsbyjuicy !== 'undefined') {
                            container.innerHTML = `
                                <script type="text/javascript">
                                    (function() {
                                        try {
                                            if (typeof adsbyjuicy !== 'undefined') {
                                                adsbyjuicy.push({'adzone': ${zoneId}});
                                            }
                                        } catch(e) {
                                            console.warn('JuicyAds insertion error:', e);
                                        }
                                    })();
                                </script>
                            `;
                        } else {
                            // Fallback placeholder
                            this.showPlaceholderInContainer(container, 'JuicyAds', 'Loading...');
                        }
                        break;
                        
                    case 'exoclick':
                        if (window.ExoLoader) {
                            container.innerHTML = `<ins class="adsbyexoclick" data-zoneid="${zoneId}"></ins>`;
                            try {
                                window.ExoLoader.addZone({"zone_id": zoneId, "target_id": container.id});
                            } catch (error) {
                                console.warn('ExoClick loader error:', error);
                            }
                        } else {
                            this.showPlaceholderInContainer(container, 'ExoClick', 'Loading...');
                        }
                        break;
                        
                    case 'eroadvertising':
                        container.innerHTML = `<div data-ero-zone="${zoneId}"></div>`;
                        break;
                }
            } catch (error) {
                console.error(`Error inserting ad for ${network}:`, error);
                this.showPlaceholderInContainer(container, network, 'Error loading ad');
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
            console.log('🎯 [Ad Networks] ===== Iniciando verificación de Ad Networks =====');
            
            let activeNetworks = 0;
            let placeholdersShown = 0;
            
            // Check JuicyAds - Fixed verification
            if (window.adsbyjuicy || window.juicyads || document.querySelector('.adsbyjuicy') || 
                document.querySelector('[data-network="juicyads"]')) {
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
            if (window.ExoLoader || window.exoclick || document.querySelector('.adsbyexoclick') ||
                document.querySelector('[data-network="exoclick"]')) {
                console.log('🎯 [Ad Networks] ExoClick: Detectado ✅');
                activeNetworks++;
            } else {
                console.log('🎯 [Ad Networks] ExoClick: No detectado ❌');
                if (AD_CONFIG.networks.exoclick.enabled) {
                    this.showPlaceholder('exoclick');
                    placeholdersShown++;
                }
            }
            
            // Check EroAdvertising
            if (window.ero_advertising || document.querySelector('[data-ero-zone]') ||
                document.querySelector('[data-network="eroadvertising"]')) {
                console.log('🎯 [Ad Networks] EroAdvertising: Detectado ✅');
                activeNetworks++;
            } else {
                console.log('🎯 [Ad Networks] EroAdvertising: No detectado ❌');
                if (AD_CONFIG.networks.eroadvertising.enabled) {
                    this.showPlaceholder('eroadvertising');
                    placeholdersShown++;
                }
            }
            
            console.log('🎯 [Ad Networks] ===== Resumen de verificación =====');
            console.log(`🎯 [Ad Networks] Redes activas: ${activeNetworks}/3`);
            console.log(`🎯 [Ad Networks] Placeholders mostrados: ${placeholdersShown}`);
            
            // Retry verification if no networks loaded and we haven't retried too much
            if (activeNetworks === 0 && this.verificationAttempts < AD_CONFIG.maxRetries) {
                this.verificationAttempts = (this.verificationAttempts || 0) + 1;
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
            
            container.innerHTML = `
                <div style="
                    width: ${size.split('x')[0]}px;
                    max-width: 100%;
                    height: ${size.split('x')[1]}px;
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
                    ${AD_CONFIG.environment === 'development' ? 
                        '<div style="font-size: 10px; margin-top: 8px; opacity: 0.5;">Development Mode</div>' : 
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
            console.log('🔍 Testing ad networks...');
            console.log('Environment:', AD_CONFIG.environment);
            console.log('Loaded networks:', Array.from(this.loadedNetworks));
            
            const verification = this.verifyAdNetworks();
            
            // Check for ad containers
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
                containers: containers.length
            };
        },
        
        // Force reload ads
        reloadAds() {
            console.log('🔄 Reloading ad networks...');
            
            // Clear existing ads
            document.querySelectorAll('.ad-container').forEach(container => {
                container.remove();
            });
            
            // Reset state
            this.loadedNetworks.clear();
            this.retryAttempts = {};
            this.verificationAttempts = 0;
            
            // Reload
            this.init();
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            AdVerificationSystem.init();
        });
    } else {
        // DOM already loaded
        setTimeout(() => {
            AdVerificationSystem.init();
        }, 100);
    }
    
    // Expose to global scope for debugging
    window.AdVerificationSystem = AdVerificationSystem;
    
    // Add helper function to window
    window.testAds = () => AdVerificationSystem.testAds();
    window.reloadAds = () => AdVerificationSystem.reloadAds();
    
    console.log('✅ Ad Verification System v2.1 FIXED loaded');
    console.log('💡 Use window.testAds() to test ad networks');
    console.log('💡 Use window.reloadAds() to reload all ads');
    
})();
