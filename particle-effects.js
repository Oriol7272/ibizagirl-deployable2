// Crear burbujas flotantes
function createBubbles() {
    for (let i = 0; i < 15; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.width = Math.random() * 20 + 10 + 'px';
        bubble.style.height = bubble.style.width;
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.animationDelay = Math.random() * 10 + 's';
        bubble.style.animationDuration = Math.random() * 10 + 10 + 's';
        document.body.appendChild(bubble);
    }
}

// Efecto de profundidad al scroll
function updateDepthIndicator() {
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    const marker = document.querySelector('.depth-marker');
    if (marker) {
        marker.style.top = scrollPercent + '%';
    }
}

document.addEventListener('DOMContentLoaded', createBubbles);
window.addEventListener('scroll', updateDepthIndicator);
