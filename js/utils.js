(function(){
  console.log("🧩 utils.js cargado");
  var W=window;

  // ---- SHIM: autodetecta el array de imágenes públicas aunque el módulo no lo exporte como window.CONTENT_PUBLIC
  function autodetectPublic(){
    // Si ya existe y es array, úsalo tal cual
    if (Array.isArray(W.CONTENT_PUBLIC) && W.CONTENT_PUBLIC.length) return true;

    var best=null;
    for (var k in W){
      try{
        var v=W[k];
        if (!Array.isArray(v)) continue;
        if (v.length < 20) continue; // debe ser grande
        // ¿Es array de rutas de imagen?
        var imgish = v.every(function(s){ return typeof s==='string' && /\.(jpe?g|png|webp|gif)$/i.test(s); });
        if (!imgish) continue;
        // Puntuación: preferimos elementos que parecen venir de 'full/' o rutas cortas de fichero
        var score = 0;
        for (var i=0;i<Math.min(v.length,120);i++){
          var s=v[i];
          if (/^full\//i.test(s)) score+=3;
          if (s.indexOf('/')===-1) score+=2;
          if (/decorative-images/i.test(s)) score-=2;
        }
        if (!best || score > best.score) best = {k:k,score:score,arr:v};
      }catch(e){}
    }
    if (best && best.arr){
      W.CONTENT_PUBLIC = best.arr;
      console.log("🔎 CONTENT_PUBLIC autodetectado desde window."+best.k+" ("+best.arr.length+" items)");
      return true;
    }
    console.warn("⚠️ No se pudo autodetectar CONTENT_PUBLIC");
    W.CONTENT_PUBLIC = W.CONTENT_PUBLIC || [];
    return false;
  }

  // utilidades varias
  function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
  function sample(arr,n){arr=arr.slice();shuffle(arr);return arr.slice(0,Math.min(n,arr.length))}
  function norm(src,base){if(!src) return ""; if(src.includes("/")) return src; return base.replace(/\/?$/,"/")+src}
  function $ (s,root){return (root||document).querySelector(s)}
  function $$ (s,root){return Array.from((root||document).querySelectorAll(s))}

  // Inicializa CONTENT_PUBLIC de forma segura
  if (!autodetectPublic()){
    // si aún no lo encontró, deja inicializado para que no rompa
    W.CONTENT_PUBLIC = Array.isArray(W.CONTENT_PUBLIC)?W.CONTENT_PUBLIC:[];
  }

  W.IBG_UTIL={shuffle:shuffle,sample:sample,norm:norm,$:$,$$:$$,autodetectPublic:autodetectPublic};
})();
