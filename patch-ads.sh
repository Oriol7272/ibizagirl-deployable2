#!/usr/bin/env bash
set -euo pipefail

echo "== PATCH: EXO sticky bottom + PopAds =="

# --- A) Comprobación rápida de env inline (solo log informativo)
if [[ -f js/env-inline.js ]]; then
  if ! grep -q EXOCLICK_BOTTOM_ZONE js/env-inline.js; then
    echo "⚠️  js/env-inline.js no contiene EXOCLICK_BOTTOM_ZONE (asegura redeploy con la var)."
  fi
else
  echo "ℹ️  No existe js/env-inline.js (lo ignoro)."
fi

# --- B) Contenedor y CSS del banner inferior
if ! grep -q 'id="ad-bottom"' index.html; then
  awk 'BEGIN{ins=0}
       /<\/body>/{ if(!ins){print "  <div id=\"ad-bottom\" class=\"ad-bottom\"></div>"; ins=1} }
       {print}' index.html > .tmp && mv .tmp index.html
  echo "➕ Insertado <div id=\"ad-bottom\"> en index.html"
else
  echo "✅ index.html ya tiene #ad-bottom"
fi

if ! grep -q 'ads-bottom-css' index.html; then
  awk 'BEGIN{
         css="  <style id=\"ads-bottom-css\">\n"
         css=css"  #ad-bottom{position:fixed;left:0;right:0;bottom:0;z-index:99999;display:flex;justify-content:center;pointer-events:auto}\n"
         css=css"  #ad-bottom ins{display:block;min-height:90px;width:min(100%,980px)}\n"
         css=css"  body{padding-bottom:calc(90px + env(safe-area-inset-bottom))}\n"
         css=css"  @media (max-width:768px){ #ad-bottom ins{min-height:60px} body{padding-bottom:calc(60px + env(safe-area-inset-bottom))} }\n"
         css=css"  </style>\n"
       }
       /<\/head>/{print css; print; next}{print}' index.html > .tmp && mv .tmp index.html
  echo "➕ CSS bottom inyectado"
else
  echo "✅ CSS bottom ya presente"
fi

# --- C) Loader del sticky bottom (EXO / magsrv)
mkdir -p js
cat > js/ads-exo-bottom.js <<'EOF'
(function(){
  var E = (window.__ENV||{});
  var Z = E.EXOCLICK_BOTTOM_ZONE || E.EXOCLICK_ZONE; // fallback
  if(!Z){ console.log('[ads-exo-bottom] no zone id (EXOCLICK_BOTTOM_ZONE/EXOCLICK_ZONE)'); return; }

  if(window.__IBG_EXO_BOTTOM_MOUNTED){ return; }
  window.__IBG_EXO_BOTTOM_MOUNTED = true;

  function loadProv(cb){
    if(window.AdProvider){ cb&&cb(); return; }
    var s=document.createElement('script');
    s.id='exo-prov';
    s.src='https://a.magsrv.com/ad-provider.js';
    s.async=true;
    s.onload=function(){ cb&&cb(); };
    (document.head||document.documentElement).appendChild(s);
  }

  function mount(){
    var host=document.getElementById('ad-bottom');
    if(!host){ console.log('[ads-exo-bottom] no #ad-bottom'); return; }
    host.innerHTML='';
    var ins=document.createElement('ins');
    ins.className='eas6a97888e17';
    ins.setAttribute('data-zoneid', String(Z));
    ins.setAttribute('data-block-ad-types','0');
    ins.style.display='block';
    ins.style.minHeight=(window.innerWidth<=768?'60px':'90px');
    host.appendChild(ins);

    (window.AdProvider=window.AdProvider||[]).push({serve:{}});
    console.log('IBG_ADS: EXO bottom mounted ->', Z);

    // Si no aparece, reintento suave
    setTimeout(function(){
      if(!host.querySelector('iframe')){
        console.log('[ads-exo-bottom] reintento (no iframe tras 4s)');
        (window.AdProvider=window.AdProvider||[]).push({serve:{}});
      }
    }, 4000);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', function(){ loadProv(mount); });
  }else{
    loadProv(mount);
  }
})();
EOF

