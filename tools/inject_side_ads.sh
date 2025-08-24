#!/usr/bin/env bash
set -euo pipefail
for f in index.html premium.html videos.html subscription.html; do
  [ -f "$f" ] || continue
  grep -q 'id="side-ads-left"' "$f" || awk '1; /<body[^>]*>/{print "<aside class=\"sidebar-fixed sidebar-left\" id=\"side-ads-left\"><div class=\"ad-slot\" data-net=\"juicy\"></div><div class=\"ad-slot\" data-net=\"exo\"></div><div class=\"ad-slot\" data-net=\"ero\"></div></aside><aside class=\"sidebar-fixed sidebar-right\" id=\"side-ads-right\"><div class=\"ad-slot\" data-net=\"juicy\"></div><div class=\"ad-slot\" data-net=\"exo\"></div><div class=\"ad-slot\" data-net=\"ero\"></div></aside>"}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
done
echo OK
