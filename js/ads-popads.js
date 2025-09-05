(function(){
  try{
    var SID = (window.__ENV && __ENV.POPADS_SITE_ID) || '';
    if(!SID){ console.warn('[ads-popads] no POPADS_SITE_ID en __ENV'); return; }
    if(window.__IBG_POPADS_LOADED){ return; }
    window.__IBG_POPADS_LOADED = true;
    var s=document.createElement('script');
    s.src='/api/ads/popads?site='+encodeURIComponent(SID);
    s.async=true; s.referrerPolicy='unsafe-url';
    document.head.appendChild(s);
    console.log('IBG_ADS: POPADS loader injected ->', SID);
  }catch(e){ console.warn('[ads-popads] error', e); }
})();
