(function(){
  console.log("🧩 utils.js cargado");
  var W=window;
  // Arrays globales que vienen de content-data*.js
  W.CONTENT_PUBLIC = Array.isArray(W.CONTENT_PUBLIC)?W.CONTENT_PUBLIC:[];
  function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
  function sample(arr,n){arr=arr.slice();shuffle(arr);return arr.slice(0,Math.min(n,arr.length))}
  function norm(src,base){if(!src) return ""; if(src.includes("/")) return src; return base.replace(/\/?$/,"/")+src}
  function $ (s,root){return (root||document).querySelector(s)}
  function $$ (s,root){return Array.from((root||document).querySelectorAll(s))}
  W.IBG_UTIL={shuffle:shuffle,sample:sample,norm:norm,$:$,$$:$$};
})();
