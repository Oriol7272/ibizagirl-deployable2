(function(){
  try{
    var Z = (window.__ENV && (__ENV.EXOCLICK_ZONE||__ENV.EXOCLICK_ZONE_ID)) || '';
    if(!Z){ console.warn('[ads-exo] no EXOCLICK_ZONE en __ENV'); return; }
    var host = document.getElementById('ad-right') || document.getElementById('ad-left') || document.getElementById('ad-bottom');
    if(!host){ console.warn('[ads-exo] no slots ad-*'); return; }
    var ifr=document.createElement('iframe');
    ifr.src='/ads/exoframe.html?zone='+encodeURIComponent(Z);
    Object.assign(ifr,{width:'300',height:'250',frameBorder:'0',scrolling:'no',loading:'lazy',referrerPolicy:'unsafe-url'});
    ifr.style='border:0;display:block;margin:0 auto';
    host.appendChild(ifr);
    console.log('IBG_ADS: EXO mounted ->', Z);
  }catch(e){ console.warn('[ads-exo] error', e); }
})();
