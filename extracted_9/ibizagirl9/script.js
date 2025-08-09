// IbizaGirl.pics - Gallery Management System - FIXED
// Version 2.1 - PayPal Integration Fixed

// ============================
// Configuration
// ============================
const CONFIG = {
    GALLERY_FILE: 'gallery.json',
    UNLOCK_PRICE: '€10/month',
    BLUR_AMOUNT: 20,
    DEFAULT_VIEWS: 1000
};

// ============================
// Global State
// ============================
let galleryData = [];
let currentItem = null;
let isUnlocked = false;

// ============================
// Initialize on Load
// ============================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initializing IbizaGirl Gallery...');
    await loadGalleryData();
    setupEventListeners();
    hideLoading();
});

// ============================
// Data Loading
// ============================
async function loadGalleryData() {
    try {
        const response = await fetch(CONFIG.GALLERY_FILE);
        if (response.ok) {
            galleryData = await response.json();
            console.log(`✅ Loaded ${galleryData.length} items from gallery.json`);
        } else {
            console.warn('⚠️ gallery.json not found, using demo data');
            galleryData = generateDemoData();
        }
    } catch (error) {
        console.error('❌ Error loading gallery:', error);
        galleryData = generateDemoData();
    }

    renderGallery();
    updateStats();
}

