#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="${ROOT_DIR}/js/env.js"

# Función para imprimir clave con escape básico
emit() {
  local k="$1"; shift
  local v="${1-}"
  printf '  %s:%s,\n' "$k" "$(printf '%s' "$v" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')"
}

# Empieza objeto
echo "window.__ENV={" > "${OUT}"

# === PASAMOS TUS NOMBRES REALES SIN CAMBIARLOS ===
emit PAYPAL_CLIENT_ID            "${PAYPAL_CLIENT_ID-}"
emit PAYPAL_SECRET               "${PAYPAL_SECRET-}"
emit PAYPAL_WEBHOOK_ID           "${PAYPAL_WEBHOOK_ID-}"
emit PAYPAL_PLAN_MONTHLY_1499    "${PAYPAL_PLAN_MONTHLY_1499-}"
emit PAYPAL_PLAN_ANNUAL_4999     "${PAYPAL_PLAN_ANNUAL_4999-}"

emit CRISP_WEBSITE_ID            "${CRISP_WEBSITE_ID-}"

emit JUICYADS_ZONE               "${JUICYADS_ZONE-}"
emit EXOCLICK_ZONE               "${EXOCLICK_ZONE-}"
emit EROADVERTISING_ZONE         "${EROADVERTISING_ZONE-}"
emit ERO_PID                     "${ERO_PID-}"
emit ERO_CTRLID                  "${ERO_CTRLID-}"

emit POPADS_SITE_ID              "${POPADS_SITE_ID-}"
emit POPADS_ENABLE               "${POPADS_ENABLE-}"

emit ADS_ENABLED                 "${ADS_ENABLED-}"

# Alias/variantes opcionales (si en tus capturas hay otros nombres, los añadimos aquí SIN romper los anteriores)
# Ejemplos: si hubieras usado EXO_ZONE o JUICY_ZONE, también los exportamos para JS.
emit EXO_ZONE                    "${EXO_ZONE-}"
emit JUICY_ZONE                  "${JUICY_ZONE-}"
emit ERO_ZONE                    "${ERO_ZONE-}"

# Cierra objeto eliminando coma final
truncate -s -2 "${OUT}" 2>/dev/null || true
echo -e "\n};" >> "${OUT}"
echo "✅ Generated js/env.js"
