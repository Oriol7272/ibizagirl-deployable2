#!/usr/bin/env bash
set -Eeuo pipefail

files=(index.html premium.html videos.html subscription.html)

copy_if_missing() { local src="$1" dst="$2"; [ -f "$dst" ] || { [ -f "$src" ] && cp -f "$src" "$dst" || true; }; }

# ---------- CSS raíz ----------
if [ ! -f ibg-layout.css ]; then
cat > ibg-layout.css <<'CSS'
:root{ --wrap:1200px; --gap:16px; --card-r:14px; --shadow:0 10px 24px rgba(0,0,0,.15) }
#main-section,main,.page,.content,#content{ position:relative; z-index:5!important; max-width:var(--wrap); margin:0 auto; width:100%; padding:1rem }
#home-carousel{ position:relative; overflow:hidden; border-radius:var(--card-r) }
#home-carousel .track{ display:flex; gap:var(--gap); transition:transform .7s ease }
#home-carousel .slide{ min-width:calc(25% - var(--gap)*.75); aspect-ratio:4/3; overflow:hidden; border-radius:var(--card-r); box-shadow:var(--shadow) }
#home-carousel .slide img{ width:100%; height:100%; object-fit:cover; display:block }
#gallery,.gallery,.gallery-grid,#premium-grid,#videos-grid,.section-grid{ display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:var(--gap); max-width:var(--wrap); margin:1rem auto }
.card,.tile{ border-radius:var(--card-r); box-shadow:var(--shadow); overflow:hidden; transform:translateZ(0); transition:transform .2s, box-shadow .2s }
.card:hover,.tile:hover{ transform:translateY(-4px); box-shadow:0 12px 30px rgba(0,0,0,.22) }
iframe[src*="juicyads"],iframe[src*="exoclick"],iframe[src*="eroadvertising"],[id*="juicy"],[id*="exo"],[id*="ero"]{ z-index:1!important; position:static!important }
@media (max-width:1024px){ #home-carousel .slide{ min-width:calc(33.333% - var(--gap)*.666) } #gallery,.gallery,.gallery-grid,#premium-grid,#videos-grid,.section-grid{ grid-template-columns:repeat(3,1fr) } }
@media (max-width:640px){ #home-carousel .slide{ min-width:calc(50% - var(--gap)*.5) } #gallery,.gallery,.gallery-grid,#premium-grid,#videos-grid,.section-grid{ grid-template-columns:repeat(2,1fr) } }
CSS
fi
# crea cascarones por si se referencian
: > site.css || true
: > styles.css || true
: > paywall.css || true

# ---------- JS raíz (sin ES modules) ----------
copy_if_missing js/env.js env.js
if [ ! -f env.js ]; then
cat > env.js <<'JS'
(function(){
  window.IBG_ENV = window.IBG_ENV || {
    VERSION:'v3', ENVIRONMENT:'production', CURRENCY:'EUR',
    PAYPAL_CLIENT_ID:'', /* <-- añade tu Client ID PayPal y guarda */
    ADS:{
      ENABLED:true,
      JUICY:{enabled:true, adzone:1099637},
      ERO:{enabled:true, domain:'eroadvertising.com', pid:152716, spaceid:8177575, ctrlid:798544},
      EXO:{enabled:false, zones:{}}
    }
  };
  // FIX automático del "https://go./..."
  try{
    var bad=document.querySelector('script[src^="https://go./loadeactrl.go"]');
    if(bad && window.IBG_ENV.ADS.ERO.domain){
      var d=window.IBG_ENV.ADS.ERO.domain.replace(/\/+$/,'');
      bad.src = 'https://go.'+d+'/loadeactrl.go?pid='+window.IBG_ENV.ADS.ERO.pid+'&spaceid='+window.IBG_ENV.ADS.ERO.spaceid+'&ctrlid='+window.IBG_ENV.ADS.ERO.ctrlid;
      console.log('[ADS] Reescrito loadeactrl.go a', bad.src);
    }
  }catch(e){}
})();
JS
fi

copy_if_missing js/payments.config.js payments.config.js
if [ ! -f payments.config.js ]; then
cat > payments.config.js <<'JS'
window.IBG_PAYMENTS = { plans: { monthly:'9.99', lifetime:'100.00' } };
JS
fi

copy_if_missing js/payments.js payments.js
if [ ! -f payments.js ]; then
cat > payments.js <<'JS'
(function(){
  const C=(window.IBG_ENV||{}), P=(window.IBG_PAYMENTS||{plans:{}});
  const CLIENT=(C.PAYPAL_CLIENT_ID||'').trim(); const CUR=C.CURRENCY||'EUR';
  function loadSDK(){ return new Promise((ok,ko)=>{ if(window.paypal) return ok();
    if(!CLIENT){ console.warn('[PayPal] Falta PAYPAL_CLIENT_ID en env.js'); return ko(new Error('missing-client-id')); }
    const s=document.createElement('script'); s.async=true;
    s.src='https://www.paypal.com/sdk/js?client-id='+encodeURIComponent(CLIENT)+'&currency='+encodeURIComponent(CUR)+'&intent=capture&components=buttons';
    s.onload=ok; s.onerror=()=>ko(new Error('sdk-load-failed')); document.head.appendChild(s); });
  }
  async function render(amount){
    try{ await loadSDK(); }catch(e){ return; }
    const mount=document.querySelector('#pp-container')||document.body;
    window.paypal.Buttons({
      style:{layout:'vertical',color:'blue',shape:'pill'},
      createOrder:(_,a)=>a.order.create({purchase_units:[{amount:{value:amount,currency_code:CUR}}]}),
      onApprove:async(_,a)=>{ try{
        await a.order.capture();
        if(amount===(P.plans.lifetime||'100.00')) localStorage.setItem('IBG_LIFETIME','1');
        localStorage.setItem('IBG_USER','premium');
        document.documentElement.classList.add('hide-ads','is-premium');
        alert('Acceso activado'); location.reload();
      }catch(e){ console.error(e); } }
    }).render(mount);
  }
  window.IBG_buyMonthly = ()=>render(P.plans.monthly||'9.99');
  window.IBG_buyLifetime= ()=>render(P.plans.lifetime||'100.00');
})();
JS
fi

copy_if_missing js/page-init.js page-init.js
if [ ! -f page-init.js ]; then
cat > page-init.js <<'JS'
(function(){
  const ready=(fn)=>document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn);
  ready(()=>{
    // Asegura CSS
    if(!document.querySelector('link[href$="ibg-layout.css"]')){ const l=document.createElement('link'); l.rel='stylesheet'; l.href='/ibg-layout.css'; document.head.appendChild(l); }
    // Galerías 4 cols centradas
    document.querySelectorAll('#gallery,.gallery,.gallery-grid,#premium-grid,#videos-grid,.section-grid')
      .forEach(g=>{ g.classList.add('gallery-grid'); g.style.margin='1rem auto'; });
    // Carrusel
    let wrap=document.querySelector('#home-carousel');
    if(!wrap){
      const after=document.querySelector('.page')||document.querySelector('main')||document.body;
      const sec=document.createElement('section'); sec.className='carousel';
      wrap=document.createElement('div'); wrap.id='home-carousel'; sec.appendChild(wrap);
      after.parentNode.insertBefore(sec,after.nextSibling);
    }
    if(!wrap.dataset.built){
      const track=document.createElement('div'); track.className='track';
      const fall=['/full/01.jpg','/full/02.jpg','/full/03.jpg','/full/04.jpg'];
      const list=(window.PublicImages&&window.PublicImages.slice(0,8))||fall;
      list.forEach(u=>{ const s=document.createElement('div'); s.className='slide'; const im=document.createElement('img'); im.loading='lazy'; im.decoding='async'; im.src=u; s.appendChild(im); track.appendChild(s); });
      wrap.appendChild(track); wrap.dataset.built='1';
    }
    // Estado premium local
    try{ if(localStorage.getItem('IBG_LIFETIME')==='1'||localStorage.getItem('IBG_USER')==='premium'){ document.documentElement.classList.add('hide-ads','is-premium'); } }catch(e){}
  });
})();
JS
fi

copy_if_missing js/carousel.js carousel.js
[ -f carousel.js ] || echo '(function(){ /* carousel bootstrapped in page-init.js */ })();' > carousel.js

# Stubs para eliminar 404 si el HTML los llama
: > decorative-list.js || true
: > unified-content.js  || true
: > paywall.js          || true
: > i18n.js             || true
: > favicon.ico         || true

# ---------- content-data*.js a raíz si faltan ----------
have_any=0
for n in 1 2 3 4 5 6; do
  f="content-data${n}.js"
  if [ ! -f "$f" ]; then
    if [ -f "js/$f" ]; then cp -f "js/$f" "$f"; have_any=1; fi
  else
    have_any=1
  fi
done
if [ "$have_any" = "0" ]; then
  echo "window.PublicImages=(window.PublicImages||['/full/01.jpg','/full/02.jpg','/full/03.jpg','/full/04.jpg']);" > content-data1.js
  : > content-data2.js; : > content-data3.js; : > content-data4.js; : > content-data5.js; : > content-data6.js
fi

# ---------- Inyecciones HTML idempotentes ----------
append_before_body(){ local f="$1" tag="$2"; grep -Fq "$tag" "$f" && return 0; awk -v T="$tag" '1; /<\/body>/{print "  " T}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"; }
inject_head(){ local f="$1";
  grep -Fq 'ibg-layout.css' "$f" || awk '1; /<head[^>]*>/{print "  <link rel=\"stylesheet\" href=\"/ibg-layout.css\">"}' "$f" > "$f.tmp" && mv "$f.tmp" "$f";
  grep -Fq 'window.Paywall' "$f" || awk '1; /<head[^>]*>/{print "  <script>window.Paywall=window.Paywall||{init:function(){},refresh:function(){}};</script>"}' "$f" > "$f.tmp" && mv "$f.tmp" "$f";
}
for f in "${files[@]}"; do
  [ -f "$f" ] || continue
  inject_head "$f"
  append_before_body "$f" '<script src="/env.js"></script>'
  append_before_body "$f" '<script src="/payments.config.js"></script>'
  append_before_body "$f" '<script src="/payments.js" defer></script>'
  append_before_body "$f" '<script src="/page-init.js" defer></script>'
  append_before_body "$f" '<script src="/carousel.js" defer></script>'
done

# Carrusel visible en home (por si faltaba)
f="index.html"
if [ -f "$f" ] && ! grep -q 'id="home-carousel"' "$f"; then
  awk '1; /<div class="page">/{print "<section class=\"carousel\"><div id=\"home-carousel\"></div></section>"}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
fi

echo "✅ BOOTSTRAP V3 OK (CSS, JS, inyecciones y anti-404 listos)"
