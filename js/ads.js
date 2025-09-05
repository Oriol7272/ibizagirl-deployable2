(function(w,d){
  const E=w.__ENV||{};
  // IDs neutros
  const IDS = { L:'slotL', R:'slotR', B:'slotB' };
  function ensure(id,cls){let el=d.getElementById(id); if(!el){el=d.createElement('div'); el.id=id; if(cls)el.className=cls; d.body.appendChild(el);} return el;}
  function writeIframe(slot, html, h){const f=d.createElement('iframe');f.width='100%';f.height=String(h||270);f.style.border='0';f.loading='lazy';slot.innerHTML='';slot.appendChild(f);const x=f.contentDocument||f.contentWindow.document;x.open();x.write('<!doctype html><meta charset=utf-8><base target=_top><body style="margin:0">');x.write(html);x.write('</body>');x.close();}

  // Proxys neutros (/api/a/*). Si fallan, intenta ruta /api/ads/*
  function juicyIframe(slot,zone){
    writeIframe(slot,`
      <ins id="jadsPlaceHolder"></ins>
      <script>(adsbyjuicy=window.adsbyjuicy||[]).push({adzone:"${String(zone)}"});</`+'script>
      <script>
        (function(){
          var s=document.createElement('script');
          s.src='/api/a/j';
          s.onerror=function(){
            var s2=document.createElement('script'); s2.src='/api/ads/juicy'; document.body.appendChild(s2);
          };
          document.body.appendChild(s);
        })();
      </`+'script>
    `, 270);
  }
  function exoIframe(slot,zone){
    writeIframe(slot,`<script src="/api/a/x?zone=${encodeURIComponent(zone)}"></`+'script><script>this.onerror=function(){var s2=document.createElement("script");s2.src="/api/ads/exo?zone=${encodeURIComponent(zone)}";document.body.appendChild(s2);};</'+'script>',270);
  }
  function eroIframe(slot,zone){
    writeIframe(slot,`<script src="/api/a/r?zone=${encodeURIComponent(zone)}"></`+'script><script>this.onerror=function(){var s2=document.createElement("script");s2.src="/api/ads/ero?zone=${encodeURIComponent(zone)}";document.body.appendChild(s2);};</'+'script>',270);
  }

  function init(){
    const Z = {
      JUICYADS_ZONE: E.JUICYADS_ZONE || E.JUICY_ZONE || '',
      EXOCLICK_ZONE: E.EXOCLICK_ZONE || E.EXO_ZONE || '',
      EROADVERTISING_ZONE: E.EROADVERTISING_ZONE || E.ERO_ZONE || ''
    };
    console.log('IBG_ADS ZONES ->', Z);

    // crea slots si no existen
    const L=ensure(IDS.L,'slot-lateral left'),
          R=ensure(IDS.R,'slot-lateral right'),
          B=ensure(IDS.B,'slot-bottom');

    // Inserta
    if(Z.JUICYADS_ZONE){ juicyIframe(L,Z.JUICYADS_ZONE); juicyIframe(R,Z.JUICYADS_ZONE); }
    if(Z.EXOCLICK_ZONE){ exoIframe(B,Z.EXOCLICK_ZONE); }
    else if(Z.EROADVERTISING_ZONE){ eroIframe(B,Z.EROADVERTISING_ZONE); }
  }

  // expone API
  w.IBG_ADS = { init, initAds:init };
})(window,document);
