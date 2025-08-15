// ============================
// IBIZAGIRL.PICS - MAIN SCRIPT v13.1.1 Fixed
// ============================

console.log('🌊 IbizaGirl.pics v13.1.1 Fixed - Loading Paradise Gallery...');

// ============================
// CONFIGURATION
// ============================
const CONFIG = {
    PHOTOS_PER_LOAD: 20,
    VIDEOS_PER_LOAD: 8,
    FREE_PHOTOS: 6,
    FREE_VIDEOS: 2,
    UNLOCK_COST: 1,
    DAILY_ROTATION_PHOTOS: 200,
    DAILY_ROTATION_VIDEOS: 40,
    BLUR_AMOUNT: '20px',
    STORAGE_KEY: 'ibizaGirlData',
    ANALYTICS_ID: 'G-DBXYNPBSPY'
};

// Environment Detection
const ENV = {
    hostname: window.location.hostname,
    port: window.location.port,
    isProduction: window.location.hostname === 'ibizagirl.pics' || 
                  window.location.hostname === 'www.ibizagirl.pics',
    isLocal: window.location.hostname === 'localhost' || 
             window.location.hostname === '127.0.0.1'
};

console.log('🌍 Environment: ' + (ENV.isProduction ? 'Production' : 'Development'));
console.log('🌐 Hostname:', ENV.hostname);
console.log('🔌 Port:', ENV.port);

// ============================
// AD NETWORKS CONFIGURATION
// ============================
const AD_NETWORKS = {
    adsense: {
        enabled: true,
        client: 'ca-pub-8192796967614829',
        slots: {
            top: '1234567890',
            middle: '2345678901',
            bottom: '3456789012'
        }
    },
    juicyads: {
        enabled: true,
        site_id: '87923',
        zones: {
            banner: '728x90',
            mobile: '320x50'
        }
    },
    exoclick: {
        enabled: true,
        zones: {
            banner: '4742808',
            popunder: '4742809'
        }
    },
    propellerads: {
        enabled: true,
        zone: '5748443'
    },
    popcash: {
        enabled: true,
        enabled_production_only: true
    },
    trafficstars: {
        enabled: true,
        spot_id: 'TS_SPOT_ID'
    }
};

