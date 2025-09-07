console.log("[bootstrap] shim run");
(function(W){
  function onReady(){
    try{ (W.IBG_ADS.initAds||function(){})(); }catch(e){ console.error(e); }
  }
  if(document.readyState!=="loading") onReady(); else document.addEventListener("DOMContentLoaded",onReady);
})(window);
