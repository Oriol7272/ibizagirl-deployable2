// Frontend - Sin API key expuesta
async function subscribeEmail(e) {
    e.preventDefault();
    const email = e.target.querySelector('input').value;
    
    try {
        // Llamar a tu función serverless
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });
        
        if (response.ok) {
            alert('¡Suscripción exitosa!');
            localStorage.setItem('subscriber_email', email);
        } else {
            alert('Error al suscribir. Intenta de nuevo.');
        }
    } catch (error) {
        console.error('Error:', error);
        // Fallback: guardar localmente
        localStorage.setItem('subscriber_email', email);
        alert('Suscripción guardada localmente');
    }
}
