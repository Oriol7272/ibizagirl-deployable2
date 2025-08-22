/**
 * verification.js - Script de Verificación del Sistema v4.1.0
 * Ejecutar en la consola del navegador después de cargar la página
 */

console.log('🔍 INICIANDO VERIFICACIÓN COMPLETA DEL SISTEMA...\n');
console.log('=====================================');

// ============================
// 1. VERIFICACIÓN DE MÓDULOS
// ============================

console.log('\n📦 1. VERIFICACIÓN DE MÓDULOS:');
console.log('-------------------------------------');

const moduleChecks = {
    'content-data1.js': {
        loaded: !!(window.ContentConfig && window.TimeUtils && window.ArrayUtils),
        components: ['ContentConfig', 'TimeUtils', 'ArrayUtils', 'EventManager', 'StorageManager']
    },
    'content-data2.js': {
        loaded: !!(window.FULL_IMAGES_POOL && window.BannerTeaserManager),
        components: ['FULL_IMAGES_POOL', 'BannerTeaserManager', 'PublicContentManager'],
        expectedCount: 127
    },
    'content-data3.js': {
        loaded: !!(window.PREMIUM_IMAGES_PART1 && window.PremiumContentPart1),
        components: ['PREMIUM_IMAGES_PART1', 'PremiumContentPart1'],
        expectedCount: 186
    },
    'content-data4.js': {
        loaded: !!(window.PREMIUM_IMAGES_PART2 && window.PremiumContentPart2),
        components: ['PREMIUM_IMAGES_PART2', 'PremiumContentPart2'],
        expectedCount: 204
    },
    'content-data5.js': {
        loaded: !!(window.PREMIUM_VIDEOS_POOL && window.VideoContentManager),
        components: ['PREMIUM_VIDEOS_POOL', 'VideoContentManager', 'VideoUtils'],
        expectedCount: 67
    },
    'content-data6.js': {
        loaded: !!(window.ContentAPI && window.UnifiedContentAPI),
        components: ['ContentAPI', 'UnifiedContentAPI', 'ContentSystemManager']
    }
};

let allModulesLoaded = true;

Object.entries(moduleChecks).forEach(([module, check]) => {
    console.log(`\n${check.loaded ? '✅' : '❌'} ${module}: ${check.loaded ? 'CARGADO' : 'NO CARGADO'}`);
    
    if (check.loaded) {
        check.components.forEach(component => {
            const exists = !!window[component];
            console.log(`   ${exists ? '✓' : '✗'} ${component}: ${exists ? 'OK' : 'FALTA'}`);
        });
        
        if (check.expectedCount) {
            const actualCount = window[check.components[0]]?.length || 0;
            const countMatch = actualCount === check.expectedCount;
            console.log(`   ${countMatch ? '✓' : '✗'} Cantidad: ${actualCount}/${check.expectedCount} ${countMatch ? 'CORRECTO' : 'INCORRECTO'}`);
            if (!countMatch) allModulesLoaded = false;
        }
    } else {
        allModulesLoaded = false;
    }
});

// ============================
// 2. VERIFICACIÓN DE CONTENIDO
// ============================

console.log('\n\n📊 2. VERIFICACIÓN DE CONTENIDO:');
console.log('-------------------------------------');

const contentStats = {
    'Imágenes Públicas': window.FULL_IMAGES_POOL?.length || 0,
    'Imágenes Premium P1': window.PREMIUM_IMAGES_PART1?.length || 0,
    'Imágenes Premium P2': window.PREMIUM_IMAGES_PART2?.length || 0,
    'Videos Premium': window.PREMIUM_VIDEOS_POOL?.length || 0,
    'Banners': window.BANNER_IMAGES?.length || 0,
    'Teasers': window.TEASER_IMAGES?.length || 0
};

const expectedCounts = {
    'Imágenes Públicas': 127,
    'Imágenes Premium P1': 186,
    'Imágenes Premium P2': 204,
    'Videos Premium': 67,
    'Banners': 6,
    'Teasers': 10
};

let contentCorrect = true;

