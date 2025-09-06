#!/usr/bin/env bash
set -euo pipefail
f="index.html"; [ -f "$f" ] || exit 0

inject_above_body(){ awk -v H="$1" '1; /<body[^>]*>/{print H}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"; }

# Header siempre arriba
if ! grep -q 'header class="site"' "$f"; then
  inject_above_body '<header class="site"><div class="brand"><h1>IBIZAGIRL.PICS</h1><p>Bienvenido al paraiso para tu disfrute</p></div><div class="langbox"><select id="lang-select"><option value="es">ES</option><option value="en">EN</option><option value="fr">FR</option><option value="de">DE</option><option value="it">IT</option></select></div><nav class="navbar"><a class="btn" href="/index.html"><span class="ico ico-home"></span>Home</a><a class="btn" href="/premium.html"><span class="ico ico-prem"></span>Premium</a><a class="btn" href="/videos.html"><span class="ico ico-vid"></span>Videos</a><a class="btn" href="/subscription.html"><span class="ico ico-sub"></span>Suscripciones</a><button id="buy-lifetime" class="btn" style="display:inline-flex;align-items:center;gap:.4rem"><span class="ico ico-life"></span><span>Lifetime 100€</span></button></nav></header>'
fi

# Crea / reordena bloques
perl -0777 -ne '
  my $c = $_;
  my ($hdr) = $c =~ m#(<header class="site".*?</header>)#s;
  my ($ban) = $c =~ m#(<div id="banner-rotator".*?</div>)#s; $ban ||= q{<div id="banner-rotator" class="section"></div>};
  my ($car) = $c =~ m#(<div class="section">.*?<div id="home-carousel".*?</div>\s*</div>)#s; $car ||= q{<div class="section"><section class="hbar"><h2>Galería</h2></section><div id="home-carousel"></div></div>};
  my ($pub) = $c =~ m#(<div class="section">.*?<div id="home-public-grid".*?</div>\s*</div>)#s; $pub ||= q{<div class="section"><section class="hbar"><h2>Fotos</h2><span class="counter" id="home-public-counter"></span></section><div id="home-public-grid"></div></div>};

  # borra instancias existentes
  $c =~ s#<div id="banner-rotator".*?</div>##gs;
  $c =~ s#<div class="section">.*?<div id="home-carousel".*?</div>\s*</div>##gs;
  $c =~ s#<div class="section">.*?<div id="home-public-grid".*?</div>\s*</div>##gs;
  # borra grids premium/videos de la home si existieran
  $c =~ s#<div class="section">.*?<div id="home-premium-grid".*?</div>\s*</div>##gs;
  $c =~ s#<div class="section">.*?<div id="home-videos-grid".*?</div>\s*</div>##gs;

  # inserta tras header
  $c =~ s#(<header class="site".*?</header>)#${1}\n$ban\n$car\n$pub#s;

  print $c;
' -i "$f"

echo "Home OK"
