// ============================
// AD CONTAINERS MANAGER v2.0.0 - COMPLETO
// Sistema de gestión de contenedores de anuncios para IbizaGirl.pics
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
            
            // Verificación completa cada 10 segundos
            setInterval(() => {
                this.checkNetworkStatus();
            }, 10000);
            
            this.initialized = true;
        },
        
        setupContainers() {
            console.log('📦 [Ad Containers] Configurando contenedores de anuncios...');
            
            // Crear contenedores principales
            this.createAllContainers();
            
            // Forzar visibilidad inicial después de un delay
            setTimeout(() => {
                this.forceContainerVisibility();
                this.logContainerStatus();
            }, 2000);
            
            // Segunda verificación después de 5 segundos
            setTimeout(() => {
                this.verifyAndFixContainers();
            }, 5000);
        },
        
        createAllContainers() {
            // Configuración de contenedores principales
            const containerConfig = [
                { 
                    id: 'ad-header-container', 
                    position: 'header', 
                    network: 'multi',
                    size: { width: 728, height: 90 }
                },
                { 
                    id: 'ad-sidebar-container', 
                    position: 'sidebar', 
                    network: 'multi',
                    size: { width: 300, height: 250 }
                },
                { 
                    id: 'ad-footer-container', 
                    position: 'footer', 
                    network: 'multi',
                    size: { width: 728, height: 90 }
                }
            ];
            
            containerConfig.forEach(config => {
                this.createContainer(config);
            });
        },
        
        createContainer(config) {
            const { id, position, network, size } = config;
            
            // Verificar si ya existe
            let container = document.getElementById(id);
            if (container) {
                console.log(`📦 [${position}] Contenedor ya existe, actualizando...`);
                this.updateContainer(container, config);
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
            container.setAttribute('data-size', `${size.width}x${size.height}`);
            
            // Aplicar estilos según posición
            this.applyPositionStyles(container, position, size);
            
            // Añadir contenido inicial
            container.innerHTML = this.getInitialContent(position, network, size);
            
            // Insertar en el DOM
            this.insertContainerInDOM(container, position);
            
            // Guardar referencia
            this.containers.set(position, container);
            
            console.log(`✅ [${position}] Contenedor creado e insertado`);
            
            // Añadir marcador de visibilidad
            this.addVisibilityMarker(container, position);
            
            return container;
        },
        
        updateContainer(container, config) {
            // Actualizar atributos
            container.setAttribute('data-updated', new Date().toISOString());
            container.setAttribute('data-size', `${config.size.width}x${config.size.height}`);
            
            // Asegurar visibilidad
            container.style.display = 'block';
            container.style.visibility = 'visible';
            container.style.opacity = '1';
            
            // Si está vacío, añadir contenido inicial
            if (container.children.length === 0 || 
                (container.children.length === 1 && container.querySelector('.ad-loading'))) {
                container.innerHTML = this.getInitialContent(config.position, config.network, config.size);
            }
        },
        
        applyPositionStyles(container, position, size) {
            const baseStyles = `
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                background: rgba(0, 119, 190, 0.05) !important;
                border: 2px solid rgba(0, 255, 136, 0.3) !important;
                border-radius: 15px !important;
                padding: 10px !important;
                text-align: center !important;
                position: relative !important;
                z-index: 100 !important;
                overflow: visible !important;
            `;
            
            const positionStyles = {
                header: `
                    ${baseStyles}
                    width: 100% !important;
                    max-width: ${size.width}px !important;
                    min-height: ${size.height}px !important;
                    margin: 20px auto 30px auto !important;
                `,
                sidebar: `
                    ${baseStyles}
                    position: fixed !important;
                    right: 10px !important;
                    top: 50% !important;
                    transform: translateY(-50%) !important;
                    width: ${size.width}px !important;
                    min-height: ${size.height}px !important;
                    z-index: 1000 !important;
                    margin: 0 !important;
                `,
                footer: `
                    ${baseStyles}
                    width: 100% !important;
                    max-width: ${size.width}px !important;
                    min-height: ${size.height}px !important;
                    margin: 30px auto 20px auto !important;
                    background: rgba(0, 33, 66, 0.3) !important;
                `
            };
            
            container.style.cssText = positionStyles[position] || positionStyles.header;
        },
        
        getInitialContent(position, network, size) {
            const sizeText = `${size.width}x${size.height}`;
            
            return `
                <div class="ad-placeholder-content" style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: ${size.height}px;
                    color: rgba(255, 255, 255, 0.6);
                    font-family: system-ui, -apple-system, sans-serif;
                ">
                    <div style="font-size: 28px; margin-bottom: 10px;">📢</div>
                    <div style="font-size: 14px; font-weight: bold; margin-bottom: 5px;">
                        ${position.toUpperCase()} AD SPACE
                    </div>
                    <div style="font-size: 12px; opacity: 0.8; margin-bottom: 5px;">
                        ${sizeText}
                    </div>
                    <div style="font-size: 11px; opacity: 0.6;">
                        Cargando anuncios...
                    </div>
                    <div class="ad-status" style="
                        font-size: 10px;
                        margin-top: 10px;
                        padding: 4px 8px;
                        background: rgba(0, 255, 136, 0.2);
                        border-radius: 5px;
                        color: #00ff88;
                    ">
                        Preparando zona...
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
                        // Buscar el header principal
                        targetElement = document.querySelector('.main-header');
                        if (!targetElement) {
                            targetElement = document.querySelector('header');
                        }
                        
                        if (targetElement && targetElement.parentNode) {
                            // Insertar después del header
                            targetElement.parentNode.insertBefore(container, targetElement.nextSibling);
                            inserted = true;
                        } else {
                            // Fallback: buscar el contenedor principal
                            const mainContainer = document.querySelector('.main-container');
                            if (mainContainer) {
                                mainContainer.insertBefore(container, mainContainer.firstChild);
                                inserted = true;
                            } else {
                                // Último fallback: insertar al principio del body
                                document.body.insertBefore(container, document.body.firstChild);
                                inserted = true;
                            }
                        }
                        break;
                        
                    case 'sidebar':
                        // Sidebar siempre va al body como elemento fijo
                        document.body.appendChild(container);
                        inserted = true;
                        break;
                        
                    case 'footer':
                        // Buscar el footer principal
                        targetElement = document.querySelector('.main-footer');
                        if (!targetElement) {
                            targetElement = document.querySelector('footer');
                        }
                        
                        if (targetElement && targetElement.parentNode) {
                            // Insertar antes del footer
                            targetElement.parentNode.insertBefore(container, targetElement);
                            inserted = true;
                        } else {
                            // Fallback: añadir al final del body
                            document.body.appendChild(container);
                            inserted = true;
                        }
                        break;
                        
                    default:
                        document.body.appendChild(container);
                        inserted = true;
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
        
        addVisibilityMarker(container, position) {
            // Verificar si ya tiene marcador
            if (container.querySelector('.visibility-marker')) return;
            
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
            marker.textContent = position.toUpperCase();
            container.appendChild(marker);
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
                if (!container.style.zIndex || container.style.zIndex < 100) {
                    container.style.zIndex = container.classList.contains('ad-sidebar') ? '1000' : '100';
                }
                
                // Verificar y añadir marcador de visibilidad
                this.addVisibilityMarker(container, container.getAttribute('data-position') || `ad-${index + 1}`);
                
                // Log de estado
                const isVisible = this.isElementVisible(container);
                console.log(`👁️ [Container ${index + 1}] ${isVisible ? '✅' : '❌'} Visible:`, {
                    id: container.id,
                    visible: isVisible,
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
                    
                    console.warn(`⚠️ [Monitor] Contenedor oculto detectado: ${container.id}`);
                }
            });
            
            if (hiddenCount > 0) {
                console.warn(`⚠️ [Monitor] ${hiddenCount} contenedores ocultos, intentando corregir...`);
                this.forceContainerVisibility();
            }
        },
        
        verifyAndFixContainers() {
            console.log('🔧 [Ad Containers] Verificando y corrigiendo contenedores...');
            
            const allContainers = document.querySelectorAll('.ad-container');
            let fixedCount = 0;
            
            allContainers.forEach(container => {
                const hasAdContent = container.querySelector('.juicyads-zone, .adsbyexoclick, [data-exoclick-zoneid]');
                const isVisible = this.isElementVisible(container);
                
                // Si no es visible o está vacío, intentar corregir
                if (!isVisible || (!hasAdContent && container.children.length <= 1)) {
                    fixedCount++;
                    
                    // Forzar visibilidad
                    container.style.display = 'block';
                    container.style.visibility = 'visible';
                    container.style.opacity = '1';
                    
                    // Si está completamente vacío, añadir placeholder
                    if (container.children.length === 0) {
                        const position = container.getAttribute('data-position') || 'unknown';
                        const size = container.getAttribute('data-size') || '300x250';
                        const [width, height] = size.split('x');
                        
                        container.innerHTML = this.getInitialContent(
                            position,
                            'multi',
                            { width: parseInt(width), height: parseInt(height) }
                        );
                    }
                    
                    // Actualizar estado
                    this.updateContainerStatus(container, 'Esperando red de anuncios...');
                }
            });
            
            if (fixedCount > 0) {
                console.log(`🔧 [Ad Containers] ${fixedCount} contenedores corregidos`);
            }
        },
        
        logContainerStatus() {
            console.group('📊 [Ad Containers] Reporte de Estado');
            
            const allContainers = document.querySelectorAll('.ad-container');
            console.log(`Total de contenedores: ${allContainers.length}`);
            
            const statusReport = [];
            
            allContainers.forEach((container, index) => {
                const status = {
                    index: index + 1,
                    id: container.id,
                    position: container.getAttribute('data-position'),
                    network: container.getAttribute('data-network'),
                    size: container.getAttribute('data-size'),
                    visible: this.isElementVisible(container),
                    dimensions: {
                        width: container.offsetWidth,
                        height: container.offsetHeight
                    },
                    hasContent: container.children.length > 0,
                    hasAdZone: !!container.querySelector('.juicyads-zone, .adsbyexoclick, [data-exoclick-zoneid]'),
                    created: container.getAttribute('data-created'),
                    updated: container.getAttribute('data-updated')
                };
                
                const emoji = status.visible && status.hasAdZone ? '✅' : 
                            status.visible ? '⚠️' : '❌';
                
                console.log(`${emoji} Container ${status.index}:`, status);
                statusReport.push(status);
            });
            
            // Resumen
            const visibleCount = statusReport.filter(s => s.visible).length;
            const withAdsCount = statusReport.filter(s => s.hasAdZone).length;
            
            console.log('📈 Resumen:');
            console.log(`   - Visibles: ${visibleCount}/${allContainers.length}`);
            console.log(`   - Con anuncios: ${withAdsCount}/${allContainers.length}`);
            
            // Verificar redes específicas
            this.checkNetworkStatus();
            
            console.groupEnd();
            
            return statusReport;
        },
        
        checkNetworkStatus() {
            console.log('🔍 [Networks] Verificando estado de las redes...');
            
            // JuicyAds
            const juicyElements = document.querySelectorAll('[id*="juicyads"], .juicyads-zone');
            this.networkStatus.juicyads.loaded = juicyElements.length > 0;
            this.networkStatus.juicyads.zones = Array.from(juicyElements).map(el => ({
                id: el.id,
                parent: el.parentElement?.id,
                visible: this.isElementVisible(el)
            }));
            console.log(`🍊 JuicyAds: ${juicyElements.length} elementos`, 
                       this.networkStatus.juicyads.zones);
            
            // ExoClick
            const exoElements = document.querySelectorAll('[id*="exoclick"], .adsbyexoclick, [data-exoclick-zoneid], [data-zoneid]');
            this.networkStatus.exoclick.loaded = exoElements.length > 0;
            this.networkStatus.exoclick.zones = Array.from(exoElements).map(el => ({
                id: el.id || el.className,
                zoneId: el.getAttribute('data-zoneid') || el.getAttribute('data-exoclick-zoneid'),
                parent: el.parentElement?.id,
                visible: this.isElementVisible(el)
            }));
            console.log(`🔵 ExoClick: ${exoElements.length} elementos`, 
                       this.networkStatus.exoclick.zones);
            
            // PopAds
            const popAdsActive = window.e494ffb82839a29122608e933394c091 || 
                               document.querySelector('[data-cfasync="false"]') || 
                               document.getElementById('popads-indicator');
            this.networkStatus.popads.active = !!popAdsActive;
            this.networkStatus.popads.loaded = !!popAdsActive;
            console.log(`🚀 PopAds: ${this.networkStatus.popads.active ? 'Activo ✅' : 'Inactivo ❌'}`);
            
            // Resumen de redes
            const activeNetworks = [
                this.networkStatus.juicyads.loaded,
                this.networkStatus.exoclick.loaded,
                this.networkStatus.popads.loaded
            ].filter(Boolean).length;
            
            console.log(`📊 Redes activas: ${activeNetworks}/3`);
            
            return this.networkStatus;
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
        
        updateContainerStatus(container, status) {
            const statusElement = container.querySelector('.ad-status');
            if (statusElement) {
                statusElement.textContent = status;
                statusElement.style.background = status.includes('Activ') || status.includes('✅') ? 
                    'rgba(0, 255, 136, 0.3)' : 
                    'rgba(255, 165, 0, 0.3)';
            }
        },
        
        // API pública para interactuar con los contenedores
        getContainer(position) {
            return this.containers.get(position);
        },
        
        getAllContainers() {
            return Array.from(this.containers.values());
        },
        
        refreshContainers() {
            console.log('🔄 [Ad Containers] Refrescando contenedores...');
            this.forceContainerVisibility();
            this.verifyAndFixContainers();
            return this.logContainerStatus();
        },
        
        getNetworkStatus() {
            return this.checkNetworkStatus();
        },
        
        // Función para preparar contenedor para una red específica
        prepareContainerForNetwork(position, network, zoneId) {
            const container = this.getContainer(position);
            if (!container) {
                console.warn(`⚠️ No se encontró contenedor para ${position}`);
                return null;
            }
            
            console.log(`🎯 Preparando contenedor ${position} para ${network} (zona ${zoneId})`);
            
            // Limpiar contenido previo si es placeholder
            if (container.querySelector('.ad-placeholder-content')) {
                container.innerHTML = '';
            }
            
            // Actualizar atributos
            container.setAttribute('data-network', network);
            container.setAttribute('data-zone-id', zoneId);
            container.classList.add(`ad-${network}`);
            
            // Actualizar estado
            this.updateContainerStatus(container, `${network} preparado`);
            
            return container;
        },
        
        // Monitor de rendimiento
        getPerformanceMetrics() {
            const containers = document.querySelectorAll('.ad-container');
            const metrics = {
                totalContainers: containers.length,
                visibleContainers: 0,
                containersWithAds: 0,
                averageLoadTime: 0,
                networks: {
                    juicyads: { zones: 0, visible: 0 },
                    exoclick: { zones: 0, visible: 0 },
                    popads: { active: false }
                }
            };
            
            containers.forEach(container => {
                if (this.isElementVisible(container)) {
                    metrics.visibleContainers++;
                }
                
                if (container.querySelector('.juicyads-zone, .adsbyexoclick, [data-exoclick-zoneid]')) {
                    metrics.containersWithAds++;
                }
            });
            
            // Métricas por red
            const juicyZones = document.querySelectorAll('.juicyads-zone');
            metrics.networks.juicyads.zones = juicyZones.length;
            juicyZones.forEach(zone => {
                if (this.isElementVisible(zone)) {
                    metrics.networks.juicyads.visible++;
                }
            });
            
            const exoZones = document.querySelectorAll('.adsbyexoclick, [data-exoclick-zoneid]');
            metrics.networks.exoclick.zones = exoZones.length;
            exoZones.forEach(zone => {
                if (this.isElementVisible(zone)) {
                    metrics.networks.exoclick.visible++;
                }
            });
            
            metrics.networks.popads.active = !!window.e494ffb82839a29122608e933394c091;
            
            // Calcular tasa de éxito
            metrics.successRate = metrics.containersWithAds > 0 ? 
                ((metrics.containersWithAds / metrics.totalContainers) * 100).toFixed(1) + '%' : 
                '0%';
            
            return metrics;
        },
        
        // Función de diagnóstico completo
        runDiagnostics() {
            console.group('🏥 [Ad Containers] Diagnóstico Completo');
            
            console.log('1️⃣ Estado de contenedores:');
            const containerStatus = this.logContainerStatus();
            
            console.log('2️⃣ Estado de redes:');
            const networkStatus = this.getNetworkStatus();
            
            console.log('3️⃣ Métricas de rendimiento:');
            const metrics = this.getPerformanceMetrics();
            console.table(metrics);
            
            console.log('4️⃣ Problemas detectados:');
            const issues = [];
            
            if (metrics.visibleContainers < metrics.totalContainers) {
                issues.push(`${metrics.totalContainers - metrics.visibleContainers} contenedores no visibles`);
            }
            
            if (metrics.containersWithAds < metrics.totalContainers) {
                issues.push(`${metrics.totalContainers - metrics.containersWithAds} contenedores sin anuncios`);
            }
            
            if (!networkStatus.juicyads.loaded) {
                issues.push('JuicyAds no cargado');
            }
            
            if (!networkStatus.exoclick.loaded) {
                issues.push('ExoClick no cargado');
            }
            
            if (!networkStatus.popads.active) {
                issues.push('PopAds no activo');
            }
            
            if (issues.length > 0) {
                console.warn('⚠️ Problemas encontrados:', issues);
            } else {
                console.log('✅ No se detectaron problemas');
            }
            
            console.groupEnd();
            
            return {
                containers: containerStatus,
                networks: networkStatus,
                metrics: metrics,
                issues: issues
            };
        }
    };
    
    // Auto-inicializar
    AdContainersManager.init();
    
    // Exponer globalmente
    window.AdContainersManager = AdContainersManager;
    
    // Comandos de consola útiles
    window.refreshAds = () => AdContainersManager.refreshContainers();
    window.adStatus = () => AdContainersManager.getNetworkStatus();
    window.adMetrics = () => AdContainersManager.getPerformanceMetrics();
    window.adDiagnostics = () => AdContainersManager.runDiagnostics();
    
    console.log('✅ [Ad Containers] Manager v2.0.0 cargado completamente');
    console.log('💡 Comandos disponibles:');
    console.log('   window.refreshAds() - Refrescar contenedores');
    console.log('   window.adStatus() - Ver estado de las redes');
    console.log('   window.adMetrics() - Ver métricas de rendimiento');
    console.log('   window.adDiagnostics() - Ejecutar diagnóstico completo');
    
})();
