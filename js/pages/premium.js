/* Premium page — exporta initPremium() */
function daySeed(){const d=new Date();return `${d.getUTCFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()}`;}
function seededShuffle(a,seed){let s=0;for(let i=0;i<seed.length;i++)s=(s*31+seed.charCodeAt(i))>>>0;const r=a.slice();for(let i=r.length-1;i>0;i--){s=(1103515245*s+12345)%0x80000000;const j=s%(i+1);[r[i],r[j]]=[r[j],r[i]]}return r;}
function uniq(arr){return Array.from(new Set(arr));}

const IMG_EXT=/\.(webp|jpe?g|png|gif)$/i;

function normBase(b){
  if(!b) return '';
  let x=String(b).replace(/\\/g,'/').trim();
  if(!/uncensored/i.test(x)) return '';
  if(!/^https?:\/\//i.test(x) && x[0] !== '/') x='/'+x;
  if(!x.endsWith('/')) x+='/';
  return x;
}
function joinUrl(base,name){
  if(!name) return '';
  const s=String(name).trim();
  if(/^https?:\/\//i.test(s) || s.startsWith('/')) return s;
  const b=normBase(base)||'/uncensored/';
  return b + s.replace(/^\.?\/*/,'');
}
function collectNames(v){
  const out=[];
  if(typeof v==='string' && IMG_EXT.test(v)) out.push(v);
  else if(Array.isArray(v)){
    v.forEach(x=>{
      if(typeof x==='string' && IMG_EXT.test(x)) out.push(x);
      else if(x && typeof x==='object'){
        const p=x.src||x.file||x.name||x.image||x.url||x.path||x.thumb||x.cover||x.banner;
        if(typeof p==='string' && IMG_EXT.test(p)) out.push(p);
      }
    });
  }
  return out;
}
function quickCollectFrom(obj){
  if(!obj||typeof obj!=='object') return [];
  // intenta arrays directos tipo ContentData3.images / .files / .items / .list / .data
  let names=[];
  ['images','files','items','list','data','gallery','pool','array','uncensored'].forEach(k=>{
    const v=obj[k];
    names.push(...collectNames(v));
  });
  names=uniq(names);
  // base preferente
  let base='';
  ['base','path','dir','folder','root'].forEach(k=>{
    const v=obj[k];
    if(!base && typeof v==='string'){ const nb=normBase(v); if(nb) base=nb; }
  });
  if(!base) base='/uncensored/';
  return names.map(n=>{
    if(typeof n==='string' && (n.includes('/uncensored/') || n.startsWith('/') || /^https?:\/\//i.test(n))) return n;
    return joinUrl(base, n);
  });
}
function deepCollect(obj, hardLimit=40000){
  const out=new Set(); const q=[]; const seen=new WeakSet(); const bases=new Set();
  function enqueue(v){ if(!v) return; const t=typeof v; if(t!=='object'&&t!=='function') return; try{ if(seen.has(v)) return; seen.add(v); q.push(v);}catch(_){} }
  enqueue(obj);
  let steps=0;
  while(q.length && steps<hardLimit && out.size<6000){
    const cur=q.shift(); steps++;
    try{
      ['base','path','dir','folder','root'].forEach(k=>{ const v=cur&&cur[k]; if(typeof v==='string'){ const nb=normBase(v); if(nb) bases.add(nb); }});
      quickCollectFrom(cur).forEach(u=>out.add(u));
      if(Array.isArray(cur)) cur.forEach(enqueue);
      else if(cur&&typeof cur==='object') for(const k in cur) enqueue(cur[k]);
    }catch(_){}
  }
  const bestBase = Array.from(bases).find(b=>/\/uncensored\/$/i.test(b)) || Array.from(bases)[0] || '/uncensored/';
  return Array.from(out).map(u=>{
    if(!u) return '';
    if(u.includes('/uncensored/') || u.startsWith('/') || /^https?:\/\//i.test(u)) return u;
    return joinUrl(bestBase, u);
  }).filter(Boolean);
}

function getPremiumPool(){
  const results=[];
  // 1) ContentData3 / ContentData4 directos
  try{ if(window.ContentData3) results.push(...quickCollectFrom(window.ContentData3)); }catch(_){}
  try{ if(window.ContentData4) results.push(...quickCollectFrom(window.ContentData4)); }catch(_){}
  // 2) Anidados
  if(results.length<100){
    try{ if(window.ContentData3) results.push(...deepCollect(window.ContentData3)); }catch(_){}
    try{ if(window.ContentData4) results.push(...deepCollect(window.ContentData4)); }catch(_){}
  }
  // 3) UnifiedContentAPI (por si existe)
  try{
    const U=window.UnifiedContentAPI;
    if(U){
      if(typeof U.getPremiumImages==='function'){
        (U.getPremiumImages()||[]).forEach(x=>{
          const u=(typeof x==='string')?x:(x.url||x.src||x.path||x.image);
          if(u) results.push(u);
        });
      } else if(typeof U.getAll==='function'){
        (U.getAll('uncensored')||U.getAll('premium')||[]).forEach(x=>{
          const u=(typeof x==='string')?x:(x.url||x.src||x.path||x.image);
          if(u) results.push(u);
        });
      }
    }
  }catch(_){}
  // filtra solo uncensored/*.webp (u otras válidas)
  return uniq(results.filter(u => typeof u==='string' && /\/uncensored\//i.test(u) && IMG_EXT.test(u)));
}

function ensurePremiumCss(){
  if(!document.getElementById('css-premium')){
    const l=document.createElement('link'); l.id='css-premium'; l.rel='stylesheet'; l.href='/css/premium.css';
    document.head.appendChild(l);
  }
}
function ensureAds(){
  function ensure(id,cls){ let el=document.getElementById(id); if(!el){ el=document.createElement('div'); el.id=id; el.className=cls; document.body.appendChild(el);} return el; }
  ensure('ad-left','side-ad left'); ensure('ad-right','side-ad right');
}
function renderGrid(urls){
  const app=document.getElementById('app')||document.body;
  let sec=document.getElementById('premiumSection');
  if(!sec){ sec=document.createElement('section'); sec.id='premiumSection'; app.appendChild(sec); }
  sec.innerHTML='';
  const h=document.createElement('h1'); h.textContent='Premium'; sec.appendChild(h);
  const grid=document.createElement('div'); grid.id='premiumGrid'; grid.className='premium-grid'; sec.appendChild(grid);

  const total=Math.min(urls.length,100);
  const picks=seededShuffle(urls, daySeed()).slice(0,total);
  const markNew=Math.max(1, Math.floor(total*0.30));
  const newSet=new Set(picks.slice(0,markNew));

  const frag=document.createDocumentFragment();
  picks.forEach((u,i)=>{
    const card=document.createElement('div'); card.className='p-card locked'; card.dataset.url=u;

    const img=document.createElement('img'); img.loading='lazy'; img.decoding='async'; img.src=u; img.alt=`Premium ${i+1}`;
    card.appendChild(img);

    if(newSet.has(u)){ const badge=document.createElement('div'); badge.className='badge-new'; badge.textContent='Nuevo'; card.appendChild(badge); }

    const overlay=document.createElement('div'); overlay.className='overlay';
    const prices=document.createElement('div'); prices.className='prices';
    const tag1=document.createElement('span'); tag1.className='tag'; tag1.textContent='€0.10';
    const tag2=document.createElement('span'); tag2.className='tag bundle'; tag2.textContent='10 por €0.80';
    prices.append(tag1,tag2);

    const btns=document.createElement('div'); btns.className='btns';
    const buy=document.createElement('button'); buy.className='buy'; buy.type='button'; buy.textContent='Comprar';
    btns.appendChild(buy);

    const tiny=document.createElement('div'); tiny.className='tiny'; tiny.textContent='o suscríbete: 14,99€/mes · 49,99€/año';

    overlay.append(prices, btns, tiny);
    card.appendChild(overlay);

    frag.appendChild(card);
  });
  grid.appendChild(frag);

  grid.addEventListener('click', async (e)=>{
    const btn=e.target.closest('button.buy'); if(!btn) return;
    const card=e.target.closest('.p-card'); if(!card) return;

    // si hay suscripción activa → desbloquear
    if(localStorage.getItem('ibg_subscribed')==='1'){ card.classList.remove('locked'); card.classList.add('unlocked'); return; }

    // si hay créditos → gastar
    const credits=parseInt(localStorage.getItem('ibg_credits')||'0',10)||0;
    if(credits>0){ localStorage.setItem('ibg_credits', String(credits-1)); card.classList.remove('locked'); card.classList.add('unlocked'); return; }

    // PayPal (preferir IBGPay si existe, si no IBGPayPal.mountPayPerItem inline)
    if(window.IBGPay && typeof window.IBGPay.pay==='function'){
      window.IBGPay.pay(0.10, ()=>{ card.classList.remove('locked'); card.classList.add('unlocked'); });
    }else if(window.IBGPayPal && typeof window.IBGPayPal.mountPayPerItem==='function'){
      const holder=document.createElement('div'); holder.className='pp-holder'; btn.replaceWith(holder);
      window.IBGPayPal.mountPayPerItem(holder, {
        description:'Foto premium', value:'0.10', sku:`photo:${card.dataset.url}`,
        onApprove:()=>{ card.classList.remove('locked'); card.classList.add('unlocked'); }
      });
    }else{
      alert('PayPal no disponible ahora mismo.');
    }
  }, {once:false});
}

/* === EXPORT PRINCIPAL === */
export async function initPremium(){
  ensurePremiumCss();
  ensureAds();
  const pool = getPremiumPool();
  console.log('[IBG] premium pool size:', pool.length);
  if(!pool.length){
    const app=document.getElementById('app')||document.body;
    let sec=document.getElementById('premiumSection'); if(!sec){ sec=document.createElement('section'); sec.id='premiumSection'; app.appendChild(sec); }
    sec.innerHTML='<h1>Premium</h1><div style="opacity:.8">No se pudo localizar el pool premium (uncensored). Revisa content-data3/4.</div>';
    return;
  }
  renderGrid(pool);
}

/* Compatibilidad: si alguien carga premium.js directo en la página sin bootstrap */
if (document.currentScript && document.currentScript.dataset.autorun === '1') {
  document.addEventListener('DOMContentLoaded', ()=>initPremium());
}
