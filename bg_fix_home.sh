#!/usr/bin/env bash
# bg_fix_home.sh
# - Restaura anuncio derecho + mantiene sticky inferior
# - Re-asegura PopAds (sin duplicar)
# - Elimina SOLO slots vacíos inferiores
# - Quita artefacto encima del menú
# - No toca nada más

set -euo pipefail

TEAM="oriols-projects-ed6b9b04"
PROJECT="beachgirl-deployable2"

[ -f index.html ] || { echo "❌ No encuentro index.html en la raíz del repo."; exit 1; }
mkdir -p public/js

echo "== 1) Quitar hotfix anterior (si quedó) =="
# Si inyectamos algo llamado ibg-hide-empty-ads.js en intentos previos, lo eliminamos del HTML
sed -i.bak '/ibg-hide-empty-ads\.js/d' index.html || true

echo "== 2) Parche minimal de ENV de anuncios (sin tocar lo demás) =="
cat > public/js/ibg-ads-env-patch.js <<'JS'
(function () {
  // No romper si no existe
  window.__IBG_ADS = window.__IBG_ADS || {};
  // Mantener laterales e inferior (no cambia nada si ya están)
  if (!window.__IBG_ADS.EXOCLICK_BOTTOM_ZONE) window.__IBG_ADS.EXOCLICK_BOTTOM_ZONE = "5717078";
  // Re-asegurar PopAds
  window.__IBG_ADS.POPADS_ENABLE = 1;
  if (!window.__IBG_ADS.POPADS_SITE_ID) window.__IBG_ADS.POPADS_SITE_ID = "5226758";
  // Señal para posibles loaders
  try { document.dispatchEvent(new CustomEvent('IBG_ADS_ENV_READY')); } catch(e){}
})();
JS

