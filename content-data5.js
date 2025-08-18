/**
 * content-data5.js - Premium Videos v4.1.0 FIXED
 * Contenido de video premium (67 archivos)
 */

// ============================
// POOL DE VIDEOS PREMIUM (67 videos)
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
    'uncensored-videos/qEOel0dBNRP2tJtVUcQ.mp4',
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
            loop: false,
            quality: '1080p'
        };
    }
    
    initialize() {
        this.initialized = true;
        this.detectAccessLevel();
        console.log(`✅ VideoContentManager inicializado - ${this.videos.length} videos disponibles`);
        console.log(`🎫 Nivel de acceso: ${this.accessLevel}`);
    }
    
    detectAccessLevel() {
        // Detectar nivel de acceso basado en localStorage/sessionStorage
        const isPremium = localStorage.getItem('ibizagirl_vip') === 'true' ||
                         sessionStorage.getItem('premiumAccess') === 'true';
        this.accessLevel = isPremium ? 'premium' : 'guest';
    }
    
    getAllVideos() {
        return [...this.videos];
    }
    
    getRandomVideos(count = 10) {
        if (!window.ArrayUtils) {
            // Fallback si ArrayUtils no está disponible
            const shuffled = [...this.videos].sort(() => Math.random() - 0.5);
            return shuffled.slice(0, Math.min(count, shuffled.length));
        }
        return window.ArrayUtils.getRandomItems(this.videos, count);
    }
    
    searchVideos(query) {
        if (!query) return this.videos;
        const queryLower = query.toLowerCase();
        return this.videos.filter(video => 
            video.toLowerCase().includes(queryLower)
        );
    }
    
    getVideoSubset(start = 0, count = 10) {
        return this.videos.slice(start, start + count);
    }
    
    hasVideo(videoPath) {
        return this.videos.includes(videoPath);
    }
    
    checkPremiumAccess() {
        this.detectAccessLevel();
        return this.accessLevel === 'premium' || this.accessLevel === 'vip';
    }
    
    getVideoMetadata(videoPath) {
        const isPreview = this.accessLevel === 'guest';
        const fileName = videoPath.split('/').pop().replace('.mp4', '');
        
        return {
            path: videoPath,
            fileName: fileName,
            thumbnail: this.generateThumbnail(videoPath),
            quality: isPreview ? '480p' : '1080p',
            duration: isPreview ? '0:30' : 'Variable',
            size: isPreview ? '~5MB' : '~25MB',
            preview: isPreview,
            accessLevel: this.accessLevel
        };
    }
    
    generateThumbnail(videoPath) {
        // Generar ruta de thumbnail basada en el video
        const videoName = videoPath.split('/').pop().replace('.mp4', '');
        return `thumbnails/${videoName}.webp`;
    }
    
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
    
    upgradeToPremium() {
        this.accessLevel = 'premium';
        localStorage.setItem('ibizagirl_vip', 'true');
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
}

// ============================
// UTILIDADES DE VIDEO
// ============================

const VideoUtils = {
    generateThumbnail(videoPath) {
        const videoName = videoPath.split('/').pop().replace('.mp4', '');
        return `thumbnails/${videoName}.webp`;
    },
    
    formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    
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
    
    checkBrowserSupport() {
        const video = document.createElement('video');
        return {
            mp4: video.canPlayType('video/mp4') !== '',
            webm: video.canPlayType('video/webm') !== '',
            autoplay: 'autoplay' in video,
            fullscreen: 'requestFullscreen' in video
        };
    },
    
    createVideoElement(src, options = {}) {
        const video = document.createElement('video');
        video.src = src;
        video.controls = options.controls !== false;
        video.autoplay = options.autoplay === true;
        video.muted = options.muted === true;
        video.loop = options.loop === true;
        video.preload = options.preload || 'metadata';
        
        if (options.poster) {
            video.poster = options.poster;
        }
        
        if (options.width) {
            video.width = options.width;
        }
        
        if (options.height) {
            video.height = options.height;
        }
        
        return video;
    }
};

