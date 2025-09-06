#!/usr/bin/env bash
set -euo pipefail

echo "== FIX: EXO sticky bottom =="

# --- A) Comprobar que la variable llega al bundle cliente
if ! grep -q 'EXOCLICK_BOTTOM_ZONE' js/env-inline.js 2>/dev/null; then
  echo "⚠️  No veo EXOCLICK_BOTTOM_ZONE en js/env-inline.js (revisa Vercel -> Production env y redeploy)."
else
  echo "✅ EXOCLICK_BOTTOM_ZONE presente en js/env-inline.js"
fi

# --- B) Asegurar contenedor y CSS en index.html
if ! grep -q 'id="ad-bottom"' index.html; then
  echo "➡️  Insertando <div id=\"ad-bottom\"> antes de </body>"
  perl -0777 -pe 's@</body>@\n  <div id="ad-bottom" class="ad-bottom"></div>\n</body>@s' -i index.html
else
  echo "✅ Contenedor #ad-bottom ya existe"
fi

# CSS: altura y padding para que no tape contenido
if ! grep -q 'ads-bottom-css' index.html; then
  echo "➡️  Inyectando CSS para #ad-bottom"
  perl -0777 -pe 's@</head>@  <style id="ads-bottom-css">
  #ad-bottom{position:fixed;left:0;right:0;bottom:0;z-index:99999;display:flex;justify-content:center;pointer-events:auto;background:rgba(0,0,0,.02);backdrop-filter:blur(2px)}
  #ad-bottom ins{display:block;min-height:90px;width:min(100%,980px)}
  body{padding-bottom:calc(90px + env(safe-area-inset-bottom))}
  @media (max-width:768px){ #ad-bottom ins{min-height:60px} body{padding-bottom:calc(60px + env(safe-area-inset-bottom))} }
  </style>
</head>@s' -i index.html
else
  echo "✅ CSS bottom ya presente"
fi

# --- C) Asegurar que cargamos el orquestador y el módulo del bottom
ensure_script() {
  local file="$1"
  if ! grep -q "/js/$file" index.html; then
    echo "➡️  Añadiendo <script defer src=\"/js/$file\">"
    perl -0777 -pe "s@</head>@  <script defer src=\"/js/$file\"></script>\n</head>@s" -i index.html
  else
    echo "✅ /js/$file ya referenciado"
  fi
}
ensure_script "ads.js"              # si ya lo tienes, se omite
ensure_script "ads-exo-bottom.js"   # módulo específico del sticky bottom

# --- D) Escribir/actualizar js/ads-exo-bottom.js
mkdir -p js
cat > js/ads-exo-bottom.js <<'EOF'
(function(){
  // EXO Sticky Bottom con AdProvider (magsrv)
  var E = (window.__ENV||{});
  var Z = E.EXOCLICK_BOTTOM_ZONE;   // p.ej. 5716852
  if(!Z){ console.log('[ads-exo-bottom] no EXOCLICK_BOTTOM_ZONE en __ENV'); return; }

  // Evita montarlo dos veces
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
    // vacía y mete el <ins>
    host.innerHTML = '';
    var ins = document.createElement('ins');
    // Muchos snippets de Exo usan esta clase "eas..." – la incluimos para máxima compatibilidad
    ins.className = 'eas6a97888e17';
    ins.setAttribute('data-zoneid', String(Z));
    ins.setAttribute('data-block-ad-types','0');
    ins.style.display = 'block';
    ins.style.minHeight = (window.innerWidth<=768?'60px':'90px');
    host.appendChild(ins);

    // Sirve el anuncio
    (window.AdProvider = window.AdProvider || []).push({serve:{}});
    console.log('IBG_ADS: EXO bottom mounted ->', Z);

    // Fallback: si a los 4s no hay iframe dentro, reintenta 1 vez
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

# --- E) (Opcional) Desactivar cualquier otro montaje bottom antiguo en ads.js
# (si tu ads.js ya monta bottom, mejor que no lo dupliques)
if grep -q 'ad-bottom' js/ads.js 2>/dev/null; then
  echo "ℹ️  He visto referencias a ad-bottom en js/ads.js; asegúrate de no duplicar el montaje."
fi

echo "== Commit =="
git add index.html js/ads-exo-bottom.js 2>/dev/null || true
git commit -m "ads: EXO sticky bottom robusto (magsrv), contenedor y CSS" || true

echo "== Deploy =="
vercel link --project ibizagirl-final --yes
LOG="$(mktemp)"
vercel deploy --prod --yes | tee "$LOG"
URL="$(awk '/Production: https:\/\//{print $3}' "$LOG" | tail -n1)"
echo "🔗 Production: $URL"

echo "== Qué validar =="
echo "1) window.__ENV.EXOCLICK_BOTTOM_ZONE en consola del navegador (debe tener tu zoneid)."
echo "2) Network: a.magsrv.com/ad-provider.js (200)."
echo "3) En consola: 'IBG_ADS: EXO bottom mounted -> <zone>'."
echo "4) DOM: #ad-bottom contiene <ins ...> y aparece un <iframe> dentro tras unos segundos."