// ============================
// TRANSLATIONS
// ============================
const translations = {
    en: {
        subtitle: "Paradise Gallery - Exclusive Content",
        nav_gallery: "Gallery",
        nav_videos: "Videos",
        nav_premium: "Premium",
        credits: "Credits",
        buy_credits: "Buy Credits",
        load_more: "Load More Content",
        unlock: "Unlock",
        premium_title: "🔥 Premium Content 🔥",
        premium_subtitle: "Unlock exclusive photos and videos",
        payment_title: "Complete Your Purchase",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        contact: "Contact",
        loading: "Loading...",
        error_loading: "Error loading content",
        success_unlock: "Content unlocked successfully!",
        insufficient_credits: "Insufficient credits. Please buy more credits.",
        video_unlocked: "Video unlocked!",
        photo_unlocked: "Photo unlocked!"
    },
    es: {
        subtitle: "Galería Paraíso - Contenido Exclusivo",
        nav_gallery: "Galería",
        nav_videos: "Vídeos",
        nav_premium: "Premium",
        credits: "Créditos",
        buy_credits: "Comprar Créditos",
        load_more: "Cargar Más Contenido",
        unlock: "Desbloquear",
        premium_title: "🔥 Contenido Premium 🔥",
        premium_subtitle: "Desbloquea fotos y vídeos exclusivos",
        payment_title: "Completa tu Compra",
        privacy: "Política de Privacidad",
        terms: "Términos de Servicio",
        contact: "Contacto",
        loading: "Cargando...",
        error_loading: "Error al cargar contenido",
        success_unlock: "¡Contenido desbloqueado con éxito!",
        insufficient_credits: "Créditos insuficientes. Por favor compra más créditos.",
        video_unlocked: "¡Vídeo desbloqueado!",
        photo_unlocked: "¡Foto desbloqueada!"
    },
    de: {
        subtitle: "Paradies Galerie - Exklusiver Inhalt",
        nav_gallery: "Galerie",
        nav_videos: "Videos",
        nav_premium: "Premium",
        credits: "Guthaben",
        buy_credits: "Guthaben Kaufen",
        load_more: "Mehr Inhalt Laden",
        unlock: "Freischalten",
        premium_title: "🔥 Premium Inhalt 🔥",
        premium_subtitle: "Exklusive Fotos und Videos freischalten",
        payment_title: "Kauf Abschließen",
        privacy: "Datenschutz",
        terms: "Nutzungsbedingungen",
        contact: "Kontakt",
        loading: "Lädt...",
        error_loading: "Fehler beim Laden",
        success_unlock: "Inhalt erfolgreich freigeschaltet!",
        insufficient_credits: "Nicht genügend Guthaben. Bitte kaufen Sie mehr Guthaben.",
        video_unlocked: "Video freigeschaltet!",
        photo_unlocked: "Foto freigeschaltet!"
    },
    fr: {
        subtitle: "Galerie Paradis - Contenu Exclusif",
        nav_gallery: "Galerie",
        nav_videos: "Vidéos",
        nav_premium: "Premium",
        credits: "Crédits",
        buy_credits: "Acheter des Crédits",
        load_more: "Charger Plus de Contenu",
        unlock: "Débloquer",
        premium_title: "🔥 Contenu Premium 🔥",
        premium_subtitle: "Débloquez des photos et vidéos exclusives",
        payment_title: "Finalisez votre Achat",
        privacy: "Politique de Confidentialité",
        terms: "Conditions d'Utilisation",
        contact: "Contact",
        loading: "Chargement...",
        error_loading: "Erreur de chargement",
        success_unlock: "Contenu débloqué avec succès!",
        insufficient_credits: "Crédits insuffisants. Veuillez acheter plus de crédits.",
        video_unlocked: "Vidéo débloquée!",
        photo_unlocked: "Photo débloquée!"
    },
    it: {
        subtitle: "Galleria Paradiso - Contenuti Esclusivi",
        nav_gallery: "Galleria",
        nav_videos: "Video",
        nav_premium: "Premium",
        credits: "Crediti",
        buy_credits: "Acquista Crediti",
        load_more: "Carica Altri Contenuti",
        unlock: "Sblocca",
        premium_title: "🔥 Contenuti Premium 🔥",
        premium_subtitle: "Sblocca foto e video esclusivi",
        payment_title: "Completa il tuo Acquisto",
        privacy: "Privacy Policy",
        terms: "Termini di Servizio",
        contact: "Contatti",
        loading: "Caricamento...",
        error_loading: "Errore nel caricamento",
        success_unlock: "Contenuto sbloccato con successo!",
        insufficient_credits: "Crediti insufficienti. Acquista più crediti.",
        video_unlocked: "Video sbloccato!",
        photo_unlocked: "Foto sbloccata!"
    }
};

// ============================
// STATE MANAGEMENT
// ============================
let state = {
    currentLanguage: 'en',
    credits: 0,
    unlockedContent: [],
    currentSection: 'gallery',
    photosLoaded: 0,
    videosLoaded: 0,
    todaysPhotos: [],
    todaysVideos: [],
    currentImageIndex: 0,
    paypalReady: false,
    adNetworksLoaded: false
};

// ============================
// LOCAL STORAGE MANAGEMENT
// ============================
function loadUserData() {
    try {
        const savedData = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (savedData) {
            const data = JSON.parse(savedData);
            state.credits = data.credits || 0;
            state.unlockedContent = data.unlockedContent || [];
            state.currentLanguage = data.language || 'en';
            
            // Verificar si es un nuevo día
            const today = new Date().toDateString();
            if (data.lastVisit !== today) {
                // Nuevo día - resetear contenido diario pero mantener créditos
                data.lastVisit = today;
                localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
            }
        }
        updateCreditsDisplay();
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

function saveUserData() {
    try {
        const data = {
            credits: state.credits,
            unlockedContent: state.unlockedContent,
            language: state.currentLanguage,
            lastVisit: new Date().toDateString()
        };
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving user data:', error);
    }
}

// ============================
// DAILY ROTATION SYSTEM
// ============================
function getDailyRotation() {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    
    // Función de mezcla determinista
    function seededShuffle(array, seed) {
        const shuffled = [...array];
        let currentSeed = seed;
        
        for (let i = shuffled.length - 1; i > 0; i--) {
            currentSeed = (currentSeed * 9301 + 49297) % 233280;
            const j = Math.floor((currentSeed / 233280) * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        return shuffled;
    }
    
    // Verificar que los arrays existen
    if (typeof ALL_PHOTOS_POOL === 'undefined' || typeof ALL_UNCENSORED_PHOTOS_POOL === 'undefined') {
        console.error('Photo pools not defined!');
        return { photos: [], videos: [] };
    }
    
    if (typeof ALL_VIDEOS_POOL === 'undefined') {
        console.error('Video pool not defined!');
        return { photos: [], videos: [] };
    }
    
    // Combinar todas las fotos
    const allPhotos = [...ALL_PHOTOS_POOL, ...ALL_UNCENSORED_PHOTOS_POOL];
    const shuffledPhotos = seededShuffle(allPhotos, seed);
    const todaysPhotos = shuffledPhotos.slice(0, CONFIG.DAILY_ROTATION_PHOTOS);
    
    // Mezclar videos
    const shuffledVideos = seededShuffle(ALL_VIDEOS_POOL, seed + 1);
    const todaysVideos = shuffledVideos.slice(0, CONFIG.DAILY_ROTATION_VIDEOS);
    
    return {
        photos: todaysPhotos,
        videos: todaysVideos
    };
}

// ============================
// LANGUAGE SYSTEM
// ============================
function setLanguage(lang) {
    state.currentLanguage = lang;
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    saveUserData();
    
    // Track language change
    trackEvent('language_changed', { language: lang });
}

// ============================
// NAVIGATION
// ============================
function initializeNavigation() {
    // Section navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            switchSection(section);
        });
    });
    
    // Language selector
    const langSelect = document.getElementById('languageSelect');
    if (langSelect) {
        langSelect.value = state.currentLanguage;
        langSelect.addEventListener('change', (e) => setLanguage(e.target.value));
    }
    
    // Load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreContent);
    }
}

