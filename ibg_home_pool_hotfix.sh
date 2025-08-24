#!/usr/bin/env bash
set -euo pipefail

echo "[IBG] HOTFIX: detectar pools array-like + strings y pintar carrusel/galería"

cat > js/pages/home.js <<'JS'
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

const toArr = v => {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === 'object' && Number.isFinite(v.length)) {
    try { return Array.from(v); } catch { /* fall-through */ }
  }
  return [];
};

function setHeroImage(url){ const img=document.getElementById('heroImg'); img.src=url; }

function isImgItem(x){
  if(!x) return false;
  if(typeof x==='string') return /\/full\//.test(x)||/\.(jpe?g|png|webp)$/i.test(x);
  if(typeof x==='object'){
    const u = x.banner||x.cover||x.thumb||x.src||x.file||x.url||x.path||'';
    return typeof u==='string' && ( /\/full\//.test(u) || /\.(jpe?g|png|webp)$/i.test(u) );
  }
  return false;
}

function normalizeItems(arr){
  // Convierte strings en objetos homogéneos {file:...} para que imgURL funcione.
  return toArr(arr).map(it => (typeof it === 'string' ? { file: it } : it));
}

function scanWindowForFullOnce(){
  const candidates=[];

  // 1) UnifiedContentAPI
  try{
    const U = window.UnifiedContentAPI;
    if(U){
      try{
        const p = U.getPublicImages && U.getPublicImages();
        const a = normalizeItems(p);
        if(a.length) candidates.push(a);
      }catch(_){}
      ['publicImages','images','full'].forEach(k=>{
        const a = normalizeItems(U[k]);
        if(a.length) candidates.push(a);
      });
    }
  }catch(_){}

  // 2) ContentData2.*
  try{
    const C = window.ContentData2;
    if(C){
      ['publicImages','images','full'].forEach(k=>{
        const a = normalizeItems(C[k]);
        if(a.length) candidates.push(a);
      });
    }
  }catch(_){}

  // 3) Escaneo genérico del window (array o array-like con contenido de imagen)
  const keys = Object.getOwnPropertyNames(window);
  for(const k of keys){
    const v = window[k];
    const a = normalizeItems(v);
    if(a.length >= 20){
      const sample=a.slice(0,10);
      if(sample.some(isImgItem)) candidates.push(a);
    }
  }

  // Escoge el mejor candidato (más elementos)
  candidates.sort((a,b)=>b.length - a.length);
  return candidates[0] || [];
}

function waitForFull(timeoutMs=8000, interval=120){
  return new Promise(resolve=>{
    const t0=Date.now();
    const tick=()=>{
      const arr=scanWindowForFullOnce();
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

  // Banner decorativo diario
  setHeroImage(seededPick(DECOS,1,'banner')[0] || DECOS[0]);

  // Pool /full robusto
  const full = await waitForFull();
  console.info('[IBG] /full disponibles (post-scan):', full.length);

  // Carrusel 20 (seed 'carousel')
  const car=document.getElementById('homeCarousel');
  const c20 = seededPick(full,20,'carousel');
  c20.forEach(it=>{ const u=imgURL(it); const s=document.createElement('div'); s.className='slide'; s.innerHTML=`<img src="${u}" alt="">`; car.appendChild(s); });

  // Grid 20 (seed 'grid')
  const grid=document.getElementById('homeGrid');
  const g20 = seededPick(full,20,'grid');
  g20.forEach((it,i)=>{ const u=imgURL(it); const id=it.id||it.file||('full-'+i); const c=document.createElement('div'); c.className='card'; c.dataset.id=id; c.innerHTML=`<img loading="lazy" src="${u}" alt="">`; grid.appendChild(c); });
}
JS

git add js/pages/home.js
git commit -m "home: detect array-like + strings for /full pool; paint carousel/grid reliably"
git push origin main

npx -y vercel --prod --yes
