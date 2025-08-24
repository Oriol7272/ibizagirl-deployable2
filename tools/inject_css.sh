#!/usr/bin/env bash
set -euo pipefail
link='<link rel="stylesheet" href="/css/site.css">'
shopt -s nullglob
files=( *.html )
if [ ${#files[@]} -eq 0 ]; then
  echo "No HTML files found"
  exit 0
fi
for f in "${files[@]}"; do
  if grep -q 'css/site.css' "$f"; then
    echo "Already has CSS: $f"
    continue
  fi
  if grep -q '</head>' "$f"; then
    awk -v L="$link" '{print} /<\/head>/{print "  " L}' "$f" > "$f.tmp" || true
  else
    cp "$f" "$f.tmp"
    printf "\n  %s\n" "$link" >> "$f.tmp"
  fi
  if [ -f "$f.tmp" ]; then mv "$f.tmp" "$f"; echo "Injected CSS in: $f"; fi
done
