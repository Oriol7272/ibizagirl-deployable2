/* Home: 20 FULL aleatorias; hidratar imágenes */
document.addEventListener('DOMContentLoaded', () => {
  try { AppUtils.hydrateAnchorsToImgs(); } catch(e){ console.warn(e); }

  // Si tienes un grid con id #home-grid, opcionalmente puedes reordenar/limpiar aquí.
  // Dejamos la lógica de creación en tus content-data*.js; aquí solo nos aseguramos de pintar las imágenes reales.
});
