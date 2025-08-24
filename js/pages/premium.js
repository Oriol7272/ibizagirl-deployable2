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
