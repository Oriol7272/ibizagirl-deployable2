#!/usr/bin/env bash
set -euo pipefail
for f in *.html; do
  [ -f "$f" ] || continue
  if grep -q 'js/page-init.js' "$f"; then
    continue
  fi
  if grep -q '</body>' "$f"; then
    awk '{print} /<\/body>/{print "  <script type=\"module\" src=\"/js/page-init.js\"></script>"}' "$f" > "$f.tmp" || true
  else
    cp "$f" "$f.tmp"
    printf '\n  <script type="module" src="/js/page-init.js"></script>\n' >> "$f.tmp"
  fi
  [ -f "$f.tmp" ] && mv "$f.tmp" "$f" && echo "Wired runtime in: $f"
done
echo "OK runtime"
