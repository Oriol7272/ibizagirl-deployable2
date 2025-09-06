#!/usr/bin/env bash
set -euo pipefail

TEAM="oriols-projects-ed6b9b04"
PROJECT="ibizagirl-deployable2"
FILE="index.html"

echo "== PRE: comprobaciones =="
[ -f "$FILE" ] || { echo "❌ No encuentro $FILE (ejecuta en la raíz del repo)."; exit 1; }
mkdir -p public/js

echo "== 1) ENV inline (incluye EXOCLICK_BOTTOM_ZONE) =="
cat > public/js/env-ads-inline.js <<'JS'
/* ENV inline para anuncios (cargado antes de los loaders) */
window.__IBG_ADS = {
  EXOCLICK_ZONES: "5696328,5705186",   // L,R
  EXOCLICK_ZONE: "5696328",            // fallback
  EXOCLICK_BOTTOM_ZONE: "5717078",     // sticky bottom
  POPADS_ENABLE: 1,
  POPADS_SITE_ID: "5226758"
};
console.log('IBG_ADS ZONES ->', window.__IBG_ADS);
JS

# Inserta el ENV antes del primer ads-*.js; si no hubiera, antes de </head>
if ! grep -qiE '<script[^>]+src="/js/env-ads-inline\.js"' "$FILE"; then
  awk 'BEGIN{IGNORECASE=1}
  {
    if (!done && $0 ~ /<script[^>]+src="[^"]*ads-.*\.js"/) { print "  <script src=\"/js/env-ads-inline.js\"></script>"; done=1; }
    print $0;
  }' "$FILE" > "$FILE.__tmpA" && mv "$FILE.__tmpA" "$FILE"
  if ! grep -qiE '<script[^>]+src="/js/env-ads-inline\.js"' "$FILE" && grep -qi '</head>' "$FILE"; then
    awk 'BEGIN{IGNORECASE=1}{ sub(/<\/head>/, "  <script src=\"/js/env-ads-inline.js\"></script>\n</head>"); print }' \
      "$FILE" > "$FILE.__tmpB" && mv "$FILE.__tmpB" "$FILE"
  fi
fi

echo "== 2) Restaurar contenedor del sticky bottom si falta =="
if ! grep -qiE 'id="ad-sticky-bottom"|id="ad-bottom"' "$FILE"; then
  awk 'BEGIN{IGNORECASE=1}{ sub(/<\/body>/, "\n  <div id=\"ad-sticky-bottom\"></div>\n</body>"); print }' \
    "$FILE" > "$FILE.__tmpC" && mv "$FILE.__tmpC" "$FILE"
fi

echo "== 3) CSS: ocultar slots vacíos y limpiar artefacto sobre menú =="
if ! grep -qi 'id="hotfix-no-empty-ads"' "$FILE"; then
  HOTFIX_CSS='  <style id="hotfix-no-empty-ads">
    /* Esconde placeholders / filas de ads vacíos que no queremos en Home */
    .ad-placeholder, .banner-placeholder, .ads-row, .ads-bottom, .ad-bottom-row,
    .ad-row, .ad-slot, .adbox, .ad-container, .bottom-ads {
      display: none !important; visibility: hidden !important;
      height: 0 !important; margin: 0 !important; padding: 0 !important;
      border: 0 !important; outline: 0 !important;
    }
    /* Asegurar visibles los que SÍ queremos */
    #ad-left, .ad-left, #ad-right, .ad-right, #ad-bottom, .ad-bottom,
    #ad-sticky-bottom, .ad-sticky-bottom {
      display: block !important; visibility: visible !important; height: auto !important;
    }
    /* Posibles mini-artefactos por encima del menú */
    header + .artifact, .top-artifact, .menu-artifact { display:none !important; }
  </style>'
  awk -v inj="$HOTFIX_CSS" 'BEGIN{IGNORECASE=1}{ sub(/<\/head>/, inj "\n</head>"); print }' \
    "$FILE" > "$FILE.__tmpD" && mv "$FILE.__tmpD" "$FILE"
