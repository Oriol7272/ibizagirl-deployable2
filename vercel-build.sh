#!/usr/bin/env bash
set -e

# 1) Genera el JS con tus variables reales de Vercel (left/right/bottom, popads, juicyads, ero…)
bash tools/ads-env.sh

# 2) (Opcional) Si necesitas construir algo más, hazlo aquí.
#    Si tu web es estática y sirves /public tal cual, no hace falta nada más.
echo "✅ Build listo (env de anuncios generado en public/js/env-ads-inline.js)"
