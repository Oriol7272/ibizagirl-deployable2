// ad-containers-manager.js v3.1.0 - FIXED ExoClick URLs
// Sistema centralizado de gestión de contenedores de anuncios con IDs REALES de dashboards
// Actualizado: 2024 con URLs correctas

(function() {
    'use strict';
    
    console.log('📦 [Ad Containers] Inicializando gestor v3.1.0 con IDs REALES y URLs CORREGIDAS...');
    
    // Configuración REAL de zone IDs desde los dashboards
    const REAL_ZONE_IDS = {
        juicyads: {
            header: 1098658,
            sidebar: 1098518,
            footer: 1098656,
            extra1: 1098519,
            extra2: 1098657
        },
        exoclick: {
            all: 5696328  // Una única zona para todas las posiciones
        },
        eroadvertising: {
            ibizagirl: 8177575,
            beach: 8179717
        },
        popads: {
            main: 5226178
        }
    };
    
    console.log('🎯 Zone IDs configurados:', REAL_ZONE_IDS);
    
    // Manager principal
    class AdContainersManager {
        constructor() {
            this.containers = new Map();
            this.config = {
                positions: ['header', 'sidebar', 'footer'],
                networks: ['juicyads', 'exoclick', 'eroadvertising'],
                refreshInterval: 30000,
                maxRetries: 3,
                retryDelay: 2000
            };
            this.stats = {
                created: 0,
                visible: 0,
                withAds: 0,
                errors: 0
            };
            this.initialized = false;
        }
        
        init() {
            if (this.initialized) {
                console.log('⚠️ [Ad Containers] Ya inicializado');
                return;
            }
            
            this.setupContainers();
            this.setupMonitoring();
            this.setupCommands();
            this.initialized = true;
            
            console.log('✅ [Ad Containers] Manager inicializado con URLs corregidas');
        }
        
        setupContainers() {
            console.log('📦 [Ad Containers] Configurando contenedores con zone IDs reales...');
            
            // Limpiar contenedores existentes
            this.clearExistingContainers();
            
            // Crear nuevos contenedores
            this.createAllContainers();
            
            // Aplicar estilos optimizados
            this.applyStyles();
            
            // Forzar visibilidad inicial
            setTimeout(() => this.forceVisibility(), 1000);
        }
        
        clearExistingContainers() {
            // Remover contenedores antiguos o duplicados
            document.querySelectorAll('[id^="ad-"]').forEach(el => {
                if (!el.dataset.managed) {
                    el.remove();
                }
            });
        }
        
        createAllContainers() {
            const containerConfigs = [
                // JuicyAds
                { network: 'juicyads', position: 'header', zoneId: REAL_ZONE_IDS.juicyads.header },
                { network: 'juicyads', position: 'sidebar', zoneId: REAL_ZONE_IDS.juicyads.sidebar },
                { network: 'juicyads', position: 'footer', zoneId: REAL_ZONE_IDS.juicyads.footer },
                
                // ExoClick - Una zona para todas las posiciones
                { network: 'exoclick', position: 'header', zoneId: REAL_ZONE_IDS.exoclick.all },
                { network: 'exoclick', position: 'sidebar', zoneId: REAL_ZONE_IDS.exoclick.all },
                { network: 'exoclick', position: 'footer', zoneId: REAL_ZONE_IDS.exoclick.all },
                
                // EroAdvertising
                { network: 'eroadvertising', position: 'header', zoneId: REAL_ZONE_IDS.eroadvertising.ibizagirl },
                { network: 'eroadvertising', position: 'footer', zoneId: REAL_ZONE_IDS.eroadvertising.beach }
            ];
            
            console.log(`📋 Creando ${containerConfigs.length} contenedores con IDs reales y URLs corregidas...`);
            
            containerConfigs.forEach(config => {
                this.createContainer(config);
            });
        }
        
        createContainer({ network, position, zoneId }) {
            const containerId = `ad-${network}-${position}-${zoneId}`;
            
            // Evitar duplicados
            if (document.getElementById(containerId)) {
                console.log(`⚠️ Contenedor ${containerId} ya existe`);
                return;
            }
            
            const container = document.createElement('div');
            container.id = containerId;
            container.className = `ad-container ad-${network} ad-${position}`;
            container.dataset.managed = 'true';
            container.dataset.network = network;
            container.dataset.position = position;
            container.dataset.zoneId = zoneId;
            
            // Aplicar estilos base con min-height para prevenir CLS
            Object.assign(container.style, {
                display: 'block',
                visibility: 'visible',
                opacity: '1',
                minHeight: position === 'sidebar' ? '250px' : '90px',
                width: '100%',
                marginBottom: '20px',
                position: 'relative',
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
            });
            
            // Z-index específico por posición
            if (position === 'sidebar') {
                container.style.zIndex = '2000';
            } else {
                container.style.zIndex = '100';
            }
            
            // Contenido específico por red
            this.prepareForNetwork(container, network, position, zoneId);
            
            // Registrar contenedor
            this.containers.set(containerId, {
                element: container,
                network,
                position,
                zoneId,
                created: Date.now(),
                hasAd: false
            });
            
            console.log(`✅ [${network}/${position}] Contenedor creado con zona ${zoneId}`);
            
            this.stats.created++;
        }
        
        prepareForNetwork(container, network, position, zoneId) {
            switch(network) {
                case 'juicyads':
                    // JuicyAds usa divs con IDs específicos
                    const jaDiv = document.createElement('div');
                    jaDiv.id = `ja_${zoneId}`;
                    jaDiv.className = 'juicyads-unit';
                    jaDiv.style.cssText = 'width: 100%; height: 100%; min-height: 90px;';
                    container.appendChild(jaDiv);
                    break;
                    
                case 'exoclick':
                    // ExoClick usa iframes - URL CORREGIDA
                    const iframe = document.createElement('iframe');
                    // URL CORRECTA: iframe.php en lugar de ads-iframe.php
                    iframe.src = `https://syndication.exoclick.com/iframe.php?idzone=${zoneId}&size=auto`;
                    iframe.style.cssText = 'width: 100%; height: 100%; border: 0; min-height: 250px;';
                    iframe.setAttribute('scrolling', 'no');
                    iframe.setAttribute('marginwidth', '0');
                    iframe.setAttribute('marginheight', '0');
                    iframe.setAttribute('frameborder', '0');
                    iframe.setAttribute('loading', 'lazy');
                    
                    // Agregar listener para ajustar altura cuando cargue
                    iframe.onload = function() {
                        console.log(`✅ ExoClick iframe ${position} (${zoneId}) cargado correctamente`);
                        try {
                            // Intentar ajustar altura al contenido
                            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                            const height = iframeDoc.body.scrollHeight;
                            if (height > 0) {
                                iframe.style.height = height + 'px';
                                container.style.minHeight = height + 'px';
                            }
                        } catch(e) {
                            // Cross-origin, mantener altura por defecto
                        }
                    };
                    
                    iframe.onerror = function() {
                        console.error(`❌ Error cargando ExoClick iframe para zona ${zoneId}`);
                        // Reintentar con URL alternativa si falla
                        setTimeout(() => {
                            iframe.src = `https://syndication.exoclick.com/iframe.php?idzone=${zoneId}`;
                        }, 2000);
                    };
                    
                    container.appendChild(iframe);
                    break;
                    
                case 'eroadvertising':
                    // EroAdvertising usa divs con IDs específicos
                    const eroDiv = document.createElement('div');
                    eroDiv.id = `ero_${zoneId}`;
                    eroDiv.className = 'eroadvertising-unit';
                    eroDiv.innerHTML = `
                        <ins class="ero-ads-instantbanner" 
                             data-zone="${zoneId}"
                             data-tag="IbizaGirl.pics"
                             style="display: block; width: 100%; height: auto;">
                        </ins>
                    `;
                    container.appendChild(eroDiv);
                    break;
            }
        }
        
        insertIntoDOM(container, position) {
            let targetElement;
            
            switch(position) {
                case 'header':
                    targetElement = document.querySelector('.ad-section-header') || 
                                  document.querySelector('.hero-section') ||
                                  document.querySelector('header');
                    break;
                case 'sidebar':
                    targetElement = document.querySelector('.ad-section-sidebar') || 
                                  document.querySelector('.sidebar') ||
                                  document.querySelector('aside');
                    break;
                case 'footer':
                    targetElement = document.querySelector('.ad-section-footer') || 
                                  document.querySelector('footer') ||
                                  document.querySelector('.footer-section');
                    break;
            }
            
            if (targetElement) {
                // Limpiar contenido anterior si existe
                const existingAd = targetElement.querySelector('.ad-container');
                if (existingAd) {
                    existingAd.remove();
                }
                
                targetElement.appendChild(container);
                console.log(`📍 [${position}] Contenedor insertado en el DOM`);
            } else {
                // Crear sección si no existe
                this.createAdSection(position, container);
            }
        }
        
        createAdSection(position, container) {
            const section = document.createElement('div');
            section.className = `ad-section ad-section-${position}`;
            section.style.cssText = `
                width: 100%;
                padding: 20px 0;
                text-align: center;
                position: relative;
                z-index: ${position === 'sidebar' ? '2000' : '100'};
            `;
            
            section.appendChild(container);
            
            // Insertar en el lugar apropiado
            const insertPoint = position === 'header' ? 
                document.body.firstChild : 
                document.body;
                
            if (position === 'header' && insertPoint) {
                document.body.insertBefore(section, insertPoint);
            } else {
                document.body.appendChild(section);
            }
        }
        
        applyStyles() {
            const styleId = 'ad-containers-styles';
            if (!document.getElementById(styleId)) {
                const style = document.createElement('style');
                style.id = styleId;
                style.textContent = `
                    /* Estilos para contenedores de anuncios */
                    .ad-container {
                        display: block !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                        position: relative;
                        margin: 20px auto;
                        background: rgba(0, 0, 0, 0.02);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 4px;
                        overflow: hidden;
                        transition: all 0.3s ease;
                    }
                    
                    /* Prevenir CLS con alturas mínimas */
                    .ad-header { min-height: 90px; }
                    .ad-sidebar { min-height: 250px; }
                    .ad-footer { min-height: 90px; }
                    
                    /* Animación de carga */
                    .ad-container::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 100%;
                        height: 2px;
                        background: linear-gradient(90deg, 
                            transparent, 
                            rgba(255, 20, 147, 0.5), 
                            transparent);
                        animation: loading 2s linear infinite;
                    }
                    
                    @keyframes loading {
                        to { left: 100%; }
                    }
                    
                    /* Responsivo */
                    @media (max-width: 768px) {
                        .ad-container {
                            margin: 10px auto;
                            max-width: 100%;
                        }
                        
                        .ad-sidebar {
                            min-height: 200px;
                        }
                    }
                    
                    /* Fix para iframes de ExoClick */
                    .ad-exoclick iframe {
                        display: block !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                        width: 100% !important;
                        min-height: 250px;
                        border: none;
                    }
                    
                    /* Asegurar visibilidad de JuicyAds */
                    .juicyads-unit {
                        display: block !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                    }
                    
                    /* Asegurar visibilidad de EroAdvertising */
                    .eroadvertising-unit,
                    .ero-ads-instantbanner {
                        display: block !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        forceVisibility() {
            console.log('👁️ [Ad Containers] Forzando visibilidad de contenedores...');
            
            const results = [];
            this.containers.forEach((data, id) => {
                const element = document.getElementById(id);
                if (element) {
                    // Forzar visibilidad
                    element.style.display = 'block';
                    element.style.visibility = 'visible';
                    element.style.opacity = '1';
                    
                    // Verificar contenido
                    const hasIframe = element.querySelector('iframe') !== null;
                    const hasIns = element.querySelector('ins') !== null;
                    const hasContent = element.children.length > 0;
                    
                    // Actualizar datos
                    data.hasAd = hasIframe || hasIns || hasContent;
                    data.visible = true;
                    
                    // Reporte
                    const rect = element.getBoundingClientRect();
                    results.push({
                        id,
                        visible: true,
                        dimensions: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
                        position: data.position,
                        network: data.network,
                        hasAd: data.hasAd,
                        zoneId: data.zoneId
                    });
                    
                    this.stats.visible++;
                    if (data.hasAd) this.stats.withAds++;
                }
            });
            
            results.forEach((r, i) => {
                console.log(`👁️ [Container ${i + 1}] ${r.hasAd ? '✅' : '⚠️'} Visible:`, r);
            });
        }
        
        setupMonitoring() {
            // Monitoreo periódico
            setInterval(() => {
                this.checkContainers();
            }, this.config.refreshInterval);
            
            // Observer para cambios en el DOM
            const observer = new MutationObserver(() => {
                this.checkContainers();
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class']
            });
        }
        
        checkContainers() {
            let needsFix = false;
            
            this.containers.forEach((data, id) => {
                const element = document.getElementById(id);
                if (element) {
                    const isVisible = element.style.display !== 'none' && 
                                    element.style.visibility !== 'hidden' &&
                                    element.style.opacity !== '0';
                    
                    if (!isVisible) {
                        needsFix = true;
                    }
                } else {
                    needsFix = true;
                }
            });
            
            if (needsFix) {
                console.log('🔧 [Ad Containers] Verificando y corrigiendo contenedores...');
                this.forceVisibility();
            }
        }
        
        refresh() {
            console.log('🔄 [Ad Containers] Refrescando todos los contenedores...');
            
            this.containers.forEach((data, id) => {
                const element = document.getElementById(id);
                if (element) {
                    const network = data.network;
                    const zoneId = data.zoneId;
                    
                    if (network === 'exoclick') {
                        const iframe = element.querySelector('iframe');
                        if (iframe) {
                            // Recargar iframe con URL correcta
                            const currentSrc = iframe.src;
                            iframe.src = '';
                            setTimeout(() => {
                                iframe.src = `https://syndication.exoclick.com/iframe.php?idzone=${zoneId}&t=${Date.now()}`;
                            }, 100);
                        }
                    }
                }
            });
            
            // Forzar visibilidad después del refresh
            setTimeout(() => this.forceVisibility(), 1000);
        }
        
        getStatus() {
            console.log('📊 [Ad Containers] Reporte de Estado con IDs REALES');
            console.log('================================');
            console.log(`Total de contenedores: ${this.containers.size}`);
            
            const details = [];
            this.containers.forEach((data, id) => {
                const element = document.getElementById(id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const computed = window.getComputedStyle(element);
                    
                    details.push({
                        id,
                        position: data.position,
                        network: data.network,
                        zoneId: data.zoneId,
                        visible: computed.display !== 'none' && computed.visibility !== 'hidden',
                        dimensions: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
                        hasAd: data.hasAd,
                        created: new Date(data.created).toLocaleTimeString()
                    });
                }
            });
            
            details.forEach((d, i) => {
                console.log(`${d.visible ? '✅' : '❌'} Container ${i + 1}:`, d);
            });
            
            console.log('\n📈 Resumen:');
            console.log(`   - Visibles: ${this.stats.visible}/${this.stats.created}`);
            console.log(`   - Con anuncios: ${this.stats.withAds}/${this.stats.created}`);
            console.log(`🎯 Zone IDs configurados:`, REAL_ZONE_IDS);
        }
        
        checkNetworks() {
            console.log('🔍 [Networks] Verificando estado de las redes con IDs reales...');
            
            // JuicyAds
            const juicyAds = document.querySelectorAll('[id^="ja_"]');
            console.log(`🟠 JuicyAds: ${juicyAds.length} elementos`, juicyAds);
            
            // ExoClick
            const exoClick = document.querySelectorAll('.ad-exoclick iframe');
            console.log(`🔵 ExoClick: ${exoClick.length} elementos`, exoClick);
            
            // EroAdvertising
            const eroAds = document.querySelectorAll('[id^="ero_"]');
            console.log(`🟣 EroAdvertising: ${eroAds.length} elementos`, eroAds);
            
            // PopAds
            const popAds = window.PopAds || window.popads;
            if (popAds) {
                console.log(`🚀 PopAds (${REAL_ZONE_IDS.popads.main}): Activo ✅`);
            } else {
                console.log('🚀 PopAds: No detectado ❌');
            }
            
            const activeNetworks = [
                juicyAds.length > 0,
                exoClick.length > 0,
                eroAds.length > 0,
                !!popAds
            ].filter(Boolean).length;
            
            console.log(`📊 Redes activas: ${activeNetworks}/4`);
        }
        
        getMetrics() {
            const metrics = {
                performance: {
                    loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
                    domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
                    renderTime: performance.timing.domComplete - performance.timing.domLoading
                },
                containers: {
                    total: this.containers.size,
                    visible: this.stats.visible,
                    withAds: this.stats.withAds,
                    errors: this.stats.errors
                },
                coverage: {
                    header: 0,
                    sidebar: 0,
                    footer: 0
                }
            };
            
            // Calcular cobertura por posición
            this.containers.forEach((data) => {
                if (data.hasAd) {
                    metrics.coverage[data.position]++;
                }
            });
            
            console.log('📊 [Metrics] Métricas de rendimiento:', metrics);
            return metrics;
        }
        
        diagnostics() {
            console.log('🔍 [Diagnostics] Ejecutando diagnóstico completo...');
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
            window.adDiagnostics = () => this.diagnostics();
            window.adConfig = () => this.getConfig();
            window.checkNetworks = () => this.checkNetworks();
            window.forceAds = () => this.forceVisibility();
        }
    }
    
    // Inicialización automática
    const manager = new AdContainersManager();
    
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => manager.init());
    } else {
        // DOM ya está listo
        setTimeout(() => manager.init(), 100);
    }
    
    // Exponer manager globalmente para debugging
    window.AdContainersManager = manager;
    
    console.log('✅ [Ad Containers] Manager v3.1.0 cargado con IDs REALES y URLs CORREGIDAS');
    console.log('💡 Comandos disponibles:');
    console.log('   window.refreshAds() - Refrescar contenedores');
    console.log('   window.adStatus() - Ver estado de las redes');
    console.log('   window.adMetrics() - Ver métricas de rendimiento');
    console.log('   window.adDiagnostics() - Ejecutar diagnóstico completo');
    console.log('   window.adConfig() - Ver configuración de zonas');
    
})();
