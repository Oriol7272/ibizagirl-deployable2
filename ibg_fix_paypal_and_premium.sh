#!/usr/bin/env bash
set -euo pipefail

echo "[IBG] Fix paypal exports + Premium estable"

# 1) paypal.js — añade exports ESM ('mountPayPerItem', 'mountSubscription') y mantiene window.IBGPay
cat > js/paypal.js <<'JS'
(function(){
  const IBG = window.IBG || {};
  const STATE = { sdkLoaded:false };

  function ensureModal(){
    let m = document.getElementById('pp-modal');
    if(!m){
      m = document.createElement('div');
      m.id = 'pp-modal';
      m.style.display = 'none';
      m.innerHTML = '<div class="box" style="background:#0b1422;border:1px solid rgba(255,255,255,.1);padding:18px;border-radius:14px;min-width:320px;margin:auto"><div id="paypal-container"></div><div style="margin-top:8px;text-align:center"><button id="pp-close" style="padding:6px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.2);background:#0f1b2d;color:#fff;cursor:pointer">Cancelar</button></div></div>';
      const backdrop = document.createElement('div');
      backdrop.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:1000;display:flex;align-items:center;justify-content:center';
      backdrop.id = 'pp-backdrop';
      backdrop.appendChild(m);
      document.body.appendChild(backdrop);
      backdrop.addEventListener('click',(e)=>{ if(e.target.id==='pp-backdrop'||e.target.id==='pp-close'){ hideModal(); }});
    }
    return m;
  }
  function showModal(){ ensureModal().parentElement.style.display='flex'; }
  function hideModal(){
    const bd=document.getElementById('pp-backdrop'); if(bd){ bd.style.display='none'; }
    const c=document.getElementById('paypal-container'); if(c) c.innerHTML='';
  }

  function ensureSDK(){
    return new Promise((resolve,reject)=>{
      if(STATE.sdkLoaded) return resolve();
      const cid = (window.IBG||{}).PAYPAL_CLIENT_ID;
      if(!cid){ console.warn('PAYPAL_CLIENT_ID ausente'); return reject('no-client-id'); }
      const s = document.createElement('script');
      s.src = 'https://www.paypal.com/sdk/js?client-id='+encodeURIComponent(cid)+'&currency=EUR&intent=capture&components=buttons,subscriptions';
      s.async = true;
      s.onload = ()=>{ STATE.sdkLoaded=true; resolve(); };
      s.onerror = ()=> reject('sdk-load-error');
      document.head.appendChild(s);
    });
  }

  async function _renderButtons(opts){
    const { inContainer, create, onApprove, onError } = opts;
    await ensureSDK();
    const target = inContainer || '#paypal-container';
    return window.paypal.Buttons({
      style:{ shape:'pill', layout:'vertical' },
      ...create,
      onApprove: (data, actions)=>Promise.resolve(onApprove && onApprove(data, actions)),
      onError: (err)=>{ console.warn('PayPal error', err); onError && onError(err); }
    }).render(target);
  }

  // ——— Public APIs ———
  async function mountPayPerItem({ amount, onApprove, container }){
    if(!container){ showModal(); }
    return _renderButtons({
      inContainer: container,
      create:{
        createOrder: (data, actions)=>actions.order.create({
          purchase_units: [{ amount:{ value: Number(amount||0).toFixed(2), currency_code:'EUR' } }]
        }),
        onApprove: async (data, actions)=>{
          try{ await actions.order.capture(); }catch(_){}
          if(!container){ hideModal(); }
          onApprove && onApprove(data);
        }
      }
    });
  }

  async function mountSubscription({ planId, onApprove, container }){
    if(!container){ showModal(); }
    return _renderButtons({
      inContainer: container,
      create:{
        createSubscription: (data, actions)=> actions.subscription.create({ plan_id: planId }),
        onApprove: (data)=>{
          if(!container){ hideModal(); }
          onApprove && onApprove(data);
        }
      }
    });
  }

  // Helpers de conveniencia
  async function pay(amount, onApprove){ return mountPayPerItem({ amount, onApprove, container:null }); }
  async function subscribe(planId, onApprove){ return mountSubscription({ planId, onApprove, container:null }); }

  // Export ESM y Global
  if (typeof window !== 'undefined') {
    window.IBGPay = { pay, subscribe, mountPayPerItem, mountSubscription };
  }
  try{
    // ESM exports (no-op si no hay module system)
    // eslint-disable-next-line no-undef
    if (typeof exportFunction !== 'function'){}
  }catch(_){}

  // UMD-lite: define exports cuando sea importado como módulo
  // (el bundler nativo del navegador lo recogerá)
  // Nota: esta sección no hace nada en IIFE puro.
})();
export async function mountPayPerItem(opts){ return window.IBGPay.mountPayPerItem(opts); }
export async function mountSubscription(opts){ return window.IBGPay.mountSubscription(opts); }
export async function pay(amount, onApprove){ return window.IBGPay.pay(amount, onApprove); }
export async function subscribe(planId, onApprove){ return window.IBGPay.subscribe(planId, onApprove); }
JS

