#!/usr/bin/env bash
set -euo pipefail
add_head_once(){ f="$1"; src="$2"; if grep -q "$src" "$f"; then return; fi
  if grep -q '</head>' "$f"; then
    awk -v S="$src" '{print} /<\/head>/{print "  <script src=\"" S "\"></script>"}' "$f" > "$f.tmp" || true
  else
    cp "$f" "$f.tmp"; printf '\n  <script src="%s"></script>\n' "$src" >> "$f.tmp"
  fi
  [ -f "$f.tmp" ] && mv "$f.tmp" "$f"
}
shopt -s nullglob
for f in *.html; do
  [ -f "$f" ] || continue
  add_head_once "$f" "/content-data.js"
  add_head_once "$f" "/js/i18n.js"
done
echo "OK inject i18n + content-data.js"
