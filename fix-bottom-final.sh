#!/usr/bin/env bash
set -euo pipefail

STICKY_ZONE="${STICKY_ZONE:-5717078}"   # <-- tu zona de EXO Sticky

echo "▶ Contenedor + data-zone"
# A) Asegurar el contenedor con data-zone
if grep -q 'id="ad-bottom"' index.html; then
  # si existe, añade/actualiza el data-zone
  perl -0777 -pe "s@(<div[^>]*id=['\"]ad-bottom['\"][^>]*)(>)@sprintf(\"%s data-zone=\\\"%s\\\"%s\",\$1,'${STICKY_ZONE}',\$2)@e if !/id=['\"]ad-bottom['\"][^>]*data-zone=/s" -i index.html
else
  awk -v div="  <div id=\"ad-bottom\" class=\"ad-bottom\" data-zone=\"${STICKY_ZONE}\"></div>" '
    /<\/body>/{print div; print; next} {print}
  ' index.html > .tmp && mv .tmp index.html
fi

echo "▶ CSS"
# B) CSS mínimo para el sticky
if ! grep -q 'ads-bottom-css' index.html; then
  awk 'BEGIN{
     css="  <style id=\"ads-bottom-css\">"
     css=css "#ad-bottom{position:fixed;left:0;right:0;bottom:0;z-index:99999;display:flex;justify-content:center}"
     css=css "#ad-bottom ins{display:block;min-height:90px;width:min(100%,980px)}"
     css=css "@media(max-width:768px){#ad-bottom ins{min-height:60px}}"
     css=css "</style>\n"
   }
   /<\/head>/{print css; print; next} {print}
  ' index.html > .tmp && mv .tmp index.html
fi

echo "▶ Loader js/ads-exo-bottom.js"
# C) Loader robusto: usa __ENV.EXOCLICK_BOTTOM_ZONE o data-zone (o ambos)
mkdir -p js
cat > js/ads-exo-bottom.js <<'EOF'
(function(){
  if(window.__IBG_EXO_BOTTOM_MOUNTED){return;}
  window.__IBG_EXO_BOTTOM_MOUNTED = true;

  function getZone(){
    var host = document.getElementById('ad-bottom');
    var z = (window.__ENV && (window.__ENV.EXOCLICK_BOTTOM_ZONE || window.__ENV.EXOCLICK_ZONE)) || null;
    if(!z && host){ z = host.getAttribute('data-zone'); }
    return z;
  }

  function loadProvider(cb){
    if(window.AdProvider){ cb&&cb(); return; }
    var s = document.createElement('script');
    s.src = 'https://a.magsrv.com/ad-provider.js';
    s.async = true;
    s.onload = function(){ cb&&cb(); };
    (document.head||document.documentElement).appendChild(s);
  }

  function mountWith(zone){
    var host = document.getElementById('ad-bottom');
    if(!host){ console.log('[ads-exo-bottom] no #ad-bottom'); return; }
    host.innerHTML = '';
    var ins = document.createElement('ins');
    ins.className = 'eas6a97888e17';
    ins.setAttribute('data-zoneid', String(zone));
    ins.setAttribute('data-block-ad-types','0');
    ins.style.display = 'block';
    ins.style.minHeight = (window.innerWidth<=768?'60px':'90px');
    host.appendChild(ins);

    (window.AdProvider = window.AdProvider || []).push({serve:{}});
    console.log('IBG_ADS: EXO bottom mounted ->', zone);

    setTimeout(function(){
      if(!host.querySelector('iframe')){
        console.log('[ads-exo-bottom] reintento (no iframe tras 4s)');
        (window.AdProvider = window.AdProvider || []).push({serve:{}});
      }
    }, 4000);
  }

  // Espera breve a que __ENV llegue; si no, usa data-zone
  var t0 = Date.now();
  (function waitZone(){
    var z = getZone();
    if(!z && Date.now()-t0 < 2000){ return setTimeout(waitZone, 100); }
    if(!z){ console.log('[ads-exo-bottom] usando fallback data-zone/const'); z = getZone(); }
    if(!z){ console.log('[ads-exo-bottom] sin zone -> abort'); return; }
    console.log('[ads-exo-bottom] zone chosen ->', z);
    loadProvider(function(){ mountWith(z); });
  })();
})();
EOF

echo "▶ Referencia del loader al final del <body> (evita que __ENV lo pise)"
if ! grep -q '/js/ads-exo-bottom.js' index.html; then
  awk 'BEGIN{tag="  <script defer src=\"/js/ads-exo-bottom.js\"></script>"} /<\/body>/{print tag; print; next} {print}' index.html > .tmp && mv .tmp index.html
fi

git add index.html js/ads-exo-bottom.js || true
git commit -m "fix(sticky): bottom EXO robusto leyendo data-zone + __ENV; orden de carga" || true

vercel link --project beachgirl-final --yes
LOG="$(mktemp)"; vercel deploy --prod --yes | tee "$LOG"
URL="$(awk "/Production: https:\/\//{print \$3}" "$LOG" | tail -n1)"
echo "🔗 Production: $URL"
echo "Abre la home y comprueba en consola: 'zone chosen -> <tu zona>' y 'EXO bottom mounted -> <tu zona>'."
