/* Bridge v2: intenta obtener la lista de imágenes de /full/ desde content-data2.js o desde window */
const isFullArr = v => Array.isArray(v) && v.length && typeof v[0]==='string' && v[0].includes('/full/');
const scan = (o, depth=0) => {
  if(!o || typeof o!=='object' || depth>4) return null;
  for(const k of Object.keys(o)){
    const v=o[k];
    if(isFullArr(v)) return v;
    if(v && typeof v==='object'){ const r=scan(v, depth+1); if(r) return r; }
  }
  return null;
};

let images = null;
// 1) Intentar cargar como módulo (por si exporta algo)
try{
  const mod = await import('../content-data2.js');
  images = scan(mod);
}catch{ /* no es módulo ESM: ignora */ }

// 2) Examinar globals (content-data2.js side-effect suele poblar globals)
if(!images){
  if(typeof window!=='undefined'){
    // candidatos directos
    for(const k of ['CONTENT_PUBLIC','PUBLIC_CONTENT','PUBLIC_IMAGES','FULL_IMAGES']){
      if(k in window){
        const v = window[k];
        if(isFullArr(v)) { images=v; break; }
        const r = scan(v); if(r){ images=r; break; }
      }
    }
    // buscar en todo window si aún no
    if(!images) images = scan(window);
  }
}

if(images && typeof window!=='undefined'){
  window.CONTENT_PUBLIC_IMAGES = images;
  // Mantener compat: si CONTENT_PUBLIC no es array, establece también la lista plana.
  if(!('CONTENT_PUBLIC' in window) || !isFullArr(window.CONTENT_PUBLIC)){
    window.CONTENT_PUBLIC = images;
  }
  console.log('🔗 bridge.content-public: expuesto', images.length, 'imágenes /full/');
}else{
  console.warn('bridge.content-public: no se pudo derivar lista de /full/');
}
