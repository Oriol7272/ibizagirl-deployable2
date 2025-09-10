#!/usr/bin/env bash
# Limpia archivos innecesarios, oculta artefactos/slots vacíos vía CSS,
# commitea, pushea y despliega a producción en Vercel.

set -euo pipefail

TEAM="oriols-projects-ed6b9b04"
PROJECT="beachgirl-deployable2"

echo "== 0) Prechequeos =="
[ -f "index.html" ] || { echo "❌ No encuentro index.html en la raíz."; exit 1; }
[ -d "public" ] || { echo "❌ Falta carpeta ./public."; exit 1; }

echo "== 1) Borrado seguro de temporales, pruebas y legacy =="
# Temporales/0 bytes
rm -f index.html.__tmp* || true
# Si favicon.ico existe y pesa 0, eliminarlo (un favicon vacío no sirve)
if [ -f public/favicon.ico ] && [ ! -s public/favicon.ico ]; then
  rm -f public/favicon.ico
fi

# Pruebas / utilidades locales que no deben ir a prod
rm -f ads/test-exo.html ads/test-pop.html ads/test-popads.html 2>/dev/null || true
rm -f snippets/popads.html 2>/dev/null || true
rm -f test.html 2>/dev/null || true
rm -f tools/audit-full.js 2>/dev/null || true
rm -f .DS_Store 2>/dev/null || true
rm -f Thumbs.db 2>/dev/null || true
rm -rf AUDIT_* 2>/dev/null || true
rm -f backup_local_*.tar.gz 2>/dev/null || true

# Artefactos de Vercel heredados
rm -rf .vercel 2>/dev/null || true
rm -f vercel-build.sh 2>/dev/null || true
rm -f vercel.json 2>/dev/null || true

# .gitkeep vacíos si ya hay contenido real
[ -f css/.gitkeep ] && rm -f css/.gitkeep || true
[ -f js/.gitkeep ] && rm -f js/.gitkeep || true

echo "== 2) Parche visual: quitar artefacto del header y slots vacíos (sin tocar slots buenos) =="
# Insertamos un bloque <style> antes de </head> si no existe ya
HOTFIX_CSS='  <style id="ibg-cleanup-css">
    /* Oculta artefacto fino sobre el menú (clases típicas y cualquier div alto <= 2px al inicio) */
    header + .artifact, .top-artifact, .menu-artifact { display:none !important; }
    body > .artifact, body > .decorative-line { display:none !important; }
    body > div[style*="height:1px"], body > div[style*="height:2px"] { display:none !important; }

    /* Mantener visibles ÚNICAMENTE estos contenedores de anuncios: */
    #ad-left, .ad-left, #ad-right, .ad-right, #ad-sticky-bottom, .ad-sticky-bottom { display:block !important; }

    /* Cualquier otro contenedor ad-* que no sea los de arriba, ocultarlo */
    [id^="ad-"], .ad-slot, .ad-placeholder, .ad-bottom-row {
      display:none !important;
      visibility:hidden !important;
      height:0 !important; margin:0 !important; padding:0 !important;
      border:0 !important; outline:0 !important;
    }
    /* Asegura que el sticky bottom real se vea */
    #ad-sticky-bottom, .ad-sticky-bottom { display:block !important; visibility:visible !important; }

    /* No romper layout del main */
    .gallery-section, .carousel-section, main, .content-center { margin-bottom: 0 !important; padding-bottom: 0 !important; }
  </style>'

# Solo inserta si no está ya metido
if ! grep -q 'id="ibg-cleanup-css"' index.html 2>/dev/null; then
  awk -v inj="$HOTFIX_CSS" 'BEGIN{IGNORECASE=1} {sub(/<\/head>/, inj "\n</head>"); print}' index.html > index.html.__tmp && mv index.html.__tmp index.html
fi

echo "== 3) Asegurar ENV de PopAds/Exo en inline (no cambia IDs si ya están) =="
mkdir -p public/js
if [ ! -f public/js/env-ads-inline.js ]; then
  cat > public/js/env-ads-inline.js <<'JS'
/* Inline env de anuncios (pop/exo/ero) */
window.__IBG_ADS = window.__IBG_ADS || {};
Object.assign(window.__IBG_ADS, {
  EXOCLICK_ZONES: "5696328,5705186",    // L, R
  EXOCLICK_ZONE: "5696328",             // fallback
  EXOCLICK_BOTTOM_ZONE: "5717078",      // sticky bottom
  POPADS_SITE_ID: "5226758",
  POPADS_ENABLE: 1
});
console.log('IBG_ADS ZONES ->', window.__IBG_ADS);
JS
else
  # Rellena claves si faltan sin romper las existentes
  node - <<'NODE'
const fs=require('fs'); const p='public/js/env-ads-inline.js';
let s=fs.readFileSync(p,'utf8');
function ensure(k,v){
  if(!new RegExp(k).test(s)){
    s=s.replace(/window\.__IBG_ADS\s*=\s*window\.__IBG_ADS\s*\|\|\s*{};?/,
      'window.__IBG_ADS = window.__IBG_ADS || {};\nwindow.__IBG_ADS.'+k+' = "'+v+'";');
  }
}
if(!/window\.__IBG_ADS/.test(s)){
  s=`window.__IBG_ADS = window.__IBG_ADS || {};\n`+s;
}
ensure('EXOCLICK_ZONES','5696328,5705186');
ensure('EXOCLICK_ZONE','5696328');
ensure('EXOCLICK_BOTTOM_ZONE','5717078');
ensure('POPADS_SITE_ID','5226758');
if(/POPADS_ENABLE\s*:\s*0/.test(s)) s=s.replace(/POPADS_ENABLE\s*:\s*0/g,'POPADS_ENABLE: 1');
if(!/POPADS_ENABLE/.test(s)) s=s.replace(/window\.__IBG_ADS\s*=\s*window\.__IBG_ADS\s*\|\|\s*{};?/,
  'window.__IBG_ADS = window.__IBG_ADS || {};\nwindow.__IBG_ADS.POPADS_ENABLE = 1;');
fs.writeFileSync(p,s);
NODE
fi

echo "== 4) Git commit & push =="
git checkout main >/dev/null 2>&1 || true
git pull --rebase origin main
git add -A
git commit -m "chore(cleanup): remove temp/tests/legacy; add CSS to hide header artifact & empty ad slots; ensure inline ads env" || echo "ℹ️ Nada que commitear."
git push origin main

echo "== 5) Deploy producción (Vercel) =="
V_OUT="$(vercel link --yes --project "$PROJECT" --scope "$TEAM" 2>/dev/null || true)"
V_OUT="$(vercel pull --yes --environment=production --scope "$TEAM" 2>/dev/null || true)"
OUT="$(vercel deploy --prod --yes --scope "$TEAM" || true)"
echo "$OUT"
URL="$(printf "%s\n" "$OUT" | awk '/^https?:\/\//{print $0}' | tail -n1)"
[ -n "${URL:-}" ] && echo "✅ Production: $URL" || echo "⚠️ Revisa la salida; no pude detectar la URL."

echo
echo "== 6) Checklist en consola del navegador =="
echo " - LATERALES: deben verse L (5696328) y R (5705186)."
echo " - BOTTOM: debe verse sticky (5717078) y NO debe salir 'missing EXOCLICK_BOTTOM_ZONE'."
echo " - POPADS: debe montar sin 'disabled or no site id'."
echo " - ARTEFACTO: no debe verse línea/artefacto sobre el menú."
echo " - VACÍOS: no deben quedar rectángulos vacíos en la parte inferior."
