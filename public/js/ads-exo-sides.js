(function(){
  const W = window;
  const DOM_READY = new Promise(r=>{
    if (document.readyState === "complete" || document.readyState === "interactive") r();
    else document.addEventListener("DOMContentLoaded", r, {once:true});
  });

  const waitForZones = (timeoutMs=3000, step=50)=>new Promise((resolve,reject)=>{
    const t0 = Date.now();
    (function loop(){
      const Z = W.IBG_ADS && W.IBG_ADS.ZONES;
      if (Z && (Z.EXOCLICK_LEFT_ZONE || Z.EXOCLICK_RIGHT_ZONE)) return resolve(Z);
      if (Date.now()-t0 > timeoutMs) return reject(new Error("ZONES not ready (sides)"));
      setTimeout(loop, step);
    })();
  });

  function mount(zoneId, elId){
    if (!zoneId) { console.warn("[exo-sides] missing zone for", elId); return; }
    const el = document.getElementById(elId);
    if (!el){ console.warn("[exo-sides] missing #"+elId); return; }
    if (el.dataset.mounted === "1") return;
    el.dataset.mounted = "1";
    console.log("IBG_ADS: EXO/AP mounted (pure) ->", zoneId, "on", elId);
    try{
      if (W.IBG_AD_PROVIDER && typeof W.IBG_AD_PROVIDER.push === "function"){
        W.IBG_AD_PROVIDER.push({ id: zoneId, el: elId, type: "STICKY BANNER" });
      }
    }catch(e){
      console.warn("[exo-sides] mount error", e);
      el.dataset.mounted = "0";
    }
  }

  async function init(){
    await DOM_READY;
    let Z; try { Z = await waitForZones(); } catch(e){ console.warn("[exo-sides]", e.message); return; }
    mount(Z.EXOCLICK_LEFT_ZONE,  "ad-left");
    mount(Z.EXOCLICK_RIGHT_ZONE, "ad-right");
  }
  init();
})();
