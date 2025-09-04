#!/usr/bin/env bash
set -euo pipefail
TEAM="oriols-projects-ed6b9b04"
NEW_PROJECT="ibizagirl-clean-$(date +%Y%m%d-%H%M%S)"
DOMAIN="ibizagirl.pics"

need(){ command -v "$1" >/dev/null || { echo "❌ Falta $1"; exit 1; }; }
need vercel; need curl

# --- sitio mínimo y limpio ---
rm -rf _clean_site
mkdir -p _clean_site
cat > _clean_site/index.html <<'HTML'
<!doctype html><meta charset="utf-8">
<title>IBIZAGIRL — RESET OK</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<h1 style="font-family:system-ui">✅ IBIZAGIRL RESET OK</h1>
<p>Build limpio. Si ves esto, el deploy funciona y NO hay protección.</p>
<p id="fp"></p>
<script>fetch('fingerprint.txt',{cache:'no-store'}).then(r=>r.text()).then(t=>document.getElementById('fp').textContent=t).catch(()=>{})</script>
HTML

cat > _clean_site/vercel.json <<'JSON'
{ "cleanUrls": true, "trailingSlash": false,
  "routes": [
    { "src": "^/$", "dest": "/index.html" },
    { "src": "^/(index\\.html)?$", "dest": "/index.html" }
  ]
}
JSON

date -u +'%Y-%m-%dT%H:%M:%SZ | IBG CLEAN BASE' > _clean_site/fingerprint.txt
: > _clean_site/favicon.ico

echo "== 1) Deploy a proyecto NUEVO (sin prompts) =="
( cd _clean_site && vercel --prod --yes --scope "$TEAM" --name "$NEW_PROJECT" > ../_vercel_out_new.txt 2>&1 )
DEPLOY_URL="$(grep -Eo 'https://[^[:space:]]+\.vercel\.app' _vercel_out_new.txt | tail -n1 || true)"
[ -n "${DEPLOY_URL:-}" ] || { echo "❌ No detecté la URL del deploy nuevo. Mira _vercel_out_new.txt"; exit 2; }
echo "    Deploy nuevo => $DEPLOY_URL"

echo "== 2) Verificación (esperado 200) =="
CODE_DEPLOY="$(curl -fsSIL "$DEPLOY_URL/" | awk 'BEGIN{FS=": "}/^HTTP/{c=$2} END{print c}')"
echo "    $DEPLOY_URL -> $CODE_DEPLOY"
[ "$CODE_DEPLOY" = "200" ] || { echo "❌ El nuevo deploy no da 200. Abre _vercel_out_new.txt"; exit 3; }

echo "== 3) (Opcional) Mover dominio al proyecto nuevo =="
echo "Cuando confirmes que ves 'RESET OK' en $DEPLOY_URL:"
echo "  vercel alias set \"$DEPLOY_URL\" \"$NEW_PROJECT.vercel.app\" --scope \"$TEAM\""
echo "  vercel alias set \"$DEPLOY_URL\" \"$DOMAIN\" --scope \"$TEAM\""
echo
echo "✅ Proyecto nuevo: $NEW_PROJECT"
echo "   URL: $DEPLOY_URL"
