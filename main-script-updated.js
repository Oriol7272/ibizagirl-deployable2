/**
 * main-script-updated.js v16.0.0 MODULAR FIXED
 * Paradise Gallery - Sistema Principal con Integración Modular
 * Corregido: Sin duplicación de ContentSystemManager
 */

'use strict';

console.log('🌊 Paradise Gallery v16.0.0 MODULAR FIXED - Starting initialization...');

// ============================
// STATE MANAGEMENT
// ============================

const state = {
    currentGalleryPage: 1,
    itemsPerPage: 30,
    currentVideoPage: 1,
    videosPerPage: 12,
    isLocked: true,
    savedState: null,
    dailyContent: null,
    viewCounts: {
        photos: Math.floor(Math.random() * 5000) + 10000,
        videos: Math.floor(Math.random() * 2000) + 5000
    },
    lastRotation: null,
    moduleStatus: {
        contentSystem: false,
        adSystem: false,
        serviceWorker: false
    },
    performance: {
        loadTime: Date.now(),
        imagesLoaded: 0,
        videosLoaded: 0
    }
};

// ============================
// ERROR HANDLER
// ============================

class ErrorHandler {
    static logError(error, context = '') {
        console.error(`❌ Error in ${context}:`, error);
        
        // Send to analytics if available
        if (window.gtag) {
            window.gtag('event', 'exception', {
                description: `${context}: ${error.message}`,
                fatal: false
            });
        }
    }
    
    static showNotification(message, type = 'error') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ff4444' : '#00a8cc'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 350px;
        `;
        notification.innerHTML = `
            <strong>${type === 'error' ? '⚠️ Error' : '✅ Éxito'}</strong><br>
            ${message}<br>
            <a href="#" onclick="window.location.reload()" style="color: white; text-decoration: underline;">Recargar página</a>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 10000);
    }
}

// ============================
// CONTENT SYSTEM MANAGER (ÚNICA DECLARACIÓN)
// ============================

class ContentSystemManager {
    constructor() {
        this.initialized = false;
        this.contentCache = new Map();
        this.fallbackContent = {
            photos: [
                'full/bikini.webp',
                'full/bikbanner.webp', 
                'full/bikbanner2.webp',
                'full/backbikini.webp',
                'full/bikini3.webp',
                'full/bikini5.webp'
            ],
            videos: [],
            banners: ['full/bikini.webp', 'full/bikbanner.webp', 'full/bikbanner2.webp'],
            teasers: ['full/bikini3.webp', 'full/bikini5.webp', 'full/backbikini.webp']
        };
    }
    
    waitForContentSystem(callback, maxRetries = 50) {
        let retries = 0;
        const checkInterval = setInterval(() => {
            retries++;
            
            if (window.ContentAPI && window.UnifiedContentAPI) {
                clearInterval(checkInterval);
                this.initialized = true;
                console.log('✅ Sistema de contenido modular detectado');
                callback();
            } else if (retries >= maxRetries) {
                clearInterval(checkInterval);
                console.warn('⚠️ Content system timeout, using fallback');
                this.useFallback();
                callback();
            }
        }, 100);
    }
    
    useFallback() {
        console.log('🆘 Activando contenido de fallback...');
        
        // Crear APIs fallback si no están disponibles
        if (!window.ContentAPI) {
            window.ContentAPI = {
                getPublicImages: (count) => this.fallbackContent.photos.slice(0, count),
                getPremiumImages: () => [],
                getVideos: () => [],
                getBanners: () => this.fallbackContent.banners,
                getTeasers: () => this.fallbackContent.teasers,
                search: () => ({ photos: [], videos: [] }),
                getStats: () => ({ 
                    total: this.fallbackContent.photos.length, 
                    public: this.fallbackContent.photos.length, 
                    premium: 0, 
                    videos: 0 
                })
            };
        }
        
        if (!window.UnifiedContentAPI) {
            window.UnifiedContentAPI = {
                initialized: false,
                getAllPublicImages: () => this.fallbackContent.photos,
                getAllPremiumImages: () => [],
                getAllVideos: () => [],
                getTodaysContent: () => this.getDefaultContent()
            };
        }
        
        // Crear funciones auxiliares
        if (!window.getRandomContentForMainScript) {
            window.getRandomContentForMainScript = () => ({
                photos: this.fallbackContent.photos,
                videos: [],
                banners: this.fallbackContent.banners,
                teasers: this.fallbackContent.teasers
            });
        }
        
        if (!window.generateDailyRotationForMainScript) {
            window.generateDailyRotationForMainScript = () => this.getDefaultContent();
        }
    }
    