function switchSection(section) {
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    // Update sections
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(`${section}-section`).classList.add('active');
    
    state.currentSection = section;
    
    // Load content if needed
    if (section === 'videos' && state.videosLoaded === 0) {
        loadVideos();
    }
    
    // Track section view
    trackEvent('section_changed', { section: section });
}

// ============================
// CONTENT LOADING
// ============================
function loadGallery() {
    const container = document.getElementById('galleryContainer');
    if (!container) return;
    
    const startIndex = state.photosLoaded;
    const endIndex = Math.min(startIndex + CONFIG.PHOTOS_PER_LOAD, state.todaysPhotos.length);
    
    for (let i = startIndex; i < endIndex; i++) {
        const photo = state.todaysPhotos[i];
        const isLocked = i >= CONFIG.FREE_PHOTOS && !state.unlockedContent.includes(photo);
        
        const photoElement = createPhotoElement(photo, i, isLocked);
        container.appendChild(photoElement);
    }
    
    state.photosLoaded = endIndex;
    
    // Hide load more if all loaded
    if (state.photosLoaded >= state.todaysPhotos.length) {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    }
    
    // Initialize lazy loading
    initializeLazyLoading();
}

function loadVideos() {
    const container = document.getElementById('videosContainer');
    if (!container) return;
    
    const startIndex = state.videosLoaded;
    const endIndex = Math.min(startIndex + CONFIG.VIDEOS_PER_LOAD, state.todaysVideos.length);
    
    for (let i = startIndex; i < endIndex; i++) {
        const video = state.todaysVideos[i];
        const isLocked = i >= CONFIG.FREE_VIDEOS && !state.unlockedContent.includes(video);
        
        const videoElement = createVideoElement(video, i, isLocked);
        container.appendChild(videoElement);
    }
    
    state.videosLoaded = endIndex;
}

function createPhotoElement(photo, index, isLocked) {
    const div = document.createElement('div');
    div.className = 'gallery-item' + (isLocked ? ' locked' : '');
    div.setAttribute('data-index', index);
    
    const img = document.createElement('img');
    img.src = photo;
    img.alt = `Photo ${index + 1}`;
    img.loading = 'lazy';
    
    if (isLocked) {
        img.style.filter = `blur(${CONFIG.BLUR_AMOUNT})`;
        
        const overlay = document.createElement('div');
        overlay.className = 'locked-overlay';
        overlay.innerHTML = `
            <i class="fas fa-lock"></i>
            <button class="unlock-btn" onclick="unlockContent('${photo}', 'photo', ${index})">
                <i class="fas fa-coins"></i> ${translations[state.currentLanguage].unlock} (${CONFIG.UNLOCK_COST})
            </button>
        `;
        div.appendChild(overlay);
    } else {
        img.addEventListener('click', () => openImageModal(photo, index));
    }
    
    div.appendChild(img);
    return div;
}

