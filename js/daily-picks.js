import { getDailySeed, sampleSeeded } from './utils.js';
function poolFromAPI(){
  // Usa la API unificada si existe (content-data6.js la expone) y, por si acaso, cae a los módulos directos
  const U = window.UnifiedContentAPI || {};
  const full = (U.getPublicImages && U.getPublicImages()) || (window.ContentData2?.publicImages || []);
  const prem1 = (U.getPremiumImages && U.getPremiumImages()) || [].concat(window.ContentData3?.premiumImages||[], window.ContentData4?.premiumImages||[]);
  const vids = (U.getPremiumVideos && U.getPremiumVideos()) || (window.ContentData5?.premiumVideos || []);
  return { full, premiumImages: prem1, premiumVideos: vids };
}
export function getDaily(){
  const seed = getDailySeed();
  const {full, premiumImages, premiumVideos} = poolFromAPI();
  const home20 = sampleSeeded(full, 20, seed);
  const premPool = sampleSeeded(premiumImages, 100, seed ^ 0x9e3779b1);
  const n = Math.floor(premPool.length*0.30);
  const marks = new Set(sampleSeeded(premPool.map((_,i)=>i), n, seed ^ 0xdeadbabe));
  const prem100 = premPool.map((x,i)=>({...x, isNew: marks.has(i)}));
  const vids20 = sampleSeeded(premiumVideos, 20, seed ^ 0x1337c0de);
  return {home20, prem100, vids20};
}
