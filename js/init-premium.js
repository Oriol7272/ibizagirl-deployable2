/* Premium: 100 imágenes aleatorias, 30% con badge "Nuevo"; hidratar imágenes */
document.addEventListener('DOMContentLoaded', () => {
  try { AppUtils.hydrateAnchorsToImgs(); } catch(e){ console.warn(e); }

  // Añadir badges "Nuevo" a ~30% de las tarjetas ya renderizadas
  const cards = Array.from(document.querySelectorAll('.card'));
  const nNew = Math.ceil(cards.length * 0.30);
  const picks = AppUtils.pickN(cards, nNew, AppUtils.todaySeed() + '-premium-new');
  picks.forEach(card => {
    if (card.querySelector('.badge-new')) return;
    const b = document.createElement('div');
    b.className = 'badge-new';
    b.textContent = 'Nuevo';
    card.appendChild(b);
  });
});
