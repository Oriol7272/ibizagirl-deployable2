export const config = { runtime: 'edge' };

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const zone = searchParams.get('zone');
    if (!zone) {
      return new Response('// missing ?zone', {
        status: 400,
        headers: { 'content-type': 'application/javascript; charset=utf-8' }
      });
    }
    const upstream = `https://syndication.eroadvertising.com/splash.php?idzone=${encodeURIComponent(zone)}`;

    const r = await fetch(upstream, {
      // algunos proveedores devuelven 4xx si falta UA/Accept
      headers: { 'user-agent': 'Mozilla/5.0', 'accept': '*/*' },
      cache: 'no-store'
    });

    const body = await r.text();

    if (!r.ok) {
      return new Response(`// proxy error ${r.status}\n${body.slice(0,200)}`, {
        status: 502,
        headers: { 'content-type': 'application/javascript; charset=utf-8' }
      });
    }

    return new Response(body, {
      headers: {
        'content-type': 'application/javascript; charset=utf-8',
        'cache-control': 'public, max-age=300'
      }
    });
  } catch (e) {
    return new Response(`// proxy error: ${e && e.message ? e.message : 'internal error'}`, {
      status: 500,
      headers: { 'content-type': 'application/javascript; charset=utf-8' }
    });
  }
}
