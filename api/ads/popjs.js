export const config = { runtime: 'edge' };
const UP='https://cdn.popads.net/pop.js';
const send=(c,b,h={})=>new Response(b,{status:c,headers:Object.assign({
  'content-type':'application/javascript; charset=utf-8','cache-control':'public, max-age=300'},h)});
export default async function handler(){
  try{
    const r=await fetch(UP,{headers:{'user-agent':'Mozilla/5.0'}});
    if(r.ok) return send(200, await r.text());
  }catch(e){}
  return send(200, `(function(){var s=document.createElement('script');s.src=${JSON.stringify(UP)};s.async=true;s.crossOrigin='anonymous';document.head.appendChild(s);})();`);
}
