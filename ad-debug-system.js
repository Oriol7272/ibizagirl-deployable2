// ============================
// ADS DEBUG SYSTEM v1.2.0 - COMPREHENSIVE DIAGNOSTICS
// Real-time ad network monitoring and debugging
// ============================

(function() {
    'use strict';
    
    const AdsDebugSystem = {
        initialized: false,
        debugMode: true,
        checkInterval: null,
        networks: ['juicyads', 'exoclick', 'popads'],
        
        init() {
            if (this.initialized) return;
            
            console.log('🔍 [Ads Debug] Initializing comprehensive debug system...');
            
            // Wait for DOM and other systems
            setTimeout(() => {
                this.startRealTimeMonitoring();
                this.checkAdContainers();
                this.monitorNetworkGlobals();
                this.setupPerformanceTracking();
                this.initialized = true;
                console.log('✅ [Ads Debug] Debug system active');
            }, 3000);
            
            // Setup manual debug commands
            this.exposeDebugCommands();
        },
        
        startRealTimeMonitoring() {
            if (this.checkInterval) return;
            
            this.checkInterval = setInterval(() => {
                this.performHealthCheck();
            }, 10000); // Check every 10 seconds
            
            console.log('📊 [Ads Debug] Real-time monitoring started');
        },
        
        performHealthCheck() {
            const report = this.generateReport();
            
            if (report.issues.length > 0) {
                console.warn('⚠️ [Ads Debug] Issues detected:', report.issues);
                this.suggestFixes(report.issues);
            }
            
            // Update debug display if visible
            this.updateDebugDisplay(report);
        },
        
        checkAdContainers() {
            console.log('🔍 [Ads Debug] Checking ad containers...');
            
            const containers = document.querySelectorAll('.ad-container, [id*="ad-"], [class*="ads"]');
            console.log(`📦 [Ads Debug] Found ${containers.length} potential ad containers`);
            
            containers.forEach((container, index) => {
                const info = {
                    id: container.id || `container-${index}`,
                    classes: container.className,
                    visible: this.isElementVisible(container),
                    hasContent: container.children.length > 0,
                    position: this.getElementPosition(container),
                    size: this.getElementSize(container)
                };
                
                console.log(`📦 [Container ${index + 1}]:`, info);
                
                if (!info.visible) {
                    console.warn(`⚠️ [Container ${index + 1}] Not visible:`, container);
                }
                
                if (!info.hasContent) {
                    console.warn(`⚠️ [Container ${index + 1}] Empty container:`, container);
                }
            });
        },
        
        monitorNetworkGlobals() {
            console.log('🌐 [Ads Debug] Monitoring network globals...');
            
            const networks = {
                juicyads: {
                    globals: ['adsbyjuicy'],
                    loaded: false,
                    zones: []
                },
                exoclick: {
                    globals: ['ExoLoader', 'exoclick', 'adProvider'],
                    loaded: false,
                    zones: []
                },
                popads: {
                    globals: ['e494ffb82839a291', 'e494ffb82839a29122608e933394c091'],
                    loaded: false,
                    active: false
                }
            };
            
            Object.entries(networks).forEach(([name, config]) => {
                config.loaded = config.globals.some(global => window[global]);
                
                if (config.loaded) {
                    console.log(`✅ [${name}] Network detected`);
                    this.analyzeNetwork(name, config);
                } else {
                    console.warn(`❌ [${name}] Network not detected`);
                    console.log(`🔍 [${name}] Looking for:`, config.globals);
                }
            });
        },
        
        analyzeNetwork(name, config) {
            switch(name) {
                case 'juicyads':
                    this.analyzeJuicyAds();
                    break;
                case 'exoclick':
                    this.analyzeExoClick();
                    break;
                case 'popads':
                    this.analyzePopAds();
                    break;
            }
        },
        
        analyzeJuicyAds() {
            if (!window.adsbyjuicy) return;
            
            console.log('🍊 [JuicyAds] Analyzing...');
            console.log('🍊 [JuicyAds] Global object:', window.adsbyjuicy);
            console.log('🍊 [JuicyAds] Commands queue:', window.adsbyjuicy.cmd?.length || 0);
            
            // Check for zones
            const zones = document.querySelectorAll('[id*="juicyads"], .juicyads-zone');
            console.log(`🍊 [JuicyAds] Found ${zones.length} zone elements`);
            
            zones.forEach((zone, index) => {
                console.log(`🍊 [Zone ${index + 1}]:`, {
                    id: zone.id,
                    visible: this.isElementVisible(zone),
                    hasContent: zone.innerHTML.length > 0,
                    content: zone.innerHTML.substring(0, 100) + '...'
                });
            });
        },
        
        analyzeExoClick() {
            console.log('🔵 [ExoClick] Analyzing...');
            
            const exoGlobals = ['ExoLoader', 'exoclick', 'adProvider'];
            const foundGlobals = exoGlobals.filter(global => window[global]);
            
            console.log('🔵 [ExoClick] Available globals:', foundGlobals);
            
            foundGlobals.forEach(global => {
                console.log(`🔵 [ExoClick] ${global}:`, window[global]);
            });
            
            // Check for zones
            const zones = document.querySelectorAll('[id*="exoclick"], .adsbyexoclick, [data-exoclick-zoneid]');
            console.log(`🔵 [ExoClick] Found ${zones.length} zone elements`);
            
            zones.forEach((zone, index) => {
                console.log(`🔵 [Zone ${index + 1}]:`, {
                    id: zone.id,
                    classes: zone.className,
                    visible: this.isElementVisible(zone),
                    hasContent: zone.innerHTML.length > 0
                });
            });
        },
        
        analyzePopAds() {
            console.log('🚀 [PopAds] Analyzing...');
            
            const popGlobals = Object.keys(window).filter(key => 
                key.includes('e494ffb') || key.includes('popads')
            );
            
            console.log('🚀 [PopAds] Found globals:', popGlobals);
            
            popGlobals.forEach(global => {
                console.log(`🚀 [PopAds] ${global}:`, window[global]);
            });
            
            // Check for injected scripts
            const popScripts = document.querySelectorAll('script[data-cfasync="false"], script[src*="premiumvertising"]');
            console.log(`🚀 [PopAds] Found ${popScripts.length} related scripts`);
        },
        
        generateReport() {
            const report = {
                timestamp: new Date().toISOString(),
                networks: {},
                containers: [],
                issues: [],
                performance: {}
            };
            
            // Check networks
            this.networks.forEach(network => {
                report.networks[network] = this.getNetworkStatus(network);
            });
            
            // Check containers
            const containers = document.querySelectorAll('.ad-container');
            containers.forEach((container, index) => {
                const containerInfo = {
                    index,
                    id: container.id,
                    visible: this.isElementVisible(container),
                    hasContent: container.children.length > 0,
                    isEmpty: container.innerHTML.trim().length === 0
                };
                
                report.containers.push(containerInfo);
                
                // Detect issues
                if (!containerInfo.visible) {
                    report.issues.push(`Container ${index + 1} not visible`);
                }
                if (containerInfo.isEmpty) {
                    report.issues.push(`Container ${index + 1} is empty`);
                }
            });
            
            return report;
        },
        
        getNetworkStatus(network) {
            switch(network) {
                case 'juicyads':
                    return {
                        loaded: !!window.adsbyjuicy,
                        ready: window.adsbyjuicy && typeof window.adsbyjuicy.push === 'function',
                        zones: document.querySelectorAll('[id*="juicyads"]').length
                    };
                case 'exoclick':
                    return {
                        loaded: !!(window.ExoLoader || window.exoclick),
                        ready: !!(window.ExoLoader?.addZone || window.exoclick),
                        zones: document.querySelectorAll('[id*="exoclick"]').length
                    };
                case 'popads':
                    return {
                        loaded: Object.keys(window).some(key => key.includes('e494ffb')),
                        ready: !!document.querySelector('script[data-cfasync="false"]'),
                        active: true
                    };
                default:
                    return { loaded: false, ready: false };
            }
        },
        
        suggestFixes(issues) {
            console.group('🔧 [Ads Debug] Suggested fixes:');
            
            issues.forEach(issue => {
                if (issue.includes('not visible')) {
                    console.log('💡 Check CSS display/visibility properties');
                    console.log('💡 Verify container positioning');
                    console.log('💡 Check for AdBlock interference');
                }
                
                if (issue.includes('empty')) {
                    console.log('💡 Verify ad network initialization');
                    console.log('💡 Check network zone IDs');
                    console.log('💡 Verify script loading order');
                }
            });
            
            console.groupEnd();
        },
        
        setupPerformanceTracking() {
            // Track ad load times
            if ('PerformanceObserver' in window) {
                try {
                    const observer = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        entries.forEach(entry => {
                            if (entry.name.includes('ads') || 
                                entry.name.includes('juicy') || 
                                entry.name.includes('exo') ||
                                entry.name.includes('popads')) {
                                console.log('📊 [Performance] Ad resource:', {
                                    name: entry.name,
                                    duration: entry.duration,
                                    size: entry.transferSize
                                });
                            }
                        });
                    });
                    
                    observer.observe({ entryTypes: ['resource'] });
                } catch (e) {
                    console.log('📊 [Performance] Observer not supported');
                }
            }
        },
        
        exposeDebugCommands() {
            window.debugAds = () => {
                console.log('🔍 [Manual Debug] Generating comprehensive report...');
                const report = this.generateReport();
                console.table(report.containers);
                console.log('📊 [Report]:', report);
                return report;
            };
            
            window.testAdContainers = () => {
                this.checkAdContainers();
            };
            
            window.monitorAds = () => {
                this.startRealTimeMonitoring();
            };
            
            window.stopMonitorAds = () => {
                if (this.checkInterval) {
                    clearInterval(this.checkInterval);
                    this.checkInterval = null;
                    console.log('⏹️ [Ads Debug] Monitoring stopped');
                }
            };
            
            console.log('🎮 [Debug Commands] Available:');
            console.log('• window.debugAds() - Full diagnostic report');
            console.log('• window.testAdContainers() - Check containers');
            console.log('• window.monitorAds() - Start monitoring');
            console.log('• window.stopMonitorAds() - Stop monitoring');
        },
        
        updateDebugDisplay(report) {
            // Create/update floating debug panel if needed
            let panel = document.getElementById('ads-debug-panel');
            
            if (!panel && this.debugMode) {
                panel = this.createDebugPanel();
            }
            
            if (panel) {
                this.updateDebugPanel(panel, report);
            }
        },
        
        createDebugPanel() {
            const panel = document.createElement('div');
            panel.id = 'ads-debug-panel';
            panel.style.cssText = `
                position: fixed;
                top: 100px;
                right: 10px;
                width: 300px;
                background: rgba(0, 0, 0, 0.9);
                color: #00ff00;
                padding: 15px;
                border-radius: 10px;
                font-family: monospace;
                font-size: 12px;
                z-index: 10003;
                border: 1px solid #00ff00;
                max-height: 400px;
                overflow-y: auto;
            `;
            
            panel.innerHTML = `
                <div style="border-bottom: 1px solid #00ff00; margin-bottom: 10px; padding-bottom: 5px;">
                    🔍 ADS DEBUG PANEL
                    <button onclick="this.parentElement.parentElement.remove()" style="float: right; background: red; color: white; border: none; border-radius: 3px; padding: 2px 5px; cursor: pointer;">×</button>
                </div>
                <div id="debug-content">Loading...</div>
            `;
            
            document.body.appendChild(panel);
            return panel;
        },
        
        updateDebugPanel(panel, report) {
            const content = panel.querySelector('#debug-content');
            if (!content) return;
            
            const html = `
                <div><strong>Networks:</strong></div>
                ${Object.entries(report.networks).map(([name, status]) => 
                    `<div>${name}: ${status.loaded ? '✅' : '❌'} (${status.zones || 0} zones)</div>`
                ).join('')}
                
                <div style="margin-top: 10px;"><strong>Containers:</strong></div>
                ${report.containers.map((container, i) => 
                    `<div>Container ${i + 1}: ${container.visible ? '👁️' : '🙈'} ${container.hasContent ? '📦' : '📭'}</div>`
                ).join('')}
                
                ${report.issues.length > 0 ? `
                    <div style="margin-top: 10px; color: #ff6666;"><strong>Issues:</strong></div>
                    ${report.issues.map(issue => `<div>⚠️ ${issue}</div>`).join('')}
                ` : ''}
                
                <div style="margin-top: 10px; font-size: 10px; opacity: 0.7;">
                    Last update: ${new Date().toLocaleTimeString()}
                </div>
            `;
            
            content.innerHTML = html;
        },
        
        // Utility functions
        isElementVisible(element) {
            if (!element) return false;
            
            const rect = element.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(element);
            
            return (
                rect.width > 0 &&
                rect.height > 0 &&
                computedStyle.display !== 'none' &&
                computedStyle.visibility !== 'hidden' &&
                computedStyle.opacity !== '0'
            );
        },
        
        getElementPosition(element) {
            const rect = element.getBoundingClientRect();
            return {
                top: Math.round(rect.top),
                left: Math.round(rect.left),
                right: Math.round(rect.right),
                bottom: Math.round(rect.bottom)
            };
        },
        
        getElementSize(element) {
            const rect = element.getBoundingClientRect();
            return {
                width: Math.round(rect.width),
                height: Math.round(rect.height)
            };
        }
    };
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => AdsDebugSystem.init(), 2000);
        });
    } else {
        setTimeout(() => AdsDebugSystem.init(), 2000);
    }
    
    // Expose globally
    window.AdsDebugSystem = AdsDebugSystem;
    
    console.log('🔍 [Ads Debug] Debug system loaded');
    
})();
