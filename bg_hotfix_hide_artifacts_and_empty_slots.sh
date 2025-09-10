#!/usr/bin/env bash
# bg_hotfix_hide_artifacts_and_empty_slots.sh
# - No toca la lógica de anuncios existente.
# - Mantiene: laterales (#ad-left/#ad-right/.ad-left/.ad-right) y el inferior (#ad-bottom/#ad-sticky-bottom/.ad-bottom/.ad-sticky-bottom).
# - Oculta SOLO contenedores de anuncios vacíos (sin iframe/img/ins) y el artefacto visual sobre el menú.

set -euo pipefail

TEAM="oriols-projects-ed6b9b04"
PROJECT="beachgirl-deployable2"

echo "== 0) Prechequeos =="
[ -d .git ] || { echo "❌ No veo .git. Sitúate en la carpeta del repo."; exit 1; }
[ -f index.html ] || { echo "❌ No encuentro index.html en la raíz (Output Directory='.' en Vercel)."; exit 1; }
mkdir -p public/js

echo "== 1) Añadir hotfix JS (oculta artefacto y SOLO slots vacíos; respeta anuncios buenos) =="
cat > public/js/ibg-hide-empty-ads.js <<'JS'
(function () {
  try {
    // --- 1) Quitar artefacto encima del menú (si existe) ---
    var header = document.querySelector('header');
    if (header) {
      var next = header.nextElementSibling;
      if (next && next.offsetHeight <= 4) {
        next.style.setProperty('display','none','important');
        next.style.setProperty('visibility','hidden','important');
        next.style.setProperty('height','0','important');
        next.style.setProperty('margin','0','important');
        next.style.setProperty('padding','0','important');
        next.style.setProperty('border','0','important');
      }
    }
    document.querySelectorAll('.artifact,.menu-artifact,.top-artifact').forEach(function(el){
      el.style.setProperty('display','none','important');
      el.style.setProperty('visibility','hidden','important');
      el.style.setProperty('height','0','important');
      el.style.setProperty('margin','0','important');
      el.style.setProperty('padding','0','important');
      el.style.setProperty('border','0','important');
    });

    // --- 2) Ocultar SOLO contenedores de anuncios VACÍOS, excepto los permitidos (laterales + inferior bueno) ---
    var WHITELIST_IDS = new Set(['ad-left','ad-right','ad-bottom','ad-sticky-bottom']);
    function isWhitelisted(el){
      if (el.id && WHITELIST_IDS.has(el.id)) return true;
      var cl = el.classList || {contains: function(){return false;}};
      return cl.contains('ad-left') || cl.contains('ad-right') || cl.contains('ad-bottom') || cl.contains('ad-sticky-bottom');
    }
    function hasAdContent(el){
      // Consideramos que hay anuncio si contiene iframe, ins (algunos adnetworks), o img
      // o si hay un script de proveedor dentro
      return !!el.querySelector('iframe,ins,img,script[src*="ads"],script[data-ad],div[id^="beacon_"]');
    }

    // Candidatos típicos a "slots"
    var candidates = Array.from(document.querySelectorAll(
      'div[id*="ad"],div[class*="ad"],section[class*="ad"],aside[class*="ad"]'
    ));

    candidates.forEach(function(el){
      // No tocar los que sabemos que deben permanecer
      if (isWhitelisted(el)) return;

      // Si no hay contenido publicitario, ocultar
      if (!hasAdContent(el)) {
        el.style.setProperty('display','none','important');
        el.style.setProperty('visibility','hidden','important');
        el.style.setProperty('height','0','important');
        el.style.setProperty('margin','0','important');
        el.style.setProperty('padding','0','important');
        el.style.setProperty('border','0','important');
      }
    });

    // Extra: si existe una fila/contenedor inferior de "múltiples slots" vacíos, ocúltala
    var bottomGroups = document.querySelectorAll('#ad-bottom-row,.ad-bottom-row,.ads-bottom-row,.ads-row-bottom');
    bottomGroups.forEach(function(row){
      if (!isWhitelisted(row) && !hasAdContent(row)) {
        row.style.setProperty('display','none','important');
        row.style.setProperty('visibility','hidden','important');
        row.style.setProperty('height','0','important');
        row.style.setProperty('margin','0','important');
        row.style.setProperty('padding','0','important');
        row.style.setProperty('border','0','important');
      }
    });
  } catch(e) {
    console && console.warn && console.warn('[ibg-hide-empty-ads] fallo no crítico:', e);
  }
})();
JS

echo "== 2) Inyectar el hotfix JS en index.html (antes de </body>, una sola vez) =="
if ! grep -q 'src="/js/ibg-hide-empty-ads.js"' index.html; then
  # Insertar justo antes de </body>
  awk 'BEGIN{IGNORECASE=1}
  {
    if (!done && /<\/body>/) {
      print "  <script src=\"/js/ibg-hide-empty-ads.js\"></script>";
      done=1;
    }
    print $0;
  }' index.html > index.html.__tmp && mv index.html.__tmp index.html
else
  echo "ℹ️ Ya estaba inyectado /js/ibg-hide-empty-ads.js"
fi

echo "== 3) Commit & push (no se toca nada más) =="
git add index.html public/js/ibg-hide-empty-ads.js
git commit -m "hotfix(home): hide header artifact and empty bottom ad slots (keep side+bottom ads intact)" || echo "ℹ️ Nada que commitear."
git pull --rebase origin main
git push origin main

echo "== 4) Deploy Producción (Vercel) =="
vercel link --yes --project "${PROJECT}" --scope "${TEAM}" >/dev/null || true
vercel pull --yes --environment=production --scope "${TEAM}" >/dev/null || true
OUT="$(vercel deploy --prod --yes --scope "${TEAM}")" || true
echo "${OUT}"
URL="$(printf "%s\n" "${OUT}" | awk '/^https?:\/\/[a-zA-Z0-9\.\-]+/ {print $0}' | tail -n1)"
[ -n "${URL:-}" ] && echo "✅ Production: ${URL}" || echo "⚠️  Revisa la salida anterior; no se detectó URL."
echo "Listo."