function createVideoElement(video, index, isLocked) {
    const div = document.createElement('div');
    div.className = 'video-item' + (isLocked ? ' locked' : '');
    div.setAttribute('data-index', index);
    
    const videoEl = document.createElement('video');
    videoEl.src = video;
    videoEl.poster = video.replace('.mp4', '_thumb.jpg');
    videoEl.muted = true;
    videoEl.loop = true;
    
    if (isLocked) {
        videoEl.style.filter = `blur(${CONFIG.BLUR_AMOUNT})`;
        
        const overlay = document.createElement('div');
        overlay.className = 'locked-overlay';
        overlay.innerHTML = `
            <i class="fas fa-lock"></i>
            <button class="unlock-btn" onclick="unlockContent('${video}', 'video', ${index})">
                <i class="fas fa-coins"></i> ${translations[state.currentLanguage].unlock} (${CONFIG.UNLOCK_COST})
            </button>
        `;
        div.appendChild(overlay);
    } else {
        // Preview on hover
        videoEl.addEventListener('mouseenter', () => videoEl.play());
        videoEl.addEventListener('mouseleave', () => {
            videoEl.pause();
            videoEl.currentTime = 0;
        });
        videoEl.addEventListener('click', () => openVideoModal(video));
    }
    
    const playIcon = document.createElement('div');
    playIcon.className = 'play-icon';
    playIcon.innerHTML = '<i class="fas fa-play"></i>';
    
    div.appendChild(videoEl);
    div.appendChild(playIcon);
    
    return div;
}

function loadMoreContent() {
    if (state.currentSection === 'gallery') {
        loadGallery();
    } else if (state.currentSection === 'videos') {
        loadVideos();
    }
    
    trackEvent('load_more', { section: state.currentSection });
}

// ============================
// UNLOCK SYSTEM
// ============================
function unlockContent(contentPath, type, index) {
    if (state.credits < CONFIG.UNLOCK_COST) {
        alert(translations[state.currentLanguage].insufficient_credits);
        showPaymentModal();
        return;
    }
    
    // Deduct credits
    state.credits -= CONFIG.UNLOCK_COST;
    state.unlockedContent.push(contentPath);
    updateCreditsDisplay();
    saveUserData();
    
    // Update UI
    const selector = type === 'photo' ? '.gallery-item' : '.video-item';
    const element = document.querySelector(`${selector}[data-index="${index}"]`);
    
    if (element) {
        element.classList.remove('locked');
        const overlay = element.querySelector('.locked-overlay');
        if (overlay) overlay.remove();
        
        const media = element.querySelector(type === 'photo' ? 'img' : 'video');
        if (media) {
            media.style.filter = 'none';
            
            if (type === 'photo') {
                media.addEventListener('click', () => openImageModal(contentPath, index));
            } else {
                media.addEventListener('click', () => openVideoModal(contentPath));
            }
        }
    }
    
    // Show success message
    showToast(translations[state.currentLanguage][type + '_unlocked']);
    
    // Confetti animation
    if (typeof confetti !== 'undefined') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
    
    // Track unlock
    trackEvent('content_unlocked', { type: type, index: index });
}

// ============================
// MODALS
// ============================
function openImageModal(imageSrc, index) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    
    modal.style.display = 'block';
    modalImg.src = imageSrc;
    state.currentImageIndex = index;
    
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function navigateImage(direction) {
    state.currentImageIndex += direction;
    
    // Get unlocked photos only
    const unlockedPhotos = state.todaysPhotos.filter((photo, idx) => 
        idx < CONFIG.FREE_PHOTOS || state.unlockedContent.includes(photo)
    );
    
    if (state.currentImageIndex < 0) {
        state.currentImageIndex = unlockedPhotos.length - 1;
    } else if (state.currentImageIndex >= unlockedPhotos.length) {
        state.currentImageIndex = 0;
    }
    
    const modalImg = document.getElementById('modalImage');
    modalImg.src = unlockedPhotos[state.currentImageIndex];
}

function openVideoModal(videoSrc) {
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    
    modal.style.display = 'block';
    modalVideo.src = videoSrc;
    modalVideo.play();
    
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    
    modal.style.display = 'none';
    modalVideo.pause();
    modalVideo.src = '';
    document.body.style.overflow = 'auto';
}

// ============================
// PAYMENT SYSTEM
// ============================
function showPaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.style.display = 'block';
    
    if (state.paypalReady) {
        renderPayPalButtons();
    }
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.style.display = 'none';
}

function purchaseCredits(amount, price) {
    state.selectedPackage = { amount, price };
    showPaymentModal();
}

