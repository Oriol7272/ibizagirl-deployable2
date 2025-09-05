export const config = { runtime: 'nodejs' };

// Vercel Node: req es IncomingMessage y tiene req.url (ruta relativa).
// No uses new URL(req.url) sin base -> Invalid URL.
// Parseamos query a mano para que funcione en todas.
function getQuery(req) {
  if (req.query) return req.query;
  const qs = (req.url && req.url.includes('?')) ? req.url.split('?')[1] : '';
  return Object.fromEntries(new URLSearchParams(qs));
}

export default async function handler(req, res) {
  try {
    const q = getQuery(req);
    const zone = q.zone;
    const debug = 'debug' in q;

    if (!zone) {
      res.statusCode = 400;
      res.setHeader('content-type', 'text/plain; charset=utf-8');
      return res.end('missing zone');
    }

    const upstream = `https://syndication.ero-advertising.com/splash.php?idzone=${encodeURIComponent(zone)}`;

    const r = await fetch(upstream, {
      method: 'GET',
      // Cabeceras mínimas que esperan
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        'referer': 'https://ibizagirl.pics/',
        'accept': 'application/javascript,text/javascript;q=0.9,*/*;q=0.8'
      },
      cache: 'no-store'
    });

    const body = await r.text();

    res.setHeader('content-type', 'application/javascript; charset=utf-8');
    res.setHeader('cache-control', 'public, max-age=300');

    if (!r.ok) {
      res.statusCode = 502;
      return res.end(`// proxy error: upstream ${r.status} ${r.statusText}\n// url: ${upstream}\n${body}`);
    }

    // Todo OK -> devolver JS tal cual
    res.statusCode = 200;
    return res.end(body);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('content-type', 'application/javascript; charset=utf-8');
    return res.end(`// proxy error: ${err && err.message ? err.message : String(err)}`);
  }
}
