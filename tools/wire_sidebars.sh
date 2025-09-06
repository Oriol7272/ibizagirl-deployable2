#!/usr/bin/env bash
set -euo pipefail
for f in index.html premium.html videos.html subscription.html; do
  [ -f "$f" ] || continue
  if ! grep -q 'class="main-wrap"' "$f"; then
    awk '1;/<body[^>]*>/{print "<div class=\"top-strip\"><span class=\"plan-pill\">Lifetime 100€</span><span class=\"plan-pill\">Anual 49,99€</span><span class=\"plan-pill\">Mensual 14,99€</span><span>Todo el contenido visible mientras esté activo.</span></div><div class=\"main-wrap\"><aside class=\"sidebar\" id=\"sb-left\"><div class=\"ad-slot\" data-network=\"juicy\"></div><div class=\"ad-slot\" data-network=\"exo\"></div><div class=\"ad-slot\" data-network=\"ero\"></div></aside><main class=\"content\" id=\"page-main\"></main><aside class=\"sidebar\" id=\"sb-right\"><div class=\"ad-slot\" data-network=\"juicy\"></div><div class=\"ad-slot\" data-network=\"exo\"></div><div class=\"ad-slot\" data-network=\"ero\"></div></aside></div>"}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
    sed -i '' 's#<section #<section id="main-section" #' "$f" 2>/dev/null || true
    sed -i '' 's#<section#<div id="main-section" #' "$f" 2>/dev/null || true
    sed -i '' 's#</section>#</div>#' "$f" 2>/dev/null || true
    sed -i '' 's#<div id="main-section"#<div id="main-section" style="padding:1rem"#' "$f" 2>/dev/null || true
    perl -0777 -pe 's#(<div class="main-wrap">.*?<main class="content" id="page-main">)#${1}\n<div id="main-section"></div>#s' -i '' "$f"
  fi
done
echo OK
