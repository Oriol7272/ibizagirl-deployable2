#!/usr/bin/env bash
set -euo pipefail

echo "[IBG] premium.js: crawler que combina base '/uncensored/' + nombres de archivo"

cat > js/pages/premium.js <<'JS'
import { seededPick } from '../utils-home.js';

function ensurePremiumCss(){
  if(!document.getElementById('css-ibg-premium')){
    const l=document.createElement('link'); l.id='css-ibg-premium'; l.rel='stylesheet'; l.href='/css/ibg-premium.css';
    document.head.appendChild(l);
  }
}
const IMG_RE = /\.(jpe?g|png|webp|gif)$/i;
const BASE_KEYS = ['base','path','dir','folder','root'];
const LIST_KEYS = ['images','files','items','list','gallery','pool','data','array'];

function normBase(b){
  if(!b) return '';
  let x = String(b).replace(/\\/g,'/').trim();
  if(!/uncensored/i.test(x)) return '';
  if(!/^https?:\/\//i.test(x) && x[0] !== '/') x = '/'+x;
  if(!x.endsWith('/')) x += '/';
  return x;
}
function toUrl(base, p){
  if(!p) return '';
  const s = String(p).trim();
  if(/^https?:\/\//i.test(s) || s.startsWith('/')) return s;
  const b = normBase(base);
  if(!b) return '';
  return b + s.replace(/^\.?\/*/,'');
}
function collectNames(v){
  const out = [];
  if(typeof v === 'string' && IMG_RE.test(v)) out.push(v);
  else if (Array.isArray(v)){
    v.forEach(x=>{
      if (typeof x === 'string' && IMG_RE.test(x)) out.push(x);
      else if (x && typeof x === 'object'){
        const p = x.src||x.file||x.name||x.image||x.url||x.path||x.thumb||x.cover||x.banner;
        if (typeof p === 'string' && IMG_RE.test(p)) out.push(p);
      }
    });
  }
  return out;
}

// Crawler: busca objetos con base '/uncensored' y listas con nombres de imagen
function crawlUncensored(limitNodes=8000, limitHits=2000){
  const q = [];
  const seen = new Set();
  const hits = new Set();

  function enqueue(v){
    if(!v) return;
    const t = typeof v;
    if(t!=='object' && t!=='function') return;
    try{
      if(seen.has(v)) return;
      seen.add(v);
      q.push(v);
    }catch(_){}
  }

  // semillas obvias y window
  enqueue(window.UnifiedContentAPI);
  enqueue(window.ContentData3);
  enqueue(window.ContentData4);
  enqueue(window);

  let processed = 0;
  while(q.length && processed < limitNodes && hits.size < limitHits){
    const cur = q.shift(); processed++;

    // detecta base(s)
    let bases = [];
    try{
      for(const k of BASE_KEYS){
        const v = cur && cur[k];
        if(typeof v === 'string' && /uncensored/i.test(v)){
          const nb = normBase(v);
          if(nb) bases.push(nb);
        }
      }
      // intenta descubrir base dentro de sub-objeto típico
      if(bases.length===0 && cur && typeof cur==='object'){
        for(const k in cur){
          const v = cur[k];
          if(v && typeof v==='object'){
            for(const kk of BASE_KEYS){
              const vv = v[kk];
              if(typeof vv==='string' && /uncensored/i.test(vv)){
                const nb = normBase(vv);
                if(nb) bases.push(nb);
              }
            }
          }
        }
      }
    }catch(_){}

    // si hay base, busca listas con nombres y combina
    if(bases.length){
      try{
        for(const key of LIST_KEYS){
          const lst = cur && cur[key];
          const names = collectNames(lst);
          if(names.length){
            const base = bases.find(b=>/\/uncensored\/$/i.test(b)) || bases[0];
            names.forEach(n=>{
              const u = toUrl(base, n);
              if(u && IMG_RE.test(u) && u.includes('/uncensored/')) hits.add(u);
            });
          }
        }
        // también busca en sub-objetos donde esté { base: '/uncensored', images:[...] }
        for(const k in cur){
          const v = cur[k];
          if(v && typeof v==='object'){
            let subBase = '';
            for(const bk of BASE_KEYS){
              const vb = v[bk];
              if(typeof vb === 'string' && /uncensored/i.test(vb)){ subBase = normBase(vb); break; }
            }
            if(subBase){
              for(const lk of LIST_KEYS){
                const lst = v[lk];
                const names = collectNames(lst);
                names.forEach(n=>{
                  const u = toUrl(subBase, n);
                  if(u && IMG_RE.test(u) && u.includes('/uncensored/')) hits.add(u);
                });
              }
            }
          }
        }
      }catch(_){}
    }

    // seguir recorriendo
    try{
      if(Array.isArray(cur)){ cur.forEach(enqueue); }
      else if (cur && typeof cur==='object'){
        for(const k in cur){ enqueue(cur[k]); }
      }
    }catch(_){}
  }

  return Array.from(hits);
}

function pickRandom(arr,n){
  const a=arr.slice();
  for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a.slice(0, Math.min(n, a.length));
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

export async function initPremium(){
  ensurePremiumCss();

  // laterales (premium con anuncios)
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

  const pool = crawlUncensored(9000, 4000);
  console.info('[IBG] premium pool size:', pool.length);

  const grid = document.getElementById('premiumGrid');
  if(pool.length===0){
    grid.innerHTML = '<div style="opacity:.8">No se pudo localizar el pool premium (uncensored). Revisa content-data3/4.</div>';
    return;
  }

  const picks = pickRandom(pool, 100);
  const newSeed = dailySeed();
  const newCount = Math.max(1, Math.floor(picks.length * 0.30));
  const newSet = new Set(seededPick(picks, newCount, 'premium-new-'+newSeed));

  const unlockedSet = new Set(getUnlocked());

  picks.forEach((u)=>{
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
        </div>'+
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
    window.IBGPay.pay(0.10, ()=>{ addUnlocked(url); unlock(url, card); renderCredits(); });
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
git commit -m "premium: detecta base '/uncensored' + nombres (CD3/CD4); muestra 100 imgs con blur y 30% 'Nuevo'" || true
git push origin main || true
npx -y vercel --prod --yes || { npx -y vercel build && npx -y vercel deploy --prebuilt --prod --yes; }
