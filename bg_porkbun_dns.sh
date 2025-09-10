#!/usr/bin/env bash
set -euo pipefail

DOMAIN="${DOMAIN:-beachgirl.pics}"
PORKBUN_API_KEY="${PORKBUN_API_KEY:-CHANGE_ME}"
PORKBUN_SECRET_KEY="${PORKBUN_SECRET_KEY:-CHANGE_ME}"
TTL="${TTL:-300}"

command -v curl >/dev/null || { echo "curl requerido"; exit 1; }
command -v jq >/dev/null   || { echo "jq requerido (instala: brew install jq / apt-get install jq)"; exit 1; }

PB="https://porkbun.com/api/json/v3"
AUTH="$(jq -n --arg a "$PORKBUN_API_KEY" --arg s "$PORKBUN_SECRET_KEY" '{apikey:$a,secretapikey:$s}')"

if [[ "$PORKBUN_API_KEY" == "CHANGE_ME" || "$PORKBUN_SECRET_KEY" == "CHANGE_ME" ]]; then
  echo "Configura PORKBUN_API_KEY y PORKBUN_SECRET_KEY (export ...)."; exit 1
fi

pb_get() {
  curl -fsS "$PB/dns/retrieve/$DOMAIN" \
    -H 'Content-Type: application/json' \
    -d "$AUTH"
}

pb_del() {
  local id="$1"
  curl -fsS "$PB/dns/delete/$DOMAIN/$id" \
    -H 'Content-Type: application/json' \
    -d "$AUTH" >/dev/null
}

pb_create() {
  local host="$1" type="$2" answer="$3" ttl="$4"
  local payload
  payload="$(jq -n --arg a "$PORKBUN_API_KEY" --arg s "$PORKBUN_SECRET_KEY" \
                  --arg name "$host" --arg type "$type" --arg content "$answer" --argjson ttl "$ttl" \
                  '{apikey:$a,secretapikey:$s,name:$name,type:$type,content:$content,ttl:$ttl}')"
  curl -fsS "$PB/dns/create/$DOMAIN" \
    -H 'Content-Type: application/json' \
    -d "$payload" >/dev/null
}

pb_edit() {
  local id="$1" host="$2" type="$3" answer="$4" ttl="$5"
  local payload
  payload="$(jq -n --arg a "$PORKBUN_API_KEY" --arg s "$PORKBUN_SECRET_KEY" \
                  --arg name "$host" --arg type "$type" --arg content "$answer" --argjson ttl "$ttl" \
                  '{apikey:$a,secretapikey:$s,name:$name,type:$type,content:$content,ttl:$ttl}')"
  curl -fsS "$PB/dns/edit/$DOMAIN/$id" \
    -H 'Content-Type: application/json' \
    -d "$payload" >/dev/null
}

ensure_record() {
  # ensure_record host type wanted_answer
  local host="$1" type="$2" want="$3"
  local now rec_id cur_ans
  now="$(pb_get)"
  rec_id="$(echo "$now" | jq -r --arg h "$host" --arg t "$type" '.records[] | select(.name==$h and .type==$t) | .id' | head -n1 || true)"
  cur_ans="$(echo "$now" | jq -r --arg h "$host" --arg t "$type" '.records[] | select(.name==$h and .type==$t) | .content' | head -n1 || true)"
  if [[ -n "${rec_id:-}" && "$rec_id" != "null" ]]; then
    if [[ "$cur_ans" == "$want" ]]; then
      echo "✓ $type $host ya correcto ($want)"
    else
      pb_edit "$rec_id" "$host" "$type" "$want" "$TTL"
      echo "↺ Editado: $type $host -> $want"
    fi
  else
    pb_create "$host" "$type" "$want" "$TTL"
    echo "＋ Creado: $type $host -> $want"
  fi
}

purge_conflicts() {
  # Quita ALIAS y registros que molesten
  local now ids
  now="$(pb_get)"

  # Borrar ALIAS @ y ALIAS www
  ids="$(echo "$now" | jq -r '.records[] | select(.type=="ALIAS" and (.name=="@" or .name=="www")) | .id')"
  if [[ -n "${ids:-}" ]]; then
    echo "$ids" | while read -r id; do [[ -n "$id" ]] && pb_del "$id" && echo "－ Borrado ALIAS id=$id"; done
  fi

  # En apex @ solo debe quedar A (no CNAME/AAAA)
  ids="$(echo "$now" | jq -r '.records[] | select(.name=="@" and (.type=="CNAME" or .type=="AAAA")) | .id')"
  if [[ -n "${ids:-}" ]]; then
    echo "$ids" | while read -r id; do [[ -n "$id" ]] && pb_del "$id" && echo "－ Borrado @ tipo conflictivo id=$id"; done
  fi

  # En www solo debe quedar CNAME (no A/AAAA)
  ids="$(echo "$now" | jq -r '.records[] | select(.name=="www" and (.type=="A" or .type=="AAAA")) | .id')"
  if [[ -n "${ids:-}" ]]; then
    echo "$ids" | while read -r id; do [[ -n "$id" ]] && pb_del "$id" && echo "－ Borrado www tipo conflictivo id=$id"; done
  fi
}

echo "== Porkbun DNS para $DOMAIN =="
purge_conflicts
ensure_record "@"   "A"     "76.76.21.21"
ensure_record "www" "CNAME" "cname.vercel-dns.com"

echo "== Estado final =="
pb_get | jq -r '.records[] | select((.name=="@" or .name=="www") and (.type=="A" or .type=="CNAME")) | "\(.type)\t\(.name)\t\(.content)\tTTL=\(.ttl)"'

echo "✅ DNS listo. Propagación ~minutos."
