#!/usr/bin/env bash
set -Eeuo pipefail

files=(index.html premium.html videos.html subscription.html)

has() { # has "needle" "file"
  grep -Fq "$1" "$2"
}

inject_before_body(){ # inject_before_body "file" "payload"
  local f="$1" p="$2"
  awk -v P="$p" '{
    if(!ins && /<\/body>/){ print "  " P; ins=1 }
    print
  }' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
}

inject_after_head_open(){ # inject_after_head_open "file" "payload"
  local f="$1" p="$2"
  if ! grep -qi "<head" "$f"; then
    echo "[WARN] $f no tiene <head>, omito insercinnn de head." >&2
    return 0
  fi
  awk -v P="$p" '{
    print
    if(!ins && /<head[^>]*>/){ print "  " P; ins=1 }
  }' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
}

insert_home_carousel(){ # slllo index.html
  local f="index.html"
  [[ -f "$f" ]] || return 0
  if has 'id="home-carousel"' "$f"; then return 0; fi

  # Preferencia 1: despus de <div class="page">
  if grep -q '<div class="page">' "$f"; then
    awk '{
      print
      if(!ins && /<div class="page">/){
        print "<section class=\"carousel\"><div id=\"home-carousel\"></div></section>"
        ins=1
      }
    }' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
    return 0
  fi

  # Preferencia 2: despus de <div id="main-section"
  if grep -q '<div id="main-section"' "$f"; then
    awk '{
      print
      if(!ins && /<div id="main-section"/){
        print "<section class=\"carousel\"><div id=\"home-carousel\"></div></section>"
        ins=1
      }
    }' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
    return 0
  fi

  # Preferencia 3: justo antes de </main>
  if grep -q '</main>' "$f"; then
    awk '{
      if(!ins && /<\/main>/){
        print "<section class=\"carousel\"><div id=\"home-carousel\"></div></section>"
        ins=1
      }
      print
    }' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
    return 0
  fi

  echo "[WARN] No encontr sitio obvio para el carrusel en index.html; no insertado." >&2
}

# --- Limpieza menor: posibles duplicados de id/style en index.html (seguro si no existe) ---
if [[ -f index.html ]]; then
  perl -0777 -pe 's/id="main-section"\s+style="padding:1rem"\s+id="main-section"\s+style="padding:1rem"/id="main-section" style="padding:1rem"/g' -i index.html || true
fi

# --- 1A) Inyectar scripts comunes (ads.js, cta.js) justo antes de </body> ---
for f in "${files[@]}"; do
  [[ -f "$f" ]] || continue
  if ! has '/js/ads.js' "$f"; then inject_before_body "$f" '<script type="module" src="/js/ads.js"></script>'; fi
  if ! has '/js/cta.js' "$f";  then inject_before_body "$f" '<script type="module" src="/js/cta.js"></script>';  fi
done

# --- 1B) Carrusel en home + su import ---
insert_home_carousel
if [[ -f index.html ]] && ! has '/js/carousel.js' index.html; then
  inject_before_body index.html '<script type="module" src="/js/carousel.js"></script>'
fi

# --- 1C) CSS de layout + GA4 en <head> de todas las pginas ---
mkdir -p css

# CSS base (si no existe, cralo vac para asegurar el <link>)
[[ -f css/ibg-layout.css ]] || printf '' > css/ibg-layout.css

css_link='<link rel="stylesheet" href="/css/ibg-layout.css"/>'
ga_tag='<!-- GA4 --><script async src="https://www.googletagmanager.com/gtag/js?id=G-DBXYNPBSPY"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","G-DBXYNPBSPY");</script>'

for f in "${files[@]}"; do
  [[ -f "$f" ]] || continue
  if ! has 'ibg-layout.css' "$f";  then inject_after_head_open "$f" "$css_link"; fi
  if ! has 'G-DBXYNPBSPY' "$f";    then inject_after_head_open "$f" "$ga_tag";   fi
done

echo "PUNTO 1 OK"
