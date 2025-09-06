#!/usr/bin/env bash
set -euo pipefail

TEAM="oriols-projects-ed6b9b04"
PROJECT="ibizagirl-deployable2"
FILE="index.html"

echo "== PRE =="
[ -f "$FILE" ] || { echo "❌ No encuentro $FILE en la raíz."; exit 1; }
mkdir -p public/js

echo "== 1) ENV inline: laterales + STICKY BOTTOM + PopAds (sin ERO) =="
cat > public/js/env-ads-inline.js <<'JS'
/* ENV inline: debe cargarse ANTES que los loaders ads-*.js */
window.__IBG_ADS = {
  EXOCLICK_ZONES: "5696328,5705186",   // left,right
  EXOCLICK_ZONE: "5696328",            // fallback
  EXOCLICK_BOTTOM_ZONE: "5717078",     // sticky bottom
  POPADS_ENABLE: 1,
  POPADS_SITE_ID: "5226758"
};
console.log('IBG_ADS ZONES ->', window.__IBG_ADS);
JS

# Inserta el env ANTES del primer ads-*.js; si no hay, antes de </head>
if ! grep -qiE '<script[^>]+src="/js/env-ads-inline\.js"' "$FILE"; then
  awk 'BEGIN{IGNORECASE=1}
  {
    if (!done && $0 ~ /<script[^>]+src="[^"]*ads-.*\.js"/) {
      print "  <script src=\"/js/env-ads-inline.js\"></script>";
      done=1;
    }
    print $0;
  }' "$FILE" > "$FILE.__tmpA" && mv "$FILE.__tmpA" "$FILE"

  if ! grep -qiE '<script[^>]+src="/js/env-ads-inline\.js"' "$FILE" && grep -qi '</head>' "$FILE"; then
    awk 'BEGIN{IGNORECASE=1}
    { sub(/<\/head>/, "  <script src=\"/js/env-ads-inline.js\"></script>\n</head>"); print }' \
    "$FILE" > "$FILE.__tmpB" && mv "$FILE.__tmpB" "$FILE"
  fi
fi

echo "== 2) Asegurar contenedor del sticky bottom (sin duplicar) =="
if ! grep -qiE 'id="ad-sticky-bottom"|id="ad-bottom"' "$FILE"; then
  awk 'BEGIN{IGNORECASE=1}
  { sub(/<\/body>/, "\n  <div id=\"ad-sticky-bottom\" data-ibg-keep=\"1\"></div>\n</body>"); print }' \
  "$FILE" > "$FILE.__tmpC" && mv "$FILE.__tmpC" "$FILE"
fi

# CSS mínimo para proteger sticky y laterales; ocultar solo placeholders/filas vacías comunes
echo "== 3) CSS puntual (oculta recuadros vacíos; NO toca sticky ni laterales) =="
if ! grep -qi 'id="hotfix-no-empty-ads"' "$FILE"; then
  HOTFIX_CSS='  <style id="hotfix-no-empty-ads">
    /* Oculta contenedores típicos VACÍOS que generan cajas fantasma al final */
    .ad-placeholder, .banner-placeholder, .ads-row, .ad-row, .ad-bottom-row,
    .bottom-ads, .adbox, .ad-container, .ad-slot, .ads-bottom, .ad-grid, .ad-flex {
      min-height: 0 !important;
    }
    /* Por si quedan estilos heredados que pintan un fondo/caja vacía */
    .ad-placeholder, .banner-placeholder, .ads-row, .ad-row, .ad-bottom-row,
    .bottom-ads, .adbox, .ad-container:empty, .ad-slot:empty, .ads-bottom {
      background: transparent !important;
      border: 0 !important; padding: 0 !important; margin: 0 !important;
    }
    /* Mantener visibles los únicos permitidos */
    #ad-left, .ad-left, #ad-right, .ad-right,
    #ad-sticky-bottom, .ad-sticky-bottom, #ad-bottom, .ad-bottom {
      display: block !important; visibility: visible !important;
    }
    /* Artefacto arriba del menú (línea fantasma o espaciador minúsculo) */
    header + .artifact, .top-artifact, .menu-artifact { display:none !important; }
  </style>'
  awk -v inj="$HOTFIX_CSS" 'BEGIN{IGNORECASE=1}{ sub(/<\/head>/, inj "\n</head>"); print }' \
    "$FILE" > "$FILE.__tmpD" && mv "$FILE.__tmpD" "$FILE"