Object.entries(contentStats).forEach(([type, count]) => {
    const expected = expectedCounts[type];
    const isCorrect = count === expected;
    if (!isCorrect) contentCorrect = false;
    
    console.log(`${isCorrect ? '✅' : '❌'} ${type}: ${count}/${expected} ${isCorrect ? '' : '⚠️ REVISAR'}`);
});

const totalContent = Object.values(contentStats).slice(0, 4).reduce((a, b) => a + b, 0);
console.log(`\n📈 TOTAL ARCHIVOS: ${totalContent}/584`);

// ============================
// 3. VERIFICACIÓN DE APIs
// ============================

console.log('\n\n🔌 3. VERIFICACIÓN DE APIs:');
console.log('-------------------------------------');

const apiTests = {
    'ContentAPI.getPublicImages': () => {
        const images = window.ContentAPI?.getPublicImages(5);
        return images && images.length === 5;
    },
    'ContentAPI.getPremiumImages': () => {
        const images = window.ContentAPI?.getPremiumImages(5);
        return images && images.length === 5;
    },
    'ContentAPI.getVideos': () => {
        const videos = window.ContentAPI?.getVideos(5);
        return videos && videos.length === 5;
    },
    'ContentAPI.getBanners': () => {
        const banners = window.ContentAPI?.getBanners();
        return banners && banners.length > 0;
    },
    'ContentAPI.getTeasers': () => {
        const teasers = window.ContentAPI?.getTeasers();
        return teasers && teasers.length > 0;
    },
    'UnifiedContentAPI.initialized': () => {
        return window.UnifiedContentAPI?.initialized === true;
    }
};

let apisWorking = true;

Object.entries(apiTests).forEach(([api, test]) => {
    try {
        const result = test();
        console.log(`${result ? '✅' : '❌'} ${api}: ${result ? 'FUNCIONA' : 'ERROR'}`);
        if (!result) apisWorking = false;
    } catch (error) {
        console.log(`❌ ${api}: ERROR - ${error.message}`);
        apisWorking = false;
    }
});

// ============================
// 4. VERIFICACIÓN DE PAYPAL
// ============================

console.log('\n\n💳 4. VERIFICACIÓN DE PAYPAL:');
console.log('-------------------------------------');

const paypalConfig = window.ContentConfig?.paypal || {};
const paypalChecks = {
    'Client ID': paypalConfig.clientId === 'AfQEdiielw5fm3wF08p9pcxwqR3gPz82YRNUTKY4A8WNG9AktiGsDNyr2i7BsjVzSwwpeCwR7Tt7DPq5',
    'Moneda': paypalConfig.currency === 'EUR',
    'Entorno': paypalConfig.environment === 'production',
    'Precio Mensual': window.ContentConfig?.pricing?.monthly === 15,
    'Precio Lifetime': window.ContentConfig?.pricing?.lifetime === 100
};

let paypalCorrect = true;

Object.entries(paypalChecks).forEach(([check, result]) => {
    console.log(`${result ? '✅' : '❌'} ${check}: ${result ? 'CORRECTO' : 'INCORRECTO'}`);
    if (!result) paypalCorrect = false;
});

// ============================
// 5. VERIFICACIÓN DE ANUNCIOS
// ============================

console.log('\n\n📢 5. VERIFICACIÓN DE ANUNCIOS:');
console.log('-------------------------------------');

const adsConfig = window.ContentConfig?.ads || {};
const adsChecks = {
    'Anuncios Habilitados': adsConfig.enabled === true,
    'Intervalo de Refresh': adsConfig.refreshInterval === 30000,
    'Max por Página': adsConfig.maxPerPage === 4,
    'Redes Configuradas': Array.isArray(adsConfig.networks) && adsConfig.networks.length > 0
};

let adsCorrect = true;

Object.entries(adsChecks).forEach(([check, result]) => {
    console.log(`${result ? '✅' : '❌'} ${check}: ${result ? 'OK' : 'REVISAR'}`);
    if (!result) adsCorrect = false;
});

