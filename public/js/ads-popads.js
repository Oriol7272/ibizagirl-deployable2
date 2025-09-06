(function(){
  const E=window.__ENV||{}, sid=String(E.POPADS_SITE_ID||"").trim(), enable=String(E.POPADS_ENABLE||"").trim();
  if(enable!=="1" || !sid){ console.log("[ads-popads] disabled or no site id"); return; }
  function load(u, cb){
    const s=document.createElement("script"); s.async=true; s.src=u;
    s.onload=()=>cb(true); s.onerror=()=>cb(false); document.head.appendChild(s);
  }
  const url="https://cdn.popads.net/pop.js";
  let tries=0, ok=false;
  (function retry(){
    if(ok||tries++>8) return console.log(ok?"IBG_ADS: POP mounted -> "+sid:"[ads-popads] give up");
    load(url, ready=>{
      if(!ready) return setTimeout(retry, 1500);
      try{ PopAds.setSiteId(sid); PopAds.start(); ok=true; console.log("IBG_ADS: POP mounted ->", sid); }
      catch(e){ setTimeout(retry, 1500); }
    });
  })();
})();
