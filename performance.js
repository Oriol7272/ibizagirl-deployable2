// Lazy loading mejorado
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy-placeholder');
            imageObserver.unobserve(img);
        }
    });
}, {
    rootMargin: '50px'
});

// Cargar imágenes progresivamente
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
        img.classList.add('lazy-placeholder');
        imageObserver.observe(img);
    });
    
    // Marcar contenido nuevo
    markNewContent();
    
    // Setup email
    setupEmailCapture();
});

// Debounce scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = requestAnimationFrame(() => {
        // Scroll logic here
    });
}, { passive: true });

// Prefetch on hover
document.addEventListener('mouseover', (e) => {
    if (e.target.tagName === 'A') {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = e.target.href;
        document.head.appendChild(link);
    }
});
