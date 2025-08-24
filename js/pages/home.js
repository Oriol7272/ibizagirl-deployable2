import { seededPick, imgURL } from '../utils-home.js';

const DECOS = [
  '/decorative-images/paradise-beach.png',
  '/decorative-images/49830c0a-2fd8-439c-a583-029a0b39c4d6.jpg',
  '/decorative-images/4bfb7a8b-b81e-49d7-a160-90b834d0b751.jpg',
  '/decorative-images/81f55f4d-b0df-49f4-9020-cbb0f5042c08.jpg',
  '/decorative-images/1618cbb2-8dd1-4127-99d9-d9f30536de72.jpg',
  '/decorative-images/115ae97d-909f-4760-a3a1-037a05ad9931.jpg',
  '/decorative-images/f062cb22-c99b-4dfa-9a79-572e98c6e75e.jpg'
];

function setHeroImage(url){ const img=document.getElementById('heroImg'); img.src=url; }

/* Heurísticas para encontrar arrays de imágenes públicas (/full) en window */
function isImgItem(x){
  if(!x) return false;
  if(typeof x==='string') return /\/full\//.test(x)||/\.(jpe?g|png|webp)$/i.test(x);
  if(typeof x==='object'){
    const u = x.banner||x.cover||x.thumb||x.src||x.file||x.url||x.path||'';
    return typeof u==='string' && ( /\/full\//.test(u) || /\.(jpe?g|png|webp)$/i.test(u) );
  }
  return false;
}
function pickArray(arrays){
  // Prioriza arrays cuyos items contienen /full/
  const scored = arrays.map(a=>{
    const sample = a.slice(0,10);
    const score = sample.reduce((s,el)=>s + (isImgItem(el)&&typeof(el)==='object'&&/(^|\/)full(\/|$)/.test((el.file||el.src||el.url||''))?3:isImgItem(el)?1:0),0);
    return {a,score,len:a.length};
  }).sort((x,y)=>y.score-x.score || y.len-x.len);
  return (scored[0] && scored[0].a) || [];
}
function scanWindowForFull(){
  const candidates=[];
  try{
    const U = window.UnifiedContentAPI;
    if(U){
      let p;
      try{ p = U.getPublicImages && U.getPublicImages(); }catch(_){}
      if(Array.isArray(p)&&p.length) candidates.push(p);
      ['publicImages','images','full'].forEach(k=>{ if(Array.isArray(U[k])&&U[k].length) candidates.push(U[k]); });
    }
  }catch(_){}
  try{
    const C = window.ContentData2;
    if(C){
      ['publicImages','images','full'].forEach(k=>{ if(Array.isArray(C[k])&&C[k].length) candidates.push(C[k]); });
    }
  }catch(_){}
  // escaneo general (último recurso)
  const keys = Object.getOwnPropertyNames(window);
  for(const k of keys){
    const v = window[k];
    if(Array.isArray(v) && v.length>=20){
      const sample=v.slice(0,6);
      if(sample.some(isImgItem)) candidates.push(v);
    }
  }
  return pickArray(candidates);
}

function waitForFull(timeoutMs=7000, interval=100){
  return new Promise(resolve=>{
    const t0=Date.now();
    const tick=()=>{
      const arr=scanWindowForFull();
      if(arr && arr.length) return resolve(arr);
      if(Date.now()-t0>=timeoutMs) return resolve(arr||[]);
      setTimeout(tick, interval);
    };
    tick();
  });
}

export async function initHome(){
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

  // Banner diario
  setHeroImage(seededPick(DECOS,1,'banner')[0] || DECOS[0]);

  // Espera y busca el pool /full en window
  const full = await waitForFull();
  console.info('[IBG] /full encontrados:', full.length);

  // Carrusel (20) semilla A
  const car=document.getElementById('homeCarousel');
  const c20 = seededPick(full,20,'carousel');
  c20.forEach(it=>{ const u=imgURL(it); const s=document.createElement('div'); s.className='slide'; s.innerHTML=`<img src="${u}" alt="">`; car.appendChild(s); });

  // Grid (20) semilla B
  const grid=document.getElementById('homeGrid');
  const g20 = seededPick(full,20,'grid');
  g20.forEach((it,i)=>{ const u=imgURL(it); const id=it.id||it.file||('full-'+i);
    const c=document.createElement('div'); c.className='card'; c.dataset.id=id; c.innerHTML=`<img loading="lazy" src="${u}" alt="">`; grid.appendChild(c);
  });
}
