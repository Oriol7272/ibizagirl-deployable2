// Sistema de suscripción email
function setupEmailCapture() {
    const emailForm = `
    <div class="email-capture">
        <h3>🌊 Recibe actualizaciones diarias</h3>
        <form id="email-form" onsubmit="subscribeEmail(event)">
            <input type="email" placeholder="tu@email.com" required>
            <button type="submit">Suscribir</button>
        </form>
    </div>`;
    
    document.querySelector('footer').insertAdjacentHTML('afterbegin', emailForm);
}

function subscribeEmail(e) {
    e.preventDefault();
    const email = e.target.querySelector('input').value;
    localStorage.setItem('subscriber_email', email);
    alert('¡Gracias! Recibirás actualizaciones diarias');
}

// Marcar 30% como "nuevo" aleatoriamente
function markNewContent() {
    const items = document.querySelectorAll('.premium-item, .video-item');
    const totalItems = items.length;
    const newCount = Math.floor(totalItems * 0.3);
    
    // Resetear todos
    items.forEach(item => item.classList.remove('new-content'));
    
    // Marcar aleatorios como nuevos
    const indices = [];
    while(indices.length < newCount) {
        const rand = Math.floor(Math.random() * totalItems);
        if(!indices.includes(rand)) {
            indices.push(rand);
            items[rand].classList.add('new-content');
        }
    }
}

// Badge para contenido nuevo
const newBadgeCSS = `
.new-content::before {
    content: 'NUEVO';
    position: absolute;
    top: 10px;
    left: 10px;
    background: linear-gradient(45deg, #ff6b6b, #ff8e53);
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 12px;
    font-weight: bold;
    z-index: 10;
}`;

document.head.insertAdjacentHTML('beforeend', `<style>${newBadgeCSS}</style>`);