fi

echo "== 4) JS: eliminar del DOM solo las cajas vacías, sin tocar sticky bottom ni laterales =="
if ! grep -qi 'id="hotfix-clean-empty-ads"' "$FILE"; then
  HOTFIX_JS='  <script id="hotfix-clean-empty-ads">
  (function(){
    function keepNode(el){
      if(!el) return false;
      const id=(el.id||"").toLowerCase();
      const cls=(" "+(el.className||"")+" ").toLowerCase();
      return id==="ad-left"||id==="ad-right"||id==="ad-sticky-bottom"||id==="ad-bottom"||
             cls.includes(" ad-left ")||cls.includes(" ad-right ")||
             cls.includes(" ad-sticky-bottom ")||cls.includes(" ad-bottom ");
    }
    // Limpia filas/slots vacíos típicos (pero no si contienen iframes/anuncios reales)
    const sels = [".ads-row",".ad-row",".ad-bottom-row",".bottom-ads",
                  ".ad-placeholder",".banner-placeholder",".adbox",
                  ".ad-container",".ad-slot",".ads-bottom",".ad-grid",".ad-flex",
                  "#ads-bottom","#ad-row","#ads"];
    document.querySelectorAll(sels.join(",")).forEach(function(n){
      if(keepNode(n) || n.closest("#ad-sticky-bottom")) return;
      const hasAd = n.querySelector("iframe, ins, [data-exo], [data-ad], script[src*=\\"magsrv\\"], script[src*=\\"exoclick\\"], script[src*=\\"juicyads\\"]");
      if(!hasAd){ n.remove(); }
    });
    // Elimina artefactos justo antes del <header> (espaciadores/elementos minúsculos)
    var h=document.querySelector("header");
    if(h){
      // Borra nodos de texto en blanco
      var t=h.previousSibling;
      while(t && t.nodeType===3){ var p=t.previousSibling; if(/^\\s*$/.test(t.nodeValue||"")) t.remove(); t=p; }
      // Borra elementos diminutos o marcados como artefacto
      var e=h.previousElementSibling;
      while(e){
        var rect=e.getBoundingClientRect ? e.getBoundingClientRect() : {height:999};
        var isArtifact=(e.classList && (e.classList.contains("artifact")||e.classList.contains("menu-artifact")||e.classList.contains("top-artifact")));
        if(isArtifact || rect.height<=4){ var prev=e.previousElementSibling; e.remove(); e=prev; } else { break; }
      }
    }
  })();
  </script>'
  awk -v inj="$HOTFIX_JS" 'BEGIN{IGNORECASE=1}{ sub(/<\/body>/, inj "\n</body>"); print }' \
    "$FILE" > "$FILE.__tmpE" && mv "$FILE.__tmpE" "$FILE"
fi

echo "== 5) Commit & push =="
git add index.html public/js/env-ads-inline.js || true
if git diff --cached --quiet; then
  echo "ℹ️ Nada que commitear (probablemente ya aplicado)."
else
  git commit -m "home(hotfix-min): restaurar sticky bottom, mantener laterales+popads, eliminar recuadros vacíos y artefacto menú"
fi
git pull --rebase origin main || { git rebase --abort || true; git reset --hard origin/main; }
git push origin main || true

echo "== 6) Deploy producción (Vercel) =="
vercel link --yes --project "$PROJECT" --scope "$TEAM" >/dev/null || true
vercel pull --yes --environment=production --scope "$TEAM" >/dev/null || true
OUT="$(vercel deploy --prod --yes --scope "$TEAM" || true)"
echo "$OUT"
URL="$(printf "%s\n" "$OUT" | awk '/^https?:\/\//{print $0}' | tail -n1)"
[ -n "${URL:-}" ] && echo "✅ Production: $URL" || echo "⚠️ Revisa el deployment en Vercel."

echo "== 7) Comprobación esperada =="
echo " • Debe verse: EXO laterales + EXO sticky inferior + PopAds."
echo " • No deben verse los 2 recuadros vacíos de abajo ni línea/artefacto sobre el menú."
echo " • En consola: 'IBG_ADS: EXO bottom mounted -> 5717078' y 'IBG_ADS: POP mounted -> 5226758'."
