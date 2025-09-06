#!/usr/bin/env bash
set -euo pipefail
wrap_page(){
  f="$1"; [ -f "$f" ] || return 0
  # si no existe .page, crea una
  grep -q 'class="page"' "$f" || perl -0777 -pe 's#(<header class="site".*?</header>)#${1}\n<div class="page">#s' -i "$f"
  # cierra .page antes de </body> si no estuviera
  grep -q '</div>\s*</body>' "$f" || perl -0777 -pe 's#</body>#</div>\n</body>#s' -i "$f"
}
for f in index.html premium.html videos.html subscription.html; do wrap_page "$f"; done
echo "Content wrapper OK"
