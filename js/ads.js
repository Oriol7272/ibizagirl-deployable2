(function(w,d){
  const E = w.__ENV || {};
  function ensure(id, cls){ let el=d.getElementById(id); if(!el){ el=d.createElement('div'); el.id=id; if(cls) el.className=cls; d.body.appendChild(el);} return el; }
  function writeIframe(slot, bodyHtml, h=270){
    const ifr=d.createElement('iframe'); ifr.width='100%'; ifr.height=String(h); ifr.style.border='0'; ifr.loading='lazy';
    slot.innerHTML=''; slot.appendChild(ifr);
    const doc=ifr.contentDocument||ifr.contentWindow.document;
    doc.open(); doc.write('<!doctype html><meta charset=utf-8><base target=_top><body style="margin:0">');
    // Fallback si el script devuelve HTML (token "<")
    doc.write(`
      <script>
        window.onerror=function(msg){ 
          if(/Unexpected token <|SyntaxError/.test(String(msg))){
            var s=document.createElement('script'); s.src='https://js.juicyads.com/jp.js'; document.body.appendChild(s);
          }
          return false;
        };
      </` + `script>
    `);
    doc.write(bodyHtml);
    doc.write('</body>'); doc.close();
  }
  function juicy(slot, zone){
    const html = `
      <ins id="jadsPlaceHolder"></ins>
      <script>(adsbyjuicy=window.adsbyjuicy||[]).push({adzone:"${String(zone)}"});</`+`script>
      <script src="/api/ads/juicy"></`+`script>
    `;
    writeIframe(slot, html, 270);
  }
  function exo(slot, zone){ writeIframe(slot, `<script src="/api/ads/exo?zone=${encodeURIComponent(zone)}"></`+`script>`, 270); }
  function ero(slot, zone){ writeIframe(slot, `<script src="/api/ads/ero?zone=${encodeURIComponent(zone)}"></`+`script>`, 270); }

  const API = {
    init(){
      const Z = {
        JUICYADS_ZONE: E.JUICYADS_ZONE || '',
        EXOCLICK_ZONE: E.EXOCLICK_ZONE || '',
        EROADVERTISING_ZONE: E.EROADVERTISING_ZONE || ''
      };
      console.log('IBG_ADS ZONES ->', Z);
      const L = ensure('ad-left','ad-lateral left');
      const R = ensure('ad-right','ad-lateral right');
      const B = ensure('ad-bottom','ad-bottom');

      if (Z.JUICYADS_ZONE){ juicy(L,Z.JUICYADS_ZONE); juicy(R,Z.JUICYADS_ZONE); }
      if (Z.EXOCLICK_ZONE){ exo(B,Z.EXOCLICK_ZONE); }
      else if (Z.EROADVERTISING_ZONE){ ero(B,Z.EROADVERTISING_ZONE); }
    }
  };
  API.initAds = API.init;
  w.IBG_ADS = API;
})(window,document);
