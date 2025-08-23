#!/usr/bin/env bash
set -euo pipefail
for f in index.html premium.html videos.html subscription.html; do
  [ -f "$f" ] || continue
  grep -q 'class="page"' "$f" || perl -0777 -pe 's#(<header class="site".*?</header>)#${1}\n<div class="page">#s' -i "$f"
  grep -q '</div>\s*</body>' "$f" || perl -0777 -pe 's#</body>#</div>\n</body>#s' -i "$f"
done
echo "Layout container OK"
