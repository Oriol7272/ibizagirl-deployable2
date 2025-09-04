#!/usr/bin/env bash
set -euo pipefail

# ==== Ajusta si hace falta ====
PROJECT="${PROJECT:-ibizagirl-final}"        # Nombre del proyecto en Vercel
TEAM="${TEAM:-oriols-projects-ed6b9b04}"     # Scope / equipo en Vercel
DOMAIN="${DOMAIN:-ibizagirl.pics}"           # Dominio final

# ==== Requisitos ====
command -v node >/dev/null || { echo "Falta node"; exit 1; }
command -v npm  >/dev/null || { echo "Falta npm"; exit 1; }
if ! command -v vercel >/dev/null; then npm i -g vercel@latest >/dev/null; fi

# ==== Linking proyecto (en el repo local ibizagirl-deployable2) ====
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"
vercel link --project "$PROJECT" --scope "$TEAM" --yes >/dev/null || true

# ==== Sanitiza vercel.json para evitar runtimes inválidos ====
# (solo headers y estático; sin "functions" ni "routes" raras)
cat > vercel.json <<'JSON'
{
  "trailingSlash": false,
  "cleanUrls": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=300" }
      ]
    }
  ]
}
JSON

# ==== .vercelignore básico ====
cat > .vercelignore <<'TXT'
.git/
node_modules/
*.log
.DS_Store
.vscode/
ibg_audit/
_backup_*/
scripts/
tools/
TXT

# ==== Helper para setear envs en Vercel (production) ====
add_env () {
  local KEY="$1"; shift
  local VAL="$1"; shift
  # Eliminar si existe (silencioso) y volver a crear
  vercel env rm "$KEY" production --yes --scope "$TEAM" --project "$PROJECT" >/dev/null 2>&1 || true
  printf "%s" "$VAL" | vercel env add "$KEY" production --scope "$TEAM" --project "$PROJECT" >/dev/null
  echo "env[production] set: $KEY"
}

echo "== Inyectando environment variables (production) =="

# ==== PayPal ====
add_env PAYPAL_WEBHOOK_ID "7YP450914N8142540"
add_env PAYPAL_PLAN_MONTHLY_1499 "P-3WE8037612641383DNCUKNJI"
add_env PAYPAL_PLAN_ANNUAL_4999  "P-43K261214Y571983RNCUKN7I"
add_env PAYPAL_CLIENT_ID "AfQEdiielw5fm3wF08p9pcxwqR3gPz82YRNUTKY4A8WNG9AktiGsDNyr2i7BsjVzSwwpeCwR7Tt7DPq5"
add_env PAYPAL_SECRET    "EGeBAStDv-G2iALPalvnyERyNFnInPCI03pgP_rscAKaszgJTKzJwz4kbFQx_XeKfPVS4HLGuhM533Dv"

# ==== Ads / Chat / Misc ====
add_env POPADS_ENABLE "true"
add_env EROADVERTISING_SNIPPET_B64 "2093981"
add_env JUICYADS_SNIPPET_B64 "2093981"
add_env CRISP_WEBSITE_ID "59e184b1-e679-4c93-b3ea-d60b63c1c04c"
add_env JUICYADS_ZONE "1099637"
add_env POPADS_SITE_ID "e494ffb82839a29122608e933394c091"
add_env EXOCLICK_ZONE "5696328"
add_env EROADVERTISING_ZONE "8177575"
add_env IBG_ASSETS_BASE_URL "https://ibizagirl-assets.s3.eu-north-1.amazonaws.com"

# (Opcional) mismas envs en preview/dev si las necesitas en builds previas:
# for T in preview development; do printf "%s\n" "$T"; done | while read -r T; do ...; done

# ==== Alta de dominio en Vercel (idempotente) ====
vercel domains add "$DOMAIN" --scope "$TEAM" >/dev/null || true
vercel domains add "www.$DOMAIN" --scope "$TEAM" >/dev/null || true

# ==== Deploy producción ====
TMP_OUT="$(mktemp)"
vercel --prod --yes --scope "$TEAM" --project "$PROJECT" | tee "$TMP_OUT" >/dev/null || true
DEPLOY_URL="$(sed -n 's@.*\(https://[^ ]\+\.vercel\.app\).*@\1@p' "$TMP_OUT" | tail -n1)"
[ -n "${DEPLOY_URL:-}" ] || DEPLOY_URL="https://${PROJECT}.vercel.app"
echo "Deploy URL: $DEPLOY_URL"

# ==== Alias a dominio ====
vercel alias set "$DEPLOY_URL" "$DOMAIN" --scope "$TEAM" >/dev/null || true
vercel alias set "$DEPLOY_URL" "www.$DOMAIN" --scope "$TEAM" >/dev/null || true

# ==== Recordatorio DNS Porkbun (manual si no usas API) ====
cat <<DNS

== DNS recomendado (Porkbun) ==
A     @                  76.76.21.21       (apex -> Vercel)
CNAME www                cname.vercel-dns.com.

TIP: Evita tener varios ALIAS en el apex. Deja solo el A 76.76.21.21 para @ y el CNAME para www.
DNS

# ==== Comprobaciones rápidas ====
echo "== HEAD ibizagirl.pics =="
curl -sSIL "https://$DOMAIN/" | sed -n '1,5p' || true
echo "== HEAD www.ibizagirl.pics =="
curl -sSIL "https://www.$DOMAIN/" | sed -n '1,5p' || true

echo "✅ Vercel listo y aliaseado a $DOMAIN"