if (adsConfig.networks) {
    console.log(`   Redes: ${adsConfig.networks.join(', ')}`);
}

// ============================
// 6. VERIFICACIÓN DE RUTAS
// ============================

console.log('\n\n📁 6. VERIFICACIÓN DE RUTAS:');
console.log('-------------------------------------');

const pathChecks = {
    'Imágenes Públicas': {
        sample: window.FULL_IMAGES_POOL?.[0],
        expectedPath: 'full/',
        expectedExt: '.webp'
    },
    'Imágenes Premium': {
        sample: window.PREMIUM_IMAGES_PART1?.[0],
        expectedPath: 'uncensored/',
        expectedExt: '.webp'
    },
    'Videos Premium': {
        sample: window.PREMIUM_VIDEOS_POOL?.[0],
        expectedPath: 'uncensored-videos/',
        expectedExt: '.mp4'
    }
};

let pathsCorrect = true;

Object.entries(pathChecks).forEach(([type, check]) => {
    if (check.sample) {
        const hasCorrectPath = check.sample.includes(check.expectedPath);
        const hasCorrectExt = check.sample.endsWith(check.expectedExt);
        const isCorrect = hasCorrectPath && hasCorrectExt;
        
        console.log(`${isCorrect ? '✅' : '❌'} ${type}:`);
        console.log(`   Muestra: ${check.sample.substring(0, 50)}...`);
        console.log(`   Ruta: ${hasCorrectPath ? '✓' : '✗'} ${check.expectedPath}`);
        console.log(`   Extensión: ${hasCorrectExt ? '✓' : '✗'} ${check.expectedExt}`);
        
        if (!isCorrect) pathsCorrect = false;
    } else {
        console.log(`❌ ${type}: NO HAY DATOS`);
        pathsCorrect = false;
    }
});

// ============================
// 7. VERIFICACIÓN DE FUNCIONES
// ============================

console.log('\n\n🛠️ 7. VERIFICACIÓN DE FUNCIONES:');
console.log('-------------------------------------');

const functionTests = {
    'Rotación Diaria': () => {
        if (window.UnifiedContentAPI?.getTodaysContent) {
            const content = window.UnifiedContentAPI.getTodaysContent();
            return content && content.photos && content.videos;
        }
        return false;
    },
    'Búsqueda': () => {
        if (window.ContentAPI?.search) {
            const results = window.ContentAPI.search('bikini');
            return results && (results.photos || results.videos);
        }
        return false;
    },
    'Paginación': () => {
        if (window.UnifiedContentAPI?.paginateContent) {
            const page = window.UnifiedContentAPI.paginateContent('public', 1, 24);
            return page && page.data && page.data.length > 0;
        }
        return false;
    },
    'Estadísticas': () => {
        if (window.ContentAPI?.getStats) {
            const stats = window.ContentAPI.getStats();
            return stats && stats.total >= 0;
        }
        return false;
    }
};

let functionsWorking = true;

Object.entries(functionTests).forEach(([func, test]) => {
    try {
        const result = test();
        console.log(`${result ? '✅' : '❌'} ${func}: ${result ? 'FUNCIONA' : 'ERROR'}`);
        if (!result) functionsWorking = false;
    } catch (error) {
        console.log(`❌ ${func}: ERROR - ${error.message}`);
        functionsWorking = false;
    }
});

// ============================
// 8. VERIFICACIÓN DE THUMBNAILS
// ============================

console.log('\n\n🖼️ 8. VERIFICACIÓN DE THUMBNAILS:');
console.log('-------------------------------------');

// Verificar si hay elementos con blur
const lockedElements = document.querySelectorAll('.photo-item.locked img, .video-item.locked img');
const blurredElements = Array.from(lockedElements).filter(el => {
    const filter = window.getComputedStyle(el).filter;
    return filter && filter.includes('blur');
});

console.log(`📸 Elementos bloqueados encontrados: ${lockedElements.length}`);
console.log(`🔐 Elementos con blur aplicado: ${blurredElements.length}`);

