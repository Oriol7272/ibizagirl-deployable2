(function(){
  const W = window;
  const DOM_READY = new Promise(r=>{
    if (document.readyState === "complete" || document.readyState === "interactive") r();
    else document.addEventListener("DOMContentLoaded", r, {once:true});
  });

  const waitForBottom = (timeoutMs=3000, step=50)=>new Promise((resolve,reject)=>{
    const t0 = Date.now();
    (function loop(){
      const Z = W.IBG_ADS && W.IBG_ADS.ZONES;
      if (Z && Z.EXOCLICK_BOTTOM_ZONE) return resolve(Z.EXOCLICK_BOTTOM_ZONE);
      if (Date.now()-t0 > timeoutMs) return reject(new Error("missing EXOCLICK_BOTTOM_ZONE"));
      setTimeout(loop, step);
    })();
  });

  async function init(){
    await DOM_READY;
    let zid; try { zid = await waitForBottom(); } catch(e){ console.warn("[exo-bottom]", e.message); return; }
    const elId = "ad-bottom";
    const el = document.getElementById(elId);
    if (!el){ console.warn("[exo-bottom] missing #"+elId); return; }
    if (el.dataset.mounted === "1") return;
    el.dataset.mounted = "1";
    console.log("IBG_ADS: EXO bottom mounted ->", zid);
    try{
      if (W.IBG_AD_PROVIDER && typeof W.IBG_AD_PROVIDER.push === "function"){
        W.IBG_AD_PROVIDER.push({ id: zid, el: elId, type: "STICKY BANNER" });
      }
    }catch(e){
      console.warn("[exo-bottom] mount error", e);
      el.dataset.mounted = "0";
    }
  }
  init();
})();
