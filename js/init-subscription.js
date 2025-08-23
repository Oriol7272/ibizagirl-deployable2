document.addEventListener('DOMContentLoaded', () => {
  ['paypal-monthly','paypal-annual','paypal-lifetime'].forEach(id => {
    if (!document.getElementById(id)) {
      const div = document.createElement('div'); div.id = id; document.body.appendChild(div);
    }
  });
  if (window.Payments) {
    Payments.renderSubscriptions();
    Payments.renderLifetime({ container: '#paypal-lifetime', price: 100.00 });
  } else {
    console.warn('[init-subscription] Payments no está disponible');
  }
});
