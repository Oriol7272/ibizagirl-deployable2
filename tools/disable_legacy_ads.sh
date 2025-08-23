#!/usr/bin/env bash
set -euo pipefail
for f in index.html premium.html videos.html subscription.html; do
  [ -f "$f" ] || continue
  sed -i '' '/ad-provider\.js/d' "$f" 2>/dev/null || true
  sed -i '' "/data-ad-provider/d" "$f" 2>/dev/null || true
done
[ -f js/ad-provider.js ] && mv js/ad-provider.js js/ad-provider.legacy.disabled || true
echo "Legacy ad provider desactivado"
