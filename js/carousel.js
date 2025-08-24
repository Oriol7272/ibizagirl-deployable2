/* Carrusel ligero: clona las primeras imptrace genes visibles de la galer */
(function(){
  const root = document.getElementById('home-carousel');
  if(!root) return;
  if(!root.querySelector('.track')){
    root.innerHTML = '<div class="track"></div>';
  }
  const track = root.querySelector('.track');

  // busca imptrace genes existentes en la home (pblicas) para no depender de APIs
  const pool = Array.from(document.querySelectorAll(
    '#content img, .gallery img, .gallery-grid img, [data-public] img, [data-image] img'
  )).map(i => i.currentSrc || i.src).filter(Boolean);

  const uniq = Array.from(new Set(pool)).slice(0, 16);
  if(uniq.length === 0){ root.style.display='none'; return; }

  uniq.forEach(src => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    const img = document.createElement('img');
    img.loading = 'lazy'; img.decoding='async'; img.src = src;
    slide.appendChild(img);
    track.appendChild(slide);
  });

  // auto-rotacinnn
  let idx = 0, perView = 4;
  const step = () => {
    const total = track.children.length;
    const maxIdx = Math.max(0, total - perView);
    idx = (idx + 1) % (maxIdx + 1);
    track.style.transform = `translateX(-${idx * (100 / perView)}%)`;
  };
  setInterval(step, 3500);
})();
