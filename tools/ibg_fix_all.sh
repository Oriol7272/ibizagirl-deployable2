#!/usr/bin/env bash
set -Eeuo pipefail

pages=(index.html premium.html videos.html subscription.html)

mkdir -p css js

# ---------- CSS ----------
cat > css/ibg-hotfix.css <<'CSS'
:root{--wrap:1200px;--gap:16px}
#main-section,main,.page,.content,#content{position:relative;z-index:5;max-width:var(--wrap);margin:0 auto;padding:1rem}
#home-carousel{position:relative;overflow:hidden;border-radius:14px}
#home-carousel .track{display:flex;gap:var(--gap);transition:transform .7s ease}
#home-carousel .slide{min-width:calc(25% - var(--gap)*.75);aspect-ratio:4/3;border-radius:14px;overflow:hidden;box-shadow:0 10px 24px rgba(0,0,0,.15)}
#home-carousel .slide img{width:100%;height:100%;object-fit:cover;display:block}
#home-premium-grid,#home-videos-grid,#premium-grid,#videos-grid,#gallery,.gallery,.gallery-grid,.section-grid{
  display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--gap);max-width:var(--wrap);margin:1rem auto}
.card,.tile{border-radius:14px;overflow:hidden;box-shadow:0 10px 24px rgba(0,0,0,.15);transform:translateZ(0);transition:transform .2s ease, box-shadow .2s ease}
.card:hover,.tile:hover{transform:translateY(-4px);box-shadow:0 12px 30px rgba(0,0,0,.22)}
iframe[src*="juicyads"],iframe[src*="exoclick"],iframe[src*="eroadvertising"],[id*="juicy"],[id*="exo"],[id*="ero"]{z-index:1!important;position:static!important}
#main-section,main,.page{z-index:5!important}
@media(max-width:1024px){
  #home-carousel .slide{min-width:calc(33.333% - var(--gap)*.666)}
  #home-premium-grid,#home-videos-grid,#premium-grid,#videos-grid,#gallery,.gallery,.gallery-grid,.section-grid{grid-template-columns:repeat(3,1fr)}
}
@media(max-width:640px){
  #home-carousel .slide{min-width:calc(50% - var(--gap)*.5)}
  #home-premium-grid,#home-videos-grid,#premium-grid,#videos-grid,#gallery,.gallery,.gallery-grid,.section-grid{grid-template-columns:repeat(2,1fr)}
}
CSS
cp css/ibg-hotfix.css css/ibg-layout.css

# ---------- JS: ADS ----------
cat > js/ads.js <<'JS'
const ENV=window.__ENV||{};
const JUICY_ZONE=Number(ENV.ADS_JUICY_ZONE||1099637)||null;
const ERO_ZONE=Number(ENV.ADS_ERO_ZONE||8177575)||null;
const EXO_ZONE=Number(ENV.ADS_EXO_ZONE||5696328)||null;

function mountJuicy(el){
  if(!JUICY_ZONE) return;
  const s=document.createElement('script');
  s.src=`https://js.juicyads.com/adshow.php?adzone=${JUICY_ZONE}`;
  s.async=true; el.appendChild(s);
}
function mountEro(el){
  if(!ERO_ZONE) return;
  const i=document.createElement('iframe');
  i.src=`https://www.eroadvertising.com//banner.php?zoneid=${ERO_ZONE}`;
  i.width="160"; i.height="600"; i.setAttribute('frameborder','0'); i.setAttribute('scrolling','no');
  el.appendChild(i);
}
function mountExo(el){
  if(!EXO_ZONE) return;
  const i=document.createElement('iframe');
  i.src=`https://syndication.exoclick.com/ads-iframe-display.php?idzone=${EXO_ZONE}&output=iframe`;
  i.width="160"; i.height="600"; i.setAttribute('frameborder','0'); i.setAttribute('scrolling','no');
  el.appendChild(i);
}
export function mountAds(){
  document.querySelectorAll('.ad-slot').forEach(slot=>{
    const net=slot.dataset.network;
    try{
      if(net==='juicy') mountJuicy(slot);
      if(net==='ero')   mountEro(slot);
      if(net==='exo')   mountExo(slot);
    }catch(e){console.warn('ad error',net,e);}
  });
}
document.addEventListener('DOMContentLoaded',()=>{try{mountAds();}catch(e){}});
JS

