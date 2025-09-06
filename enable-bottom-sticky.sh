#!/usr/bin/env bash
set -euo pipefail
echo "== IBG: activar EXO sticky bottom como tercer slot =="

# 1) Contenedor (antes de </body>)
if ! grep -q 'id="ad-bottom"' index.html; then
  awk 'BEGIN{ins=0}
       /<\/body>/{if(!ins){print "  <div id=\"ad-bottom\"></div>"; ins=1} }
       {print}' index.html > .tmp && mv .tmp index.html
  echo "➕ Insertado <div id=\"ad-bottom\">"
else
  echo "✅ #ad-bottom ya existe"
fi

# 2) CSS sin fondo gris + padding dinámico
if ! grep -q 'ads-bottom-css' index.html; then
  awk 'BEGIN{
         css="  <style id=\"ads-bottom-css\">\n"
         css=css "  #ad-bottom{position:fixed;left:0;right:0;bottom:0;z-index:2147483647;display:flex;justify-content:center;pointer-events:none;background:transparent}\n"
         css=css "  #ad-bottom .ibg-slot{pointer-events:auto}\n"
         css=css "  #ad-bottom ins{display:block;width:min(100%,980px);min-height:90px}\n"
         css=css "  @media(max-width:768px){#ad-bottom ins{min-height:60px}}\n"
         css=css "  :root{--ibg-bottom-h:0px}\n"
         css=css "  body{padding-bottom:calc(var(--ibg-bottom-h) + env(safe-area-inset-bottom))}\n"
         css=css "  </style>\n"
       }
       /<\/head>/{print css; print; next}
       {print}' index.html > .tmp && mv .tmp index.html
  echo "➕ CSS del bottom insertado"
else
  echo "✅ CSS del bottom ya está"
fi

# 3) JS del sticky bottom (usa EXOCLICK_BOTTOM_ZONE)
mkdir -p js
cat > js/ads-exo-bottom.js <<'EOF'
(function(){
  var E = (window.__ENV||{});
  var Z = E.EXOCLICK_BOTTOM_ZONE;          // pega a tu var en Vercel
  if(!Z){ console.log('[exo-bottom] missing EXOCLICK_BOTTOM_ZONE'); return; }
  if(window.__IBG_EXO_BOTTOM_MOUNTED){ return; }
  window.__IBG_EXO_BOTTOM_MOUNTED = true;

  function loadMag(cb){
    if(window.AdProvider){ cb&&cb(); return; }
    var s=document.createElement('script');
    s.src='https://a.magsrv.com/ad-provider.js';
    s.async=true;
    s.onload=function(){ cb&&cb(); };
    (document.head||document.documentElement).appendChild(s);
  }

  function ensure(){
    var host=document.getElementById('ad-bottom');
    if(!host){ host=document.createElement('div'); host.id='ad-bottom'; document.body.appendChild(host); }
    host.innerHTML='';
    var slot=document.createElement('div'); slot.className='ibg-slot';
    var ins=document.createElement('ins');
    ins.className='eas6a97888e17';
    ins.setAttribute('data-zoneid', String(Z));
    ins.setAttribute('data-block-ad-types','0');
    ins.style.display='block';
    ins.style.minHeight=(window.innerWidth<=768?'60px':'90px');
    slot.appendChild(ins);
    host.appendChild(slot);
    return host;
  }

  function serve(){ (window.AdProvider=window.AdProvider||[]).push({serve:{}}); }

  function updatePadding(){
    var h=document.getElementById('ad-bottom')?.offsetHeight||0;
    document.documentElement.style.setProperty('--ibg-bottom-h', h ? (h+'px') : '0px');
  }

  function mount(){
    var host=ensure();
    serve();
    // si no hay fill, ocultamos el contenedor para evitar barra gris
    setTimeout(function(){
      if(!host.querySelector('iframe')){ 
        console.log('[exo-bottom] no fill → hide');
        host.style.display='none';
      }
      updatePadding();
    }, 2500);

    // re-calcular padding al cambiar el DOM / resize
    new MutationObserver(updatePadding).observe(host,{childList:true,subtree:true});
    window.addEventListener('resize', updatePadding, {passive:true});
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', function(){ loadMag(mount); });
  }else{
    loadMag(mount);
  }
})();
EOF

# 4) Referencia del script en <head>
if ! grep -q '/js/ads-exo-bottom.js' index.html; then
  awk 'BEGIN{tag="  <script defer src=\"/js/ads-exo-bottom.js\"></script>"}
       /<\/head>/{print tag; print; next}
       {print}' index.html > .tmp && mv .tmp index.html
  echo "➕ Añadida referencia a /js/ads-exo-bottom.js"
else
  echo "✅ /js/ads-exo-bottom.js ya referenciado"
fi

# 5) (Opcional) sandbox correcto para el iframe de EroAdvertising
if [ -f js/ads-ero-ctrl.js ]; then
  perl -0777 -pe 's/sandbox="[^"]*"/sandbox="allow-scripts allow-same-origin allow-popups"/g' -i js/ads-ero-ctrl.js || true
  echo "🔧 EroAdvertising: sandbox => allow-scripts allow-same-origin allow-popups"
fi

# 6) Commit + Deploy (Vercel)
git add index.html js/ads-exo-bottom.js js/ads-ero-ctrl.js 2>/dev/null || true
git commit -m "ads: EXO sticky bottom (sin rellenos), padding dinámico + sandbox Ero" || true

vercel link --project ibizagirl-final --yes >/dev/null
LOG="$(mktemp)"
vercel deploy --prod --yes | tee "$LOG" >/dev/null
URL="$(awk '/Production: https:\/\//{print $3}' "$LOG" | tail -n1)"
echo "🔗 Production: $URL"
echo "== Hecho =="
echo "Comprueba en consola:"
echo "• [exo-bottom] no messages de error"
echo "• aparece un <iframe> dentro de #ad-bottom (o se oculta si no hay fill)"
