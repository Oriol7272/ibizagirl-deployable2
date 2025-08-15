// ============================
// AD NETWORK VERIFICATION SYSTEM v2.0
// Archivo completo para sustituir
// ============================

class AdNetworkVerifier {
    constructor() {
        this.networks = {
            juicyads: false,
            exoclick: false,
            eroadvertising: false
        };
        this.adBlockerDetected = false;
        this.trackingProtection = false;
        this.activeNetworks = 0;
        this.verificationComplete = false;
        this.listeners = [];
    }

    // Verificar estado de las redes de anuncios
    async verify() {
        console.log('🎯 [Ad Networks] ===== Iniciando verificación de Ad Networks =====');
        
        // Detectar Enhanced Tracking Protection
        this.detectTrackingProtection();
        
        // Verificar cada red de anuncios
        await Promise.all([
            this.checkJuicyAds(),
            this.checkExoClick(),
            this.checkEroAdvertising()
        ]);
        
        // Contar redes activas
        this.activeNetworks = Object.values(this.networks).filter(Boolean).length;
        
        console.log('🎯 [Ad Networks] ===== Resumen de verificación =====');
        console.log(`🎯 [Ad Networks] Redes activas: ${this.activeNetworks}/3`);
        
        if (this.trackingProtection) {
            console.log('🎯 [Ad Networks] ⚠️ Enhanced Tracking Protection activo - Algunas redes bloqueadas');
        }
        
        this.verificationComplete = true;
        this.notifyListeners();
        
        return this.getStatus();
    }

    // Detectar Enhanced Tracking Protection
    detectTrackingProtection() {
        // Detectar por bloqueo de scripts
        const blockedScripts = document.querySelectorAll('script[src*="ads"]').length;
        const expectedScripts = 3; // JuicyAds, ExoClick, EroAdvertising
        
        if (blockedScripts < expectedScripts) {
            this.trackingProtection = true;
            console.log(`🎯 [Ad Networks] Enhanced Tracking Protection detectado (${expectedScripts - blockedScripts} scripts bloqueados)`);
        }
    }

    // Verificar JuicyAds
    async checkJuicyAds() {
        try {
            // Múltiples métodos de detección
            const methods = [
                () => window.juicyads_loaded,
                () => window.adsbyjuicy,
                () => document.querySelector('.juicyads-loaded'),
                () => document.querySelector('[data-juicy]'),
                () => window._jads
            ];
            
            const detected = methods.some(method => {
                try {
                    return method();
                } catch (e) {
                    return false;
                }
            });
            
            this.networks.juicyads = detected;
            
            if (detected) {
                console.log('🎯 [Ad Networks] JuicyAds: Detectado (adsbyjuicy) ✅');
            } else {
                console.log('🎯 [Ad Networks] JuicyAds: No detectado ❌');
            }
            
        } catch (error) {
            console.log('🎯 [Ad Networks] JuicyAds: Error en verificación ❌');
            this.networks.juicyads = false;
        }
    }

    // Verificar ExoClick
    async checkExoClick() {
        try {
            const methods = [
                () => window.ExoLoader,
                () => window.exoclick_loaded,
                () => document.querySelector('.exoclick-loaded'),
                () => window._exo
            ];
            
            const detected = methods.some(method => {
                try {
                    return method();
                } catch (e) {
                    return false;
                }
            });
            
            this.networks.exoclick = detected;
            
            if (detected) {
                console.log('🎯 [Ad Networks] ExoClick: ExoLoader disponible ✅');
            } else {
                console.log('🎯 [Ad Networks] ExoClick: No detectado ❌');
            }
            
        } catch (error) {
            console.log('🎯 [Ad Networks] ExoClick: Error en verificación ❌');
            this.networks.exoclick = false;
        }
    }

    // Verificar EroAdvertising
    async checkEroAdvertising() {
        try {
            const methods = [
                () => window.ero_loaded,
                () => window.EroAdvertising,
                () => document.querySelector('.ero-loaded'),
                () => window._ero
            ];
            
            const detected = methods.some(method => {
                try {
                    return method();
                } catch (e) {
                    return false;
                }
            });
            
            this.networks.eroadvertising = detected;
            
            if (detected) {
                console.log('🎯 [Ad Networks] EroAdvertising: Detectado ✅');
            } else {
                console.log('🎯 [Ad Networks] EroAdvertising: No detectado ❌');
            }
            
        } catch (error) {
            console.log('🎯 [Ad Networks] EroAdvertising: Error en verificación ❌');
            this.networks.eroadvertising = false;
        }
    }

