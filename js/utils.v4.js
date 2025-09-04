(function(){
  console.log("🧩 utils.js (deep-scan v4) cargado");
  var W=window;

  function isImgStr(s){ return typeof s==='string' && /\.(jpe?g|png|webp|gif)$/i.test(s); }

  // extrae un src plausible de un objeto {src|path|url|file|filename|image}
  function pickObjSrc(o){
    if (!o || typeof o!=='object') return null;
    var keys=['src','path','url','file','filename','image'];
    for (var i=0;i<keys.length;i++){
      var v=o[keys[i]];
      if (typeof v==='string' && isImgStr(v)) return v;
    }
    return null;
  }

  function autodetectPublicDeep(){
    if (Array.isArray(W.CONTENT_PUBLIC) && W.CONTENT_PUBLIC.length) return true;

    var seen=new Set(), best=null; const MAX=8000;
    function scoreArray(arr){
      if (!Array.isArray(arr) || arr.length<10) return -1;
      var L=Math.min(arr.length,200), hit=0, objHit=0, fullHint=0;
      for (var i=0;i<L;i++){
        var it=arr[i];
        if (isImgStr(it)) { hit++; if(/^full\//i.test(it)) fullHint++; }
        else { var s=pickObjSrc(it); if (isImgStr(s)) { objHit++; if(/^full\//i.test(s)) fullHint++; } }
      }
      var ratio=(hit+objHit)/L;
      if (ratio < 0.5) return -1;
      return (hit+objHit) + fullHint*3 + arr.length*0.02;
    }

    function walk(o, path, d){
      if (!o || d>5 || seen.has(o)) return; seen.add(o); if (seen.size>MAX) return;

      if (Array.isArray(o)){
        var sc=scoreArray(o);
        if (sc > (best?best.sc:-1)) best={sc:sc, arr:o, path:path};
        return;
      }

      var t=Object.prototype.toString.call(o);
      if (typeof o==='function' || /Window|Document|Element|HTML/.test(t)) return;
      var ks; try{ ks=Object.keys(o);}catch(e){return;}
      for (var i=0;i<ks.length;i++){
        var k=ks[i], v; try{ v=o[k]; }catch(e){ continue; }
        if (Array.isArray(v)){
          var sc=scoreArray(v);
          if (sc > (best?best.sc:-1)) best={sc:sc, arr:v, path:path+"."+k};
        } else if (v && typeof v==='object'){
          walk(v, path+"."+k, d+1);
        }
      }
    }

    try{ walk(W, "window", 0); }catch(e){}
    if (best && best.arr){
      // normaliza a array de strings
      var out=[];
      for (var i=0;i<best.arr.length;i++){
        var it=best.arr[i];
        if (isImgStr(it)) out.push(it);
        else {
          var s=pickObjSrc(it);
          if (isImgStr(s)) out.push(s);
        }
      }
      if (out.length){
        W.CONTENT_PUBLIC = out;
        console.log("🔎 CONTENT_PUBLIC autodetectado en", best.path, "("+out.length+" items)");
        return true;
      }
    }
    console.warn("⚠️ No se pudo autodetectar CONTENT_PUBLIC");
    W.CONTENT_PUBLIC = W.CONTENT_PUBLIC || [];
    return false;
  }

  function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
  function sample(arr,n){arr=arr.slice();shuffle(arr);return arr.slice(0,Math.min(n,arr.length))}
  function norm(src,base){ if(!src) return ""; if(src.includes("/")) return src; return base.replace(/\/?$/,"/")+src }
  function $ (s,r){return (r||document).querySelector(s)}
  function $$ (s,r){return Array.from((r||document).querySelectorAll(s))}

  if (!Array.isArray(W.CONTENT_PUBLIC) || !W.CONTENT_PUBLIC.length){ autodetectPublicDeep(); }
  W.IBG_UTIL={shuffle:shuffle,sample:sample,norm:norm,$:$,$$:$$,autodetectPublicDeep:autodetectPublicDeep};
})();
