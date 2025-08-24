#!/usr/bin/env bash
set -euo pipefail

# Genera window.__ENV con TODAS las variables del entorno de build de Vercel (tal cual)
mkdir -p js public/js

node -e 'const fs=require("fs"); fs.writeFileSync("js/env.js", "window.__ENV="+JSON.stringify(process.env)+";");'
cp -f js/env.js public/js/env.js

echo "✅ Generated js/env.js and public/js/env.js"
