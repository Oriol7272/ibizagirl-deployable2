#!/usr/bin/env bash
set -e

mkdir -p public/js

# Normaliza EXOCLICK_ZONES (coma-separado)
EXOCLICK_ZONES_CLEAN="$(echo "${EXOCLICK_ZONES:-}" | tr ' ' '\n' | tr -d '\r' | tr -s '\n' | tr '\n' ',' | sed 's/,,*/,/g;s/^,//;s/,$//')"

LEFT_ZONE=""
RIGHT_ZONE=""

IFS=',' read -r Z1 Z2 _ <<< "${EXOCLICK_ZONES_CLEAN}"

if [ -n "$Z1" ] && [ -n "$Z2" ]; then
  LEFT_ZONE="$Z1"
  RIGHT_ZONE="$Z2"
elif [ -n "$Z1" ] && [ -n "$EXOCLICK_ZONE" ]; then
  LEFT_ZONE="$Z1"
  RIGHT_ZONE="$EXOCLICK_ZONE"
elif [ -n "$Z1" ]; then
  LEFT_ZONE="$Z1"
  RIGHT_ZONE="$Z1"   # fallback (aviso en consola)
elif [ -n "$EXOCLICK_ZONE" ]; then
  LEFT_ZONE="$EXOCLICK_ZONE"
  RIGHT_ZONE="$EXOCLICK_ZONE"  # fallback
fi

cat > public/js/env-ads-inline.js <<EOF
(function(){
  try{
    window.IBG_ADS = window.IBG_ADS || {};
    var Z = window.IBG_ADS.ZONES = window.IBG_ADS.ZONES || {};

    Z.EXOCLICK_LEFT_ZONE   = ${LEFT_ZONE:-null};
    Z.EXOCLICK_RIGHT_ZONE  = ${RIGHT_ZONE:-null};
    Z.EXOCLICK_BOTTOM_ZONE = ${EXOCLICK_BOTTOM_ZONE:-null};

    Z.POPADS_SITE_ID = ${POPADS_SITE_ID:-null};
    Z.POPADS_ENABLE  = ${POPADS_ENABLE:-0};

    Z.JUICYADS_ZONE = ${JUICYADS_ZONE:-null};

    Z.EROADVERTISING_CTRL  = ${EROADVERTISING_CTRL:-0};
    Z.EROADVERTISING_PID   = ${EROADVERTISING_PID:-0};
    Z.EROADVERTISING_SPACE = ${EROADVERTISING_SPACE:-0};

    if (Z.EXOCLICK_LEFT_ZONE && Z.EXOCLICK_RIGHT_ZONE && String(Z.EXOCLICK_LEFT_ZONE)===String(Z.EXOCLICK_RIGHT_ZONE)) {
      console.warn("[ads-env] LEFT/RIGHT usan el MISMO zoneId. Recomendable 2 zonas distintas.");
    }
    console.log("IBG_ADS ZONES ->", Z);
  }catch(e){
    console.warn("[env-ads-inline] error:", e);
  }
})();
EOF

echo "== IBG build: start =="
echo "✅ Build listo (env de anuncios generado en public/js/env-ads-inline.js)"
