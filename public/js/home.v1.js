(function(){
  "use strict";

  const HERO = document.getElementById('hero');
  const HERO_BG = HERO ? HERO.querySelector('.hero-bg') : null;
  const STRIP = document.getElementById('carousel-strip');
  const GALLERY = document.getElementById('gallery');

  // --- Rotación de fondo del banner (lee decorative-manifest si existe) ---
  function heroRotation(){
    const base = '/decorative-images/';
    const candidates = new Set();

    // Añade paradise por defecto
    candidates.add('paradise-beach.png');

    // Si el script decorative-manifest.js definió algo, úsalo
    try {
      const M = (window.__DECORATIVE_MANIFEST || {});
      if (Array.isArray(M.items)) {
        M.items.forEach(x => { if(typeof x==='string') candidates.add(x); });
      } else if (M.bg) {
        candidates.add(M.bg);
      }
    } catch(e){/*silent*/}

    const list = Array.from(candidates).map(x => base + encodeURIComponent(x).replace(/%2F/g,'/'));
    if (!HERO_BG || list.length === 0) return;
    let idx = 0;
    const apply = () => {
      HERO.style.background = `url("${list[idx]}") center/cover no-repeat`;
      idx = (idx + 1) % list.length;
    };
    apply();
    setInterval(apply, 8000);
  }

  // --- Utilidades ---
  const sample = (arr, n) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a.slice(0, n);
  };

  // Extrae nombres .webp de /full/ desde content-data2.js (como texto)
  async function getFullList(){
    try{
      const res = await fetch('/content-data2.js', {cache:'no-store'});
      if(!res.ok) throw new Error('content-data2.js not found');
      const txt = await res.text();
      const m = txt.match(/\/full\/[A-Za-z0-9._-]+\.webp/gi) || [];
      // Normaliza y deduplica
      return Array.from(new Set(m)).map(s => s.replace(/["'`]/g,''));
    }catch(e){
      console.warn('[home] No se pudo leer content-data2.js:', e);
      return [];
    }
  }

  // Pinta carrusel
  function paintCarousel(urls){
    if(!STRIP) return;
    STRIP.innerHTML = '';
    urls.forEach(u=>{
      const img = new Image();
      img.decoding = 'async';
      img.loading = 'lazy';
      img.src = u;
      STRIP.appendChild(img);
    });
    const prev = document.querySelector('.carousel .prev');
    const next = document.querySelector('.carousel .next');
    const scrollBy = () => Math.max(200, STRIP.clientWidth * .5);
    prev && prev.addEventListener('click', ()=> STRIP.scrollBy({left:-scrollBy(),behavior:'smooth'}));
    next && next.addEventListener('click', ()=> STRIP.scrollBy({left:+scrollBy(),behavior:'smooth'}));
  }

  // Pinta galería
  function paintGallery(urls){
    if(!GALLERY) return;
    GALLERY.innerHTML = '';
    urls.forEach(u=>{
      const img = new Image();
      img.decoding = 'async';
      img.loading = 'lazy';
      img.src = u;
      GALLERY.appendChild(img);
    });
  }

  // Init
  document.addEventListener('DOMContentLoaded', async ()=>{
    heroRotation();
    const pool = await getFullList();
    const forty = sample(pool, 40);
    const forty2 = sample(pool.filter(x=>!forty.includes(x)), 40);

    // Si la lista es más pequeña, reusa
    paintCarousel(forty.length ? forty : pool.slice(0,40));
    paintGallery(forty2.length ? forty2 : (pool.length ? sample(pool,40) : []));
  });

})();