    getContent() {
        try {
            if (window.generateDailyRotationForMainScript) {
                console.log('📊 Usando sistema de contenido modular...');
                const content = window.generateDailyRotationForMainScript();
                
                // Validar estructura
                if (!content || !content.stats) {
                    console.warn('⚠️ Contenido sin estructura válida, usando fallback');
                    return this.getDefaultContent();
                }
                
                return content;
            } else {
                console.log('🔄 Sistema modular no disponible, usando fallback...');
                return this.getDefaultContent();
            }
        } catch (error) {
            ErrorHandler.logError(error, 'ContentSystemManager.getContent');
            return this.getDefaultContent();
        }
    }
    
    getDefaultContent() {
        return {
            photos: this.fallbackContent.photos,
            videos: this.fallbackContent.videos,
            banners: this.fallbackContent.banners,
            teasers: this.fallbackContent.teasers,
            newPhotoIndices: new Set([0, 1]),
            newVideoIndices: new Set(),
            lastUpdate: new Date(),
            stats: {
                totalPhotosPool: this.fallbackContent.photos.length,
                totalVideosPool: 0,
                dailyPhotos: this.fallbackContent.photos.length,
                dailyVideos: 0,
                newPhotos: 2,
                newVideos: 0
            }
        };
    }
}

// ============================
// IMAGE AND VIDEO ERROR HANDLERS
// ============================

function handleImageError(img) {
    try {
        if (!img || img.dataset.errorHandled === 'true') return;
        img.dataset.errorHandled = 'true';
        
        const fallbacks = [
            '/full/bikini.webp',
            '/full/bikini3.webp',
            '/full/bikini5.webp',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="20"%3EImagen no disponible%3C/text%3E%3C/svg%3E'
        ];
        
        let currentSrc = img.src.split('/').pop();
        let fallbackIndex = fallbacks.findIndex(f => f.includes(currentSrc));
        
        if (fallbackIndex === -1 || fallbackIndex === fallbacks.length - 1) {
            img.src = fallbacks[fallbacks.length - 1];
        } else {
            img.src = fallbacks[fallbackIndex + 1];
        }
    } catch (error) {
        ErrorHandler.logError(error, 'handleImageError');
    }
}

function handleVideoError(video) {
    try {
        if (!video || video.dataset.errorHandled === 'true') return;
        video.dataset.errorHandled = 'true';
        
        const container = video.closest('.video-item');
        if (container) {
            container.innerHTML = `
                <div class="video-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Video no disponible</p>
                </div>
            `;
        }
    } catch (error) {
        ErrorHandler.logError(error, 'handleVideoError');
    }
}

// ============================
// RENDER FUNCTIONS
// ============================

