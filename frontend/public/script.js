// ============================
// OCEAN PARADISE GALLERY - ENHANCED SCRIPT
// Merged functionality from File 8 (working) + File 9 (ads) + ExoClick
// ============================

console.log('🌊 Loading Ocean Paradise Gallery Script...');

// ============================
// AD NETWORK DEBUGGING & MONITORING
// ============================

// Monitor ad loading
function monitorAdNetworks() {
    setTimeout(() => {
        console.log('📺 Checking Ad Network Status:');
        
        // Check JuicyAds
        if (window.adsbyjuicy) {
            console.log('✅ JuicyAds: Loaded');
        } else {
            console.log('❌ JuicyAds: Not loaded');
        }
        
        // Check Ero-Advertising
        if (window.eaCtrl) {
            console.log('✅ Ero-Advertising: Loaded');
        } else {
            console.log('❌ Ero-Advertising: Not loaded');
        }
        
        // Check ExoClick
        if (window.ExoLoader) {
            console.log('✅ ExoClick: Loaded');
        } else {
            console.log('❌ ExoClick: Not loaded');
        }
        
        // Count ad containers
        const adContainers = document.querySelectorAll('.ad-zone').length;
        console.log(`📊 Total ad zones: ${adContainers}`);
        
    }, 3000);
}

// ============================
// ENHANCED GALLERY INTERACTION
// ============================

// Image lazy loading with ocean theme effects
function enhanceImageLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '0';
            this.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 100);
        });
        
        img.addEventListener('error', function() {
            this.style.background = 'linear-gradient(135deg, #0077be, #00d4ff)';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.innerHTML = '<span style="color: white; font-size: 2rem;">🌊</span>';
        });
    });
}

// ============================
// OCEAN PARTICLE EFFECTS
// ============================

