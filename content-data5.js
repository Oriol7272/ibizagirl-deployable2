// ============================
// CONTENT DATA 5 - VIDEOS PREMIUM v4.1.0
// Contenido de video premium
// ============================

'use strict';

// ============================
// POOL DE VIDEOS PREMIUM (67 archivos)
// ============================
const PREMIUM_VIDEOS_POOL = [
    'uncensored-videos/0nF138CMxl1eGWUxaG2d.mp4',
    'uncensored-videos/0xXK6PxXSv6cpYxvI7HX.mp4',
    'uncensored-videos/1NYBqpy4q2GVCDCXmXDK.mp4',
    'uncensored-videos/1SZsGxjFfrA7diW05Yvj.mp4',
    'uncensored-videos/2FO1Ra6RDA8FjGWmDv8d.mp4',
    'uncensored-videos/3W7GxdRyaPj0uAK9fD4I.mp4',
    'uncensored-videos/3i61FDkL2wmF6RjQbZKR.mp4',
    'uncensored-videos/5qsmyiUv590ZBfrpct6G.mp4',
    'uncensored-videos/7gBpFJiLzDH9s5ukalLs.mp4',
    'uncensored-videos/8RF2trrwvytHFkimtzDE.mp4',
    'uncensored-videos/8fQQnk9u7YAQQXDpfOW3.mp4',
    'uncensored-videos/8qfK5e4NbCYglU2WfMQ6.mp4',
    'uncensored-videos/8yE2nxCwV2QcJsdXGf32.mp4',
    'uncensored-videos/99ACESTm9KLPGdLSh0J1.mp4',
    'uncensored-videos/9weRZL3KvPUd3qNQz0Mt.mp4',
    'uncensored-videos/BA7Bvw9GHNCbsEKOruXh.mp4',
    'uncensored-videos/Bg8z3Gk9SuxEAFGt1WBo.mp4',
    'uncensored-videos/CzAtUvr9DPCv7JVMFNez.mp4',
    'uncensored-videos/Fc6f8RSjO8QBTmjjppHO.mp4',
    'uncensored-videos/G4LILz0eqoh4m3YOZ2WK.mp4',
    'uncensored-videos/G4XjXiZIHZZRsKwlDYCp.mp4',
    'uncensored-videos/MCZSxdyGPDN7E7Mkdj8F.mp4',
    'uncensored-videos/MOsBiYkWV6VFfK2P0Pxz.mp4',
    'uncensored-videos/MaV4A0BTJiYg1UThuwHk.mp4',
    'uncensored-videos/MkWQbiVWaJbShjipx4Kq.mp4',
    'uncensored-videos/N5TItomcAI6KvA7202Lz.mp4',
    'uncensored-videos/N6j12lQQ199vM8HTZw1O.mp4',
    'uncensored-videos/NTGWrlYi5RltnwhDSO6R.mp4',
    'uncensored-videos/Nnb48ZgMp3tNboq4uXWb.mp4',
    'uncensored-videos/Ocb0MqRnLH1pezhcgpHh.mp4',
    'uncensored-videos/P6FrIUZnYN1l3N7AKjX0.mp4',
    'uncensored-videos/XRCoUfkNLzwUepShH19v.mp4',
    'uncensored-videos/Z8C1oBoK0vERMZ2g8aD9.mp4',
    'uncensored-videos/ZPPOJjpdigAhYYekcnPx.mp4',
    'uncensored-videos/ZaszI9a5huBi41yXZq2w.mp4',
    'uncensored-videos/ahLNYijoKI9YoYoGToLK.mp4',
    'uncensored-videos/beSTk3pKEdHZJSH7rwHs.mp4',
    'uncensored-videos/cXi2dPqHJJwsJWWnRm6J.mp4',
    'uncensored-videos/eXZcQY7SeVHjcgwv8hHn.mp4',
    'uncensored-videos/ebNx2Mft0L7qtcGy2sUy.mp4',
    'uncensored-videos/f8FbeCjEOwLRvwIgfK8l.mp4',
    'uncensored-videos/fCE3ydur09Lbf0hxFHyD.mp4',
    'uncensored-videos/fg2JqRBziuyvCFyjoaWE.mp4',
    'uncensored-videos/g9fe19vfWl138v5dqou2.mp4',
    'uncensored-videos/gII1RvXkZk6Szauv9cDp.mp4',
    'uncensored-videos/hpGf0VPAwY3NrRbj9wd8.mp4',
    'uncensored-videos/i1iPIEe7iIhancXwP05J.mp4',
    'uncensored-videos/iniuJRrZzzGp74LWfZYy.mp4',
    'uncensored-videos/juHQDjTQ8HeFlLsuDhzS.mp4',
    'uncensored-videos/k7mErb1EfpdRUhafYFS5.mp4',
    'uncensored-videos/kAU1KdI09ffEf1fjCgPC.mp4',
    'uncensored-videos/kfDFWczYHsZXjtwmMsP4.mp4',
    'uncensored-videos/n4DaX8Nwj1glWI1Oe9vj.mp4',
    'uncensored-videos/nLejk9R1jPVuOpyrlrAN.mp4',
    'uncensored-videos/nx7nnXBeHftB7umRkdec.mp4',
    'uncensored-videos/owT8LTlvFEfwHj5cOtbc.mp4',
    'uncensored-videos/peTmHJhWF44gaz25ACCr.mp4',
    'uncensored-videos/qEOel0dBNRP2ttJtVUcQ.mp4',
    'uncensored-videos/r14kVENgyJthsXKP4ckJ.mp4',
    'uncensored-videos/rBSogUSRYAorst0XO7oy.mp4',
    'uncensored-videos/rWwDSNSYmt9jpPd2ngiI.mp4',
    'uncensored-videos/raKwkNU85MId6acMS6a0.mp4',
    'uncensored-videos/udkEtFkLN2SKU1I3aSIT.mp4',
    'uncensored-videos/vF3JI0gM7nDGJAiKFb7S.mp4',
    'uncensored-videos/vJel6k1lAYlZxfEe5f1a.mp4',
    'uncensored-videos/vhDZYiY0UkTLtmu7HrfF.mp4',
    'uncensored-videos/wtcVFSKn4McI9xahFEGr.mp4',
    'uncensored-videos/ymdZTKkujrU5ON7ZB66H.mp4',
    'uncensored-videos/zB6YDw2LZ6BZl8CbXMiV.mp4',
    'uncensored-videos/zX53TSjhlQj4Gy76iK0H.mp4'
];

