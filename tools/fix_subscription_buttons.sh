#!/usr/bin/env bash
set -euo pipefail
f="subscription.html"; [ -f "$f" ] || exit 0
perl -0777 -ne '
  my $c = $_;
  my $block = q{
  <section class="section">
    <h2>Precios</h2>
    <ul>
      <li>€14,99 /mes <button id="buy-monthly" class="btn"><span class="pp-icon"></span> PayPal</button></li>
      <li>€49,99 /año <button id="buy-yearly" class="btn"><span class="pp-icon"></span> PayPal</button></li>
      <li style="margin-top:8px">Lifetime — desbloquea todo y sin anuncios por 100,00€ <button id="buy-lifetime" class="btn"><span class="pp-icon"></span> Comprar</button></li>
    </ul>
  </section>};
  if ($c =~ /<section[^>]*>\s*<h2>Precios/i){ $c =~ s#<section[^>]*>\s*<h2>Precios.*?</section>#$block#s; }
  else { $c =~ s#</header>#$&\n$block#s; }
  print $c;
' -i "$f"
echo "Subscription buttons OK"
