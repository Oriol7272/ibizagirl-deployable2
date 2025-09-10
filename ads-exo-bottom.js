/* Usa EXOCLICK_BOTTOM_ZONE (STICKY). Si no hay fill, se elimina host. */
(function(){
  function mount(){
    var E=window.__ENV||{}, zid=String(E.EXOCLICK_BOTTOM_ZONE||"").trim();
    if(!zid){ console.log("[exo-bottom] missing EXOCLICK_BOTTOM_ZONE"); return; }
    var H=document.getElementById("exo-bottom"); if(!H){H=document.createElement("div");H.id="exo-bottom";document.body.appendChild(H);}
    H.innerHTML=""; H.style.cssText="overflow:visible;z-index:50;";
    BG_ADS.ensureProvider(function(ok){
      if(!ok){ console.log("[exo-bottom] provider KO"); return; }
      BG_ADS.mountExo(zid, H);
      console.log("BG_ADS: EXO bottom mounted ->", zid);
      var n=0,t=setInterval(function(){
        if(H.querySelector("iframe")){ clearInterval(t); }
        else if(++n>=60){ clearInterval(t); H.remove(); console.log("[exo-bottom] no fill -> removed"); }
      },100);
    });
  }
  BG_ADS.waitForEnv(["EXOCLICK_BOTTOM_ZONE"], function(ok){
    if(!ok){ console.log("[exo-bottom] __ENV KO"); return; }
    if(document.readyState==="complete") mount(); else addEventListener("load", mount, {once:true});
  });
})();
