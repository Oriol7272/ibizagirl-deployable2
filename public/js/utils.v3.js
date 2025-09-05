(function(){
  console.log("🧩 utils.js (deep-scan v3) cargado");
  var W=window;
  function isImg(s){ return typeof s==='string' && /\.(jpe?g|png|webp|gif)$/i.test(s); }
  function autodetectPublicDeep(){
    if (Array.isArray(W.CONTENT_PUBLIC) && W.CONTENT_PUBLIC.length) return true;
    var seen=new Set(), best=null; const MAX=5000;
    function score(arr){
      if (!Array.isArray(arr) || arr.length<20) return -1;
      var L=Math.min(arr.length,150), img=0, full=0, nos=0;
      for (var i=0;i<L;i++){ var s=arr[i]; if(isImg(s)) img++; if(/^full\//i.test(s)) full++; if(typeof s==='string' && s.indexOf('/')===-1) nos++; }
      var ratio=img/L; if (ratio<0.7) return -1;
      return img + full*3 + nos + arr.length*0.02;
    }
    function walk(o, path, d){
      if(!o||d>4||seen.has(o)) return; seen.add(o); if(seen.size>MAX) return;
      if(Array.isArray(o)){ var sc=score(o); if(sc>(best?best.sc:-1)) best={sc:sc,arr:o,path:path}; return; }
      var t=Object.prototype.toString.call(o); if(typeof o==='function'||/Window|Document|Element|HTML/.test(t)) return;
      var ks; try{ ks=Object.keys(o); }catch(e){ return; }
      for (var i=0;i<ks.length;i++){ var k=ks[i], v; try{ v=o[k]; }catch(e){ continue; }
        if(Array.isArray(v)){ var sc=score(v); if(sc>(best?best.sc:-1)) best={sc:sc,arr:v,path:path+"."+k}; }
        else if(v && typeof v==='object'){ walk(v, path+"."+k, d+1); }
      }
    }
    try{ walk(W, "window", 0); }catch(e){}
    if(best&&best.arr){ W.CONTENT_PUBLIC=best.arr; console.log("🔎 CONTENT_PUBLIC autodetectado en",best.path,"("+best.arr.length+" items)"); return true; }
    console.warn("⚠️ No se pudo autodetectar CONTENT_PUBLIC"); W.CONTENT_PUBLIC=W.CONTENT_PUBLIC||[]; return false;
  }
  function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
  function sample(arr,n){arr=arr.slice();shuffle(arr);return arr.slice(0,Math.min(n,arr.length))}
  function norm(src,base){if(!src) return ""; if(src.includes("/")) return src; return base.replace(/\/?$/,"/")+src}
  function $ (s,r){return (r||document).querySelector(s)}
  function $$ (s,r){return Array.from((r||document).querySelectorAll(s))}
  if (!Array.isArray(W.CONTENT_PUBLIC) || !W.CONTENT_PUBLIC.length){ autodetectPublicDeep(); }
  W.IBG_UTIL={shuffle:shuffle,sample:sample,norm:norm,$:$,$$:$$,autodetectPublicDeep:autodetectPublicDeep};
})();