function renderPhotosProgressive() {
    try {
        const container = document.getElementById('photoGallery');
        if (!container) {
            console.warn('⚠️ Photo gallery container not found');
            return;
        }
        
        if (!state.dailyContent || !state.dailyContent.photos) {
            console.warn('⚠️ No photos in daily content');
            container.innerHTML = '<p class="no-content">No hay fotos disponibles</p>';
            return;
        }
        
        const photos = state.dailyContent.photos;
        const startIdx = (state.currentGalleryPage - 1) * state.itemsPerPage;
        const endIdx = startIdx + state.itemsPerPage;
        const photosToShow = photos.slice(startIdx, endIdx);
        
        container.innerHTML = '';
        
        photosToShow.forEach((photo, index) => {
            const globalIndex = startIdx + index;
            const isNew = state.dailyContent.newPhotoIndices && 
                          state.dailyContent.newPhotoIndices.has(globalIndex);
            const isPremium = photo.includes('uncensored');
            
            const photoItem = document.createElement('div');
            photoItem.className = `photo-item ${isPremium && state.isLocked ? 'locked' : ''} ${isNew ? 'new-item' : ''}`;
            photoItem.innerHTML = `
                ${isNew ? '<span class="new-badge">NUEVO</span>' : ''}
                ${isPremium && state.isLocked ? '<div class="lock-overlay"><i class="fas fa-lock"></i></div>' : ''}
                <img 
                    src="${photo}" 
                    alt="Paradise Photo ${globalIndex + 1}"
                    loading="lazy"
                    onerror="handleImageError(this)"
                    class="${isPremium && state.isLocked ? 'blurred' : ''}"
                >
                <div class="photo-info">
                    <span class="photo-number">#${globalIndex + 1}</span>
                    ${isPremium ? '<span class="premium-badge">VIP</span>' : ''}
                </div>
            `;
            
            photoItem.addEventListener('click', () => {
                if (isPremium && state.isLocked) {
                    showVIPModal();
                } else {
                    openPhotoModal(photo, globalIndex);
                }
            });
            
            container.appendChild(photoItem);
        });
        
        // Update pagination
        updatePagination();
        
        // Update performance metrics
        state.performance.imagesLoaded = photosToShow.length;
        
        console.log(`📸 Renderizadas ${photosToShow.length} fotos (página ${state.currentGalleryPage})`);
        
    } catch (error) {
        ErrorHandler.logError(error, 'renderPhotosProgressive');
    }
}

function renderVideosProgressive() {
    try {
        const container = document.getElementById('videoGallery');
        if (!container) {
            console.warn('⚠️ Video gallery container not found');
            return;
        }
        
        if (!state.dailyContent || !state.dailyContent.videos || state.dailyContent.videos.length === 0) {
            container.innerHTML = `
                <div class="no-videos-message">
                    <i class="fas fa-video-slash"></i>
                    <h3>Videos Premium</h3>
                    <p>Contenido exclusivo para miembros VIP</p>
                    <button onclick="showVIPModal()" class="vip-button">
                        <i class="fas fa-crown"></i> Hazte VIP
                    </button>
                </div>
            `;
            return;
        }
        
        const videos = state.dailyContent.videos;
        const startIdx = (state.currentVideoPage - 1) * state.videosPerPage;
        const endIdx = startIdx + state.videosPerPage;
        const videosToShow = videos.slice(startIdx, endIdx);
        
        container.innerHTML = '';
        
        videosToShow.forEach((video, index) => {
            const globalIndex = startIdx + index;
            const isNew = state.dailyContent.newVideoIndices && 
                          state.dailyContent.newVideoIndices.has(globalIndex);
            
            const videoItem = document.createElement('div');
            videoItem.className = `video-item ${state.isLocked ? 'locked' : ''} ${isNew ? 'new-item' : ''}`;
            
            // Determinar thumbnail
            let thumbnail = '/full/bikini.webp';
            if (typeof video === 'string') {
                thumbnail = video.replace('.mp4', '-thumb.webp');
            } else if (video.thumbnail) {
                thumbnail = video.thumbnail;
            }
            
            // Determinar duración
            let duration = '2:30';
            if (video.duration) {
                duration = video.duration;
            }
            
            videoItem.innerHTML = `
                ${isNew ? '<span class="new-badge">NUEVO</span>' : ''}
                ${state.isLocked ? '<div class="lock-overlay"><i class="fas fa-lock"></i></div>' : ''}
                <div class="video-thumbnail">
                    <img 
                        src="${thumbnail}" 
                        alt="Video ${globalIndex + 1}"
                        loading="lazy"
                        onerror="this.src='/full/bikini.webp'"
                        class="${state.isLocked ? 'blurred' : ''}"
                    >
                    <div class="play-button"><i class="fas fa-play"></i></div>
                </div>
                <div class="video-info">
                    <h4>Video Premium #${globalIndex + 1}</h4>
                    <span class="duration">${duration}</span>
                </div>
            `;
            
            videoItem.addEventListener('click', () => {
                if (state.isLocked) {
                    showVIPModal();
                } else {
                    const videoSrc = typeof video === 'string' ? video : video.src;
                    playVideo(videoSrc, globalIndex);
                }
            });
            
            container.appendChild(videoItem);
        });
        
        // Update video pagination
        updateVideoPagination();
        
        // Update performance metrics
        state.performance.videosLoaded = videosToShow.length;
        
        console.log(`🎬 Renderizados ${videosToShow.length} videos (página ${state.currentVideoPage})`);
        
    } catch (error) {
        ErrorHandler.logError(error, 'renderVideosProgressive');
    }
}

