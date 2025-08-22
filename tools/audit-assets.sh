set -euo pipefail
IFS=$'\n\t'

DOMAIN="${1:-https://ibizagirl.pics}"
OUTDIR="tools/out"
mkdir -p "$OUTDIR"

IMG_LIST="${OUTDIR}/uncensored-files.txt"
VID_LIST="${OUTDIR}/video-files.txt"
MISSING_IMG="${OUTDIR}/missing-uncensored.txt"
MISSING_VID="${OUTDIR}/missing-videos.txt"

: > "$MISSING_IMG"
: > "$MISSING_VID"

# Extrae nombres de archivos desde los content-data*.js
grep -Eho '[A-Za-z0-9._-]+\.(webp|jpg|jpeg|png)' content-data3.js content-data4.js | sort -u > "$IMG_LIST" || true
grep -Eho '[A-Za-z0-9._-]+\.(mp4|webm)'            content-data5.js              | sort -u > "$VID_LIST" || true

tot_img=$(wc -l < "$IMG_LIST" | tr -d ' ')
tot_vid=$(wc -l < "$VID_LIST" | tr -d ' ')
echo "📸 Imágenes a comprobar: $tot_img"
echo "🎬 Videos a comprobar:   $tot_vid"

ok() { local code="$1"; [[ "$code" == "200" || "$code" == "206" || "$code" == "302" ]]; }

i=0; found_img=0
while IFS= read -r f || [[ -n "$f" ]]; do
  [[ -z "$f" ]] && continue
  i=$((i+1))
  code=$(curl -sSIL -o /dev/null -w "%{http_code}" "$DOMAIN/uncensored/$f" || echo "000")
  if ok "$code"; then
    found_img=$((found_img+1))
  else
    echo "$f" >> "$MISSING_IMG"
  fi
  (( i % 50 == 0 )) && echo "  · ${i}/${tot_img} imágenes…"
done < "$IMG_LIST"

j=0; found_vid=0
while IFS= read -r f || [[ -n "$f" ]]; do
  [[ -z "$f" ]] && continue
  j=$((j+1))
  code=$(curl -sSIL -o /dev/null -w "%{http_code}" "$DOMAIN/uncensored-videos/$f" || echo "000")
  if ok "$code"; then
    found_vid=$((found_vid+1))
  else
    echo "$f" >> "$MISSING_VID"
  fi
  (( j % 20 == 0 )) && echo "  · ${j}/${tot_vid} videos…"
done < "$VID_LIST"

echo "✅ Imágenes existentes: $found_img/$tot_img"
echo "✅ Videos existentes:   $found_vid/$tot_vid"

echo "---- FALTAN IMÁGENES (primeras 30) ----"; head -n 30 "$MISSING_IMG" || true
echo "---- FALTAN VIDEOS (primeros 30) ----";  head -n 30 "$MISSING_VID" || true
echo "Listas completas:"
echo "  $MISSING_IMG"
echo "  $MISSING_VID"
