function zone(network){
  const E=window.__ENV||{};
  const map={ exo:E.EXOCLICK_ZONE, juicy:E.JUICYADS_ZONE, ero:E.EROADVERTISING_ZONE, pop:E.POPADS_SITE_ID };
  return map[network];
}
function injectIframe(slot, src){
  const ifr=document.createElement('iframe');
  ifr.loading='lazy'; ifr.referrerPolicy='no-referrer-when-downgrade';
  ifr.style.cssText='border:0;width:300px;height:250px;display:block';
  ifr.src=src;
  ifr.onerror=()=>{ slot.style.display='none'; };
  slot.appendChild(ifr);
}
export function mountSideAds(){
  document.querySelectorAll('.ad-slot').forEach((slot,i)=>{
    const pref = ['juicy','exo','ero','pop'][i%4];
    const net = slot.dataset.network || pref;
    const z = slot.dataset.zone || zone(net) || '';
    // Ejemplos de endpoints (usa tus scripts oficiales aquí):
    if(net==='juicy' && z) injectIframe(slot, `https://js.juicyads.com/adshow.php?adzone=${encodeURIComponent(z)}`);
    else if(net==='exo' && z) injectIframe(slot, `https://a.exoclick.com/iframe.php?zoneid=${encodeURIComponent(z)}`);
    else if(net==='ero' && z) injectIframe(slot, `https://www.ero-advertising.com/banner.php?zoneid=${encodeURIComponent(z)}`);
    else slot.style.display='none';
  });
}
