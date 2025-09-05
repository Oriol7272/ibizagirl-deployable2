export const config = { runtime: 'edge' };
export default async function handler(req) {
  try{
    const { searchParams } = new URL(req.url);
    const zone = searchParams.get('zone');
    if(!zone) return new Response('missing zone', {status:400});
    const upstream = `https://syndication.ero-advertising.com/splash.php?idzone=${encodeURIComponent(zone)}`;
    const r = await fetch(upstream, { headers: { 'user-agent': 'Mozilla/5.0' } });
    const js = await r.text();
    return new Response(js, {
      headers: {
        'content-type':'application/javascript; charset=utf-8',
        'cache-control':'public, max-age=300'
      }
    });
  }catch(e){
    return new Response('// proxy error: '+(e && e.message || 'unknown'), {
      headers:{'content-type':'application/javascript'},
      status:200
    });
  }
}
