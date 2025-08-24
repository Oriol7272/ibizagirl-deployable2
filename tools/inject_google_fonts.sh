#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob
for f in *.html _head_common.html; do
  [ -f "$f" ] || continue
  # elimina links antiguos a fonts si hubiera
  perl -0777 -pe "s#<link[^>]+fonts\.googleapis\.com[^>]*>##gis" -i "$f" || true
  # inserta nuestros links justo antes de </head>
  if grep -q '</head>' "$f"; then
    awk '1; /<\/head>/{print "  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">"; print "  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>"; print "  <link href=\"https://fonts.googleapis.com/css2?family=Great+Vibes&family=Alex+Brush&display=swap\" rel=\"stylesheet\">"}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
  fi
done
echo "Fonts injected"
