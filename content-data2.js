/**
 * content-data2.js - Public Images Module v2.0.0 FIXED
 * Contains all public/full images (127 files)
 * Provides banner and teaser management
 */

// ============================
// PUBLIC IMAGES POOL (127 images)
// ============================

const FULL_IMAGES_POOL = [
    'full/0456996c-b56e-42ef-9049-56b1a1ae2646.webp',
    'full/85158b64-4168-45fa-9cb4-0b40634f7fa1.webp',
    'full/0Tc8Vtd0mEIvNHZwYGBq.webp',
    'full/0lySugcO4Pp4pEZKvz9U.webp',
    'full/0nSaCJQxbVw4BDrhnhHO.webp',
    'full/13TXvyRVZ7LtvAOx7kme.webp',
    'full/18VQaczW5kdfdiqUVasH.webp',
    'full/1dEu25K0mS3zxRlXRjHR.webp',
    'full/1qEBcg9QbkZRRdLt0Chc.webp',
    'full/1tt8H4fX3XzyV90HjNG3.webp',
    'full/27bGIzFFpej5ubUkvykD.webp',
    'full/2gjqH68H586TKLDK9lh9.webp',
    'full/2yw4sowPh3Tyln5oxRdw.webp',
    'full/39GYGt3bticS0Mjbud0p.webp',
    'full/3IWka3fnP9b8yz6j5l91.webp',
    'full/3ZYL4GCUOs3rfq3iTPJ7.webp',
    'full/4GN6i0Db2hl4Ck9vf0LE.webp',
    'full/4YhoIAWSbVaOqBhAOGqR.webp',
    'full/82KxJ9daxf9MpK019L5I.webp',
    'full/83cSC4eRnYGZUNo9AoqD.webp',
    'full/8faf42TRuGOU4ZW9KS9W.webp',
    'full/92Ck0v3g8gZLEQ5vOmpd.webp',
    'full/993acHdsWLzG80gAFZQs.webp',
    'full/9D5U5fKXT72xnpqsgUaD.webp',
    'full/9v20KsJFZoAv2WQ8m3o2.webp',
    'full/AHKAq0biFDUtkxlx7TCu.webp',
    'full/ANhHtA0GivBfeAo6dvJG.webp',
    'full/AwKXjDqrJMTKNvB84iRy.webp',
    'full/CTyCcna8JSPObRQpulKJ.webp',
    'full/CmxJm1VLBBhvZoUwxWTJ.webp',
    'full/CuX7zQzCBToIMKBYVcA8.webp',
    'full/D3QdNfIR9B8YKPIYl0Hg.webp',
    'full/FElwiy3A7OtgubeV9Qsh.webp',
    'full/Fz2ORrJSrERl0BZGOH24.webp',
    'full/G4YdNFtdunscrnPe5Qb6.webp',
    'full/G5tR4rjmD4dWct9aKfMu.webp',
    'full/I2enQjaFiBfPB2hml0xQ.webp',
    'full/ICDQwh9QLaL3SpYTmk4i.webp',
    'full/IXCJwuZEjxFfPTinm4Cq.webp',
    'full/KdV7YfJSRdkUhCdH17lZ.webp',
    'full/KrjJ0Nh1OjqDRYLfJKGY.webp',
    'full/L31aDNAKWGOdPNsejJRA.webp',
    'full/LFv0YdpW3XKJvMN5mLzw.webp',
    'full/LoOgRN7V5M1HTlMOdOx9.webp',
    'full/MFzl3cW8ePBkYW9Df18O.webp',
    'full/MH98E5xp8a1QJVRWaQXa.webp',
    'full/MJhP1PtUiw8T5t6vfGME.webp',
    'full/Ma4pNp5Nqk2P3RhGh96d.webp',
    'full/NJQKAp1c3oUnGhX65QOi.webp',
    'full/Nfj2RYWdkYzqy8tXXJSx.webp',
    'full/OKrIxyDbmUotvjJUc3Yg.webp',
    'full/OZxhqcxQOTSJG8q2KUyy.webp',
    'full/OejORb3WEG2n3g6X6wl0.webp',
    'full/PCA3DHB5xAMZHgKOWdRy.webp',
    'full/PxY1T43xqNEoqLJiXhqe.webp',
    'full/Q2v8VjBAOCekWJdxUxj4.webp',
    'full/Q4Oo6gJnCN9PNQYYZ38B.webp',
    'full/Q5Uw1VdGOrvJFvtQnOVF.webp',
    'full/QRRbuwLjWCLFzwQaJsjp.webp',
    'full/RSjxPBQWRJNTL9TBNzGo.webp',
    'full/RsqG8NVcrTPRFJwfzWsP.webp',
    'full/SM3v0sRxMSWD7hX9NkOY.webp',
    'full/SQJP34XBE9cOHPGAHYj5.webp',
    'full/TaekJvnJHxRuSx9IrZnN.webp',
    'full/TlFRGcP5KYj2cCTkMiSd.webp',
    'full/UG4Hm8SiQ4Ayd4zTsODh.webp',
    'full/VOHbXGDPqQ7UHM8VhXJb.webp',
    'full/VQO8W0v1G8fsBYTFjTxw.webp',
    'full/VXUP5NNg5n2zT1J8fLbT.webp',
    'full/XDBPX1vb0zw9sjCx8DFz.webp',
    'full/YX6rz0eEqhfgjGdKWLcW.webp',
    'full/ZQlJrRBJP0f6xOpFJHud.webp',
    'full/ZksRGE3yBPzgJVRBMSSk.webp',
    'full/Znx2fvXGJy8mOSKJLZBH.webp',
    'full/aJgXRnfXXHCO0n31hjyI.webp',
    'full/aMEo3OJBcg4bvxYOlJr2.webp',
    'full/auTojRSoSJm8XFGX4Bqb.webp',
    'full/dCQhXJ5M6H0E3HDLJRKa.webp',
    'full/dyqJfHgJaJqiORZZlG92.webp',
    'full/e9TjLXTDhxMBRTa0DNKD.webp',
    'full/eqo8m6gFrOxF45nVdJ1b.webp',
    'full/fxhbLp5F0XQu8NdKzgJE.webp',
    'full/gEdPiXBnRXpOxJWRfhAj.webp',
    'full/gTcZQCpJMxQxbvvSGJFj.webp',
    'full/hdPLlrQHoRnRLk6vRBMz.webp',
    'full/hw5n4EeO7pEgjqYCzz3F.webp',
    'full/i3YzLBaKnCy1QI2oCgq1.webp',
    'full/iFOOYFOjpv0tBiCsQVx5.webp',
    'full/iPLH9pZsXGLnzZhgY9Sc.webp',
    'full/jNOKVMXzlRg7HfznKm0R.webp',
    'full/joRNXJx7i0H2FRGX1Kkv.webp',
    'full/kGGdEqPfbxnE4XCUJXmY.webp',
    'full/knA5WRBjOVD9o2w4IxJH.webp',
    'full/kw4qROGQNFB9CJHvT1FA.webp',
    'full/lH31C1OXBaLQGgpq1xHlH.webp',
    'full/lXpckkGACDNcXPAHEQqu.webp',
    'full/mFuqtladZr2hO3Tszm3m.webp',
    'full/nJvZXk80qguZvwOeSai6.webp',
    'full/nm6YKc38NLqwGPaNiDhc.webp',
    'full/owPT3Y4puK3dRHWNsj47.webp',
    'full/psZEFLlVAhAiq10uJ8qd.webp',
    'full/qLDeRznPthcmYSmggfbm.webp',
    'full/qhK8inhLxacOs8w7mRbE.webp',
    'full/qxIzW9ZMuhkEY6dmGKSv.webp',
    'full/sMAD8T2U7A3aMQjxsUdd.webp',
    'full/sda0bXv4LRWxnW49KPWT.webp',
    'full/sfz7eFmqHWlf6wrpTDD9.webp',
    'full/t9WqMZxXkmUTMrq3d13l.webp',
    'full/tMxzKdT8rjZm3gpe0StS.webp',
    'full/tQ41YocTwqSnd8mFsDc5.webp',
    'full/tQInulLfQHQTFNIK6yEV.webp',
    'full/tzico6mUJuc7Lz8HYdEF.webp',
    'full/uMSW2oj0qrbVEmIEotZ1.webp',
    'full/ufXYerfLKedF1f6OYNhd.webp',
    'full/wrs60TS7VJQlmWbyKKUu.webp',
    'full/xhQTgYHiVAYbnYrKIsOq.webp',
    'full/yqTobCZL2AABmmNJ7EPU.webp',
    'full/zNzTQ476q4sOPWRaVPEw.webp',
    'full/zRPnijTCwLqQeZLXLvzu.webp',
    'full/zSzYfjo7gtKbVBWGhbJN.webp',
    'full/zUNmPEaVFiJfL1mo27ga.webp',
    'full/zs7GNC0HKhDQwRIsB9IM.webp',
    'full/zx83JCzdTKNfyKUY6Djs.webp',
    'full/Sinoseup.webp',
    'full/Sinportada.webp',
    'full/Sintulo.webp',
    'full/Siulo.webp',
    'full/backbikini.webp',
    'full/bikback2.webp',
    'full/bikbanner.webp',
    'full/bikbanner2.webp',
    'full/bikini.webp',
    'full/bikini3.webp',
    'full/bikini5.webp'
];

