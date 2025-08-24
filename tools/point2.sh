#!/usr/bin/env bash
set -Eeuo pipefail

# --- CSS de layout + fuentes + fondo ---
cat > css/ibg-layout.css <<'CSS'
@import url('https://fonts.googleapis.com/css2?family=Parisienne&family=Great+Vibes&display=swap');

:root{
  --wrap:1200px; --gap:16px; --card-r:14px;
  --shadow:0 10px 24px rgba(0,0,0,.15);
  --ocean:#03243a; --ocean-2:#073b5c;
}

html,body{height:100%}
body{
  margin:0; color:#fff; background:#000;
  background-image:url('/decorative-images/paradise-beach.png');
  background-size:cover; background-attachment:fixed; background-position:center;
  font-family: 'Parisienne','Great Vibes',cursive,system-ui,-apple-system,Segoe UI,Roboto,Arial;
  text-shadow: 0 1px 2px rgba(0,0,0,.35);
}

/* capa oscura sutil para contraste del texto */
body::before{
  content:""; position:fixed; inset:0; z-index:0; background:linear-gradient(180deg,rgba(0,0,0,.55),rgba(0,0,0,.35));
  pointer-events:none;
}

/* contenedores principales siempre por encima de ads */
#main-section, main, .page, .content, #content, .main-wrap { position:relative; z-index:5; }

/* layout con sidebars a los lados y contenido centrado */
.main-wrap{
  display:grid; grid-template-columns: 180px minmax(0, var(--wrap)) 180px; gap:var(--gap);
  align-items:start; justify-content:center; max-width: calc(var(--wrap) + 360px + var(--gap)); margin: 0 auto; padding: 1rem;
}
.sidebar{ position:sticky; top:12px; display:flex; flex-direction:column; gap:12px; }
.sidebar .ad-slot, .sidebar iframe{ width:160px; min-height:600px; align-self:center; }

#main-section, main, .page, .content, #content { max-width: var(--wrap); margin: 0 auto; width: 100%; }

/* carrusel de home */
.carousel{ margin: 10px auto 18px; }
#home-carousel{ position:relative; overflow:hidden; border-radius:var(--card-r); background:rgba(255,255,255,.05); }
#home-carousel .track{ display:flex; gap:var(--gap); will-change: transform; transition: transform .7s ease; padding: 10px; }
#home-carousel .slide{ min-width: calc(25% - var(--gap)*.75); aspect-ratio: 4/3; overflow:hidden; border-radius:var(--card-r); box-shadow: var(--shadow); }
#home-carousel .slide img{ width:100%; height:100%; object-fit:cover; display:block; }

/* 4 columnas centradas para galers */
#gallery, .gallery, .gallery-grid, #premium-grid, #videos-grid, .section-grid{
  display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:var(--gap);
  max-width: var(--wrap); margin:1rem auto;
}
.card, .tile, .thumb{
  border-radius:var(--card-r); box-shadow:var(--shadow); overflow:hidden; transform:translateZ(0);
  transition:transform .2s ease, box-shadow .2s ease, filter .2s ease;
  background:rgba(0,0,0,.25);
}
.card:hover, .tile:hover, .thumb:hover{ transform:translateY(-4px); box-shadow:0 12px 30px rgba(0,0,0,.22) }

/* borroso para premium/videos bloqueados */
.blurred{ filter: blur(10px); }
.badge{ position:absolute; top:8px; left:8px; background:#0ea5e9; color:#001018; padding:.2rem .5rem; border-radius:999px; font-size:.8rem; font-weight:700 }

/* anuncios nunca por encima del contenido */
iframe[src*="juicyads"], iframe[src*="exoclick"], iframe[src*="eroadvertising"],
[id*="juicy"], [id*="exo"], [id*="ero"] { z-index:1 !important; position:static !important; }

/* CTA fijo simple (se puede mejorar luego) */
#cta-fixed{
  position:sticky; top:0; z-index:10;
  background: linear-gradient(90deg, var(--ocean), var(--ocean-2));
  display:flex; gap:12px; justify-content:center; align-items:center;
  padding:.6rem 1rem; border-bottom:1px solid rgba(255,255,255,.15);
}
#cta-fixed .pill{ background: rgba(255,255,255,.12); padding:.35rem .7rem; border-radius:999px; border:1px solid rgba(255,255,255,.25); }

