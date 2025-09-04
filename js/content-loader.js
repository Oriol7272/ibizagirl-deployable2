(function(W){
  var base = (W.__ENV && W.__ENV.IBG_ASSETS_BASE_URL) ? (W.__ENV.IBG_ASSETS_BASE_URL.replace(/\/+$/,"") + "/") : "/";
  var P = W.CONTENT_PUBLIC || [];           // definido por tus content-data*.js
  var U1= W.CONTENT_PREMIUM_1 || [];
  var U2= W.CONTENT_PREMIUM_2 || [];
  var V = W.CONTENT_VIDEOS || [];
  var U = U1.concat(U2);
  function toItems(arr, subdir){
    var out=[]; for(var i=0;i<arr.length;i++){ var t=W.IBG_UTILS.asItem(base+subdir, arr[i]); if(t&&t.src) out.push(t); }
    return out;
  }
  W.IBG_POOLS={
    full:       toItems(P, 'full/'),
    uncensored: toItems(U, 'uncensored/'),
    videos:     toItems(V, 'uncensored-videos/')
  };
})(window);
