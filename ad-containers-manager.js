// ============================
// AD CONTAINERS MANAGER v2.0.0 - MEJORADO
// Sistema mejorado de gestión de contenedores de anuncios
// ============================

(function() {
    'use strict';
    
    const AdContainersManager = {
        initialized: false,
        containers: new Map(),
        networkStatus: {
            juicyads: { loaded: false, zones: [] },
            exoclick: { loaded: false, zones: [] },
            popads: { loaded: false, active: false }
        },
        
        init() {
            if (this.initialized) return;
            
            console.log('📦 [Ad Containers] Inicializando gestor de contenedores v2.0.0...');
            
            // Esperar a que el DOM esté listo
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.setupContainers();
                });
            } else {
                this.setupContainers();
            }
            
            // Monitor de visibilidad cada 5 segundos
            setInterval(() => {
                this.monitorContainerVisibility();
            }, 5000);
            
            this.initialized = true;
        },
        
        setupContainers() {
            console.log('📦 [Ad Containers] Configurando contenedores de anuncios...');
            
            // Crear contenedores principales
            this.createAllContainers();
            
            // Forzar visibilidad inicial
            setTimeout(() => {
                this.forceContainerVisibility();
                this.logContainerStatus();
            }, 2000);
            
            // Aplicar estilos CSS mejorados
            this.injectEnhancedStyles();
        },
        
        createAllContainers() {
            // Configuración de contenedores
            const containerConfig = [
                { id: 'ad-header-container', position: 'header', network: 'multi' },
                { id: 'ad-sidebar-container', position: 'sidebar', network: 'multi' },
                { id: 'ad-footer-container', position: 'footer', network: 'multi' }
            ];
            
            containerConfig.forEach(config => {
                this.createContainer(config);
            });
        },
        
        createContainer(config) {
            const { id, position, network } = config;
            
            // Verificar si ya existe
            let container = document.getElementById(id);
            if (container) {
                console.log(`📦 [${position}] Contenedor ya existe`);
                this.containers.set(position, container);
                return container;
            }
            
            // Crear nuevo contenedor
            container = document.createElement('div');
            container.id = id;
            container.className = `ad-container ad-${position} ad-${network}`;
            container.setAttribute('data-position', position);
            container.setAttribute('data-network', network);
            container.setAttribute('data-created', new Date().toISOString());
            
            // Aplicar estilos según posición
            this.applyPositionStyles(container, position);
            
            // Añadir contenido inicial
            container.innerHTML = this.getInitialContent(position, network);
            
            // Insertar en el DOM
            this.insertContainerInDOM(container, position);
            
            // Guardar referencia
            this.containers.set(position, container);
            
            console.log(`✅ [${position}] Contenedor creado e insertado`);
            
            return container;
        },
        
        applyPositionStyles(container, position) {
            const styles = {
                header: {
                    cssText: `
                        display: block !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                        width: 100% !important;
                        max-width: 728px !important;
                        min-height: 90px !important;
                        margin: 20px auto !important;
                        background: rgba(0, 119, 190, 0.05) !important;
                        border: 1px solid rgba(0, 255, 136, 0.2) !important;
                        border-radius: 10px !important;
                        padding: 10px !important;
                        text-align: center !important;
                        position: relative !important;
                        z-index: 100 !important;
                    `
                },
                sidebar: {
                    cssText: `
                        display: block !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                        position: fixed !important;
                        right: 10px !important;
                        top: 50% !important;
                        transform: translateY(-50%) !important;
                        width: 300px !important;
                        min-height: 250px !important;
                        background: rgba(0, 119, 190, 0.05) !important;
                        border: 1px solid rgba(0, 255, 136, 0.2) !important;
                        border-radius: 10px !important;
                        padding: 10px !important;
                        text-align: center !important;
                        z-index: 1000 !important;
                    `
                },
                footer: {
                    cssText: `
                        display: block !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                        width: 100% !important;
                        max-width: 728px !important;
                        min-height: 90px !important;
                        margin: 20px auto !important;
                        background: rgba(0, 119, 190, 0.05) !important;
                        border: 1px solid rgba(0, 255, 136, 0.2) !important;
                        border-radius: 10px !important;
                        padding: 10px !important;
                        text-align: center !important;
                        position: relative !important;
                        z-index: 100 !important;
                    `
                }
            };
            
            if (styles[position]) {
                container.style.cssText = styles[position].cssText;
            }
        },
        
        getInitialContent(position, network) {
            return `
                <div class="ad-placeholder-content" style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: ${position === 'sidebar' ? '250px' : '90px'};
                    color: rgba(255, 255, 255, 0.6);
                    font-family: system-ui, -apple-system, sans-serif;
                ">
                    <div style="font-size: 24px; margin-bottom: 10px;">📢</div>
                    <div style="font-size: 14px; font-weight: bold; margin-bottom: 5px;">
                        ${position.toUpperCase()} AD SPACE
                    </div>
                    <div style="font-size: 12px; opacity: 0.7;">
                        Loading advertisements...
                    </div>
                    <div class="ad-status" style="
                        font-size: 10px;
                        margin-top: 10px;
                        padding: 4px 8px;
                        background: rgba(0, 255, 136, 0.2);
                        border-radius: 5px;
                        color: #00ff88;
                    ">
                        Preparing zone...
                    </div>
                </div>
            `;
        },
        
        insertContainerInDOM(container, position) {
            try {
                let targetElement;
                let inserted = false;
                
                switch(position) {
                    case 'header':
                        // Intentar insertar después del header principal
                        targetElement = document.querySelector('.main-header');
                        if (!targetElement) {
                            targetElement = document.querySelector('header');
                        }
                        
                        if (targetElement && targetElement.parentNode) {
                            targetElement.parentNode.insertBefore(container, targetElement.nextSibling);
                            inserted = true;
                        } else {
                            // Fallback: insertar al principio del body
                            const mainContainer = document.querySelector('.main-container');
                            if (mainContainer) {
                                mainContainer.insertBefore(container, mainContainer.firstChild);
                                inserted = true;
                            } else {
                                document.body.insertBefore(container, document.body.firstChild);
                                inserted = true;
                            }
                        }
                        break;
                        
                    case 'sidebar':
                        // Sidebar siempre va al body
                        document.body.appendChild(container);
                        inserted = true;
                        break;
                        
                    case 'footer':
                        // Intentar insertar antes del footer principal
                        targetElement = document.querySelector('.main-footer');
                        if (!targetElement) {
                            targetElement = document.querySelector('footer');
                        }
                        
                        if (targetElement && targetElement.parentNode) {
                            targetElement.parentNode.insertBefore(container, targetElement);
                            inserted = true;
                        } else {
                            // Fallback: añadir al final del body
                            document.body.appendChild(container);
                            inserted = true;
                        }
                        break;
                }
                
                if (inserted) {
                    console.log(`📍 [${position}] Contenedor insertado en el DOM`);
                } else {
                    console.warn(`⚠️ [${position}] No se pudo insertar el contenedor`);
                }
                
            } catch (error) {
                console.error(`Error insertando contenedor ${position}:`, error);
            }
        },
        
        forceContainerVisibility() {
            console.log('👁️ [Ad Containers] Forzando visibilidad de contenedores...');
            
            const allContainers = document.querySelectorAll('.ad-container');
            
            allContainers.forEach((container, index) => {
                // Remover cualquier estilo que pueda ocultar
                container.style.display = 'block';
                container.style.visibility = 'visible';
                container.style.opacity = '1';
                
                // Asegurar z-index apropiado
                if (!container.style.zIndex) {
                    container.style.zIndex = container.classList.contains('ad-sidebar') ? '1000' : '100';
                }
                
                // Añadir marcador de visibilidad si no existe
                if (!container.querySelector('.visibility-marker')) {
                    const marker = document.createElement('div');
                    marker.className = 'visibility-marker';
                    marker.style.cssText = `
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
                    marker.textContent = `AD ${index + 1}`;
                    container.appendChild(marker);
                }
                
                console.log(`👁️ [Container ${index + 1}] Visibilidad forzada:`, {
                    id: container.id,
                    visible: this.isElementVisible(container),
                    dimensions: `${container.offsetWidth}x${container.offsetHeight}`,
                    position: container.getAttribute('data-position')
                });
            });
        },
        
        monitorContainerVisibility() {
            const allContainers = document.querySelectorAll('.ad-container');
            let visibleCount = 0;
            let hiddenCount = 0;
            
            allContainers.forEach(container => {
                if (this.isElementVisible(container)) {
                    visibleCount++;
                    container.setAttribute('data-visible', 'true');
                } else {
                    hiddenCount++;
                    container.setAttribute('data-visible', 'false');
                    // Intentar hacer visible
                    container.style.display = 'block';
                    container.style.visibility = 'visible';
                    container.style.opacity = '1';
                }
            });
            
            if (hiddenCount > 0) {
                console.warn(`⚠️ [Monitor] ${hiddenCount} contenedores ocultos detectados, intentando corregir...`);
            }
        },
        
        logContainerStatus() {
            console.group('📊 [Ad Containers] Reporte de Estado');
            
            const allContainers = document.querySelectorAll('.ad-container');
            console.log(`Total de contenedores: ${allContainers.length}`);
            
            allContainers.forEach((container, index) => {
                const status = {
                    id: container.id,
                    position: container.getAttribute('data-position'),
                    network: container.getAttribute('data-network'),
                    visible: this.isElementVisible(container),
                    dimensions: {
                        width: container.offsetWidth,
                        height: container.offsetHeight
                    },
                    hasContent: container.children.length > 0,
                    hasAdZone: container.querySelector('.juicyads-zone, .adsbyexoclick, [data-exoclick-zoneid]') !== null
                };
                
                const emoji = status.visible ? '✅' : '❌';
                console.log(`${emoji} Container ${index + 1}:`, status);
            });
            
            // Verificar redes específicas
            this.checkNetworkStatus();
            
            console.groupEnd();
        },
        
        checkNetworkStatus() {
            console.log('🔍 [Networks] Verificando estado de las redes...');
            
            // JuicyAds
            const juicyElements = document.querySelectorAll('[id*="juicyads"], .juicyads-zone');
            this.networkStatus.juicyads.loaded = juicyElements.length > 0;
            this.networkStatus.juicyads.zones = Array.from(juicyElements).map(el => el.id);
            console.log(`🍊 JuicyAds: ${juicyElements.length} elementos`, this.networkStatus.juicyads.zones);
            
            // ExoClick
            const exoElements = document.querySelectorAll('[id*="exoclick"], .adsbyexoclick, [data-exoclick-zoneid]');
            this.networkStatus.exoclick.loaded = exoElements.length > 0;
            this.networkStatus.exoclick.zones = Array.from(exoElements).map(el => el.id || el.className);
            console.log(`🔵 ExoClick: ${exoElements.length} elementos`, this.networkStatus.exoclick.zones);
            
            // PopAds
            const popAdsActive = window.e494ffb82839a29122608e933394c091 || 
                               document.querySelector('[data-cfasync="false"]') || 
                               document.getElementById('popads-indicator');
            this.networkStatus.popads.active = !!popAdsActive;
            console.log(`🚀 PopAds: ${this.networkStatus.popads.active ? 'Activo' : 'Inactivo'}`);
        },
        
        injectEnhancedStyles() {
            const styleId = 'ad-containers-enhanced-styles';
            
            // Verificar si ya existe
            if (document.getElementById(styleId)) return;
            
            const styles = document.createElement('style');
            styles.id = styleId;
            styles.innerHTML = `
                /* Estilos mejorados para contenedores de anuncios */
                .ad-container {
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    transition: all 0.3s ease;
                    animation: adFadeIn 0.5s ease;
                }
                
                @keyframes adFadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .ad-container:hover {
                    box-shadow: 0 5px 15px rgba(0, 212, 255, 0.2);
                }
                
                .ad-container .visibility-marker {
                    transition: all 0.2s ease;
                }
                
                .ad-container:hover .visibility-marker {
                    background: #00ffaa !important;
                }
                
                /* Asegurar que las zonas de anuncios sean visibles */
                .juicyads-zone,
                .adsbyexoclick,
                [data-exoclick-zoneid] {
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    min-height: 50px !important;
                }
                
                /* Responsive para móviles */
                @media (max-width: 768px) {
                    .ad-container.ad-sidebar {
                        position: relative !important;
                        right: auto !important;
                        top: auto !important;
                        transform: none !important;
                        width: 100% !important;
                        max-width: 100% !important;
                        margin: 20px auto !important;
                    }
                    
                    .ad-container.ad-header,
                    .ad-container.ad-footer {
                        max-width: 100% !important;
                        padding: 5px !important;
                    }
                }
                
                /* Indicador de carga */
                .ad-container .ad-status {
                    animation: pulse 2s ease infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `;
            
            document.head.appendChild(styles);
            console.log('✅ [Styles] Estilos CSS mejorados inyectados');
        },
        
        // Funciones de utilidad
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
        
        updateContainerStatus(position, status) {
            const container = this.containers.get(position);
            if (!container) return;
            
            const statusElement = container.querySelector('.ad-status');
            if (statusElement) {
                statusElement.textContent = status;
                statusElement.style.background = status.includes('Active') ? 
                    'rgba(0, 255, 136, 0.3)' : 
                    'rgba(255, 165, 0, 0.3)';
            }
        },
        
        // API pública
        getContainer(position) {
            return this.containers.get(position);
        },
        
        getAllContainers() {
            return Array.from(this.containers.values());
        },
        
        refreshContainers() {
            console.log('🔄 [Ad Containers] Refrescando contenedores...');
            this.forceContainerVisibility();
            this.logContainerStatus();
        },
        
        getNetworkStatus() {
            return this.networkStatus;
        }
    };
    
    // Auto-inicializar
    AdContainersManager.init();
    
    // Exponer globalmente
    window.AdContainersManager = AdContainersManager;
    
    // Comandos de consola útiles
    window.refreshAds = () => AdContainersManager.refreshContainers();
    window.adStatus = () => AdContainersManager.getNetworkStatus();
    
    console.log('✅ [Ad Containers] Manager v2.0.0 cargado');
    console.log('💡 Usa window.refreshAds() para refrescar contenedores');
    console.log('💡 Usa window.adStatus() para ver estado de las redes');
    
})();
