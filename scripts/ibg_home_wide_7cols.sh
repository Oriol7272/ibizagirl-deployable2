#!/usr/bin/env bash
set -euo pipefail

echo "[IBG] Ajuste ancho total: laterales 164px, contenido max=calc(100vw - 2*164px), grid 7 columnas (26 imgs)"

# ---------- CSS: laterales 164px (slots 160), contenido ocupa todo el resto ----------
cat > css/ibg-home.css <<'CSS'
:root{ --side:164px }

/* HERO */
.hero{position:relative;height:min(64vh,calc(100vh - 88px));min-height:360px;overflow:hidden}
.hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:opacity 1.1s ease;opacity:1}
.hero-bg.is-hidden{opacity:0}
.hero-content{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px}
.hero-title{font-family:'Sexy Beachy',system-ui;font-weight:900;line-height:1;letter-spacing:.5px;
  font-size:clamp(72px,11vw,160px);text-shadow:0 3px 22px rgba(0,0,0,.7)}
.hero-sub{margin-top:12px;font-size:clamp(18px,3vw,34px);opacity:.98}

/* Contenedor principal: ocupa todo el ancho libre entre anuncios */
.page-shell,#app{width:100%;max-width:calc(100vw - (var(--side) * 2));margin-left:auto;margin-right:auto}
body{margin:0}

