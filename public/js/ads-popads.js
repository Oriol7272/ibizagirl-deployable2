(function(){
  var E=window.__ENV||{}, sid=String(E.POPADS_SITE_ID||"").trim(), enable=String(E.POPADS_ENABLE||"").trim();
  if(enable!=="1" || !sid){ console.log("[ads-popads] disabled or no site id"); return; }
  function load(u, cb){
    var s=document.createElement("script");
    s.async=true; s.src=u; s.onerror=function(){ cb(false); }; s.onload=function(){ cb(true); };
    document.head.appendChild(s);
  }
  var url="https://cdn.popads.net/pop.js";
  var done=false, tries=0;
  (function tryLoad(){
    if(done || tries++>8) return console.log("[ads-popads] give up");
    load(url, function(ok){
      if(!ok){ setTimeout(tryLoad, 1200); return; }
      try{
        PopAds.setSiteId(sid);
        PopAds.start();
        console.log("IBG_ADS: POP mounted ->", sid);
        done=true;
      }catch(e){ console.log("[ads-popads] API not ready, retry", e); setTimeout(tryLoad, 1200); }
    });
  })();
})();
