/**
 * Ad Containers Manager v3.0.0 FIXED
 * Sistema centralizado de gestión de contenedores de anuncios
 */

(function() {
    'use strict';
    
    // ============================
    // CONFIGURACIÓN REAL DE ZONE IDS
    // ============================
    
    const REAL_ZONE_IDS = {
        juicyads: {
            mobile_footer_banner: '1086026',
            desktop_sidebar_300x250: '1086027',
            mobile_sticky_footer: '1086028',
            desktop_header_728x90: '1086029',
            mobile_header_320x50: '1086030',
            desktop_footer_728x90: '1086031',
            mobile_interstitial: '1086032',
            desktop_popup: '1086033'
        },
        exoclick: {
            header: '5295286'
        },
        eroadvertising: {
            header: 'ero_1',
            sidebar: 'ero_2',
            footer: 'ero_3'
        },
        popads: {
            enabled: true,
            siteId: '494ffb82839a29122608e933394c091'
        }
    };
    
    // ============================
    // AD CONTAINERS MANAGER CLASS
    // ============================
    
    class AdContainersManager {
        constructor() {
            this.containers = new Map();
            this.observers = new Map();
            this.loadedAds = new Set();
            this.failedAds = new Set();
            this.retryCount = new Map();
            this.maxRetries = 3;
            this.retryDelay = 5000;
            this.initialized = false;
            
            // Configuración
            this.config = {
                lazyLoad: true,
                observerMargin: '50px',
                refreshInterval: 300000, // 5 minutos
                enableAutoRefresh: false,
                debug: false
            };
            
            // Estadísticas
            this.stats = {
                impressions: 0,
                loaded: 0,
                failed: 0,
                refreshed: 0,
                visibility: new Map()
            };
            
            this.initialize();
        }
        
        // ============================
        // INICIALIZACIÓN
        // ============================
        
        initialize() {
            if (this.initialized) return;
            
            console.log('🎯 Inicializando Ad Containers Manager v3.0.0');
            
            // Detectar contenedores existentes
            this.detectContainers();
            
            // Crear contenedores faltantes
            this.createMissingContainers();
            
            // Configurar observers
            if (this.config.lazyLoad) {
                this.setupLazyLoading();
            }
            
            // Configurar monitoreo
            this.setupMonitoring();
            
            // Auto-refresh si está habilitado
            if (this.config.enableAutoRefresh) {
                this.setupAutoRefresh();
            }
            
            this.initialized = true;
            
            console.log(`✅ AdContainersManager inicializado con ${this.containers.size} contenedores`);
        }
        
        // ============================
        // DETECCIÓN DE CONTENEDORES
        // ============================
        
        detectContainers() {
            // JuicyAds containers
            const juicySelectors = [
                '[id^="ja_"]',
                '.jaads',
                '[data-zone*="1086"]'
            ];
            
            juicySelectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(element => {
                    this.registerContainer('juicyads', element);
                });
            });
            
            // ExoClick containers
            const exoSelectors = [
                '.adsbyexoclick',
                '[data-zoneid="5295286"]',
                '[id*="exoclick"]'
            ];
            
            exoSelectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(element => {
                    this.registerContainer('exoclick', element);
                });
            });
            
            // EroAdvertising containers
            const eroSelectors = [
                '[id^="ero_"]',
                '.eroadvertising',
                '[data-ero-zone]'
            ];
            
            eroSelectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(element => {
                    this.registerContainer('eroadvertising', element);
                });
            });
            
            console.log(`🔍 Detectados ${this.containers.size} contenedores de anuncios`);
        }
        
        // ============================
        // CREACIÓN DE CONTENEDORES
        // ============================
        
        createMissingContainers() {
            const containerConfigs = [
                {
                    id: 'ja_header_desktop',
                    network: 'juicyads',
                    zoneId: REAL_ZONE_IDS.juicyads.desktop_header_728x90,
                    size: '728x90',
                    position: 'header',
                    device: 'desktop'
                },
                {
                    id: 'ja_header_mobile',
                    network: 'juicyads',
                    zoneId: REAL_ZONE_IDS.juicyads.mobile_header_320x50,
                    size: '320x50',
                    position: 'header',
                    device: 'mobile'
                },
                {
                    id: 'exo_header',
                    network: 'exoclick',
                    zoneId: REAL_ZONE_IDS.exoclick.header,
                    size: 'responsive',
                    position: 'header',
                    device: 'all'
                },
                {
                    id: 'ja_sidebar',
                    network: 'juicyads',
                    zoneId: REAL_ZONE_IDS.juicyads.desktop_sidebar_300x250,
                    size: '300x250',
                    position: 'sidebar',
                    device: 'desktop'
                },
                {
                    id: 'ja_footer_desktop',
                    network: 'juicyads',
                    zoneId: REAL_ZONE_IDS.juicyads.desktop_footer_728x90,
                    size: '728x90',
                    position: 'footer',
                    device: 'desktop'
                },
                {
                    id: 'ja_footer_mobile',
                    network: 'juicyads',
                    zoneId: REAL_ZONE_IDS.juicyads.mobile_footer_banner,
                    size: '320x100',
                    position: 'footer',
                    device: 'mobile'
                }
            ];
            
            containerConfigs.forEach(config => {
                if (!document.getElementById(config.id)) {
                    this.createContainer(config);
                }
            });
        }
        
        createContainer(config) {
            const container = document.createElement('div');
            container.id = config.id;
            container.className = `ad-container ad-${config.network} ad-${config.position}`;
            container.dataset.network = config.network;
            container.dataset.zoneId = config.zoneId;
            container.dataset.size = config.size;
            container.dataset.device = config.device;
            
            // Estilos base
            container.style.cssText = `
                width: 100%;
                max-width: ${config.size === 'responsive' ? '100%' : config.size.split('x')[0] + 'px'};
                min-height: ${config.size === 'responsive' ? '250px' : config.size.split('x')[1] + 'px'};
                margin: 10px auto;
                display: ${this.shouldShowOnDevice(config.device) ? 'block' : 'none'};
                text-align: center;
                background: rgba(0,0,0,0.02);
                border-radius: 8px;
                overflow: hidden;
            `;
            
            // Insertar en la posición correcta
            const target = this.findInsertionPoint(config.position);
            if (target) {
                target.appendChild(container);
                this.registerContainer(config.network, container);
                console.log(`✅ Creado contenedor: ${config.id}`);
            }
        }
        
        findInsertionPoint(position) {
            const targets = {
                header: document.querySelector('.header-ads, header, .top-banner, #header'),
                sidebar: document.querySelector('.sidebar-ads, aside, .sidebar, #sidebar'),
                footer: document.querySelector('.footer-ads, footer, .bottom-banner, #footer'),
                content: document.querySelector('.content-ads, main, .main-content, #content')
            };
            
            return targets[position] || document.body;
        }
        
        shouldShowOnDevice(device) {
            if (device === 'all') return true;
            
            const isMobile = window.innerWidth <= 768;
            return (device === 'mobile' && isMobile) || (device === 'desktop' && !isMobile);
        }
        
        // ============================
        // REGISTRO DE CONTENEDORES
        // ============================
        
        registerContainer(network, element) {
            const id = element.id || `ad_${network}_${Date.now()}`;
            
            if (!element.id) {
                element.id = id;
            }
            
            this.containers.set(id, {
                element,
                network,
                zoneId: element.dataset.zoneId || this.extractZoneId(element),
                loaded: false,
                visible: false,
                impressions: 0,
                lastLoad: null,
                lastRefresh: null
            });
            
            // Añadir atributos de tracking
            element.dataset.adTracking = 'true';
            element.dataset.adNetwork = network;
        }
        
        extractZoneId(element) {
            // Intentar extraer zone ID de diferentes fuentes
            const possibleSources = [
                element.dataset.zoneId,
                element.dataset.zone,
                element.id?.match(/\d+/)?.[0],
                element.className?.match(/zone-(\d+)/)?.[1]
            ];
            
            return possibleSources.find(id => id) || 'unknown';
        }
        
        // ============================
        // LAZY LOADING
        // ============================
        
        setupLazyLoading() {
            if (!('IntersectionObserver' in window)) {
                console.warn('⚠️ IntersectionObserver no soportado, cargando todos los anuncios');
                this.loadAllAds();
                return;
            }
            
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.loadAd(entry.target.id);
                        }
                        
                        // Actualizar visibilidad
                        const container = this.containers.get(entry.target.id);
                        if (container) {
                            container.visible = entry.isIntersecting;
                            this.updateVisibilityStats(entry.target.id, entry.isIntersecting);
                        }
                    });
                },
                {
                    rootMargin: this.config.observerMargin,
                    threshold: 0.1
                }
            );
            
            this.containers.forEach((container, id) => {
                observer.observe(container.element);
                this.observers.set(id, observer);
            });
        }
        
        // ============================
        // CARGA DE ANUNCIOS
        // ============================
        
        loadAd(containerId) {
            const container = this.containers.get(containerId);
            if (!container || container.loaded || this.loadedAds.has(containerId)) {
                return;
            }
            
            console.log(`📥 Cargando anuncio: ${containerId}`);
            
            try {
                switch (container.network) {
                    case 'juicyads':
                        this.loadJuicyAd(container);
                        break;
                    case 'exoclick':
                        this.loadExoClickAd(container);
                        break;
                    case 'eroadvertising':
                        this.loadEroAd(container);
                        break;
                    default:
                        console.warn(`⚠️ Red desconocida: ${container.network}`);
                }
                
                container.loaded = true;
                container.lastLoad = Date.now();
                this.loadedAds.add(containerId);
                this.stats.loaded++;
                
            } catch (error) {
                console.error(`❌ Error cargando anuncio ${containerId}:`, error);
                this.handleLoadError(containerId);
            }
        }
        
        loadJuicyAd(container) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.dataset.zone = container.zoneId;
            script.src = `https://poweredby.jads.co/js/jads.js`;
            
            script.onload = () => {
                console.log(`✅ JuicyAds cargado: ${container.element.id}`);
            };
            
            script.onerror = () => {
                this.handleLoadError(container.element.id);
            };
            
            container.element.appendChild(script);
        }
        
        loadExoClickAd(container) {
            // Crear iframe para ExoClick
            const iframe = document.createElement('iframe');
            iframe.src = `https://syndication.exoclick.com/ads.php?idzone=${container.zoneId}`;
            iframe.style.cssText = 'width:100%;height:100%;border:0;';
            iframe.loading = 'lazy';
            
            iframe.onload = () => {
                console.log(`✅ ExoClick cargado: ${container.element.id}`);
            };
            
            iframe.onerror = () => {
                this.handleLoadError(container.element.id);
            };
            
            container.element.appendChild(iframe);
        }
        
        loadEroAd(container) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.src = `https://www.eroadvertising.com/script/${container.zoneId}.js`;
            
            script.onload = () => {
                console.log(`✅ EroAdvertising cargado: ${container.element.id}`);
            };
            
            script.onerror = () => {
                this.handleLoadError(container.element.id);
            };
            
            container.element.appendChild(script);
        }
        
        loadAllAds() {
            this.containers.forEach((container, id) => {
                this.loadAd(id);
            });
        }
        
        // ============================
        // MANEJO DE ERRORES
        // ============================
        
        handleLoadError(containerId) {
            this.failedAds.add(containerId);
            this.stats.failed++;
            
            const retries = this.retryCount.get(containerId) || 0;
            
            if (retries < this.maxRetries) {
                console.log(`🔄 Reintentando ${containerId} (${retries + 1}/${this.maxRetries})`);
                this.retryCount.set(containerId, retries + 1);
                
                setTimeout(() => {
                    const container = this.containers.get(containerId);
                    if (container) {
                        container.loaded = false;
                        this.loadedAds.delete(containerId);
                        this.failedAds.delete(containerId);
                        this.loadAd(containerId);
                    }
                }, this.retryDelay * (retries + 1));
            } else {
                console.error(`❌ Fallo definitivo al cargar ${containerId}`);
                this.showFallback(containerId);
            }
        }
        
        showFallback(containerId) {
            const container = this.containers.get(containerId);
            if (!container) return;
            
            container.element.innerHTML = `
                <div style="
                    padding: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 8px;
                    text-align: center;
                ">
                    <p style="margin: 0; font-size: 14px;">📢 Espacio publicitario</p>
                </div>
            `;
        }
        
        // ============================
        // MONITOREO Y ESTADÍSTICAS
        // ============================
        
        setupMonitoring() {
            // Monitorear cambios en el DOM
            const observer = new MutationObserver(() => {
                this.detectContainers();
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            // Monitorear resize para responsive ads
            window.addEventListener('resize', this.debounce(() => {
                this.updateResponsiveAds();
            }, 250));
        }
        
        updateVisibilityStats(containerId, isVisible) {
            if (!this.stats.visibility.has(containerId)) {
                this.stats.visibility.set(containerId, {
                    totalTime: 0,
                    lastVisible: null,
                    impressions: 0
                });
            }
            
            const stats = this.stats.visibility.get(containerId);
            
            if (isVisible) {
                stats.lastVisible = Date.now();
                stats.impressions++;
                this.stats.impressions++;
            } else if (stats.lastVisible) {
                stats.totalTime += Date.now() - stats.lastVisible;
                stats.lastVisible = null;
            }
        }
        
        updateResponsiveAds() {
            this.containers.forEach((container, id) => {
                const element = container.element;
                const device = element.dataset.device;
                
                if (device && device !== 'all') {
                    element.style.display = this.shouldShowOnDevice(device) ? 'block' : 'none';
                }
            });
        }
        
        // ============================
        // AUTO REFRESH
        // ============================
        
        setupAutoRefresh() {
            setInterval(() => {
                this.refresh();
            }, this.config.refreshInterval);
        }
        
        refresh() {
            console.log('🔄 Refrescando anuncios visibles...');
            
            this.containers.forEach((container, id) => {
                if (container.visible && container.loaded) {
                    const timeSinceLoad = Date.now() - container.lastLoad;
                    
                    if (timeSinceLoad > this.config.refreshInterval) {
                        this.refreshAd(id);
                    }
                }
            });
        }
        
        refreshAd(containerId) {
            const container = this.containers.get(containerId);
            if (!container) return;
            
            console.log(`🔄 Refrescando: ${containerId}`);
            
            // Limpiar contenido actual
            container.element.innerHTML = '';
            
            // Reset estado
            container.loaded = false;
            this.loadedAds.delete(containerId);
            
            // Recargar
            this.loadAd(containerId);
            
            container.lastRefresh = Date.now();
            this.stats.refreshed++;
        }
        
        // ============================
        // UTILIDADES
        // ============================
        
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
        
        // ============================
        // API PÚBLICA
        // ============================
        
        getStatus() {
            const status = {
                initialized: this.initialized,
                containers: this.containers.size,
                loaded: this.loadedAds.size,
                failed: this.failedAds.size,
                visible: Array.from(this.containers.values()).filter(c => c.visible).length
            };
            
            console.table(status);
            return status;
        }
        
        getContainer(id) {
            return this.containers.get(id);
        }
        
        getAllContainers() {
            return Array.from(this.containers.entries());
        }
        
        getStats() {
            return {
                ...this.stats,
                visibility: Array.from(this.stats.visibility.entries()).map(([id, stats]) => ({
                    id,
                    ...stats
                }))
            };
        }
        
        getMetrics() {
            const metrics = {
                loadRate: this.stats.loaded / Math.max(1, this.containers.size),
                failRate: this.stats.failed / Math.max(1, this.stats.loaded + this.stats.failed),
                avgVisibleTime: this.calculateAvgVisibleTime(),
                refreshRate: this.stats.refreshed / Math.max(1, this.stats.loaded)
            };
            
            console.table(metrics);
            return metrics;
        }
        
        calculateAvgVisibleTime() {
            let totalTime = 0;
            let count = 0;
            
            this.stats.visibility.forEach(stats => {
                if (stats.totalTime > 0) {
                    totalTime += stats.totalTime;
                    count++;
                }
            });
            
            return count > 0 ? totalTime / count : 0;
        }
        
        // ============================
        // DEBUGGING
        // ============================
        
        debug() {
            console.log('🔍 AD CONTAINERS MANAGER DEBUG');
            console.log('================================');
            
            // 1. Verificar configuración
            console.log('1️⃣ Configuración:');
            console.log('   Zone IDs:', REAL_ZONE_IDS);
            
            // 2. Verificar contenedores
            console.log('\n2️⃣ Contenedores:');
            this.getStatus();
            
            // 3. Verificar redes
            console.log('\n3️⃣ Redes de anuncios:');
            this.checkNetworks();
            
            // 4. Verificar métricas
            console.log('\n4️⃣ Métricas:');
            this.getMetrics();
            
            // 5. Verificar errores comunes
            console.log('\n5️⃣ Verificación de errores:');
            this.checkCommonIssues();
            
            console.log('\n✅ Diagnóstico completado');
        }
        
        checkNetworks() {
            const networks = {
                JuicyAds: !!window.juicyads || !!document.querySelector('[src*="jads.co"]'),
                ExoClick: !!document.querySelector('[src*="exoclick.com"]'),
                EroAdvertising: !!document.querySelector('[src*="eroadvertising.com"]'),
                PopAds: !!window.PopAds || !!window.popns
            };
            
            Object.entries(networks).forEach(([name, loaded]) => {
                console.log(`   ${name}: ${loaded ? '✅' : '❌'}`);
            });
        }
        
        checkCommonIssues() {
            const issues = [];
            
            // Verificar bloqueadores de anuncios
            const testAd = document.createElement('div');
            testAd.className = 'ad-test google-ad advertisement';
            testAd.style.position = 'absolute';
            testAd.style.left = '-9999px';
            document.body.appendChild(testAd);
            
            setTimeout(() => {
                if (testAd.offsetHeight === 0) {
                    issues.push('⚠️ Posible bloqueador de anuncios detectado');
                }
                testAd.remove();
            }, 100);
            
            // Verificar CSP
            if (document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
                issues.push('⚠️ CSP detectado - puede bloquear algunos anuncios');
            }
            
            // Verificar iframes bloqueados
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                if (!iframe.src || iframe.src.includes('about:blank')) {
                    issues.push(`⚠️ iframe vacío detectado: ${iframe.id || 'sin ID'}`);
                }
            });
            
            if (issues.length > 0) {
                console.log('⚠️ Problemas detectados:');
                issues.forEach(issue => console.log(`   ${issue}`));
            } else {
                console.log('✅ No se detectaron problemas comunes');
            }
        }
        
        getConfig() {
            return {
                zoneIds: REAL_ZONE_IDS,
                config: this.config,
                stats: this.stats,
                containers: Array.from(this.containers.entries()).map(([id, data]) => ({
                    id,
                    ...data,
                    element: undefined // No serializar el elemento DOM
                }))
            };
        }
        
        setupCommands() {
            // Exponer comandos globales
            window.refreshAds = () => this.refresh();
            window.adStatus = () => this.getStatus();
            window.adMetrics = () => this.getMetrics();
            window.adDebug = () => this.debug();
            
            console.log('📝 Comandos disponibles:');
            console.log('   - refreshAds(): Refrescar anuncios');
            console.log('   - adStatus(): Ver estado');
            console.log('   - adMetrics(): Ver métricas');
            console.log('   - adDebug(): Debug completo');
        }
    }
    
    // ============================
    // INICIALIZACIÓN GLOBAL
    // ============================
    
    // Crear instancia global
    window.AdContainersManager = new AdContainersManager();
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.AdContainersManager.setupCommands();
        });
    } else {
        window.AdContainersManager.setupCommands();
    }
    
    // Log de confirmación
    console.log('✅ Ad Containers Manager v3.0.0 FIXED cargado');
    
})();
