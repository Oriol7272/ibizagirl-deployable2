#!/usr/bin/env bash
set -euo pipefail
echo "[IBG] Reescribiendo premium.js (DOM seguro + crawler /uncensored/)"

cat > js/pages/premium.js <<'JS'
import { seededPick } from '../utils-home.js';

/* -------------------- CSS y helpers -------------------- */
function ensurePremiumCss(){
  if(!document.getElementById('css-ibg-premium')){
    const l=document.createElement('link');
    l.id='css-ibg-premium'; l.rel='stylesheet'; l.href='/css/ibg-premium.css';
    document.head.appendChild(l);
  }
}
const IMG_RE = /\.(jpe?g|png|webp|gif)$/i;
const BASE_KEYS = ['base','path','dir','folder','root'];
const LIST_KEYS = ['images','files','items','list','gallery','pool','data','array'];

function normBase(b){
  if(!b) return '';
  let x=String(b).replace(/\\/g,'/').trim();
  if(!/uncensored/i.test(x)) return '';
  if(!/^https?:\/\//i.test(x) && x[0] !== '/') x = '/'+x;
  if(!x.endsWith('/')) x += '/';
  return x;
}
function toUrl(base, p){
  if(!p) return '';
  const s=String(p).trim();
  if(/^https?:\/\//i.test(s) || s.startsWith('/')) return s;
  const b=normBase(base);
  if(!b) return '';
  return b + s.replace(/^\.?\/*/,'');
}
function collectNames(v){
  const out=[];
  if(typeof v==='string' && IMG_RE.test(v)) out.push(v);
  else if(Array.isArray(v)){
    v.forEach(x=>{
      if(typeof x==='string' && IMG_RE.test(x)) out.push(x);
      else if(x && typeof x==='object'){
        const p = x.src||x.file||x.name||x.image||x.url||x.path||x.thumb||x.cover||x.banner;
        if(typeof p==='string' && IMG_RE.test(p)) out.push(p);
      }
    });
  }
  return out;
}

/* -------------------- Crawler /uncensored/ -------------------- */
function crawlUncensored(limitNodes=10000, limitHits=4000){
  const q=[]; const seen=new WeakSet(); const hits=new Set();

  function enqueue(v){
    if(!v) return;
    const t=typeof v; if(t!=='object' && t!=='function') return;
    try{ if(seen.has(v)) return; seen.add(v); q.push(v); }catch(_){}
  }

  enqueue(window.UnifiedContentAPI);
  enqueue(window.ContentData3);
  enqueue(window.ContentData4);
  enqueue(window);

  let processed=0;
  while(q.length && processed<limitNodes && hits.size<limitHits){
    const cur=q.shift(); processed++;

    // 1) cadenas con /uncensored/
    try{
      if(typeof cur === 'string' && cur.includes('/uncensored/') && IMG_RE.test(cur)){
        hits.add(cur);
      }
    }catch(_){}

    // 2) detectar bases y combinar con listas
    let bases=[];
    try{
      for(const k of BASE_KEYS){
        const v = cur && cur[k];
        if(typeof v==='string' && /uncensored/i.test(v)){
          const nb=normBase(v); if(nb) bases.push(nb);
        }
      }
      if(bases.length===0 && cur && typeof cur==='object'){
        for(const k in cur){
          const v=cur[k];
          if(v && typeof v==='object'){
            for(const kk of BASE_KEYS){
              const vv=v[kk];
              if(typeof vv==='string' && /uncensored/i.test(vv)){
                const nb=normBase(vv); if(nb) bases.push(nb);
              }
            }
          }
        }
      }
    }catch(_){}

    if(bases.length){
      try{
        for(const key of LIST_KEYS){
          const lst = cur && cur[key];
          const names = collectNames(lst);
          if(names.length){
            const base = bases.find(b=>/\/uncensored\/$/i.test(b)) || bases[0];
            names.forEach(n=>{
              const u=toUrl(base,n);
              if(u && IMG_RE.test(u) && u.includes('/uncensored/')) hits.add(u);
            });
          }
        }
        for(const k in cur){
          const v=cur[k];
          if(v && typeof v==='object'){
            let subBase='';
            for(const bk of BASE_KEYS){
              const vb=v[bk];
              if(typeof vb==='string' && /uncensored/i.test(vb)){ subBase=normBase(vb); break; }
            }
            if(subBase){
              for(const lk of LIST_KEYS){
                const lst=v[lk];
                const names=collectNames(lst);
                names.forEach(n=>{
                  const u=toUrl(subBase,n);
                  if(u && IMG_RE.test(u) && u.includes('/uncensored/')) hits.add(u);
                });
              }
            }
          }
        }
      }catch(_){}
    }

    // 3) seguir recorriendo
    try{
      if(Array.isArray(cur)){ cur.forEach(enqueue); }
      else if(cur && typeof cur==='object'){ for(const k in cur){ enqueue(cur[k]); } }
    }catch(_){}
  }
  return Array.from(hits);
}

/* -------------------- Paywall utils -------------------- */
function pickRandom(arr,n){
  const a=arr.slice();
  for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a.slice(0, Math.min(n,a.length));
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

/* -------------------- UI sin innerHTML gigantes -------------------- */
export async function initPremium(){
  ensurePremiumCss();

  // Ads laterales
  function ensure(id,cls,host){
    let el=document.getElementById(id);
    if(!el){ el=document.createElement('div'); el.id=id; el.className=cls; (host||document.body).appendChild(el); }
    return el;
  }
  ensure('ad-left','side-ad left',document.body).appendChild(document.createElement('div')).className='ad-box';
  ensure('ad-right','side-ad right',document.body).appendChild(document.createElement('div')).className='ad-box';

  const app=document.getElementById('app');
  app.textContent='';

  const h1=document.createElement('h1');
  h1.className='premium-title';
  h1.textContent='Premium';
  app.appendChild(h1);

  const cta=document.createElement('div'); cta.className='premium-cta';
  function pill(id, labelLeft, labelRight){
    const d=document.createElement('div'); d.className='pill'; d.id=id;
    const pp=document.createElement('span'); pp.className='pp';
    const txt=document.createElement('span'); txt.textContent=labelLeft;
    const price=document.createElement('span'); price.className='price'; price.textContent=labelRight;
    d.append(pp, txt, price); return d;
  }
  cta.append(
    pill('buy-pack','Paquete 10','0,80€'),
    pill('sub-month','Mensual','14,99€'),
    pill('sub-year','Anual','49,99€'),
  );
  app.appendChild(cta);

  const credit=document.createElement('div'); credit.id='credit-note'; credit.className='credit-note';
  app.appendChild(credit);
  function renderCredits(){
    const c=getCredits(); const sub=isSub();
    credit.textContent = sub ? 'Suscripción activa: acceso a todo el contenido.' :
      (c>0 ? ('Créditos disponibles: '+c+' (1 crédito = 1 imagen)') : 'Sin créditos. Compra una imagen (0,10 €) o un paquete de 10 (0,80 €).');
  }
  renderCredits();

  const grid=document.createElement('section'); grid.id='premiumGrid'; grid.className='premium-grid';
  app.appendChild(grid);

  // CRAWL pool premium
  const pool=crawlUncensored(10000,4000);
  console.info('[IBG] premium pool size:', pool.length);

  if(pool.length===0){
    const info=document.createElement('div');
    info.style.opacity='.8'; info.textContent='No se pudo localizar el pool premium (uncensored). Revisa content-data3/4.';
    grid.appendChild(info);
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

    const card=document.createElement('div'); card.className='p-card'+(isUnlocked?' unlocked':' locked'); card.dataset.url=u;

    if(isNew){ const b=document.createElement('div'); b.className='badge-new'; b.textContent='Nuevo'; card.appendChild(b); }

    const img=document.createElement('img'); img.loading='lazy'; img.src=u; img.alt='';
    card.appendChild(img);

    const overlay=document.createElement('div'); overlay.className='overlay';
    const buttons=document.createElement('div'); buttons.className='buttons';
    const btn=document.createElement('button'); btn.className='btn-buy buy-one'; btn.title='Comprar 0,10€';
    const pp=document.createElement('span'); pp.className='pp';
    const t=document.createElement('span'); t.textContent='Comprar';
    const pr=document.createElement('span'); pr.className='price'; pr.textContent='0,10€';
    btn.append(pp,t,pr); buttons.appendChild(btn);
    overlay.appendChild(buttons);

    const note=document.createElement('div'); note.className='locked-note';
    note.style.cssText='font-size:12px;opacity:.75';
    note.textContent='Contenido difuminado. Desbloquéalo para verlo.';
    overlay.appendChild(note);

    card.appendChild(overlay);
    grid.appendChild(card);
  });

  function unlock(card){ if(card){ card.classList.remove('locked'); card.classList.add('unlocked'); card.querySelector('.locked-note')?.remove(); } }

  grid.addEventListener('click', (e)=>{
    const btn=e.target.closest('.buy-one'); if(!btn) return;
    const card=e.target.closest('.p-card'); const url=card?.dataset?.url; if(!url) return;

    if(isSub()){ unlock(card); return; }
    if(useCredit()){ unlock(card); renderCredits(); return; }

    if(!window.IBGPay){ console.warn('IBGPay no disponible'); return; }
    window.IBGPay.pay(0.10, ()=>{ addUnlocked(url); unlock(card); renderCredits(); });
  });

  document.getElementById('buy-pack').addEventListener('click', ()=>{
    if(!window.IBGPay) return;
    window.IBGPay.pay(0.80, ()=>{ addCredits(10); renderCredits(); });
  });
  document.getElementById('sub-month').addEventListener('click', ()=>{
    const plan=(window.IBG||{}).PAYPAL_PLAN_MONTHLY_1499; if(!plan || !window.IBGPay) return;
    window.IBGPay.subscribe(plan, ()=>{ markSubscribed(); document.querySelectorAll('.p-card.locked').forEach(unlock); renderCredits(); });
  });
  document.getElementById('sub-year').addEventListener('click', ()=>{
    const plan=(window.IBG||{}).PAYPAL_PLAN_ANNUAL_4999; if(!plan || !window.IBGPay) return;
    window.IBGPay.subscribe(plan, ()=>{ markSubscribed(); document.querySelectorAll('.p-card.locked').forEach(unlock); renderCredits(); });
  });
}
JS

# Commit + push + deploy
git add -A
git commit -m "premium: DOM sin innerHTML, crawler /uncensored/ robusto; evita parse error '<'" || true
git push origin main || true
npx -y vercel --prod --yes || { npx -y vercel build && npx -y vercel deploy --prebuilt --prod --yes; }
