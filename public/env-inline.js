/* wrapper no-op: no pisa IBG_ADS existente */
(function(W){
  var IBG = W.IBG_ADS = W.IBG_ADS || {};
  if (typeof IBG.initAds !== "function") {
    IBG.initAds = function(){ console.log("[env-inline] initAds shim"); };
  }
  console.log("IBG_ADS ZONES ->", (W.IBG_ENV||undefined));
})(window);
