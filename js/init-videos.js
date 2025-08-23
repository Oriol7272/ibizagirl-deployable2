document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.video-card,.card,.item').forEach(card => {
    if (!card.querySelector('.mini-buy')) {
      const d = document.createElement('div');
      d.className = 'mini-buy'; d.style.margin = '8px 0';
      card.appendChild(d);
    }
  });
  if (window.Payments) {
    Payments.renderMiniBuy({ selector: '.mini-buy', price: 0.30 });
  } else {
    console.warn('[init-videos] Payments no está disponible');
  }
});
