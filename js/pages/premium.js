/* Premium: exporta initPremium. Rastrea el árbol (window, ContentData3/4, UnifiedContentAPI…)
   heredando la base '/uncensored/' cuando la detecta y componiendo automáticamente base+nombre.webp.
   Además, codifica los segmentos del path para soportar tildes/espacios. */
const IMG_NAME = /^[^\/"'`]+?\.(webp|jpe?g|png|gif)(\?.*)?$/i;
const IMG_URL  = /\/uncensored\/[^"'`]+?\.(webp|jpe?g|png|gif)(\?.*)?$/i;
const BASE_KEYS = ['base','path','dir','folder','root'];

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
function encodePath(p){
  // Codifica cada segmento para soportar espacios/tildes, sin tocar '/' ni 'http(s)'
  if(/^https?:\/\//i.test(p)) return p;
  const parts=p.split('/').map(seg => seg ? encodeURIComponent(seg) : seg);
  return parts.join('/');
}
function joinBaseName(base, name){
  if(!name) return '';
  const s=String(name).trim();
  if(/^https?:\/\//i.test(s) || s.startsWith('/')) return s;
  const b=normBase(base)||'/uncensored/';
  return encodePath(b + s.replace(/^\.?\/*/,''));
}

function collectFromValue(v, out, currentBase){
  // Strings completas ya con /uncensored/
  if(typeof v==='string'){
    if(IMG_URL.test(v)) out.push(v);
    else if(IMG_NAME.test(v)){ out.push(joinBaseName(currentBase, v)); }
    return;
  }
  // Arrays: nombres o URLs
  if(Array.isArray(v)){
    let hasAny=false;
    for(const x of v){
      if(typeof x==='string'){
        if(IMG_URL.test(x)){ out.push(x); hasAny=true; }
        else if(IMG_NAME.test(x)){ out.push(joinBaseName(currentBase, x)); hasAny=true; }
      }else if(x && typeof x==='object'){
        // Objetos con campo src/file/name/…
        const p = x.src||x.file||x.name||x.image||x.url||x.path||x.thumb||x.cover||x.banner;
        if(typeof p==='string'){
          if(IMG_URL.test(p)) { out.push(p); hasAny=true; }
          else if(IMG_NAME.test(p)) { out.push(joinBaseName(currentBase, p)); hasAny=true; }
        }
      }
    }
    // si es array pero no tenía nombres/urls, no hacemos nada
    return;
  }
  // Otros tipos: nada
}

function walk(obj, inheritedBase, out, seen, budget){
  if(!obj || typeof obj!=='object' && typeof obj!=='function') return;
  if(seen.has(obj)) return; seen.add(obj);
  if(budget.count++ > budget.max) return;

  // Detecta base local
  let localBase = inheritedBase;
  for(const k of BASE_KEYS){
    try{
      const val = obj[k];
      if(typeof val==='string'){
        const nb=normBase(val);
        if(nb){ localBase = nb; break; }
      }
    }catch(_){}
  }

  // Cosecha valores “hoja” comunes
  try{
    for(const k in obj){
      const v = obj[k];
      // Primero intenta recoger desde el valor actual con la base heredada/local
      collectFromValue(v, out, localBase);

      // Y si es navegable, sigue caminando heredando la base
      if(v && (typeof v==='object' || typeof v==='function')){
        walk(v, localBase, out, seen, budget);
      }
    }
  }catch(_){}
}

function collectPremiumPool(){
  const out=[]; const seen=new WeakSet();
  const budget={max:60000, count:0};

  // Semillas principales
  walk(window.ContentData3, null, out, seen, budget);
  walk(window.ContentData4, null, out, seen, budget);
  walk(window.UnifiedContentAPI, null, out, seen, budget);
  walk(window.ContentAPI, null, out, seen, budget);
  walk(window.ContentSystemManager, null, out, seen, budget);

  // Último recurso: ventana completa (limitado)
  if(out.length < 20){
    walk(window, null, out, seen, budget);
  }

  const pooled = uniq(out.filter(u=>typeof u==='string' && IMG_URL.test(u)));
  console.log('[IBG] premium pool size:', pooled.length);
  if(pooled.length) console.log('[IBG] sample premium URLs:', pooled.slice(0,5));
  return pooled;
}

/* ===== UI ===== */
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

    const img=document.createElement('img'); img.loading='lazy'; img.decoding='async'; img.src=u; img.alt=\`Premium \${i+1}\`;
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
        description:'Foto premium', value:'0.10', sku:\`photo:\${card.dataset.url}\`,
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
    sec.innerHTML='<h1>Premium</h1><div style="opacity:.8">No pude construir rutas /uncensored/*.webp. Revisa content-data3/4 o permisos de estáticos.</div>';
    return;
  }
  renderGrid(pool);
}

// Autorrun de cortesía si se carga directo
if (document.currentScript && document.currentScript.dataset.autorun === '1') {
  document.addEventListener('DOMContentLoaded', ()=>initPremium());
}