// ============================
// REPRODUCTOR DE VIDEO
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
        this.currentVideo = null;
    }
    
    initialize() {
        if (this.initialized) return;
        
        this.videoElement = document.createElement('video');
        this.videoElement.className = 'video-player';
        this.videoElement.controls = this.options.controls;
        this.videoElement.autoplay = this.options.autoplay;
        this.videoElement.muted = this.options.muted;
        this.videoElement.loop = this.options.loop;
        
        // Estilos básicos
        this.videoElement.style.width = '100%';
        this.videoElement.style.height = 'auto';
        this.videoElement.style.maxWidth = '100%';
        
        // Event listeners
        this.setupEventListeners();
        
        // Añadir al contenedor
        if (this.container) {
            this.container.appendChild(this.videoElement);
        }
        
        this.initialized = true;
        console.log('✅ VideoPlayer inicializado');
    }
    
    setupEventListeners() {
        if (!this.videoElement) return;
        
        this.videoElement.addEventListener('play', () => {
            this.dispatchEvent('play', { video: this.currentVideo });
        });
        
        this.videoElement.addEventListener('pause', () => {
            this.dispatchEvent('pause', { video: this.currentVideo });
        });
        
        this.videoElement.addEventListener('ended', () => {
            this.dispatchEvent('ended', { video: this.currentVideo });
        });
        
        this.videoElement.addEventListener('error', (e) => {
            console.error('❌ Error reproduciendo video:', e);
            this.dispatchEvent('error', { video: this.currentVideo, error: e });
        });
    }
    
    loadVideo(videoPath, options = {}) {
        if (!this.videoElement) {
            this.initialize();
        }
        
        this.currentVideo = videoPath;
        this.videoElement.src = videoPath;
        
        if (options.poster) {
            this.videoElement.poster = options.poster;
        }
        
        if (options.autoplay) {
            this.play();
        }
    }
    
    play() {
        if (this.videoElement) {
            return this.videoElement.play();
        }
    }
    
    pause() {
        if (this.videoElement) {
            this.videoElement.pause();
        }
    }
    
    stop() {
        if (this.videoElement) {
            this.videoElement.pause();
            this.videoElement.currentTime = 0;
        }
    }
    
    seekTo(time) {
        if (this.videoElement) {
            this.videoElement.currentTime = time;
        }
    }
    
    setVolume(volume) {
        if (this.videoElement) {
            this.videoElement.volume = Math.max(0, Math.min(1, volume));
        }
    }
    
    toggleMute() {
        if (this.videoElement) {
            this.videoElement.muted = !this.videoElement.muted;
        }
    }
    
    requestFullscreen() {
        if (this.videoElement && this.videoElement.requestFullscreen) {
            this.videoElement.requestFullscreen();
        }
    }
    
    dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(`videoplayer:${eventName}`, { detail });
        if (this.container) {
            this.container.dispatchEvent(event);
        }
        window.dispatchEvent(event);
    }
    
    destroy() {
        if (this.videoElement) {
            this.videoElement.remove();
            this.videoElement = null;
        }
        this.initialized = false;
        this.currentVideo = null;
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

// Funciones de compatibilidad legacy
window.getAllVideos = () => globalVideoManager.getAllVideos();
window.getRandomVideos = (count) => globalVideoManager.getRandomVideos(count);
window.searchVideos = (query) => globalVideoManager.searchVideos(query);

// Log de inicialización
console.log(`📦 content-data5.js v4.1.0 FIXED loaded`);
console.log(`   - ${PREMIUM_VIDEOS_POOL.length} videos premium disponibles`);
console.log(`   - VideoContentManager inicializado`);
console.log(`   - VideoPlayer y VideoUtils disponibles`);

// Exportar para módulos ES6 si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PREMIUM_VIDEOS_POOL,
        VideoContentManager: globalVideoManager,
        VideoUtils,
        VideoPlayer
    };
}
