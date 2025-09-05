export const config = { runtime: 'edge' };
const UKEY='e494ffb82839a29122608e933394c091';
const send=(c,b)=>new Response(b,{status:c,headers:{
  'content-type':'application/javascript; charset=utf-8','cache-control':'public, max-age=120'}});
export default async function handler(req){
  const url=new URL(req.url);
  const site=url.searchParams.get('site');
  if(!site) return send(400,'/* missing site */');
  const js=`(function(){try{
    var W=window,U='${UKEY}',cfg=[["siteId",${Number(site)}],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]];
    if(!W[U]){try{Object.freeze(W[U]=cfg)}catch(e){W[U]=cfg}}
    var s=document.createElement('script'); s.src='/api/ads/popjs'; s.async=true; s.crossOrigin='anonymous';
    (document.currentScript||document.scripts[document.scripts.length-1]).parentNode.insertBefore(s,document.currentScript);
  }catch(e){}})();`;
  return send(200, js);
}
