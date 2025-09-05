export const config = { runtime: 'edge' };
const send=(c,b)=>new Response(b,{status:c,headers:{
  'content-type':'application/javascript; charset=utf-8','cache-control':'public, max-age=300'}});
export default async function handler(){
  const up='https://a.magsrv.com/ad-provider.js';
  try{
    const r=await fetch(up,{headers:{'user-agent':'Mozilla/5.0'}});
    if(r.ok) return send(200, await r.text());
  }catch(e){}
  return send(200, `(function(){var s=document.createElement('script');s.src=${JSON.stringify('https://a.magsrv.com/ad-provider.js')};s.async=true;document.head.appendChild(s);})();`);
}