// ============================
// Demo Data Generator
// ============================
function generateDemoData() {
    const data = [];
    const locations = ['Es Vedrà', 'Cala Comte', 'Blue Marlin', 'Pacha', 'Ushuaïa'];
    
    // Generate demo photos (left sidebar)
    for (let i = 1; i <= 12; i++) {
        data.push({
            id: i,
            type: 'image',
            title: `Exclusive Photo ${i}`,
            description: 'Premium content from paradise',
            thumbnail: `public/assets/censored/img${String(i).padStart(3, '0')}.jpg`,
            censored: `public/assets/censored/img${String(i).padStart(3, '0')}.jpg`,
            full: `public/assets/full/img${String(i).padStart(3, '0')}.jpg`,
            date: `2024-01-${String(i).padStart(2, '0')}`,
            location: locations[Math.floor(Math.random() * locations.length)],
            views: Math.floor(Math.random() * 5000) + 1000,
            isPremium: true,
            isLocked: true
        });
    }

    // Generate demo videos (right sidebar)
    for (let i = 1; i <= 8; i++) {
        data.push({
            id: 12 + i,
            type: 'video',
            title: `Exclusive Video ${i}`,
            description: 'Premium video content',
            thumbnail: `public/assets/censored-videos/vid${String(i).padStart(3, '0')}_thumb.jpg`,
            censored: `public/assets/censored-videos/vid${String(i).padStart(3, '0')}.mp4`,
            full: `public/assets/videos/vid${String(i).padStart(3, '0')}.mp4`,
            duration: `${Math.floor(Math.random() * 5) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
            date: `2024-01-${String(i + 12).padStart(2, '0')}`,
            location: locations[Math.floor(Math.random() * locations.length)],
            views: Math.floor(Math.random() * 10000) + 2000,
            isPremium: true,
            isLocked: true
        });
    }

    return data;
}

// ============================
// Gallery Rendering - FIXED
// ============================
function renderGallery() {
    const photos = galleryData.filter(item => item.type === 'image');
    const videos = galleryData.filter(item => item.type === 'video');

    // Render photos (left sidebar)
    const photosGrid = document.getElementById('photosGrid');
    if (photosGrid) {
        photosGrid.innerHTML = photos.map(photo => createThumbHTML(photo)).join('');
    }

    // Render videos (right sidebar)
    const videosGrid = document.getElementById('videosGrid');
    if (videosGrid) {
        videosGrid.innerHTML = videos.map(video => createThumbHTML(video)).join('');
    }

    // Add click handlers to all thumbnails
    document.querySelectorAll('.thumb-item').forEach(item => {
        item.addEventListener('click', (e) => {
            // Check if content is unlocked
            if (!item.classList.contains('unlocked')) {
                e.preventDefault();
                e.stopPropagation();
                
                const contentId = parseInt(item.dataset.id);
                const contentType = item.dataset.type;
                const contentTitle = item.querySelector('.thumb-title')?.textContent || 'Premium Content';
                
                // Show PayPal payment modal
                if (window.showSinglePayment) {
                    window.showSinglePayment(contentId, contentType, contentTitle);
                } else {
                    console.error('showSinglePayment function not available');
                }
            } else {
                // Content is unlocked, proceed normally
                selectItem(item.dataset.id);
            }
        });
    });

    // Add video hover effects
    setupVideoHoverEffects();
    
    // Apply current unlock status
    applyUnlockStatus();
}

// ============================
// Create Thumbnail HTML - FIXED WITH PAYPAL LOGOS
// ============================
function createThumbHTML(item) {
    const mediaSource = item.censored || item.thumbnail;
    const mediaTag = item.type === 'video' 
        ? `<video class="thumb-media" src="${mediaSource}" muted loop playsinline></video>`
        : `<img class="thumb-media" src="${mediaSource}" alt="${item.title}" loading="lazy">`;

    // Check if content is purchased individually
    const isPurchased = checkIndividualPurchase(item.id);
    const unlockClass = isPurchased || isUnlocked ? 'unlocked' : '';
    const lockDisplay = isPurchased || isUnlocked ? 'style="display: none;"' : '';
    const paypalDisplay = isPurchased || isUnlocked ? 'style="display: none;"' : '';

    return `
        <div class="thumb-item ${unlockClass}" data-id="${item.id}" data-type="${item.type}">
            ${mediaTag}
            <div class="lock-icon" ${lockDisplay}>
                <svg viewBox="0 0 24 24" width="30" height="30">
                    <path fill="white" d="M12 2C9.243 2 7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7z"/>
                </svg>
            </div>
            <div class="paypal-overlay" ${paypalDisplay}>
                <div class="paypal-logo-small">P</div>
                €${item.type === 'video' ? '0.30' : '0.10'}
            </div>
            ${item.type === 'video' ? `<div class="video-duration">${item.duration || '0:00'}</div>` : ''}
            <div class="thumb-overlay">
                <div class="thumb-title">${item.title}</div>
                <div class="thumb-info">
                    <span>${formatNumber(item.views || 0)} views</span>
                </div>
            </div>
        </div>
    `;
}

// ============================
// Check Individual Purchase
// ============================
function checkIndividualPurchase(contentId) {
    const purchased = JSON.parse(localStorage.getItem('ibiza_purchased') || '[]');
    return purchased.includes(contentId);
}

// ============================
// Apply Unlock Status
// ============================
function applyUnlockStatus() {
    // Check subscription status
    const subscription = localStorage.getItem('ibiza_subscription');
    if (subscription) {
        const subData = JSON.parse(subscription);
        const subDate = new Date(subData.date);
        const daysSince = (new Date() - subDate) / (1000 * 60 * 60 * 24);
        
        if (daysSince <= 30 && subData.status === 'active') {
            isUnlocked = true;
            unlockAllContent();
            return;
        }
    }
    
    // Check individual purchases
    const purchased = JSON.parse(localStorage.getItem('ibiza_purchased') || '[]');
    purchased.forEach(contentId => {
        unlockSingleContent(contentId);
    });
}

// ============================
// Unlock Functions - FIXED
// ============================
function unlockAllContent() {
    console.log('🔓 Unlocking ALL content - VIP mode');
    isUnlocked = true;
    
    document.querySelectorAll('.thumb-media').forEach(media => {
        media.style.filter = 'none';
    });
    document.querySelectorAll('.lock-icon').forEach(icon => {
        icon.style.display = 'none';
    });
    document.querySelectorAll('.paypal-overlay').forEach(overlay => {
        overlay.style.display = 'none';
    });
    document.querySelectorAll('.thumb-item').forEach(item => {
        item.classList.add('unlocked');
    });
    
    const unlockBtn = document.getElementById('unlockBtn');
    if (unlockBtn) {
        unlockBtn.innerHTML = '✅ VIP Active';
        unlockBtn.style.background = 'linear-gradient(135deg, #00c851, #00ff88)';
    }
}

function unlockSingleContent(contentId) {
    console.log(`🔓 Unlocking single content: ${contentId}`);
    
    const item = document.querySelector(`[data-id="${contentId}"]`);
    if (item) {
        item.classList.add('unlocked');
        const media = item.querySelector('.thumb-media');
        if (media) media.style.filter = 'none';
        const lock = item.querySelector('.lock-icon');
        if (lock) lock.style.display = 'none';
        const paypalOverlay = item.querySelector('.paypal-overlay');
        if (paypalOverlay) paypalOverlay.style.display = 'none';
    }
}

// Export unlock functions to global scope for PayPal integration
window.unlockAllContent = unlockAllContent;
window.unlockSingleContent = unlockSingleContent;

// ============================
// Item Selection
// ============================
function selectItem(id) {
    // Remove previous active state
    document.querySelectorAll('.thumb-item').forEach(item => {
        item.classList.remove('active');
    });

    // Add active state to selected item
    const selectedThumb = document.querySelector(`[data-id="${id}"]`);
    if (selectedThumb) {
        selectedThumb.classList.add('active');
    }

    // Find item data
    currentItem = galleryData.find(item => item.id == id);
    if (!currentItem) return;

    // Hide welcome screen and show preview
    const welcomeScreen = document.getElementById('welcomeScreen');
    const previewContainer = document.getElementById('previewContainer');

    if (welcomeScreen) welcomeScreen.classList.add('hidden');
    if (previewContainer) previewContainer.style.display = 'block';

    // Update preview media
    const previewImage = document.getElementById('previewImage');
    const previewVideo = document.getElementById('previewVideo');
    const lockOverlay = document.getElementById('lockOverlay');

    // Check if content should be unlocked
    const shouldUnlock = isUnlocked || checkIndividualPurchase(currentItem.id);

    if (currentItem.type === 'video') {
        if (previewImage) previewImage.style.display = 'none';
        if (previewVideo) {
            previewVideo.style.display = 'block';
            previewVideo.src = shouldUnlock ? currentItem.full : currentItem.censored;
            previewVideo.className = shouldUnlock ? 'preview-media unlocked' : 'preview-media';
        }
    } else {
        if (previewVideo) previewVideo.style.display = 'none';
        if (previewImage) {
            previewImage.style.display = 'block';
            previewImage.src = shouldUnlock ? currentItem.full : currentItem.censored;
            previewImage.className = shouldUnlock ? 'preview-media unlocked' : 'preview-media';
        }
    }

    // Update lock overlay
    if (lockOverlay) {
        lockOverlay.className = shouldUnlock ? 'preview-lock-overlay hidden' : 'preview-lock-overlay';
    }

    // Increment views
    if (currentItem.views !== undefined) {
        currentItem.views++;
        updateStats();
    }
}

// ============================
// Update Statistics
// ============================
function updateStats() {
    const photos = galleryData.filter(item => item.type === 'image');
    const videos = galleryData.filter(item => item.type === 'video');
    const totalViews = galleryData.reduce((sum, item) => sum + (item.views || 0), 0);

    // Update header stats
    updateElement('photoCount', photos.length);
    updateElement('videoCount', videos.length);
    updateElement('totalViews', formatNumber(totalViews));

    // Update sidebar counts
    updateElement('photoCountSidebar', photos.length);
    updateElement('videoCountSidebar', videos.length);
}

// ============================
// Event Listeners Setup
// ============================
function setupEventListeners() {
    // Unlock button - will be overridden by PayPal integration
    const unlockBtn = document.getElementById('unlockBtn');
    if (unlockBtn && !unlockBtn.onclick) {
        unlockBtn.addEventListener('click', () => {
            if (window.showPaymentOptions) {
                window.showPaymentOptions();
            } else {
                alert('Payment system loading... Please try again in a moment.');
            }
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close preview or return to welcome
            const welcomeScreen = document.getElementById('welcomeScreen');
            if (welcomeScreen) {
                welcomeScreen.classList.remove('hidden');
            }
            const previewContainer = document.getElementById('previewContainer');
            if (previewContainer) {
                previewContainer.style.display = 'none';
            }
        }
    });
}

// ============================
// Video Hover Effects
// ============================
function setupVideoHoverEffects() {
    document.querySelectorAll('.thumb-item[data-type="video"] video').forEach(video => {
        video.addEventListener('mouseenter', () => {
            video.play().catch(e => console.log('Video play prevented:', e));
        });
        
        video.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
    });
}

// ============================
// Utility Functions
// ============================
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

function hideLoading() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 1000);
}

// ============================
// Export for debugging and PayPal integration
// ============================
window.galleryDebug = {
    data: () => galleryData,
    unlock: () => { isUnlocked = true; renderGallery(); },
    lock: () => { isUnlocked = false; renderGallery(); },
    reset: () => { localStorage.clear(); location.reload(); }
};

// Export key functions for PayPal integration
window.renderGallery = renderGallery;
window.selectItem = selectItem;

console.log('✅ Gallery system loaded - PayPal integration ready');
