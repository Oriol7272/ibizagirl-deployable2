// Sistema de suscripciones temporales
const temporalPlans = {
    day: { price: 2.99, hours: 24, description: "Acceso 24 horas" },
    weekend: { price: 7.99, hours: 72, description: "Fin de semana completo" },
};

// Watermark dinámico
function addWatermark(element, userId) {
    const watermark = document.createElement('div');
    watermark.style.cssText = `
        position: absolute;
        bottom: 10px;
        right: 10px;
        color: rgba(255,255,255,0.3);
        font-size: 12px;
        pointer-events: none;
        user-select: none;
        z-index: 7.99;
    `;
    watermark.textContent = `ID: ${userId || 'PREVIEW'}`;
    element.appendChild(watermark);
}

// Protección anti-screenshots básica
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
    // Bloquear PrintScreen, F12, Ctrl+S
    if (e.key === 'PrintScreen' || e.key === 'F12' || 
        (e.ctrlKey && e.key === 's')) {
        e.preventDefault();
        return false;
    }
});

// CSS para evitar selección
document.head.insertAdjacentHTML('beforeend', `
<style>
    .protected-content {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
        -webkit-user-drag: none;
    }
</style>
`);
