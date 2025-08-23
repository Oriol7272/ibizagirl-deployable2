#!/usr/bin/env bash
set -euo pipefail
for f in index.html premium.html videos.html subscription.html; do
  [ -f "$f" ] || continue
  if ! grep -q '/content-data.js' "$f"; then
    awk '1;/<head[^>]*>/{print "<script src=\"/content-data.js\"></script>"}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
  fi
done
echo OK
