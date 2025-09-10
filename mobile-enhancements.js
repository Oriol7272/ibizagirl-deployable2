// Detectar dispositivo móvil
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Vibración háptica en clicks (si está disponible)
if (isMobile && 'vibrate' in navigator) {
    document.addEventListener('click', (e) => {
        if (e.target.matches('.premium-item, .video-item, .offer-item, button')) {
            navigator.vibrate(10);
        }
    });
}

// Lazy loading mejorado para móvil
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('skeleton');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        img.classList.add('skeleton');
        imageObserver.observe(img);
    });
}

// Pull to refresh
let startY = 0;
let pulling = false;

document.addEventListener('touchstart', (e) => {
    if (window.scrollY === 0) {
        startY = e.touches[0].pageY;
        pulling = true;
    }
});

document.addEventListener('touchmove', (e) => {
    if (pulling) {
        const y = e.touches[0].pageY;
        const diff = y - startY;
        if (diff > 100) {
            location.reload();
        }
    }
});

document.addEventListener('touchend', () => {
    pulling = false;
});

// Smooth scroll para móvil
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Service Worker para PWA
if ('serviceWorker' in navigator && !isMobile) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
}
