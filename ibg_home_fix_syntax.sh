#!/usr/bin/env bash
set -euo pipefail

# Reescribe js/pages/home.js sin template literals
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

function toArr(v){
  if(!v) return [];
  if(Array.isArray(v)) return v;
  if(typeof v==='object'){
    if(Number.isFinite(v.length)){ try{return Array.from(v);}catch(e){} }
    if(Array.isArray(v.items)) return v.items;
    if(Array.isArray(v.list)) return v.list;
    if(Array.isArray(v.array)) return v.array;
  }
  return [];
}

function urlFrom(it){
  var u = '';
  if(!it) return '';
  if(typeof it==='string') u = it;
  else u = it.banner||it.cover||it.thumb||it.src||it.file||it.url||it.path||it.image||it.href||'';
  if(!u) return '';
  if(/^https?:\/\//i.test(u) || u.indexOf('/')===0) return u;
  if(/^(full|uncensored|img|assets)\//i.test(u)) return '/'+u.replace(/^\.?\/*/,'');
  return '/full/'+u.replace(/^\.?\/*/,'');
}

function scanOnce(){
  try{
    var U = window.UnifiedContentAPI;
    if(U){
      try{ var p = toArr(U.getPublicImages && U.getPublicImages()); if(p.length) return p; }catch(e){}
      var keys1=['publicImages','images','full','data','items'];
      for(var i=0;i<keys1.length;i++){ var a=toArr(U[keys1[i]]); if(a.length) return a; }
    }
  }catch(e){}
  try{
    var C = window.ContentData2;
    if(C){
      var keys2=['publicImages','images','full','data','items'];
      for(var j=0;j<keys2.length;j++){ var b=toArr(C[keys2[j]]); if(b.length) return b; }
    }
  }catch(e){}
  var keys = Object.getOwnPropertyNames(window);
  for(var k=0;k<keys.length;k++){
    var a2 = toArr(window[keys[k]]);
    if(a2.length>=20){
      var sample=a2.slice(0,10).map(urlFrom).filter(Boolean);
      var ok=0; for(var s=0;s<sample.length;s++){ if(/\.(jpe?g|png|webp)$/i.test(sample[s])) ok++; }
      if(ok>=Math.min(3,sample.length)) return a2;
    }
  }
  return [];
}

function waitPool(timeout, step){
  timeout = timeout||9000; step = step||120;
  return new Promise(function(resolve){
    var t0=Date.now();
    (function tick(){
      var arr=scanOnce();
      if(arr.length) return resolve(arr);
      if(Date.now()-t0>=timeout) return resolve(arr);
      setTimeout(tick, step);
    })();
  });
}

function setHeroRotator(){
  var a=document.getElementById('heroA');
  var b=document.getElementById('heroB');
  var start = seededPick(DECOS,1,'hero-start');
  var idx = Math.max(0, DECOS.indexOf(start[0]||DECOS[0]));
  a.src = DECOS[idx];
  b.src = DECOS[(idx+1)%DECOS.length];
  b.classList.add('is-hidden');
  setInterval(function(){
    b.src = DECOS[(idx+1)%DECOS.length];
    a.classList.add('is-hidden'); b.classList.remove('is-hidden');
    setTimeout(function(){
      var tmp=a.src; a.src=b.src; b.src=tmp;
      a.classList.remove('is-hidden'); b.classList.add('is-hidden');
      idx=(idx+1)%DECOS.length;
    },1100);
  },7000);
}

/* Aleatorio por recarga (Fisher-Yates con Math.random) */
function pickRandom(arr, n){
  var pool = arr.slice();
  for(var i=pool.length-1;i>0;i--){
    var j = Math.floor(Math.random()*(i+1));
    var tmp=pool[i]; pool[i]=pool[j]; pool[j]=tmp;
  }
  return pool.slice(0, Math.min(n,pool.length));
}

function autoplayCarousel(track, delay){
  delay = delay||1000;
  var slides = Array.from(track.querySelectorAll('.slide'));
  if(!slides.length) return;
  var i=0, paused=false;
  function go(){
    var target=slides[i];
    var left = target.offsetLeft - track.offsetLeft;
    track.scrollTo({left:left, behavior:'smooth'});
    i=(i+1)%slides.length;
  }
  setInterval(function(){ if(!paused) go(); }, delay);
  track.addEventListener('mouseenter', function(){paused=true;});
  track.addEventListener('mouseleave', function(){paused=false;});
}

export async function initHome(){
  // contenedores de anuncios laterales (si no existen)
  function ensure(id,cls,host){
    var el=document.getElementById(id);
    if(!el){ el=document.createElement('div'); el.id=id; el.className=cls; (host||document.body).appendChild(el); }
    return el;
  }
  ensure('ad-left','side-ad left', document.body).innerHTML = '<div class="ad-box" id="ad-left-box"></div>';
  ensure('ad-right','side-ad right', document.body).innerHTML = '<div class="ad-box" id="ad-right-box"></div>';

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

  // Hero rotando decorativas
  setHeroRotator();

  // Pool /full y construcción UI
  var pool = await waitPool();
  console.info('[IBG] /full pool size:', pool.length);

  // Carrusel (20) – aleatorio por recarga
  var car=document.getElementById('homeCarousel');
  pickRandom(pool, 20).forEach(function(it){
    var u=urlFrom(it);
    if(!u || !/\.(jpe?g|png|webp)$/i.test(u)) return;
    var s=document.createElement('div');
    s.className='slide';
    s.innerHTML='<img src="'+u+'" alt="">';
    car.appendChild(s);
  });
  autoplayCarousel(car, 1000);

  // Galería (20) – aleatorio por recarga
  var grid=document.getElementById('homeGrid');
  pickRandom(pool, 20).forEach(function(it,idx){
    var u=urlFrom(it);
    if(!u || !/\.(jpe?g|png|webp)$/i.test(u)) return;
    var c=document.createElement('div');
    c.className='card';
    c.dataset.id=String(idx);
    c.innerHTML='<img loading="lazy" src="'+u+'" alt="">';
    grid.appendChild(c);
  });
}
JS

git add js/pages/home.js
git commit -m "fix(home): remove template literals to avoid token error; random carousel/grid per reload"
git push origin main

# despliegue
npx -y vercel --prod --yes || { npx -y vercel build && npx -y vercel deploy --prebuilt --prod --yes; }
