#!/usr/bin/env bash
set -euo pipefail

echo "[IBG] Fix: deep crawler para premium + PayPal SDK con vault=true"

# --- 1) paypal.js: SDK con components=buttons,subscriptions&vault=true (válido para order+subscription) ---
cat > js/paypal.js <<'JS'
(function(){
  const STATE = { sdkLoaded:false, loading:false };

  function ensureModal(){
    let m = document.getElementById('pp-modal');
    if(!m){
      const backdrop = document.createElement('div');
      backdrop.id = 'pp-backdrop';
      backdrop.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:1000;display:none;align-items:center;justify-content:center';
      m = document.createElement('div');
      m.id = 'pp-modal';
      m.innerHTML = '<div class="box" style="background:#0b1422;border:1px solid rgba(255,255,255,.1);padding:18px;border-radius:14px;min-width:320px;margin:auto">'
        +'<div id="paypal-container"></div>'
        +'<div style="margin-top:8px;text-align:center">'
          +'<button id="pp-close" style="padding:6px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.2);background:#0f1b2d;color:#fff;cursor:pointer">Cancelar</button>'
        +'</div>'
      +'</div>';
      backdrop.appendChild(m);
      document.body.appendChild(backdrop);
      backdrop.addEventListener('click',(e)=>{ if(e.target.id==='pp-backdrop'||e.target.id==='pp-close'){ hideModal(); }});
    }
    return m;
  }
  function showModal(){ document.getElementById('pp-backdrop').style.display='flex'; }
  function hideModal(){
    const bd=document.getElementById('pp-backdrop'); if(bd) bd.style.display='none';
    const c=document.getElementById('paypal-container'); if(c) c.innerHTML='';
  }

  function ensureSDK(){
    return new Promise((resolve,reject)=>{
      if(STATE.sdkLoaded) return resolve();
      if(STATE.loading){
        const t = setInterval(()=>{ if(STATE.sdkLoaded){ clearInterval(t); resolve(); } }, 50);
        setTimeout(()=>{ clearInterval(t); if(!STATE.sdkLoaded) reject('sdk-timeout'); }, 10000);
        return;
      }
      const IBG = window.IBG || {};
      const cid = IBG.PAYPAL_CLIENT_ID;
      if(!cid){ console.warn('PAYPAL_CLIENT_ID ausente'); return reject('no-client-id'); }
      STATE.loading = true;
      const s = document.createElement('script');
      // components incluye subscriptions; vault=true requerido en algunos merchants
      s.src = 'https://www.paypal.com/sdk/js?client-id='+encodeURIComponent(cid)
            + '&currency=EUR'
            + '&components=buttons,subscriptions'
            + '&vault=true';
      s.async = true;
      s.onload = ()=>{ STATE.sdkLoaded=true; STATE.loading=false; resolve(); };
      s.onerror = ()=>{ STATE.loading=false; reject('sdk-load-error'); };
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

  async function mountPayPerItem({ amount, onApprove, container }){
    if(!container){ ensureModal(); showModal(); }
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
    if(!container){ ensureModal(); showModal(); }
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

  async function pay(amount, onApprove){ return mountPayPerItem({ amount, onApprove, container:null }); }
  async function subscribe(planId, onApprove){ return mountSubscription({ planId, onApprove, container:null }); }

  window.IBGPay = { pay, subscribe, mountPayPerItem, mountSubscription };
})();
export async function mountPayPerItem(opts){ return window.IBGPay.mountPayPerItem(opts); }
export async function mountSubscription(opts){ return window.IBGPay.mountSubscription(opts); }
export async function pay(amount, onApprove){ return window.IBGPay.pay(amount, onApprove); }
export async function subscribe(planId, onApprove){ return window.IBGPay.subscribe(planId, onApprove); }
JS

# --- 2) premium.js: crawler profundo de window para /uncensored/ *.jpg|jpeg|png|webp|gif ---
cat > js/pages/premium.js <<'JS'
import { seededPick } from '../utils-home.js';

function ensurePremiumCss(){
  if(!document.getElementById('css-ibg-premium')){
    const l=document.createElement('link'); l.id='css-ibg-premium'; l.rel='stylesheet'; l.href='/css/ibg-premium.css';
    document.head.appendChild(l);
  }
}
const IMG_RE = /\.(jpe?g|png|webp|gif)$/i;
function isImageUrl(s){ return typeof s==='string' && s.includes('/uncensored/') && IMG_RE.test(s); }

// crawler seguro (evita bucles), límite de objetos/strings
function crawlUncensoredFromWindow(limitNodes=8000, limitHits=1000){
  const q = [];
  const seen = new Set();
  const hits = new Set();

  function enqueue(v){
    if(!v) return;
    const t = typeof v;
    if(t!=='object' && t!=='function') return;
    try{
      if(seen.has(v)) return; seen.add(v);
      q.push(v);
    }catch(_){}
  }

  // semillas obvias
  enqueue(window.UnifiedContentAPI);
  enqueue(window.ContentData3); enqueue(window.ContentData4);
  // fallback: todo window (con cuidado)
  enqueue(window);

  let processed = 0;
  while(q.length && processed < limitNodes && hits.size < limitHits){
    const cur = q.shift(); processed++;
    // arrays
    if(Array.isArray(cur)){
      for(let i=0;i<cur.length;i++){
        const v=cur[i];
        if(isImageUrl(v)){ hits.add(v); }
        else enqueue(v);
      }
      continue;
    }
    // objetos
    try{
      for(const k in cur){
        const v = cur[k];
        if(isImageUrl(v)){ hits.add(v); }
        else enqueue(v);
      }
    }catch(_){}
  }
  return Array.from(hits);
}

function urlNorm(u){ if(!u) return '';
  if(/^https?:\/\//i.test(u) || u[0]==='/') return u;
  return '/'+u.replace(/^\.?\/*/,''); }

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

export async function initPremium(){
  ensurePremiumCss();

  // anuncios laterales
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

  // CRAWL
  let pool = crawlUncensoredFromWindow(8000, 2000).map(urlNorm);
  console.info('[IBG] premium pool size:', pool.length);

  // fallback (no dejamos la página vacía)
  if(pool.length===0){
    try{
      const C2 = window.ContentData2;
      // buscar full
      const full = crawlUncensoredFromWindow(4000, 0); // devuelve 0 hits; usamos manual
      const fromC2=[];
      function collect(obj){
        if(!obj) return;
        if(Array.isArray(obj)){ obj.forEach(collect); return; }
        if(typeof obj==='object'){ for(const k in obj){ const v=obj[k]; if(typeof v==='string' && v.includes('/full/') && IMG_RE.test(v)) fromC2.push(urlNorm(v)); else collect(v); } }
      }
      collect(C2);
      if(fromC2.length){ pool = fromC2; console.warn('[IBG] premium pool vacío; usando FULL temporalmente.'); }
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

# Commit + deploy
git add -A
git commit -m "paypal: vault=true & subscriptions component; premium: deep window crawler for /uncensored/ images" || true
git push origin main || true
npx -y vercel --prod --yes || { npx -y vercel build && npx -y vercel deploy --prebuilt --prod --yes; }
