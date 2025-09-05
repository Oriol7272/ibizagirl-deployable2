export const config = { runtime: 'edge' };
const send=(c,b)=>new Response(b,{status:c,headers:{'content-type':'application/javascript; charset=utf-8','cache-control':'public, max-age=300'}});
export default async function handler(req){
  const p=new URL(req.url).searchParams; const zone=p.get('zone'); if(!zone) return send(400,'/* missing zone */');
  const up=`https://syndication.exdynsrv.com/splash.php?idzone=${encodeURIComponent(zone)}`;
  try{
    const r=await fetch(up,{headers:{'user-agent':'Mozilla/5.0'}});
    if(r.ok){ return send(200, await r.text()); }
    const fb=`/* exo fallback ${r.status} */(function(){try{var s=document.createElement('script');s.src=${JSON.stringify(up)};s.async=true;(document.currentScript||document.scripts[document.scripts.length-1]).parentNode.insertBefore(s,document.currentScript);}catch(e){}})();`;
    return send(200,fb);
  }catch(e){
    const fb=`/* exo error */(function(){try{var s=document.createElement('script');s.src=${JSON.stringify(up)};s.async=true;(document.currentScript||document.scripts[document.scripts.length-1]).parentNode.insertBefore(s,document.currentScript);}catch(e){}})();`;
    return send(200,fb);
  }
}
