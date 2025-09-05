(function(w,d){
  const E=w.__ENV||{};
  function ensure(id){let el=d.getElementById(id); if(!el){el=d.createElement('div'); el.id=id; d.body.appendChild(el);} return el;}
  function writeIframe(slot, html, h){const f=d.createElement('iframe');f.width='100%';f.height=String(h||270);f.style.border='0';f.loading='lazy';slot.innerHTML='';slot.appendChild(f);const x=f.contentDocument||f.contentWindow.document;x.open();x.write('<!doctype html><meta charset=utf-8><base target=_top><body style="margin:0">');x.write('<script>window.onerror=function(m){if(/Unexpected token <|<\\/?html/i.test(String(m))){var s=document.createElement(\"script\");s.src=\"https://js.juicyads.com/jp.js\";document.body.appendChild(s);}return false;};</'+'script>');x.write(html);x.write('</body>');x.close();}
  function juicy(slot,zone){writeIframe(slot,`<ins id="jadsPlaceHolder"></ins><script>(adsbyjuicy=window.adsbyjuicy||[]).push({adzone:"${String(zone)}"});</`+'script><script src="/api/ads/juicy"></`+'script>`,270);}
  function exo(slot,zone){writeIframe(slot,`<script src="/api/ads/exo?zone=${encodeURIComponent(zone)}"></`+'script>',270);}
  function ero(slot,zone){writeIframe(slot,`<script src="/api/ads/ero?zone=${encodeURIComponent(zone)}"></`+'script>',270);}
  const API={init(){const Z={JUICYADS_ZONE:E.JUICYADS_ZONE||'',EXOCLICK_ZONE:E.EXOCLICK_ZONE||'',EROADVERTISING_ZONE:E.EROADVERTISING_ZONE||''};console.log('IBG_ADS ZONES ->',Z);const L=ensure('ad-left'),R=ensure('ad-right'),B=ensure('ad-bottom'); if(Z.JUICYADS_ZONE){juicy(L,Z.JUICYADS_ZONE);juicy(R,Z.JUICYADS_ZONE);} if(Z.EXOCLICK_ZONE){exo(B,Z.EXOCLICK_ZONE);} else if(Z.EROADVERTISING_ZONE){ero(B,Z.EROADVERTISING_ZONE);} }};
  API.initAds=API.init; w.IBG_ADS=API;
})(window,document);
