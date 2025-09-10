#!/usr/bin/env bash
set -euo pipefail

# === Valores que Vercel te recomienda en tu captura ===
DOMAIN="${DOMAIN:-beachgirl.pics}"
NEW_APEX_A="${NEW_APEX_A:-216.150.1.1}"
NEW_WWW_CNAME="${NEW_WWW_CNAME:-7e70297310cbcf57.vercel-dns-016.com.}"   # FQDN (con punto final OK)
TTL="${TTL:-300}"

TEAM="oriols-projects-ed6b9b04"
PROJECT="beachgirl-final"

need(){ command -v "$1" >/dev/null || { echo "Falta $1"; exit 1; }; }
need curl
command -v jq >/dev/null || { echo "⚠️ Falta jq (instala: brew install jq / apt-get install jq)"; exit 1; }

open_url(){ case "$(uname)" in
  Darwin) open "$1" >/dev/null 2>&1 || true ;;
  Linux) command -v xdg-open >/dev/null && xdg-open "$1" >/dev/null 2>&1 || true ;;
esac; printf " -> %s\n" "$1"; }

echo "== Objetivo (según Vercel) =="
echo "  A     @    -> ${NEW_APEX_A}   (TTL ${TTL})"
echo "  CNAME www  -> ${NEW_WWW_CNAME} (TTL ${TTL})"
echo

# --- ¿Tienes API de Porkbun? ---
if [[ -n "${PORKBUN_API_KEY:-}" && -n "${PORKBUN_SECRET_KEY:-}" ]]; then
  PB="https://porkbun.com/api/json/v3"
  AUTH="$(jq -n --arg a "$PORKBUN_API_KEY" --arg s "$PORKBUN_SECRET_KEY" '{apikey:$a,secretapikey:$s}')"
  code="$(curl -sS -o /tmp/pb.json -w '%{http_code}' "$PB/ping" -H 'Content-Type: application/json' -d "$AUTH" || true)"
  if [[ "$code" != "200" ]]; then
    echo "❗ Claves Porkbun inválidas/no habilitado. Iré por pasos MANUALES."
  else
    echo "== Aplicando por API de Porkbun =="
    pb_get(){ curl -fsS "$PB/dns/retrieve/$DOMAIN" -H 'Content-Type: application/json' -d "$AUTH"; }
    pb_del(){ curl -fsS "$PB/dns/delete/$DOMAIN/$1" -H 'Content-Type: application/json' -d "$AUTH" >/dev/null; }
    pb_up(){ local id="$1" h="$2" t="$3" c="$4"
      local p; p="$(jq -n --arg a "$PORKBUN_API_KEY" --arg s "$PORKBUN_SECRET_KEY" --arg name "$h" --arg type "$t" --arg content "$c" --argjson ttl "$TTL" '{apikey:$a,secretapikey:$s,name:$name,type:$type,content:$content,ttl:$ttl}')"
      if [[ -n "$id" && "$id" != "null" ]]; then
        curl -fsS "$PB/dns/edit/$DOMAIN/$id" -H 'Content-Type: application/json' -d "$p" >/dev/null
      else
        curl -fsS "$PB/dns/create/$DOMAIN" -H 'Content-Type: application/json' -d "$p" >/dev/null
      fi
    }
    now="$(pb_get)"
    # Limpieza de conflictos
    for id in $(echo "$now" | jq -r '.records[] | select(.type=="ALIAS" and (.name=="@" or .name=="www")) | .id'); do pb_del "$id"; done
    for id in $(echo "$now" | jq -r '.records[] | select(.name=="@" and (.type=="CNAME" or .type=="AAAA")) | .id'); do pb_del "$id"; done
    for id in $(echo "$now" | jq -r '.records[] | select(.name=="www" and (.type=="A" or .type=="AAAA")) | .id'); do pb_del "$id"; done
    # Upsert
    id_apex=$(echo "$now" | jq -r '.records[] | select(.name=="@" and .type=="A") | .id' | head -n1)
    id_www=$(echo "$now" | jq -r '.records[] | select(.name=="www" and .type=="CNAME") | .id' | head -n1)
    pb_up "$id_apex" "@" "A" "$NEW_APEX_A"
    pb_up "$id_www"  "www" "CNAME" "$NEW_WWW_CNAME"
  fi
fi

# --- Pasos MANUALES (o confirmación si API no usada) ---
if [[ -z "${PORKBUN_API_KEY:-}" || -z "${PORKBUN_SECRET_KEY:-}" || "$code" != "200" ]]; then
  echo "== HAZ ESTO EN PORKBUN (paso a paso) =="
  open_url "https://porkbun.com/account/domainsSpeedy"
  cat <<STEPS

1) En 'Current Records':
   - Si ves ALIAS en @ o en www → eliminar.
   - Edita (icono lápiz) el registro A del apex:
       TYPE: A
       HOST: @
       ANSWER: ${NEW_APEX_A}
       TTL: ${TTL}
     Guarda.
   - Edita (icono lápiz) el registro CNAME de www:
       TYPE: CNAME
       HOST: www
       ANSWER: ${NEW_WWW_CNAME}
       TTL: ${TTL}
     Guarda.

2) Confirma que la tabla quede EXACTAMENTE:
   TYPE   HOST   ANSWER
   A      @      ${NEW_APEX_A}
   CNAME  www    ${NEW_WWW_CNAME}

STEPS
  read -r -p "Pulsa ENTER cuando lo hayas guardado en Porkbun..." _
fi

# --- Verificación de propagación ---
echo "== Verificando DNS hasta que coincida con lo recomendado =="
okA=""; okC=""
for i in $(seq 1 20); do
  Arec="$(dig +short A "$DOMAIN" @1.1.1.1 | head -n1)"
  Crec="$(dig +short CNAME "www.$DOMAIN" @1.1.1.1 | head -n1)"
  printf "[%02d] A=%s  CNAME=%s\n" "$i" "${Arec:-nil}" "${Crec:-nil}"
  [[ "$Arec" == "$NEW_APEX_A" ]] && okA=1 || okA=""
  [[ "$Crec" == "${NEW_WWW_CNAME%?}." || "$Crec" == "$NEW_WWW_CNAME" ]] && okC=1 || okC=""
  [[ -n "$okA" && -n "$okC" ]] && break
  sleep 6
done

if [[ -z "$okA" || -z "$okC" ]]; then
  echo "⚠️ Aún no coincide. Revisa Porkbun y repite 'Refresh' en Vercel luego."
else
  echo "✅ DNS listo según Vercel."
fi

# --- Refresco/inspección en Vercel ---
echo "== Abre y pulsa REFRESH en Settings → Domains =="
open_url "https://vercel.com/oriols-projects-ed6b9b04/$PROJECT/settings/domains"
echo "   (en beachgirl.pics y www.beachgirl.pics) hasta ver 'Valid Configuration'."

# Comprobaciones rápidas HTTP
echo "== HTTP check =="
curl -sS -o /dev/null -w "beachgirl.pics -> %{http_code}\n" "https://$DOMAIN/"
curl -sS -o /dev/null -w "www.beachgirl.pics -> %{http_code}\n" "https://www.$DOMAIN/"

# (Opcional) inspección CLI
if command -v vercel >/dev/null; then
  vercel domains inspect "$DOMAIN" --scope "$TEAM" || true
  vercel domains inspect "www.$DOMAIN" --scope "$TEAM" || true
fi

echo "Hecho."
