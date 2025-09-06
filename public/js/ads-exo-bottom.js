(function(){
  let mounted=false, warned=false;
  function ensureBar(){
    let h=document.getElementById("exo-bottom");
    if(!h){
      h=document.createElement("div");
      h.id="exo-bottom";
      document.body.appendChild(h);
    }
    // Oculto hasta que haya iframe (evita barras grises/vacías)
    h.style.cssText="position:fixed;left:50%;transform:translateX(-50%);bottom:10px;z-index:2147483646;width:min(100%,1200px);max-width:98vw;pointer-events:auto;display:none";
    return h;
  }
  function pickZone(E){
    const list=String(E.EXOCLICK_ZONES||"").split(",").map(s=>s.trim()).filter(Boolean);
    const z = String(E.EXOCLICK_BOTTOM_ZONE||"").trim() || list[2] || "";
    if(!z && !warned){ console.log("[exo-bottom] sin zona (define EXOCLICK_BOTTOM_ZONE o pon 3ª en EXOCLICK_ZONES)"); warned=true; }
    if(!E.EXOCLICK_BOTTOM_ZONE && z){ console.log("[exo-bottom] fallback ->", z); }
    return z;
  }
  function mount(){
    if(mounted) return;
    const E=window.__ENV||{}, zid=pickZone(E);
    if(!zid) return;
    const H=ensureBar(); H.innerHTML="";
    IBG_ADS.ensureProvider(ok=>{
      if(!ok){ console.log("[exo-bottom] provider KO"); return; }
      IBG_ADS.mountExo(zid, H);
      let n=0;
      (function probe(){
        const ifr=H.querySelector("iframe");
        if(ifr){ H.style.display="block"; mounted=true; console.log("IBG_ADS: EXO bottom mounted ->", zid); return; }
        if(++n<=14){ IBG_ADS.serve(); setTimeout(probe, 1500); }
        else { console.log("[exo-bottom] no fill, sin más reintentos"); }
      })();
    });
  }
  IBG_ADS.waitForEnv(["EXOCLICK_ZONES"], ()=>{ (document.readyState==="complete")?mount():addEventListener("load", mount,{once:true}); });
})();
