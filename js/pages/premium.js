/* Premium grid robusto:
   - Corrige concurrencia en verificación.
   - Autodetecta base real para nombres premium usando scraping de content-data3/4.
   - Fallback a /full/ (blurred) si no hay premium servibles.
*/
var IMG_URL  = /\/uncensored\/[^"'`]+?\.(webp|jpe?g|png|gif)(\?.*)?$/i;

function daySeed(){var d=new Date();return d.getUTCFullYear()+"-"+(d.getUTCMonth()+1)+"-"+d.getUTCDate();}
function seededShuffle(a,s){var h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;var r=a.slice();for(var j=r.length-1;j>0;j--){h=(1103515245*h+12345)%0x80000000;var k=h%(j+1);var t=r[j];r[j]=r[k];r[k]=t;}return r;}
function uniq(a){return Array.from(new Set(a));}
function encSegs(p){return p.split('/').map(function(s){return s?encodeURIComponent(s):s;}).join('/');}
function normBase(b){if(!b)return'';var x=String(b).replace(/\\/g,'/').trim();if(!/^https?:\/\//i.test(x)&&x[0]!=='/')x='/'+x;if(!x.endsWith('/'))x+='/';return x;}

function ensureCss(){
  if(!document.getElementById('css-premium')){
    var l=document.createElement('link');l.id='css-premium';l.rel='stylesheet';l.href='/css/premium.css';document.head.appendChild(l);
  }
  // Asegura blur aunque falte la hoja
  var id='css-premium-inline';
  if(!document.getElementById(id)){
    var s=document.createElement('style'); s.id=id;
    s.textContent='.p-card.locked img{filter:blur(16px) saturate(.7) brightness(.9);transform:scale(1.02);}';
    document.head.appendChild(s);
  }
}
function ensureAds(){['ad-left','ad-right'].forEach(function(id){if(!document.getElementById(id)){var d=document.createElement('div');d.id=id;d.className='side-ad '+(id==='ad-left'?'left':'right');document.body.appendChild(d);}});}

function renderGrid(urls, opts){
  opts = opts||{};
  var app=document.getElementById('app')||document.body;
  var sec=document.getElementById('premiumSection'); if(!sec){ sec=document.createElement('section'); sec.id='premiumSection'; app.appendChild(sec);}
  sec.innerHTML='';
  var h=document.createElement('h1'); h.textContent='Premium'+(opts.preview?' (vista previa)':''); sec.appendChild(h);
  var grid=document.createElement('div'); grid.id='premiumGrid'; grid.className='premium-grid'; sec.appendChild(grid);

  var picks=seededShuffle(urls, daySeed()).slice(0, Math.min(urls.length, 100));
  var markNew=Math.max(1, Math.floor(picks.length*0.30));
  var newSet=new Set(picks.slice(0,markNew));

  var frag=document.createDocumentFragment();
  picks.forEach(function(u,i){
    var card=document.createElement('div'); card.className='p-card locked'; card.dataset.url=u;
    var img=document.createElement('img'); img.loading='lazy'; img.decoding='async'; img.src=u; img.alt='Premium '+(i+1);
    img.addEventListener('error', function(){ card.classList.add('img-error'); });
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
  });
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

/* ---------- Scraping de nombres desde content-data3/4 ---------- */
function parseNamesFromJsText(txt){
  var rx = /["']([^"']+?\.(?:webp|jpe?g|png|gif))["']/gi, m, names=[];
  while((m = rx.exec(txt))){
    var s = m[1];
    if(/uncensored-videos/i.test(s)) continue;
    if(/\/full\//i.test(s)) continue;
    s = s.split('/').pop(); // nos quedamos con el nombre
    names.push(s);
  }
  return uniq(names);
}
async function scrapeNames(){
  try{
    var a = await fetch('/content-data3.js', {cache:'no-store'}).then(function(r){return r.text();});
    var b = await fetch('/content-data4.js', {cache:'no-store'}).then(function(r){return r.text();});
    var n = uniq(parseNamesFromJsText(a).concat(parseNamesFromJsText(b)));
    console.log('[IBG] premium NOMBRES obtenidos:', n.length, n.slice(0,5));
    return n;
  }catch(e){ console.warn('[IBG] no pude scrapear nombres premium', e); return []; }
}

/* ---------- Probing robusto (HEAD -> GET range) ---------- */
async function probeUrl(u){
  try{
    var res = await fetch(u, { method:'HEAD', cache:'no-store' });
    if(res && (res.status===200 || res.ok)) return true;
  }catch(e){}
  try{
    var res2 = await fetch(u, { method:'GET', headers:{'Range':'bytes=0-0','Cache-Control':'no-store'} });
    if(res2 && (res2.status===200 || res2.status===206 || res2.ok)) return true;
  }catch(e){}
  return false;
}

/* ---------- Filtro con concurrencia correcta ---------- */
async function filterExisting(urls, need, concurrency){
  urls = uniq(urls);
  need = need||120;
  concurrency = Math.max(4, Math.min(concurrency||12, 24));
  var ok=[]; var i=0;
  async function worker(){
    while(i<urls.length && ok.length<need){
      var idx = i++; var u = urls[idx];
      if(await probeUrl(u)) ok.push(u);
    }
  }
  var workers=[]; var w = Math.min(concurrency, urls.length||1);
  for(var k=0;k<w;k++) workers.push(worker());
  await Promise.all(workers);
  return ok.slice(0, need);
}

/* ---------- Descubrimiento de base real ---------- */
async function discoverBase(names){
  if(!names || !names.length) return null;
  var bases = ['/uncensored/','/premium/','/content/uncensored/','/assets/uncensored/','/images/uncensored/','/img/uncensored/','/media/uncensored/','/storage/uncensored/','/'];
  names = names.slice(0, Math.min(names.length, 20));
  for(var b=0;b<bases.length;b++){
    var base = normBase(bases[b]);
    var tests = 0, hits = 0;
    for(var i=0;i<names.length && tests<8;i++){
      var u = base==='/' ? '/'+names[i] : base + names[i];
      u = encSegs(u.replace(/^\/+/,'/'));
      tests++;
      if(await probeUrl(u)) hits++;
      if(hits>=3) { console.log('[IBG] base detectada:', base); return base; }
    }
  }
  return null;
}

/* ---------- Recolector global (puede traer URLs completas) ---------- */
function collectPremiumPoolGlobal(){
  var out=[];
  function pushIf(u){ if(typeof u==='string' && IMG_URL.test(u)) out.push(u); }
  function scan(obj, seen, budget){
    if(!obj || (typeof obj!=='object' && typeof obj!=='function')) return;
    if(seen.has(obj)) return; seen.add(obj);
    if(budget.count++ > budget.max) return;
    try{
      Object.keys(obj).forEach(function(k){
        var v=obj[k];
        if(typeof v==='string') pushIf(v);
        else if(Array.isArray(v)) v.forEach(function(x){ if(typeof x==='string') pushIf(x); });
        else if(v && (typeof v==='object' || typeof v==='function')) scan(v, seen, budget);
      });
    }catch(e){}
  }
  var seen=new WeakSet(); var budget={max:50000,count:0};
  ['ContentData3','ContentData4','UnifiedContentAPI','ContentAPI','ContentSystemManager'].forEach(function(key){
    try{ scan(window[key], seen, budget); }catch(e){}
  });
  return uniq(out);
}

/* ---------- Fallback desde /full/ (si no hay premium) ---------- */
async function collectFallbackFromFull(){
  try{
    var t = await fetch('/content-data2.js', {cache:'no-store'}).then(function(r){return r.text();});
    var rx = /["'](\/full\/[^"']+?\.(?:webp|jpe?g|png|gif))["']/gi, m, urls=[];
    while((m=rx.exec(t))){ urls.push(m[1]); }
    urls = uniq(urls);
    console.warn('[IBG] FALLBACK usando /full/:', urls.length, urls.slice(0,5));
    return urls;
  }catch(e){ console.warn('[IBG] fallback /full/ falló', e); return []; }
}

/* ---------- Flujo principal ---------- */
export async function initPremium(){
  ensureCss();
  ensureAds();

  try{
    // 1) URLs completas detectadas (si existiera el prefijo correcto ya en datos)
    var fromGlobal = collectPremiumPoolGlobal();
    console.log('[IBG] premium candidates (global):', fromGlobal.length);

    // 2) Nombres desde los content-data (para poder probar bases alternativas)
    var names = await scrapeNames();

    // 3) Si no hay URLs válidas o todas 404, intentamos descubrir base real
    var candidates = fromGlobal.slice(0);
    var base = await discoverBase(names);
    if(base){
      var fromNames = names.map(function(n){
        var u = (base==='/'?'/':'') + n.replace(/^\.?\/*/,'');
        return encSegs((base==='/'?u:(base+n)).replace(/^\/+/,'/'));
      });
      candidates = uniq(candidates.concat(fromNames));
    }

    // 4) Verificamos cuáles existen; si 0, vamos a fallback /full/
    var existing = await filterExisting(candidates, 120, 14);
    console.log('[IBG] premium existing (OK):', existing.length);

    if(existing.length>0){
      renderGrid(existing, {preview:false});
      return;
    }

    // FALLBACK: /full/ blurred (para no dejar la UI vacía)
    var fallback = await collectFallbackFromFull();
    if(fallback.length>0){
      renderGrid(fallback, {preview:true});
      return;
    }

    // Nada de nada
    var app=document.getElementById('app')||document.body;
    var sec=document.getElementById('premiumSection'); if(!sec){ sec=document.createElement('section'); sec.id='premiumSection'; app.appendChild(sec); }
    sec.innerHTML='<h1>Premium</h1><div style="opacity:.8">No he localizado thumbs servibles. Sube los .webp premium o confirma la ruta base.</div>';
  }catch(e){
    console.error('[IBG] initPremium error', e);
  }
}

// Autorun si viene con data-autorun="1"
if (document.currentScript && document.currentScript.dataset.autorun === '1') {
  document.addEventListener('DOMContentLoaded', function(){ initPremium(); });
}
