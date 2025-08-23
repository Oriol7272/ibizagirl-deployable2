#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob
FILES=( *.html )

for f in "${FILES[@]}"; do
  # Elimina SDK PayPal pegado en HTML (cualquier variante)
  perl -0777 -pe "s#<script[^>]+paypal\.com/sdk/js[^>]*></script>##g" -i "$f" || true
  # Elimina includes directos de payments/i18n/ads como scripts clásicos
  perl -0777 -pe "s#<script\s+src=\"/js/(payments|i18n|ads)\.js\"></script>##g" -i "$f" || true
  # Elimina módulos inline que importaban de i18n/payments/ads e intentaban usar exports
  perl -0777 -pe "s#<script type=\"module\">.*?(from\s+['\"]/js/(i18n|payments|ads)\.js['\"];).*?</script>##gs" -i "$f" || true
  # Elimina inits antiguos (init-home.js, init-premium.js, init-videos.js)
  perl -0777 -pe "s#<script\s+src=\"/js/init-[^\"]+\.js\"></script>##g" -i "$f" || true
  # Garantiza runtime moderno
  if ! grep -q 'js/page-init.js' "$f"; then
    if grep -q '</body>' "$f"; then
      awk '{print} /<\/body>/{print "  <script type=\"module\" src=\"/js/page-init.js\"></script>"}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
    else
      printf '\n  <script type="module" src="/js/page-init.js"></script>\n' >> "$f"
    fi
  fi
done

# También limpia el parcial común si existe
for f in _head_common.html; do
  [ -f "$f" ] || continue
  perl -0777 -pe "s#<script[^>]+paypal\.com/sdk/js[^>]*></script>##g" -i "$f" || true
done
echo "Super-saneado OK"
