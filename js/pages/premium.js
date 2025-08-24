/* Premium — extrae pool de /uncensored/*.webp desde UnifiedContentAPI/ContentAPI/ContentSystemManager
   con introspección de funciones y diagnóstico en consola. Exporta initPremium().
*/
function daySeed(){const d=new Date();return `${d.getUTCFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()}`;}
function seededShuffle(a,seed){let s=0;for(let i=0;i<seed.length;i++)s=(s*31+seed.charCodeAt(i))>>>0;const r=a.slice();for(let i=r.length-1;i>0;i--){s=(1103515245*s+12345)%0x80000000;const j=s%(i+1);[r[i],r[j]]=[r[j],r[i]]}return r;}
const IMG_OK=/\/uncensored\/[^"'`]+\.(webp|jpe?g|png|gif)(\?.*)?$/i;
function uniq(a){return Array.from(new Set(a));}

function collectStringsDeep(x, out){
  if(!x) return;
  const t=typeof x;
  if(t==='string'){ if(IMG_OK.test(x)) out.push(x); return; }
  if(Array.isArray(x)){ for(const v of x) collectStringsDeep(v,out); return; }
  if(t==='object'){ for(const k in x){ collectStringsDeep(x[k],out); } }
}

function tryCall(fn, args){
  try{ return fn(...args); }catch(_){ return undefined; }
}

function harvestFromApi(obj){
  const urls=[];
  if(!obj || typeof obj!=='object') return urls;

  // 1) Keys directas comunes
  ['uncensored','premium','images','files','items','list','gallery','pool','data','array'].forEach(k=>{
    const v=obj[k];
    collectStringsDeep(v, urls);
  });

  // 2) Si hay funciones, probamos firmaruras 0, 1 y 2 args con 'uncensored'
  Object.keys(obj).forEach(k=>{
    const v=obj[k];
    if(typeof v==='function'){
      // 0 args
      let r = tryCall(v, []);
      collectStringsDeep(r, urls);

      // 1 arg
      r = tryCall(v, ['uncensored']); collectStringsDeep(r, urls);
      r = tryCall(v, ['premium']); collectStringsDeep(r, urls);
      r = tryCall(v, ['images']); collectStringsDeep(r, urls);

      // 2 args
      r = tryCall(v, ['uncensored','images']); collectStringsDeep(r, urls);
      r = tryCall(v, ['premium','images']); collectStringsDeep(r, urls);
    }
  });

  return urls.filter(u=>IMG_OK.test(u));
}

function collectPool(){
  const buckets = [];

  // A) UnifiedContentAPI
  const U = window.UnifiedContentAPI;
  if(U) buckets.push(harvestFromApi(U));

  // B) ContentAPI
  const C = window.ContentAPI || (window.IBG && window.IBG.ContentAPI);
  if(C) buckets.push(harvestFromApi(C));

  // C) ContentSystemManager
  const M = window.ContentSystemManager || (window.IBG && window.IBG.ContentSystemManager);
  if(M) buckets.push(harvestFromApi(M));

  // D) ContentData3/4 (pueden exponer datos “raw”)
  if(window.ContentData3) buckets.push(harvestFromApi(window.ContentData3));
  if(window.ContentData4) buckets.push(harvestFromApi(window.ContentData4));

  // E) Último recurso: inspeccionar algunos globals conocidos
  ['content','data','IBG','__IBG__','__CONTENT__'].forEach(k=>{
    if(window[k]) buckets.push(harvestFromApi(window[k]));
  });

  // F) Si sigue vacío, barrido limitado del window (solo 1º nivel)
  if(!buckets.flat().length){
    const oneLevel=[];
    Object.keys(window).slice(0,500).forEach(k=>{
      const v=window[k];
      if(v && typeof v==='object'){
        oneLevel.push(harvestFromApi(v));
      }
    });
    buckets.push(...oneLevel);
  }

  // fusionar + limpiar duplicados
  const pooled = uniq(buckets.flat().filter(Boolean));

  // Diagnóstico
  console.log('[IBG] premium pool size:', pooled.length);
  if(pooled.length){
    console.log('[IBG] sample premium URLs:', pooled.slice(0,5));
  }

  return pooled;
}

function ensureCss(){
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
  let sec=document.getElementById('premiumSection'); if(!sec){ sec=document.createElement('section'); sec.id='premiumSection'; app.appendChild(sec); }
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
    // diagnóstico de 404/SSL/etc:
    img.addEventListener('error', ()=>{ 
      console.error('[IBG] IMG ERROR', u); 
      card.classList.add('img-error'); 
      const badge=document.createElement('div'); badge.className='badge-err'; badge.textContent='ERROR';
      card.appendChild(badge);
    });
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

    if(localStorage.getItem('ibg_subscribed')==='1'){ card.classList.remove('locked'); card.classList.add('unlocked'); return; }

    const credits=parseInt(localStorage.getItem('ibg_credits')||'0',10)||0;
    if(credits>0){ localStorage.setItem('ibg_credits', String(credits-1)); card.classList.remove('locked'); card.classList.add('unlocked'); return; }

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

export async function initPremium(){
  ensureCss();
  ensureAds();

  const pool = collectPool();
  // si pool = 0, lo mostramos clarito en UI
  if(!pool.length){
    const app=document.getElementById('app')||document.body;
    let sec=document.getElementById('premiumSection'); if(!sec){ sec=document.createElement('section'); sec.id='premiumSection'; app.appendChild(sec); }
    sec.innerHTML='<h1>Premium</h1><div style="opacity:.8">No pude localizar rutas /uncensored/*.webp desde la API. Revisa ContentData3/4 & UnifiedContentAPI.</div>';
    return;
  }

  renderGrid(pool);
}
