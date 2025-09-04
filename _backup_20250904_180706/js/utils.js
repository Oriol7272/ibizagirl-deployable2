(function(){
  console.log("🧩 utils.js (deep-scan) cargado");
  var W=window;

  function isImg(s){ return typeof s==='string' && /\.(jpe?g|png|webp|gif)$/i.test(s); }

  // ---- ESCANEO PROFUNDO: encuentra un array de imágenes aunque esté anidado en objetos
  function autodetectPublicDeep(){
    if (Array.isArray(W.CONTENT_PUBLIC) && W.CONTENT_PUBLIC.length){ return true; }

    var seen=new Set(), best=null, maxNodes=5000;
    function score(arr){
      if (!Array.isArray(arr) || arr.length<20) return -1;
      var imgCount=0, fullHint=0, noSlash=0;
      var L=Math.min(arr.length, 150);
      for (var i=0;i<L;i++){
        var s=arr[i]; if (isImg(s)) imgCount++;
        if (typeof s==='string' && /^full\//i.test(s)) fullHint++;
        if (typeof s==='string' && s.indexOf('/')===-1) noSlash++;
      }
      var ratio = imgCount/L;
      if (ratio < 0.7) return -1;
      // preferimos que tenga prefijo 'full/' o nombres sin slash
      return imgCount + fullHint*3 + noSlash*1 + arr.length*0.02;
    }
    function walk(obj, path, depth){
      if (!obj || depth>4) return;
      if (seen.has(obj)) return; seen.add(obj);
      if (seen.size>maxNodes) return;

      // candidato directo si es array
      if (Array.isArray(obj)){
        var sc=score(obj);
        if (sc> (best?best.sc:-1)){
          best={sc:sc, arr:obj, path:path};
        }
        return;
      }

      // evita nodos DOM/ventanas/funciones
      var t=Object.prototype.toString.call(obj);
      if (typeof obj==='function' || /Window|Document|Element|HTML/.test(t)) return;

      var keys; try{ keys=Object.keys(obj);}catch(e){return;}
      for (var i=0;i<keys.length;i++){
        var k=keys[i];
        var v; try{ v=obj[k]; }catch(e){ continue; }
        var np = path+"."+k;
        if (Array.isArray(v)){
          var sc=score(v);
          if (sc> (best?best.sc:-1)){
            best={sc:sc, arr:v, path:np};
          }
        }else if (v && typeof v==='object'){
          walk(v, np, depth+1);
        }
      }
    }

    try{ walk(W, "window", 0); }catch(e){}
    if (best && best.arr){
      W.CONTENT_PUBLIC = best.arr;
      console.log("🔎 CONTENT_PUBLIC autodetectado en", best.path, "("+best.arr.length+" items)");
      return true;
    }
    console.warn("⚠️ No se pudo autodetectar CONTENT_PUBLIC");
    W.CONTENT_PUBLIC = W.CONTENT_PUBLIC || [];
    return false;
  }

  function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
  function sample(arr,n){arr=arr.slice();shuffle(arr);return arr.slice(0,Math.min(n,arr.length))}
  function norm(src,base){if(!src) return ""; if(src.includes("/")) return src; return base.replace(/\/?$/,"/")+src}
  function $ (s,root){return (root||document).querySelector(s)}
  function $$ (s,root){return Array.from((root||document).querySelectorAll(s))}
  if (!Array.isArray(W.CONTENT_PUBLIC) || !W.CONTENT_PUBLIC.length){ autodetectPublicDeep(); }
  W.IBG_UTIL={shuffle:shuffle,sample:sample,norm:norm,$:$,$$:$$,autodetectPublicDeep:autodetectPublicDeep};
})();
