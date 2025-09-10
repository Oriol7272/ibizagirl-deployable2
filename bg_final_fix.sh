#!/usr/bin/env bash
# bg_final_fix.sh — Repara 404 de JS, orden de carga, artefacto header,
# oculta solo slots vacíos inferiores, asegura PopAds, commit y despliegue.
set -euo pipefail

TEAM="oriols-projects-ed6b9b04"
PROJECT="beachgirl-deployable2"

[ -f index.html ] || { echo "❌ No encuentro index.html en la raíz del repo."; exit 1; }
mkdir -p public/js

echo "== 1) Crear/actualizar JS que faltaban (evita 404) =="
cat > public/js/ibg-ads-env-patch.js <<'JS'
(function () {
  window.__IBG_ADS = window.__IBG_ADS || {};
  // Laterales e inferior correctos
  if (!window.__IBG_ADS.EXOCLICK_BOTTOM_ZONE) window.__IBG_ADS.EXOCLICK_BOTTOM_ZONE = "5717078";
  // PopAds ON
  window.__IBG_ADS.POPADS_ENABLE = 1;
  if (!window.__IBG_ADS.POPADS_SITE_ID) window.__IBG_ADS.POPADS_SITE_ID = "5226758";
  try { document.dispatchEvent(new CustomEvent('IBG_ADS_ENV_READY')); } catch(e){}
})();
JS

