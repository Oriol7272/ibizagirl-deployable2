(function(){
  function ensureHost(id, pos){
    let el=document.getElementById(id);
    if(!el){ el=document.createElement('div'); el.id=id; document.body.appendChild(el); }
    el.style.cssText="position:fixed;top:88px;"+pos+":8px;z-index:30;min-width:160px;min-height:600px";
    return el;
  }
  function retryMount(host, zid, label){
    let tries=0;
    (function tick(){
      const ifr=host.querySelector("iframe");
      if(ifr){ return; }
      if(tries===0){ IBG_ADS.mountExo(zid, host); console.log("IBG_ADS: EXO/AP mounted (display) ->", zid, "on", label); }
      else { IBG_ADS.serve(); console.log("[exo-sides] re-serve", label, "try", tries); }
      tries++;
      if(tries<14){ setTimeout(tick, 1500); } // ~21s
    })();
  }
  function mount(){
    const E=window.__ENV||{};
    const list=String(E.EXOCLICK_ZONES||"").split(",").map(s=>s.trim()).filter(Boolean);
    if(!list.length){ console.log("[exo-sides] sin EXOCLICK_ZONES"); return; }
    const LZ=list[0], RZ=list[1]||list[0];
    const L=ensureHost("ad-left","left"), R=ensureHost("ad-right","right");
    IBG_ADS.ensureProvider(ok=>{
      if(!ok){ console.log("[exo-sides] provider KO"); return; }
      retryMount(L, LZ, "ad-left");
      retryMount(R, RZ, "ad-right");
    });
  }
  IBG_ADS.waitForEnv(["EXOCLICK_ZONES"], ok=>{
    if(!ok){ console.log("[exo-sides] __ENV KO"); return; }
    (document.readyState==="complete")?mount():addEventListener("load", mount, {once:true});
  });
})();
