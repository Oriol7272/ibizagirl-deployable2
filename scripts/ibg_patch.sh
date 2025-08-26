#!/usr/bin/env bash
set -euo pipefail

# carpetas
mkdir -p tools js js/pages css

# --- 1) Genera env.js con los NOMBRES EXACTOS de Vercel ---
cat > tools/build-env.sh <<'EOT'
#!/usr/bin/env bash
set -euo pipefail
PAYPAL_CLIENT_ID="${PAYPAL_CLIENT_ID:-}"
PAYPAL_SECRET="${PAYPAL_SECRET:-}"
PAYPAL_PLAN_MONTHLY_1499="${PAYPAL_PLAN_MONTHLY_1499:-}"
PAYPAL_PLAN_ANNUAL_4999="${PAYPAL_PLAN_ANNUAL_4999:-}"
PAYPAL_WEBHOOK_ID="${PAYPAL_WEBHOOK_ID:-}"
CRISP_WEBSITE_ID="${CRISP_WEBSITE_ID:-}"
EXOCLICK_ZONE="${EXOCLICK_ZONE:-}"
JUICYADS_ZONE="${JUICYADS_ZONE:-}"
EROADVERTISING_ZONE="${EROADVERTISING_ZONE:-}"
EXOCLICK_SNIPPET_B64="${EXOCLICK_SNIPPET_B64:-}"
JUICYADS_SNIPPET_B64="${JUICYADS_SNIPPET_B64:-}"
EROADVERTISING_SNIPPET_B64="${EROADVERTISING_SNIPPET_B64:-}"
POPADS_SITE_ID="${POPADS_SITE_ID:-}"
POPADS_ENABLE="${POPADS_ENABLE:-0}"
IBG_ASSETS_BASE_URL="${IBG_ASSETS_BASE_URL:-}"
CURRENCY="EUR"
cat > env.js <<EOJS
window.IBG = {
  PAYPAL_CLIENT_ID: "${PAYPAL_CLIENT_ID}",
  PAYPAL_SECRET: "${PAYPAL_SECRET}",
  PAYPAL_PLAN_MONTHLY_1499: "${PAYPAL_PLAN_MONTHLY_1499}",
  PAYPAL_PLAN_ANNUAL_4999: "${PAYPAL_PLAN_ANNUAL_4999}",
  PAYPAL_WEBHOOK_ID: "${PAYPAL_WEBHOOK_ID}",
  CRISP_WEBSITE_ID: "${CRISP_WEBSITE_ID}",
  EXOCLICK_ZONE: "${EXOCLICK_ZONE}",
  JUICYADS_ZONE: "${JUICYADS_ZONE}",
  EROADVERTISING_ZONE: "${EROADVERTISING_ZONE}",
  EXOCLICK_SNIPPET_B64: "${EXOCLICK_SNIPPET_B64}",
  JUICYADS_SNIPPET_B64: "${JUICYADS_SNIPPET_B64}",
  EROADVERTISING_SNIPPET_B64: "${EROADVERTISING_SNIPPET_B64}",
  POPADS_SITE_ID: "${POPADS_SITE_ID}",
  POPADS_ENABLE: "${POPADS_ENABLE}",
  IBG_ASSETS_BASE_URL: "${IBG_ASSETS_BASE_URL}",
  CURRENCY: "${CURRENCY}"
};
EOJS
echo "✅ env.js generado"
EOT
chmod +x tools/build-env.sh
( cd tools && ./build-env.sh )

