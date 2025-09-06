(function(){
  function mount(){
    var E=window.__ENV||{}, list=String(E.EXOCLICK_ZONES||"").split(",").map(function(x){return x.trim();}).filter(Boolean);
    if(!list.length){ console.log("[exo-sides] sin EXOCLICK_ZONES"); return; }
    var left=list[0], right=list[1]||list[0];
    var L=document.getElementById("ad-left");  if(!L){L=document.createElement("div");L.id="ad-left";document.body.appendChild(L);}
    var R=document.getElementById("ad-right"); if(!R){R=document.createElement("div");R.id="ad-right";document.body.appendChild(R);}
    [L,R].forEach(function(h){ h.style.overflow="visible"; h.style.zIndex="30"; });

    IBG_ADS.ensureProvider(function(ok){
      if(!ok){ console.log("[exo-sides] provider KO"); return; }
      function go(zone, host, where){
        IBG_ADS.mountExo(zone, host);
        console.log("IBG_ADS: EXO/AP mounted (display) ->", zone, "on", where);
        var n=0,t=setInterval(function(){
          if(host.querySelector("iframe")){ clearInterval(t); }
          else if(++n>=60){ clearInterval(t); host.innerHTML=""; console.log("[exo-sides] no fill ->", where); }
        },100);
      }
      go(left, L, "ad-left");
      go(right,R, "ad-right");
    });
  }
  IBG_ADS.waitForEnv(["EXOCLICK_ZONES"], function(ok){
    if(!ok){ console.log("[exo-sides] __ENV KO"); return; }
    if(document.readyState==="complete") mount(); else addEventListener("load", mount, {once:true});
  });
})();
