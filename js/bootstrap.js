(function(W,D){
  console.log("[bootstrap] stub run");
  // Si existe IBG_ADS con init, lo llamamos para no romper flujo
  if(W.IBG_ADS && (W.IBG_ADS.initAds || W.IBG_ADS.init)){
    (W.IBG_ADS.initAds || W.IBG_ADS.init).call(W.IBG_ADS);
  }
})(window,document);
