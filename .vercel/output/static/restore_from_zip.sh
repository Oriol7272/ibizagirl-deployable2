#!/usr/bin/env bash
set -Eeuo pipefail
ZIP="${1:-}"; [[ -f "$ZIP" ]] || { echo "❌ Pasa la ruta del ZIP"; exit 1; }
stage="$(pwd)/.restore_stage"; rm -rf "$stage"; mkdir -p "$stage"
if command -v ditto >/dev/null 2>&1; then ditto -x -k "$ZIP" "$stage"; else unzip -q -o "$ZIP" -d "$stage" || true; fi
topdir="$(find "$stage" -mindepth 1 -maxdepth 1 -type d -print -quit)"
srcdir="$(dirname "$(find "$topdir" -type f -name index.html -print -quit)")"
[ -n "$srcdir" ] && [ -f "$srcdir/index.html" ] || { echo "❌ No encuentro index.html en el ZIP"; exit 1; }
rsync -a --delete --exclude='.git' --exclude='.vercel' \
  --exclude='uncensored/' --exclude='uncensored-videos/' --exclude='full/' \
  "$srcdir"/ ./
echo "✅ RESTORE OK (sin assets pesados)"; echo "ℹ️  Borrar stage: rm -rf .restore_stage"
