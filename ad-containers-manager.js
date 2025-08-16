// ============================
// AD CONTAINERS MANAGER v1.0.0
// Ensures proper ad container placement and visibility
// ============================

(function() {
    'use strict';
    
    const AdContainersManager = {
        initialized: false,
        containers: new Map(),
        
        init() {
            if (this.initialized) return;
            
            console.log('📦 [Ad Containers] Initializing container manager...');
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.setupContainers();
                });
            } else {
                this.setupContainers();
            }
            
            this.initialized = true;
        },
        
        setupContainers() {
            console.log('📦 [Ad Containers] Setting up ad containers...');
            
            // Ensure containers exist in proper locations
            this.ensureHeaderContainer();
            this.ensureSidebarContainer();
            this.ensureFooterContainer();
            
            // Force visibility check
            setTimeout(() => {
                this.forceContainerVisibility();
                this.logContainerStatus();
            }, 2000);
        },
        
        ensureHeaderContainer() {
            const existingContainer = document.getElementById('ad-header-container');
            if (existingContainer) {
                console.log('📦 [Header] Container already exists');
                return existingContainer;
            }
            
            const headerContainer = this.createContainer('ad-header-container', 'header');
            const mainHeader = document.querySelector('.main-header');
            
            if (mainHeader && mainHeader.parentNode) {
                // Insert after main header
                mainHeader.parentNode.insertBefore(headerContainer, mainHeader.nextSibling);
                console.log('📦 [Header] Container created and inserted');
            } else {
                // Fallback: insert at top of body
                document.body.insertBefore(headerContainer, document.body.firstChild);
                console.log('📦 [Header] Container created (fallback position)');
            }
            
            this.containers.set('header', headerContainer);
            return headerContainer;
        },
        
        ensureSidebarContainer() {
            const existingContainer = document.getElementById('ad-sidebar-container');
            if (existingContainer) {
                console.log('📦 [Sidebar] Container already exists');
                return existingContainer;
            }
            
            const sidebarContainer = this.createContainer('ad-sidebar-container', 'sidebar');
            sidebarContainer.style.cssText = `
                position: fixed !important;
                right: 10px !important;
                top: 50% !important;
                transform: translateY(-50%) !important;
                z-index: 1000 !important;
                max-width: 300px !important;
                min-height: 250px !important;
                margin: 0 !important;
            `;
            
            document.body.appendChild(sidebarContainer);
            console.log('📦 [Sidebar] Container created');
            
            this.containers.set('sidebar', sidebarContainer);
            return sidebarContainer;
        },
        
        ensureFooterContainer() {
            const existingContainer = document.getElementById('ad-footer-container');
            if (existingContainer) {
                console.log('📦 [Footer] Container already exists');
                return existingContainer;
            }
            
            const footerContainer = this.createContainer('ad-footer-container', 'footer');
            const mainFooter = document.querySelector('.main-footer');
            
            if (mainFooter && mainFooter.parentNode) {
                // Insert before main footer
                mainFooter.parentNode.insertBefore(footerContainer, mainFooter);
                console.log('📦 [Footer] Container created and inserted');
            } else {
                // Fallback: append to body
                document.body.appendChild(footerContainer);
                console.log('📦 [Footer] Container created (fallback position)');
            }
            
            this.containers.set('footer', footerContainer);
            return footerContainer;
        },
        
        createContainer(id, position) {
            const container = document.createElement('div');
            container.id = id;
            container.className = `ad-container ad-${position}`;
            container.setAttribute('data-position', position);
            container.setAttribute('data-debug', 'true'); // For debugging
            
            // Add placeholder content initially
            container.innerHTML = `
                <div class="ad-placeholder">
                    <div style="font-size: 18px; margin-bottom: 10px; color: #00ff88;">📢 AD SPACE</div>
                    <div style="font-size: 14px; opacity: 0.8;">${position.toUpperCase()} Advertisement</div>
                    <div style="font-size: 12px; margin-top: 5px; opacity: 0.6;">Loading network...</div>
                </div>
            `;
            
            // Force visibility styles
            container.style.cssText += `
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                min-height: 100px !important;
                background: rgba(0, 119, 190, 0.1) !important;
                border: 2px solid rgba(0, 255, 136, 0.3) !important;
                margin: 2rem auto !important;
                padding: 1rem !important;
                border-radius: 15px !important;
                text-align: center !important;
            `;
            
            return container;
        },
        
        forceContainerVisibility() {
            console.log('👁️ [Ad Containers] Forcing visibility...');
            
            const allContainers = document.querySelectorAll('.ad-container');
            allContainers.forEach((container, index) => {
                // Remove any potential hiding styles
                container.style.display = 'block';
                container.style.visibility = 'visible';
                container.style.opacity = '1';
                container.style.position = container.style.position || 'relative';
                
                // Add visibility marker
                if (!container.querySelector('.visibility-marker')) {
                    const marker = document.createElement('div');
                    marker.className = 'visibility-marker';
                    marker.style.cssText = `
                        position: absolute;
                        top: 5px;
                        right: 5px;
                        background: #00ff88;
                        color: #001f3f;
                        padding: 2px 5px;
                        border-radius: 3px;
                        font-size: 10px;
                        font-weight: bold;
                        z-index: 1001;
                    `;
                    marker.textContent = `VISIBLE ${index + 1}`;
                    container.appendChild(marker);
                }
                
                console.log(`👁️ [Container ${index + 1}] Forced visible:`, {
                    id: container.id,
                    position: this.getElementPosition(container),
                    size: this.getElementSize(container),
                    computed: this.getComputedVisibility(container)
                });
            });
        },
        
        logContainerStatus() {
            console.group('📊 [Ad Containers] Status Report');
            
            const allContainers = document.querySelectorAll('.ad-container');
            console.log(`Found ${allContainers.length} total containers`);
            
            allContainers.forEach((container, index) => {
                const status = {
                    id: container.id,
                    classes: container.className,
                    visible: this.isElementVisible(container),
                    position: this.getElementPosition(container),
                    size: this.getElementSize(container),
                    hasContent: container.children.length > 0,
                    computedStyles: this.getComputedVisibility(container)
                };
                
                console.log(`📦 Container ${index + 1}:`, status);
                
                if (!status.visible) {
                    console.warn(`⚠️ Container ${index + 1} has visibility issues`);
                }
            });
            
            // Check for ad network specific elements
            this.checkNetworkElements();
            
            console.groupEnd();
        },
        
        checkNetworkElements() {
            console.log('🔍 [Networks] Checking network-specific elements...');
            
            // JuicyAds
            const juicyElements = document.querySelectorAll('[id*="juicyads"], .juicyads-zone');
            console.log(`🍊 JuicyAds elements: ${juicyElements.length}`);
            
            // ExoClick
            const exoElements = document.querySelectorAll('[id*="exoclick"], .adsbyexoclick, [data-exoclick-zoneid]');
            console.log(`🔵 ExoClick elements: ${exoElements.length}`);
            
            // PopAds
            const popElements = document.querySelectorAll('[data-cfasync="false"], #popads-indicator');
            console.log(`🚀 PopAds elements: ${popElements.length}`);
            
            // Log specific element details
            [...juicyElements, ...exoElements, ...popElements].forEach((element, index) => {
                console.log(`🔍 Network element ${index + 1}:`, {
                    tagName: element.tagName,
                    id: element.id,
                    classes: element.className,
                    visible: this.isElementVisible(element),
                    content: element.innerHTML.substring(0, 100) + '...'
                });
            });
        },
        
        // Enhanced container injection for specific networks
        injectJuicyAdsContainer(position, zoneId) {
            const containerId = `ad-juicyads-${position}`;
            let container = document.getElementById(containerId);
            
            if (!container) {
                container = this.createContainer(containerId, position);
                container.classList.add('ad-juicyads');
                this.appendToPosition(container, position);
            }
            
            // Create zone element
            const zoneElement = document.createElement('div');
            zoneElement.id = `juicyads-${position}-${zoneId}`;
            zoneElement.className = 'juicyads-zone';
            zoneElement.style.cssText = `
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                width: 100% !important;
                min-height: 50px !important;
                background: rgba(255, 165, 0, 0.1) !important;
                border: 1px solid rgba(255, 165, 0, 0.3) !important;
                border-radius: 5px;
                padding: 10px;
            `;
            
            container.innerHTML = ''; // Clear placeholder
            container.appendChild(zoneElement);
            
            console.log(`🍊 [JuicyAds] Container injected for ${position} zone ${zoneId}`);
            return { container, zoneElement };
        },
        
        injectExoClickContainer(position, zoneId) {
            const containerId = `ad-exoclick-${position}`;
            let container = document.getElementById(containerId);
            
            if (!container) {
                container = this.createContainer(containerId, position);
                container.classList.add('ad-exoclick');
                this.appendToPosition(container, position);
            }
            
            // Create zone element
            const zoneElement = document.createElement('div');
            zoneElement.id = `exoclick-${position}-${zoneId}`;
            zoneElement.className = 'adsbyexoclick';
            zoneElement.setAttribute('data-exoclick-zoneid', zoneId);
            zoneElement.style.cssText = `
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                width: 100% !important;
                min-height: 50px !important;
                background: rgba(0, 162, 255, 0.1) !important;
                border: 1px solid rgba(0, 162, 255, 0.3) !important;
                border-radius: 5px;
                padding: 10px;
            `;
            
            container.innerHTML = ''; // Clear placeholder
            container.appendChild(zoneElement);
            
            console.log(`🔵 [ExoClick] Container injected for ${position} zone ${zoneId}`);
            return { container, zoneElement };
        },
        
        appendToPosition(container, position) {
            switch(position) {
                case 'header':
                    const header = document.querySelector('.main-header');
                    if (header && header.parentNode) {
                        header.parentNode.insertBefore(container, header.nextSibling);
                    } else {
                        document.body.insertBefore(container, document.body.firstChild);
                    }
                    break;
                    
                case 'sidebar':
                    container.style.cssText += `
                        position: fixed !important;
                        right: 10px !important;
                        top: 50% !important;
                        transform: translateY(-50%) !important;
                        z-index: 1000 !important;
                        max-width: 300px !important;
                    `;
                    document.body.appendChild(container);
                    break;
                    
                case 'footer':
                    const footer = document.querySelector('.main-footer');
                    if (footer && footer.parentNode) {
                        footer.parentNode.insertBefore(container, footer);
                    } else {
                        document.body.appendChild(container);
                    }
                    break;
                    
                default:
                    document.body.appendChild(container);
            }
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
                parseFloat(computedStyle.opacity) > 0
            );
        },
        
        getElementPosition(element) {
            const rect = element.getBoundingClientRect();
            return {
                top: Math.round(rect.top),
                left: Math.round(rect.left),
                width: Math.round(rect.width),
                height: Math.round(rect.height)
            };
        },
        
        getElementSize(element) {
            const rect = element.getBoundingClientRect();
            return {
                width: Math.round(rect.width),
                height: Math.round(rect.height)
            };
        },
        
        getComputedVisibility(element) {
            const computed = window.getComputedStyle(element);
            return {
                display: computed.display,
                visibility: computed.visibility,
                opacity: computed.opacity,
                position: computed.position,
                zIndex: computed.zIndex
            };
        }
    };
    
    // Auto-initialize
    AdContainersManager.init();
    
    // Expose globally
    window.AdContainersManager = AdContainersManager;
    
    console.log('📦 [Ad Containers] Manager loaded');
    
})();