// ============================
// GESTOR DE CONTENIDO DE VIDEO
// ============================
class VideoContentManager {
    constructor() {
        this.videos = PREMIUM_VIDEOS_POOL;
        this.initialized = false;
        this.accessLevel = 'guest'; // guest, premium, vip
        this.playbackSettings = {
            autoplay: false,
            controls: true,
            muted: false,
            loop: false
        };
    }
    
    // Inicializar gestor de videos
    initialize() {
        this.initialized = true;
        this.detectAccessLevel();
        console.log(`✅ VideoContentManager inicializado - ${this.videos.length} videos disponibles`);
        console.log(`🎫 Nivel de acceso: ${this.accessLevel}`);
    }
    
    // Detectar nivel de acceso del usuario
    detectAccessLevel() {
        // Lógica para detectar si el usuario tiene acceso premium
        const isPremium = this.checkPremiumAccess();
        this.accessLevel = isPremium ? 'premium' : 'guest';
    }
    
    // Verificar acceso premium (placeholder)
    checkPremiumAccess() {
        // Aquí iría la lógica real de verificación de suscripción
        return localStorage.getItem('premiumAccess') === 'true' || 
               sessionStorage.getItem('premiumAccess') === 'true';
    }
    
    // Obtener todos los videos (solo para usuarios premium)
    getAllVideos() {
        if (this.accessLevel === 'guest') {
            console.warn('🚫 Acceso denegado: Se requiere suscripción premium para videos');
            return [];
        }
        return [...this.videos];
    }
    
    // Obtener videos aleatorios
    getRandomVideos(count = 5) {
        if (this.accessLevel === 'guest') {
            return this.getPreviewVideos(Math.min(count, 2));
        }
        
        if (!window.ArrayUtils) {
            return this.videos.slice(0, count);
        }
        return window.ArrayUtils.getRandomItems(this.videos, count);
    }
    
    // Obtener videos de preview para usuarios no premium
    getPreviewVideos(count = 2) {
        const previewVideos = this.videos.slice(0, count);
        return previewVideos.map(video => ({
            path: video,
            preview: true,
            watermarked: true,
            duration: '0:30', // Solo primeros 30 segundos
            message: 'Suscríbete para ver el video completo'
        }));
    }
    