function renderPayPalButtons() {
    const container = document.getElementById('paypal-button-container');
    if (!container || container.children.length > 0) return;
    
    if (typeof paypal === 'undefined') {
        console.error('PayPal SDK not loaded');
        return;
    }
    
    paypal.Buttons({
        createOrder: function(data, actions) {
            const price = state.selectedPackage ? state.selectedPackage.price : 9.99;
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: price.toFixed(2),
                        currency_code: 'EUR'
                    },
                    description: `IbizaGirl.pics Credits - ${state.selectedPackage ? state.selectedPackage.amount : 25} credits`
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                // Add credits
                const creditsToAdd = state.selectedPackage ? state.selectedPackage.amount : 25;
                state.credits += creditsToAdd;
                updateCreditsDisplay();
                saveUserData();
                
                // Close modal
                closePaymentModal();
                
                // Show success
                showToast(`Successfully added ${creditsToAdd} credits!`);
                
                // Confetti
                if (typeof confetti !== 'undefined') {
                    confetti({
                        particleCount: 200,
                        spread: 100,
                        origin: { y: 0.5 }
                    });
                }
                
                // Track purchase
                trackEvent('purchase_completed', { 
                    amount: creditsToAdd, 
                    price: state.selectedPackage ? state.selectedPackage.price : 9.99
                });
            });
        },
        onError: function(err) {
            console.error('PayPal Error:', err);
            showToast('Payment error. Please try again.');
        }
    }).render('#paypal-button-container');
}

// ============================
// AD NETWORKS INITIALIZATION
// ============================
function initializeAdNetworks() {
    console.log('🔍 Initializing Ad Networks...');
    
    // Only initialize ads in production
    if (!ENV.isProduction) {
        console.log('⚠️ Ads disabled in development mode');
        return;
    }
    
    // AdSense
    if (AD_NETWORKS.adsense.enabled) {
        try {
            (adsbygoogle = window.adsbygoogle || []).push({});
            console.log('✅ AdSense initialized');
        } catch (e) {
            console.error('AdSense error:', e);
        }
    }
    
    // Check if other ad networks loaded
    setTimeout(() => {
        checkAdNetworksStatus();
    }, 3000);
}

function checkAdNetworksStatus() {
    console.log('🔍 Verifying Ad Networks...');
    
    let loadedNetworks = [];
    let failedNetworks = [];
    
    // Check each network
    if (window.juicyads_site_id) loadedNetworks.push('JuicyAds');
    else failedNetworks.push('JuicyAds');
    
    if (window.exoOpts) loadedNetworks.push('ExoClick');
    else failedNetworks.push('ExoClick');
    
    if (window.popCashConfig) loadedNetworks.push('PopCash');
    else failedNetworks.push('PopCash');
    
    if (loadedNetworks.length > 0) {
        console.log('✅ Loaded ad networks:', loadedNetworks.join(', '));
        state.adNetworksLoaded = true;
    }
    
    if (failedNetworks.length > 0) {
        console.log('⚠️ Failed ad networks:', failedNetworks.join(', '));
        
        // Show placeholder ads if networks failed
        if (!state.adNetworksLoaded) {
            showPlaceholderAds();
        }
    }
}

function showPlaceholderAds() {
    console.log('⚠️ No ad networks loaded, showing placeholders');
    
    document.querySelectorAll('.ad-slot').forEach(slot => {
        if (slot.children.length === 0) {
            slot.innerHTML = `
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                            color: white; 
                            padding: 40px; 
                            text-align: center; 
                            border-radius: 8px;">
                    <h3>🌴 IbizaGirl.pics Premium 🌴</h3>
                    <p>Get unlimited access to all content!</p>
                    <button onclick="showPaymentModal()" style="background: white; 
                                                                  color: #764ba2; 
                                                                  border: none; 
                                                                  padding: 10px 20px; 
                                                                  border-radius: 20px; 
                                                                  cursor: pointer; 
                                                                  font-weight: bold;">
                        Buy Credits Now
                    </button>
                </div>
            `;
        }
    });
}

