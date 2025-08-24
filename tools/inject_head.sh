#!/usr/bin/env bash
set -Eeuo pipefail
ga_tag='<!-- GA4 --><script async src="https://www.googletagmanager.com/gtag/js?id=G-DBXYNPBSPY"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","G-DBXYNPBSPY");</script>'
css_link='<link rel="stylesheet" href="/css/ibg-layout.css"/>'

for f in index.html premium.html videos.html subscription.html; do
  [[ -f "$f" ]] || continue
  # CSS
  grep -Fq 'ibg-layout.css' "$f" || awk -v L="$css_link" '{
    print; if(!ins && /<head[^>]*>/){ print "  " L; ins=1 }
  }' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
  # GA
  grep -Fq 'G-DBXYNPBSPY' "$f" || awk -v G="$ga_tag" '{
    print; if(!gin && /<head[^>]*>/){ print "  " G; gin=1 }
  }' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
done
echo "HEAD OK"