    // Obtener estado actual
    getStatus() {
        return {
            juicyads: this.networks.juicyads,
            exoclick: this.networks.exoclick,
            eroadvertising: this.networks.eroadvertising,
            adBlockerDetected: this.adBlockerDetected,
            trackingProtection: this.trackingProtection,
            activeNetworks: this.activeNetworks,
            timestamp: new Date().toISOString()
        };
    }

    // FUNCIÓN FALTANTE: checkAdStatus
    checkAdStatus() {
        console.log('📊 [Ad Status] Verificando estado de anuncios...');
        
        if (!this.verificationComplete) {
            console.log('📊 [Ad Status] Verificación aún en progreso...');
            return this.verify();
        }
        
        const status = this.getStatus();
        console.log('📊 [Ad Status] Estado actual:', status);
        
        // Mostrar placeholders si no hay anuncios
        if (this.activeNetworks === 0) {
            this.showAdPlaceholders();
        }
        
        return status;
    }

    // Mostrar placeholders de anuncios
    showAdPlaceholders() {
        console.log('🎨 [Ad Networks] Mostrando placeholders de anuncios...');
        
        const adContainers = document.querySelectorAll('.ad-container, [id*="ad"], [class*="ad"]');
        
        adContainers.forEach((container, index) => {
            if (container.children.length === 0 || container.querySelector('.ad-placeholder')) {
                this.createAdPlaceholder(container, index);
            }
        });
    }

    // Crear placeholder individual
    createAdPlaceholder(container, index) {
        const placeholder = document.createElement('div');
        placeholder.className = 'ad-placeholder';
        placeholder.style.cssText = `
            width: 100%;
            height: 100%;
            min-height: 90px;
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
            position: relative;
            overflow: hidden;
        `;
        
        // Determinar tipo de ambiente
        const isDev = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';
        
        if (isDev) {
            placeholder.innerHTML = `
                <div style="font-size: 16px; margin-bottom: 8px;">🚫</div>
                <div>Ad Placeholder ${index + 1}</div>
                <div style="font-size: 12px; margin-top: 4px; opacity: 0.6;">(Development Mode)</div>
            `;
        } else {
            placeholder.innerHTML = `
                <div style="font-size: 16px; margin-bottom: 8px;">📢</div>
                <div>Advertisement</div>
                <div style="font-size: 12px; margin-top: 4px; opacity: 0.6;">Ad Blocked</div>
            `;
            
            // Añadir animación de carga
            this.addLoadingAnimation(placeholder);
        }
        
        container.innerHTML = '';
        container.appendChild(placeholder);
    }

    // Añadir animación de carga
    addLoadingAnimation(placeholder) {
        const dots = document.createElement('div');
        dots.style.cssText = `
            margin-top: 10px;
            display: flex;
            gap: 4px;
            justify-content: center;
        `;
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.style.cssText = `
                width: 6px;
                height: 6px;
                background: rgba(255,255,255,0.5);
                border-radius: 50%;
                animation: adDotPulse 1.5s infinite;
                animation-delay: ${i * 0.2}s;
            `;
            dots.appendChild(dot);
        }
        
        // Añadir CSS de animación si no existe
        if (!document.getElementById('ad-placeholder-styles')) {
            const style = document.createElement('style');
            style.id = 'ad-placeholder-styles';
            style.textContent = `
                @keyframes adDotPulse {
                    0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
                    40% { opacity: 1; transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
        
        placeholder.appendChild(dots);
    }

    // Agregar listeners para cambios de estado
    addListener(callback) {
        this.listeners.push(callback);
    }

    // Notificar a los listeners
    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback(this.getStatus());
            } catch (error) {
                console.error('Error in ad network listener:', error);
            }
        });
    }

    // Reintentar verificación
    async retry() {
        console.log('🔄 [Ad Networks] Reintentando verificación...');
        this.verificationComplete = false;
        return await this.verify();
    }
}

// Crear instancia global
window.AdNetworkVerifier = new AdNetworkVerifier();

// FUNCIÓN GLOBAL FALTANTE
window.checkAdStatus = function() {
    return window.AdNetworkVerifier.checkAdStatus();
};

// Auto-inicializar
document.addEventListener('DOMContentLoaded', () => {
    // Esperar un momento para que se carguen los scripts de anuncios
    setTimeout(() => {
        window.AdNetworkVerifier.verify();
    }, 2000);
});

// Verificación periódica cada 30 segundos
setInterval(() => {
    if (window.AdNetworkVerifier && !window.AdNetworkVerifier.verificationComplete) {
        window.AdNetworkVerifier.verify();
    }
}, 30000);

console.log('🎯 [Ad Networks] Sistema de verificación inicializado v2.0');