    // Buscar videos
    searchVideos(query) {
        const availableVideos = this.accessLevel === 'guest' ? [] : this.videos;
        
        if (!query) return availableVideos;
        const queryLower = query.toLowerCase();
        return availableVideos.filter(video => 
            video.toLowerCase().includes(queryLower)
        );
    }
    
    // Obtener video específico
    getVideo(index) {
        if (this.accessLevel === 'guest') {
            return this.getPreviewVideos(1)[0] || null;
        }
        
        return this.videos[index] || null;
    }
    
    // Verificar si un video existe
    hasVideo(videoPath) {
        return this.videos.includes(videoPath);
    }
    
    // Configurar reproducción
    setPlaybackSettings(settings) {
        this.playbackSettings = { ...this.playbackSettings, ...settings };
    }
    
    // Obtener configuración de reproducción
    getPlaybackSettings() {
        return { ...this.playbackSettings };
    }
    
    // Generar URL de video con parámetros
    getVideoUrl(videoPath, options = {}) {
        if (this.accessLevel === 'guest' && !options.preview) {
            return null;
        }
        
        const baseUrl = options.baseUrl || '';
        const params = new URLSearchParams();
        
        if (options.preview) {
            params.append('preview', 'true');
            params.append('duration', '30');
        }
        
        if (this.playbackSettings.autoplay) {
            params.append('autoplay', '1');
        }
        
        const url = `${baseUrl}${videoPath}`;
        return params.toString() ? `${url}?${params.toString()}` : url;
    }
    
    // Obtener metadatos de video
    getVideoMetadata(videoPath) {
        const isPreview = this.accessLevel === 'guest';
        
        return {
            path: videoPath,
            name: videoPath.split('/').pop().replace('.mp4', ''),
            format: 'mp4',
            quality: isPreview ? '480p' : '1080p',
            duration: isPreview ? '0:30' : 'Variable',
            size: isPreview ? '~5MB' : '~25MB',
            preview: isPreview,
            accessLevel: this.accessLevel
        };
    }
    
    // Obtener estadísticas
    getStats() {
        return {
            totalVideos: this.videos.length,
            accessLevel: this.accessLevel,
            availableVideos: this.accessLevel === 'guest' ? 0 : this.videos.length,
            previewVideos: this.accessLevel === 'guest' ? 2 : 0,
            initialized: this.initialized,
            playbackSettings: this.playbackSettings
        };
    }
    
    // Simular upgrade a premium
    upgradeToPremium() {
        this.accessLevel = 'premium';
        sessionStorage.setItem('premiumAccess', 'true');
        console.log('🎉 Acceso premium activado');
        
        // Disparar evento de upgrade
        window.dispatchEvent(new CustomEvent('premiumUpgrade', {
            detail: { 
                accessLevel: this.accessLevel,
                videosUnlocked: this.videos.length
            }
        }));
    }
    
    // Validar formato de video
    isValidVideoFormat(videoPath) {
        if (!window.Validators) {
            return videoPath.toLowerCase().endsWith('.mp4');
        }
        return window.Validators.isValidVideoPath(videoPath);
    }
}

// ============================
// UTILIDADES DE VIDEO
// ============================
const VideoUtils = {
    // Generar thumbnail placeholder
    generateThumbnail(videoPath) {
        const videoName = videoPath.split('/').pop().replace('.mp4', '');
        return `thumbnails/${videoName}.webp`;
    },
    
    // Formatear duración
    formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    
    // Calcular tamaño estimado
    estimateFileSize(durationSeconds, quality = '1080p') {
        const bitrates = {
            '480p': 1000, // kbps
            '720p': 2500,
            '1080p': 5000
        };
        
        const bitrate = bitrates[quality] || bitrates['1080p'];
        const sizeKB = (durationSeconds * bitrate) / 8;
        const sizeMB = Math.round(sizeKB / 1024 * 100) / 100;
        
        return `${sizeMB}MB`;
    },
    
    // Verificar compatibilidad del navegador
    checkBrowserSupport() {
        const video = document.createElement('video');
        return {
            mp4: video.canPlayType('video/mp4') !== '',
            webm: video.canPlayType('video/webm') !== '',
            autoplay: 'autoplay' in video,
            fullscreen: 'requestFullscreen' in video
        };
    }
};

