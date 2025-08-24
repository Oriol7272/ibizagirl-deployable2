/* Anuncios laterales con fallback. No bloquea UI. */
(function(){
  const ENV = (window.__ENV || {});
  const exoZone  = ENV.EXOCLICK_ZONE;
  const juicyZone= ENV.JUICYADS_ZONE;
  const eroZone  = ENV.EROADVERTISING_ZONE;

  const left = document.getElementById('ads-left')  || Object.assign(document.body.appendChild(document.createElement('aside')), {id:'ads-left'});
  const right= document.getElementById('ads-right') || Object.assign(document.body.appendChild(document.createElement('aside')), {id:'ads-right'});

  const inject = (el, html) => { el.innerHTML = html; };

  const ifr = (src,w=160,h=600) => `<iframe src="${src}" width="${w}" height="${h}" scrolling="no" frameborder="0"></iframe>`;

  // ExoClick (banner zone)
  try{
    if(exoZone){
      // formato estndar 160x600 / 300x600 segn tu zona
      const url = `https://syndication.exoclick.com/ads-iframe-display.php?idzone=${encodeURIComponent(exoZone)}&output=iframe&width=160&height=600`;
      inject(left, ifr(url));
    }
  }catch(e){console.warn('ExoClick error', e)}

  // JuicyAds (skyscraper)
  try{
    if(juicyZone){
      const url = `https://js.juicyads.com/adshow.php?adzone=${encodeURIComponent(juicyZone)}`;
      inject(right, ifr(url));
    }
  }catch(e){console.warn('JuicyAds error', e)}

  // EroAdvertising (corrige dominio "go.eroadvertising.com")
  try{
    if(eroZone){
      const url = `https://go.eroadvertising.com/loadeactrl.go?pid=152716&spaceid=${encodeURIComponent(eroZone)}&ctrlid=798544`;
      // Si su endpoint requiere script, la mayor soporta iframe tambin:
      inject(left.innerHTML ? right : left, ifr(url));
    }
  }catch(e){console.warn('EroAdvertising error', e)}

  // Si nada carg,,, no dejamos huecos vacs
  [left, right].forEach(c => { if(!c.innerHTML) c.style.display='none'; });
})();
