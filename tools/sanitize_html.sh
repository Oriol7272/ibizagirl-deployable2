#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob
for f in *.html; do
  # 1) Elimina cualquier SDK de PayPal ya inyectado en el HTML
  perl -0777 -pe "s#<script[^>]+paypal\.com/sdk/js[^>]*></script>##g" -i "$f" || true
  # 2) Elimina <script type="module"> que importen desde /js/i18n.js con exports { translate, currentLang, ... }
  perl -0777 -pe "s#<script type=\"module\">[^<]*import\\s*\\{[^}]*\\}\\s*from\\s*['\\\"]/js/i18n\\.js['\\\"];.*?</script>##gs" -i "$f" || true
  # 3) Elimina includes antiguos de /js/ads.js como script normal
  perl -0777 -pe "s#<script src=\"/js/ads\\.js\"></script>##g" -i "$f" || true
done
echo "Sanitize OK"