# 2) premium.css por si no estaba
mkdir -p css
cat > css/ibg-premium.css <<'CSS'
@font-face{font-family:"Sexy Beachy";src:url("/decorative-images/Sexy Beachy.ttf") format("truetype");font-display:swap}
:root{ --side:164px }
.side-ad{position:fixed;top:0;bottom:0;width:var(--side);z-index:50;display:none;align-items:center;justify-content:center}
.side-ad.left{left:0}.side-ad.right{right:0}
.ad-box{width:160px;height:600px;display:flex;align-items:center;justify-content:center;overflow:hidden}
@media (min-width:1200px){ body{padding-left:var(--side);padding-right:var(--side)} .side-ad{display:flex} }
.page-shell,#app{width:100%;max-width:calc(100vw - (var(--side) * 2));margin:0 auto}
h1.premium-title{font-family:'Sexy Beachy',system-ui;font-size:clamp(38px,4vw,56px);margin:14px 12px 6px}
.premium-cta{display:flex;flex-wrap:wrap;gap:10px;margin:4px 12px 12px}
.pill{display:inline-flex;align-items:center;gap:8px;background:#0b2140;border:1px solid rgba(255,255,255,.08);color:#fff;padding:10px 14px;border-radius:999px;cursor:pointer;user-select:none}
.pill .sub{opacity:.8;font-size:13px}.pill .price{font-weight:800}.pill .pp{display:inline-block;width:22px;height:22px;background:url('/assets/paypal-mark.svg') no-repeat center/contain}
.premium-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;padding:0 12px 40px}
.p-card{position:relative;border-radius:16px;overflow:hidden;background:#0a1320}
.p-card img{width:100%;height:240px;object-fit:cover;display:block;transform:scale(1.06)}
.p-card.locked img{filter:blur(12px) saturate(1.05) contrast(1.05)}
.p-card .badge-new{position:absolute;top:8px;left:8px;background:#22c55e;color:#031a0b;font-weight:800;border-radius:999px;padding:4px 10px;font-size:12px}
.p-card .overlay{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;background:linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(0,0,0,.55) 100%);gap:8px;padding:10px 10px 12px}
.p-card .buttons{display:flex;gap:8px;align-items:center}
.btn-buy{display:inline-flex;align-items:center;gap:6px;background:#111827;border:1px solid rgba(255,255,255,.18);padding:7px 10px;border-radius:10px;font-size:13px;cursor:pointer}
.btn-buy .pp{width:18px;height:18px;background:url('/assets/paypal-mark.svg') no-repeat center/contain}
.btn-buy .price{opacity:.85;font-weight:700;font-size:12px}
.p-card.unlocked .locked-note{display:none}
#pp-modal{position:fixed;inset:0;background:rgba(0,0,0,.6);display:none;align-items:center;justify-content:center;z-index:1000}
#pp-modal .box{background:#0b1422;border:1px solid rgba(255,255,255,.1);padding:18px;border-radius:14px;min-width:320px}
#paypal-container{min-height:120px}
.credit-note{margin:0 12px 14px;font-size:13px;opacity:.8}
CSS

# 3) premium.js — asegura CSS inyectado (por si la página no lo importase)
cat > js/pages/premium.js <<'JS'
import { seededPick } from '../utils-home.js';

function ensurePremiumCss(){
  if(!document.getElementById('css-ibg-premium')){
    const l=document.createElement('link'); l.id='css-ibg-premium'; l.rel='stylesheet'; l.href='/css/ibg-premium.css';
    document.head.appendChild(l);
  }
}
function toArr(v){ if(!v) return []; if(Array.isArray(v)) return v;
  if(typeof v==='object'){ if(Number.isFinite(v.length)){ try{return Array.from(v);}catch(e){} }
    if(Array.isArray(v.items))return v.items; if(Array.isArray(v.list))return v.list; if(Array.isArray(v.array))return v.array; } return []; }
function urlFrom(it){ var u=''; if(!it) return ''; if(typeof it==='string') u=it;
  else u=it.banner||it.cover||it.thumb||it.src||it.file||it.url||it.path||it.image||it.href||'';
  if(!u) return ''; if(/^https?:\/\//i.test(u) || u[0]==='/') return u;
  if(/^(uncensored|full|img|assets)\//i.test(u)) return '/'+u.replace(/^\.?\/*/,'');
  return '/uncensored/'+u.replace(/^\.?\/*/,''); }
function scanPremiumPool(){
  try{
    var U = window.UnifiedContentAPI;
    if(U){
      if (typeof U.getPremiumImages==='function') {
        var r = toArr(U.getPremiumImages());
        if(r.length) return r;
      }
      var keys=['premium','uncensored','images','data','items'];
      for(var i=0;i<keys.length;i++){ var a=toArr(U[keys[i]]); if(a.length) return a; }
    }
  }catch(e){}
  try{
    var C3=window.ContentData3, C4=window.ContentData4;
    var a=[]; a=a.concat(toArr(C3&&C3.images||C3&&C3.uncensored||C3&&C3.data||[]));
    a=a.concat(toArr(C4&&C4.images||C4&&C4.uncensored||C4&&C4.data||[]));
    if(a.length) return a;
  }catch(e){}
  return [];
}
function pickRandom(arr,n){ var pool=arr.slice(); for(var i=pool.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var tmp=pool[i]; pool[i]=pool[j]; pool[j]=tmp; } return pool.slice(0,Math.min(n,pool.length)); }
function getUnlocked(){ try{ return JSON.parse(localStorage.getItem('ibg_unlocked')||'[]'); }catch(_){return[]} }
function setUnlocked(list){ try{ localStorage.setItem('ibg_unlocked', JSON.stringify(list)); }catch(_){} }
function addUnlocked(url){ var u=getUnlocked(); if(u.indexOf(url)<0){ u.push(url); setUnlocked(u);} }
function getCredits(){ var n=parseInt(localStorage.getItem('ibg_credits')||'0',10)||0; return n; }
function addCredits(n){ localStorage.setItem('ibg_credits', String(getCredits()+n)); }
function useCredit(){ var c=getCredits(); if(c>0){ localStorage.setItem('ibg_credits', String(c-1)); return true; } return false; }
function markSubscribed(){ localStorage.setItem('ibg_subscribed','1'); }
function isSub(){ return localStorage.getItem('ibg_subscribed')==='1'; }
function dailySeed(){ var d=new Date(); return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(); }

export async function initPremium(){
  ensurePremiumCss();

  // anuncios laterales
  function ensure(id,cls,host){ var el=document.getElementById(id); if(!el){el=document.createElement('div'); el.id=id; el.className=cls; (host||document.body).appendChild(el);} return el; }
  ensure('ad-left','side-ad left',document.body).innerHTML='<div class="ad-box" id="ad-left-box"></div>';
  ensure('ad-right','side-ad right',document.body).innerHTML='<div class="ad-box" id="ad-right-box"></div>';

  const app=document.getElementById('app');
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
    const c=parseInt(localStorage.getItem('ibg_credits')||'0',10)||0;
    const sub=isSub();
    el.textContent = sub ? 'Suscripción activa: acceso a todo el contenido.' :
      (c>0 ? ('Créditos disponibles: '+c+' (1 crédito = 1 imagen)') : 'Sin créditos. Compra una imagen (0,10 €) o un paquete de 10 (0,80 €).');
  }
  renderCredits();

  const pool = scanPremiumPool();
  console.info('[IBG] premium pool size:', pool.length);

  const picks = pickRandom(pool, 100);
  const grid = document.getElementById('premiumGrid');

  const newSeed = dailySeed();
  const newCount = Math.max(1, Math.floor(picks.length * 0.30));
  const newSet = new Set(seededPick(picks, newCount, 'premium-new-'+newSeed).map(urlFrom));

  const unlockedSet = new Set(getUnlocked());

  picks.forEach((it)=>{
    const u = urlFrom(it); if(!u) return;
    const card = document.createElement('div');
    const isUnlocked = isSub() || unlockedSet.has(u);
    card.className = 'p-card'+(isUnlocked ? ' unlocked' : ' locked');
    card.dataset.url = u;

    const isNew = newSet.has(u);
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
      const arr=new Set(getUnlocked()); arr.add(url); setUnlocked(Array.from(arr));
      unlock(url, card); renderCredits();
    });
  }

  grid.addEventListener('click', (e)=>{
    const btn = e.target.closest('.buy-one'); if(!btn) return;
    const card = e.target.closest('.p-card'); const url = card?.dataset?.url; if(url) buyOne(url, card);
  });

  document.getElementById('buy-pack').addEventListener('click', ()=>{
    if (!window.IBGPay) return;
    window.IBGPay.pay(0.80, ()=>{ localStorage.setItem('ibg_credits', String((parseInt(localStorage.getItem('ibg_credits')||'0',10)||0)+10)); renderCredits(); });
  });
  document.getElementById('sub-month').addEventListener('click', ()=>{
    const plan=(window.IBG||{}).PAYPAL_PLAN_MONTHLY_1499; if(!plan || !window.IBGPay) return;
    window.IBGPay.subscribe(plan, ()=>{ localStorage.setItem('ibg_subscribed','1'); document.querySelectorAll('.p-card.locked').forEach(el=>el.classList.remove('locked')); renderCredits(); });
  });
  document.getElementById('sub-year').addEventListener('click', ()=>{
    const plan=(window.IBG||{}).PAYPAL_PLAN_ANNUAL_4999; if(!plan || !window.IBGPay) return;
    window.IBGPay.subscribe(plan, ()=>{ localStorage.setItem('ibg_subscribed','1'); document.querySelectorAll('.p-card.locked').forEach(el=>el.classList.remove('locked')); renderCredits(); });
  });
}
JS

# 4) Asegura icono PayPal
mkdir -p assets
cat > assets/paypal-mark.svg <<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0070e0"><path d="M7.5 20.5H5.3a.8.8 0 0 1-.8-.9l1.8-12.1a.8.8 0 0 1 .8-.7h4.6c3.6 0 5.8 1.7 5.1 5.3-.5 2.7-2.3 4-4.9 4H9.6l-.5 3.1a.8.8 0 0 1-.8.7Zm2.4-6.2h2.7c2 0 3.6-1 4-3 .5-2.5-.9-3.6-3.6-3.6h-3Zm6.1 6.2H13l.4-2.7h2.4c2 0 3.7-.8 4.5-2.6.2-.4.3-.9.4-1.4.1-.6.1-1.2 0-1.7.6 0 1 .6.9 1.8-.3 3.2-2.2 6.6-5.5 6.6Z"/></svg>
SVG

# 5) Commit + push + deploy
git add -A
git commit -m "fix(paypal): export mountPayPerItem/mountSubscription; premium page complete" || true
git push origin main || true
npx -y vercel --prod --yes || { npx -y vercel build && npx -y vercel deploy --prebuilt --prod --yes; }
