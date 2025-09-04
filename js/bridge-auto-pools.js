(function(W){
  function isStr(x){return typeof x==='string'}
  function looksImg(x){return /\.(webp|jpg|jpeg|png)$/i.test(x)}
  function looksVid(x){return /\.(mp4|webm|mov)$/i.test(x)}
  function norm(list, subdir){
    return (list||[]).map(function(s){
      if(!isStr(s)) return null;
      // Si ya viene con ruta absoluta o http, respétala
      if(/^https?:\/\//i.test(s) || s.startsWith('/')) return s;
      return '/'+subdir.replace(/^\/+/,'').replace(/\/+$/,'')+'/'+s;
    }).filter(Boolean);
  }
  function firstArray(names){
    for(var i=0;i<names.length;i++){
      var v = W[names[i]];
      if(Array.isArray(v) && v.length) return v;
    }
    return null;
  }
  function callFirst(obj, fns){
    if(!obj) return null;
    for(var i=0;i<fns.length;i++){
      var k=fns[i]; var fn=obj[k];
      try{
        if(typeof fn==='function'){
          var r=fn.call(obj);
          if(Array.isArray(r) && r.length) return r;
        }
      }catch(e){}
    }
    return null;
  }
  function scanHeuristic(predicate){
    // Último recurso: buscar arrays grandes de strings en window
    try{
      for(var k in W){
        if(!Object.prototype.hasOwnProperty.call(W,k)) continue;
        var v=W[k];
        if(Array.isArray(v) && v.length>10 && v.every(isStr)){
          if(predicate(v,k)) return v;
        }
      }
    }catch(e){}
    return null;
  }

  // 1) Intentos directos con nombres típicos
  var pub = firstArray(['PUBLIC_IMAGES_POOL','CONTENT_PUBLIC','FULL_POOL','IMAGES_PUBLIC','PUBLIC_LIST']);
  var pre1= firstArray(['PREMIUM_IMAGES_POOL_1','PREMIUM_PART1','UNCENSORED_1','PREMIUM1']);
  var pre2= firstArray(['PREMIUM_IMAGES_POOL_2','PREMIUM_PART2','UNCENSORED_2','PREMIUM2']);
  var pre = firstArray(['PREMIUM_IMAGES_POOL','UNCENSORED_POOL','CONTENT_UNCENSORED']) || (pre1||[]).concat(pre2||[]);
  var vids= firstArray(['VIDEOS_POOL','UNCENSORED_VIDEOS','CONTENT_VIDEOS','PREMIUM_VIDEOS']);

  // 2) UnifiedContentAPI si existe (probable en tu content-data6.js)
  var U = W.UnifiedContentAPI || W.IBG_UNIFIED || W.IBG_API;
  if(!pub){
    pub = callFirst(U, ['public','getPublic','listPublic','publicAll']);
  }
  if(!pre){
    pre = callFirst(U, ['premium','getPremium','listPremium','premiumAll','uncensored','getUncensored','listUncensored','uncensoredAll']);
  }
  if(!vids){
    vids = callFirst(U, ['videos','getVideos','listVideos','videosAll','uncensoredVideos','getUncensoredVideos']);
  }

  // 3) Heurística: buscar arrays por extensión
  if(!pub){
    pub = scanHeuristic(function(arr){ return arr.some(looksImg) && arr.every(function(s){ return looksImg(s) || !/\.(mp4|webm|mov)$/i.test(s)}); });
  }
  if(!vids){
    vids = scanHeuristic(function(arr){ return arr.some(looksVid); });
  }
  // premium: cualquier array de imágenes distinto al público y relativamente grande
  if(!pre){
    pre = scanHeuristic(function(arr){ return arr.length> (pub?pub.length:0) && arr.some(looksImg) && !arr.some(looksVid); });
  }

  // 4) Normalizar a rutas reales del repo
  var pools = {
    full:       norm(pub || [],  'full'),
    uncensored: norm(pre || [],  'uncensored'),
    videos:     norm(vids|| [],  'uncensored-videos')
  };

  // Publicar como IBG_POOLS para la UI
  W.IBG_POOLS = pools;

  // Log útil
  try{
    console.log('🔎 IBG_BRIDGE pools:',
      { full:pools.full.length, uncensored:pools.uncensored.length, videos:pools.videos.length });
  }catch(e){}
})(window);
