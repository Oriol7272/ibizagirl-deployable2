#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob
for f in *.html _head_common.html; do
  [ -f "$f" ] || continue
  # 1) <link rel="manifest"> + theme-color (evita duplicados)
  if ! grep -q 'manifest.webmanifest' "$f"; then
    awk '1; /<\/head>/{print "  <link rel=\"manifest\" href=\"/manifest.webmanifest\">"; print "  <meta name=\"theme-color\" content=\"#0a304f\">"}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
  fi
  # 2) Registro del Service Worker (evita duplicados)
  if ! grep -q 'navigator.serviceWorker.register' "$f"; then
    awk '1; /<\/body>/{print "  <script>if(navigator.serviceWorker){navigator.serviceWorker.register(\"/sw.js\").catch(()=>{});}</script>"}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
  fi
done
echo "PWA OK"
