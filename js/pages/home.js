import { seededPick } from '../utils-home.js';

const DECOS = [
  '/decorative-images/paradise-beach.png',
  '/decorative-images/49830c0a-2fd8-439c-a583-029a0b39c4d6.jpg',
  '/decorative-images/4bfb7a8b-b81e-49d7-a160-90b834d0b751.jpg',
  '/decorative-images/81f55f4d-b0df-49f4-9020-cbb0f5042c08.jpg',
  '/decorative-images/1618cbb2-8dd1-4127-99d9-d9f30536de72.jpg',
  '/decorative-images/115ae97d-909f-4760-a3a1-037a05ad9931.jpg',
  '/decorative-images/f062cb22-c99b-4dfa-9a79-572e98c6e75e.jpg'
];

const toArr = v => {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === 'object') {
    if (Number.isFinite(v.length)) { try { return Array.from(v); } catch {} }
    if (Array.isArray(v.items)) return v.items;
    if (Array.isArray(v.list)) return v.list;
    if (Array.isArray(v.array)) return v.array;
  }
  return [];
};

const urlFrom = it => {
  // Normaliza a URL utilizable; si es relativa simple, la mapeo a /full/…
  if (!it) return '';
  let u = '';
  if (typeof it === 'string') u = it;
  else u = it.banner || it.cover || it.thumb || it.src || it.file || it.url || it.path || it.image || it.href || '';

  if (!u) return '';
  if (/^https?:\/\//i.test(u) || u.startsWith('/')) return u;
  // si ya contiene subcarpeta conocida, respétala
  if (/^(full|uncensored|img|assets)\//i.test(u)) {
    return '/' + u.replace(/^\.?\/*/,'');
  }
  // por defecto, público -> /full/
  return '/full/' + u.replace(/^\.?\/*/,'');
};

function scanOnce(){
  // 1) UnifiedContentAPI
  try{
    const U = window.UnifiedContentAPI;
    if (U) {
      try {
        const p = toArr(U.getPublicImages && U.getPublicImages());
        if (p.length) return p;
      } catch {}
      for (const k of ['publicImages','images','full','data','items']) {
        const a = toArr(U[k]); if (a.length) return a;
      }
    }
  }catch{}

  // 2) ContentData2 (públicas)
  try{
    const C = window.ContentData2;
    if (C) {
      for (const k of ['publicImages','images','full','data','items']) {
        const a = toArr(C[k]); if (a.length) return a;
      }
    }
  }catch{}

  // 3) Escaneo genérico
  const keys = Object.getOwnPropertyNames(window);
  for (const k of keys) {
    const v = window[k];
    const a = toArr(v);
    if (a.length >= 20) {
      const sample = a.slice(0,10).map(urlFrom).filter(Boolean);
      const good = sample.filter(s => /\.(jpe?g|png|webp)$/i.test(s)).length;
      if (good >= Math.min(3, sample.length)) return a;
    }
  }
  return [];
}

function waitPool(timeout=9000, step=120){
  return new Promise(resolve=>{
    const t0=Date.now();
    const tick=()=>{
      const arr = scanOnce();
      if (arr.length) return resolve(arr);
      if (Date.now()-t0 >= timeout) return resolve(arr);
      setTimeout(tick, step);
    };
    tick();
  });
}

function setHeroImage(u){ const img=document.getElementById('heroImg'); img.src=u; }

export async function initHome(){
  // Asegurar contenedores de anuncios (los creo si no existen)
  for (const spec of [
    ['ad-left','side-ad left', document.body],
    ['ad-right','side-ad right', document.body],
    ['ad-inline','ad-inline', document.getElementById('app') || document.body]
  ]) {
    const [id, cls, host] = spec;
    if (!document.getElementById(id)) {
      const d=document.createElement('div'); d.id=id; d.className=cls; host.insertBefore(d, host.firstChild);
    }
  }

  const root=document.getElementById('app');
  root.innerHTML=`
    <section class="hero" id="hero">
      <img class="hero-bg" id="heroImg" alt="">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-panel">
          <div class="hero-title">Ibizagirl.pics</div>
          <div class="hero-sub">Bienvenido al paraiso</div>
        </div>
      </div>
    </section>
    <div id="ad-inline" class="ad-inline"></div>
    <h2 class="section-title">Home</h2>
    <section class="carousel"><div class="carousel-track" id="homeCarousel"></div></section>
    <section class="grid" id="homeGrid"></section>
  `;

  // Banner decorativo (diario)
  setHeroImage(seededPick(DECOS,1,'banner')[0] || DECOS[0]);

  // Esperar pool y pintar
  const pool = await waitPool();
  console.info('[IBG] /full pool size:', pool.length);

  const car=document.getElementById('homeCarousel');
  seededPick(pool, 20, 'carousel').forEach(it=>{
    const u=urlFrom(it);
    if (!u || !/\.(jpe?g|png|webp)$/i.test(u)) return;
    const s=document.createElement('div'); s.className='slide';
    s.innerHTML=`<img src="${u}" alt="">`;
    car.appendChild(s);
  });

  const grid=document.getElementById('homeGrid');
  seededPick(pool, 20, 'grid').forEach((it,i)=>{
    const u=urlFrom(it);
    if (!u || !/\.(jpe?g|png|webp)$/i.test(u)) return;
    const c=document.createElement('div'); c.className='card'; c.dataset.id=String(i);
    c.innerHTML=`<img loading="lazy" src="${u}" alt="">`;
    grid.appendChild(c);
  });
}
