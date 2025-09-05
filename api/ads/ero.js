export const config = { runtime: 'edge' };
export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const zone = searchParams.get('zone');
  if(!zone) return new Response('missing zone', {status:400});
  const r = await fetch(`https://syndication.ero-advertising.com/splash.php?idzone=${encodeURIComponent(zone)}`, { headers: { 'user-agent':'Mozilla/5.0' }});
  const txt = await r.text();
  return new Response(txt, {
    headers: {
      'content-type':'application/javascript; charset=utf-8',
      'cache-control':'public, max-age=300'
    }
  });
}