# --- D) PopAds loader (desde env)
cat > js/ads-popads.js <<'EOF'
(function(){
  var E=(window.__ENV||{});
  if(String(E.POPADS_ENABLE)!=='1'){ return; }
  var SID=E.POPADS_SITE_ID;
  if(!SID){ console.log('[ads-popads] no POPADS_SITE_ID en __ENV'); return; }

  if(window.__IBG_POPADS_MOUNTED){ return; }
  window.__IBG_POPADS_MOUNTED = true;

  // Inyecta el snippet oficial con el siteId del entorno
  var code = "(function(){var x=window,u='e494ffb82839a29122608e933394c091',a=[['siteId',"+SID+"],['minBid',0],['popundersPerIP','0'],['delayBetween',0],['default',false],['defaultPerDay',0],['topmostLayer','auto']],d=['d3d3LnByZW1pdW12ZXJ0aXNpbmcuY29tL2Vmb3JjZS5taW4uY3Nz','ZDJqMDQyY2oxNDIxd2kuY2xvdWRmcm9udC5uZXQvcllYUi9sYWZyYW1lLWFyLm1pbi5qcw==','d3d3LmRkc3Z3dnBycXYuY29tL2Zmb3JjZS5taW4uY3Nz','d3d3LmZqdGVkdHhxYWd1YmphLmNvbS9pcFUvYWFmcmFtZS1hci5taW4uanM='],h=-1,w,t,f=function(){clearTimeout(t);h++;if(d[h]&&!(1782994233000<(new Date).getTime()&&1<h)){w=x.document.createElement('script');w.type='text/javascript';w.async=!0;var n=x.document.getElementsByTagName('script')[0];w.src='https://'+atob(d[h]);w.crossOrigin='anonymous';w.onerror=f;w.onload=function(){clearTimeout(t);x[u.slice(0,16)+u.slice(0,16)]||f()};t=setTimeout(f,5E3);n.parentNode.insertBefore(w,n)}};if(!x[u]){try{Object.freeze(x[u]=a)}catch(e){}f()}})();";
  var s=document.createElement('script');
  s.type='text/javascript';
  s.async=true;
  s.text = code;
  (document.head||document.documentElement).appendChild(s);
  console.log('IBG_ADS: POP mounted ->', SID);
})();
EOF

# --- E) Referencias de scripts en <head>
add_script () {
  local file="$1"
  if ! grep -q "/js/$file" index.html; then
    awk -v tag="  <script defer src=\"/js/$file\"></script>" '
      /<\/head>/{ print tag; print; next } { print }' index.html > .tmp && mv .tmp index.html
    echo "➕ Añadido /js/$file a <head>"
  else
    echo "✅ /js/$file ya referenciado"
  fi
}
add_script "ads-exo-bottom.js"
add_script "ads-popads.js"

# --- F) Commit & Deploy
git add index.html js/ads-exo-bottom.js js/ads-popads.js || true
git commit -m "ads: EXO sticky bottom (5717078) + PopAds loader robusto" || true

vercel link --project ibizagirl-final --yes
LOG="$(mktemp)"
vercel deploy --prod --yes | tee "$LOG"
URL="$(awk '/Production: https:\/\//{print $3}' "$LOG" | tail -n1)"
echo "🔗 Production: $URL"

echo ""
echo "== Cómo verificar =="
echo "• En consola debe salir: 'IBG_ADS: EXO bottom mounted -> 5717078'"
echo "• Network: a.magsrv.com/ad-provider.js (200) y llamadas a s.magsrv.com"
echo "• DOM: #ad-bottom > <ins ...> y aparece <iframe> a los 1–3s"
echo "• Para PopAds: 'IBG_ADS: POP mounted -> 5226758' (si ves 'no POPADS_SITE_ID', redeploy con la var)"
