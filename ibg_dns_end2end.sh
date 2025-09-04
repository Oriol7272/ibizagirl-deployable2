#!/usr/bin/env bash
set -euo pipefail

DOMAIN="${DOMAIN:-ibizagirl.pics}"
TTL="${TTL:-300}"

need(){ command -v "$1" >/dev/null || { echo "Falta $1"; exit 1; }; }
need curl; if ! command -v jq >/dev/null; then echo "Instala jq (macOS: brew install jq)"; exit 1; fi

have_api=false
if [[ -n "${PORKBUN_API_KEY:-}" && -n "${PORKBUN_SECRET_KEY:-}" ]]; then
  PB="https://porkbun.com/api/json/v3"
  AUTH="$(jq -n --arg a "$PORKBUN_API_KEY" --arg s "$PORKBUN_SECRET_KEY" '{apikey:$a,secretapikey:$s}')"
  code="$(curl -sS -o /tmp/pb.json -w '%{http_code}' "$PB/ping" -H 'Content-Type: application/json' -d "$AUTH" || true)"
  if [[ "$code" == "200" ]] && jq -r '.status' /tmp/pb.json | grep -qi success; then
    have_api=true
  fi
fi

if $have_api; then
  echo "== Porkbun API OK; aplicando cambios automáticos en $DOMAIN =="
  pb_get()   { curl -fsS "$PB/dns/retrieve/$DOMAIN" -H 'Content-Type: application/json' -d "$AUTH"; }
  pb_del()   { curl -fsS "$PB/dns/delete/$DOMAIN/$1" -H 'Content-Type: application/json' -d "$AUTH" >/dev/null; }
  pb_create(){ local h="$1" t="$2" c="$3" ttl="$4"
    local p; p="$(jq -n --arg a "$PORKBUN_API_KEY" --arg s "$PORKBUN_SECRET_KEY" \
      --arg name "$h" --arg type "$t" --arg content "$c" --argjson ttl "$ttl" \
      '{apikey:$a,secretapikey:$s,name:$name,type:$type,content:$content,ttl:$ttl}')" \
      && curl -fsS "$PB/dns/create/$DOMAIN" -H 'Content-Type: application/json' -d "$p" >/dev/null; }
  pb_edit(){ local id="$1" h="$2" t="$3" c="$4" ttl="$5"
    local p; p="$(jq -n --arg a "$PORKBUN_API_KEY" --arg s "$PORKBUN_SECRET_KEY" \
      --arg name "$h" --arg type "$t" --arg content "$c" --argjson ttl "$ttl" \
      '{apikey:$a,secretapikey:$s,name:$name,type:$type,content:$content,ttl:$ttl}')" \
      && curl -fsS "$PB/dns/edit/$DOMAIN/$id" -H 'Content-Type: application/json' -d "$p" >/dev/null; }

  purge_conflicts(){
    local now ids
    now="$(pb_get)"
    ids="$(echo "$now" | jq -r '.records[] | select(.type=="ALIAS" and (.name=="@" or .name=="www")) | .id')"
    [[ -n "${ids:-}" ]] && echo "$ids" | while read -r id; do [[ -n "$id" ]] && pb_del "$id" && echo "－ Borrado ALIAS id=$id"; done
    ids="$(echo "$now" | jq -r '.records[] | select(.name=="@" and (.type=="CNAME" or .type=="AAAA")) | .id')"
    [[ -n "${ids:-}" ]] && echo "$ids" | while read -r id; do [[ -n "$id" ]] && pb_del "$id" && echo "－ Borrado @ conflictivo id=$id"; done
    ids="$(echo "$now" | jq -r '.records[] | select(.name=="www" and (.type=="A" or .type=="AAAA")) | .id')"
    [[ -n "${ids:-}" ]] && echo "$ids" | while read -r id; do [[ -n "$id" ]] && pb_del "$id" && echo "－ Borrado www conflictivo id=$id"; done
  }

  ensure_record(){ local h="$1" t="$2" want="$3" now id cur
    now="$(pb_get)"
    id="$(echo "$now" | jq -r --arg h "$h" --arg t "$t" '.records[] | select(.name==$h and .type==$t) | .id' | head -n1)"
    cur="$(echo "$now" | jq -r --arg h "$h" --arg t "$t" '.records[] | select(.name==$h and .type==$t) | .content' | head -n1)"
    if [[ -n "${id:-}" && "$id" != "null" ]]; then
      if [[ "$cur" == "$want" ]]; then echo "✓ $t $h ya correcto ($want)"; else pb_edit "$id" "$h" "$t" "$want" "$TTL"; echo "↺ Editado: $t $h -> $want"; fi
    else pb_create "$h" "$t" "$want" "$TTL"; echo "＋ Creado: $t $h -> $want"; fi
  }

  purge_conflicts
  ensure_record "@"   "A"     "76.76.21.21"
  ensure_record "www" "CNAME" "cname.vercel-dns.com"

  echo "== Estado final (@/www) =="
  pb_get | jq -r '.records[] | select((.name=="@" or .name=="www") and (.type=="A" or .type=="CNAME")) | "\(.type)\t\(.name)\t\(.content)\tTTL=\(.ttl)"'
  echo "✅ DNS aplicado (propagación en minutos)."
else
  echo "❗ No hay API de Porkbun disponible (no exportaste PORKBUN_API_KEY/SECRET o la API no está habilitada)."
  cat <<STEPS

Hazlo manualmente en Porkbun (DNS → Manage Records):

1) Elimina los dos registros ALIAS del apex (@).
2) Añade:
   TYPE: A      HOST: @        ANSWER: 76.76.21.21      TTL: $TTL
   TYPE: CNAME  HOST: www      ANSWER: cname.vercel-dns.com.  TTL: $TTL
3) Guarda cambios.

Verificación rápida (cuando propague):
   dig +short A    $DOMAIN    @1.1.1.1
   dig +short CNAME www.$DOMAIN @1.1.1.1
   curl -sSIL https://$DOMAIN/ | sed -n '1,5p'
STEPS
fi

echo "== Comprobaciones locales ahora =="
dig +short A "$DOMAIN" @1.1.1.1 || true
dig +short CNAME "www.$DOMAIN" @1.1.1.1 || true
curl -sSIL "https://$DOMAIN/" | sed -n '1,8p' || true
