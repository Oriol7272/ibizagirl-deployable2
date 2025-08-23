document.addEventListener('DOMContentLoaded', () => {
  if (!window.Payments || typeof window.Payments.renderMiniBuy !== 'function') return;
  if (!document.querySelector('.mini-buy')) return;
  window.Payments.renderMiniBuy({ selector: '.mini-buy', price: 0.30, description: 'Compra vídeo IbizaGirl' });
});
