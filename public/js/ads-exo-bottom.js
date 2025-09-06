(function(){
  let logged=false;
  function host(){
    let h=document.getElementById("exo-bottom");
    if(!h){ h=document.createElement("div"); h.id="exo-bottom"; document.body.appendChild(h); }
    h.style.cssText="position:fixed; left:50%; transform:translateX(-50%); bottom:12px; z-index:2147483646; width:min(100%,1200px); max-width:98vw; pointer-events:auto;";
    return h;
  }
  function mount(){
    const E=window.__ENV||{}, zid=String(E.EXOCLICK_BOTTOM_ZONE||"").trim();
    if(!zid){ if(!logged){console.log("[exo-bottom] missing EXOCLICK_BOTTOM_ZONE"); logged=true;} return; }
    const H=host(); H.innerHTML="";
    IBG_ADS.ensureProvider(ok=>{
      if(!ok){ console.log("[exo-bottom] provider KO"); return; }
      IBG_ADS.mountExo(zid, H);
      console.log("IBG_ADS: EXO bottom mounted ->", zid);
      let n=0,t=setInterval(()=>{
        if(H.querySelector("iframe")){ clearInterval(t); document.documentElement.style.paddingBottom="120px"; }
        else if(++n>=60){ clearInterval(t); H.remove(); console.log("[exo-bottom] no fill -> removed"); }
      },100);
    });
  }
  IBG_ADS.waitForEnv(["EXOCLICK_BOTTOM_ZONE"], ok=>{
    if(!ok){ console.log("[exo-bottom] __ENV KO"); return; }
    (document.readyState==="complete")?mount():addEventListener("load", mount, {once:true});
  });
})();