// ============================
// UTILITY FUNCTIONS
// ============================
function updateCreditsDisplay() {
    const creditCount = document.getElementById('creditCount');
    if (creditCount) {
        creditCount.textContent = state.credits;
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 15px 30px;
        border-radius: 25px;
        z-index: 10000;
        animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ============================
// ANALYTICS
// ============================
function trackEvent(eventName, parameters = {}) {
    if (typeof gtag !== 'undefined' && ENV.isProduction) {
        gtag('event', eventName, parameters);
        console.log('📊 Event:', eventName, parameters);
    }
}

// ============================
// DEBUG TOOLS
// ============================
const galleryDebug = {
    addCredits: function(amount = 10) {
        state.credits += amount;
        updateCreditsDisplay();
        saveUserData();
        console.log(`✅ Added ${amount} credits. Total: ${state.credits}`);
    },
    
    unlockAll: function() {
        state.unlockedContent = [...state.todaysPhotos, ...state.todaysVideos];
        saveUserData();
        location.reload();
    },
    
    resetData: function() {
        localStorage.removeItem(CONFIG.STORAGE_KEY);
        location.reload();
    },
    
    setLanguage: function(lang) {
        setLanguage(lang);
    },
    
    contentStats: function() {
        console.log('📊 Content Statistics:');
        console.log(`Photos available today: ${state.todaysPhotos.length}`);
        console.log(`Videos available today: ${state.todaysVideos.length}`);
        console.log(`Photos loaded: ${state.photosLoaded}`);
        console.log(`Videos loaded: ${state.videosLoaded}`);
        console.log(`Unlocked content: ${state.unlockedContent.length}`);
        console.log(`Credits: ${state.credits}`);
    },
    
    testAds: function() {
        showPlaceholderAds();
    }
};

// Make debug tools available globally
window.galleryDebug = galleryDebug;

// ============================
// INITIALIZATION
// ============================
function initialize() {
    console.log('🎨 Initializing Paradise Gallery...');
    
    // Load user data
    loadUserData();
    
    // Set language
    setLanguage(state.currentLanguage);
    
    // Get daily rotation
    const rotation = getDailyRotation();
    state.todaysPhotos = rotation.photos;
    state.todaysVideos = rotation.videos;
    
    console.log(`📅 Today's rotation: ${state.todaysPhotos.length} photos, ${state.todaysVideos.length} videos`);
    
    // Initialize navigation
    initializeNavigation();
    
    // Load initial content
    loadGallery();
    
    // Initialize PayPal
    if (typeof paypal !== 'undefined') {
        state.paypalReady = true;
    } else {
        console.warn('⚠️ PayPal SDK not loaded');
    }
    
    // Initialize ad networks
    initializeAdNetworks();
    
    // Track page view
    trackEvent('page_view', { page: 'main_gallery', language: state.currentLanguage });
    
    // Setup modal close on click outside
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            if (event.target.id === 'imageModal') closeImageModal();
            if (event.target.id === 'videoModal') closeVideoModal();
            if (event.target.id === 'paymentModal') closePaymentModal();
        }
    };
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (document.getElementById('imageModal').style.display === 'block') {
            if (e.key === 'ArrowLeft') navigateImage(-1);
            if (e.key === 'ArrowRight') navigateImage(1);
            if (e.key === 'Escape') closeImageModal();
        }
    });
    
    console.log('✅ Gallery loaded successfully!');
    console.log('🌍 Language:', state.currentLanguage);
    console.log('📊 Analytics:', CONFIG.ANALYTICS_ID);
    console.log('💳 PayPal:', state.paypalReady ? 'Ready' : 'Not loaded');
    console.log('📢 Ad Networks:', ENV.isProduction ? 'Enabled (Production)' : 'Disabled (Development)');
    console.log('🌊 Version: 13.1.1 Fixed - 200 fotos + 40 videos diarios + ads mejoradas');
}

// ============================
// START APPLICATION
// ============================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

// ============================
// GLOBAL FUNCTIONS FOR HTML
// ============================
window.unlockContent = unlockContent;
window.showPaymentModal = showPaymentModal;
window.closePaymentModal = closePaymentModal;
window.purchaseCredits = purchaseCredits;
window.openImageModal = openImageModal;
window.closeImageModal = closeImageModal;
window.navigateImage = navigateImage;
window.openVideoModal = openVideoModal;
window.closeVideoModal = closeVideoModal;

// Debug info
console.log('🔧 Debug tools available: galleryDebug');
console.log('💡 Try: galleryDebug.contentStats() or galleryDebug.setLanguage("en")');
console.log('📝 Test ads: galleryDebug.testAds()');
console.log('🔓 Unlock all: galleryDebug.unlockAll()');
console.log('💰 Add credits: galleryDebug.addCredits(100)');
console.log('📊 Content stats: galleryDebug.contentStats()');
console.log('🌍 Environment:', ENV.isProduction ? 'Production Mode' : 'Development Mode');