// ============================
// COMPONENTE DE REPRODUCTOR
// ============================
class VideoPlayer {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            controls: true,
            autoplay: false,
            muted: false,
            loop: false,
            ...options
        };
        this.videoElement = null;
        this.initialized = false;
    }
    
    // Inicializar reproductor
    initialize() {
        this.createVideoElement();
        this.setupEventListeners();
        this.initialized = true;
    }
    
    // Crear elemento de video
    createVideoElement() {
        this.videoElement = document.createElement('video');
        this.videoElement.controls = this.options.controls;
        this.videoElement.autoplay = this.options.autoplay;
        this.videoElement.muted = this.options.muted;
        this.videoElement.loop = this.options.loop;
        this.videoElement.style.width = '100%';
        this.videoElement.style.height = 'auto';
        
        if (this.container) {
            this.container.appendChild(this.videoElement);
        }
    }
    
    // Configurar event listeners
    setupEventListeners() {
        if (!this.videoElement) return;
        
        this.videoElement.addEventListener('loadstart', () => {
            this.dispatchEvent('loadstart');
        });
        
        this.videoElement.addEventListener('canplay', () => {
            this.dispatchEvent('ready');
        });
        
        this.videoElement.addEventListener('play', () => {
            this.dispatchEvent('play');
        });
        
        this.videoElement.addEventListener('pause', () => {
            this.dispatchEvent('pause');
        });
        
        this.videoElement.addEventListener('ended', () => {
            this.dispatchEvent('ended');
        });
        
        this.videoElement.addEventListener('error', (e) => {
            this.dispatchEvent('error', { error: e });
        });
    }
    
    // Cargar video
    loadVideo(videoPath) {
        if (!this.videoElement) {
            console.error('VideoPlayer no inicializado');
            return;
        }
        
        this.videoElement.src = videoPath;
        this.videoElement.load();
    }
    
    // Reproducir
    play() {
        if (this.videoElement) {
            return this.videoElement.play();
        }
    }
    
    // Pausar
    pause() {
        if (this.videoElement) {
            this.videoElement.pause();
        }
    }
    
    // Detener
    stop() {
        if (this.videoElement) {
            this.videoElement.pause();
            this.videoElement.currentTime = 0;
        }
    }
    
    // Buscar posición
    seekTo(time) {
        if (this.videoElement) {
            this.videoElement.currentTime = time;
        }
    }
    
    // Cambiar volumen
    setVolume(volume) {
        if (this.videoElement) {
            this.videoElement.volume = Math.max(0, Math.min(1, volume));
        }
    }
    
    // Silenciar/Desilenciar
    toggleMute() {
        if (this.videoElement) {
            this.videoElement.muted = !this.videoElement.muted;
        }
    }
    
    // Pantalla completa
    requestFullscreen() {
        if (this.videoElement && this.videoElement.requestFullscreen) {
            this.videoElement.requestFullscreen();
        }
    }
    
    // Disparar eventos personalizados
    dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(`videoplayer:${eventName}`, { detail });
        if (this.container) {
            this.container.dispatchEvent(event);
        }
        window.dispatchEvent(event);
    }
    
    // Destruir reproductor
    destroy() {
        if (this.videoElement) {
            this.videoElement.remove();
            this.videoElement = null;
        }
        this.initialized = false;
    }
}

// ============================
// INICIALIZACIÓN Y EXPORTACIÓN
// ============================
const globalVideoManager = new VideoContentManager();

// Exponer APIs globales
window.PREMIUM_VIDEOS_POOL = PREMIUM_VIDEOS_POOL;
window.VideoContentManager = globalVideoManager;
window.VideoUtils = VideoUtils;
window.VideoPlayer = VideoPlayer;

// Auto-inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        globalVideoManager.initialize();
    });
} else {
    globalVideoManager.initialize();
}

// ============================
// FUNCIONES DE COMPATIBILIDAD LEGACY
// ============================
window.getAllVideos = () => globalVideoManager.getAllVideos();
window.getRandomVideos = (count) => globalVideoManager.getRandomVideos(count);
window.checkVideoAccess = () => globalVideoManager.accessLevel;

// ============================
// SISTEMA DE PAYWALL PARA VIDEOS
// ============================
class VideoPaywall {
    constructor() {
        this.isActive = true;
        this.previewDuration = 30; // segundos
        this.upgradeUrl = '/premium';
    }
    
    // Verificar si se debe mostrar paywall
    shouldShowPaywall(videoPath) {
        return globalVideoManager.accessLevel === 'guest';
    }
    
