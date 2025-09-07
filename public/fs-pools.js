console.log("[fs-pools] start");
(function(W){
  function ready(fn){ if(document.readyState!=="loading") fn(); else document.addEventListener("DOMContentLoaded",fn); }
  function signal(){
    var full=(W.__IBG_PUBLIC_POOL||[]).length||0, unc=(W.__IBG_PREMIUM_POOL||[]).length||0, vid=(W.__IBG_VIDEOS_POOL||[]).length||0;
    console.log("✅ IBG_POOLS_READY -> full="+full+" uncensored="+unc+" videos="+vid);
  }
  ready(signal);
})(window);
