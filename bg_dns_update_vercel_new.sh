#!/usr/bin/env bash
set -euo pipefail
DOMAIN="${DOMAIN:-beachgirl.pics}"
NEW_APEX_A="${NEW_APEX_A:-216.150.1.1}"
NEW_WWW_CNAME="${NEW_WWW_CNAME:-7e70297310cbcf57.vercel-dns-016.com.}"
TTL="${TTL:-300}"

need(){ command -v "$1" >/dev/null || { echo "Falta $1"; exit 1; }; }
need curl; need jq

if [[ -z "${PORKBUN_API_KEY:-}" || -z "${PORKBUN_SECRET_KEY:-}" ]]; then
  echo "❗ Sin API de Porkbun. Hazlo manual en UI:"
  echo " - A @ -> $NEW_APEX_A (TTL $TTL)"
  echo " - CNAME www -> $NEW_WWW_CNAME (TTL $TTL)"
  exit 0
fi

PB="https://porkbun.com/api/json/v3"
AUTH="$(jq -n --arg a "$PORKBUN_API_KEY" --arg s "$PORKBUN_SECRET_KEY" '{apikey:$a,secretapikey:$s}')"
curl -fsS "$PB/ping" -H 'Content-Type: application/json' -d "$AUTH" >/dev/null

pb_get(){ curl -fsS "$PB/dns/retrieve/$DOMAIN" -H 'Content-Type: application/json' -d "$AUTH"; }
pb_del(){ curl -fsS "$PB/dns/delete/$DOMAIN/$1" -H 'Content-Type: application/json' -d "$AUTH" >/dev/null; }
pb_up(){ local id="$1" h="$2" t="$3" c="$4"; local p; p="$(jq -n --arg a "$PORKBUN_API_KEY" --arg s "$PORKBUN_SECRET_KEY" --arg name "$h" --arg type "$t" --arg content "$c" --argjson ttl "$TTL" '{apikey:$a,secretapikey:$s,name:$name,type:$type,content:$content,ttl:$ttl}')"; if [[ -n "$id" && "$id" != "null" ]]; then curl -fsS "$PB/dns/edit/$DOMAIN/$id" -H 'Content-Type: application/json' -d "$p" >/dev/null; else curl -fsS "$PB/dns/create/$DOMAIN" -H 'Content-Type: application/json' -d "$p" >/dev/null; fi; }

now="$(pb_get)"
# limpia ALIAS y conflictos
for id in $(echo "$now" | jq -r '.records[] | select(.type=="ALIAS" and (.name=="@" or .name=="www")) | .id'); do pb_del "$id"; done
for id in $(echo "$now" | jq -r '.records[] | select(.name=="@" and (.type=="CNAME" or .type=="AAAA")) | .id'); do pb_del "$id"; done
for id in $(echo "$now" | jq -r '.records[] | select(.name=="www" and (.type=="A" or .type=="AAAA")) | .id'); do pb_del "$id"; done

# upsert A @ y CNAME www
id_apex=$(echo "$now" | jq -r '.records[] | select(.name=="@" and .type=="A") | .id' | head -n1)
id_www=$(echo "$now" | jq -r '.records[] | select(.name=="www" and .type=="CNAME") | .id' | head -n1)
pb_up "$id_apex" "@" "A" "$NEW_APEX_A"
pb_up "$id_www" "www" "CNAME" "$NEW_WWW_CNAME"

# mostrar estado
pb_get | jq -r '.records[] | select((.name=="@" or .name=="www") and (.type=="A" or .type=="CNAME")) | "\(.type)\t\(.name)\t\(.content)\tTTL=\(.ttl)"'