// ============================
// BANNER & TEASER MANAGER
// ============================

class BannerTeaserManager {
    constructor() {
        this.banners = [];
        this.teasers = [];
        this.initialized = false;
        this.rotationInterval = null;
    }
    
    initialize() {
        if (this.initialized) return;
        
        // Verificar que el pool existe
        if (!FULL_IMAGES_POOL || FULL_IMAGES_POOL.length === 0) {
            console.error('❌ FULL_IMAGES_POOL no está disponible');
            return;
        }
        
        // Extraer banners específicos
        this.banners = [
            'full/bikbanner.webp',
            'full/bikbanner2.webp',
            'full/backbikini.webp',
            'full/bikback2.webp',
            'full/bikini.webp'
        ];
        
        // Extraer teasers - usar imágenes específicas de bikini y algunas aleatorias
        this.teasers = [
            'full/bikini.webp',
            'full/bikini3.webp',
            'full/bikini5.webp',
            'full/Sinoseup.webp',
            'full/Sinportada.webp',
            'full/Sintulo.webp',
            'full/Siulo.webp',
            ...this.getRandomImages(3)
        ];
        
        this.initialized = true;
        console.log(`✅ BannerTeaserManager initialized: ${this.banners.length} banners, ${this.teasers.length} teasers`);
    }
    