if (lockedElements.length > 0) {
    const sampleElement = lockedElements[0];
    const computedFilter = window.getComputedStyle(sampleElement).filter;
    console.log(`   Filtro aplicado: ${computedFilter || 'ninguno'}`);
}

// ============================
// 9. VERIFICACIÓN DE SERVICE WORKER
// ============================

console.log('\n\n⚡ 9. VERIFICACIÓN DE SERVICE WORKER:');
console.log('-------------------------------------');

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
        if (registrations.length > 0) {
            console.log('✅ Service Worker registrado');
            registrations.forEach(reg => {
                console.log(`   Scope: ${reg.scope}`);
                console.log(`   Estado: ${reg.active ? 'Activo' : 'Inactivo'}`);
            });
        } else {
            console.log('❌ Service Worker NO registrado');
        }
    });
} else {
    console.log('❌ Service Worker NO soportado');
}

// ============================
// 10. RESUMEN FINAL
// ============================

console.log('\n\n');
console.log('=====================================');
console.log('📋 RESUMEN DE VERIFICACIÓN');
console.log('=====================================\n');

const summary = {
    '1. Módulos': allModulesLoaded,
    '2. Contenido': contentCorrect,
    '3. APIs': apisWorking,
    '4. PayPal': paypalCorrect,
    '5. Anuncios': adsCorrect,
    '6. Rutas': pathsCorrect,
    '7. Funciones': functionsWorking
};

let allPassed = true;

Object.entries(summary).forEach(([section, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${section}: ${passed ? 'CORRECTO' : 'FALLA'}`);
    if (!passed) allPassed = false;
});

console.log('\n=====================================');

if (allPassed) {
    console.log('🎉 ¡SISTEMA COMPLETAMENTE FUNCIONAL!');
    console.log('✅ Todos los componentes verificados correctamente');
} else {
    console.log('⚠️ HAY COMPONENTES QUE NECESITAN REVISIÓN');
    console.log('Por favor, revisa los errores indicados arriba');
}

console.log('=====================================\n');

// ============================
// FUNCIONES DE DEBUG ADICIONALES
// ============================

window.debugSystem = {
    // Mostrar todo el contenido
    showAllContent: () => {
        if (window.UnifiedContentAPI) {
            return window.UnifiedContentAPI.getAllContent();
        }
        return null;
    },
    
    // Probar rotación
    testRotation: () => {
        if (window.UnifiedContentAPI) {
            return window.UnifiedContentAPI.getTodaysContent();
        }
        return null;
    },
    
    // Ver estadísticas completas
    fullStats: () => {
        if (window.UnifiedContentAPI) {
            return window.UnifiedContentAPI.getSystemStats();
        }
        return null;
    },
    
    // Probar paginación
    testPagination: (page = 1) => {
        if (window.UnifiedContentAPI) {
            return window.UnifiedContentAPI.paginateContent('all', page, 24);
        }
        return null;
    },
    
    // Verificar una imagen específica
    checkImage: (url) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ url, status: 'OK', width: img.width, height: img.height });
            img.onerror = () => resolve({ url, status: 'ERROR' });
            img.src = url;
        });
    },
    
    // Verificar varias imágenes
    checkImages: async (count = 10) => {
        const images = window.FULL_IMAGES_POOL?.slice(0, count) || [];
        const results = [];
        
        for (const img of images) {
            const result = await window.debugSystem.checkImage(img);
            results.push(result);
            console.log(`${result.status === 'OK' ? '✅' : '❌'} ${img}`);
        }
        
        return results;
    }
};

console.log('💡 FUNCIONES DE DEBUG DISPONIBLES:');
console.log('   debugSystem.showAllContent() - Ver todo el contenido');
console.log('   debugSystem.testRotation() - Probar rotación diaria');
console.log('   debugSystem.fullStats() - Ver estadísticas completas');
console.log('   debugSystem.testPagination(page) - Probar paginación');
console.log('   debugSystem.checkImage(url) - Verificar una imagen');
console.log('   debugSystem.checkImages(count) - Verificar múltiples imágenes');

// Fin del script de verificación
