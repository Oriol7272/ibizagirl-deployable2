// Home initialization
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si UCAPI existe, si no, crearlo
    if (typeof window.UCAPI === 'undefined') {
        window.UCAPI = {
            getRandomContent: function(count, type) {
                // Usar publicContent si está disponible
                if (window.publicContent && window.publicContent.length > 0) {
                    const shuffled = [...window.publicContent].sort(() => 0.5 - Math.random());
                    return shuffled.slice(0, count);
                }
                return [];
            }
        };
    }
    
    // Inicializar carousel
    const carouselEl = document.getElementById('carousel');
    if (carouselEl && window.publicContent) {
        const images = window.UCAPI.getRandomContent(40, 'public');
        images.forEach(function(img) {
            const item = document.createElement('div');
            item.className = 'carousel-item';
            const imgSrc = img.thumb || img.full || '/full/1.webp';
            item.innerHTML = '<img src="' + imgSrc + '" alt="Beach photo" loading="lazy">';
            carouselEl.appendChild(item);
        });
    }
    
    // Inicializar gallery
    const galleryEl = document.getElementById('gallery');
    if (galleryEl && window.publicContent) {
        const images = window.UCAPI.getRandomContent(40, 'public');
        images.forEach(function(img) {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            const imgSrc = img.thumb || img.full || '/full/1.webp';
            item.innerHTML = '<img src="' + imgSrc + '" alt="Beach photo" loading="lazy">';
            galleryEl.appendChild(item);
        });
    }
    
    console.log("Home initialized");
});
