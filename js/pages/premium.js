/* Premium: exporta initPremium. 
   - Recolecta posibles URLs (como antes).
   - Valida por HEAD (concurrencia limitada) y sólo usa las que existen (200 OK).
   - Pinta 100 thumbs blurred con 30% "Nuevo".
   - Sin backticks para evitar errores en prod.
*/
var IMG_NAME = /(^|[^\w\/-])([^\/"'`]+?\.(webp|jpe?g|png|gif))(\\?.*)?$/i;
var IMG_URL  = /\/uncensored\/[^"'`]+?\.(webp|jpe?g|png|gif)(\?.*)?$/i;
var BASE_KEYS = ['base','path','dir','folder','root'];

function daySeed(){var d=new Date();return d.getUTCFullYear()+'-'+(d.getUTCMonth()+1)+'-'+d.getUTCDate();}
function seededShuffle(a,seed){
  var s=0; for(var i=0;i<seed.length;i++){ s=(s*31+seed.charCodeAt(i))>>>0; }
  var r=a.slice(); for(var j=r.length-1;j>0;j--){ s=(1103515245*s+12345)%0x80000000; var k=s%(j+1); var t=r[j]; r[j]=r[k]; r[k]=t; }
  return r;
}
function uniq(arr){ return Array.from(new Set(arr)); }

function normBase(b){
  if(!b) return '';
  var x=String(b).replace(/\\/g,'/').trim();
  if(!/uncensored/i.test(x)) return '';
  if(!/^https?:\/\//i.test(x) && x[0] !== '/') x='/'+x;
  if(!x.endsWith('/')) x+='/';
  return x;
}
function encodePath(p){
  if(/^https?:\/\//i.test(p)) return p;
  return p.split('/').map(function(seg){ return seg ? encodeURIComponent(seg) : seg; }).join('/');
}
function joinBaseName(base, name){
  if(!name) return '';
  var s=String(name).trim();
  if(/^https?:\/\//i.test(s) || s.startsWith('/')) return s;
  var b=normBase(base)||'/uncensored/';
  return encodePath(b + s.replace(/^\.?\/*/,''));
}

/* ===== Recolector (global + scraping de content-data3/4) ===== */
function collectFromValue(v, out, currentBase){
  if(typeof v==='string'){
    if(IMG_URL.test(v)) out.push(v);
    else {
      var m = v.match(/([^\/"'`]+?\.(webp|jpe?g|png|gif))(\\?.*)?$/i);
      if(m) out.push(joinBaseName(currentBase, m[1]));
    }
    return;
  }
  if(Array.isArray(v)){
    for(var i=0;i<v.length;i++){
      var x=v[i];
      if(typeof x==='string'){
        if(IMG_URL.test(x)) out.push(x);
        else {
          var m2 = x.match(/([^\/"'`]+?\.(webp|jpe?g|png|gif))(\\?.*)?$/i);
          if(m2) out.push(joinBaseName(currentBase, m2[1]));
        }
      }else if(x && typeof x==='object'){
        var p = x.src||x.file||x.name||x.image||x.url||x.path||x.thumb||x.cover||x.banner;
        if(typeof p==='string'){
          if(IMG_URL.test(p)) out.push(p);
          else {
            var m3 = p.match(/([^\/"'`]+?\.(webp|jpe?g|png|gif))(\\?.*)?$/i);
            if(m3) out.push(joinBaseName(currentBase, m3[1]));
          }
        }
      }
    }
    return;
  }
}
function walk(obj, inheritedBase, out, seen, budget){
  if(!obj || (typeof obj!=='object' && typeof obj!=='function')) return;
  if(seen.has(obj)) return; seen.add(obj);
  if(budget.count++ > budget.max) return;

  var localBase = inheritedBase;
  for(var bi=0; bi<BASE_KEYS.length; bi++){
    try{
      var val = obj[BASE_KEYS[bi]];
      if(typeof val==='string'){
        var nb=normBase(val);
        if(nb){ localBase=nb; break; }
      }
    }catch(e){}
  }
  try{
    for(var k in obj){
      var v = obj[k];
      collectFromValue(v, out, localBase);
      if(v && (typeof v==='object' || typeof v==='function')){
        walk(v, localBase, out, seen, budget);
      }
    }
  }catch(e){}
}
function collectPremiumPoolGlobal(){
  var out=[]; var seen=new WeakSet(); var budget={max:60000,count:0};
  walk(window.ContentData3, null, out, seen, budget);
  walk(window.ContentData4, null, out, seen, budget);
  walk(window.UnifiedContentAPI, null, out, seen, budget);
  walk(window.ContentAPI, null, out, seen, budget);
  walk(window.ContentSystemManager, null, out, seen, budget);
  if(out.length < 20){ walk(window, null, out, seen, budget); }
  return uniq(out.filter(function(u){ return typeof u==='string' && IMG_URL.test(u); }));
}
function parseNamesFromJsText(txt){
  var rx = /["']([^"']+?\.webp)["']/gi, m, names=[];
  while((m = rx.exec(txt))){
    var s = m[1];
    if(/uncensored-videos/i.test(s)) continue;
    if(/\/full\//i.test(s)) continue;
    if(/decorative-images/i.test(s)) continue;
    names.push(s);
  }
  return uniq(names);
}
function toUncensoredUrl(name){
  if(!name) return '';
  if(/^https?:\/\//i.test(name) || name.startsWith('/')) return name;
  return encodePath('/uncensored/' + name.replace(/^\.?\/*/,''));
}
async function scrapeFromSources(){
  var urls=[];
  try{
    var a = await fetch('/content-data3.js', {cache:'no-store'}).then(function(r){return r.text();});
    var b = await fetch('/content-data4.js', {cache:'no-store'}).then(function(r){return r.text();});
    var n1 = parseNamesFromJsText(a);
    var n2 = parseNamesFromJsText(b);
    var all = uniq(n1.concat(n2));
    for(var i=0;i<all.length;i++){
      var s = all[i];
      if(IMG_URL.test(s)) urls.push(s);
      else urls.push(toUncensoredUrl(s));
    }
  }catch(e){
    console.error('[IBG] scrape error:', e);
  }
  urls = uniq(urls.filter(function(u){ return IMG_URL.test(u); }));
  console.log('[IBG] premium SCRAPE size:', urls.length);
  if(urls.length) console.log('[IBG] premium SCRAPE sample:', urls.slice(0,5));
  return urls;
}

/* ===== Validación HEAD (concurrencia) ===== */
async function filterExisting(urls, need, concurrency){
  var ok=[], i=0;
  urls = urls.slice(0, Math.max(need*8, 400)); // no revisar los 600+, con 400-800 sobra
  concurrency = concurrency||12;
  async function probe(u){
    try{
      var res = await fetch(u, { method:'HEAD', cache:'no-store' });
      if(res && (res.status===200 || res.ok)) ok.push(u);
    }catch(e){ /* ignore */ }
  }
  var running=[];
  while(i<urls.length && ok.length<need){
    while(running.length<concurrency && i<urls.length){
      var p = probe(urls[i++]); 
      running.push(p);
    }
    await Promise.race(running).catch(function(){});
    running = running.filter(function(pr){ return pr && pr.pending; });
  }
  // Espera a todo lo lanzado
  await Promise.allSettled(running);
  return ok.slice(0, need);
}

/* ===== UI ===== */
function ensureCss(){
  if(!document.getElementById('css-premium')){
    var l=document.createElement('link'); l.id='css-premium'; l.rel='stylesheet'; l.href='/css/premium.css';
    document.head.appendChild(l);
  }
}
function ensureAds(){
  function ensure(id,cls){ var el=document.getElementById(id); if(!el){ el=document.createElement('div'); el.id=id; el.className=cls; document.body.appendChild(el);} return el; }
  ensure('ad-left','side-ad left'); ensure('ad-right','side-ad right');
}
function renderGrid(urls){
  var app=document.getElementById('app')||document.body;
  var sec=document.getElementById('premiumSection'); if(!sec){ sec=document.createElement('section'); sec.id='premiumSection'; app.appendChild(sec); }
  sec.innerHTML='';
  var h=document.createElement('h1'); h.textContent='Premium'; sec.appendChild(h);
  var grid=document.createElement('div'); grid.id='premiumGrid'; grid.className='premium-grid'; sec.appendChild(grid);

  var total=Math.min(urls.length,100);
  var picks=seededShuffle(urls, daySeed()).slice(0,total);
  var markNew=Math.max(1, Math.floor(total*0.30));
  var newSet=new Set(picks.slice(0,markNew));

  var frag=document.createDocumentFragment();
  for(var i=0;i<picks.length;i++){
    var u=picks[i];
    var card=document.createElement('div'); card.className='p-card locked'; card.dataset.url=u;

    var img=document.createElement('img'); img.loading='lazy'; img.decoding='async'; img.src=u; img.alt='Premium '+(i+1);
    img.addEventListener('error', (function(url,cardEl){
      return function(){
        console.error('[IBG] IMG ERROR', url);
        cardEl.classList.add('img-error'); 
        var badge=document.createElement('div'); badge.className='badge-err'; badge.textContent='ERROR';
        cardEl.appendChild(badge);
      };
    })(u,card));
    card.appendChild(img);

    if(newSet.has(u)){ var badge=document.createElement('div'); badge.className='badge-new'; badge.textContent='Nuevo'; card.appendChild(badge); }

    var overlay=document.createElement('div'); overlay.className='overlay';
    var prices=document.createElement('div'); prices.className='prices';
    var tag1=document.createElement('span'); tag1.className='tag'; tag1.textContent='€0.10';
    var tag2=document.createElement('span'); tag2.className='tag bundle'; tag2.textContent='10 por €0.80';
    prices.appendChild(tag1); prices.appendChild(tag2);

    var btns=document.createElement('div'); btns.className='btns';
    var buy=document.createElement('button'); buy.className='buy'; buy.type='button'; buy.textContent='Comprar';
    btns.appendChild(buy);

    var tiny=document.createElement('div'); tiny.className='tiny'; tiny.textContent='o suscríbete: 14,99€/mes · 49,99€/año';

    overlay.appendChild(prices); overlay.appendChild(btns); overlay.appendChild(tiny);
    card.appendChild(overlay);

    frag.appendChild(card);
  }
  grid.appendChild(frag);

  grid.addEventListener('click', function(e){
    var btn=e.target.closest && e.target.closest('button.buy'); if(!btn) return;
    var card=e.target.closest('.p-card'); if(!card) return;

    if(localStorage.getItem('ibg_subscribed')==='1'){ card.classList.remove('locked'); card.classList.add('unlocked'); return; }

    var credits=parseInt(localStorage.getItem('ibg_credits')||'0',10)||0;
    if(credits>0){ localStorage.setItem('ibg_credits', String(credits-1)); card.classList.remove('locked'); card.classList.add('unlocked'); return; }

    if(window.IBGPay && typeof window.IBGPay.pay==='function'){
      window.IBGPay.pay(0.10, function(){ card.classList.remove('locked'); card.classList.add('unlocked'); });
    }else if(window.IBGPayPal && typeof window.IBGPayPal.mountPayPerItem==='function'){
      var holder=document.createElement('div'); holder.className='pp-holder'; btn.replaceWith(holder);
      window.IBGPayPal.mountPayPerItem(holder, {
        description:'Foto premium', value:'0.10', sku:'photo:'+card.dataset.url,
        onApprove:function(){ card.classList.remove('locked'); card.classList.add('unlocked'); }
      });
    }else{
      alert('PayPal no disponible ahora mismo.');
    }
  }, false);
}

async function buildPool(){
  // 1) candidatos desde objetos globales
  var fromGlobal = collectPremiumPoolGlobal();
  console.log('[IBG] premium candidates (global):', fromGlobal.length);

  // 2) si pocos, añade scraping
  var candidates = fromGlobal.slice(0);
  if(candidates.length < 200){
    try{
      var scraped = await scrapeFromSources();
      candidates = uniq(candidates.concat(scraped));
    }catch(e){ console.error('[IBG] scraping fallback err', e); }
  }
  // Limpia duplicados y cosas raras
  candidates = uniq(candidates.filter(function(u){ return IMG_URL.test(u); }));

  // 3) valida por HEAD hasta obtener >=120 (usaremos 100)
  var existing = await filterExisting(candidates, 120, 12);
  console.log('[IBG] premium existing (HEAD 200):', existing.length);
  return existing;
}

export async function initPremium(){
  ensureCss();
  ensureAds();

  try{
    var pool = await buildPool();
    if(!pool || !pool.length){
      var app=document.getElementById('app')||document.body;
      var sec=document.getElementById('premiumSection'); if(!sec){ sec=document.createElement('section'); sec.id='premiumSection'; app.appendChild(sec); }
      sec.innerHTML='<h1>Premium</h1><div style="opacity:.8">No he localizado thumbs existentes en /uncensored/. Comprueba que los .webp estén subidos al hosting.</div>';
      return;
    }
    renderGrid(pool);
  }catch(e){
    console.error('[IBG] initPremium error', e);
  }
}

// Autorrun opcional
if (document.currentScript && document.currentScript.dataset.autorun === '1') {
  document.addEventListener('DOMContentLoaded', function(){ initPremium(); });
}
