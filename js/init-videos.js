/* Vídeos: hidratar thumbs + botón PayPal por tarjeta */
document.addEventListener('DOMContentLoaded', async () => {
  try { AppUtils.hydrateAnchorsToImgs(); } catch(e){ console.warn(e); }

  // Monta botón PayPal (capture) por cada .video-card .paypal-slot
  const slots = Array.from(document.querySelectorAll('.video-card .paypal-slot'));
  const conf = slots.map((el, i) => ({ container: el, amount: el.dataset.amount || '0.30', description: el.dataset.desc || ('Vídeo #'+(i+1)) }));
  if (conf.length) {
    try { await Payments.renderCaptures(conf); } catch(e){ console.error(e); }
  }
});
