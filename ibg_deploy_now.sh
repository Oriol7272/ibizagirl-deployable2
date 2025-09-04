#!/usr/bin/env bash
set -euo pipefail

TEAM="oriols-projects-ed6b9b04"
PROJECT="ibizagirl-deployable2"
DOMAIN="ibizagirl.pics"

echo "== 0) Link a team/proyecto =="
vercel switch --scope "$TEAM" >/dev/null || true
# si ya está linkeado, esto no pregunta nada
vercel link --project "$PROJECT" >/dev/null || true

echo "== 1) Routing estático mínimo (si faltara) =="
# garantiza / -> /index.html y 404 propia
[ -f vercel.json ] || cat > vercel.json <<'JSON'
{ "cleanUrls": true, "trailingSlash": false,
  "routes": [
    { "src": "^/$", "dest": "/index.html" },
    { "src": "^/(index\\.html)?$", "dest": "/index.html" }
  ] }
JSON
[ -f 404.html ] || cat > 404.html <<'HTML'
<!doctype html><meta charset="utf-8"><title>Not Found — ibizagirl.pics</title>
<meta http-equiv="refresh" content="0; url=/index.html">
<p>Redirigiendo a <a href="/index.html">Home</a>…</p>
HTML
[ -f favicon.ico ] || : > favicon.ico
git add -A || true
git diff --cached --quiet || git commit -m "routing + 404 + favicon (prod safety)" || true
git push || true

echo "== 2) Deploy a producción (no interactivo) =="
# Evita prompts si ya está linkeado
OUT="$(vercel --prod 2>&1 | tee _vercel_out_latest.txt || true)"
URL="$(printf "%s\n" "$OUT" | sed -nE 's/^✅[[:space:]]+Production:[[:space:]]+(https:\/\/[^[:space:]]+).*$/\1/p' | tail -n1)"
[ -n "${URL:-}" ] || URL="$(sed -nE 's/.*(https:\/\/[^[:space:]]+\.vercel\.app).*/\1/p' _vercel_out_latest.txt | tail -n1)"
[ -n "${URL:-}" ] || { echo "❌ No pude detectar URL de prod. Miro fallback del alias de proyecto…"; URL="https://$PROJECT.vercel.app"; }
echo "    Deploy prod => $URL"

echo "== 3) Alias -> deploy actual =="
# 3a) alias del proyecto
vercel alias set "$URL" "$PROJECT.vercel.app" >/dev/null
# 3b) reasignar dominio (si existe en otro deploy, lo movemos)
if vercel alias ls | grep -q "$DOMAIN"; then
  printf "y\n" | vercel alias rm "$DOMAIN" >/dev/null || true
fi
vercel alias set "$URL" "$DOMAIN" >/dev/null || true

echo "== 4) Verificación HEAD (códigos HTTP) =="
code_deploy=$(curl -fsSIL "$URL/" | awk 'BEGIN{FS=": "}/^HTTP/{c=$2} END{print c}')
code_proj=$(curl -fsSIL "https://$PROJECT.vercel.app/" | awk 'BEGIN{FS=": "}/^HTTP/{c=$2} END{print c}')
code_dom=$(curl -fsSIL "https://$DOMAIN/" | awk 'BEGIN{FS=": "}/^HTTP/{c=$2} END{print c}')
printf "  %-30s %s\n" "DEPLOY" "$code_deploy"
printf "  %-30s %s\n" "$PROJECT.vercel.app" "$code_proj"
printf "  %-30s %s\n" "$DOMAIN" "$code_dom"

if [ "$code_dom" = "401" ]; then
  echo
  echo "⚠️  $DOMAIN está PROTEGIDO (401). Saco token de bypass…"
  vercel env pull -y .env.vercel >/dev/null || true
  if grep -q '^VERCEL_PROTECTION_BYPASS=' .env.vercel; then
    TOKEN="$(grep '^VERCEL_PROTECTION_BYPASS=' .env.vercel | sed 's/^[^=]*=//')"
    echo
    echo "👉 En tu navegador, abre https://$DOMAIN y pega EXACTAMENTE en la consola (DevTools → Console):"
    echo "document.cookie = 'vercel-protection-bypass=$TOKEN; Path=/; Max-Age=31536000; Secure; SameSite=None'; location.reload();"
    echo
    echo "Comprobación por curl con cookie:"
    curl -fsSIL "https://$DOMAIN/" -H "Cookie: vercel-protection-bypass=$TOKEN" | awk 'BEGIN{FS=": "}/^HTTP/{print "   ",$0}'
    echo
    echo "Si quieres quitar la protección: Dashboard → Project → Settings → Security → Password Protection (Production) → OFF."
  else
    echo "No encontré VERCEL_PROTECTION_BYPASS en .env.vercel. Quita la protección en el dashboard (Settings → Security)."
  fi
fi

echo "== 5) Fingerprint (debería ser OK en los tres) =="
for host in "$URL" "https://$PROJECT.vercel.app" "https://$DOMAIN"; do
  printf "%-35s -> " "$host"
  curl -fsSL "$host/fingerprint.txt?ts=$(date +%s)" 2>/dev/null | sed -e 's/[^[:print:]]//g' -e 's/$/ /'
  echo
done

echo "== DONE =="