/* Carrusel */
.section-title{padding:16px 12px 6px 12px;font-weight:800}
.carousel{position:relative;overflow:hidden;margin:12px}
.carousel-track{display:flex;gap:12px;scroll-snap-type:x mandatory;overflow-x:auto;padding-bottom:8px;scrollbar-width:none}
.carousel-track::-webkit-scrollbar{display:none}
.carousel .slide{min-width:520px;max-width:85vw;height:340px;scroll-snap-align:start;border-radius:18px;overflow:hidden;background:#0a1320;flex:0 0 auto}
.carousel .slide img{width:100%;height:100%;object-fit:cover;display:block}

/* Grid (galería) */
.grid{display:grid;gap:12px;padding:0 12px 18px}
.grid.cols-6{grid-template-columns:repeat(6,1fr)}
.grid.cols-7{grid-template-columns:repeat(7,1fr)}
.card{position:relative;border-radius:18px;overflow:hidden;background:#0a1320}
.card img{width:100%;height:220px;object-fit:cover;display:block}

/* Anuncios laterales + inline */
.side-ad{position:fixed;top:0;bottom:0;width:var(--side);z-index:50;display:none;align-items:center;justify-content:center}
.side-ad.left{left:0}
.side-ad.right{right:0}
.ad-box{width:160px;height:600px;display:flex;align-items:center;justify-content:center;overflow:hidden}
.ad-inline{display:block;margin:12px auto;min-height:90px;max-width:728px}
.ad-inline .ad-box{width:728px;height:90px;margin:0 auto}
.ad-placeholder{width:100%;height:100%;display:flex;align-items:center;justify-content:center;border:1px dashed rgba(255,255,255,.18);border-radius:10px;font-size:14px;color:rgba(255,255,255,.6)}
.side-ad,.ad-inline{font-size:0;line-height:0;color:transparent}

/* Mostrar laterales y reservar exactamente su ancho en el body */
@media (min-width:1200px){
  body{padding-left:var(--side);padding-right:var(--side)}
  .side-ad{display:flex}
}
CSS

# ---------- JS: grid 7 cols (26 imgs) si hay ancho; 6 cols (20) si no ----------
apply_js_patch() {
cat > js/pages/home.js <<'JS'
import { seededPick } from '../utils-home.js';

var DECOS = [
  '/decorative-images/paradise-beach.png',
  '/decorative-images/49830c0a-2fd8-439c-a583-029a0b39c4d6.jpg',
  '/decorative-images/4bfb7a8b-b81e-49d7-a160-90b834d0b751.jpg',
  '/decorative-images/81f55f4d-b0df-49f4-9020-cbb0f5042c08.jpg',
  '/decorative-images/1618cbb2-8dd1-4127-99d9-d9f30536de72.jpg',
  '/decorative-images/115ae97d-909f-4760-a3a1-037a05ad9931.jpg',
  '/decorative-images/f062cb22-c99b-4dfa-9a79-572e98c6e75e.jpg'
];

function toArr(v){ if(!v) return []; if(Array.isArray(v)) return v;
  if(typeof v==='object'){ if(Number.isFinite(v.length)){ try{return Array.from(v);}catch(e){} }
    if(Array.isArray(v.items))return v.items; if(Array.isArray(v.list))return v.list; if(Array.isArray(v.array))return v.array; } return []; }
function urlFrom(it){ var u=''; if(!it) return ''; if(typeof it==='string') u=it;
  else u=it.banner||it.cover||it.thumb||it.src||it.file||it.url||it.path||it.image||it.href||'';
  if(!u) return ''; if(/^https?:\/\//i.test(u) || u[0]==='/') return u;
  if(/^(full|uncensored|img|assets)\//i.test(u)) return '/'+u.replace(/^\.?\/*/,'');
  return '/full/'+u.replace(/^\.?\/*/,''); }
function scanOnce(){ try{ var U=window.UnifiedContentAPI; if(U){ try{var p=toArr(U.getPublicImages && U.getPublicImages()); if(p.length) return p;}catch(e){}
  var k1=['publicImages','images','full','data','items']; for(var i=0;i<k1.length;i++){ var a=toArr(U[k1[i]]); if(a.length) return a; } } }catch(e){}
  try{ var C=window.ContentData2; if(C){ var k2=['publicImages','images','full','data','items']; for(var j=0;j<k2.length;j++){ var b=toArr(C[k2[j]]); if(b.length) return b; } } }catch(e){}
  var keys=Object.getOwnPropertyNames(window); for(var k=0;k<keys.length;k++){ var a2=toArr(window[keys[k]]);
    if(a2.length>=20){ var sample=a2.slice(0,10).map(urlFrom).filter(Boolean); var ok=0; for(var s=0;s<sample.length;s++){ if(/\.(jpe?g|png|webp)$/i.test(sample[s])) ok++; }
      if(ok>=Math.min(3,sample.length)) return a2; } } return []; }
function waitPool(t,step){ t=t||9000; step=step||120; return new Promise(function(r){ var t0=Date.now(); (function tick(){ var arr=scanOnce(); if(arr.length) return r(arr); if(Date.now()-t0>=t) return r(arr); setTimeout(tick,step); })(); }); }
function pickRandom(arr,n){ var pool=arr.slice(); for(var i=pool.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var tmp=pool[i]; pool[i]=pool[j]; pool[j]=tmp; } return pool.slice(0,Math.min(n,pool.length)); }

/* Carga segura de imagen para el hero */
function safeSet(img, src){ if(!img) return;
  var probe=new Image(), done=false, timer=setTimeout(function(){ if(!done){ done=true; }}, 1500);
  probe.onload=function(){ if(done) return; done=true; clearTimeout(timer); img.src=src; };
  probe.onerror=function(){ done=true; clearTimeout(timer); };
  probe.src=src;
}
function setHeroRotator(){
  var a=document.getElementById('heroA');
  var b=document.getElementById('heroB');
  var idx=Math.floor(Math.random()*DECOS.length);
  safeSet(a, DECOS[idx]);
  safeSet(b, DECOS[(idx+1)%DECOS.length]);
  b.classList.add('is-hidden');
  setInterval(function(){
    var next=DECOS[(idx+1)%DECOS.length];
    safeSet(b, next);
    a.classList.add('is-hidden'); b.classList.remove('is-hidden');
    setTimeout(function(){ var tmp=a.src; a.src=b.src; b.src=tmp; a.classList.remove('is-hidden'); b.classList.add('is-hidden'); idx=(idx+1)%DECOS.length; },1100);
  },7000);
}
function autoplayCarousel(track,delay){ delay=delay||1000; var slides=Array.from(track.querySelectorAll('.slide')); if(!slides.length) return;
  var i=0,paused=false; function go(){ var t=slides[i]; var left=t.offsetLeft-track.offsetLeft; track.scrollTo({left:left,behavior:'smooth'}); i=(i+1)%slides.length; }
  setInterval(function(){ if(!paused) go(); },delay); track.addEventListener('mouseenter',function(){paused=true}); track.addEventListener('mouseleave',function(){paused=false}); }

export async function initHome(){
  function ensure(id,cls,host){ var el=document.getElementById(id); if(!el){el=document.createElement('div'); el.id=id; el.className=cls; (host||document.body).appendChild(el);} return el; }
  ensure('ad-left','side-ad left',document.body).innerHTML='<div class="ad-box" id="ad-left-box"></div>';
  ensure('ad-right','side-ad right',document.body).innerHTML='<div class="ad-box" id="ad-right-box"></div>';

  var root=document.getElementById('app');
  root.innerHTML =
    '<section class="hero" id="hero">'+
      '<img class="hero-bg" id="heroA" alt="">' +
      '<img class="hero-bg is-hidden" id="heroB" alt="">' +
      '<div class="hero-content"><div>' +
        '<div class="hero-title">Ibizagirl.pics</div>' +
        '<div class="hero-sub">Bienvenido al paraiso</div>' +
      '</div></div>' +
    '</section>' +
    '<h2 class="section-title">Home</h2>' +
    '<section class="carousel"><div class="carousel-track" id="homeCarousel"></div></section>' +
    '<section class="grid" id="homeGrid"></section>' +
    '<div id="ad-inline" class="ad-inline"><div class="ad-box" id="ad-inline-box"></div></div>';

  setHeroRotator();

  var pool=await waitPool(); console.info('[IBG] /full pool size:', pool.length);

  var car=document.getElementById('homeCarousel');
  pickRandom(pool,20).forEach(function(it){ var u=urlFrom(it); if(!u||!/\.(jpe?g|png|webp)$/i.test(u)) return;
    var s=document.createElement('div'); s.className='slide'; s.innerHTML='<img src="'+u+'" alt="">'; car.appendChild(s); });
  autoplayCarousel(car,1000);

  var grid=document.getElementById('homeGrid');
  // Decidir columnas / conteo por ancho actual disponible (viewport)
  var cols = (window.innerWidth >= 1500) ? 7 : 6;
  var count = (cols === 7) ? 26 : 20;
  grid.classList.add('cols-'+cols);
  pickRandom(pool, count).forEach(function(it,idx){
    var u=urlFrom(it); if(!u||!/\.(jpe?g|png|webp)$/i.test(u)) return;
    var c=document.createElement('div'); c.className='card'; c.dataset.id=String(idx); c.innerHTML='<img loading="lazy" src="'+u+'" alt="">';
    grid.appendChild(c);
  });
}
JS
}
apply_js_patch

git add -A
git commit -m "home: side columns 164px, content uses full remaining width; gallery 7 cols (26) on wide screens"
git push origin main || true
npx -y vercel --prod --yes || { npx -y vercel build && npx -y vercel deploy --prebuilt --prod --yes; }
