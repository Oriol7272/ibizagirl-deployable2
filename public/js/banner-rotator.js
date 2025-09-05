document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('banner');
  if (!el) { console.warn('No #banner'); return; }
  const imgs = (window.DECORATIVE_IMAGES || []).filter(Boolean);
  console.log('DECORATIVE_IMAGES:', imgs.length);
  if (!imgs.length) { console.warn('Sin imágenes decorativas'); return; }
  let i = 0;
  const tick = () => {
    el.style.backgroundImage = `url('${imgs[i % imgs.length]}')`;
    i++;
  };
  tick();
  setInterval(tick, 4000);
});