function createOceanParticles() {
    const particleCount = 20;
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: -5;
        overflow: hidden;
    `;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 6 + 2}px;
            height: ${Math.random() * 6 + 2}px;
            background: rgba(127, 219, 255, ${Math.random() * 0.6 + 0.2});
            border-radius: 50%;
            animation: float${i} ${Math.random() * 20 + 10}s infinite linear;
        `;
        
        // Random starting position
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        
        // Create unique animation
        const keyframes = `
            @keyframes float${i} {
                0% {
                    transform: translate(0, 0) rotate(0deg);
                    opacity: 0;
                }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% {
                    transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = keyframes;
        document.head.appendChild(style);
        
        container.appendChild(particle);
    }
    
    document.body.appendChild(container);
}

// ============================
// PERFORMANCE MONITORING
// ============================

function monitorPerformance() {
    // Track page load time
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`⚡ Page loaded in ${(loadTime / 1000).toFixed(2)}s`);
        
        // Track images loaded
        const images = document.querySelectorAll('img');
        let loadedImages = 0;
        
        images.forEach(img => {
            if (img.complete) loadedImages++;
            else {
                img.addEventListener('load', () => {
                    loadedImages++;
                    console.log(`📸 Images loaded: ${loadedImages}/${images.length}`);
                });
            }
        });
    });
}

// ============================
// ANTI-ADBLOCK DETECTION
// ============================

function detectAdBlock() {
    setTimeout(() => {
        const testAd = document.createElement('div');
        testAd.innerHTML = '&nbsp;';
        testAd.className = 'adsbox';
        testAd.style.cssText = 'width:1px!important;height:1px!important;position:absolute!important;left:-9999px!important;';
        
        document.body.appendChild(testAd);
        
        setTimeout(() => {
            const isBlocked = testAd.offsetHeight === 0 || window.getComputedStyle(testAd).display === 'none';
            
            if (isBlocked) {
                console.log('🚫 AdBlock detected');
                showAdBlockNotification();
            } else {
                console.log('✅ Ads not blocked');
            }
            
            document.body.removeChild(testAd);
        }, 100);
    }, 2000);
}

function showAdBlockNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #0077be, #00d4ff);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 15px;
        font-weight: 600;
        z-index: 10001;
        box-shadow: 0 10px 30px rgba(0, 212, 255, 0.4);
        max-width: 300px;
        font-size: 0.9rem;
    `;
    
    notification.innerHTML = `
        <div style="margin-bottom: 0.5rem;">🌊 Support Our Ocean Paradise</div>
        <div style="font-size: 0.8rem; opacity: 0.9;">
            Please consider disabling AdBlock to help us maintain this free preview content
        </div>
        <button onclick="this.parentElement.remove()" 
                style="margin-top: 0.5rem; background: transparent; border: 1px solid white; color: white; padding: 0.3rem 0.8rem; border-radius: 10px; cursor: pointer; font-size: 0.7rem;">
            Dismiss
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-dismiss after 10 seconds
    setTimeout(() => {
        if (notification && notification.parentElement) {
            notification.remove();
        }
    }, 10000);
}

// ============================
// ENHANCED MOBILE EXPERIENCE
// ============================

function optimizeForMobile() {
    if (window.innerWidth <= 768) {
        // Optimize touch interactions
        document.querySelectorAll('.content-item').forEach(item => {
            item.style.touchAction = 'manipulation';
            
            // Add touch feedback
            item.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            item.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            });
        });
        
        // Optimize ad display for mobile
        const adZones = document.querySelectorAll('.ad-zone');
        adZones.forEach(zone => {
            zone.style.minHeight = '100px'; // Smaller on mobile
        });
        
        console.log('📱 Mobile optimizations applied');
    }
}

// ============================
// ACCESSIBILITY ENHANCEMENTS
// ============================

function enhanceAccessibility() {
    // Add skip links
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--ocean-bright);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.prepend(skipLink);
    
    // Add main content landmark
    const mainContent = document.querySelector('.main-container');
    if (mainContent) {
        mainContent.id = 'main-content';
        mainContent.setAttribute('role', 'main');
    }
}

// ============================
// ANALYTICS & TRACKING
// ============================

function setupAnalytics() {
    // Track VIP button clicks
    const vipButtons = document.querySelectorAll('.vip-btn, .unlock-btn');
    vipButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('📊 VIP button clicked');
            if (window.gtag) {
                window.gtag('event', 'vip_button_click', {
                    event_category: 'engagement',
                    event_label: 'vip_interest'
                });
            }
        });
    });
    
    // Track content interactions
    document.querySelectorAll('.content-item').forEach(item => {
        item.addEventListener('click', () => {
            const contentType = item.dataset.type || 'unknown';
            const contentId = item.dataset.id || 'unknown';
            
            console.log(`📊 Content clicked: ${contentType} - ${contentId}`);
            
            if (window.gtag) {
                window.gtag('event', 'content_interaction', {
                    event_category: 'engagement',
                    event_label: contentType,
                    custom_parameter_1: contentId
                });
            }
        });
    });
}

// ============================
// INITIALIZATION
// ============================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🌊 Initializing Ocean Paradise enhancements...');
    
    // Initialize all enhancements
    setTimeout(() => {
        monitorAdNetworks();
        enhanceImageLoading();
        createOceanParticles();
        detectAdBlock();
        optimizeForMobile();
        enhanceAccessibility();
        setupAnalytics();
        
        console.log('✅ All ocean paradise enhancements loaded!');
    }, 1000);
});

// ============================
// WINDOW LOAD OPTIMIZATIONS
// ============================

window.addEventListener('load', () => {
    monitorPerformance();
    
    // Preload critical images
    const criticalImages = [
        'public/assets/full/paradise-beach.jpg',
        'public/assets/full/sunset-silhouette.jpg',
        'public/assets/full/ocean-girl.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    console.log('🚀 Performance optimizations complete');
});

// ============================
// ERROR HANDLING
// ============================

window.addEventListener('error', (e) => {
    console.error('❌ JavaScript Error:', e.error);
    
    // Track errors if analytics available
    if (window.gtag) {
        window.gtag('event', 'javascript_error', {
            event_category: 'error',
            event_label: e.error?.message || 'Unknown error'
        });
    }
});

// Export for debugging
window.oceanDebug = {
    performance: () => performance.getEntriesByType('navigation')[0],
    adStatus: () => ({
        juicyAds: !!window.adsbyjuicy,
        eroAds: !!window.eaCtrl,
        exoClick: !!window.ExoLoader
    }),
    forceAdBlock: detectAdBlock,
    testNotification: showAdBlockNotification
};

console.log('🌊 Ocean Paradise Script loaded successfully!');
console.log('🔧 Debug: Type oceanDebug.adStatus() to check ad networks');