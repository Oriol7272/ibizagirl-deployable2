#!/usr/bin/env bash
set -euo pipefail

echo "== Fix EXO bottom + PopAds + Deploy =="

# --- A) Comprobar que tenemos las variables en el bundle cliente
#      (deben estar definidas en Vercel entorno PRODUCTION y llegar a js/env-inline.js)
need() {
  local key="$1"
  if ! grep -q "$key" js/env-inline.js 2>/dev/null; then
    echo "⚠️  No veo ${key} en js/env-inline.js (¿faltó variable en Vercel Prod o redeploy?)."
  else
    echo "✅ ${key} presente en js/env-inline.js"
  fi
}
need 'EXOCLICK_BOTTOM_ZONE'
need 'POPADS_SITE_ID'

# --- B) Asegurar contenedor bottom y scripts en index.html
if ! grep -q 'id="ad-bottom"' index.html; then
  echo "➡️  Insertando <div id=\"ad-bottom\"> en index.html"
  # Inserta el contenedor justo antes de </body>
  perl -0777 -pe 's@</body>@\n  <div id="ad-bottom" class="ad-bottom" style="position:fixed;left:0;right:0;bottom:0;z-index:9999;display:flex;justify-content:center;pointer-events:auto"></div>\n</body>@s' -i index.html
else
  echo "✅ Contenedor #ad-bottom ya existe"
fi

ensure_script() {
  local file="$1"
  if ! grep -q "$file" index.html; then
    echo "➡️  Añadiendo <script defer src=\"/js/$file\"> a index.html"
    perl -0777 -pe "s@</head>@  <script defer src=\"/js/$file\"></script>\n</head>@s" -i index.html
  else
    echo "✅ /js/$file ya está referenciado en index.html"
  fi
}

# Orquestador (si ya lo tienes, perfecto)
ensure_script "ads.js"
# Módulo EXO bottom
ensure_script "ads-exo-bottom.js"
# Módulo PopAds
ensure_script "ads-popads.js"

# --- C) Escribir/actualizar js/ads-exo-bottom.js
mkdir -p js
cat > js/ads-exo-bottom.js <<'EOF'
(function(){
  // EXO sticky bottom mediante AdProvider (magsrv)
  var E = (window.__ENV||{});
  var Z = E.EXOCLICK_BOTTOM_ZONE;
  if(!Z){ console.log('[ads-exo-bottom] no EXOCLICK_BOTTOM_ZONE en __ENV'); return; }

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
    // Limpia e inserta <ins> fresh
    host.innerHTML = '';
    var ins = document.createElement('ins');
    // Usa tu zoneid real en EXOCLICK_BOTTOM_ZONE (ej. 5716852)
    ins.className = 'eas_shim';
    ins.setAttribute('data-zoneid', String(Z));
    ins.setAttribute('data-block-ad-types','0');
    host.appendChild(ins);
    // Sirve el anuncio
    (window.AdProvider = window.AdProvider || []).push({serve:{}});
    console.log('IBG_ADS: EXO bottom mounted ->', Z);
  }

  // Espera al DOM
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ loadProvider(mount); });
  } else {
    loadProvider(mount);
  }
})();
EOF

# --- D) Escribir/actualizar js/ads-popads.js
cat > js/ads-popads.js <<'EOF'
(function(){
  // PopAds: carga bajo interacción o al cabo de unos segundos
  var E = (window.__ENV||{});
  var SITE = E.POPADS_SITE_ID; // e.g. 5226758
  if(!SITE){ console.log('[ads-popads] no POPADS_SITE_ID en __ENV'); return; }

  function inject(){
    if(document.querySelector('script[data-popads="1"]')) return;
    var s = document.createElement('script');
    // Proxy propio que te entregamos para evitar CORS/UA issues
    s.src = '/api/ads/popjs?site='+encodeURIComponent(SITE);
    s.async = true;
    s.dataset.popads = '1';
    (document.head||document.documentElement).appendChild(s);
    console.log('IBG_ADS: POPADS injected ->', SITE);
  }

  // Primer clic del usuario
  window.addEventListener('click', function once(){
    inject(); window.removeEventListener('click', once);
  }, {once:true});

  // O a los 7–10s aleatorios
  var delay = 7000 + Math.floor(Math.random()*3000);
  setTimeout(inject, delay);
})();
EOF

# --- E) (Opcional) Asegurar que el build copia public/ads si la tienes
if grep -q 'copy_dir\s\+uncensored-videos' vercel-build.sh 2>/dev/null && ! grep -q 'copy_dir\s\+ads' vercel-build.sh 2>/dev/null; then
  echo "➡️  Añadiendo copy_dir ads al vercel-build.sh"
  perl -0777 -pe 's/(copy_dir\s+uncensored-videos\s*\n)/$1copy_dir  ads\n/s' -i vercel-build.sh
fi

echo "== Commit =="
git add index.html js/ads-exo-bottom.js js/ads-popads.js vercel-build.sh 2>/dev/null || true
git commit -m "ads: EXO sticky bottom + PopAds robusto; contenedor bottom; refs en index" || true

echo "== Deploy =="
vercel link --project beachgirl-final --yes
LOG="$(mktemp)"
vercel deploy --prod --yes | tee "$LOG"
URL="$(awk '/Production: https:\/\//{print $3}' "$LOG" | tail -n1)"
echo "🔗 Production: $URL"

echo "== Checks =="
echo "• Ver EXO bottom en la home (.vercel.app y dominio): debe cargar https://a.magsrv.com/ad-provider.js"
echo "• PopAds: tras 7–10s o primer click, debe pedirse $URL/api/ads/popjs?site=<SITE>"
echo "• En consola deben salir:"
echo "   - IBG_ADS: EXO bottom mounted -> <zone>"
echo "   - IBG_ADS: POPADS injected -> <site>"
