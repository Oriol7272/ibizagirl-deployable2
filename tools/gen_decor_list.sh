#!/usr/bin/env bash
set -euo pipefail
mkdir -p js
tmp="$(mktemp)"
printf 'window.DECOR_IMAGES = [' > "$tmp"
first=1
while IFS= read -r -d '' f; do
  p="/${f#./}"
  if [ $first -eq 1 ]; then first=0; printf '%s' "\"$p\"" >> "$tmp"
  else printf '%s' ",\"$p\"" >> "$tmp"
  fi
done < <(find decorative-images -maxdepth 1 -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.webp' -o -iname '*.svg' \) -print0 | sort -z)
printf '];\n' >> "$tmp"
mv "$tmp" js/decorative-list.js
echo "OK decorative-list.js"
