(function(){
  function ensureHost(id){
    let el=document.getElementById(id);
    if(!el){ el=document.createElement('div'); el.id=id; document.body.appendChild(el); }
    el.style.cssText="position:fixed;top:90px;"+(id==="ad-left"?"left:8px;":"right:8px;")+"z-index:30";
    return el;
  }
  function mount(){
    const E=window.__ENV||{};
    const list=String(E.EXOCLICK_ZONES||"").split(",").map(s=>s.trim()).filter(Boolean);
    if(!list.length){ console.log("[exo-sides] sin EXOCLICK_ZONES"); return; }
    const left=list[0], right=list[1]||list[0];
    const L=ensureHost("ad-left"), R=ensureHost("ad-right");
    IBG_ADS.ensureProvider(ok=>{
      if(!ok){ console.log("[exo-sides] provider KO"); return; }
      [["ad-left",L,left],["ad-right",R,right]].forEach(([name,host,zid])=>{
        IBG_ADS.mountExo(zid, host);
        console.log("IBG_ADS: EXO/AP mounted (display) ->", zid, "on", name);
        let n=0,t=setInterval(()=>{ 
          if(host.querySelector("iframe")) clearInterval(t);
          else if(++n>=60){ clearInterval(t); host.remove(); console.log("[exo-sides] no fill ->", name); }
        },100);
      });
    });
  }
  IBG_ADS.waitForEnv(["EXOCLICK_ZONES"], ok=>{
    if(!ok){ console.log("[exo-sides] __ENV KO"); return; }
    (document.readyState==="complete")?mount():addEventListener("load", mount, {once:true});
  });
})();