    getBanners() {
        if (!this.initialized) this.initialize();
        return [...this.banners];
    }
    
    getTeasers() {
        if (!this.initialized) this.initialize();
        return [...this.teasers];
    }
    
    getRandomBanner() {
        const banners = this.getBanners();
        if (banners.length === 0) return null;
        return banners[Math.floor(Math.random() * banners.length)];
    }
    
    getRandomTeaser() {
        const teasers = this.getTeasers();
        if (teasers.length === 0) return null;
        return teasers[Math.floor(Math.random() * teasers.length)];
    }
    
    getRandomImages(count = 10) {
        if (!FULL_IMAGES_POOL || FULL_IMAGES_POOL.length === 0) return [];
        
        const shuffled = [...FULL_IMAGES_POOL].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, shuffled.length));
    }
    
    rotateContent() {
        // Rotar contenido cada día
        const now = new Date();
        const seed = now.getFullYear() * 1000 + now.getMonth() * 100 + now.getDate();
        
        // Usar seed para obtener índices consistentes durante el día
        const bannerIndex = seed % this.banners.length;
        const teaserStartIndex = seed % Math.max(1, this.teasers.length - 5);
        
        return {
            todaysBanner: this.banners[bannerIndex],
            todaysTeasers: this.teasers.slice(teaserStartIndex, teaserStartIndex + 5)
        };
    }
    
    startAutoRotation(intervalMs = 5000) {
        if (this.rotationInterval) {
            clearInterval(this.rotationInterval);
        }
        
        this.rotationInterval = setInterval(() => {
            // Emit custom event for rotation
            window.dispatchEvent(new CustomEvent('bannerRotation', {
                detail: {
                    banner: this.getRandomBanner(),
                    teaser: this.getRandomTeaser()
                }
            }));
        }, intervalMs);
    }
    
    stopAutoRotation() {
        if (this.rotationInterval) {
            clearInterval(this.rotationInterval);
            this.rotationInterval = null;
        }
    }
}