cat > public/js/ibg-home-fixes.js <<'JS'
(function () {
  function hasAdContent(el){try{return !!(el&&el.querySelector&&el.querySelector('iframe,ins,img,script[src*="ads"],script[data-ad]'));}catch(e){return false;}}
  function hide(el){if(!el)return;['display','visibility','height','margin','padding','border','outline'].forEach(function(p,i){
    if(i===0)el.style.setProperty('display','none','important');
    else if(i===1)el.style.setProperty('visibility','hidden','important');
    else if(i===2)el.style.setProperty('height','0','important');
    else el.style.setProperty(p,'0','important');
  });}
  function show(el){if(!el)return;el.style.setProperty('display','block','important');el.style.setProperty('visibility','visible','important');el.style.removeProperty('height');el.style.removeProperty('margin');el.style.removeProperty('padding');}
  function fixHeaderArtifact(){
    var header=document.querySelector('header'); if(!header) return;
    var next=header.nextElementSibling; if(next){var h=next.getBoundingClientRect().height;if(h>0&&h<=8) hide(next);}
    document.querySelectorAll('.artifact,.menu-artifact,.top-artifact,.menu-shadow,.menu-spacer').forEach(hide);
    var thin=document.querySelector('[style*="height:1px"],[style*="height:2px"]'); if(thin&&!hasAdContent(thin)) hide(thin);
  }
  function restoreWanted(){show(document.getElementById('ad-left')||document.querySelector('.ad-left'));
    show(document.getElementById('ad-right')||document.querySelector('.ad-right'));
    show(document.getElementById('ad-sticky-bottom')||document.getElementById('ad-bottom')||document.querySelector('.ad-sticky-bottom,.ad-bottom'));}
  function removeEmptyBottom(){
    var rows=document.querySelectorAll('#ad-bottom-row,.ad-bottom-row,.ads-bottom-row,#ad-row-bottom,.ads-row-bottom,.ad-grid-bottom,.bottom-ad-grid');
    rows.forEach(function(r){if((r.id||'').toLowerCase()==='ad-bottom'||(r.id||'').toLowerCase()==='ad-sticky-bottom')return;if(!hasAdContent(r))hide(r);});
    var cand=document.querySelectorAll('.ad-slot,.ad-box,.ad-card,.ad-placeholder,.ad-unit,.ad, [id*="ad-"], [class*="ad-"]');
    cand.forEach(function(el){
      var id=(el.id||'').toLowerCase();var cl=(el.className||'').toLowerCase();
      var keep=id==='ad-left'||id==='ad-right'||id==='ad-bottom'||id==='ad-sticky-bottom'||/\bad-left\b/.test(cl)||/\bad-right\b/.test(cl)||/\bad-bottom\b/.test(cl)||/\bad-sticky-bottom\b/.test(cl);
      if(keep) return; if(!hasAdContent(el)) hide(el);
    });
  }
  function ensurePopAds(){var a=window.__IBG_ADS||{}; if(!(a.POPADS_ENABLE&&a.POPADS_SITE_ID)) return; var init=window.__IBG_POPADS_INIT||window.__bg_popads_init||window.ibgPopadsInit; try{if(typeof init==='function')init();}catch(e){}}
  function run(){fixHeaderArtifact();restoreWanted();removeEmptyBottom();ensurePopAds();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
JS

echo "== 2) Reescribir index.html de forma determinista (siempre genera temporal) =="
# 2.1 Eliminar (si existen) las líneas de scripts antiguos para empezar limpio
awk 'BEGIN{IGNORECASE=1}
  !($0 ~ /<script[^>]+src="\/js\/env-ads-inline\.js"/) &&
  !($0 ~ /<script[^>]+src="\/js\/ibg-ads-env-patch\.js"/) &&
  !($0 ~ /<script[^>]+src="\/js\/ibg-home-fixes\.js"/) { print $0 }
' index.html > index.html.__stage1

# 2.2 Insertar env-ads-inline.js ANTES del primer ads-*.js; si no hay, antes de </head>; si no, al inicio del <body>
awk 'BEGIN{IGNORECASE=1}
{
  lines[NR]=$0
  if (!firstAds && $0 ~ /<script[^>]+src="[^"]*ads-.*\.js"[^>]*>/) { firstAds=NR }
  if (!headOpen && $0 ~ /<head[^>]*>/) { headOpen=NR }
  if (!bodyOpen && $0 ~ /<body[^>]*>/) { bodyOpen=NR }
}
END{
  inserted=0
  for(i=1;i<=NR;i++){
    if (!inserted && i==firstAds){ print "  <script src=\"/js/env-ads-inline.js\"></script>"; inserted=1 }
    print lines[i]
  }
  if (!inserted){
    # intentar antes de </head>
    for(i=1;i<=NR;i++){
      if (lines[i] ~ /<\/head>/) { print "  <script src=\"/js/env-ads-inline.js\"></script>"; inserted=1 }
      print lines[i]
    }
  }
}' index.html.__stage1 > index.html.__stage2 || { mv index.html.__stage1 index.html.__stage2; }

# 2.3 Insertar ibg-ads-env-patch.js inmediatamente DESPUÉS de env-ads-inline.js
awk 'BEGIN{IGNORECASE=1}
{
  print $0
  if (!done && $0 ~ /<script[^>]+src="\/js\/env-ads-inline\.js"/) { print "  <script src=\"/js/ibg-ads-env-patch.js\"></script>"; done=1 }
}' index.html.__stage2 > index.html.__stage3

# 2.4 Insertar ibg-home-fixes.js justo antes de </body> (si no existe)
awk 'BEGIN{IGNORECASE=1}
{
  if (!done && /<\/body>/) { print "  <script src=\"/js/ibg-home-fixes.js\"></script>"; done=1 }
  print $0
}
END{
  if (!done) print "  <script src=\"/js/ibg-home-fixes.js\"></script>";
}' index.html.__stage3 > index.html.__tmp

mv -f index.html.__tmp index.html
rm -f index.html.__stage1 index.html.__stage2 index.html.__stage3

echo "== 3) Git: commit + push solo de lo tocado =="
git add index.html public/js/ibg-ads-env-patch.js public/js/ibg-home-fixes.js
git commit -m "home: fix header artifact; keep side+sticky; remove only empty bottom slots; ensure PopAds; add missing JS and enforce order" || echo "ℹ️ Nada que commitear."
git pull --rebase origin main
git push origin main

echo "== 4) Despliegue producción (Vercel) =="
vercel link --yes --project "$PROJECT" --scope "$TEAM" >/dev/null || true
vercel pull --yes --environment=production --scope "$TEAM" >/dev/null || true
OUT="$(vercel deploy --prod --yes --scope "$TEAM")" || true
echo "$OUT"
URL="$(printf "%s\n" "$OUT" | awk '/^https?:\/\//{print $0}' | tail -n1)"
[ -n "${URL:-}" ] && echo "✅ Production: $URL" || echo "⚠️ Revisa la salida; no pude detectar la URL."

echo
echo "== 5) Checklist en consola del navegador =="
echo " - NO debe aparecer: 404 de ibg-ads-env-patch.js / ibg-home-fixes.js"
echo " - NO debe aparecer: 'missing EXOCLICK_BOTTOM_ZONE'"
echo " - Debe aparecer:    'IBG_ADS: EXO bottom mounted -> 5717078'"
echo " - PopAds: sin 'disabled or no site id'"
echo " - Visual: sin artefacto sobre menú y sin cuadros vacíos inferiores; se mantienen laterales + sticky."
