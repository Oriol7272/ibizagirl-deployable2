#!/usr/bin/env bash
set -euo pipefail

insert_loader_and_ads () {
  local FILE="$1"
  [[ -f "$FILE" ]] || return 0

  # Inyectar loader de PayPal (payments.js) si no está
  if ! grep -q 'js/payments.js' "$FILE"; then
    awk 'BEGIN{added=0}
      /<\/body>/{ print "  <script src=\"/js/payments.js?v=__BUILD__\"></script>"; added=1 }
      { print }
      END{ if(!added) print "  <script src=\"/js/payments.js?v=__BUILD__\"></script>" }' "$FILE" > "$FILE.tmp" \
      && mv "$FILE.tmp" "$FILE"
  fi

  # Inyectar bloque de anuncios si no está
  if ! grep -q '=== ADS START ===' "$FILE"; then
    awk '{
      print
      if(!ins && /<\/main>|<\/footer>/){
        print "";
        cmd="cat snippets/ads-block.html";
        system(cmd);
        print "";
        ins=1
      }
    } END {
      if(!ins){
        print "";
        cmd="cat snippets/ads-block.html";
        system(cmd);
        print ""
      }
    }' "$FILE" > "$FILE.tmp" && mv "$FILE.tmp" "$FILE"
  fi
}

for f in index.html premium.html videos.html subscription.html; do
  insert_loader_and_ads "$f"
done

echo "✅ Loader de PayPal y bloque de anuncios inyectados (idempotente)."
