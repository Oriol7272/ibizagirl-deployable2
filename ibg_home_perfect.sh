#!/usr/bin/env bash
set -euo pipefail

echo "[IBG] HOME final: banner+texto grande dinámico, carrusel+grid de /full, ads laterales + deploy"

# 1) CSS de HOME con texto gigante y layout según orientación
mkdir -p css
cat > css/ibg-home.css <<'CSS'
/* ----- Banner ----- */
.hero{position:relative;overflow:hidden}
.hero-bg{width:100%;height:calc(100vh - 64px);min-height:420px;max-height:78vh;object-fit:cover;display:block}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,16,25,.15),rgba(7,16,25,.85))}
.hero-content{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px}
.hero.vertical .hero-content{justify-content:flex-end;text-align:left}
.hero-panel{background:rgba(0,0,0,.35);padding:18px 24px;border-radius:20px;max-width:min(900px,90vw)}
.hero-title{font-family:'Sexy Beachy',system-ui;font-weight:900;line-height:1;letter-spacing:.5px;
  font-size:clamp(42px,8vw,110px);text-shadow:0 2px 18px rgba(0,0,0,.65)}
.hero-sub{margin-top:8px;font-size:clamp(16px,2.4vw,28px);opacity:.98}

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
@media (min-width:1460px){.side-ad{display:flex}.page-shell{margin-left:160px;margin-right:160px}}
CSS

# 2) Utilidades pequeñas
mkdir -p js
cat > js/utils-home.js <<'JS'
export const dailySeed = () => new Date().toISOString().slice(0,10);
export function seededPick(arr, n, salt=''){
  const s = (dailySeed()+salt).split('').reduce((a,c)=>(a*33 + c.charCodeAt(0))>>>0,5381);
  const rnd = (a=>()=>((a=Math.imul(a^=a>>>15,1|a))+=(a^=a>>>7),((a^=a>>>14)>>>0)/4294967296))(s);
  const pool = arr.slice(); for(let i=pool.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1)); [pool[i],pool[j]]=[pool[j],pool[i]]}
  return pool.slice(0,Math.min(n,pool.length));
}
export const imgURL = it => it?.banner||it?.cover||it?.thumb||it?.src||it?.file||it?.url||it?.path;
JS

# 3) HOME: banner alternando decoratives (incluye paradise-beach.png) + carrusel/grid de /full
mkdir -p js/pages
cat > js/pages/home.js <<'JS'
import { seededPick, imgURL } from '../utils-home.js';

/* decoratives para el BANNER (solo banner) */
const DECOS = [
  '/decorative-images/paradise-beach.png',
  '/decorative-images/49830c0a-2fd8-439c-a583-029a0b39c4d6.jpg',
  '/decorative-images/4bfb7a8b-b81e-49d7-a160-90b834d0b751.jpg',
  '/decorative-images/81f55f4d-b0df-49f4-9020-cbb0f5042c08.jpg',
  '/decorative-images/1618cbb2-8dd1-4127-99d9-d9f30536de72.jpg',
  '/decorative-images/115ae97d-909f-4760-a3a1-037a05ad9931.jpg',
  '/decorative-images/f062cb22-c99b-4dfa-9a79-572e98c6e75e.jpg'
];

function pickPublicPool(){
  const U = window.UnifiedContentAPI || {};
  let full = [];
  try{ full = (U.getPublicImages && U.getPublicImages()) || []; }catch(_){}
  if(!full || !full.length){
    try{ full = (window.ContentData2 && window.ContentData2.publicImages) || []; }catch(_){}
  }
  return full;
}

function setHeroImage(url){
  const hero = document.getElementById('hero');
  const img = document.getElementById('heroImg');
  img.onload = ()=>{ 
    const vert = img.naturalHeight > img.naturalWidth;
    hero.classList.toggle('vertical', !!vert);
  };
  img.src = url;
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

  /* BANNER: alterna 1 imagen diaria de decorative-images (siempre incluye paradise-beach) */
  const bannerPick = seededPick(DECOS, 1, 'banner')[0] || DECOS[0];
  setHeroImage(bannerPick);

  /* Cargar pool público desde /full */
  const full = pickPublicPool();

  /* Carrusel: 20 aleatorias del pool total /full (semilla A) */
  const car=document.getElementById('homeCarousel');
  const c20 = seededPick(full, 20, 'carousel');
  c20.forEach(it=>{
    const u=imgURL(it); const s=document.createElement('div'); s.className='slide';
    s.innerHTML=`<img src="${u}" alt="">`; car.appendChild(s);
  });

  /* Galería: 20 aleatorias (semilla B, distinta a carrusel) */
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

# 4) Asegura que index.html referencia ibg-home.css y bootstrap ya existente
grep -q 'css/ibg-home.css' index.html || \
  sed -i "" -e $'s#<link rel="stylesheet" href="/css/ibg.css">#<link rel="stylesheet" href="/css/ibg.css">\\\n<link rel="stylesheet" href="/css/ibg-home.css">#' index.html

# 5) Commit + push + deploy
git add -A
git commit -m "HOME perfecto: banner decorativo diario (texto grande/centro o lateral), carrusel+grid de /full con semillas distintas, ads laterales" || true
git push origin main || true
npx -y vercel --prod --yes