@media (max-width: 1200px){
  .main-wrap{ grid-template-columns: 1fr; }
  .sidebar{ display:none; }
}
@media (max-width: 1024px){
  #home-carousel .slide{ min-width: calc(33.333% - var(--gap)*.666); }
  #gallery, .gallery, .gallery-grid, #premium-grid, #videos-grid, .section-grid{ grid-template-columns:repeat(3,1fr); }
}
@media (max-width: 640px){
  #home-carousel .slide{ min-width: calc(50% - var(--gap)*.5); }
  #gallery, .gallery, .gallery-grid, #premium-grid, #videos-grid, .section-grid{ grid-template-columns:repeat(2,1fr); }
}
CSS

# --- Carrusel (robusto; espera a que haya imptrace genes) ---
cat > js/carousel.js <<'JS'
(function(){
  const dailySeed = ()=> {
    const d = new Date(); const k = `${d.getUTCFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()}`;
    let h=0; for(let i=0;i<k.length;i++) h = Math.imul(31,h) + k.charCodeAt(i) | 0;
    return () => (h = Math.imul(48271, h) % 0x7fffffff) / 0x7fffffff;
  };
  const pickN = (arr,n)=>{
    const rng = dailySeed(); const a=arr.slice(); const out=[];
    for(let i=0;i<a.length && out.length<n;i++){
      const j = Math.floor(rng()*a.length);
      out.push(a.splice(j,1)[0]);
    }
    return out;
  };

  function poolsFromWindow(){
    const w=window;
    // intenta varias rutas ticas de tus mdddulos
    const c6 = w.UnifiedContentAPI || {};
    const p1 = w.PUBLIC_IMAGES || w.FULL_IMAGES_POOL || [];
    const p2 = (c6.getPublicImages && c6.getPublicImages()) || [];
    const merged = [...(Array.isArray(p1)?p1:[]), ...(Array.isArray(p2)?p2:[])];
    return merged.map(x => typeof x==='string' ? x : (x.src||x.url)).filter(Boolean);
  }

  function collectFromDOM(limit){
    const imgs=[...document.querySelectorAll('#gallery img, .gallery img, img[data-src], img[src]')];
    return imgs.map(img => img.getAttribute('data-src')||img.getAttribute('src'))
      .filter(u=>u && !u.startsWith('data:') && !/placeholder|blur/.test(u))
      .slice(0,limit);
  }

  const mount = ()=>{
    const host = document.getElementById('home-carousel');
    if(!host || host.dataset.ready) return;
    // 1) intenta recoger del window (content-data2.js)
    let urls = poolsFromWindow();
    if(!urls.length) urls = collectFromDOM(40);
    urls = urls.filter(u=>/\/full\//.test(u) || /\.jpe?g|\.webp|\.png$/i.test(u));
    urls = pickN(urls, 20);
    if(!urls.length) return;

    host.dataset.ready = '1';
    host.innerHTML = '<div class="track"></div>';
    const track = host.querySelector('.track');
    urls.forEach(u=>{
      const d=document.createElement('div'); d.className='slide';
      d.innerHTML = `<img loading="lazy" src="${u}">`;
      track.appendChild(d);
    });

    let i=0;
    setInterval(()=>{
      i=(i+1)%urls.length;
      const slide = track.querySelector('.slide');
      if(!slide) return;
      const slideW = slide.getBoundingClientRect().width;
      const gap = 16;
      const perRow = Math.max(1, Math.round(host.clientWidth/(slideW+gap)));
      const step = Math.max(1, Math.min(perRow, urls.length-1));
      const x = (i*step)*(slideW+gap);
      track.style.transform = `translateX(${-x}px)`;
    }, 3000);
  };

  const boot=()=>{
    mount();
    const mo = new MutationObserver(()=> mount());
    mo.observe(document.documentElement, {subtree:true, childList:true});
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
JS

# --- Ads robustos (usa ENV; fallback a wrappers locales si fallan remotos) ---
cat > js/ads.js <<'JS'
(function(){
  const ENV = (window.__ENV || {});
  const zones = {
    juicy:  ENV.JUICYADS_ZONE || ENV.JUICY_ADS_ZONE || ENV.JUICYADS_ZONE_ID || null,
    exo:    ENV.EXOCLICK_ZONE || ENV.EXOCLICK_ZONE_ID || ENV.EXO_ZONE_ID || null,
    ero:    ENV.EROADVERTISING_ZONE || ENV.EROADVERTISING_ZONE_ID || null
  };

  const left = document.querySelector('#sb-left')  || document.getElementById('ads-left');
  const right= document.querySelector('#sb-right') || document.getElementById('ads-right');

  function addHTML(where, html){
    const slot = where || document.body;
    const box = document.createElement('div'); box.className='ad-slot';
    box.innerHTML = html; slot.appendChild(box);
  }

  function iframe(src, w=160,h=600){
    return `<iframe src="${src}" width="${w}" height="${h}" style="border:0" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
  }

  // JUICYADS
  if (zones.juicy){
    const src = `https://js.juicyads.com/adshow.php?adzone=${encodeURIComponent(zones.juicy)}`;
    addHTML(right, iframe(src));
  } else console.info('[ADS] JuicyAds omitido: falta zone');

  // EXOCLICK (usa endpoint correcto; si falla, no spamear errores)
  if (zones.exo){
    const pid=152716, ctrlid=798544;
    const src = `https://go.exoclick.com/loadeactrl.go?pid=${pid}&spaceid=${encodeURIComponent(zones.exo)}&ctrlid=${ctrlid}`;
    const s=document.createElement('script'); s.src=src; s.async=true;
    s.onerror=()=>console.warn('[ADS] ExoClick script error (omitido)');
    document.head.appendChild(s);
  } else console.info('[ADS] ExoClick omitido: falta zone');

  // EROADVERTISING
  if (zones.ero){
    const src = `https://www.eroadvertising.com/banner.php?zoneid=${encodeURIComponent(zones.ero)}`;
    addHTML(left, iframe(src));
  } else console.info('[ADS] EroAdvertising omitido: falta zone');

  // Fallback local si todo falla (wrappers estticos que ya vi en tu repo)
  const tryLocal = async (path, where)=>{
    try{
      const r = await fetch(path, {method:'GET', cache:'no-store'});
      if(!r.ok) return;
      addHTML(where, iframe(path, 160, 600));
    }catch(e){}
  };
  // si no hay nada montado, prueba wrappers locales conocidos
  setTimeout(()=>{
    const noLeft  = !left || left.querySelectorAll('iframe').length===0;
    const noRight = !right|| right.querySelectorAll('iframe').length===0;
    if(noLeft){  ['/eroads__5f8afe77e5b70fec960d89b314e045a4.html','/8179717.html'].forEach(p=>tryLocal(p,left)); }
    if(noRight){ ['/97ce8adfbeb6e153ef4ebf2566dfeb7d.html','/f67a56f266e834d596c42122f88bb88d.html'].forEach(p=>tryLocal(p,right)); }
  }, 1200);
})();
JS

# --- CTA mimo (no rompe si se llama) ---
cat > js/cta.js <<'JS'
(function(){
  if(document.getElementById('cta-fixed')) return;
  const div=document.createElement('div'); div.id='cta-fixed';
  div.innerHTML = `
    <span class=" Lifetime sin anuncios</span>pill">
    <span class=pill Acceso total</span>>
  `;    <span class="pill">
  (document.body || document.documentElement).prepend(div);
})();
JS

echo "PUNTO 2 OK"
