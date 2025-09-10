#!/usr/bin/env bash
set -euo pipefail

echo "== Hotfix Ero: sandbox debe incluir allow-same-origin =="

FILE="js/ads-ero-ctrl.js"
if [ ! -f "$FILE" ]; then
  echo "❌ No existe $FILE (nada que parchear)"; exit 1
fi

# 1) Normaliza cualquier setAttribute('sandbox', '...') para que siempre incluya allow-same-origin
perl -0777 -pe '
  s{
     setAttribute\(\s*([\"\'])sandbox\1\s*,\s*([\"\'])(.*?)\2\s*\)
   }{
     my $val = $3;
     $val =~ s/\s+/ /g;
     my %t = map { $_ => 1 } split(/\s+/, $val);
     $t{"allow-scripts"} = 1;
     $t{"allow-popups"} = 1;
     $t{"allow-same-origin"} = 1;
     my $joined = join(" ", sort keys %t);
     "setAttribute(\"sandbox\",\"$joined\")"
   }gex;
' -i "$FILE"

# 2) Si en algún sitio se usa iframe.sandbox = '...'; también lo normalizamos
perl -0777 -pe '
  s{
     \.sandbox\s*=\s*([\"\'])(.*?)\1
   }{
     my $val = $2;
     $val =~ s/\s+/ /g;
     my %t = map { $_ => 1 } split(/\s+/, $val);
     $t{"allow-scripts"} = 1;
     $t{"allow-popups"} = 1;
     $t{"allow-same-origin"} = 1;
     my $joined = join(" ", sort keys %t);
     ".sandbox=\"$joined\""
   }gex;
' -i "$FILE"

echo "== Sandbox tras parcheo =="
grep -n "sandbox" "$FILE" || true

echo "== Commit & Deploy =="
git add "$FILE" || true
git commit -m "ads: Ero iframe sandbox -> allow-scripts allow-same-origin allow-popups" || true

vercel link --project beachgirl-final --yes
LOG="$(mktemp)"
vercel deploy --prod --yes | tee "$LOG" >/dev/null
URL="$(awk '/Production: https:\/\//{print $3}' "$LOG" | tail -n1)"
echo "🔗 Production: $URL"
echo "✔ Listo: recarga Home y comprueba que desaparecen los SecurityError de sessionStorage."
