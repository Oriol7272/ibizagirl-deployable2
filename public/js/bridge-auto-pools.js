(function(W){
  function isStr(x){return typeof x==='string'}
  function looksImg(x){return /\.(webp|jpe?g|png)$/i.test(x)}
  function looksVid(x){return /\.(mp4|webm|mov)$/i.test(x)}
  function toObjects(list, subdir){
    var base = '/'+String(subdir||'').replace(/^\/+/,'').replace(/\/+$/,'')+'/';
    return (list||[]).map(function(s){
      if(!isStr(s)) return null;
      var src = (/^https?:\/\//i.test(s) || s.startsWith('/')) ? s : (base + s);
      return {src: src, title: (s.split('/').pop()||'')};
    }).filter(Boolean);
  }
  function firstArray(names){ for(var i=0;i<names.length;i++){ var v=W[names[i]]; if(Array.isArray(v)&&v.length) return v; } return null; }
  function callFirst(obj, fns){
    if(!obj) return null;
    for (var i=0;i<fns.length;i++){ var k=fns[i],fn=obj[k]; try{
      if (typeof fn==='function'){ var r=fn.call(obj); if(Array.isArray(r)&&r.length) return r; }
    }catch(_){}} return null;
  }
  function scanHeuristic(predicate){
    try{ for (var k in W){ if(!Object.prototype.hasOwnProperty.call(W,k)) continue;
      var v=W[k]; if(Array.isArray(v)&&v.length>10&&v.every(isStr)){ if(predicate(v,k)) return v; }
    }}catch(_){}
    return null;
  }

  // --- 0) Si existe un mapa generado en build, úsalo (autoridad total) ---
  var FS = W.IBG_FS_MAP || null; // {full:[], uncensored:[], videos:[]}
  if (FS && (FS.full||FS.uncensored||FS.videos)){
    W.IBG_POOLS = {
      full:       toObjects(FS.full||[],       'full'),
      uncensored: toObjects(FS.uncensored||[], 'uncensored'),
      videos:     toObjects(FS.videos||[],     'uncensored-videos')
    };
    try{ console.log('🔎 IBG_BRIDGE(FS) ->',{full:W.IBG_POOLS.full.length,uncensored:W.IBG_POOLS.uncensored.length,videos:W.IBG_POOLS.videos.length}); }catch(_){}
    return;
  }

  // --- 1) Detectar desde tus content-data* / API unificada ---
  var pub = firstArray(['PUBLIC_IMAGES_POOL','CONTENT_PUBLIC','FULL_POOL','IMAGES_PUBLIC','PUBLIC_LIST']);
  var pre1= firstArray(['PREMIUM_IMAGES_POOL_1','PREMIUM_PART1','UNCENSORED_1','PREMIUM1']);
  var pre2= firstArray(['PREMIUM_IMAGES_POOL_2','PREMIUM_PART2','UNCENSORED_2','PREMIUM2']);
  var pre = firstArray(['PREMIUM_IMAGES_POOL','UNCENSORED_POOL','CONTENT_UNCENSORED']) || (pre1||[]).concat(pre2||[]);
  var vids= firstArray(['VIDEOS_POOL','UNCENSORED_VIDEOS','CONTENT_VIDEOS','PREMIUM_VIDEOS']);

  var U = W.UnifiedContentAPI || W.IBG_UNIFIED || W.IBG_API;
  if(!pub)  pub  = callFirst(U, ['public','getPublic','listPublic','publicAll']);
  if(!pre)  pre  = callFirst(U, ['premium','getPremium','listPremium','premiumAll','uncensored','getUncensored','listUncensored','uncensoredAll']);
  if(!vids) vids = callFirst(U, ['videos','getVideos','listVideos','videosAll','uncensoredVideos','getUncensoredVideos']);

  if(!pub)  pub  = scanHeuristic(function(arr){ return arr.some(looksImg) && !arr.some(looksVid); });
  if(!vids) vids = scanHeuristic(function(arr){ return arr.some(looksVid); });
  if(!pre)  pre  = scanHeuristic(function(arr){ return arr.length>(pub?pub.length:0) && arr.some(looksImg) && !arr.some(looksVid); });

  W.IBG_POOLS = {
    full:       toObjects(pub  || [], 'full'),
    uncensored: toObjects(pre  || [], 'uncensored'),
    videos:     toObjects(vids || [], 'uncensored-videos')
  };
  try{ console.log('🔎 IBG_BRIDGE(auto) ->',{full:W.IBG_POOLS.full.length,uncensored:W.IBG_POOLS.uncensored.length,videos:W.IBG_POOLS.videos.length}); }catch(_){}
})(window);
