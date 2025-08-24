#!/usr/bin/env bash
set -euo pipefail

echo "[IBG] Home: texto centrado gigante + espera pool /full + ads ≥1280 + deploy"

# 1) CSS: texto del banner siempre centrado y más grande; ads desde 1280px
cat > css/ibg-home.css <<'CSS'
/* ----- Banner ----- */
.hero{position:relative;overflow:hidden}
.hero-bg{width:100%;height:calc(100vh - 64px);min-height:420px;max-height:78vh;object-fit:cover;display:block}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,16,25,.15),rgba(7,16,25,.85))}
.hero-content{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px}
.hero-panel{background:rgba(0,0,0,.35);padding:22px 28px;border-radius:22px;max-width:min(1000px,92vw)}
.hero-title{font-family:'Sexy Beachy',system-ui;font-weight:900;line-height:1;letter-spacing:.5px;
  font-size:clamp(52px,9vw,120px);text-shadow:0 2px 18px rgba(0,0,0,.65)}
.hero-sub{margin-top:10px;font-size:clamp(18px,2.6vw,30px);opacity:.98}

/* ----- Carrusel + Grid ----- */
.section-title{padding:16px 12px 6px 12px;font-weight:800}
.carousel{position:relative;overflow:hidden;margin:12px}
.carousel-track{display:flex;gap:10px;scroll-snap-type:x mandatory;overflow-x:auto;padding-bottom:8px}
.carousel .slide{min-width:320px;max-width:70vw;height:230px;scroll-snap-align:start;border-radius:18px;overflow:hidden;background:#0a1320}
.carousel .slide img{width:100%;height:100%;object-fit:cover;display:block}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;padding:0 12px 18px}
.card{position:relative;border-radius:18px;overflow:hidden;background:#0a1320}
.card img{width:100%;height:220px;object-fit:cover;display:block}

/* ----- Ads laterales (no solapan contenido) ----- */
.side-ad{position:fixed;top:0;bottom:0;width:160px;z-index:1;display:none;align-items:center;justify-content:center}
.side-ad.left{left:0}.side-ad.right{right:0}
@media (min-width:1280px){.side-ad{display:flex}.page-shell{margin-left:160px;margin-right:160px}}
CSS

# 2) HOME JS: espera a que /full esté listo; banner decorativo diario; carrusel+grid 20+20
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

function setHeroImage(url){
  const img = document.getElementById('heroImg');
  img.src = url;
}

function getPublicNow(){
  try{
    const U = window.UnifiedContentAPI;
    if (U?.getPublicImages) return U.getPublicImages();
  }catch(_){}
  try{
    return (window.ContentData2 && window.ContentData2.publicImages) || [];
  }catch(_){}
  return [];
}

function waitForPublicImages(timeoutMs=6000, interval=120){
  return new Promise(resolve=>{
    const t0 = Date.now();
    const tick = ()=>{
      const full = getPublicNow();
      if (full && full.length) return resolve(full);
      if (Date.now()-t0 >= timeoutMs) return resolve(full||[]);
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
    <h2 class="section-title">Home</h2>
    <section class="carousel"><div class="carousel-track" id="homeCarousel"></div></section>
    <section class="grid" id="homeGrid"></section>
  `;

  // Banner: decorativo diario (incluye paradise-beach)
  setHeroImage(seededPick(DECOS,1,'banner')[0] || DECOS[0]);

  // Espera a que el pool público esté disponible
  const full = await waitForPublicImages();
  console.info('[IBG] /full disponibles:', full.length);

  // Carrusel (seed 'carousel')
  const car=document.getElementById('homeCarousel');
  const c20 = seededPick(full, 20, 'carousel');
  c20.forEach(it=>{
    const u=imgURL(it); const s=document.createElement('div'); s.className='slide';
    s.innerHTML=`<img src="${u}" alt="">`; car.appendChild(s);
  });

  // Grid (seed 'grid')
  const grid=document.getElementById('homeGrid');
  const g20 = seededPick(full, 20, 'grid');
  g20.forEach((it,i)=>{
    const u=imgURL(it); const id=it.id||it.file||('full-'+i);
    const c=document.createElement('div'); c.className='card'; c.dataset.id=id;
    c.innerHTML=`<img loading="lazy" src="${u}" alt="">`;
    grid.appendChild(c);
  });
}
JS

# 3) Commit + push + deploy
git add -A
git commit -m "HOME: texto centrado gigante, espera pool /full (poll), carrusel+grid 20+20, ads ≥1280px" || true
git push origin main || true
npx -y vercel --prod --yes
