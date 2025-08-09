// ============================
// Dynamic Background System for IbizaGirl.pics
// Using REAL image names from gallery.json
// ============================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Initializing enhanced dynamic background system...');
    
    // REAL image filenames from your gallery.json
    const realImages = [
        'bikbanner.jpg',
        'backbikini.jpg', 
        'bikback2.jpg',
        'bikini portada.jpg',
        '1dsu1ynPOBgwxVIVMm98.jpg',
        '5NSmf9UdwUJBWNS7LxM5.jpg',
        'Te2nfJ7cUJ4CLzPXOGNP.jpg',
        'DvCbL0ojNUx8yzgxz8zx.jpg',
        'gHzeQOkqUV84zzzuSpgE.jpg',
        'A3lni0mmt59IIQ1U0cki.jpg',
        'GBaZuttvlobM3dZ0DvMp.jpg',
        'DuE3kpTijyH0TXZeNRov.jpg',
        '2J6UGbexO5xfFKKhz32I.jpg',
        'qhvjLVrp1aIC5Re5rloh.jpg',
        'P3GqyhUt8X9wpa6AQq83.jpg',
        '8WiqA1mLF0ja4a4YtpJD.jpg',
        'tL5qXPGTRSz83nhLqOWA.jpg',
        'sBcbjHl9tBNpffy5N757.jpg',
        'f8wGqIcKeKvhNyPEUfe7.jpg',
        'kvMWPx1dZLAKZTdYz021.jpg',
        '5sKc0zYrls3NUrzzjErK.jpg',
        'kMOVTOl3HyJSFM9SSy3z.jpg'
    ];
    
    // Images specifically for banner
    const bannerImages = [
        'bikbanner.jpg',
        'bikini portada.jpg',
        'backbikini.jpg',
        'bikback2.jpg'
    ];
    
    let currentBannerIndex = 0;
    let currentBgIndex = 0;
    
    // ============================
    // Set Initial Banner Background
    // ============================
    function initializeBanner() {
        const style = document.createElement('style');
        style.id = 'dynamic-banner-style';
        style.textContent = `
            .top-banner::before {
                background-image: url('public/assets/full/${bannerImages[0]}') !important;
            }
        `;
        document.head.appendChild(style);
        console.log('🖼️ Initial banner set to:', bannerImages[0]);
    }
    
    // ============================
    // Rotate Banner Background
    // ============================
    function rotateBannerBackground() {
        const styleTag = document.getElementById('dynamic-banner-style');
        if (!styleTag) return;
        
        currentBannerIndex = (currentBannerIndex + 1) % bannerImages.length;
        const imagePath = `public/assets/full/${bannerImages[currentBannerIndex]}`;
        
        styleTag.textContent = `
            .top-banner::before {
                background-image: url('${imagePath}') !important;
                animation: bannerFadeIn 1s ease-in-out;
            }
            @keyframes bannerFadeIn {
                from { opacity: 0.8; }
                to { opacity: 1; }
            }
        `;
        
        console.log('🖼️ Banner changed to:', bannerImages[currentBannerIndex]);
    }
    
    // ============================
    // Set Main Background
    // ============================
    function setMainBackground() {
        const bgElement = document.querySelector('.background-main');
        if (bgElement) {
            const randomImage = realImages[Math.floor(Math.random() * realImages.length)];
            bgElement.style.backgroundImage = `url('public/assets/full/${randomImage}')`;
            console.log('🌊 Main background set to:', randomImage);
        }
    }
    
    // ============================
    // Update Corner Decorations
    // ============================
    function updateCornerDecorations() {
        const corners = [
            { selector: '.corner-decoration.top-left', image: 'backbikini.jpg' },
            { selector: '.corner-decoration.top-right', image: 'bikini portada.jpg' },
            { selector: '.corner-decoration.bottom-left', image: 'bikback2.jpg' },
            { selector: '.corner-decoration.bottom-right', image: 'bikbanner.jpg' }
        ];
        
        corners.forEach(corner => {
            const element = document.querySelector(corner.selector);
            if (element) {
                element.style.backgroundImage = `url('public/assets/full/${corner.image}')`;
            }
        });
        
        console.log('🎯 Corner decorations set with real images');
    }
    
    // ============================
    // Create Floating Images
    // ============================
    function createFloatingImages() {
        const container = document.querySelector('.floating-images');
        if (!container) return;
        
        // Clear existing
        container.innerHTML = '';
        
        // Create 3 floating images
        const floatingImages = [
            { image: 'bikbanner.jpg', top: '20%', delay: '0s' },
            { image: 'backbikini.jpg', top: '60%', delay: '15s' },
            { image: 'bikback2.jpg', top: '40%', delay: '30s' }
        ];
        
        floatingImages.forEach((config, index) => {
            const floatingDiv = document.createElement('div');
            floatingDiv.className = 'floating-img';
            floatingDiv.style.cssText = `
                background-image: url('public/assets/full/${config.image}');
                top: ${config.top};
                animation-delay: ${config.delay};
                animation-direction: ${index % 2 === 0 ? 'normal' : 'reverse'};
            `;
            container.appendChild(floatingDiv);
        });
        
        console.log('🌟 Floating images created');
    }
    
    // ============================
    // Initialize Everything
    // ============================
    function initialize() {
        // Set initial states
        initializeBanner();
        setMainBackground();
        updateCornerDecorations();
        createFloatingImages();
        
        // Set up rotation intervals
        setInterval(rotateBannerBackground, 30000); // Banner every 30 seconds
        setInterval(setMainBackground, 60000); // Background every minute
        
        console.log('✨ Dynamic background system initialized with real images');
    }
    
    // Start
    initialize();
    
    // Export for debugging
    window.bgSystem = {
        images: realImages,
        bannerImages: bannerImages,
        rotateBanner: rotateBannerBackground,
        rotateBackground: setMainBackground,
        updateCorners: updateCornerDecorations
    };
});

console.log('🚀 Enhanced background system loaded');
