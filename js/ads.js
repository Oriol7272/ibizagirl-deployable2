(function(w,d){
  const E = w.__ENV || {};
  function ensure(id, cls){
    let el = d.getElementById(id);
    if(!el){ el=d.createElement('div'); el.id=id; if(cls) el.className=cls; d.body.appendChild(el); }
    return el;
  }
  function writeIntoIframe(slot, html, h=260){
    const ifr = d.createElement('iframe');
    ifr.width = '100%'; ifr.height = String(h); ifr.style.border='0'; ifr.loading='lazy';
    slot.innerHTML = ''; slot.appendChild(ifr);
    const doc = ifr.contentDocument || ifr.contentWindow.document;
    doc.open();
    doc.write('<!doctype html><html><head><base target="_top"><meta charset="utf-8"></head><body style="margin:0">');
    doc.write(html);
    doc.write('</body></html>');
    doc.close();
  }
  // Para scripts que hacen document.write (Exo/Ero/Juicy) los metemos dentro del iframe
  function loadScriptInIframe(slot, src, h){
    writeIntoIframe(slot, '<scr'+'ipt src="'+src+'"></scr'+'ipt>', h);
  }
  function loadJuicy(slot, zone){
    const html = [
      '<ins id="jadsPlaceHolder"></ins>',
      '<scr'+'ipt>(adsbyjuicy=window.adsbyjuicy||[]).push({adzone:"'+String(zone)+'"});</scr'+'ipt>',
      '<scr'+'ipt src="/api/ads/juicy"></scr'+'ipt>'
    ].join('');
    writeIntoIframe(slot, html, 270);
  }
  function loadExo(slot, zone){ loadScriptInIframe(slot, '/api/ads/exo?zone='+encodeURIComponent(zone), 270); }
  function loadEro(slot, zone){ loadScriptInIframe(slot, '/api/ads/ero?zone='+encodeURIComponent(zone), 270); }

  const IBG_ADS = {
    init(){
      const Z = {
        JUICYADS_ZONE: E.JUICYADS_ZONE || '',
        EXOCLICK_ZONE: E.EXOCLICK_ZONE || '',
        EROADVERTISING_ZONE: E.EROADVERTISING_ZONE || ''
      };
      console.log('IBG_ADS ZONES ->', Z);
      // Asegura contenedores
      const L = ensure('ad-left', 'ad-lateral left');
      const R = ensure('ad-right','ad-lateral right');
      const B = ensure('ad-bottom','ad-bottom');

      // Carga creatividades (desactiva bloqueadores para verlas)
      if (Z.JUICYADS_ZONE) { loadJuicy(L, Z.JUICYADS_ZONE); loadJuicy(R, Z.JUICYADS_ZONE); }
      if (Z.EXOCLICK_ZONE)  { loadExo(B, Z.EXOCLICK_ZONE); }
      else if (Z.EROADVERTISING_ZONE) { loadEro(B, Z.EROADVERTISING_ZONE); }
    }
  };
  w.IBG_ADS = IBG_ADS;
})(window, document);
