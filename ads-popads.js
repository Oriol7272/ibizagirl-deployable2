(function(){
  const E=window.__ENV||{}, sid=String(E.POPADS_SITE_ID||"").trim(), enable=String(E.POPADS_ENABLE||"").trim();
  if(enable!=="1" || !sid){ console.log("[ads-popads] disabled or no site id"); return; }
  const SRC="https://cdn.popads.net/pop.js";
  function load(u, cb){ const s=document.createElement("script"); s.async=true; s.src=u; s.onload=()=>cb(true); s.onerror=()=>cb(false); document.head.appendChild(s); }
  let tries=0;
  (function retry(){
    if(tries>10){ console.log("[ads-popads] give up (posible DNS/AdBlock)", SRC); return; }
    if(tries>0) console.log("[ads-popads] retry", tries);
    tries++;
    load(SRC, ok=>{
      if(!ok) return setTimeout(retry, 1500);
      try{ PopAds.setSiteId(sid); PopAds.start(); console.log("IBG_ADS: POP mounted ->", sid); }
      catch(e){ setTimeout(retry, 1500); }
    });
  })();
})();
