console.log("[bootstrap] shim run");
(function(W){
  function onReady(){
    // banner suave
    var b = document.getElementById("banner");
    if(b && !b.dataset.enhanced){
      b.dataset.enhanced = "1";
      if(!b.querySelector(".title")) {
        var t=document.createElement("div"); t.className="title"; t.textContent="Ibiza Girl";
        var s=document.createElement("div"); s.className="subtitle"; s.textContent="Sexy beach vibes · Free gallery";
        b.appendChild(t); b.appendChild(s);
      }
    }
    // anuncios
    try { (W.IBG_ADS.initAds||function(){})(); } catch(e){ console.error(e); }
  }
  if(document.readyState!=="loading") onReady(); else document.addEventListener("DOMContentLoaded", onReady);
})(window);
