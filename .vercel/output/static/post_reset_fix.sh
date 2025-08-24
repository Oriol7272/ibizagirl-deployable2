#!/usr/bin/env bash
set -Eeuo pipefail
mkdir -p css js

# 1) CSS hotfix (4 columnas centradas + carrusel por encima de iframes de ads)
cat > css/ibg-hotfix.css <<'CSS'
:root{--wrap:1200px;--gap:16px;--card-r:14px;--shadow:0 10px 24px rgba(0,0,0,.15)}
#main-section,main,.page,.content,#content{position:relative;z-index:5;max-width:var(--wrap);margin:0 auto;width:100%;padding:1rem}
#home-carousel{position:relative;overflow:hidden;border-radius:var(--card-r);margin:1rem 0}
#home-carousel .track{display:flex;gap:var(--gap);transition:transform .7s ease}
#home-carousel .slide{min-width:calc(25% - var(--gap)*.75);aspect-ratio:4/3;overflow:hidden;border-radius:var(--card-r);box-shadow:var(--shadow)}
#home-carousel .slide img{width:100%;height:100%;object-fit:cover;display:block}
#gallery,.gallery,.gallery-grid,#premium-grid,#videos-grid,.section-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--gap);max-width:var(--wrap);margin:1rem auto}
.card,.tile{border-radius:var(--card-r);box-shadow:var(--shadow);overflow:hidden;transform:translateZ(0);transition:transform .2s,box-shadow .2s}
.card:hover,.tile:hover{transform:translateY(-4px);box-shadow:0 12px 30px rgba(0,0,0,.22)}
iframe[src*="juicyads"],iframe[src*="exoclick"],iframe[src*="eroadvertising"],[id*="juicy"],[id*="exo"],[id*="ero"]{z-index:1!important;position:static!important}
#main-section,main,.page{z-index:5!important}
@media (max-width:1024px){#home-carousel .slide{min-width:calc(33.333% - var(--gap)*.666)}
#gallery,.gallery,.gallery-grid,#premium-grid,#videos-grid,.section-grid{grid-template-columns:repeat(3,1fr)}}
@media (max-width:640px){#home-carousel .slide{min-width:calc(50% - var(--gap)*.5)}
#gallery,.gallery,.gallery-grid,#premium-grid,#videos-grid,.section-grid{grid-template-columns:repeat(2,1fr)}}
CSS
for f in index.html premium.html videos.html subscription.html; do
  [ -f "$f" ] || continue
  grep -Fq 'ibg-hotfix.css' "$f" || awk '
    BEGIN{ins=0}
    {print}
    /<head[^>]*>/ && !ins {print "  <link rel=\"stylesheet\" href=\"/css/ibg-hotfix.css\">"; ins=1}
  ' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
done

# 2) env.js compatible (evita "Unexpected token 'export'") y cárgalo antes de módulos
if [ -f js/env.js ]; then perl -i -pe 's/^\s*export\s+//g' js/env.js; else echo 'window.__ENV=window.__ENV||{};' > js/env.js; fi
for f in index.html premium.html videos.html subscription.html; do
  [ -f "$f" ] || continue
  grep -q '/js/env.js' "$f" || perl -0777 -i -pe 's|(<script[^>]+type="module"[^>]*>)|  <script src="/js/env.js"></script>\n\1|i' "$f"
done

# 3) Anuncios: corrige dominio roto "https://go./" -> "https://go.ezodn.com/"
perl -0777 -i -pe 's#https://go\./loadeactrl\.go#https://go.ezodn.com/loadeactrl.go#g' *.html 2>/dev/null || true
[ -d js ] && perl -0777 -i -pe 's#https://go\./loadeactrl\.go#https://go.ezodn.com/loadeactrl.go#g' js/*.js 2>/dev/null || true

# 4) Elimina cta.js si estuviera colado
for f in index.html premium.html videos.html subscription.html; do
  [ -f "$f" ] || continue
  perl -0777 -i -pe 's#\s*<script[^>]*src="/?js/cta\.js[^>]*>\s*</script>##gi' "$f"
done

# 5) payments.js sano + carga en home/suscripción
cat > js/payments.js <<'JS'
(() => {
  const CURRENCY='EUR';
  function openModal(){
    let m=document.getElementById('pp-modal');
    if(!m){
      m=document.createElement('div');
      m.id='pp-modal';
      m.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:9999';
      m.innerHTML='<div style="background:#111;color:#fff;padding:20px;border-radius:12px;min-width:320px"><h3>Pago seguro</h3><div id="pp-container"></div><button id="pp-close" style="margin-top:12px">Cerrar</button></div>';
      document.body.appendChild(m);
      m.querySelector('#pp-close').onclick=()=>m.classList.add('hidden');
    }
    m.classList.remove('hidden'); return m;
  }
  async function ensureSDK(){
    if(window.paypal) return;
    const clientId=(window.__ENV&&window.__ENV.PAYPAL_CLIENT_ID)||'test';
    const s=document.createElement('script');
    s.src=`https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${CURRENCY}&intent=capture`;
    s.async=true; await new Promise((res,rej)=>{s.onload=res;s.onerror=rej;document.head.appendChild(s);});
  }
  async function buyMonthly(){
    try{ await ensureSDK(); const m=openModal();
      window.paypal.Buttons({
        style:{layout:'vertical',color:'blue',shape:'pill'},
        createOrder:(_,a)=>a.order.create({purchase_units:[{amount:{value:'9.99',currency_code:CURRENCY}}]}),
        onApprove:async(_,a)=>{await a.order.capture(); localStorage.setItem('IBG_SUB','1'); document.documentElement.classList.add('hide-ads'); alert('Suscripción activada. ¡Gracias!'); m.classList.add('hidden'); location.reload();}
      }).render('#pp-container');
    }catch(e){console.error(e)}
  }
  async function buyLifetime(){
    try{ await ensureSDK(); const m=openModal();
      window.paypal.Buttons({
        style:{layout:'vertical',color:'blue',shape:'pill'},
        createOrder:(_,a)=>a.order.create({purchase_units:[{amount:{value:'100.00',currency_code:CURRENCY}}]}),
        onApprove:async(_,a)=>{await a.order.capture(); localStorage.setItem('IBG_LIFETIME','1'); document.documentElement.classList.add('hide-ads'); alert('Acceso de por vida activado y sin anuncios!'); m.classList.add('hidden'); location.reload();}
      }).render('#pp-container');
    }catch(e){console.error(e)}
  }
  window.IBGPayments={buyMonthly,buyLifetime};
})();
JS
for f in index.html subscription.html; do
  [ -f "$f" ] || continue
  grep -q '/js/payments.js' "$f" || perl -0777 -i -pe 's|</body>|  <script src="/js/payments.js"></script>\n</body>|i' "$f"
done

# 6) Carrusel en home + script (si falta)
if [ -f index.html ] && ! grep -q 'id="home-carousel"' index.html; then
  perl -0777 -i -pe 's|(<div class="page">)|\1\n<section class="carousel"><div id="home-carousel"></div></section>|i' index.html
fi
grep -q '/js/carousel.js' index.html || perl -0777 -i -pe 's|</body>|  <script type="module" src="/js/carousel.js"></script>\n</body>|i' index.html

# 7) Asegura que page-init.js (si usa import) se cargue como módulo
for f in index.html premium.html videos.html subscription.html; do
  [ -f "$f" ] || continue
  perl -0777 -i -pe 's|<script\s+(?![^>]*type="module")[^>]*src="/js/page-init\.js"|<script type="module" src="/js/page-init.js"|i' "$f" || true
done

echo "✅ POST-RESET FIX OK"
