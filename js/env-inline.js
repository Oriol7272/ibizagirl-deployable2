(function(W){
  W.IBG_ADS = W.IBG_ADS || {
    zones: { left:"5696328", right:"5705186", bottom:"5717078" },
    initAds: function(){ try{ console.log("[IBG_ADS] initAds ok"); }catch(e){} },
    init: function(){ return this.initAds(); }
  };
  console.log("IBG_ADS ZONES ->", W.IBG_ADS.zones);
})(window);
