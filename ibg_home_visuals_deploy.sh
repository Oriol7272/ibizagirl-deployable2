#!/usr/bin/env bash
set -euo pipefail

echo "[IBG] HOME visuals + deploy"

# 1) CSS específico de HOME (incluye fuente Sexy Beachy y estilos de hero/carrusel/grid)
mkdir -p css
cat > css/ibg-home.css <<'CSS'
:root{--gap:12px;--radius:18px;--shellMax:1280px;--sideAdW:160px}
*{box-sizing:border-box}
body{margin:0;background:#0e1b26;color:#fff;font-family:'Sexy Beachy',-apple-system,Segoe UI,Roboto,Inter,system-ui,sans-serif}
@font-face{
  font-family:'Sexy Beachy';
  src:url('/decorative-images/Sexy%20Beachy.otf') format('opentype'),
      url('/decorative-images/Sexy%20Beachy.ttf') format('truetype');
  font-display:swap;
}
.page-shell{position:relative;max-width:var(--shellMax);margin:0 auto;z-index:2}
.hero{position:relative;overflow:hidden;background:#071019 url('/decorative-images/cover.png') center/cover no-repeat}
.hero-bg{width:100%;height:44vh;min-height:280px;max-height:520px;object-fit:cover;display:block;opacity:1}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,16,25,.15),rgba(7,16,25,.85))}
.hero-title{position:absolute;left:12px;bottom:14px;font-size:clamp(26px,5vw,48px);font-weight:800}
.hero-sub{position:absolute;left:12px;bottom:14px;transform:translateY(120%);opacity:.9;font-size:clamp(14px,2.2vw,18px)}
.carousel{position:relative;overflow:hidden;margin:12px}
.carousel-track{display:flex;gap:10px;scroll-snap-type:x mandatory;overflow-x:auto;padding-bottom:8px}
.carousel .slide{min-width:320px;max-width:70vw;height:220px;scroll-snap-align:start;border-radius:var(--radius);overflow:hidden}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:var(--gap);padding:12px}
.card{position:relative;border-radius:var(--radius);overflow:hidden;background:#0a1320}
.card img{width:100%;height:220px;object-fit:cover;display:block}
.side-ad{position:fixed;top:0;bottom:0;width:var(--sideAdW);z-index:1;display:none;align-items:center;justify-content:center}
.side-ad.left{left:0}.side-ad.right{right:0}
@media (min-width:1460px){.side-ad{display:flex}.page-shell{margin-left:var(--sideAdW);margin-right:var(--sideAdW)}}
CSS

# 2) HOME logic: hero -> carrusel(20) -> grid(20) desde /full, con fallback decorativo
mkdir -p js/pages
cat > js/pages/home.js <<'JS'
import { t } from '../i18n.js';
import { getDaily } from '../daily-picks.js';

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

function fallbackImages(n){
  const pool=[
    '/decorative-images/paradise-beach.png',
    '/decorative-images/cover.png',
    '/decorative-images/49830c0a-2fd8-439c-a583-029a0b39c4d6.jpg',
    '/decorative-images/4bfb7a8b-b81e-49d7-a160-90b834d0b751.jpg',
    '/decorative-images/81f55f4d-b0df-49f4-9020-cbb0f5042c08.jpg',
    '/decorative-images/1618cbb2-8dd1-4127-99d9-d9f30536de72.jpg',
    '/decorative-images/115ae97d-909f-4760-a3a1-037a05ad9931.jpg',
    '/decorative-images/f062cb22-c99b-4dfa-9a79-572e98c6e75e.jpg'
  ];
  const out=[]; for(let i=0;i<n;i++) out.push({file: pool[i%pool.length]}); return out;
}

export async function initHome(){
  const root=document.getElementById('app');
  root.innerHTML=`
    <section class="hero" id="hero">
      <img class="hero-bg" id="heroImg" alt="">
      <div class="hero-overlay"></div>
      <div class="hero-title">IbizaGirl.pics</div>
      <div class="hero-sub">${t('welcome')}</div>
    </section>
    <h2 style="padding:10px 12px">${t('home')}</h2>
    <section class="carousel"><div class="carousel-track" id="homeCarousel"></div></section>
    <section class="grid" id="homeGrid"></section>`;

  // banner real si existe, si no el de fondo decorativo ya hace el trabajo
  const b=pickBannerFromPool();
  const bUrl=b?.banner||b?.cover||b?.thumb||b?.src||b?.file||b?.url||b?.path;
  if(bUrl){ document.getElementById('heroImg').src=bUrl; }

  // dataset
  let {home20}=getDaily();
  if(!home20 || !home20.length){ home20 = fallbackImages(20); }

  // carrusel
  const car=document.getElementById('homeCarousel');
  home20.forEach(it=>{
    const u=it.banner||it.cover||it.thumb||it.src||it.file||it.url||it.path;
    const s=document.createElement('div'); s.className='slide'; s.innerHTML=`<img src="${u}" alt="">`; car.appendChild(s);
  });

  // grid
  const grid=document.getElementById('homeGrid');
  home20.forEach((it,i)=>{
    const id=it.id||it.file||`full-${i}`;
    const u=it.thumb||it.src||it.file||it.url||it.path;
    const c=document.createElement('div'); c.className='card'; c.dataset.id=id;
    c.innerHTML=`<img loading="lazy" src="${u}" alt="">`;
    grid.appendChild(c);
  });
}
JS

# 3) asegurar que index.html carga el CSS de home y los módulos
grep -q 'css/ibg-home.css' index.html || \
  sed -i "" -e $'s#<link rel="stylesheet" href="/css/ibg.css">#<link rel="stylesheet" href="/css/ibg.css">\\\n<link rel="stylesheet" href="/css/ibg-home.css">#' index.html

# 4) commit + push + deploy
git add -A
git commit -m "IBG HOME visuals: font+decor+hero+carousel+grid and include css" || true
git push origin main || true
npx -y vercel --prod --yes
