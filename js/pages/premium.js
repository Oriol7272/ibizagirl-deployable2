/* Premium – versión simple: lee nombres .webp de ContentData3/4 y pinta /uncensored/<nombre> */
function daySeed(){const d=new Date();return `${d.getUTCFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()}`;}
function seededShuffle(a,seed){let s=0;for(let i=0;i<seed.length;i++)s=(s*31+seed.charCodeAt(i))>>>0;const r=a.slice();for(let i=r.length-1;i>0;i--){s=(1103515245*s+12345)%0x80000000;const j=s%(i+1);[r[i],r[j]]=[r[j],r[i]]}return r;}
const NAME_OK=/[^\/"'`]+\.(webp|jpe?g|png|gif)$/i;

function ensureCss(){
  if(!document.getElementById('css-premium')){
    const l=document.createElement('link'); l.id='css-premium'; l.rel='stylesheet'; l.href='/css/premium.css?v=1';
    document.head.appendChild(l);
  }
}
function ensureAds(){
  const mk=(id,cls)=>{let el=document.getElementById(id);if(!el){el=document.createElement('div');el.id=id;el.className=cls;document.body.appendChild(el);}return el;};
  mk('ad-left','side-ad left'); mk('ad-right','side-ad right');
}

function collectStringsDeep(x,out){
  if(!x) return;
  const t=typeof x;
  if(t==='string'){ out.push(x); return; }
  if(Array.isArray(x)){ for(const v of x) collectStringsDeep(v,out); return; }
  if(t==='object'){ for(const k in x) collectStringsDeep(x[k],out); }
}

function harvestNamesFrom(obj){
  if(!obj || typeof obj!=='object') return [];
  const buf=[]; collectStringsDeep(obj, buf);

  // convertir posibles rutas completas a nombres de archivo
  const names = buf.map(s=>{
    try{
      const u = s.split('?')[0];
      const parts = u.split('/');
      const last = parts[parts.length-1] || '';
      return NAME_OK.test(last) ? last : null;
    }catch{ return null; }
  }).filter(Boolean);

  // limpiar duplicados y “copias” con paréntesis
  const norm = names.map(n=>n.replace(/\s*\(c[oò]pia\)\s*/i,''));
  return Array.from(new Set(norm));
}

function getNamesFromGlobals(){
  const pools=[];
  if(window.ContentData3) pools.push(harvestNamesFrom(window.ContentData3));
  if(window.ContentData4) pools.push(harvestNamesFrom(window.ContentData4));
  if(window.UnifiedContentAPI) pools.push(harvestNamesFrom(window.UnifiedContentAPI));
  if(window.ContentAPI) pools.push(harvestNamesFrom(window.ContentAPI));
  if(window.ContentSystemManager) pools.push(harvestNamesFrom(window.ContentSystemManager));
  const names = Array.from(new Set(pools.flat().filter(n=>NAME_OK.test(n))));
  console.log('[IBG] premium names:', names.length);
  return names;
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
    img.addEventListener('error', ()=>{ console.error('[IBG] IMG ERROR', u); card.classList.add('img-error'); 
      const b=document.createElement('div'); b.className='badge-err'; b.textContent='ERROR'; card.appendChild(b);
    });
    card.appendChild(img);

    if(newSet.has(u)){ const b=document.createElement('div'); b.className='badge-new'; b.textContent='Nuevo'; card.appendChild(b); }

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
}

export async function initPremium(){
  ensureCss(); ensureAds();

  const names = getNamesFromGlobals();        // ← solo nombres “.webp”
  const base  = '/uncensored/';               // ← carpeta ya en repo y GitHub
  const urls  = names.map(n => base + n);

  console.log('[IBG] premium URLs (first 5):', urls.slice(0,5));
  if(!urls.length){
    const app=document.getElementById('app')||document.body;
    let sec=document.getElementById('premiumSection'); if(!sec){ sec=document.createElement('section'); sec.id='premiumSection'; app.appendChild(sec); }
    sec.innerHTML='<h1>Premium</h1><div style="opacity:.8">No pude localizar nombres .webp en ContentData3/4.</div>';
    return;
  }
  renderGrid(urls);
}