# ---------- JS: PAYMENTS ----------
cat > js/payments.js <<'JS'
const ENV=window.__ENV||{};
const CURRENCY=(ENV.PP_CURRENCY||ENV.PAYPAL_CURRENCY||'EUR');
function getClientId(){return ENV.PP_CLIENT_LIVE||ENV.PAYPAL_CLIENT_ID||ENV.PP_CLIENT_ID||''}
function planId(k){
  if(k==='monthly') return ENV.PP_PLAN_MONTHLY||ENV.PAYPAL_PLAN_MONTHLY||ENV.SUB_MONTHLY_ID||'';
  if(k==='annual')  return ENV.PP_PLAN_ANNUAL ||ENV.PAYPAL_PLAN_ANNUAL ||ENV.SUB_ANNUAL_ID ||'';
  return '';
}
export function ensureSDK(){
  if(window.paypal) return Promise.resolve(window.paypal);
  const cid=getClientId(); if(!cid){console.error('NO PayPal CLIENT_ID'); return Promise.reject(new Error('NO_CLIENT'))}
  return new Promise((res,rej)=>{
    const src=`https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(cid)}&currency=${encodeURIComponent(CURRENCY)}&vault=true&intent=subscription&components=buttons,marks`;
    const s=document.createElement('script'); s.src=src; s.async=true;
    s.onload=()=>res(window.paypal); s.onerror=()=>rej(new Error('SDK_LOAD_FAIL'));
    document.head.appendChild(s);
  });
}
function ensureModal(){
  let m=document.getElementById('paypal-modal'); if(m) return m;
  m=document.createElement('div'); m.id='paypal-modal';
  m.innerHTML=`<div style="position:fixed;inset:0;background:#0008;display:flex;align-items:center;justify-content:center;z-index:9999">
    <div style="background:#fff;min-width:320px;max-width:90vw;border-radius:.8rem;padding:1rem;position:relative;color:#111">
      <button id="paypal-modal-close" style="position:absolute;top:.6rem;right:.8rem;background:none;border:none;font-size:1.2rem;cursor:pointer"></button>
      <div id="pp-container"></div>
    </div></div>`;
  document.body.appendChild(m);
  m.querySelector('#paypal-modal-close')?.addEventListener('click',()=>m.remove());
  return m;
}
export async function buyLifetime(){
  const price=(ENV.PP_LIFETIME_PRICE||'100.00');
  try{
    await ensureSDK(); const m=ensureModal();
    window.paypal.Buttons({
      style:{layout:'vertical',color:'blue',shape:'pill'},
      createOrder:(_d,a)=>a.order.create({purchase_units:[{amount:{value:String(price),currency_code:CURRENCY}}]}),
      onApprove:async(_d,a)=>{await a.order.capture(); localStorage.setItem('IBG_LIFETIME','1'); document.documentElement.classList.add('hide-ads'); alert('Acceso de por vida activado'); m.remove(); location.reload();}
    }).render('#pp-container');
  }catch(e){console.error('lifetime',e); alert('No se pudo iniciar PayPal');}
}
export async function buySubscription(kind){
  const pid=planId(kind); if(!pid){alert('Plan PayPal no configurado'); return;}
  try{
    await ensureSDK(); const m=ensureModal();
    window.paypal.Buttons({
      style:{layout:'vertical',color:'blue',shape:'pill'},
      createSubscription:(_d,a)=>a.subscription.create({plan_id:pid}),
      onApprove:async()=>{alert('Suscripcinnn activa'); m.remove(); location.reload();}
    }).render('#pp-container');
  }catch(e){console.error('sub',e); alert('No se pudo iniciar PayPal');}
}
export function wirePurchaseButtons(){
  document.querySelectorAll('[data-pp="lifetime"]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault(); buyLifetime();}));
  document.querySelectorAll('[data-pp-sub="monthly"]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault(); buySubscription('monthly');}));
  document.querySelectorAll('[data-pp-sub="annual"]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault(); buySubscription('annual');}));
}
document.addEventListener('DOMContentLoaded',()=>{try{wirePurchaseButtons();}catch(e){}});
JS

# ---------- JS: CAROUSEL ----------
cat > js/carousel.js <<'JS'
function guessFullPool(){
  const vals=Object.values(window);
  for(const v of vals){ if(Array.isArray(v)&&v.length>10&&v.every(x=>typeof x==='string'&&x.includes('/full/'))) return v; }
  for(const v of vals){ if(v&&Array.isArray(v.items)&&v.items.every(x=>typeof x==='string'&&x.includes('/full/'))) return v.items; }
  return [];
}
function pickN(a,n){const x=a.slice(); for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [x[i],x[j]]=[x[j],x[i]]} return x.slice(0,Math.min(n,x.length));}
function mountCarousel(){
  const wrap=document.querySelector('#home-carousel .track'); if(!wrap) return;
  const pool=guessFullPool(); if(!pool.length){console.warn('No pool /full/'); return;}
  const imgs=pickN(pool,20); wrap.innerHTML='';
  imgs.forEach(src=>{const d=document.createElement('div'); d.className='slide'; const img=document.createElement('img'); img.loading='lazy'; img.decoding='async'; img.src=src; d.appendChild(img); wrap.appendChild(d);});
  let idx=0; setInterval(()=>{const sl=wrap.children.length; if(!sl) return; idx=(idx+1)%sl; const w=wrap.children[0].getBoundingClientRect().width + parseFloat(getComputedStyle(wrap).gap||'16'); wrap.style.transform=`translateX(${-idx*w}px)`;},1000);
}
document.addEventListener('DOMContentLoaded',mountCarousel);
JS

# ---------- HEAD & SCRIPTS PATCH ----------
for f in "${pages[@]}"; do
  [ -f "$f" ] || continue
  # links CSS (una sola vez)
  perl -0777 -i -pe 's|<head>|<head>\n  <link rel="stylesheet" href="/css/ibg-hotfix.css"/>\n  <link rel="stylesheet" href="/css/ibg-layout.css"/>| unless /ibg-hotfix\.css|ibg-layout\.css/;' "$f"
  # quita cta.js y storefront.js si quedaron
  perl -0777 -i -pe 's#\s*<script[^>]*src="/?js/cta\.js[^>]*>\s*</script>##gi' "$f"
  perl -0777 -i -pe 's#\s*<script[^>]*src="/?js/storefront\.js[^>]*>\s*</script>##gi' "$f"
  # fuerza type="module" a env.js/payments.js/page-init.js si estn
  perl -0777 -i -pe 's#<script([^>]*?)\s+src="/js/env\.js"([^>]*)>#<script type="module"\1 src="/js/env.js"\2>#gi' "$f"
  perl -0777 -i -pe 's#<script([^>]*?)\s+src="/js/payments\.js"([^>]*)>#<script type="module"\1 src="/js/payments.js"\2>#gi' "$f"
  perl -0777 -i -pe 's#<script([^>]*?)\s+src="/js/page-init\.js"([^>]*)>#<script type="module"\1 src="/js/page-init.js"\2>#gi' "$f"
  # inserta env.js en <head> si no existe
  perl -0777 -i -pe 's|<head>|<head>\n  <script type="module" src="/js/env.js" id="env-module"></script>| unless /env\.js/;' "$f"
done

# ---------- Carrusel solo en home ----------
if [ -f index.html ] && ! grep -q 'id="home-carousel"' index.html; then
  awk '{
    print
    if(!ins && /<div class="page">/){
      print "<section class=\"carousel\"><div id=\"home-carousel\"><div class=\"track\"></div></div></section>"
      ins=1
    }
  }' index.html > index.html.tmp && mv index.html.tmp index.html
fi

echo "ALL OK"
