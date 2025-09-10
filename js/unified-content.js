// Sistema unificado de contenido para IbizaGirl.pics
window.UnifiedContentAPI = {
    // Obtener pool completo de imágenes públicas
    getFullPool() {
        return window.FULL_IMAGES_POOL || [];
    },
    
    // Obtener pool completo de imágenes premium
    getPremiumPool() {
        const part1 = window.PREMIUM_IMAGES_PART1 || [];
        const part2 = window.PREMIUM_IMAGES_PART2 || [];
        return [...part1, ...part2];
    },
    
    // Obtener pool de videos
    getVideoPool() {
        return window.PREMIUM_VIDEOS_POOL || [];
    },
    
    // Obtener imágenes aleatorias
    getRandomImages(pool, count = 40) {
        const shuffled = this.shuffleArray([...pool]);
        return shuffled.slice(0, count);
    },
    
    // Mezclar array
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    },
    
    // Obtener URL de imagen con CDN
    getImageUrl(filename) {
        const baseUrl = 'https://beachgirl-assets.s3.eu-north-1.amazonaws.com';
        if (filename.startsWith('full/') || filename.startsWith('uncensored/') || filename.startsWith('uncensored-videos/')) {
            return `${baseUrl}/${filename}`;
        }
        return `/${filename}`;
    }
};

console.log('✅ Sistema unificado de contenido inicializado');