function renderTeaserCarousel() {
    try {
        const container = document.getElementById('teaserCarousel');
        if (!container) return;
        
        const teasers = state.dailyContent?.teasers || [];
        
        if (teasers.length === 0) {
            container.innerHTML = '<p>No hay teasers disponibles</p>';
            return;
        }
        
        container.innerHTML = `
            <div class="carousel-track">
                ${teasers.map((teaser, index) => `
                    <div class="carousel-item">
                        <img 
                            src="${teaser}" 
                            alt="Teaser ${index + 1}"
                            loading="lazy"
                            onerror="handleImageError(this)"
                        >
                    </div>
                `).join('')}
            </div>
        `;
        
        // Auto-scroll carousel
        let scrollPosition = 0;
        setInterval(() => {
            scrollPosition += 2;
            if (scrollPosition >= container.scrollWidth - container.clientWidth) {
                scrollPosition = 0;
            }
            container.scrollLeft = scrollPosition;
        }, 50);
        
    } catch (error) {
        ErrorHandler.logError(error, 'renderTeaserCarousel');
    }
}

// ============================
// BANNER SLIDESHOW
// ============================

function startBannerSlideshow() {
    try {
        const bannerContainer = document.getElementById('bannerSlideshow');
        if (!bannerContainer) return;
        
        const banners = state.dailyContent?.banners || [];
        
        if (banners.length === 0) {
            bannerContainer.innerHTML = '<p>No hay banners disponibles</p>';
            return;
        }
        
        let currentBanner = 0;
        
        function showBanner(index) {
            bannerContainer.innerHTML = `
                <img 
                    src="${banners[index]}" 
                    alt="Banner ${index + 1}"
                    class="banner-image fade-in"
                    onerror="handleImageError(this)"
                >
            `;
        }
        
        showBanner(0);
        
        setInterval(() => {
            currentBanner = (currentBanner + 1) % banners.length;
            showBanner(currentBanner);
        }, 5000);
        
    } catch (error) {
        ErrorHandler.logError(error, 'startBannerSlideshow');
    }
}

// ============================
// PAGINATION
// ============================

function updatePagination() {
    try {
        const paginationContainer = document.getElementById('pagination');
        if (!paginationContainer) return;
        
        const totalPhotos = state.dailyContent?.photos?.length || 0;
        const totalPages = Math.ceil(totalPhotos / state.itemsPerPage);
        
        let paginationHTML = '';
        
        // Previous button
        if (state.currentGalleryPage > 1) {
            paginationHTML += `
                <button class="page-btn" onclick="changePage(${state.currentGalleryPage - 1})">
                    <i class="fas fa-chevron-left"></i>
                </button>
            `;
        }
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= state.currentGalleryPage - 2 && i <= state.currentGalleryPage + 2)) {
                paginationHTML += `
                    <button class="page-btn ${i === state.currentGalleryPage ? 'active' : ''}" 
                            onclick="changePage(${i})">${i}</button>
                `;
            } else if (i === state.currentGalleryPage - 3 || i === state.currentGalleryPage + 3) {
                paginationHTML += '<span class="page-dots">...</span>';
            }
        }
        
        // Next button
        if (state.currentGalleryPage < totalPages) {
            paginationHTML += `
                <button class="page-btn" onclick="changePage(${state.currentGalleryPage + 1})">
                    <i class="fas fa-chevron-right"></i>
                </button>
            `;
        }
        
        paginationContainer.innerHTML = paginationHTML;
        
    } catch (error) {
        ErrorHandler.logError(error, 'updatePagination');
    }
}

