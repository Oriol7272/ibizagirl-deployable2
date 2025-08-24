#!/usr/bin/env bash
set -euo pipefail

# Mueve <header class="site"> a ser el primer hijo de <body>
reorder_header(){
  f="$1"
  perl -0777 -ne '
    my $c = $_;
    if ($c =~ m#(<header class="site".*?</header>)#s) {
      my $hdr = $1;
      $c =~ s#<header class="site".*?</header>##gs;
      $c =~ s#(<body[^>]*>)#$1\n$hdr#s;
    }
    print $c;
  ' -i "$f"
}

# Reordena secciones de la Home en el orden correcto
reorder_home_sections(){
  f="index.html"; [ -f "$f" ] || return 0
  perl -0777 -ne '
    my $c = $_;
    my ($hdr) = $c =~ m#(<header class="site".*?</header>)#s;
    my ($ban) = $c =~ m#(<div id="banner-rotator".*?</div>)#s;
    my ($car) = $c =~ m#(<div class="section">.*?<div id="home-carousel".*?</div>\s*</div>)#s;
    my ($pre) = $c =~ m#(<div class="section">.*?<div id="home-premium-grid".*?</div>\s*</div>)#s;
    my ($vid) = $c =~ m#(<div class="section">.*?<div id="home-videos-grid".*?</div>\s*</div>)#s;

    # elimina bloques existentes
    $c =~ s#<div id="banner-rotator".*?</div>##gs;
    $c =~ s#<div class="section">.*?<div id="home-carousel".*?</div>\s*</div>##gs;
    $c =~ s#<div class="section">.*?<div id="home-premium-grid".*?</div>\s*</div>##gs;
    $c =~ s#<div class="section">.*?<div id="home-videos-grid".*?</div>\s*</div>##gs;

    # inserta en orden tras header
    my $bundle = ($ban // "") . "\n" . ($car // "") . "\n" . ($pre // "") . "\n" . ($vid // "");
    $c =~ s#(<header class="site".*?</header>)#${1}\n$bundle#s;

    print $c;
  ' -i "$f"
}

for f in index.html premium.html videos.html subscription.html; do
  [ -f "$f" ] || continue
  reorder_header "$f"
done
reorder_home_sections
echo "Header y Home reordenados"
