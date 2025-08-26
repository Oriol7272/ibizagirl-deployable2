#!/usr/bin/env bash
set -euo pipefail

echo "[IBG] Fix HOME: banner full + carrusel+grid robust + ads columnas + deploy"

# 1) CSS: banner ocupa el alto de la pantalla; carrusel y grid visibles; columnas ads a los lados
cat > css/ibg-home.css <<'CSS'
.hero{position:relative;overflow:hidden}
.hero-bg{width:100%;height:calc(100vh - 64px);min-height:380px;max-height:72vh;object-fit:cover;display:block}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,16,25,.10),rgba(7,16,25,.85))}
.hero-title{position:absolute;left:12px;bottom:64px;font-size:clamp(32px,7vw,68px);font-weight:900}
.hero-sub{position:absolute;left:12px;bottom:22px;font-size:clamp(14px,2.2vw,20px);opacity:.95}
.section-title{padding:12px 12px 0 12px;font-weight:800}
.carousel{position:relative;overflow:hidden;margin:12px}
.carousel-track{display:flex;gap:10px;scroll-snap-type:x mandatory;overflow-x:auto;padding-bottom:8px}
.carousel .slide{min-width:320px;max-width:70vw;height:220px;scroll-snap-align:start;border-radius:18px;overflow:hidden;background:#0a1320}
.carousel .slide img{width:100%;height:100%;object-fit:cover;display:block}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;padding:0 12px 12px}
.card{position:relative;border-radius:18px;overflow:hidden;background:#0a1320}
.card img{width:100%;height:220px;object-fit:cover;display:block}

/* columnas de anuncios a los lados sin tapar contenido */
.side-ad{position:fixed;top:0;bottom:0;width:160px;z-index:1;display:none;align-items:center;justify-content:center}
.side-ad.left{left:0}.side-ad.right{right:0}
@media (min-width:1460px){
  .side-ad{display:flex}
  .page-shell{margin-left:160px;margin-right:160px}
}
CSS

# 2) Daily picks: usa UnifiedContentAPI -> ContentData2.publicImages -> fallback decorativo
cat > js/daily-picks.js <<'JS'
import { getDailySeed, sampleSeeded } from './utils.js';
function pool(){
  const U = window.UnifiedContentAPI || {};
  let full = [];
  try{ full = (U.getPublicImages && U.getPublicImages()) || []; }catch(_){}
  if(!full || !full.length){
    try{ full = (window.ContentData2 && window.ContentData2.publicImages) || []; }catch(_){}
  }
  const prem = (U.getPremiumImages && U.getPremiumImages()) || []
    .concat(window.ContentData3?.premiumImages||[], window.ContentData4?.premiumImages||[]);
  const vids = (U.getPremiumVideos && U.getPremiumVideos()) || (window.ContentData5?.premiumVideos||[]);
  return {full,prem,vids};
}
function fallbackDecor(n){
  const pool=[
    '/decorative-images/paradise-beach.png',
    '/decorative-images/49830c0a-2fd8-439c-a583-029a0b39c4d6.jpg',
    '/decorative-images/4bfb7a8b-b81e-49d7-a160-90b834d0b751.jpg',
    '/decorative-images/81f55f4d-b0df-49f4-9020-cbb0f5042c08.jpg',
    '/decorative-images/1618cbb2-8dd1-4127-99d9-d9f30536de72.jpg',
    '/decorative-images/115ae97d-909f-4760-a3a1-037a05ad9931.jpg',
    '/decorative-images/f062cb22-c99b-4dfa-9a79-572e98c6e75e.jpg'
  ];
  return Array.from({length:n},(_,i)=>({file: pool[i % pool.length]}));
}
export function getDaily(){
  const s=getDailySeed(); const {full,prem,vids}=pool();
  let home20 = sampleSeeded(full && full.length?full:fallbackDecor(20), 20, s);
  const prem100 = sampleSeeded(prem,100,s^0x9e3779b1);
  const vids20 = sampleSeeded(vids,20,s^0x1337c0de);
  const markNewCount = Math.floor((prem100?.length||0)*0.30);
  const newSet = new Set((prem100||[]).slice(0,markNewCount).map((x,i)=>x.id||x.file||i));
  console.info('[IBG] pools -> full:', (full&&full.length)||0, 'prem:', (prem&&prem.length)||0, 'vids:', (vids&&vids.length)||0);
  return {home20,prem100,vids20,newSet};
}
JS

# 3) HOME: banner real (si hay) y construcción explícita del carrusel + grid
cat > js/pages/home.js <<'JS'
import { t } from '../i18n.js';
import { getDaily } from '../daily-picks.js';
import { imgUrl } from '../utils.js';

function pickBannerFromPool(){
  try{
    const U=window.UnifiedContentAPI;
    if(U?.getPublicImages){
      const all=U.getPublicImages();
      const banners=all.filter(x=>x.isBanner||/banner/i.test(x?.tag||'')||/banner/i.test(x?.type||''));
      return (banners.length?banners[Math.floor(Math.random()*banners.length)]:all[0])||null;
    }
  }catch(_){}
  return null;
}

export async function initHome(){
  const root=document.getElementById('app');
  root.innerHTML=`
    <section class="hero" id="hero">
      <img class="hero-bg" id="heroImg" src="/decorative-images/paradise-beach.png" alt="">
      <div class="hero-overlay"></div>
      <div class="hero-title" style="font-family:'Sexy Beachy',system-ui">ibizagirl.pics</div>
      <div class="hero-sub">${t('welcome')}</div>
    </section>
    <h2 class="section-title">${t('home')}</h2>
    <section class="carousel"><div class="carousel-track" id="homeCarousel"></div></section>
    <section class="grid" id="homeGrid"></section>`;

  // banner del pool
  const b=pickBannerFromPool(); const url=b && imgUrl(b); if(url){ document.getElementById('heroImg').src=url; }

  const {home20}=getDaily();
  // carrusel
  const car=document.getElementById('homeCarousel');
  home20.forEach(it=>{
    const u=imgUrl(it); const s=document.createElement('div'); s.className='slide'; s.innerHTML=`<img src="${u}" alt="">`; car.appendChild(s);
  });
  // grid
  const grid=document.getElementById('homeGrid');
  home20.forEach((it,i)=>{
    const u=imgUrl(it); const id=it.id||it.file||('full-'+i);
    const c=document.createElement('div'); c.className='card'; c.dataset.id=id; c.innerHTML=`<img loading="lazy" src="${u}" alt="">`;
    grid.appendChild(c);
  });
}
JS

# 4) Asegurar fondo de página y tipografía (ya en css/ibg.css) + link a ibg-home.css
grep -q 'css/ibg-home.css' index.html || \
  sed -i "" -e $'s#<link rel="stylesheet" href="/css/ibg.css">#<link rel="stylesheet" href="/css/ibg.css">\\\n<link rel="stylesheet" href="/css/ibg-home.css">#' index.html

# 5) Commit + push + deploy
git add -A
git commit -m "IBG HOME: banner fullscreen + carousel/grid robust (UnifiedContentAPI->ContentData2->decor fallback) + ads columns" || true
git push origin main || true
npx -y vercel --prod --yes