function updateVideoPagination() {
    try {
        const paginationContainer = document.getElementById('videoPagination');
        if (!paginationContainer) return;
        
        const totalVideos = state.dailyContent?.videos?.length || 0;
        const totalPages = Math.ceil(totalVideos / state.videosPerPage);
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Previous button
        if (state.currentVideoPage > 1) {
            paginationHTML += `
                <button class="page-btn" onclick="changeVideoPage(${state.currentVideoPage - 1})">
                    <i class="fas fa-chevron-left"></i>
                </button>
            `;
        }
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <button class="page-btn ${i === state.currentVideoPage ? 'active' : ''}" 
                        onclick="changeVideoPage(${i})">${i}</button>
            `;
        }
        
        // Next button
        if (state.currentVideoPage < totalPages) {
            paginationHTML += `
                <button class="page-btn" onclick="changeVideoPage(${state.currentVideoPage + 1})">
                    <i class="fas fa-chevron-right"></i>
                </button>
            `;
        }
        
        paginationContainer.innerHTML = paginationHTML;
        
    } catch (error) {
        ErrorHandler.logError(error, 'updateVideoPagination');
    }
}

// ============================
// PAGE NAVIGATION
// ============================

function changePage(page) {
    state.currentGalleryPage = page;
    renderPhotosProgressive();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function changeVideoPage(page) {
    state.currentVideoPage = page;
    renderVideosProgressive();
    
    const videoSection = document.getElementById('videoGallery');
    if (videoSection) {
        videoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ============================
// MODALS
// ============================

function showVIPModal() {
    const modal = document.createElement('div');
    modal.className = 'vip-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal" onclick="this.closest('.vip-modal').remove()">×</button>
            <h2>🌟 Contenido Premium VIP</h2>
            <p>Accede a todo el contenido exclusivo sin censura</p>
            <div class="vip-features">
                <div class="feature">
                    <i class="fas fa-images"></i>
                    <span>+500 fotos HD sin censura</span>
                </div>
                <div class="feature">
                    <i class="fas fa-video"></i>
                    <span>+60 videos exclusivos</span>
                </div>
                <div class="feature">
                    <i class="fas fa-download"></i>
                    <span>Descargas ilimitadas</span>
                </div>
                <div class="feature">
                    <i class="fas fa-crown"></i>
                    <span>Acceso de por vida</span>
                </div>
            </div>
            <div class="vip-pricing">
                <div class="price-option">
                    <h3>1 Mes</h3>
                    <p class="price">$9.99</p>
                    <button class="vip-button" onclick="processPurchase('monthly')">
                        Comprar Ahora
                    </button>
                </div>
                <div class="price-option featured">
                    <span class="best-value">MEJOR VALOR</span>
                    <h3>Lifetime</h3>
                    <p class="price">$29.99</p>
                    <button class="vip-button" onclick="processPurchase('lifetime')">
                        Acceso de Por Vida
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function openPhotoModal(photo, index) {
    const modal = document.createElement('div');
    modal.className = 'photo-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal" onclick="this.closest('.photo-modal').remove()">×</button>
            <img src="${photo}" alt="Photo ${index + 1}">
            <div class="photo-modal-info">
                <h3>Foto #${index + 1}</h3>
                <button class="download-btn" onclick="downloadPhoto('${photo}')">
                    <i class="fas fa-download"></i> Descargar
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function playVideo(video, index) {
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal" onclick="this.closest('.video-modal').remove()">×</button>
            <video controls autoplay>
                <source src="${video}" type="video/mp4">
                Tu navegador no soporta el elemento de video.
            </video>
            <div class="video-modal-info">
                <h3>Video Premium #${index + 1}</h3>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ============================
// UTILITY FUNCTIONS
// ============================

function downloadPhoto(photoUrl) {
    const link = document.createElement('a');
    link.href = photoUrl;
    link.download = photoUrl.split('/').pop();
    link.click();
}

function processPurchase(plan) {
    console.log(`Processing purchase for plan: ${plan}`);
    // Aquí iría la integración con PayPal o el procesador de pagos
    alert('Función de compra en desarrollo. Por favor, intenta más tarde.');
}

function updateViewCounters() {
    try {
        // Update photo counter
        const photoCounter = document.getElementById('photoViewCount');
        if (photoCounter) {
            state.viewCounts.photos += Math.floor(Math.random() * 5) + 1;
            photoCounter.textContent = state.viewCounts.photos.toLocaleString();
        }
        
        // Update video counter
        const videoCounter = document.getElementById('videoViewCount');
        if (videoCounter) {
            state.viewCounts.videos += Math.floor(Math.random() * 3);
            videoCounter.textContent = state.viewCounts.videos.toLocaleString();
        }
    } catch (error) {
        ErrorHandler.logError(error, 'updateViewCounters');
    }
}

// ============================
// LOCAL STORAGE
// ============================

function saveState() {
    try {
        const stateToSave = {
            currentGalleryPage: state.currentGalleryPage,
            currentVideoPage: state.currentVideoPage,
            isLocked: state.isLocked,
            viewCounts: state.viewCounts,
            lastVisit: new Date().toISOString()
        };
        localStorage.setItem('paradiseGalleryState', JSON.stringify(stateToSave));
    } catch (error) {
        ErrorHandler.logError(error, 'saveState');
    }
}

function loadSavedState() {
    try {
        const saved = localStorage.getItem('paradiseGalleryState');
        if (saved) {
            const parsedState = JSON.parse(saved);
            state.currentGalleryPage = parsedState.currentGalleryPage || 1;
            state.currentVideoPage = parsedState.currentVideoPage || 1;
            state.isLocked = parsedState.isLocked !== false;
            state.viewCounts = parsedState.viewCounts || state.viewCounts;
            
            console.log('📂 Estado restaurado:', parsedState);
        }
    } catch (error) {
        ErrorHandler.logError(error, 'loadSavedState');
    }
}

// ============================
// PAYPAL INTEGRATION
// ============================

function initializePayPalButtons() {
    // Placeholder para integración de PayPal
    console.log('💳 PayPal integration ready');
}

// ============================
// EVENT LISTENERS
// ============================

function setupEventListeners() {
    // Save state before unload
    window.addEventListener('beforeunload', saveState);
    
    // Update counters periodically
    setInterval(updateViewCounters, 5000);
    
    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && state.currentGalleryPage > 1) {
            changePage(state.currentGalleryPage - 1);
        } else if (e.key === 'ArrowRight') {
            const totalPages = Math.ceil((state.dailyContent?.photos?.length || 0) / state.itemsPerPage);
            if (state.currentGalleryPage < totalPages) {
                changePage(state.currentGalleryPage + 1);
            }
        }
    });
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            renderPhotosProgressive();
            renderVideosProgressive();
        }, 250);
    });
}

// ============================
// INITIALIZATION
// ============================

function initializeApplication() {
    try {
        console.log('🎨 Initializing Paradise Gallery v16.0.0 MODULAR FIXED...');
        
        // Initialize content system manager
        const contentManager = new ContentSystemManager();
        
        // Wait for modular content system
        contentManager.waitForContentSystem(() => {
            console.log('✅ Sistema de contenido listo');
            
            // Get content from modular system
            state.dailyContent = contentManager.getContent();
            
            // Verificar que dailyContent tiene la estructura correcta
            if (!state.dailyContent || !state.dailyContent.stats) {
                console.warn('⚠️ dailyContent no tiene estructura válida, usando fallback');
                state.dailyContent = contentManager.getDefaultContent();
            }
            
            console.log(`📅 Daily rotation initialized: ${state.dailyContent.stats.dailyPhotos} photos, ${state.dailyContent.stats.dailyVideos} videos`);
            
            // Render content
            renderPhotosProgressive();
            renderVideosProgressive();
            renderTeaserCarousel();
            
            // Start banner slideshow
            startBannerSlideshow();
            
            // Update counters
            updateViewCounters();
            
            // Initialize other components
            initializePayPalButtons();
            setupEventListeners();
            
            // Load saved state
            loadSavedState();
            
            // Show success
            console.log('✅ Paradise Gallery loaded successfully with modular system!');
            
            // Mark module as ready
            state.moduleStatus.contentSystem = true;
        });
        
    } catch (error) {
        ErrorHandler.logError(error, 'initializeApplication');
        showFallbackContent();
    }
}

function showFallbackContent() {
    document.body.innerHTML = `
        <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: linear-gradient(180deg, #001f3f 0%, #003366 100%);
            color: white;
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 2rem;
        ">
            <div>
                <h1>🌊 IbizaGirl.pics</h1>
                <p>Estamos experimentando dificultades técnicas.</p>
                <p>Por favor, recarga la página en unos momentos.</p>
                <button onclick="window.location.reload()" style="
                    background: linear-gradient(135deg, #00a8cc, #00d4ff);
                    color: #001f3f;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 25px;
                    font-weight: 600;
                    cursor: pointer;
                    margin-top: 1rem;
                ">🔄 Recargar</button>
            </div>
        </div>
    `;
}

// ============================
// DEBUG FUNCTIONS
// ============================

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugModularSystem = function() {
        console.log('🛠️ DEBUG: Estado del sistema');
        console.table({
            'Content System': state.moduleStatus.contentSystem,
            'Ad System': state.moduleStatus.adSystem,
            'Service Worker': state.moduleStatus.serviceWorker,
            'Modular APIs': !!(window.ContentAPI && window.UnifiedContentAPI),
            'Arrays Available': {
                'ALL_PHOTOS_POOL': !!window.ALL_PHOTOS_POOL,
                'ALL_VIDEOS_POOL': !!window.ALL_VIDEOS_POOL,
                'BANNER_IMAGES': !!window.BANNER_IMAGES,
                'TEASER_IMAGES': !!window.TEASER_IMAGES
            },
            'State': state,
            'Daily Content': !!state.dailyContent
        });
        
        if (window.getContentStats) {
            console.log('📊 Content Stats:', window.getContentStats());
        }
    };
    
    window.testModularContent = function() {
        console.log('🧪 TEST: Probando contenido modular');
        if (window.getRandomContentForMainScript) {
            console.log('Random Content:', window.getRandomContentForMainScript(10, 5));
        }
        if (window.generateDailyRotationForMainScript) {
            console.log('Daily Rotation:', window.generateDailyRotationForMainScript());
        }
    };
    
    window.forceReloadContent = function() {
        console.log('🔄 Forzando recarga de contenido...');
        const contentSystemManager = new ContentSystemManager();
        state.dailyContent = contentSystemManager.getContent();
        renderPhotosProgressive();
        renderVideosProgressive();
        renderTeaserCarousel();
        updateViewCounters();
        console.log('✅ Contenido recargado');
    };
    
    console.log('🛠️ Funciones de debug disponibles:');
    console.log('  - debugModularSystem()');
    console.log('  - testModularContent()');
    console.log('  - forceReloadContent()');
}

// ============================
// GLOBAL EXPORTS
// ============================

window.changePage = changePage;
window.changeVideoPage = changeVideoPage;
window.showVIPModal = showVIPModal;
window.processPurchase = processPurchase;
window.downloadPhoto = downloadPhoto;
window.handleImageError = handleImageError;
window.handleVideoError = handleVideoError;
window.openPhotoModal = openPhotoModal;
window.playVideo = playVideo;

// ============================
// SERVICE WORKER REGISTRATION
// ============================

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('✅ Service Worker registrado:', registration.scope);
            state.moduleStatus.serviceWorker = true;
        })
        .catch(error => {
            console.error('❌ Error registrando Service Worker:', error);
        });
}

// ============================
// CACHE CLEANUP
// ============================

if ('caches' in window) {
    caches.keys().then(names => {
        names.forEach(name => {
            if (!name.includes('v1.4.3')) {
                caches.delete(name);
                console.log(`🗑️ Cache antigua eliminada: ${name}`);
            }
        });
    });
}

// ============================
// START APPLICATION
// ============================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApplication);
} else {
    initializeApplication();
}

console.log('✅ main-script-updated.js v16.0.0 MODULAR FIXED loaded successfully');