# --- 2) CSS (blur, grid, carrusel) ---
cat > css/ibg.css <<'EOT'
:root{--gap:10px;--radius:16px;--badge:#ff3366}
*{box-sizing:border-box}
body{margin:0;font-family:-apple-system,Segoe UI,Roboto,Inter,system-ui,sans-serif;background:#0e1b26;color:#fff}
.header{position:sticky;top:0;z-index:20;background:rgba(0,0,0,.5);backdrop-filter:saturate(140%) blur(8px);padding:10px 12px;display:flex;gap:12px;align-items:center}
.header a{color:#fff;text-decoration:none;padding:.45rem .7rem;border-radius:999px;background:#16344a}
.header .lang{margin-left:auto}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:var(--gap);padding:12px}
.card{position:relative;border-radius:var(--radius);overflow:hidden;background:#0a1320}
.card img,.card video{width:100%;height:220px;object-fit:cover;display:block}
.blurred :is(img,video){filter:blur(16px) saturate(.7);transform:scale(1.01)}
.badge{position:absolute;top:8px;left:8px;background:var(--badge);color:#fff;font-weight:700;padding:4px 8px;border-radius:999px;font-size:12px}
.price{position:absolute;bottom:8px;right:8px;background:rgba(0,0,0,.7);padding:6px 8px;border-radius:10px;font-size:12px}
.btn{cursor:pointer;border:0;border-radius:999px;background:#1b87f3;color:#fff;padding:.5rem .8rem;font-weight:700}
.carousel{position:relative;overflow:hidden;margin:10px}
.carousel-track{display:flex;gap:10px;scroll-snap-type:x mandatory;overflow-x:auto;padding-bottom:8px}
.carousel .slide{min-width:320px;max-width:70vw;scroll-snap-align:start;border-radius:var(--radius);overflow:hidden}
.small{font-size:12px;opacity:.85}
.hidden{display:none}
EOT

# --- 3) utils.js (incluye shuffleSeeded exportado) ---
cat > js/utils.js <<'EOT'
export function hashSeed(s){let h=2166136261>>>0;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function mulberry32(a){return function(){let t=(a+=0x6D2B79F5);t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
export function getDailySeed(){return hashSeed(new Date().toISOString().slice(0,10))}
export function shuffleSeeded(arr,seed){const a=arr.slice();const rnd=mulberry32(seed>>>0);for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
export function sampleSeeded(arr,n,seed){return shuffleSeeded(arr,seed).slice(0,Math.min(n,arr.length))}
export function waitUntil(fn,timeout=10000,step=100){return new Promise((res,rej)=>{const t0=Date.now();const id=setInterval(()=>{try{const v=fn();if(v){clearInterval(id);res(v)}else if(Date.now()-t0>timeout){clearInterval(id);rej(new Error('timeout'))}}catch(e){clearInterval(id);rej(e)}},step)})}
export const money=(v)=>new Intl.NumberFormat(undefined,{style:'currency',currency:(window.IBG?.CURRENCY||'EUR')}).format(v);
export function isSubscribed(){try{return localStorage.getItem('ibg_sub_active')==='1'||localStorage.getItem('ibg_lifetime')==='1'}catch{return false}}
export function markUnlocked(id){try{const k='ibg_unlocked';const s=new Set(JSON.parse(localStorage.getItem(k)||'[]'));s.add(id);localStorage.setItem(k,JSON.stringify([...s]))}catch{}}
export function isUnlocked(id){try{const k='ibg_unlocked';const s=new Set(JSON.parse(localStorage.getItem(k)||'[]'));return s.has(id)}catch{return false}}
export function b64Decode(txt){try{return atob(txt||'')}catch{return ''}}
EOT

# --- 4) i18n (ES/EN/FR/DE/IT) ---
cat > js/i18n.js <<'EOT'
export const T={
  ES:{home:'Home',premium:'Premium',videos:'Vídeos',subs:'Suscripciones',lifetime:'Lifetime 100€ (sin anuncios)',welcome:'Bienvenido al paraíso para tu disfrute',new:'NUEVO',buy:'Comprar',unlock:'Desbloquear'},
  EN:{home:'Home',premium:'Premium',videos:'Videos',subs:'Subscriptions',lifetime:'Lifetime €100 (no ads)',welcome:'Welcome to your paradise',new:'NEW',buy:'Buy',unlock:'Unlock'},
  FR:{home:'Accueil',premium:'Premium',videos:'Vidéos',subs:'Abonnements',lifetime:'À vie 100€ (sans pubs)',welcome:'Bienvenue au paradis',new:'NOUVEAU',buy:'Acheter',unlock:'Débloquer'},
  DE:{home:'Start',premium:'Premium',videos:'Videos',subs:'Abos',lifetime:'Lifetime 100€ (ohne Werbung)',welcome:'Willkommen im Paradies',new:'NEU',buy:'Kaufen',unlock:'Freischalten'},
  IT:{home:'Home',premium:'Premium',videos:'Video',subs:'Abbonamenti',lifetime:'Per sempre 100€ (senza ads)',welcome:'Benvenuto in paradiso',new:'NUOVO',buy:'Compra',unlock:'Sblocca'},
};
export function lang(){return (localStorage.getItem('ibg_lang')||'ES')}
export function setLang(l){localStorage.setItem('ibg_lang',l);location.reload()}
export function t(k){return (T[lang()]||T.ES)[k]||k}
EOT

# --- 5) Anuncios (Exo/Juicy/Ero/PopAds, apagados si lifetime/sub) ---
cat > js/ad-loader.js <<'EOT'
import { b64Decode, isSubscribed } from './utils.js';
export function initAds(){
  if(isSubscribed()) return;
  const E = window.IBG || {};
  if(E.EXOCLICK_SNIPPET_B64){ document.body.insertAdjacentHTML('beforeend', b64Decode(E.EXOCLICK_SNIPPET_B64)); }
  else if(E.EXOCLICK_ZONE){ const s=document.createElement('script'); s.async=true; s.src='https://a.magsrv.com/ad-provider.js'; document.head.appendChild(s); const ins=document.createElement('ins'); ins.className='eas6a97888e2'; ins.setAttribute('data-zoneid',E.EXOCLICK_ZONE); document.body.appendChild(ins); setTimeout(()=>{ (window.AdProvider=window.AdProvider||[]).push({serve:{}}); },800); }
  if(E.JUICYADS_SNIPPET_B64){ document.body.insertAdjacentHTML('beforeend', b64Decode(E.JUICYADS_SNIPPET_B64)); }
  else if(E.JUICYADS_ZONE){ const s=document.createElement('script'); s.async=true; s.src='https://poweredby.jads.co/js/jads.js'; document.head.appendChild(s); const ins=document.createElement('ins'); ins.id=E.JUICYADS_ZONE; ins.setAttribute('data-width','300'); ins.setAttribute('data-height','250'); document.body.appendChild(ins); setTimeout(()=>{ (window.adsbyjuicy=window.adsbyjuicy||[]).push({adzone:Number(E.JUICYADS_ZONE)}) },500); }
  if(E.EROADVERTISING_SNIPPET_B64){ document.body.insertAdjacentHTML('beforeend', b64Decode(E.EROADVERTISING_SNIPPET_B64)); }
  else if(E.EROADVERTISING_ZONE){ const d=document.createElement('div'); d.id='sp_'+E.EROADVERTISING_ZONE+'_node'; d.innerHTML='&nbsp;'; document.body.appendChild(d);
    const js=document.createElement('script'); js.src='//go.easrv.cl/loadeactrl.go?pid=152716&spaceid='+E.EROADVERTISING_ZONE+'&ctrlid=798544'; document.head.appendChild(js);
    setTimeout(()=>{ window.eaCtrl ? eaCtrl.add({display:d.id,sid:Number(E.EROADVERTISING_ZONE),plugin:'banner'}) : null; },1000);
  }
  if((E.POPADS_ENABLE||'0')!=='0' && E.POPADS_SITE_ID){
    const code='(function(){var p=window,j=\"e494ffb82839a29122608e933394c091\",d=[[\"siteId\",'+E.POPADS_SITE_ID+'],[\"minBid\",0],[\"popundersPerIP\",\"0\"],[\"delayBetween\",0],[\"default\",false],[\"defaultPerDay\",0],[\"topmostLayer\",\"auto\"]],v=[],e=-1,a,y,m=function(){clearTimeout(y);e++;a=p.document.createElement(\"script\");a.type=\"text/javascript\";a.async=!0;var s=p.document.getElementsByTagName(\"script\")[0];a.src=\"https://www.premiumvertising.com/zS/bwdvf/ttabletop.min.js\";a.crossOrigin=\"anonymous\";a.onerror=m;a.onload=function(){clearTimeout(y);p[j.slice(0,16)+j.slice(0,16)]||m()};y=setTimeout(m,5E3);s.parentNode.insertBefore(a,s)};if(!p[j]){try{Object.freeze(p[j]=d)}catch(e){}m()})();';
    const s=document.createElement('script'); s.text=code; document.body.appendChild(s);
  }
}
EOT

# --- 6) Integraciones (Crisp + PayPal SDK) ---
cat > js/integrations.js <<'EOT'
export function initCrisp(){
  const id = window.IBG?.CRISP_WEBSITE_ID;
  if(!id) return;
  window.$crisp=[]; window.CRISP_WEBSITE_ID=id;
  const s=document.createElement('script'); s.src='https://client.crisp.chat/l.js'; s.async=1; document.head.appendChild(s);
}
let paypalLoaded=false;
export async function loadPayPal(){
  if(paypalLoaded) return;
  const cid = window.IBG?.PAYPAL_CLIENT_ID;
  if(!cid){console.error('PAYPAL_CLIENT_ID vacío; no cargo SDK'); return;}
  await new Promise((res,rej)=>{const s=document.createElement('script'); s.src=`https://www.paypal.com/sdk/js?client-id=${cid}&components=buttons,hosted-fields&currency=EUR&intent=authorize`; s.onerror=rej; s.onload=res; document.head.appendChild(s);});
  paypalLoaded=true;
}
EOT

# --- 7) Paywall (blur + compra item) ---
cat > js/paywall.js <<'EOT'
import { money, isUnlocked, markUnlocked, isSubscribed } from './utils.js';
import { loadPayPal } from './integrations.js';
export function applyBlur(container){
  container.querySelectorAll('[data-lock]').forEach(el=>{
    const id=el.getAttribute('data-id');
    if(isSubscribed() || isUnlocked(id)){ el.classList.remove('blurred'); el.querySelector('.price')?.classList.add('hidden'); return; }
    el.classList.add('blurred');
  });
}
export async function attachBuyHandlers(container){
  await loadPayPal(); if(!window.paypal) return;
  container.querySelectorAll('[data-buy]').forEach(btn=>{
    if(btn.dataset.bound) return; btn.dataset.bound='1';
    btn.addEventListener('click',async()=>{
      const card=btn.closest('[data-id]'); const id=card.getAttribute('data-id'); const price=parseFloat(btn.getAttribute('data-price'));
      try{
        const buttons=paypal.Buttons({
          createOrder:(_d,actions)=>actions.order.create({purchase_units:[{amount:{value:price.toFixed(2),currency_code:'EUR'},description:`IBG item ${id}`}] }),
          onApprove:async(_d,actions)=>{await actions.order.capture(); markUnlocked(id); card.classList.remove('blurred'); card.querySelector('.price')?.classList.add('hidden');}
        });
        const tmp=document.createElement('div'); tmp.style.display='none'; document.body.appendChild(tmp); buttons.render(tmp);
      }catch(e){console.error('Pay error',e)}
    });
  });
}
export function renderPrice(el,v){let p=el.querySelector('.price'); if(!p){p=document.createElement('div'); p.className='price'; el.appendChild(p);} p.textContent=money(v);}
EOT

# --- 8) Daily picks (USANDO tus pools: data2=full, data3+4=premium img, data5=vídeos) ---
cat > js/daily-picks.js <<'EOT'
import { getDailySeed, sampleSeeded } from './utils.js';
function poolFromAPI(){
  // Usa la API unificada si existe (content-data6.js la expone) y, por si acaso, cae a los módulos directos
  const U = window.UnifiedContentAPI || {};
  const full = (U.getPublicImages && U.getPublicImages()) || (window.ContentData2?.publicImages || []);
  const prem1 = (U.getPremiumImages && U.getPremiumImages()) || [].concat(window.ContentData3?.premiumImages||[], window.ContentData4?.premiumImages||[]);
  const vids = (U.getPremiumVideos && U.getPremiumVideos()) || (window.ContentData5?.premiumVideos || []);
  return { full, premiumImages: prem1, premiumVideos: vids };
}
export function getDaily(){
  const seed = getDailySeed();
  const {full, premiumImages, premiumVideos} = poolFromAPI();
  const home20 = sampleSeeded(full, 20, seed);
  const premPool = sampleSeeded(premiumImages, 100, seed ^ 0x9e3779b1);
  const n = Math.floor(premPool.length*0.30);
  const marks = new Set(sampleSeeded(premPool.map((_,i)=>i), n, seed ^ 0xdeadbabe));
  const prem100 = premPool.map((x,i)=>({...x, isNew: marks.has(i)}));
  const vids20 = sampleSeeded(premiumVideos, 20, seed ^ 0x1337c0de);
  return {home20, prem100, vids20};
}
EOT

# --- 9) Header común ---
cat > js/pages-common.js <<'EOT'
import { t } from '../i18n.js';
export function header(){
  return `
  <div class="header">
    <a href="/index.html">${t('home')}</a>
    <a href="/premium.html">${t('premium')}</a>
    <a href="/videos.html">${t('videos')}</a>
    <a href="/subscription.html">${t('subs')}</a>
    <a href="/subscription.html" class="btn">${t('lifetime')}</a>
    <select class="lang">
      <option value="ES">ES</option><option value="EN">EN</option><option value="FR">FR</option><option value="DE">DE</option><option value="IT">IT</option>
    </select>
  </div>`;
}
export function mountHeader(){
  document.body.insertAdjacentHTML('afterbegin', header());
  const sel=document.querySelector('.lang'); sel.value=(localStorage.getItem('ibg_lang')||'ES');
  sel.addEventListener('change',e=>{ localStorage.setItem('ibg_lang', e.target.value); location.reload(); });
}
EOT

# --- 10) Páginas ---
cat > js/pages/home.js <<'EOT'
import { t } from '../i18n.js';
import { getDaily } from '../daily-picks.js';
export async function initHome(){
  const root=document.getElementById('app');
  root.innerHTML = `
    <h2 style="padding:10px 12px">${t('welcome')}</h2>
    <section class="carousel"><div class="carousel-track" id="homeCarousel"></div></section>
    <section class="grid" id="homeGrid"></section>`;
  const {home20}=getDaily();
  const car=document.getElementById('homeCarousel');
  home20.forEach(it=>{const url=it.thumb||it.src||it.file||it.url||it.path;const s=document.createElement('div');s.className='slide';s.innerHTML=`<img src="${url}" alt="">`;car.appendChild(s);});
  const grid=document.getElementById('homeGrid');
  home20.forEach((it,i)=>{const id=it.id||it.file||`full-${i}`;const url=it.thumb||it.src||it.file||it.url||it.path;const c=document.createElement('div');c.className='card';c.dataset.id=id;c.innerHTML=`<img loading="lazy" src="${url}" alt="">`;grid.appendChild(c);});
}
EOT

cat > js/pages/premium.js <<'EOT'
import { t } from '../i18n.js';
import { getDaily } from '../daily-picks.js';
import { applyBlur, attachBuyHandlers, renderPrice } from '../paywall.js';
export async function initPremium(){
  const root=document.getElementById('app'); root.innerHTML = `<section class="grid" id="premiumGrid"></section>`;
  const {prem100}=getDaily(); const grid=document.getElementById('premiumGrid');
  prem100.forEach((it,i)=>{const id=it.id||it.file||`prem-${i}`;const url=it.thumb||it.src||it.file||it.url||it.path;const c=document.createElement('div');c.className='card';c.dataset.id=id;c.dataset.lock='1';c.innerHTML=`
    ${it.isNew?`<div class="badge">${t('new')}</div>`:''}
    <img loading="lazy" src="${url}" alt="">
    <div class="price"></div>
    <button class="btn" data-buy data-price="0.10" style="position:absolute;left:8px;bottom:8px">${t('unlock')}</button>`;grid.appendChild(c);renderPrice(c,0.10);});
  applyBlur(grid); await attachBuyHandlers(grid);
}
EOT

cat > js/pages/videos.js <<'EOT'
import { t } from '../i18n.js';
import { getDaily } from '../daily-picks.js';
import { applyBlur, attachBuyHandlers, renderPrice } from '../paywall.js';
export async function initVideos(){
  const root=document.getElementById('app'); root.innerHTML = `<section class="grid" id="videoGrid"></section>`;
  const {vids20}=getDaily(); const grid=document.getElementById('videoGrid');
  vids20.forEach((it,i)=>{const id=it.id||it.file||`vid-${i}`;const poster=it.thumb||it.poster||it.src||it.file||it.url||it.path;const c=document.createElement('div');c.className='card';c.dataset.id=id;c.dataset.lock='1';c.innerHTML=`
    <video preload="metadata" muted playsinline poster="${poster}"></video>
    <div class="price"></div>
    <button class="btn" data-buy data-price="0.30" style="position:absolute;left:8px;bottom:8px">${t('unlock')}</button>`;grid.appendChild(c);renderPrice(c,0.30);});
  applyBlur(grid); await attachBuyHandlers(grid);
}
EOT

cat > js/pages/subscription.js <<'EOT'
import { t } from '../i18n.js';
import { loadPayPal } from '../integrations.js';
export async function initSubscription(){
  const root=document.getElementById('app');
  const M=window.IBG?.PAYPAL_PLAN_MONTHLY_1499||''; const Y=window.IBG?.PAYPAL_PLAN_ANNUAL_4999||'';
  root.innerHTML=`<div style="padding:16px">
    <h2>${t('subs')}</h2>
    <p class="small">Mensual 14,99€ · Anual 49,99€ · ${t('lifetime')}</p>
    <div id="paypal-monthly"></div><div id="paypal-yearly" style="margin-top:12px"></div>
    <hr style="border-color:#274f6a;margin:16px 0">
    <h3>${t('lifetime')}</h3><div id="paypal-lifetime"></div>
    <p class="small">Tras comprar lifetime se desactivan todos los anuncios automáticamente.</p></div>`;
  await loadPayPal(); if(!window.paypal) return;
  if(M){ paypal.Buttons({style:{color:'gold',label:'subscribe',layout:'horizontal'},
    createSubscription:(_d,a)=>a.subscription.create({plan_id:M}),
    onApprove:()=>{localStorage.setItem('ibg_sub_active','1');alert('✅ Suscripción mensual activa');location.href='/index.html';}
  }).render('#paypal-monthly'); }
  if(Y){ paypal.Buttons({style:{color:'gold',label:'subscribe',layout:'horizontal'},
    createSubscription:(_d,a)=>a.subscription.create({plan_id:Y}),
    onApprove:()=>{localStorage.setItem('ibg_sub_active','1');alert('✅ Suscripción anual activa');location.href='/index.html';}
  }).render('#paypal-yearly'); }
  paypal.Buttons({style:{color:'blue',label:'pay',layout:'horizontal'},
    createOrder:(_d,a)=>a.order.create({purchase_units:[{amount:{value:'100.00',currency_code:'EUR'},description:'IBG Lifetime'}]}),
    onApprove:async(_d,a)=>{await a.order.capture();localStorage.setItem('ibg_lifetime','1');alert('🎉 Lifetime activado (sin anuncios)');location.href='/index.html';}
  }).render('#paypal-lifetime');
}
EOT

# --- 11) Bootstrap por ruta ---
cat > js/bootstrap-ibg.js <<'EOT'
import { mountHeader } from './pages-common.js';
import { initHome } from './pages/home.js';
import { initPremium } from './pages/premium.js';
import { initVideos } from './pages/videos.js';
import { initSubscription } from './pages/subscription.js';
import { initAds } from './ad-loader.js';
import { initCrisp } from './integrations.js';
mountHeader(); initCrisp(); initAds();
const path=location.pathname.replace(/\/+$/,'')||'/index.html';
if(path.endsWith('/index.html')){initHome()}
else if(path.endsWith('/premium.html')){initPremium()}
else if(path.endsWith('/videos.html')){initVideos()}
else if(path.endsWith('/subscription.html')){initSubscription()}
EOT

# --- 12) Páginas HTML (cargan content-data*.js existentes) ---
make_page(){ # $1=title $2=filename
cat > "$2" <<HTML
<!doctype html><html lang="es"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>$1 — IBIZAGIRL.PICS</title>
<link rel="stylesheet" href="/css/ibg.css">
<script src="/env.js"></script>
<script src="/content-data1.js"></script>
<script src="/content-data2.js"></script>
<script src="/content-data3.js"></script>
<script src="/content-data4.js"></script>
<script src="/content-data5.js"></script>
<script src="/content-data6.js"></script>
</head><body>
<div id="app"></div>
<script type="module" src="/js/i18n.js"></script>
<script type="module" src="/js/bootstrap-ibg.js"></script>
</body></html>
HTML
}
make_page "Home" "index.html"
make_page "Premium" "premium.html"
make_page "Vídeos" "videos.html"
make_page "Suscripciones" "subscription.html"

echo "✅ Patch aplicado. Si usas Vercel, añade 'bash tools/build-env.sh' como Build Command."
