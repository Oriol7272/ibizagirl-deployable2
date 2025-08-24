#!/usr/bin/env bash
set -euo pipefail

echo "[IBG] Pulido HOME: hero rotatorio, texto gigante, carrusel autoplay, layout centrado, ads sin 'basura' visual"

# ========== 1) CSS ==========
cat > css/ibg-home.css <<'CSS'
/* ---------- HERO (más bajo, texto muy grande, sin panel oscuro, crossfade de fondo) ---------- */
.hero{position:relative;height:min(64vh,calc(100vh - 88px));min-height:360px;overflow:hidden}
.hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:opacity 1.1s ease;opacity:1}
.hero-bg.is-hidden{opacity:0}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,16,25,.12),rgba(7,16,25,.88))}
.hero-content{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px}
.hero-title{font-family:'Sexy Beachy',system-ui;font-weight:900;line-height:1;letter-spacing:.5px;
  font-size:clamp(72px,11vw,160px);text-shadow:0 3px 22px rgba(0,0,0,.7)}
.hero-sub{margin-top:12px;font-size:clamp(18px,3vw,34px);opacity:.98}

/* ---------- Layout centrado (espacio para ads laterales) ---------- */
.page-shell,#app{max-width:1100px;margin-left:auto;margin-right:auto}

/* ---------- Carrusel (más grande) ---------- */
.section-title{padding:16px 12px 6px 12px;font-weight:800}
.carousel{position:relative;overflow:hidden;margin:12px}
.carousel-track{display:flex;gap:12px;scroll-snap-type:x mandatory;overflow-x:auto;padding-bottom:8px;scrollbar-width:none}
.carousel-track::-webkit-scrollbar{display:none}
.carousel .slide{min-width:520px;max-width:85vw;height:340px;scroll-snap-align:start;border-radius:18px;overflow:hidden;background:#0a1320;flex:0 0 auto}
.carousel .slide img{width:100%;height:100%;object-fit:cover;display:block}

/* ---------- Grid (galería) ---------- */
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;padding:0 12px 18px}
.card{position:relative;border-radius:18px;overflow:hidden;background:#0a1320}
.card img{width:100%;height:220px;object-fit:cover;display:block}

/* ---------- Ads laterales + inline (inline va al final; esconder si vacío) ---------- */
.side-ad{position:fixed;top:0;bottom:0;width:160px;z-index:1;display:none;align-items:center;justify-content:center}
.side-ad.left{left:0}.side-ad.right{right:0}
.ad-inline{display:block;margin:8px 12px;min-height:60px}
.ad-inline:empty{display:none}
@media (min-width:1200px){
  .side-ad{display:flex}
  .page-shell,#app{margin-left:160px;margin-right:160px}
  .ad-inline{display:none}
}
CSS

# ========== 2) JS de HOME ==========
cat > js/pages/home.js <<'JS'
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
  let u = '';
  if (!it) return '';
  if (typeof it === 'string') u = it;
  else u = it.banner || it.cover || it.thumb || it.src || it.file || it.url || it.path || it.image || it.href || '';
  if (!u) return '';
  if (/^https?:\/\//i.test(u) || u.startsWith('/')) return u;
  if (/^(full|uncensored|img|assets)\//i.test(u)) return '/' + u.replace(/^\.?\/*/,'');
  return '/full/' + u.replace(/^\.?\/*/,'');
};

function scanOnce(){
  try{
    const U = window.UnifiedContentAPI;
    if (U) {
      try { const p = toArr(U.getPublicImages && U.getPublicImages()); if (p.length) return p; } catch {}
      for (const k of ['publicImages','images','full','data','items']) { const a = toArr(U[k]); if (a.length) return a; }
    }
  }catch{}
  try{
    const C = window.ContentData2;
    if (C) { for (const k of ['publicImages','images','full','data','items']) { const a = toArr(C[k]); if (a.length) return a; } }
  }catch{}
  const keys = Object.getOwnPropertyNames(window);
  for (const k of keys) {
    const a = toArr(window[k]);
    if (a.length >= 20) {
      const sample = a.slice(0,10).map(urlFrom).filter(Boolean);
      const ok = sample.filter(s => /\.(jpe?g|png|webp)$/i.test(s)).length;
      if (ok >= Math.min(3, sample.length)) return a;
    }
  }
  return [];
}
function waitPool(timeout=9000, step=120){
  return new Promise(resolve=>{
    const t0=Date.now();
    const tick=()=>{ const arr=scanOnce(); if(arr.length) return resolve(arr); if(Date.now()-t0>=timeout) return resolve(arr); setTimeout(tick,step); };
    tick();
  });
}

function setHeroRotator(){
  const a=document.getElementById('heroA');
  const b=document.getElementById('heroB');
  const order = DECOS.slice(); // rotación continua
  let idx = seededPick(DECOS,1,'hero-start').length ? DECOS.indexOf(seededPick(DECOS,1,'hero-start')[0]) : 0;
  if (idx<0) idx=0;
  a.src = DECOS[idx];
  b.src = DECOS[(idx+1)%DECOS.length];
  b.classList.add('is-hidden');
  setInterval(()=>{
    // crossfade
    b.src = DECOS[(idx+1)%DECOS.length];
    a.classList.add('is-hidden'); b.classList.remove('is-hidden');
    setTimeout(()=>{ // swap refs
      const tmp = a.src; a.src = b.src; b.src = tmp;
      a.classList.remove('is-hidden'); b.classList.add('is-hidden');
      idx = (idx+1)%DECOS.length;
    }, 1100);
  }, 7000); // cada 7s
}

function autoplayCarousel(track, delay=1000){
  const slides = Array.from(track.querySelectorAll('.slide'));
  if (!slides.length) return;
  let i=0, paused=false;
  const go = ()=>{ const target=slides[i]; const left = target.offsetLeft - track.offsetLeft; track.scrollTo({left,behavior:'smooth'}); i=(i+1)%slides.length; };
  const id = setInterval(()=>{ if(!paused) go(); }, delay);
  track.addEventListener('mouseenter', ()=>paused=true);
  track.addEventListener('mouseleave', ()=>paused=false);
}

export async function initHome(){
  // Asegurar que NO hay ad-inline bajo el hero (lo movemos al final)
  const oldInline = document.getElementById('ad-inline'); if (oldInline) oldInline.remove();

  const root=document.getElementById('app');
  root.innerHTML=`
    <section class="hero" id="hero">
      <img class="hero-bg" id="heroA" alt="">
      <img class="hero-bg is-hidden" id="heroB" alt="">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div>
          <div class="hero-title">Ibizagirl.pics</div>
          <div class="hero-sub">Bienvenido al paraiso</div>
        </div>
      </div>
    </section>
    <h2 class="section-title">Home</h2>
    <section class="carousel"><div class="carousel-track" id="homeCarousel"></div></section>
    <section class="grid" id="homeGrid"></section>
    <div id="ad-inline" class="ad-inline"></div>
  `;

  // HERO: rotación de decorativas detrás del texto
  setHeroRotator();

  // Pool /full y logs
  const pool = await waitPool();
  console.info('[IBG] /full pool size:', pool.length);

  // Carrusel (20) grande + autoplay
  const car=document.getElementById('homeCarousel');
  seededPick(pool, 20, 'carousel').forEach(it=>{
    const u=urlFrom(it); if (!u || !/\.(jpe?g|png|webp)$/i.test(u)) return;
    const s=document.createElement('div'); s.className='slide'; s.innerHTML=`<img src="${u}" alt="">`; car.appendChild(s);
  });
  autoplayCarousel(car, 1000);

  // Galería (20)
  const grid=document.getElementById('homeGrid');
  seededPick(pool, 20, 'grid').forEach((it,i)=>{
    const u=urlFrom(it); if (!u || !/\.(jpe?g|png|webp)$/i.test(u)) return;
    const c=document.createElement('div'); c.className='card'; c.dataset.id=String(i);
    c.innerHTML=`<img loading="lazy" src="${u}" alt="">`;
    grid.appendChild(c);
  });
}
JS

# ========== 3) Ad-loader: no insertar "relleno" visible en inline ==========
cat > js/ad-loader.js <<'JS'
import { b64Decode, isSubscribed } from './utils.js';

function ensure(id, cls, host){
  let el = document.getElementById(id);
  if (!el){ el=document.createElement('div'); el.id=id; el.className=cls; (host||document.body).appendChild(el); }
  return el;
}
export function initAds(targets={}){
  if(isSubscribed()){ console.info('Ads disabled for subscriber/lifetime'); return; }
  const E = window.IBG || {};
  const left   = targets.left   || ensure('ad-left','side-ad left',document.body);
  const right  = targets.right  || ensure('ad-right','side-ad right',document.body);
  const inline = targets.inline || ensure('ad-inline','ad-inline',document.getElementById('app')||document.body);

  // ExoClick (inline por defecto)
  try{
    if(E.EXOCLICK_SNIPPET_B64){ inline.insertAdjacentHTML('beforeend', b64Decode(E.EXOCLICK_SNIPPET_B64)); }
    else if(/^\d+$/.test(String(E.EXOCLICK_ZONE||''))){
      const s=document.createElement('script'); s.async=true; s.src='https://a.magsrv.com/ad-provider.js'; document.head.appendChild(s);
      const ins=document.createElement('ins'); ins.className='eas6a97888e2'; ins.setAttribute('data-zoneid',String(E.EXOCLICK_ZONE)); inline.appendChild(ins);
      setTimeout(()=>{ (window.AdProvider=window.AdProvider||[]).push({serve:{}}); },800);
    }
  }catch(e){ console.warn('ExoClick error:', e); }

  // JuicyAds (derecha)
  try{
    if(E.JUICYADS_SNIPPET_B64){ right.insertAdjacentHTML('beforeend', b64Decode(E.JUICYADS_SNIPPET_B64)); }
    else if(/^\d+$/.test(String(E.JUICYADS_ZONE||''))){
      window.adsbyjuicy = window.adsbyjuicy || [];
      const ins=document.createElement('ins'); ins.id=String(E.JUICYADS_ZONE); ins.setAttribute('data-width','160'); ins.setAttribute('data-height','600');
      right.appendChild(ins);
      const s=document.createElement('script'); s.async=true; s.src='https://poweredby.jads.co/js/jads.js';
      s.onload=()=>{ try{ (window.adsbyjuicy=window.adsbyjuicy||[]).push({adzone:Number(E.JUICYADS_ZONE)}); }catch(e){ console.warn('Juicy push error:', e); } };
      document.head.appendChild(s);
    }
  }catch(e){ console.warn('JuicyAds error:', e); }

  // EroAdvertising (izquierda) — sin relleno visible
  try{
    if(E.EROADVERTISING_SNIPPET_B64){ left.insertAdjacentHTML('beforeend', b64Decode(E.EROADVERTISING_SNIPPET_B64)); }
    else if(/^\d+$/.test(String(E.EROADVERTISING_ZONE||''))){
      const d=document.createElement('div'); d.id='sp_'+String(E.EROADVERTISING_ZONE)+'_node'; left.appendChild(d);
      const js=document.createElement('script'); js.src='//go.easrv.cl/loadeactrl.go?pid=152716&spaceid='+String(E.EROADVERTISING_ZONE)+'&ctrlid=798544';
      document.head.appendChild(js);
      setTimeout(()=>{ try{ window.eaCtrl && eaCtrl.add({display:d.id,sid:Number(E.EROADVERTISING_ZONE),plugin:'banner'}); }catch(_e){} },1000);
    }
  }catch(e){ console.warn('EroAdvertising error:', e); }

  // PopAds opcional (no toca DOM visible)
  try{
    if(String(E.POPADS_ENABLE||'1')!=='0' && /^\d+$/.test(String(E.POPADS_SITE_ID||''))){
      const code='(function(){var p=window,j="e494ffb82839a29122608e933394c091",d=[["siteId",'+Number(E.POPADS_SITE_ID)+'],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],v=[],e=-1,a,y,m=function(){clearTimeout(y);e++;a=p.document.createElement("script");a.type="text/javascript";a.async=!0;var s=p.document.getElementsByTagName("script")[0];a.src="https://www.premiumvertising.com/zS/bwdvf/ttabletop.min.js";a.crossOrigin="anonymous";a.onerror=m;a.onload=function(){clearTimeout(y);p[j.slice(0,16)+j.slice(0,16)]||m()};y=setTimeout(m,5E3);s.parentNode.insertBefore(a,s)};if(!p[j]){try{Object.freeze(p[j]=d)}catch(e){}m()})();';
      const s=document.createElement('script'); s.text=code; (document.body).appendChild(s);
    }
  }catch(e){ console.warn('PopAds error:', e); }
}
JS

# ========== 4) Commit + push + deploy ==========
git add -A
git commit -m "HOME polish: hero rotating bg, huge text, carousel autoplay, centered layout, clean ads containers"
git push origin main || true
# deploy con reintento rápido
npx -y vercel --prod --yes || { npx -y vercel build && npx -y vercel deploy --prebuilt --prod --yes; }
