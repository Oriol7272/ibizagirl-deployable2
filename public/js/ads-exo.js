(function(){
  try{
    var Z = (window.__ENV && (__ENV.EXOCLICK_ZONE||__ENV.EXOCLICK_ZONE_ID)) || '';
    if(!Z){ return; }
    var host = document.getElementById('ad-right') || document.getElementById('ad-left') || document.getElementById('ad-bottom');
    if(!host){ return; }
    var ifr=document.createElement('iframe');
    ifr.src='/ads/exoframe.html?zone='+encodeURIComponent(Z);
    ifr.width='300'; ifr.height='250'; ifr.frameBorder='0'; ifr.scrolling='no';
    ifr.loading='lazy'; ifr.referrerPolicy='unsafe-url'; ifr.style='border:0;display:block;margin:0 auto';
    host.appendChild(ifr);
    console.log('IBG_ADS: EXO mounted ->', Z);
  }catch(e){}
})();
