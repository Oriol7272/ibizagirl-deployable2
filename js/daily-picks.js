import { getDailySeed, sampleSeeded } from './utils.js';
function pool(){
  const U = window.UnifiedContentAPI || {};
  const full = (U.getPublicImages && U.getPublicImages()) || (window.ContentData2?.publicImages||[]);
  const prem = (U.getPremiumImages && U.getPremiumImages()) || []
    .concat(window.ContentData3?.premiumImages||[], window.ContentData4?.premiumImages||[]);
  const vids = (U.getPremiumVideos && U.getPremiumVideos()) || (window.ContentData5?.premiumVideos||[]);
  return {full,prem,vids};
}
export function getDaily(){
  const s=getDailySeed(); const {full,prem,vids}=pool();
  const home20 = sampleSeeded(full,20,s);
  const prem100 = sampleSeeded(prem,100,s^0x9e3779b1);
  const vids20 = sampleSeeded(vids,20,s^0x1337c0de);
  const markNewCount = Math.floor(prem100.length*0.30);
  const newSet = new Set(prem100.slice(0,markNewCount).map((x,i)=>x.id||x.file||i));
  return {home20,prem100,vids20,newSet};
}
