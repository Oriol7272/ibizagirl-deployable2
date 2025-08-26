#!/usr/bin/env bash
set -euo pipefail

echo "[IBG] Home: pool scan robusto + banner centrado + carrusel/grid + ads laterales e inline + deploy"

# 1) CSS (añado slot inline bajo el banner y mantengo texto enorme centrado)
cat > css/ibg-home.css <<'CSS'
.hero{position:relative;overflow:hidden}
.hero-bg{width:100%;height:calc(100vh - 64px);min-height:420px;max-height:78vh;object-fit:cover;display:block}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,16,25,.15),rgba(7,16,25,.85))}
.hero-content{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px}
.hero-panel{background:rgba(0,0,0,.35);padding:22px 28px;border-radius:22px;max-width:min(1000px,92vw)}
.hero-title{font-family:'Sexy Beachy',system-ui;font-weight:900;line-height:1;letter-spacing:.5px;
  font-size:clamp(52px,9vw,120px);text-shadow:0 2px 18px rgba(0,0,0,.65)}
.hero-sub{margin-top:10px;font-size:clamp(18px,2.6vw,30px);opacity:.98}

.section-title{padding:16px 12px 6px 12px;font-weight:800}
.carousel{position:relative;overflow:hidden;margin:12px}
.carousel-track{display:flex;gap:10px;scroll-snap-type:x mandatory;overflow-x:auto;padding-bottom:8px}
.carousel .slide{min-width:320px;max-width:70vw;height:230px;scroll-snap-align:start;border-radius:18px;overflow:hidden;background:#0a1320}
.carousel .slide img{width:100%;height:100%;object-fit:cover;display:block}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;padding:0 12px 18px}
.card{position:relative;border-radius:18px;overflow:hidden;background:#0a1320}
.card img{width:100%;height:220px;object-fit:cover;display:block}

/* Ads laterales + inline bajo hero */
.side-ad{position:fixed;top:0;bottom:0;width:160px;z-index:1;display:none;align-items:center;justify-content:center}
.side-ad.left{left:0}.side-ad.right{right:0}
.ad-inline{display:block;margin:8px 12px;min-height:60px}
@media (min-width:1280px){.side-ad{display:flex}.page-shell{margin-left:160px;margin-right:160px}.ad-inline{display:none}}
CSS

# 2) Utils home: PRNG estable (ya está) — no tocar

# 3) HOME: escaneo del window para localizar el pool /full + slot inline anuncios
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
JS

# 4) Bootstrap: pasa también el slot inline de anuncios (si existe)
cat > js/bootstrap-ibg.js <<'JS'
import { mountHeader } from './pages-common.js';
import { initHome } from './pages/home.js';
import { initPremium } from './pages/premium.js';
import { initVideos } from './pages/videos.js';
import { initSubscription } from './pages/subscription.js';
import { initAds } from './ad-loader.js';
import { initCrisp } from './integrations.js';

(async ()=>{
  const path = location.pathname.replace(/\/+$/,'') || '/index.html';
  mountHeader();
  if(path.endsWith('/index.html')) await initHome();
  else if(path.endsWith('/premium.html')) await initPremium();
  else if(path.endsWith('/videos.html')) await initVideos();
  else if(path.endsWith('/subscription.html')) await initSubscription();

  initCrisp();
  initAds({
    left: document.getElementById('ad-left'),
    right: document.getElementById('ad-right'),
    inline: document.getElementById('ad-inline')
  });
})();
JS

# 5) Ad-loader: si hay contenedor inline, úsalo como fallback además de left/right
cat > js/ad-loader.js <<'JS'
import { b64Decode, isSubscribed } from './utils.js';
function isInt(v){return /^\d+$/.test(String(v||'').trim());}
export function initAds(targets={}){
  if(isSubscribed()){ console.info('Ads disabled for subscriber/lifetime'); return; }
  const E = window.IBG || {};
  const left = targets.left || targets.inline || document.body;
  const right = targets.right || targets.inline || document.body;
  const inline = targets.inline;

  // ExoClick
  try{
    if(E.EXOCLICK_SNIPPET_B64){ (left||inline||document.body).insertAdjacentHTML('beforeend', b64Decode(E.EXOCLICK_SNIPPET_B64)); }
    else if(isInt(E.EXOCLICK_ZONE)){
      const s=document.createElement('script'); s.async=true; s.src='https://a.magsrv.com/ad-provider.js'; document.head.appendChild(s);
      const ins=document.createElement('ins'); ins.className='eas6a97888e2'; ins.setAttribute('data-zoneid',String(E.EXOCLICK_ZONE));
      (inline||left).appendChild(ins);
      setTimeout(()=>{ (window.AdProvider=window.AdProvider||[]).push({serve:{}}); },800);
    }
  }catch(e){ console.warn('ExoClick error:', e); }

  // JuicyAds
  try{
    if(E.JUICYADS_SNIPPET_B64){ (right||inline||document.body).insertAdjacentHTML('beforeend', b64Decode(E.JUICYADS_SNIPPET_B64)); }
    else if(isInt(E.JUICYADS_ZONE)){
      window.adsbyjuicy = window.adsbyjuicy || [];
      const ins=document.createElement('ins'); ins.id=String(E.JUICYADS_ZONE); ins.setAttribute('data-width','160'); ins.setAttribute('data-height','600');
      (inline||right).appendChild(ins);
      const s=document.createElement('script'); s.async=true; s.src='https://poweredby.jads.co/js/jads.js';
      s.onload=()=>{ try{ (window.adsbyjuicy=window.adsbyjuicy||[]).push({adzone:Number(E.JUICYADS_ZONE)}); }catch(e){ console.warn('Juicy push error:', e); } };
      document.head.appendChild(s);
    }
  }catch(e){ console.warn('JuicyAds error:', e); }

  // EroAdvertising
  try{
    if(E.EROADVERTISING_SNIPPET_B64){ (right||inline||document.body).insertAdjacentHTML('beforeend', b64Decode(E.EROADVERTISING_SNIPPET_B64)); }
    else if(isInt(E.EROADVERTISING_ZONE)){
      const host = inline||right;
      const d=document.createElement('div'); d.id='sp_'+String(E.EROADVERTISING_ZONE)+'_node'; d.innerHTML='&nbsp;'; host.appendChild(d);
      const js=document.createElement('script'); js.src='//go.easrv.cl/loadeactrl.go?pid=152716&spaceid='+String(E.EROADVERTISING_ZONE)+'&ctrlid=798544'; document.head.appendChild(js);
      setTimeout(()=>{ try{ window.eaCtrl && eaCtrl.add({display:d.id,sid:Number(E.EROADVERTISING_ZONE),plugin:'banner'}); }catch(_e){} },1000);
    }
  }catch(e){ console.warn('EroAdvertising error:', e); }

  // PopAds opcional (no usa inline)
  try{
    if(/^\d+$/.test(String(E.POPADS_SITE_ID||'')) && String(E.POPADS_ENABLE)!=='0'){
      const code='(function(){var p=window,j="e494ffb82839a29122608e933394c091",d=[["siteId",'+Number(E.POPADS_SITE_ID)+'],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],v=[],e=-1,a,y,m=function(){clearTimeout(y);e++;a=p.document.createElement("script");a.type="text/javascript";a.async=!0;var s=p.document.getElementsByTagName("script")[0];a.src="https://www.premiumvertising.com/zS/bwdvf/ttabletop.min.js";a.crossOrigin="anonymous";a.onerror=m;a.onload=function(){clearTimeout(y);p[j.slice(0,16)+j.slice(0,16)]||m()};y=setTimeout(m,5E3);s.parentNode.insertBefore(a,s)};if(!p[j]){try{Object.freeze(p[j]=d)}catch(e){}m()})();';
      const s=document.createElement('script'); s.text=code; (inline||right||left||document.body).appendChild(s);
    }
  }catch(e){ console.warn('PopAds error:', e); }
}
JS

# 6) Index.html ya incluye css/ibg-home.css, app y side-ads

# 7) Commit + push + deploy
git add -A
git commit -m "HOME: pool scan + banner centrado + carrusel/galería robustos + ads inline/laterales" || true
git push origin main || true
npx -y vercel --prod --yes