echo "== 3) Hotfix JS: artefacto header + ocultar SOLO vacíos inferiores + restaurar ad-right =="
cat > public/js/ibg-home-fixes.js <<'JS'
(function () {
  function hasAdContent(el){
    return !!(el && el.querySelector && el.querySelector('iframe,ins,img,script[src*="ads"],script[data-ad]'));
  }
  function hide(el){
    if(!el) return;
    el.style.setProperty('display','none','important');
    el.style.setProperty('visibility','hidden','important');
    el.style.setProperty('height','0','important');
    el.style.setProperty('margin','0','important');
    el.style.setProperty('padding','0','important');
    el.style.setProperty('border','0','important');
  }
  function show(el){
    if(!el) return;
    el.style.setProperty('display','block','important');
    el.style.setProperty('visibility','visible','important');
    el.style.removeProperty('height');
    el.style.removeProperty('margin');
    el.style.removeProperty('padding');
  }

  function fixHeaderArtifact(){
    var header = document.querySelector('header');
    if (!header) return;
    // Oculta hermano inmediato ultra-fino (línea/artefacto)
    var next = header.nextElementSibling;
    if (next) {
      var h = next.getBoundingClientRect().height;
      if (h > 0 && h <= 6) hide(next);
    }
    // Clases típicas de artefacto
    document.querySelectorAll('.artifact,.menu-artifact,.top-artifact,.menu-shadow,.menu-spacer').forEach(hide);
  }

  function restoreSideAndBottom(){
    // Asegurar lateral derecho visible
    var right = document.getElementById('ad-right') || document.querySelector('.ad-right');
    show(right);
    // Asegurar lateral izquierdo visible
    var left = document.getElementById('ad-left') || document.querySelector('.ad-left');
    show(left);
    // Asegurar sticky inferior visible (no confundir con filas vacías)
    var bottom = document.getElementById('ad-sticky-bottom') || document.getElementById('ad-bottom') || document.querySelector('.ad-sticky-bottom,.ad-bottom');
    show(bottom);
  }

  function removeOnlyEmptyBottomSlots(){
    // Filas/grids de la parte inferior habituales (no el sticky bueno)
    var rows = document.querySelectorAll('#ad-bottom-row,.ad-bottom-row,.ads-bottom-row,#ad-row-bottom,.ads-row-bottom,.ad-grid-bottom,.bottom-ad-grid');
    rows.forEach(function(row){
      // Si cualquier descendiente tiene contenido de anuncio, lo dejamos
      if (hasAdContent(row)) return;
      // Si además NO es el sticky bueno, ocultamos
      if (!row.id || (row.id !== 'ad-sticky-bottom' && row.id !== 'ad-bottom')) hide(row);
    });

    // Slots candidatos dentro de esas filas (por si están sueltos)
    var candidateSlots = document.querySelectorAll(
      '.ad-slot,.ad-box,.ad-card,.ad-placeholder,.ad-unit,.ad, [id*="ad-"], [class*="ad-"]'
    );
    candidateSlots.forEach(function(el){
      // Nunca tocar los buenos:
      var id = (el.id || '').toLowerCase();
      var cl = (el.className || '').toLowerCase();
      var whitelisted = id === 'ad-left' || id === 'ad-right' || id === 'ad-bottom' || id === 'ad-sticky-bottom'
                        || /(^|\s)ad-left(\s|$)/.test(cl) || /(^|\s)ad-right(\s|$)/.test(cl)
                        || /(^|\s)ad-bottom(\s|$)/.test(cl) || /(^|\s)ad-sticky-bottom(\s|$)/.test(cl);
      if (whitelisted) return;
      // Sólo ocultar si REALMENTE están vacíos
      if (!hasAdContent(el)) hide(el);
    });
  }

  function ensurePopAds(){
    // Si el loader propio ya está, bastará con que vea POPADS_ENABLE y SITE_ID
    if (!window.__IBG_ADS) return;
    if (!window.__IBG_ADS.POPADS_ENABLE || !window.__IBG_ADS.POPADS_SITE_ID) return;
    // Reintento amable: si existe un init expuesto por tu integrador, llámalo; si no, no pasa nada
    var init = window.__IBG_POPADS_INIT || window.__bg_popads_init || window.ibgPopadsInit;
    try { if (typeof init === 'function') init(); } catch(e){}
  }

  function run(){
    fixHeaderArtifact();
    restoreSideAndBottom();
    removeOnlyEmptyBottomSlots();
    ensurePopAds();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
JS

echo "== 4) Inyectar scripts en index.html sin romper nada =="
# a) Insertar el patch de ENV justo después del env-ads-inline.js si existe; si no, antes del primer ads-*.js; si no, antes de </body>
if grep -qi 'src="/js/[^"]*env-ads-inline\.js"' index.html; then
  awk 'BEGIN{IGNORECASE=1}
  {
    print $0
    if (!done && $0 ~ /<script[^>]+src="\/js\/[^"]*env-ads-inline\.js"[^>]*>/) {
      print "  <script src=\"/js/ibg-ads-env-patch.js\"></script>"
      done=1
    }
  }' index.html > index.html.__tmp && mv index.html.__tmp index.html
elif grep -qi 'src="[^"]*ads-.*\.js"' index.html; then
  awk 'BEGIN{IGNORECASE=1}
  {
    if (!done && $0 ~ /<script[^>]+src="[^"]*ads-.*\.js"[^>]*>/) {
      print "  <script src=\"/js/ibg-ads-env-patch.js\"></script>"
      done=1
    }
    print $0
  }' index.html > index.html.__tmp && mv index.html.__tmp index.html
else
  awk 'BEGIN{IGNORECASE=1}
  { if (!done && /<\/body>/) { print "  <script src=\"/js/ibg-ads-env-patch.js\"></script>"; done=1 } print $0 }' index.html > index.html.__tmp && mv index.html.__tmp index.html
fi

# b) Insertar el hotfix de home justo antes de </body> si no está
grep -q 'src="/js/ibg-home-fixes.js"' index.html || \
awk 'BEGIN{IGNORECASE=1}
{ if (!done && /<\/body>/) { print "  <script src=\"/js/ibg-home-fixes.js\"></script>"; done=1 } print $0 }' index.html > index.html.__tmp && mv index.html.__tmp index.html

echo "== 5) Git commit + push =="
git add index.html public/js/ibg-ads-env-patch.js public/js/ibg-home-fixes.js
git commit -m "home: keep side+sticky bottom; remove only empty bottom slots; fix header artifact; ensure PopAds env" || echo "ℹ️ Nada que commitear."
git pull --rebase origin main
git push origin main

echo "== 6) Deploy producción (Vercel) =="
vercel link --yes --project "$PROJECT" --scope "$TEAM" >/dev/null || true
vercel pull --yes --environment=production --scope "$TEAM" >/dev/null || true
OUT="$(vercel deploy --prod --yes --scope "$TEAM")" || true
echo "$OUT"
URL="$(printf "%s\n" "$OUT" | awk '/^https?:\/\//{print $0}' | tail -n1)"
[ -n "${URL:-}" ] && echo "✅ Production: $URL" || echo "⚠️ Revisa la salida; no pude detectar la URL."

echo "== 7) Checklist manual (tras el deploy) =="
echo " • Debe verse lateral izquierdo y derecho."
echo " • Debe verse el sticky inferior (no confundir con filas vacías)."
echo " • No debe quedar artefacto por encima del menú."
echo " • No deben quedar cuadros vacíos en la parte inferior."
echo " • En consola NO deben salir 'missing EXOCLICK_BOTTOM_ZONE' ni 'disabled or no site id' de PopAds."
