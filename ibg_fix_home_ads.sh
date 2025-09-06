#!/usr/bin/env bash
set -euo pipefail

TEAM="oriols-projects-ed6b9b04"
PROJECT="ibizagirl-deployable2"

echo "== 0) Verificaciones previas =="
[ -d .git ] || { echo "❌ No estás en la raíz del repo (no hay .git)"; exit 1; }
[ -f index.html ] || { echo "❌ Falta index.html en la raíz (Output Directory es '.')."; exit 1; }
mkdir -p public/js

echo "== 1) Forzar ENV inline de anuncios =="
cat > public/js/env-ads-inline.js <<'JS'
/* ENV de anuncios en línea (antes de loaders) */
window.__IBG_ADS = {
  EXOCLICK_ZONES: "5696328,5705186",   // L,R
  EXOCLICK_ZONE: "5696328",            // fallback
  EXOCLICK_BOTTOM_ZONE: "5717078",     // sticky bottom
  POPADS_ENABLE: 1,
  POPADS_SITE_ID: "5226758",
  EROADVERTISING_CTRL: "798544",
  EROADVERTISING_PID: "152716",
  EROADVERTISING_SPACE: "8182057",
  EROADVERTISING_ZONE: "8177575"
};
console.log('IBG_ADS ZONES ->', window.__IBG_ADS);
JS

echo "== 2) Inyectar <script src=\"/js/env-ads-inline.js\"> tras <head> si no está =="
if ! grep -qiE '<script[^>]+src="/js/env-ads-inline\.js"' index.html; then
  awk 'BEGIN{IGNORECASE=1}
  {
    print $0;
    if ($0 ~ /<head[^>]*>/ && !inserted) {
      print "  <script src=\"/js/env-ads-inline.js\"></script>";
      inserted=1;
    }
  }' index.html > index.html.__tmp && mv index.html.__tmp index.html
fi

echo "== 3) Inyectar CSS: ocultar artefacto y slots vacíos, mantener L/R+bottom =="
# Inserta estilos anti-artefacto/slots vacíos justo antes de </head> (idempotente)
if ! grep -q 'id="ibg-hotfix-ads-css"' index.html; then
  awk 'BEGIN{IGNORECASE=1}
  { 
    sub(/<\/head>/,
      "<style id=\"ibg-hotfix-ads-css\">\n"\
      "  /* Artefacto encima del menú */\n"\
      "  header + .artifact, .top-artifact, .menu-artifact { display:none !important; height:0!important; }\n"\
      "  /* Ocultar slots vacíos inferiores (gris/transparente) y placeholders comunes */\n"\
      "  .ad-placeholder, .ad-empty, .ad-row-empty, .ad-bottom-empty,\n"\
      "  .ad-box:empty, .ad-row:empty, .ads-bottom-row:empty { display:none !important; height:0!important; margin:0!important; padding:0!important; border:0!important; }\n"\
      "  /* Asegurar visibilidad de los que sí queremos */\n"\
      "  #ad-left, #ad-right, #ad-sticky-bottom,\n"\
      "  .ad-left, .ad-right, .ad-sticky-bottom { display:block !important; }\n"\
      "</style>\n</head>"); 
    print $0
  }' index.html > index.html.__tmp && mv index.html.__tmp index.html
fi

echo "== 4) Asegurar contenedores de anuncios (crear si faltan, sin duplicar) =="
# 4.1 Laterales fijos (si no existen, los añadimos como fixed sin romper layout)
if ! grep -qi 'id="ad-left"' index.html; then
  awk 'BEGIN{IGNORECASE=1}
  {
    if ($0 ~ /<body[^>]*>/ && !inserted_left) {
      print $0;
      print "<div id=\"ad-left\" style=\"position:fixed;left:0;top:90px;width:160px;height:600px;z-index:50;\"></div>";
      inserted_left=1; next;
    }
    print $0;
  }' index.html > index.html.__tmp && mv index.html.__tmp index.html
fi
if ! grep -qi 'id="ad-right"' index.html; then
  awk 'BEGIN{IGNORECASE=1}
  {
    if ($0 ~ /<body[^>]*>/ && !inserted_right) {
      print $0;
      print "<div id=\"ad-right\" style=\"position:fixed;right:0;top:90px;width:160px;height:600px;z-index:50;\"></div>";
      inserted_right=1; next;
    }
    print $0;
  }' index.html > index.html.__tmp && mv index.html.__tmp index.html
fi

# 4.2 Sticky bottom (si falta)
if ! grep -qi 'id="ad-sticky-bottom"' index.html; then
  awk 'BEGIN{IGNORECASE=1}
  {
    if ($0 ~ /<\/body>/ && !inserted_bottom) {
      print "<div id=\"ad-sticky-bottom\" style=\"position:fixed;left:0;right:0;bottom:0;margin:0 auto;max-width:970px;height:90px;z-index:60;\"></div>";
      inserted_bottom=1;
    }
    print $0;
  }' index.html > index.html.__tmp && mv index.html.__tmp index.html
fi

echo "== 5) Retirar nodos inferiores conocidos que generan huecos (si existen) =="
# Eliminamos contenedores habituales de huecos (sin afectar L/R/bottom)
# - clases genéricas de placeholders inferiores
sed -i '' -E '/class="(ad-placeholder|ad-empty|ad-row-empty|ad-bottom-empty|ads-bottom-row)"/Id' index.html || true
# - ids frecuentes de cajas inferiores (no esenciales)
sed -i '' -E '/id="(ad-bottom-a|ad-bottom-b|ad-bottom|ad-grid|ad-row)"/Id' index.html || true

echo "== 6) Git commit & push =="
git checkout main >/dev/null 2>&1 || true
git pull --rebase origin main
git add index.html public/js/env-ads-inline.js
git commit -m "home/ads: L/R + sticky bottom + PopAds; ocultar artefacto y slots vacíos" || echo "ℹ️ Nada que commitear."
git push origin main

echo "== 7) Deploy a Producción (Vercel) =="
vercel link --yes --project "${PROJECT}" --scope "${TEAM}" >/dev/null || true
vercel pull --yes --environment=production --scope "${TEAM}" >/dev/null || true
OUT="$(vercel deploy --prod --yes --scope "${TEAM}")"
echo "${OUT}"
URL="$(printf "%s\n" "${OUT}" | awk '/^https?:\/\/[a-zA-Z0-9\.\-]+/ {print $0}' | tail -n1)"
[ -n "${URL:-}" ] && echo "✅ Production: ${URL}" || echo "⚠️ Revisa la salida anterior para la URL"

echo
echo "== 8) Checklist post-deploy (abre en incógnito) =="
echo " • Debe aparecer: ad-left, ad-right y ad-sticky-bottom (con EXO ids)."
echo " • Consola: sin 'missing EXOCLICK_BOTTOM_ZONE'."
echo " • PopAds: verás '[ads-popads] POP mounted -> 5226758' (o similar)."
echo " • Sin artefacto encima del menú ni recuadros inferiores vacíos."
