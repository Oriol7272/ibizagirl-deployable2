(function(){
  const cfg = (window.AdsConfig||{});
  function add(src, attrs={}){ const s=document.createElement('script'); s.src=src; s.async=true; Object.assign(s, attrs); document.head.appendChild(s); }
  function addInline(code){ const s=document.createElement('script'); s.async=true; s.textContent=code; document.head.appendChild(s); }

  // ExoClick
  if (cfg.exoclick?.zoneId) add(`https://a.exdynsrv.com/ads.js`);
  // JuicyAds
  if (cfg.juicyads?.adzone){
    add('https://js.juicyads.com/jp.js');
    addInline(`(function(){ var a = document.createElement('script'); a.async=true; a.src='https://js.juicyads.com/jp.php?zone=${cfg.juicyads.adzone}'; document.body.appendChild(a); })();`);
  }
  // EroAdvertising
  if (cfg.eroad?.zoneId){
    add(`https://rotator.ero-advertising.com/script?zone=${cfg.eroad.zoneId}`);
  }
  // PopAds
  if (cfg.popads?.code){
    addInline(cfg.popads.code);
  }
})();