fi

echo "== 4) JS: eliminar del DOM los slots vacíos no permitidos + limpiar antes de <header> =="
if ! grep -qi 'id="hotfix-clean-empty-ads"' "$FILE"; then
  HOTFIX_JS='  <script id="hotfix-clean-empty-ads">
  (function(){
    function keep(el){
      if(!el) return false;
      const id=(el.id||"").toLowerCase();
      const cls=(" "+(el.className||"")+" ").toLowerCase();
      return id==="ad-left"||id==="ad-right"||id==="ad-sticky-bottom"||id==="ad-bottom"||
             cls.includes(" ad-left ")||cls.includes(" ad-right ")||
             cls.includes(" ad-sticky-bottom ")||cls.includes(" ad-bottom ");
    }
    const sels = [".ad",".ad-slot",".ad-container",".ad-row","#ad-row",
                  ".ads-bottom",".ads-row",".banner-placeholder",
                  ".ad-placeholder",".adbox",".ad-bottom-row",".bottom-ads"];
    document.querySelectorAll(sels.join(",")).forEach(function(n){
      if(keep(n)) return;
      const hasAd = n.querySelector("iframe, ins, [data-exo], [data-ad], script[src*=\\"exoclick\\"], script[src*=\\"juicyads\\"], script[src*=\\"magsrv\\"], script[src*=\\"ero\\"]");
      if(!hasAd){ n.remove(); }
    });
    const header=document.querySelector("header");
    if(header){
      let p=header.previousSibling;
      while(p){
        const kill = (p.nodeType===3 && /^[\\s\\n]+$/.test(p.nodeValue||"")) ||
                     (p.nodeType===1 && (p.classList && (p.classList.contains("artifact")||p.classList.contains("menu-artifact")||p.classList.contains("top-artifact")) || (p.getBoundingClientRect&&p.getBoundingClientRect().height<4)));
        const cur=p; p=p.previousSibling;
        if(kill && cur.parentNode) cur.parentNode.removeChild(cur); else break;
      }
    }
  })();
  </script>'
  awk -v inj="$HOTFIX_JS" 'BEGIN{IGNORECASE=1}{ sub(/<\/body>/, inj "\n</body>"); print }' \
    "$FILE" > "$FILE.__tmpE" && mv "$FILE.__tmpE" "$FILE"
fi

echo "== 5) Git commit & push =="
git add index.html public/js/env-ads-inline.js || true
if git diff --cached --quiet; then
  echo "ℹ️ Nada que commitear."
else
  git commit -m "home(hotfix): keep side+sticky bottom+popads, remove empty slots, fix header artifact"
fi
git pull --rebase origin main || { git rebase --abort || true; git reset --hard origin/main; }
git push origin main

echo "== 6) Deploy producción (Vercel) =="
vercel link --yes --project "$PROJECT" --scope "$TEAM" >/dev/null || true
vercel pull --yes --environment=production --scope "$TEAM" >/dev/null || true
OUT="$(vercel deploy --prod --yes --scope "$TEAM" || true)"
echo "$OUT"
URL="$(printf "%s\n" "$OUT" | awk '/^https?:\/\//{print $0}' | tail -n1)"
[ -n "${URL:-}" ] && echo "✅ Production: $URL" || echo "⚠️ Revisa el deployment en Vercel."

echo "== 7) Verificación esperada en consola =="
echo " • IBG_ADS: EXO/AP mounted (pure) -> 5696328 on ad-left / ad-right"
echo " • IBG_ADS: EXO bottom mounted -> 5717078 (sin 'missing EXOCLICK_BOTTOM_ZONE')"
echo " • IBG_ADS: POP mounted -> 5226758"
echo " • Sin recuadros vacíos al final ni artefacto sobre el menú"
