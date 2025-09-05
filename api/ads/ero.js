export const config = { runtime: 'edge' };

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const zone = searchParams.get('zone');
    if (!zone) {
      return new Response('// proxy error: missing ?zone', {
        status: 400,
        headers: { 'content-type': 'application/javascript; charset=utf-8' }
      });
    }
    // ✅ dominio correcto SIN guion
    const upstream = `https://syndication.eroadvertising.com/splash.php?idzone=${encodeURIComponent(zone)}`;

    const r = await fetch(upstream, { headers: { 'user-agent': 'Mozilla/5.0' } });
    if (!r.ok) {
      const body = await r.text().catch(() => '');
      return new Response(`// proxy error: ${r.status} ${r.statusText}\n${body.slice(0,512)}`, {
        status: 502,
        headers: { 'content-type': 'application/javascript; charset=utf-8' }
      });
    }

    const js = await r.text();
    return new Response(js, {
      headers: {
        'content-type': 'application/javascript; charset=utf-8',
        'cache-control': 'public, max-age=120'
      }
    });
  } catch (e) {
    return new Response(`// proxy error: ${e?.message || e}`, {
      status: 500,
      headers: { 'content-type': 'application/javascript; charset=utf-8' }
    });
  }
}