    // Crear overlay de paywall
    createPaywallOverlay(container) {
        const overlay = document.createElement('div');
        overlay.className = 'video-paywall-overlay';
        overlay.innerHTML = `
            <div class="paywall-content">
                <h3>🔒 Contenido Premium</h3>
                <p>Suscríbete para acceder a todos los videos en calidad HD</p>
                <button class="upgrade-btn" onclick="window.location.href='${this.upgradeUrl}'">
                    ⭐ Obtener Acceso Premium
                </button>
                <p class="preview-notice">Vista previa: primeros ${this.previewDuration} segundos</p>
            </div>
        `;
        
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            color: white;
            text-align: center;
        `;
        
        container.style.position = 'relative';
        container.appendChild(overlay);
        
        return overlay;
    }
    
    // Remover paywall (después de upgrade)
    removePaywall(container) {
        const overlay = container.querySelector('.video-paywall-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
}

// Instancia global del paywall
const globalVideoPaywall = new VideoPaywall();
window.VideoPaywall = globalVideoPaywall;

// ============================
// EVENT LISTENERS PARA PREMIUM UPGRADE
// ============================
window.addEventListener('premiumUpgrade', (event) => {
    console.log('🎉 Premium upgrade detectado, removiendo paywalls de video');
    
    // Remover todos los paywalls activos
    const paywallOverlays = document.querySelectorAll('.video-paywall-overlay');
    paywallOverlays.forEach(overlay => overlay.remove());
    
    // Recargar videos si es necesario
    const videoElements = document.querySelectorAll('video[data-premium="true"]');
    videoElements.forEach(video => {
        if (video.dataset.fullSrc) {
            video.src = video.dataset.fullSrc;
            video.load();
        }
    });
});

// ============================
// FUNCIONES DE UTILIDAD PARA LA UI
// ============================
const VideoUIHelpers = {
    // Crear botón de reproducción personalizado
    createPlayButton(onClick) {
        const button = document.createElement('button');
        button.innerHTML = '▶️';
        button.className = 'video-play-btn';
        button.onclick = onClick;
        return button;
    },
    
    // Crear indicador de progreso
    createProgressBar(duration) {
        const container = document.createElement('div');
        container.className = 'video-progress-container';
        
        const bar = document.createElement('div');
        bar.className = 'video-progress-bar';
        
        const progress = document.createElement('div');
        progress.className = 'video-progress';
        progress.style.width = '0%';
        
        bar.appendChild(progress);
        container.appendChild(bar);
        
        return { container, progress };
    },
    
    // Formatear tiempo para mostrar
    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    },
    
    // Crear thumbnail con overlay de reproducción
    createVideoThumbnail(videoPath, onClick) {
        const container = document.createElement('div');
        container.className = 'video-thumbnail-container';
        container.style.cssText = `
            position: relative;
            cursor: pointer;
            border-radius: 8px;
            overflow: hidden;
            background: #000;
        `;
        
        const thumbnail = document.createElement('img');
        thumbnail.src = VideoUtils.generateThumbnail(videoPath);
        thumbnail.alt = 'Video thumbnail';
        thumbnail.style.cssText = 'width: 100%; height: auto; display: block;';
        
        const playOverlay = document.createElement('div');
        playOverlay.innerHTML = '▶️';
        playOverlay.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 3rem;
            color: white;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
            pointer-events: none;
        `;
        
        container.appendChild(thumbnail);
        container.appendChild(playOverlay);
        container.onclick = onClick;
        
        return container;
    }
};

window.VideoUIHelpers = VideoUIHelpers;

// ============================
// LOG DE INICIALIZACIÓN
// ============================
console.log(`📦 content-data5.js cargado - ${PREMIUM_VIDEOS_POOL.length} videos premium disponibles`);
console.log('🎬 VideoContentManager, VideoPlayer y VideoPaywall listos');
console.log('🔧 VideoUIHelpers y VideoUtils disponibles');

// ============================
// CONFIGURACIÓN DE DESARROLLO
// ============================
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🧪 Modo desarrollo detectado');
    
    // En desarrollo, simular acceso premium
    window.enablePremiumForTesting = () => {
        globalVideoManager.upgradeToPremium();
        console.log('🎭 Acceso premium habilitado para testing');
    };
    
    // Función para probar reproductor
    window.testVideoPlayer = (containerId) => {
        const container = document.getElementById(containerId);
        if (container) {
            const player = new VideoPlayer(container, { controls: true });
            player.initialize();
            const testVideo = globalVideoManager.getRandomVideos(1)[0];
            if (testVideo) {
                player.loadVideo(testVideo.path || testVideo);
            }
            return player;
        }
    };
}
