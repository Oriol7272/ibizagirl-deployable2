import { getDailySeed, sampleSeeded } from './utils.js';
function pool(){
  const U = window.UnifiedContentAPI || {};
  let full = [];
  try{ full = (U.getPublicImages && U.getPublicImages()) || []; }catch(_){}
  if(!full || !full.length){
    try{ full = (window.ContentData2 && window.ContentData2.publicImages) || []; }catch(_){}
  }
  const prem = (U.getPremiumImages && U.getPremiumImages()) || []
    .concat(window.ContentData3?.premiumImages||[], window.ContentData4?.premiumImages||[]);
  const vids = (U.getPremiumVideos && U.getPremiumVideos()) || (window.ContentData5?.premiumVideos||[]);
  return {full,prem,vids};
}
function fallbackDecor(n){
  const pool=[
    '/decorative-images/paradise-beach.png',
    '/decorative-images/49830c0a-2fd8-439c-a583-029a0b39c4d6.jpg',
    '/decorative-images/4bfb7a8b-b81e-49d7-a160-90b834d0b751.jpg',
    '/decorative-images/81f55f4d-b0df-49f4-9020-cbb0f5042c08.jpg',
    '/decorative-images/1618cbb2-8dd1-4127-99d9-d9f30536de72.jpg',
    '/decorative-images/115ae97d-909f-4760-a3a1-037a05ad9931.jpg',
    '/decorative-images/f062cb22-c99b-4dfa-9a79-572e98c6e75e.jpg'
  ];
  return Array.from({length:n},(_,i)=>({file: pool[i % pool.length]}));
}
export function getDaily(){
  const s=getDailySeed(); const {full,prem,vids}=pool();
  let home20 = sampleSeeded(full && full.length?full:fallbackDecor(20), 20, s);
  const prem100 = sampleSeeded(prem,100,s^0x9e3779b1);
  const vids20 = sampleSeeded(vids,20,s^0x1337c0de);
  const markNewCount = Math.floor((prem100?.length||0)*0.30);
  const newSet = new Set((prem100||[]).slice(0,markNewCount).map((x,i)=>x.id||x.file||i));
  console.info('[IBG] pools -> full:', (full&&full.length)||0, 'prem:', (prem&&prem.length)||0, 'vids:', (vids&&vids.length)||0);
  return {home20,prem100,vids20,newSet};
}
