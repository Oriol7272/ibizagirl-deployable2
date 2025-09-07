(function(){
  var W=window;
  W.IBG_ADS = W.IBG_ADS || {};
  var current = W.IBG_ADS;
  // Merge seguro
  function merge(dst, src){
    if(!src) return dst;
    Object.keys(src).forEach(function(k){
      if(src[k] && typeof src[k]==='object' && !Array.isArray(src[k])){
        dst[k] = merge(dst[k]||{}, src[k]);
      }else{
        dst[k] = src[k];
      }
    });
    return dst;
  }
  // Si Vercel inyecta algo vía otro script, tomarlo sin pisar lo existente
  var fromVercel = W.__IBG_ADS_FROM_ENV__ || {}; // opcional
  W.IBG_ADS = merge(current, fromVercel);
  // Compat: exponer ZONES a nivel raíz para los scripts antiguos
  try{
    var zones = (W.IBG_ADS.exoclick && W.IBG_ADS.exoclick.zones) ? W.IBG_ADS.exoclick.zones : (W.IBG_ADS.ZONES || []);
    W.IBG_ADS.ZONES = zones;
    console.info("IBG_ADS ZONES ->", zones);
  }catch(_){}
})();
