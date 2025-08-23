#!/usr/bin/env bash
set -euo pipefail
for f in *.html; do
  [ -f "$f" ] || continue
  sed -i '' '/<script src="\/js\/ads\.js"><\/script>/d' "$f" 2>/dev/null || true
  sed -i '' '/<script src="\/js\/i18n\.js"><\/script>/d' "$f" 2>/dev/null || true
  if ! grep -q 'js/page-init.js' "$f"; then
    if grep -q '</body>' "$f"; then awk '{print} /<\/body>/{print "  <script type=\"module\" src=\"/js/page-init.js\"></script>"}' "$f" > "$f.tmp" || true
    else cp "$f" "$f.tmp"; printf '\n  <script type="module" src="/js/page-init.js"></script>\n' >> "$f.tmp"
    fi
    [ -f "$f.tmp" ] && mv "$f.tmp" "$f"
  fi
done
echo OK
