/* Premium grid — usa /uncensored/index.json como fuente única de verdad.
   Fallback: introspección de ContentData3/4 por si el índice no existe.
*/
function daySeed(){const d=new Date();return `${d.getUTCFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()}`;}
function seededShuffle(a,seed){let s=0;for(let i=0;i<seed.length;i++)s=(s*31+seed.charCodeAt(i))>>>0;const r=a.slice();for(let i=r.length-1;i>0;i--){s=(1103515245*s+12345)%0x80000000;const j=s%(i+1);[r[i],r[j]]=[r[j],r[i]]}return r;}
const EXT=/\.(webp|jpe?g|png)$/i;

async function fetchIndex(){
  try{
    const r = await fetch('/uncensored/index.json?v='+Date.now(), {cache:'no-store'});
    if(!r.ok) throw new Error('HTTP '+r.status);
    const list = await r.json();
    if(Array.isArray(list)){
      const names = list.filter(x=>typeof x==='string' && EXT.test(x));
      console.log('[IBG] index.json entries:', names.length);
      return names;
    }
  }catch(e){
    console.warn('[IBG] index.json no disponible:', e.message||e);
  }
  return [];
}

function extractFrom(obj, out){
  if(!obj) return;
  if(Array.isArray(obj)){
    for(const v of obj) extractFrom(v,out);
    return;
  }
  const t = typeof obj;
  if(t==='string'){ if(EXT.test(obj)) out.push(obj); return; }
  if(t==='object'){
    for(const k in obj){
      const v=obj[k];
      if(typeof v==='string'){ if(EXT.test(v)) out.push(v); }
      else extractFrom(v,out);
    }
  }
}

function unique(a){ return Array.from(new Set(a)); }
function basename(p){ return String(p).split('?')[0].replace(/^.*\//,''); }

function namesFromContentData(){
  const bucket=[];
  const candidates=[window.ContentData3, window.ContentData4, window.UnifiedContentAPI, window.ContentAPI, window.ContentSystemManager];
  for(const src of candidates){
    extractFrom(src,bucket);
  }
  const names = unique(bucket.map(basename).filter(n=>EXT.test(n)));
  console.log('[IBG] fallback ContentData names:', names.length);
  return names;
}

function buildUrlsFromNames(names){
  // encodeURIComponent + preserva slash si viniera accidentalmente (no debería)
  return names.map(n => '/uncensored/' + encodeURIComponent(String(n)));
}

function ensureCss(){
  if(!document.getElementById('css-premium')){
    const l=document.createElement('link');
    l.id='css-premium'; l.rel='stylesheet'; l.href='/css/premium.css?v='+Date.now();
    document.head.appendChild(l);
  }
}

function renderGrid(urls){
  const app=document.getElementById('app')||document.body;
  let sec=document.getElementById('premiumSection'); if(!sec){ sec=document.createElement('section'); sec.id='premiumSection'; app.appendChild(sec); }
  sec.innerHTML='';
  const h=document.createElement('h1'); h.textContent='Premium'; sec.appendChild(h);
  const grid=document.createElement('div'); grid.id='premiumGrid'; grid.className='premium-grid'; sec.appendChild(grid);

  const total=Math.min(urls.length, 100);
  const picks=seededShuffle(urls, daySeed()).slice(0,total);
  const markNew=Math.max(1, Math.floor(total*0.30));
  const newSet=new Set(picks.slice(0,markNew));

  const frag=document.createDocumentFragment();
  picks.forEach((u,i)=>{
    const card=document.createElement('div'); card.className='p-card locked'; card.dataset.url=u;

    const img=document.createElement('img'); img.loading='lazy'; img.decoding='async'; img.src=u; img.alt=`Premium ${i+1}`;
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

  grid.addEventListener('click', (e)=>{
    const btn=e.target.closest('button.buy'); if(!btn) return;
    const card=e.target.closest('.p-card'); if(!card) return;

    if(localStorage.getItem('ibg_subscribed')==='1'){ card.classList.remove('locked'); card.classList.add('unlocked'); return; }

    const credits=parseInt(localStorage.getItem('ibg_credits')||'0',10)||0;
    if(credits>0){ localStorage.setItem('ibg_credits', String(credits-1)); card.classList.remove('locked'); card.classList.add('unlocked'); return; }

    alert('PayPal no está configurado ahora mismo.');
  });
}

export async function initPremium(){
  ensureCss();

  // 1) índice
  let names = await fetchIndex();

  // 2) fallback si no hay índice o está vacío
  if(!names.length){
    names = namesFromContentData();
  }

  console.log('[IBG] premium names:', names.length);

  if(!names.length){
    const app=document.getElementById('app')||document.body;
    let sec=document.getElementById('premiumSection'); if(!sec){ sec=document.createElement('section'); sec.id='premiumSection'; app.appendChild(sec); }
    sec.innerHTML='<h1>Premium</h1><div style="opacity:.8">No encontré nombres de imágenes. Verifica que /uncensored/index.json exista y que haya .webp en /uncensored/.</div>';
    return;
  }

  const urls = buildUrlsFromNames(names);
  console.log('[IBG] premium URLs (first 5):', urls.slice(0,5));

  renderGrid(urls);
}
