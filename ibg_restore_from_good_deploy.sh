#!/usr/bin/env bash
set -euo pipefail

TEAM="oriols-projects-ed6b9b04"
PROJECT="ibizagirl-deployable2"
DOMAIN="ibizagirl.pics"

need(){ command -v "$1" >/dev/null || { echo "❌ Falta $1"; exit 1; }; }
need git; need vercel; need curl; need python3

echo "== 0) Link a team/proyecto =="
vercel switch --scope "$TEAM" >/dev/null || true
vercel link --project "$PROJECT" --yes >/dev/null || true

echo "== 1) Buscar el deploy más antiguo (Production) aún disponible =="
# Puedes forzar uno concreto exportando GOOD_URL=https://xxxxx.vercel.app
GOOD_URL="${GOOD_URL:-}"
if [ -z "$GOOD_URL" ]; then
  # Intento con salida JSON; si no, caigo a parseo de texto
  if vercel ls "$PROJECT" --prod --json > _vercel_ls.json 2>/dev/null; then
    python3 - <<'PY' > _pick.txt
import json,sys
data=json.load(open("_vercel_ls.json"))
prods=[d for d in data if (d.get("target")=="production" or d.get("meta",{}).get("deploymentType")=="PRODUCTION")]
prods=[d for d in prods if d.get("state") in ("READY","FROZEN","ARCHIVED","QUEUED","BUILDING","CANCELED","ERROR")]
prods=sorted(prods, key=lambda x: x.get("created",0))
print(prods[0]["url"] if prods else "", end="")
PY
    GOOD_URL="$(cat _pick.txt)"
  else
    # Fallback: modo texto, cogemos la primera URL que parezca .vercel.app
    vercel ls "$PROJECT" --prod | grep -Eo 'https://[^ ]+\.vercel\.app' | tail -n1 > _pick.txt || true
    GOOD_URL="$(cat _pick.txt)"
  fi
fi

if [ -z "$GOOD_URL" ]; then
  echo "❌ No encontré deploys Production. Puedes pasar uno manual:"
  echo "   GOOD_URL=https://xxxx.vercel.app ./ibg_restore_from_good_deploy.sh"
  exit 2
fi
echo "Usando GOOD_URL: $GOOD_URL"

echo "== 2) Descargar artefactos del deploy bueno =="
rm -rf _restored_build
mkdir -p _restored_build

if vercel download "$GOOD_URL" -o _restored_build >/dev/null 2>&1; then
  echo "Descarga con 'vercel download' OK."
else
  echo "⚠️ 'vercel download' no disponible. Haré mirror estático con curl."
  # mirror mínimo de recursos estáticos (suficiente para sitio estático)
  curl -fsSL "$GOOD_URL/" -o _restored_build/index.html
  # Nota: si el sitio tiene más assets (css/js/img), se traerán luego navegando,
  # o añade aquí una lista si conoces rutas fijas.
fi

ls -la _restored_build | sed -n '1,80p'

echo "== 3) Crear rama reset y reemplazar contenido del repo por el build restaurado =="
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
RESET_BRANCH="reset-from-good-$(date +%Y%m%d-%H%M%S)"
git checkout -b "$RESET_BRANCH"

# Limpiar todo salvo .git y .vercel
find . -maxdepth 1 ! -name '.' ! -name '..' ! -name '.git' ! -name '.vercel' -exec rm -rf {} +

# Copiar restaurado a raíz
shopt -s dotglob
cp -r _restored_build/* .
shopt -u dotglob

# Salvaguardas mínimas para static hosting
[ -f vercel.json ] || cat > vercel.json <<'JSON'
{ "cleanUrls": true, "trailingSlash": false,
  "routes": [
    { "src": "^/$", "dest": "/index.html" },
    { "src": "^/(index\\.html)?$", "dest": "/index.html" }
  ]
}
JSON
[ -f 404.html ] || printf '%s\n' '<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=/index.html">' > 404.html
[ -f favicon.ico ] || : > favicon.ico
[ -f fingerprint.txt ] || printf '%s\n' "$(date -u +'%Y-%m-%dT%H:%M:%SZ') | restored-from: $GOOD_URL" > fingerprint.txt

git add -A
git commit -m "RESET: contenido restaurado desde $GOOD_URL + routing estático mínimo"
git push -u origin "$RESET_BRANCH"

echo "== 4) Deploy a producción del contenido restaurado =="
OUT="$(vercel --prod --yes 2>&1 || true)"
echo "$OUT" > _vercel_out_restore.txt
DEPLOY_URL="$(printf "%s\n" "$OUT" | grep -Eo 'https://[^[:space:]]+\.vercel\.app' | tail -n1 || true)"
[ -n "${DEPLOY_URL:-}" ] || DEPLOY_URL="https://$PROJECT.vercel.app"
echo "Deploy => $DEPLOY_URL"

echo "== 5) Alias proyecto y dominio -> deploy restaurado =="
vercel alias set "$DEPLOY_URL" "$PROJECT.vercel.app" >/dev/null || true
if vercel alias ls | grep -q "$DOMAIN"; then printf "y\n" | vercel alias rm "$DOMAIN" >/dev/null || true; fi
vercel alias set "$DEPLOY_URL" "$DOMAIN" >/dev/null || true

echo "== 6) Verificación HTTP (HEAD) =="
code(){ curl -fsSIL "$1" | awk 'BEGIN{FS=": "}/^HTTP/{c=$2} END{print c}'; }
C_DEPLOY=$(code "$DEPLOY_URL/");                 printf "%-30s -> %s\n" "DEPLOY" "$C_DEPLOY"
C_PROJ=$(code "https://$PROJECT.vercel.app/");   printf "%-30s -> %s\n" "$PROJECT.vercel.app" "$C_PROJ"
C_DOMN=$(code "https://$DOMAIN/" || true);       printf "%-30s -> %s\n" "$DOMAIN" "${C_DOMN:-<sin-resp>}"

if [ "${C_DOMN:-}" = "401" ]; then
  echo
  echo "⚠️ $DOMAIN devuelve 401 (Password Protection de Vercel en Production, a nivel de dominio/proyecto)."
  echo "   Esto NO se activa desde nuestras páginas; es un toggle en el dashboard del proyecto."
  echo "   Desactícalo aquí (Production): https://vercel.com/${TEAM}/${PROJECT}/settings/security"
  vercel env pull -y .env.production --environment=production >/dev/null 2>&1 || true
  TOKEN="$(grep -E '^VERCEL_PROTECTION_BYPASS=' .env.production | sed 's/^[^=]*=//' || true)"
  if [ -n "${TOKEN:-}" ]; then
    echo
    echo "   Bypass temporal (en tu navegador → DevTools → Console):"
    echo "   document.cookie = 'vercel-protection-bypass=$TOKEN; Path=/; Max-Age=31536000; Secure; SameSite=None'; location.reload();"
  fi
fi

echo
echo "✅ Hecho. Rama con base limpia: $RESET_BRANCH"
