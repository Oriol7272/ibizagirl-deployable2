#!/usr/bin/env bash
set -euo pipefail
echo "[IBG] Premium: escaneo robusto del pool 'uncensored' (CD3/CD4/UnifiedContentAPI)"

cat > js/pages/premium.js <<'JS'
import { seededPick } from '../utils-home.js';

/* ---------- helpers comunes ---------- */
function ensurePremiumCss(){
  if(!document.getElementById('css-ibg-premium')){
    const l=document.createElement('link'); l.id='css-ibg-premium'; l.rel='stylesheet'; l.href='/css/ibg-premium.css';
    document.head.appendChild(l);
  }
}
function toArr(v){
  if(!v) return [];
  if(Array.isArray(v)) return v;
  if(typeof v==='object'){
    if(Number.isFinite(v.length)){ try{ return Array.from(v); }catch(e){} }
    if(Array.isArray(v.items)) return v.items;
    if(Array.isArray(v.list)) return v.list;
    if(Array.isArray(v.array)) return v.array;
  }
  return [];
}
function urlFrom(it){
  let u='';
  if(!it) return '';
  if(typeof it==='string'){ u=it; }
  else{
    u=it.banner||it.cover||it.thumb||it.src||it.file||it.url||it.path||it.image||it.href||'';
  }
  if(!u) return '';
  if(/^https?:\/\//i.test(u) || u[0]==='/') return u;
  if(/^(uncensored|full|img|assets)\//i.test(u)) return '/'+u.replace(/^\.?\/*/,'');
  // por defecto asumimos uncensored
  return '/uncensored/'+u.replace(/^\.?\/*/,'');
}
function pickRandom(arr,n){
  const pool=arr.slice();
  for(let i=pool.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [pool[i],pool[j]]=[pool[j],pool[i]]; }
  return pool.slice(0,Math.min(n,pool.length));
}
function getUnlocked(){ try{ return JSON.parse(localStorage.getItem('ibg_unlocked')||'[]'); }catch(_){return[]} }
function setUnlocked(list){ try{ localStorage.setItem('ibg_unlocked', JSON.stringify(list)); }catch(_){} }
function addUnlocked(url){ const u=getUnlocked(); if(!u.includes(url)){ u.push(url); setUnlocked(u);} }
function getCredits(){ return parseInt(localStorage.getItem('ibg_credits')||'0',10)||0; }
function addCredits(n){ localStorage.setItem('ibg_credits', String(getCredits()+n)); }
function useCredit(){ const c=getCredits(); if(c>0){ localStorage.setItem('ibg_credits', String(c-1)); return true; } return false; }
function markSubscribed(){ localStorage.setItem('ibg_subscribed','1'); }
function isSub(){ return localStorage.getItem('ibg_subscribed')==='1'; }
function dailySeed(){ const d=new Date(); return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(); }

/* ---------- ESCANEO ROBUSTO DEL POOL PREMIUM ---------- */
function arraysFromKeys(obj, keys){
  const out=[];
  keys.forEach(k=>{
    try{
      const v=obj && obj[k];
      const arr=toArr(v);
      if(arr.length) out.push(...arr);
    }catch(_){}
  });
  return out;
}
function looksUncensored(item){
  const u=urlFrom(item);
  return /\/uncensored\//i.test(u) || /uncensored/i.test(u);
}
function scanFromObject(obj){
  if(!obj) return [];
  // claves típicas
  let acc = arraysFromKeys(obj, ['uncensored','images','data','items','list','gallery','pool']);
  // a veces vienen agrupadas por objetos internos
  Object.keys(obj||{}).forEach(k=>{
    const v=obj[k];
    if(v && typeof v==='object'){
      acc.push(...arraysFromKeys(v,['uncensored','images','data','items','list','gallery','pool']));
    }
  });
  // filtra solo uncensored
  acc = acc.filter(looksUncensored);
  return acc;
}
function scanPremiumPool(){
  // 1) UnifiedContentAPI
  try{
    const U = window.UnifiedContentAPI;
    if(U){
      if (typeof U.getPremiumImages==='function'){
        const r = toArr(U.getPremiumImages()).filter(looksUncensored);
        if(r.length) return r;
      }
      // inspección por claves
      const guess = scanFromObject(U);
      if(guess.length) return guess;
    }
  }catch(e){}

  // 2) Objetos conocidos
  try{
    const C3 = window.ContentData3, C4 = window.ContentData4;
    let acc = [];
    acc.push(...scanFromObject(C3));
    acc.push(...scanFromObject(C4));
    if(acc.length) return acc;
  }catch(e){}

  // 3) Buscar entre globals que parezcan "content-data*"
  try{
    const all = [];
    for(const k in window){
      if(/content.?data/i.test(k)){
        const v = window[k];
        all.push(...scanFromObject(v));
      }
    }
    if(all.length) return all;
  }catch(e){}

  // 4) Sin suerte
  return [];
}

/* ---------- UI PREMIUM ---------- */
export async function initPremium(){
  ensurePremiumCss();

  // laterales (premium mantiene anuncios)
  function ensure(id,cls,host){ let el=document.getElementById(id); if(!el){el=document.createElement('div'); el.id=id; el.className=cls; (host||document.body).appendChild(el);} return el; }
  ensure('ad-left','side-ad left',document.body).innerHTML='<div class="ad-box" id="ad-left-box"></div>';
  ensure('ad-right','side-ad right',document.body).innerHTML='<div class="ad-box" id="ad-right-box"></div>';

  const app = document.getElementById('app');
  app.innerHTML =
    '<h1 class="premium-title">Premium</h1>'+
    '<div class="premium-cta">'+
      '<div class="pill" id="buy-pack"><span class="pp"></span><span>Paquete 10</span><span class="price">0,80€</span></div>'+
      '<div class="pill" id="sub-month"><span class="pp"></span><span class="sub">Mensual</span><span class="price">14,99€</span></div>'+
      '<div class="pill" id="sub-year"><span class="pp"></span><span class="sub">Anual</span><span class="price">49,99€</span></div>'+
    '</div>'+
    '<div class="credit-note" id="credit-note"></div>'+
    '<section class="premium-grid" id="premiumGrid"></section>';

  function renderCredits(){
    const el=document.getElementById('credit-note');
    const c=getCredits(); const sub=isSub();
    el.textContent = sub ? 'Suscripción activa: acceso a todo el contenido.' :
      (c>0 ? ('Créditos disponibles: '+c+' (1 crédito = 1 imagen)') : 'Sin créditos. Compra una imagen (0,10 €) o un paquete de 10 (0,80 €).');
  }
  renderCredits();

  // Pool premium
  let pool = scanPremiumPool();
  console.info('[IBG] premium pool size:', pool.length);

  // Fallback (opcional) a "full" si pool vacío para no dejar la página muerta
  if(pool.length===0){
    try{
      const C2 = window.ContentData2;
      const full = scanFromObject(C2).filter(x=>/\/full\//i.test(urlFrom(x)));
      if(full.length){ pool = full; console.warn('[IBG] premium pool vacío; usando fallback a FULL temporalmente.'); }
    }catch(_){}
  }

  const grid = document.getElementById('premiumGrid');

  if(pool.length===0){
    grid.innerHTML = '<div style="opacity:.8">No se pudo localizar el pool premium. Revisa content-data3/4 o UnifiedContentAPI.</div>';
    return;
  }

  const picks = pickRandom(pool, 100);
  const newSeed = dailySeed();
  const newCount = Math.max(1, Math.floor(picks.length * 0.30));
  const newSet = new Set(seededPick(picks, newCount, 'premium-new-'+newSeed).map(urlFrom));
  const unlockedSet = new Set(getUnlocked());

  picks.forEach((it)=>{
    const u = urlFrom(it); if(!u) return;
    const isUnlocked = isSub() || unlockedSet.has(u);
    const isNew = newSet.has(u);

    const card = document.createElement('div');
    card.className = 'p-card'+(isUnlocked ? ' unlocked' : ' locked');
    card.dataset.url = u;
    card.innerHTML =
      (isNew ? '<div class="badge-new">Nuevo</div>' : '')+
      '<img loading="lazy" src="'+u+'" alt="">'+
      '<div class="overlay">'+
        '<div class="buttons">'+
          '<button class="btn-buy buy-one" title="Comprar 0,10€"><span class="pp"></span><span>Comprar</span><span class="price">0,10€</span></button>'+
        '</div>'+
        '<div class="locked-note" style="font-size:12px;opacity:.75">Contenido difuminado. Desbloquéalo para verlo.</div>'+
      '</div>';
    grid.appendChild(card);
  });

  function unlock(url, card){
    if(card){ card.classList.remove('locked'); card.classList.add('unlocked'); card.querySelector('.locked-note')?.remove(); }
  }
  function buyOne(url, card){
    if (isSub()) { unlock(url, card); return; }
    if (useCredit()){ unlock(url, card); renderCredits(); return; }
    if (!window.IBGPay) { console.warn('IBGPay no disponible'); return; }
    window.IBGPay.pay(0.10, ()=>{
      addUnlocked(url); unlock(url, card); renderCredits();
    });
  }
  grid.addEventListener('click', (e)=>{
    const btn = e.target.closest('.buy-one'); if(!btn) return;
    const card = e.target.closest('.p-card'); const url = card?.dataset?.url;
    if(url) buyOne(url, card);
  });

  document.getElementById('buy-pack').addEventListener('click', ()=>{
    if (!window.IBGPay) return;
    window.IBGPay.pay(0.80, ()=>{ addCredits(10); renderCredits(); });
  });
  document.getElementById('sub-month').addEventListener('click', ()=>{
    const plan=(window.IBG||{}).PAYPAL_PLAN_MONTHLY_1499; if(!plan || !window.IBGPay) return;
    window.IBGPay.subscribe(plan, ()=>{ markSubscribed(); document.querySelectorAll('.p-card.locked').forEach(el=>el.classList.remove('locked')); renderCredits(); });
  });
  document.getElementById('sub-year').addEventListener('click', ()=>{
    const plan=(window.IBG||{}).PAYPAL_PLAN_ANNUAL_4999; if(!plan || !window.IBGPay) return;
    window.IBGPay.subscribe(plan, ()=>{ markSubscribed(); document.querySelectorAll('.p-card.locked').forEach(el=>el.classList.remove('locked')); renderCredits(); });
  });
}
JS

git add -A
git commit -m "premium: robust scan for uncensored pool (UnifiedContentAPI/CD3/CD4 + globals) with FULL fallback" || true
git push origin main || true
npx -y vercel --prod --yes || { npx -y vercel build && npx -y vercel deploy --prebuilt --prod --yes; }
