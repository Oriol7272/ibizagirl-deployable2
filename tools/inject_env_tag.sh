#!/usr/bin/env bash
set -Eeuo pipefail
inject_env(){
  local f="$1"
  [[ -f "$f" ]] || return 0
  # Si ya est, no hacemos nada
  grep -Fq '/api/env.js' "$f" && { echo "ENV ya presente en $f"; return 0; }
  # Insertar justo antes de la primera aparicinnn de payments.js; si no existe, antes de </body>
  if grep -Fq '/js/payments.js' "$f"; then
    awk '{
      if(!ins && /\/js\/payments\.js/){ print "  <script src=\"/api/env.js\"></script>"; ins=1 }
      print
    }' "$f" > "$f.tmp" && mv "$f.tmp" "$f" && echo "ENV inyectado antes de payments.js en $f"
  else
    awk '{
      if(!ins && /<\/body>/){ print "  <script src=\"/api/env.js\"></script>"; ins=1 }
      print
    }' "$f" > "$f.tmp" && mv "$f.tmp" "$f" && echo "ENV inyectado antes de </body> en $f"
  fi
}
for f in index.html premium.html videos.html subscription.html; do
  inject_env "$f"
done
echo "ENV TAG OK"
