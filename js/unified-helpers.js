/**
 * unified-helpers.js
 * Descubre pools mirando window y garantiza URLs con los prefijos exactos:
 *  - Home: /full/
 *  - Premium fotos: /uncensored/
 *  - Premium vídeos: /uncensored-videos/
 * Devuelve SOLO items válidos por prefijo.
 */
(function () {
  const MODE = 'daily'; // 'daily' | 'reload'
  const todayKey = (() => {
    const d = new Date();
    return `${d.getUTCFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()}`;
  })();

  function hash32(str){let h=2166136261>>>0;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
  function rng(seed){let s=seed>>>0; if(!s) s=0x9e3779b9; return ()=>{s^=s<<13; s>>>=0; s^=s>>>17; s>>>=0; s^=s<<5; s>>>=0; return (s>>>0)/4294967296}}
  function makeRngFor(key){return MODE==='daily' ? rng(hash32(key)) : rng((Math.random()*2**32)>>>0)}
  function shuffleStable(arr,key){const R=makeRngFor(key);const a=arr.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[a[i],a[j]]=[a[j],a[i]]} return a}

  const keysPref = ['src','url','path','file','thumb','preview','poster','image'];
  function asURL(x){ if(typeof x==='string') return x; if(x && typeof x==='object'){ for(const k of keysPref){ if(typeof x[k]==='string') return x[k]; } } return '' }

  function urlsFromObj(x){
    const out=[];
    if(typeof x==='string'){ out.push(x); }
    else if(x && typeof x==='object'){
      for(const k of keysPref){ const v=x[k]; if(typeof v==='string') out.push(v); }
    }
    return out;
  }

  function flatten(value, out){
    if(!value) return;
    if(Array.isArray(value)){ for(const v of value) flatten(v,out); return; }
    if(typeof value==='string'){ out.push(value); return; }
    if(typeof value==='object'){
      if(value.constructor===Object){
        const urls=urlsFromObj(value); if(urls.length) out.push(value);
        for(const k in value){ try{ flatten(value[k],out); }catch{} }
      }
    }
  }

  function collectAll(){
    const out=[]; const seen=new WeakSet();
    for(const k of Object.getOwnPropertyNames(window)){
      if(k==='window' || k==='document') continue;
      let v; try{ v=window[k]; }catch{ continue; }
      if(!v) continue;
      if(typeof v==='object'){ if(seen.has(v)) continue; seen.add(v); }
      try{ flatten(v,out); }catch{}
    }
    return out;
  }

  // Rutas objetivo
  const P_FULL = '/full/';
  const P_UNC  = '/uncensored/';
  const P_VID  = '/uncensored-videos/';

  function pickUrlForPrefix(item, prefix){
    // Busca dentro del item UNA URL que contenga el prefijo requerido
    if(typeof item==='string') return item.includes(prefix) ? item : '';
    if(item && typeof item==='object'){
      for(const k of keysPref){
        const v=item[k];
        if(typeof v==='string' && v.includes(prefix)) return v;
      }
    }
    // fallback: si la principal coincide, bien; si no, vacío
    const base = asURL(item);
    return base.includes(prefix) ? base : '';
  }

  function normalizeForPrefix(item, prefix){
    const url = pickUrlForPrefix(item, prefix);
    if(!url) return null;
    const title = (item && item.title) || (item && item.name) || '';
    const poster = (item && (item.poster||item.thumb||item.preview)) || '';
    return { src:url, title, poster };
  }

  function markNew(arr, ratio, key){
    const total = Math.max(0, Math.round(arr.length * ratio));
    const idxs = shuffleStable([...arr.keys()], `flag:${key}`).slice(0,total);
    const set = new Set(idxs);
    return arr.map((it,i)=> ({...it, isNew: set.has(i) || !!it.isNew}));
  }

  // Recolecta TODO y luego filtra por prefijos
  const universe = collectAll();

  function selectByPrefix(prefix, n, key, ratioNew){
    // filtra items que realmente tienen una URL con ese prefijo
    const filtered = [];
    for(const it of universe){
      const norm = normalizeForPrefix(it, prefix);
      if(norm) filtered.push(norm);
    }
    // dedup por src
    const seen=new Set(); const dedup=[];
    for(const it of filtered){ if(!seen.has(it.src)){ seen.add(it.src); dedup.push(it); } }
    const picked = shuffleStable(dedup, key).slice(0, n);
    if(typeof ratioNew==='number') return markNew(picked, ratioNew, key);
    return picked;
  }

  window.U = {
    getFull:      (n=20)           => selectByPrefix(P_FULL, n, 'full'),
    getUncensored:(n=100, r=0.30)  => selectByPrefix(P_UNC,  n, 'unc', r),
    getVideos:    (n=20,  r=0.30)  => selectByPrefix(P_VID,  n, 'vid', r),
  };

  console.log('🔎 unified-helpers pools (after filter by prefix):', {
    full: U.getFull(9999).length,
    uncensored: U.getUncensored(9999).length,
    videos: U.getVideos(9999).length,
    mode: MODE
  });
})();
