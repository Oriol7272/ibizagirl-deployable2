(function(){
  var W=window;
  W.CONTENT_PUBLIC = Array.isArray(W.CONTENT_PUBLIC)?W.CONTENT_PUBLIC:[];
  W.CONTENT_PREMIUM_1 = Array.isArray(W.CONTENT_PREMIUM_1)?W.CONTENT_PREMIUM_1:[];
  W.CONTENT_PREMIUM_2 = Array.isArray(W.CONTENT_PREMIUM_2)?W.CONTENT_PREMIUM_2:[];
  W.CONTENT_VIDEOS = Array.isArray(W.CONTENT_VIDEOS)?W.CONTENT_VIDEOS:[];
  function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
  function sample(arr,n){arr=arr.slice();shuffle(arr);return arr.slice(0,Math.min(n,arr.length))}
  function norm(src,base){if(!src) return ""; if(src.indexOf("/")>=0) return src; return base.replace(/\/?$/,"/")+src}
  W.IBG_UTIL={shuffle:shuffle,sample:sample,norm:norm};
})();
