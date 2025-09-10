#!/usr/bin/env bash
set -euo pipefail

echo "== FIX EXO sticky bottom (sin Perl) =="

mkdir -p js
cat > js/ads-exo-bottom.js <<'EOF'
(function(){
  var E = (window.__ENV||{});
  var Z = E.EXOCLICK_BOTTOM_ZONE || E.EXOCLICK_ZONE;
  if(!Z){ console.log('[ads-exo-bottom] no zone id (EXOCLICK_BOTTOM_ZONE ni EXOCLICK_ZONE)'); return; }

  if(window.__IBG_EXO_BOTTOM_MOUNTED){ return; }
  window.__IBG_EXO_BOTTOM_MOUNTED = true;

  function loadProvider(cb){
    if(window.AdProvider){ cb&&cb(); return; }
    var s = document.createElement('script');
    s.src = 'https://a.magsrv.com/ad-provider.js';
    s.async = true;
    s.onload = function(){ cb&&cb(); };
    (document.head||document.documentElement).appendChild(s);
  }

  function mount(){
    var host = document.getElementById('ad-bottom');
    if(!host){ console.log('[ads-exo-bottom] no #ad-bottom'); return; }
    host.innerHTML = '';
    var ins = document.createElement('ins');
    ins.className = 'eas6a97888e17';
    ins.setAttribute('data-zoneid', String(Z));
    ins.setAttribute('data-block-ad-types','0');
    ins.style.display = 'block';
    ins.style.minHeight = (window.innerWidth<=768?'60px':'90px');
    host.appendChild(ins);

    (window.AdProvider = window.AdProvider || []).push({serve:{}});
    console.log('IBG_ADS: EXO bottom mounted ->', Z);

    setTimeout(function(){
      if(!host.querySelector('iframe')){
        console.log('[ads-exo-bottom] no iframe tras 4s, reintento');
        (window.AdProvider = window.AdProvider || []).push({serve:{}});
      }
    }, 4000);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ loadProvider(mount); });
  } else {
    loadProvider(mount);
  }
})();
EOF

# Añadir contenedor #ad-bottom antes de </body>
if ! grep -q 'id="ad-bottom"' index.html; then
  awk 'BEGIN{added=0}
       /<\/body>/{ if(!added){ print "  <div id=\"ad-bottom\" class=\"ad-bottom\"></div>"; added=1 } }
       { print }' index.html > .tmp.index && mv .tmp.index index.html
  echo "➕ Insertado <div id=\"ad-bottom\">"
else
  echo "✅ #ad-bottom ya existe"
fi

# CSS para bottom antes de </head>
if ! grep -q 'ads-bottom-css' index.html; then
  awk 'BEGIN{
         css="  <style id=\"ads-bottom-css\">\n"
         css=css "  #ad-bottom{position:fixed;left:0;right:0;bottom:0;z-index:99999;display:flex;justify-content:center;pointer-events:auto;background:rgba(0,0,0,.02);backdrop-filter:blur(2px)}\n"
         css=css "  #ad-bottom ins{display:block;min-height:90px;width:min(100%,980px)}\n"
         css=css "  body{padding-bottom:calc(90px + env(safe-area-inset-bottom))}\n"
         css=css "  @media (max-width:768px){ #ad-bottom ins{min-height:60px} body{padding-bottom:calc(60px + env(safe-area-inset-bottom))} }\n"
         css=css "  </style>\n"
       }
       /<\/head>/{ print css; print; next }
       { print }' index.html > .tmp.head && mv .tmp.head index.html
  echo "➕ CSS del bottom insertado"
else
  echo "✅ CSS del bottom ya está"
fi

# Referenciar script en <head>
if ! grep -q '/js/ads-exo-bottom.js' index.html; then
  awk -v tag='  <script defer src="/js/ads-exo-bottom.js"></script>' '
    /<\/head>/{ print tag; print; next } { print }' index.html > .tmp.s && mv .tmp.s index.html
  echo "➕ Añadido /js/ads-exo-bottom.js"
else
  echo "✅ /js/ads-exo-bottom.js ya referenciado"
fi

git add index.html js/ads-exo-bottom.js || true
git commit -m "ads: EXO sticky bottom fiable (magsrv), contenedor y CSS" || true

vercel link --project beachgirl-final --yes
LOG="$(mktemp)"; vercel deploy --prod --yes | tee "$LOG"
URL="$(awk '/Production: https:\/\//{print $3}' "$LOG" | tail -n1)"
echo "🔗 Production: $URL"

echo "== Verifica en el navegador =="
echo "• console: 'IBG_ADS: EXO bottom mounted -> <zone>'"
echo "• window.__ENV.EXOCLICK_BOTTOM_ZONE || window.__ENV.EXOCLICK_ZONE"
echo "• network: a.magsrv.com/ad-provider.js (200) y un iframe dentro de #ad-bottom"
