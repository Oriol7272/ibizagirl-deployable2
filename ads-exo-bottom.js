(function(W){
  if(!W.IBG_ADS || !W.IBG_ADS.mount){ return; }
  console.log("[ads-exo-bottom] active");
  W.addEventListener('DOMContentLoaded', function(){
    W.IBG_ADS.mount((W.IBG_ENV||{}).EXOCLICK_BOTTOM_ZONE || '5717078','ad-bottom');
  });
})(window);
