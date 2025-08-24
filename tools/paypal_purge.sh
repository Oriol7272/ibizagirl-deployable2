#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob
for f in *.html _head_common.html; do
  [ -f "$f" ] || continue
  perl -0777 -pe "s#<script[^>]*paypal\.com/sdk/js[^>]*></script>##gis" -i "$f" || true
  perl -0777 -pe "s#<script[^>]*>[^<]*paypal\.[^<]*</script>##gis" -i "$f" || true
done
echo "Old PayPal scripts removed"
