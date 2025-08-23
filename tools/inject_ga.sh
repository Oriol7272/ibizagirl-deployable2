#!/usr/bin/env bash
set -euo pipefail
GA='<script async src="https://www.googletagmanager.com/gtag/js?id=G-DBXYNPBSPY"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","G-DBXYNPBSPY");</script>'
for f in *.html _head_common.html; do
  [ -f "$f" ] || continue
  perl -0777 -pe "s#<script async src=\"https://www.googletagmanager.com/gtag/js[^<]*</script>##gs" -i "$f" || true
  perl -0777 -pe "s#</head>#  ${GA}\n</head>#s" -i "$f"
done
echo "GA injected"
