export const config = { runtime: 'nodejs18.x' };

// Vercel API (Node) – proxy de JS para EroAdvertising
export default async function handler(req, res) {
  try {
    // construir URL con host para poder leer query en Node
    const base = `https://${req.headers.host || 'ibizagirl.pics'}`;
    const url = new URL(req.url, base);
    const zone = url.searchParams.get('zone');
    if (!zone) {
      res.statusCode = 400;
      res.setHeader('content-type', 'text/plain; charset=utf-8');
      res.end('missing zone');
      return;
    }

    const upstream = `https://syndication.ero-advertising.com/splash.php?idzone=${encodeURIComponent(zone)}`;

    const r = await fetch(upstream, {
      // algunos upstreams exigen UA/Referer
      headers: {
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://ibizagirl.pics/',
        'Origin':  'https://ibizagirl.pics'
      }
    });

    const body = await r.text();

    // devolvemos SIEMPRE 200 con el JS del upstream para que el <script> cargue
    res.statusCode = 200;
    res.setHeader('content-type', 'application/javascript; charset=utf-8');
    res.setHeader('cache-control', 'public, max-age=300');
    res.end(body);
  } catch (e) {
    res.statusCode = 502;
    res.setHeader('content-type', 'text/plain; charset=utf-8');
    res.end(`proxy error: ${e?.message || 'unknown'}`);
  }
}
