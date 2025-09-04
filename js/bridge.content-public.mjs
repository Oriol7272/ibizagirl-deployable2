/**
 * Carga content-data2.js como módulo y expone en window una lista de imágenes públicas.
 * NO inventa nombres: inspecciona lo que exporta el módulo y busca arrays con rutas de "/full/".
 */
const mod = await import('../content-data2.js').catch(()=> ({}));
const isFullImgArray = (v)=> Array.isArray(v) && v.length>0 && typeof v[0]==='string' && v[0].includes('/full/');
const scan = (o, depth=0)=>{
  if(!o || typeof o!=='object' || depth>3) return null;
  for (const k of Object.keys(o)){
    const v = o[k];
    if(isFullImgArray(v)) return v;
    if (v && typeof v==='object'){
      const r = scan(v, depth+1);
      if(r) return r;
    }
  }
  return null;
};

let images = null;
// candidatos directos comunes
for (const k of ['CONTENT_PUBLIC','PUBLIC_CONTENT','PUBLIC_IMAGES','IMAGES_PUBLIC','FULL_IMAGES','default']) {
  if (k in mod) {
    const v = mod[k];
    if (isFullImgArray(v)) { images = v; break; }
    const r = scan(v);
    if (r) { images = r; break; }
  }
}
// último recurso: buscar en todo el namespace
if (!images) images = scan(mod);

if (typeof window !== 'undefined') {
  if (images) {
    window.CONTENT_PUBLIC_IMAGES = images;
    window.CONTENT_PUBLIC = images; // compat sencilla con scripts existentes
    console.log('🔗 bridge.content-public: expuesto CONTENT_PUBLIC con', images.length, 'imágenes');
  } else {
    console.warn('bridge.content-public: no se pudo derivar lista de /full/ desde content-data2.js');
  }
}
