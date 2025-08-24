/* Premium: exporta initPremium; une base '/uncensored/' + nombres .webp y acepta URLs completas. */
const IMG_EXT = /\.(webp|jpe?g|png|gif)(\?.*)?$/i;
const BASE_KEYS = ['base','path','dir','folder','root'];
const LIST_KEYS = ['images','files','items','list','gallery','pool','data','array','uncensored','premium'];

function daySeed(){const d=new Date();return `${d.getUTCFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()}`;}
function seededShuffle(a,seed){let s=0;for(let i=0;i<seed.length;i++)s=(s*31+seed.charCodeAt(i))>>>0;const r=a.slice();for(let i=r.length-1;i>0;i--){s=(1103515245*s+12345)%0x80000000;const j=s%(i+1);[r[i],r[j]]=[r[j],r[i]]}return r;}
function uniq(a){return Array.from(new Set(a));}

function normBase(b){
  if(!b) return '';
  let x=String(b).replace(/\\/g,'/').trim();
  if(!/uncensored/i.test(x)) return '';
  if(!/^https?:\/\//i.test(x) && x[0] !== '/') x='/'+x;
  if(!x.endsWith('/')) x+='/';
  return x;
}
function toUrl(base, name){
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
        const p = x.src||x.file||x.name||x.image||x.url||x.path||x.thumb||x.cover||x.banner;
        if(typeof p==='string' && IMG_EXT.test(p)) out.push(p);
      }
    });
  }
  return out;
}

/* ——— recolector por objeto: detecta bases + listas y compone URLs ——— */
function harvestFromObject(obj){
  if(!obj || typeof obj!=='object') return [];
  const hits = new Set();

  // 1) strings sueltas con /uncensored/
  try{
    for(const k in obj){
      const v=obj[k];
      if(typeof v==='string' && v.includes('/uncensored/') && IMG_EXT.test(v)) hits.add(v);
    }
  }catch(_){}

  // 2) detectar bases en este objeto y sub-objetos inmediatos
  const bases = [];
  try{
    for(const k of BASE_KEYS){
      const v=obj[k];
      if(typeof v==='string'){ const nb=normBase(v); if(nb) bases.push(nb); }
    }
    if(!bases.length){
      for(const k in obj){
        const v=obj[k];
        if(v && typeof v==='object'){
          for(const kk of BASE_KEYS){
            const vv=v[kk];
            if(typeof vv==='string'){ const nb=normBase(vv); if(nb) bases.push(nb); }
          }
        }
      }
    }
  }catch(_){}

  // 3) nombres de imagen en listas típicas en este objeto
  try{
    for(const key of LIST_KEYS){
      const lst=obj[key];
      const names=collectNames(lst);
      if(names.length){
        const base = bases.find(b=>/\/uncensored\/$/i.test(b)) || bases[0] || '/uncensored/';
        names.forEach(n=>{
          const u = (typeof n==='string' && (n.includes('/uncensored/')||n.startsWith('/')||/^https?:\/\//i.test(n))) ? n : toUrl(base, n);
          if(IMG_EXT.test(u) && /\/uncensored\//i.test(u)) hits.add(u);
        });
      }
    }
  }catch(_){}

  // 4) sub-objeto clásico { base:'/uncensored/', images:[...] }
  try{
    for(const k in obj){
      const v=obj[k];
      if(v && typeof v==='object'){
        let subBase='';
        for(const bk of BASE_KEYS){ const vb=v[bk]; if(typeof vb==='string'){ const nb=normBase(vb); if(nb){ subBase=nb; break; } } }
        if(subBase){
          for(const lk of LIST_KEYS){
            const lst=v[lk];
            const names=collectNames(lst);
            names.forEach(n=>{
              const u = (typeof n==='string' && (n.includes('/uncensored/')||n.startsWith('/')||/^https?:\/\//i.test(n))) ? n : toUrl(subBase, n);
              if(IMG_EXT.test(u) && /\/uncensored\//i.test(u)) hits.add(u);
            });
          }
        }
      }
    }
  }catch(_){}

  return Array.from(hits);
}

/* ——— CRAWL amplio: window + semillas conocidas (limitado) ——— */
function collectPremiumPool(limitNodes=60000, limitHits=8000){
  const q=[]; const seen=new WeakSet(); const out=new Set();

  function enqueue(v){ if(!v) return; const t=typeof v; if(t!=='object'&&t!=='function') return; try{ if(seen.has(v)) return; seen.add(v); q.push(v);}catch(_){ } }

  // semillas obvias
  enqueue(window.UnifiedContentAPI);
  enqueue(window.ContentAPI);
  enqueue(window.ContentSystemManager);
  enqueue(window.ContentData3);
  enqueue(window.ContentData4);
  enqueue(window);

  let steps=0;
  while(q.length && steps<limitNodes && out.size<limitHits){
    const cur=q.shift(); steps++;

    // cosecha directa del nodo
    try{
      // strings directas en cur
      if(typeof cur==='string'){
        if(cur.includes('/uncensored/') && IMG_EXT.test(cur)) out.add(cur);
      } else {
        harvestFromObject(cur).forEach(u=>out.add(u));
      }
    }catch(_){}

    // expandir
    try{
      if(Array.isArray(cur)){ cur.forEach(enqueue); }
      else if(cur && typeof cur==='object'){ for(const k in cur){ enqueue(cur[k]); } }
    }catch(_){}
  }

  const arr = Array.from(out).filter(Boolean);
  console.log('[IBG] premium pool size:', arr.length);
  if(arr.length) console.log('[IBG] sample premium URLs:', arr.slice(0,5));
  return arr;
}

/* ——— UI ——— */
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
    img.addEventListener('error', ()=>{ 
      console.error('[IBG] IMG ERROR', u); 
      card.classList.add('img-error'); 
      const badge=document.createElement('div'); badge.className='badge-err'; badge.textContent='ERROR';
      card.appendChild(badge);
    });
    card.addEventListener('load', ()=>{ /* opcional: medir tiempo de carga */ });
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
  const pool = collectPremiumPool();
  if(!pool.length){
    const app=document.getElementById('app')||document.body;
    let sec=document.getElementById('premiumSection'); if(!sec){ sec=document.createElement('section'); sec.id='premiumSection'; app.appendChild(sec); }
    sec.innerHTML='<h1>Premium</h1><div style="opacity:.8">No pude construir rutas desde ContentData3/4. Revisa que haya base "/uncensored/" y nombres .webp.</div>';
    return;
  }
  renderGrid(pool);
}
