#!/usr/bin/env bash
set -euo pipefail
echo "== Añadiendo dos slots de anuncios en la parte inferior (Exo + Ero) =="

# 1) Contenedores al final del <main> (dos cajas lado a lado)
if ! grep -q 'id="ads-bottom-row"' index.html; then
  awk '
    /<\/main>/ && !added {
      print "  <section id=\"ads-bottom-row\" class=\"ads-bottom-row\">"
      print "    <div id=\"ad-bottom-1\" class=\"ad-box\"></div>"
      print "    <div id=\"ad-bottom-2\" class=\"ad-box\"></div>"
      print "  </section>"
      added=1
    }
    {print}
  ' index.html > .tmp && mv .tmp index.html
  echo "➕ Insertado #ads-bottom-row"
else
  echo "✅ #ads-bottom-row ya existe"
fi

# 2) CSS limpio (sin “ 
if ! grep -q 'ads-bottom-css' index.html; then
  awk 'BEGIN{
    css="  <style id=\"ads-bottom-css\">\\n"
    css=css "  .ads-bottom-row{display:grid;grid-template-columns:repeat(2,300px);gap:20px;place-content:center;margin:24px 0}\\n"
    css=css "  .ad-box{width:300px;min-height:250px}\\n"
    css=css "  @media(max-width:900px){.ads-bottom-row{grid-template-columns:1fr}.ad-box{margin:0 auto}}\\n"
    css=css "  /* Desactiva cualquier badge/house anterior */\\n"
    css=css "  [data-house], .house-ad, .sponsored-badge{display:none!important}\\n"
    css=css "  </style>\\n"
  }
  /<\/head>/{print css; print; next}{print}' index.html > .tmp && mv .tmp index.html
  echo "🎨 CSS inferior inyectado"
else
  echo "✅ CSS inferior ya estaba"
fi

# 3) Módulo JS que monta Exo en una caja y Ero en la otra (random),
#    y oculta la caja si en 6s no hay iframe (nada de rellenos).
mkdir -p js
cat > js/ads-bottom-row.js <<'EOF'
(function(){
  var E = window.__ENV || {};
  var exoList = ((E.EXOCLICK_ZONES || E.EXOCLICK_ZONE || '')+'').split(/\s*,\s*/).filter(Boolean);
  var hasEro = !!(E.ERODVERTISING_SPACE && E.ERODVERTISING_PID && E.ERODVERTISING_CTRL);

  function pickExo(){ return exoList[(Math.random()*exoList.length)|0]; }

  function loadAdProvider(cb){
    if(window.AdProvider){ cb&&cb(); return; }
    var s=document.createElement('script');
    s.src='https://a.magsrv.com/ad-provider.js';
    s.async=true; s.onload=function(){ cb&&cb(); };
    (document.head||document.documentElement).appendChild(s);
  }

  function mountExo(boxId){
    if(!exoList.length){ console.log('[ads-bottom] no EXOCLICK_ZONES/ZONE'); return; }
    var host=document.getElementById(boxId); if(!host) return;
    host.innerHTML='';
    var ins=document.createElement('ins');
    ins.className='eas6a97888e17';
    ins.setAttribute('data-zoneid', String(pickExo()));
    ins.setAttribute('data-block-ad-types','0');
    ins.style.display='block'; ins.style.width='300px'; ins.style.height='250px';
    host.appendChild(ins);
    (window.AdProvider=window.AdProvider||[]).push({serve:{}});
    console.log('IBG_ADS: EXO bottom content ->', ins.getAttribute('data-zoneid'), 'on', boxId);
  }

  function mountEro(boxId){
    if(!hasEro){ console.log('[ads-bottom] no ERO vars'); return; }
    var host=document.getElementById(boxId); if(!host) return;
    host.innerHTML='';
    var iframe=document.createElement('iframe');
    var u='/ads/eroframe_ctrl.html'
      + '?space='+encodeURIComponent(E.ERODVERTISING_SPACE)
      + '&pid='+encodeURIComponent(E.ERODVERTISING_PID)
      + '&ctrl='+encodeURIComponent(E.ERODVERTISING_CTRL);
    iframe.src=u;
    iframe.loading='lazy';
    iframe.referrerPolicy='unsafe-url';
    iframe.setAttribute('sandbox','allow-scripts allow-same-origin allow-popups');
    iframe.style.cssText='border:0;width:300px;height:250px;display:block;';
    host.appendChild(iframe);
    console.log('[ads-bottom] ERO bottom content ->', u, 'on', boxId);
  }

  function hideIfEmpty(boxId, ms){
    setTimeout(function(){
      var el=document.getElementById(boxId);
      if(!el) return;
      var hasFrame=!!el.querySelector('iframe');
      if(!hasFrame){ el.style.display='none'; console.log('[ads-bottom] oculto', boxId, '(sin creativo)'); }
    }, ms||6000);
  }

  function start(){
    // Asignación aleatoria: una caja EXO, la otra ERO (si hay ERO).
    var order = Math.random()<0.5 ? ['exo','ero'] : ['ero','exo'];
    if(!hasEro) order=['exo','exo'];
    var ids=['ad-bottom-1','ad-bottom-2'];

    loadAdProvider(function(){
      order.forEach(function(kind, i){
        if(kind==='exo') mountExo(ids[i]); else mountEro(ids[i]);
        hideIfEmpty(ids[i], 6000);
      });
    });
  }

  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', start); }
  else { start(); }
})();
EOF

# 4) Referencia el módulo en <head>
if ! grep -q '/js/ads-bottom-row.js' index.html; then
  awk ' /<\/head>/{print "  <script defer src=\"/js/ads-bottom-row.js\"></script>"; print; next} {print}' index.html > .tmp && mv .tmp index.html
  echo "🔗 Referenciado /js/ads-bottom-row.js"
else
  echo "✅ /js/ads-bottom-row.js ya referenciado"
fi

# 5) (Opcional) apaga cualquier “house/filler” anterior
#    Eliminamos texto " 
grep -RIl ' 
  echo "🧹 Quitando label ' 
  sed -i '' 's/ <]*/ /g' "$f" || true
done

# 6) Commit + deploy
git add index.html js/ads-bottom-row.js 2>/dev/null || true
git commit -m "ads: fila inferior (Exo+Ero) sin rellenos; oculta si no hay fill" || true
vercel link --project beachgirl-final --yes
LOG="$(mktemp)"; vercel deploy --prod --yes | tee "$LOG" >/dev/null
awk '/Production: https:\/\//{print "🔗 Production:", $3}' "$LOG" | tail -n1
echo "✅ Hecho"