// ============================
// UTILITY FUNCTIONS
// ============================

const ImageUtils = {
    // Obtener todas las imágenes
    getAllImages() {
        return [...FULL_IMAGES_POOL];
    },
    
    // Buscar imágenes por nombre
    searchImages(query) {
        if (!query || !FULL_IMAGES_POOL) return [];
        const queryLower = query.toLowerCase();
        return FULL_IMAGES_POOL.filter(img => 
            img.toLowerCase().includes(queryLower)
        );
    },
    
    // Validar si una imagen existe en el pool
    imageExists(imagePath) {
        return FULL_IMAGES_POOL && FULL_IMAGES_POOL.includes(imagePath);
    },
    
    // Obtener imagen aleatoria
    getRandomImage() {
        if (!FULL_IMAGES_POOL || FULL_IMAGES_POOL.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * FULL_IMAGES_POOL.length);
        return FULL_IMAGES_POOL[randomIndex];
    },
    
    // Obtener imágenes por patrón
    getImagesByPattern(pattern) {
        if (!FULL_IMAGES_POOL) return [];
        const regex = new RegExp(pattern, 'i');
        return FULL_IMAGES_POOL.filter(img => regex.test(img));
    },
    
    // Obtener subset de imágenes
    getImageSubset(start = 0, count = 10) {
        if (!FULL_IMAGES_POOL) return [];
        return FULL_IMAGES_POOL.slice(start, start + count);
    },
    
    // Obtener estadísticas
    getStats() {
        return {
            total: FULL_IMAGES_POOL ? FULL_IMAGES_POOL.length : 0,
            banners: FULL_IMAGES_POOL ? FULL_IMAGES_POOL.filter(img => img.includes('banner')).length : 0,
            teasers: FULL_IMAGES_POOL ? FULL_IMAGES_POOL.filter(img => img.includes('bikini')).length : 0
        };
    }
};

// ============================
// INITIALIZATION & EXPORTS
// ============================

// Crear instancia global
const globalBannerManager = new BannerTeaserManager();

// Exponer APIs globales
window.FULL_IMAGES_POOL = FULL_IMAGES_POOL;
window.BannerTeaserManager = globalBannerManager;
window.ImageUtils = ImageUtils;

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        globalBannerManager.initialize();
    });
} else {
    globalBannerManager.initialize();
}

// Compatibilidad con código legacy
window.getAllPhotos = () => FULL_IMAGES_POOL;
window.getBannerImages = () => globalBannerManager.getBanners();
window.getTeaserImages = () => globalBannerManager.getTeasers();
window.rotateBannersAndTeasers = () => globalBannerManager.rotateContent();

// Log de inicialización
console.log(`📦 content-data2.js v2.0.0 FIXED loaded`);
console.log(`   - ${FULL_IMAGES_POOL.length} imágenes públicas disponibles`);
console.log(`   - BannerTeaserManager inicializado`);
console.log(`   - ImageUtils disponible`);

// Exportar para módulos ES6 si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FULL_IMAGES_POOL,
        BannerTeaserManager: globalBannerManager,
        ImageUtils
    };
}
